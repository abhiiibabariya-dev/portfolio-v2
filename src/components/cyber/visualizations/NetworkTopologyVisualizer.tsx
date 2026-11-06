import React, { useState } from 'react';
import { Server, Shield, Globe, Terminal, Database, Cpu } from 'lucide-react';

interface TopologyNode {
  id: string;
  name: string;
  type: 'cloud' | 'dmz' | 'soc' | 'endpoint' | 'siem' | 'firewall';
  ip: string;
  status: 'ONLINE' | 'MONITORING' | 'ISOLATED' | 'BLOCKED';
  x: number; // percentage
  y: number; // percentage
  role: string;
  threatLevel: 'CLEAN' | 'WARNING' | 'CRITICAL';
  telemetry: string;
}

export const NetworkTopologyVisualizer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('node-siem');
  const [activeSimulation, setActiveSimulation] = useState<boolean>(true);

  const nodes: TopologyNode[] = [
    {
      id: 'node-inet',
      name: 'External WAN / Internet',
      type: 'cloud',
      ip: '0.0.0.0/0',
      status: 'MONITORING',
      x: 10,
      y: 50,
      role: 'Ingress & Egress Gateway',
      threatLevel: 'CLEAN',
      telemetry: 'Traffic Rate: 145 Mbps · Active Sessions: 1,840'
    },
    {
      id: 'node-ngfw',
      name: 'NextGen Cloud Firewall',
      type: 'firewall',
      ip: '10.0.0.1',
      status: 'ONLINE',
      x: 30,
      y: 50,
      role: 'Stateful Packet Inspection & SSL Decrypt',
      threatLevel: 'CLEAN',
      telemetry: 'Rules Evaluated: 8.4M/sec · Egress Filter: STRICT'
    },
    {
      id: 'node-dmz',
      name: 'DMZ Multi-Tenant Web Cluster',
      type: 'dmz',
      ip: '10.0.10.0/24',
      status: 'MONITORING',
      x: 50,
      y: 25,
      role: 'Reverse Proxy & Public API Endpoints',
      threatLevel: 'WARNING',
      telemetry: 'WAF Blocked: 42 SQLi/XSS probes · TLS 1.3 Active'
    },
    {
      id: 'node-corp',
      name: 'Enterprise Workstations & EDR',
      type: 'endpoint',
      ip: '10.0.20.0/24',
      status: 'ONLINE',
      x: 50,
      y: 75,
      role: 'CrowdStrike Falcon & Sysmon Agents',
      threatLevel: 'CLEAN',
      telemetry: 'Agents Online: 142/142 · Zero Active Intrusions'
    },
    {
      id: 'node-siem',
      name: 'FortiSIEM & Wazuh Ingestion Hub',
      type: 'siem',
      ip: '10.0.30.50',
      status: 'ONLINE',
      x: 75,
      y: 50,
      role: 'Central Log Aggregation & Real-time Correlation',
      threatLevel: 'CLEAN',
      telemetry: 'Ingestion: 1,240 EPS · 45 Mapped Sigma Rules Active'
    },
    {
      id: 'node-soc',
      name: 'SOC Triage & TheHive SOAR',
      type: 'soc',
      ip: '10.0.30.90',
      status: 'ONLINE',
      x: 92,
      y: 50,
      role: 'Incident Orchestration & Containment Playbooks',
      threatLevel: 'CLEAN',
      telemetry: 'Active Incidents: 0 · Automated Playbooks: 18'
    }
  ];

  const connections = [
    { from: 'node-inet', to: 'node-ngfw' },
    { from: 'node-ngfw', to: 'node-dmz' },
    { from: 'node-ngfw', to: 'node-corp' },
    { from: 'node-dmz', to: 'node-siem' },
    { from: 'node-corp', to: 'node-siem' },
    { from: 'node-siem', to: 'node-soc' }
  ];

  const currentNode = nodes.find((n) => n.id === selectedNode) || nodes[4];

  return (
    <div className="w-full bg-[#080d0b] border border-[#1f2e26] rounded-xl overflow-hidden p-4 md:p-6 text-zinc-200 font-sans shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#1c2a23] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#00ff88]" />
            <h3 className="font-mono text-sm md:text-base font-bold text-white tracking-wide">
              ENTERPRISE HYBRID TOPOLOGY & SIEM INGESTION MESH
            </h3>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Real-time visual model of segmented network zones, telemetry collectors, and automated triage points
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSimulation(!activeSimulation)}
            className={`px-3 py-1 text-xs font-mono rounded border transition-all ${
              activeSimulation
                ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}
          >
            {activeSimulation ? '● SIMULATION LIVE' : '○ SIMULATION PAUSED'}
          </button>
        </div>
      </div>

      {/* Interactive Topology Graph Area */}
      <div className="relative w-full h-80 sm:h-96 my-6 bg-[#040705] border border-[#14231b] rounded-lg overflow-hidden flex items-center justify-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #00ff88 1px, transparent 1px), linear-gradient(to bottom, #00ff88 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* SVG Connections Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, idx) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={idx}>
                {/* Background Link Line */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="rgba(0, 255, 136, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Animated Packet Pulse */}
                {activeSimulation && (
                  <circle r="3.5" fill="#00ff88" className="filter drop-shadow-[0_0_6px_#00ff88]">
                    <animateMotion
                      path={`M ${fromNode.x * 7.5} ${fromNode.y * 3.5} L ${toNode.x * 7.5} ${toNode.y * 3.5}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((n) => {
          const isSelected = selectedNode === n.id;
          return (
            <div
              key={n.id}
              onClick={() => setSelectedNode(n.id)}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 flex flex-col items-center group`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.6)] scale-110'
                    : 'bg-zinc-950/90 border-zinc-800 text-zinc-400 group-hover:border-[#00ff88]/60 group-hover:text-zinc-200'
                }`}
              >
                {n.type === 'cloud' && <Globe size={18} />}
                {n.type === 'firewall' && <Shield size={18} />}
                {n.type === 'dmz' && <Server size={18} />}
                {n.type === 'endpoint' && <Cpu size={18} />}
                {n.type === 'siem' && <Database size={18} />}
                {n.type === 'soc' && <Terminal size={18} />}
              </div>

              {/* Node Label Below */}
              <div className="mt-1.5 px-2 py-0.5 rounded bg-zinc-950/90 border border-zinc-800/80 font-mono text-[9px] text-zinc-300 whitespace-nowrap group-hover:border-[#00ff88]/50">
                {n.name.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Telemetry HUD Panel */}
      <div className="bg-[#040806] border border-[#14231b] rounded-lg p-4 font-mono text-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-2 border-b border-[#1c2a23]">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff88] font-bold">NODE_INSPECT:</span>
            <span className="text-white font-bold">{currentNode.name}</span>
            <span className="text-zinc-500">({currentNode.ip})</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 font-bold">
              STATUS: {currentNode.status}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
              SECTOR: {currentNode.type.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-zinc-400">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Functional Role:</span>
            <span className="text-zinc-200">{currentNode.role}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Telemetry & Metric Stream:</span>
            <span className="text-[#38bdf8]">{currentNode.telemetry}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
