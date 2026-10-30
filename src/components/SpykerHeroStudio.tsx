import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Gauge, 
  ShieldCheck, 
  Wrench, 
  Eye, 
  Check, 
  Layers, 
  Crosshair,
  Maximize2
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface SpykerHeroStudioProps {
  onNavigatePage: (page: string) => void;
  onOpenFlyerModal: () => void;
}

interface Hotspot {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  specs: { label: string; value: string }[];
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'chassis',
    name: 'Aviation-Grade Carbon & Iso-Grid Chassis',
    subtitle: 'Ultra-Lightweight Rigidity & Sourced Integrity',
    desc: 'Each sourced vehicle undergoes a rigorous structural laser alignment and multi-point auction inspection. Zero structural damage, clean CarFax title, and pristine chassis geometry verified prior to maritime loading.',
    position: [0, 0.4, 0],
    cameraTarget: [3.8, 1.8, 4.5],
    specs: [
      { label: 'Structural Inspection', value: '150-Point Laser Scan' },
      { label: 'Title Verification', value: '100% Clean / No Flood' },
      { label: 'Provenance', value: 'USA & UAE Tier-1 Auctions' }
    ]
  },
  {
    id: 'powertrain',
    name: 'High-Output Precision Powertrain',
    subtitle: 'Dyno-Verified Mechanical Excellence',
    desc: 'Complete compression testing, synthetic fluids flush, and ECU diagnostics. Sourced engines deliver factory rated output with OEM catalytic converters intact for immediate Ghanaian emissions compliance.',
    position: [2.3, 0.2, 0],
    cameraTarget: [4.2, 1.2, 2.0],
    specs: [
      { label: 'Engine Health', value: 'Dyno & Compression Certified' },
      { label: 'OEM Spark & Timing', value: 'Factory Spec Replacement' },
      { label: 'Fuel Adaptation', value: 'Optimized for Octane 95+' }
    ]
  },
  {
    id: 'cockpit',
    name: 'Turned Aluminum & Bespoke Quilted Interior',
    subtitle: 'Aviation-Inspired Switchgear & Pristine Cockpits',
    desc: 'Inspired by early 20th-century aircraft instrument clusters, our hand-selected vehicles feature unworn leather, pristine steering leather, and fully functional multi-zone climate control tailored for West African heat.',
    position: [-0.3, 0.8, 0],
    cameraTarget: [0.5, 2.2, 1.8],
    specs: [
      { label: 'Upholstery Grade', value: 'Full-Grain / Nappa Verified' },
      { label: 'Climate Control', value: 'Dual/Tri-Zone Freon Serviced' },
      { label: 'Cabin Sanitization', value: 'Ozone Antimicrobial Valeted' }
    ]
  },
  {
    id: 'wheels',
    name: 'Milled Turbofan Wheels with Propeller Center-Lock',
    subtitle: 'Aviation Heritage Aerodynamics',
    desc: 'Direct homage to the legendary Spyker 1914 aircraft propeller motif. Forged alloy construction with high-performance Michelin / Continental tyres rated for heavy-duty asphalt durability across Ghanaian highways.',
    position: [1.8, -0.6, 1.45],
    cameraTarget: [2.8, -0.2, 2.6],
    specs: [
      { label: 'Wheel Composition', value: 'Forged Monoblock Alloy' },
      { label: 'Tyre Tread Depth', value: '> 85% Brand New / Fresh Run' },
      { label: 'Center Hub', value: 'Precision Propeller Medallion' }
    ]
  },
  {
    id: 'customs',
    name: 'Port of Tema ICUMS Duty Seal',
    subtitle: 'Zero-Demurrage Customs Assurance',
    desc: 'Direct electronic integration with Ghana Revenue Authority (GRA) ICUMS portal. Authorized clearance agents clear all customs duties, import levies, and generate legitimate release orders with zero delay.',
    position: [-2.4, 0.1, 0],
    cameraTarget: [-4.2, 1.4, 3.2],
    specs: [
      { label: 'Broker Status', value: 'Registered ICUMS Customs Agent' },
      { label: 'Demurrage Risk', value: '0% Guaranteed Express Clearance' },
      { label: 'Handover Location', value: 'Port of Tema / Doorstep Accra' }
    ]
  }
];

const PAINT_FINISHES = [
  { id: 'quail-green', name: 'Monaco Quail Green', hex: '#0e291d', metalness: 0.85, roughness: 0.22 },
  { id: 'aeroblack', name: 'Obsidian Jet Carbon', hex: '#090c10', metalness: 0.92, roughness: 0.18 },
  { id: 'champagne', name: 'Champagne Oro Gold', hex: '#bda056', metalness: 0.95, roughness: 0.24 },
  { id: 'arctic-silver', name: 'Stelvio Aircraft Silver', hex: '#a6b2be', metalness: 0.88, roughness: 0.28 }
];

export const SpykerHeroStudio: React.FC<SpykerHeroStudioProps> = ({
  onNavigatePage,
  onOpenFlyerModal
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFinish, setSelectedFinish] = useState(PAINT_FINISHES[2]); // Default Champagne Gold
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [driveMode, setDriveMode] = useState<'track' | 'meridian' | 'port'>('meridian');
  const [cameraView, setCameraView] = useState<'hero' | 'profile' | 'front' | 'cockpit' | 'wireframe'>('hero');
  const [isRotating, setIsRotating] = useState(true);

  // Audio Context ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const wireMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const floorGridRef = useRef<THREE.GridHelper | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const targetCameraPos = useRef(new THREE.Vector3(7.2, 3.2, 7.8));
  const currentCameraPos = useRef(new THREE.Vector3(7.2, 3.2, 7.8));
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // Web Audio engine hum & aero synthesizer
  const toggleAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.06, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Low frequency engine rumble
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(48, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);

        osc1.connect(filter);
        filter.connect(masterGain);
        osc1.start();
        osc1Ref.current = osc1;

        // Subtle aerodynamic high-frequency breath
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(96, ctx.currentTime);
        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0.02, ctx.currentTime);
        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.start();
        osc2Ref.current = osc2;

        setIsAudioActive(true);
      } catch (err) {
        console.warn('Audio Context failed:', err);
      }
    } else {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setIsAudioActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Three.js Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x06090e, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7.2, 3.2, 7.8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffffff, 4.2);
    mainSpot.position.set(8, 14, 8);
    mainSpot.angle = Math.PI / 4.2;
    mainSpot.penumbra = 0.8;
    mainSpot.decay = 1.2;
    scene.add(mainSpot);
    spotLightRef.current = mainSpot;

    const goldRim = new THREE.PointLight(0xd4af37, 2.8, 30);
    goldRim.position.set(-6, 4, -6);
    scene.add(goldRim);

    const cyanUnderglow = new THREE.PointLight(0x38bdf8, 1.8, 20);
    cyanUnderglow.position.set(0, -1.2, 0);
    scene.add(cyanUnderglow);

    // 5. Studio Floor Grid with Radial Falloff
    const grid = new THREE.GridHelper(36, 36, 0xd4af37, 0x1e2838);
    grid.position.y = -1.2;
    scene.add(grid);
    floorGridRef.current = grid;

    // Outer circular reflector ring
    const ringGeo = new THREE.RingGeometry(5.8, 6.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = -1.19;
    scene.add(floorRing);

    // 6. Sculpted 3D Spyker-Inspired Supercar / Grand Tourer
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // Bodywork Standard Material (supports real-time paint switching)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.hex),
      metalness: selectedFinish.metalness,
      roughness: selectedFinish.roughness
    });
    bodyMaterialRef.current = bodyMat;

    // Body Wireframe Material
    const wireMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.65 });
    wireMaterialRef.current = wireMat;

    // Main sculpted fuselage / lower chassis
    const chassisGeo = new THREE.BoxGeometry(6.6, 0.9, 2.7);
    const chassisMesh = new THREE.Mesh(chassisGeo, bodyMat);
    chassisMesh.position.set(0, -0.3, 0);
    carGroup.add(chassisMesh);

    // Upper aerodynamic fastback cockpit canopy
    const cabinGeo = new THREE.BoxGeometry(3.4, 0.75, 2.2);
    const cabinMesh = new THREE.Mesh(cabinGeo, bodyMat);
    cabinMesh.position.set(-0.3, 0.45, 0);
    carGroup.add(cabinMesh);

    // Cockpit Glass Windshield (Tinted aircraft canopy)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x050a12,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.75
    });
    const windshieldGeo = new THREE.BoxGeometry(1.6, 0.65, 2.15);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0.65, 0.35, 0);
    windshield.rotation.z = -Math.PI / 8;
    carGroup.add(windshield);

    // Sloped Front Hood & Aerodynamic Nosecone
    const hoodGeo = new THREE.BufferGeometry();
    const hoodPositions = new Float32Array([
      // Front hood rake
      1.4, 0.15, 1.35,    3.3, -0.3, 1.25,    1.4, 0.15, -1.35,
      1.4, 0.15, -1.35,   3.3, -0.3, 1.25,    3.3, -0.3, -1.25,
      // Front grille intake
      3.3, -0.3, 1.25,    3.5, -0.7, 1.1,     3.3, -0.3, -1.25,
      3.3, -0.3, -1.25,   3.5, -0.7, 1.1,     3.5, -0.7, -1.1
    ]);
    hoodGeo.setAttribute('position', new THREE.BufferAttribute(hoodPositions, 3));
    hoodGeo.computeVertexNormals();
    const hoodMesh = new THREE.Mesh(hoodGeo, bodyMat);
    carGroup.add(hoodMesh);

    // Aerodynamic Rear Wing & Diffuser (Spyker Preliator Iso-Grid inspired)
    const wingGeo = new THREE.BoxGeometry(0.8, 0.06, 2.9);
    const wingMesh = new THREE.Mesh(wingGeo, bodyMat);
    wingMesh.position.set(-3.2, 0.7, 0);
    carGroup.add(wingMesh);

    const wingPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.08), bodyMat);
    wingPillar1.position.set(-3.1, 0.45, 0.8);
    carGroup.add(wingPillar1);

    const wingPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.08), bodyMat);
    wingPillar2.position.set(-3.1, 0.45, -0.8);
    carGroup.add(wingPillar2);

    // Exhaust Tips (Quad Polished Aircraft Thrusters)
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.15 });
    const createExhaust = (z: number) => {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16), exhaustMat);
      tip.rotation.z = Math.PI / 2;
      tip.position.set(-3.35, -0.45, z);
      return tip;
    };
    carGroup.add(createExhaust(0.35));
    carGroup.add(createExhaust(0.12));
    carGroup.add(createExhaust(-0.12));
    carGroup.add(createExhaust(-0.35));

    // LED Headlight Beams (Front projection)
    const createBeam = (z: number) => {
      const coneGeo = new THREE.ConeGeometry(1.2, 6.5, 16, 1, true);
      coneGeo.rotateZ(-Math.PI / 2);
      coneGeo.translate(5.4, -0.4, z);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide
      });
      return new THREE.Mesh(coneGeo, beamMat);
    };
    carGroup.add(createBeam(0.85));
    carGroup.add(createBeam(-0.85));

    // 4 Milled Turbofan Alloy Wheels with Propeller Center Locks
    wheelsRef.current = [];
    const wheelPositions = [
      { x: 2.1, y: -0.65, z: 1.45 },
      { x: -2.1, y: -0.65, z: 1.45 },
      { x: 2.1, y: -0.65, z: -1.45 },
      { x: -2.1, y: -0.65, z: -1.45 }
    ];

    wheelPositions.forEach((pos, idx) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      // Rubber tyre
      const tyreGeo = new THREE.TorusGeometry(0.55, 0.22, 16, 32);
      const tyreMat = new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.85, metalness: 0.1 });
      const tyre = new THREE.Mesh(tyreGeo, tyreMat);
      wheelGroup.add(tyre);

      // Aluminum Milled Turbofan Rim
      const rimGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.35, 16);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      // Propeller Center-Lock Spinner (2-blade propeller insignia)
      const propGeo = new THREE.BoxGeometry(0.5, 0.08, 0.04);
      const propMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const prop = new THREE.Mesh(propGeo, propMat);
      prop.position.z = idx < 2 ? 0.2 : -0.2;
      wheelGroup.add(prop);

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    // 7. Interaction: Drag to Orbit
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;

      if (carGroupRef.current) {
        carGroupRef.current.rotation.y += dx * 0.007;
      }
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseRef.current.x;
      if (carGroupRef.current) {
        carGroupRef.current.rotation.y += dx * 0.009;
      }
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize
    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      // Smooth Camera Lerp
      currentCameraPos.current.lerp(targetCameraPos.current, 0.05);
      if (cameraRef.current) {
        cameraRef.current.position.copy(currentCameraPos.current);
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Auto rotation
      if (isRotating && !isDraggingRef.current && carGroupRef.current) {
        carGroupRef.current.rotation.y += 0.004;
      }

      // Wheel rotation
      wheelsRef.current.forEach(w => {
        w.rotation.x += 0.03;
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);

      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [isRotating]);

  // Synchronize Paint Finish
  useEffect(() => {
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(selectedFinish.hex);
      bodyMaterialRef.current.metalness = selectedFinish.metalness;
      bodyMaterialRef.current.roughness = selectedFinish.roughness;
    }
  }, [selectedFinish]);

  // Camera View Angle Presets
  const setPresetView = (view: 'hero' | 'profile' | 'front' | 'cockpit' | 'wireframe') => {
    setCameraView(view);
    setActiveHotspot(null);

    switch (view) {
      case 'hero':
        targetCameraPos.current.set(7.2, 3.2, 7.8);
        break;
      case 'profile':
        targetCameraPos.current.set(0, 1.2, 9.8);
        break;
      case 'front':
        targetCameraPos.current.set(8.5, 0.8, 0);
        break;
      case 'cockpit':
        targetCameraPos.current.set(1.5, 3.8, 3.2);
        break;
      case 'wireframe':
        targetCameraPos.current.set(6.0, 4.0, 6.0);
        break;
    }
  };

  const handleSelectHotspot = (spot: Hotspot) => {
    setActiveHotspot(spot);
    setIsRotating(false);
    targetCameraPos.current.set(...spot.cameraTarget);
  };

  const handleCloseHotspot = () => {
    setActiveHotspot(null);
    setPresetView('hero');
    setIsRotating(true);
  };

  return (
    <div className="relative w-full min-h-[640px] lg:min-h-[760px] bg-gradient-to-b from-dark-950 via-[#070b12] to-dark-950 border-b border-dark-800 overflow-hidden flex flex-col justify-between">
      {/* Top Architectural Marque Header */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between border-b border-white/5 pb-4">
        {/* Left: Latin Axiom & Heritage Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-gold-500/40 flex items-center justify-center text-gold-400 font-heading text-xs font-black shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            JKD
          </div>
          <div>
            <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-gold-400 font-bold block">
              "NULLA TENACI INVIA EST VIA"
            </span>
            <span className="text-[9px] tracking-[0.16em] uppercase text-dark-400 font-mono">
              For The Tenacious, No Road Is Impassable • Est. Accra 2026
            </span>
          </div>
        </div>

        {/* Right: Audio Ambience & Sourcing Portal Link */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAudio}
            className={`px-3 py-1.5 rounded-full border text-[10px] tracking-[0.14em] uppercase font-bold flex items-center gap-2 transition-all ${
              isAudioActive
                ? 'bg-gold-500/15 border-gold-500/60 text-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                : 'bg-dark-900/80 border-dark-700 text-dark-400 hover:text-white'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-gold-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Engine Audio: {isAudioActive ? 'Active' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenFlyerModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-900/80 border border-gold-500/30 text-gold-400 text-[10px] tracking-wider uppercase font-semibold hover:bg-gold-500/10 transition-colors"
          >
            <Eye className="w-3 h-3 text-gold-400" />
            <span>Official Atelier Flyer</span>
          </button>
        </div>
      </div>

      {/* Center 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 w-full flex items-center justify-center my-2">
        <div
          ref={mountRef}
          className="w-full h-[520px] sm:h-[580px] lg:h-[660px] cursor-grab active:cursor-grabbing"
        />

        {/* Ambient Radial Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,#06090e_95%)]" />

        {/* Top Left: Aviation Telemetry Overlay */}
        <div className="absolute top-4 left-4 sm:left-8 pointer-events-none z-10 space-y-1 font-mono text-[10px]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-dark-950/80 border border-gold-500/30 text-gold-400 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
            <span className="font-bold tracking-wider">MARQUE ATELIER 3D STUDIO</span>
          </div>
          <div className="text-dark-400 tracking-tight">
            LAT 05°38′N • LON 00°01′E (PORT OF TEMA CITADEL)
          </div>
          <div className="text-dark-400 tracking-tight">
            FINISH: <strong className="text-white uppercase">{selectedFinish.name}</strong>
          </div>
        </div>

        {/* Top Right: Camera Presets (Awwwards / Spyker Style) */}
        <div className="absolute top-4 right-4 sm:right-8 z-10 flex flex-col items-end gap-1.5">
          <span className="text-[9px] uppercase tracking-[0.2em] text-dark-400 font-mono">
            Observation Angle
          </span>
          <div className="flex items-center gap-1 bg-dark-950/85 p-1 rounded-xl border border-dark-700/80 backdrop-blur-md">
            {[
              { id: 'hero', label: '3/4 Hero' },
              { id: 'profile', label: 'Profile' },
              { id: 'front', label: 'Front' },
              { id: 'cockpit', label: 'Cockpit' }
            ].map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => setPresetView(v.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  cameraView === v.id
                    ? 'bg-gold-500 text-dark-950 font-bold shadow-md'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                {v.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              title="Toggle Auto Rotation"
              className={`p-1 rounded-lg border text-[10px] ${
                isRotating ? 'bg-gold-500/20 border-gold-500/50 text-gold-400' : 'bg-dark-800 border-dark-700 text-dark-400'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hotspot Floating Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-full">
            {HOTSPOTS.map((spot, i) => (
              <button
                key={spot.id}
                type="button"
                onClick={() => handleSelectHotspot(spot)}
                className="pointer-events-auto absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${25 + i * 14}%`,
                  top: `${40 + (i % 2 === 0 ? -12 : 14)}%`
                }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-gold-400/20 animate-ping" />
                  <span className="w-5 h-5 rounded-full bg-dark-950 border-2 border-gold-400 flex items-center justify-center text-[9px] font-bold text-gold-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] group-hover:scale-125 transition-transform">
                    {i + 1}
                  </span>
                  <div className="absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap hidden group-hover:block px-2.5 py-1 rounded bg-dark-950/95 border border-gold-500/50 text-[10px] font-mono text-gold-300 backdrop-blur-md shadow-2xl">
                    {spot.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Hotspot Specification Drawer (Spyker Craftsmanship Detail) */}
        {activeHotspot && (
          <div className="absolute bottom-20 left-4 sm:left-8 right-4 sm:right-auto sm:max-w-md z-30 p-5 rounded-2xl bg-dark-950/95 border border-gold-500/50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between gap-3 border-b border-dark-800 pb-3 mb-3">
              <div>
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-gold-400 block font-bold">
                  Bespoke Detail Spec
                </span>
                <h4 className="font-heading text-lg font-bold text-white tracking-tight">
                  {activeHotspot.name}
                </h4>
                <p className="text-xs text-gold-400/80 font-medium">{activeHotspot.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseHotspot}
                className="text-dark-400 hover:text-white p-1 rounded-lg bg-dark-900 border border-dark-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-dark-300 leading-relaxed mb-4">
              {activeHotspot.desc}
            </p>

            <div className="grid grid-cols-1 gap-2 border-t border-dark-800/80 pt-3">
              {activeHotspot.specs.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-dark-400 font-mono text-[11px]">{s.label}:</span>
                  <span className="text-white font-semibold">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-dark-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigatePage('inventory')}
                className="text-gold-400 hover:text-gold-300 text-xs font-bold flex items-center gap-1.5"
              >
                <span>View Matching Vehicles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCloseHotspot}
                className="text-[11px] text-dark-400 hover:text-white"
              >
                Return to Studio
              </button>
            </div>
          </div>
        )}

        {/* Center Lower Drag Instruction */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none z-10">
          <div className="px-4 py-1.5 rounded-full bg-dark-950/80 border border-dark-800 text-[11px] text-dark-300 backdrop-blur-md flex items-center gap-2 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
            <span>Interactive 3D Showroom • Drag to Rotate 360° • Click numbered beacons to inspect</span>
          </div>
        </div>
      </div>

      {/* Bottom Aircraft Control Deck & Color Palette */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 border-t border-white/5 bg-dark-950/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
        {/* Color Palette Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-dark-400">
            Exterior Livery:
          </span>
          <div className="flex items-center gap-2">
            {PAINT_FINISHES.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFinish(f)}
                title={f.name}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  selectedFinish.id === f.id
                    ? 'ring-2 ring-gold-400 scale-110 shadow-lg'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                style={{ backgroundColor: f.hex }}
              >
                {selectedFinish.id === f.id && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Aircraft Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-dark-400 hidden sm:inline">
            Aviation Mode:
          </span>
          <div className="flex items-center gap-1 bg-dark-900 p-1 rounded-xl border border-dark-700">
            {[
              { id: 'meridian', label: 'Meridian 0° Cruising' },
              { id: 'track', label: 'Autodrome Track' },
              { id: 'port', label: 'Port Customs Gate' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setDriveMode(m.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  driveMode === m.id
                    ? 'bg-gold-500 text-dark-950 font-bold shadow'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Call-to-Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onNavigatePage('inventory')}
            className="flex-1 sm:flex-initial gold-gradient-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-dark-950 flex items-center justify-center gap-2 shadow-xl hover:brightness-110 transition-all"
          >
            <span>Explore The Marque Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-dark-900 hover:bg-dark-800 border border-gold-500/30 text-gold-400 hover:text-gold-300 text-xs font-semibold transition-colors"
          >
            Concierge WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

