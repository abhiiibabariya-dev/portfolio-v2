export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export type MeetingType = {
  id: string;
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  approvalMode: 'AUTO_CONFIRM' | 'MANUAL_APPROVAL';
  videoMode: 'GOOGLE_MEET' | 'MANUAL';
};

export type AvailabilitySlot = {
  startTimeUtc: string;
  endTimeUtc: string;
  available: boolean;
};

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  website?: string;
};

export type BookingPayload = {
  reservationToken: string;
  meetingTypeId: string;
  visitorName: string;
  visitorEmail: string;
  visitorCompany: string;
  visitorRole: string;
  visitorPhone?: string;
  visitorLinkedin?: string;
  meetingPurpose: string;
  additionalMessage?: string;
  visitorTimezone: string;
  durationMinutes: number;
  website?: string;
};

export const DEFAULT_MEETING_TYPES: MeetingType[] = [
  { id: 'job-interview', slug: 'job-interview', name: 'Job Interview', description: 'Professional interview for cybersecurity, DFIR, SOC, incident response, or security engineering roles.', durationMinutes: 45, minDurationMinutes: 45, maxDurationMinutes: 45, approvalMode: 'AUTO_CONFIRM', videoMode: 'GOOGLE_MEET' },
  { id: 'recruiter-discussion', slug: 'recruiter-discussion', name: 'Recruiter Discussion', description: 'Discuss roles, hiring requirements, and professional background.', durationMinutes: 30, minDurationMinutes: 30, maxDurationMinutes: 30, approvalMode: 'AUTO_CONFIRM', videoMode: 'GOOGLE_MEET' },
  { id: 'technical-interview', slug: 'technical-interview', name: 'Technical Interview', description: 'Technical conversation on DFIR, incident response, SOC, SIEM engineering, and threat detection.', durationMinutes: 60, minDurationMinutes: 60, maxDurationMinutes: 60, approvalMode: 'MANUAL_APPROVAL', videoMode: 'GOOGLE_MEET' },
  { id: 'cybersecurity-consultation', slug: 'cybersecurity-consultation', name: 'Cybersecurity Consultation', description: 'Professional discussion about cybersecurity operations, automation, or security architecture.', durationMinutes: 60, minDurationMinutes: 60, maxDurationMinutes: 60, approvalMode: 'MANUAL_APPROVAL', videoMode: 'GOOGLE_MEET' },
  { id: 'quick-introduction', slug: 'quick-introduction', name: 'Quick Introduction', description: 'A concise introductory conversation.', durationMinutes: 15, minDurationMinutes: 15, maxDurationMinutes: 15, approvalMode: 'AUTO_CONFIRM', videoMode: 'GOOGLE_MEET' },
  { id: 'custom-meeting', slug: 'custom-meeting', name: 'Custom Meeting', description: 'For another professional discussion with a selectable duration.', durationMinutes: 30, minDurationMinutes: 15, maxDurationMinutes: 90, approvalMode: 'MANUAL_APPROVAL', videoMode: 'MANUAL' },
];

export const formatLocalTime = (dateTime: string, timezone: string, options: Intl.DateTimeFormatOptions = {}) => new Intl.DateTimeFormat(undefined, { timeZone: timezone, hour: 'numeric', minute: '2-digit', ...options }).format(new Date(dateTime));
export const formatLocalDate = (dateTime: string, timezone: string) => new Intl.DateTimeFormat(undefined, { timeZone: timezone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateTime));

export const generateFallbackSlots = (dateStr: string, durationMinutes: number, _timezone?: string): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];
  const hourMinutePairs = [
    [10, 0],
    [11, 30],
    [14, 0],
    [15, 30],
    [17, 0],
  ];

  const now = new Date();

  for (const [hour, minute] of hourMinutePairs) {
    const slotStart = new Date(`${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
    if (isNaN(slotStart.getTime())) continue;

    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);
    const isFuture = slotStart.getTime() > now.getTime() + 15 * 60000;
    const dayOfWeek = slotStart.getDay();
    const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;

    slots.push({
      startTimeUtc: slotStart.toISOString(),
      endTimeUtc: slotEnd.toISOString(),
      available: isFuture && (isWeekday || hour < 16),
    });
  }

  return slots;
};

export const generateIcsContent = (meeting: {
  bookingReference: string;
  startTimeUtc: string;
  endTimeUtc: string;
  title: string;
  visitorName: string;
  visitorEmail: string;
  visitorCompany: string;
  meetingPurpose: string;
}) => {
  const formatUtc = (d: string) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ABHI_SEC//Interview Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${meeting.bookingReference}@abhi-sec`,
    `DTSTAMP:${formatUtc(new Date().toISOString())}`,
    `DTSTART:${formatUtc(meeting.startTimeUtc)}`,
    `DTEND:${formatUtc(meeting.endTimeUtc)}`,
    `SUMMARY:${meeting.title} - Abhishek Babariya & ${meeting.visitorName}`,
    `DESCRIPTION:Recruiter/Interviewer: ${meeting.visitorName} (${meeting.visitorCompany})\\nEmail: ${meeting.visitorEmail}\\nPurpose: ${meeting.meetingPurpose}\\nReference: ${meeting.bookingReference}\\nOrganizer: Abhishek Babariya (abhibabariya007@gmail.com)`,
    'ORGANIZER;CN=Abhishek Babariya:MAILTO:abhibabariya007@gmail.com',
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${meeting.visitorName}:MAILTO:${meeting.visitorEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
};

export const downloadIcsFile = (meeting: {
  bookingReference: string;
  startTimeUtc: string;
  endTimeUtc: string;
  title: string;
  visitorName: string;
  visitorEmail: string;
  visitorCompany: string;
  meetingPurpose: string;
}) => {
  const content = generateIcsContent(meeting);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `meeting-${meeting.bookingReference}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
