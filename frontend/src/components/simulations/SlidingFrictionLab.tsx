import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';
import { ScreenshotCaptureModal } from '../common/ScreenshotCaptureModal';

interface Measurement {
  trial: number;
  surfaceName: string;
  normalForce: number; // N
  frictionForce: number; // F_ms (N)
  mu: number; // μ
}

interface SurfacePreset {
  id: string;
  name: string;
  mu: number;
  color: string;
  roughness: number;
  metalness: number;
  icon: string;
  description: string;
  microStructure: {
    title: string;
    textureType: string;
    teethCount: number;
    teethHeight: number;
    explanation: string;
  };
}

const SURFACE_PRESETS: SurfacePreset[] = [
  {
    id: 'wood',
    name: 'Gỗ Tự Nhiên',
    mu: 0.25,
    color: '#854d0e',
    roughness: 0.7,
    metalness: 0.05,
    icon: '🌲',
    description: 'Bề mặt gỗ bào nhẵn tiêu chuẩn SGK (μ = 0.25)',
    microStructure: {
      title: 'Mấp mô sợi xenluloza (Gỗ)',
      textureType: 'wood_grain',
      teethCount: 16,
      teethHeight: 14,
      explanation: 'Các thớ gỗ có nhiều mấp mô nhỏ, khi trượt các đỉnh mấp mô móc vào nhau gây cản trở chuyển động.',
    },
  },
  {
    id: 'glass',
    name: 'Kính Phẳng Mịn',
    mu: 0.15,
    color: '#38bdf8',
    roughness: 0.1,
    metalness: 0.1,
    icon: '🪟',
    description: 'Bề mặt kính quang học siêu trơn (μ = 0.15)',
    microStructure: {
      title: 'Mạng tinh thể phẳng (Kính)',
      textureType: 'smooth_lattice',
      teethCount: 6,
      teethHeight: 4,
      explanation: 'Bề mặt kính vô định hình rất phẳng, ít mấp mô cơ học, lực cản chủ yếu do liên kết phân tử yếu.',
    },
  },
  {
    id: 'aluminum',
    name: 'Hợp Kim Nhôm',
    mu: 0.35,
    color: '#94a3b8',
    roughness: 0.35,
    metalness: 0.8,
    icon: '🛡️',
    description: 'Máng nhôm định hình xước mờ (μ = 0.35)',
    microStructure: {
      title: 'Vệt xước định hình kim loại (Nhôm)',
      textureType: 'metallic_grooves',
      teethCount: 22,
      teethHeight: 18,
      explanation: 'Các rãnh phay kim loại tạo độ nhám vừa phải, sinh lực cản ma sát đáng kể.',
    },
  },
  {
    id: 'rubber',
    name: 'Cao Su / Nhám',
    mu: 0.60,
    color: '#334155',
    roughness: 0.95,
    metalness: 0.0,
    icon: '⬛',
    description: 'Bề mặt phủ lớp đệm cao su ma sát cao (μ = 0.60)',
    microStructure: {
      title: 'Mạng polymer đàn hồi (Cao su)',
      textureType: 'rubber_elastic',
      teethCount: 30,
      teethHeight: 28,
      explanation: 'Chuỗi polymer đàn hồi bám dính sâu vào mặt đáy khối gỗ, tạo lực ma sát trượt và nhiệt lượng rất lớn.',
    },
  },
];

export const SlidingFrictionLab: React.FC = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement | null>(null);

  // States
  const [selectedSurface, setSelectedSurface] = useState<SurfacePreset>(SURFACE_PRESETS[0]);
  const [addedMass, setAddedMass] = useState(0.1); // 100g = 0.1kg added
  const [blockMass] = useState(0.2); // 200g base wooden block
  const [isPulling, setIsPulling] = useState(false);
  const [currentForce, setCurrentForce] = useState(0);
  const [showVectors, setShowVectors] = useState(true);
  const [showMicroView, setShowMicroView] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'side' | 'top'>('perspective');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [screenshotData, setScreenshotData] = useState<string>('');

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Meshes & Effects Refs
  const blockGroupRef = useRef<THREE.Group | null>(null);
  const weightsGroupRef = useRef<THREE.Group | null>(null);
  const surfaceStripRef = useRef<THREE.Mesh | null>(null);
  const dynamometerGroupRef = useRef<THREE.Group | null>(null);
  const needleMeshRef = useRef<THREE.Mesh | null>(null);
  const pullStringMeshRef = useRef<THREE.Line | null>(null);
  const thermalGlowMeshRef = useRef<THREE.Mesh | null>(null);
  const frictionParticlesRef = useRef<THREE.Points | null>(null);

  // Vectors
  const vectorPRef = useRef<THREE.ArrowHelper | null>(null);
  const vectorNRef = useRef<THREE.ArrowHelper | null>(null);
  const vectorFkRef = useRef<THREE.ArrowHelper | null>(null);
  const vectorFmsRef = useRef<THREE.ArrowHelper | null>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Physics & Animation
  const totalMass = blockMass + addedMass;
  const normalForce = totalMass * 9.81;
  const targetFrictionForce = normalForce * selectedSurface.mu;
  const animProgressRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // -------------------------------------------------------------
  // Web Audio Friction Scraping Synthesizer
  // -------------------------------------------------------------
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

      // Generate White Noise Buffer
      const bufferSize = ctx.sampleRate * (durationMs / 1000 + 0.2);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Bandpass Filter (Texture-dependent scrape frequency)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600 + selectedSurface.mu * 1200;
      filter.Q.value = 3.0;

      // Gain Envelope
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
      // Audio playback fails gracefully if blocked
    }
  }, [soundEnabled, selectedSurface.mu]);

  // -------------------------------------------------------------
  // 3D Scene Initialization
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.18);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0.15, 0.45, 0.95);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    (renderer as any).toneMapping = (THREE as any).ACESFilmicToneMapping ?? 3;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.05, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 0.4;
    controls.maxDistance = 2.5;
    controlsRef.current = controls;

    // 5. Lighting
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

    // 6. Studio Floor
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

    // 7. Laboratory Track Bench
    const benchGroup = new THREE.Group();

    // Track Base
    const trackGeo = new THREE.BoxGeometry(1.2, 0.04, 0.3);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.5,
    });
    const trackBase = new THREE.Mesh(trackGeo, trackMat);
    trackBase.position.y = -0.02;
    trackBase.receiveShadow = true;
    trackBase.castShadow = true;
    benchGroup.add(trackBase);

    // Aluminum Guide Rails
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2,
    });
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.015, 0.015), railMat);
    rail1.position.set(0, 0.0075, 0.135);
    benchGroup.add(rail1);

    const rail2 = rail1.clone();
    rail2.position.z = -0.135;
    benchGroup.add(rail2);

    // Bench Legs
    const legGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.12, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const legPositions = [
      [-0.55, -0.1, 0.11],
      [0.55, -0.1, 0.11],
      [-0.55, -0.1, -0.11],
      [0.55, -0.1, -0.11],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      benchGroup.add(leg);
    });

    // Replaceable Surface Test Strip
    const stripGeo = new THREE.BoxGeometry(1.16, 0.006, 0.24);
    const stripMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(SURFACE_PRESETS[0].color),
      roughness: SURFACE_PRESETS[0].roughness,
      metalness: SURFACE_PRESETS[0].metalness,
    });
    const surfaceStrip = new THREE.Mesh(stripGeo, stripMat);
    surfaceStrip.position.set(0, 0.003, 0);
    surfaceStrip.receiveShadow = true;
    benchGroup.add(surfaceStrip);
    surfaceStripRef.current = surfaceStrip;

    // Track Measurement Ticks (Laser Ruler every 5cm)
    for (let i = -10; i <= 10; i++) {
      const tickX = i * 0.05;
      const isMajor = i % 2 === 0;
      const tickGeo = new THREE.PlaneGeometry(0.0015, isMajor ? 0.015 : 0.008);
      const tickMat = new THREE.MeshBasicMaterial({ color: isMajor ? 0xf8fafc : 0x94a3b8 });
      const tickMesh = new THREE.Mesh(tickGeo, tickMat);
      tickMesh.rotation.x = -Math.PI / 2;
      tickMesh.position.set(tickX, 0.0062, 0.11);
      benchGroup.add(tickMesh);
    }

    scene.add(benchGroup);

    // 8. Sliding Wooden Block Assembly
    const blockGroup = new THREE.Group();
    blockGroup.position.set(-0.35, 0.006, 0);

    // Wooden Block Body (Length 0.20m, Height 0.05m, Width 0.12m)
    const blockGeo = new THREE.BoxGeometry(0.20, 0.05, 0.12);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.6,
      metalness: 0.05,
    });
    const blockBody = new THREE.Mesh(blockGeo, blockMat);
    blockBody.position.y = 0.025;
    blockBody.castShadow = true;
    blockBody.receiveShadow = true;
    blockGroup.add(blockBody);

    // Center Pin for Stacking Weights
    const centerPinGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.05, 16);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    const centerPin = new THREE.Mesh(centerPinGeo, pinMat);
    centerPin.position.set(0, 0.065, 0);
    centerPin.castShadow = true;
    blockGroup.add(centerPin);

    // Front Metal Hook
    const hookGeo = new THREE.TorusGeometry(0.008, 0.0025, 8, 24, Math.PI * 1.5);
    const hookMesh = new THREE.Mesh(hookGeo, pinMat);
    hookMesh.rotation.z = -Math.PI / 2;
    hookMesh.position.set(0.102, 0.025, 0);
    blockGroup.add(hookMesh);

    // Weights Group
    const weightsGroup = new THREE.Group();
    blockGroup.add(weightsGroup);
    weightsGroupRef.current = weightsGroup;

    // Thermal Friction Contact Glow Strip (at the bottom interface of the block)
    const glowGeo = new THREE.PlaneGeometry(0.205, 0.125);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    });
    const thermalGlow = new THREE.Mesh(glowGeo, glowMat);
    thermalGlow.rotation.x = -Math.PI / 2;
    thermalGlow.position.set(0, 0.0005, 0);
    blockGroup.add(thermalGlow);
    thermalGlowMeshRef.current = thermalGlow;

    scene.add(blockGroup);
    blockGroupRef.current = blockGroup;

    // 9. 3D Friction Particle System (Contact sparkles/dust along interface)
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const pColor1 = new THREE.Color(0xf59e0b); // amber
    const pColor2 = new THREE.Color(0xef4444); // fiery red

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = -0.35 + (Math.random() - 0.5) * 0.18;
      particlePositions[i * 3 + 1] = 0.007 + Math.random() * 0.005;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.11;

      const c = Math.random() > 0.4 ? pColor1 : pColor2;
      particleColors[i * 3 + 0] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(particlePositions, 3);
    const colAttr = new THREE.BufferAttribute(particleColors, 3);
    if ((particleGeo as any).setAttribute) {
      (particleGeo as any).setAttribute('position', posAttr);
      (particleGeo as any).setAttribute('color', colAttr);
    } else if ((particleGeo as any).addAttribute) {
      (particleGeo as any).addAttribute('position', posAttr);
      (particleGeo as any).addAttribute('color', colAttr);
    }

    const particleMat = new THREE.PointsMaterial({
      size: 0.007,
      vertexColors: true as any,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const frictionParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(frictionParticles);
    frictionParticlesRef.current = frictionParticles;

    // 10. 3D Spring Dynamometer
    const dynGroup = new THREE.Group();
    dynGroup.position.set(0.05, 0.006 + 0.025, 0);

    const casingGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.22, 24);
    const casingMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
    });
    const casingMesh = new THREE.Mesh(casingGeo, casingMat);
    casingMesh.rotation.z = Math.PI / 2;
    dynGroup.add(casingMesh);

    const scaleGeo = new THREE.PlaneGeometry(0.18, 0.02);
    const scaleMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      side: THREE.DoubleSide,
    });
    const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat);
    scaleMesh.position.set(0, 0, 0.012);
    dynGroup.add(scaleMesh);

    for (let i = 0; i <= 5; i++) {
      const markX = -0.07 + (i / 5) * 0.14;
      const markGeo = new THREE.PlaneGeometry(0.001, 0.012);
      const markMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const markMesh = new THREE.Mesh(markGeo, markMat);
      markMesh.position.set(markX, 0, 0.0125);
      dynGroup.add(markMesh);
    }

    // Coiled Spring Geometry
    const curvePoints: THREE.Vector3[] = [];
    const coils = 16;
    const coilRadius = 0.008;
    const baseLength = 0.12;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const x = -baseLength / 2 + t * baseLength;
      const angle = t * coils * Math.PI * 2;
      const y = Math.sin(angle) * coilRadius;
      const z = Math.cos(angle) * coilRadius;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const springCurve = new THREE.CatmullRomCurve3(curvePoints);
    const springTubeGeo = new THREE.TubeGeometry(springCurve, 100, 0.0015, 8, false);
    const springMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
    });
    const springMesh = new THREE.Mesh(springTubeGeo, springMat);
    dynGroup.add(springMesh);

    // Red Live Needle / Piston Ring
    const needleGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.005, 24);
    const needleMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });
    const needleMesh = new THREE.Mesh(needleGeo, needleMat);
    needleMesh.rotation.z = Math.PI / 2;
    needleMesh.position.set(-0.07, 0, 0);
    dynGroup.add(needleMesh);
    needleMeshRef.current = needleMesh;

    const dynFrontHook = new THREE.Mesh(hookGeo, pinMat);
    dynFrontHook.rotation.z = Math.PI / 2;
    dynFrontHook.position.set(-0.115, 0, 0);
    dynGroup.add(dynFrontHook);

    const handleRingGeo = new THREE.TorusGeometry(0.022, 0.004, 16, 32);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
    const handleMesh = new THREE.Mesh(handleRingGeo, handleMat);
    handleMesh.rotation.y = Math.PI / 2;
    handleMesh.position.set(0.125, 0, 0);
    dynGroup.add(handleMesh);

    scene.add(dynGroup);
    dynamometerGroupRef.current = dynGroup;

    // 11. Connecting Nylon Pull String
    const stringMat = new THREE.LineBasicMaterial({ color: 0xf8fafc, linewidth: 2 });
    const stringGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.248, 0.031, 0),
      new THREE.Vector3(-0.065, 0.031, 0),
    ]);
    const pullStringMesh = new THREE.Line(stringGeo, stringMat);
    scene.add(pullStringMesh);
    pullStringMeshRef.current = pullStringMesh;

    // 12. Real-Time 3D Force Vectors
    const blockCenter = new THREE.Vector3(-0.35, 0.031, 0);

    const arrowP = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), blockCenter, 0.15, 0xef4444, 0.03, 0.02);
    scene.add(arrowP);
    vectorPRef.current = arrowP;

    const arrowN = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), blockCenter, 0.15, 0x06b6d4, 0.03, 0.02);
    scene.add(arrowN);
    vectorNRef.current = arrowN;

    const arrowFk = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), blockCenter, 0.12, 0xa855f7, 0.03, 0.02);
    scene.add(arrowFk);
    vectorFkRef.current = arrowFk;

    const arrowFms = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), blockCenter, 0.12, 0xf59e0b, 0.03, 0.02);
    scene.add(arrowFms);
    vectorFmsRef.current = arrowFms;

    // 13. Render Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }
    };
  }, []);

  // -------------------------------------------------------------
  // Update Weights on Block
  // -------------------------------------------------------------
  useEffect(() => {
    const weightsGroup = weightsGroupRef.current;
    if (!weightsGroup) return;

    while (weightsGroup.children.length > 0) {
      weightsGroup.remove(weightsGroup.children[0]);
    }

    const numDiscs = Math.round(addedMass / 0.05);
    if (numDiscs === 0) return;

    const discHeight = 0.012;
    const discRadius = 0.035;

    const discMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.25,
    });

    for (let i = 0; i < numDiscs; i++) {
      const discGroup = new THREE.Group();
      const discMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(discRadius, discRadius, discHeight, 32),
        discMat
      );
      discMesh.castShadow = true;
      discMesh.receiveShadow = true;
      discGroup.add(discMesh);

      const slitMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, discHeight + 0.001, discRadius + 0.005),
        new THREE.MeshBasicMaterial({ color: 0x451a03 })
      );
      slitMesh.position.set(0, 0, discRadius / 2);
      discGroup.add(slitMesh);

      discGroup.position.set(0, 0.05 + (i + 0.5) * (discHeight + 0.001), 0);
      weightsGroup.add(discGroup);
    }
  }, [addedMass]);

  // -------------------------------------------------------------
  // Update Surface Material
  // -------------------------------------------------------------
  useEffect(() => {
    const strip = surfaceStripRef.current;
    if (!strip) return;
    const mat = strip.material as THREE.MeshStandardMaterial;
    mat.color.set(selectedSurface.color);
    mat.roughness = selectedSurface.roughness;
    mat.metalness = selectedSurface.metalness;
    mat.needsUpdate = true;
  }, [selectedSurface]);

  // -------------------------------------------------------------
  // Update Force Vectors
  // -------------------------------------------------------------
  const updateForceVectors = useCallback((blockCenterX: number, liveF: number) => {
    const blockCenter = new THREE.Vector3(blockCenterX, 0.031, 0);

    const arrowP = vectorPRef.current;
    const arrowN = vectorNRef.current;
    const arrowFk = vectorFkRef.current;
    const arrowFms = vectorFmsRef.current;

    if (!arrowP || !arrowN || !arrowFk || !arrowFms) return;

    arrowP.visible = showVectors;
    arrowN.visible = showVectors;
    arrowFk.visible = showVectors;
    arrowFms.visible = showVectors;

    if (showVectors) {
      arrowP.position.copy(blockCenter);
      arrowN.position.copy(blockCenter);
      arrowFk.position.copy(blockCenter);
      arrowFms.position.copy(blockCenter);

      const normalScale = Math.max(0.06, Math.min(0.24, normalForce * 0.03));
      const frictionScale = Math.max(0.03, Math.min(0.24, liveF * 0.06));

      arrowP.setLength(normalScale, 0.025, 0.015);
      arrowN.setLength(normalScale, 0.025, 0.015);
      arrowFk.setLength(frictionScale, 0.025, 0.015);
      arrowFms.setLength(frictionScale, 0.025, 0.015);
    }
  }, [showVectors, normalForce]);

  // -------------------------------------------------------------
  // Update Dynamometer, Thermal Glow & Friction Particles
  // -------------------------------------------------------------
  const updateDynamometer = useCallback((blockPosX: number, liveForceValue: number, isMoving: boolean) => {
    const blockGroup = blockGroupRef.current;
    const dynGroup = dynamometerGroupRef.current;
    const needle = needleMeshRef.current;
    const pullString = pullStringMeshRef.current;
    const glow = thermalGlowMeshRef.current;
    const particles = frictionParticlesRef.current;

    if (!blockGroup || !dynGroup || !needle || !pullString) return;

    // 1. Move Block
    blockGroup.position.x = blockPosX;

    // 2. Move Dynamometer
    const stringLength = 0.15;
    const dynPosX = blockPosX + 0.10 + stringLength + 0.11;
    dynGroup.position.x = dynPosX;

    // 3. Update Pull String
    const hookBlockX = blockPosX + 0.102;
    const hookDynX = dynPosX - 0.115;
    const stringPositions = new Float32Array([
      hookBlockX, 0.031, 0,
      hookDynX, 0.031, 0,
    ]);
    const bufGeo = pullString.geometry as any;
    if (bufGeo.setAttribute) {
      bufGeo.setAttribute('position', new THREE.BufferAttribute(stringPositions, 3));
    } else if (bufGeo.addAttribute) {
      bufGeo.addAttribute('position', new THREE.BufferAttribute(stringPositions, 3));
    }
    if (bufGeo.attributes?.position) {
      bufGeo.attributes.position.needsUpdate = true;
    }

    // 4. Update Needle on Dynamometer
    const maxForceScale = 5.0;
    const needleX = -0.07 + Math.min(1.0, liveForceValue / maxForceScale) * 0.14;
    needle.position.x = needleX;

    // 5. Thermal Friction Contact Glow Effect
    if (glow) {
      const glowMat = glow.material as THREE.MeshBasicMaterial;
      const targetOpacity = isMoving ? Math.min(0.85, 0.25 + selectedSurface.mu * 0.6) : 0.0;
      glowMat.opacity = targetOpacity;
    }

    // 6. Dynamic Friction Particles along contact line
    if (particles) {
      const partMat = particles.material as THREE.PointsMaterial;
      partMat.opacity = isMoving ? Math.min(0.9, 0.3 + selectedSurface.mu * 0.7) : 0.0;

      if (isMoving) {
        const pGeo = particles.geometry as any;
        const posAttr = pGeo.attributes?.position;
        if (posAttr) {
          const arr = posAttr.array as Float32Array;
          const count = arr.length / 3;
          for (let i = 0; i < count; i++) {
            // Animate particles jittering and emitting backwards
            arr[i * 3 + 0] = blockPosX + (Math.random() - 0.5) * 0.19;
            arr[i * 3 + 1] = 0.007 + Math.random() * 0.008;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.11;
          }
          posAttr.needsUpdate = true;
        }
      }
    }

    // 7. Force vectors
    updateForceVectors(blockPosX, liveForceValue);
  }, [updateForceVectors, selectedSurface.mu]);

  // -------------------------------------------------------------
  // Pull Animation (Smooth 60 FPS Steady Motion)
  // -------------------------------------------------------------
  const handlePull = () => {
    if (isPulling) return;
    setIsPulling(true);

    const fMs = parseFloat(targetFrictionForce.toFixed(2));
    setCurrentForce(fMs);

    const startX = -0.35;
    const endX = 0.08;
    const duration = 2400; // ms
    const startTime = performance.now();

    // Trigger Friction Audio
    playFrictionSound(duration, selectedSurface.mu);

    const animateStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      animProgressRef.current = progress;

      const currentX = startX + progress * (endX - startX);
      const isMoving = progress < 1;
      updateDynamometer(currentX, fMs, isMoving);

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(animateStep);
      } else {
        setIsPulling(false);
        updateDynamometer(currentX, fMs, false);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animateStep);
  };

  // -------------------------------------------------------------
  // Reset Simulation
  // -------------------------------------------------------------
  const handleReset = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
    }
    setIsPulling(false);
    setCurrentForce(0);
    animProgressRef.current = 0;
    updateDynamometer(-0.35, 0, false);
  };

  // -------------------------------------------------------------
  // Record Measurement
  // -------------------------------------------------------------
  const handleRecord = () => {
    if (currentForce <= 0) return;
    const calcMu = currentForce / normalForce;
    setMeasurements(prev => [
      ...prev,
      {
        trial: prev.length + 1,
        surfaceName: selectedSurface.name,
        normalForce: parseFloat(normalForce.toFixed(2)),
        frictionForce: currentForce,
        mu: parseFloat(calcMu.toFixed(3)),
      },
    ]);
  };

  // -------------------------------------------------------------
  // Camera View Preset Switcher
  // -------------------------------------------------------------
  const setCameraPreset = (mode: 'perspective' | 'side' | 'top') => {
    setCameraMode(mode);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (mode === 'perspective') {
      camera.position.set(0.15, 0.45, 0.95);
      controls.target.set(0, 0.05, 0);
    } else if (mode === 'side') {
      camera.position.set(0, 0.08, 0.9);
      controls.target.set(0, 0.05, 0);
    } else if (mode === 'top') {
      camera.position.set(0, 1.1, 0.01);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  };

  // -------------------------------------------------------------
  // Screenshot Trigger
  // -------------------------------------------------------------
  const handleCaptureScreenshot = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const dataUrl = renderer.domElement.toDataURL('image/png');
    setScreenshotData(dataUrl);
    setIsScreenshotOpen(true);
  };

  // -------------------------------------------------------------
  // Data for Chart & Statistics
  // -------------------------------------------------------------
  const records: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.normalForce,
    paramY: m.frictionForce,
  }));

  const avgMu =
    measurements.length > 0
      ? (measurements.reduce((acc, m) => acc + m.mu, 0) / measurements.length).toFixed(3)
      : '0.000';

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-white font-sans overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <div className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/thu-vien')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Trở về thư viện"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-100">
                Bài 21 (SGK T83): Đo Hệ Số Ma Sát Trượt
              </h1>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded text-[10px] font-mono font-bold">
                3D WebGL Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">Vật lý 10 • Chương 3: Lực Ma Sát Trượt • SGK GDPT 2018</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              soundEnabled
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Bật/Tắt âm thanh ma sát thực tế"
          >
            <span>{soundEnabled ? '🔊 Âm Thanh Ma Sát: BẬT' : '🔇 Âm Thanh: TẮT'}</span>
          </button>

          <button
            onClick={handleCaptureScreenshot}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <span>📷 Chụp Ảnh Báo Cáo</span>
          </button>

          <div className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>HIỆU ỨNG MA SÁT & NHIỆT LƯỢNG 3D</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: 3D Studio Canvas & Controls (7/12) */}
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-3 bg-slate-950/60">
          {/* 3D WebGL Canvas Container */}
          <div className="flex-1 bg-slate-900/80 rounded-2xl border border-slate-800/80 relative overflow-hidden shadow-inner flex items-center justify-center">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Top-Left: Camera & Vector Overlays */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2 z-10">
              {/* Camera Views */}
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1 flex space-x-1 shadow-lg">
                <button
                  onClick={() => setCameraPreset('perspective')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    cameraMode === 'perspective'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📐 Phối Cảnh 3D
                </button>
                <button
                  onClick={() => setCameraPreset('side')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    cameraMode === 'side'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  👁️ Nhìn Ngang
                </button>
                <button
                  onClick={() => setCameraPreset('top')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    cameraMode === 'top'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⬇️ Từ Trên Xuống
                </button>
              </div>

              {/* Force Vector Legend & Toggle */}
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 shadow-lg max-w-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">Vectơ Lực Tác Dụng</span>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVectors}
                      onChange={e => setShowVectors(e.target.checked)}
                      className="rounded accent-amber-500 w-3.5 h-3.5"
                    />
                    <span className="text-[10px] text-slate-400">Hiển thị</span>
                  </label>
                </div>
                {showVectors && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono border-t border-slate-800/80">
                    <div className="flex items-center space-x-1.5 text-red-400">
                      <span className="w-2.5 h-0.5 bg-red-500 rounded"></span>
                      <span>P = {(totalMass * 9.81).toFixed(2)}N</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-cyan-400">
                      <span className="w-2.5 h-0.5 bg-cyan-400 rounded"></span>
                      <span>N = {(totalMass * 9.81).toFixed(2)}N</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-purple-400">
                      <span className="w-2.5 h-0.5 bg-purple-400 rounded"></span>
                      <span>F_kéo = {currentForce.toFixed(2)}N</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-amber-400">
                      <span className="w-2.5 h-0.5 bg-amber-400 rounded"></span>
                      <span>F_ms = {currentForce.toFixed(2)}N</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top-Right: Live Physics HUD Card */}
            <div className="absolute top-3 right-3 bg-slate-950/90 border border-amber-500/40 rounded-xl p-3.5 text-center backdrop-blur-md shadow-2xl min-w-[180px] z-10">
              <span className="text-[10px] text-amber-400 uppercase font-mono tracking-wider block">
                LỰC KẾ KÉO F_ms
              </span>
              <div className="text-3xl font-mono font-extrabold text-amber-400 my-0.5">
                {currentForce.toFixed(2)}{' '}
                <span className="text-sm font-normal text-amber-300">N</span>
              </div>
              <div className="space-y-0.5 pt-1 border-t border-slate-800 text-[11px] text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Áp lực N:</span>
                  <span className="font-bold text-cyan-400">{normalForce.toFixed(2)} N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hệ số μ:</span>
                  <span className="font-bold text-amber-400">{selectedSurface.mu.toFixed(2)}</span>
                </div>
              </div>
              {/* Dynamic Friction Active Status Indicator */}
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-center space-x-1.5 text-[10px]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPulling ? 'bg-amber-400 animate-ping' : 'bg-slate-600'
                  }`}
                ></span>
                <span className={isPulling ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                  {isPulling ? '⚡ Đang phát nhiệt ma sát' : 'Trạng thái tĩnh'}
                </span>
              </div>
            </div>

            {/* Bottom-Center: 3D Camera Instruction Pill */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-950/70 border border-slate-800 rounded-full px-3 py-1 text-[10px] text-slate-400 backdrop-blur-sm pointer-events-none">
              🖱️ Giữ chuột trái xoay 360° • Chuột phải kéo bàn • Lăn chuột phóng to/thu nhỏ
            </div>
          </div>

          {/* Workbench Controls & Parameters Panel */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-3">
            {/* Surface Material Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                1. Chọn Bề Mặt Tiếp Xúc Thí Nghiệm
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SURFACE_PRESETS.map(surface => {
                  const isSelected = selectedSurface.id === surface.id;
                  return (
                    <button
                      key={surface.id}
                      disabled={isPulling}
                      onClick={() => {
                        setSelectedSurface(surface);
                        handleReset();
                      }}
                      className={`p-2 rounded-lg border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-base">{surface.icon}</span>
                        <span className="text-xs font-semibold leading-tight">{surface.name}</span>
                      </div>
                      <div className="mt-1 text-[10px] font-mono text-amber-400">
                        μ = {surface.mu.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Mass Slider & Action Buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">Quả cân gia tải:</span>
                    <strong className="text-amber-400 font-mono">
                      +{(addedMass * 1000).toFixed(0)}g{' '}
                      <span className="text-slate-400 text-[10px]">
                        (Tổng: {((blockMass + addedMass) * 1000).toFixed(0)}g)
                      </span>
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.4"
                    step="0.05"
                    value={addedMass}
                    onChange={e => {
                      setAddedMass(parseFloat(e.target.value));
                      handleReset();
                    }}
                    disabled={isPulling}
                    className="w-48 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePull}
                  disabled={isPulling}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-lg flex items-center space-x-1.5 active:scale-95"
                >
                  <span>{isPulling ? '⏳ Đang kéo & phát nhiệt...' : '▶ Kéo Khối Gỗ'}</span>
                </button>

                <button
                  onClick={handleReset}
                  disabled={isPulling}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg text-xs font-semibold transition"
                  title="Đặt lại vị trí ban đầu"
                >
                  ↺ Đặt Lại
                </button>

                <button
                  onClick={handleRecord}
                  disabled={currentForce <= 0 || isPulling}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-md flex items-center space-x-1"
                >
                  <span>+ Ghi Số Liệu</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Microscopic Roughness View, Data Table, Linear Regression Chart (5/12) */}
        <div className="w-5/12 p-4 overflow-y-auto space-y-4 bg-slate-950 custom-scrollbar">
          {/* Microscopic Friction Mechanism Visualizer (Kính Hiển Vi Cấu Trúc Bề Mặt) */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span>🔬 Kính Hiển Vi: Bản Chất Ma Sát Vi Mô</span>
              </h3>
              <button
                onClick={() => setShowMicroView(!showMicroView)}
                className="text-[10px] text-slate-400 hover:text-slate-200 underline"
              >
                {showMicroView ? 'Thu gọn' : 'Mở rộng'}
              </button>
            </div>

            {showMicroView && (
              <div className="space-y-2.5">
                {/* Microscopic Canvas Diagram */}
                <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 relative">
                  <div className="text-[10px] text-slate-400 flex justify-between font-mono mb-1">
                    <span>Mặt Đáy Khối Gỗ (Chuyển động ➡)</span>
                    <span className="text-amber-400 font-bold">{selectedSurface.microStructure.title}</span>
                  </div>

                  {/* SVG Microscopic Contact Teeth Animation */}
                  <div className="w-full h-16 bg-slate-900/60 rounded border border-slate-800 overflow-hidden relative flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 400 70">
                      {/* Top Surface (Moving Wooden Block Asperities) */}
                      <g className={isPulling ? 'animate-pulse' : ''}>
                        <path
                          d="M 0,10 Q 20,25 40,10 Q 60,25 80,10 Q 100,25 120,10 Q 140,25 160,10 Q 180,25 200,10 Q 220,25 240,10 Q 260,25 280,10 Q 300,25 320,10 Q 340,25 360,10 Q 380,25 400,10 L 400,0 L 0,0 Z"
                          fill="#b45309"
                          opacity="0.9"
                        />
                      </g>

                      {/* Friction Heat Contact Zone Indicator */}
                      <rect
                        x="0"
                        y="22"
                        width="400"
                        height="4"
                        fill={isPulling ? '#ef4444' : '#f59e0b'}
                        opacity={isPulling ? '0.85' : '0.2'}
                        className={isPulling ? 'animate-pulse' : ''}
                      />

                      {/* Bottom Surface (Selected Track Preset Asperities) */}
                      <path
                        d={
                          selectedSurface.id === 'glass'
                            ? 'M 0,26 L 400,26 L 400,70 L 0,70 Z'
                            : selectedSurface.id === 'aluminum'
                            ? 'M 0,26 L 20,38 L 40,26 L 60,38 L 80,26 L 100,38 L 120,26 L 140,38 L 160,26 L 180,38 L 200,26 L 220,38 L 240,26 L 260,38 L 280,26 L 300,38 L 320,26 L 340,38 L 360,26 L 380,38 L 400,26 L 400,70 L 0,70 Z'
                            : selectedSurface.id === 'rubber'
                            ? 'M 0,26 C 15,48 25,12 40,35 C 55,48 65,12 80,35 C 95,48 105,12 120,35 C 135,48 145,12 160,35 C 175,48 185,12 200,35 C 215,48 225,12 240,35 C 255,48 265,12 280,35 C 295,48 305,12 320,35 C 335,48 345,12 360,35 C 375,48 385,12 400,35 L 400,70 L 0,70 Z'
                            : 'M 0,26 Q 25,42 50,26 Q 75,42 100,26 Q 125,42 150,26 Q 175,42 200,26 Q 225,42 250,26 Q 275,42 300,26 Q 325,42 350,26 Q 375,42 400,26 L 400,70 L 0,70 Z'
                        }
                        fill={selectedSurface.color}
                        opacity="0.85"
                      />

                      {/* Moving Friction Sparkles during Pull */}
                      {isPulling && (
                        <g fill="#fbbf24">
                          <circle cx="80" cy="24" r="2.5" className="animate-ping" />
                          <circle cx="160" cy="23" r="3" className="animate-ping" />
                          <circle cx="240" cy="25" r="2.5" className="animate-ping" />
                          <circle cx="320" cy="24" r="3" className="animate-ping" />
                        </g>
                      )}
                    </svg>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                    {selectedSurface.microStructure.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Scientific Graph & Regression */}
          <DataTableAndGraph
            records={records}
            xLabel="Áp lực N (Newton)"
            yLabel="Lực ma sát F_ms (Newton)"
            calculatedResult={`Hệ số ma sát trượt trung bình thực nghiệm μ̄ = ${avgMu} (Lý thuyết: ${selectedSurface.mu.toFixed(2)})`}
          />

          {/* Measurement History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <span>📋 Bảng Thu Thập Số Liệu Thí Nghiệm</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 font-mono">
                  {measurements.length} lần đo
                </span>
                {measurements.length > 0 && (
                  <button
                    onClick={() => setMeasurements([])}
                    className="text-[11px] text-red-400 hover:text-red-300 hover:underline"
                  >
                    Xóa hết
                  </button>
                )}
              </div>
            </div>

            {measurements.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                Chưa có dữ liệu. Hãy bấm <strong className="text-amber-400">"▶ Kéo Khối Gỗ"</strong> sau đó bấm{' '}
                <strong className="text-indigo-400">"+ Ghi Số Liệu"</strong> để lưu lần đo.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-800/80 uppercase text-slate-400 font-mono text-[10px]">
                    <tr>
                      <th className="p-2">Lần</th>
                      <th className="p-2">Bề Mặt</th>
                      <th className="p-2">Áp lực N (N)</th>
                      <th className="p-2">Lực F_ms (N)</th>
                      <th className="p-2 text-amber-400">Hệ số μ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map(m => (
                      <tr key={m.trial} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                        <td className="p-2 font-mono">{m.trial}</td>
                        <td className="p-2 text-slate-300">{m.surfaceName}</td>
                        <td className="p-2 font-mono">{m.normalForce}</td>
                        <td className="p-2 font-mono text-emerald-400 font-semibold">{m.frictionForce}</td>
                        <td className="p-2 font-mono font-bold text-amber-400">{m.mu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SGK Physics Theory Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center space-x-1.5">
              <span>💡 Cơ Sở Lý Thuyết (SGK Vật Lý 10 - Bài 21)</span>
            </h4>
            <p className="leading-relaxed text-slate-400">
              Độ lớn của lực ma sát trượt <strong className="text-slate-200">F_ms</strong> tỉ lệ thuận với độ lớn của áp lực{' '}
              <strong className="text-slate-200">N</strong> giữa hai mặt tiếp xúc:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-center text-amber-400 text-sm border border-slate-800">
              F_ms = μ · N &nbsp; ⟹ &nbsp; μ = F_ms / N
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] pt-1">
              <li>Hệ số ma sát trượt <strong className="text-slate-300">μ</strong> phụ thuộc vào bản chất và tình trạng của hai bề mặt tiếp xúc.</li>
              <li>Khi kéo vật chuyển động thẳng đều, lực kéo cân bằng với lực ma sát trượt: <strong className="text-slate-300">F_kéo = F_ms</strong>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Screenshot Capture Modal */}
      {isScreenshotOpen && (
        <ScreenshotCaptureModal
          isOpen={isScreenshotOpen}
          onClose={() => setIsScreenshotOpen(false)}
          imageBase64={screenshotData}
          labId="sliding-friction-3d"
          labTitle="Bài 21: Đo Hệ Số Ma Sát Trượt (3D WebGL)"
          difficulty="EASY"
          onSuccess={() => setIsScreenshotOpen(false)}
        />
      )}
    </div>
  );
};
