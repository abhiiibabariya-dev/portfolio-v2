import React, { useEffect, useRef } from 'react';

const CHARS = '0123456789ABCDEF アイウエオカキクケコサシスセソタチツテト';
const CHAR_ARR = CHARS.split('');

export const RainingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const fontSize = 13;
    let cols: number;
    let drops: number[];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1).map(() => Math.random() * -100);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,11,0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = CHAR_ARR[Math.floor(Math.random() * CHAR_ARR.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Lead character slightly brighter
        ctx.fillStyle = drops[i] * fontSize > 0 ? 'rgba(200,169,107,0.55)' : 'rgba(200,169,107,0.18)';
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.4;
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.08 }}
    />
  );
};
