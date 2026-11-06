import React, { useState, useEffect } from 'react';
import { ProjectCaseStudy } from '../../data/portfolioData';
import { X, Terminal, Copy, Check, ExternalLink, FileCode, CheckCircle2, Lock } from 'lucide-react';

interface CaseStudyModalProps {
  caseStudy: ProjectCaseStudy | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ caseStudy, onClose }) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'narrative' | 'kql' | 'iocs' | 'outcomes'>('narrative');
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);
  const [copiedIoc, setCopiedIoc] = useState<string | null>(null);

  useEffect(() => {
    if (!caseStudy) {
      setLoadingProgress(0);
      setIsDecrypted(false);
      return;
    }

    setLoadingProgress(0);
    setIsDecrypted(false);

    // Fast decrypt animation
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDecrypted(true);
          return 100;
        }
        return prev + 25;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [caseStudy]);

  if (!caseStudy) return null;

  const copyToClipboard = (text: string, isIocVal?: string) => {
    navigator.clipboard.writeText(text);
    if (isIocVal) {
      setCopiedIoc(isIocVal);
      setTimeout(() => setCopiedIoc(null), 2000);
    } else {
      setCopiedQuery(true);
      setTimeout(() => setCopiedQuery(false), 2000);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-4xl bg-[#080d0b] border border-[#00ff88]/40 rounded-2xl shadow-[0_0_80px_rgba(0,255,136,0.15)] overflow-hidden z-10 my-auto">

        {/* Top Terminal Bar */}
        <div className="bg-[#040806] border-b border-[#1c2a23] px-4 py-3 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
            <span className="text-zinc-400 ml-2 font-bold tracking-wider text-[11px]">
              CLASSIFIED CASE FILE // {caseStudy.caseNumber}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Decrypting Loading State */}
        {!isDecrypted ? (
          <div className="p-12 flex flex-col items-center justify-center text-center font-mono space-y-4">
            <Lock size={36} className="text-[#00ff88] animate-bounce" />
            <div className="text-sm text-zinc-300 font-bold">
              DECRYPTING FORENSIC DOSSIER...
            </div>
            <div className="w-64 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-700">
              <div
                className="h-full bg-[#00ff88] transition-all duration-75"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-xs text-[#00ff88]">
              {`CASE FILE LOADING [${'█'.repeat(Math.floor(loadingProgress / 10))}${'░'.repeat(
                10 - Math.floor(loadingProgress / 10)
              )}] ${loadingProgress}%`}
            </div>
            <button
              onClick={() => setIsDecrypted(true)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 underline pt-2"
            >
              Skip Decrypt Animation
            </button>
          </div>
        ) : (
          /* Decrypted Dossier Content */
          <div className="p-5 sm:p-8 max-h-[80vh] overflow-y-auto font-sans space-y-6">

            {/* Case Dossier Header */}
            <div className="space-y-3 pb-5 border-b border-[#1c2a23]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
                  {caseStudy.caseNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold border uppercase ${getSeverityBadge(caseStudy.severity)}`}>
                  {caseStudy.severity} SEVERITY
                </span>
                <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-800">
                  VERDICT: {caseStudy.verdict}
                </span>
                <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-zinc-900 text-amber-400 border border-zinc-800">
                  ROLE: {caseStudy.role}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {caseStudy.title}
              </h2>
              <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                {caseStudy.tagline}
              </p>

              {/* MITRE ATT&CK Matrix Pills */}
              <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-[10px]">
                <span className="text-zinc-500 font-bold self-center mr-1">MITRE ATT&CK:</span>
                {caseStudy.mitreTechniques.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-zinc-950 text-[#38bdf8] border border-zinc-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex flex-wrap gap-2 font-mono text-xs border-b border-[#1c2a23] pb-3">
              {[
                { id: 'narrative' as const, label: '01. INVESTIGATION PHASES' },
                { id: 'kql' as const, label: '02. HUNTING QUERIES & LOGS' },
                { id: 'iocs' as const, label: '03. IOC ARTIFACTS' },
                { id: 'outcomes' as const, label: '04. OUTCOMES & LEARNINGS' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Investigation Narrative & Phases */}
            {activeTab === 'narrative' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                    Executive Overview & Problem Statement
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-[#040806] p-4 rounded-lg border border-[#14231b]">
                    {caseStudy.overview}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono text-xs font-bold text-[#00ff88] uppercase tracking-wider">
                    Detailed Investigation Phases
                  </h4>

                  {caseStudy.phases.map((phase) => (
                    <div
                      key={phase.num}
                      className="bg-[#040806] border border-[#14231b] rounded-lg p-4 font-mono text-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[#00ff88] font-bold">
                        <span>PHASE {phase.num}: {phase.title}</span>
                      </div>
                      <ul className="space-y-1.5 text-zinc-300 font-sans text-xs">
                        {phase.points.map((pt, pidx) => (
                          <li key={pidx} className="flex items-start gap-2">
                            <span className="text-[#00ff88] mt-0.5">▹</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: KQL Hunting Queries */}
            {activeTab === 'kql' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#00ff88] uppercase tracking-wider flex items-center gap-2">
                    <Terminal size={14} /> Production KQL Hunting Queries
                  </h4>
                </div>

                {caseStudy.phases
                  .filter((p) => p.kqlQuery)
                  .map((p, idx) => (
                    <div key={idx} className="space-y-2 bg-[#040806] border border-[#14231b] p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-bold">PHASE {p.num} HUNTING QUERY:</span>
                        <button
                          onClick={() => copyToClipboard(p.kqlQuery || '')}
                          className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 hover:border-[#00ff88] text-zinc-300 hover:text-[#00ff88] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedQuery ? <Check size={12} className="text-[#00ff88]" /> : <Copy size={12} />}
                          <span>{copiedQuery ? 'COPIED' : 'COPY QUERY'}</span>
                        </button>
                      </div>

                      <pre className="p-3 bg-[#020503] border border-[#0f2416] text-[#00ff88] text-[11px] rounded overflow-x-auto leading-relaxed">
                        {p.kqlQuery}
                      </pre>
                    </div>
                  ))}

                {caseStudy.phases.filter((p) => p.kqlQuery).length === 0 && (
                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg text-center text-zinc-400">
                    Proprietary custom detection rules authored for {caseStudy.title}. Available upon verified request.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: IOC Artifacts */}
            {activeTab === 'iocs' && (
              <div className="space-y-4 font-mono text-xs">
                <h4 className="font-bold text-[#00ff88] uppercase tracking-wider flex items-center gap-2">
                  <FileCode size={14} /> Indicators of Compromise (IOCs) & Forensics
                </h4>

                {caseStudy.iocs && caseStudy.iocs.length > 0 ? (
                  <div className="bg-[#040806] border border-[#14231b] rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-950 text-zinc-400 text-[10px] uppercase border-b border-[#1c2a23]">
                        <tr>
                          <th className="p-3">Type</th>
                          <th className="p-3">Observable Value</th>
                          <th className="p-3">Classification</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1c2a23] text-zinc-300">
                        {caseStudy.iocs.map((ioc, idx) => (
                          <tr key={idx} className="hover:bg-zinc-950/50">
                            <td className="p-3 text-[#38bdf8] font-bold">{ioc.type}</td>
                            <td className="p-3 text-white font-mono break-all">{ioc.value}</td>
                            <td className="p-3 text-amber-400">{ioc.status}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => copyToClipboard(ioc.value, ioc.value)}
                                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                                title="Copy Observable"
                              >
                                {copiedIoc === ioc.value ? <Check size={12} className="text-[#00ff88]" /> : <Copy size={12} />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg text-center text-zinc-400">
                    Synthesized architecture lab case study — observables generated deterministically.
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Outcomes & Learnings */}
            {activeTab === 'outcomes' && (
              <div className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {caseStudy.outcomes.map((out, idx) => (
                    <div
                      key={idx}
                      className="bg-[#040806] border border-[#14231b] p-4 rounded-lg font-mono text-center"
                    >
                      <div className="text-2xl font-bold text-[#00ff88]">{out.k}</div>
                      <div className="text-[11px] text-zinc-400 mt-1">{out.v}</div>
                    </div>
                  ))}
                </div>

                {/* Key Takeaways */}
                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-bold text-[#00ff88] uppercase tracking-wider">
                    Forensic Takeaways & Strategic Impact
                  </h4>
                  <ul className="space-y-2 bg-[#040806] border border-[#14231b] p-4 rounded-lg text-xs text-zinc-300 font-sans">
                    {caseStudy.learnings.map((learn, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#00ff88] shrink-0 mt-0.5" />
                        <span>{learn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4 border-t border-[#1c2a23] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
              {caseStudy.repoUrl && (
                <a
                  href={caseStudy.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#00ff88] hover:underline"
                >
                  <span>VIEW PUBLIC REPOSITORY DOSSIER</span>
                  <ExternalLink size={13} />
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 font-bold transition-colors cursor-pointer"
              >
                CLOSE DOSSIER
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
