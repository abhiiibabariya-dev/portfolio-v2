import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CASE_STUDIES } from '../data/portfolioData';

const severityColor: Record<string, string> = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', INFORMATIONAL: '#4ade80' };

export const ProjectsPage: React.FC = () => (
  <div className="min-h-screen pt-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] mb-12 tracking-widest"><ArrowLeft size={11} /> HOME / CASE STUDIES</Link>
      <header className="mb-12"><div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">04 / INVESTIGATIONS</div><h1 className="font-display text-5xl sm:text-6xl font-bold uppercase leading-tight">Case<br />Archive</h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#8a8a96]">Documented lab, research, and proof-of-concept work covering forensic methodology, SOC automation, detection engineering, and evidence workflows.</p></header>
      <div className="space-y-4">{CASE_STUDIES.map((caseStudy, index) => <Link key={caseStudy.id} to={`/projects/${caseStudy.slug}`} className="group block border border-[#1e1e22] bg-[#0f0f10] p-5 sm:p-7 hover:border-[#c8a96b]/35"><div className="flex gap-5 sm:gap-8"><div className="font-mono text-3xl sm:text-4xl font-bold text-[#1e1e22] group-hover:text-[#c8a96b]/25">{String(index + 1).padStart(2, '0')}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 mb-3"><span className="font-mono text-[9px] text-[#4a4a54] tracking-widest">{caseStudy.caseNumber}</span><span className="border border-[#1e1e22] px-2 py-0.5 font-mono text-[9px] text-[#8a8a96]">{caseStudy.classification}</span><span className="border px-2 py-0.5 font-mono text-[9px]" style={{ color: severityColor[caseStudy.severity], borderColor: `${severityColor[caseStudy.severity]}55` }}>{caseStudy.severity}</span></div><h2 className="text-lg sm:text-xl font-bold leading-snug text-[#f0efea] group-hover:text-[#c8a96b]">{caseStudy.title}</h2><p className="mt-2 max-w-3xl font-mono text-[11px] leading-relaxed text-[#8a8a96]">{caseStudy.tagline}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#1e1e22] pt-4"><div className="flex flex-wrap gap-1.5">{caseStudy.tags.slice(0, 4).map(tag => <span key={tag} className="border border-[#1e1e22] px-1.5 py-0.5 font-mono text-[9px] text-[#4a4a54]">{tag}</span>)}</div><span className="inline-flex items-center gap-2 font-mono text-[10px] text-[#c8a96b]">OPEN CASE FILE <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" /></span></div></div></div></Link>)}</div>
    </div>
  </div>
);
