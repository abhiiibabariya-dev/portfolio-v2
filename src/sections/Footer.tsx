import React from 'react';
import { Github, Linkedin, Download, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="border-t border-[#1e1e22] bg-[#0a0a0b] py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-6 h-6 border border-[#c8a96b]/40 flex items-center justify-center">
              <span className="font-mono text-[9px] font-bold text-[#c8a96b]">AS</span>
            </div>
            <span className="font-mono text-sm font-bold text-[#f0efea] tracking-widest">ABHI_SEC</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span className="font-mono text-[9px] text-[#4ade80] tracking-wider">ONLINE</span>
            </div>
          </div>
          <p className="font-mono text-[10px] text-[#4a4a54]">
            ABHISHEK BABARIYA · CYBERSECURITY PORTFOLIO · © 2026
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://www.linkedin.com/in/babariya-abhishek-0085691b4/"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-[#4a4a54] hover:text-[#c8a96b] transition-colors"
          >
            <Linkedin size={13} /> LinkedIn
          </a>
          <a
            href="https://github.com/abhiiibabariya-dev"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-[#4a4a54] hover:text-[#c8a96b] transition-colors"
          >
            <Github size={13} /> GitHub
          </a>
          <a
            href="/portfolio/resume/resume.pdf"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-[#4a4a54] hover:text-[#c8a96b] transition-colors"
          >
            <Download size={13} /> Resume
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 font-mono text-xs text-[#4a4a54] hover:text-[#c8a96b] transition-colors cursor-pointer ml-2"
          >
            <ArrowUp size={13} /> TOP
          </button>
        </div>

      </div>

      {/* Bottom strip */}
      <div className="mt-8 pt-6 border-t border-[#1e1e22] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-mono text-[9px] text-[#4a4a54] tracking-widest">
          CYBERSECURITY PORTFOLIO · DFIR · SECURITY OPERATIONS
        </span>
        <span className="font-mono text-[9px] text-[#4a4a54] tracking-widest">
          AVAILABLE FOR PROFESSIONAL COLLABORATION
        </span>
      </div>
    </div>
  </footer>
);
