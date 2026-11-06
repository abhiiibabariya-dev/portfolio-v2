import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, Minus, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

const links = [{to:'/about',label:'About'},{to:'/experience',label:'Experience'},{to:'/projects',label:'Work'},{to:'/skills',label:'Skills'},{to:'/contact',label:'Contact'}];
export const SiteNavbar: React.FC = () => {
  const [open,setOpen]=useState(false); const [motion,setMotion]=useState(true); const [scrolled,setScrolled]=useState(false); const location=useLocation();
  useEffect(()=>{ const saved=localStorage.getItem('portfolio-v2-motion'); if(saved==='off') setMotion(false); const onScroll=()=>setScrolled(window.scrollY>30); window.addEventListener('scroll',onScroll,{passive:true}); return()=>window.removeEventListener('scroll',onScroll); },[]);
  useEffect(()=>{ document.documentElement.dataset.motion=motion?'on':'off'; localStorage.setItem('portfolio-v2-motion',motion?'on':'off'); },[motion]);
  useEffect(()=>setOpen(false),[location.pathname]);
  useEffect(()=>{ if(!open)return; const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)}; document.addEventListener('keydown',onKey); return()=>document.removeEventListener('keydown',onKey); },[open]);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled?'border-b border-[#2a2827] bg-[#090909]/92 backdrop-blur-xl':'bg-transparent'}`}>
    <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 sm:px-8">
      <NavLink to="/" className="group flex items-center gap-3" aria-label={`${PROFILE.name} home`}><span className="flex h-9 w-9 items-center justify-center bg-[#e32b3c] font-display text-lg text-white">AB</span><span className="hidden text-xs font-extrabold uppercase tracking-[.18em] text-[#f2efeb] sm:block">{PROFILE.handle}</span></NavLink>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">{links.map(link=><NavLink key={link.to} to={link.to} className={({isActive})=>`relative text-[11px] font-bold uppercase tracking-[.12em] transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-[#e32b3c] after:transition-all ${isActive?'text-[#f2efeb] after:w-full':'text-[#a09c9a] after:w-0 hover:text-[#f2efeb] hover:after:w-full'}`}>{link.label}</NavLink>)}</nav>
      <div className="flex items-center gap-2"><button onClick={()=>setMotion(v=>!v)} className="hidden items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#a09c9a] transition hover:text-[#f2efeb] sm:flex" aria-pressed={!motion}><span className={`h-1.5 w-1.5 rounded-full ${motion?'bg-[#e32b3c]':'bg-[#a09c9a]'}`} /> Motion {motion?'On':'Off'}</button><NavLink to="/contact" className="hidden items-center gap-1 border border-[#e32b3c] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#e32b3c] transition hover:bg-[#e32b3c] hover:text-white sm:flex">Let’s talk <ArrowUpRight size={13}/></NavLink><button className="flex h-11 w-11 items-center justify-center text-[#f2efeb] md:hidden" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label={open?'Close menu':'Open menu'}>{open?<X/>:<Menu/>}</button></div>
    </div>
    {open&&<div className="fixed inset-0 top-20 z-40 bg-[#090909] px-5 py-8 md:hidden"><nav className="flex flex-col" aria-label="Mobile navigation">{links.map((link,index)=><NavLink key={link.to} to={link.to} className="flex items-center justify-between border-b border-[#2a2827] py-5 text-4xl font-display uppercase" onClick={()=>setOpen(false)}><span><span className="mr-4 font-body text-xs text-[#e32b3c]">0{index+1}</span>{link.label}</span><ArrowUpRight size={24}/></NavLink>)}</nav><button onClick={()=>setMotion(v=>!v)} className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a09c9a]"><Minus size={14} className={motion?'text-[#e32b3c]':'text-[#a09c9a]'}/> Motion {motion?'enabled':'disabled'}</button></div>}
  </header>;
};
