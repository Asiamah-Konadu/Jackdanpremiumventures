import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDown, ArrowRight, Car, Container, Globe2, Wrench } from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface Props { onNavigatePage: (page: string) => void }

/** Scroll-led 3D introduction to Jackdan's vehicle, parts and import services. */
export const AutoImportJourney: React.FC<Props> = ({ onNavigatePage }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    const section = sectionRef.current;
    if (!mount || !section) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(6.3, 3.5, 8.5);
    camera.lookAt(0, 0.55, 0);
    scene.add(new THREE.HemisphereLight(0xbad8ff, 0x11131c, 2.05));
    const key = new THREE.DirectionalLight(0xffe5b0, 4.1); key.position.set(4, 7, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x5591ff, 2.6); rim.position.set(-5, 3, -4); scene.add(rim);
    const fill = new THREE.PointLight(0xd5a74e, 35, 14); fill.position.set(0, 2, 4); scene.add(fill);

    const car = new THREE.Group(); scene.add(car);
    const paint = new THREE.MeshPhysicalMaterial({ color: 0x922b27, metalness: 0.72, roughness: 0.23, clearcoat: 1, clearcoatRoughness: 0.13 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x152435, metalness: 0.4, roughness: 0.12, transparent: true, opacity: 0.86, clearcoat: 1 });
    const trim = new THREE.MeshStandardMaterial({ color: 0x11151c, metalness: 0.5, roughness: 0.38 });
    const alloy = new THREE.MeshStandardMaterial({ color: 0xb6bec8, metalness: 0.88, roughness: 0.23 });
    const lamp = new THREE.MeshStandardMaterial({ color: 0xfff2d3, emissive: 0xffc35a, emissiveIntensity: 2.3 });
    const redLamp = new THREE.MeshStandardMaterial({ color: 0xba2828, emissive: 0xff1829, emissiveIntensity: 1.5 });
    const box = (parent: THREE.Group, material: THREE.Material, pos: [number,number,number], size: [number,number,number], radius = 0.1) => {
      const geo = new THREE.BoxGeometry(...size); const mesh = new THREE.Mesh(geo, material); mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    };
    // Sculpted crossover silhouette assembled from bevelled body sections.
    box(car, paint, [0, 0.69, 0], [3.85, 0.66, 1.63]);
    box(car, paint, [-0.12, 1.2, 0], [2.1, 0.66, 1.42]);
    box(car, paint, [1.27, 1.08, 0], [1.02, 0.38, 1.5]);
    box(car, paint, [-1.53, 1.02, 0], [0.8, 0.39, 1.49]);
    box(car, trim, [0, 0.39, 0], [3.6, 0.22, 1.47]);
    // Panoramic windows, windshield and rear glass.
    box(car, glass, [-0.1, 1.26, 0], [1.72, 0.42, 1.31]);
    box(car, paint, [-0.1, 1.48, 0], [1.85, 0.1, 1.38]);
    box(car, glass, [1.04, 1.19, 0], [0.15, 0.44, 1.32]);
    box(car, paint, [1.14, 1.2, 0], [0.13, 0.54, 1.39]);
    box(car, glass, [-1.12, 1.15, 0], [0.15, 0.41, 1.3]);
    box(car, paint, [-1.24, 1.16, 0], [0.14, 0.52, 1.39]);
    // Four precision wheel assemblies and brake discs.
    const wheels: THREE.Group[] = [];
    for (const x of [-1.23, 1.23]) for (const z of [-0.83, 0.83]) {
      const wheel = new THREE.Group(); wheel.position.set(x, 0.45, z); car.add(wheel); wheels.push(wheel);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.24, 40), trim); tire.rotation.x = Math.PI/2; tire.castShadow = true; wheel.add(tire);
      const face = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.285, 0.248, 32), alloy); face.rotation.x = Math.PI/2; wheel.add(face);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.26, 24), trim); hub.rotation.x = Math.PI/2; wheel.add(hub);
      for (let i = 0; i < 10; i++) { const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.46, 0.055), alloy); spoke.rotation.z = i*Math.PI/5; spoke.position.z = 0.135; wheel.add(spoke); }
    }
    // Headlamps and tail lights.
    for (const z of [-0.56, 0.56]) { box(car, lamp, [1.94, 0.89, z], [0.07, 0.18, 0.3]); box(car, redLamp, [-1.95, 0.91, z], [0.07, 0.2, 0.34]); }
    // Doors, handles, wing mirrors and grille give the vehicle crisp detail.
    for (const z of [-0.825, 0.825]) {
      box(car, trim, [0.22, 1.02, z], [0.22, 0.045, 0.035]);
      const mirror = box(car, paint, [0.91, 1.27, z*1.04], [0.22, 0.13, 0.16]); mirror.rotation.z = -0.12;
      box(car, trim, [-1.99, 0.68, z*0.68], [0.055, 0.25, 0.36]);
    }
    // Parts that separate during the middle chapter.
    const parts = new THREE.Group(); scene.add(parts);
    const makePart = (material: THREE.Material, p: [number,number,number], size: [number,number,number], type: 'box'|'cylinder'='box') => {
      const mesh = new THREE.Mesh(type === 'box' ? new THREE.BoxGeometry(...size) : new THREE.CylinderGeometry(size[0], size[0], size[1], 32), material);
      mesh.position.set(...p); mesh.castShadow = true; parts.add(mesh); return mesh;
    };
    const partMeshes = [
      makePart(paint, [0,0,0], [1.2,.17,.85]), makePart(alloy, [0,0,0], [.32,.15,.32],'cylinder'),
      makePart(trim, [0,0,0], [.42,.12,.42],'cylinder'), makePart(alloy, [0,0,0], [.17,.22,.17],'cylinder'),
      makePart(trim, [0,0,0], [.65,.3,.45]), makePart(paint, [0,0,0], [.58,.32,.45]),
      makePart(alloy, [0,0,0], [.36,.08,.36],'cylinder'), makePart(lamp, [0,0,0], [.46,.12,.17]),
      makePart(trim, [0,0,0], [.3,.28,.3],'cylinder'),
    ];
    const partHomes = [[-.6,.1,0],[.55,.2,0],[.55,.35,0],[.55,.5,0],[-.55,-.2,0],[-.55,-.4,0],[.55,-.3,0],[0,.62,0],[.55,-.5,0]] as const;
    // Corrugated freight container, open at the front to frame the vehicle.
    const container = new THREE.Group(); scene.add(container);
    const steel = new THREE.MeshStandardMaterial({ color: 0x314b66, metalness: .66, roughness: .4, side: THREE.DoubleSide });
    for (const x of [-2.54, 2.54]) { const wall = new THREE.Mesh(new THREE.BoxGeometry(.08,2.65,2.3), steel); wall.position.set(x,1.4,0); container.add(wall); }
    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.1,.08,2.3), steel); roof.position.set(0,2.73,0); container.add(roof);
    const back = new THREE.Mesh(new THREE.BoxGeometry(5.1,2.65,.08), steel); back.position.set(0,1.4,-1.15); container.add(back);
    const ribs = new THREE.Group(); container.add(ribs);
    const ribMaterial = new THREE.MeshStandardMaterial({ color: 0x688099, metalness: .7, roughness: .36 });
    for (let x=-2.35; x<=2.36; x+=.31) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(.035,2.5,.035), ribMaterial); rib.position.set(x,1.4,1.18); ribs.add(rib);
      const topRib = new THREE.Mesh(new THREE.BoxGeometry(.035,.035,2.2), ribMaterial); topRib.position.set(x,2.69,0); ribs.add(topRib);
    }
    const floor = new THREE.Mesh(new THREE.BoxGeometry(5.15,.13,2.35), steel); floor.position.set(0,.09,0); container.add(floor);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshStandardMaterial({color:0x0b1019, roughness:.83})); ground.rotation.x=-Math.PI/2; ground.position.y=-.05; scene.add(ground);
    const grid = new THREE.GridHelper(40,60,0x26384f,0x172334); grid.position.y=-.035; (grid.material as THREE.Material).transparent=true; (grid.material as THREE.Material).opacity=.34; scene.add(grid);
    const setGroup = (g: THREE.Group, visible: boolean) => { g.visible = visible; };

    let frame = 0; let progress = 0; let pointerX = 0;
    const setProgress = () => {
      const rect = section.getBoundingClientRect();
      progress = THREE.MathUtils.clamp(-rect.top / Math.max(1, rect.height - window.innerHeight), 0, .9999);
      setChapter(Math.min(2, Math.floor(progress * 3)));
    };
    const onPointer = (e: PointerEvent) => { pointerX = (e.clientX / Math.max(1, window.innerWidth) - .5) * .12; };
    const resize = () => { if (!mount.clientWidth || !mount.clientHeight) return; camera.aspect=mount.clientWidth/mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth,mount.clientHeight); };
    window.addEventListener('scroll', setProgress, { passive:true }); window.addEventListener('resize',resize); window.addEventListener('pointermove',onPointer,{passive:true}); setProgress(); resize();
    const animate = () => {
      frame=requestAnimationFrame(animate);
      const stage = progress*3;
      const reveal = THREE.MathUtils.smoothstep(stage-0.78, 0.05, 0.52);
      const ship = THREE.MathUtils.smoothstep(stage-1.8, 0.12, 0.85);
      car.visible = true;
      parts.visible = reveal > .04 && ship < .65;
      container.visible = ship > .03;
      car.position.set(0, .1 + Math.sin(performance.now()*.0007)*.025, -ship*.48);
      car.rotation.y = -.18 + pointerX + reveal*.35;
      car.scale.setScalar(1 - reveal*.17 - ship*.19);
      wheels.forEach((w,i)=> { const side=w.position.z>0?1:-1; const front=w.position.x>0?1:-1; w.position.set(front*(1.23+reveal*.39), .45+reveal*(i%2?.36:.22), side*(.83+reveal*.32)); });
      partMeshes.forEach((m,i)=> { const [x,y,z]=partHomes[i]; m.position.set(x*(.35+reveal*1.1),y*(.35+reveal*1.1),z+reveal*(i%2?1.1:-1.1)); m.rotation.y = reveal*(i%2?.28:-.2); });
      parts.rotation.y=-.2+pointerX;
      container.rotation.y = -.12+pointerX;
      container.position.set(0,0,0);
      camera.position.lerp(new THREE.Vector3(6.3-ship*1.1, 3.5+ship*.5, 8.5-ship*1.2), .035);
      camera.lookAt(0,.75,0);
      renderer.render(scene,camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame); window.removeEventListener('scroll',setProgress); window.removeEventListener('resize',resize); window.removeEventListener('pointermove',onPointer);
      scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose(); const mats=Array.isArray(obj.material)?obj.material:[obj.material]; mats.forEach(m=>m.dispose());}});
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  const stories = [
    { eyebrow:'01 / SOURCE YOUR NEXT CAR', title:<>A better way to<br/><span className="gold-gradient-text">get behind the wheel.</span></>, copy:'Sought-after SUVs, sedans and pickups, sourced from trusted markets and brought to you with care.', action:'Explore available cars', page:'inventory', Icon:Car },
    { eyebrow:'02 / THE RIGHT PART, FOUND', title:<>Every detail.<br/><span className="gold-gradient-text">Genuine by design.</span></>, copy:'From wheels and brakes to engine components, we help you source the parts that keep your car moving.', action:'Browse spare parts', page:'parts', Icon:Wrench },
    { eyebrow:'03 / FROM OUR DOOR TO YOURS', title:<>Across oceans.<br/><span className="gold-gradient-text">Into your hands.</span></>, copy:'We coordinate international shipping, import documentation and Tema Port customs clearance from start to finish.', action:'Plan your import', page:'calculator', Icon:Container },
  ];
  return <section ref={sectionRef} className="auto-journey" aria-label="Discover Jackdan auto imports and parts">
    <div className="auto-journey__pin"><div ref={mountRef} className="auto-journey__canvas" aria-hidden="true" />
      <div className="auto-journey__glow" aria-hidden="true" />
      <div className="auto-journey__header"><span className="auto-journey__brand"><span className="auto-journey__brand-mark">J</span> JACKDAN <span>PREMIUM VENTURES</span></span><span className="auto-journey__location"><i/> IMPORTED WITH CARE · DELIVERED IN GHANA</span></div>
      {stories.map(({eyebrow,title,copy,action,page,Icon},i)=><div key={eyebrow} className={`auto-journey__story ${chapter===i?'is-active':''}`} aria-hidden={chapter!==i}>
        <div className="auto-journey__copy"><span className="auto-journey__eyebrow"><Icon size={14}/>{eyebrow}</span><h1>{title}</h1><p>{copy}</p><div className="auto-journey__actions"><button onClick={()=>onNavigatePage(page)} className="auto-journey__cta">{action}<ArrowRight size={17}/></button>{i===0&&<a className="auto-journey__phone" href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+','')}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`} target="_blank" rel="noreferrer">Talk to our team</a>}</div></div>
        <div className="auto-journey__tag" aria-hidden="true">{i===0?'JAPANESE ENGINEERING · READY FOR GHANA':i===1?'OEM QUALITY · SOURCED WORLDWIDE':'SECURE CONTAINER SHIPPING · TEMA PORT'}</div>
      </div>)}
      <div className="auto-journey__footer"><span className="auto-journey__counter">0{chapter+1}<i/>03</span><div className="auto-journey__progress"><span style={{transform:`scaleX(${(chapter+1)/3})`}}/></div><span className="auto-journey__scroll"><ArrowDown size={14}/> SCROLL TO EXPLORE</span><span className="auto-journey__globe"><Globe2 size={14}/> SOURCING WORLDWIDE</span></div>
      <div className="auto-journey__steps" aria-hidden="true"><span className={chapter===0?'is-active':''}>01 <Car size={13}/></span><span className={chapter===1?'is-active':''}>02 <Wrench size={13}/></span><span className={chapter===2?'is-active':''}>03 <Container size={13}/></span></div>
    </div>
    <div className="auto-journey__scroll-length" aria-hidden="true" />
  </section>;
};
