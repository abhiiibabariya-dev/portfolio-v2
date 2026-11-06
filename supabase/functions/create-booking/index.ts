import { adminClient, clean, json, options, randomToken, tokenHash, validEmail } from '../_shared/http.ts';
import { ensureOrigin, ensureRateLimit, rejectBot } from '../_shared/security.ts';
import { sendBookingConfirmed, sendBookingReceived, sendOwnerBookingNotice } from '../_shared/email.ts';
import { createOrUpdateCalendarEvent } from '../_shared/calendar.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    await ensureRateLimit(request, 'create-booking', 5);
    const body = await request.json();
    if (rejectBot(body.website)) return json({ bookingReference: `AB-${crypto.randomUUID().slice(0, 10).toUpperCase()}`, status: 'PENDING' });
    const payload = { reservationToken: clean(body.reservationToken, 128), meetingTypeId: clean(body.meetingTypeId, 64), visitorName: clean(body.visitorName, 120), visitorEmail: clean(body.visitorEmail, 320).toLowerCase(), visitorCompany: clean(body.visitorCompany, 160), visitorRole: clean(body.visitorRole, 160), visitorPhone: clean(body.visitorPhone, 40), visitorLinkedin: clean(body.visitorLinkedin, 256), meetingPurpose: clean(body.meetingPurpose, 160), additionalMessage: clean(body.additionalMessage, 5000), visitorTimezone: clean(body.visitorTimezone, 100), durationMinutes: Number(body.durationMinutes) };
    if (!payload.reservationToken || payload.visitorName.length < 2 || !validEmail(payload.visitorEmail) || payload.meetingPurpose.length < 2 || Number.isNaN(payload.durationMinutes)) return json({ error: 'INVALID_PAYLOAD' }, 400);
    const db = adminClient();
    const { data: type, error: typeError } = await db.from('meeting_types').select('id,name,approval_mode,video_mode,duration_minutes,min_duration_minutes,max_duration_minutes').eq('id', payload.meetingTypeId).eq('active', true).single();
    if (typeError || !type || payload.durationMinutes < type.min_duration_minutes || payload.durationMinutes > type.max_duration_minutes || (type.min_duration_minutes === type.max_duration_minutes && payload.durationMinutes !== type.duration_minutes)) return json({ error: 'INVALID_MEETING_TYPE' }, 400);
    const rescheduleToken = randomToken();
    const cancelToken = randomToken();
    const { data: booking, error: consumeError } = await db.rpc('consume_booking_reservation', { p_token_hash: await tokenHash(payload.reservationToken), p_meeting_type_id: type.id, p_visitor_name: payload.visitorName, p_visitor_email: payload.visitorEmail, p_visitor_company: payload.visitorCompany, p_visitor_role: payload.visitorRole, p_visitor_phone: payload.visitorPhone, p_visitor_linkedin: payload.visitorLinkedin, p_meeting_purpose: payload.meetingPurpose, p_additional_message: payload.additionalMessage, p_visitor_timezone: payload.visitorTimezone, p_duration_minutes: payload.durationMinutes, p_approval_mode: type.approval_mode, p_reschedule_token_hash: await tokenHash(rescheduleToken), p_cancel_token_hash: await tokenHash(cancelToken) });
    if (consumeError) throw new Error(consumeError.message.includes('RESERVATION_EXPIRED') ? 'RESERVATION_EXPIRED' : consumeError.message.includes('SLOT_UNAVAILABLE') ? 'SLOT_UNAVAILABLE' : consumeError.message);
    const emailData = { visitorName: booking.visitor_name, visitorEmail: booking.visitor_email, visitorCompany: booking.visitor_company, meetingType: type.name, startTimeUtc: booking.start_time_utc, endTimeUtc: booking.end_time_utc, timezone: booking.visitor_timezone, bookingReference: booking.booking_reference, rescheduleUrl: `${Deno.env.get('ALLOWED_ORIGINS')?.split(',')[0]}/#/reschedule/${rescheduleToken}`, cancelUrl: `${Deno.env.get('ALLOWED_ORIGINS')?.split(',')[0]}/#/cancel/${cancelToken}` };
    if (booking.status === 'CONFIRMED') {
      const gcal = await createOrUpdateCalendarEvent({ ...emailData, visitorRole: booking.visitor_role, notes: booking.additional_message });
      if (gcal.eventId) await db.from('meeting_bookings').update({ google_calendar_event_id: gcal.eventId, google_meet_link: gcal.meetingLink }).eq('id', booking.id);
      await sendBookingConfirmed({ ...emailData, meetingLink: gcal.meetingLink });
      await sendOwnerBookingNotice(emailData, 'CONFIRMED');
      await db.from('meeting_reminders').insert([{ booking_id: booking.id, reminder_kind: '24_HOURS', scheduled_for: new Date(new Date(booking.start_time_utc).getTime() - 24 * 60 * 60 * 1000).toISOString() }, { booking_id: booking.id, reminder_kind: '1_HOUR', scheduled_for: new Date(new Date(booking.start_time_utc).getTime() - 60 * 60 * 1000).toISOString() }]);
    } else {
      await sendBookingReceived(emailData);
      await sendOwnerBookingNotice(emailData, 'REQUESTED');
    }
    await db.from('audit_logs').insert({ action: 'BOOKING_CREATED', target_type: 'meeting_bookings', target_id: booking.id, metadata: { status: booking.status } });
    return json({ bookingReference: booking.booking_reference, status: booking.status });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'BOOKING_FAILED' }, 400);
  }
});
