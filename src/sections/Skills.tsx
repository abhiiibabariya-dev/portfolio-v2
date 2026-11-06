import React, { useState } from 'react';

const categories = [
  {
    code: 'SEC-OPS',
    title: 'SIEM & EDR Operations',
    skills: [
      { name: 'CrowdStrike Falcon', level: 92, tag: 'EDR' },
      { name: 'Wazuh SIEM', level: 95, tag: 'SIEM' },
      { name: 'FortiSIEM & Collector', level: 88, tag: 'SIEM' },
      { name: 'SentinelOne DeepVisibility', level: 86, tag: 'EDR' },
      { name: 'Microsoft Defender (MDE)', level: 90, tag: 'XDR' },
      { name: 'Sysmon & NxLog', level: 94, tag: 'Telemetry' },
    ],
  },
  {
    code: 'CLOUD-SEC',
    title: 'Cloud Security & Querying',
    skills: [
      { name: 'Azure Log Analytics (KQL)', level: 93, tag: 'Hunting' },
      { name: 'Azure Defender for Cloud', level: 88, tag: 'CSPM' },
      { name: 'Microsoft Sentinel', level: 85, tag: 'Cloud SIEM' },
      { name: 'NSG Flow Logs & VPC', level: 86, tag: 'Network' },
    ],
  },
  {
    code: 'FORENSICS',
    title: 'DFIR & Forensics',
    skills: [
      { name: 'FTK Imager', level: 96, tag: 'Acquisition' },
      { name: 'Autopsy Forensics', level: 94, tag: 'Analysis' },
      { name: 'Volatility Framework', level: 88, tag: 'Memory' },
      { name: 'Sysinternals Suite', level: 92, tag: 'Live Triage' },
      { name: 'ADB & Mobile Extraction', level: 89, tag: 'Mobile' },
      { name: 'IDA Pro & x64dbg', level: 78, tag: 'Reversing' },
    ],
  },
  {
    code: 'THREAT-INTEL',
    title: 'Threat Intel & Malware',
    skills: [
      { name: 'MITRE ATT&CK Mapping', level: 96, tag: 'Framework' },
      { name: 'VirusTotal & AbuseIPDB APIs', level: 95, tag: 'Enrichment' },
      { name: 'ANY.RUN & Hybrid Analysis', level: 90, tag: 'Sandbox' },
      { name: 'YARA Rule Authoring', level: 86, tag: 'Signatures' },
    ],
  },
  {
    code: 'NET-SEC',
    title: 'Network Security',
    skills: [
      { name: 'Wireshark Packet Dissection', level: 94, tag: 'PCAP' },
      { name: 'TCPDump & Nmap', level: 90, tag: 'Scanning' },
      { name: 'Cisco ISR & L2/L3 ACLs', level: 88, tag: 'Hardware' },
      { name: 'Snort & Suricata NIDS', level: 85, tag: 'NIDS' },
    ],
  },
  {
    code: 'AUTOMATION',
    title: 'Automation & Scripting',
    skills: [
      { name: 'Python Security Scripting', level: 92, tag: 'Dev' },
      { name: 'Shuffle SOAR Playbooks', level: 90, tag: 'SOAR' },
      { name: 'PowerShell & CLI Triage', level: 89, tag: 'Scripting' },
      { name: 'Bash & Linux Hardening', level: 88, tag: 'OS' },
    ],
  },
];

export const Skills: React.FC = () => {
  const [active, setActive] = useState('SEC-OPS');
  const current = categories.find(c => c.code === active) || categories[0];

  return (
    <section id="skills" className="py-24 border-b border-[#1e1e22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">04 / CAPABILITIES</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0efea] uppercase leading-tight">
              Technical<br />Arsenal
            </h2>
          </div>
          <div className="font-mono text-xs text-[#4a4a54]">
            {categories.reduce((a, c) => a + c.skills.length, 0)} CAPABILITIES
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Category tabs — left on desktop, top on mobile */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {categories.map(c => (
              <button
                key={c.code}
                onClick={() => setActive(c.code)}
                className={`text-left px-4 py-3 font-mono text-xs whitespace-nowrap lg:whitespace-normal cursor-pointer transition-all border ${
                  active === c.code
                    ? 'border-[#c8a96b]/40 bg-[#c8a96b]/5 text-[#c8a96b]'
                    : 'border-[#1e1e22] bg-[#0f0f10] text-[#4a4a54] hover:text-[#8a8a96] hover:border-[#2a2a30]'
                }`}
              >
                <div className="tracking-widest text-[9px] mb-0.5 opacity-60">{c.code}</div>
                <div className="font-semibold">{c.title}</div>
              </button>
            ))}
          </div>

          {/* Skills panel */}
          <div className="lg:col-span-9">
            <div className="border border-[#1e1e22] bg-[#0f0f10]">
              <div className="px-5 py-4 border-b border-[#1e1e22] flex items-center justify-between">
                <span className="font-mono text-xs text-[#f0efea] font-semibold">{current.title}</span>
                <span className="font-mono text-[10px] text-[#4a4a54]">{current.skills.length} tools</span>
              </div>
              <div className="p-5 space-y-5">
                {current.skills.map(skill => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm text-[#f0efea] font-medium">{skill.name}</span>
                        <span className="font-mono text-[9px] text-[#4a4a54] border border-[#1e1e22] px-1.5 py-0.5">{skill.tag}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#c8a96b]">{skill.level}%</span>
                    </div>
                    <div className="h-px bg-[#1e1e22] w-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#c8a96b] to-[#8a7040] transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
