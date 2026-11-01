import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TOTAL_FRAMES = 180;
const frameUrl = (index: number) => `/hero-frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

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
        void main(){
          float screenAspect=uViewport.x/uViewport.y;
          float imageAspect=uImage.x/uImage.y;
          vec2 cover=screenAspect>imageAspect?vec2(1.0,imageAspect/screenAspect):vec2(screenAspect/imageAspect,1.0);
          vec2 uv=(vUv-0.5)*cover+0.5;
          vec3 color=texture2D(uFrame,uv).rgb;
          float vignette=1.0-smoothstep(0.18,0.9,distance(vUv,vec2(0.5)));
          color*=mix(0.38,0.55,vignette);
          gl_FragColor=vec4(color,uReady*0.62);
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
    let uploadedFrame = -1;
    const images: HTMLImageElement[] = [];
    const updateProgress = () => {
      const rect = page.getBoundingClientRect();
      const range = Math.max(1, page.scrollHeight - window.innerHeight);
      desiredFrame = THREE.MathUtils.clamp(-rect.top / range, 0, 1) * (TOTAL_FRAMES - 1);
    };
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uViewport.value.set(window.innerWidth, window.innerHeight);
      updateProgress();
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const image = new Image();
      image.decoding = 'async';
      image.src = frameUrl(i + 1);
      images.push(image);
    }

    const draw = () => {
      if (!alive) return;
      currentFrame += (desiredFrame - currentFrame) * 0.12;
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
    updateProgress();
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', resize);
      images.forEach(image => { image.src = ''; });
      texture.dispose();
      geometry.dispose();
      material.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="homepage-webgl" aria-hidden="true" />;
}
