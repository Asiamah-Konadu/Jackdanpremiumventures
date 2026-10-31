import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Compass,
  ShieldCheck,
  Eye,
  MessageSquare,
  Globe2,
  Sparkles,
  Car,
  Wrench,
  CheckCircle2,
  Phone,
  MapPin
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface SpykerHeroStudioProps {
  onNavigatePage: (page: string) => void;
  onOpenFlyerModal: () => void;
}

/* ─── Ambient Canvas Background ─────────────────────────────── */
const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      color: string;
    }

    const COLORS = ['#d4af37', '#c29f4a', '#f0d070', '#ffffff', '#b8c4d0'];
    const particles: Particle[] = [];
    const COUNT = 90;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.55 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    resize();
    for (let i = 0; i < COUNT; i++) particles.push(spawn());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;
    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);

      // Gradient background glow
      const radial = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.7);
      radial.addColorStop(0, 'rgba(212,175,55,0.07)');
      radial.addColorStop(0.5, 'rgba(10,15,25,0.0)');
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, w, h);

      // Connect nearby particles with gold lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,175,55,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & move particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(t + p.x * 0.01));
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Scan line sweep
      const scanX = ((t * 60) % (w + 200)) - 100;
      const sweep = ctx.createLinearGradient(scanX - 60, 0, scanX + 60, 0);
      sweep.addColorStop(0, 'rgba(212,175,55,0)');
      sweep.addColorStop(0.5, 'rgba(212,175,55,0.04)');
      sweep.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = sweep;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

/* ─── Main Hero Component ────────────────────────────────────── */
export const SpykerHeroStudio: React.FC<SpykerHeroStudioProps> = ({
  onNavigatePage,
  onOpenFlyerModal
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [activeBadge, setActiveBadge] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);

  const BADGES = [
    { icon: Globe2, label: 'USA · Canada · UAE · Europe', sub: 'Global Sourcing Network' },
    { icon: ShieldCheck, label: 'Zero Demurrage Guarantee', sub: 'Registered GRA ICUMS Broker' },
    { icon: Car, label: 'Clean Title Certified', sub: '150-Point Pre-Ship Inspection' },
    { icon: Wrench, label: 'Genuine OEM Parts', sub: 'Wholesale & Retail Nationwide' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveBadge(b => (b + 1) % BADGES.length), 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      try { osc1Ref.current?.stop(); } catch {}
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const toggleAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.connect(ctx.destination);
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(44, ctx.currentTime);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, ctx.currentTime);
        osc1.connect(filter);
        filter.connect(gain);
        osc1.start();
        osc1Ref.current = osc1;
        setIsAudioActive(true);
      } catch {}
    } else {
      try { osc1Ref.current?.stop(); osc1Ref.current?.disconnect(); } catch {}
      audioCtxRef.current?.close().catch(() => {});
      setIsAudioActive(false);
    }
  };

  const ActiveBadgeIcon = BADGES[activeBadge].icon;

  return (
    <div
      id="hero"
      className="relative w-full bg-dark-950 border-b border-dark-800 overflow-hidden flex flex-col select-none pt-24 sm:pt-28 lg:pt-32"
    >
      {/* Ambient Canvas Background */}
      <HeroCanvas />

      {/* Top gradient fade from nav */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-dark-950 to-transparent pointer-events-none z-10" />

      {/* Main hero content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">

        {/* ── Brand identity + Audio strip ──────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gold-500/60 flex items-center justify-center text-gold-400 font-heading text-[10px] font-black shadow-[0_0_18px_rgba(212,175,55,0.3)] bg-dark-950/80">
              JKD
            </div>
            <div>
              <span className="text-[10px] sm:text-xs tracking-[0.26em] uppercase text-gold-400 font-bold block">
                "NULLA TENACI INVIA EST VIA"
              </span>
              <span className="text-[9px] tracking-[0.14em] uppercase text-dark-400 font-mono">
                Jackdan Premium Ventures · Est. Accra 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-full border text-[10px] tracking-[0.14em] uppercase font-bold flex items-center gap-2 transition-all ${
                isAudioActive
                  ? 'bg-gold-500/20 border-gold-500/70 text-gold-300 shadow-[0_0_16px_rgba(212,175,55,0.3)]'
                  : 'bg-dark-900/80 border-dark-700 text-dark-300 hover:text-white'
              }`}
            >
              {isAudioActive
                ? <Volume2 className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Engine: {isAudioActive ? 'Active' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenFlyerModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-900/80 border border-gold-500/40 text-gold-400 text-[10px] tracking-wider uppercase font-semibold hover:bg-gold-500/10 transition-colors"
            >
              <Eye className="w-3 h-3" />
              <span>Brand Flyer</span>
            </button>
          </div>
        </div>

        {/* ── Main two-column layout ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT: Copy + CTAs */}
          <div className="space-y-7 order-2 lg:order-1">

            {/* Animated rotating badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold backdrop-blur-sm transition-all duration-500">
              <ActiveBadgeIcon className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
              <span>{BADGES[activeBadge].label}</span>
              <span className="text-dark-400 hidden sm:inline">·</span>
              <span className="text-dark-400 hidden sm:inline text-[10px]">{BADGES[activeBadge].sub}</span>
            </div>

            {/* Main headline */}
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.02]">
                YOUR TRUSTED<br />
                <span className="gold-gradient-text">AUTO IMPORT</span><br />
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black">&amp; EXPORT PARTNER</span>
              </h1>
              <p className="mt-5 text-dark-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Premium luxury SUVs, executive sedans, and certified OEM spare parts — sourced from verified auctions in USA, Canada &amp; UAE, cleared through Port of Tema with{' '}
                <strong className="text-white">zero demurrage</strong>.
              </p>
            </div>

            {/* Key credentials pills */}
            <div className="flex flex-wrap gap-2.5 text-xs text-dark-300">
              {[
                { icon: CheckCircle2, text: 'Clean Title · CarFax Verified' },
                { icon: ShieldCheck, text: 'ICUMS Registered Broker' },
                { icon: MapPin, text: 'Abossey Okai · Tema Port' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 bg-dark-900/70 px-3 py-1.5 rounded-full border border-dark-800">
                  <Icon className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigatePage('inventory')}
                className="gold-gradient-btn px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Car className="w-4 h-4" />
                <span>Browse Fleet Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-700 hover:border-gold-500/40 text-white text-sm font-semibold transition-all"
              >
                <MessageSquare className="w-4 h-4 text-green-400" />
                <span>WhatsApp Concierge</span>
              </a>
              <a
                href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-700 text-gold-400 hover:text-white text-sm font-semibold transition-all"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call Direct</span>
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-dark-800/80">
              {[
                { val: '10+', label: 'Shipping Ports' },
                { val: '100%', label: 'Clean Titles' },
                { val: '0%', label: 'Demurrage Rate' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="font-heading text-2xl sm:text-3xl font-black text-gold-400">{val}</div>
                  <div className="text-[10px] text-dark-400 uppercase tracking-wider font-mono mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Flyer showcase */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            {/* Glow halo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[380px] h-[380px] rounded-full bg-gold-500/10 blur-[70px]" />
            </div>

            {/* Flyer card */}
            <div
              className="relative w-full max-w-[420px] cursor-pointer group"
              onClick={onOpenFlyerModal}
              title="Click to view full brand flyer"
            >
              {/* Decorative corner frame */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold-500/60 rounded-tl-md z-10 pointer-events-none" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold-500/60 rounded-tr-md z-10 pointer-events-none" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold-500/60 rounded-bl-md z-10 pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold-500/60 rounded-br-md z-10 pointer-events-none" />

              {/* Flyer image */}
              <div className="relative rounded-2xl overflow-hidden border border-gold-500/25 shadow-2xl shadow-black/70 bg-dark-900 aspect-[4/5]">
                <img
                  src="/assets/YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER_20260909_141036_0000.png"
                  alt="Jackdan Premium Ventures — Official Brand Flyer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                {/* Hover CTA overlay */}
                <div className="absolute inset-0 bg-dark-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-dark-950 font-bold text-sm shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Eye className="w-4 h-4" />
                    <span>View Full Flyer</span>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-3 flex items-center justify-between px-1">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 font-bold block">
                    Official Brand Flyer
                  </span>
                  <span className="text-xs text-dark-300">
                    Jackdan Auto Import &amp; Export Atelier
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-dark-400 font-mono">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>2026 EDITION</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom quick-nav instrument strip ─────────────────── */}
      <div className="relative z-20 border-t border-white/[0.06] bg-dark-950/85 backdrop-blur-md mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: 'Vehicle Inventory', page: 'inventory', icon: Car },
              { label: 'OEM Parts', page: 'parts', icon: Wrench },
              { label: 'Duty Calculator', page: 'calculator', icon: Compass },
              { label: 'Cargo Tracker', page: 'tracker', icon: Globe2 },
            ].map(({ label, page, icon: Icon }) => (
              <button
                key={page}
                type="button"
                onClick={() => onNavigatePage(page)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-900 hover:bg-dark-800 border border-dark-800 hover:border-gold-500/40 text-dark-300 hover:text-gold-300 text-[11px] font-semibold transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-gold-400" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-dark-500 font-mono uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-gold-500 animate-spin-slow" />
            <span className="hidden sm:inline">Scroll to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpykerHeroStudio;
