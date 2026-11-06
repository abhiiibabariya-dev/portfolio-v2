type MeetingEmail = {
  visitorName: string;
  visitorEmail: string;
  visitorCompany: string;
  meetingType: string;
  startTimeUtc: string;
  endTimeUtc: string;
  timezone: string;
  meetingLink?: string | null;
  bookingReference: string;
  rescheduleUrl?: string;
  cancelUrl?: string;
};

const ownerEmail = () => Deno.env.get('OWNER_EMAIL')!;
const from = () => Deno.env.get('EMAIL_FROM')!;
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);

const shell = (title: string, content: string) => `<!doctype html><html><body style="margin:0;background:#0a0a0b;color:#f0efea;font-family:ui-monospace,SFMono-Regular,Menlo,monospace"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:28px"><table role="presentation" width="100%" style="max-width:640px;margin:auto;background:#0f0f10;border:1px solid #2a2a30"><tr><td style="padding:28px"><div style="color:#c8a96b;font-size:12px;letter-spacing:2px">ABHI_SEC // SYSTEM MESSAGE</div><h1 style="font-size:24px;margin:20px 0;color:#f0efea">${title}</h1>${content}<hr style="border:0;border-top:1px solid #2a2a30;margin:24px 0"><p style="color:#8a8a96;font-size:12px;line-height:1.6;margin:0">Abhishek Babariya · Cybersecurity Professional<br>DFIR · Incident Response · Security Operations</p></td></tr></table></td></tr></table></body></html>`;

const local = (dateTime: string, timezone: string) => new Intl.DateTimeFormat('en-IN', { timeZone: timezone, dateStyle: 'full', timeStyle: 'short' }).format(new Date(dateTime));

export const sendEmail = async (to: string, subject: string, html: string, attachments?: { filename: string; content: string }[]) => {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) throw new Error('Email delivery is not configured.');
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: from(), to: [to], subject, html, attachments }) });
  if (!response.ok) throw new Error(`Email delivery failed: ${await response.text()}`);
  return response.json();
};

export const sendContactEmails = async (contact: { name: string; email: string; company: string; subject: string; message: string; isPriority: boolean }) => {
  const priority = contact.isPriority ? 'PRIORITY RECRUITER INQUIRY' : 'NEW PORTFOLIO INQUIRY';
  await Promise.all([
    sendEmail(ownerEmail(), `${priority}: ${contact.subject}`, shell(priority, `<p><strong>From:</strong> ${escapeHtml(contact.name)} (${escapeHtml(contact.email)})</p><p><strong>Company:</strong> ${escapeHtml(contact.company)}</p><p><strong>Subject:</strong> ${escapeHtml(contact.subject)}</p><pre style="white-space:pre-wrap;color:#c8c8d0">${escapeHtml(contact.message)}</pre>`)),
    sendEmail(contact.email, 'Your message has been received', shell('MESSAGE RECEIVED', `<p>Hello ${escapeHtml(contact.name)},</p><p>Your message has been securely delivered. Abhishek will review it and respond through the appropriate channel.</p><p style="color:#c8a96b">STATUS: TRANSMISSION RECEIVED</p>`)),
  ]);
};

export const icsAttachment = (meeting: MeetingEmail) => {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dt = (value: string) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ABHI_SEC//Meeting//EN', 'METHOD:REQUEST', 'BEGIN:VEVENT', `UID:${meeting.bookingReference}@abhi-sec`, `DTSTAMP:${stamp}`, `DTSTART:${dt(meeting.startTimeUtc)}`, `DTEND:${dt(meeting.endTimeUtc)}`, `SUMMARY:Recruiter Interview – ${meeting.visitorCompany}`, `DESCRIPTION:Meeting Type: ${meeting.meetingType}\\nRecruiter: ${meeting.visitorName}\\n${meeting.meetingLink ? `Join: ${meeting.meetingLink}` : ''}`, `ATTENDEE;CN=${meeting.visitorName}:MAILTO:${meeting.visitorEmail}`, 'END:VEVENT', 'END:VCALENDAR'];
  return { filename: 'abhi-sec-meeting.ics', content: btoa(lines.join('\r\n')) };
};

export const sendBookingReceived = (meeting: MeetingEmail) => sendEmail(meeting.visitorEmail, 'Meeting Request Received', shell('MEETING REQUEST RECEIVED', `<p>Hello ${escapeHtml(meeting.visitorName)},</p><p>Your request is recorded and is awaiting confirmation.</p><p><strong>Type:</strong> ${escapeHtml(meeting.meetingType)}<br><strong>Time:</strong> ${local(meeting.startTimeUtc, meeting.timezone)} (${escapeHtml(meeting.timezone)})</p><p style="color:#c8a96b">STATUS: PENDING CONFIRMATION</p>`));

export const sendBookingConfirmed = (meeting: MeetingEmail) => sendEmail(meeting.visitorEmail, 'Interview Confirmed – Abhishek Babariya', shell('MEETING CONFIRMED', `<p>Hello ${escapeHtml(meeting.visitorName)},</p><p>Your meeting is confirmed.</p><p><strong>Type:</strong> ${escapeHtml(meeting.meetingType)}<br><strong>Date & time:</strong> ${local(meeting.startTimeUtc, meeting.timezone)}<br><strong>Reference:</strong> ${meeting.bookingReference}</p>${meeting.meetingLink ? `<p><a style="display:inline-block;background:#c8a96b;color:#0a0a0b;padding:12px 16px;text-decoration:none" href="${escapeHtml(meeting.meetingLink)}">JOIN MEETING</a></p>` : ''}${meeting.rescheduleUrl ? `<p><a href="${escapeHtml(meeting.rescheduleUrl)}">RESCHEDULE MEETING</a> · <a href="${escapeHtml(meeting.cancelUrl ?? '')}">CANCEL MEETING</a></p>` : ''}`), [icsAttachment(meeting)]);

export const sendOwnerBookingNotice = (meeting: MeetingEmail, status: string) => sendEmail(ownerEmail(), `NEW RECRUITER MEETING ${status}`, shell(`MEETING ${status}`, `<p><strong>Recruiter:</strong> ${escapeHtml(meeting.visitorName)}<br><strong>Company:</strong> ${escapeHtml(meeting.visitorCompany)}<br><strong>Email:</strong> ${escapeHtml(meeting.visitorEmail)}<br><strong>Type:</strong> ${escapeHtml(meeting.meetingType)}<br><strong>Time:</strong> ${local(meeting.startTimeUtc, meeting.timezone)}</p>`));
