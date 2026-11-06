import React from 'react';
import { PROFILE } from '../data/portfolioData';
import { Shield, Terminal, CheckCircle2, UserCheck, Activity } from 'lucide-react';

interface AboutSectionProps {
  onOpenTerminal?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenTerminal }) => {
  return (
    <section id="about" className="py-20 bg-[#050806] text-zinc-100 border-b border-[#1c1c1c] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-xs text-[#00ff88] mb-3">
              <UserCheck size={13} />
              <span>SECURITY OPERATOR DOSSIER // DECLASSIFIED</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
              ABOUT THE INVESTIGATOR
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-2 max-w-2xl">
              DFIR Analyst, SOC Investigator, and Security Engineer dedicated to evidence-driven threat elimination.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            <span>ICICI BANK · DFIR & RISK</span>
          </div>
        </div>

        {/* Main Grid: Operator Bio & Quantitative Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Bio Narrative & Core Philosophy */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#080d0b] border border-[#1f2e26] rounded-2xl p-6 sm:p-8 space-y-4 font-sans text-sm text-zinc-300 leading-relaxed">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c2a23] font-mono text-xs">
                <span className="text-[#00ff88] font-bold tracking-wider">
                  PRIMARY MISSION STATEMENT
                </span>
                <span className="text-zinc-500 text-[10px]">OPERATOR ID: ABHI_SEC</span>
              </div>

              <p className="text-base font-medium text-white leading-relaxed">
                I am a Cybersecurity Analyst and Digital Forensics specialist operating at the intersection of enterprise SOC operations, volatile evidence acquisition, and automated threat triage.
              </p>

              <p>
                Holding a Master of Science in Digital Forensics & Information Security from the National Forensic Sciences University (NFSU, CGPA 9.00), my investigative methodology is grounded in empirical evidence preservation, parent-child process lineage analysis, and repeatable detection rule authoring.
              </p>

              <p>
                From analyzing live memory dumps in Volatility and authoring KQL hunting queries over ~900K cloud telemetry logs to orchestrating automated SOAR playbooks in Shuffle, I bridge the gap between low-level forensic artifacts and high-velocity security operations.
              </p>

              {/* 5-Step Investigative Methodology */}
              <div className="pt-4 border-t border-[#1c2a23]">
                <div className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Forensic Investigation Protocol:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs text-center">
                  {[
                    { n: '01', l: 'SCOPING', sub: 'Volatile RAM' },
                    { n: '02', l: 'TELEMETRY', sub: 'SIEM & EDR' },
                    { n: '03', l: 'HUNTING', sub: 'KQL & Sigma' },
                    { n: '04', l: 'RECONSTRUCT', sub: 'Process Tree' },
                    { n: '05', l: 'CONTAIN', sub: 'SOAR Actions' }
                  ].map((s) => (
                    <div
                      key={s.n}
                      className="p-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg flex flex-col justify-between"
                    >
                      <div className="text-[10px] text-[#00ff88] font-bold">{s.n}</div>
                      <div className="text-[11px] font-bold text-white mt-1">{s.l}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Interactive Terminal CTA */}
            {onOpenTerminal && (
              <div className="bg-[#080d0b] border border-[#00ff88]/30 rounded-xl p-4 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-[#00ff88]" />
                  <div>
                    <span className="text-white font-bold block">Interactive SOC Command Line Available</span>
                    <span className="text-zinc-500 text-[10px]">Execute live KQL queries, query dossiers, and inspect telemetry</span>
                  </div>
                </div>
                <button
                  onClick={onOpenTerminal}
                  className="px-3 py-1.5 bg-[#00ff88]/20 border border-[#00ff88]/60 hover:bg-[#00ff88] hover:text-black text-[#00ff88] rounded-lg font-bold transition-all cursor-pointer"
                >
                  LAUNCH CLI
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Key Metrics & Operator Stats */}
          <div className="space-y-4">
            <div className="bg-[#080d0b] border border-[#1f2e26] rounded-2xl p-6 font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c2a23] text-xs">
                <span className="text-[#00ff88] font-bold tracking-wider">OPERATIONAL METRICS</span>
                <Activity size={13} className="text-[#00ff88]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PROFILE.stats.map((st, sidx) => (
                  <div
                    key={sidx}
                    className="p-3.5 bg-zinc-950 border border-zinc-800/90 rounded-xl flex flex-col justify-between"
                  >
                    <div className="text-2xl font-extrabold text-[#00ff88]">{st.value}</div>
                    <div className="text-[11px] font-bold text-zinc-200 mt-1">{st.label}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">{st.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditations Summary */}
            <div className="bg-[#080d0b] border border-[#1f2e26] rounded-2xl p-6 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c2a23]">
                <span className="text-[#00ff88] font-bold tracking-wider">KEY ACCREDITATIONS</span>
                <Shield size={13} className="text-[#00ff88]" />
              </div>

              <ul className="space-y-2 text-zinc-300 font-sans text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#00ff88] shrink-0" />
                  <span>M.Sc. Digital Forensics & InfoSec (NFSU - CGPA 9.00)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#00ff88] shrink-0" />
                  <span>ISO/IEC 27001 Information Security Associate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#00ff88] shrink-0" />
                  <span>EC-Council Ethical Hacking & Forensics Essentials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#00ff88] shrink-0" />
                  <span>Cisco Cybersecurity Essentials Certified</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
export default AboutSection;
