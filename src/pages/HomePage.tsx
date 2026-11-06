import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Download, Github, Linkedin, Terminal, Cpu } from 'lucide-react';
import { PROFILE, CASE_STUDIES } from '../data/portfolioData';
import { LiveThreatFeed } from '../components/cyber/LiveThreatFeed';
import { ThreatIntelExplorer } from '../components/cyber/ThreatIntelExplorer';

const severityColor: Record<string, string> = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#4ade80' };

export const HomePage: React.FC = () => (
  <div>
    <section className="relative min-h-screen flex flex-col justify-center pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_minmax(0,1fr)] gap-10 lg:gap-16 items-center min-h-[calc(100vh-56px)]">
          <div className="order-2 lg:order-1 space-y-6">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest text-[#8a8a96]">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#1e1e22] bg-[#0f0f10]"><span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" /> IDENTITY VERIFIED</span>
              <span>{PROFILE.location.toUpperCase()}</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[0.92] uppercase"><span className="text-[#f0efea]">Abhishek</span><br /><span className="text-[#c8a96b]">Babariya</span></h1>
            <div className="flex flex-wrap gap-2 font-mono text-[10px] tracking-widest text-[#8a8a96]">{['CYBERSECURITY OPERATIONS', 'DFIR', 'INCIDENT RESPONSE', 'THREAT DETECTION'].map(label => <span key={label} className="border border-[#1e1e22] px-2.5 py-1">{label}</span>)}</div>
            <p className="max-w-xl text-[#8a8a96] leading-relaxed">Cybersecurity professional focused on digital forensics, incident response, security operations, detection, monitoring, and investigation workflows.</p>
            <div className="flex flex-wrap gap-3"><Link to="/projects" className="inline-flex items-center gap-2 px-5 py-3 bg-[#c8a96b] text-[#0a0a0b] font-mono text-xs font-bold tracking-wider hover:bg-[#d4b87a]">ENTER PORTFOLIO <ArrowRight size={13} /></Link><a href="/portfolio/resume/resume.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold tracking-wider hover:border-[#c8a96b]/50 hover:text-[#c8a96b]"><Download size={12} /> VIEW RESUME</a><Link to="/schedule" className="inline-flex items-center gap-2 px-5 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold tracking-wider hover:border-[#c8a96b]/50 hover:text-[#c8a96b]"><CalendarDays size={12} /> SCHEDULE INTERVIEW</Link></div>
            <div className="grid grid-cols-3 gap-3 max-w-md text-left font-mono text-[10px] text-[#8a8a96]">
              <div><span className="block text-[9px] text-[#4a4a54] tracking-widest mb-1">SYSTEM STATUS</span><span className="inline-flex items-center gap-1.5 text-[#4ade80] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" /> ONLINE</span></div>
              <div><span className="block text-[9px] text-[#4a4a54] tracking-widest mb-1">SPECIALIZATION</span><span className="text-[#f0efea]">DFIR / SOC</span></div>
              <div><span className="block text-[9px] text-[#4a4a54] tracking-widest mb-1">FOCUS</span><span className="text-[#f0efea]">DETECTION / RESPONSE</span></div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-[#8a8a96]"><a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#c8a96b]"><Linkedin size={13} /> LinkedIn</a><a href={PROFILE.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#c8a96b]"><Github size={13} /> GitHub</a><Link to="/contact" className="hover:text-[#c8a96b]">CONTACT SECURELY</Link></div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center"><div className="relative w-full max-w-sm lg:max-w-md"><div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-[#c8a96b]/40" /><div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-[#c8a96b]/40" /><div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-[#c8a96b]/40" /><div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-[#c8a96b]/40" /><div className="border border-[#1e1e22] bg-[#0f0f10] overflow-hidden aspect-[4/5] w-full max-w-[320px] mx-auto"><img src="/portfolio/images/hero/portrait.png" alt="Abhishek Babariya" className="w-full h-full object-cover object-top" loading="eager" onError={e => { const image = e.currentTarget; image.style.display = 'none'; const parent = image.parentElement; if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="font-mono text-3xl font-bold text-[#c8a96b]">AB</span></div>`; }} /></div><div className="border-x border-b border-[#1e1e22] bg-[#0f0f10] px-4 py-3 max-w-[320px] mx-auto"><div className="flex justify-between items-start"><div><div className="font-mono text-[9px] text-[#4a4a54] tracking-widest">IDENTITY VERIFIED</div><div className="font-mono text-[11px] text-[#f0efea] font-bold mt-1">ABHISHEK BABARIYA</div></div><div className="font-mono text-[10px] text-[#4ade80] font-semibold uppercase tracking-widest mt-0.5">ACTIVE</div></div></div><div className="mt-3 grid grid-cols-3 gap-2 max-w-[320px] mx-auto font-mono text-center text-[10px]"><div className="border border-[#1e1e22] bg-[#0f0f10] p-2.5"><span className="block text-[#c8a96b] font-bold text-sm">100+</span><span className="block text-[#4a4a54] mt-0.5 leading-tight">Alerts Triaged</span></div><div className="border border-[#1e1e22] bg-[#0f0f10] p-2.5"><span className="block text-[#c8a96b] font-bold text-sm">9.00</span><span className="block text-[#4a4a54] mt-0.5 leading-tight">M.Sc. CGPA</span></div><div className="border border-[#1e1e22] bg-[#0f0f10] p-2.5"><span className="block text-[#c8a96b] font-bold text-sm">80%</span><span className="block text-[#4a4a54] mt-0.5 leading-tight">Triage Reduction</span></div></div></div></div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1e1e22]" />
    </section>

    {/* Real-time simulated SOC incident telemetry ticker */}
    <LiveThreatFeed />

    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">SELECTED WORK</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">Investigation<br />Highlights</h2>
          </div>
          <Link to="/projects" className="flex items-center gap-2 font-mono text-xs text-[#8a8a96] hover:text-[#c8a96b] group">VIEW ALL CASE STUDIES <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CASE_STUDIES.map(study => <Link key={study.id} to={`/projects/${study.slug}`} className="border border-[#1e1e22] bg-[#0f0f10] p-6 hover:border-[#c8a96b]/30 group block"><div className="flex items-start justify-between gap-4 mb-4"><div><div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">{study.caseNumber}</div><div className="flex flex-wrap gap-2"><span className="font-mono text-[9px] px-2 py-0.5 border font-semibold" style={{ color: severityColor[study.severity], borderColor: `${severityColor[study.severity]}40` }}>{study.severity}</span><span className="font-mono text-[9px] px-2 py-0.5 border border-[#1e1e22] text-[#8a8a96]">{study.classification}</span></div></div><ArrowRight size={14} className="text-[#4a4a54] group-hover:text-[#c8a96b] transition-all mt-1 shrink-0" /></div><h3 className="text-base font-semibold text-[#f0efea] mb-2 group-hover:text-[#c8a96b] leading-snug">{study.title}</h3><p className="font-mono text-[10px] text-[#4a4a54] mb-4 leading-relaxed">{study.tagline}</p><div className="flex items-center justify-between pt-3 border-t border-[#1e1e22]"><span className="font-mono text-[9px] text-[#4a4a54]">{study.role}</span><span className="font-mono text-[9px] text-[#c8a96b]">OPEN CASE FILE →</span></div></Link>)}
        </div>
      </div>
    </section>

    {/* Interactive MITRE ATT&CK Matrix & Threat Intel Explorer */}
    <ThreatIntelExplorer />

    {/* Interactive SOC Telemetry Lab Teaser */}
    <section className="py-16 border-t border-[#1e1e22] bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border border-[#24503a] bg-[#050806] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(74,222,128,0.06)]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#4ade80]/10 border border-[#4ade80]/30 font-mono text-[10px] text-[#4ade80]">
              <Cpu size={12} />
              <span>4 ARCHITECTURE VISUALIZERS READY</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#f0efea]">
              Explore Interactive SOC Labs
            </h3>
            <p className="font-mono text-xs text-[#8a8a96] max-w-xl leading-relaxed">
              Step through live hybrid network topology models, deep forensic memory/filesystem evidence branches, automated SOC ingestion pipelines, and attack process lineage trees.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/visualizations"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#4ade80] text-[#0a0a0b] font-mono text-xs font-bold tracking-wider hover:bg-[#38c86e] transition-colors"
            >
              LAUNCH LAB MODELS <ArrowRight size={13} />
            </Link>
            <Link
              to="/terminal"
              className="inline-flex items-center gap-2 px-4 py-3 border border-[#1e1e22] bg-[#0a0a0b] text-[#f0efea] font-mono text-xs font-bold hover:border-[#c8a96b]/40 hover:text-[#c8a96b] transition-colors"
            >
              <Terminal size={13} /> OPEN CLI
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="border-t border-[#1e1e22] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-6">RECRUITER QUICK PROFILE</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[['NAME', PROFILE.name], ['CURRENT ROLE', PROFILE.currentRole], ['SPECIALIZATION', 'DFIR / INCIDENT RESPONSE / SOC'], ['EDUCATION', 'M.Sc. Digital Forensics']].map(([label, value]) => <div key={label} className="border border-[#1e1e22] bg-[#0f0f10] p-4"><div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">{label}</div><div className="text-sm text-[#f0efea]">{value}</div></div>)}
        </div>
        <div className="flex flex-wrap gap-3 mt-6"><a href="/portfolio/resume/resume.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-[#c8a96b] text-[#0a0a0b] font-mono text-xs font-bold tracking-wider"><Download size={12} /> DOWNLOAD RESUME</a><Link to="/schedule" className="inline-flex items-center gap-2 px-5 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold tracking-wider hover:border-[#c8a96b]/50 hover:text-[#c8a96b]"><CalendarDays size={12} /> SCHEDULE INTERVIEW</Link><a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold tracking-wider hover:border-[#c8a96b]/50 hover:text-[#c8a96b]"><Linkedin size={12} /> CONNECT ON LINKEDIN</a></div>
      </div>
    </section>
  </div>
);
