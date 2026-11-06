import React from 'react';
import { ArrowRight, Github, Linkedin, Download } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-56px)]">

          {/* LEFT — Text content */}
          <div className="flex flex-col justify-center order-2 lg:order-1">

            {/* Status badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-[#1e1e22] bg-[#0f0f10]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                <span className="font-mono text-[10px] text-[#4ade80] tracking-widest">SYSTEM STATUS: ONLINE</span>
              </div>
              <div className="hidden sm:block h-px flex-1 bg-[#1e1e22]" />
            </div>

            {/* Meta identifiers */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
              <span className="font-mono text-[11px] text-[#8a8a96] tracking-widest">IDENTITY: ABHI_SEC</span>
              <span className="font-mono text-[11px] text-[#4a4a54]">/</span>
              <span className="font-mono text-[11px] text-[#c8a96b] tracking-widest">ICICI BANK · DFIR &amp; RISK</span>
              <span className="font-mono text-[11px] text-[#4a4a54]">/</span>
              <span className="font-mono text-[11px] text-[#8a8a96] tracking-widest">INDIA</span>
            </div>

            {/* Name */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none tracking-tight mb-6 uppercase">
              <span className="text-[#f0efea]">Abhishek</span>
              <br />
              <span className="text-[#c8a96b]">Babariya</span>
            </h1>

            {/* Role */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['DFIR ANALYST', 'SOC OPERATIONS', 'INCIDENT RESPONSE', 'THREAT DETECTION'].map(tag => (
                <span key={tag} className="font-mono text-[10px] tracking-widest text-[#8a8a96] border border-[#1e1e22] px-2.5 py-1">
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-[#8a8a96] text-base leading-relaxed max-w-xl mb-10">
              Cybersecurity professional specializing in digital forensics, incident response,
              and security operations. Currently driving DFIR investigations at{' '}
              <span className="text-[#f0efea] font-semibold">ICICI Bank</span>.
              M.Sc. Digital Forensics from{' '}
              <span className="text-[#f0efea] font-semibold">NFSU</span> (CGPA 9.00).
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => scrollTo('#projects')}
                className="flex items-center gap-2 px-6 py-3 bg-[#c8a96b] text-[#0a0a0b] font-mono text-xs font-bold tracking-wider hover:bg-[#d4b87a] transition-all group"
              >
                EXPLORE PROJECTS
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="/portfolio/resume/resume.pdf"
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-[#2a2a30] text-[#f0efea] font-mono text-xs font-bold tracking-wider hover:border-[#c8a96b]/50 hover:text-[#c8a96b] transition-all"
              >
                <Download size={13} />
                RESUME
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/babariya-abhishek-0085691b4/" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 font-mono text-xs text-[#8a8a96] hover:text-[#c8a96b] transition-colors">
                <Linkedin size={14} />
                <span>LinkedIn</span>
              </a>
              <span className="text-[#1e1e22]">·</span>
              <a href="https://github.com/abhiiibabariya-dev" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 font-mono text-xs text-[#8a8a96] hover:text-[#c8a96b] transition-colors">
                <Github size={14} />
                <span>GitHub</span>
              </a>
              <span className="text-[#1e1e22]">·</span>
              <span className="font-mono text-xs text-[#4a4a54]">abhibabariya007@gmail.com</span>
            </div>
          </div>

          {/* RIGHT — Photo + dossier frame */}
          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm lg:max-w-md">
              {/* Decorative corner lines */}
              <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-[#c8a96b]/40" />
              <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-[#c8a96b]/40" />
              <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-[#c8a96b]/40" />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-[#c8a96b]/40" />

              {/* Photo container */}
              <div className="border border-[#1e1e22] bg-[#0f0f10] overflow-hidden aspect-[4/5] w-full max-w-[320px] mx-auto">
                <img
                  src="/portfolio/images/hero/portrait.png"
                  alt="Abhishek Babariya"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = 'none';
                    const parent = t.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center gap-3">
                          <div class="w-20 h-20 rounded-full border-2 border-[#c8a96b]/40 flex items-center justify-center">
                            <span class="font-mono text-2xl font-bold text-[#c8a96b]">AB</span>
                          </div>
                          <span class="font-mono text-xs text-[#4a4a54]">ABHISHEK BABARIYA</span>
                        </div>`;
                    }
                  }}
                />
              </div>

              {/* Dossier metadata overlay — bottom */}
              <div className="mt-0 border-x border-b border-[#1e1e22] bg-[#0f0f10] px-4 py-3 max-w-[320px] mx-auto">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest">CASE FILE</div>
                    <div className="font-mono text-[11px] text-[#c8a96b] font-bold mt-0.5">ABHI-SEC-2026</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[9px] text-[#4a4a54] tracking-widest">CLEARANCE</div>
                    <div className="font-mono text-[11px] text-[#4ade80] font-bold mt-0.5">VERIFIED</div>
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div className="mt-3 grid grid-cols-3 gap-2 max-w-[320px] mx-auto">
                {[
                  { v: '100+', l: 'Daily Alerts' },
                  { v: '9.00', l: 'CGPA NFSU' },
                  { v: '80%', l: 'MTTR Reduction' },
                ].map(s => (
                  <div key={s.l} className="border border-[#1e1e22] bg-[#0f0f10] p-2.5 text-center">
                    <div className="font-mono text-base font-bold text-[#c8a96b]">{s.v}</div>
                    <div className="font-mono text-[9px] text-[#4a4a54] mt-0.5 leading-tight">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1e1e22]" />
    </section>
  );
};
