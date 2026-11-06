import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

export const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGINS')?.split(',')[0] ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-honeypot, x-reminder-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });
export const options = (request: Request) => request.method === 'OPTIONS' ? new Response('ok', { headers: corsHeaders }) : null;
export const adminClient = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
export const publicClient = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
export const clean = (value: unknown, max: number) => String(value ?? '').replace(/[<>]/g, '').trim().slice(0, max);
export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const tokenHash = async (token: string) => {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
};
export const randomToken = () => `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll('-', '');
