import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseVal: number;
  color: string;
}

export const CyberCanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Throttle particles for performance
    const particleCount = prefersReducedMotion ? 12 : isMobile ? 24 : 65;
    const connectionDistance = isMobile ? 85 : 135;
    const mouseRadius = 150;

    const colors = ['#00ff88', '#38bdf8', '#c8a96b', '#10b981'];

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.4 + 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.6),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.6),
        radius: Math.random() * 1.8 + 1,
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let radarAngle = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    window.addEventListener('resize', handleResize);
    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = isMobile ? 60 : 80;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Draw subtle radar scanner sweep in top right quadrant
      if (!prefersReducedMotion) {
        const radarCenterX = width * 0.82;
        const radarCenterY = height * 0.22;
        const radarMaxRadius = isMobile ? 120 : 220;

        radarAngle += isMobile ? 0.008 : 0.012;

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
        ctx.lineWidth = 1;

        // Concentric rings
        for (let r = radarMaxRadius * 0.33; r <= radarMaxRadius; r += radarMaxRadius * 0.33) {
          ctx.beginPath();
          ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(radarCenterX - radarMaxRadius, radarCenterY);
        ctx.lineTo(radarCenterX + radarMaxRadius, radarCenterY);
        ctx.moveTo(radarCenterX, radarCenterY - radarMaxRadius);
        ctx.lineTo(radarCenterX, radarCenterY + radarMaxRadius);
        ctx.stroke();

        // Sweep gradient sector
        const sweepGradient = ctx.createRadialGradient(
          radarCenterX,
          radarCenterY,
          0,
          radarCenterX,
          radarCenterY,
          radarMaxRadius
        );
        sweepGradient.addColorStop(0, 'rgba(0, 255, 136, 0.12)');
        sweepGradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

        ctx.fillStyle = sweepGradient;
        ctx.beginPath();
        ctx.moveTo(radarCenterX, radarCenterY);
        ctx.arc(radarCenterX, radarCenterY, radarMaxRadius, radarAngle - 0.4, radarAngle);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 3. Update & Draw Particles & Interconnecting Mesh Lines
      const { x: mx, y: my, active: mouseActive } = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          p.pulseVal += p.pulseSpeed;
          p.alpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.12;

          // Boundary bouncing
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Mouse interaction (gentle attraction / repulsion)
          if (mouseActive) {
            const dx = mx - p.x;
            const dy = my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouseRadius && dist > 1) {
              const force = (mouseRadius - dist) / mouseRadius;
              p.x -= (dx / dist) * force * 1.5;
              p.y -= (dy / dist) * force * 1.5;
            }
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections between nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const lineAlpha = (1 - dist / connectionDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#00ff88';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Subtle vignette and scanline grid overlay */}
      <div
        className="absolute inset-0 bg-radial-vignette opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% 30%, transparent 40%, #050505 95%)'
        }}
      />
    </div>
  );
};
