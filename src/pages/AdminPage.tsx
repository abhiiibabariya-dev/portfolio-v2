import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, LogIn, LogOut, RefreshCw, X } from 'lucide-react';
import { ProtectedAdminRoute } from '../components/ProtectedAdminRoute';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

type Dashboard = {
  metrics: { totalBookings: number; upcomingBookings: number; pendingBookings: number; newMessages: number; priorityMessages: number };
  bookings: Booking[];
  messages: ContactMessage[];
};
type Booking = { id: string; visitor_name: string; visitor_company: string; start_time_utc: string; status: string; meeting_types?: { name?: string } | null };
type ContactMessage = { id: string; subject: string; name: string; company: string; message: string; is_priority: boolean };

export const AdminPage: React.FC = () => <ProtectedAdminRoute><AdminContent /></ProtectedAdminRoute>;

const AdminContent: React.FC = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setDashboard(await api.adminDashboard() as Dashboard); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Dashboard loading failed.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const action = async (bookingId: string, choice: 'approve' | 'reject' | 'cancel') => {
    try { await api.adminBookingAction({ bookingId, action: choice }); await load(); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Booking action failed.'); }
  };
  return <div className="min-h-screen pt-14"><div className="max-w-7xl mx-auto px-4 sm:px-6 py-14"><header className="flex flex-wrap justify-between gap-4 border-b border-[#1e1e22] pb-7 mb-8"><div><p className="font-mono text-[10px] text-[#c8a96b] tracking-widest">ADMIN CONTROL PLANE</p><h1 className="mt-2 font-display text-4xl font-bold uppercase">Operations</h1></div><div className="flex gap-3"><Link to="/admin/availability" className="border border-[#2a2a30] px-4 py-2 font-mono text-xs text-[#f0efea]">AVAILABILITY</Link><button onClick={() => void supabase?.auth.signOut()} className="inline-flex items-center gap-2 border border-[#2a2a30] px-4 py-2 font-mono text-xs text-[#f0efea]"><LogOut size={12} /> SIGN OUT</button></div></header>{error && <p role="alert" className="mb-5 font-mono text-xs text-red-400">{error}</p>}{loading ? <p className="font-mono text-xs text-[#8a8a96]">LOADING DASHBOARD…</p> : dashboard && <><div className="grid grid-cols-2 lg:grid-cols-5 gap-3">{Object.entries(dashboard.metrics).map(([label, value]) => <div key={label} className="border border-[#1e1e22] bg-[#0f0f10] p-4"><p className="font-mono text-xl text-[#c8a96b]">{value}</p><p className="mt-1 font-mono text-[9px] text-[#8a8a96]">{label.replace(/([A-Z])/g, ' $1').toUpperCase()}</p></div>)}</div><section className="mt-8"><div className="flex items-center justify-between mb-4"><h2 className="font-mono text-xs text-[#f0efea]">BOOKING QUEUE</h2><button onClick={() => void load()} className="text-[#c8a96b]" aria-label="Refresh bookings"><RefreshCw size={14} /></button></div><div className="overflow-x-auto border border-[#1e1e22]"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-[#1e1e22] font-mono text-[9px] text-[#4a4a54]"><tr><th className="p-3">TIME</th><th>VISITOR</th><th>TYPE</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{dashboard.bookings.map(booking => <tr key={booking.id} className="border-b border-[#1e1e22] last:border-0 font-mono text-[10px]"><td className="p-3 text-[#8a8a96]">{new Date(booking.start_time_utc).toLocaleString()}</td><td><p className="text-[#f0efea]">{booking.visitor_name}</p><p className="text-[#8a8a96]">{booking.visitor_company}</p></td><td className="text-[#8a8a96]">{booking.meeting_types?.name ?? 'Meeting'}</td><td className="text-[#c8a96b]">{booking.status}</td><td><div className="flex gap-3">{booking.status === 'PENDING' && <><button onClick={() => void action(booking.id, 'approve')} className="text-[#4ade80]" aria-label="Approve booking"><Check size={14} /></button><button onClick={() => void action(booking.id, 'reject')} className="text-red-400" aria-label="Reject booking"><X size={14} /></button></>}{['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(booking.status) && <button onClick={() => void action(booking.id, 'cancel')} className="text-[#8a8a96]">CANCEL</button>}</div></td></tr>)}</tbody></table></div></section><section className="mt-8"><h2 className="font-mono text-xs text-[#f0efea] mb-4">CONTACT MESSAGES</h2><div className="grid md:grid-cols-2 gap-3">{dashboard.messages.slice(0, 12).map(message => <article key={message.id} className="border border-[#1e1e22] bg-[#0f0f10] p-4"><div className="flex justify-between gap-4"><p className="font-mono text-xs text-[#f0efea]">{message.subject}</p>{message.is_priority && <span className="font-mono text-[9px] text-[#c8a96b]">PRIORITY</span>}</div><p className="mt-2 font-mono text-[10px] text-[#8a8a96]">{message.name} · {message.company}</p><p className="mt-3 text-xs text-[#8a8a96]">{message.message}</p></article>)}</div></section></>}</div></div>;
};

export const AdminSignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) { setError('Supabase is not configured.'); return; }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) { setError(signInError.message); return; }
    window.location.hash = '#/admin';
  };
  return <div className="min-h-screen pt-14 flex items-center justify-center px-4"><form onSubmit={submit} className="w-full max-w-sm border border-[#1e1e22] bg-[#0f0f10] p-7 space-y-4"><div><p className="font-mono text-[10px] text-[#c8a96b] tracking-widest">ADMIN ACCESS</p><h1 className="mt-2 font-display text-3xl font-bold uppercase">Sign In</h1></div><div><label className="form-label">EMAIL</label><input required type="email" className="form-control" value={email} onChange={event => setEmail(event.target.value)} /></div><div><label className="form-label">PASSWORD</label><input required type="password" className="form-control" value={password} onChange={event => setPassword(event.target.value)} /></div>{error && <p role="alert" className="font-mono text-xs text-red-400">{error}</p>}<button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-[#c8a96b] py-3 font-mono text-xs font-bold text-[#0a0a0b]"><LogIn size={12} /> {loading ? 'VERIFYING…' : 'SIGN IN'}</button></form></div>;
};
