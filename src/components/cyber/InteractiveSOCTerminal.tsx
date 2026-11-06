import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TermIcon, RefreshCw } from 'lucide-react';
import { PROFILE, CASE_STUDIES, CERTIFICATIONS, SKILL_CATEGORIES } from '../../data/portfolioData';

interface InteractiveSOCTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (section: string) => void;
}

export const InteractiveSOCTerminal: React.FC<InteractiveSOCTerminalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'SOC OS v2026.4 [Secure Terminal Session Established]',
    'Connected to: ICICI_SOC_DEFENSE_NODE (10.0.30.90)',
    'Type "help" to view all available commands or "whoami" to inspect operator identity.',
    ''
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, `visitor@soc-cli:~$ ${input}`];

    if (cmd.startsWith('goto ') || cmd.startsWith('nav ')) {
      const targetSec = cmd.split(' ')[1];
      if (['hero', 'projects', 'visualizations', 'dfir', 'skills', 'experience', 'certifications', 'about', 'contact'].includes(targetSec)) {
        newHistory.push(`Navigating to section: #${targetSec}...`);
        if (onNavigate) {
          onNavigate(targetSec);
        }
        setTimeout(() => onClose(), 400);
        setHistory(newHistory);
        setInput('');
        return;
      }
    }

    switch (cmd) {
      case 'help':
        newHistory.push(
          'AVAILABLE SYSTEM COMMANDS:',
          '  whoami      - Display investigator profile & security credentials',
          '  cases       - Enumerate all security incident case files',
          '  open 01     - Decrypt and display case 01 (APT Investigation)',
          '  open 02     - Decrypt and display case 02 (SOC Automation Lab)',
          '  open 03     - Decrypt and display case 03 (Mobile/Cloud Forensics)',
          '  goto <sec>  - Navigate UI to (projects, dfir, skills, certs, about, contact)',
          '  skills      - Inspect full technical arsenal & tools',
          '  certs       - Query verified certification vault',
          '  kql         - Execute simulated KQL threat hunt query',
          '  status      - Display live SOC telemetry & EPS metrics',
          '  contact     - Reveal verified communication channels',
          '  clear       - Wipe terminal buffer',
          '  exit        - Terminate terminal session'
        );
        break;

      case 'whoami':
        newHistory.push(
          `OPERATOR: ${PROFILE.name} (${PROFILE.handle})`,
          `TITLE:    ${PROFILE.currentRole}`,
          `ORG:      ${PROFILE.currentOrg}`,
          `LOCATION: ${PROFILE.location}`,
          `CLEARANCE:${PROFILE.status}`,
          `EDUCATION: M.Sc. Digital Forensics & InfoSec (NFSU, CGPA: 9.00)`
        );
        break;

      case 'cases':
        newHistory.push(
          'INDEXED SECURITY CASE FILES:',
          ...CASE_STUDIES.map(
            (c) => `  [${c.id}] ${c.caseNumber} - ${c.title} (${c.severity} | ${c.verdict})`
          )
        );
        break;

      case 'open 01':
      case 'open 1':
        newHistory.push(
          `DOSSIER DECRYPTED: ${CASE_STUDIES[0].title}`,
          `SEVERITY: ${CASE_STUDIES[0].severity} | VERDICT: ${CASE_STUDIES[0].verdict}`,
          `SUMMARY: ${CASE_STUDIES[0].overview}`,
          `OUTCOME: ${CASE_STUDIES[0].outcomes.map((o) => `${o.k} ${o.v}`).join(' | ')}`
        );
        break;

      case 'open 02':
      case 'open 2':
        newHistory.push(
          `DOSSIER DECRYPTED: ${CASE_STUDIES[1].title}`,
          `SEVERITY: ${CASE_STUDIES[1].severity} | VERDICT: ${CASE_STUDIES[1].verdict}`,
          `SUMMARY: ${CASE_STUDIES[1].overview}`,
          `OUTCOME: ${CASE_STUDIES[1].outcomes.map((o) => `${o.k} ${o.v}`).join(' | ')}`
        );
        break;

      case 'open 03':
      case 'open 3':
        newHistory.push(
          `DOSSIER DECRYPTED: ${CASE_STUDIES[2].title}`,
          `SEVERITY: ${CASE_STUDIES[2].severity} | VERDICT: ${CASE_STUDIES[2].verdict}`,
          `SUMMARY: ${CASE_STUDIES[2].overview}`,
          `OUTCOME: ${CASE_STUDIES[2].outcomes.map((o) => `${o.k} ${o.v}`).join(' | ')}`
        );
        break;

      case 'skills':
        newHistory.push(
          'TECHNICAL ARSENAL BY CATEGORY:',
          ...SKILL_CATEGORIES.map(
            (cat) => `  [${cat.title}]: ${cat.skills.map((s) => s.name).join(', ')}`
          )
        );
        break;

      case 'certs':
        newHistory.push(
          'VERIFIED CREDENTIAL VAULT:',
          ...CERTIFICATIONS.map(
            (cert) => `  * ${cert.name} (${cert.issuer}, ${cert.issueDate}) [ID: ${cert.credentialId}]`
          )
        );
        break;

      case 'kql':
        newHistory.push(
          'EXECUTING LIVE KQL HUNTING QUERY...',
          '-------------------------------------------------------',
          'DeviceProcessEvents',
          '| where TimeGenerated > ago(24h)',
          '| where InitiatingProcessFileName in ("cmd.exe", "powershell.exe")',
          '| where ProcessCommandLine has_any ("-enc", "bypass", "hidden")',
          '| summarize Detections=count() by bin(TimeGenerated, 1h), DeviceName',
          '-------------------------------------------------------',
          'QUERY STATUS: 200 OK - 0 ANOMALIES DETECTED IN LAST 24H'
        );
        break;

      case 'status':
        newHistory.push(
          'LIVE TELEMETRY READOUT:',
          '  * SIEM Ingestion Rate:  1,240 EPS (Nominal)',
          '  * EDR Sensor Fleet:     142/142 Online (CrowdStrike + MDE)',
          '  * Active Threat Level:  DEFCON 4 (Routine Monitoring)',
          '  * Automation Playbooks: 18 Active (Shuffle SOAR)'
        );
        break;

      case 'contact':
        newHistory.push(
          'VERIFIED COMMUNICATION CHANNELS:',
          `  Email:    ${PROFILE.email}`,
          `  Phone:    ${PROFILE.phone}`,
          `  LinkedIn: ${PROFILE.linkedin}`,
          `  GitHub:   ${PROFILE.github}`
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        newHistory.push(`Command not recognized: "${cmd}". Type "help" for a list of valid commands.`);
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#080d0b] border border-[#00ff88]/50 rounded-xl shadow-[0_0_90px_rgba(0,255,136,0.2)] overflow-hidden z-10 flex flex-col h-[520px] max-h-[85vh]">

        {/* Top Terminal Title Bar */}
        <div className="bg-[#040806] border-b border-[#1c2a23] px-4 py-2.5 flex items-center justify-between font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <TermIcon size={14} className="text-[#00ff88]" />
            <span className="font-bold text-white tracking-wider">
              ABHI_SEC // SOC COMMAND TERMINAL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory(['Terminal reset.', 'Type "help" for commands.'])}
              className="p-1 hover:text-white text-zinc-500 rounded"
              title="Reset Terminal"
            >
              <RefreshCw size={13} />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:text-white text-zinc-400 rounded hover:bg-zinc-800"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1 bg-[#050806] text-zinc-200">
          {history.map((line, idx) => (
            <div
              key={idx}
              className={`${
                line.startsWith('visitor@')
                  ? 'text-[#38bdf8] font-bold'
                  : line.startsWith('OPERATOR:') || line.startsWith('AVAILABLE') || line.startsWith('DOSSIER')
                  ? 'text-[#00ff88] font-bold'
                  : line.startsWith('  *') || line.startsWith('  [')
                  ? 'text-zinc-300'
                  : 'text-zinc-400'
              }`}
            >
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Prompt */}
        <form
          onSubmit={handleCommand}
          className="bg-[#030604] border-t border-[#1c2a23] px-4 py-3 flex items-center gap-2 font-mono text-xs"
        >
          <span className="text-[#00ff88] font-bold">visitor@soc-cli:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help', 'whoami', 'cases', 'kql'..."
            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-zinc-600"
            autoFocus
          />
          <button
            type="submit"
            className="px-2 py-1 bg-[#00ff88]/15 border border-[#00ff88]/40 hover:bg-[#00ff88] hover:text-black text-[#00ff88] rounded text-[10px] font-bold transition-all"
          >
            RUN
          </button>
        </form>

      </div>
    </div>
  );
};
