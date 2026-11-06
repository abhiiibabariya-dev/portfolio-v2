import React from 'react';
import { PROFILE } from '../data/portfolioData';
import { Shield, ArrowUp, Lock, Github, Linkedin, Mail } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030604] border-t border-[#1c2a23] py-12 text-zinc-400 font-mono text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Tier: Identity, Role, & Status */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#14231b]">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base font-sans tracking-wide">
              <Shield size={16} className="text-[#00ff88]" />
              <span>{PROFILE.name.toUpperCase()}</span>
              <span className="text-zinc-600">//</span>
              <span className="text-[#00ff88] text-xs font-mono">{PROFILE.handle}</span>
            </div>
            <p className="text-zinc-400 text-xs mt-1 font-sans">
              {PROFILE.currentRole} · {PROFILE.currentOrg} · M.Sc. Digital Forensics (NFSU)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-[#00ff88] hover:text-white transition-colors"
              title="GitHub"
            >
              <Github size={15} />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-[#00ff88] hover:text-white transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={15} />
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-[#00ff88] hover:text-white transition-colors"
              title="Email"
            >
              <Mail size={15} />
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#00ff88]/15 border border-[#00ff88]/40 hover:bg-[#00ff88] hover:text-black text-[#00ff88] rounded-lg font-bold transition-all cursor-pointer"
            >
              <span>TOP</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>

        {/* Bottom Tier: Attestation & System Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-[#00ff88]" />
            <span>CRYPTOGRAPHICALLY ATTESTED CYBERSECURITY PORTFOLIO // 2026</span>
          </div>

          <div>
            <span>SYSTEM DEFCON 4 // ZERO UNRESOLVED ANOMALIES</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default FooterSection;
