import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Ship, 
  Globe2, 
  FileText, 
  RotateCcw, 
  Play, 
  Pause, 
  Eye, 
  ArrowRight,
  Anchor,
  Compass,
  Boxes
} from 'lucide-react';

interface TwumaascoLogisticsWebGLProps {
  onEnlargeFlyer: () => void;
  onRequestQuote: () => void;
}

type LogisticsMode = 'vessel' | 'routes' | 'flyer';

export const TwumaascoLogisticsWebGL: React.FC<TwumaascoLogisticsWebGLProps> = ({
  onEnlargeFlyer,
  onRequestQuote
}) => {
  const [mode, setMode] = useState<LogisticsMode>('vessel');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const vesselGroupRef = useRef<THREE.Group | null>(null);
  const routesGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const waterPlanesRef = useRef<THREE.Mesh[]>([]);
  const radarMastRef = useRef<THREE.Mesh | null>(null);
  const cargoJetRef = useRef<THREE.Group | null>(null);
  const arcPhotonsRef = useRef<{ curve: THREE.QuadraticBezierCurve3; photon: THREE.Mesh; progress: number; speed: number }[]>([]);

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

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 10, 20);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 3, 50);
    blueLight.position.set(10, 15, 12);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xfacc15, 2, 50);
    goldLight.position.set(-12, 10, -10);
    scene.add(goldLight);

    // ─── SCENE 1: 3D CONTAINER SHIP (VESSEL) ───
    const vesselGroup = new THREE.Group();
    vesselGroupRef.current = vesselGroup;
    scene.add(vesselGroup);

    // Ocean Water Grid
    const waterGeo = new THREE.PlaneGeometry(36, 36, 16, 16);
    const waterMat = new THREE.MeshBasicMaterial({
      color: 0x0c2540,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -2.4;
    vesselGroup.add(waterMesh);
    waterPlanesRef.current = [waterMesh];

    // Ship Hull (Streamlined container ship)
    const hullGroup = new THREE.Group();
    vesselGroup.add(hullGroup);

    // Main lower hull
    const hullGeo = new THREE.BoxGeometry(11, 2.2, 3.4);
    const hullEdges = new THREE.EdgesGeometry(hullGeo);
    const hullLine = new THREE.LineSegments(
      hullEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
    );
    hullLine.position.y = -1.2;
    hullGroup.add(hullLine);

    // Bow bow-stem triangle (Front of ship)
    const bowGeo = new THREE.BufferGeometry();
    const bowVertices = new Float32Array([
      5.5, -0.1, 1.7,   7.6, 0.4, 0,
      5.5, -0.1, -1.7,  7.6, 0.4, 0,
      5.5, -2.3, 1.7,   7.6, -1.5, 0,
      5.5, -2.3, -1.7,  7.6, -1.5, 0,
      7.6, 0.4, 0,      7.6, -1.5, 0
    ]);
    bowGeo.setAttribute('position', new THREE.BufferAttribute(bowVertices, 3));
    const bowLine = new THREE.LineSegments(bowGeo, new THREE.LineBasicMaterial({ color: 0x60a5fa }));
    hullGroup.add(bowLine);

    // Bridge Tower & Navigation Deck (Stern / Rear)
    const bridgeGeo = new THREE.BoxGeometry(2.4, 3.2, 2.6);
    const bridgeEdges = new THREE.EdgesGeometry(bridgeGeo);
    const bridgeLine = new THREE.LineSegments(bridgeEdges, new THREE.LineBasicMaterial({ color: 0xfacc15 }));
    bridgeLine.position.set(-3.6, 1.4, 0);
    hullGroup.add(bridgeLine);

    // Radar Mast on top of bridge
    const mastGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8);
    const mastMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(-3.6, 3.5, 0);
    hullGroup.add(mast);

    const radarScannerGeo = new THREE.BoxGeometry(1.0, 0.15, 0.2);
    const radarScannerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const radarScanner = new THREE.Mesh(radarScannerGeo, radarScannerMat);
    radarScanner.position.set(-3.6, 4.2, 0);
    hullGroup.add(radarScanner);
    radarMastRef.current = radarScanner;

    // Stacked Intermodal 20ft & 40ft Shipping Containers (Twumaasco Blue, Cyan & Gold)
    const containerColors = [0x2563eb, 0x0284c7, 0xfacc15, 0x38bdf8, 0x1d4ed8];
    const containerPositions = [
      // Deck Layer 1
      { x: 2.2, y: 0.35, z: 0.85, c: 0 },
      { x: 2.2, y: 0.35, z: -0.85, c: 1 },
      { x: -0.2, y: 0.35, z: 0.85, c: 2 },
      { x: -0.2, y: 0.35, z: -0.85, c: 3 },
      { x: 4.2, y: 0.35, z: 0, c: 4 },
      // Deck Layer 2
      { x: 2.2, y: 1.35, z: 0.85, c: 1 },
      { x: 2.2, y: 1.35, z: -0.85, c: 2 },
      { x: -0.2, y: 1.35, z: 0.85, c: 3 },
      { x: -0.2, y: 1.35, z: -0.85, c: 0 },
      // Deck Layer 3
      { x: 1.0, y: 2.35, z: 0, c: 2 },
      { x: -0.2, y: 2.35, z: 0.85, c: 1 }
    ];

    containerPositions.forEach(cp => {
      const cGeo = new THREE.BoxGeometry(2.0, 0.9, 1.4);
      const cEdges = new THREE.EdgesGeometry(cGeo);
      const cLine = new THREE.LineSegments(
        cEdges,
        new THREE.LineBasicMaterial({ color: containerColors[cp.c] })
      );
      cLine.position.set(cp.x, cp.y, cp.z);
      hullGroup.add(cLine);
    });

    // Overhead Air Freight Cargo Jet
    const jetGroup = new THREE.Group();
    vesselGroup.add(jetGroup);
    cargoJetRef.current = jetGroup;

    // Jet fuselage
    const jetBodyGeo = new THREE.CylinderGeometry(0.25, 0.2, 3.2, 12);
    jetBodyGeo.rotateZ(Math.PI / 2);
    const jetBodyMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const jetBody = new THREE.Mesh(jetBodyGeo, jetBodyMat);
    jetGroup.add(jetBody);

    // Jet Wings
    const wingGeo = new THREE.BoxGeometry(1.2, 0.05, 4.4);
    const wingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(-0.2, 0, 0);
    jetGroup.add(wings);

    jetGroup.position.set(0, 6.5, -4);
    jetGroup.rotation.y = Math.PI / 4;

    // ─── SCENE 2: MARITIME & AIR TRADE ROUTES (GLOBE) ───
    const routesGroup = new THREE.Group();
    routesGroupRef.current = routesGroup;
    scene.add(routesGroup);
    routesGroup.visible = false;

    const GLOBE_RADIUS = 8.5;

    // Globe Sphere & Wireframe
    const globeWireMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a5f,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const globeWire = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32), globeWireMat);
    routesGroup.add(globeWire);

    const globeInner = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x050c18, transparent: true, opacity: 0.85 })
    );
    routesGroup.add(globeInner);

    // Logistics Hubs
    const temaPos = latLonToVector3(5.62, -0.01, GLOBE_RADIUS);
    const logisticsHubs = [
      { name: 'Tema Port & MPS Terminal 3', lat: 5.62, lon: -0.01, isHQ: true, color: 0xfacc15 },
      { name: 'Takoradi Harbor, Ghana', lat: 4.88, lon: -1.75, isHQ: false, color: 0x38bdf8 },
      { name: 'Newark / Houston (USA)', lat: 40.73, lon: -74.17, isHQ: false, color: 0x60a5fa },
      { name: 'Jebel Ali / Dubai (UAE)', lat: 25.01, lon: 55.06, isHQ: false, color: 0xf59e0b },
      { name: 'Antwerp / Hamburg (Europe)', lat: 51.21, lon: 4.40, isHQ: false, color: 0x38bdf8 },
      { name: 'Shanghai / Ningbo (China)', lat: 31.23, lon: 121.47, isHQ: false, color: 0x34d399 }
    ];

    arcPhotonsRef.current = [];

    logisticsHubs.forEach(hub => {
      const hubPos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(hub.isHQ ? 0.45 : 0.28, 16, 16),
        new THREE.MeshBasicMaterial({ color: hub.color })
      );
      marker.position.copy(hubPos);
      routesGroup.add(marker);

      if (!hub.isHQ) {
        const midPoint = new THREE.Vector3().addVectors(hubPos, temaPos).multiplyScalar(0.5);
        const dist = hubPos.distanceTo(temaPos);
        midPoint.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.38);

        const curve = new THREE.QuadraticBezierCurve3(hubPos, midPoint, temaPos);
        const curvePoints = curve.getPoints(50);
        const arcLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curvePoints),
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
        );
        routesGroup.add(arcLine);

        // Moving photon
        const photon = new THREE.Mesh(
          new THREE.SphereGeometry(0.25, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xfacc15 })
        );
        routesGroup.add(photon);

        arcPhotonsRef.current.push({
          curve,
          photon,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.003
        });
      }
    });

    // ─── INITIAL MODE CONFIG ───
    if (mode === 'vessel') {
      vesselGroup.visible = true;
      routesGroup.visible = false;
      camera.position.set(16, 9, 18);
      camera.lookAt(0, 0, 0);
    } else if (mode === 'routes') {
      vesselGroup.visible = false;
      routesGroup.visible = true;
      camera.position.set(0, 4, 27);
      camera.lookAt(0, 0, 0);
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

      if (mode === 'vessel' && vesselGroupRef.current) {
        vesselGroupRef.current.rotation.y += deltaX * 0.008;
      } else if (mode === 'routes' && routesGroupRef.current) {
        routesGroupRef.current.rotation.y += deltaX * 0.008;
        routesGroupRef.current.rotation.x += deltaY * 0.008;
      }

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support
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

      if (mode === 'vessel' && vesselGroupRef.current) {
        vesselGroupRef.current.rotation.y += deltaX * 0.01;
      } else if (mode === 'routes' && routesGroupRef.current) {
        routesGroupRef.current.rotation.y += deltaX * 0.01;
        routesGroupRef.current.rotation.x += deltaY * 0.01;
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

    // Resize
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
    let jetAngle = 0;
    const animate = () => {
      if (mode === 'vessel') {
        if (isAutoRotating && !isDraggingRef.current && vesselGroupRef.current) {
          vesselGroupRef.current.rotation.y += 0.004;
        }

        // Spin radar scanner
        if (radarMastRef.current) {
          radarMastRef.current.rotation.y += 0.08;
        }

        // Orbit overhead cargo jet
        jetAngle += 0.012;
        if (cargoJetRef.current) {
          const orbitR = 9;
          cargoJetRef.current.position.x = Math.cos(jetAngle) * orbitR;
          cargoJetRef.current.position.z = Math.sin(jetAngle) * orbitR;
          cargoJetRef.current.rotation.y = -jetAngle + Math.PI / 2;
        }
      } else if (mode === 'routes') {
        if (isAutoRotating && !isDraggingRef.current && routesGroupRef.current) {
          routesGroupRef.current.rotation.y += 0.0035;
        }

        arcPhotonsRef.current.forEach(item => {
          item.progress += item.speed;
          if (item.progress > 1) item.progress = 0;
          const pt = item.curve.getPoint(item.progress);
          item.photon.position.copy(pt);
        });
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

  const handleSwitchMode = (newMode: LogisticsMode) => {
    setMode(newMode);
    if (newMode === 'vessel') {
      if (vesselGroupRef.current) vesselGroupRef.current.visible = true;
      if (routesGroupRef.current) routesGroupRef.current.visible = false;
      if (cameraRef.current) {
        cameraRef.current.position.set(16, 9, 18);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else if (newMode === 'routes') {
      if (vesselGroupRef.current) vesselGroupRef.current.visible = false;
      if (routesGroupRef.current) routesGroupRef.current.visible = true;
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 4, 27);
        cameraRef.current.lookAt(0, 0, 0);
      }
    }
  };

  const handleReset = () => {
    if (mode === 'vessel' && vesselGroupRef.current) {
      vesselGroupRef.current.rotation.set(0, 0, 0);
      if (cameraRef.current) {
        cameraRef.current.position.set(16, 9, 18);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else if (mode === 'routes' && routesGroupRef.current) {
      routesGroupRef.current.rotation.set(0, 0, 0);
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 4, 27);
        cameraRef.current.lookAt(0, 0, 0);
      }
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto group select-none">
      {/* Blue Ambient Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition duration-700 pointer-events-none" />

      {/* Main 3D Card Container */}
      <div className="relative rounded-2xl bg-dark-950/90 border border-blue-500/40 p-4 shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-dark-900 rounded-xl border border-dark-700/80">
            <button
              type="button"
              onClick={() => handleSwitchMode('vessel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'vessel'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>3D Cargo Ship</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('routes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'routes'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Ocean Lanes</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('flyer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'flyer'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Logistics Flyer</span>
            </button>
          </div>

          {mode !== 'flyer' && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                title={isAutoRotating ? 'Pause Rotation' : 'Resume Auto-Rotation'}
                className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 border border-dark-700 text-dark-300 hover:text-blue-400 transition-colors"
              >
                {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Reset Orientation"
                className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 border border-dark-700 text-dark-300 hover:text-blue-400 transition-colors"
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
                src="/assets/1_20260909_140844_0000.png"
                alt="Twumaasco Logistics Official Flyer"
                className="w-full h-full object-cover transform group-hover/flyer:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover/flyer:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <span className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xl">
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-900/90 border border-blue-500/40 text-[10px] font-mono text-blue-400 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>{mode === 'vessel' ? 'MULTIMODAL MARITIME CARRIER' : 'GLOBAL FREIGHT CORRIDORS'}</span>
                </div>
                <span className="text-[10px] text-dark-300 font-mono tracking-tight pl-0.5">
                  {mode === 'vessel' ? 'FCL / LCL / RORO / AIR CARGO EXPRESS' : 'PORT OF TEMA & TAKORADI GATES'}
                </span>
              </div>

              {/* Rotate hint */}
              <div className="absolute bottom-2.5 inset-x-0 flex justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-dark-950/80 border border-dark-700/80 text-[11px] text-dark-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <Compass className="w-3 h-3 text-blue-400 animate-spin-slow" />
                  <span>Click & Drag to Rotate 360°</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Bottom Details */}
        <div className="pt-2 border-t border-dark-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-dark-300">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="font-medium text-white truncate max-w-[210px] sm:max-w-[260px]">
              {mode === 'vessel' ? 'Containerized Sea & Air Cargo' : 'Direct Sailings to Port of Tema'}
            </span>
          </div>

          <button
            type="button"
            onClick={onRequestQuote}
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline text-xs"
          >
            <span>Instant Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

