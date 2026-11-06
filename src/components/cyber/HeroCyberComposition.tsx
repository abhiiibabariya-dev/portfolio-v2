import React, { useState } from 'react';
import { Shield, Target, Cpu, Activity, Lock, Terminal } from 'lucide-react';

interface HeroCyberCompositionProps {
  portraitUrl?: string;
  onOpenTerminal?: () => void;
}

export const HeroCyberComposition: React.FC<HeroCyberCompositionProps> = ({
  portraitUrl = '/portfolio/images/hero/portrait.webp',
  onOpenTerminal
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full max-w-[540px] lg:max-w-[620px] aspect-[4/5] mx-auto flex items-center justify-center select-none group">
      {/* 1. Background HUD Geometric Rings and Calipers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer rotating dashed ring */}
        <div className="w-[90%] h-[90%] rounded-full border border-dashed border-[#00ff88]/20 animate-[spin_40s_linear_infinite]" />

        {/* Inner reverse rotating target compass */}
        <div className="absolute w-[74%] h-[74%] rounded-full border border-[#38bdf8]/15 animate-[spin_25s_linear_infinite_reverse]">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#38bdf8]/40 rotate-45 border border-[#38bdf8]" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#38bdf8]/40 rotate-45 border border-[#38bdf8]" />
        </div>

        {/* Diagonal Crosshairs */}
        <div className="absolute inset-8 border border-white/[0.03] rotate-45 pointer-events-none" />

        {/* Subtle radial glow under portrait */}
        <div className="absolute w-72 h-72 bg-[#00ff88]/10 blur-[90px] rounded-full pointer-events-none" />
      </div>

      {/* 2. Main Framed Holographic Card */}
      <div className="relative w-[82%] h-[90%] bg-gradient-to-b from-[#0e1613]/90 via-[#0a0f0d]/95 to-[#050807] border border-[#00ff88]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.12)] backdrop-blur-md">

        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00ff88]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00ff88]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00ff88]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00ff88]" />

        {/* Top Header Telemetry Tape */}
        <div className="absolute top-0 inset-x-0 h-7 bg-[#00ff88]/10 border-b border-[#00ff88]/20 px-3 flex items-center justify-between text-[9px] font-mono text-[#00ff88] z-20">
          <span className="flex items-center gap-1.5 tracking-wider font-bold">
            <Target size={11} className="animate-pulse text-[#00ff88]" />
            BIO_TELEMETRY: LOCKED
          </span>
          <span className="text-zinc-400 font-medium">SYS.VER. 2026.4</span>
        </div>

        {/* Portrait Image Layer with Scanline Effect */}
        <div className="relative w-full h-full pt-7 overflow-hidden flex items-end justify-center">
          {!imgError ? (
            <img
              src={portraitUrl}
              alt="Abhishek Babariya - Cybersecurity & DFIR Specialist"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover object-top filter grayscale contrast-110 brightness-95 transition-all duration-700 ${
                imgLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-95'
              } group-hover:filter-none group-hover:scale-105 group-hover:opacity-100`}
            />
          ) : (
            // Cyber Silhouette Fallback
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-zinc-950/90 text-zinc-400">
              <Shield size={64} className="text-[#00ff88] mb-3 animate-pulse" />
              <p className="font-mono text-xs font-bold text-zinc-200">ABHISHEK BABARIYA</p>
              <p className="font-mono text-[10px] text-[#00ff88]">DFIR & RISK ANALYST</p>
            </div>
          )}

          {/* Bottom Gradient Fade */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050807] via-[#050807]/70 to-transparent z-10" />

          {/* Animated Vertical Scanline Bar */}
          <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#00ff88]/15 to-transparent pointer-events-none animate-[scanline_6s_ease-in-out_infinite] z-10" />

          {/* Scanline Grid Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 z-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.08) 2px, rgba(0,255,136,0.08) 4px)'
            }}
          />
        </div>

        {/* Live Coordinate Crosshairs on Image */}
        <div className="absolute bottom-12 left-4 z-20 font-mono text-[9px] text-zinc-400 bg-[#050807]/80 backdrop-blur-md p-2 rounded border border-white/10 space-y-0.5">
          <div className="flex items-center gap-1.5 text-[#00ff88]">
            <Activity size={10} />
            <span className="font-bold">STATUS: INVESTIGATING</span>
          </div>
          <div className="text-zinc-500">LOC: 19.0760° N, 72.8777° E</div>
          <div className="text-zinc-400">ROLE: ICICI BANK · DM2</div>
        </div>

        {/* Cryptographic Hash Badge */}
        <div className="absolute bottom-3 right-4 z-20 font-mono text-[8px] text-zinc-500 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center gap-1">
          <Lock size={9} className="text-amber-400" />
          <span>SHA-256: 8F4A21B3...</span>
        </div>
      </div>

      {/* 3. Floating Holographic Cyber Badges Around Portrait */}

      {/* Top Right Floating Badge: Incident Command */}
      <div className="absolute -top-3 -right-2 md:right-0 z-30 font-mono bg-[#080d0b]/95 border border-[#00ff88]/40 backdrop-blur-md p-3 rounded-xl shadow-xl hover:border-[#00ff88] transition-all transform hover:-translate-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-ping" />
          <span className="text-[10px] font-bold text-[#00ff88] tracking-wider">DFIR COMMAND</span>
        </div>
        <div className="mt-1 text-[11px] font-bold text-zinc-100">ICICI Bank · DM2</div>
        <div className="text-[9px] text-zinc-400">Digital Forensics & Risk</div>
      </div>

      {/* Bottom Left Floating Badge: Telemetry Ingestion */}
      <div className="absolute -bottom-4 -left-2 md:left-0 z-30 font-mono bg-[#070b10]/95 border border-[#38bdf8]/40 backdrop-blur-md p-3 rounded-xl shadow-xl hover:border-[#38bdf8] transition-all transform hover:translate-y-1">
        <div className="flex items-center gap-2">
          <Cpu size={13} className="text-[#38bdf8]" />
          <span className="text-[10px] font-bold text-[#38bdf8] tracking-wider">THREAT DETECTION</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-300">
          <span className="text-[#00ff88] font-bold">100+</span> Alerts Triaged/Day
        </div>
        <div className="text-[9px] text-zinc-500">CrowdStrike · Sysmon · KQL</div>
      </div>

      {/* Floating Interactive Quick Terminal Button */}
      {onOpenTerminal && (
        <button
          onClick={onOpenTerminal}
          className="absolute -right-4 bottom-24 z-30 font-mono text-[10px] bg-zinc-950/90 border border-zinc-700 hover:border-[#00ff88] hover:text-[#00ff88] text-zinc-300 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all group/btn backdrop-blur-md"
          title="Open SOC Command Terminal"
        >
          <Terminal size={12} className="text-[#00ff88] group-hover/btn:rotate-12 transition-transform" />
          <span className="font-bold">CLI RUNNER</span>
        </button>
      )}
    </div>
  );
};
