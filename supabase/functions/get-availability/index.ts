import { adminClient, clean, json, options } from '../_shared/http.ts';
import { ensureOrigin, ensureRateLimit } from '../_shared/security.ts';
import { getBusyIntervals } from '../_shared/calendar.ts';

const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => aStart < bEnd && aEnd > bStart;
const dateInTimezone = (date: string, time: string, timezone: string) => {
  const reference = new Date(`${date}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(reference).reduce<Record<string, string>>((result, part) => ({ ...result, [part.type]: part.value }), {});
  const utcGuess = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
  const desired = Date.parse(`${date}T${time}:00Z`);
  return new Date(utcGuess + (desired - utcGuess));
};

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    await ensureRateLimit(request, 'availability', 60, 60);
    const body = await request.json();
    const db = adminClient();
    if (body.action === 'meeting-types') {
      const { data, error } = await db.from('meeting_types').select('*').eq('active', true).order('sort_order');
      if (error) throw error;
      return json({ meetingTypes: data.map(type => ({ id: type.id, slug: type.slug, name: type.name, description: type.description, durationMinutes: type.duration_minutes, minDurationMinutes: type.min_duration_minutes, maxDurationMinutes: type.max_duration_minutes, approvalMode: type.approval_mode, videoMode: type.video_mode })) });
    }
    const date = clean(body.date, 10);
    const meetingTypeId = clean(body.meetingTypeId, 64);
    const duration = Number(body.durationMinutes);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !meetingTypeId || !Number.isInteger(duration)) return json({ error: 'INVALID_PAYLOAD' }, 400);
    const { data: type, error: typeError } = await db.from('meeting_types').select('*').eq('id', meetingTypeId).eq('active', true).single();
    if (typeError || !type || duration < type.min_duration_minutes || duration > type.max_duration_minutes || (type.min_duration_minutes === type.max_duration_minutes && duration !== type.duration_minutes)) return json({ error: 'INVALID_MEETING_TYPE' }, 400);
    const meetingTimezone = 'Asia/Kolkata';
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    const { data: rules, error: ruleError } = await db.from('availability_rules').select('*').eq('weekday', weekday).eq('active', true);
    if (ruleError) throw ruleError;
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);
    const [{ data: bookings }, { data: reservations }, { data: overrides }] = await Promise.all([
      db.from('meeting_bookings').select('buffered_start_utc,buffered_end_utc').in('status', ['PENDING', 'CONFIRMED', 'RESCHEDULED']).lt('buffered_start_utc', dayEnd.toISOString()).gt('buffered_end_utc', dayStart.toISOString()),
      db.from('booking_reservations').select('buffered_start_utc,buffered_end_utc').gt('expires_at', new Date().toISOString()).lt('buffered_start_utc', dayEnd.toISOString()).gt('buffered_end_utc', dayStart.toISOString()),
      db.from('availability_overrides').select('starts_at,ends_at,kind').lt('starts_at', dayEnd.toISOString()).gt('ends_at', dayStart.toISOString()),
    ]);
    const busy = await getBusyIntervals(dayStart.toISOString(), new Date(dayEnd.getTime() + 24 * 60 * 60 * 1000).toISOString());
    const blocked = [...(bookings ?? []).map(item => ({ start: item.buffered_start_utc, end: item.buffered_end_utc })), ...(reservations ?? []).map(item => ({ start: item.buffered_start_utc, end: item.buffered_end_utc })), ...(overrides ?? []).filter(item => item.kind !== 'CUSTOM').map(item => ({ start: item.starts_at, end: item.ends_at })), ...busy];
    const slots: { startTimeUtc: string; endTimeUtc: string; available: boolean }[] = [];
    for (const rule of rules ?? []) {
      const ruleStart = dateInTimezone(date, rule.start_local, meetingTimezone);
      const ruleEnd = dateInTimezone(date, rule.end_local, meetingTimezone);
      for (let start = new Date(ruleStart); start.getTime() + duration * 60_000 <= ruleEnd.getTime(); start = new Date(start.getTime() + rule.slot_interval_minutes * 60_000)) {
        const end = new Date(start.getTime() + duration * 60_000);
        const bufferedStart = new Date(start.getTime() - rule.buffer_before_minutes * 60_000);
        const bufferedEnd = new Date(end.getTime() + rule.buffer_after_minutes * 60_000);
        const available = start > new Date() && !blocked.some(item => overlaps(bufferedStart, bufferedEnd, new Date(item.start), new Date(item.end)));
        slots.push({ startTimeUtc: start.toISOString(), endTimeUtc: end.toISOString(), available });
      }
    }
    return json({ slots, meetingTimezone });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'AVAILABILITY_FAILED' }, 400);
  }
});
