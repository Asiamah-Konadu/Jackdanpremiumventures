import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';
import { getHeroFrameImages, HERO_FRAME_COUNT } from './heroFrames';

interface VideoScrollHeroProps {
  onNavigatePage: (page: string) => void;
  onOpenFlyerModal: () => void;
}

export function VideoScrollHero({ onNavigatePage, onOpenFlyerModal }: VideoScrollHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const targetRef = useRef(0);
  const progressBarRef = useRef<HTMLElement>(null);
  const loadingBarRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const images = getHeroFrameImages();
  const phone = CONTACT_INFO.primaryPhoneFormatted.replace('+', '');

  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const image = images[index];
    if (!canvas || !image?.complete || !image.naturalWidth) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    return true;
  }, [images]);

  useEffect(() => {
    let count = 0;
    const settled = new WeakSet<HTMLImageElement>();
    let hasUsableFrame = false;
    const onSettled = (image: HTMLImageElement, index: number) => {
      if (settled.has(image)) return;
      settled.add(image);
      count += 1;
      if (loadingBarRef.current) loadingBarRef.current.style.width = `${Math.round((count / HERO_FRAME_COUNT) * 100)}%`;
      if (image.naturalWidth) {
        if (!hasUsableFrame) {
          hasUsableFrame = true;
          setReady(true);
        }
        if (Math.round(frameRef.current) === index) draw(index);
      }
    };
    const handlers = images.map((image, index) => {
      const handler = () => onSettled(image, index);
      image.addEventListener('load', handler);
      image.addEventListener('error', handler);
      if (image.complete) handler();
      return handler;
    });
    return () => images.forEach((image, index) => {
      image.removeEventListener('load', handlers[index]);
      image.removeEventListener('error', handlers[index]);
    });
  }, [draw, images]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        draw(Math.round(frameRef.current));
      }
    };
    const observer = new ResizeObserver(resize);
    if (canvasRef.current) observer.observe(canvasRef.current);
    resize();
    return () => observer.disconnect();
  }, [draw]);

  useEffect(() => {
    const hero = canvasRef.current?.closest<HTMLElement>('.motion-hero');
    if (!hero) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let lastFrame = -1;
    let previousTime = 0;
    let visible = true;

    const schedule = () => {
      if (visible && !raf) raf = requestAnimationFrame(loop);
    };
    const updateScroll = () => {
      const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--home-nav-height')) || 80;
      const heroRect = hero.getBoundingClientRect();
      const next = Math.max(0, Math.min(1, (navHeight - heroRect.top) / Math.max(1, heroRect.height)));
      targetRef.current = reduce.matches ? 0 : next * (HERO_FRAME_COUNT - 1);
      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${next})`;
      schedule();
    };
    const loop = (time: number) => {
      raf = 0;
      if (!visible) return;
      const delta = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      const easing = 1 - Math.exp(-delta / 95);
      frameRef.current += (targetRef.current - frameRef.current) * easing;
      if (Math.abs(targetRef.current - frameRef.current) < 0.04) frameRef.current = targetRef.current;
      const index = Math.max(0, Math.min(HERO_FRAME_COUNT - 1, Math.round(frameRef.current)));
      if (index !== lastFrame) {
        const painted = draw(index);
        if (!painted) {
          lastFrame = index;
          if (Math.abs(targetRef.current - frameRef.current) >= 0.04) schedule();
          return;
        }
        lastFrame = index;
      }
      if (Math.abs(targetRef.current - frameRef.current) >= 0.04) schedule();
    };
    const visibility = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible) {
        previousTime = 0;
        schedule();
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }, { threshold: 0 });
    visibility.observe(hero);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    reduce.addEventListener('change', updateScroll);
    updateScroll();
    return () => {
      visibility.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      reduce.removeEventListener('change', updateScroll);
    };
  }, [draw]);

  useEffect(() => {
    if (ready) draw(Math.round(frameRef.current));
  }, [ready, draw]);

  return (
    <section className="motion-hero" id="hero" aria-label="Jackdan Auto Import and Export">
      <canvas ref={canvasRef} className="motion-hero__canvas" aria-label="Scroll-driven vehicle film" />
      <div className="motion-hero__loading" aria-hidden="true" style={{ opacity: ready ? 0 : 1 }}>
        <span>Preparing the drive</span><i><b ref={loadingBarRef} style={{ width: '0%' }} /></i>
      </div>
      <div className="motion-hero__topline"><span className="motion-hero__brand"><b>J</b> JACKDAN <small>AUTO · IMPORT · EXPORT</small></span><button onClick={onOpenFlyerModal} type="button">Our company <ArrowUpRight size={15} /></button></div>
      <div className="motion-hero__copy">
        <span className="motion-hero__eyebrow"><i /> A better way to bring it home</span>
        <h1>Good cars.<br /><em>Clear journeys.</em></h1>
        <p>Thoughtfully sourced vehicles, genuine parts and trusted delivery from the world to Ghana.</p>
        <div className="motion-hero__actions"><button type="button" onClick={() => onNavigatePage('inventory')}>Explore the collection <ArrowRight size={16} /></button><a href={`https://wa.me/${phone}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`} target="_blank" rel="noopener noreferrer">Talk to our team <ArrowUpRight size={15} /></a></div>
        <div className="motion-hero__trust"><span><ShieldCheck size={15} /> Registered customs broker</span><span><MapPin size={15} /> Accra · Tema Port</span></div>
      </div>
      <div className="motion-hero__caption"><span>JACKDAN / 001—180</span><span>GHANA, WITH YOU IN MIND</span></div>
      <div className="motion-hero__scroll"><span>Scroll to move through the frames</span><ArrowDown size={14} /></div>
      <div className="motion-hero__progress"><i ref={progressBarRef} /></div>
    </section>
  );
}

export default VideoScrollHero;
