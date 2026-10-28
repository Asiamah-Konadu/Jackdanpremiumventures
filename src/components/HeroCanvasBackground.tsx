import React, { useEffect, useRef } from 'react';

/**
 * High-performance ambient Canvas background for the Hero section.
 * Renders an interactive luxury particle plexus with golden stardust,
 * floating shipping corridor vectors, and cursor-reactive physics.
 */
export const HeroCanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates relative to hero canvas
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
      radius: 140
    };

    // Responsive particle count based on screen width
    const particleCount = width < 768 ? 40 : width < 1200 ? 70 : 100;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      pulseSpeed: number;
      pulseAngle: number;
    }

    const goldPalette = [
      '#facc15', // gold-400
      '#d4af37', // gold-500
      '#fef08a', // gold-200
      '#38bdf8', // sky-400 (corridor route accent)
      '#e2e8f0'  // silver accent
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = 0.15 + Math.random() * 0.45;
      const baseRadius = 1 + Math.random() * 2.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.35,
        radius: baseRadius,
        baseRadius,
        color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }

    // Floating logistics route streaks (curved light pulses)
    interface Streamer {
      startX: number;
      startY: number;
      cpX: number;
      cpY: number;
      endX: number;
      endY: number;
      progress: number;
      speed: number;
      color: string;
      length: number;
    }

    const streamers: Streamer[] = [];
    const streamerCount = 3;
    for (let i = 0; i < streamerCount; i++) {
      streamers.push({
        startX: Math.random() * width * 0.4,
        startY: Math.random() * height * 0.5,
        cpX: width * 0.5 + (Math.random() - 0.5) * 200,
        cpY: height * 0.3 + (Math.random() - 0.5) * 150,
        endX: width * 0.6 + Math.random() * width * 0.35,
        endY: height * 0.7 + Math.random() * height * 0.25,
        progress: Math.random(),
        speed: 0.0015 + Math.random() * 0.002,
        color: i % 2 === 0 ? 'rgba(212, 175, 55, 0.4)' : 'rgba(56, 189, 248, 0.35)',
        length: 0.15
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }
    window.addEventListener('resize', handleResize);

    // Quadratic bezier point evaluator
    const getBezierPoint = (p0: number, p1: number, p2: number, t: number) => {
      return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Animation Loop
    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        // Smooth mouse lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Render ambient logistics streaks
        streamers.forEach(s => {
          s.progress += s.speed;
          if (s.progress > 1) s.progress = 0;

          const headT = s.progress;
          const tailT = Math.max(0, s.progress - s.length);

          const headX = getBezierPoint(s.startX, s.cpX, s.endX, headT);
          const headY = getBezierPoint(s.startY, s.cpY, s.endY, headT);
          const tailX = getBezierPoint(s.startX, s.cpX, s.endX, tailT);
          const tailY = getBezierPoint(s.startY, s.cpY, s.endY, tailT);

          const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
          grad.addColorStop(0, 'rgba(212, 175, 55, 0)');
          grad.addColorStop(1, s.color);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Glowing photon head
          ctx.beginPath();
          ctx.arc(headX, headY, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.x += p.vx;
          p.y += p.vy;

          // Boundary bounce with soft wrap
          if (p.x < 0) p.x = width;
          else if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          else if (p.y > height) p.y = 0;

          // Mouse gravity / displacement
          if (mouse.isHovered) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const force = (1 - dist / mouse.radius) * 1.5;
              p.x -= (dx / dist) * force;
              p.y -= (dy / dist) * force;
            }
          }

          // Shimmering alpha pulse
          p.pulseAngle += p.pulseSpeed;
          p.alpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.15;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.05, Math.min(1, p.alpha));
          ctx.fill();

          // Connect nearby particles with luxury constellation lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;
            const maxDist = 95;

            if (distSq < maxDist * maxDist) {
              const dist = Math.sqrt(distSq);
              const lineAlpha = (1 - dist / maxDist) * 0.16;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = '#d4af37';
              ctx.globalAlpha = lineAlpha;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }

        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

