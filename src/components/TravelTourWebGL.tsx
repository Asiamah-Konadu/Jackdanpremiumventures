import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Plane, 
  Compass, 
  FileText, 
  RotateCcw, 
  Play, 
  Pause, 
  Eye, 
  ArrowRight,
  Globe2,
  MapPin,
  Sparkles
} from 'lucide-react';

interface TravelTourWebGLProps {
  onEnlargeFlyer: () => void;
  onBookConsultation: () => void;
}

type TravelMode = 'radar' | 'compass' | 'flyer';

export const TravelTourWebGL: React.FC<TravelTourWebGLProps> = ({
  onEnlargeFlyer,
  onBookConsultation
}) => {
  const [mode, setMode] = useState<TravelMode>('radar');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const radarGroupRef = useRef<THREE.Group | null>(null);
  const compassGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const pulseRingsRef = useRef<THREE.Mesh[]>([]);
  const flightPlanesRef = useRef<{ 
    curve: THREE.QuadraticBezierCurve3; 
    planeMesh: THREE.Group; 
    progress: number; 
    speed: number 
  }[]>([]);
  const compassRingRef = useRef<THREE.Group | null>(null);
  const compassNeedleRef = useRef<THREE.Mesh | null>(null);

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

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 27);
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
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 2.5, 50);
    emeraldLight.position.set(12, 14, 15);
    scene.add(emeraldLight);

    const goldLight = new THREE.PointLight(0xfacc15, 2.0, 50);
    goldLight.position.set(-12, -8, 12);
    scene.add(goldLight);

    // ─── SCENE 1: 3D AVIATION RADAR GLOBE ───
    const radarGroup = new THREE.Group();
    radarGroupRef.current = radarGroup;
    scene.add(radarGroup);

    const GLOBE_RADIUS = 8.5;

    // Outer wireframe sphere in emerald tint
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x064e3b,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const globeWire = new THREE.Mesh(globeGeo, wireMat);
    radarGroup.add(globeWire);

    // Deep obsidian inner sphere
    const innerGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x021c14,
      transparent: true,
      opacity: 0.85
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    radarGroup.add(innerSphere);

    // Shimmering Emerald Equator & Latitude Rings
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.5
    });
    const equatorGeo = new THREE.BufferGeometry();
    const ringPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const th = (i / 64) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(Math.cos(th) * GLOBE_RADIUS, 0, Math.sin(th) * GLOBE_RADIUS));
    }
    equatorGeo.setFromPoints(ringPts);
    radarGroup.add(new THREE.Line(equatorGeo, ringMat));

    // Stardust Points
    const dotCount = 380;
    const dotGeo = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = GLOBE_RADIUS * (0.99 + Math.random() * 0.025);
      dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dotPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const dots = new THREE.Points(
      dotGeo,
      new THREE.PointsMaterial({ color: 0x34d399, size: 0.2, transparent: true, opacity: 0.7 })
    );
    radarGroup.add(dots);

    // Aviation Hub: Kotoka International Airport (KIA), Accra
    const accraPos = latLonToVector3(5.60, -0.17, GLOBE_RADIUS);

    // KIA Radiant Golden Beacon
    const kiaBeaconGeo = new THREE.CylinderGeometry(0.08, 0.35, 1.8, 16);
    kiaBeaconGeo.translate(0, 0.9, 0);
    const kiaBeacon = new THREE.Mesh(kiaBeaconGeo, new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    kiaBeacon.position.copy(accraPos);
    kiaBeacon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), accraPos.clone().normalize());
    radarGroup.add(kiaBeacon);

    // KIA Radar Pulse Rings
    pulseRingsRef.current = [];
    for (let r = 0; r < 2; r++) {
      const ringG = new THREE.RingGeometry(0.3 + r * 0.4, 0.45 + r * 0.4, 32);
      const ringM = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const pRing = new THREE.Mesh(ringG, ringM);
      pRing.position.copy(accraPos.clone().multiplyScalar(1.02));
      pRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), accraPos.clone().normalize());
      radarGroup.add(pRing);
      pulseRingsRef.current.push(pRing);
    }

    // World Flight Destinations
    const destinations = [
      { name: 'London Heathrow (UK)', lat: 51.47, lon: -0.45, color: 0x38bdf8 },
      { name: 'Dubai (UAE)', lat: 25.25, lon: 55.36, color: 0xfacc15 },
      { name: 'New York JFK (USA)', lat: 40.64, lon: -73.77, color: 0x38bdf8 },
      { name: 'Toronto Pearson (Canada)', lat: 43.67, lon: -79.62, color: 0x38bdf8 },
      { name: 'Paris CDG / Schengen', lat: 49.00, lon: 2.54, color: 0x34d399 },
      { name: 'Johannesburg (South Africa)', lat: -26.13, lon: 28.24, color: 0xf59e0b }
    ];

    flightPlanesRef.current = [];

    destinations.forEach(dest => {
      const destPos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS);

      // Destination Pin
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: dest.color })
      );
      marker.position.copy(destPos);
      radarGroup.add(marker);

      // Elevated Great-Circle Flight Curve
      const midPoint = new THREE.Vector3().addVectors(accraPos, destPos).multiplyScalar(0.5);
      const dist = accraPos.distanceTo(destPos);
      midPoint.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(accraPos, midPoint, destPos);
      const pts = curve.getPoints(50);
      const flightArc = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 })
      );
      radarGroup.add(flightArc);

      // 3D Mini Airplane Model traversing the arc
      const planeGroup = new THREE.Group();

      const fuselage = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.05, 0.9, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      fuselage.rotateZ(Math.PI / 2);
      planeGroup.add(fuselage);

      const wings = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.02, 1.2),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      planeGroup.add(wings);

      radarGroup.add(planeGroup);

      flightPlanesRef.current.push({
        curve,
        planeMesh: planeGroup,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.0025
      });
    });

    // ─── SCENE 2: 3D LUXURY VOYAGE COMPASS ───
    const compassGroup = new THREE.Group();
    compassGroupRef.current = compassGroup;
    scene.add(compassGroup);
    compassGroup.visible = false;

    // Outer Brass & Gold Gimbal Rings
    const gimbalGeo = new THREE.TorusGeometry(6.5, 0.18, 16, 64);
    const gimbalMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const gimbal1 = new THREE.Mesh(gimbalGeo, gimbalMat);
    compassGroup.add(gimbal1);

    const gimbal2 = new THREE.Mesh(
      new THREE.TorusGeometry(5.6, 0.14, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    gimbal2.rotation.x = Math.PI / 4;
    compassGroup.add(gimbal2);
    compassRingRef.current = compassGroup;

    // Inner Compass Rose Star (Needle pointing North-South)
    const needleGeo = new THREE.BufferGeometry();
    const needleVertices = new Float32Array([
      // North pointer (Gold)
      0, 4.2, 0,   -0.5, 0, 0.1,   0.5, 0, 0.1,
      // South pointer (Emerald)
      0, -4.2, 0,  -0.5, 0, 0.1,   0.5, 0, 0.1
    ]);
    needleGeo.setAttribute('position', new THREE.BufferAttribute(needleVertices, 3));
    const needle = new THREE.Mesh(
      needleGeo,
      new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
    );
    compassGroup.add(needle);
    compassNeedleRef.current = needle;

    // Center Gold Pivot Sphere
    const pivot = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    compassGroup.add(pivot);

    // Cardinal Points Ring (North, East, South, West markers)
    const cardGeo = new THREE.RingGeometry(4.2, 4.4, 32);
    const cardMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const cardRing = new THREE.Mesh(cardGeo, cardMat);
    compassGroup.add(cardRing);

    // Initial visibility
    if (mode === 'radar') {
      radarGroup.visible = true;
      compassGroup.visible = false;
      camera.position.set(0, 4, 27);
    } else if (mode === 'compass') {
      radarGroup.visible = false;
      compassGroup.visible = true;
      camera.position.set(0, 0, 18);
    }

    // ─── INTERACTION ───
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      if (mode === 'radar' && radarGroupRef.current) {
        radarGroupRef.current.rotation.y += deltaX * 0.008;
        radarGroupRef.current.rotation.x += deltaY * 0.008;
      } else if (mode === 'compass' && compassGroupRef.current) {
        compassGroupRef.current.rotation.y += deltaX * 0.008;
        compassGroupRef.current.rotation.x += deltaY * 0.008;
      }

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

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

      if (mode === 'radar' && radarGroupRef.current) {
        radarGroupRef.current.rotation.y += deltaX * 0.01;
        radarGroupRef.current.rotation.x += deltaY * 0.01;
      } else if (mode === 'compass' && compassGroupRef.current) {
        compassGroupRef.current.rotation.y += deltaX * 0.01;
        compassGroupRef.current.rotation.x += deltaY * 0.01;
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

      if (mode === 'radar') {
        if (isAutoRotating && !isDraggingRef.current && radarGroupRef.current) {
          radarGroupRef.current.rotation.y += 0.0035;
        }

        // Radar pulses at KIA airport
        pulseRingsRef.current.forEach((ring, idx) => {
          const s = 1 + (Math.sin(pulseTime * 2 + idx * 1.5) * 0.5 + 0.5) * 0.6;
          ring.scale.set(s, s, s);
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.9 - (s - 1) * 0.8;
        });

        // Traverse 3D airplanes along flight paths
        flightPlanesRef.current.forEach(item => {
          item.progress += item.speed;
          if (item.progress > 1) item.progress = 0;

          const pt = item.curve.getPoint(item.progress);
          const tangent = item.curve.getTangent(item.progress).normalize();

          item.planeMesh.position.copy(pt);
          item.planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tangent);
        });
      } else if (mode === 'compass') {
        if (isAutoRotating && !isDraggingRef.current && compassRingRef.current) {
          compassRingRef.current.rotation.y += 0.005;
          compassRingRef.current.rotation.x += 0.002;
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [mode, isAutoRotating]);

  const handleSwitchMode = (newMode: TravelMode) => {
    setMode(newMode);
    if (newMode === 'radar') {
      if (radarGroupRef.current) radarGroupRef.current.visible = true;
      if (compassGroupRef.current) compassGroupRef.current.visible = false;
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 4, 27);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else if (newMode === 'compass') {
      if (radarGroupRef.current) radarGroupRef.current.visible = false;
      if (compassGroupRef.current) compassGroupRef.current.visible = true;
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0, 18);
        cameraRef.current.lookAt(0, 0, 0);
      }
    }
  };

  const handleReset = () => {
    if (mode === 'radar' && radarGroupRef.current) {
      radarGroupRef.current.rotation.set(0, 0, 0);
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 4, 27);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else if (mode === 'compass' && compassGroupRef.current) {
      compassGroupRef.current.rotation.set(0, 0, 0);
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0, 18);
        cameraRef.current.lookAt(0, 0, 0);
      }
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto group select-none">
      {/* Emerald Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition duration-700 pointer-events-none" />

      {/* Main 3D Card */}
      <div className="relative rounded-2xl bg-dark-950/90 border border-emerald-500/40 p-4 shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-dark-900 rounded-xl border border-dark-700/80">
            <button
              type="button"
              onClick={() => handleSwitchMode('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'radar'
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>3D Flight Radar</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('compass')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'compass'
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Compass</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('flyer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'flyer'
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Travel Flyer</span>
            </button>
          </div>

          {mode !== 'flyer' && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                title={isAutoRotating ? 'Pause Rotation' : 'Resume Auto-Rotation'}
                className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 border border-dark-700 text-dark-300 hover:text-emerald-400 transition-colors"
              >
                {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Reset Orientation"
                className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 border border-dark-700 text-dark-300 hover:text-emerald-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Viewport */}
        <div className="relative w-full aspect-[4/3.8] rounded-xl overflow-hidden bg-gradient-to-b from-dark-900 via-dark-950 to-dark-950 border border-dark-800/80 my-3 flex items-center justify-center">
          {mode === 'flyer' ? (
            <div
              onClick={onEnlargeFlyer}
              className="cursor-pointer w-full h-full relative group/flyer flex items-center justify-center bg-dark-950"
            >
              <img
                src="/assets/2_20260909_140845_0001.png"
                alt="Jackdan Travel & Tour Official Flyer"
                className="w-full h-full object-cover transform group-hover/flyer:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover/flyer:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xl">
                  <Eye className="w-4 h-4" />
                  <span>Click to Enlarge Flyer</span>
                </span>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={mountRef}
                className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
              />

              {/* HUD Telemetry */}
              <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-900/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{mode === 'radar' ? 'GLOBAL FLIGHT RADAR ACTIVE' : 'VOYAGE NAVIGATION GIMBAL'}</span>
                </div>
                <span className="text-[10px] text-dark-300 font-mono tracking-tight pl-0.5">
                  {mode === 'radar' ? 'ACCRA KOTOKA INTL (ACC / DGAA) RADIALS' : 'WORLDWIDE SAFARI & VISA WAYPOINTS'}
                </span>
              </div>

              {/* Rotate hint */}
              <div className="absolute bottom-2.5 inset-x-0 flex justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-dark-950/80 border border-dark-700/80 text-[11px] text-dark-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <Compass className="w-3 h-3 text-emerald-400 animate-spin-slow" />
                  <span>Click & Drag to Rotate 360°</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Bottom Details */}
        <div className="pt-2 border-t border-dark-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-dark-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-white truncate max-w-[210px] sm:max-w-[260px]">
              {mode === 'radar' ? 'USA • UK • Schengen • Dubai' : 'VIP Chauffeur & Guided Safaris'}
            </span>
          </div>

          <button
            type="button"
            onClick={onBookConsultation}
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline text-xs"
          >
            <span>Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

