import React, { useState } from 'react';
import { Mail, Linkedin, Github, Download, Send, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact: ${form.name}`);
    const body = encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:abhibabariya007@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 border-b border-[#1e1e22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left */}
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-4">07 / CONTACT</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0efea] uppercase leading-tight mb-6">
              Let's Talk<br />Security.
            </h2>
            <p className="text-[#8a8a96] leading-relaxed mb-8">
              Open to cybersecurity opportunities in SOC, DFIR, incident response,
              threat detection, and security engineering. Available for full-time roles,
              contract engagements, and security consultations.
            </p>

            {/* Open to */}
            <div className="border border-[#1e1e22] bg-[#0f0f10] p-5 mb-6">
              <div className="font-mono text-[10px] text-[#4a4a54] tracking-widest mb-3">OPEN TO</div>
              <div className="space-y-2">
                {[
                  'SOC Analyst / Senior SOC Analyst',
                  'DFIR Analyst / Incident Responder',
                  'Threat Detection Engineer',
                  'Security Operations Engineer',
                  'Cloud Security Analyst',
                ].map(role => (
                  <div key={role} className="flex items-center gap-2.5 text-sm text-[#8a8a96]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct links */}
            <div className="space-y-2">
              <a
                href="mailto:abhibabariya007@gmail.com"
                className="flex items-center gap-3 p-3 border border-[#1e1e22] bg-[#0f0f10] hover:border-[#c8a96b]/30 transition-all group"
              >
                <Mail size={16} className="text-[#c8a96b]" />
                <span className="font-mono text-xs text-[#8a8a96] group-hover:text-[#f0efea] transition-colors">
                  abhibabariya007@gmail.com
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/babariya-abhishek-0085691b4/"
                target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 border border-[#1e1e22] bg-[#0f0f10] hover:border-[#c8a96b]/30 transition-all group"
              >
                <Linkedin size={16} className="text-[#c8a96b]" />
                <span className="font-mono text-xs text-[#8a8a96] group-hover:text-[#f0efea] transition-colors">
                  linkedin.com/in/babariya-abhishek-0085691b4
                </span>
              </a>
              <a
                href="https://github.com/abhiiibabariya-dev"
                target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 border border-[#1e1e22] bg-[#0f0f10] hover:border-[#c8a96b]/30 transition-all group"
              >
                <Github size={16} className="text-[#c8a96b]" />
                <span className="font-mono text-xs text-[#8a8a96] group-hover:text-[#f0efea] transition-colors">
                  github.com/abhiiibabariya-dev
                </span>
              </a>
              <a
                href="/portfolio/resume/resume.pdf"
                target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 border border-[#c8a96b]/30 bg-[#c8a96b]/5 hover:bg-[#c8a96b]/10 transition-all group"
              >
                <Download size={16} className="text-[#c8a96b]" />
                <span className="font-mono text-xs text-[#c8a96b] font-semibold">
                  DOWNLOAD RESUME (PDF)
                </span>
              </a>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="border border-[#1e1e22] bg-[#0f0f10] p-6 sm:p-8 space-y-5">
              <div className="font-mono text-[10px] text-[#4a4a54] tracking-widest mb-2">SEND A MESSAGE</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-[#4a4a54] tracking-widest mb-2">NAME</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full bg-[#0a0a0b] border border-[#1e1e22] px-4 py-3 font-mono text-sm text-[#f0efea] placeholder:text-[#2a2a30] focus:border-[#c8a96b]/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#4a4a54] tracking-widest mb-2">EMAIL</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full bg-[#0a0a0b] border border-[#1e1e22] px-4 py-3 font-mono text-sm text-[#f0efea] placeholder:text-[#2a2a30] focus:border-[#c8a96b]/50 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#4a4a54] tracking-widest mb-2">MESSAGE</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Describe the opportunity or your question..."
                  className="w-full bg-[#0a0a0b] border border-[#1e1e22] px-4 py-3 font-mono text-sm text-[#f0efea] placeholder:text-[#2a2a30] focus:border-[#c8a96b]/50 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-3 w-full sm:w-auto px-8 py-3 bg-[#c8a96b] text-[#0a0a0b] font-mono text-xs font-bold tracking-wider hover:bg-[#d4b87a] transition-all group cursor-pointer"
              >
                {sent ? (
                  <>
                    <CheckCircle size={15} />
                    EMAIL CLIENT OPENED
                  </>
                ) : (
                  <>
                    <Send size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    SEND MESSAGE
                  </>
                )}
              </button>

              <p className="font-mono text-[10px] text-[#4a4a54]">
                Submitting opens your email client with this message pre-filled.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
