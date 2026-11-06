import React, { useState } from 'react';
import { Shield, Search, Copy, Check, Terminal, Crosshair, Database, FileCode } from 'lucide-react';

interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  tacticId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  detectionSource: string;
  kql: string;
  mitigation: string;
  caseRef?: string;
}

interface IocRecord {
  indicator: string;
  type: 'IP' | 'DOMAIN' | 'SHA256' | 'PROCESS';
  threatActor: string;
  campaign: string;
  confidence: number;
  verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'INVESTIGATING';
  mitre: string[];
  context: string;
  recommendedAction: string;
}

const TECHNIQUES: MitreTechnique[] = [
  {
    id: 'T1566.001',
    name: 'Spearphishing Attachment',
    tactic: 'Initial Access',
    tacticId: 'TA0001',
    severity: 'HIGH',
    description: 'Adversaries send targeted emails containing weaponized ISO, ZIP, or macro-enabled documents to gain execution.',
    detectionSource: 'Email Gateway Logs, Defender for Office 365, MDE DeviceFileEvents',
    kql: `EmailEvents
| where DeliveryAction == "Delivered"
| where AttachmentCount > 0
| join kind=inner (
    DeviceFileEvents
    | where ActionType == "FileCreated"
    | where FileName endswith_any (".iso", ".vhd", ".one", ".xlsm")
) on AccountUpn
| project TimeGenerated, SenderMailFromAddress, RecipientEmailAddress, FileName, DeviceName`,
    mitigation: 'Block executable & container file attachments at Secure Email Gateway (SEG). Implement Attack Surface Reduction (ASR) rules.',
    caseRef: 'CASE-001 (Spearphishing & Memory Defense)',
  },
  {
    id: 'T1059.001',
    name: 'PowerShell Obfuscation & IEX',
    tactic: 'Execution',
    tacticId: 'TA0002',
    severity: 'CRITICAL',
    description: 'Adversaries abuse PowerShell with encoded command-lines (-enc, -w hidden), WebClient downloads, and Invoke-Expression execution.',
    detectionSource: 'Sysmon Event ID 1 / MDE DeviceProcessEvents / ScriptBlock Logging 4104',
    kql: `DeviceProcessEvents
| where ProcessCommandLine has_any ("powershell", "pwsh")
| where ProcessCommandLine has_any ("-enc", "bypass", "IEX", "DownloadString", "Invoke-Expression")
| summarize FirstSeen=min(TimeGenerated), EventCount=count() by InitiatingProcessFileName, ProcessCommandLine, DeviceName, AccountName
| sort by FirstSeen desc`,
    mitigation: 'Enable PowerShell Constrained Language Mode (CLM), AppLocker/WDAC policy, and enforce Script Block Logging (Event 4104).',
    caseRef: 'CASE-001 & CASE-004',
  },
  {
    id: 'T1055.001',
    name: 'Dynamic-Link Library Injection',
    tactic: 'Defense Evasion',
    tacticId: 'TA0005',
    severity: 'CRITICAL',
    description: 'Adversaries inject malicious code into legitimate processes (such as svchost.exe or explorer.exe) to evade EDR and blend with system traffic.',
    detectionSource: 'Sysmon Event ID 8 (CreateRemoteThread) / Volatility VAD Inspection / MDE Memory',
    kql: `DeviceEvents
| where ActionType == "OpenProcessApiCall" or ActionType == "CreateRemoteThreadApiCall"
| where InitiatingProcessFileName in ("powershell.exe", "cmd.exe", "wscript.exe")
| where FileName in ("svchost.exe", "lsass.exe", "spoolsv.exe")
| project TimeGenerated, DeviceName, InitiatingProcessFileName, FileName, ActionType`,
    mitigation: 'Enforce Windows Defender Credential Guard, exploit protection mitigations, and EDR behavioral memory scanning.',
    caseRef: 'CASE-001 (svchost.exe Memory Triage)',
  },
  {
    id: 'T1003.001',
    name: 'LSASS Memory Credential Dumping',
    tactic: 'Credential Access',
    tacticId: 'TA0006',
    severity: 'CRITICAL',
    description: 'Adversaries harvest credentials by reading Local Security Authority Subsystem Service (LSASS) process memory with tools like Mimikatz or procdump.',
    detectionSource: 'Sysmon Event ID 10 (ProcessAccess) / MDE DeviceEvents',
    kql: `DeviceEvents
| where ActionType == "ProcessAccess"
| where TargetProcessFileName =~ "lsass.exe"
| where InitiatingProcessFileName !in~ ("csrss.exe", "svchost.exe", "services.exe", "MsMpEng.exe")
| summarize ReadAttempts=count() by InitiatingProcessFileName, DeviceName, AccountName, bin(TimeGenerated, 5m)
| where ReadAttempts > 3`,
    mitigation: 'Enable LSA Protection (RunAsPPL=1), Credential Guard via Hyper-V virtualization-based security, and restrict local administrator rights.',
    caseRef: 'CASE-002 (Active Directory Incident)',
  },
  {
    id: 'T1021.002',
    name: 'SMB / Admin Shares Lateral Movement',
    tactic: 'Lateral Movement',
    tacticId: 'TA0008',
    severity: 'HIGH',
    description: 'Adversaries use valid administrative credentials to access IPC$, C$, or ADMIN$ shares to push beacons and payloads laterally across the enterprise.',
    detectionSource: 'Windows Security Event ID 5140 (Network Share Access) / MDE DeviceNetworkEvents',
    kql: `DeviceNetworkEvents
| where RemotePort in (445, 139)
| where ActionType == "ConnectionSuccess"
| join kind=inner (
    DeviceFileEvents
    | where FolderPath has_any ("\\\\admin$", "\\\\c$", "\\\\ipc$")
    | where ActionType == "FileCreated"
) on DeviceId
| project TimeGenerated, SourceDevice=InitiatingProcessFileName, TargetDevice=DeviceName, FolderPath, FileName`,
    mitigation: 'Disable SMBv1 entirely, enforce SMB signing and encryption, microsegment administrative VLANs, and restrict remote RPC/SMB to jump hosts.',
    caseRef: 'CASE-002 (AD Lateral Movement Containment)',
  },
  {
    id: 'T1071.001',
    name: 'Web Protocols Command & Control',
    tactic: 'Command and Control',
    tacticId: 'TA0011',
    severity: 'HIGH',
    description: 'Adversaries communicate using HTTPS / WebSockets with customized User-Agents, self-signed certificates, and jittered heartbeat beacons.',
    detectionSource: 'Proxy / Zscaler Logs, Firewall Egress, MDE DeviceNetworkEvents',
    kql: `DeviceNetworkEvents
| where RemotePort in (443, 8443)
| where ActionType == "ConnectionSuccess"
| summarize BeaconCount=count(), BytesTransferred=sum(TotalBytesSent) by RemoteIP, RemoteUrl, InitiatingProcessFileName, bin(TimeGenerated, 10m)
| where BeaconCount > 20
| sort by BeaconCount desc`,
    mitigation: 'Implement SSL/TLS inspection, category filtering, Threat Intel reputation feeds, and EDR network protection blocks.',
    caseRef: 'CASE-003 (Banking C2 Infrastructure Drop)',
  },
  {
    id: 'T1053.005',
    name: 'Scheduled Task Persistence',
    tactic: 'Persistence',
    tacticId: 'TA0003',
    severity: 'MEDIUM',
    description: 'Adversaries configure scheduled tasks (schtasks.exe) to maintain persistence across reboots with elevated privileges.',
    detectionSource: 'Security Event ID 4698 (A scheduled task was created) / Sysmon Event ID 1',
    kql: `SecurityEvent
| where EventID == 4698
| parse EventData with * '<TaskName>' TaskName '</TaskName>' *
| parse EventData with * '<Command>' Command '</Command>' *
| where Command has_any ("powershell", "cmd.exe", "mshta", "rundll32", "certutil")
| project TimeGenerated, Computer, TaskName, Command, SubjectUserName`,
    mitigation: 'Audit scheduled task creation via Group Policy, restrict standard users from creating tasks, and baseline production tasks.',
    caseRef: 'CASE-004 (Persistence & Triage)',
  },
];

const IOC_DATABASE: IocRecord[] = [
  {
    indicator: '175.45.176.23',
    type: 'IP',
    threatActor: 'APT38 / Lazarus Group Cluster',
    campaign: 'Financial Institution SWIFT & C2 Infrastructure',
    confidence: 96,
    verdict: 'MALICIOUS',
    mitre: ['T1071.001 (Web Protocols)', 'T1041 (Exfiltration Over C2)'],
    context: 'Historical attribution to state-sponsored financial intrusion activity. Associated with beaconing HTTP POST payloads disguised as standard CDN traffic.',
    recommendedAction: 'Edge firewall NSG drop rule. Null-route IP across all edge gateways. Sweep historical proxy telemetry for last 90 days.',
  },
  {
    indicator: '45.61.184.22',
    type: 'IP',
    threatActor: 'Uncategorized Threat Group (FIN-ACTOR-402)',
    campaign: 'Targeted RDP Brute Force & Access Broker',
    confidence: 91,
    verdict: 'MALICIOUS',
    mitre: ['T1110.001 (Brute Force: Password Guessing)', 'T1133 (External Remote Services)'],
    context: 'Originated over 45 failed RDP login attempts within 60 seconds against DMZ gateway endpoints. Correlated with automated credential stuffing toolkits.',
    recommendedAction: 'Immediate IP blacklist on Palo Alto perimeter firewalls. Enforce mandatory MFA on all external gateway VPN/RDP portals.',
  },
  {
    indicator: '8f4a21b3e9047c5d319808e01bb54e92a8321048e918237e2a9675ad70a2948c',
    type: 'SHA256',
    threatActor: 'Qakbot / Black Basta Affiliate',
    campaign: 'Obfuscated DLL Loader in Banking Sector',
    confidence: 99,
    verdict: 'MALICIOUS',
    mitre: ['T1055.001 (DLL Injection)', 'T1027 (Obfuscated Files)', 'T1059.001 (PowerShell)'],
    context: 'Cryptographic hash of reflective DLL extracted from svchost.exe memory space during CASE-001 forensic triage. Unlinked PEB header with RWX permissions.',
    recommendedAction: 'Fleetwide IOC block in CrowdStrike Falcon / MDE. Isolate affected host while preserving memory dump for Volatility analysis.',
  },
  {
    indicator: 'secure-icici-auth-verify.com',
    type: 'DOMAIN',
    threatActor: 'Credential Harvester Campaign (Typosquatted)',
    campaign: 'Customer & Employee Credential Theft',
    confidence: 94,
    verdict: 'MALICIOUS',
    mitre: ['T1566.002 (Spearphishing Link)', 'T1583.001 (Domains)'],
    context: 'Newly registered domain (NRD) hosted on bulletproof Russian ASN. Mimics corporate SSO login page with evilginx2 reverse proxy to capture Session Cookies.',
    recommendedAction: 'Add to corporate DNS sinkhole (Zscaler / Pi-hole). Request emergency registrar takedown via APWG and abuse contact.',
  },
  {
    indicator: 'wmic.exe process call create "powershell -enc ..."',
    type: 'PROCESS',
    threatActor: 'Living-Off-The-Land (LotL) Intrusion',
    campaign: 'Internal Lateral Movement via WMI',
    confidence: 89,
    verdict: 'SUSPICIOUS',
    mitre: ['T1047 (WMI)', 'T1059.001 (PowerShell Obfuscation)'],
    context: 'WMI process execution spawning base64-encoded PowerShell child process under SYSTEM context. Standard technique for remote code execution without dropping binaries.',
    recommendedAction: 'Kill process tree, collect triage package via KAPE / Velociraptor, revoke associated service account Kerberos ticket granting tickets (TGT).',
  },
];

export const ThreatIntelExplorer: React.FC = () => {
  const [tab, setTab] = useState<'mitre' | 'ioc'>('mitre');
  const [selectedTech, setSelectedTech] = useState<MitreTechnique>(TECHNIQUES[1]); // Default PowerShell
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKql, setCopiedKql] = useState(false);
  const [selectedIoc, setSelectedIoc] = useState<IocRecord>(IOC_DATABASE[0]);

  const handleCopyKql = (kql: string) => {
    navigator.clipboard.writeText(kql);
    setCopiedKql(true);
    setTimeout(() => setCopiedKql(false), 2000);
  };

  const filteredIocs = IOC_DATABASE.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      item.indicator.toLowerCase().includes(q) ||
      item.threatActor.toLowerCase().includes(q) ||
      item.campaign.toLowerCase().includes(q)
    );
  });

  return (
    <section className="w-full py-16 bg-[#050806] border-y border-[#1c2a23] text-[#f0efea] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#4ade80]/10 border border-[#4ade80]/30 font-mono text-xs text-[#4ade80] mb-3">
              <Crosshair size={13} />
              <span>DEFENSIVE THREAT HUNTING LAB</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#f0efea]">
              MITRE ATT&CK Matrix & Threat Intel
            </h2>
            <p className="mt-2 font-mono text-xs text-[#8a8a96] max-w-2xl leading-relaxed">
              Explore detection rules mapped to MITRE ATT&CK tactics, inspect production-ready KQL hunting queries, and analyze high-fidelity Indicators of Compromise (IOCs).
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 bg-[#0a0a0b] border border-[#1e1e22] p-1 rounded-sm shrink-0">
            <button
              onClick={() => setTab('mitre')}
              className={`px-4 py-2 font-mono text-xs font-semibold rounded-sm transition-all flex items-center gap-2 ${
                tab === 'mitre'
                  ? 'bg-[#4ade80] text-[#0a0a0b] shadow-[0_0_15px_rgba(74,222,128,0.3)]'
                  : 'text-[#8a8a96] hover:text-[#f0efea]'
              }`}
            >
              <Terminal size={13} /> MITRE ATT&CK & KQL
            </button>
            <button
              onClick={() => setTab('ioc')}
              className={`px-4 py-2 font-mono text-xs font-semibold rounded-sm transition-all flex items-center gap-2 ${
                tab === 'ioc'
                  ? 'bg-[#c8a96b] text-[#0a0a0b] shadow-[0_0_15px_rgba(200,169,107,0.3)]'
                  : 'text-[#8a8a96] hover:text-[#f0efea]'
              }`}
            >
              <Database size={13} /> IOC THREAT INTEL
            </button>
          </div>
        </div>

        {/* Tab 1: MITRE ATT&CK Navigator */}
        {tab === 'mitre' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Technique List */}
            <div className="lg:col-span-5 space-y-2">
              <div className="font-mono text-[10px] text-[#4a4a54] tracking-widest uppercase mb-2">
                ACTIVE PRODUCTION DETECTION TECHNIQUES ({TECHNIQUES.length})
              </div>
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {TECHNIQUES.map((tech) => {
                  const isSelected = selectedTech.id === tech.id;
                  return (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTech(tech)}
                      className={`w-full text-left p-3.5 border rounded-sm transition-all ${
                        isSelected
                          ? 'border-[#4ade80] bg-[#4ade80]/10 shadow-[0_0_20px_rgba(74,222,128,0.12)]'
                          : 'border-[#1e1e22] bg-[#0a0a0b] hover:border-[#4ade80]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#c8a96b]">
                          {tech.id} · {tech.tactic}
                        </span>
                        <span
                          className={`font-mono text-[9px] px-2 py-0.5 border font-semibold ${
                            tech.severity === 'CRITICAL'
                              ? 'text-red-400 border-red-500/40 bg-red-500/10'
                              : 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                          }`}
                        >
                          {tech.severity}
                        </span>
                      </div>
                      <div className="font-semibold text-xs text-[#f0efea] line-clamp-1">
                        {tech.name}
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-[#8a8a96] truncate">
                        {tech.caseRef}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Technique Details & KQL Engine */}
            <div className="lg:col-span-7 border border-[#1e1e22] bg-[#0a0a0b] p-6 rounded-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#1e1e22]">
                <div>
                  <div className="font-mono text-[11px] text-[#4ade80] tracking-widest font-bold">
                    {selectedTech.tacticId} // {selectedTech.tactic.toUpperCase()}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f0efea] mt-1">
                    {selectedTech.id} - {selectedTech.name}
                  </h3>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 border border-[#c8a96b]/40 text-[#c8a96b] bg-[#c8a96b]/5">
                  MAPPED IN {selectedTech.caseRef?.split(' ')[0]}
                </span>
              </div>

              <div>
                <div className="font-mono text-[10px] text-[#4a4a54] tracking-widest uppercase mb-1">
                  TECHNIQUE ANALYSIS & ATTACK VECTOR
                </div>
                <p className="text-xs text-[#8a8a96] leading-relaxed">
                  {selectedTech.description}
                </p>
              </div>

              <div>
                <div className="font-mono text-[10px] text-[#4a4a54] tracking-widest uppercase mb-1">
                  TELEMETRY LOG SOURCES
                </div>
                <p className="font-mono text-xs text-[#38bdf8]">
                  {selectedTech.detectionSource}
                </p>
              </div>

              {/* KQL Query Code Block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#4ade80] font-bold">
                    <FileCode size={13} />
                    <span>PRODUCTION KQL DETECTION QUERY</span>
                  </div>
                  <button
                    onClick={() => handleCopyKql(selectedTech.kql)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4ade80]/10 border border-[#4ade80]/40 text-[#4ade80] font-mono text-[10px] font-bold hover:bg-[#4ade80] hover:text-[#0a0a0b] transition-all cursor-pointer"
                  >
                    {copiedKql ? <Check size={11} /> : <Copy size={11} />}
                    {copiedKql ? 'COPIED TO CLIPBOARD' : 'COPY KQL'}
                  </button>
                </div>
                <pre className="p-4 bg-[#050806] border border-[#1e1e22] text-[#4ade80] font-mono text-[11px] overflow-x-auto leading-relaxed rounded-xs shadow-inner">
                  <code>{selectedTech.kql}</code>
                </pre>
              </div>

              {/* DFIR Mitigation */}
              <div className="p-4 border border-[#c8a96b]/30 bg-[#c8a96b]/5 rounded-sm">
                <div className="font-mono text-[10px] text-[#c8a96b] font-bold tracking-widest mb-1 flex items-center gap-2">
                  <Shield size={12} /> RECOMMENDED DFIR CONTAINMENT & MITIGATION
                </div>
                <p className="font-mono text-xs text-[#f0efea] leading-relaxed">
                  {selectedTech.mitigation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Threat Intel & IOC Sandbox */}
        {tab === 'ioc' && (
          <div className="space-y-6">
            {/* Search and Quick Preset Chips */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4a54]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search IOC by IP, domain, hash, or threat actor..."
                  className="w-full bg-[#0a0a0b] border border-[#1e1e22] pl-10 pr-4 py-2.5 font-mono text-xs text-[#f0efea] placeholder:text-[#4a4a54] outline-none focus:border-[#c8a96b]/50 transition-colors"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 self-center">
                <span className="font-mono text-[10px] text-[#4a4a54]">PRESETS:</span>
                {IOC_DATABASE.slice(0, 3).map((item) => (
                  <button
                    key={item.indicator}
                    onClick={() => {
                      setSelectedIoc(item);
                      setSearchQuery('');
                    }}
                    className="px-2 py-1 bg-[#0a0a0b] border border-[#1e1e22] text-[#8a8a96] hover:text-[#c8a96b] hover:border-[#c8a96b]/40 font-mono text-[10px] transition-colors"
                  >
                    {item.indicator.slice(0, 16)}…
                  </button>
                ))}
              </div>
            </div>

            {/* IOC Split Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* IOC Table / Cards */}
              <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredIocs.map((item) => {
                  const isSelected = selectedIoc.indicator === item.indicator;
                  return (
                    <button
                      key={item.indicator}
                      onClick={() => setSelectedIoc(item)}
                      className={`w-full text-left p-3.5 border rounded-sm transition-all ${
                        isSelected
                          ? 'border-[#c8a96b] bg-[#c8a96b]/10 shadow-[0_0_20px_rgba(200,169,107,0.15)]'
                          : 'border-[#1e1e22] bg-[#0a0a0b] hover:border-[#c8a96b]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#141416] border border-[#2a2a30] text-[#c8a96b] font-bold">
                          {item.type}
                        </span>
                        <span className="font-mono text-[9px] text-red-400 font-bold">
                          {item.confidence}% CONFIDENCE
                        </span>
                      </div>
                      <div className="font-mono text-xs text-[#f0efea] font-bold break-all line-clamp-1">
                        {item.indicator}
                      </div>
                      <div className="font-mono text-[10px] text-[#8a8a96] mt-1 truncate">
                        {item.threatActor}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* IOC Dossier Card */}
              <div className="lg:col-span-7 border border-[#1e1e22] bg-[#0a0a0b] p-6 rounded-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1e1e22]">
                  <div>
                    <span className="font-mono text-[10px] text-red-400 font-bold tracking-widest">
                      [THREAT DOSSIER] · {selectedIoc.verdict}
                    </span>
                    <h3 className="font-mono text-sm sm:text-base font-bold text-[#f0efea] mt-1 break-all">
                      {selectedIoc.indicator}
                    </h3>
                  </div>
                  <div className="font-mono text-xs text-right">
                    <span className="block text-[9px] text-[#4a4a54]">REPUTATION SCORE</span>
                    <span className="text-red-400 font-bold text-sm">
                      HIGH RISK ({selectedIoc.confidence}/100)
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-[#1e1e22] bg-[#050806] p-3">
                    <span className="block font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">
                      ATTRIBUTED THREAT ACTOR
                    </span>
                    <span className="font-mono text-xs text-[#c8a96b] font-bold">
                      {selectedIoc.threatActor}
                    </span>
                  </div>
                  <div className="border border-[#1e1e22] bg-[#050806] p-3">
                    <span className="block font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">
                      CAMPAIGN VECTOR
                    </span>
                    <span className="font-mono text-xs text-[#f0efea]">
                      {selectedIoc.campaign}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">
                    MITRE ATT&CK TECHNIQUES OBSERVED
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedIoc.mitre.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-1 bg-[#141416] border border-[#2a2a30] font-mono text-[10px] text-[#4ade80]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">
                    INVESTIGATION & TELEMETRY CONTEXT
                  </span>
                  <p className="font-mono text-xs text-[#8a8a96] leading-relaxed">
                    {selectedIoc.context}
                  </p>
                </div>

                <div className="p-4 border border-[#4ade80]/30 bg-[#4ade80]/5 rounded-sm">
                  <span className="block font-mono text-[10px] text-[#4ade80] font-bold tracking-widest mb-1">
                    SOAR AUTOMATION & INCIDENT TRIAGE PLAYBOOK
                  </span>
                  <p className="font-mono text-xs text-[#f0efea] leading-relaxed">
                    {selectedIoc.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
