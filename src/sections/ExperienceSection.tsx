import React, { useState } from 'react';
import { EXPERIENCES, EDUCATION } from '../data/portfolioData';
import { Briefcase, GraduationCap, MapPin, Building2, ChevronRight, Award, Shield, CheckCircle2 } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="py-20 bg-[#050505] text-zinc-100 border-b border-[#1c1c1c] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-xs text-[#00ff88] mb-3">
              <Briefcase size={13} />
              <span>VERIFIED OPERATIONAL TIMELINE & FIELD RECORD</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
              CAREER & EDUCATION
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-2 max-w-2xl">
              Enterprise SOC operations, digital forensics investigations at ICICI Bank, SIEM deployments at TechOwl, and academic distinction at NFSU.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Briefcase size={14} />
              <span>EXPERIENCE ({EXPERIENCES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'education'
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <GraduationCap size={14} />
              <span>EDUCATION ({EDUCATION.length})</span>
            </button>
          </div>
        </div>

        {/* Experience Timeline */}
        {activeTab === 'experience' && (
          <div className="relative border-l-2 border-[#1c2a23] ml-3 md:ml-6 pl-6 md:pl-10 space-y-8">
            {EXPERIENCES.map((exp, idx) => {
              const isExpanded = expandedIndex === idx;
              const isCurrent = exp.status === 'CURRENT';

              return (
                <div key={idx} className="relative group">
                  {/* Timeline Pulse Node */}
                  <div
                    className={`absolute -left-[31px] md:-left-[47px] top-6 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#00ff88] border-[#00ff88] shadow-[0_0_15px_#00ff88]'
                        : 'bg-zinc-950 border-zinc-700 group-hover:border-[#00ff88]'
                    }`}
                  />

                  {/* Card Container */}
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className={`bg-[#080d0b] border ${
                      isCurrent ? 'border-[#00ff88]/40' : 'border-[#1f2e26]'
                    } hover:border-[#00ff88]/60 rounded-2xl p-6 sm:p-7 transition-all duration-300 cursor-pointer ${
                      isCurrent ? 'shadow-[0_0_30px_rgba(0,255,136,0.06)]' : ''
                    }`}
                  >
                    {/* Top Row: Dates, Badge, Location */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#1c2a23]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                            isCurrent
                              ? 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/40 animate-pulse'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                          }`}
                        >
                          {exp.period}
                        </span>
                        {isCurrent && (
                          <span className="font-mono text-[10px] text-[#00ff88] font-bold bg-[#00ff88]/10 px-2 py-0.5 rounded">
                            ACTIVE APPOINTMENT
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 font-mono text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-[#00ff88]" />
                          {exp.location}
                        </span>
                        <span className="hidden sm:inline text-zinc-600">|</span>
                        <span className="hidden sm:flex items-center gap-1.5">
                          <Building2 size={12} className="text-zinc-500" />
                          {exp.department}
                        </span>
                      </div>
                    </div>

                    {/* Role & Company Header */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white font-sans group-hover:text-[#00ff88] transition-colors">
                          {exp.role}
                        </h3>
                        <div className="font-mono text-sm text-[#00ff88] font-semibold mt-0.5">
                          {exp.company}
                        </div>
                      </div>

                      <div className="font-mono text-xs text-zinc-400 flex items-center gap-1 self-start sm:self-center">
                        <span>{isExpanded ? 'COLLAPSE DOSSIER' : 'EXPAND DOSSIER'}</span>
                        <ChevronRight
                          size={15}
                          className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Summary Description */}
                    <p className="mt-3 text-sm text-zinc-300 font-sans leading-relaxed">
                      {exp.summary}
                    </p>

                    {/* Expanded Highlights */}
                    {isExpanded && (
                      <div className="mt-5 pt-4 border-t border-[#1c2a23] space-y-3 font-sans animate-fadeIn">
                        <div className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                          Key Operational Accomplishments:
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                          {exp.highlights.map((point, pidx) => (
                            <li key={pidx} className="flex items-start gap-2.5">
                              <CheckCircle2 size={14} className="text-[#00ff88] shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technology Chips */}
                    <div className="mt-5 pt-4 border-t border-[#1c2a23] flex flex-wrap gap-1.5 font-mono text-[10px]">
                      {exp.technologies.map((tech, tidx) => (
                        <span
                          key={tidx}
                          className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-[#00ff88]/40 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Education Timeline */}
        {activeTab === 'education' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDUCATION.map((edu, idx) => (
              <div
                key={idx}
                className="bg-[#080d0b] border border-[#1f2e26] hover:border-[#00ff88]/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#1c2a23] font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 font-bold">
                      {edu.period}
                    </span>
                    <span className="text-[#00ff88] font-bold">{edu.grade}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-4 group-hover:text-[#00ff88] transition-colors leading-snug">
                    {edu.degree}
                  </h3>

                  <div className="font-mono text-xs text-zinc-300 mt-2 flex items-center gap-1.5 font-semibold">
                    <Building2 size={13} className="text-[#00ff88]" />
                    <span>{edu.institution}</span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5">
                    <MapPin size={11} />
                    <span>{edu.location}</span>
                  </div>

                  <div className="mt-5 space-y-2">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
                      Core Specialized Coursework:
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                      {edu.courses.map((course, cidx) => (
                        <span
                          key={cidx}
                          className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1c2a23] flex items-center justify-between font-mono text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Shield size={13} className="text-[#00ff88]" />
                    {idx === 0 ? 'NATIONAL FORENSIC EXCELLENCE' : 'FOUNDATIONAL IT ARCHITECTURE'}
                  </span>
                  <Award size={14} className="text-[#00ff88]" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
export default ExperienceSection;
