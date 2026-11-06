import { adminClient, json, options } from '../_shared/http.ts';
import { ensureOrigin } from '../_shared/security.ts';
import { sendBookingConfirmed } from '../_shared/email.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  const secret = request.headers.get('x-reminder-secret');
  if (!Deno.env.get('REMINDER_CRON_SECRET') || secret !== Deno.env.get('REMINDER_CRON_SECRET')) return json({ error: 'FORBIDDEN' }, 403);
  try {
    const db = adminClient();
    const { data: reminders, error } = await db.from('meeting_reminders').select('id,reminder_kind,meeting_bookings!inner(booking_reference,visitor_name,visitor_email,visitor_company,start_time_utc,end_time_utc,visitor_timezone,google_meet_link,meeting_types(name))').is('sent_at', null).lte('scheduled_for', new Date().toISOString()).eq('meeting_bookings.status', 'CONFIRMED').limit(100);
    if (error) throw error;
    let sent = 0;
    for (const reminder of reminders ?? []) {
      const booking = reminder.meeting_bookings as any;
      await sendBookingConfirmed({ visitorName: booking.visitor_name, visitorEmail: booking.visitor_email, visitorCompany: booking.visitor_company, meetingType: booking.meeting_types?.name ?? 'Professional Meeting', startTimeUtc: booking.start_time_utc, endTimeUtc: booking.end_time_utc, timezone: booking.visitor_timezone, meetingLink: booking.google_meet_link, bookingReference: booking.booking_reference });
      const { error: updateError } = await db.from('meeting_reminders').update({ sent_at: new Date().toISOString() }).eq('id', reminder.id).is('sent_at', null);
      if (updateError) throw updateError;
      sent += 1;
    }
    return json({ sent });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'REMINDER_FAILED' }, 400);
  }
});
