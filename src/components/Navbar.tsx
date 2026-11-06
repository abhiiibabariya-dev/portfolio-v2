import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, ExternalLink } from 'lucide-react';

interface NavbarProps { scrolled: boolean; }

const navLinks = [
  { href: '#about',         label: '/about' },
  { href: '#experience',   label: '/experience' },
  { href: '#projects',     label: '/projects' },
  { href: '#skills',       label: '/skills' },
  { href: '#certifications', label: '/certs' },
  { href: '#education',    label: '/education' },
  { href: '#contact',      label: '/contact' },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id); });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLink = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollTo(href), 50);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0b]/95 backdrop-blur-md border-b border-[#1e1e22]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Brand */}
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-7 h-7 border border-[#c8a96b]/50 flex items-center justify-center group-hover:border-[#c8a96b] transition-colors">
              <span className="text-[#c8a96b] font-mono text-[10px] font-bold">AS</span>
            </div>
            <span className="font-mono text-sm font-bold text-[#f0efea] tracking-widest group-hover:text-[#c8a96b] transition-colors hidden sm:block">
              ABHI_SEC
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span className="font-mono text-[9px] text-[#4ade80] hidden md:block tracking-wider">ONLINE</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(l => (
              <button
                key={l.href}
                onClick={() => handleLink(l.href)}
                className={`px-3 py-1.5 font-mono text-xs tracking-wider transition-colors cursor-pointer ${
                  active === l.href
                    ? 'text-[#c8a96b]'
                    : 'text-[#8a8a96] hover:text-[#f0efea]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/abhiiibabariya-dev"
              target="_blank" rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center text-[#8a8a96] hover:text-[#f0efea] transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/babariya-abhishek-0085691b4/"
              target="_blank" rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center text-[#8a8a96] hover:text-[#f0efea] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="/portfolio/resume/resume.pdf"
              target="_blank" rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#c8a96b]/40 text-[#c8a96b] font-mono text-xs hover:bg-[#c8a96b]/10 transition-all"
            >
              <ExternalLink size={11} />
              <span>RESUME</span>
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-8 h-8 flex items-center justify-center text-[#8a8a96] hover:text-[#f0efea] transition-colors"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex flex-col pt-20 px-6 pb-8 h-full">
            <nav className="flex flex-col gap-1">
              {navLinks.map(l => (
                <button
                  key={l.href}
                  onClick={() => handleLink(l.href)}
                  className="text-left py-3.5 border-b border-[#1e1e22] font-mono text-base text-[#8a8a96] hover:text-[#c8a96b] transition-colors tracking-wider cursor-pointer"
                >
                  {l.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <a
                href="/portfolio/resume/resume.pdf"
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 border border-[#c8a96b]/50 text-[#c8a96b] font-mono text-sm hover:bg-[#c8a96b]/10 transition-all"
              >
                <ExternalLink size={14} />
                DOWNLOAD RESUME
              </a>
              <div className="flex items-center gap-3 justify-center">
                <a href="https://github.com/abhiiibabariya-dev" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-[#8a8a96] hover:text-[#f0efea] font-mono text-xs transition-colors">
                  <Github size={15} /> GitHub
                </a>
                <span className="text-[#1e1e22]">|</span>
                <a href="https://www.linkedin.com/in/babariya-abhishek-0085691b4/" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-[#8a8a96] hover:text-[#f0efea] font-mono text-xs transition-colors">
                  <Linkedin size={15} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
