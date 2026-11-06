import React, { useState } from 'react';
import { ArrowUpRight, X, Copy, Check, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 'CASE-001',
    category: 'Cloud Forensics · Threat Intel',
    title: 'State-Sponsored APT Investigation',
    tagline: 'North Korea–linked APT beaconing detected on production cloud workload. Closed True Positive · No Compromise within 72 hours.',
    severity: 'CRITICAL',
    verdict: 'True Positive · No Compromise',
    duration: '72 Hours',
    role: 'Lead Forensic Investigator',
    tech: ['Azure Defender', 'KQL', 'MDE', 'SentinelOne', 'Threat Intel'],
    mitre: ['T1071.001', 'T1573', 'T1059.001', 'T1041'],
    metrics: [
      { k: '72h', v: 'Time to Verdict' },
      { k: '~17K', v: 'Defender Events' },
      { k: '~900K', v: 'KQL Events Queried' },
      { k: '0', v: 'Dwell Time' },
    ],
    phases: [
      { title: 'Scoping & Containment', points: ['Isolated VM at NSG level while preserving live memory and volatile process states.', 'Captured OS disk snapshots and harvested volatile artifacts with SHA-256 chain-of-custody.'] },
      { title: 'Endpoint Forensics', points: ['Reconstructed process execution lineage in MDE Advanced Hunting around the TLS connection timestamp.', 'Cross-verified SentinelOne DeepVisibility telemetry for identical PID, socket, and file handle tuples.'], kql: `DeviceNetworkEvents\n| where TimeGenerated >= datetime(2025-03-01)\n| where RemoteIP == "175.45.176.0/24"\n| project TimeGenerated, DeviceName, InitiatingProcessFileName,\n  InitiatingProcessCommandLine, RemoteIP, RemotePort\n| sort by TimeGenerated desc` },
      { title: 'Cloud Log Analytics (~900K Events)', points: ['Queried SecurityEvent, DeviceNetworkEvents, and SigninLogs over 14-day window.', 'Correlated EIDs 4624, 4672, 4688 with NSG flow logs and time-delta variance analysis.'], kql: `SecurityEvent\n| where TimeGenerated > ago(14d)\n| where EventID in (4624, 4672, 4688)\n| summarize EventCount=count(), Users=dcount(TargetAccount)\n  by bin(TimeGenerated, 1h), Activity\n| render timechart` },
      { title: 'Threat Intelligence Enrichment', points: ['Pivoted on destination IP across VirusTotal, AbuseIPDB, Shodan, and internal TI platforms.', 'Proved IP was reassigned to a legitimate multi-tenant CDN edge — not adversary infrastructure.'] },
      { title: 'Verdict & Remediation', points: ['Formally closed as True Positive / No Compromise.', 'Delivered remediation: tuned Azure alert sensitivity, deployed proactive KQL hunting queries, tightened NSG egress.'] },
    ],
    iocs: [
      { type: 'IP', value: '175.45.176.23', status: 'Reassigned CDN' },
      { type: 'Process', value: 'EnterpriseTelemetryService.exe', status: 'Signed Binary' },
    ],
    learnings: [
      'Reputation indicators are initial pointers — shared CDN edges frequently inherit legacy threat flags.',
      'Pre-authored KQL beacon-jitter templates reduce triage from 8h to under 30 minutes.',
      'A structured 5-phase forensic methodology provides airtight defense for executive stakeholders.',
    ],
    repoUrl: 'https://github.com/abhiiibabariya-dev',
  },
  {
    id: 'CASE-002',
    category: 'SIEM · SOAR · Automation',
    title: 'SOC Automation Lab — Wazuh + TheHive + Shuffle',
    tagline: 'Production-grade SOC automation pipeline reducing manual triage by 80% with playbook-driven orchestration.',
    severity: 'HIGH',
    verdict: 'Fully Operational Pipeline',
    duration: '6 Weeks',
    role: 'SOC Architect & Automation Engineer',
    tech: ['Wazuh', 'TheHive', 'Cortex', 'Shuffle SOAR', 'VirusTotal API', 'AbuseIPDB'],
    mitre: ['T1059', 'T1078', 'T1110', 'T1053'],
    metrics: [
      { k: '80%', v: 'Triage Time Reduced' },
      { k: '12+', v: 'Detection Rules' },
      { k: '4', v: 'SOAR Playbooks' },
      { k: '100%', v: 'ATT&CK Mapped' },
    ],
    phases: [
      { title: 'SIEM Architecture', points: ['Deployed Wazuh manager, clustered indexers, and dashboards on hardened Linux.', 'Configured multi-OS ingestion: Windows, Linux, Sysmon, Suricata NIDS via rsyslog.'] },
      { title: 'Detection Engineering', points: ['Authored 12+ custom Wazuh rules targeting PowerShell obfuscation, WMI execution, and scheduled-task persistence.', 'Mapped all rules to MITRE ATT&CK for heat-map coverage analytics.'] },
      { title: 'TheHive & Cortex Orchestration', points: ['Integrated Wazuh webhooks to auto-spawn formatted cases in TheHive for severity ≥ 7 alerts.', 'Connected Cortex analyzers (VirusTotal, AbuseIPDB, Shodan) for synchronous enrichment.'] },
      { title: 'Shuffle SOAR Playbooks', points: ['Developed end-to-end playbooks for phishing triage, brute-force mitigation, and host containment.', 'Embedded human-in-the-loop validation before high-impact isolation actions.'] },
    ],
    learnings: [
      'Enrichment on ingestion is the single highest leverage point for SOC operational velocity.',
      'Modular SOAR building blocks allow new playbooks to be developed 3× faster by reusing tested connectors.',
      'Human-in-the-loop gates in automated containment prevent accidental production outages from false positives.',
    ],
    repoUrl: 'https://github.com/abhiiibabariya-dev/soc-automation-toolkit',
  },
  {
    id: 'CASE-003',
    category: 'Detection Engineering',
    title: 'CyberGuard — Behavioral Threat Detection',
    tagline: 'Living-off-the-land detection logic hunting PowerShell obfuscation, WMI abuse, and LSASS credential dumping.',
    severity: 'HIGH',
    verdict: 'Zero Missed Red-Team Techniques',
    duration: '4 Weeks',
    role: 'Detection Engineer',
    tech: ['Sysmon', 'YARA', 'VirusTotal', 'ANY.RUN', 'Behavioral Analytics', 'PowerShell'],
    mitre: ['T1059.001', 'T1047', 'T1003.001', 'T1027'],
    metrics: [
      { k: '8', v: 'ATT&CK Sub-Techniques' },
      { k: '0', v: 'Missed Detections' },
      { k: '< 2%', v: 'False Positive Rate' },
      { k: '100%', v: 'Validated Rules' },
    ],
    phases: [
      { title: 'Telemetry Modeling', points: ['Selected 8 critical ATT&CK sub-techniques with high real-world dwell time.', 'Identified log prerequisites: Sysmon EID 1, 7, 10 and Windows EID 4688.'] },
      { title: 'Behavioral Logic Development', points: ['Regex signatures for obfuscated PowerShell: base64, -EncodedCommand, XOR, IEX wrappers.', 'LSASS detection: unsigned binaries requesting process memory handles (Sysmon EID 10).'], kql: `// Suspicious PowerShell Encoding Detection\nDeviceProcessEvents\n| where FileName =~ "powershell.exe"\n| where ProcessCommandLine has_any ("-enc", "-EncodedCommand", "bypass", "hidden")\n| where InitiatingProcessFileName !in~ ("wmiprvse.exe","svchost.exe")\n| project Timestamp, DeviceName, AccountName,\n  ProcessCommandLine, InitiatingProcessFileName` },
      { title: 'Validation & Tuning', points: ['Tested against Atomic Red Team scenarios and custom obfuscation harnesses.', 'Achieved < 2% false-positive rate against 7-day clean enterprise baseline.'] },
    ],
    learnings: [
      'Multi-dimensional behavioral correlation dramatically outperforms single-field regex.',
      'A rule without a repeatable validation test is technical debt waiting to fail silently.',
      'Embedding parent process lineage in alert payloads eliminates ~80% of analyst pivot overhead.',
    ],
    repoUrl: 'https://github.com/abhiiibabariya-dev/CyberNest',
  },
  {
    id: 'CASE-004',
    category: 'Digital Forensics · DFIR',
    title: 'Mobile & Cloud Forensic Evidence Reconstruction',
    tagline: 'Bit-by-bit forensic acquisition and cloud sync reconstruction producing legal-grade evidentiary reports with SHA-256 chain of custody.',
    severity: 'MEDIUM',
    verdict: '100% Chain of Custody Preserved',
    duration: '3 Weeks',
    role: 'Lead Forensic Examiner',
    tech: ['Autopsy', 'FTK Imager', 'ADB', 'SQLite Forensics', 'Google Drive', 'iCloud', 'Dropbox'],
    mitre: ['T1005', 'T1530', 'T1070'],
    metrics: [
      { k: '100%', v: 'Chain of Custody' },
      { k: '4', v: 'Cloud Systems Mapped' },
      { k: 'SHA-256', v: 'Cryptographic Verify' },
      { k: 'Court-Ready', v: 'Admissibility' },
    ],
    phases: [
      { title: 'Forensic Acquisition', points: ['Secured device in RF-shielded Faraday enclosure.', 'Bit-by-bit acquisition and logical extraction with SHA-256 hash log at acquisition, transfer, and analysis.'] },
      { title: 'Artifact Parsing & Recovery', points: ['Parsed SQLite databases to recover deleted SMS, WhatsApp fragments, and call logs.', 'Correlated GPS cache tables with image EXIF timestamps for geographic movement timeline.'] },
      { title: 'Cloud Sync Analysis', points: ['Analyzed sync client databases for Google Drive, iCloud, Dropbox, and OneDrive.', 'Identified unauthorized data exfiltration staging directories and recovered shared cloud links.'] },
    ],
    learnings: [
      'Triple cryptographic hashing is mandatory for defensible courtroom evidence.',
      'Cloud sync metadata markers provide indispensable timeline anchors when local timestamps are manipulated.',
      'SQLite WAL files frequently retain deleted data long after database compaction.',
    ],
    repoUrl: 'https://github.com/abhiiibabariya-dev',
  },
];

const severityColor: Record<string, string> = {
  CRITICAL: 'text-red-400 border-red-500/30 bg-red-500/5',
  HIGH: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
  MEDIUM: 'text-sky-400 border-sky-500/30 bg-sky-500/5',
};

interface ModalProps { project: typeof projects[0]; onClose: () => void; }

const Modal: React.FC<ModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<'phases' | 'iocs' | 'learnings'>('phases');

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-[#0a0a0b] border border-[#2a2a30] my-auto z-10">

        {/* Modal header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e1e22] bg-[#0f0f10]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#4a4a54]">{project.id}</span>
            <span className="text-[#1e1e22]">·</span>
            <span className="font-mono text-xs text-[#8a8a96]">{project.category}</span>
          </div>
          <button onClick={onClose} className="text-[#4a4a54] hover:text-[#f0efea] transition-colors cursor-pointer p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-8 space-y-8">

          {/* Title block */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`font-mono text-[10px] px-2 py-0.5 border ${severityColor[project.severity]}`}>
                {project.severity}
              </span>
              <span className="font-mono text-[10px] text-[#4ade80] border border-[#4ade80]/30 px-2 py-0.5 bg-[#4ade80]/5">
                {project.verdict}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#f0efea] mb-2">{project.title}</h2>
            <p className="text-[#8a8a96] leading-relaxed">{project.tagline}</p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { k: 'DURATION', v: project.duration },
              { k: 'ROLE', v: project.role },
              { k: 'MITRE TECHNIQUES', v: project.mitre.slice(0, 2).join(', ') + (project.mitre.length > 2 ? '...' : '') },
              { k: 'TECHNOLOGIES', v: project.tech.slice(0, 2).join(', ') + '...' },
            ].map(m => (
              <div key={m.k} className="border border-[#1e1e22] bg-[#0f0f10] p-3">
                <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">{m.k}</div>
                <div className="font-mono text-xs text-[#c8a96b] font-semibold leading-snug">{m.v}</div>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {project.metrics.map(m => (
              <div key={m.k} className="border border-[#c8a96b]/20 bg-[#c8a96b]/5 p-4 text-center">
                <div className="font-display text-2xl font-bold text-[#c8a96b]">{m.k}</div>
                <div className="font-mono text-[10px] text-[#8a8a96] mt-1">{m.v}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 border-b border-[#1e1e22] mb-5">
              {(['phases', 'iocs', 'learnings'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`font-mono text-[11px] px-4 py-2 tracking-wider cursor-pointer transition-colors border-b-2 ${
                    tab === t
                      ? 'text-[#c8a96b] border-[#c8a96b]'
                      : 'text-[#4a4a54] border-transparent hover:text-[#8a8a96]'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {tab === 'phases' && (
              <div className="space-y-4">
                {project.phases.map((ph, i) => (
                  <div key={i} className="border border-[#1e1e22] bg-[#0f0f10]">
                    <div className="px-4 py-3 border-b border-[#1e1e22] flex items-center gap-3">
                      <span className="font-mono text-[10px] text-[#c8a96b] w-6">0{i+1}</span>
                      <span className="font-mono text-xs text-[#f0efea] font-semibold">{ph.title}</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {ph.points.map((p, j) => (
                        <div key={j} className="flex items-start gap-2.5 text-sm text-[#8a8a96]">
                          <span className="text-[#c8a96b] mt-0.5 shrink-0">→</span>
                          <span>{p}</span>
                        </div>
                      ))}
                      {ph.kql && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[9px] text-[#4a4a54] tracking-widest">KQL HUNTING QUERY</span>
                            <button
                              onClick={() => copy(ph.kql!, `kql-${i}`)}
                              className="flex items-center gap-1 font-mono text-[9px] text-[#4a4a54] hover:text-[#c8a96b] transition-colors cursor-pointer"
                            >
                              {copied === `kql-${i}` ? <Check size={10} className="text-[#4ade80]" /> : <Copy size={10} />}
                              {copied === `kql-${i}` ? 'COPIED' : 'COPY'}
                            </button>
                          </div>
                          <pre className="code-block text-[11px]">{ph.kql}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'iocs' && (
              <div>
                {project.iocs && project.iocs.length > 0 ? (
                  <div className="border border-[#1e1e22] overflow-hidden">
                    <div className="grid grid-cols-3 gap-0 bg-[#0f0f10] border-b border-[#1e1e22] px-4 py-2">
                      {['TYPE', 'VALUE', 'STATUS'].map(h => (
                        <span key={h} className="font-mono text-[9px] text-[#4a4a54] tracking-widest">{h}</span>
                      ))}
                    </div>
                    {project.iocs.map((ioc, i) => (
                      <div key={i} className="grid grid-cols-3 gap-0 px-4 py-3 border-b border-[#1e1e22] last:border-b-0 hover:bg-[#0f0f10] transition-colors">
                        <span className="font-mono text-xs text-[#8a8a96]">{ioc.type}</span>
                        <span className="font-mono text-xs text-[#c8a96b] break-all pr-2">{ioc.value}</span>
                        <span className="font-mono text-xs text-[#4ade80]">{ioc.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-sm text-[#4a4a54] text-center py-8">No public IOCs for this case.</p>
                )}
              </div>
            )}

            {tab === 'learnings' && (
              <div className="space-y-3">
                {project.learnings.map((l, i) => (
                  <div key={i} className="flex items-start gap-4 border border-[#1e1e22] bg-[#0f0f10] p-4">
                    <span className="font-mono text-[#c8a96b]/50 text-sm shrink-0 mt-0.5">0{i+1}</span>
                    <p className="text-[#8a8a96] text-sm leading-relaxed">{l}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#1e1e22]">
            <div className="flex flex-wrap gap-2 flex-1">
              {project.tech.map(t => (
                <span key={t} className="font-mono text-[10px] text-[#4a4a54] border border-[#1e1e22] px-2 py-0.5">{t}</span>
              ))}
            </div>
            {project.repoUrl && (
              <a
                href={project.repoUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-[#c8a96b]/40 text-[#c8a96b] font-mono text-xs hover:bg-[#c8a96b]/10 transition-all whitespace-nowrap"
              >
                <ExternalLink size={12} />
                VIEW REPOSITORY
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export const Projects: React.FC = () => {
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);

  return (
    <section id="projects" className="py-24 border-b border-[#1e1e22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">03 / SELECTED CASE FILES</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0efea] uppercase leading-tight">
              Security<br />Investigations
            </h2>
          </div>
          <p className="text-[#4a4a54] font-mono text-xs max-w-xs text-right sm:pb-1">
            Click any case to open full forensic dossier
          </p>
        </div>

        <div className="space-y-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="w-full text-left border border-[#1e1e22] bg-[#0f0f10] hover:border-[#c8a96b]/30 hover:bg-[#0f0f10] transition-all group cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 flex-1">
                  <span className="font-mono text-[11px] text-[#4a4a54] shrink-0 w-20">{p.id}</span>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] text-[#4a4a54] tracking-widest mb-1">{p.category}</div>
                    <div className="font-display text-lg font-bold text-[#f0efea] group-hover:text-[#c8a96b] transition-colors">
                      {p.title}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:shrink-0">
                    <span className={`font-mono text-[9px] px-2 py-0.5 border ${severityColor[p.severity]}`}>
                      {p.severity}
                    </span>
                    {p.mitre.slice(0, 2).map(m => (
                      <span key={m} className="font-mono text-[9px] text-[#4a4a54] border border-[#1e1e22] px-2 py-0.5">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-[#4a4a54] group-hover:text-[#c8a96b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                />
              </div>
            </button>
          ))}
        </div>

      </div>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};
