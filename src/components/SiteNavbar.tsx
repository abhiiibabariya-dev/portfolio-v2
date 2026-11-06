import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ExternalLink, Github, Linkedin, Menu, Terminal, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

const navLinks = [
  { to: '/about', label: 'ABOUT' },
  { to: '/experience', label: 'EXPERIENCE' },
  { to: '/projects', label: 'PROJECTS' },
  { to: '/visualizations', label: 'SOC LAB' },
  { to: '/skills', label: 'SKILLS' },
  { to: '/certifications', label: 'CERTIFICATIONS' },
  { to: '/education', label: 'EDUCATION' },
  { to: '/recruiter', label: 'RECRUITER' },
  { to: '/contact', label: 'CONTACT' },
];
export const SiteNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => { if (!open) return; const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [open]);
  const navClass = ({ isActive }: { isActive: boolean }) => `px-2.5 py-1.5 font-mono text-[10px] tracking-wider transition-colors ${isActive ? 'text-[#c8a96b]' : 'text-[#8a8a96] hover:text-[#f0efea]'}`;
  return <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0b]/95 backdrop-blur-md border-b border-[#1e1e22]' : 'bg-[#0a0a0b]/75 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2.5 group shrink-0" aria-label={`${PROFILE.handle} home`}><span className="w-7 h-7 border border-[#c8a96b]/60 flex items-center justify-center text-[#c8a96b] font-mono text-[10px] font-bold">AS</span><span className="font-mono text-sm font-bold tracking-widest text-[#f0efea] group-hover:text-[#c8a96b] hidden sm:block">{PROFILE.handle}</span><span className="flex items-center gap-1 font-mono text-[9px] text-[#4ade80]"><span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" /> ONLINE</span></NavLink>
        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Primary navigation">{navLinks.map(link => <NavLink key={link.to} to={link.to} className={navClass}>{link.label}</NavLink>)}</nav>
        <div className="flex items-center gap-1.5 shrink-0"><NavLink to="/terminal" className={({ isActive }) => `w-8 h-8 flex items-center justify-center ${isActive ? 'text-[#c8a96b]' : 'text-[#8a8a96] hover:text-[#f0efea]'}`} aria-label="Open portfolio terminal"><Terminal size={15} /></NavLink><a href={PROFILE.github} target="_blank" rel="noreferrer" className="hidden sm:flex w-8 h-8 items-center justify-center text-[#8a8a96] hover:text-[#f0efea]" aria-label="GitHub"><Github size={15} /></a><a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="hidden sm:flex w-8 h-8 items-center justify-center text-[#8a8a96] hover:text-[#f0efea]" aria-label="LinkedIn"><Linkedin size={15} /></a><NavLink to="/resume" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-[#c8a96b]/40 text-[#c8a96b] font-mono text-[10px] hover:bg-[#c8a96b]/10"><ExternalLink size={10} /> RESUME</NavLink><button onClick={() => setOpen(value => !value)} className="xl:hidden w-8 h-8 flex items-center justify-center text-[#8a8a96] hover:text-[#f0efea]" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open}>{open ? <X size={18} /> : <Menu size={18} />}</button></div>
      </div>
    </header>
    {open && <div className="fixed inset-0 z-40 xl:hidden" role="dialog" aria-label="Mobile navigation"><button className="absolute inset-0 w-full h-full bg-[#0a0a0b]/95 backdrop-blur-xl cursor-default" aria-label="Close menu" onClick={() => setOpen(false)} /><div className="relative z-10 pt-20 px-6 pb-8 h-full flex flex-col"><nav className="flex flex-col" aria-label="Mobile navigation">{navLinks.map(link => <NavLink key={link.to} to={link.to} className={({ isActive }) => `py-3.5 border-b border-[#1e1e22] font-mono text-sm tracking-wider ${isActive ? 'text-[#c8a96b]' : 'text-[#8a8a96]'}`}>{link.label}</NavLink>)}</nav><div className="mt-auto space-y-4"><div className="grid grid-cols-2 gap-2"><NavLink to="/schedule" className="text-center border border-[#c8a96b]/40 text-[#c8a96b] py-3 font-mono text-xs">SCHEDULE</NavLink><NavLink to="/verify" className="text-center border border-[#1e1e22] text-[#8a8a96] py-3 font-mono text-xs">VERIFY</NavLink></div><NavLink to="/resume" className="flex justify-center items-center gap-2 py-3 border border-[#c8a96b]/50 text-[#c8a96b] font-mono text-sm"><ExternalLink size={14} /> RESUME</NavLink><div className="flex justify-center gap-5"><a href={PROFILE.github} target="_blank" rel="noreferrer" className="text-[#8a8a96]"><Github size={16} /></a><a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="text-[#8a8a96]"><Linkedin size={16} /></a></div></div></div></div>}
  </>;
};
