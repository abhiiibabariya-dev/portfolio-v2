import React from 'react';

const items = [
  'DFIR', '·', 'INCIDENT RESPONSE', '·', 'SOC OPERATIONS', '·',
  'THREAT DETECTION', '·', 'DIGITAL FORENSICS', '·', 'THREAT HUNTING', '·',
  'SECURITY ENGINEERING', '·', 'SIEM', '·', 'EDR / XDR', '·',
  'MITRE ATT&CK', '·', 'CLOUD FORENSICS', '·', 'KQL HUNTING', '·',
];

export const FocusStrip: React.FC = () => (
  <section className="border-y border-[#1e1e22] bg-[#0f0f10] py-3 overflow-hidden relative z-10">
    <div className="flex whitespace-nowrap" style={{ animation: 'ticker 28s linear infinite' }}>
      {[...items, ...items].map((item, i) => (
        <span
          key={i}
          className={`font-mono text-[10px] tracking-widest px-3 ${
            item === '·' ? 'text-[#c8a96b]' : 'text-[#4a4a54] hover:text-[#8a8a96] transition-colors'
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  </section>
);
