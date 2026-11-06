import React, { useState } from 'react';
import { Search, CheckCircle2, Lock, Terminal } from 'lucide-react';

interface ForensicNode {
  id: string;
  stage: string;
  name: string;
  tool: string;
  artifact: string;
  findings: string;
  integrityHash: string;
  mitreTag: string;
  kqlQuery?: string;
}

export const ForensicEvidenceBranching: React.FC = () => {
  const [activeNode, setActiveNode] = useState<number>(0);

  const forensicNodes: ForensicNode[] = [
    {
      id: 'EVID-01',
      stage: '01. VOLATILE MEMORY',
      name: 'Memory Dump & Process Extraction',
      tool: 'WinPmem · Volatility 3 · FTK Imager',
      artifact: 'C:\\Windows\\System32\\svchost.exe (PID: 4892)',
      findings: 'Injected DLL discovered unlinked from PEB (VAD tree analysis). Hidden memory region marked PAGE_EXECUTE_READWRITE.',
      integrityHash: 'SHA-256: 8f4a21b3e9047c5d319808e01bb54e92a8321048e918237e2a9',
      mitreTag: 'T1055.001 (Dynamic-link Library Injection)',
      kqlQuery: `DeviceProcessEvents
| where InitiatingProcessFileName == "svchost.exe"
| where ProcessCommandLine has_any ("-enc", "bypass", "hidden")
| project Timestamp=TimeGenerated, DeviceName, FileName, ProcessCommandLine, AccountName`
    },
    {
      id: 'EVID-02',
      stage: '02. FILESYSTEM ($MFT)',
      name: 'Master File Table & Prefetch Analysis',
      tool: 'MFTECmd · PECmd · KAPE',
      artifact: 'C:\\Windows\\Prefetch\\POWERSHELL.EXE-B4E99C2A.pf',
      findings: 'Evidence of execution timestamp correlated with initial alert. Run count: 1. $SI timestamp timestomped, $FN preserved authentic time.',
      integrityHash: 'SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      mitreTag: 'T1070.006 (Timestomp) · T1059.001 (PowerShell)'
    },
    {
      id: 'EVID-03',
      stage: '03. REGISTRY FORENSICS',
      name: 'Shimcache, Amcache & UserAssist',
      tool: 'AppCompatCacheParser · Registry Explorer',
      artifact: 'SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache',
      findings: 'Identified staging script executed from C:\\ProgramData\\UpdateService\\payload.bat prior to deletion.',
      integrityHash: 'SHA-256: 7d1a58c92e391b40283e1c8d0a927391bfa39281e0918237e192837492819034',
      mitreTag: 'T1027 (Obfuscated Files or Information)'
    },
    {
      id: 'EVID-04',
      stage: '04. CLOUD LOG CORRELATION',
      name: 'Azure Log Analytics (~900K Events)',
      tool: 'Kusto Query Language (KQL) · Sentinel',
      artifact: 'Azure SignInLogs & DeviceNetworkEvents',
      findings: 'Cross-correlated logon SessionID with NSG flow logs. Outbound TLS socket mapped to legitimate CDN IP reassignment.',
      integrityHash: 'SHA-256: c5920194827391bfa92837491029384729103847582910293847561928374619',
      mitreTag: 'T1071.001 (Web Protocols) · Closed TP/No Compromise',
      kqlQuery: `SecurityEvent
| where TimeGenerated > ago(7d)
| where EventID in (4624, 4672, 4688)
| summarize EventCount=count(), DistinctUsers=dcount(TargetAccount) by bin(TimeGenerated, 1h)
| render timechart`
    },
    {
      id: 'EVID-05',
      stage: '05. EVIDENCE RECONSTRUCTION',
      name: 'Legal-Grade Chain-of-Custody Final Report',
      tool: 'Veracrypt · Forensic Case Hash Log',
      artifact: 'CASE-APT-2025-09-FINAL-DEFENSE.pdf',
      findings: 'Formal verdict established within 72 hours. All captured artifacts cryptographically signed with immutable verification.',
      integrityHash: 'SHA-256: 4a98102938475619283746591029384756192837461928374619283746192837',
      mitreTag: 'DFIR Incident Case Closure'
    }
  ];

  const current = forensicNodes[activeNode];

  return (
    <div className="w-full bg-[#080d0b] border border-[#1f2e26] rounded-xl overflow-hidden p-4 md:p-6 text-zinc-200 font-sans shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#1c2a23] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-[#00ff88]" />
            <h3 className="font-mono text-sm md:text-base font-bold text-white tracking-wide">
              DIGITAL FORENSICS EVIDENCE BRANCHING TREE
            </h3>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Step-by-step cryptographic artifact acquisition, registry forensics, memory reconstruction, and KQL timeline analysis
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Lock size={13} className="text-amber-400" />
          <span>CHAIN-OF-CUSTODY: VERIFIED</span>
        </div>
      </div>

      {/* Horizontal Branching Timeline Step Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-6">
        {forensicNodes.map((n, idx) => {
          const isActive = idx === activeNode;
          return (
            <button
              key={n.id}
              onClick={() => setActiveNode(idx)}
              className={`p-3 rounded-lg border font-mono text-left transition-all ${
                isActive
                  ? 'bg-[#00ff88]/15 border-[#00ff88] text-white shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                  : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-[#00ff88]/40 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className={isActive ? 'text-[#00ff88] font-bold' : 'text-zinc-500'}>{n.id}</span>
                {isActive && <CheckCircle2 size={12} className="text-[#00ff88]" />}
              </div>
              <div className="text-xs font-bold mt-1 truncate">{n.stage.split('. ')[1]}</div>
              <div className="text-[9px] text-zinc-500 mt-0.5 truncate">{n.tool.split(' · ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed Forensic Artifact Deep-Dive Card */}
      <div className="bg-[#040806] border border-[#14231b] rounded-lg p-5 font-mono text-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-3 border-b border-[#1c2a23]">
          <div>
            <span className="text-[#00ff88] text-[10px] font-bold tracking-wider uppercase block">
              {current.stage} — FORENSIC EVIDENCE ARTIFACT
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">{current.name}</h4>
          </div>

          <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
            MITRE: {current.mitreTag}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase block">Acquisition Tools & Parser Suite:</span>
            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[#38bdf8] font-semibold">
              {current.tool}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase block">Target Artifact / Path:</span>
            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 truncate">
              {current.artifact}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-zinc-500 text-[10px] uppercase block">Forensic Analysis Findings:</span>
          <div className="p-3 rounded bg-zinc-950/80 border border-zinc-800/80 text-zinc-200 leading-relaxed">
            {current.findings}
          </div>
        </div>

        {current.kqlQuery && (
          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1.5">
              <Terminal size={11} className="text-[#00ff88]" />
              KQL Hunting Query Artifact:
            </span>
            <pre className="p-3 rounded bg-[#020503] border border-[#0f2416] text-[#00ff88] text-[11px] overflow-x-auto leading-tight">
              {current.kqlQuery}
            </pre>
          </div>
        )}

        {/* Cryptographic SHA-256 Checksum Tag */}
        <div className="pt-2 border-t border-[#1c2a23] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <Lock size={12} className="text-[#00ff88]" />
            <span className="text-zinc-500">IMMUTABLE INTEGRITY:</span>
            <span className="text-zinc-300 font-mono">{current.integrityHash}</span>
          </div>
          <span className="text-[#00ff88] font-bold">STATE: EVIDENCE PRESERVED</span>
        </div>
      </div>
    </div>
  );
};
