import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Mail, ShieldCheck, Search, Siren, Wrench } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

const disciplines = [
  { title: 'INVESTIGATE', icon: Search, text: 'Examine endpoint, cloud, network, and log evidence to build defensible incident timelines.' },
  { title: 'DETECT', icon: ShieldCheck, text: 'Use SIEM, EDR, KQL, and ATT&CK mapping to identify and validate suspicious activity.' },
  { title: 'RESPOND', icon: Siren, text: 'Support containment, evidence preservation, root-cause analysis, and remediation workflows.' },
  { title: 'ENGINEER', icon: Wrench, text: 'Develop practical detection logic, automation workflows, and repeatable investigation playbooks.' },
];

export const AboutPage: React.FC = () => (
  <div className="min-h-screen pt-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] mb-12 tracking-widest"><ArrowLeft size={11} /> HOME / ABOUT</Link>
      <header className="grid gap-8 lg:grid-cols-[1.35fr_.65fr] items-end mb-14">
        <div><div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">01 / IDENTITY</div><h1 className="font-display text-5xl sm:text-6xl font-bold uppercase leading-[.95]">Investigate.<br />Detect. Respond.</h1><p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#8a8a96]">Cybersecurity professional focused on digital forensics, incident response, security operations, threat detection, and investigation workflows.</p></div>
        <div className="border border-[#1e1e22] bg-[#0f0f10] p-5"><div className="font-mono text-[9px] text-[#4a4a54] tracking-widest">CURRENT FOCUS</div><p className="mt-2 font-mono text-sm text-[#f0efea]">{PROFILE.currentRole}</p><p className="mt-1 font-mono text-[10px] text-[#c8a96b]">{PROFILE.currentOrg}</p></div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[.7fr_1.3fr] gap-6 mb-10">
        <aside className="border border-[#1e1e22] bg-[#0f0f10] overflow-hidden"><div className="aspect-[4/5] bg-[#080808]"><img src="/portfolio/images/hero/portrait.png" alt="Abhishek Babariya" className="w-full h-full object-cover object-top" onError={event => { event.currentTarget.style.display = 'none'; }} /></div><div className="p-5 border-t border-[#1e1e22]"><h2 className="font-mono text-base font-bold text-[#f0efea]">{PROFILE.name}</h2><div className="mt-4 space-y-2 font-mono text-[10px] text-[#8a8a96]"><a href={`mailto:${PROFILE.email}`} className="flex gap-2 hover:text-[#c8a96b]"><Mail size={12} className="text-[#c8a96b]" />{PROFILE.email}</a><span className="flex gap-2"><MapPin size={12} className="text-[#c8a96b]" />{PROFILE.location}</span></div></div></aside>
        <div className="space-y-6"><section className="border border-[#1e1e22] bg-[#0f0f10] p-6 sm:p-8"><div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">PROFESSIONAL PROFILE</div><div className="space-y-4 text-sm leading-relaxed text-[#8a8a96]"><p>I work across DFIR, incident response, and security operations with experience in enterprise banking security, SOC operations, and network engineering.</p><p>I hold an M.Sc. in Digital Forensics &amp; Information Security from the National Forensic Sciences University, with a CGPA of 9.00/10.00. My approach emphasizes evidence integrity, repeatable methodology, and clear communication of technical findings.</p></div></section><div className="grid sm:grid-cols-2 gap-4">{disciplines.map(({ title, icon: Icon, text }) => <section key={title} className="border border-[#1e1e22] bg-[#0f0f10] p-5"><Icon size={15} className="text-[#c8a96b]" /><h2 className="mt-4 font-mono text-xs font-bold text-[#f0efea]">{title}</h2><p className="mt-2 text-sm leading-relaxed text-[#8a8a96]">{text}</p></section>)}</div></div>
      </div>
      <section className="border-t border-[#1e1e22] pt-10"><div className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-5">SPECIALIZATION</div><div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{[['ROLE', PROFILE.currentRole], ['EDUCATION', 'M.Sc. Digital Forensics & Information Security'], ['LOCATION', PROFILE.location]].map(([label, value]) => <div key={label} className="border border-[#1e1e22] bg-[#0f0f10] p-4"><div className="font-mono text-[9px] text-[#4a4a54] tracking-widest">{label}</div><p className="mt-2 text-sm text-[#f0efea]">{value}</p></div>)}</div></section>
    </div>
  </div>
);
