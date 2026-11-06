import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EDUCATION } from '../data/portfolioData';

export const EducationPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] transition-colors mb-12 tracking-widest">
          <ArrowLeft size={11} /> HOME / EDUCATION
        </Link>

        <div className="mb-16">
          <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">07 / EDUCATION</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#f0efea] uppercase leading-tight">
            Academic<br />Record
          </h1>
          <div className="h-px w-24 bg-[#c8a96b]/40 mt-6" />
        </div>

        <div className="space-y-8">
          {EDUCATION.map((edu, i) => (
            <div key={i} className={`border bg-[#0f0f10] p-6 sm:p-10 ${i === 0 ? 'border-[#c8a96b]/25' : 'border-[#1e1e22]'}`}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-[#1e1e22]">
                <div>
                  {i === 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] text-[#c8a96b] tracking-widest">● DISTINCTION</span>
                    </div>
                  )}
                  <h2 className="text-lg sm:text-xl font-bold text-[#f0efea] mb-2 leading-snug max-w-2xl">{edu.degree}</h2>
                  <div className="font-mono text-sm text-[#c8a96b] mb-1">{edu.institution}</div>
                  <div className="font-mono text-[10px] text-[#4a4a54]">{edu.location}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-[10px] text-[#4a4a54] mb-1">{edu.period}</div>
                  <div className="font-mono text-sm font-bold text-[#f0efea]">{edu.grade}</div>
                </div>
              </div>

              {/* Coursework */}
              <div>
                <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-4">KEY COURSEWORK</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {edu.courses.map((course, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <span className="font-mono text-[#c8a96b] text-xs shrink-0">›</span>
                      <span className="font-mono text-[11px] text-[#8a8a96]">{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
