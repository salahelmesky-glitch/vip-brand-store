import { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const isMobile = window.innerWidth < 768;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();

    // Drastically reduced star count for maximum lightweight performance
    const starCount = isMobile ? 35 : 100;
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.008 + 0.002,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let lastFrame = 0;
    // Target ~15fps on mobile, ~24fps on desktop (saves massive battery)
    const frameInterval = isMobile ? 66 : 41;

    const animate = (timestamp) => {
      if (timestamp - lastFrame < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrame = timestamp;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      time += 1;

      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.phase);
        const opacity = star.opacity + twinkle * 0.2;
        if (opacity <= 0.03) continue;

        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, opacity))})`;
        ctx.fillRect(Math.round(star.x), Math.round(star.y), 1, 1);
      }

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    // Debounced resize
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 300);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
