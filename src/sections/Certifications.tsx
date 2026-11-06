import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const certs = [
  {
    id: 'C1',
    name: 'Certified Cyber Security Analyst (C3SA)',
    issuer: 'CyberWarFare Labs',
    date: '2024',
    credId: 'CWL-C3SA-1092',
    category: 'SOC & Threat Hunting',
    skills: ['SOC Operations', 'Threat Hunting', 'Log Analysis', 'MITRE ATT&CK', 'Incident Triage'],
    color: '#c8a96b',
  },
  {
    id: 'C2',
    name: 'Cyber Threat Hunting',
    issuer: 'Infosys Springboard',
    date: '2024',
    credId: 'ISB-CTH-2024',
    category: 'Threat Hunting',
    skills: ['Threat Hunting', 'IOC Analysis', 'Behavioral Detection', 'SIEM Querying'],
    color: '#4ade80',
  },
  {
    id: 'C3',
    name: 'Digital Forensics Essentials (DFE)',
    issuer: 'EC-Council CodeRed',
    date: '2024',
    credId: 'ECC-DFE-81043',
    category: 'DFIR & Forensics',
    skills: ['Evidence Acquisition', 'Chain of Custody', 'Disk Imaging', 'Artifact Extraction', 'Forensic Reporting'],
    color: '#f472b6',
  },
  {
    id: 'C4',
    name: 'Ethical Hacking Essentials (EHE)',
    issuer: 'EC-Council CodeRed',
    date: '2024',
    credId: 'ECC-EHE-81042',
    category: 'Security Essentials',
    skills: ['Vulnerability Assessment', 'Penetration Testing Basics', 'Port Scanning', 'Exploit Analysis'],
    color: '#f59e0b',
  },
  {
    id: 'C5',
    name: 'ISO/IEC 27001 Information Security Associate',
    issuer: 'SkillFront',
    date: '2024',
    credId: 'SF-ISO27001-44912',
    category: 'Standards & Governance',
    skills: ['ISMS Implementation', 'Risk Assessment', 'Security Controls', 'Compliance Auditing'],
    color: '#38bdf8',
  },
  {
    id: 'C6',
    name: 'Examination of ISO/IEC 20000 IT Service Management Associate',
    issuer: 'SkillFront',
    date: '2024',
    credId: 'SF-ISO20000-2024',
    category: 'Standards & Governance',
    skills: ['IT Service Management', 'ITSM Standards', 'Process Management', 'Service Delivery'],
    color: '#38bdf8',
  },
  {
    id: 'C7',
    name: 'Cybersecurity Essentials',
    issuer: 'Cisco Networking Academy',
    date: '2024',
    credId: 'CSCO-ESS-98214',
    category: 'Security Essentials',
    skills: ['Network Security', 'Threat Vectors', 'Security Controls', 'Cryptography Basics', 'Defense-in-Depth'],
    color: '#4ade80',
  },
  {
    id: 'C8',
    name: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    date: '2023',
    credId: 'CSCO-INTRO-77123',
    category: 'Security Essentials',
    skills: ['Cyber Threats', 'Confidentiality & Integrity', 'Privacy Protection', 'Organizational Defense'],
    color: '#4ade80',
  },
  {
    id: 'C9',
    name: 'SOC Member',
    issuer: 'LetsDefend',
    date: '2024',
    credId: 'LD-SOC-2024',
    category: 'SOC & Threat Hunting',
    skills: ['Alert Triage', 'Incident Investigation', 'Log Analysis', 'SOC Workflows'],
    color: '#c8a96b',
  },
  {
    id: 'C10',
    name: 'Phishing Expert',
    issuer: 'LetsDefend',
    date: '2024',
    credId: 'LD-PHISH-2024',
    category: 'SOC & Threat Hunting',
    skills: ['Phishing Analysis', 'Email Header Analysis', 'DMARC/DKIM/SPF', 'URL Investigation'],
    color: '#c8a96b',
  },
  {
    id: 'C11',
    name: 'ISO 9001 Quality Management Systems Associate',
    issuer: 'SkillFront',
    date: '2024',
    credId: 'SF-ISO9001-2024',
    category: 'Standards & Governance',
    skills: ['Quality Management', 'ISO 9001 Standard', 'Audit Principles', 'Process Improvement'],
    color: '#38bdf8',
  },
  {
    id: 'C12',
    name: 'AWS Academy Graduate – Introduction to Cloud Semester 1',
    issuer: 'Amazon Web Services',
    date: '2024',
    credId: 'AWS-CLOUD-S1-2024',
    category: 'Cloud & Infrastructure',
    skills: ['Cloud Fundamentals', 'AWS Services', 'Cloud Security Basics', 'IaaS/PaaS/SaaS'],
    color: '#f59e0b',
  },
  {
    id: 'C13',
    name: 'AWS AI Conclave Online Badges',
    issuer: 'Amazon Web Services',
    date: '2024',
    credId: 'AWS-AI-2024',
    category: 'Cloud & Infrastructure',
    skills: ['AWS AI Services', 'Machine Learning Concepts', 'Cloud AI Applications'],
    color: '#f59e0b',
  },
  {
    id: 'C14',
    name: 'Digital Forensics',
    issuer: 'CodeRed',
    date: '2024',
    credId: 'CR-DF-2024',
    category: 'DFIR & Forensics',
    skills: ['Forensic Methodology', 'Evidence Handling', 'Artifact Analysis', 'Reporting'],
    color: '#f472b6',
  },
  {
    id: 'C15',
    name: 'PHP-Laravel Development',
    issuer: 'Riro Venture Pvt Ltd',
    date: '2022',
    credId: 'RIRO-PHP-2022',
    category: 'Development',
    skills: ['PHP', 'Laravel Framework', 'MVC Architecture', 'Web Development'],
    color: '#8a8a96',
  },
];

const allCategories = ['ALL', ...Array.from(new Set(certs.map(c => c.category)))];

export const Certifications: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = certs.filter(c => {
    const matchCat = filter === 'ALL' || c.category === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <section id="certifications" className="py-24 border-b border-[#1e1e22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">05 / CERTIFICATIONS</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0efea] uppercase leading-tight">
              Credential<br />Vault
            </h2>
          </div>
          <div className="font-mono text-xs text-[#4a4a54]">{certs.length} VERIFIED</div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a54]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search credentials..."
              className="w-full bg-[#0f0f10] border border-[#1e1e22] pl-9 pr-3 py-2 font-mono text-xs text-[#f0efea] placeholder:text-[#4a4a54] focus:border-[#c8a96b]/40 outline-none transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a54] hover:text-[#f0efea] cursor-pointer">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-mono text-[10px] px-3 py-1.5 border cursor-pointer transition-all tracking-wider ${
                  filter === cat
                    ? 'border-[#c8a96b]/40 text-[#c8a96b] bg-[#c8a96b]/5'
                    : 'border-[#1e1e22] text-[#4a4a54] hover:text-[#8a8a96] hover:border-[#2a2a30]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(cert => (
            <div
              key={cert.id}
              className="border border-[#1e1e22] bg-[#0f0f10] p-5 hover:border-[#c8a96b]/25 transition-all group"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-[#1e1e22]">
                <div>
                  <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">{cert.category}</div>
                  <div
                    className="w-6 h-1 mb-0"
                    style={{ background: cert.color, opacity: 0.6 }}
                  />
                </div>
                <span className="font-mono text-[10px] text-[#4a4a54] shrink-0">{cert.date}</span>
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-[#f0efea] leading-snug mb-1 group-hover:text-[#c8a96b] transition-colors">
                {cert.name}
              </h3>
              <div className="font-mono text-[11px] text-[#8a8a96] mb-4">{cert.issuer}</div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cert.skills.slice(0, 3).map(s => (
                  <span key={s} className="font-mono text-[9px] text-[#4a4a54] border border-[#1e1e22] px-1.5 py-0.5">{s}</span>
                ))}
                {cert.skills.length > 3 && (
                  <span className="font-mono text-[9px] text-[#4a4a54]">+{cert.skills.length - 3}</span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1e1e22]">
                <span className="font-mono text-[9px] text-[#4a4a54]">ID: {cert.credId}</span>
                <span className="font-mono text-[9px]" style={{ color: cert.color }}>● VERIFIED</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 font-mono text-sm text-[#4a4a54]">
            No credentials match your search.
          </div>
        )}

      </div>
    </section>
  );
};
