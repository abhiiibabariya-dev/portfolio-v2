import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Shield } from 'lucide-react';
import { CASE_STUDIES } from '../data/portfolioData';

const sevColor: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#4ade80',
};

export const CaseStudyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const cs = CASE_STUDIES.find(c => c.id === id || c.slug === id);

  if (!cs) return <Navigate to="/projects" replace />;

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

        {/* Breadcrumb */}
        <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] transition-colors mb-12 tracking-widest">
          <ArrowLeft size={11} /> INVESTIGATIONS / {cs.caseNumber}
        </Link>

        {/* Case header */}
        <div className="border border-[#1e1e22] bg-[#0f0f10] p-6 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[9px] text-[#4a4a54] tracking-widest">{cs.caseNumber}</span>
              <span
                className="font-mono text-[9px] px-2.5 py-1 border font-bold"
                style={{ color: sevColor[cs.severity], borderColor: `${sevColor[cs.severity]}50` }}
              >
                {cs.severity}
              </span>
              <span className="font-mono text-[9px] text-[#8a8a96] border border-[#1e1e22] px-2 py-0.5">{cs.classification}</span>
              <span className="font-mono text-[9px] text-[#4ade80] border border-[#4ade80]/20 px-2 py-0.5">{cs.status}</span>
            </div>
            {cs.repoUrl && (
              <a
                href={cs.repoUrl}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] transition-colors shrink-0"
              >
                <ExternalLink size={11} /> GitHub
              </a>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#f0efea] mb-3 leading-tight">
            {cs.title}
          </h1>
          <p className="font-mono text-sm text-[#8a8a96] leading-relaxed mb-6 pb-6 border-b border-[#1e1e22]">
            {cs.tagline}
          </p>

          {/* Meta row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'ROLE', value: cs.role },
              { label: 'DURATION', value: cs.duration },
              { label: 'VERDICT', value: cs.verdict },
              { label: 'BADGE', value: cs.badge },
            ].map(m => (
              <div key={m.label}>
                <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">{m.label}</div>
                <div className="font-mono text-[10px] text-[#c8a96b] leading-snug">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {cs.outcomes.map(o => (
            <div key={o.k} className="border border-[#1e1e22] bg-[#0f0f10] p-4 text-center">
              <div className="font-mono text-xl font-bold text-[#c8a96b] mb-1">{o.k}</div>
              <div className="font-mono text-[9px] text-[#4a4a54] leading-snug">{o.v}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <div className="border border-[#1e1e22] bg-[#0f0f10] p-6 sm:p-8 mb-8">
          <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">CASE OVERVIEW</div>
          <p className="text-[#8a8a96] text-sm leading-relaxed">{cs.overview}</p>
        </div>

        {/* Problem Statement */}
        <div className="border border-[#1e1e22] bg-[#0f0f10] p-6 sm:p-8 mb-8">
          <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">PROBLEM STATEMENT</div>
          <ul className="space-y-3">
            {cs.problem.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-mono text-[#c8a96b] text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                <span className="text-[#8a8a96] text-sm leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-[#1e1e22] bg-[#0f0f10] p-6 sm:p-8 mb-8">
          <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">INVESTIGATION WORKFLOW</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px]">
            <div className="border border-[#1e1e22] p-3 text-[#8a8a96]"><span className="block text-[#c8a96b] mb-1">01 / COLLECT</span>Scope telemetry and preserve relevant evidence.</div>
            <div className="border border-[#1e1e22] p-3 text-[#8a8a96]"><span className="block text-[#c8a96b] mb-1">02 / CORRELATE</span>Map activity across logs, tools, and context.</div>
            <div className="border border-[#1e1e22] p-3 text-[#8a8a96]"><span className="block text-[#c8a96b] mb-1">03 / DOCUMENT</span>Record findings, rationale, and recommended actions.</div>
          </div>
        </div>

        {/* MITRE techniques */}
        <div className="border border-[#1e1e22] bg-[#0f0f10] p-6 mb-8">
          <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">MITRE ATT&amp;CK TECHNIQUES</div>
          <div className="flex flex-wrap gap-2">
            {cs.mitreTechniques.map(t => (
              <span key={t} className="flex items-center gap-1.5 font-mono text-[10px] text-[#8a8a96] border border-[#1e1e22] px-2.5 py-1.5">
                <Shield size={9} className="text-[#c8a96b]" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Investigation Phases */}
        <div className="mb-8">
          <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">INVESTIGATION PHASES</div>
          <div className="space-y-4">
            {cs.phases.map(phase => (
              <div key={phase.num} className="border border-[#1e1e22] bg-[#0f0f10] overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-4 border-b border-[#1e1e22] bg-[#0d0d0e]">
                  <span className="font-mono text-xs font-bold text-[#c8a96b]">PHASE {phase.num}</span>
                  <span className="font-mono text-xs text-[#f0efea]">{phase.title}</span>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 mb-4">
                    {phase.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="font-mono text-[#c8a96b] text-xs mt-0.5 shrink-0">›</span>
                        <span className="text-[#8a8a96] text-sm leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  {phase.kqlQuery && (
                    <div className="mt-4">
                      <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-2">KQL QUERY</div>
                      <pre className="bg-[#080808] border border-[#1e1e22] p-4 font-mono text-[10px] text-[#4ade80] overflow-x-auto leading-relaxed whitespace-pre-wrap">
                        {phase.kqlQuery}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IOCs */}
        {cs.iocs && cs.iocs.length > 0 && (
          <div className="border border-[#1e1e22] bg-[#0f0f10] mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1e1e22] bg-[#0d0d0e]">
              <span className="font-mono text-[9px] text-[#c8a96b] tracking-widest">INDICATORS OF COMPROMISE (IOCs)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e1e22]">
                    <th className="text-left px-6 py-3 font-mono text-[9px] text-[#4a4a54] tracking-widest">TYPE</th>
                    <th className="text-left px-6 py-3 font-mono text-[9px] text-[#4a4a54] tracking-widest">VALUE</th>
                    <th className="text-left px-6 py-3 font-mono text-[9px] text-[#4a4a54] tracking-widest">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {cs.iocs.map((ioc, i) => (
                    <tr key={i} className="border-b border-[#1e1e22] hover:bg-[#0d0d0e]">
                      <td className="px-6 py-3 font-mono text-[10px] text-[#8a8a96]">{ioc.type}</td>
                      <td className="px-6 py-3 font-mono text-[10px] text-[#c8a96b] break-all">{ioc.value}</td>
                      <td className="px-6 py-3 font-mono text-[10px] text-[#4ade80]">{ioc.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Learnings */}
        <div className="border border-[#1e1e22] bg-[#0f0f10] p-6 sm:p-8 mb-8">
          <div className="font-mono text-[9px] text-[#c8a96b] tracking-widest mb-4">KEY LEARNINGS</div>
          <ul className="space-y-3">
            {cs.learnings.map((l, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-mono text-[#c8a96b] text-xs mt-0.5 shrink-0">›</span>
                <span className="text-[#8a8a96] text-sm leading-relaxed">{l}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="border border-[#1e1e22] bg-[#0f0f10] p-5 mb-12">
          <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-3">TOOLS & TECHNOLOGIES</div>
          <div className="flex flex-wrap gap-2">
            {cs.tags.map(t => (
              <span key={t} className="font-mono text-[9px] text-[#8a8a96] border border-[#1e1e22] px-2 py-0.5">{t}</span>
            ))}
          </div>
        </div>

        {/* Back / next navigation */}
        <div className="flex justify-between items-center">
          <Link to="/projects" className="flex items-center gap-2 font-mono text-xs text-[#4a4a54] hover:text-[#c8a96b] transition-colors">
            <ArrowLeft size={13} /> ALL CASES
          </Link>
          {cs.repoUrl && (
            <a
              href={cs.repoUrl}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-[#c8a96b]/40 text-[#c8a96b] font-mono text-xs hover:bg-[#c8a96b]/10 transition-all"
            >
              <ExternalLink size={11} /> VIEW REPOSITORY
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
