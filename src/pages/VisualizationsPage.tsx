import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Shield, CalendarDays } from 'lucide-react';
import { CyberVisualizationsHub } from '../components/cyber/visualizations/CyberVisualizationsHub';
import { ThreatIntelExplorer } from '../components/cyber/ThreatIntelExplorer';
import { LiveThreatFeed } from '../components/cyber/LiveThreatFeed';

export const VisualizationsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-14">
      {/* Live SOC incident telemetry stream */}
      <LiveThreatFeed />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] transition-colors mb-8 tracking-widest"
        >
          <ArrowLeft size={11} /> HOME / SOC TELEMETRY LAB
        </Link>

        <header className="mb-10">
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">
            07 / TECHNICAL TELEMETRY LABS
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold uppercase leading-tight text-[#f0efea]">
            SOC Lab &<br />Visual Telemetry
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#8a8a96]">
            Interactive defensive engineering simulators: explore hybrid enterprise topologies, trace forensic artifact trees with live KQL queries, inspect SIEM ingestion pipelines, and query real-world MITRE ATT&CK detection matrices.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/terminal"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ade80]/10 border border-[#4ade80]/40 text-[#4ade80] font-mono text-xs font-bold hover:bg-[#4ade80] hover:text-[#0a0a0b] transition-all"
            >
              <Terminal size={13} /> LAUNCH CLI TERMINAL
            </Link>
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold hover:border-[#c8a96b]/50 hover:text-[#c8a96b] transition-all"
            >
              <CalendarDays size={13} /> SCHEDULE DISCUSSION
            </Link>
          </div>
        </header>

        {/* 4 Interactive Visual Models Hub */}
        <div className="mb-14">
          <CyberVisualizationsHub />
        </div>

        {/* MITRE ATT&CK Matrix & Threat Intel Explorer */}
        <div className="mb-14">
          <ThreatIntelExplorer />
        </div>

        {/* Footer info banner */}
        <div className="border border-[#1e1e22] bg-[#0f0f10] p-6 text-center">
          <Shield size={24} className="mx-auto text-[#c8a96b] mb-3" />
          <h3 className="font-mono text-sm font-bold text-[#f0efea]">
            CYBERSECURITY DEFENSE ARCHITECTURE
          </h3>
          <p className="mt-2 font-mono text-xs text-[#8a8a96] max-w-xl mx-auto leading-relaxed">
            All telemetry pipelines, detection logic, and artifact hierarchies represent authentic DFIR methodology implemented across enterprise incident response engagements.
          </p>
          <div className="mt-5 flex justify-center gap-4">
            <Link to="/projects" className="font-mono text-xs text-[#c8a96b] hover:underline">
              EXPLORE CASE ARCHIVE →
            </Link>
            <Link to="/contact" className="font-mono text-xs text-[#8a8a96] hover:text-[#f0efea]">
              CONTACT OPERATOR →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
