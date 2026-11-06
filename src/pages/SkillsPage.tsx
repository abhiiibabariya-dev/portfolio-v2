import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

const capability = (level: number) => level >= 90 ? 'ADVANCED PRACTICE' : level >= 85 ? 'PRACTICAL EXPERIENCE' : 'WORKING KNOWLEDGE';

export const SkillsPage: React.FC = () => (
  <div className="min-h-screen pt-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] mb-12 tracking-widest"><ArrowLeft size={11} /> HOME / CAPABILITIES</Link>
      <header className="mb-12">
        <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">05 / TECHNICAL CAPABILITIES</div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase leading-tight">Skill<br />Matrix</h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#8a8a96]">Tools, platforms, and methods used across DFIR, security operations, cloud investigation, and detection engineering. Capability labels communicate practical exposure rather than unsupported percentage scores.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {SKILL_CATEGORIES.map(category => <section key={category.code} className="border border-[#1e1e22] bg-[#0f0f10] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-[#1e1e22]"><div><div className="font-mono text-[9px] text-[#4a4a54] tracking-widest">{category.code}</div><h2 className="mt-1 font-mono text-sm font-bold text-[#f0efea]">{category.title}</h2></div><span className="font-mono text-[9px] text-[#c8a96b]">{category.skills.length} TOOLS</span></div>
          <ul className="space-y-2">{category.skills.map(skill => <li key={skill.name} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-[#1e1e22]/70 py-2.5 last:border-0"><span className="font-mono text-[11px] text-[#f0efea]">{skill.name}{skill.tag && <span className="ml-2 border border-[#1e1e22] px-1.5 py-0.5 text-[8px] text-[#4a4a54]">{skill.tag}</span>}</span><span className="font-mono text-[9px] text-[#c8a96b]">{capability(skill.level)}</span></li>)}</ul>
        </section>)}
      </div>
    </div>
  </div>
);
