import { adminClient, json, options } from '../_shared/http.ts';
import { ensureOrigin, requireAdmin } from '../_shared/security.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    await requireAdmin(request);
    const db = adminClient();
    const [{ data: bookings, error: bookingsError }, { data: messages, error: messagesError }] = await Promise.all([
      db.from('meeting_bookings').select('*,meeting_types(name,slug)').order('start_time_utc', { ascending: true }).limit(200),
      db.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(200),
    ]);
    if (bookingsError) throw bookingsError;
    if (messagesError) throw messagesError;
    const now = new Date().toISOString();
    const upcoming = (bookings ?? []).filter(booking => booking.start_time_utc >= now && ['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(booking.status));
    return json({ bookings: bookings ?? [], messages: messages ?? [], metrics: { totalBookings: bookings?.length ?? 0, upcomingBookings: upcoming.length, pendingBookings: (bookings ?? []).filter(booking => booking.status === 'PENDING').length, newMessages: (messages ?? []).filter(message => message.status === 'NEW').length, priorityMessages: (messages ?? []).filter(message => message.is_priority && message.status !== 'ARCHIVED').length } });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'ADMIN_DASHBOARD_FAILED';
    return json({ error: message }, message === 'UNAUTHORIZED' || message === 'FORBIDDEN' ? 403 : 400);
  }
});
