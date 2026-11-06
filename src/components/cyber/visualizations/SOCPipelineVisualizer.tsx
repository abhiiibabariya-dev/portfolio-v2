import React, { useState } from 'react';
import { Activity, Zap, CheckCircle2 } from 'lucide-react';

interface PipelineStage {
  id: string;
  step: string;
  name: string;
  technology: string;
  description: string;
  throughput: string;
  sampleData: string;
  actionTaken: string;
}

export const SOCPipelineVisualizer: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(2);

  const pipelineStages: PipelineStage[] = [
    {
      id: 'STAGE-01',
      step: '01',
      name: 'Multi-Source Telemetry Ingestion',
      technology: 'Sysmon · Wazuh Agent · Suricata NIDS · Azure Logs',
      description: 'Raw endpoint process creations (EventID 1), network flows, DNS requests, and authentication logs continuously streamed into message queue.',
      throughput: '1,240 Events/Sec (EPS)',
      sampleData: `{
  "timestamp": "2026-03-08T09:15:22.104Z",
  "event_id": 1,
  "source": "Microsoft-Windows-Sysmon",
  "computer": "PROD-APP-04.corp.internal",
  "image": "C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe",
  "command_line": "powershell.exe -NoP -NonI -W Hidden -Exec Bypass -enc SQBFAFgA...",
  "parent_image": "C:\\\\Windows\\\\System32\\\\cmd.exe",
  "user": "NT AUTHORITY\\\\SYSTEM"
}`,
      actionTaken: 'Syslog/TLS streaming to FortiCollector & Wazuh Indexer cluster with SHA-256 validation.'
    },
    {
      id: 'STAGE-02',
      step: '02',
      name: 'Normalization & Parsing Engine',
      technology: 'Logstash · Elastic Common Schema (ECS) · CEF',
      description: 'Field extraction, IP geolocation tagging, timestamp synchronization, and schema normalization into queryable structured JSON fields.',
      throughput: '100% Schema Conformance',
      sampleData: `{
  "agent": { "name": "PROD-APP-04", "type": "wazuh-agent" },
  "process": {
    "name": "powershell.exe",
    "args": ["-NoP", "-NonI", "-W", "Hidden", "-Exec", "Bypass"],
    "is_obfuscated": true,
    "parent_name": "cmd.exe"
  },
  "network": { "direction": "egress", "protocol": "tls" }
}`,
      actionTaken: 'Normalized into indexer indices with index lifecycle management (ILM).'
    },
    {
      id: 'STAGE-03',
      step: '03',
      name: 'Sigma Rule & SIEM Correlation',
      technology: 'Wazuh Ruleset · FortiSIEM Analytics · Sigma Engine',
      description: 'Real-time rule evaluation across sliding 5-minute temporal windows. Matches parent-child anomalies and base64 obfuscation heuristics.',
      throughput: '45 Active Sigma Rules Evaluated',
      sampleData: `rule:
  title: "Suspicious Obfuscated PowerShell Execution"
  id: "f4a9b218-381c-4b67-a5df-8f0a21b3e904"
  status: "production"
  level: "high"
  mitre_technique: "T1059.001"
  condition: "process.name == 'powershell.exe' and process.args contains '-enc'"
  alert_severity: 8`,
      actionTaken: 'Triggered HIGH severity alert #WZ-9821. Auto-escalated to automated SOAR webhook.'
    },
    {
      id: 'STAGE-04',
      step: '04',
      name: 'Threat Intel Enrichment',
      technology: 'VirusTotal API · AbuseIPDB · MISP Threat Hub',
      description: 'Instant IP reputation query, MD5/SHA-256 malware hash verification, and WHOIS lookup executed asynchronously within 800ms.',
      throughput: 'Average Enrichment Latency: 640ms',
      sampleData: `{
  "observable": "175.45.176.23",
  "abuse_score": 88,
  "virustotal_detections": "14/72 engines flagged as malicious",
  "threat_actor": "Suspected Lazarus Cluster / CDN Overlap",
  "geo": { "country": "KP", "asn": "AS131279" }
}`,
      actionTaken: 'Reputation score tagged to case observables in TheHive incident database.'
    },
    {
      id: 'STAGE-05',
      step: '05',
      name: 'SOAR Playbook & Automated Containment',
      technology: 'Shuffle SOAR · TheHive · EDR Network Isolation',
      description: 'Orchestration playbook executes host isolation via EDR API, creates SOC ticket with full observables, and notifies analyst on call.',
      throughput: 'MTTR: Under 120 Seconds',
      sampleData: `{
  "playbook": "PB-SUSPICIOUS-POWERSHELL-CONTAINMENT",
  "status": "COMPLETED",
  "actions": [
    "1. Host PROD-APP-04 network isolated via EDR API: SUCCESS",
    "2. Memory dump snapshot initiated: RUNNING",
    "3. Firewall egress rule added for destination IP: ACTIVE",
    "4. Case #9412 opened in TheHive with 4 observables: DISPATCHED"
  ]
}`,
      actionTaken: 'Host isolated from corporate subnet. Live memory preserved for forensic chain-of-custody.'
    }
  ];

  const current = pipelineStages[activeStage];

  return (
    <div className="w-full bg-[#080d0b] border border-[#1f2e26] rounded-xl overflow-hidden p-4 md:p-6 text-zinc-200 font-sans shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#1c2a23] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#00ff88]" />
            <h3 className="font-mono text-sm md:text-base font-bold text-white tracking-wide">
              REAL-TIME SOC DETECTION & AUTOMATED SOAR PIPELINE
            </h3>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            End-to-end telemetry lifecycle: from endpoint Sysmon collection to automated containment playbooks
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 font-bold">
            LATENCY: 1.2s END-TO-END
          </span>
        </div>
      </div>

      {/* Interactive 5-Stage Stepper Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 my-6">
        {pipelineStages.map((stage, idx) => {
          const isActive = idx === activeStage;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              className={`p-3 rounded-lg border font-mono text-left transition-all relative ${
                isActive
                  ? 'bg-[#00ff88]/15 border-[#00ff88] text-white shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                  : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-[#00ff88]/40 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className={isActive ? 'text-[#00ff88] font-bold' : 'text-zinc-500'}>
                  PHASE {stage.step}
                </span>
                {isActive && <CheckCircle2 size={12} className="text-[#00ff88]" />}
              </div>
              <div className="text-xs font-bold mt-1 truncate">{stage.name.split(' ')[0]} {stage.name.split(' ')[1]}</div>
              <div className="text-[9px] text-zinc-500 mt-0.5 truncate">{stage.technology.split(' · ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Live Stage Inspection Box */}
      <div className="bg-[#040806] border border-[#14231b] rounded-lg p-5 font-mono text-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-3 border-b border-[#1c2a23]">
          <div>
            <span className="text-[#00ff88] text-[10px] font-bold uppercase tracking-wider block">
              PHASE {current.step} · {current.name}
            </span>
            <div className="text-sm font-semibold text-zinc-300 mt-0.5">{current.description}</div>
          </div>

          <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[#38bdf8] text-[10px] font-bold">
            {current.throughput}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
            <span>Payload & Telemetry Snapshot:</span>
            <span className="text-zinc-400">STACK: {current.technology}</span>
          </span>
          <pre className="p-3 rounded bg-[#020503] border border-[#0f2416] text-[#00ff88] text-[11px] overflow-x-auto leading-relaxed">
            {current.sampleData}
          </pre>
        </div>

        <div className="pt-2 border-t border-[#1c2a23] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px]">
          <div className="text-zinc-400">
            <span className="text-zinc-500 uppercase">Action Triggered: </span>
            <span className="text-zinc-200">{current.actionTaken}</span>
          </div>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <Zap size={11} /> AUTOMATION VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
};
