import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Globe2, 
  Car, 
  FileText, 
  RotateCcw, 
  Play, 
  Pause, 
  Sparkles, 
  Eye, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface HeroWebGLShowcaseProps {
  onEnlargeFlyer: () => void;
  onNavigateInventory: () => void;
}

type ShowcaseMode = 'globe' | 'car' | 'flyer';

export const HeroWebGLShowcase: React.FC<HeroWebGLShowcaseProps> = ({
  onEnlargeFlyer,
  onNavigateInventory
}) => {
  const [mode, setMode] = useState<ShowcaseMode>('globe');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeHubInfo, setActiveHubInfo] = useState<string>('Tema Port, Ghana (Jackdan HQ)');
  const [webGLSupported, setWebGLSupported] = useState(true);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const pulseRingsRef = useRef<THREE.Mesh[]>([]);
  const arcPhotonsRef = useRef<{ curve: THREE.QuadraticBezierCurve3; photon: THREE.Mesh; progress: number; speed: number }[]>([]);
  const carWheelsRef = useRef<THREE.Group[]>([]);
  const roadGridRef = useRef<THREE.GridHelper | null>(null);

  // Convert Latitude & Longitude to 3D Cartesian coordinates on sphere
  const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (mode === 'flyer') return;

    const container = mountRef.current;
    if (!container) return;

    // Test WebGL support
    try {
      const canvasTest = document.createElement('canvas');
      const gl = canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 460;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 28);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xd4af37, 2.5, 50);
    goldPointLight.position.set(12, 16, 14);
    scene.add(goldPointLight);

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 2.0, 50);
    cyanPointLight.position.set(-14, -8, 12);
    scene.add(cyanPointLight);

    // ─── BUILD SCENE 1: HOLOGRAPHIC GLOBE & LOGISTICS ARCS ───
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const GLOBE_RADIUS = 8.5;

    // Outer atmosphere wireframe
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x223652,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const globeWire = new THREE.Mesh(globeGeo, wireframeMat);
    globeGroup.add(globeWire);

    // Inner dark sphere with subtle glow
    const innerGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x050811,
      transparent: true,
      opacity: 0.85
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // Shimmering Golden Latitude & Longitude Coordinate Rings
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.45
    });
    const equatorGeo = new THREE.BufferGeometry();
    const ringPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(theta) * GLOBE_RADIUS, 0, Math.sin(theta) * GLOBE_RADIUS));
    }
    equatorGeo.setFromPoints(ringPoints);
    const equator = new THREE.Line(equatorGeo, ringMat);
    globeGroup.add(equator);

    // Latitudinal rings (Tropic of Cancer / Capricorn)
    const createLatRing = (lat: number) => {
      const r = GLOBE_RADIUS * Math.cos(lat * (Math.PI / 180));
      const y = GLOBE_RADIUS * Math.sin(lat * (Math.PI / 180));
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.4 }));
    };
    globeGroup.add(createLatRing(23.5));
    globeGroup.add(createLatRing(-23.5));
    globeGroup.add(createLatRing(45));

    // Stardust dot cloud around globe
    const dotCount = 450;
    const dotGeo = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = GLOBE_RADIUS * (0.99 + Math.random() * 0.03);
      dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dotPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.22,
      transparent: true,
      opacity: 0.65
    });
    const globeDots = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(globeDots);

    // Hub coordinates
    const hubs = [
      { name: 'Tema Port, Ghana (Jackdan HQ)', lat: 5.62, lon: -0.01, isHQ: true, color: 0xfacc15 },
      { name: 'New York, USA (Auto Auctions)', lat: 40.71, lon: -74.00, isHQ: false, color: 0x38bdf8 },
      { name: 'Miami, USA (Maritime Terminal)', lat: 25.76, lon: -80.19, isHQ: false, color: 0x38bdf8 },
      { name: 'Dubai, UAE (Luxury Vehicle Zone)', lat: 25.20, lon: 55.27, isHQ: false, color: 0xf59e0b },
      { name: 'Bremerhaven, Germany (European Hub)', lat: 53.54, lon: 8.58, isHQ: false, color: 0x38bdf8 },
      { name: 'Toronto, Canada (North America Sourcing)', lat: 43.65, lon: -79.38, isHQ: false, color: 0x38bdf8 },
      { name: 'Guangzhou, China (OEM Parts Hub)', lat: 23.12, lon: 113.26, isHQ: false, color: 0x10b981 }
    ];

    const temaPos = latLonToVector3(5.62, -0.01, GLOBE_RADIUS);

    // Tema HQ Glowing Beacon
    const hqBeaconGeo = new THREE.CylinderGeometry(0.08, 0.35, 1.8, 16);
    hqBeaconGeo.translate(0, 0.9, 0);
    const hqBeaconMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const hqBeacon = new THREE.Mesh(hqBeaconGeo, hqBeaconMat);
    hqBeacon.position.copy(temaPos);
    hqBeacon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), temaPos.clone().normalize());
    globeGroup.add(hqBeacon);

    // HQ Radiating Pulse Rings
    pulseRingsRef.current = [];
    for (let r = 0; r < 2; r++) {
      const ringG = new THREE.RingGeometry(0.3 + r * 0.4, 0.45 + r * 0.4, 32);
      const ringM = new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const pulseRing = new THREE.Mesh(ringG, ringM);
      pulseRing.position.copy(temaPos.clone().multiplyScalar(1.02));
      pulseRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), temaPos.clone().normalize());
      globeGroup.add(pulseRing);
      pulseRingsRef.current.push(pulseRing);
    }

    // Hub Markers & Connecting 3D Arcs to Tema Port
    arcPhotonsRef.current = [];

    hubs.forEach(hub => {
      const hubPos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);

      // Hub Marker pin
      const markerGeo = new THREE.SphereGeometry(hub.isHQ ? 0.42 : 0.26, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: hub.color });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(hubPos);
      globeGroup.add(markerMesh);

      // Radiating ring around hub
      const haloGeo = new THREE.RingGeometry(0.35, 0.48, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.copy(hubPos.clone().multiplyScalar(1.01));
      haloMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), hubPos.clone().normalize());
      globeGroup.add(haloMesh);

      // If not HQ, create 3D elevated Bezier Arc connecting this Hub to Tema Port
      if (!hub.isHQ) {
        // Compute midpoint with high elevation for dramatic curve
        const midPoint = new THREE.Vector3().addVectors(hubPos, temaPos).multiplyScalar(0.5);
        const distance = hubPos.distanceTo(temaPos);
        const altitude = GLOBE_RADIUS + distance * 0.35;
        midPoint.normalize().multiplyScalar(altitude);

        const curve = new THREE.QuadraticBezierCurve3(hubPos, midPoint, temaPos);
        const curvePoints = curve.getPoints(50);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const curveMat = new THREE.LineBasicMaterial({
          color: 0xd4af37,
          transparent: true,
          opacity: 0.55
        });
        const arcLine = new THREE.Line(curveGeo, curveMat);
        globeGroup.add(arcLine);

        // Traveling glowing photon on the arc
        const photonGeo = new THREE.SphereGeometry(0.24, 12, 12);
        const photonMat = new THREE.MeshBasicMaterial({ color: 0xfff08a });
        const photon = new THREE.Mesh(photonGeo, photonMat);
        globeGroup.add(photon);

        arcPhotonsRef.current.push({
          curve,
          photon,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.003
        });
      }
    });

    // ─── BUILD SCENE 2: 3D CYBER LUXURY VEHICLE WIREFRAME ───
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);
    carGroup.visible = false; // toggled via mode

    // Moving Cyber Road Grid
    const roadGrid = new THREE.GridHelper(36, 24, 0xd4af37, 0x1e293b);
    roadGrid.position.y = -3.2;
    carGroup.add(roadGrid);
    roadGridRef.current = roadGrid;

    // Aerodynamic Luxury Chassis Construction (Sleek Coupe / SUV proportions)
    const chassisGroup = new THREE.Group();
    carGroup.add(chassisGroup);

    // Body Main Shell Wireframe
    const bodyGeo = new THREE.BoxGeometry(7.2, 1.8, 3.4);
    const bodyEdges = new THREE.EdgesGeometry(bodyGeo);
    const bodyLine = new THREE.LineSegments(
      bodyEdges, 
      new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 })
    );
    bodyLine.position.y = -1.2;
    chassisGroup.add(bodyLine);

    // Cabin Roof Wireframe (Sleek Fastback slope)
    const cabinGeo = new THREE.BoxGeometry(4.2, 1.4, 2.9);
    const cabinEdges = new THREE.EdgesGeometry(cabinGeo);
    const cabinLine = new THREE.LineSegments(
      cabinEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8 })
    );
    cabinLine.position.set(-0.4, 0.4, 0);
    chassisGroup.add(cabinLine);

    // Hood / Front Nose Slope
    const hoodGeo = new THREE.BufferGeometry();
    const hoodVertices = new Float32Array([
      // Front hood triangle slopes
      1.7, -0.3, 1.45,   3.6, -1.2, 1.45,
      1.7, -0.3, -1.45,  3.6, -1.2, -1.45,
      3.6, -1.2, 1.45,   3.6, -1.2, -1.45,
      1.7, -0.3, 1.45,   1.7, -0.3, -1.45
    ]);
    hoodGeo.setAttribute('position', new THREE.BufferAttribute(hoodVertices, 3));
    const hoodLine = new THREE.LineSegments(
      hoodGeo,
      new THREE.LineBasicMaterial({ color: 0xfacc15 })
    );
    chassisGroup.add(hoodLine);

    // Headlight LED Beams
    const createHeadlight = (zPos: number) => {
      const beamGeo = new THREE.ConeGeometry(1.6, 7.5, 16, 1, true);
      beamGeo.rotateZ(-Math.PI / 2);
      beamGeo.translate(5.8, -1.2, zPos);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide
      });
      return new THREE.Mesh(beamGeo, beamMat);
    };
    chassisGroup.add(createHeadlight(1.1));
    chassisGroup.add(createHeadlight(-1.1));

    // Wheels (4 rotating alloy wheels with golden rims)
    carWheelsRef.current = [];
    const wheelPositions = [
      { x: 2.3, y: -2.3, z: 1.8 },
      { x: -2.3, y: -2.3, z: 1.8 },
      { x: 2.3, y: -2.3, z: -1.8 },
      { x: -2.3, y: -2.3, z: -1.8 }
    ];

    wheelPositions.forEach(pos => {
      const wheelSubGroup = new THREE.Group();
      wheelSubGroup.position.set(pos.x, pos.y, pos.z);

      const tireGeo = new THREE.TorusGeometry(0.9, 0.35, 12, 24);
      const tireMat = new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true });
      const tire = new THREE.Mesh(tireGeo, tireMat);

      // Gold Alloy Rim Spokes
      const rimGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.3, 8);
      const rimEdges = new THREE.EdgesGeometry(rimGeo);
      const rim = new THREE.LineSegments(rimEdges, new THREE.LineBasicMaterial({ color: 0xd4af37 }));
      rim.rotation.x = Math.PI / 2;

      wheelSubGroup.add(tire);
      wheelSubGroup.add(rim);
      carGroup.add(wheelSubGroup);
      carWheelsRef.current.push(wheelSubGroup);
    });

    // ─── INITIAL MODE VISIBILITY ───
    if (mode === 'globe') {
      globeGroup.visible = true;
      carGroup.visible = false;
      camera.position.set(0, 3, 27);
    } else if (mode === 'car') {
      globeGroup.visible = false;
      carGroup.visible = true;
      camera.position.set(12, 6, 16);
      camera.lookAt(0, -0.5, 0);
    }

    // ─── INTERACTION: MOUSE ROTATION & PARALLAX ───
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      if (mode === 'globe' && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += deltaX * 0.008;
        globeGroupRef.current.rotation.x += deltaY * 0.008;
      } else if (mode === 'car' && carGroupRef.current) {
        carGroupRef.current.rotation.y += deltaX * 0.008;
      }

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      if (mode === 'globe' && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += deltaX * 0.01;
        globeGroupRef.current.rotation.x += deltaY * 0.01;
      } else if (mode === 'car' && carGroupRef.current) {
        carGroupRef.current.rotation.y += deltaX * 0.01;
      }

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // ─── ANIMATION LOOP ───
    let pulseTime = 0;
    const animate = () => {
      pulseTime += 0.025;

      // Rotate Globe & Update logistics pulses
      if (mode === 'globe') {
        if (isAutoRotating && !isDraggingRef.current && globeGroupRef.current) {
          globeGroupRef.current.rotation.y += 0.0035;
        }

        // Pulse Tema Port beacon rings
        pulseRingsRef.current.forEach((ring, idx) => {
          const s = 1 + (Math.sin(pulseTime * 2 + idx * 1.5) * 0.5 + 0.5) * 0.6;
          ring.scale.set(s, s, s);
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.9 - (s - 1) * 0.8;
        });

        // Travel photons along quadratic bezier arcs
        arcPhotonsRef.current.forEach(item => {
          item.progress += item.speed;
          if (item.progress > 1) item.progress = 0;
          const pt = item.curve.getPoint(item.progress);
          item.photon.position.copy(pt);
        });
      } else if (mode === 'car') {
        // Auto-spin wheels and road grid movement
        carWheelsRef.current.forEach(wheel => {
          wheel.rotation.z -= 0.06;
        });

        if (roadGridRef.current) {
          roadGridRef.current.position.x = (roadGridRef.current.position.x - 0.2) % 3;
        }

        if (isAutoRotating && !isDraggingRef.current && carGroupRef.current) {
          carGroupRef.current.rotation.y += 0.005;
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      // Clean renderer
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [mode, isAutoRotating]);

  // Mode switcher handler with camera repositioning
  const handleSwitchMode = (newMode: ShowcaseMode) => {
    setMode(newMode);
    if (newMode === 'globe') {
      setActiveHubInfo('Tema Port, Ghana (Jackdan HQ)');
      if (globeGroupRef.current) globeGroupRef.current.visible = true;
      if (carGroupRef.current) carGroupRef.current.visible = false;
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 3, 27);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else if (newMode === 'car') {
      setActiveHubInfo('3D Aerodynamic Luxury Vehicle Silhouette');
      if (globeGroupRef.current) globeGroupRef.current.visible = false;
      if (carGroupRef.current) carGroupRef.current.visible = true;
      if (cameraRef.current) {
        cameraRef.current.position.set(12, 6, 16);
        cameraRef.current.lookAt(0, -0.5, 0);
      }
    }
  };

  const handleResetCamera = () => {
    if (mode === 'globe') {
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.set(0, 0, 0);
      }
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 3, 27);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else if (mode === 'car') {
      if (carGroupRef.current) {
        carGroupRef.current.rotation.set(0, 0, 0);
      }
      if (cameraRef.current) {
        cameraRef.current.position.set(12, 6, 16);
        cameraRef.current.lookAt(0, -0.5, 0);
      }
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto group select-none">
      {/* Golden Glowing Ambient Border Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 via-amber-400 to-sky-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-700 pointer-events-none" />

      {/* Main 3D Card Container */}
      <div className="relative rounded-2xl bg-dark-950/90 border border-gold-500/40 p-4 shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col">
        {/* Top Control Bar: Mode Switcher Tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-dark-900 rounded-xl border border-dark-700/80">
            <button
              type="button"
              onClick={() => handleSwitchMode('globe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'globe'
                  ? 'bg-gold-500 text-dark-950 shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>3D Global Arcs</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('car')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'car'
                  ? 'bg-gold-500 text-dark-950 shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>3D Cyber Car</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('flyer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'flyer'
                  ? 'bg-gold-500 text-dark-950 shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Brand Flyer</span>
            </button>
          </div>

          {/* Controls: Auto-Rotate & Reset (only in 3D modes) */}
          {mode !== 'flyer' && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                title={isAutoRotating ? 'Pause Rotation' : 'Resume Auto-Rotation'}
                className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 border border-dark-700 text-dark-300 hover:text-gold-400 transition-colors"
              >
                {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleResetCamera}
                title="Reset Camera Orientation"
                className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 border border-dark-700 text-dark-300 hover:text-gold-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Center Canvas Viewport */}
        <div className="relative w-full aspect-[4/3.8] rounded-xl overflow-hidden bg-gradient-to-b from-dark-900 via-dark-950 to-dark-950 border border-dark-800/80 my-3 flex items-center justify-center">
          {mode === 'flyer' ? (
            /* Official Flyer Preview with Enlarge Trigger */
            <div
              onClick={onEnlargeFlyer}
              className="cursor-pointer w-full h-full relative group/flyer flex items-center justify-center bg-dark-950"
            >
              <img
                src="/assets/YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER_20260909_141036_0000.png"
                alt="Jackdan Auto Import Official Flyer"
                className="w-full h-full object-cover transform group-hover/flyer:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover/flyer:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <span className="px-4 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-xl">
                  <Eye className="w-4 h-4" />
                  <span>Click to Enlarge Flyer</span>
                </span>
              </div>
            </div>
          ) : (
            /* Interactive Three.js WebGL Mount */
            <>
              <div
                ref={mountRef}
                className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
              />

              {/* Top HUD Telemetry Stamp */}
              <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-900/90 border border-gold-500/30 text-[10px] font-mono text-gold-400 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{mode === 'globe' ? 'LIVE VESSEL CORRIDORS' : 'CHASSIS TELEMETRY'}</span>
                </div>
                <span className="text-[10px] text-dark-300 font-mono tracking-tight pl-0.5">
                  {mode === 'globe' ? 'PORT OF TEMA TARGET: 05°38′N 00°01′E' : 'GENUINE OEM SPECIFICATIONS'}
                </span>
              </div>

              {/* Bottom Drag Instruction Hint */}
              <div className="absolute bottom-2.5 inset-x-0 flex justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-dark-950/80 border border-dark-700/80 text-[11px] text-dark-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <Compass className="w-3 h-3 text-gold-400 animate-spin-slow" />
                  <span>Click & Drag to Rotate 360°</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Bottom Interactive Detail Strip */}
        <div className="pt-2 border-t border-dark-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-dark-300">
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span className="font-medium text-white truncate max-w-[210px] sm:max-w-[260px]">
              {mode === 'globe'
                ? 'USA • UAE • Europe → Tema Port'
                : mode === 'car'
                ? 'Luxury SUVs & Sedans'
                : 'Jackdan Auto Catalog'}
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateInventory}
            className="text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1 hover:underline text-xs"
          >
            <span>Explore Cars</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

