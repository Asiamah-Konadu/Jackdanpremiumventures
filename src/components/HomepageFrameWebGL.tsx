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
    if (!canvas || !page) return;

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
          float regionWidth=mix(1.0,0.52,uLayout);
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
          float vignette=1.0-smoothstep(0.18,0.9,distance(regionUv,vec2(0.5)));
          color*=mix(0.84,1.0,vignette);
          gl_FragColor=vec4(color,uReady*inside*0.94);
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
    const images = getHeroFrameImages();
    const sections = Array.from(page.querySelectorAll<HTMLElement>(':scope > section'));
    const hero = page.querySelector<HTMLElement>('#hero');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let sceneSide = -2;
    const updateProgress = () => {
      const rect = page.getBoundingClientRect();
      const range = Math.max(1, page.scrollHeight - window.innerHeight);
      desiredFrame = reducedMotion.matches ? 0 : THREE.MathUtils.clamp(-rect.top / range, 0, 1) * (TOTAL_FRAMES - 1);

      const center = window.innerHeight * 0.52;
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
        contentSide = activeSection?.firstElementChild?.classList.contains('home-split--right') ? 'right' : 'left';
        nextSide = reducedMotion.matches || window.innerWidth < 761 ? -1 : contentSide === 'left' ? 1 : 0;
      }
      if (sceneSide !== nextSide) {
        sceneSide = nextSide;
        desiredLayout = nextSide < 0 ? 0 : 1;
        desiredCenter = nextSide === 0 ? 0.26 : nextSide === 1 ? 0.74 : 0.5;
        page.classList.toggle('scene-content-left', contentSide === 'left');
        page.classList.toggle('scene-content-right', contentSide === 'right');
      }
    };
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uViewport.value.set(window.innerWidth, window.innerHeight);
      updateProgress();
    };

    const draw = () => {
      if (!alive) return;
      currentFrame += (desiredFrame - currentFrame) * 0.12;
      currentCenter += (desiredCenter - currentCenter) * 0.075;
      currentLayout += (desiredLayout - currentLayout) * 0.075;
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
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', resize);
    reducedMotion.addEventListener('change', updateProgress);
    updateProgress();
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', resize);
      reducedMotion.removeEventListener('change', updateProgress);
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
