import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Check, Copy, Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { api } from '../lib/api';

const subjects = ['Job Opportunity', 'Interview Request', 'Project Discussion', 'Security Consultation', 'General Inquiry'];
const initialForm = { name: '', email: '', company: '', subject: subjects[0], message: '', website: '' };

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState('sending');
    setError('');
    try {
      const res = await api.submitContact(form);
      setReferenceId(res.id || `INQ-${Date.now().toString(36).toUpperCase()}`);
      setState('sent');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Transmission failed.');
      setState('error');
    }
  };

  const copyDispatch = () => {
    const text = `ABHI_SEC INQUIRY DISPATCH\nReference: ${referenceId}\nFrom: ${form.name} (${form.email})\nCompany: ${form.company}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const directMailtoUrl = `mailto:${PROFILE.email}?subject=${encodeURIComponent(`[${form.subject}] ${form.company} - ${form.name}`)}&body=${encodeURIComponent(
    `Hello Abhishek,\n\nName: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nSubject: ${form.subject}\nReference: ${referenceId || 'DIRECT-DISPATCH'}\n\nMessage:\n${form.message}\n`
  )}`;

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] mb-12 tracking-widest">
          <ArrowLeft size={11} /> HOME / CONTACT
        </Link>
        <header className="mb-12">
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">09 / CONTACT</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase leading-tight">
            Open<br />Channel
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#8a8a96]">
            For job opportunities, interviews, project discussions, and professional collaboration.
          </p>
        </header>
        <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr]">
          <aside className="space-y-4">
            <section className="border border-[#1e1e22] bg-[#0f0f10] p-6">
              <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">DIRECT CHANNELS</div>
              <div className="space-y-4 font-mono text-[11px] text-[#8a8a96]">
                <a href={`mailto:${PROFILE.email}`} className="flex gap-3 hover:text-[#c8a96b]">
                  <Mail size={13} className="text-[#c8a96b]" />
                  {PROFILE.email}
                </a>
                <Link to="/recruiter" className="flex gap-3 hover:text-[#c8a96b]">
                  <Send size={13} className="text-[#c8a96b]" />
                  SECURE RECRUITER FAST TRACK
                </Link>
                <a href={`tel:${PROFILE.phone}`} className="flex gap-3 hover:text-[#c8a96b]">
                  <Phone size={13} className="text-[#c8a96b]" />
                  {PROFILE.phone}
                </a>
                <span className="flex gap-3">
                  <MapPin size={13} className="text-[#c8a96b]" />
                  {PROFILE.location}
                </span>
              </div>
            </section>
            <section className="border border-[#1e1e22] bg-[#0f0f10] p-6">
              <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">PROFESSIONAL PROFILES</div>
              <div className="flex gap-3">
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#1e1e22] px-3 py-2 font-mono text-[10px] text-[#8a8a96] hover:text-[#c8a96b]">
                  <Linkedin size={12} /> LINKEDIN
                </a>
                <a href={PROFILE.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#1e1e22] px-3 py-2 font-mono text-[10px] text-[#8a8a96] hover:text-[#c8a96b]">
                  <Github size={12} /> GITHUB
                </a>
              </div>
            </section>
            <Link to="/schedule" className="flex items-center justify-center gap-2 border border-[#c8a96b]/40 px-4 py-3 font-mono text-xs text-[#c8a96b] hover:bg-[#c8a96b]/10">
              <CalendarDays size={13} /> REQUEST A MEETING
            </Link>
          </aside>
          <section className="border border-[#1e1e22] bg-[#0f0f10] p-6 sm:p-8">
            <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-6">SECURE INQUIRY</div>
            {state === 'sent' ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#4ade80]/10 border border-[#4ade80]/30 flex items-center justify-center">
                  <Send size={20} className="text-[#4ade80]" />
                </div>
                <h2 className="font-mono text-base text-[#f0efea] tracking-wider font-bold">TRANSMISSION RECEIVED</h2>
                <div className="inline-block bg-[#141416] border border-[#2a2a30] px-3 py-1.5 font-mono text-xs text-[#c8a96b]">
                  REFERENCE: {referenceId}
                </div>
                <p className="max-w-md mx-auto font-mono text-xs text-[#8a8a96] leading-relaxed">
                  Your message has been recorded into the dispatch registry. Abhishek will review and respond promptly.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <a
                    href={directMailtoUrl}
                    className="inline-flex items-center gap-2 bg-[#c8a96b] px-4 py-2.5 font-mono text-xs font-bold text-[#0a0a0b] hover:bg-[#d4b87a]"
                  >
                    <Mail size={13} /> DIRECT EMAIL (1-CLICK)
                  </a>
                  <button
                    onClick={copyDispatch}
                    className="inline-flex items-center gap-2 border border-[#2a2a30] px-4 py-2.5 font-mono text-xs text-[#f0efea] hover:border-[#c8a96b]/50"
                  >
                    {copied ? <Check size={13} className="text-[#4ade80]" /> : <Copy size={13} />}
                    {copied ? 'COPIED TO CLIPBOARD' : 'COPY DISPATCH'}
                  </button>
                </div>
                <div className="pt-6">
                  <button
                    onClick={() => {
                      setForm(initialForm);
                      setState('idle');
                    }}
                    className="font-mono text-xs text-[#8a8a96] hover:text-[#c8a96b]"
                  >
                    WRITE ANOTHER MESSAGE
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="absolute -left-[10000px]" aria-hidden="true">
                  <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={event => update('website', event.target.value)} /></label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="NAME" value={form.name} onChange={value => update('name', value)} required />
                  <Field label="EMAIL" value={form.email} onChange={value => update('email', value)} type="email" required />
                </div>
                <Field label="COMPANY" value={form.company} onChange={value => update('company', value)} required />
                <div>
                  <label htmlFor="subject" className="form-label">SUBJECT</label>
                  <select id="subject" value={form.subject} onChange={event => update('subject', event.target.value)} className="form-control">
                    {subjects.map(subject => <option key={subject}>{subject}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="form-label">MESSAGE</label>
                  <textarea id="message" rows={6} required minLength={10} value={form.message} onChange={event => update('message', event.target.value)} className="form-control resize-none" placeholder="Describe your inquiry or opportunity." />
                </div>
                {error && (
                  <div className="border border-red-500/30 bg-red-500/10 p-3 space-y-2">
                    <p role="alert" className="font-mono text-xs text-red-400">
                      Transmission notice: {error}
                    </p>
                    <a href={directMailtoUrl} className="inline-flex items-center gap-1.5 font-mono text-xs text-[#c8a96b] hover:underline">
                      <Mail size={12} /> Send directly via Email instead →
                    </a>
                  </div>
                )}
                <button disabled={state === 'sending'} className="w-full inline-flex justify-center items-center gap-2 bg-[#c8a96b] py-3 font-mono text-xs font-bold tracking-wider text-[#0a0a0b] disabled:opacity-50 hover:bg-[#d4b87a]">
                  <Send size={12} /> {state === 'sending' ? 'TRANSMITTING…' : 'SEND SECURE MESSAGE'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', required = false }) => <div><label className="form-label">{label}</label><input type={type} required={required} value={value} onChange={event => onChange(event.target.value)} className="form-control" /></div>;
