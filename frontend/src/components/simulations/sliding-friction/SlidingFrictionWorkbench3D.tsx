import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { type SurfacePreset } from './slidingFrictionEngine';

interface SlidingFrictionWorkbench3DProps {
  selectedSurface: SurfacePreset;
  addedMassKg: number;
  baseBlockMassKg: number;
  isPulling: boolean;
  currentForceN: number;
  showVectors: boolean;
  showMicroView: boolean;
  soundEnabled: boolean;
  cameraMode: 'perspective' | 'side' | 'top';
  onForceChange: (forceN: number) => void;
  onPullComplete: (finalForceN: number) => void;
}

export const SlidingFrictionWorkbench3D: React.FC<SlidingFrictionWorkbench3DProps> = ({
  selectedSurface,
  addedMassKg,
  baseBlockMassKg,
  isPulling,
  currentForceN,
  showVectors,
  showMicroView,
  soundEnabled,
  cameraMode,
  onForceChange,
  onPullComplete,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Meshes & Groups
  const blockGroupRef = useRef<THREE.Group | null>(null);
  const weightsGroupRef = useRef<THREE.Group | null>(null);
  const surfaceStripRef = useRef<THREE.Mesh | null>(null);
  const dynamometerGroupRef = useRef<THREE.Group | null>(null);
  const needleMeshRef = useRef<THREE.Mesh | null>(null);
  const pullStringMeshRef = useRef<THREE.Line | null>(null);
  const thermalGlowMeshRef = useRef<THREE.Mesh | null>(null);
  const frictionParticlesRef = useRef<THREE.Points | null>(null);

  // Vector helpers
  const vectorPRef = useRef<THREE.ArrowHelper | null>(null);
  const vectorNRef = useRef<THREE.ArrowHelper | null>(null);
  const vectorFkRef = useRef<THREE.ArrowHelper | null>(null);
  const vectorFmsRef = useRef<THREE.ArrowHelper | null>(null);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

  const animProgressRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  const totalMass = baseBlockMassKg + addedMassKg;
  const normalForce = totalMass * 9.81;
  const targetFrictionForce = normalForce * selectedSurface.mu;

  // Sound generator
  const playFrictionSound = useCallback((durationMs: number, intensity: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * (durationMs / 1000 + 0.2);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600 + selectedSurface.mu * 1200;
      filter.Q.value = 3.0;

      const gainNode = ctx.createGain();
      const now = ctx.currentTime;
      const volume = Math.min(0.28, 0.05 + intensity * 0.15);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.1);
      gainNode.gain.setValueAtTime(volume, now + durationMs / 1000 - 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + durationMs / 1000);
    } catch {
      // Graceful fallback
    }
  }, [soundEnabled, selectedSurface.mu]);

  // Init 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.18);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0.15, 0.45, 0.95);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    (renderer as any).toneMapping = (THREE as any).ACESFilmicToneMapping ?? 3;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.05, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 0.4;
    controls.maxDistance = 2.5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xfffaf0, 2.5);
    mainSpot.position.set(0.6, 1.2, 0.8);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.4;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 2048;
    mainSpot.shadow.mapSize.height = 2048;
    mainSpot.shadow.bias = -0.0001;
    scene.add(mainSpot);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.8);
    fillLight.position.set(-1, 0.8, -0.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.6);
    rimLight.position.set(0, -0.2, -1);
    scene.add(rimLight);

    // Floor & Grid
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.16;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(8, 40, 0x334155, 0x1e293b);
    grid.position.y = -0.159;
    scene.add(grid);

    // Bench Group
    const benchGroup = new THREE.Group();

    // Track Base
    const trackGeo = new THREE.BoxGeometry(1.2, 0.04, 0.3);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.5,
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.position.y = -0.02;
    trackMesh.receiveShadow = true;
    benchGroup.add(trackMesh);

    // Surface Inset Strip
    const stripGeo = new THREE.BoxGeometry(1.16, 0.006, 0.26);
    const stripMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedSurface.color),
      roughness: selectedSurface.roughness,
      metalness: selectedSurface.metalness,
    });
    const surfaceStrip = new THREE.Mesh(stripGeo, stripMat);
    surfaceStrip.position.y = 0.003;
    surfaceStrip.receiveShadow = true;
    benchGroup.add(surfaceStrip);
    surfaceStripRef.current = surfaceStrip;

    // Millimeter Ruler Markers
    const rulerGeo = new THREE.PlaneGeometry(1.1, 0.02);
    const rulerCanvas = document.createElement('canvas');
    rulerCanvas.width = 1024;
    rulerCanvas.height = 64;
    const rCtx = rulerCanvas.getContext('2d');
    if (rCtx) {
      rCtx.fillStyle = '#0f172a';
      rCtx.fillRect(0, 0, 1024, 64);
      rCtx.strokeStyle = '#38bdf8';
      rCtx.fillStyle = '#38bdf8';
      rCtx.font = 'bold 20px monospace';
      for (let i = 0; i <= 100; i += 2) {
        const x = (i / 100) * 1000 + 12;
        const h = i % 10 === 0 ? 36 : i % 5 === 0 ? 24 : 14;
        rCtx.beginPath();
        rCtx.moveTo(x, 0);
        rCtx.lineTo(x, h);
        rCtx.stroke();
        if (i % 10 === 0) {
          rCtx.fillText(`${i}cm`, x - 18, 56);
        }
      }
    }
    const rulerTex = new THREE.CanvasTexture(rulerCanvas);
    const rulerMat = new THREE.MeshBasicMaterial({ map: rulerTex, transparent: true });
    const rulerMesh = new THREE.Mesh(rulerGeo, rulerMat);
    rulerMesh.rotation.x = -Math.PI / 2;
    rulerMesh.position.set(0, 0.007, 0.115);
    benchGroup.add(rulerMesh);

    scene.add(benchGroup);

    // Wooden Test Block
    const blockGroup = new THREE.Group();
    blockGroup.position.set(-0.35, 0.006, 0);

    const blockWidth = 0.14;
    const blockHeight = 0.05;
    const blockDepth = 0.09;
    const blockGeo = new THREE.BoxGeometry(blockWidth, blockHeight, blockDepth);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.65,
      metalness: 0.05,
    });
    const blockMesh = new THREE.Mesh(blockGeo, blockMat);
    blockMesh.position.y = blockHeight / 2;
    blockMesh.castShadow = true;
    blockMesh.receiveShadow = true;
    blockGroup.add(blockMesh);

    // Block Hook
    const hookGeo = new THREE.TorusGeometry(0.008, 0.002, 12, 24);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const hookMesh = new THREE.Mesh(hookGeo, hookMat);
    hookMesh.rotation.y = Math.PI / 2;
    hookMesh.position.set(blockWidth / 2 + 0.006, blockHeight / 2, 0);
    blockGroup.add(hookMesh);

    // Weights Group on top of block
    const weightsGroup = new THREE.Group();
    weightsGroup.position.set(0, blockHeight, 0);
    blockGroup.add(weightsGroup);
    weightsGroupRef.current = weightsGroup;

    // Thermal Friction Glow
    const glowGeo = new THREE.PlaneGeometry(blockWidth * 1.1, blockDepth * 1.1);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff3b30,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const thermalGlow = new THREE.Mesh(glowGeo, glowMat);
    thermalGlow.rotation.x = -Math.PI / 2;
    thermalGlow.position.y = 0.001;
    blockGroup.add(thermalGlow);
    thermalGlowMeshRef.current = thermalGlow;

    scene.add(blockGroup);
    blockGroupRef.current = blockGroup;

    // Dynamometer Group (Lực kế lò xo)
    const dynaGroup = new THREE.Group();
    dynaGroup.position.set(0.12, 0.035, 0);

    // Housing Tube
    const tubeGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.18, 24);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
      metalness: 0.1,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.rotation.z = Math.PI / 2;
    dynaGroup.add(tubeMesh);

    // Internal Spring
    const springRadius = 0.009;
    const springTurns = 12;
    const springPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const angle = t * springTurns * Math.PI * 2;
      const x = -0.07 + t * 0.12;
      const y = Math.sin(angle) * springRadius;
      const z = Math.cos(angle) * springRadius;
      springPoints.push(new THREE.Vector3(x, y, z));
    }
    const springGeo = new THREE.BufferGeometry().setFromPoints(springPoints);
    const springMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const springLine = new THREE.Line(springGeo, springMat);
    dynaGroup.add(springLine);

    // Needle Indicator
    const needleGeo = new THREE.ConeGeometry(0.005, 0.02, 16);
    const needleMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const needleMesh = new THREE.Mesh(needleGeo, needleMat);
    needleMesh.rotation.z = Math.PI;
    needleMesh.position.set(-0.06, 0.022, 0);
    dynaGroup.add(needleMesh);
    needleMeshRef.current = needleMesh;

    scene.add(dynaGroup);
    dynamometerGroupRef.current = dynaGroup;

    // String connecting block to dynamometer
    const stringPoints = [
      new THREE.Vector3(-0.35 + blockWidth / 2 + 0.012, 0.035, 0),
      new THREE.Vector3(0.12 - 0.09, 0.035, 0),
    ];
    const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
    const stringMat = new THREE.LineBasicMaterial({ color: 0xe2e8f0, linewidth: 2 });
    const pullString = new THREE.Line(stringGeo, stringMat);
    scene.add(pullString);
    pullStringMeshRef.current = pullString;

    // Microscopic Friction Particles
    const particleCount = 45;
    const particlePoints: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      particlePoints.push(
        new THREE.Vector3(
          -0.35 + (Math.random() - 0.5) * blockWidth,
          0.008 + Math.random() * 0.03,
          (Math.random() - 0.5) * blockDepth
        )
      );
    }
    const particleGeo = new THREE.BufferGeometry().setFromPoints(particlePoints);
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.006,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    frictionParticlesRef.current = particles;

    // Arrow Vectors
    const arrowP = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 0.12, 0xef4444, 0.03, 0.02);
    const arrowN = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 0.12, 0x3b82f6, 0.03, 0.02);
    const arrowFk = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 0.15, 0x10b981, 0.03, 0.02);
    const arrowFms = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 0.12, 0xf59e0b, 0.03, 0.02);

    blockGroup.add(arrowP);
    blockGroup.add(arrowN);
    blockGroup.add(arrowFk);
    blockGroup.add(arrowFms);

    vectorPRef.current = arrowP;
    vectorNRef.current = arrowN;
    vectorFkRef.current = arrowFk;
    vectorFmsRef.current = arrowFms;

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let reqId: number;
    const renderLoop = () => {
      reqId = requestAnimationFrame(renderLoop);
      controls.update();
      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      renderer.dispose();
    };
  }, []);

  // Update Surface material in 3D
  useEffect(() => {
    if (!surfaceStripRef.current) return;
    const mat = surfaceStripRef.current.material as THREE.MeshStandardMaterial;
    mat.color.set(selectedSurface.color);
    mat.roughness = selectedSurface.roughness;
    mat.metalness = selectedSurface.metalness;
    mat.needsUpdate = true;
  }, [selectedSurface]);

  // Update Weights on block
  useEffect(() => {
    if (!weightsGroupRef.current) return;
    const group = weightsGroupRef.current;
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const weightCount = Math.round(addedMassKg / 0.1); // 100g each
    const diskRadius = 0.025;
    const diskHeight = 0.012;

    for (let i = 0; i < weightCount; i++) {
      const diskGeo = new THREE.CylinderGeometry(diskRadius, diskRadius, diskHeight, 24);
      const diskMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.85,
        roughness: 0.25,
      });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      disk.position.y = diskHeight / 2 + i * diskHeight;
      disk.castShadow = true;
      group.add(disk);

      // Pin
      const pinGeo = new THREE.CylinderGeometry(0.003, 0.003, diskHeight * 1.4, 12);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.y = disk.position.y;
      group.add(pin);
    }
  }, [addedMassKg]);

  // Update Vectors visibility and length
  useEffect(() => {
    const p = vectorPRef.current;
    const n = vectorNRef.current;
    const fk = vectorFkRef.current;
    const fms = vectorFmsRef.current;
    if (!p || !n || !fk || !fms) return;

    p.visible = showVectors;
    n.visible = showVectors;
    fk.visible = showVectors && currentForceN > 0.01;
    fms.visible = showVectors && currentForceN > 0.01;

    const massFactor = normalForce / 5.0; // scale length
    p.setLength(Math.max(0.06, Math.min(0.25, 0.06 * massFactor)), 0.025, 0.015);
    n.setLength(Math.max(0.06, Math.min(0.25, 0.06 * massFactor)), 0.025, 0.015);

    const fScale = Math.max(0.05, Math.min(0.25, (currentForceN / 3.0) * 0.18));
    fk.setLength(fScale, 0.025, 0.015);
    fms.setLength(fScale, 0.025, 0.015);
  }, [showVectors, currentForceN, normalForce]);

  // Camera presets
  useEffect(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;

    if (cameraMode === 'side') {
      cam.position.set(0, 0.12, 0.95);
      ctrl.target.set(0, 0.05, 0);
    } else if (cameraMode === 'top') {
      cam.position.set(0, 1.2, 0.05);
      ctrl.target.set(0, 0, 0);
    } else {
      cam.position.set(0.15, 0.45, 0.95);
      ctrl.target.set(0, 0.05, 0);
    }
    ctrl.update();
  }, [cameraMode]);

  // Pulling Animation & Spring Deflection
  useEffect(() => {
    if (!isPulling) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const startX = -0.35;
    const endX = 0.05;
    const duration = 2400; // ms
    const startTime = performance.now();

    playFrictionSound(duration, selectedSurface.mu);

    const animatePull = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      animProgressRef.current = progress;

      // Displacement
      const currentX = startX + (endX - startX) * progress;
      if (blockGroupRef.current) {
        blockGroupRef.current.position.x = currentX;
      }
      if (dynamometerGroupRef.current) {
        dynamometerGroupRef.current.position.x = currentX + 0.47;
      }

      // Update pull string
      if (pullStringMeshRef.current) {
        const positions = (pullStringMeshRef.current.geometry as any).attributes?.position as THREE.BufferAttribute | undefined;
        if (positions) {
          positions.setXYZ(0, currentX + 0.082, 0.035, 0);
          positions.setXYZ(1, currentX + 0.47 - 0.09, 0.035, 0);
          positions.needsUpdate = true;
        }
      }

      // Dynamic force curve: rises to static peak then settles to kinetic plateau
      let instantaneousForce = 0;
      if (progress < 0.15) {
        // Ramp up
        instantaneousForce = (progress / 0.15) * targetFrictionForce * 1.08;
      } else {
        // Sliding steady state with tiny vibrations
        const jitter = Math.sin(elapsed * 0.04) * 0.02 * targetFrictionForce;
        instantaneousForce = targetFrictionForce + jitter;
      }

      const clampedForce = Math.max(0, instantaneousForce);
      onForceChange(clampedForce);

      // Needle shift on dynamometer
      if (needleMeshRef.current) {
        const needleShift = (clampedForce / 3.0) * 0.07;
        needleMeshRef.current.position.x = -0.06 + Math.min(0.07, needleShift);
      }

      // Glow & particles
      if (thermalGlowMeshRef.current) {
        const glowOpacity = Math.min(0.7, (targetFrictionForce / 2.5) * 0.6);
        (thermalGlowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = glowOpacity;
      }
      if (frictionParticlesRef.current) {
        const pMat = frictionParticlesRef.current.material as THREE.PointsMaterial;
        pMat.opacity = progress > 0.05 && progress < 0.95 ? 0.8 : 0.0;
      }

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(animatePull);
      } else {
        if (thermalGlowMeshRef.current) {
          (thermalGlowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
        }
        if (frictionParticlesRef.current) {
          (frictionParticlesRef.current.material as THREE.PointsMaterial).opacity = 0;
        }
        onPullComplete(targetFrictionForce);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animatePull);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPulling, targetFrictionForce, selectedSurface.mu, onForceChange, onPullComplete, playFrictionSound]);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full flex-1" />

      {/* Floating HUD: Digital Force Meter Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/60 shadow-xl flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Lực Ma Sát Trượt (F_mst)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {currentForceN > 0 ? currentForceN.toFixed(2) : targetFrictionForce.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">N</span>
          </div>
        </div>
        <div className="h-8 w-[1px] bg-slate-700/80" />
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Áp Lực (N = P)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-sky-400 font-mono">{normalForce.toFixed(2)}</span>
            <span className="text-xs font-bold text-slate-400">N</span>
          </div>
        </div>
        <div className="h-8 w-[1px] bg-slate-700/80" />
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Hệ Số Ma Sát (μ)</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{selectedSurface.mu.toFixed(2)}</span>
        </div>
      </div>

      {/* Microscopic Surface Texture View Overlay */}
      {showMicroView && (
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/70 shadow-2xl w-64">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>🔬</span> Cấu Trúc Vi Mô Tiếp Xúc
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              Zoom 1000x
            </span>
          </div>
          
          {/* Micro teeth SVG Canvas */}
          <div className="w-full h-20 bg-slate-950 rounded-lg p-2 border border-slate-800 relative overflow-hidden flex flex-col justify-end">
            <svg viewBox="0 0 200 60" className="w-full h-full">
              {/* Top block teeth */}
              <path
                d={`M 0,20 ${Array.from({ length: selectedSurface.microStructure.teethCount })
                  .map((_, i) => {
                    const step = 200 / selectedSurface.microStructure.teethCount;
                    const x = i * step;
                    const h = selectedSurface.microStructure.teethHeight;
                    return `L ${x + step / 2},${20 + h * 0.7} L ${x + step},20`;
                  })
                  .join(' ')} L 200,0 L 0,0 Z`}
                fill="#d97706"
                opacity="0.8"
              />
              {/* Bottom surface teeth */}
              <path
                d={`M 0,40 ${Array.from({ length: selectedSurface.microStructure.teethCount })
                  .map((_, i) => {
                    const step = 200 / selectedSurface.microStructure.teethCount;
                    const x = i * step;
                    const h = selectedSurface.microStructure.teethHeight;
                    return `L ${x + step / 2},${40 - h * 0.7} L ${x + step},40`;
                  })
                  .join(' ')} L 200,60 L 0,60 Z`}
                fill={selectedSurface.color}
                opacity="0.9"
              />
            </svg>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-tight">{selectedSurface.microStructure.explanation}</p>
        </div>
      )}
    </div>
  );
};
