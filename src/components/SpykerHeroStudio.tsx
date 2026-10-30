import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
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
  Maximize2,
  Lightbulb,
  Camera,
  Play,
  Pause,
  Sun,
  Mountain,
  Building,
  Anchor,
  Globe2
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
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  specs: { label: string; value: string }[];
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'front',
    name: 'Aerodynamic Carbon Splitter & Intakes',
    subtitle: 'Track-Tuned Downforce & Front Laser Alignment',
    desc: 'Each imported machine undergoes high-precision laser chassis alignment. Airflow splitters and front radiator heat exchangers are verified free of curb rash or stone pitting prior to transoceanic container sealing.',
    cameraPos: [0, 0.9, 4.6],
    lookAt: [0, 0.4, 1.8],
    specs: [
      { label: 'Front Clearance Scan', value: '150-Point Laser Verified' },
      { label: 'Radiator Condition', value: 'OEM High-Pressure Tested' },
      { label: 'Active Aerodynamics', value: 'Functional Downforce Ducts' }
    ]
  },
  {
    id: 'engine',
    name: 'Mid-Mounted Bi-Turbocharged Powertrain',
    subtitle: 'Dyno-Verified 600+ BHP Mechanical Purity',
    desc: 'Cylinder compression tested, dyno-logged, and serviced with factory synthetic lubricants. Genuine OEM catalytic converters remain intact to meet stringent environmental standards and immediate Ghanaian DVLA roadworthy certification.',
    cameraPos: [1.8, 1.8, -0.6],
    lookAt: [0, 0.6, -0.6],
    specs: [
      { label: 'Compression Ratio', value: '10.5:1 Factory Spec' },
      { label: 'Diagnostics', value: 'Zero Fault Codes / Clean ECU' },
      { label: 'Thermal Shielding', value: 'Tropicalized Cooling System' }
    ]
  },
  {
    id: 'cockpit',
    name: 'Turned Aluminum Cockpit & Nappa Leather',
    subtitle: 'Aviation Switchgear & Luxury Driver Ergonomics',
    desc: 'Direct tribute to vintage aircraft binnacles. Features machined aluminum toggle gear linkages, hand-stitched leather upholstery, and freon-recharged dual-zone climate systems tuned for West African sun.',
    cameraPos: [0.65, 1.45, 0.65],
    lookAt: [-0.15, 0.75, 0.05],
    specs: [
      { label: 'Cabin Detailing', value: 'Ozone Purified & Valeted' },
      { label: 'Instrumentation', value: 'Aviation Dial Clusters' },
      { label: 'Air Conditioning', value: 'Sub-Zero Tropical Climate Pack' }
    ]
  },
  {
    id: 'wheels',
    name: 'Forged Turbofan Alloys & Brembo Carbon Ceramics',
    subtitle: 'Propeller Center-Lock with Extreme Stopping Power',
    desc: 'Inspired by the historic 1914 Spyker aircraft propeller medallion. High-tensile forged monoblock construction paired with fresh high-performance Michelin Pilot Sport tyres engineered for Ghanaian highways.',
    cameraPos: [2.3, 0.5, 1.6],
    lookAt: [1.0, 0.35, 1.4],
    specs: [
      { label: 'Braking Hardware', value: 'Brembo Multi-Piston Monoblock' },
      { label: 'Wheel Composition', value: 'Forged Aerospace Alloy' },
      { label: 'Tyre Tread Life', value: '> 90% Fresh Factory Tread' }
    ]
  },
  {
    id: 'customs',
    name: 'Port of Tema ICUMS Customs Seal',
    subtitle: 'Zero-Demurrage Electronic Clearance Guarantee',
    desc: 'Our registered customs house brokerage coordinates with Ghana Revenue Authority (GRA) ICUMS systems prior to berth arrival. Demurrage penalties are 100% prevented with official duty receipts delivered with keys.',
    cameraPos: [0, 1.1, -4.4],
    lookAt: [0, 0.4, -1.8],
    specs: [
      { label: 'Clearing Status', value: 'Registered GRA ICUMS Agent' },
      { label: 'Demurrage Guarantee', value: 'Zero Demurrage Guaranteed' },
      { label: 'Exhaust Status', value: 'Quad Polished Jet Tips' }
    ]
  }
];

const PAINT_FINISHES = [
  { 
    id: 'champagne', 
    name: 'Champagne Oro Gold', 
    hex: '#c29f4a', 
    metalness: 0.95, 
    roughness: 0.32, 
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    rimColor: '#e0c068'
  },
  { 
    id: 'quail-green', 
    name: 'Monaco Quail Green', 
    hex: '#0a2a1a', 
    metalness: 0.88, 
    roughness: 0.28, 
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    rimColor: '#c5a059'
  },
  { 
    id: 'aeroblack', 
    name: 'Obsidian Jet Carbon', 
    hex: '#080b0f', 
    metalness: 0.92, 
    roughness: 0.22, 
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    rimColor: '#88929e'
  },
  { 
    id: 'arctic-silver', 
    name: 'Stelvio Liquid Silver', 
    hex: '#b8c4d0', 
    metalness: 0.95, 
    roughness: 0.25, 
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    rimColor: '#dbe2e8'
  },
  { 
    id: 'scuderia-red', 
    name: 'Rosso Marque Crimson', 
    hex: '#8b0e14', 
    metalness: 0.85, 
    roughness: 0.30, 
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    rimColor: '#2b2f38'
  }
];

// Photorealistic 360° Real Environments (Spyker "Day Behind the Wheel" concept)
const REAL_ENVIRONMENTS = [
  {
    id: 'como',
    name: 'Lake Como Dawn',
    badge: 'Coastal Riviera',
    file: '/textures/env_como.hdr',
    lightColor: 0xffd899,
    lightIntensity: 3.5,
    icon: Sun,
    description: 'Golden hour sunrise over misty alpine waters and coastal villas.'
  },
  {
    id: 'pass',
    name: 'Stelvio Mountain Pass',
    badge: 'Alpine Summit',
    file: '/textures/env_pass.hdr',
    lightColor: 0xffffff,
    lightIntensity: 4.2,
    icon: Mountain,
    description: 'Crisp mountain air, towering alpine rocks, and high-altitude winding tarmac.'
  },
  {
    id: 'urban',
    name: 'Metropolitan Overpass',
    badge: 'Modern Architecture',
    file: '/textures/env_urban.hdr',
    lightColor: 0xe0ecf8,
    lightIntensity: 3.8,
    icon: Building,
    description: 'Contemporary architectural bridge, geometric concrete, and skyline horizon.'
  },
  {
    id: 'harbor',
    name: 'Port of Tema Coastline',
    badge: 'Maritime Terminal',
    file: '/textures/env_harbor.hdr',
    lightColor: 0xffe6c2,
    lightIntensity: 3.6,
    icon: Anchor,
    description: 'Atlantic ocean breeze, maritime horizon, and coastal sunrise.'
  }
];

// Procedural Canvas Asphalt Texture Generator
const generateAsphaltTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Dark charcoal asphalt base
  ctx.fillStyle = '#10141a';
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. High-density aggregate grain noise
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 32;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Double Golden Meridian Center Stripes
  ctx.fillStyle = '#e8be5b';
  ctx.fillRect(504, 0, 6, 1024);
  ctx.fillRect(514, 0, 6, 1024);

  // 4. White Solid Road Shoulder Boundary Lines
  ctx.fillStyle = 'rgba(235, 242, 250, 0.75)';
  ctx.fillRect(160, 0, 10, 1024);
  ctx.fillRect(854, 0, 10, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 14);
  return texture;
};

export const SpykerHeroStudio: React.FC<SpykerHeroStudioProps> = ({
  onNavigatePage,
  onOpenFlyerModal
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFinish, setSelectedFinish] = useState(PAINT_FINISHES[0]); // Default Champagne Oro Gold
  const [selectedEnv, setSelectedEnv] = useState(REAL_ENVIRONMENTS[0]); // Default Lake Como Dawn
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [cameraView, setCameraView] = useState<'hero' | 'profile' | 'front' | 'cockpit' | 'rear'>('hero');
  const [isRotating, setIsRotating] = useState(true);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const rimMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const headlightLightsRef = useRef<THREE.SpotLight[]>([]);
  const headlightConesRef = useRef<THREE.Mesh[]>([]);
  const overheadSpotRef = useRef<THREE.SpotLight | null>(null);
  const pmremRef = useRef<THREE.PMREMGenerator | null>(null);

  // Camera Interpolation Targets
  const targetCamPos = useRef(new THREE.Vector3(4.5, 1.8, 4.2));
  const currentCamPos = useRef(new THREE.Vector3(4.5, 1.8, 4.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.35, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.35, 0));

  // Mouse Drag Tracking
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // Web Audio Synthesizer
  const toggleAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.05, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(45, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, ctx.currentTime);

        osc1.connect(filter);
        filter.connect(masterGain);
        osc1.start();
        osc1Ref.current = osc1;

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(90, ctx.currentTime);
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
        audioCtxRef.current.close().catch(() => {});
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

  // Main Three.js Scene Setup with Real Surrounding
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 150);
    camera.position.set(4.5, 1.8, 4.2);
    camera.lookAt(0, 0.35, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Photorealistic 360° Real Environment Background & Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    pmremRef.current = pmremGenerator;

    const loadEnvMap = (hdrPath: string) => {
      new RGBELoader().load(
        hdrPath,
        (hdrTexture) => {
          const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
          scene.environment = envMap;
          scene.background = envMap; // Set the 360° real photographic environment background!
          scene.backgroundBlurriness = 0.01;
          scene.backgroundIntensity = 1.05;
          hdrTexture.dispose();
        },
        undefined,
        (err) => console.warn('HDR load failed:', err)
      );
    };

    loadEnvMap(selectedEnv.file);

    // 5. Studio & Sun Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunSpot = new THREE.SpotLight(selectedEnv.lightColor, selectedEnv.lightIntensity);
    sunSpot.position.set(8, 16, 8);
    sunSpot.angle = Math.PI / 4.2;
    sunSpot.penumbra = 0.6;
    sunSpot.decay = 1.1;
    scene.add(sunSpot);
    overheadSpotRef.current = sunSpot;

    const goldBacklight = new THREE.PointLight(0xd4af37, 2.2, 35);
    goldBacklight.position.set(-8, 4, -8);
    scene.add(goldBacklight);

    // 6. REAL PHYSICAL GROUND ROADWAY (Asphalt, markings, curbs & guardrail)
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    // A. Main Asphalt Road Geometry
    const asphaltTexture = generateAsphaltTexture();
    const roadMaterial = new THREE.MeshStandardMaterial({
      map: asphaltTexture,
      roughness: 0.35,
      metalness: 0.25,
      envMapIntensity: 1.1
    });

    const roadGeo = new THREE.PlaneGeometry(24, 120);
    const roadMesh = new THREE.Mesh(roadGeo, roadMaterial);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = 0.002;
    roadGroup.add(roadMesh);

    // B. Beveled Curbs & Road Shoulder Along Edge
    const curbGeo = new THREE.BoxGeometry(0.6, 0.16, 120);
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x2b3340,
      roughness: 0.7,
      metalness: 0.1
    });

    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-10.5, 0.08, 0);
    roadGroup.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(10.5, 0.08, 0);
    roadGroup.add(rightCurb);

    // C. Highway Guardrail with Reflective Stanchions
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x9ba6b8,
      metalness: 0.9,
      roughness: 0.25
    });

    const createGuardrail = (x: number) => {
      const railMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 120), railMat);
      railMesh.position.set(x, 0.55, 0);
      roadGroup.add(railMesh);

      // Support posts every 6 meters
      for (let z = -54; z <= 54; z += 6) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8), railMat);
        post.position.set(x, 0.28, z);
        roadGroup.add(post);

        // Safety reflector studs
        const stud = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.08, 0.08),
          new THREE.MeshBasicMaterial({ color: 0xfacc15 })
        );
        stud.position.set(x + (x > 0 ? -0.1 : 0.1), 0.55, z);
        roadGroup.add(stud);
      }
    };

    createGuardrail(-11.2);
    createGuardrail(11.2);

    // 7. PBR Automotive Supercar Materials
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedFinish.hex),
      metalness: selectedFinish.metalness,
      roughness: selectedFinish.roughness,
      clearcoat: selectedFinish.clearcoat,
      clearcoatRoughness: selectedFinish.clearcoatRoughness
    });
    bodyMaterialRef.current = bodyMat;

    const rimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.rimColor),
      metalness: 0.95,
      roughness: 0.2
    });
    rimMaterialRef.current = rimMat;

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.05,
      transmission: 0.95,
      ior: 1.52,
      transparent: true,
      opacity: 0.75
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      metalness: 0.85,
      roughness: 0.4
    });

    // 8. Load Real High-Poly Supercar Model (GLTF + DRACO)
    const carRootGroup = new THREE.Group();
    carGroupRef.current = carRootGroup;
    scene.add(carRootGroup);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    wheelsRef.current = [];

    gltfLoader.load(
      '/models/supercar.glb',
      (gltf) => {
        const carModel = gltf.scene;

        // Auto-center and ground on asphalt
        const box = new THREE.Box3().setFromObject(carModel);
        const center = box.getCenter(new THREE.Vector3());
        carModel.position.sub(center);
        carModel.position.y += (box.max.y - box.min.y) * 0.48;

        // Assign PBR materials to node names
        const bodyObj = carModel.getObjectByName('body');
        if (bodyObj && (bodyObj as THREE.Mesh).isMesh) {
          (bodyObj as THREE.Mesh).material = bodyMat;
        }

        const glassObj = carModel.getObjectByName('glass');
        if (glassObj && (glassObj as THREE.Mesh).isMesh) {
          (glassObj as THREE.Mesh).material = glassMat;
        }

        const trimObj = carModel.getObjectByName('trim');
        if (trimObj && (trimObj as THREE.Mesh).isMesh) {
          (trimObj as THREE.Mesh).material = carbonMat;
        }

        ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl'].forEach(name => {
          const rimObj = carModel.getObjectByName(name);
          if (rimObj && (rimObj as THREE.Mesh).isMesh) {
            (rimObj as THREE.Mesh).material = rimMat;
          }
        });

        // Store wheels for synchronized rotation
        ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].forEach(name => {
          const w = carModel.getObjectByName(name);
          if (w) wheelsRef.current.push(w);
        });

        // Contact Ambient Occlusion Ground Shadow on Road
        const shadowTexture = new THREE.TextureLoader().load('/models/supercar_ao.png');
        const shadowPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(2.7, 5.4),
          new THREE.MeshBasicMaterial({
            map: shadowTexture,
            blending: THREE.MultiplyBlending,
            toneMapped: false,
            transparent: true,
            opacity: 0.88
          })
        );
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = 0.015;
        shadowPlane.renderOrder = 2;
        carRootGroup.add(shadowPlane);

        // Projector High-Beam Headlamps Illuminating the Road Ahead
        headlightLightsRef.current = [];
        headlightConesRef.current = [];

        const createHeadlight = (x: number) => {
          const spot = new THREE.SpotLight(0xa5d8ff, 6.0, 22, Math.PI / 5.5, 0.4, 1.2);
          spot.position.set(x, 0.55, 1.95);
          spot.target.position.set(x * 1.5, 0.05, 14);
          carRootGroup.add(spot);
          carRootGroup.add(spot.target);
          headlightLightsRef.current.push(spot);

          const beamGeo = new THREE.ConeGeometry(0.85, 7.5, 16, 1, true);
          beamGeo.rotateX(Math.PI / 2);
          beamGeo.translate(x, 0.55, 5.8);
          const beamMat = new THREE.MeshBasicMaterial({
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.16,
            side: THREE.DoubleSide
          });
          const coneMesh = new THREE.Mesh(beamGeo, beamMat);
          carRootGroup.add(coneMesh);
          headlightConesRef.current.push(coneMesh);
        };

        createHeadlight(0.65);
        createHeadlight(-0.65);

        carRootGroup.add(carModel);
        setModelLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => console.error('Supercar GLTF load error:', err)
    );

    // 9. Interactive Drag to Orbit
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      if (carGroupRef.current) {
        carGroupRef.current.rotation.y += dx * 0.007;
      }
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

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

    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 10. 60 FPS Render Loop
    let animId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;

      currentCamPos.current.lerp(targetCamPos.current, 0.045);
      currentLookAt.current.lerp(targetLookAt.current, 0.045);

      if (cameraRef.current) {
        cameraRef.current.position.copy(currentCamPos.current);
        cameraRef.current.lookAt(currentLookAt.current);
      }

      if (isRotating && !isDraggingRef.current && carGroupRef.current) {
        carGroupRef.current.rotation.y += 0.0035;
      }

      wheelsRef.current.forEach(wheel => {
        wheel.rotation.x = time * 4.2;
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

  // Synchronize Paint Livery
  useEffect(() => {
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(selectedFinish.hex);
      bodyMaterialRef.current.metalness = selectedFinish.metalness;
      bodyMaterialRef.current.roughness = selectedFinish.roughness;
      bodyMaterialRef.current.clearcoat = selectedFinish.clearcoat;
      bodyMaterialRef.current.clearcoatRoughness = selectedFinish.clearcoatRoughness;
    }
    if (rimMaterialRef.current) {
      rimMaterialRef.current.color.set(selectedFinish.rimColor);
    }
  }, [selectedFinish]);

  // Handle Real Environment Switching
  const handleSelectEnvironment = (env: typeof REAL_ENVIRONMENTS[0]) => {
    setSelectedEnv(env);
    if (!sceneRef.current || !pmremRef.current) return;

    const pmrem = pmremRef.current;
    new RGBELoader().load(
      env.file,
      (hdrTexture) => {
        if (!sceneRef.current) return;
        const envMap = pmrem.fromEquirectangular(hdrTexture).texture;
        sceneRef.current.environment = envMap;
        sceneRef.current.background = envMap;
        sceneRef.current.backgroundBlurriness = 0.01;
        sceneRef.current.backgroundIntensity = 1.05;
        hdrTexture.dispose();

        if (overheadSpotRef.current) {
          overheadSpotRef.current.color.set(env.lightColor);
          overheadSpotRef.current.intensity = env.lightIntensity;
        }
      },
      undefined,
      (err) => console.warn('HDR reload failed:', err)
    );
  };

  // Toggle Headlights
  const toggleHeadlights = () => {
    const nextState = !headlightsOn;
    setHeadlightsOn(nextState);
    headlightLightsRef.current.forEach(l => {
      l.intensity = nextState ? 6.0 : 0;
    });
    headlightConesRef.current.forEach(c => {
      c.visible = nextState;
    });
  };

  // Camera Angles
  const setPresetView = (view: 'hero' | 'profile' | 'front' | 'cockpit' | 'rear') => {
    setCameraView(view);
    setActiveHotspot(null);

    switch (view) {
      case 'hero':
        targetCamPos.current.set(4.5, 1.8, 4.2);
        targetLookAt.current.set(0, 0.35, 0);
        break;
      case 'profile':
        targetCamPos.current.set(5.8, 1.2, 0);
        targetLookAt.current.set(0, 0.35, 0);
        break;
      case 'front':
        targetCamPos.current.set(0, 0.9, 4.8);
        targetLookAt.current.set(0, 0.45, 0);
        break;
      case 'cockpit':
        targetCamPos.current.set(0.65, 1.45, 0.65);
        targetLookAt.current.set(-0.15, 0.75, 0.05);
        break;
      case 'rear':
        targetCamPos.current.set(0, 1.1, -4.6);
        targetLookAt.current.set(0, 0.35, 0);
        break;
    }
  };

  const handleSelectHotspot = (spot: Hotspot) => {
    setActiveHotspot(spot);
    setIsRotating(false);
    targetCamPos.current.set(...spot.cameraPos);
    targetLookAt.current.set(...spot.lookAt);
  };

  const handleCloseHotspot = () => {
    setActiveHotspot(null);
    setPresetView('hero');
    setIsRotating(true);
  };

  return (
    <div className="relative w-full min-h-[660px] lg:min-h-[780px] bg-dark-950 border-b border-dark-800 overflow-hidden flex flex-col justify-between select-none">
      {/* Top Architectural Marque Header */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between border-b border-white/10 pb-4 backdrop-blur-md bg-dark-950/40 rounded-b-2xl">
        {/* Left: Latin Brand Axiom */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-gold-500/60 flex items-center justify-center text-gold-400 font-heading text-xs font-black shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-dark-950/80">
            JKD
          </div>
          <div>
            <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-gold-400 font-bold block">
              "NULLA TENACI INVIA EST VIA"
            </span>
            <span className="text-[9px] tracking-[0.16em] uppercase text-dark-300 font-mono">
              For The Tenacious, No Road Is Impassable • Est. Accra 2026
            </span>
          </div>
        </div>

        {/* Right: Audio Ambience & Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAudio}
            className={`px-3 py-1.5 rounded-full border text-[10px] tracking-[0.14em] uppercase font-bold flex items-center gap-2 transition-all ${
              isAudioActive
                ? 'bg-gold-500/20 border-gold-500/80 text-gold-300 shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                : 'bg-dark-950/80 border-dark-700 text-dark-300 hover:text-white'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-gold-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">V8 Audio: {isAudioActive ? 'Active' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={toggleHeadlights}
            className={`px-3 py-1.5 rounded-full border text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors ${
              headlightsOn 
                ? 'bg-blue-500/30 border-blue-400 text-blue-200 shadow-[0_0_15px_rgba(96,165,250,0.3)]' 
                : 'bg-dark-950/80 border-dark-700 text-dark-300 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3 h-3 text-blue-400" />
            <span className="hidden md:inline">LED Headlamps</span>
          </button>

          <button
            type="button"
            onClick={onOpenFlyerModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-950/80 border border-gold-500/40 text-gold-400 text-[10px] tracking-wider uppercase font-semibold hover:bg-gold-500/10 transition-colors"
          >
            <Eye className="w-3 h-3 text-gold-400" />
            <span>Official Atelier Flyer</span>
          </button>
        </div>
      </div>

      {/* Center 3D WebGL Canvas Viewport with 360° Real Environment */}
      <div className="relative flex-1 w-full flex items-center justify-center my-1">
        <div
          ref={mountRef}
          className="w-full h-[520px] sm:h-[600px] lg:h-[680px] cursor-grab active:cursor-grabbing"
        />

        {/* Loading Spinner */}
        {!modelLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-950/90 backdrop-blur-md z-30 space-y-3">
            <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin" />
            <span className="text-xs font-mono tracking-widest text-gold-400 uppercase">
              Loading 360° Real Surrounding & Geometry... {loadProgress > 0 && `${loadProgress}%`}
            </span>
          </div>
        )}

        {/* Top Left: Real Environment Selector Pills */}
        <div className="absolute top-4 left-4 sm:left-8 z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-950/85 border border-gold-500/40 text-gold-400 backdrop-blur-md font-mono text-[10px]">
            <Globe2 className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-bold tracking-wider">360° REAL SURROUNDING:</span>
            <span className="text-white uppercase font-semibold">{selectedEnv.name}</span>
          </div>

          <div className="flex items-center gap-1 bg-dark-950/85 p-1 rounded-xl border border-dark-700/80 backdrop-blur-md">
            {REAL_ENVIRONMENTS.map(env => {
              const Icon = env.icon;
              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => handleSelectEnvironment(env)}
                  title={env.description}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                    selectedEnv.id === env.id
                      ? 'bg-gold-500 text-dark-950 shadow-md'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{env.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Right: Camera Presets */}
        <div className="absolute top-4 right-4 sm:right-8 z-10 flex flex-col items-end gap-1.5">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white font-mono drop-shadow">
            Observation Angle
          </span>
          <div className="flex items-center gap-1 bg-dark-950/85 p-1 rounded-xl border border-dark-700/80 backdrop-blur-md">
            {[
              { id: 'hero', label: '3/4 Hero' },
              { id: 'profile', label: 'Profile' },
              { id: 'front', label: 'Front' },
              { id: 'cockpit', label: 'Cockpit' },
              { id: 'rear', label: 'Rear' }
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

        {/* Floating Numbered Hotspot Pins */}
        {modelLoaded && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-full max-w-4xl h-full">
              {HOTSPOTS.map((spot, i) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleSelectHotspot(spot)}
                  className="pointer-events-auto absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${42 + (i % 2 === 0 ? -12 : 12)}%`
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-gold-400/30 animate-ping" />
                    <span className="w-6 h-6 rounded-full bg-dark-950 border-2 border-gold-400 flex items-center justify-center text-[10px] font-black text-gold-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] group-hover:scale-125 transition-transform">
                      {i + 1}
                    </span>
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap hidden group-hover:block px-3 py-1.5 rounded-lg bg-dark-950/95 border border-gold-500/50 text-[10px] font-mono text-gold-300 backdrop-blur-md shadow-2xl">
                      {spot.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Hotspot Specification Drawer */}
        {activeHotspot && (
          <div className="absolute bottom-20 left-4 sm:left-8 right-4 sm:right-auto sm:max-w-md z-30 p-6 rounded-3xl bg-dark-950/95 border border-gold-500/60 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between gap-3 border-b border-dark-800 pb-3 mb-3">
              <div>
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-gold-400 block font-bold">
                  Bespoke Craftsmanship Spec
                </span>
                <h4 className="font-heading text-lg font-bold text-white tracking-tight">
                  {activeHotspot.name}
                </h4>
                <p className="text-xs text-gold-400/80 font-medium">{activeHotspot.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseHotspot}
                className="text-dark-400 hover:text-white p-1.5 rounded-lg bg-dark-900 border border-dark-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-dark-300 leading-relaxed mb-4">
              {activeHotspot.desc}
            </p>

            <div className="grid grid-cols-1 gap-2 border-t border-dark-800/80 pt-3">
              {activeHotspot.specs.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-dark-400 text-[11px]">{s.label}:</span>
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
                <span>View Sourced Inventory</span>
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
          <div className="px-4 py-1.5 rounded-full bg-dark-950/85 border border-dark-700/80 text-[11px] text-white backdrop-blur-md flex items-center gap-2 shadow-2xl">
            <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
            <span>Orbit 360° to explore real surroundings • Click numbered beacons to zoom components</span>
          </div>
        </div>
      </div>

      {/* Bottom Aircraft Control Deck & Color Palette */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 border-t border-white/10 bg-dark-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-6 rounded-t-2xl">
        {/* Color Palette Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-dark-300">
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

        {/* Active Surrounding Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-dark-300">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span>Surrounding: <strong>{selectedEnv.name}</strong> ({selectedEnv.badge})</span>
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
