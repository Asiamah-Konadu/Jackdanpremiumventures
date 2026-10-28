import React, { useEffect, useRef } from 'react';

/**
 * Ambient Canvas background for Twumaasco Logistics & Trading.
 * Features maritime sonar radar sweeps, ocean wave frequency harmonics,
 * and floating multimodal freight nodes in oceanic cyan & deep cobalt blue.
 */
export const TwumaascoCanvasBackground: React.FC = () => {
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
      radius: 150
    };

    const nodeCount = width < 768 ? 35 : width < 1200 ? 60 : 85;

    interface LogisticsNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      isHarbor: boolean;
      pulse: number;
    }

    const bluePalette = [
      '#38bdf8', // sky-400
      '#60a5fa', // blue-400
      '#2563eb', // blue-600
      '#0284c7', // light sea blue
      '#facc15'  // gold beacon
    ];

    const nodes: LogisticsNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const isHarbor = i % 12 === 0;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        radius: isHarbor ? 3 : 1.2 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.4,
        baseAlpha: 0.2 + Math.random() * 0.4,
        color: isHarbor ? '#facc15' : bluePalette[Math.floor(Math.random() * bluePalette.length)],
        isHarbor,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Sonar radar sweep angle & ocean waves
    let sonarAngle = 0;
    let waveOffset = 0;

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

        // 1. Maritime Depth Sine Waves across lower half
        waveOffset += 0.015;
        const waveY = height * 0.75;
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x < width; x += 15) {
          const y = waveY + Math.sin(x * 0.005 + waveOffset) * 14 + Math.cos(x * 0.008 + waveOffset * 0.8) * 8;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Secondary subtle wave
        ctx.beginPath();
        ctx.moveTo(0, waveY + 25);
        for (let x = 0; x < width; x += 15) {
          const y = waveY + 25 + Math.sin(x * 0.006 - waveOffset * 0.9) * 12;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 2. Sonar Radar Sweep from right side (Tema Port harbor position)
        sonarAngle += 0.012;
        const sonarCenterX = width * 0.8;
        const sonarCenterY = height * 0.45;
        const sonarRadius = Math.min(width, height) * 0.42;

        // Draw faint sonar rings
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath();
          ctx.arc(sonarCenterX, sonarCenterY, (sonarRadius / 3) * r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Sonar sweep beam
        const sweepGrad = ctx.createRadialGradient(
          sonarCenterX, sonarCenterY, 0,
          sonarCenterX, sonarCenterY, sonarRadius
        );
        sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
        sweepGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.beginPath();
        ctx.moveTo(sonarCenterX, sonarCenterY);
        ctx.arc(sonarCenterX, sonarCenterY, sonarRadius, sonarAngle, sonarAngle + 0.35);
        ctx.closePath();
        ctx.fillStyle = sweepGrad;
        ctx.fill();

        // 3. Draw Nodes & Multimodal Shipping Lanes
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];

          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0) n.x = width;
          else if (n.x > width) n.x = 0;
          if (n.y < 0) n.y = height;
          else if (n.y > height) n.y = 0;

          // Mouse push
          if (mouse.isHovered) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const force = (1 - dist / mouse.radius) * 1.6;
              n.x -= (dx / dist) * force;
              n.y -= (dy / dist) * force;
            }
          }

          n.pulse += 0.03;
          const currentAlpha = n.baseAlpha + Math.sin(n.pulse) * 0.15;

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
          ctx.fill();

          // Harbor beacon halo
          if (n.isHarbor) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius + 4 + Math.sin(n.pulse) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#facc15';
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Connect nearby freight nodes with blue shipping corridors
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n.x - n2.x;
            const dy = n.y - n2.y;
            const distSq = dx * dx + dy * dy;
            const maxDist = 110;

            if (distSq < maxDist * maxDist) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = n.isHarbor || n2.isHarbor ? '#facc15' : '#38bdf8';
              ctx.globalAlpha = (1 - dist / maxDist) * 0.18;
              ctx.lineWidth = 0.7;
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

