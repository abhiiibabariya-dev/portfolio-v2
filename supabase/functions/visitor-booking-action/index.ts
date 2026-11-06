import { adminClient, clean, json, options, tokenHash } from '../_shared/http.ts';
import { ensureOrigin } from '../_shared/security.ts';
import { cancelCalendarEvent } from '../_shared/calendar.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    const body = await request.json();
    const token = clean(body.token, 256);
    const action = clean(body.action, 16).toLowerCase();
    if (!token || !['cancel'].includes(action)) return json({ error: 'INVALID_REQUEST' }, 400);
    const db = adminClient();
    const hash = await tokenHash(token);
    const { data: booking, error: lookupError } = await db.from('meeting_bookings').select('id,google_calendar_event_id,status').eq('cancel_token_hash', hash).gt('cancel_token_expires_at', new Date().toISOString()).single();
    if (lookupError || !booking) return json({ error: 'BOOKING_NOT_FOUND' }, 404);
    if (!['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(booking.status)) return json({ error: 'BOOKING_NOT_CANCELLABLE' }, 409);
    await cancelCalendarEvent(booking.google_calendar_event_id);
    const { data: updated, error } = await db.from('meeting_bookings').update({ status: 'CANCELLED' }).eq('id', booking.id).in('status', ['PENDING', 'CONFIRMED', 'RESCHEDULED']).select('id').maybeSingle();
    if (error) throw error;
    if (!updated) return json({ error: 'BOOKING_NOT_CANCELLABLE' }, 409);
    return json({ ok: true, status: 'CANCELLED' });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'VISITOR_BOOKING_ACTION_FAILED' }, 400);
  }
});
