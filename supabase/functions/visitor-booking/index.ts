import { adminClient, clean, json, options, tokenHash } from '../_shared/http.ts';
import { ensureOrigin } from '../_shared/security.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    const body = await request.json();
    const token = clean(body.token, 256);
    const mode = clean(body.mode, 16);
    if (!token || !['reschedule', 'cancel'].includes(mode)) return json({ error: 'INVALID_REQUEST' }, 400);
    const db = adminClient();
    const field = mode === 'reschedule' ? 'reschedule_token_hash' : 'cancel_token_hash';
    const expiry = mode === 'reschedule' ? 'reschedule_token_expires_at' : 'cancel_token_expires_at';
    const { data, error } = await db.from('meeting_bookings').select('id,booking_reference,visitor_name,visitor_email,visitor_company,visitor_role,meeting_purpose,visitor_timezone,start_time_utc,end_time_utc,duration_minutes,status,meeting_type_id,meeting_types(name,description)').eq(field, await tokenHash(token)).gt(expiry, new Date().toISOString()).single();
    if (error || !data) return json({ error: 'BOOKING_NOT_FOUND' }, 404);
    return json({ booking: data, mode });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'VISITOR_BOOKING_FAILED' }, 400);
  }
});
