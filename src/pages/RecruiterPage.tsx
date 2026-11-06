import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, CheckCircle2, Copy, Download, FileSearch, Linkedin, Mail, Send } from 'lucide-react';
import { CASE_STUDIES, PROFILE } from '../data/portfolioData';
import { api } from '../lib/api';

const reasons = ['Job Opportunity', 'Interview Invitation', 'Role Fit Discussion', 'General Inquiry'];
const initialForm = { name: '', email: '', company: '', subject: reasons[0], message: '', website: '' };

export const RecruiterPage: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState('sending');
    setError('');
    try {
      const res = await api.submitContact(form);
      setReferenceId(res.id || `REC-${Date.now().toString(36).toUpperCase()}`);
      setState('sent');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Transmission failed.');
      setState('error');
    }
  };

  const copyDispatch = () => {
    const text = `RECRUITER DISPATCH\nReference: ${referenceId}\nRecruiter: ${form.name} (${form.email})\nCompany: ${form.company}\nReason: ${form.subject}\n\nMessage:\n${form.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const directMailtoUrl = `mailto:${PROFILE.email}?subject=${encodeURIComponent(`[${form.subject}] ${form.company} - ${form.name}`)}&body=${encodeURIComponent(
    `Hello Abhishek,\n\nRecruiter/Contact: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nReason: ${form.subject}\nReference: ${referenceId || 'RECRUITER-DIRECT'}\n\nMessage:\n${form.message}\n`
  )}`;

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <section className="border-b border-[#1e1e22] pb-12">
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-4">RECRUITER FAST TRACK / 30-SECOND BRIEFING</div>
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-end">
            <div>
              <h1 className="font-display text-5xl sm:text-7xl font-bold uppercase leading-[.92]">
                Abhishek<br /><span className="text-[#c8a96b]">Babariya</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#8a8a96]">
                Cybersecurity professional focused on digital forensics, incident response, security operations, threat detection, and investigation workflows.
              </p>
            </div>
            <div className="border border-[#1e1e22] bg-[#0f0f10] p-5 font-mono text-[10px]">
              <p className="text-[#c8a96b] tracking-widest">CURRENT PROFILE</p>
              <p className="mt-3 text-[#f0efea]">{PROFILE.currentRole}</p>
              <p className="mt-2 text-[#8a8a96]">{PROFILE.location}</p>
              <p className="mt-4 text-[#4ade80]">AVAILABLE FOR PROFESSIONAL CONVERSATIONS</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="/portfolio/resume/resume.pdf" download className="inline-flex items-center gap-2 px-5 py-3 bg-[#c8a96b] text-[#0a0a0b] font-mono text-xs font-bold hover:bg-[#d4b87a]">
              <Download size={13} /> DOWNLOAD RESUME
            </a>
            <Link to="/schedule" className="inline-flex items-center gap-2 px-5 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold hover:border-[#c8a96b]/50">
              <CalendarDays size={13} /> SCHEDULE INTERVIEW
            </Link>
            <Link to="/interview" className="inline-flex items-center gap-2 px-5 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold hover:border-[#c8a96b]/50">
              <FileSearch size={13} /> INTERVIEW DOSSIER
            </Link>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold hover:border-[#c8a96b]/50">
              <Linkedin size={13} /> LINKEDIN
            </a>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 py-12">
          <section>
            <div className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-5">CAREER SNAPSHOT</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['SPECIALIZATION', 'DFIR · Incident Response · SOC'],
                ['OPERATIONS', 'SIEM / EDR investigation'],
                ['DETECTION', 'KQL · MITRE ATT&CK mapping'],
                ['EDUCATION', 'M.Sc. Digital Forensics · 9.00 CGPA']
              ].map(([label, value]) => (
                <div key={label} className="border border-[#1e1e22] bg-[#0f0f10] p-5">
                  <p className="font-mono text-[9px] text-[#4a4a54] tracking-widest">{label}</p>
                  <p className="mt-3 text-sm text-[#f0efea]">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <div className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-5">SELECTED CASEWORK</div>
              <div className="space-y-3">
                {CASE_STUDIES.slice(0, 3).map(item => (
                  <Link key={item.id} to={`/projects/${item.slug}`} className="flex items-center justify-between gap-3 border border-[#1e1e22] bg-[#0f0f10] p-4 hover:border-[#c8a96b]/40">
                    <div>
                      <p className="font-mono text-xs text-[#f0efea]">{item.title}</p>
                      <p className="mt-1 font-mono text-[9px] text-[#8a8a96]">{item.classification} · {item.status}</p>
                    </div>
                    <ArrowRight size={14} className="text-[#c8a96b]" />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-[#1e1e22] bg-[#0f0f10] p-6">
            <div className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-5">FAST CONTACT</div>
            {state === 'sent' ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 size={32} className="mx-auto text-[#4ade80]" />
                <p className="font-mono text-sm text-[#f0efea] font-bold">MESSAGE RECEIVED</p>
                <div className="inline-block bg-[#141416] border border-[#2a2a30] px-3 py-1 font-mono text-xs text-[#c8a96b]">
                  REF: {referenceId}
                </div>
                <p className="text-xs text-[#8a8a96] max-w-sm mx-auto leading-relaxed">
                  Your inquiry has been logged. Abhishek will review and follow up promptly.
                </p>
                <div className="pt-3 flex flex-wrap justify-center gap-3">
                  <a href={directMailtoUrl} className="inline-flex items-center gap-2 bg-[#c8a96b] px-4 py-2 font-mono text-xs font-bold text-[#0a0a0b] hover:bg-[#d4b87a]">
                    <Mail size={12} /> DIRECT EMAIL (1-CLICK)
                  </a>
                  <button onClick={copyDispatch} className="inline-flex items-center gap-2 border border-[#2a2a30] px-4 py-2 font-mono text-xs text-[#f0efea] hover:border-[#c8a96b]/50">
                    {copied ? <Check size={12} className="text-[#4ade80]" /> : <Copy size={12} />}
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
                <div className="pt-4">
                  <button onClick={() => { setForm(initialForm); setState('idle'); }} className="font-mono text-xs text-[#8a8a96] hover:text-[#c8a96b]">
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="absolute -left-[10000px]" aria-hidden="true">
                  <label>Website<input tabIndex={-1} value={form.website} onChange={event => update('website', event.target.value)} /></label>
                </div>
                <Field label="YOUR NAME" value={form.name} required onChange={value => update('name', value)} />
                <Field label="WORK EMAIL" type="email" value={form.email} required onChange={value => update('email', value)} />
                <Field label="COMPANY" value={form.company} required onChange={value => update('company', value)} />
                <div>
                  <label className="form-label">REASON</label>
                  <select className="form-control" value={form.subject} onChange={event => update('subject', event.target.value)}>
                    {reasons.map(reason => <option key={reason}>{reason}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">MESSAGE</label>
                  <textarea required minLength={10} rows={5} className="form-control resize-none" value={form.message} onChange={event => update('message', event.target.value)} />
                </div>
                {error && (
                  <div className="border border-red-500/30 bg-red-500/10 p-3 space-y-2">
                    <p role="alert" className="font-mono text-xs text-red-400">Notice: {error}</p>
                    <a href={directMailtoUrl} className="inline-flex items-center gap-1.5 font-mono text-xs text-[#c8a96b] hover:underline">
                      <Mail size={12} /> Send directly via Email instead →
                    </a>
                  </div>
                )}
                <button disabled={state === 'sending'} className="w-full inline-flex items-center justify-center gap-2 bg-[#c8a96b] py-3 font-mono text-xs font-bold text-[#0a0a0b] disabled:opacity-50 hover:bg-[#d4b87a]">
                  <Send size={12} /> {state === 'sending' ? 'TRANSMITTING…' : 'SEND SECURE INQUIRY'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', required = false }) => <div><label className="form-label">{label}</label><input className="form-control" type={type} required={required} value={value} onChange={event => onChange(event.target.value)} /></div>;
