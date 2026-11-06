import React, { useState, useEffect } from 'react';
import { Shield, Terminal, Menu, X, FileText, ChevronRight } from 'lucide-react';
import { PROFILE } from '../../data/portfolioData';

interface CyberNavbarProps {
  onOpenTerminal: () => void;
}

export const CyberNavbar: React.FC<CyberNavbarProps> = ({ onOpenTerminal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#hero', label: 'HERO', num: '01' },
    { href: '#projects', label: 'CASE FILES', num: '02' },
    { href: '#visualizations', label: 'VISUAL LAB', num: '03' },
    { href: '#dfir', label: 'DFIR', num: '04' },
    { href: '#skills', label: 'ARSENAL', num: '05' },
    { href: '#experience', label: 'TIMELINE', num: '06' },
    { href: '#certifications', label: 'CREDENTIALS', num: '07' },
    { href: '#about', label: 'ABOUT', num: '08' },
    { href: '#contact', label: 'CONTACT', num: '09' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#030604]/90 backdrop-blur-md border-b border-[#1c2a23] py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Left Brand Callout */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00ff88]/15 border border-[#00ff88]/40 flex items-center justify-center text-[#00ff88] group-hover:bg-[#00ff88] group-hover:text-black transition-all">
              <Shield size={16} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white tracking-wider">
                <span>{PROFILE.handle}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
              </div>
              <span className="font-mono text-[9px] text-zinc-400">SOC DEFENSE NODE</span>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 font-mono text-[11px]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-2.5 py-1 text-zinc-400 hover:text-[#00ff88] hover:bg-zinc-900/60 rounded transition-all flex items-center gap-1"
              >
                <span className="text-zinc-600 text-[9px]">{link.num}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action Trigger Buttons */}
          <div className="flex items-center gap-3">
            {/* Terminal Launch Trigger Button */}
            <button
              onClick={onOpenTerminal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ff88]/15 border border-[#00ff88]/50 hover:bg-[#00ff88] hover:text-black text-[#00ff88] font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)] cursor-pointer"
            >
              <Terminal size={13} />
              <span className="hidden sm:inline">TERMINAL</span>
            </button>

            {/* Resume Button */}
            <a
              href={PROFILE.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 font-mono text-xs font-semibold transition-all"
            >
              <FileText size={13} className="text-[#38bdf8]" />
              <span>CV</span>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex flex-col bg-[#050806]/95 backdrop-blur-xl border-b border-[#1c2a23] p-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-[#1c2a23]">
            <div className="flex items-center gap-2 font-mono text-xs text-[#00ff88] font-bold">
              <Shield size={16} />
              <span>NAVIGATION MATRIX</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 py-6 flex flex-col justify-around font-mono">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-900 hover:border-[#00ff88]/50 text-zinc-200 hover:text-[#00ff88] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#00ff88] text-xs">{link.num}</span>
                  <span className="text-sm font-bold font-sans">{link.label}</span>
                </div>
                <ChevronRight size={15} className="text-zinc-600" />
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1c2a23] flex gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="flex-1 py-3 bg-[#00ff88]/20 border border-[#00ff88] text-[#00ff88] rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2"
            >
              <Terminal size={14} />
              <span>LAUNCH TERMINAL</span>
            </button>

            <a
              href={PROFILE.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2"
            >
              <FileText size={14} className="text-[#38bdf8]" />
              <span>RESUME</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
export default CyberNavbar;
