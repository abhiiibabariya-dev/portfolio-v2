import { adminClient, clean, tokenHash } from './http.ts';

const clientIp = (request: Request) => request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

export const ensureOrigin = (request: Request) => {
  const origin = request.headers.get('origin');
  const allowed = (Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map(value => value.trim()).filter(Boolean);
  return !origin || allowed.length === 0 || allowed.includes(origin);
};

export const ensureRateLimit = async (request: Request, action: string, limit: number, windowMinutes = 60) => {
  const salt = Deno.env.get('RATE_LIMIT_SALT');
  if (!salt) throw new Error('Server rate limiting is not configured.');
  const fingerprint = await tokenHash(`${salt}:${clientIp(request)}:${action}`);
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / (windowMinutes * 60_000)) * windowMinutes * 60_000).toISOString();
  const db = adminClient();
  const { data, error } = await db.from('rate_limits').select('attempts').eq('key_hash', fingerprint).eq('action', action).eq('window_started_at', windowStart).maybeSingle();
  if (error) throw error;
  const attempts = (data?.attempts ?? 0) + 1;
  if (attempts > limit) throw new Error('RATE_LIMITED');
  const { error: writeError } = await db.from('rate_limits').upsert({ key_hash: fingerprint, action, window_started_at: windowStart, attempts }, { onConflict: 'key_hash,action,window_started_at' });
  if (writeError) throw writeError;
};

export const rejectBot = (value: unknown) => clean(value, 200).length > 0;

export const requireAdmin = async (request: Request) => {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('UNAUTHORIZED');
  const db = adminClient();
  const { data: authData, error: authError } = await db.auth.getUser(token);
  if (authError || !authData.user) throw new Error('UNAUTHORIZED');
  const { data: profile, error: profileError } = await db.from('profiles').select('id,is_admin').eq('id', authData.user.id).maybeSingle();
  if (profileError || !profile?.is_admin) throw new Error('FORBIDDEN');
  return authData.user;
};
