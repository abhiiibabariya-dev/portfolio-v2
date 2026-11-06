import React, { useState } from 'react';
import { CERTIFICATIONS, CertificationItem } from '../data/portfolioData';
import { Award, ShieldCheck, ExternalLink, Lock, Search, X } from 'lucide-react';

export const CertificationsVaultSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null);

  const categories = ['ALL', 'DFIR & Forensics', 'SIEM & Cloud', 'Security Essentials', 'Standards & Governance'];

  const filteredCerts = CERTIFICATIONS.filter((cert) => {
    const matchesCategory = selectedCategory === 'ALL' || cert.category === selectedCategory;
    const matchesSearch =
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="certifications" className="py-20 bg-[#050806] text-zinc-100 border-b border-[#1c1c1c] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-xs text-[#00ff88] mb-3">
              <Award size={13} />
              <span>CRYPTOGRAPHICALLY ATTESTED CREDENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
              CREDENTIAL VAULT
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-2 max-w-2xl">
              Professional industry accreditations across digital forensics, ethical hacking, SIEM architectures, and ISO standards.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
            <ShieldCheck size={15} className="text-[#00ff88]" />
            <span>{CERTIFICATIONS.length} VERIFIED BADGES</span>
          </div>
        </div>

        {/* Controls: Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 font-mono text-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credentials..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-zinc-600 outline-none focus:border-[#00ff88]"
            />
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setActiveCert(cert)}
              className="bg-[#080d0b] border border-[#1f2e26] hover:border-[#00ff88]/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,255,136,0.12)] relative overflow-hidden"
            >
              {/* Corner Glowing Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/5 rounded-bl-full group-hover:bg-[#00ff88]/10 transition-colors pointer-events-none" />

              <div>
                {/* Issuer Badge & Category */}
                <div className="flex items-center justify-between font-mono text-[10px] pb-3 border-b border-[#1c2a23]">
                  <span className="text-[#00ff88] font-bold tracking-wider">{cert.issuer}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                    {cert.issueDate}
                  </span>
                </div>

                {/* Certificate Name */}
                <h3 className="text-lg font-bold text-white mt-4 group-hover:text-[#00ff88] transition-colors leading-snug">
                  {cert.name}
                </h3>

                {/* Credential ID */}
                <div className="mt-3 font-mono text-[10px] text-zinc-500 flex items-center gap-1.5">
                  <Lock size={11} className="text-amber-400" />
                  <span>ID: {cert.credentialId}</span>
                </div>

                {/* Skills Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[9px]">
                  {cert.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Verification Trigger */}
              <div className="mt-6 pt-4 border-t border-[#1c2a23] flex items-center justify-between font-mono text-xs text-zinc-400 group-hover:text-[#00ff88]">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck size={14} className="text-[#00ff88]" />
                  VERIFY RECORD
                </span>
                <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Certificate Verification Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="fixed inset-0" onClick={() => setActiveCert(null)} />

          <div className="relative w-full max-w-lg bg-[#080d0b] border border-[#00ff88]/50 rounded-2xl shadow-[0_0_80px_rgba(0,255,136,0.2)] p-6 z-10 font-mono text-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2a23]">
              <div className="flex items-center gap-2 text-[#00ff88]">
                <ShieldCheck size={16} />
                <span className="font-bold tracking-wider">OFFICIAL CREDENTIAL VERIFICATION</span>
              </div>
              <button
                onClick={() => setActiveCert(null)}
                className="text-zinc-400 hover:text-white p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <span className="font-mono text-[10px] text-zinc-500 uppercase block">
                {activeCert.category} · {activeCert.issuer}
              </span>
              <h3 className="text-xl font-bold text-white">{activeCert.name}</h3>

              <div className="p-3 bg-[#040806] border border-[#14231b] rounded-lg font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">CREDENTIAL ID:</span>
                  <span className="text-[#00ff88] font-bold">{activeCert.credentialId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">ISSUE DATE:</span>
                  <span className="text-zinc-300">{activeCert.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">STATUS:</span>
                  <span className="text-emerald-400 font-bold">VERIFIED & ACTIVE</span>
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1.5">
                  Validated Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {activeCert.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1c2a23] flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveCert(null)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg hover:border-zinc-500 font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default CertificationsVaultSection;
