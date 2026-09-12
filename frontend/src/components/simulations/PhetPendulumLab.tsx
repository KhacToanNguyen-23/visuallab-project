import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { PendulumEngine } from '../../engine/physics/pendulum-engine';
import { useTheme } from '../../context/ThemeContext';
import { ScreenshotCaptureModal } from '../common/ScreenshotCaptureModal';

type LabTabMode = 'explore' | 'compare' | 'measure' | 'graph';

interface MeasurementRow {
  id: number;
  lengthM: number;
  massKg: number;
  gravityG: number;
  periodSec: number;
  calculatedG: number;
}

const GRAVITY_PRESETS = [
  { label: 'Trái Đất (9.81 m/s²)', value: 9.81 },
  { label: 'Mặt Trăng (1.62 m/s²)', value: 1.62 },
  { label: 'Sao Hỏa (3.71 m/s²)', value: 3.71 },
  { label: 'Sao Mộc (24.79 m/s²)', value: 24.79 },
];

export const PhetPendulumLab: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Tab & Control States
  const [activeTab, setActiveTab] = useState<LabTabMode>('explore');
  const [lengthA, setLengthA] = useState<number>(1.0); // m
  const [massA, setMassA] = useState<number>(0.5); // kg
  const [gravity, setGravity] = useState<number>(9.81); // m/s^2
  const [dampingA, setDampingA] = useState<number>(0.0);

  // Compare Mode Controls
  const [lengthB, setLengthB] = useState<number>(1.0);
  const [massB, setMassB] = useState<number>(1.5);

  // View Switches
  const [showEquilibrium, setShowEquilibrium] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showProtractor, setShowProtractor] = useState<boolean>(true);

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
  const engineARef = useRef<PendulumEngine>(
    new PendulumEngine({ length: 1.0, mass: 0.5, gravity: 9.81, damping: 0.0 })
  );
  const engineBRef = useRef<PendulumEngine>(
    new PendulumEngine({ length: 1.0, mass: 1.5, gravity: 9.81, damping: 0.0 })
  );

  // Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Real-time displacement history for graph
  const historyRef = useRef<{ time: number; angle: number; velocity: number; ke: number; pe: number }[]>([]);
  const isDraggingRef = useRef<boolean>(false);

  // 1. Sync Sliders to Engine
  useEffect(() => {
    engineARef.current.setParams({ length: lengthA, mass: massA, gravity, damping: dampingA });
    engineBRef.current.setParams({ length: lengthB, mass: massB, gravity, damping: dampingA });
  }, [lengthA, massA, lengthB, massB, gravity, dampingA]);

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
      const naturalFreq = (1 / (2 * Math.PI)) * Math.sqrt(gravity / Math.max(0.1, lengthA));
      osc.frequency.setValueAtTime(180 + naturalFreq * 40, ctx.currentTime);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn('Audio Context initialization deferred:', e);
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
  }, [isAudioEnabled, gravity, lengthA]);

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

    // Metallic Stand Frame
    const standTopGeo = new THREE.BoxGeometry(2.2, 0.08, 0.4);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const standTop = new THREE.Mesh(standTopGeo, standMat);
    standTop.position.set(0, 1.6, 0);
    scene.add(standTop);

    const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.4, 16);
    const pillar = new THREE.Mesh(pillarGeo, standMat);
    pillar.position.set(-0.9, 0, 0);
    scene.add(pillar);

    // 3D Protractor Angle Arc
    const protractorGroup = new THREE.Group();
    const arcGeo = new THREE.TorusGeometry(0.8, 0.01, 16, 64, Math.PI);
    const arcMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);
    arcMesh.rotation.z = Math.PI;
    arcMesh.position.set(0, 1.56, 0);
    protractorGroup.add(arcMesh);
    scene.add(protractorGroup);

    // 3D Equilibrium Reference Line
    const refLineGeo = new THREE.CylinderGeometry(0.003, 0.003, 2.5, 8);
    const eqMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const eqMesh = new THREE.Mesh(refLineGeo, eqMat);
    eqMesh.position.set(0, 0.3, 0);
    scene.add(eqMesh);

    // Pendulum A (Brass 3D Sphere & Cord)
    const pendulumAGroup = new THREE.Group();
    const bobAGeo = new THREE.SphereGeometry(0.16, 32, 32);
    const bobAMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
    const bobAMesh = new THREE.Mesh(bobAGeo, bobAMat);
    bobAMesh.castShadow = true;
    pendulumAGroup.add(bobAMesh);
    scene.add(pendulumAGroup);

    // Cord A Mesh
    let cordAMesh: THREE.Mesh | null = null;

    const updateCordA = (topY: number, bobPos: THREE.Vector3) => {
      if (cordAMesh) {
        scene.remove(cordAMesh);
        cordAMesh.geometry.dispose();
      }
      const distance = new THREE.Vector3(0, topY, 0).distanceTo(bobPos);
      const cordGeo = new THREE.CylinderGeometry(0.006, 0.006, distance, 8);
      const cordMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
      cordAMesh = new THREE.Mesh(cordGeo, cordMat);

      const midPoint = new THREE.Vector3(0, topY, 0).add(bobPos).multiplyScalar(0.5);
      cordAMesh.position.copy(midPoint);

      const dir = new THREE.Vector3().subVectors(bobPos, new THREE.Vector3(0, topY, 0)).normalize();
      cordAMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
      scene.add(cordAMesh);
    };

    // Pendulum B (Comparison Mode)
    const pendulumBGroup = new THREE.Group();
    const bobBGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const bobBMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const bobBMesh = new THREE.Mesh(bobBGeo, bobBMat);
    pendulumBGroup.add(bobBMesh);
    scene.add(pendulumBGroup);
    pendulumBGroup.visible = false;

    let cordBMesh: THREE.Mesh | null = null;
    const updateCordB = (topY: number, bobPos: THREE.Vector3) => {
      if (cordBMesh) {
        scene.remove(cordBMesh);
        cordBMesh.geometry.dispose();
      }
      const distance = new THREE.Vector3(0.5, topY, 0).distanceTo(bobPos);
      const cordGeo = new THREE.CylinderGeometry(0.006, 0.006, distance, 8);
      const cordMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
      cordBMesh = new THREE.Mesh(cordGeo, cordMat);

      const midPoint = new THREE.Vector3(0.5, topY, 0).add(bobPos).multiplyScalar(0.5);
      cordBMesh.position.copy(midPoint);

      const dir = new THREE.Vector3().subVectors(bobPos, new THREE.Vector3(0.5, topY, 0)).normalize();
      cordBMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
      scene.add(cordBMesh);
    };

    // Interactive Dragging
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onPointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(bobAMesh);
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

      const dx = targetPoint.x;
      const dy = targetPoint.y - 1.56;
      const angle = Math.atan2(dx, -dy);
      engineARef.current.reset(Math.min(1.2, Math.max(-1.2, angle)));
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000) * timeScale;
      lastTime = now;

      if (isRunning && !isDraggingRef.current) {
        engineARef.current.step(dt);
        if (activeTab === 'compare') {
          engineBRef.current.step(dt);
        }
      }

      const stateA = engineARef.current.state;
      const topY = 1.56;

      // Position A
      const originXA = activeTab === 'compare' ? -0.4 : 0;
      const posXA = originXA + lengthA * 1.5 * Math.sin(stateA.theta);
      const posYA = topY - lengthA * 1.5 * Math.cos(stateA.theta);
      const bobPosA = new THREE.Vector3(posXA, posYA, 0);

      bobAMesh.position.copy(bobPosA);
      updateCordA(topY, bobPosA);

      // Position B (Compare mode)
      if (activeTab === 'compare') {
        pendulumBGroup.visible = true;
        const stateB = engineBRef.current.state;
        const posXB = 0.4 + lengthB * 1.5 * Math.sin(stateB.theta);
        const posYB = topY - lengthB * 1.5 * Math.cos(stateB.theta);
        const bobPosB = new THREE.Vector3(posXB, posYB, 0);

        bobBMesh.position.copy(bobPosB);
        updateCordB(topY, bobPosB);
      } else {
        pendulumBGroup.visible = false;
        if (cordBMesh) cordBMesh.visible = false;
      }

      // Visibility Toggles
      eqMesh.visible = showEquilibrium;
      protractorGroup.visible = showProtractor;

      // Audio pitch shift with angular velocity
      if (oscRef.current && audioCtxRef.current && isAudioEnabled) {
        const velAbs = Math.abs(stateA.omega);
        oscRef.current.frequency.setValueAtTime(180 + velAbs * 60, audioCtxRef.current.currentTime);
      }

      // Buffer history for graphs
      historyRef.current.push({
        time: now / 1000,
        angle: stateA.theta,
        velocity: stateA.omega,
        ke: stateA.kineticEnergy,
        pe: stateA.potentialEnergy,
      });
      if (historyRef.current.length > 200) historyRef.current.shift();

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
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
  }, [theme, showEquilibrium, showProtractor, showRuler, isRunning, timeScale, activeTab, lengthA, lengthB, isAudioEnabled]);

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

      // Draw Angle Curve alpha(t)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      history.forEach((pt, idx) => {
        const px = 40 + (idx / 200) * (width - 60);
        const py = height / 2 - pt.angle * 80;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Draw Angular Velocity Curve omega(t)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      history.forEach((pt, idx) => {
        const px = 40 + (idx / 200) * (width - 60);
        const py = height / 2 - pt.velocity * 30;
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
    const period = 2 * Math.PI * Math.sqrt(lengthA / gravity);
    const calculatedG = (4 * Math.PI * Math.PI * lengthA) / (period * period);

    const newRecord: MeasurementRow = {
      id: Date.now(),
      lengthM: lengthA,
      massKg: massA,
      gravityG: gravity,
      periodSec: Number(period.toFixed(3)),
      calculatedG: Number(calculatedG.toFixed(2)),
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

  const stateA = engineARef.current.state;
  const periodTA = 2 * Math.PI * Math.sqrt(lengthA / gravity);
  const freqFA = 1 / periodTA;
  const angleDeg = ((stateA.theta * 180) / Math.PI).toFixed(1);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-sans transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <ScreenshotCaptureModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        imageBase64={screenshotData}
        labId="sim-simple-pendulum"
        labTitle="Thí Nghiệm Con Lắc Đơn & Dao Động Điều Hòa"
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
              Vật Lý 11 • Chương 1
            </span>
          </div>

          <h1 className="text-sm font-semibold hidden md:block">Thí Nghiệm Con Lắc Đơn & Dao Động Điều Hòa</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              isAudioEnabled ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'border-slate-700 text-slate-400'
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
            <div className="text-amber-400 font-bold">Góc Lệch α: {angleDeg}°</div>
            <div className="text-sky-400 font-bold">Chiều Dài Dây l: {lengthA.toFixed(2)} m</div>
            <div className="text-emerald-400 font-bold">Khối Lượng m: {(massA * 1000).toFixed(0)} g</div>
            <div className="text-purple-400 font-bold">Chu Kỳ T: {periodTA.toFixed(3)} s ({freqFA.toFixed(2)} Hz)</div>
            <div className="text-rose-400">Vận Tốc Góc ω: {stateA.omega.toFixed(2)} rad/s</div>
          </div>

          {/* Interactive Bottom Control Toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-800 flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-4 py-1.5 rounded-full font-bold text-white bg-amber-600 hover:bg-amber-500 cursor-pointer"
            >
              {isRunning ? 'Tạm Dừng' : 'Tiếp Tục'}
            </button>

            <button
              onClick={() => {
                engineARef.current.reset();
                engineBRef.current.reset();
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
                    timeScale === s ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'
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
              { id: 'compare', label: 'So Sánh 2 Con Lắc' },
              { id: 'measure', label: 'Bảng Dữ Liệu' },
              { id: 'graph', label: 'Đồ Thị Real-time' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LabTabMode)}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-500'
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
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400">Thông Số Con Lắc A</h3>

                  {/* Length Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Chiều dài dây l:</span>
                      <span className="text-amber-400 font-mono">{lengthA.toFixed(2)} m</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2.0"
                      step="0.05"
                      value={lengthA}
                      onChange={e => setLengthA(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Mass Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Khối lượng m:</span>
                      <span className="text-amber-400 font-mono">{(massA * 1000).toFixed(0)} g</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="2.0"
                      step="0.05"
                      value={massA}
                      onChange={e => setMassA(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Damping Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Ma sát không khí (Ma sát c):</span>
                      <span className="text-amber-400 font-mono">{dampingA.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="0.2"
                      step="0.01"
                      value={dampingA}
                      onChange={e => setDampingA(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Gravity Selection Presets */}
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

                {/* Reference Displays */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-sky-400">Hiển Thị Tham Chiếu</h3>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEquilibrium}
                      onChange={e => setShowEquilibrium(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>Vị trí cân bằng thẳng đứng O</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showProtractor}
                      onChange={e => setShowProtractor(e.target.checked)}
                      className="rounded accent-sky-500"
                    />
                    <span>Thước đo góc nghiêng (Độ)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showRuler}
                      onChange={e => setShowRuler(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Thước đo chiều dài dây (m)</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'compare' && (
              <div className="space-y-6 text-xs">
                <h3 className="font-bold text-sm uppercase tracking-wider text-sky-400">So Sánh 2 Con Lắc</h3>
                <p className="text-slate-400">Thí nghiệm kiểm chứng chu kỳ T = 2π√(l/g) không phụ thuộc vào khối lượng m.</p>

                <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-amber-400">Con Lắc A (Vàng)</h4>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div>Chiều dài lA: {lengthA.toFixed(2)} m</div>
                    <div>Khối lượng mA: {(massA * 1000).toFixed(0)} g</div>
                    <div className="text-amber-400">Chu kỳ TA: {periodTA.toFixed(3)} s</div>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-sky-400">Con Lắc B (Xanh)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span>Chiều dài lB:</span>
                      <span className="text-sky-400 font-mono">{lengthB.toFixed(2)} m</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2.0"
                      step="0.05"
                      value={lengthB}
                      onChange={e => setLengthB(parseFloat(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />

                    <div className="flex justify-between font-semibold">
                      <span>Khối lượng mB:</span>
                      <span className="text-sky-400 font-mono">{(massB * 1000).toFixed(0)} g</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="2.0"
                      step="0.05"
                      value={massB}
                      onChange={e => setMassB(parseFloat(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />

                    <div className="text-sky-400 font-mono pt-1">
                      Chu kỳ TB: {(2 * Math.PI * Math.sqrt(lengthB / gravity)).toFixed(3)} s
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'measure' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400">Bảng Thực Nghiệm</h3>
                  <button
                    onClick={handleLogRecord}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold cursor-pointer"
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
                          <th className="p-2">l (m)</th>
                          <th className="p-2">m (g)</th>
                          <th className="p-2">T (s)</th>
                          <th className="p-2">g (m/s²)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {records.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-800/50">
                            <td className="p-2 text-amber-400">{r.lengthM}</td>
                            <td className="p-2">{(r.massKg * 1000).toFixed(0)}</td>
                            <td className="p-2 text-sky-400">{r.periodSec}</td>
                            <td className="p-2 text-emerald-400">{r.calculatedG}</td>
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
                <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400">Đồ Thị Li Độ & Vận Tốc Góc</h3>
                <div className="w-full h-56 border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                  <canvas ref={graphCanvasRef} width={340} height={220} className="w-full h-full" />
                </div>
                <div className="flex items-center justify-around font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-amber-400 rounded-full" />
                    <span>Li độ góc α(t)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-sky-400 rounded-full" />
                    <span>Vận tốc góc ω(t)</span>
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
