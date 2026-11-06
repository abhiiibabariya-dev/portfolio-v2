import { adminClient, clean, json, options, randomToken, tokenHash } from '../_shared/http.ts';
import { ensureOrigin, ensureRateLimit } from '../_shared/security.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    await ensureRateLimit(request, 'reserve-slot', 20, 60);
    const body = await request.json();
    const start = new Date(clean(body.startTimeUtc, 40));
    const end = new Date(clean(body.endTimeUtc, 40));
    const meetingTypeId = clean(body.meetingTypeId, 64);
    const visitorTimezone = clean(body.visitorTimezone, 100);
    if (!meetingTypeId || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start <= new Date() || end <= start) return json({ error: 'INVALID_SLOT' }, 400);
    const db = adminClient();
    const { data: type, error: typeError } = await db.from('meeting_types').select('id,duration_minutes,min_duration_minutes,max_duration_minutes').eq('id', meetingTypeId).eq('active', true).single();
    const requestedDuration = Math.round((end.getTime() - start.getTime()) / 60_000);
    if (typeError || !type || requestedDuration < type.min_duration_minutes || requestedDuration > type.max_duration_minutes || (type.min_duration_minutes === type.max_duration_minutes && requestedDuration !== type.duration_minutes)) return json({ error: 'INVALID_MEETING_TYPE' }, 400);
    const { data: rules, error: rulesError } = await db.from('availability_rules').select('buffer_before_minutes,buffer_after_minutes').eq('active', true).limit(1);
    if (rulesError || !rules?.[0]) throw new Error('Availability rules are not configured.');
    const token = randomToken();
    const expiresAt = new Date(Date.now() + 5 * 60_000);
    const { error } = await db.rpc('reserve_booking_slot', {
      p_token_hash: await tokenHash(token), p_meeting_type_id: type.id, p_starts_at: start.toISOString(), p_ends_at: end.toISOString(), p_buffered_start: new Date(start.getTime() - rules[0].buffer_before_minutes * 60_000).toISOString(), p_buffered_end: new Date(end.getTime() + rules[0].buffer_after_minutes * 60_000).toISOString(), p_visitor_timezone: visitorTimezone, p_expires_at: expiresAt.toISOString(),
    });
    if (error) throw new Error(error.message.includes('SLOT_UNAVAILABLE') ? 'SLOT_UNAVAILABLE' : error.message);
    return json({ reservationToken: token, expiresAt: expiresAt.toISOString() });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'RESERVATION_FAILED' }, 400);
  }
});
