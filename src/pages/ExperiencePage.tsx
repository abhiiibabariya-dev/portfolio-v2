import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowLeft } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

export const ExperiencePage: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(EXPERIENCES[0]?.company ?? null);

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] mb-12 tracking-widest"><ArrowLeft size={11} /> HOME / EXPERIENCE</Link>
        <header className="mb-12">
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">02 / EXPERIENCE</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase leading-tight">Field<br />Record</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#8a8a96]">Security operations, digital forensics, incident response, and network engineering experience across enterprise and client environments.</p>
        </header>
        <div className="space-y-3">
          {EXPERIENCES.map(exp => {
            const key = `${exp.company}-${exp.role}`;
            const isExpanded = expanded === key;
            return <article key={key} className={`border bg-[#0f0f10] ${exp.status === 'CURRENT' ? 'border-[#c8a96b]/35' : 'border-[#1e1e22]'}`}>
              <button type="button" onClick={() => setExpanded(isExpanded ? null : key)} className="w-full p-5 sm:p-7 text-left" aria-expanded={isExpanded}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {exp.status === 'CURRENT' && <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[#4ade80]"><span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" /> CURRENT</span>}
                      <span className="font-mono text-[10px] text-[#4a4a54]">{exp.period}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#f0efea]">{exp.role}</h2>
                    <p className="font-mono text-xs text-[#c8a96b] mt-1">{exp.company}</p>
                    <p className="font-mono text-[10px] text-[#4a4a54] mt-1">{exp.department} · {exp.location}</p>
                  </div>
                  <ArrowDown size={16} className={`mt-1 shrink-0 text-[#c8a96b] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#8a8a96]">{exp.summary}</p>
              </button>
              {isExpanded && <div className="px-5 pb-6 sm:px-7 sm:pb-7 border-t border-[#1e1e22]">
                <div className="grid gap-6 pt-5 lg:grid-cols-[1fr_.7fr]">
                  <div><h3 className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-3">KEY RESPONSIBILITIES</h3><ul className="space-y-2.5">{exp.highlights.map(highlight => <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-[#8a8a96]"><span className="text-[#c8a96b]">›</span>{highlight}</li>)}</ul></div>
                  <div><h3 className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-3">TOOLS & DOMAINS</h3><div className="flex flex-wrap gap-1.5">{exp.technologies.map(technology => <span key={technology} className="border border-[#1e1e22] px-2 py-1 font-mono text-[9px] text-[#8a8a96]">{technology}</span>)}</div></div>
                </div>
              </div>}
            </article>;
          })}
        </div>
      </div>
    </div>
  );
};
