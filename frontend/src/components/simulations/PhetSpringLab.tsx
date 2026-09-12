import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { SpringEngine } from '../../engine/physics/spring-engine';
import { useTheme } from '../../context/ThemeContext';
import { ScreenshotCaptureModal } from '../common/ScreenshotCaptureModal';

type LabTabMode = 'explore' | 'measure' | 'graph' | 'challenge';

interface MeasurementRow {
  id: number;
  massKg: number;
  stiffnessK: number;
  gravityG: number;
  stretchCm: number;
  periodSec: number;
}

const GRAVITY_PRESETS = [
  { label: 'Trái Đất (9.81 m/s²)', value: 9.81 },
  { label: 'Mặt Trăng (1.62 m/s²)', value: 1.62 },
  { label: 'Sao Hỏa (3.71 m/s²)', value: 3.71 },
  { label: 'Sao Mộc (24.79 m/s²)', value: 24.79 },
];

export const PhetSpringLab: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Tab & Control States
  const [activeTab, setActiveTab] = useState<LabTabMode>('explore');
  const [stiffness, setStiffness] = useState<number>(50); // N/m
  const [mass, setMass] = useState<number>(0.2); // kg
  const [gravity, setGravity] = useState<number>(9.81); // m/s^2
  const [damping, setDamping] = useState<number>(0.05);

  // View Options
  const [showNaturalLength, setShowNaturalLength] = useState<boolean>(true);
  const [showEquilibrium, setShowEquilibrium] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(true);

  // Audio Synth State
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);

  // Simulation Running State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [timeScale, setTimeScale] = useState<number>(1.0);

  // Data Log & Stopwatch
  const [records, setRecords] = useState<MeasurementRow[]>([]);
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isStopwatchActive, setIsStopwatchActive] = useState<boolean>(false);

  // Screenshot Capture Modal State
  const [isScreenshotOpen, setIsScreenshotOpen] = useState<boolean>(false);
  const [screenshotData, setScreenshotData] = useState<string>('');

  // Three.js Mount & Physics Engine Refs
  const mountRef = useRef<HTMLDivElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SpringEngine>(
    new SpringEngine({ stiffness: 50, mass: 0.2, gravity: 9.81, damping: 0.05, naturalLength: 0.4 })
  );

  // Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Real-time displacement history for graph
  const historyRef = useRef<{ time: number; x: number; v: number; a: number }[]>([]);
  const isDraggingRef = useRef<boolean>(false);

  // 1. Update Physics Engine Parameters
  useEffect(() => {
    engineRef.current.updateConfig({ stiffness, mass, gravity, damping });
  }, [stiffness, mass, gravity, damping]);

  // 2. Web Audio API Oscillation Pitch Synthesizer
  useEffect(() => {
    if (!isAudioEnabled) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (_) {}
        oscRef.current = null;
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const gain = ctx.createGain();
      const osc = ctx.createOscillator();

      osc.type = 'sine';
      const omega = Math.sqrt(stiffness / Math.max(0.01, mass));
      const baseFreq = 150 + omega * 15;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn('Audio initialization deferred:', e);
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (_) {}
        oscRef.current = null;
      }
    };
  }, [isAudioEnabled, stiffness, mass]);

  // 3. Three.js 3D Scene Initialization & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === 'light' ? 0xf8fafc : 0x020617);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Metallic Stand Geometry
    const standTopGeo = new THREE.BoxGeometry(1.6, 0.08, 0.4);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const standTop = new THREE.Mesh(standTopGeo, standMat);
    standTop.position.set(0, 1.5, 0);
    scene.add(standTop);

    const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.2, 16);
    const pillar = new THREE.Mesh(pillarGeo, standMat);
    pillar.position.set(-0.7, 0, 0);
    scene.add(pillar);

    // 3D Ruler Mesh
    const rulerGroup = new THREE.Group();
    const rulerBackGeo = new THREE.BoxGeometry(0.18, 3.0, 0.02);
    const rulerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const rulerBack = new THREE.Mesh(rulerBackGeo, rulerMat);
    rulerGroup.add(rulerBack);

    // Ruler Ticks
    for (let cm = 0; cm <= 100; cm += 5) {
      const yPos = 1.4 - (cm / 100) * 2.5;
      const tickGeo = new THREE.BoxGeometry(cm % 10 === 0 ? 0.08 : 0.04, 0.005, 0.025);
      const tickMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.set(cm % 10 === 0 ? 0.04 : 0.02, yPos, 0.01);
      rulerGroup.add(tick);
    }
    rulerGroup.position.set(-0.45, 0, 0);
    scene.add(rulerGroup);

    // Reference Planes: L0 Natural Length & Equilibrium O
    const refLineGeo = new THREE.CylinderGeometry(0.003, 0.003, 1.2, 8);
    refLineGeo.rotateZ(Math.PI / 2);

    const l0Mat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const l0Mesh = new THREE.Mesh(refLineGeo, l0Mat);
    l0Mesh.position.set(0, 1.5 - 0.4 * 2.0, 0);
    scene.add(l0Mesh);

    const eqMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const eqMesh = new THREE.Mesh(refLineGeo, eqMat);
    eqMesh.position.set(0, 1.0, 0);
    scene.add(eqMesh);

    // Mass Bob (3D Cylinder & Hook)
    const massGroup = new THREE.Group();
    const massGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.35, 32);
    const massMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.2 });
    const massMesh = new THREE.Mesh(massGeo, massMat);
    massGroup.add(massMesh);

    const hookGeo = new THREE.TorusGeometry(0.05, 0.01, 16, 32, Math.PI);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const hook = new THREE.Mesh(hookGeo, hookMat);
    hook.position.set(0, 0.18, 0);
    massGroup.add(hook);
    scene.add(massGroup);

    // Interactive Drag Plane & Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onPointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(massMesh);
      if (intersects.length > 0) {
        isDraggingRef.current = true;
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targetPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane, targetPoint);

      const naturalY = 1.5 - 0.4 * 2.0;
      const eqStretch = engineRef.current.getEquilibriumStretch();
      const eqY = naturalY - eqStretch * 2.0;
      const newDisplacement = (eqY - targetPoint.y) / 2.0;
      engineRef.current.setDisplacement(Math.min(0.6, Math.max(-0.6, newDisplacement)));
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Dynamic Helical Spring Mesh Mesh Group
    let springMesh: THREE.Mesh | null = null;

    const createSpringMesh = (topY: number, bottomY: number) => {
      if (springMesh) {
        scene.remove(springMesh);
        springMesh.geometry.dispose();
      }

      const turns = 14;
      const radius = 0.08;
      const points: THREE.Vector3[] = [];
      const steps = 140;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const y = topY + (bottomY - topY) * t;
        const angle = t * turns * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.012, 8, false);
      const springMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
      springMesh = new THREE.Mesh(tubeGeo, springMat);
      scene.add(springMesh);
    };

    // Animation & Integration Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000) * timeScale;
      lastTime = now;

      if (isRunning && !isDraggingRef.current) {
        engineRef.current.step(dt);
      }

      const state = engineRef.current.getState();
      const config = engineRef.current.getConfig();

      // Theoretical Reference Positions
      const topY = 1.5;
      const naturalY = topY - config.naturalLength * 2.0;
      const eqStretch = engineRef.current.getEquilibriumStretch();
      const eqY = naturalY - eqStretch * 2.0;
      const currentY = eqY - state.displacement * 2.0;

      // Update Mesh Positions
      l0Mesh.position.set(0, naturalY, 0);
      l0Mesh.visible = showNaturalLength;

      eqMesh.position.set(0, eqY, 0);
      eqMesh.visible = showEquilibrium;

      rulerGroup.visible = showRuler;

      massGroup.position.set(0, currentY - 0.18, 0);
      createSpringMesh(topY, currentY);

      // Audio Frequency Pitch Modulation
      if (oscRef.current && audioCtxRef.current && isAudioEnabled) {
        const omega = Math.sqrt(config.stiffness / Math.max(0.01, config.mass));
        const velocityAbs = Math.abs(state.velocity);
        const pitchShift = velocityAbs * 80;
        oscRef.current.frequency.setValueAtTime(150 + omega * 12 + pitchShift, audioCtxRef.current.currentTime);
      }

      // Append to graph history buffer
      historyRef.current.push({ time: now / 1000, x: state.displacement, v: state.velocity, a: state.acceleration });
      if (historyRef.current.length > 200) historyRef.current.shift();

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // Handle Resize
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
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, showNaturalLength, showEquilibrium, showRuler, isRunning, timeScale, isAudioEnabled]);

  // 4. Render Real-time Kinematics & Energy Chart Canvas
  useEffect(() => {
    if (activeTab !== 'graph' || !graphCanvasRef.current) return;
    const canvas = graphCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let chartAnimId: number;

    const renderChart = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = theme === 'light' ? '#f8fafc' : '#020617';
      ctx.fillRect(0, 0, width, height);

      // Axis lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, height / 2);
      ctx.lineTo(width - 20, height / 2);
      ctx.moveTo(40, 20);
      ctx.lineTo(40, height - 20);
      ctx.stroke();

      const history = historyRef.current;
      if (history.length < 2) {
        chartAnimId = requestAnimationFrame(renderChart);
        return;
      }

      // Draw Displacement Curve x(t)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      history.forEach((pt, idx) => {
        const px = 40 + (idx / 200) * (width - 60);
        const py = height / 2 - pt.x * 300;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Draw Velocity Curve v(t)
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      history.forEach((pt, idx) => {
        const px = 40 + (idx / 200) * (width - 60);
        const py = height / 2 - pt.v * 60;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      chartAnimId = requestAnimationFrame(renderChart);
    };

    renderChart();
    return () => cancelAnimationFrame(chartAnimId);
  }, [activeTab, theme]);

  // Stopwatch Timer Counter
  useEffect(() => {
    let timerId: any;
    if (isStopwatchActive) {
      timerId = setInterval(() => {
        setStopwatchTime(prev => prev + 0.01);
      }, 10);
    }
    return () => clearInterval(timerId);
  }, [isStopwatchActive]);

  // Log Experiment Row
  const handleLogRecord = () => {
    const config = engineRef.current.getConfig();
    const eqStretch = engineRef.current.getEquilibriumStretch();
    const period = 2 * Math.PI * Math.sqrt(config.mass / config.stiffness);

    const newRecord: MeasurementRow = {
      id: Date.now(),
      massKg: config.mass,
      stiffnessK: config.stiffness,
      gravityG: config.gravity,
      stretchCm: Number((eqStretch * 100).toFixed(2)),
      periodSec: Number(period.toFixed(3)),
    };
    setRecords(prev => [...prev, newRecord]);
  };

  // Capture Report Screenshot
  const handleCaptureScreenshot = () => {
    if (mountRef.current) {
      const canvas = mountRef.current.querySelector('canvas');
      if (canvas) {
        setScreenshotData(canvas.toDataURL('image/png'));
        setIsScreenshotOpen(true);
      }
    }
  };

  const state = engineRef.current.getState();
  const eqStretch = engineRef.current.getEquilibriumStretch();
  const periodT = 2 * Math.PI * Math.sqrt(mass / stiffness);
  const freqF = 1 / periodT;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-sans transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <ScreenshotCaptureModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        imageBase64={screenshotData}
        labId="sim-spring-mass"
        labTitle="Thí Nghiệm Con Lắc Lò Xo & Định Luật Hooke"
      />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b flex-shrink-0 h-14 px-6 flex items-center justify-between shadow-xs transition-colors duration-200" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-semibold"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
          >
            Trang Chủ
          </button>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight">VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span></span>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}>
              Vật Lý 12 • Chương 1
            </span>
          </div>

          <h1 className="text-sm font-semibold hidden md:block">Thí Nghiệm Con Lắc Lò Xo & Định Luật Hooke</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              isAudioEnabled ? 'bg-sky-500/20 text-sky-400 border-sky-500/50' : 'border-slate-700 text-slate-400'
            }`}
          >
            {isAudioEnabled ? 'Âm Thanh: Bật' : 'Âm Thanh: Tắt'}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border transition-colors flex items-center justify-center cursor-pointer text-xs"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
          >
            {theme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng'}
          </button>

          <button
            onClick={handleCaptureScreenshot}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Chụp Báo Cáo
          </button>
        </div>
      </header>

      {/* Main Viewport Content Split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Interactive 3D Canvas Area */}
        <div className="flex-1 relative flex flex-col bg-slate-950 overflow-hidden">
          <div ref={mountRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Real-time Overlay HUD Stats */}
          <div className="absolute top-4 left-4 pointer-events-none space-y-1.5 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="text-sky-400 font-bold">Lò Xo: k = {stiffness} N/m</div>
            <div className="text-emerald-400 font-bold">Khối Lượng: m = {(mass * 1000).toFixed(0)}g</div>
            <div className="text-amber-400 font-bold">Độ Giãn Cân Bằng: ΔL = {(eqStretch * 100).toFixed(2)} cm</div>
            <div className="text-purple-400 font-bold">Chu Kỳ Lý Thuyết T: {periodT.toFixed(3)} s ({freqF.toFixed(2)} Hz)</div>
            <div className="text-slate-300">Li Độ x: {(state.displacement * 100).toFixed(2)} cm</div>
            <div className="text-rose-400">Vận Tốc v: {state.velocity.toFixed(2)} m/s</div>
          </div>

          {/* Interactive Bottom Control Toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-800 flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-4 py-1.5 rounded-full font-bold text-white bg-sky-600 hover:bg-sky-500 cursor-pointer"
            >
              {isRunning ? 'Tạm Dừng' : 'Tiếp Tục'}
            </button>

            <button
              onClick={() => {
                engineRef.current.reset();
                setStopwatchTime(0);
                setIsStopwatchActive(false);
              }}
              className="px-3 py-1.5 rounded-full font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Đặt Lại
            </button>

            <div className="h-4 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Tốc độ:</span>
              {[0.5, 1.0, 2.0].map(s => (
                <button
                  key={s}
                  onClick={() => setTimeScale(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                    timeScale === s ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-700" />

            {/* Stopwatch HUD */}
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-400">Đồng Hồ:</span>
              <span className="text-emerald-400 font-bold">{stopwatchTime.toFixed(2)}s</span>
              <button
                onClick={() => setIsStopwatchActive(!isStopwatchActive)}
                className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
              >
                {isStopwatchActive ? 'Dừng' : 'Bắt Đầu'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Control & Analytics Panel */}
        <div className="w-full md:w-96 flex-shrink-0 border-l flex flex-col overflow-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          {/* Tab Navigation */}
          <div className="flex border-b flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
            {[
              { id: 'explore', label: 'Khám Phá' },
              { id: 'measure', label: 'Bảng Dữ Liệu' },
              { id: 'graph', label: 'Đồ Thị Real-time' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LabTabMode)}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'explore' && (
              <div className="space-y-6 text-xs">
                {/* Physical Parameter Sliders */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-sky-400">Thông Số Con Lắc</h3>

                  {/* Mass Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Khối lượng m:</span>
                      <span className="text-sky-400 font-mono">{(mass * 1000).toFixed(0)} g</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={mass}
                      onChange={e => setMass(parseFloat(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  {/* Stiffness Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Độ cứng lò xo k:</span>
                      <span className="text-sky-400 font-mono">{stiffness} N/m</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={stiffness}
                      onChange={e => setStiffness(parseFloat(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  {/* Damping Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Ma sát không khí (Ma sát c):</span>
                      <span className="text-sky-400 font-mono">{damping.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="0.3"
                      step="0.01"
                      value={damping}
                      onChange={e => setDamping(parseFloat(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Gravity Selection Presets (Zero Emojis) */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-400">Gia Tốc Trọng Trường g</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {GRAVITY_PRESETS.map(preset => (
                      <button
                        key={preset.value}
                        onClick={() => setGravity(preset.value)}
                        className={`p-2 rounded-lg border text-left font-semibold transition-all cursor-pointer ${
                          gravity === preset.value
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Displays & Toggles */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400">Hiển Thị Tham Chiếu</h3>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showNaturalLength}
                      onChange={e => setShowNaturalLength(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Vị trí tự nhiên L0 (Đường nét đứt vàng)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEquilibrium}
                      onChange={e => setShowEquilibrium(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>Vị trí cân bằng O (Đường nét đứt xanh)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showRuler}
                      onChange={e => setShowRuler(e.target.checked)}
                      className="rounded accent-sky-500"
                    />
                    <span>Thước đo chiều dài (cm)</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'measure' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-sky-400">Bảng Thực Nghiệm</h3>
                  <button
                    onClick={handleLogRecord}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold cursor-pointer"
                  >
                    + Ghi Kết Quả
                  </button>
                </div>

                {records.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">Chưa có kết quả nào. Bấm nút bên trên để ghi lại thông số hiện tại.</div>
                ) : (
                  <div className="overflow-x-auto border border-slate-800 rounded-lg">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2">m (g)</th>
                          <th className="p-2">k (N/m)</th>
                          <th className="p-2">ΔL (cm)</th>
                          <th className="p-2">T (s)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {records.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-800/50">
                            <td className="p-2">{(r.massKg * 1000).toFixed(0)}</td>
                            <td className="p-2">{r.stiffnessK}</td>
                            <td className="p-2 text-emerald-400">{r.stretchCm}</td>
                            <td className="p-2 text-sky-400">{r.periodSec}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'graph' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-sm uppercase tracking-wider text-sky-400">Đồ Thị Li Độ & Vận Tốc</h3>
                <div className="w-full h-56 border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                  <canvas ref={graphCanvasRef} width={340} height={220} className="w-full h-full" />
                </div>
                <div className="flex items-center justify-around font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-sky-400 rounded-full" />
                    <span>Li độ x(t)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-rose-400 rounded-full" />
                    <span>Vận tốc v(t)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
