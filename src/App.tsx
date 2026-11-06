import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SiteNavbar } from './components/SiteNavbar';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { SkillsPage } from './pages/SkillsPage';
import { CertificationsPage } from './pages/CertificationsPage';
import { EducationPage } from './pages/EducationPage';
import { ResumePage } from './pages/ResumePage';
import { ContactPage } from './pages/ContactPage';
import { SchedulePage } from './pages/SchedulePage';
import { TerminalPage } from './pages/TerminalPage';
import { VisualizationsPage } from './pages/VisualizationsPage';
import { VerifyPage } from './pages/VerifyPage';
import { RecruiterPage } from './pages/RecruiterPage';
import { InterviewPage } from './pages/InterviewPage';
import { AdminPage, AdminSignIn } from './pages/AdminPage';
import { AdminAvailabilityPage } from './pages/AdminAvailabilityPage';
import { VisitorBookingActionPage } from './pages/VisitorBookingActionPage';
import { Footer } from './sections/Footer';

function ScrollToTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; }
function PageTransition() { const { pathname } = useLocation(); return <div key={pathname} className="page-transition" aria-hidden="true" />; }
function CursorMotion() {
  const ring = useRef<HTMLDivElement>(null); const dot = useRef<HTMLDivElement>(null); const particles = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const points = Array.from({ length: 10 }, () => ({ x: -100, y: -100 })); let targetX = -100, targetY = -100, frame = 0;
    const move = (event: MouseEvent) => { targetX = event.clientX; targetY = event.clientY; };
    const render = () => {
      points.forEach((point, index) => { const leadX = index === 0 ? targetX : points[index - 1].x; const leadY = index === 0 ? targetY : points[index - 1].y; point.x += (leadX - point.x) * (index === 0 ? .28 : .22); point.y += (leadY - point.y) * (index === 0 ? .28 : .22); const particle = particles.current[index]; if (particle) particle.style.transform = `translate3d(${point.x - 3}px, ${point.y - 3}px, 0)`; });
      const lead = points[0]; if (ring.current) ring.current.style.transform = `translate3d(${lead.x - 18}px, ${lead.y - 18}px, 0)`; if (dot.current) dot.current.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`; frame = requestAnimationFrame(render);
    };
    window.addEventListener('mousemove', move); frame = requestAnimationFrame(render);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(frame); };
  }, []);
  return <><div ref={ring} className="cursor-ring" aria-hidden="true"/><div ref={dot} className="cursor-dot" aria-hidden="true"/>{Array.from({ length: 10 }, (_, index) => <div key={index} ref={node => { if (node) particles.current[index] = node; }} className="cursor-particle" aria-hidden="true"/>)}</>;
}

export const App: React.FC = () => <div className="min-h-screen bg-[#090909] text-[#f2efeb] overflow-x-hidden">
  <ScrollToTop /><PageTransition /><CursorMotion /><SiteNavbar />
  <main className="page-shell"><Routes>
    <Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} />
    <Route path="/experience" element={<ExperiencePage />} /><Route path="/projects" element={<ProjectsPage />} />
    <Route path="/projects/:id" element={<CaseStudyPage />} /><Route path="/skills" element={<SkillsPage />} />
    <Route path="/certifications" element={<CertificationsPage />} /><Route path="/education" element={<EducationPage />} />
    <Route path="/resume" element={<ResumePage />} /><Route path="/contact" element={<ContactPage />} />
    <Route path="/schedule" element={<SchedulePage />} /><Route path="/recruiter" element={<RecruiterPage />} />
    <Route path="/interview" element={<InterviewPage />} /><Route path="/admin/sign-in" element={<AdminSignIn />} />
    <Route path="/admin" element={<AdminPage />} /><Route path="/admin/availability" element={<AdminAvailabilityPage />} />
    <Route path="/reschedule/:token" element={<VisitorBookingActionPage mode="reschedule" />} />
    <Route path="/cancel/:token" element={<VisitorBookingActionPage mode="cancel" />} />
    <Route path="/terminal" element={<TerminalPage />} /><Route path="/visualizations" element={<VisualizationsPage />} />
    <Route path="/labs" element={<VisualizationsPage />} /><Route path="/verify" element={<VerifyPage />} />
  </Routes></main><Footer />
</div>;
export default App;
