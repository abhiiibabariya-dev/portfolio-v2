import React, { useState } from 'react';
import { NetworkTopologyVisualizer } from './NetworkTopologyVisualizer';
import { ForensicEvidenceBranching } from './ForensicEvidenceBranching';
import { SOCPipelineVisualizer } from './SOCPipelineVisualizer';
import { ProcessTreeThreatVisualizer } from './ProcessTreeThreatVisualizer';
import { Globe, Search, Activity, GitBranch, Cpu, ShieldCheck } from 'lucide-react';

export const CyberVisualizationsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'forensics' | 'soc' | 'process'>('topology');

  const tabs = [
    {
      id: 'topology' as const,
      label: 'NETWORK TOPOLOGY',
      sub: 'Hybrid SIEM Mesh',
      icon: <Globe size={15} />
    },
    {
      id: 'forensics' as const,
      label: 'FORENSIC EVIDENCE',
      sub: 'Branching Tree & KQL',
      icon: <Search size={15} />
    },
    {
      id: 'soc' as const,
      label: 'SOC PIPELINE',
      sub: 'Ingestion to SOAR',
      icon: <Activity size={15} />
    },
    {
      id: 'process' as const,
      label: 'PROCESS EXECUTION',
      sub: 'MITRE Kill Chain',
      icon: <GitBranch size={15} />
    }
  ];

  return (
    <section className="w-full py-12 md:py-20 bg-[#050806] border-b border-[#1c1c1c] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-xs text-[#00ff88] mb-3">
              <Cpu size={13} />
              <span>INTERACTIVE TELEMETRY LAB & ARCHITECTURE ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              CYBERSECURITY TECHNICAL VISUALIZATIONS
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-1 max-w-2xl">
              Explore dynamic, interactive visual models of network topologies, forensic artifact chains, SIEM ingestion pipelines, and attack process lineages.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800">
            <ShieldCheck size={14} className="text-[#00ff88]" />
            <span>4 LIVE VISUAL MODELS READY</span>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-xl border text-left font-mono transition-all flex items-start gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-[#00ff88]/15 border-[#00ff88] text-white shadow-[0_0_20px_rgba(0,255,136,0.25)]'
                    : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:border-[#00ff88]/40 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActive ? 'bg-[#00ff88] text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {tab.icon}
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wide">{tab.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{tab.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visualization Canvas Area */}
        <div className="w-full">
          {activeTab === 'topology' && <NetworkTopologyVisualizer />}
          {activeTab === 'forensics' && <ForensicEvidenceBranching />}
          {activeTab === 'soc' && <SOCPipelineVisualizer />}
          {activeTab === 'process' && <ProcessTreeThreatVisualizer />}
        </div>
      </div>
    </section>
  );
};
