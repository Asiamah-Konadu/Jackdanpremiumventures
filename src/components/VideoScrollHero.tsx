import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Phone,
  Globe2,
  ShieldCheck,
  Car,
  Wrench,
  CheckCircle2,
  MapPin,
  Volume2,
  VolumeX,
  Eye,
  Sparkles,
  Compass,
  ChevronDown,
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface VideoScrollHeroProps {
  onNavigatePage: (page: string) => void;
  onOpenFlyerModal: () => void;
}

/* ─── Constants ───────────────────────────────────────────────── */
const TOTAL_FRAMES = 205;
const FRAME_BASE = '/hero-frames/ezgif-frame-';
const SCROLL_MULTIPLIER = 5; // px of scroll per frame — controls speed

const pad3 = (n: number) => String(n).padStart(3, '0');
const frameUrl = (n: number) => `${FRAME_BASE}${pad3(n)}.jpg`;

/* ─── Preloader hook ──────────────────────────────────────────── */
function useFramePreloader(total: number) {
  const images = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;

    const onLoad = () => {
      loaded++;
      setLoadedCount(loaded);
      if (loaded >= total) setReady(true);
    };

    for (let i = 1; i <= total; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = onLoad;
      img.onerror = onLoad; // count errors too so we don't stall
      imgs.push(img);
    }

    images.current = imgs;

    return () => {
      // cancel pending loads
      imgs.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [total]);

  return { images: images.current, loadedCount, ready };
}

/* ─── Main Component ──────────────────────────────────────────── */
export const VideoScrollHero: React.FC<VideoScrollHeroProps> = ({
  onNavigatePage,
  onOpenFlyerModal,
}) => {
  /* Refs */
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  /* State */
  const [activeBadge, setActiveBadge] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 → 1
  const [contentVisible, setContentVisible] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  /* Preload frames */
  const { images, loadedCount, ready } = useFramePreloader(TOTAL_FRAMES);
  const loadPct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  /* ── Badge rotation ── */
  const BADGES = [
    { icon: Globe2, label: 'USA · Canada · UAE · Europe', sub: 'Global Sourcing Network' },
    { icon: ShieldCheck, label: 'Zero Demurrage Guarantee', sub: 'Registered GRA ICUMS Broker' },
    { icon: Car, label: 'Clean Title Certified', sub: '150-Point Pre-Ship Inspection' },
    { icon: Wrench, label: 'Genuine OEM Parts', sub: 'Wholesale & Retail Nationwide' },
  ];
  useEffect(() => {
    const t = setInterval(() => setActiveBadge(b => (b + 1) % BADGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  /* ── Draw single frame to canvas ── */
  const drawFrame = useCallback(
    (idx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = images[idx];
      if (!img?.complete || img.naturalWidth === 0) return;

      // Maintain canvas device pixel ratio for crisp rendering
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover fit
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.drawImage(img, dx, dy, dw, dh);
    },
    [images]
  );

  /* ── Main scroll-driven RAF loop ── */
  useEffect(() => {
    if (!ready) return;

    let lastDraw = -1;

    const loop = () => {
      // Lerp current toward target for buttery smoothness
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.12; // interpolation speed

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      if (frameIdx !== lastDraw) {
        drawFrame(frameIdx);
        lastDraw = frameIdx;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, drawFrame]);

  /* ── Scroll handler ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollHeight = container.offsetHeight - window.innerHeight;
      const rawScrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, rawScrolled / scrollHeight));

      setScrollProgress(progress);
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);

      // Hide copy overlay when deep into the scroll
      setContentVisible(progress < 0.35);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Resize: redraw current frame ── */
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      drawFrame(Math.round(currentFrameRef.current));
    });
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [drawFrame]);

  /* ── Draw frame 0 immediately once ready ── */
  useEffect(() => {
    if (ready) drawFrame(0);
  }, [ready, drawFrame]);

  /* ── Audio engine ── */
  useEffect(() => {
    return () => {
      try { oscRef.current?.stop(); } catch { /* noop */ }
      audioCtxRef.current?.close().catch(() => { /* noop */ });
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
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(44, ctx.currentTime);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, ctx.currentTime);
        osc.connect(filter);
        filter.connect(gain);
        osc.start();
        oscRef.current = osc;
        setIsAudioActive(true);
      } catch { /* noop */ }
    } else {
      try { oscRef.current?.stop(); oscRef.current?.disconnect(); } catch { /* noop */ }
      audioCtxRef.current?.close().catch(() => { /* noop */ });
      setIsAudioActive(false);
    }
  };

  const ActiveBadgeIcon = BADGES[activeBadge].icon;

  /* ── Scroll height: each frame gets SCROLL_MULTIPLIER px of scroll ── */
  const scrollHeight = TOTAL_FRAMES * SCROLL_MULTIPLIER;

  return (
    /* Outer scroll container — gives us the scroll distance */
    <div
      ref={containerRef}
      id="hero"
      style={{ height: `calc(${scrollHeight}px + 100vh)` }}
      className="relative"
    >
      {/* ── Sticky viewport ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden select-none"
        style={{ height: '100svh', minHeight: 620 }}
      >
        {/* ══ CANVAS — video playback layer ══════════════════════ */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />

        {/* ── Film-grain overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
            opacity: 0.35,
            mixBlendMode: 'overlay',
          }}
        />

        {/* ── Dark vignette / colour grade ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(8,12,20,0.72) 0%, transparent 65%), ' +
              'linear-gradient(to top, rgba(8,12,20,0.88) 0%, rgba(8,12,20,0.2) 35%, rgba(8,12,20,0.35) 100%)',
          }}
        />

        {/* ── Top nav fade ── */}
        <div
          className="absolute top-0 inset-x-0 h-28 pointer-events-none"
          style={{ zIndex: 3, background: 'linear-gradient(to bottom, rgba(8,12,20,0.9), transparent)' }}
        />

        {/* ══ Loading screen — shown until enough frames are ready ══ */}
        {!ready && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-dark-950"
            style={{ zIndex: 50 }}
          >
            <div className="flex flex-col items-center gap-5">
              <div
                className="w-14 h-14 rounded-full border border-gold-500/60 flex items-center justify-center text-gold-400 font-heading text-xs font-black shadow-[0_0_30px_rgba(212,175,55,0.4)] bg-dark-950"
              >
                JKD
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-mono font-bold">
                Loading Experience
              </div>
              <div className="w-48 h-[2px] bg-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-300"
                  style={{ width: `${loadPct}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-dark-400">{loadPct}%</div>
            </div>
          </div>
        )}

        {/* ══ HUD — Brand identity strip ════════════════════════ */}
        <div
          className="absolute left-0 right-0 flex items-center justify-between px-4 sm:px-8 lg:px-12"
          style={{ zIndex: 20, top: '6.5rem' }}
        >
          {/* Brand mark */}
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

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-full border text-[10px] tracking-[0.14em] uppercase font-bold flex items-center gap-2 transition-all ${
                isAudioActive
                  ? 'bg-gold-500/20 border-gold-500/70 text-gold-300 shadow-[0_0_16px_rgba(212,175,55,0.3)]'
                  : 'bg-dark-900/60 border-dark-700 text-dark-300 hover:text-white backdrop-blur-sm'
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
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-900/60 border border-gold-500/40 text-gold-400 text-[10px] tracking-wider uppercase font-semibold hover:bg-gold-500/10 transition-colors backdrop-blur-sm"
            >
              <Eye className="w-3 h-3" />
              <span>Brand Flyer</span>
            </button>
          </div>
        </div>

        {/* ══ HERO COPY — fades out as you scroll ════════════════ */}
        <div
          className="absolute inset-x-0 bottom-0 px-4 sm:px-8 lg:px-12 pb-20 sm:pb-24 transition-all duration-500"
          style={{
            zIndex: 10,
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(40px)',
            pointerEvents: contentVisible ? 'auto' : 'none',
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">

              {/* LEFT: Copy */}
              <div className="space-y-6">
                {/* Rotating badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-950/70 border border-gold-500/30 text-gold-300 text-xs font-semibold backdrop-blur-sm transition-all duration-500">
                  <ActiveBadgeIcon className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                  <span>{BADGES[activeBadge].label}</span>
                  <span className="text-dark-400 hidden sm:inline">·</span>
                  <span className="text-dark-400 hidden sm:inline text-[10px]">{BADGES[activeBadge].sub}</span>
                </div>

                {/* Headline */}
                <div>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.01]"
                    style={{ textShadow: '0 2px 32px rgba(8,12,20,0.9), 0 1px 8px rgba(8,12,20,0.9)' }}
                  >
                    YOUR TRUSTED<br />
                    <span className="gold-gradient-text">AUTO IMPORT</span><br />
                    <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black">& EXPORT PARTNER</span>
                  </h1>
                  <p
                    className="mt-4 text-dark-200 text-sm sm:text-base leading-relaxed max-w-lg"
                    style={{ textShadow: '0 1px 12px rgba(8,12,20,0.95)' }}
                  >
                    Premium luxury SUVs, executive sedans, and certified OEM spare parts — sourced from verified auctions in USA, Canada & UAE, cleared through Port of Tema with{' '}
                    <strong className="text-white">zero demurrage</strong>.
                  </p>
                </div>

                {/* Credential pills */}
                <div className="flex flex-wrap gap-2 text-xs text-dark-300">
                  {[
                    { icon: CheckCircle2, text: 'Clean Title · CarFax Verified' },
                    { icon: ShieldCheck, text: 'ICUMS Registered Broker' },
                    { icon: MapPin, text: 'Abossey Okai · Tema Port' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 bg-dark-900/70 px-3 py-1.5 rounded-full border border-dark-700 backdrop-blur-sm">
                      <Icon className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
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
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-900/80 hover:bg-dark-800 border border-dark-700 hover:border-gold-500/40 text-white text-sm font-semibold transition-all backdrop-blur-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-green-400" />
                    <span>WhatsApp Concierge</span>
                  </a>
                  <a
                    href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-dark-900/80 hover:bg-dark-800 border border-dark-700 text-gold-400 hover:text-white text-sm font-semibold transition-all backdrop-blur-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">Call Direct</span>
                  </a>
                </div>
              </div>

              {/* RIGHT: Stats + year tag */}
              <div className="hidden lg:flex flex-col items-end gap-6">
                {/* Stat cards */}
                <div className="flex gap-3">
                  {[
                    { val: '10+', label: 'Shipping Ports' },
                    { val: '100%', label: 'Clean Titles' },
                    { val: '0%', label: 'Demurrage Rate' },
                  ].map(({ val, label }) => (
                    <div
                      key={label}
                      className="text-center px-5 py-4 rounded-2xl bg-dark-950/75 border border-dark-700/80 backdrop-blur-md shadow-xl"
                    >
                      <div className="font-heading text-2xl font-black text-gold-400">{val}</div>
                      <div className="text-[10px] text-dark-400 uppercase tracking-wider font-mono mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Year / edition tag */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-950/70 border border-gold-500/20 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-dark-300">2026 Edition</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SCROLL INDICATOR ════════════════════════════════════ */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500"
          style={{
            zIndex: 15,
            bottom: '5.5rem',
            opacity: contentVisible && scrollProgress < 0.05 ? 1 : 0,
          }}
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-dark-400">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 text-gold-500 animate-bounce" />
        </div>

        {/* ══ SCROLL PROGRESS BAR (top edge) ════════════════════ */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-transparent"
          style={{ zIndex: 30 }}
        >
          <div
            className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 transition-none"
            style={{ width: `${scrollProgress * 100}%`, transformOrigin: 'left' }}
          />
        </div>

        {/* ══ FRAME COUNTER (cinematic HUD) ══════════════════════ */}
        <div
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
          style={{ zIndex: 15 }}
        >
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
              className="group flex items-center gap-2 text-[10px] font-mono text-dark-500 hover:text-gold-400 transition-all"
              title={label}
            >
              <span className="hidden xl:inline tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-dark-600 group-hover:bg-gold-400 group-hover:shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all" />
            </button>
          ))}
        </div>

        {/* ══ BOTTOM QUICK-NAV STRIP ════════════════════════════ */}
        <div
          className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] bg-dark-950/80 backdrop-blur-md"
          style={{ zIndex: 20 }}
        >
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

            {/* Frame / progress readout */}
            <div className="flex items-center gap-3 text-[10px] font-mono text-dark-500 uppercase tracking-widest">
              <span>{String(Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1).padStart(3, '0')}</span>
              <span className="w-20 h-px bg-dark-700 relative">
                <span
                  className="absolute inset-y-0 left-0 bg-gold-500 transition-all duration-100"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </span>
              <span>{TOTAL_FRAMES}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoScrollHero;

