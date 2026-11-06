import React, { useState } from 'react';
import { MapPin, Building2, ChevronDown, ChevronUp } from 'lucide-react';

const experiences = [
  {
    period: '2025 — Present',
    status: 'CURRENT',
    role: 'Deputy Manager 2',
    company: 'ICICI Bank',
    dept: 'Information Security Group · DFIR & Risk',
    location: 'Mumbai / Surat, India',
    summary: 'Leading digital forensics investigations and incident response across enterprise banking infrastructure.',
    highlights: [
      'Drive digital forensics examinations and evidence acquisition across enterprise banking servers and endpoints.',
      'Conduct root-cause analysis (RCA) on high-severity security incidents, establishing timeline and attack vectors.',
      'Evaluate emerging threat actors and perform threat modeling against banking application architectures and APIs.',
      'Coordinate with cross-functional infrastructure and compliance teams for ISMS regulatory alignment.',
    ],
    tech: ['DFIR', 'Incident Response', 'Risk Assessment', 'SIEM/EDR', 'Chain of Custody', 'Enterprise Security'],
  },
  {
    period: 'Jan 2025 — 2025',
    status: 'PREVIOUS',
    role: 'SOC Analyst',
    company: 'TechOwl Infosec',
    dept: 'Security Operations Center',
    location: 'Surat, Gujarat, India',
    summary: 'Led end-to-end SIEM onboarding for enterprise clients and triaged 100+ daily security alerts.',
    highlights: [
      'Executed SIEM onboarding from client requirement analysis through log source ingestion (Sysmon, NxLog, EVTX, syslog).',
      'Triaged and investigated 100+ daily alerts across CrowdStrike Falcon EDR, FortiSIEM, and SentinelOne.',
      'Conducted malware process-tree investigations, command-line deobfuscation, and hash enrichment mapped to MITRE ATT&CK.',
      'Authored custom detection rules, reduced false-positive rates by 35% through threshold tuning and allowlist engineering.',
      'Investigated phishing campaigns via email header deconstruction, DMARC/DKIM/SPF analysis, and malicious URL pivoting.',
    ],
    tech: ['CrowdStrike Falcon', 'FortiSIEM', 'Sysmon', 'SentinelOne', 'Windows Event IDs', 'MITRE ATT&CK', 'YARA'],
  },
  {
    period: 'May 2024 — Sep 2024',
    status: 'PREVIOUS',
    role: 'Network Engineer',
    company: 'Macrotech Global',
    dept: 'Enterprise Network Operations',
    location: 'Surat, Gujarat, India',
    summary: 'Architected and secured enterprise network infrastructure for 200+ endpoints across segmented VLAN topologies.',
    highlights: [
      'Configured Cisco ISR routers, L2/L3 switches, dynamic routing protocols (OSPF/EIGRP), and DHCP/DNS services.',
      'Implemented security hardening through ACLs, 802.1X port security, and 802.1Q VLAN isolation.',
      'Conducted packet-level traffic captures and protocol dissection using Wireshark and Nmap to isolate network anomalies.',
    ],
    tech: ['Cisco ISR', 'L2/L3 Switching', 'OSPF / EIGRP', 'Wireshark', 'Nmap', 'ACL Hardening', 'VLAN Segmentation'],
  },
];

export const Experience: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section id="experience" className="py-24 border-b border-[#1e1e22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">02 / CAREER SNAPSHOT</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0efea] uppercase leading-tight">
              Professional<br />Timeline
            </h2>
          </div>
          <div className="font-mono text-xs text-[#4a4a54] pb-1">
            {experiences.length} POSITIONS
          </div>
        </div>

        <div className="space-y-3">
          {experiences.map((exp, idx) => {
            const isOpen = expanded === idx;
            return (
              <div
                key={idx}
                className={`border transition-all duration-300 ${
                  isOpen
                    ? 'border-[#c8a96b]/30 bg-[#0f0f10]'
                    : 'border-[#1e1e22] bg-[#0f0f10] hover:border-[#2a2a30]'
                }`}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                      {/* Status */}
                      <span className={`font-mono text-[9px] tracking-widest px-2 py-1 w-fit ${
                        exp.status === 'CURRENT'
                          ? 'border border-[#4ade80]/40 text-[#4ade80] bg-[#4ade80]/5'
                          : 'border border-[#2a2a30] text-[#4a4a54]'
                      }`}>
                        {exp.status === 'CURRENT' ? '● CURRENT' : '○ PREVIOUS'}
                      </span>

                      <div>
                        <div className="font-display text-lg sm:text-xl font-bold text-[#f0efea]">{exp.role}</div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#c8a96b]">
                            <Building2 size={12} />
                            {exp.company}
                          </span>
                          <span className="font-mono text-xs text-[#4a4a54]">{exp.dept}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:shrink-0">
                      <div className="text-right">
                        <div className="font-mono text-xs text-[#8a8a96]">{exp.period}</div>
                        <div className="flex items-center gap-1 mt-0.5 justify-end">
                          <MapPin size={10} className="text-[#4a4a54]" />
                          <span className="font-mono text-[10px] text-[#4a4a54]">{exp.location}</span>
                        </div>
                      </div>
                      {isOpen
                        ? <ChevronUp size={16} className="text-[#c8a96b] shrink-0" />
                        : <ChevronDown size={16} className="text-[#4a4a54] shrink-0" />
                      }
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-[#1e1e22] pt-5 space-y-5">
                    <p className="text-[#8a8a96] text-sm leading-relaxed">{exp.summary}</p>

                    <div>
                      <div className="font-mono text-[10px] text-[#4a4a54] tracking-widest mb-3">KEY RESPONSIBILITIES</div>
                      <ul className="space-y-2">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#8a8a96]">
                            <span className="text-[#c8a96b] mt-0.5 shrink-0">→</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map(t => (
                        <span key={t} className="font-mono text-[10px] text-[#8a8a96] border border-[#1e1e22] px-2 py-1 hover:border-[#c8a96b]/30 transition-colors">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
