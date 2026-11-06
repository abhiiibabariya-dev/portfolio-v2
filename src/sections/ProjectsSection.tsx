import React, { useState } from 'react';
import { CASE_STUDIES, ProjectCaseStudy } from '../data/portfolioData';
import { CaseStudyModal } from '../components/cyber/CaseStudyModal';
import { Shield, ArrowRight, Terminal } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<ProjectCaseStudy | null>(null);

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          badge: 'bg-red-500/10 text-red-400 border-red-500/30',
          border: 'border-red-500/20 hover:border-red-500/60',
          glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]'
        };
      case 'HIGH':
        return {
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          border: 'border-amber-500/20 hover:border-amber-500/60',
          glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]'
        };
      case 'MEDIUM':
        return {
          badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          border: 'border-sky-500/20 hover:border-sky-500/60',
          glow: 'group-hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]'
        };
      default:
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          border: 'border-emerald-500/20 hover:border-emerald-500/60',
          glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]'
        };
    }
  };

  return (
    <section id="projects" className="py-20 bg-[#050505] text-zinc-100 border-b border-[#1c1c1c] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-xs text-[#00ff88] mb-3">
              <Shield size={13} />
              <span>CLASSIFIED INCIDENT DOSSIERS & LAB RECONSTRUCTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
              SECURITY CASE FILES
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-2 max-w-2xl">
              Real-world investigation methodologies, EDR memory triage, multi-source KQL hunting rules, and automated SOAR pipelines.
            </p>
          </div>

          <div className="font-mono text-xs text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
            TOTAL CASES: <span className="text-[#00ff88] font-bold">{CASE_STUDIES.length} DOSSIERS</span>
          </div>
        </div>

        {/* Grid of Case Files */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((c) => {
            const style = getSeverityStyle(c.severity);

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`bg-[#080d0b] border ${style.border} ${style.glow} rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer hover:-translate-y-1 relative overflow-hidden`}
              >
                {/* Top Corner Badge & Severity */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] pb-4 border-b border-[#1c2a23]">
                    <span className="text-[#00ff88] font-bold tracking-wider">{c.caseNumber}</span>
                    <span className={`px-2 py-0.5 rounded font-bold border ${style.badge}`}>
                      {c.severity}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mt-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                      {c.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-[#00ff88] transition-colors leading-tight">
                      {c.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed font-sans">
                      {c.tagline}
                    </p>
                  </div>

                  {/* Quantitative Metric Highlight */}
                  <div className="mt-4 p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-lg flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-400 text-[11px]">{c.outcomes[0]?.v || 'Investigation Metric'}</span>
                    <span className="text-[#00ff88] font-bold text-sm">{c.outcomes[0]?.k || '100%'}</span>
                  </div>

                  {/* MITRE ATT&CK Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[9px]">
                    {c.mitreTechniques.slice(0, 2).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[#38bdf8]">
                        {tech.split(' ')[0]}
                      </span>
                    ))}
                    {c.mitreTechniques.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500">
                        +{c.mitreTechniques.length - 2} MORE
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Trigger Bar */}
                <div className="mt-6 pt-4 border-t border-[#1c2a23] flex items-center justify-between font-mono text-xs text-zinc-400 group-hover:text-[#00ff88]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Terminal size={13} className="text-[#00ff88]" />
                    OPEN CASE DOSSIER
                  </span>
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Case Study Decrypt Modal */}
      <CaseStudyModal
        caseStudy={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </section>
  );
};
export default ProjectsSection;
