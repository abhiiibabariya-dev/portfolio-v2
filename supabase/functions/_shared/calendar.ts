type CalendarBooking = {
  bookingReference: string;
  visitorName: string;
  visitorEmail: string;
  visitorCompany: string;
  visitorRole: string;
  meetingType: string;
  startTimeUtc: string;
  endTimeUtc: string;
  timezone: string;
  notes: string;
  googleCalendarEventId?: string | null;
};

const accessToken = async () => {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN');
  if (!clientId || !clientSecret || !refreshToken) return null;
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }) });
  if (!response.ok) throw new Error(`Google authentication failed: ${await response.text()}`);
  return (await response.json() as { access_token: string }).access_token;
};

const calendarBase = () => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(Deno.env.get('GOOGLE_CALENDAR_ID') ?? 'primary')}`;

export const getBusyIntervals = async (startsAt: string, endsAt: string) => {
  const token = await accessToken();
  if (!token) return [] as { start: string; end: string }[];
  const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ timeMin: startsAt, timeMax: endsAt, items: [{ id: Deno.env.get('GOOGLE_CALENDAR_ID') ?? 'primary' }] }) });
  if (!response.ok) throw new Error(`Google availability check failed: ${await response.text()}`);
  const data = await response.json() as { calendars: Record<string, { busy: { start: string; end: string }[] }> };
  return Object.values(data.calendars)[0]?.busy ?? [];
};

export const createOrUpdateCalendarEvent = async (booking: CalendarBooking) => {
  const token = await accessToken();
  if (!token) return { eventId: null, meetingLink: null };
  const body = {
    summary: `Recruiter Interview – ${booking.visitorCompany}`,
    description: `Candidate: Abhishek Babariya\nMeeting Type: ${booking.meetingType}\nRecruiter: ${booking.visitorName}\nCompany: ${booking.visitorCompany}\nEmail: ${booking.visitorEmail}\nRole: ${booking.visitorRole}\nNotes: ${booking.notes}`,
    start: { dateTime: booking.startTimeUtc, timeZone: booking.timezone },
    end: { dateTime: booking.endTimeUtc, timeZone: booking.timezone },
    attendees: [{ email: booking.visitorEmail, displayName: booking.visitorName }],
    conferenceData: { createRequest: { requestId: booking.bookingReference, conferenceSolutionKey: { type: 'hangoutsMeet' } } },
  };
  const url = booking.googleCalendarEventId ? `${calendarBase()}/events/${encodeURIComponent(booking.googleCalendarEventId)}?conferenceDataVersion=1&sendUpdates=all` : `${calendarBase()}/events?conferenceDataVersion=1&sendUpdates=all`;
  const response = await fetch(url, { method: booking.googleCalendarEventId ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`Google Calendar event creation failed: ${await response.text()}`);
  const event = await response.json() as { id: string; hangoutLink?: string };
  return { eventId: event.id, meetingLink: event.hangoutLink ?? null };
};

export const cancelCalendarEvent = async (eventId?: string | null) => {
  if (!eventId) return;
  const token = await accessToken();
  if (!token) return;
  const response = await fetch(`${calendarBase()}/events/${encodeURIComponent(eventId)}?sendUpdates=all`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok && response.status !== 410) throw new Error(`Google Calendar event cancellation failed: ${await response.text()}`);
};
