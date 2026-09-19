import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { type LiquidPreset } from './specificHeatEngine';

interface SpecificHeatWorkbench3DProps {
  selectedLiquid: LiquidPreset;
  massKg: number;
  powerW: number;
  isHeating: boolean;
  isBoiling: boolean;
  hasStirrer: boolean;
  currentTempC: number;
  initialTempC: number;
  elapsedSec: number;
  heatJoules: number;
  soundEnabled: boolean;
  cameraMode: 'perspective' | 'front' | 'top';
}

export const SpecificHeatWorkbench3D: React.FC<SpecificHeatWorkbench3DProps> = ({
  selectedLiquid,
  massKg,
  powerW,
  isHeating,
  isBoiling,
  hasStirrer,
  currentTempC,
  initialTempC: _initialTempC,
  elapsedSec,
  heatJoules,
  soundEnabled,
  cameraMode,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Mesh & Group Refs
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const coilMeshRef = useRef<THREE.Mesh | null>(null);
  const stirrerGroupRef = useRef<THREE.Group | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const bubbleParticlesRef = useRef<THREE.Points | null>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio heating simmer effect
  const playSimmerSound = useCallback((active: boolean, boiling: boolean) => {
    if (!soundEnabled || !active) {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      // Gentle white noise buffer for boiling liquid
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * (boiling ? 0.35 : 0.15);
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = boiling ? 800 : 400;
      filter.Q.value = 2.0;

      const gain = ctx.createGain();
      gain.gain.value = boiling ? 0.08 : 0.03;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch {
      // Audio graceful fallback
    }
  }, [soundEnabled]);

  // Init 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070b14');
    scene.fog = new THREE.FogExp2('#070b14', 0.16);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 0.95);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    (renderer as any).toneMapping = (THREE as any).ACESFilmicToneMapping ?? 3;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.12, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 0.4;
    controls.maxDistance = 2.5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xfff8ed, 2.5);
    mainSpot.position.set(0.6, 1.2, 0.8);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.4;
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const blueFill = new THREE.DirectionalLight(0x38bdf8, 0.8);
    blueFill.position.set(-1, 0.8, -0.5);
    scene.add(blueFill);

    const warmRim = new THREE.DirectionalLight(0xf97316, 0.7);
    warmRim.position.set(0, -0.2, -1);
    scene.add(warmRim);

    // Laboratory Floor & Grid
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(6, 30, 0x1e293b, 0x0f172a);
    grid.position.y = -0.049;
    scene.add(grid);

    // Workbench Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.04, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.02;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // CALORIMETER VESSEL ASSEMBLY
    const caloGroup = new THREE.Group();

    // 1. Outer Vessel (Double-wall insulated with transparent front cutaway)
    // Outer Base & Top Metallic Rings
    const ringGeo = new THREE.TorusGeometry(0.12, 0.008, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.2 });
    
    const topRing = new THREE.Mesh(ringGeo, ringMat);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = 0.24;
    caloGroup.add(topRing);

    const bottomRing = new THREE.Mesh(ringGeo, ringMat);
    bottomRing.rotation.x = Math.PI / 2;
    bottomRing.position.y = 0.01;
    caloGroup.add(bottomRing);

    // Outer Insulated Acrylic Wall (semi-transparent so inside is clearly visible)
    const outerGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.23, 32, 1, true);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const outerVessel = new THREE.Mesh(outerGeo, outerMat);
    outerVessel.position.y = 0.12;
    caloGroup.add(outerVessel);

    // 2. Inner Transparent Glass Chamber
    const glassGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.22, 32);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
    });
    const glassChamber = new THREE.Mesh(glassGeo, glassMat);
    glassChamber.position.y = 0.12;
    caloGroup.add(glassChamber);

    // 3. Liquid inside chamber
    const liquidGeo = new THREE.CylinderGeometry(0.096, 0.096, 0.16, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedLiquid.color),
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 0.05,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0.09;
    caloGroup.add(liquidMesh);
    liquidMeshRef.current = liquidMesh;

    // 4. Calorimeter Lid (Nắp bình nhiệt lượng kế - semi transparent acrylic)
    const lidGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.015, 32);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.75,
      roughness: 0.3,
      metalness: 0.5,
    });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 0.24;
    caloGroup.add(lid);

    // 5. Heating Coil (Dây mayso nung)
    const coilRadius = 0.045;
    const coilTurns = 6;
    const coilPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 150; i++) {
      const t = i / 150;
      const angle = t * coilTurns * Math.PI * 2;
      const x = Math.cos(angle) * coilRadius;
      const z = Math.sin(angle) * coilRadius;
      const y = 0.02 + t * 0.04;
      coilPoints.push(new THREE.Vector3(x, y, z));
    }
    const coilGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(coilPoints),
      64,
      0.003,
      8,
      false
    );
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0x000000,
      roughness: 0.4,
      metalness: 0.8,
    });
    const coilMesh = new THREE.Mesh(coilGeo, coilMat);
    caloGroup.add(coilMesh);
    coilMeshRef.current = coilMesh;

    // 6. Coil Power Lead Wires (Dây dẫn điện)
    const wireGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.24, 12);
    const wireMat1 = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 }); // Red wire
    const wireMat2 = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 }); // Black wire

    const wire1 = new THREE.Mesh(wireGeo, wireMat1);
    wire1.position.set(0.045, 0.15, 0);
    caloGroup.add(wire1);

    const wire2 = new THREE.Mesh(wireGeo, wireMat2);
    wire2.position.set(-0.045, 0.15, 0);
    caloGroup.add(wire2);

    // 7. Mechanical Stirrer (Que khuấy nhiệt cơ học)
    const stirrerGroup = new THREE.Group();
    stirrerGroup.position.set(0, 0.24, 0.035);

    const rodGeo = new THREE.CylinderGeometry(0.0025, 0.0025, 0.22, 12);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.position.y = -0.09;
    stirrerGroup.add(rod);

    // Stirrer Blades (Cánh khuấy)
    const bladeGeo = new THREE.BoxGeometry(0.04, 0.008, 0.004);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
    blade1.position.y = -0.19;
    stirrerGroup.add(blade1);

    const blade2 = new THREE.Mesh(bladeGeo, bladeMat);
    blade2.position.y = -0.19;
    blade2.rotation.y = Math.PI / 2;
    stirrerGroup.add(blade2);

    // Stirrer Top Knob
    const knobGeo = new THREE.SphereGeometry(0.012, 16, 16);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.position.y = 0.02;
    stirrerGroup.add(knob);

    caloGroup.add(stirrerGroup);
    stirrerGroupRef.current = stirrerGroup;

    // 8. Thermometer Probe (Cảm biến que đo nhiệt độ)
    const thermoGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.26, 12);
    const thermoMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
    const thermo = new THREE.Mesh(thermoGeo, thermoMat);
    thermo.position.set(0, 0.16, -0.04);
    caloGroup.add(thermo);

    // Probe Tip (Đầu đo nhiệt độ bằng đồng)
    const tipGeo = new THREE.CylinderGeometry(0.0035, 0.0035, 0.02, 12);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.3 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.set(0, 0.04, -0.04);
    caloGroup.add(tip);

    // 9. Rising Steam / Heat Particles
    const steamCount = 30;
    const steamPoints: THREE.Vector3[] = [];
    for (let i = 0; i < steamCount; i++) {
      steamPoints.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          0.24 + Math.random() * 0.15,
          (Math.random() - 0.5) * 0.08
        )
      );
    }
    const steamGeo = new THREE.BufferGeometry().setFromPoints(steamPoints);
    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    caloGroup.add(steamParticles);
    steamParticlesRef.current = steamParticles;

    // 10. Boiling Bubbles Particles inside liquid
    const bubbleCount = 40;
    const bubblePoints: THREE.Vector3[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      bubblePoints.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.14,
          0.02 + Math.random() * 0.14,
          (Math.random() - 0.5) * 0.14
        )
      );
    }
    const bubbleGeo = new THREE.BufferGeometry().setFromPoints(bubblePoints);
    const bubbleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.006,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const bubbleParticles = new THREE.Points(bubbleGeo, bubbleMat);
    caloGroup.add(bubbleParticles);
    bubbleParticlesRef.current = bubbleParticles;

    scene.add(caloGroup);

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

    // Animation Render Loop
    let reqId: number;
    let clock = 0;
    const renderLoop = () => {
      reqId = requestAnimationFrame(renderLoop);
      clock += 0.03;

      // Stirrer rotation animation
      if (stirrerGroupRef.current && hasStirrer) {
        stirrerGroupRef.current.rotation.y += isHeating ? 0.12 : 0.04;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      renderer.dispose();
    };
  }, [hasStirrer, isHeating, selectedLiquid.color, selectedLiquid.opacity]);

  // Update Liquid Material & Volume Height
  useEffect(() => {
    if (!liquidMeshRef.current) return;
    const mat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.color.set(selectedLiquid.color);
    mat.opacity = selectedLiquid.opacity;

    // Height scale based on mass (0.1kg -> 0.4kg)
    const scaleY = 0.5 + (massKg / 0.4) * 0.6;
    liquidMeshRef.current.scale.set(1, scaleY, 1);
    liquidMeshRef.current.position.y = 0.02 + 0.07 * scaleY;
  }, [selectedLiquid, massKg]);

  // Update Heating Coil Glow and Particles
  useEffect(() => {
    if (coilMeshRef.current) {
      const mat = coilMeshRef.current.material as THREE.MeshStandardMaterial;
      if (isHeating) {
        const glowFactor = Math.min(1.0, (powerW / 100) * 0.9);
        mat.emissive.setHex(0xff3b30);
        mat.emissiveIntensity = glowFactor;
      } else {
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
      }
    }

    if (steamParticlesRef.current) {
      const mat = steamParticlesRef.current.material as THREE.PointsMaterial;
      const opacity = isBoiling ? 0.75 : isHeating && currentTempC > 45 ? 0.35 : 0;
      mat.opacity = opacity;
    }

    if (bubbleParticlesRef.current) {
      const mat = bubbleParticlesRef.current.material as THREE.PointsMaterial;
      mat.opacity = isBoiling ? 0.9 : isHeating ? 0.45 : 0;
    }

    playSimmerSound(isHeating, isBoiling);
  }, [isHeating, isBoiling, powerW, currentTempC, playSimmerSound]);

  // Camera presets
  useEffect(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;

    if (cameraMode === 'front') {
      cam.position.set(0, 0.16, 0.75);
      ctrl.target.set(0, 0.12, 0);
    } else if (cameraMode === 'top') {
      cam.position.set(0, 0.95, 0.05);
      ctrl.target.set(0, 0.1, 0);
    } else {
      cam.position.set(0, 0.45, 0.95);
      ctrl.target.set(0, 0.12, 0);
    }
    ctrl.update();
  }, [cameraMode]);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full flex-1" />

      {/* Floating HUD: Digital Telemetry Panel */}
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/60 shadow-xl flex items-center gap-4">
        {/* Temperature */}
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Nhiệt Độ (T)</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black font-mono ${isBoiling ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
              {currentTempC.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-400">°C</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-700/80" />

        {/* Elapsed Time */}
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Thời Gian (t)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-sky-400 font-mono">
              {elapsedSec}
            </span>
            <span className="text-xs font-bold text-slate-400">s</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-700/80" />

        {/* Power */}
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Công Suất (P)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-emerald-400 font-mono">{isHeating ? powerW : 0}</span>
            <span className="text-xs font-bold text-slate-400">W</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-700/80" />

        {/* Heat Energy Joules */}
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Nhiệt Lượng (Q)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-purple-400 font-mono">{heatJoules}</span>
            <span className="text-xs font-bold text-slate-400">J</span>
          </div>
        </div>
      </div>

      {/* Boil warning indicator */}
      {isBoiling && (
        <div className="absolute top-4 right-4 bg-rose-950/90 text-rose-300 border border-rose-500/50 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xl animate-bounce">
          <span>⚠️</span>
          <span>Chất lỏng đã sôi ({selectedLiquid.boilingPointC}°C)! Tự động ngắt nhiệt.</span>
        </div>
      )}
    </div>
  );
};
