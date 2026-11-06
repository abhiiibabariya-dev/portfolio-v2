import { adminClient, clean, json, options } from '../_shared/http.ts';
import { ensureOrigin, requireAdmin } from '../_shared/security.ts';

Deno.serve(async request => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST' || !ensureOrigin(request)) return json({ error: 'FORBIDDEN' }, 403);
  try {
    const admin = await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const db = adminClient();
    if (body.action === 'update-rule') {
      const id = clean(body.id, 64);
      const patch = { start_local: clean(body.startLocal, 5), end_local: clean(body.endLocal, 5), timezone: clean(body.timezone, 100), slot_interval_minutes: Number(body.slotIntervalMinutes), buffer_before_minutes: Number(body.bufferBeforeMinutes), buffer_after_minutes: Number(body.bufferAfterMinutes), active: Boolean(body.active) };
      if (!id || !/^\d{2}:\d{2}$/.test(patch.start_local) || !/^\d{2}:\d{2}$/.test(patch.end_local) || !Number.isInteger(patch.slot_interval_minutes)) return json({ error: 'INVALID_RULE' }, 400);
      const { error } = await db.from('availability_rules').update(patch).eq('id', id);
      if (error) throw error;
      await db.from('audit_logs').insert({ actor_id: admin.id, action: 'AVAILABILITY_RULE_UPDATED', target_type: 'availability_rule', metadata: { id } });
    } else if (body.action === 'add-override') {
      const startsAt = new Date(clean(body.startsAt, 40));
      const endsAt = new Date(clean(body.endsAt, 40));
      const kind = clean(body.kind, 16);
      if (!['BLOCKED', 'VACATION', 'CUSTOM'].includes(kind) || Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) return json({ error: 'INVALID_OVERRIDE' }, 400);
      const { error } = await db.from('availability_overrides').insert({ kind, starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), reason: clean(body.reason, 500) });
      if (error) throw error;
      await db.from('audit_logs').insert({ actor_id: admin.id, action: 'AVAILABILITY_OVERRIDE_CREATED', target_type: 'availability_override', metadata: { kind } });
    } else if (body.action === 'delete-override') {
      const id = clean(body.id, 64);
      const { error } = await db.from('availability_overrides').delete().eq('id', id);
      if (error) throw error;
      await db.from('audit_logs').insert({ actor_id: admin.id, action: 'AVAILABILITY_OVERRIDE_DELETED', target_type: 'availability_override', metadata: { id } });
    }
    const [{ data: rules, error: rulesError }, { data: overrides, error: overridesError }, { data: types, error: typesError }] = await Promise.all([db.from('availability_rules').select('*').order('weekday').order('start_local'), db.from('availability_overrides').select('*').order('starts_at'), db.from('meeting_types').select('*').order('sort_order')]);
    if (rulesError) throw rulesError;
    if (overridesError) throw overridesError;
    if (typesError) throw typesError;
    return json({ rules: rules ?? [], overrides: overrides ?? [], meetingTypes: types ?? [] });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'AVAILABILITY_ADMIN_FAILED';
    return json({ error: message }, message === 'UNAUTHORIZED' || message === 'FORBIDDEN' ? 403 : 400);
  }
});
