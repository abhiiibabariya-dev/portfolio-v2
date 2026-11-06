import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const ProtectedAdminRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<'checking' | 'allowed' | 'denied'>('checking');
  useEffect(() => {
    const client = supabase;
    if (!client) { setState('denied'); return; }
    client.auth.getSession().then(async ({ data }) => {
      if (!data.session) { setState('denied'); return; }
      const { data: profile } = await client.from('profiles').select('is_admin').eq('id', data.session.user.id).maybeSingle();
      setState(profile?.is_admin ? 'allowed' : 'denied');
    });
  }, []);
  if (state === 'checking') return <div className="min-h-screen pt-28 text-center font-mono text-xs text-[#8a8a96]">VERIFYING ACCESS…</div>;
  if (state === 'denied') return <div className="min-h-screen pt-28 text-center"><p className="font-mono text-xs text-red-400">ADMIN ACCESS REQUIRED</p><Link to="/admin/sign-in" className="inline-block mt-4 font-mono text-xs text-[#c8a96b]">SIGN IN</Link></div>;
  return <>{children}</>;
};
