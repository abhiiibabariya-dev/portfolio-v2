import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Search, X } from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';

const allCategories = ['ALL', ...Array.from(new Set(CERTIFICATIONS.map(c => c.category)))];

export const CertificationsPage: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = CERTIFICATIONS.filter(c => {
    const matchCat = filter === 'ALL' || c.category === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#4a4a54] hover:text-[#c8a96b] transition-colors mb-12 tracking-widest">
          <ArrowLeft size={11} /> HOME / CREDENTIALS
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="font-mono text-[11px] text-[#c8a96b] tracking-widest mb-3">06 / CERTIFICATIONS</div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#f0efea] uppercase leading-tight">
              Credential<br />Vault
            </h1>
            <div className="h-px w-24 bg-[#c8a96b]/40 mt-6" />
          </div>
          <div className="font-mono text-xs text-[#4a4a54]">{CERTIFICATIONS.length} CREDENTIALS</div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
              <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-[#1e1e22]">
                <div>
                  <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest mb-1">{cert.category}</div>
                  <div className="w-6 h-1" style={{ background: cert.badgeColor, opacity: 0.6 }} />
                </div>
                <span className="font-mono text-[10px] text-[#4a4a54] shrink-0">{cert.issueDate}</span>
              </div>

              <h3 className="text-sm font-semibold text-[#f0efea] leading-snug mb-1 group-hover:text-[#c8a96b] transition-colors">
                {cert.name}
              </h3>
              <div className="font-mono text-[11px] text-[#8a8a96] mb-4">{cert.issuer}</div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {cert.skills.slice(0, 3).map(s => (
                  <span key={s} className="font-mono text-[9px] text-[#4a4a54] border border-[#1e1e22] px-1.5 py-0.5">{s}</span>
                ))}
                {cert.skills.length > 3 && (
                  <span className="font-mono text-[9px] text-[#4a4a54]">+{cert.skills.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1e1e22]">
                <span className="font-mono text-[9px] text-[#4a4a54]">ID: {cert.credentialId}</span>
                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-mono text-[9px] font-bold hover:opacity-75 transition-opacity"
                    style={{ color: cert.badgeColor }}
                  >
                    VERIFY <ExternalLink size={9} />
                  </a>
                ) : (
                  <span className="font-mono text-[9px] text-[#4a4a54]">CREDENTIAL RECORDED</span>
                )}
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
    </div>
  );
};
