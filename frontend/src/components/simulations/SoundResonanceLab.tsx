import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ScreenshotCaptureModal } from '../common/ScreenshotCaptureModal';

interface MeasurementTrial {
  id: number;
  frequency: number;
  l1: number; // cm
  l2: number; // cm
  lambda: number; // cm
  speedMeasured: number; // m/s
  speedTheoretical: number; // m/s
  errorPercent: number; // %
}

export const SoundResonanceLab: React.FC = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Sound & Physical Parameters
  const [frequency, setFrequency] = useState<number>(500); // Hz (200 - 1200)
  const [waterLevel, setWaterLevel] = useState<number>(17.3); // cm from top (0 - 100cm)
  const [temperature, setTemperature] = useState<number>(25); // Celsius
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.6);
  const [waveMode, setWaveMode] = useState<'particles' | 'envelope' | 'both'>('both');
  const [cameraView, setCameraView] = useState<'perspective' | 'front' | 'top'>('perspective');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Markers & Measurements
  const [markedL1, setMarkedL1] = useState<number | null>(null);
  const [markedL2, setMarkedL2] = useState<number | null>(null);
  const [trials, setTrials] = useState<MeasurementTrial[]>([]);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [screenshotData, setScreenshotData] = useState<string>('');

  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Mesh Refs
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const waterSurfaceRef = useRef<THREE.Mesh | null>(null);
  const reservoirGroupRef = useRef<THREE.Group | null>(null);
  const rubberTubeRef = useRef<THREE.Line | null>(null);
  const speakerMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const envelopeLineRef = useRef<THREE.Line | null>(null);
  const markerL1MeshRef = useRef<THREE.Mesh | null>(null);
  const markerL2MeshRef = useRef<THREE.Mesh | null>(null);

  // Web Audio API Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Physics Calculations
  // Speed of sound in air: v = 331.3 * sqrt(1 + t / 273.15) (m/s)
  const theoreticalSpeed = 331.3 * Math.sqrt(1 + temperature / 273.15); // m/s (~346.3 m/s at 25C)
  const lambdaCm = (theoreticalSpeed / frequency) * 100; // cm
  const l1Theo = lambdaCm / 4; // cm (~17.3 cm at 500Hz)
  const l2Theo = (3 * lambdaCm) / 4; // cm (~51.9 cm at 500Hz)
  const l3Theo = (5 * lambdaCm) / 4; // cm (~86.6 cm at 500Hz)

  // Resonance Proximity & Intensity (Bell curve around L1, L2, L3)
  const dist1 = Math.abs(waterLevel - l1Theo);
  const dist2 = Math.abs(waterLevel - l2Theo);
  const dist3 = Math.abs(waterLevel - l3Theo);
  const minDist = Math.min(dist1, dist2, dist3);
  const isResonating = minDist < 3.0; // within 3cm
  const resonanceFactor = Math.exp(-(minDist * minDist) / 8.0); // Gaussian peak from 0 to 1
  const currentDb = 45 + resonanceFactor * 42; // 45 dB background -> 87 dB peak

  // -------------------------------------------------------------
  // Web Audio API Sound Generation
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isPlayingAudio) {
      if (oscNodeRef.current) {
        try {
          oscNodeRef.current.stop();
          oscNodeRef.current.disconnect();
        } catch {}
        oscNodeRef.current = null;
      }
      return;
    }

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

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      const effectiveGain = Math.max(0.01, volume * (0.15 + resonanceFactor * 0.85));
      gain.gain.setValueAtTime(effectiveGain, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscNodeRef.current = osc;
      gainNodeRef.current = gain;
    } catch {}

    return () => {
      if (oscNodeRef.current) {
        try {
          oscNodeRef.current.stop();
          oscNodeRef.current.disconnect();
        } catch {}
        oscNodeRef.current = null;
      }
    };
  }, [isPlayingAudio, frequency]);

  // Live update audio gain and frequency during resonance
  useEffect(() => {
    if (audioCtxRef.current && gainNodeRef.current && isPlayingAudio) {
      const effectiveGain = Math.max(0.01, volume * (0.15 + resonanceFactor * 0.85));
      gainNodeRef.current.gain.setTargetAtTime(effectiveGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume, resonanceFactor, isPlayingAudio]);

  useEffect(() => {
    if (audioCtxRef.current && oscNodeRef.current && isPlayingAudio) {
      oscNodeRef.current.frequency.setTargetAtTime(frequency, audioCtxRef.current.currentTime, 0.05);
    }
  }, [frequency, isPlayingAudio]);

  // -------------------------------------------------------------
  // 3D Scene Initialization (Three.js)
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.15);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0.12, 0.58, 1.75);
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

    // 4. OrbitControls with full 3D panning & close-up zoom capability
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(-0.03, 0.55, 0);
    controls.screenSpacePanning = true;
    controls.enablePan = true;
    controls.maxPolarAngle = Math.PI / 2 - 0.01;
    controls.minDistance = 0.05; // Allows zooming extremely close to specific ticks/meniscus
    controls.maxDistance = 3.5;
    controlsRef.current = controls;

    // Double-click to focus on any specific 3D point clicked
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handleDblClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const hit = intersects[0];
        controls.target.copy(hit.point);
        controls.update();
      }
    };
    renderer.domElement.addEventListener('dblclick', handleDblClick);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xfffaf0, 2.5);
    mainSpot.position.set(0.8, 1.6, 1.2);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.3;
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    fillLight.position.set(-1.0, 1.0, -0.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.6);
    rimLight.position.set(0, -0.2, -1.2);
    scene.add(rimLight);

    // 6. Studio Floor & Lab Table
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(6, 30, 0x334155, 0x1e293b);
    grid.position.y = -0.049;
    scene.add(grid);

    // 7. Laboratory Stand (Giá đỡ kim loại thẳng đứng)
    const standGroup = new THREE.Group();

    // Heavy Cast Iron Base
    const baseGeo = new THREE.BoxGeometry(0.35, 0.025, 0.25);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const standBase = new THREE.Mesh(baseGeo, metalMat);
    standBase.position.set(-0.05, 0.0125, 0);
    standBase.castShadow = true;
    standGroup.add(standBase);

    // Vertical Chrome Rod (Cao 1.15m)
    const rodGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.15, 24);
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
    const standRod = new THREE.Mesh(rodGeo, chromeMat);
    standRod.position.set(-0.16, 0.58, 0);
    standRod.castShadow = true;
    standGroup.add(standRod);

    // Clamps holding the glass tube
    const clampGeo = new THREE.BoxGeometry(0.12, 0.015, 0.03);
    const clamp1 = new THREE.Mesh(clampGeo, metalMat);
    clamp1.position.set(-0.09, 0.25, 0);
    standGroup.add(clamp1);

    const clamp2 = clamp1.clone();
    clamp2.position.y = 0.85;
    standGroup.add(clamp2);

    scene.add(standGroup);

    // 8. Glass Resonance Tube (Ống cộng hưởng trong suốt dài 100cm)
    // Tube spans from y = 0.05 (bottom) to y = 1.05 (top mouth)
    const tubeOuterRadius = 0.025;
    const tubeInnerRadius = 0.022;
    const tubeLength = 1.0; // 100cm

    const glassGeo = new THREE.CylinderGeometry(tubeOuterRadius, tubeOuterRadius, tubeLength, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const glassTube = new THREE.Mesh(glassGeo, glassMat);
    glassTube.position.set(-0.03, 0.55, 0);
    scene.add(glassTube);

    // Laser Measurement Ruler Marks (0 to 100cm along tube)
    const rulerGroup = new THREE.Group();
    for (let cm = 0; cm <= 100; cm += 5) {
      const isMajor = cm % 10 === 0;
      const tickY = 1.05 - (cm / 100) * 1.0;
      const tickGeo = new THREE.PlaneGeometry(isMajor ? 0.012 : 0.007, 0.0015);
      const tickMat = new THREE.MeshBasicMaterial({ color: isMajor ? 0xf8fafc : 0x94a3b8 });
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.set(-0.003, tickY, tubeOuterRadius + 0.001);
      rulerGroup.add(tick);
    }
    scene.add(rulerGroup);

    // 9. Water Column Inside Tube
    const waterGeo = new THREE.CylinderGeometry(tubeInnerRadius, tubeInnerRadius, 0.8, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(-0.03, 0.45, 0);
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // Water Surface Disc with Meniscus Glow
    const discGeo = new THREE.CircleGeometry(tubeInnerRadius, 32);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
    });
    const waterSurface = new THREE.Mesh(discGeo, discMat);
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.set(-0.03, 0.88, 0);
    scene.add(waterSurface);
    waterSurfaceRef.current = waterSurface;

    // 10. Movable Water Reservoir Beaker (Bình dâng nước thông nhau)
    const reservoirGroup = new THREE.Group();
    reservoirGroup.position.set(0.18, 0.88, 0);

    const beakerGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.16, 24);
    const beakerMesh = new THREE.Mesh(beakerGeo, glassMat);
    reservoirGroup.add(beakerMesh);

    const beakerWaterGeo = new THREE.CylinderGeometry(0.033, 0.033, 0.12, 24);
    const beakerWater = new THREE.Mesh(beakerWaterGeo, waterMat);
    beakerWater.position.y = -0.015;
    reservoirGroup.add(beakerWater);

    // Reservoir Support Clamp on Secondary Rod
    const secRod = new THREE.Mesh(rodGeo, chromeMat);
    secRod.position.set(0.24, 0.58, 0);
    standGroup.add(secRod);

    const resClamp = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.04), metalMat);
    resClamp.position.set(0.21, 0, 0);
    reservoirGroup.add(resClamp);

    scene.add(reservoirGroup);
    reservoirGroupRef.current = reservoirGroup;

    // 11. Connecting Flexible Rubber Tube (Between Tube Bottom and Reservoir)
    const rubberMat = new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 4 });
    const rubberGeo = new THREE.BufferGeometry();
    const rubberLine = new THREE.Line(rubberGeo, rubberMat);
    scene.add(rubberLine);
    rubberTubeRef.current = rubberLine;

    // 12. Speaker & Microphone Assembly at Tube Top (y = 1.05m)
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(-0.03, 1.07, 0);

    const speakerHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.02, 0.035, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
    );
    speakerGroup.add(speakerHousing);

    const speakerCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.022, 0.015, 24),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5, roughness: 0.4 })
    );
    speakerCone.rotation.x = Math.PI;
    speakerCone.position.y = -0.012;
    speakerGroup.add(speakerCone);
    speakerMeshRef.current = speakerCone;

    // Mini Sensor Microphone next to speaker
    const micGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.025, 16);
    const micMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.9, roughness: 0.2 });
    const micMesh = new THREE.Mesh(micGeo, micMat);
    micMesh.position.set(0.026, 0, 0);
    speakerGroup.add(micMesh);

    scene.add(speakerGroup);

    // 13. Digital Frequency Generator Unit (`AUDIO_GENERATOR`)
    const genGroup = new THREE.Group();
    genGroup.position.set(-0.32, 0.12, 0.05);

    const genBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.14, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 })
    );
    genBody.castShadow = true;
    genGroup.add(genBody);

    // LCD Screen Panel on Generator
    const lcdScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    lcdScreen.position.set(0, 0.03, 0.061);
    genGroup.add(lcdScreen);

    // Knob on Generator
    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.015, 20),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
    );
    knob.rotation.x = Math.PI / 2;
    knob.position.set(0, -0.03, 0.065);
    genGroup.add(knob);

    // BNC Output Cable from Generator to Speaker
    const cableMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    const cablePoints = [
      new THREE.Vector3(-0.32 + 0.06, 0.12 - 0.03, 0.061),
      new THREE.Vector3(-0.25, 0.5, 0.05),
      new THREE.Vector3(-0.06, 1.07, 0),
    ];
    const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
    const cableGeo = new THREE.BufferGeometry().setFromPoints(cableCurve.getPoints(30));
    const cableLine = new THREE.Line(cableGeo, cableMat);
    scene.add(cableLine);

    scene.add(genGroup);

    // 14. Standing Wave Air Molecule Particle Density Field (3D Points)
    const particleCount = 450;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const cAmber = new THREE.Color(0xf59e0b);
    const cCyan = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = -0.03 + (Math.random() - 0.5) * (tubeInnerRadius * 1.6);
      particlePositions[i * 3 + 1] = 0.05 + Math.random() * 1.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * (tubeInnerRadius * 1.6);

      const c = Math.random() > 0.5 ? cAmber : cCyan;
      particleColors[i * 3 + 0] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(particlePositions, 3);
    const colAttr = new THREE.BufferAttribute(particleColors, 3);
    if ((pGeo as any).setAttribute) {
      (pGeo as any).setAttribute('position', posAttr);
      (pGeo as any).setAttribute('color', colAttr);
    } else if ((pGeo as any).addAttribute) {
      (pGeo as any).addAttribute('position', posAttr);
      (pGeo as any).addAttribute('color', colAttr);
    }

    const pMat = new THREE.PointsMaterial({
      size: 0.005,
      vertexColors: true as any,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesMeshRef.current = particles;

    // 15. Standing Wave Amplitude Envelope Curves (Sine Envelopes)
    const envMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2, transparent: true, opacity: 0.8 });
    const envGeo = new THREE.BufferGeometry();
    const envelopeLine = new THREE.Line(envGeo, envMat);
    scene.add(envelopeLine);
    envelopeLineRef.current = envelopeLine;

    // 16. Measured L1 and L2 Ring Markers
    const markerGeo = new THREE.RingGeometry(tubeOuterRadius + 0.001, tubeOuterRadius + 0.007, 32);
    const markerL1Mat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
    const markerL1 = new THREE.Mesh(markerGeo, markerL1Mat);
    markerL1.rotation.x = Math.PI / 2;
    markerL1.visible = false;
    scene.add(markerL1);
    markerL1MeshRef.current = markerL1;

    const markerL2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide });
    const markerL2 = new THREE.Mesh(markerGeo, markerL2Mat);
    markerL2.rotation.x = Math.PI / 2;
    markerL2.visible = false;
    scene.add(markerL2);
    markerL2MeshRef.current = markerL2;

    // 17. 60 FPS Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();

      // Speaker subtle vibration pulse when audio is active
      if (speakerMeshRef.current && isPlayingAudio) {
        const pulse = 1 + Math.sin(time * 40) * (0.04 + resonanceFactor * 0.08);
        speakerMeshRef.current.scale.set(pulse, pulse, pulse);
      }

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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('dblclick', handleDblClick);
      }
      renderer.dispose();
      controls.dispose();
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }
    };
  }, []);

  // -------------------------------------------------------------
  // Dynamic 3D Scene Geometry Updates (Water, Particles, Standing Wave)
  // -------------------------------------------------------------
  useEffect(() => {
    const waterMesh = waterMeshRef.current;
    const waterSurface = waterSurfaceRef.current;
    const reservoir = reservoirGroupRef.current;
    const rubberLine = rubberTubeRef.current;
    const particles = particlesMeshRef.current;
    const envelope = envelopeLineRef.current;

    // Air column height L (m) = waterLevel (cm) / 100
    // Water height inside 1m tube: (100 - waterLevel) / 100
    const airLengthM = Math.max(0.01, Math.min(0.99, waterLevel / 100));
    const waterHeightM = 1.0 - airLengthM;
    const surfaceY = 1.05 - airLengthM;

    // 1. Water Column
    if (waterMesh) {
      waterMesh.scale.set(1, waterHeightM / 0.8, 1);
      waterMesh.position.y = 0.05 + waterHeightM / 2;
    }

    // 2. Water Surface Disc
    if (waterSurface) {
      waterSurface.position.y = surfaceY;
    }

    // 3. Reservoir Beaker Height
    if (reservoir) {
      reservoir.position.y = surfaceY;
    }

    // 4. Connecting Flexible Rubber Tube
    if (rubberLine) {
      const curvePoints = [
        new THREE.Vector3(-0.03, 0.05, 0),
        new THREE.Vector3(0.07, -0.02, 0),
        new THREE.Vector3(0.18, surfaceY - 0.08, 0),
      ];
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const pts = curve.getPoints(25);
      const posArr = new Float32Array(pts.length * 3);
      pts.forEach((p, idx) => {
        posArr[idx * 3 + 0] = p.x;
        posArr[idx * 3 + 1] = p.y;
        posArr[idx * 3 + 2] = p.z;
      });
      const bGeo = rubberLine.geometry as any;
      if (bGeo.setAttribute) {
        bGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      } else if (bGeo.addAttribute) {
        bGeo.addAttribute('position', new THREE.BufferAttribute(posArr, 3));
      }
      if (bGeo.attributes?.position) {
        bGeo.attributes.position.needsUpdate = true;
      }
    }

    // 5. Standing Wave Air Particles in Air Column (from y = surfaceY to y = 1.05)
    if (particles) {
      const pGeo = particles.geometry as any;
      const posAttr = pGeo.attributes?.position;
      if (posAttr) {
        const arr = posAttr.array as Float32Array;
        const count = arr.length / 3;
        const lambdaM = lambdaCm / 100;
        const k = (2 * Math.PI) / lambdaM; // wave number

        for (let i = 0; i < count; i++) {
          const normY = (i / count);
          const y = surfaceY + normY * airLengthM;
          const distFromSurface = y - surfaceY;

          // Standing wave displacement amplitude: Antinode at top, Node at surface
          // xi(y) ~ sin(k * distFromSurface)
          const disp = Math.sin(k * distFromSurface) * resonanceFactor * 0.008;

          arr[i * 3 + 0] = -0.03 + (Math.random() - 0.5) * 0.035;
          arr[i * 3 + 1] = y + disp;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 0.035;
        }
        posAttr.needsUpdate = true;
      }

      particles.visible = isPlayingAudio && (waveMode === 'particles' || waveMode === 'both');
    }

    // 6. Standing Wave Envelope Curve
    if (envelope) {
      if (isPlayingAudio && (waveMode === 'envelope' || waveMode === 'both')) {
        envelope.visible = true;
        const segments = 60;
        const envPts: THREE.Vector3[] = [];
        const lambdaM = lambdaCm / 100;
        const k = (2 * Math.PI) / lambdaM;
        const maxAmp = (0.015 * resonanceFactor) + 0.004;

        // Right side envelope curve
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const y = surfaceY + t * airLengthM;
          const distFromSurface = y - surfaceY;
          const amp = Math.sin(k * distFromSurface) * maxAmp;
          envPts.push(new THREE.Vector3(-0.03 + amp, y, 0));
        }
        // Left side envelope curve
        for (let i = segments; i >= 0; i--) {
          const t = i / segments;
          const y = surfaceY + t * airLengthM;
          const distFromSurface = y - surfaceY;
          const amp = Math.sin(k * distFromSurface) * maxAmp;
          envPts.push(new THREE.Vector3(-0.03 - amp, y, 0));
        }

        const envArr = new Float32Array(envPts.length * 3);
        envPts.forEach((p, idx) => {
          envArr[idx * 3 + 0] = p.x;
          envArr[idx * 3 + 1] = p.y;
          envArr[idx * 3 + 2] = p.z;
        });

        const bGeo = envelope.geometry as any;
        if (bGeo.setAttribute) {
          bGeo.setAttribute('position', new THREE.BufferAttribute(envArr, 3));
        } else if (bGeo.addAttribute) {
          bGeo.addAttribute('position', new THREE.BufferAttribute(envArr, 3));
        }
        if (bGeo.attributes?.position) {
          bGeo.attributes.position.needsUpdate = true;
        }
      } else {
        envelope.visible = false;
      }
    }
  }, [waterLevel, frequency, temperature, isPlayingAudio, waveMode, resonanceFactor, lambdaCm]);

  // -------------------------------------------------------------
  // Update L1 / L2 Visual Markers
  // -------------------------------------------------------------
  useEffect(() => {
    if (markerL1MeshRef.current) {
      if (markedL1 !== null) {
        markerL1MeshRef.current.visible = true;
        markerL1MeshRef.current.position.set(-0.03, 1.05 - markedL1 / 100, 0);
      } else {
        markerL1MeshRef.current.visible = false;
      }
    }

    if (markerL2MeshRef.current) {
      if (markedL2 !== null) {
        markerL2MeshRef.current.visible = true;
        markerL2MeshRef.current.position.set(-0.03, 1.05 - markedL2 / 100, 0);
      } else {
        markerL2MeshRef.current.visible = false;
      }
    }
  }, [markedL1, markedL2]);

  // -------------------------------------------------------------
  // Data Recording & Auto-Calculation
  // -------------------------------------------------------------
  const handleMarkL1 = () => {
    setMarkedL1(parseFloat(waterLevel.toFixed(1)));
  };

  const handleMarkL2 = () => {
    setMarkedL2(parseFloat(waterLevel.toFixed(1)));
  };

  const handleSaveTrial = () => {
    if (markedL1 === null || markedL2 === null) return;
    const l1 = Math.min(markedL1, markedL2);
    const l2 = Math.max(markedL1, markedL2);
    const deltaL = l2 - l1; // cm
    const measuredLambda = 2 * deltaL; // cm
    const measuredSpeed = (measuredLambda / 100) * frequency; // m/s
    const err = (Math.abs(measuredSpeed - theoreticalSpeed) / theoreticalSpeed) * 100;

    const newTrial: MeasurementTrial = {
      id: trials.length + 1,
      frequency,
      l1,
      l2,
      lambda: parseFloat(measuredLambda.toFixed(1)),
      speedMeasured: parseFloat(measuredSpeed.toFixed(1)),
      speedTheoretical: parseFloat(theoreticalSpeed.toFixed(1)),
      errorPercent: parseFloat(err.toFixed(2)),
    };

    setTrials(prev => [...prev, newTrial]);
  };

  const handleResetMarkers = () => {
    setMarkedL1(null);
    setMarkedL2(null);
  };

  // -------------------------------------------------------------
  // Camera Presets & Focus Functions
  // -------------------------------------------------------------
  const setCameraPreset = (mode: 'perspective' | 'front' | 'top') => {
    setCameraView(mode);
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;

    if (mode === 'perspective') {
      cam.position.set(0.1, 0.5, 1.4);
      ctrl.target.set(-0.03, 0.55, 0);
    } else if (mode === 'front') {
      cam.position.set(-0.03, 0.55, 1.3);
      ctrl.target.set(-0.03, 0.55, 0);
    } else if (mode === 'top') {
      cam.position.set(-0.03, 1.6, 0.05);
      ctrl.target.set(-0.03, 1.05, 0);
    }
    ctrl.update();
  };

  const focusOnWater = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const surfaceY = 1.05 - waterLevel / 100;
    ctrl.target.set(-0.03, surfaceY, 0);
    cam.position.set(-0.03, surfaceY, 0.28);
    ctrl.update();
  };

  const focusOnSpeaker = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    ctrl.target.set(-0.03, 1.05, 0);
    cam.position.set(-0.03, 1.05, 0.28);
    ctrl.update();
  };

  const focusOnGenerator = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    ctrl.target.set(-0.32, 0.12, 0.05);
    cam.position.set(-0.32, 0.12, 0.38);
    ctrl.update();
  };

  const handleCaptureScreenshot = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const dataUrl = renderer.domElement.toDataURL('image/png');
    setScreenshotData(dataUrl);
    setIsScreenshotOpen(true);
  };

  // Average measured speed
  const avgSpeed =
    trials.length > 0
      ? (trials.reduce((acc, t) => acc + t.speedMeasured, 0) / trials.length).toFixed(1)
      : '---';

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-white font-sans overflow-hidden select-none">
      {/* Top Header */}
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
                Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng)
              </h1>
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded text-[10px] font-mono font-bold">
                3D Acoustics Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">Vật lý 11 • Sóng Dừng Trong Cột Không Khí • SGK GDPT 2018</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCaptureScreenshot}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <span>📷 Chụp Ảnh Báo Cáo</span>
          </button>
          <div className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>MÁY PHÁT ÂM TẦN & KHUẾCH ĐẠI CỘNG HƯỞNG</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: 3D Studio Canvas & Interactive Workbench (7/12) */}
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-3 bg-slate-950/60">
          {/* 3D WebGL Canvas */}
          <div className="flex-1 bg-slate-900/80 rounded-2xl border border-slate-800/80 relative overflow-hidden shadow-inner flex items-center justify-center">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Top Bar HUD Controls (Compact & Non-intrusive) */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start pointer-events-none z-10">
              {/* Left Collapsible Hamburger Menu */}
              <div className="relative pointer-events-auto">
                {/* 3-Line Hamburger Trigger Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`px-2.5 py-1.5 rounded-xl border shadow-xl transition flex items-center space-x-1.5 ${
                    isMenuOpen
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white border-slate-700/80'
                  }`}
                  title="Tùy chọn góc nhìn & Hiển thị sóng dừng"
                >
                  {isMenuOpen ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                  <span className="text-[11px] font-bold">Góc Nhìn & Sóng</span>
                </button>

                {/* Collapsible Dropdown Panel */}
                {isMenuOpen && (
                  <div className="absolute top-10 left-0 bg-slate-950/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl space-y-3 w-64 animate-in fade-in zoom-in-95 duration-150">
                    {/* Camera Presets & Focus Section */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        📐 Góc Nhìn & Zoom Cận Cảnh
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            setCameraPreset('perspective');
                          }}
                          className={`p-1.5 rounded text-[10px] font-medium transition text-left flex items-center space-x-1 ${
                            cameraView === 'perspective'
                              ? 'bg-cyan-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>📐 Toàn Cảnh</span>
                        </button>
                        <button
                          onClick={() => {
                            focusOnWater();
                          }}
                          className="p-1.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition text-left flex items-center space-x-1"
                          title="Zoom sát vào mực nước và vạch chia mm"
                        >
                          <span>🔍 Mực Nước</span>
                        </button>
                        <button
                          onClick={() => {
                            focusOnSpeaker();
                          }}
                          className="p-1.5 rounded text-[10px] font-medium bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 transition text-left flex items-center space-x-1"
                          title="Zoom sát vào loa phát âm"
                        >
                          <span>🔊 Miệng Loa</span>
                        </button>
                        <button
                          onClick={() => {
                            focusOnGenerator();
                          }}
                          className="p-1.5 rounded text-[10px] font-medium bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 border border-purple-500/30 transition text-left flex items-center space-x-1"
                          title="Zoom sát vào máy phát tần số"
                        >
                          <span>📻 Máy Phát</span>
                        </button>
                      </div>
                    </div>

                    {/* Standing Wave Visualizer Mode */}
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        🌊 Hiển Thị Sóng Dừng
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => setWaveMode('both')}
                          className={`p-1.5 rounded text-[10px] font-semibold text-center ${
                            waveMode === 'both' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Đầy Đủ
                        </button>
                        <button
                          onClick={() => setWaveMode('particles')}
                          className={`p-1.5 rounded text-[10px] font-semibold text-center ${
                            waveMode === 'particles' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Hạt Khí
                        </button>
                        <button
                          onClick={() => setWaveMode('envelope')}
                          className={`p-1.5 rounded text-[10px] font-semibold text-center ${
                            waveMode === 'envelope' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Đường Bao
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Compact Sound Meter Pill */}
              <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-xl p-2.5 shadow-xl min-w-[150px] pointer-events-auto text-center space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-cyan-400 uppercase font-mono tracking-wider">
                    CƯỜNG ĐỘ ÂM
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isResonating && isPlayingAudio ? 'bg-amber-400 animate-ping' : 'bg-slate-600'
                    }`}
                  ></span>
                </div>
                <div className="text-2xl font-mono font-extrabold text-cyan-400 leading-tight">
                  {currentDb.toFixed(1)}{' '}
                  <span className="text-xs font-normal text-cyan-300">dB</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${
                      isResonating ? 'bg-gradient-to-r from-cyan-500 to-amber-400 animate-pulse' : 'bg-cyan-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, ((currentDb - 40) / 50) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bottom-Center: 3D Camera Instruction Pill */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-950/70 border border-slate-800 rounded-full px-3 py-1 text-[10px] text-slate-400 backdrop-blur-sm pointer-events-none">
              🖱️ Giữ chuột trái xoay 360° • Chuột phải di chuyển • Lăn chuột phóng to/thu nhỏ
            </div>
          </div>

          {/* Controls & Physical Parameter Adjusters */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-3">
            {/* Top Control Row: Audio Generator Switch & Presets */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg flex items-center space-x-2 ${
                    isPlayingAudio
                      ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <span>{isPlayingAudio ? '⏹ Dừng Máy Phát Âm' : '▶ Bật Máy Phát Âm'}</span>
                </button>

                {/* Preset Frequencies */}
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-slate-400 text-[11px] mr-1">Tần số mẫu:</span>
                  {[400, 500, 650, 800].map(f => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`px-2 py-1 rounded text-xs font-mono transition ${
                        frequency === f
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {f}Hz
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Âm lượng:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  className="w-24 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Sliders: Water Level & Frequency & Temperature */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
              {/* Water Level / Air Column Slider & Fine Controls */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Chiều dài cột khí L:</span>
                  <div className="flex items-center space-x-2">
                    <strong className="text-amber-400 font-mono text-base">{waterLevel.toFixed(1)} cm</strong>
                  </div>
                </div>

                <input
                  type="range"
                  min="2"
                  max="98"
                  step="0.1"
                  value={waterLevel}
                  onChange={e => setWaterLevel(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />

                {/* Quick Step Buttons & Resonance Jumps */}
                <div className="flex items-center justify-between pt-1">
                  {/* Steppers */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setWaterLevel(prev => Math.max(2, parseFloat((prev - 1).toFixed(1))))}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono"
                      title="Giảm 1 cm"
                    >
                      -1cm
                    </button>
                    <button
                      onClick={() => setWaterLevel(prev => Math.max(2, parseFloat((prev - 0.1).toFixed(1))))}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono"
                      title="Giảm 0.1 cm"
                    >
                      -0.1
                    </button>
                    <button
                      onClick={() => setWaterLevel(prev => Math.min(98, parseFloat((prev + 0.1).toFixed(1))))}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono"
                      title="Tăng 0.1 cm"
                    >
                      +0.1
                    </button>
                    <button
                      onClick={() => setWaterLevel(prev => Math.min(98, parseFloat((prev + 1).toFixed(1))))}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono"
                      title="Tăng 1 cm"
                    >
                      +1cm
                    </button>
                  </div>

                  {/* Resonance Jump Targets */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setWaterLevel(parseFloat(l1Theo.toFixed(1)))}
                      className="px-1.5 py-0.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-semibold"
                    >
                      🎯 L1 ({l1Theo.toFixed(1)}cm)
                    </button>
                    <button
                      onClick={() => setWaterLevel(parseFloat(l2Theo.toFixed(1)))}
                      className="px-1.5 py-0.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded text-[10px] font-semibold"
                    >
                      🎯 L2 ({l2Theo.toFixed(1)}cm)
                    </button>
                  </div>
                </div>
              </div>

              {/* Frequency Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Tần số sóng âm f:</span>
                  <strong className="text-cyan-400 font-mono text-sm">{frequency} Hz</strong>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="10"
                  value={frequency}
                  onChange={e => setFrequency(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Dải tần sóng sin (200 - 1200 Hz)</span>
              </div>

              {/* Lab Temperature */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Nhiệt độ phòng t:</span>
                  <strong className="text-emerald-400 font-mono text-sm">{temperature}°C</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="1"
                  value={temperature}
                  onChange={e => setTemperature(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">v_lt = {theoreticalSpeed.toFixed(1)} m/s</span>
              </div>
            </div>

            {/* Marker Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMarkL1}
                  className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <span>📍 Đánh Dấu L1 ({markedL1 !== null ? `${markedL1}cm` : 'Chưa ghi'})</span>
                </button>

                <button
                  onClick={handleMarkL2}
                  className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/40 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <span>📍 Đánh Dấu L2 ({markedL2 !== null ? `${markedL2}cm` : 'Chưa ghi'})</span>
                </button>

                {(markedL1 !== null || markedL2 !== null) && (
                  <button
                    onClick={handleResetMarkers}
                    className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    Xóa mốc
                  </button>
                )}
              </div>

              <button
                onClick={handleSaveTrial}
                disabled={markedL1 === null || markedL2 === null}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition shadow-md flex items-center space-x-1.5"
              >
                <span>➕ Lưu Kết Quả Đo (L2 - L1)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations, Data Table & Theory (5/12) */}
        <div className="w-5/12 p-4 overflow-y-auto space-y-4 bg-slate-950 custom-scrollbar">
          {/* Real-Time Calculation Card */}
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-4 shadow-lg space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <span>📐 Tính Toán Tốc Độ Truyền Âm Thực Nghiệm</span>
            </h3>

            {markedL1 !== null && markedL2 !== null ? (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Vị trí cộng hưởng 1:</span>
                    <strong className="text-emerald-400 text-sm">L1 = {Math.min(markedL1, markedL2)} cm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Vị trí cộng hưởng 2:</span>
                    <strong className="text-purple-400 text-sm">L2 = {Math.max(markedL1, markedL2)} cm</strong>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hiệu khoảng cách (λ/2):</span>
                    <span className="text-slate-200 font-bold">
                      {(Math.max(markedL1, markedL2) - Math.min(markedL1, markedL2)).toFixed(1)} cm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bước sóng xác định:</span>
                    <span className="text-cyan-400 font-bold">
                      λ = 2·(L2 - L1) = {(2 * (Math.max(markedL1, markedL2) - Math.min(markedL1, markedL2))).toFixed(1)} cm
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 text-sm">
                    <span className="text-amber-400 font-bold">Tốc độ truyền âm v:</span>
                    <span className="text-amber-400 font-extrabold">
                      {(
                        ((2 * (Math.max(markedL1, markedL2) - Math.min(markedL1, markedL2))) / 100) *
                        frequency
                      ).toFixed(1)}{' '}
                      m/s
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                Hãy kéo cột nước tìm 2 vị trí âm thanh to nhất và bấm{' '}
                <strong className="text-emerald-400">"Đánh dấu L1"</strong> &{' '}
                <strong className="text-purple-400">"Đánh dấu L2"</strong>.
              </div>
            )}
          </div>

          {/* Measurement Trials Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <span>📋 Bảng Kết Quả Đo Tốc Độ Truyền Âm</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 font-mono">
                  {trials.length} lần đo
                </span>
                {trials.length > 0 && (
                  <button
                    onClick={() => setTrials([])}
                    className="text-[11px] text-red-400 hover:text-red-300 hover:underline"
                  >
                    Xóa hết
                  </button>
                )}
              </div>
            </div>

            {trials.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                Chưa có dữ liệu. Sau khi đánh dấu L1 và L2, bấm <strong className="text-cyan-400">"➕ Lưu Kết Quả Đo"</strong>.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-800/80 uppercase text-slate-400 font-mono text-[10px]">
                    <tr>
                      <th className="p-2">Lần</th>
                      <th className="p-2">f (Hz)</th>
                      <th className="p-2">L1 (cm)</th>
                      <th className="p-2">L2 (cm)</th>
                      <th className="p-2">λ (cm)</th>
                      <th className="p-2 text-amber-400">v (m/s)</th>
                      <th className="p-2 text-slate-400">Sai số</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trials.map(t => (
                      <tr key={t.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 font-mono">
                        <td className="p-2">{t.id}</td>
                        <td className="p-2 text-cyan-400">{t.frequency}</td>
                        <td className="p-2 text-emerald-400">{t.l1}</td>
                        <td className="p-2 text-purple-400">{t.l2}</td>
                        <td className="p-2">{t.lambda}</td>
                        <td className="p-2 font-bold text-amber-400">{t.speedMeasured}</td>
                        <td className="p-2 text-rose-400">{t.errorPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {trials.length > 0 && (
              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Tốc độ truyền âm trung bình:</span>
                <strong className="text-amber-400 text-sm">v̄ = {avgSpeed} m/s</strong>
              </div>
            )}
          </div>

          {/* SGK Physics Theory Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2.5">
            <h4 className="font-bold text-cyan-400 flex items-center space-x-1.5">
              <span>💡 Cơ Sở Lý Thuyết (SGK Vật Lý 11 - Bài 5)</span>
            </h4>
            <p className="leading-relaxed text-slate-400">
              Sóng âm phát từ loa tới mặt nước bị phản xạ, hai sóng tới và phản xạ giao thoa tạo thành{' '}
              <strong className="text-slate-200">sóng dừng trong cột không khí</strong>:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-center text-cyan-400 text-xs border border-slate-800 space-y-1">
              <div>L2 - L1 = λ / 2 &nbsp; ⟹ &nbsp; λ = 2·(L2 - L1)</div>
              <div className="text-amber-400 font-bold">v = λ · f = 2·(L2 - L1) · f</div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] pt-1">
              <li>Mặt nước đóng vai trò là một <strong className="text-slate-300">nút sóng</strong> (vận tốc dao động bằng 0).</li>
              <li>Miệng ống hở có loa phát là một <strong className="text-slate-300">bụng sóng</strong> (biên độ dao động cực đại).</li>
              <li>Hiệu khoảng cách giữa 2 vị trí cộng hưởng liên tiếp giúp loại trừ hoàn toàn sai số miệng ống.</li>
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
          labId="sound-resonance-3d"
          labTitle="Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng 3D)"
          difficulty="MEDIUM"
          onSuccess={() => setIsScreenshotOpen(false)}
        />
      )}
    </div>
  );
};
