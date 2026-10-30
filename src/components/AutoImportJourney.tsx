import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDown, ArrowRight, Car, Container, Globe2, Wrench } from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface Props { onNavigatePage: (page: string) => void }

const parts = [
  { name: 'Premium alloy wheels', image: '/assets/spare-parts/alloy_wheels.jpg', note: 'WHEELS & TYRES' },
  { name: 'Performance brake rotors', image: '/assets/spare-parts/brakes_rotors.jpg', note: 'BRAKING SYSTEM' },
  { name: 'Japanese engine assemblies', image: '/assets/spare-parts/engine_japanese.jpg', note: 'ENGINE & DRIVETRAIN' },
];

export const AutoImportJourney: React.FC<Props> = ({ onNavigatePage }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const mount = mountRef.current;
    if (!section || !mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(5.8, 3.5, 8.7);
    camera.lookAt(0, 1, 0);
    scene.add(new THREE.HemisphereLight(0xd4e5ff, 0x151923, 2.2));
    const key = new THREE.DirectionalLight(0xffe3b2, 3.6); key.position.set(4, 7, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x5d95d7, 2.3); rim.position.set(-4, 4, -5); scene.add(rim);

    const container = new THREE.Group(); scene.add(container);
    const steel = new THREE.MeshStandardMaterial({ color: 0x344e68, metalness: .62, roughness: .39, side: THREE.DoubleSide });
    const trim = new THREE.MeshStandardMaterial({ color: 0x95a7b8, metalness: .75, roughness: .3 });
    const panel = (size: [number, number, number], position: [number, number, number], material = steel) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position); mesh.castShadow = true; mesh.receiveShadow = true; container.add(mesh); return mesh;
    };
    // Open-front container: its depth, roof, corrugations and floor read as a loading bay.
    panel([5.25, .1, 2.6], [0, 2.78, 0]);
    panel([.11, 2.8, 2.6], [-2.57, 1.38, 0]);
    panel([.11, 2.8, 2.6], [2.57, 1.38, 0]);
    panel([5.25, 2.8, .1], [0, 1.38, -1.27]);
    panel([5.3, .16, 2.65], [0, .08, 0]);
    for (let x = -2.35; x <= 2.36; x += .27) {
      panel([.032, 2.66, .035], [x, 1.38, 1.27], trim);
      panel([.032, .035, 2.48], [x, 2.72, 0], trim);
    }
    // Corner posts and an illuminated loading threshold give the scene depth.
    for (const x of [-2.49, 2.49]) for (const z of [-1.18, 1.18]) panel([.1, 2.72, .1], [x, 1.39, z], trim);
    const threshold = new THREE.Mesh(new THREE.BoxGeometry(4.8, .035, .08), new THREE.MeshBasicMaterial({ color: 0xe3bd69 })); threshold.position.set(0, .18, 1.29); container.add(threshold);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x0a1019, roughness: .78 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -.03; scene.add(floor);
    const glow = new THREE.PointLight(0xf1c974, 28, 9); glow.position.set(0, 2.5, 2.4); scene.add(glow);

    let progress = 0;
    let frame = 0;
    let targetChapter = -1;
    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const stickyHeight = mount.parentElement?.getBoundingClientRect().height ?? window.innerHeight;
      const travel = Math.max(1, section.offsetHeight - stickyHeight);
      progress = THREE.MathUtils.clamp(-rect.top / travel, 0, 1);
      const next = Math.min(2, Math.floor(progress * 3));
      if (next !== targetChapter) { targetChapter = next; setChapter(next); }
    };
    const resize = () => {
      const width = mount.clientWidth; const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize); observer.observe(mount);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    updateScroll(); resize();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const inShipping = THREE.MathUtils.smoothstep(progress, .68, .9);
      container.visible = progress > .56;
      container.scale.setScalar(.88 + inShipping * .12);
      container.rotation.y = -.12 + Math.sin(performance.now() * .00022) * .018;
      camera.position.lerp(new THREE.Vector3(5.8 - inShipping * .9, 3.5 + inShipping * .15, 8.7 - inShipping * .45), .035);
      camera.lookAt(0, 1.12, 0);
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('scroll', updateScroll); window.removeEventListener('resize', resize);
      scene.traverse(node => { if (node instanceof THREE.Mesh) { node.geometry.dispose(); const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach(material => material.dispose()); } });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  const stories = [
    { eyebrow: '01 / FIND YOUR NEXT CAR', title: <>The right car.<br /><span className="gold-gradient-text">The right way home.</span></>, copy: 'Explore quality vehicles sourced internationally and imported with care by a team that knows the way.', action: 'Explore available cars', page: 'inventory', Icon: Car },
    { eyebrow: '02 / PARTS, SOURCED RIGHT', title: <>Keep every<br /><span className="gold-gradient-text">journey moving.</span></>, copy: 'From genuine engine assemblies to braking and suspension, we source dependable parts for the cars you rely on.', action: 'Browse spare parts', page: 'parts', Icon: Wrench },
    { eyebrow: '03 / IMPORT, MADE CLEAR', title: <>From overseas<br /><span className="gold-gradient-text">to Tema Port.</span></>, copy: 'Shipping, import support and customs clearance, handled with you from the first milestone to handover.', action: 'Plan your import', page: 'calculator', Icon: Container },
  ];

  return <section ref={sectionRef} className="auto-journey" aria-label="Discover Jackdan cars, parts and import services">
    <div className="auto-journey__pin">
      <div ref={mountRef} className={`auto-journey__canvas auto-journey__canvas--${chapter}`} aria-hidden="true" />
      <div className="auto-journey__glow" aria-hidden="true" />
      <div className={`auto-journey__visual auto-journey__visual--${chapter}`} aria-hidden="true">
        <div className={`auto-journey__camry ${chapter === 0 ? 'is-visible' : ''}`}>
          <img src="/assets/cars/toyota-camry.jpg" alt="" fetchPriority="high" />
          <span className="auto-journey__image-caption"><i /> TOYOTA CAMRY <b>·</b> SOURCED FOR YOU</span>
        </div>
        <div className={`auto-journey__parts ${chapter === 1 ? 'is-visible' : ''}`}>
          {parts.map((part, index) => <article className="auto-journey__part-card" key={part.name} style={{ '--card-index': index } as React.CSSProperties}>
            <div className="auto-journey__part-photo"><img src={part.image} alt={part.name} loading="lazy" /></div>
            <span className="auto-journey__part-note">{part.note}</span><h3>{part.name}</h3>
          </article>)}
          <div className="auto-journey__parts-foot">GENUINE & QUALITY-TESTED <span>·</span> SOURCED WORLDWIDE</div>
        </div>
        <div className={`auto-journey__shipping ${chapter === 2 ? 'is-visible' : ''}`}>
          <div className="auto-journey__ship-label"><Container size={15} /> SECURE VEHICLE SHIPPING <span>FCL</span></div>
          <div className="auto-journey__ship-details"><div><small>DESTINATION</small><b>TEMA PORT, GHANA</b></div><div><small>YOUR IMPORT</small><b>TRACKED MILE BY MILE</b></div></div>
        </div>
      </div>
      <div className="auto-journey__header"><span className="auto-journey__brand"><span className="auto-journey__brand-mark">J</span> JACKDAN <span>PREMIUM VENTURES</span></span><span className="auto-journey__location"><i /> IMPORTED WITH CARE · DELIVERED IN GHANA</span></div>
      {stories.map(({ eyebrow, title, copy, action, page, Icon }, index) => <div key={eyebrow} className={`auto-journey__story ${chapter === index ? 'is-active' : ''}`} aria-hidden={chapter !== index}>
        <div className="auto-journey__copy"><span className="auto-journey__eyebrow"><Icon size={14} />{eyebrow}</span><h1>{title}</h1><p>{copy}</p><div className="auto-journey__actions"><button onClick={() => onNavigatePage(page)} className="auto-journey__cta">{action}<ArrowRight size={17} /></button>{index === 0 && <a className="auto-journey__phone" href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`} target="_blank" rel="noreferrer">Talk to our team</a>}</div></div>
      </div>)}
      <div className="auto-journey__footer"><span className="auto-journey__counter">0{chapter + 1}<i />03</span><div className="auto-journey__progress"><span style={{ transform: `scaleX(${Math.min(1, progress * 1.5 + .06)})` }} /></div><span className="auto-journey__scroll"><ArrowDown size={14} /> SCROLL TO EXPLORE</span><span className="auto-journey__globe"><Globe2 size={14} /> SOURCING WORLDWIDE</span></div>
      <div className="auto-journey__steps" aria-hidden="true"><span className={chapter === 0 ? 'is-active' : ''}>01 <Car size={13} /></span><span className={chapter === 1 ? 'is-active' : ''}>02 <Wrench size={13} /></span><span className={chapter === 2 ? 'is-active' : ''}>03 <Container size={13} /></span></div>
    </div>
    <div className="auto-journey__scroll-length" aria-hidden="true" />
  </section>;
};
