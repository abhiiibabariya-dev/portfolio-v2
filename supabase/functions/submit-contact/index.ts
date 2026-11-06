import { clean, json, options, adminClient, validEmail } from '../_shared/http.ts';
import { ensureOrigin, ensureRateLimit, rejectBot } from '../_shared/security.ts';
import { sendContactEmails } from '../_shared/email.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    await ensureRateLimit(request, 'contact', 5);
    const body = await request.json();
    if (rejectBot(body.website)) return json({ id: crypto.randomUUID() });
    const contact = { name: clean(body.name, 120), email: clean(body.email, 320).toLowerCase(), company: clean(body.company, 160), subject: clean(body.subject, 160), message: clean(body.message, 5000) };
    if (contact.name.length < 2 || !validEmail(contact.email) || contact.company.length < 2 || contact.subject.length < 2 || contact.message.length < 10) return json({ error: 'INVALID_PAYLOAD' }, 400);
    const isPriority = ['Job Opportunity', 'Interview Invitation'].includes(contact.subject);
    const db = adminClient();
    const { data, error } = await db.from('contact_messages').insert({ ...contact, is_priority: isPriority }).select('id').single();
    if (error) throw error;
    await db.from('audit_logs').insert({ action: 'CONTACT_CREATED', target_type: 'contact_message', target_id: data.id, metadata: { priority: isPriority } });
    await sendContactEmails({ ...contact, isPriority });
    return json({ id: data.id });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'CONTACT_FAILED' }, 400);
  }
});
