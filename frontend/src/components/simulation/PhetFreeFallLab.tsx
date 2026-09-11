import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Vector2 } from 'scenerystack/dot';
import { FreeFallEngine } from '../../engine/physics/free-fall-engine';
import { ScreenshotCaptureModal } from '../common/ScreenshotCaptureModal';

// Droppable Object Presets with PhET Vector Specs
interface ObjectPreset {
  id: string;
  name: string;
  emoji: string;
  mass: number; // kg
  dragCoeff: number;
  area: number; // m^2
  color: string;
  radius: number; // m
}

const OBJECT_PRESETS: ObjectPreset[] = [
  { id: 'apple', name: 'Quả Táo (Newton)', emoji: '🍎', mass: 0.15, dragCoeff: 0.4, area: 0.0038, color: '#dc2626', radius: 0.035 },
  { id: 'basketball', name: 'Quả Bóng Rổ', emoji: '🏀', mass: 0.62, dragCoeff: 0.47, area: 0.045, color: '#f97316', radius: 0.06 },
  { id: 'steel_ball', name: 'Bi Thép SGK', emoji: '🎱', mass: 0.05, dragCoeff: 0.47, area: 0.002, color: '#e2e8f0', radius: 0.025 },
  { id: 'feather', name: 'Cánh Lông Chim', emoji: '🪶', mass: 0.005, dragCoeff: 1.2, area: 0.012, color: '#f8fafc', radius: 0.04 },
];

const GRAVITY_PRESETS = [
  { label: '🌍 Trái Đất', value: 9.81, desc: '9.81 m/s²' },
  { label: '🌕 Mặt Trăng', value: 1.62, desc: '1.62 m/s²' },
  { label: '🔴 Sao Hỏa', value: 3.71, desc: '3.71 m/s²' },
  { label: '🪐 Sao Mộc', value: 24.79, desc: '24.79 m/s²' },
];

export const PhetFreeFallLab: React.FC = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement | null>(null);

  // States
  const [selectedObj, setSelectedObj] = useState<ObjectPreset>(OBJECT_PRESETS[0]);
  const [vacuumMode, setVacuumMode] = useState(true);
  const [timeScale, setTimeScale] = useState(1.0);
  const [gravity, setGravity] = useState(9.81);
  const [gateEPos, setGateEPos] = useState(0.20);
  const [gateFPos, setGateFPos] = useState(0.80);
  const [timeE, setTimeE] = useState<number | null>(null);
  const [timeF, setTimeF] = useState<number | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [measurements, setMeasurements] = useState<{ objectName: string; h: number; dt: number; g: number }[]>([]);

  // Three.js & Physics Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const objMeshRef = useRef<THREE.Group | null>(null);
  const gateEMeshRef = useRef<THREE.Group | null>(null);
  const gateFMeshRef = useRef<THREE.Group | null>(null);
  const wireEMeshRef = useRef<THREE.Mesh | null>(null);
  const wireFMeshRef = useRef<THREE.Mesh | null>(null);
  const beamEMeshRef = useRef<THREE.Mesh | null>(null);
  const beamFMeshRef = useRef<THREE.Mesh | null>(null);

  const engineRef = useRef(
    new FreeFallEngine({
      gravity: 9.81,
      dropHeight: 1.0,
      mass: OBJECT_PRESETS[0].mass,
      airResistance: !vacuumMode,
      dragCoefficient: OBJECT_PRESETS[0].dragCoeff,
      area: OBJECT_PRESETS[0].area,
      timeScale: 1.0,
    })
  );

  const timeERef = useRef<number | null>(null);
  const timeFRef = useRef<number | null>(null);

  // Re-config engine on state changes
  useEffect(() => {
    engineRef.current.setConfig({
      gravity,
      mass: selectedObj.mass,
      airResistance: !vacuumMode,
      dragCoefficient: selectedObj.dragCoeff,
      area: selectedObj.area,
      timeScale,
    });
  }, [gravity, selectedObj, vacuumMode, timeScale]);

  // PhET Vector 2D calculation helper using scenerystack/dot
  const phetPosVector = new Vector2(0, gateEPos);

  // Helper to create 3D Object Mesh with PBR Materials
  const createObjectMesh = (preset: ObjectPreset) => {
    const group = new THREE.Group();

    if (preset.id === 'apple') {
      const appleGeo = new THREE.SphereGeometry(preset.radius, 32, 32);
      appleGeo.scale(1, 0.9, 1);
      const appleMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.2, metalness: 0.1 });
      const appleMesh = new THREE.Mesh(appleGeo, appleMat);
      appleMesh.castShadow = true;
      group.add(appleMesh);

      const stemGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.02, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: '#78350f' });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(0, preset.radius * 0.9 + 0.01, 0);
      group.add(stem);
    } else if (preset.id === 'basketball') {
      const ballGeo = new THREE.SphereGeometry(preset.radius, 32, 32);
      const ballMat = new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.6, metalness: 0.05 });
      const ballMesh = new THREE.Mesh(ballGeo, ballMat);
      ballMesh.castShadow = true;
      group.add(ballMesh);
    } else if (preset.id === 'feather') {
      const featherGeo = new THREE.BoxGeometry(0.008, preset.radius * 2.2, 0.04);
      const featherMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.9, transparent: true, opacity: 0.95 });
      const featherMesh = new THREE.Mesh(featherGeo, featherMat);
      featherMesh.castShadow = true;
      group.add(featherMesh);
    } else {
      // Steel Ball (Chrome PBR)
      const ballGeo = new THREE.SphereGeometry(preset.radius, 32, 32);
      const ballMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.05, metalness: 0.98 });
      const ballMesh = new THREE.Mesh(ballGeo, ballMat);
      ballMesh.castShadow = true;
      group.add(ballMesh);
    }

    return group;
  };

  // Helper to build 3D Dynamic Electric Wires
  const updateWireGeometries = (eY: number, fY: number) => {
    const timerPos = new THREE.Vector3(0.5, 0.1, 0.2); // Timer box socket

    // Wire E Curve
    const gateEPos3D = new THREE.Vector3(0.06, 1.2 - eY, 0);
    const curveE = new THREE.CatmullRomCurve3([
      gateEPos3D,
      new THREE.Vector3(0.2, (1.2 - eY + 0.1) / 2, 0.1),
      timerPos,
    ]);
    if (wireEMeshRef.current) {
      wireEMeshRef.current.geometry.dispose();
      wireEMeshRef.current.geometry = new THREE.TubeGeometry(curveE, 32, 0.003, 8, false);
    }

    // Wire F Curve
    const gateFPos3D = new THREE.Vector3(0.06, 1.2 - fY, 0);
    const curveF = new THREE.CatmullRomCurve3([
      gateFPos3D,
      new THREE.Vector3(0.25, (1.2 - fY + 0.1) / 2, 0.15),
      timerPos,
    ]);
    if (wireFMeshRef.current) {
      wireFMeshRef.current.geometry.dispose();
      wireFMeshRef.current.geometry = new THREE.TubeGeometry(curveF, 32, 0.003, 8, false);
    }
  };

  // Setup Three.js 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.05);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0.2, 1.1, 2.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.02;
    controls.minDistance = 1.0;
    controls.maxDistance = 4.5;
    controls.target.set(0, 0.6, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 2.5);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const cyanGlow = new THREE.PointLight('#38bdf8', 2.0, 4);
    cyanGlow.position.set(-1.2, 1.5, 1);
    scene.add(cyanGlow);

    // Lab Table Surface
    const tableGeo = new THREE.BoxGeometry(4, 0.08, 2);
    const tableMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3, metalness: 0.4 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, -0.04, 0);
    table.receiveShadow = true;
    scene.add(table);

    const grid = new THREE.GridHelper(3.8, 19, '#334155', '#0f172a');
    grid.position.set(0, 0.001, 0);
    scene.add(grid);

    // Stand (Chrome Metal)
    const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.3, 32);
    const poleMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.05, metalness: 0.95 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, 0.65, 0);
    pole.castShadow = true;
    scene.add(pole);

    const baseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.03, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5, metalness: 0.7 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.015, 0);
    base.castShadow = true;
    scene.add(base);

    // Electromagnet
    const emGeo = new THREE.BoxGeometry(0.08, 0.06, 0.08);
    const emMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.2, metalness: 0.5 });
    const magnet = new THREE.Mesh(emGeo, emMat);
    magnet.position.set(0, 1.25, 0);
    magnet.castShadow = true;
    scene.add(magnet);

    // Object Group
    const objGroup = createObjectMesh(selectedObj);
    objGroup.position.set(0, 1.2, 0);
    scene.add(objGroup);
    objMeshRef.current = objGroup;

    // Photogates
    const createPhotogate = (colorHex: string) => {
      const group = new THREE.Group();
      const bracketGeo = new THREE.BoxGeometry(0.12, 0.02, 0.06);
      const bracketMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.2, metalness: 0.6 });
      const bracket = new THREE.Mesh(bracketGeo, bracketMat);
      bracket.castShadow = true;
      group.add(bracket);

      const armGeo = new THREE.BoxGeometry(0.02, 0.04, 0.08);
      const armLeft = new THREE.Mesh(armGeo, bracketMat);
      armLeft.position.set(-0.05, 0, 0);
      group.add(armLeft);

      const armRight = new THREE.Mesh(armGeo, bracketMat);
      armRight.position.set(0.05, 0, 0);
      group.add(armRight);

      const beamGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.09, 8);
      beamGeo.rotateZ(Math.PI / 2);
      const beamMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.85 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      group.add(beam);

      return { group, beam };
    };

    const gateE = createPhotogate('#3b82f6');
    gateEMeshRef.current = gateE.group;
    beamEMeshRef.current = gateE.beam;
    scene.add(gateE.group);

    const gateF = createPhotogate('#ef4444');
    gateFMeshRef.current = gateF.group;
    beamFMeshRef.current = gateF.beam;
    scene.add(gateF.group);

    // Digital Timer Box 3D
    const timerBoxGeo = new THREE.BoxGeometry(0.35, 0.12, 0.2);
    const timerBoxMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.8 });
    const timerBox = new THREE.Mesh(timerBoxGeo, timerBoxMat);
    timerBox.position.set(0.5, 0.06, 0.2);
    timerBox.castShadow = true;
    scene.add(timerBox);

    // 3D Dynamic Wires (Blue & Red Cables)
    const dummyCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.5, 0.1, 0.2)]);
    const wireEGeo = new THREE.TubeGeometry(dummyCurve, 32, 0.003, 8, false);
    const wireEMat = new THREE.MeshStandardMaterial({ color: '#2563eb', roughness: 0.4 });
    const wireEMesh = new THREE.Mesh(wireEGeo, wireEMat);
    scene.add(wireEMesh);
    wireEMeshRef.current = wireEMesh;

    const wireFGeo = new THREE.TubeGeometry(dummyCurve, 32, 0.003, 8, false);
    const wireFMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4 });
    const wireFMesh = new THREE.Mesh(wireFGeo, wireFMat);
    scene.add(wireFMesh);
    wireFMeshRef.current = wireFMesh;

    updateWireGeometries(gateEPos, gateFPos);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const engine = engineRef.current;
      engine.update(dt);
      const state = engine.getState();

      if (objMeshRef.current) {
        objMeshRef.current.position.y = 1.2 - state.y;
        if (state.isDropping) objMeshRef.current.rotation.z += 0.02;
      }

      if (state.y >= gateEPos && timeERef.current === null && state.isDropping) {
        timeERef.current = state.t;
        setTimeE(state.t);
        if (beamEMeshRef.current) (beamEMeshRef.current.material as THREE.MeshBasicMaterial).color.set('#38bdf8');
      }

      if (state.y >= gateFPos && timeFRef.current === null && state.isDropping) {
        timeFRef.current = state.t;
        setTimeF(state.t);
        if (beamFMeshRef.current) (beamFMeshRef.current.material as THREE.MeshBasicMaterial).color.set('#f43f5e');
      }

      setIsDropping(state.isDropping);
      controls.update();
      renderer.render(scene, camera);
    };

    animate(performance.now());

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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [selectedObj]);

  // Update Photogate & Cable Wires on slider change
  useEffect(() => {
    if (gateEMeshRef.current) gateEMeshRef.current.position.set(0, 1.2 - gateEPos, 0);
    if (gateFMeshRef.current) gateFMeshRef.current.position.set(0, 1.2 - gateFPos, 0);
    updateWireGeometries(gateEPos, gateFPos);
  }, [gateEPos, gateFPos]);

  const handleStart = () => engineRef.current.start();

  const handleReset = () => {
    engineRef.current.reset();
    setTimeE(null);
    setTimeF(null);
    timeERef.current = null;
    timeFRef.current = null;
    if (objMeshRef.current) {
      objMeshRef.current.position.y = 1.2;
      objMeshRef.current.rotation.set(0, 0, 0);
    }
    if (beamEMeshRef.current) (beamEMeshRef.current.material as THREE.MeshBasicMaterial).color.set('#3b82f6');
    if (beamFMeshRef.current) (beamFMeshRef.current.material as THREE.MeshBasicMaterial).color.set('#ef4444');
  };

  const handleRecord = () => {
    if (timeE !== null && timeF !== null) {
      const dt = timeF - timeE;
      const h = gateFPos - gateEPos;
      const gCalc = (2 * h) / (dt * dt);
      setMeasurements((prev) => [...prev, { objectName: `${selectedObj.emoji} ${selectedObj.name}`, h, dt, g: gCalc }]);
    }
  };

  const dt = timeF !== null && timeE !== null ? timeF - timeE : null;
  const gCalc = dt !== null ? (2 * (gateFPos - gateEPos)) / (dt * dt) : null;

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* 70% Viewport 3D Canvas */}
      <div className="w-[70%] h-full relative">
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/60 shadow-2xl">
          <span className="px-3 py-1.5 bg-indigo-600/30 text-indigo-300 font-black text-xs rounded-xl border border-indigo-500/30">
            ⚡ PhET Engine Core + 3D PBR WebGL
          </span>
          <span className="text-xs text-slate-400 font-mono">Vector: ({phetPosVector.x}, {phetPosVector.y})</span>
        </div>

        {/* Challenge prompt */}
        <div className="absolute top-4 right-4 z-20 max-w-sm bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-indigo-500/30 shadow-2xl">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
            💡 THÁCH THỨC VẬT LÝ
          </div>
          <p className="text-xs text-slate-200 font-medium">
            Chọn <span className="text-amber-400 font-bold">🍎 Quả Táo</span> và <span className="text-slate-300 font-bold">🪶 Lông Chim</span>. Thử <span className="text-emerald-400 font-bold">BẬT Chân Không</span> để xem điều kỳ diệu!
          </p>
        </div>

        <div className="w-full h-full relative" ref={mountRef}>
          <div className="absolute bottom-4 left-4 pointer-events-none text-slate-400 text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
            💡 Giữ chuột trái để xoay 3D | Dây điện 3D tự uốn cong khi kéo cổng E, F
          </div>
        </div>
      </div>

      {/* 30% Right Control Panel (LED Skeuomorphic UI) */}
      <div className="w-[30%] h-full bg-slate-900 border-l border-slate-800 flex flex-col z-10 shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <button
            onClick={() => navigate('/thu-vien')}
            className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            ← Thoát
          </button>
          <span className="text-xs font-black tracking-widest text-slate-400 uppercase">VisualLab 3D PBR</span>
          <button
            onClick={() => setIsScreenshotOpen(true)}
            className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold hover:bg-emerald-600/30 transition-colors"
          >
            📸 Lưu kho
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Select Object */}
          <div className="space-y-2">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">🍎 Chọn Vật Thể Rơi</div>
            <div className="grid grid-cols-2 gap-2">
              {OBJECT_PRESETS.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => {
                    setSelectedObj(obj);
                    handleReset();
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2 ${
                    selectedObj.id === obj.id
                      ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-lg shadow-indigo-500/20 font-bold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg">{obj.emoji}</span>
                  <div className="text-xs truncate">{obj.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vacuum Toggle & Slow-Mo */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">🌬 Thí Nghiệm Chân Không</div>
                <div className="text-[10px] text-slate-500">Bật để triệt tiêu sức cản không khí</div>
              </div>
              <button
                onClick={() => {
                  setVacuumMode(!vacuumMode);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  vacuumMode
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {vacuumMode ? '✨ CHÂN KHÔNG (ON)' : '💨 CÓ KHÔNG KHÍ (OFF)'}
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
              <span className="text-xs font-bold text-slate-400">🐢 Tốc Độ Mô Phỏng</span>
              <div className="flex gap-1.5">
                {[
                  { label: '1.0x', val: 1.0 },
                  { label: '0.25x', val: 0.25 },
                  { label: '0.1x', val: 0.1 },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setTimeScale(s.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      timeScale === s.val ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LED 7-Segment Digital Timer Box UI */}
          <div className="bg-black p-4 rounded-2xl border-2 border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                📟 ĐỒNG HỒ ĐO THỜI GIAN LED 7 ĐOẠN
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-pulse" />
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-blue-900/50">
                <span className="text-xs text-blue-400 font-bold">CỔNG E (t₁)</span>
                <span className="text-2xl font-black text-cyan-400 tracking-wider shadow-cyan-500/20">
                  {timeE !== null ? timeE.toFixed(4) : '0.0000'} <span className="text-xs font-normal text-slate-500">s</span>
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-red-900/50">
                <span className="text-xs text-red-400 font-bold">CỔNG F (t₂)</span>
                <span className="text-2xl font-black text-rose-400 tracking-wider">
                  {timeF !== null ? timeF.toFixed(4) : '0.0000'} <span className="text-xs font-normal text-slate-500">s</span>
                </span>
              </div>

              <div className="flex justify-between items-center bg-yellow-950/40 p-3.5 rounded-xl border border-yellow-500/40">
                <span className="text-xs text-yellow-400 font-black">Δt = t₂ − t₁</span>
                <span className="text-2xl font-black text-yellow-300 tracking-widest">
                  {dt !== null ? dt.toFixed(4) : '0.0000'} <span className="text-xs font-normal text-slate-500">s</span>
                </span>
              </div>
            </div>
          </div>

          {/* Computed g */}
          {gCalc !== null && (
            <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30">
              <div className="text-xs text-emerald-400 font-bold mb-1">🧮 Gia tốc tính toán được</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">{gCalc.toFixed(3)}</span>
                <span className="text-xs text-emerald-500">m/s²</span>
              </div>
              <button
                onClick={handleRecord}
                className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                📋 Lưu vào Bảng Số Liệu
              </button>
            </div>
          )}

          {/* Photogate Sliders */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              📏 Vị Trí Cổng Quang (Dây điện 3D tự uốn)
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-blue-400">
                <span>Vị trí Cổng E (h₁)</span>
                <span>{(gateEPos * 100).toFixed(0)} cm</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={gateEPos}
                onChange={(e) => setGateEPos(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-red-400">
                <span>Vị trí Cổng F (h₂)</span>
                <span>{(gateFPos * 100).toFixed(0)} cm</span>
              </div>
              <input
                type="range"
                min="0.55"
                max="0.95"
                step="0.05"
                value={gateFPos}
                onChange={(e) => setGateFPos(parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Gravity Selector */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Môi Trường Trọng Trường (g)</div>
            <div className="grid grid-cols-2 gap-2">
              {GRAVITY_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setGravity(p.value);
                    engineRef.current.setGravity(p.value);
                    handleReset();
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    gravity === p.value
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-lg shadow-blue-500/20'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] text-slate-500">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleStart}
              disabled={isDropping}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white py-3.5 rounded-xl font-black text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all"
            >
              ⚡ Thả Vật Rơi
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3.5 rounded-xl font-black text-sm active:scale-95 transition-all border border-slate-700"
            >
              🔄 Làm Lại
            </button>
          </div>

          {/* Measurements Table */}
          {measurements.length > 0 && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-400">
                📊 Bảng Số Liệu Lần Đo ({measurements.length})
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="px-3 py-2 text-left">Vật</th>
                    <th className="px-3 py-2 text-right">Δs (m)</th>
                    <th className="px-3 py-2 text-right">Δt (s)</th>
                    <th className="px-3 py-2 text-right text-emerald-400">g (m/s²)</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((m, i) => (
                    <tr key={i} className="border-b border-slate-900">
                      <td className="px-3 py-1.5 text-slate-300 font-bold truncate max-w-[90px]">{m.objectName}</td>
                      <td className="px-3 py-1.5 text-right font-mono">{m.h.toFixed(2)}</td>
                      <td className="px-3 py-1.5 text-right font-mono">{m.dt.toFixed(4)}</td>
                      <td className="px-3 py-1.5 text-right font-mono text-emerald-400 font-bold">{m.g.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isScreenshotOpen && (
        <ScreenshotCaptureModal
          isOpen={isScreenshotOpen}
          imageBase64=""
          labId="sim-free-fall"
          labTitle="Đo Gia Tốc Rơi Tự Do 3D PBR"
          difficulty="DỄ"
          onClose={() => setIsScreenshotOpen(false)}
        />
      )}
    </div>
  );
};
