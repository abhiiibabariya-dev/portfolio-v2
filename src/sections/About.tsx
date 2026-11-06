import React from 'react';
import { Shield, Search, Zap, Database } from 'lucide-react';

const pillars = [
  {
    icon: <Search size={18} className="text-[#c8a96b]" />,
    title: 'Investigate',
    desc: 'Multi-source forensic correlation across endpoints, cloud logs, and network telemetry to establish ground truth.',
  },
  {
    icon: <Shield size={18} className="text-[#c8a96b]" />,
    title: 'Detect',
    desc: 'Behavioral detection engineering using Sigma rules, KQL, and MITRE ATT&CK-mapped logic to surface real threats.',
  },
  {
    icon: <Zap size={18} className="text-[#c8a96b]" />,
    title: 'Respond',
    desc: 'Structured incident response with documented chain-of-custody, containment playbooks, and SOAR automation.',
  },
  {
    icon: <Database size={18} className="text-[#c8a96b]" />,
    title: 'Engineer',
    desc: 'Build and tune SIEM pipelines, detection rules, and automation workflows that scale across enterprise environments.',
  },
];

export const About: React.FC = () => (
  <section id="about" className="py-24 border-b border-[#1e1e22]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* Left label + headline */}
        <div className="lg:col-span-4">
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-4">01 / IDENTITY</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0efea] uppercase leading-tight mb-6">
            Investigate.<br />
            Detect.<br />
            Respond.
          </h2>
          <div className="h-px bg-[#1e1e22] mb-6" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="font-mono text-xs text-[#4ade80] tracking-wider">AVAILABLE FOR OPPORTUNITIES</span>
          </div>
        </div>

        {/* Right — bio + pillars */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Bio text */}
          <div className="space-y-4 text-[#8a8a96] leading-relaxed">
            <p>
              I'm a cybersecurity professional focused on{' '}
              <span className="text-[#f0efea]">digital forensics, incident response, and security operations</span>.
              Currently serving as <span className="text-[#c8a96b] font-semibold">Deputy Manager 2</span> in the
              Information Security Group at{' '}
              <span className="text-[#c8a96b] font-semibold">ICICI Bank</span>, where I lead DFIR investigations
              and security risk analysis across enterprise banking infrastructure.
            </p>
            <p>
              I hold an <span className="text-[#f0efea]">M.Sc. in Digital Forensics and Information Security</span>{' '}
              from <span className="text-[#f0efea]">National Forensic Sciences University (NFSU)</span> with a
              CGPA of 9.00. Prior to ICICI Bank, I worked as a SOC Analyst at{' '}
              <span className="text-[#f0efea]">TechOwl Infosec</span>, leading SIEM deployments and triaging
              100+ daily alerts across CrowdStrike Falcon, FortiSIEM, and SentinelOne.
            </p>
            <p>
              My focus is on evidence-driven security — combining deep forensic methodology with modern detection
              engineering and automation to reduce investigation timelines without sacrificing accuracy.
            </p>
          </div>

          {/* Four pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map(p => (
              <div
                key={p.title}
                className="border border-[#1e1e22] bg-[#0f0f10] p-5 hover:border-[#c8a96b]/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  {p.icon}
                  <span className="font-display text-sm font-bold text-[#f0efea] uppercase tracking-wide">{p.title}</span>
                </div>
                <p className="text-[#4a4a54] text-sm leading-relaxed group-hover:text-[#8a8a96] transition-colors">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick facts strip */}
          <div className="border border-[#1e1e22] bg-[#0f0f10] p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { k: 'SPECIALIZATION', v: 'DFIR / SOC' },
                { k: 'CURRENT ORG', v: 'ICICI BANK' },
                { k: 'EDUCATION', v: 'M.Sc. NFSU' },
                { k: 'LOCATION', v: 'INDIA' },
              ].map(f => (
                <div key={f.k}>
                  <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">{f.k}</div>
                  <div className="font-mono text-xs text-[#c8a96b] font-bold">{f.v}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
);
