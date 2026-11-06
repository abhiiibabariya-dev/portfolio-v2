import React from 'react';

const education = [
  {
    degree: 'Master of Science (M.Sc.)',
    field: 'Digital Forensics & Information Security',
    institution: 'National Forensic Sciences University (NFSU)',
    location: 'Gandhinagar, Gujarat, India',
    period: '2022 — 2024',
    grade: 'CGPA: 9.00 / 10.00',
    distinction: 'DISTINCTION',
    courses: [
      'Digital Evidence Acquisition & Chain of Custody',
      'Memory Forensics & Volatility Analysis',
      'Malware Reverse Engineering & Static Analysis',
      'Network Forensics & Packet Dissection',
      'Cloud Security & Virtualization Forensics',
      'Mobile Device Forensic Extractions',
    ],
    highlight: true,
  },
  {
    degree: 'Bachelor of Science (B.Sc.)',
    field: 'Information Technology',
    institution: 'J.P. Dawar Institute (VNSGU)',
    location: 'Surat, Gujarat, India',
    period: '2018 — 2022',
    grade: 'CGPA: 6.60 / 10.00',
    distinction: null,
    courses: [
      'Computer Networks & Protocols',
      'Database Management Systems (RDBMS)',
      'Operating Systems & Linux Architecture',
      'Object-Oriented Programming (Python, C++)',
      'Web Technologies & Information Security Basics',
    ],
    highlight: false,
  },
];

export const Education: React.FC = () => (
  <section id="education" className="py-24 border-b border-[#1e1e22]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">06 / EDUCATION</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0efea] uppercase leading-tight">
            Academic<br />Background
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {education.map((edu, i) => (
          <div
            key={i}
            className={`border p-6 sm:p-8 transition-colors ${
              edu.highlight
                ? 'border-[#c8a96b]/30 bg-[#0f0f10]'
                : 'border-[#1e1e22] bg-[#0f0f10]'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5 pb-5 border-b border-[#1e1e22]">
              <div>
                <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">{edu.period}</div>
                <h3 className="font-display text-xl font-bold text-[#f0efea] leading-tight">{edu.degree}</h3>
                <div className="font-mono text-sm text-[#c8a96b] mt-1">{edu.field}</div>
              </div>
              {edu.distinction && (
                <span className="font-mono text-[9px] text-[#4ade80] border border-[#4ade80]/30 px-2 py-1 bg-[#4ade80]/5 shrink-0 whitespace-nowrap">
                  {edu.distinction}
                </span>
              )}
            </div>

            {/* Institution */}
            <div className="mb-5">
              <div className="text-sm font-semibold text-[#f0efea]">{edu.institution}</div>
              <div className="font-mono text-xs text-[#4a4a54] mt-0.5">{edu.location}</div>
            </div>

            {/* Grade */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#1e1e22]">
              <span className="font-mono text-[10px] text-[#4a4a54] tracking-widest">GRADE</span>
              <span className={`font-mono text-sm font-bold ${edu.highlight ? 'text-[#c8a96b]' : 'text-[#8a8a96]'}`}>
                {edu.grade}
              </span>
            </div>

            {/* Courses */}
            <div>
              <div className="font-mono text-[10px] text-[#4a4a54] tracking-widest mb-3">CORE COURSEWORK</div>
              <div className="space-y-1.5">
                {edu.courses.map((course, j) => (
                  <div key={j} className="flex items-start gap-2.5 text-xs text-[#8a8a96]">
                    <span className="text-[#c8a96b]/50 mt-0.5 shrink-0">·</span>
                    <span>{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);
