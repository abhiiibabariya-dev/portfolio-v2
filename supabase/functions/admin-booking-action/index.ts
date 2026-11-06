import { adminClient, clean, json, options } from '../_shared/http.ts';
import { ensureOrigin, requireAdmin } from '../_shared/security.ts';
import { cancelCalendarEvent, createOrUpdateCalendarEvent } from '../_shared/calendar.ts';
import { sendBookingConfirmed, sendOwnerBookingNotice } from '../_shared/email.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const action = clean(body.action, 32).toLowerCase();
    const bookingId = clean(body.bookingId, 64);
    if (!bookingId || !['approve', 'reject', 'cancel'].includes(action)) return json({ error: 'INVALID_ACTION' }, 400);
    const db = adminClient();
    const { data: booking, error: bookingError } = await db.from('meeting_bookings').select('*,meeting_types(name,video_mode)').eq('id', bookingId).single();
    if (bookingError || !booking) return json({ error: 'BOOKING_NOT_FOUND' }, 404);
    if (action === 'reject') {
      const { error } = await db.from('meeting_bookings').update({ status: 'REJECTED' }).eq('id', booking.id);
      if (error) throw error;
    } else if (action === 'cancel') {
      await cancelCalendarEvent(booking.google_calendar_event_id);
      const { error } = await db.from('meeting_bookings').update({ status: 'CANCELLED' }).eq('id', booking.id);
      if (error) throw error;
    } else {
      const meeting = { bookingReference: booking.booking_reference, visitorName: booking.visitor_name, visitorEmail: booking.visitor_email, visitorCompany: booking.visitor_company, visitorRole: booking.visitor_role, meetingType: booking.meeting_types?.name ?? 'Professional Meeting', startTimeUtc: booking.start_time_utc, endTimeUtc: booking.end_time_utc, timezone: booking.visitor_timezone, notes: booking.additional_message, googleCalendarEventId: booking.google_calendar_event_id };
      const calendar = await createOrUpdateCalendarEvent(meeting);
      const { error } = await db.from('meeting_bookings').update({ status: 'CONFIRMED', google_calendar_event_id: calendar.eventId, google_meet_link: calendar.meetingLink }).eq('id', booking.id);
      if (error) throw error;
      await sendBookingConfirmed({ ...meeting, meetingLink: calendar.meetingLink });
      await sendOwnerBookingNotice(meeting, 'CONFIRMED');
    }
    await db.from('audit_logs').insert({ actor_id: admin.id, action: `BOOKING_${action.toUpperCase()}`, target_type: 'meeting_bookings', target_id: booking.id, metadata: { previousStatus: booking.status } });
    return json({ ok: true });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'BOOKING_ACTION_FAILED';
    return json({ error: message }, message === 'UNAUTHORIZED' || message === 'FORBIDDEN' ? 403 : 400);
  }
});
