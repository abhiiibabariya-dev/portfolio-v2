import React, { useEffect, useRef } from 'react';

const TOKENS = ['0', '1', 'A1F9', '0xFF', '192.168', 'SHA256', 'PKT-04', 'EVT-7C'];

export const TelemetryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let paused = document.hidden;
    let columns = 0;
    let streams: number[] = [];
    const fontSize = 12;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.max(1, Math.floor(canvas.width / 92));
      streams = Array.from({ length: columns }, () => Math.random() * -40);
    };
    const visibility = () => { paused = document.hidden; };
    const draw = () => {
      if (!paused && !reduced) {
        context.fillStyle = 'rgba(10,10,11,0.12)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = `${fontSize}px "JetBrains Mono", monospace`;
        streams.forEach((stream, index) => {
          const token = TOKENS[(index + Math.floor(stream)) % TOKENS.length];
          context.fillStyle = index % 5 === 0 ? 'rgba(74,222,128,0.14)' : 'rgba(200,169,107,0.08)';
          context.fillText(token, index * 92, stream * fontSize);
          streams[index] = stream > canvas.height / fontSize + 2 && Math.random() > 0.97 ? -4 : stream + 0.18;
        });
      }
      frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" style={{ opacity: 0.7 }} />;
};
