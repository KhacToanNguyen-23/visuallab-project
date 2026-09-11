import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FreeFallEngine } from '../../engine/physics/free-fall-engine';
import { ScreenshotCaptureModal } from '../common/ScreenshotCaptureModal';

const GRAVITY_PRESETS = [
  { label: '🌍 Trái Đất', value: 9.81, desc: '9.81 m/s²' },
  { label: '🌕 Mặt Trăng', value: 1.62, desc: '1.62 m/s²' },
  { label: '🔴 Sao Hỏa', value: 3.71, desc: '3.71 m/s²' },
  { label: '🪐 Sao Mộc', value: 24.79, desc: '24.79 m/s²' },
];

export const PhetFreeFallLab: React.FC = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Mode: 3D Custom Engine vs PhET Embed
  const [labMode, setLabMode] = useState<'3d' | 'phet'>('3d');

  // Controls state
  const [gravity, setGravity] = useState(9.81);
  const [gateEPos, setGateEPos] = useState(0.20); // meters (20cm)
  const [gateFPos, setGateFPos] = useState(0.80); // meters (80cm)
  const [timeE, setTimeE] = useState<number | null>(null);
  const [timeF, setTimeF] = useState<number | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [measurements, setMeasurements] = useState<{ h: number; dt: number; g: number }[]>([]);

  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ballMeshRef = useRef<THREE.Mesh | null>(null);
  const gateEMeshRef = useRef<THREE.Group | null>(null);
  const gateFMeshRef = useRef<THREE.Group | null>(null);
  const beamEMeshRef = useRef<THREE.Mesh | null>(null);
  const beamFMeshRef = useRef<THREE.Mesh | null>(null);

  // Physics engine ref
  const engineRef = useRef(new FreeFallEngine({ gravity: 9.81, dropHeight: 1.0 }));
  const timeERef = useRef<number | null>(null);
  const timeFRef = useRef<number | null>(null);

  // Setup Three.js 3D Scene
  useEffect(() => {
    if (labMode !== '3d' || !mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');
    scene.fog = new THREE.FogExp2('#0f172a', 0.08);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 2.5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Clear previous canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 1.0;
    controls.maxDistance = 5.0;
    controls.target.set(0, 0.6, 0);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 2.0);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight('#38bdf8', 1.5, 5);
    pointLight.position.set(-1.5, 1.8, 1);
    scene.add(pointLight);

    // 6. Workbench / Lab Floor
    const tableGeo = new THREE.BoxGeometry(4, 0.1, 2);
    const tableMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.2 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, -0.05, 0);
    table.receiveShadow = true;
    scene.add(table);

    // Grid on table
    const grid = new THREE.GridHelper(3.8, 19, '#334155', '#1e293b');
    grid.position.set(0, 0.001, 0);
    scene.add(grid);

    // 7. Metallic Vertical Stand
    const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.3, 32);
    const poleMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.1, metalness: 0.9 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, 0.65, 0);
    pole.castShadow = true;
    scene.add(pole);

    // Heavy Base Plate
    const baseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.03, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5, metalness: 0.7 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.015, 0);
    base.castShadow = true;
    scene.add(base);

    // 8. Electromagnet (Top)
    const emGeo = new THREE.BoxGeometry(0.08, 0.06, 0.08);
    const emMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.3, metalness: 0.5 });
    const magnet = new THREE.Mesh(emGeo, emMat);
    magnet.position.set(0, 1.25, 0);
    magnet.castShadow = true;
    scene.add(magnet);

    // Coil indicator light
    const ledGeo = new THREE.SphereGeometry(0.008, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: '#22c55e' });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0.041, 1.25, 0);
    scene.add(led);

    // 9. Steel Ball
    const ballGeo = new THREE.SphereGeometry(0.025, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.1,
      metalness: 0.95,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 1.2, 0); // initial Y (1.2m = 0m drop distance)
    ball.castShadow = true;
    scene.add(ball);
    ballMeshRef.current = ball;

    // Helper to create Photogate Mesh
    const createPhotogate = (colorHex: string) => {
      const group = new THREE.Group();
      // Bracket
      const bracketGeo = new THREE.BoxGeometry(0.12, 0.02, 0.06);
      const bracketMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.4 });
      const bracket = new THREE.Mesh(bracketGeo, bracketMat);
      bracket.castShadow = true;
      group.add(bracket);

      // Sensor arms
      const armGeo = new THREE.BoxGeometry(0.02, 0.04, 0.08);
      const armLeft = new THREE.Mesh(armGeo, bracketMat);
      armLeft.position.set(-0.05, 0, 0);
      group.add(armLeft);

      const armRight = new THREE.Mesh(armGeo, bracketMat);
      armRight.position.set(0.05, 0, 0);
      group.add(armRight);

      // Laser beam
      const beamGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.09, 8);
      beamGeo.rotateZ(Math.PI / 2);
      const beamMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.8 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      group.add(beam);

      return { group, beam };
    };

    // Photogate E (Blue)
    const gateE = createPhotogate('#3b82f6');
    gateEMeshRef.current = gateE.group;
    beamEMeshRef.current = gateE.beam;
    scene.add(gateE.group);

    // Photogate F (Red)
    const gateF = createPhotogate('#ef4444');
    gateFMeshRef.current = gateF.group;
    beamFMeshRef.current = gateF.beam;
    scene.add(gateF.group);

    // 10. Physical Digital Timer Box on table
    const timerBoxGeo = new THREE.BoxGeometry(0.35, 0.12, 0.2);
    const timerBoxMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.6 });
    const timerBox = new THREE.Mesh(timerBoxGeo, timerBoxMat);
    timerBox.position.set(0.6, 0.06, 0.2);
    timerBox.castShadow = true;
    scene.add(timerBox);

    // Timer Screen
    const screenGeo = new THREE.PlaneGeometry(0.28, 0.08);
    const screenMat = new THREE.MeshBasicMaterial({ color: '#000000' });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0.6, 0.07, 0.301);
    scene.add(screenMesh);

    // Animation Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update Physics
      const engine = engineRef.current;
      engine.update(dt);
      const state = engine.getState();

      // Update Ball Position (1.2m is top, 0.2m is bottom)
      if (ballMeshRef.current) {
        ballMeshRef.current.position.y = 1.2 - state.y;
      }

      // Check Gate E hit
      if (state.y >= gateEPos && timeERef.current === null && state.isDropping) {
        timeERef.current = state.t;
        setTimeE(state.t);
        if (beamEMeshRef.current) {
          (beamEMeshRef.current.material as THREE.MeshBasicMaterial).color.set('#38bdf8');
        }
      }

      // Check Gate F hit
      if (state.y >= gateFPos && timeFRef.current === null && state.isDropping) {
        timeFRef.current = state.t;
        setTimeF(state.t);
        if (beamFMeshRef.current) {
          (beamFMeshRef.current.material as THREE.MeshBasicMaterial).color.set('#f43f5e');
        }
      }

      setIsDropping(state.isDropping);
      controls.update();
      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Resize handler
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
  }, [labMode]);

  // Update Gate Positions in 3D Space
  useEffect(() => {
    if (gateEMeshRef.current) {
      gateEMeshRef.current.position.set(0, 1.2 - gateEPos, 0);
    }
    if (gateFMeshRef.current) {
      gateFMeshRef.current.position.set(0, 1.2 - gateFPos, 0);
    }
  }, [gateEPos, gateFPos, labMode]);

  const handleStart = () => {
    engineRef.current.start();
  };

  const handleReset = () => {
    engineRef.current.reset();
    setTimeE(null);
    setTimeF(null);
    timeERef.current = null;
    timeFRef.current = null;
    if (ballMeshRef.current) ballMeshRef.current.position.y = 1.2;
    if (beamEMeshRef.current) (beamEMeshRef.current.material as THREE.MeshBasicMaterial).color.set('#3b82f6');
    if (beamFMeshRef.current) (beamFMeshRef.current.material as THREE.MeshBasicMaterial).color.set('#ef4444');
  };

  const handleRecord = () => {
    if (timeE !== null && timeF !== null) {
      const dt = timeF - timeE;
      const h = gateFPos - gateEPos;
      const gCalc = (2 * h) / (dt * dt);
      setMeasurements((prev) => [...prev, { h, dt, g: gCalc }]);
    }
  };

  const dt = timeF !== null && timeE !== null ? timeF - timeE : null;
  const gCalc = dt !== null ? (2 * (gateFPos - gateEPos)) / (dt * dt) : null;

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Left 70%: 3D Canvas / PhET Embed Viewport */}
      <div className="w-[70%] h-full relative">
        {/* Lab Mode Toggle Header */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700/60 shadow-xl">
          <button
            onClick={() => setLabMode('3d')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              labMode === '3d'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧊 3D WebGL Virtual Lab
          </button>
          <button
            onClick={() => setLabMode('phet')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              labMode === 'phet'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 PhET Simulation (Chính Hãng)
          </button>
        </div>

        {/* Mode 1: 3D Three.js Viewport */}
        {labMode === '3d' && (
          <div className="w-full h-full relative" ref={mountRef}>
            <div className="absolute bottom-4 left-4 pointer-events-none text-slate-400 text-xs bg-slate-900/70 p-2 rounded-lg border border-slate-800">
              💡 Bấm giữ chuột trái để xoay 3D | Cuộn chuột để Phóng to/Thu nhỏ
            </div>
          </div>
        )}

        {/* Mode 2: PhET Embed Simulation */}
        {labMode === 'phet' && (
          <div className="w-full h-full bg-black flex flex-col">
            <iframe
              src="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_all.html"
              title="PhET Physics Simulation"
              className="w-full h-full border-none"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Right 30%: Control Panel */}
      <div className="w-[30%] h-full bg-slate-900 border-l border-slate-800 flex flex-col z-10 shadow-2xl">
        {/* Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <button
            onClick={() => navigate('/thu-vien')}
            className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            ← Thoát
          </button>
          <span className="text-xs font-black tracking-widest text-slate-400 uppercase">VisualLab 3D</span>
          <button
            onClick={() => setIsScreenshotOpen(true)}
            className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold hover:bg-emerald-600/30 transition-colors"
          >
            📸 Lưu kho
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Digital Timer Panel */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                📟 ĐỒNG HỒ ĐO THỜI GIAN HIỆN SỐ
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-blue-400 font-bold">CỔNG E (t₁)</span>
                <span className="text-lg font-black text-blue-300">
                  {timeE !== null ? timeE.toFixed(4) : '0.0000'} <span className="text-xs font-normal">s</span>
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-red-400 font-bold">CỔNG F (t₂)</span>
                <span className="text-lg font-black text-red-300">
                  {timeF !== null ? timeF.toFixed(4) : '0.0000'} <span className="text-xs font-normal">s</span>
                </span>
              </div>

              <div className="flex justify-between items-center bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/30 mt-2">
                <span className="text-xs text-yellow-400 font-black">Δt (Thời gian rơi)</span>
                <span className="text-xl font-black text-yellow-300">
                  {dt !== null ? dt.toFixed(4) : '---'} <span className="text-xs font-normal">s</span>
                </span>
              </div>
            </div>
          </div>

          {/* Photogate Distance Sliders */}
          {labMode === '3d' && (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                📏 Điều Chỉnh Vị Trí Cổng Quang
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

              <div className="text-xs text-slate-400 font-bold bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                Khoảng cách Δs = {((gateFPos - gateEPos) * 100).toFixed(0)} cm
              </div>
            </div>
          )}

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
              ⚡ Thả Bi
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3.5 rounded-xl font-black text-sm active:scale-95 transition-all border border-slate-700"
            >
              🔄 Làm Lại
            </button>
          </div>

          {/* Measurement Table */}
          {measurements.length > 0 && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-400">
                📊 Bảng Số Liệu Lần Đo ({measurements.length})
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-right">Δs (m)</th>
                    <th className="px-3 py-2 text-right">Δt (s)</th>
                    <th className="px-3 py-2 text-right text-emerald-400">g (m/s²)</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((m, i) => (
                    <tr key={i} className="border-b border-slate-900">
                      <td className="px-3 py-1.5 text-slate-500">{i + 1}</td>
                      <td className="px-3 py-1.5 text-right font-mono">{m.h.toFixed(2)}</td>
                      <td className="px-3 py-1.5 text-right font-mono">{m.dt.toFixed(4)}</td>
                      <td className="px-3 py-1.5 text-right font-mono text-emerald-400 font-bold">{m.g.toFixed(3)}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-950/30">
                    <td colSpan={3} className="px-3 py-2 font-bold text-emerald-400">g̅ Trung bình</td>
                    <td className="px-3 py-2 text-right font-mono font-black text-emerald-300">
                      {(measurements.reduce((s, m) => s + m.g, 0) / measurements.length).toFixed(3)}
                    </td>
                  </tr>
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
          labTitle="Đo Gia Tốc Rơi Tự Do 3D"
          difficulty="DỄ"
          onClose={() => setIsScreenshotOpen(false)}
        />
      )}
    </div>
  );
};
