import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getHeroFrameImages, HERO_FRAME_COUNT } from './heroFrames';

const TOTAL_FRAMES = HERO_FRAME_COUNT;

/** A single WebGL texture follows the whole homepage's scroll position. */
export function HomepageFrameWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const page = canvas?.closest<HTMLElement>('.home-editorial');
    const scrollRoot = page?.closest<HTMLElement>('.home-site-shell') || page;
    if (!canvas || !page || !scrollRoot) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const texture = new THREE.Texture();
    texture.colorSpace = THREE.SRGBColorSpace;
    const uniforms = {
      uFrame: { value: texture },
      uViewport: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uImage: { value: new THREE.Vector2(16, 9) },
      uReady: { value: 0 },
      uCenter: { value: 0.5 },
      uLayout: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }',
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uFrame;
        uniform vec2 uViewport;
        uniform vec2 uImage;
        uniform float uReady;
        uniform float uCenter;
        uniform float uLayout;
        void main(){
          float screenAspect=uViewport.x/uViewport.y;
          float imageAspect=uImage.x/uImage.y;
          float splitWidth=mix(0.30,0.40,step(1100.0,uViewport.x));
          float regionWidth=mix(1.0,splitWidth,uLayout);
          float startX=clamp(uCenter-regionWidth*0.5,0.0,1.0);
          float endX=clamp(uCenter+regionWidth*0.5,0.0,1.0);
          vec2 regionUv=vUv;
          float inside=step(startX,vUv.x)*step(vUv.x,endX);
          regionUv.x=(vUv.x-startX)/max(0.001,endX-startX);
          inside*=smoothstep(0.0,0.035,regionUv.x)*(1.0-smoothstep(0.965,1.0,regionUv.x));
          float regionAspect=screenAspect*regionWidth;
          vec2 cover=regionAspect>imageAspect?vec2(1.0,imageAspect/regionAspect):vec2(regionAspect/imageAspect,1.0);
          vec2 uv=(regionUv-0.5)*cover+0.5;
          vec3 color=texture2D(uFrame,uv).rgb;
          gl_FragColor=vec4(color,uReady*inside*0.98);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    let alive = true;
    let raf = 0;
    let currentFrame = 0;
    let desiredFrame = 0;
    let currentCenter = 0.5;
    let desiredCenter = 0.5;
    let currentLayout = 0;
    let desiredLayout = 0;
    let uploadedFrame = -1;
    let previousTime = 0;
    const images = getHeroFrameImages();
    const sections = Array.from(page.querySelectorAll<HTMLElement>(':scope > section'));
    const hero = page.querySelector<HTMLElement>('#hero');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let sceneSide = -2;
    const updateProgress = () => {
      const rect = scrollRoot.getBoundingClientRect();
      const range = Math.max(1, scrollRoot.scrollHeight - window.innerHeight);
      desiredFrame = reducedMotion.matches ? 0 : THREE.MathUtils.clamp(-rect.top / range, 0, 1) * (TOTAL_FRAMES - 1);

      const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--home-nav-height')) || 80;
      const center = navHeight + (window.innerHeight - navHeight) * 0.5;
      const heroRect = hero?.getBoundingClientRect();
      let nextSide = -1;
      let contentSide: 'left' | 'right' | null = null;
      if (!(heroRect && heroRect.top <= center && heroRect.bottom >= center)) {
        let nearestIndex = 0;
        let nearestDistance = Infinity;
        sections.forEach((section, index) => {
          const sectionRect = section.getBoundingClientRect();
          const sectionCenter = (sectionRect.top + sectionRect.bottom) / 2;
          const distance = Math.abs(sectionCenter - center);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });
        const activeSection = sections[nearestIndex];
        contentSide = activeSection?.firstElementChild?.classList.contains('home-split--right') || activeSection?.firstElementChild?.classList.contains('home-proof--right') ? 'right' : 'left';
        nextSide = reducedMotion.matches || window.innerWidth < 761 ? -1 : contentSide === 'left' ? 1 : 0;
      }
      if (sceneSide !== nextSide) {
        sceneSide = nextSide;
        desiredLayout = nextSide < 0 ? 0 : 1;
        const wideScreen = window.innerWidth >= 1100;
        desiredCenter = nextSide === 0 ? (wideScreen ? 0.20 : 0.15) : nextSide === 1 ? (wideScreen ? 0.80 : 0.85) : 0.5;
        page.classList.toggle('scene-content-left', contentSide === 'left');
        page.classList.toggle('scene-content-right', contentSide === 'right');
      }
      scheduleDraw();
    };
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uViewport.value.set(window.innerWidth, window.innerHeight);
      updateProgress();
    };

    const draw = (time: number) => {
      raf = 0;
      if (!alive) return;
      const delta = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      const frameEase = 1 - Math.exp(-delta / 95);
      const layoutEase = 1 - Math.exp(-delta / 260);
      currentFrame += (desiredFrame - currentFrame) * frameEase;
      currentCenter += (desiredCenter - currentCenter) * layoutEase;
      currentLayout += (desiredLayout - currentLayout) * layoutEase;
      const frameMoving = Math.abs(desiredFrame - currentFrame) >= 0.035;
      const layoutMoving = Math.abs(desiredCenter - currentCenter) >= 0.0005 || Math.abs(desiredLayout - currentLayout) >= 0.0005;
      if (!frameMoving) currentFrame = desiredFrame;
      if (!layoutMoving) {
        currentCenter = desiredCenter;
        currentLayout = desiredLayout;
      }
      uniforms.uCenter.value = currentCenter;
      uniforms.uLayout.value = currentLayout;
      const frameIndex = Math.round(currentFrame);
      const image = images[frameIndex];
      if (image?.complete && image.naturalWidth && frameIndex !== uploadedFrame) {
        texture.image = image;
        texture.needsUpdate = true;
        uniforms.uImage.value.set(image.naturalWidth, image.naturalHeight);
        uniforms.uReady.value = 1;
        uploadedFrame = frameIndex;
      }
      renderer.render(scene, camera);
      if (frameMoving || layoutMoving) scheduleDraw();
    };
    const scheduleDraw = () => {
      if (alive && !raf) raf = requestAnimationFrame(draw);
    };
    const onFrameSettled = () => scheduleDraw();
    images.forEach(image => {
      image.addEventListener('load', onFrameSettled);
      image.addEventListener('error', onFrameSettled);
    });

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', resize);
    reducedMotion.addEventListener('change', updateProgress);
    updateProgress();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', resize);
      reducedMotion.removeEventListener('change', updateProgress);
      images.forEach(image => {
        image.removeEventListener('load', onFrameSettled);
        image.removeEventListener('error', onFrameSettled);
      });
      texture.dispose();
      geometry.dispose();
      material.dispose();
      scene.clear();
      renderer.dispose();
      page.classList.remove('scene-content-left', 'scene-content-right');
    };
  }, []);

  return <canvas ref={canvasRef} className="homepage-webgl" aria-hidden="true" />;
}


