import React, { useState } from 'react';
import { PROFILE } from '../data/portfolioData';
import { Mail, Phone, Linkedin, Github, Send, ShieldCheck, Copy, Check, Terminal, Lock, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
      `[SECURITY INQUIRY] ${formData.subject || 'Portfolio Contact'}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <section id="contact" className="py-20 bg-[#050505] text-zinc-100 border-b border-[#1c1c1c] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-xs text-[#00ff88] mb-3">
              <Lock size={13} />
              <span>SECURE DIRECT COMMUNICATION VECTOR</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
              ESTABLISH CONTACT
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-2 max-w-2xl">
              Open for security operations consulting, DFIR incident investigations, detection engineering collaborations, and technical leadership roles.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
            <span>DIRECT CHANNELS MONITORED</span>
          </div>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Direct Communication Cards */}
          <div className="space-y-4">
            {/* Email Card */}
            <div className="bg-[#080d0b] border border-[#1f2e26] hover:border-[#00ff88]/50 rounded-2xl p-6 transition-all duration-300 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-2 font-bold text-white">
                  <Mail size={15} className="text-[#00ff88]" /> PRIMARY EMAIL
                </span>
                <button
                  onClick={() => copyText(PROFILE.email, 'email')}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Copy email"
                >
                  {copiedField === 'email' ? <Check size={14} className="text-[#00ff88]" /> : <Copy size={14} />}
                </button>
              </div>
              <a
                href={`mailto:${PROFILE.email}`}
                className="text-sm text-[#00ff88] hover:underline font-bold block break-all pt-1"
              >
                {PROFILE.email}
              </a>
              <span className="text-[10px] text-zinc-500 block">PGP / TLS 1.3 Encrypted In transit</span>
            </div>

            {/* Phone Card */}
            <div className="bg-[#080d0b] border border-[#1f2e26] hover:border-[#00ff88]/50 rounded-2xl p-6 transition-all duration-300 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-2 font-bold text-white">
                  <Phone size={15} className="text-[#38bdf8]" /> DIRECT PHONE
                </span>
                <button
                  onClick={() => copyText(PROFILE.phone, 'phone')}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Copy phone"
                >
                  {copiedField === 'phone' ? <Check size={14} className="text-[#00ff88]" /> : <Copy size={14} />}
                </button>
              </div>
              <a
                href={`tel:${PROFILE.phone}`}
                className="text-sm text-zinc-200 hover:text-[#00ff88] font-bold block pt-1"
              >
                {PROFILE.phone}
              </a>
              <span className="text-[10px] text-zinc-500 block">Signal / WhatsApp / Voice</span>
            </div>

            {/* Social Network Profiles */}
            <div className="bg-[#080d0b] border border-[#1f2e26] rounded-2xl p-6 space-y-3 font-mono text-xs">
              <span className="text-zinc-400 font-bold block pb-2 border-b border-[#1c2a23]">
                VERIFIED PROFILES
              </span>

              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-[#00ff88]/60 text-zinc-200 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Linkedin size={15} className="text-[#0077b5]" /> LinkedIn Dossier
                </span>
                <ExternalLink size={13} className="text-zinc-500" />
              </a>

              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-[#00ff88]/60 text-zinc-200 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Github size={15} className="text-zinc-300" /> GitHub Repositories
                </span>
                <ExternalLink size={13} className="text-zinc-500" />
              </a>
            </div>
          </div>

          {/* Right Column: Encrypted Message Dispatch Terminal */}
          <div className="lg:col-span-2 bg-[#080d0b] border border-[#1f2e26] rounded-2xl p-6 sm:p-8 font-mono text-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2a23]">
              <span className="text-[#00ff88] font-bold tracking-wider flex items-center gap-2">
                <Terminal size={14} /> TRANSMIT ENCRYPTED INQUIRY
              </span>
              <span className="text-zinc-500 text-[10px]">DIRECT DISPATCH</span>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] uppercase font-bold">Your Identity / Call-sign</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe / SecOps Lead"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder:text-zinc-600 outline-none focus:border-[#00ff88]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] uppercase font-bold">Return Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@organization.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder:text-zinc-600 outline-none focus:border-[#00ff88]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 text-[10px] uppercase font-bold">Inquiry Topic</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. DFIR Investigation / Threat Hunting Role / Detection Review"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder:text-zinc-600 outline-none focus:border-[#00ff88]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 text-[10px] uppercase font-bold">Transmission Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide incident context, technical collaboration scope, or project details..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder:text-zinc-600 outline-none focus:border-[#00ff88] resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-zinc-500 text-[10px] flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#00ff88]" />
                  <span>Opens your default mail client with formatted headers</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,255,136,0.2)] cursor-pointer"
                >
                  <Send size={14} />
                  <span>TRANSMIT DISPATCH</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
export default ContactSection;
