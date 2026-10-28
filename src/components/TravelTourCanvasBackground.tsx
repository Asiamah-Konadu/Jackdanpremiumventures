import React, { useEffect, useRef } from 'react';

/**
 * Ambient Canvas background for Jackdan Travel & Tour.
 * Features emerald stardust, worldwide flight trajectories,
 * and compass navigation rings in emerald green, teal, and gold.
 */
export const TravelTourCanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
      radius: 140
    };

    const particleCount = width < 768 ? 35 : width < 1200 ? 65 : 90;

    interface TravelParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      pulseAngle: number;
      pulseSpeed: number;
      isWaypoint: boolean;
    }

    const travelColors = [
      '#10b981', // emerald-500
      '#34d399', // emerald-400
      '#14b8a6', // teal-500
      '#2dd4bf', // teal-400
      '#facc15'  // gold beacon
    ];

    const particles: TravelParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const isWaypoint = i % 10 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.35,
        radius: isWaypoint ? 3 : 1 + Math.random() * 1.8,
        color: isWaypoint ? '#facc15' : travelColors[Math.floor(Math.random() * travelColors.length)],
        alpha: 0.2 + Math.random() * 0.4,
        baseAlpha: 0.2 + Math.random() * 0.4,
        pulseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        isWaypoint
      });
    }

    // Flight Path Streamers radiating toward/from airport hub
    interface FlightStreamer {
      startX: number;
      startY: number;
      cpX: number;
      cpY: number;
      endX: number;
      endY: number;
      progress: number;
      speed: number;
    }

    const streamers: FlightStreamer[] = [];
    for (let i = 0; i < 4; i++) {
      streamers.push({
        startX: Math.random() * width * 0.3,
        startY: Math.random() * height * 0.4,
        cpX: width * 0.5 + (Math.random() - 0.5) * 180,
        cpY: height * 0.2 + (Math.random() - 0.5) * 120,
        endX: width * 0.65 + Math.random() * width * 0.3,
        endY: height * 0.65 + Math.random() * height * 0.3,
        progress: Math.random(),
        speed: 0.0016 + Math.random() * 0.002
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

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // 1. Draw Flight Arcs
        streamers.forEach(s => {
          s.progress += s.speed;
          if (s.progress > 1) s.progress = 0;

          const headT = s.progress;
          const tailT = Math.max(0, s.progress - 0.16);

          const hx = getBezierPoint(s.startX, s.cpX, s.endX, headT);
          const hy = getBezierPoint(s.startY, s.cpY, s.endY, headT);
          const tx = getBezierPoint(s.startX, s.cpX, s.endX, tailT);
          const ty = getBezierPoint(s.startY, s.cpY, s.endY, tailT);

          const grad = ctx.createLinearGradient(tx, ty, hx, hy);
          grad.addColorStop(0, 'rgba(16, 185, 129, 0)');
          grad.addColorStop(1, 'rgba(52, 211, 153, 0.45)');

          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(hx, hy);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Aircraft light packet
          ctx.beginPath();
          ctx.arc(hx, hy, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 2. Draw Travel Particles & Waypoints
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          else if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          else if (p.y > height) p.y = 0;

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

          p.pulseAngle += p.pulseSpeed;
          p.alpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.15;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
          ctx.fill();

          if (p.isWaypoint) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius + 3.5, 0, Math.PI * 2);
            ctx.strokeStyle = '#facc15';
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Flight route connections
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;
            const maxDist = 95;

            if (distSq < maxDist * maxDist) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = '#10b981';
              ctx.globalAlpha = (1 - dist / maxDist) * 0.18;
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

