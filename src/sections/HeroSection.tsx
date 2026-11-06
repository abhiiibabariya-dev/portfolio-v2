import React from 'react';
import { HeroCyberComposition } from '../components/cyber/HeroCyberComposition';
import { LiveThreatFeed } from '../components/cyber/LiveThreatFeed';
import { PROFILE } from '../data/portfolioData';
import { Terminal, ArrowRight, Award } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
  onOpenTerminal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenTerminal }) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#050505] text-zinc-100 border-b border-[#1c1c1c]">
      {/* 1. Main Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Mission Brief & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">

            {/* Top Clearance Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-xs font-mono text-[#00ff88]">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#00ff88] -ml-4" />
              <span className="font-semibold tracking-wider uppercase text-[11px]">
                {PROFILE.status}
              </span>
            </div>

            {/* Name and Designation Header */}
            <div className="space-y-2">
              <div className="font-mono text-xs md:text-sm text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                <span>IDENTITY: {PROFILE.handle}</span>
                <span className="text-zinc-600">/</span>
                <span className="text-amber-400">{PROFILE.currentOrg}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-none uppercase">
                Abhishek <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#38bdf8] to-[#c8a96b]">
                  Babariya
                </span>
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#00ff88] tracking-wider font-semibold">
                {PROFILE.role.toUpperCase()} · {PROFILE.currentRole.toUpperCase()}
              </p>
            </div>

            {/* Executive Bio Summary */}
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              Specialized in <span className="text-zinc-100 font-semibold">Digital Forensics & Incident Response (DFIR)</span>,
              security operations, and cloud threat investigation. Experienced in triaging complex enterprise intrusions,
              reconstructing adversary process lineages, and engineering high-fidelity KQL hunting rules mapped to MITRE ATT&CK.
            </p>

            {/* High-Impact Stat Badges */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {PROFILE.stats.map((st, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950/80 border border-zinc-800/80 hover:border-[#00ff88]/40 p-3 rounded-lg backdrop-blur-sm transition-all group"
                >
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#00ff88] group-hover:scale-105 transition-transform">
                    {st.value}
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 mt-0.5">{st.label}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{st.sub}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('projects')}
                className="px-5 py-3 bg-[#00ff88] text-black font-mono font-bold text-xs sm:text-sm rounded-lg hover:bg-[#00e67a] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>INVESTIGATE CASE FILES</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenTerminal}
                className="px-5 py-3 bg-zinc-900 border border-zinc-700 hover:border-[#00ff88] text-zinc-200 hover:text-[#00ff88] font-mono font-semibold text-xs sm:text-sm rounded-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Terminal size={16} className="text-[#00ff88]" />
                <span>SOC COMMAND CLI</span>
              </button>

              <button
                onClick={() => onNavigate('certifications')}
                className="px-4 py-3 bg-zinc-950 border border-zinc-800 hover:border-[#38bdf8] text-zinc-400 hover:text-[#38bdf8] font-mono text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award size={15} />
                <span>CREDENTIALS</span>
              </button>
            </div>

          </div>

          {/* Right Column: Cinematic Cyber Portrait Composition */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <HeroCyberComposition
              portraitUrl="/portfolio/images/hero/portrait.webp"
              onOpenTerminal={onOpenTerminal}
            />
          </div>

        </div>
      </div>

      {/* 2. Real-Time SOC Telemetry Feed Ribbon */}
      <LiveThreatFeed />
    </div>
  );
};
