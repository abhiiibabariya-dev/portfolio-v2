import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CASE_STUDIES, CERTIFICATIONS, PROFILE, SKILL_CATEGORIES } from '../data/portfolioData';

const welcome = [
  '========================================================================',
  '  ABHI_SEC // SOC COMMAND OPERATING SYSTEM (v2026.4)',
  '  Connected Node: ICICI_SOC_DEFENSE_NODE (10.0.30.90)',
  '  Operator: Abhishek Babariya · DFIR & Incident Response Specialist',
  '========================================================================',
  'Type "help" to view all supported investigation commands.',
  'Quick commands: whoami, cases, kql, mitre, iocs, certs, status, labs, help',
  '',
];

const QUICK_COMMANDS = ['help', 'whoami', 'cases', 'kql', 'mitre', 'iocs', 'certs', 'status', 'labs', 'clear'];

export const TerminalPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(welcome);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const go = (path: string) => {
    navigate(path);
  };

  const executeCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    const command = raw.toLowerCase();
    if (!command) return;

    const output = [...history, `visitor@abhi-sec:~$ ${raw}`];
    const navigation: Record<string, string> = {
      about: '/about',
      skills: '/skills',
      experience: '/experience',
      resume: '/resume',
      contact: '/contact',
      schedule: '/schedule',
      verify: '/verify',
      projects: '/projects',
      recruiter: '/recruiter',
      interview: '/interview',
      labs: '/visualizations',
      visualizations: '/visualizations',
      soc: '/visualizations',
    };

    if (command in navigation) {
      output.push(`Navigating to ${command}...`);
      setHistory(output);
      setInput('');
      window.setTimeout(() => go(navigation[command]), 200);
      return;
    }

    if (command === 'help') {
      output.push(
        'AVAILABLE SYSTEM COMMANDS:',
        '  whoami       - Display operator identity, clearance & education',
        '  cases        - Enumerate all security incident case files',
        '  open <01-04> - Decrypt and view specific case study dossier',
        '  kql          - Execute simulated KQL threat hunt query',
        '  mitre        - Display MITRE ATT&CK technique mapping',
        '  iocs         - List high-fidelity indicators of compromise',
        '  certs        - Query verified certification vault & credentials',
        '  status       - Readout live SOC telemetry & sensor metrics',
        '  skills       - Inspect technical arsenal and tooling',
        '  labs         - Navigate to interactive SOC telemetry labs',
        '  playbook     - Display NIST / PICERL incident response workflow',
        '  contact      - Display verified communication channels',
        '  github       - Launch GitHub profile in new tab',
        '  linkedin     - Launch LinkedIn profile in new tab',
        '  clear        - Wipe terminal buffer'
      );
    } else if (command === 'whoami') {
      output.push(
        `OPERATOR:    ${PROFILE.name} (${PROFILE.handle})`,
        `ROLE:        ${PROFILE.role}`,
        `CURRENT:     ${PROFILE.currentRole} @ ${PROFILE.currentOrg}`,
        `LOCATION:    ${PROFILE.location}`,
        `EDUCATION:   M.Sc. Digital Forensics & InfoSec (NFSU, CGPA: 9.00 Distinction)`,
        `CLEARANCE:   ${PROFILE.status}`
      );
    } else if (command === 'cases') {
      output.push(
        'INDEXED SECURITY CASE FILES:',
        ...CASE_STUDIES.map(
          study => `  [${study.id}] ${study.caseNumber} - ${study.title} (${study.severity} | ${study.verdict})`
        ),
        'Type "open 01", "open 02", etc. to decrypt a case study dossier.'
      );
    } else if (command.startsWith('open ')) {
      const caseId = command.replace('open ', '').trim().padStart(2, '0');
      const found = CASE_STUDIES.find(c => c.id === caseId || c.slug.includes(caseId));
      if (found) {
        output.push(
          `DOSSIER DECRYPTED: ${found.caseNumber} - ${found.title}`,
          `SEVERITY: ${found.severity} | CLASSIFICATION: ${found.classification} | STATUS: ${found.status}`,
          `ROLE: ${found.role} | DURATION: ${found.duration}`,
          `OVERVIEW: ${found.overview}`,
          `MITRE: ${found.mitreTechniques.join(', ')}`,
          `OUTCOMES: ${found.outcomes.map(o => `${o.k}: ${o.v}`).join(' | ')}`,
          `Navigate to full case study: /projects/${found.slug}`
        );
      } else {
        output.push(`Case "${caseId}" not found. Valid IDs: 01, 02, 03, 04`);
      }
    } else if (command === 'kql') {
      output.push(
        'EXECUTING LIVE KQL HUNTING QUERY...',
        '-------------------------------------------------------',
        'DeviceNetworkEvents',
        '| where TimeGenerated >= ago(7d)',
        '| where RemotePort in (443, 8443, 8080)',
        '| where ActionType == "ConnectionSuccess"',
        '| join kind=inner (',
        '    DeviceProcessEvents',
        '    | where ProcessCommandLine has_any ("-enc", "bypass", "IEX", "DownloadString")',
        '  ) on DeviceId',
        '| summarize EventCount=count() by RemoteIP, InitiatingProcessFileName, DeviceName',
        '| sort by EventCount desc',
        '-------------------------------------------------------',
        'QUERY STATUS: 200 OK — 1 ALERT MATCH FOUND (CASE-001 MITRE T1071.001)'
      );
    } else if (command === 'mitre') {
      output.push(
        'MITRE ATT&CK PRODUCTION DETECTION COVERAGE:',
        '  [TA0001] Initial Access      -> T1566.001 Spearphishing Attachment',
        '  [TA0002] Execution           -> T1059.001 PowerShell Obfuscation & IEX',
        '  [TA0003] Persistence         -> T1053.005 Scheduled Tasks (Sysmon ID 1)',
        '  [TA0004] Priv Escalation     -> T1548.002 Bypass UAC & Token Elevation',
        '  [TA0005] Defense Evasion     -> T1027 Obfuscated / Encoded Commands',
        '  [TA0006] Credential Access   -> T1003.001 LSASS Memory Injection (Event 10)',
        '  [TA0008] Lateral Movement    -> T1021.002 SMB / WMI Remote Execution',
        '  [TA0010] Exfiltration        -> T1041 Exfiltration Over C2 Channel'
      );
    } else if (command === 'iocs') {
      output.push(
        'INDICATORS OF COMPROMISE CATALOG:',
        '  [IP]     175.45.176.23        -> Historic Lazarus Cluster / CDN Reassigned',
        '  [IP]     45.61.184.22         -> 45x RDP Brute Force / Active Edge Drop',
        '  [IP]     194.169.175.14       -> AbuseIPDB 98% Confidence / C2 Edge',
        '  [SHA256] 8f4a21b3e9047c5d...  -> Verified Enterprise Telemetry Binary',
        '  [PROC]   wmic.exe spawning ps -> Sysmon ID 1 Detection Trigger'
      );
    } else if (command === 'status') {
      output.push(
        'LIVE SOC TELEMETRY READOUT:',
        '  * SIEM Ingestion Rate:   1,240 EPS (Nominal Operating Range)',
        '  * EDR Sensor Fleet:      142/142 Online (CrowdStrike Falcon + MDE)',
        '  * Incident Triage Queue: 0 Critical Uncontained Alerts',
        '  * Active Threat Level:   DEFCON 4 (Routine Enterprise Monitoring)',
        '  * Automation Playbooks:  18 Active Orchestrations (Shuffle SOAR)'
      );
    } else if (command === 'certs') {
      output.push(
        'VERIFIED CREDENTIAL VAULT:',
        ...CERTIFICATIONS.map(
          c => `  * ${c.name} (${c.issuer}, ${c.issueDate}) [ID: ${c.credentialId}]`
        )
      );
    } else if (command === 'skills') {
      output.push(
        'TECHNICAL ARSENAL BY DISCIPLINE:',
        ...SKILL_CATEGORIES.map(
          cat => `  [${cat.title}]: ${cat.skills.map(s => s.name).join(', ')}`
        )
      );
    } else if (command === 'playbook') {
      output.push(
        'STANDARD DFIR TRIAGE PLAYBOOK (NIST SP 800-61 Rev. 2):',
        '  1. PREPARATION   -> Sensor health verification & hardened runbooks',
        '  2. IDENTIFICATION-> Multi-source correlation: SIEM + EDR + KQL telemetry',
        '  3. CONTAINMENT   -> Host isolation at NSG/EDR level while preserving memory',
        '  4. ERADICATION   -> Root-cause binary eradication & credential invalidation',
        '  5. RECOVERY      -> Baseline integrity verification & telemetry monitoring',
        '  6. POST-INCIDENT -> Formal root-cause analysis (RCA) & detection rule tuning'
      );
    } else if (command === 'contact') {
      output.push(
        'VERIFIED DIRECT COMMUNICATION CHANNELS:',
        `  Email:    ${PROFILE.email}`,
        `  Phone:    ${PROFILE.phone}`,
        `  Location: ${PROFILE.location}`,
        `  LinkedIn: ${PROFILE.linkedin}`,
        `  GitHub:   ${PROFILE.github}`
      );
    } else if (command === 'github') {
      output.push('Launching GitHub profile in new tab...');
      window.open(PROFILE.github, '_blank', 'noopener,noreferrer');
    } else if (command === 'linkedin') {
      output.push('Launching LinkedIn profile in new tab...');
      window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer');
    } else if (command === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else {
      output.push(`Command not recognized: "${raw}". Type "help" for a list of valid commands.`);
    }

    setHistory(output);
    setInput('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    executeCommand(input);
  };

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <header className="mb-8">
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">09 / PORTFOLIO TERMINAL</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase">
            Command<br />Interface
          </h1>
          <p className="mt-3 font-mono text-xs text-[#8a8a96]">
            Interactive SOC console. Inspect case studies, execute simulated KQL queries, check IOCs, and verify credentials.
          </p>
        </header>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="font-mono text-[10px] text-[#4a4a54] self-center">QUICK RUN:</span>
          {QUICK_COMMANDS.map(cmd => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="px-2.5 py-1 border border-[#1c2a23] bg-[#050806] hover:border-[#4ade80]/50 hover:text-[#4ade80] text-[#8a8a96] font-mono text-[10px] transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        <section aria-label="Interactive portfolio terminal" className="border border-[#24503a] bg-[#050806] shadow-[0_0_50px_rgba(74,222,128,0.06)] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1c2a23] font-mono text-[10px] bg-[#030604]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
              <span className="text-[#4ade80] font-bold">visitor@abhi-sec:~$ secure-session</span>
            </div>
            <button onClick={() => setHistory(welcome)} className="text-[#8a8a96] hover:text-[#f0efea]" aria-label="Reset terminal">
              RESET
            </button>
          </div>

          <div className="h-[55vh] min-h-[360px] overflow-y-auto p-4 sm:p-6 font-mono text-xs leading-relaxed text-[#8a8a96]">
            {history.map((line, index) => (
              <p
                key={`${line}-${index}`}
                className={
                  line.startsWith('visitor@')
                    ? 'text-[#c8a96b] mt-3 font-bold'
                    : line.includes('AVAILABLE SYSTEM COMMANDS:') || line.includes('OPERATOR:') || line.includes('LIVE SOC TELEMETRY') || line.includes('DOSSIER DECRYPTED')
                    ? 'text-[#4ade80] font-bold'
                    : line.startsWith('  *') || line.startsWith('  [')
                    ? 'text-[#f0efea]'
                    : line.includes('QUERY STATUS:')
                    ? 'text-[#38bdf8] font-bold'
                    : ''
                }
              >
                {line || '\u00a0'}
              </p>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[#1c2a23] p-4 flex items-center gap-2 bg-[#030604]">
            <span className="font-mono text-xs text-[#4ade80] shrink-0 font-bold">visitor@abhi-sec:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              className="flex-1 min-w-0 bg-transparent text-[#f0efea] font-mono text-xs outline-none placeholder:text-[#4a4a54]"
              aria-label="Terminal command"
              placeholder="Type 'help', 'kql', 'whoami', 'cases'..."
            />
            <button className="px-3 py-1 bg-[#4ade80]/10 border border-[#4ade80]/40 text-[#4ade80] font-mono text-xs font-bold hover:bg-[#4ade80] hover:text-[#0a0a0b] transition-all">
              RUN
            </button>
          </form>
        </section>

        <p className="font-mono text-[10px] text-[#4a4a54] mt-4">
          Visual cybersecurity portfolio command interface. All telemetry and query results are simulated for security demonstration.
        </p>
      </div>
    </div>
  );
};
