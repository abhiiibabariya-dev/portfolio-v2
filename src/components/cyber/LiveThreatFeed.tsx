import React, { useState, useEffect } from 'react';
import { LIVE_THREAT_FEED } from '../../data/portfolioData';
import { Shield, Activity } from 'lucide-react';

export const LiveThreatFeed: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % LIVE_THREAT_FEED.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentEvent = LIVE_THREAT_FEED[activeIndex];

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="w-full bg-[#080808]/90 border-y border-[#1c1c1c] backdrop-blur-md py-2.5 px-4 md:px-8 text-xs font-mono relative z-20 overflow-hidden shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Status Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#00ff88] -ml-4" />
            <span className="text-[#00ff88] font-bold tracking-wider text-[10px]">SOC TELEMETRY STREAM</span>
          </div>
          <span className="text-zinc-500 hidden sm:inline-block">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <Activity size={13} className="text-[#00ff88]" />
            <span>SIEM INGESTION: <b className="text-zinc-200">1.2K EPS</b></span>
          </div>
        </div>

        {/* Live Active Incident Ticker */}
        <div className="flex items-center gap-2.5 overflow-hidden w-full md:w-auto">
          <span className={`px-2 py-0.5 text-[9px] font-bold border rounded-xs tracking-wider uppercase shrink-0 ${getSeverityStyle(currentEvent.sev)}`}>
            {currentEvent.sev}
          </span>
          <span className="text-[#00ff88] shrink-0 text-[11px]">[{currentEvent.time}]</span>
          <span className="text-amber-400 font-semibold shrink-0 text-[11px] hidden lg:inline">[{currentEvent.tech}]</span>
          <span className="text-zinc-300 truncate text-[11px] font-medium" title={currentEvent.desc}>
            {currentEvent.desc}
          </span>
          <span className="text-[10px] text-zinc-500 hidden xl:inline shrink-0 bg-zinc-900/80 px-2 py-0.5 border border-zinc-800">
            SRC: {currentEvent.source}
          </span>
        </div>

        {/* Right Status Indicator */}
        <div className="hidden md:flex items-center gap-4 shrink-0 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-[#00ff88]" />
            <span className="text-zinc-300 font-semibold">EDR DEFENSE ARMED</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-800 rounded-xs">
            <span>EVENT</span>
            <span className="text-[#00ff88] font-bold">{activeIndex + 1}/{LIVE_THREAT_FEED.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
