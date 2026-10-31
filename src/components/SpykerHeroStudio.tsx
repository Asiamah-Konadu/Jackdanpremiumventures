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
  Lightbulb, 
  Camera, 
  Sun, 
  Mountain, 
  Building, 
  Anchor, 
  Globe2,
  FileText,
  Sliders,
  Printer,
  Download,
  Ruler,
  Cpu,
  Zap,
  Activity,
  Share2
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface SpykerHeroStudioProps {
  onNavigatePage: (page: string) => void;
  onOpenFlyerModal: () => void;
}

type StudioTab = '3d-studio' | 'blueprint' | 'powertrain' | 'homologation';

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

// Real Reference Vehicles available for Blueprint inspection
const REFERENCE_CARS = [
  {
    id: 'supercar',
    name: 'Spyker Preliator XXV / Ferrari 458 Italia',
    class: 'Mid-Engine V8 Berlinetta',
    length: 4628,
    wheelbase: 2725,
    width: 1951,
    height: 1214,
    weight: 1390,
    power: '605 PS (597 hp) @ 9,000 RPM',
    torque: '540 Nm @ 6,000 RPM',
    acceleration: '3.4 s (0-100 km/h)',
    topSpeed: '325 km/h (202 mph)',
    hsCode: '8703.24.90.00',
    clearanceClass: 'Tier-1 Luxury Sports Coupe'
  },
  {
    id: 'g63',
    name: 'Mercedes-AMG G63 Bi-Turbo V8',
    class: 'Luxury Heavy-Duty Off-Road SUV',
    length: 4873,
    wheelbase: 2890,
    width: 1984,
    height: 1969,
    weight: 2560,
    power: '585 PS (577 hp) @ 6,000 RPM',
    torque: '850 Nm @ 2,500-3,500 RPM',
    acceleration: '4.5 s (0-100 km/h)',
    topSpeed: '240 km/h (149 mph)',
    hsCode: '8703.24.90.00',
    clearanceClass: 'High-Demand Executive 4x4'
  },
  {
    id: 'lc300',
    name: 'Toyota Land Cruiser 300 VXR Twin-Turbo',
    class: 'All-Terrain Executive Safari Flagship',
    length: 4980,
    wheelbase: 2850,
    width: 1980,
    height: 1945,
    weight: 2630,
    power: '415 PS (409 hp) @ 5,200 RPM',
    torque: '650 Nm @ 2,000-3,600 RPM',
    acceleration: '6.7 s (0-100 km/h)',
    topSpeed: '210 km/h (130 mph)',
    hsCode: '8703.24.90.00',
    clearanceClass: 'Ghana Prestige Utility Fleet'
  }
];

// Procedural Canvas Asphalt Texture Generator
const generateAsphaltTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#10141a';
  ctx.fillRect(0, 0, 1024, 1024);

  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 32;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.fillStyle = '#e8be5b';
  ctx.fillRect(504, 0, 6, 1024);
  ctx.fillRect(514, 0, 6, 1024);

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
  const [activeTab, setActiveTab] = useState<StudioTab>('3d-studio');
  const [selectedFinish, setSelectedFinish] = useState(PAINT_FINISHES[0]);
  const [selectedEnv, setSelectedEnv] = useState(REAL_ENVIRONMENTS[0]);
  const [selectedReferenceCar, setSelectedReferenceCar] = useState(REFERENCE_CARS[0]);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
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

  // Main Three.js Scene Setup (Only runs when 3D Studio tab is active or mounted)
  useEffect(() => {
    if (activeTab !== '3d-studio') return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 150);
    camera.position.set(4.5, 1.8, 4.2);
    camera.lookAt(0, 0.35, 0);
    cameraRef.current = camera;

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

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    pmremRef.current = pmremGenerator;

    const loadEnvMap = (hdrPath: string) => {
      new RGBELoader().load(
        hdrPath,
        (hdrTexture) => {
          const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
          scene.environment = envMap;
          scene.background = envMap;
          scene.backgroundBlurriness = 0.01;
          scene.backgroundIntensity = 1.05;
          hdrTexture.dispose();
        },
        undefined,
        (err) => console.warn('HDR load failed:', err)
      );
    };

    loadEnvMap(selectedEnv.file);

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

    // Ground Roadway
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

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

    // Curbs
    const curbGeo = new THREE.BoxGeometry(0.6, 0.16, 120);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x2b3340, roughness: 0.7, metalness: 0.1 });
    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-10.5, 0.08, 0);
    roadGroup.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(10.5, 0.08, 0);
    roadGroup.add(rightCurb);

    // Guardrails
    const railMat = new THREE.MeshStandardMaterial({ color: 0x9ba6b8, metalness: 0.9, roughness: 0.25 });
    const createGuardrail = (x: number) => {
      const railMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 120), railMat);
      railMesh.position.set(x, 0.55, 0);
      roadGroup.add(railMesh);

      for (let z = -54; z <= 54; z += 6) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8), railMat);
        post.position.set(x, 0.28, z);
        roadGroup.add(post);

        const stud = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        stud.position.set(x + (x > 0 ? -0.1 : 0.1), 0.55, z);
        roadGroup.add(stud);
      }
    };
    createGuardrail(-11.2);
    createGuardrail(11.2);

    // Materials
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

    // GLTF Model
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
        const box = new THREE.Box3().setFromObject(carModel);
        const center = box.getCenter(new THREE.Vector3());
        carModel.position.sub(center);
        carModel.position.y += (box.max.y - box.min.y) * 0.48;

        const bodyObj = carModel.getObjectByName('body');
        if (bodyObj && (bodyObj as THREE.Mesh).isMesh) (bodyObj as THREE.Mesh).material = bodyMat;

        const glassObj = carModel.getObjectByName('glass');
        if (glassObj && (glassObj as THREE.Mesh).isMesh) (glassObj as THREE.Mesh).material = glassMat;

        const trimObj = carModel.getObjectByName('trim');
        if (trimObj && (trimObj as THREE.Mesh).isMesh) (trimObj as THREE.Mesh).material = carbonMat;

        ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl'].forEach(name => {
          const rimObj = carModel.getObjectByName(name);
          if (rimObj && (rimObj as THREE.Mesh).isMesh) (rimObj as THREE.Mesh).material = rimMat;
        });

        ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].forEach(name => {
          const w = carModel.getObjectByName(name);
          if (w) wheelsRef.current.push(w);
        });

        // Contact AO shadow
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

        // Headlights
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
          const beamMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.16, side: THREE.DoubleSide });
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
        if (xhr.total > 0) setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
      },
      (err) => console.error('Supercar GLTF load error:', err)
    );

    // Orbit
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      if (carGroupRef.current) carGroupRef.current.rotation.y += dx * 0.007;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDraggingRef.current = false; };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseRef.current.x;
      if (carGroupRef.current) carGroupRef.current.rotation.y += dx * 0.009;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDraggingRef.current = false; };

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
      if (container.contains(domEl)) container.removeChild(domEl);
    };
  }, [activeTab, isRotating]);

  // Synchronize Paint
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

  // Environment Switcher
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

  const toggleHeadlights = () => {
    const nextState = !headlightsOn;
    setHeadlightsOn(nextState);
    headlightLightsRef.current.forEach(l => { l.intensity = nextState ? 6.0 : 0; });
    headlightConesRef.current.forEach(c => { c.visible = nextState; });
  };

  const setPresetView = (view: 'hero' | 'profile' | 'front' | 'cockpit' | 'rear') => {
    setCameraView(view);
    setActiveHotspot(null);
    switch (view) {
      case 'hero': targetCamPos.current.set(4.5, 1.8, 4.2); targetLookAt.current.set(0, 0.35, 0); break;
      case 'profile': targetCamPos.current.set(5.8, 1.2, 0); targetLookAt.current.set(0, 0.35, 0); break;
      case 'front': targetCamPos.current.set(0, 0.9, 4.8); targetLookAt.current.set(0, 0.45, 0); break;
      case 'cockpit': targetCamPos.current.set(0.65, 1.45, 0.65); targetLookAt.current.set(-0.15, 0.75, 0.05); break;
      case 'rear': targetCamPos.current.set(0, 1.1, -4.6); targetLookAt.current.set(0, 0.35, 0); break;
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

  const handlePrintReference = () => {
    window.print();
  };

  return (
    <div 
      id="hero"
      className="relative w-full min-h-[720px] lg:min-h-[820px] bg-dark-950 border-b border-dark-800 overflow-hidden flex flex-col justify-between select-none pt-24 sm:pt-28 lg:pt-32"
    >
      {/* Top Header: Latin Axiom & Mode Tabs */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 border border-white/10 backdrop-blur-md bg-dark-950/80 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold-500/60 flex items-center justify-center text-gold-400 font-heading text-xs font-black shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-dark-950/80">
            JKD
          </div>
          <div>
            <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-gold-400 font-bold block">
              "NULLA TENACI INVIA EST VIA"
            </span>
            <span className="text-[9px] tracking-[0.16em] uppercase text-dark-300 font-mono">
              The Marque Atelier & Automotive Technical Reference • Est. Accra 2026
            </span>
          </div>
        </div>

        {/* Center: Major Studio & Reference Sheet Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-dark-900/90 rounded-2xl border border-gold-500/30 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => setActiveTab('3d-studio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === '3d-studio'
                ? 'bg-gold-500 text-dark-950 shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>3D Real Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blueprint')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'blueprint'
                ? 'bg-gold-500 text-dark-950 shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Engineering Blueprint</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('powertrain')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'powertrain'
                ? 'bg-gold-500 text-dark-950 shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Powertrain X-Ray</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('homologation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'homologation'
                ? 'bg-gold-500 text-dark-950 shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Homologation Dossier</span>
          </button>
        </div>

        {/* Right: Sound & Action Controls */}
        <div className="flex items-center gap-2.5">
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
            <span className="hidden sm:inline">Engine: {isAudioActive ? 'Active' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenFlyerModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-950/80 border border-gold-500/40 text-gold-400 text-[10px] tracking-wider uppercase font-semibold hover:bg-gold-500/10 transition-colors"
          >
            <Eye className="w-3 h-3 text-gold-400" />
            <span>Brand Flyer</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 3D REAL STUDIO VIEWPORT */}
      {activeTab === '3d-studio' && (
        <div className="relative flex-1 w-full flex items-center justify-center my-1">
          <div
            ref={mountRef}
            className="w-full h-[520px] sm:h-[600px] lg:h-[680px] cursor-grab active:cursor-grabbing"
          />

          {/* Loading */}
          {!modelLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-950/90 backdrop-blur-md z-30 space-y-3">
              <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin" />
              <span className="text-xs font-mono tracking-widest text-gold-400 uppercase">
                Loading 360° Real Surrounding & Geometry... {loadProgress > 0 && `${loadProgress}%`}
              </span>
            </div>
          )}

          {/* Top Left: Environment Selector */}
          <div className="absolute top-4 left-4 sm:left-8 z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-950/85 border border-gold-500/40 text-gold-400 backdrop-blur-md font-mono text-[10px]">
              <Globe2 className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-bold tracking-wider">360° SURROUNDING:</span>
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

          {/* Top Right: Camera Angles & Headlights */}
          <div className="absolute top-4 right-4 sm:right-8 z-10 flex flex-col items-end gap-2">
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

            <button
              type="button"
              onClick={toggleHeadlights}
              className={`px-3 py-1 rounded-full border text-[10px] font-mono tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors backdrop-blur-md ${
                headlightsOn 
                  ? 'bg-blue-500/30 border-blue-400 text-blue-200 shadow-[0_0_15px_rgba(96,165,250,0.3)]' 
                  : 'bg-dark-950/80 border-dark-700 text-dark-300 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3 h-3 text-blue-400" />
              <span>Projector LED Rays</span>
            </button>
          </div>

          {/* Hotspots */}
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

          {/* Specification Drawer */}
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

          {/* Drag instruction */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none z-10">
            <div className="px-4 py-1.5 rounded-full bg-dark-950/85 border border-dark-700/80 text-[11px] text-white backdrop-blur-md flex items-center gap-2 shadow-2xl">
              <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
              <span>Orbit 360° to explore real surroundings • Click numbered beacons to zoom components</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECHNICAL BLUEPRINT REFERENCE SHEET */}
      {activeTab === 'blueprint' && (
        <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
          {/* Blueprint Header */}
          <div className="p-6 rounded-3xl bg-[#07101b] border-2 border-cyan-500/40 shadow-2xl space-y-6 relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.1),transparent_50%)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>CAD Homologation Blueprint Reference Sheet</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
                  {selectedReferenceCar.name}
                </h3>
                <p className="text-cyan-400 text-xs font-mono mt-0.5">
                  Specification Class: {selectedReferenceCar.class} • Chassis Clearance Code: JKD-REF-458
                </p>
              </div>

              {/* Units & Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-dark-900 p-1 rounded-xl border border-cyan-500/30">
                  <button
                    type="button"
                    onClick={() => setUnitSystem('metric')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      unitSystem === 'metric' ? 'bg-cyan-500 text-dark-950 shadow' : 'text-dark-300 hover:text-white'
                    }`}
                  >
                    METRIC (mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem('imperial')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      unitSystem === 'imperial' ? 'bg-cyan-500 text-dark-950 shadow' : 'text-dark-300 hover:text-white'
                    }`}
                  >
                    IMPERIAL (in)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePrintReference}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Blueprint</span>
                </button>
              </div>
            </div>

            {/* 4-View Orthographic Blueprint Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
              {/* View 1: Side Profile Elevation */}
              <div className="p-5 rounded-2xl bg-dark-950/80 border border-cyan-500/30 space-y-3 relative group">
                <div className="flex items-center justify-between text-xs text-cyan-400 border-b border-dark-800 pb-2">
                  <span className="font-bold">01 / SIDE PROFILE ELEVATION</span>
                  <span>SCALE 1:25</span>
                </div>
                
                {/* Vector Silhouette Simulation */}
                <div className="h-44 rounded-xl bg-[#040810] border border-cyan-500/20 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06),transparent)]">
                  {/* Caliper lines */}
                  <div className="absolute inset-x-8 top-4 flex items-center justify-between text-[10px] text-cyan-400 border-b border-dashed border-cyan-500/40 pb-1">
                    <span>OVERALL LENGTH</span>
                    <span className="font-bold text-white">
                      {unitSystem === 'metric' ? `${selectedReferenceCar.length} mm` : `${(selectedReferenceCar.length / 25.4).toFixed(1)} in`}
                    </span>
                  </div>

                  {/* Car SVG Profile */}
                  <svg className="w-full max-w-sm h-24 stroke-cyan-400 fill-cyan-500/10" viewBox="0 0 400 120">
                    <path d="M 30,85 L 70,85 C 75,70 95,70 100,85 L 290,85 C 295,70 315,70 320,85 L 375,85 C 385,85 390,75 385,60 C 375,45 340,40 310,38 C 270,36 240,20 180,20 C 130,20 100,38 70,45 C 40,52 25,65 25,75 Z" strokeWidth="2" strokeDasharray="none" />
                    {/* Wheels */}
                    <circle cx="85" cy="85" r="16" stroke="currentColor" strokeWidth="2" fill="#07101b" />
                    <circle cx="85" cy="85" r="8" stroke="#e8be5b" strokeWidth="1.5" fill="none" />
                    <circle cx="305" cy="85" r="16" stroke="currentColor" strokeWidth="2" fill="#07101b" />
                    <circle cx="305" cy="85" r="8" stroke="#e8be5b" strokeWidth="1.5" fill="none" />
                    {/* Cockpit Canopy */}
                    <path d="M 125,40 C 145,26 175,24 220,24 C 255,24 275,32 290,40 Z" strokeWidth="1.5" fill="rgba(56,189,248,0.2)" />
                  </svg>

                  {/* Wheelbase Dimension */}
                  <div className="absolute inset-x-20 bottom-3 flex items-center justify-between text-[10px] text-gold-400 border-t border-dashed border-gold-500/40 pt-0.5">
                    <span>WHEELBASE</span>
                    <span className="font-bold text-white">
                      {unitSystem === 'metric' ? `${selectedReferenceCar.wheelbase} mm` : `${(selectedReferenceCar.wheelbase / 25.4).toFixed(1)} in`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-dark-400 block text-[9px]">HEIGHT:</span>
                    <strong className="text-white">{unitSystem === 'metric' ? `${selectedReferenceCar.height} mm` : `${(selectedReferenceCar.height / 25.4).toFixed(1)} in`}</strong>
                  </div>
                  <div>
                    <span className="text-dark-400 block text-[9px]">GROUND CLEARANCE:</span>
                    <strong className="text-white">110 mm (4.3 in)</strong>
                  </div>
                  <div>
                    <span className="text-dark-400 block text-[9px]">DRAG COEFFICIENT:</span>
                    <strong className="text-cyan-400">0.32 Cd</strong>
                  </div>
                </div>
              </div>

              {/* View 2: Front & Rear Elevation */}
              <div className="p-5 rounded-2xl bg-dark-950/80 border border-cyan-500/30 space-y-3 relative group">
                <div className="flex items-center justify-between text-xs text-cyan-400 border-b border-dark-800 pb-2">
                  <span className="font-bold">02 / FRONT & REAR AERODYNAMIC ELEVATION</span>
                  <span>WIDTH: {unitSystem === 'metric' ? `${selectedReferenceCar.width} mm` : `${(selectedReferenceCar.width / 25.4).toFixed(1)} in`}</span>
                </div>

                <div className="h-44 rounded-xl bg-[#040810] border border-cyan-500/20 flex items-center justify-around p-4 relative overflow-hidden">
                  {/* Front View SVG */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-dark-400 mb-1">FRONT FASCIA</span>
                    <svg className="w-36 h-24 stroke-cyan-400 fill-cyan-500/10" viewBox="0 0 160 100">
                      <path d="M 20,70 L 30,70 L 35,45 L 50,30 L 110,30 L 125,45 L 130,70 L 140,70 L 135,78 L 25,78 Z" strokeWidth="2" />
                      {/* Headlights */}
                      <polygon points="38,48 52,44 48,52" fill="#60a5fa" stroke="none" />
                      <polygon points="122,48 108,44 112,52" fill="#60a5fa" stroke="none" />
                      {/* Radiator Grille */}
                      <rect x="55" y="62" width="50" height="12" stroke="#e8be5b" strokeWidth="1" fill="none" />
                      {/* Tyres */}
                      <rect x="18" y="55" width="12" height="25" fill="#11161d" stroke="currentColor" strokeWidth="1" />
                      <rect x="130" y="55" width="12" height="25" fill="#11161d" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>

                  <div className="h-28 w-px bg-dark-800" />

                  {/* Rear View SVG */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-dark-400 mb-1">REAR DIFFUSER</span>
                    <svg className="w-36 h-24 stroke-cyan-400 fill-cyan-500/10" viewBox="0 0 160 100">
                      <path d="M 20,70 L 35,48 L 50,32 L 110,32 L 125,48 L 140,70 L 135,78 L 25,78 Z" strokeWidth="2" />
                      {/* Tailpipes */}
                      <circle cx="70" cy="72" r="3.5" fill="#e8be5b" stroke="none" />
                      <circle cx="80" cy="72" r="3.5" fill="#e8be5b" stroke="none" />
                      <circle cx="90" cy="72" r="3.5" fill="#e8be5b" stroke="none" />
                      {/* Diffuser fins */}
                      <line x1="50" y1="72" x2="50" y2="78" strokeWidth="1.5" stroke="#38bdf8" />
                      <line x1="60" y1="72" x2="60" y2="78" strokeWidth="1.5" stroke="#38bdf8" />
                      <line x1="100" y1="72" x2="100" y2="78" strokeWidth="1.5" stroke="#38bdf8" />
                      <line x1="110" y1="72" x2="110" y2="78" strokeWidth="1.5" stroke="#38bdf8" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-dark-400 block text-[9px]">FRONT TRACK:</span>
                    <strong className="text-white">1,668 mm (65.7 in)</strong>
                  </div>
                  <div>
                    <span className="text-dark-400 block text-[9px]">REAR TRACK:</span>
                    <strong className="text-white">1,642 mm (64.6 in)</strong>
                  </div>
                  <div>
                    <span className="text-dark-400 block text-[9px]">WEIGHT BIAS:</span>
                    <strong className="text-cyan-400">43% F / 57% R</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Switcher Footer */}
            <div className="pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-dark-300">Compare Reference Car:</span>
                <div className="flex items-center gap-1.5">
                  {REFERENCE_CARS.map(rc => (
                    <button
                      key={rc.id}
                      type="button"
                      onClick={() => setSelectedReferenceCar(rc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        selectedReferenceCar.id === rc.id
                          ? 'bg-cyan-500 text-dark-950 shadow-md'
                          : 'bg-dark-900 text-dark-300 border border-dark-700 hover:text-white'
                      }`}
                    >
                      {rc.name.split('/')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('3d-studio')}
                className="px-4 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg"
              >
                <span>Return to 3D Turntable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POWERTRAIN & CHASSIS X-RAY */}
      {activeTab === 'powertrain' && (
        <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
          <div className="p-8 rounded-3xl bg-[#090d16] border-2 border-gold-500/40 shadow-2xl space-y-6">
            <div className="border-b border-dark-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>Mechanical & Propulsion Architecture</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
                Mid-Engine 90° V8 Propulsion Architecture
              </h3>
              <p className="text-dark-300 text-xs sm:text-sm font-mono mt-1">
                Naturally aspirated & twin-turbo configurations engineered for high-rpm endurance and responsive throttle mapping.
              </p>
            </div>

            {/* Powertrain Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                <div className="flex items-center gap-2 text-gold-400 font-bold">
                  <Zap className="w-4 h-4" />
                  <span>OUTPUT & DYNO LOG</span>
                </div>
                <div className="space-y-2 text-dark-300">
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>Peak Power:</span>
                    <strong className="text-white">{selectedReferenceCar.power}</strong>
                  </div>
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>Peak Torque:</span>
                    <strong className="text-white">{selectedReferenceCar.torque}</strong>
                  </div>
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>0–100 km/h:</span>
                    <strong className="text-gold-400">{selectedReferenceCar.acceleration}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Speed:</span>
                    <strong className="text-white">{selectedReferenceCar.topSpeed}</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Activity className="w-4 h-4" />
                  <span>TRANSAXLE & GEARBOX</span>
                </div>
                <div className="space-y-2 text-dark-300">
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>Transmission:</span>
                    <strong className="text-white">7-Speed Dual-Clutch</strong>
                  </div>
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>Differential:</span>
                    <strong className="text-white">Electronic E-Diff3</strong>
                  </div>
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>Shift Speed:</span>
                    <strong className="text-blue-400">40 milliseconds</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Clutch Type:</span>
                    <strong className="text-white">Wet Multi-Plate</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CHASSIS & BRAKING</span>
                </div>
                <div className="space-y-2 text-dark-300">
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>Brembo Rotors:</span>
                    <strong className="text-white">398 mm Carbon Ceramic</strong>
                  </div>
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>Calipers:</span>
                    <strong className="text-white">6-Piston Monoblock</strong>
                  </div>
                  <div className="flex justify-between border-b border-dark-900 pb-1.5">
                    <span>Dampers:</span>
                    <strong className="text-emerald-400">Magnetorheological</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Suspension:</span>
                    <strong className="text-white">Double Wishbone Pushrod</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-800 flex items-center justify-between">
              <span className="text-xs text-dark-400 font-mono">
                Homologated for West African fuel ratings (Octane 95+ certified).
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('3d-studio')}
                className="px-4 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs font-mono"
              >
                Back to 3D Visualizer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOMOLOGATION SPECIFICATION DOSSIER */}
      {activeTab === 'homologation' && (
        <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
          <div className="p-8 rounded-3xl bg-dark-950 border-2 border-gold-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400 block font-bold">
                  Official Trade & Import Ledger
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
                  Homologation Technical Dossier
                </h3>
              </div>
              <a
                href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent('Hello Jackdan, I am reviewing your official Homologation Reference Sheet and would like to request vehicle allocation.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl gold-gradient-btn text-dark-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow"
              >
                <span>Request Allocation on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Comprehensive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-dark-800 text-gold-400 text-[11px]">
                    <th className="py-3 px-4">PARAMETER</th>
                    <th className="py-3 px-4">FACTORY SPECIFICATION</th>
                    <th className="py-3 px-4">GHANA CUSTOMS & GRA STANDARD</th>
                    <th className="py-3 px-4">VERIFICATION METHOD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-900 text-dark-300">
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Vehicle Model</td>
                    <td className="py-3 px-4">{selectedReferenceCar.name}</td>
                    <td className="py-3 px-4">HS Code: {selectedReferenceCar.hsCode}</td>
                    <td className="py-3 px-4 text-emerald-400">Title & VIN Match</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Engine Output</td>
                    <td className="py-3 px-4">{selectedReferenceCar.power}</td>
                    <td className="py-3 px-4">Exceeds 3,000 cc Duty Class</td>
                    <td className="py-3 px-4 text-emerald-400">Dyno Logged</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Dry Curb Weight</td>
                    <td className="py-3 px-4">{selectedReferenceCar.weight} kg ({Math.round(selectedReferenceCar.weight * 2.20462)} lbs)</td>
                    <td className="py-3 px-4">Tema Port Weighbridge Validated</td>
                    <td className="py-3 px-4 text-emerald-400">Scale Certified</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Emission Compliance</td>
                    <td className="py-3 px-4">Euro 6 / EPA Tier-3</td>
                    <td className="py-3 px-4">DVLA Roadworthy Verified</td>
                    <td className="py-3 px-4 text-emerald-400">Gas Analyzer Certified</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Clearing Procedure</td>
                    <td className="py-3 px-4">RoRo or 40HC Container Sealed</td>
                    <td className="py-3 px-4">ICUMS Electronic Broker Stamp</td>
                    <td className="py-3 px-4 text-emerald-400">Zero Demurrage Guaranteed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-dark-800 flex items-center justify-between">
              <span className="text-xs text-dark-400 font-mono">
                Official Document ID: JKD-TECH-HOMOLOGATION-2026-GH
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('3d-studio')}
                className="px-4 py-2 rounded-xl bg-dark-900 border border-dark-700 text-white font-bold text-xs font-mono hover:bg-dark-800"
              >
                Return to 3D Turntable
              </button>
            </div>
          </div>
        </div>
      )}

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
