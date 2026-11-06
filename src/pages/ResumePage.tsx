import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { CASE_STUDIES, CERTIFICATIONS, EDUCATION, EXPERIENCES, PROFILE, SKILL_CATEGORIES } from '../data/portfolioData';

const resumeUrl = '/portfolio/resume/resume.pdf';

export const ResumePage: React.FC = () => (
  <div className="min-h-screen pt-14">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] mb-12 tracking-widest"><ArrowLeft size={11} /> HOME / RESUME</Link>
      <header className="border-b border-[#1e1e22] pb-10 mb-10">
        <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">08 / PROFESSIONAL RECORD</div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase leading-tight">Resume</h1>
        <p className="mt-5 max-w-3xl text-[#8a8a96] leading-relaxed">Cybersecurity professional specializing in digital forensics, incident response, security operations, threat detection, and investigation workflows.</p>
        <div className="flex flex-wrap gap-3 mt-7">
          <a href={resumeUrl} download className="inline-flex items-center gap-2 px-5 py-3 bg-[#c8a96b] text-[#0a0a0b] font-mono text-xs font-bold tracking-wider"><Download size={13} /> DOWNLOAD RESUME PDF</a>
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold tracking-wider hover:border-[#c8a96b]/50"><ExternalLink size={13} /> VIEW RESUME</a>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_.85fr] gap-8">
        <div className="space-y-9">
          <section><h2 className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-4">EXPERIENCE</h2><div className="space-y-5">{EXPERIENCES.map(exp => <article key={`${exp.company}-${exp.role}`} className="border border-[#1e1e22] bg-[#0f0f10] p-5"><div className="flex flex-col sm:flex-row sm:justify-between gap-2"><div><h3 className="font-semibold text-[#f0efea]">{exp.role} · {exp.company}</h3><p className="font-mono text-[10px] text-[#c8a96b] mt-1">{exp.department}</p></div><span className="font-mono text-[10px] text-[#4a4a54]">{exp.period}</span></div><p className="text-sm text-[#8a8a96] leading-relaxed mt-3">{exp.summary}</p></article>)}</div></section>
          <section><h2 className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-4">SELECTED CASE STUDIES</h2><div className="space-y-2">{CASE_STUDIES.map(cs => <Link key={cs.id} to={`/projects/${cs.slug}`} className="flex items-center justify-between gap-4 border border-[#1e1e22] bg-[#0f0f10] p-4 hover:border-[#c8a96b]/40"><span className="font-mono text-xs text-[#f0efea]">{cs.caseNumber} · {cs.title}</span><span className="font-mono text-[9px] text-[#c8a96b] shrink-0">OPEN →</span></Link>)}</div></section>
        </div>
        <aside className="space-y-7">
          <section><h2 className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-4">CONTACT</h2><div className="font-mono text-xs text-[#8a8a96] space-y-2"><Link className="block hover:text-[#c8a96b]" to="/contact">SEND SECURE INQUIRY</Link><span className="block">{PROFILE.phone}</span><span className="block">{PROFILE.location}</span></div></section>
          <section><h2 className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-4">EDUCATION</h2><div className="space-y-4">{EDUCATION.map(edu => <div key={edu.degree}><p className="text-sm text-[#f0efea] leading-snug">{edu.degree}</p><p className="font-mono text-[10px] text-[#8a8a96] mt-1">{edu.institution}</p><p className="font-mono text-[9px] text-[#4a4a54] mt-1">{edu.period} · {edu.grade}</p></div>)}</div></section>
          <section><h2 className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-4">CAPABILITIES</h2><div className="flex flex-wrap gap-1.5">{SKILL_CATEGORIES.flatMap(category => category.skills.slice(0, 3)).map(skill => <span key={skill.name} className="font-mono text-[9px] border border-[#1e1e22] text-[#8a8a96] px-2 py-1">{skill.name}</span>)}</div></section>
          <section><h2 className="font-mono text-[10px] text-[#c8a96b] tracking-widest mb-4">CERTIFICATIONS</h2><p className="font-mono text-xs text-[#8a8a96]">{CERTIFICATIONS.length} credential records available.</p></section>
        </aside>
      </div>
    </div>
  </div>
);
