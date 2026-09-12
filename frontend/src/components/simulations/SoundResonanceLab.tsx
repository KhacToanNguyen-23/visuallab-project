import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export const SoundResonanceLab: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Physics & Sound parameters
  const [frequency, setFrequency] = useState<number>(500); // Hz (100 - 2000)
  const [waterLevel, setWaterLevel] = useState<number>(17); // cm from top (0 - 100cm)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  // Measurements
  const [l1, setL1] = useState<number | null>(null);
  const [l2, setL2] = useState<number | null>(null);
  const [calculatedV, setCalculatedV] = useState<number | null>(null);

  // WebGL & Web Audio Refs
  const mountRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Calculate wavelength lambda = v / f (v_sound ~ 340 m/s)
  const trueSpeedOfSound = 340; // m/s
  const lambda = (trueSpeedOfSound / frequency) * 100; // cm
  const quarterLambda = lambda / 4; // L1 approx
  const threeQuarterLambda = (3 * lambda) / 4; // L2 approx

  // Calculate resonance amplitude (peak when waterLevel matches quarterLambda or threeQuarterLambda)
  const distL1 = Math.abs(waterLevel - quarterLambda);
  const distL2 = Math.abs(waterLevel - threeQuarterLambda);
  const minDist = Math.min(distL1, distL2);
  const isResonating = minDist < 2.5; // Within 2.5cm of resonance peak
  const resonanceIntensity = Math.max(0.1, 1 - minDist / 10);

  // Web Audio API Synthesis
  useEffect(() => {
    if (!isPlayingAudio) {
      if (oscNodeRef.current) {
        oscNodeRef.current.stop();
        oscNodeRef.current.disconnect();
        oscNodeRef.current = null;
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
      const gainNode = ctx.createGain();
      const oscNode = ctx.createOscillator();

      oscNode.type = 'sine';
      oscNode.frequency.setValueAtTime(frequency, ctx.currentTime);

      const effectiveGain = volume * resonanceIntensity;
      gainNode.gain.setValueAtTime(effectiveGain, ctx.currentTime);

      oscNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscNode.start();

      oscNodeRef.current = oscNode;
      gainNodeRef.current = gainNode;
    } catch (e) {
      console.warn('Audio Context initialization deferred:', e);
    }

    return () => {
      if (oscNodeRef.current) {
        try {
          oscNodeRef.current.stop();
          oscNodeRef.current.disconnect();
        } catch (_) {}
        oscNodeRef.current = null;
      }
    };
  }, [isPlayingAudio, frequency, volume, resonanceIntensity]);

  // Update frequency or gain dynamically
  useEffect(() => {
    if (audioCtxRef.current && oscNodeRef.current && isPlayingAudio) {
      oscNodeRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    }
  }, [frequency, isPlayingAudio]);

  useEffect(() => {
    if (audioCtxRef.current && gainNodeRef.current && isPlayingAudio) {
      const effectiveGain = volume * resonanceIntensity;
      gainNodeRef.current.gain.setValueAtTime(effectiveGain, audioCtxRef.current.currentTime);
    }
  }, [volume, resonanceIntensity, isPlayingAudio]);

  // Three.js 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === 'dark' ? 0x0f172a : 0xf8fafc);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 30, 90);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 50, 30);
    scene.add(dirLight);

    // Glass Outer Tube (Ống thủy tinh)
    const glassGeo = new THREE.CylinderGeometry(4, 4, 60, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      side: THREE.DoubleSide,
      ...({ transmission: 0.9, thickness: 1.2 } as any),
    });
    const glassTube = new THREE.Mesh(glassGeo, glassMat);
    scene.add(glassTube);

    // Speaker Top (Loa phát âm thanh)
    const speakerGeo = new THREE.CylinderGeometry(5, 3, 6, 32);
    const speakerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const speakerMesh = new THREE.Mesh(speakerGeo, speakerMat);
    speakerMesh.position.set(0, 33, 0);
    scene.add(speakerMesh);

    // Speaker Cone detail
    const coneGeo = new THREE.ConeGeometry(3.5, 3, 32);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.set(0, 30, 0);
    coneMesh.rotation.x = Math.PI;
    scene.add(coneMesh);

    // Water Column (Mực nước bên trong ống)
    // Glass height is 60 units (representing 100cm tube)
    const waterHeightUnits = Math.max(0.1, (100 - waterLevel) * 0.6);
    const waterGeo = new THREE.CylinderGeometry(3.8, 3.8, waterHeightUnits, 32);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.7 });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -30 + waterHeightUnits / 2, 0);
    scene.add(waterMesh);

    // Water Surface Disc
    const discGeo = new THREE.CircleGeometry(3.8, 32);
    const discMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.rotation.x = Math.PI / 2;
    discMesh.position.set(0, -30 + waterHeightUnits, 0);
    scene.add(discMesh);

    // Sound Waves Visual Rings (Ring ripples when resonating)
    const waveRings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.RingGeometry(0.5, 1, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 28 - i * 6, 0);
      scene.add(ring);
      waveRings.push(ring);
    }

    // Render animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Animate Sound Wave Rings if playing
      waveRings.forEach((ring, idx) => {
        if (isPlayingAudio) {
          const speed = isResonating ? 4 : 2;
          const scale = 1 + ((time * speed + idx * 0.5) % 3);
          ring.scale.set(scale, scale, 1);
          (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scale / 4) * (isResonating ? 1 : 0.4);
        } else {
          (ring.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      });

      // Subtle Speaker pulse when resonating
      if (isResonating && isPlayingAudio) {
        speakerMesh.scale.set(1 + Math.sin(time * 30) * 0.03, 1, 1 + Math.sin(time * 30) * 0.03);
      } else {
        speakerMesh.scale.set(1, 1, 1);
      }

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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [waterLevel, isPlayingAudio, isResonating, theme]);

  // Mark L1 & L2 points
  const handleMarkL1 = () => {
    setL1(waterLevel);
  };

  const handleMarkL2 = () => {
    setL2(waterLevel);
  };

  // Calculate speed of sound v = 2 * (L2 - L1) * f
  useEffect(() => {
    if (l1 !== null && l2 !== null && l2 > l1) {
      const deltaLMeters = (l2 - l1) / 100; // Convert cm to meters
      const v = 2 * deltaLMeters * frequency;
      setCalculatedV(parseFloat(v.toFixed(1)));
    }
  }, [l1, l2, frequency]);

  return (
    <div className="w-screen h-screen flex flex-col font-sans overflow-hidden select-none" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Header Bar */}
      <header className="h-16 px-6 border-b shrink-0 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/thu-vien')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer hover:opacity-80 flex items-center gap-1"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
          >
            <span>← Quay lại Thư viện</span>
          </button>

          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tight">Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng)</h1>
            <span className="text-[10px] opacity-70">Vật lý Lớp 11 — SGK Kết nối tri thức (Trang 22)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
          >
            {theme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng'}
          </button>

          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer ${
              isPlayingAudio ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isPlayingAudio ? 'Tắt Máy Phát Tần Số' : 'Bật Máy Phát Tần Số'}
          </button>
        </div>
      </header>

      {/* Main Viewport Workspace - NO SCROLL FIT TO SCREEN */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: 3D Three.js Viewport */}
        <div className="flex-1 h-full relative" ref={mountRef}>
          {/* Audio Resonance Status Indicator */}
          <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-xl border shadow-xs text-xs font-semibold backdrop-blur-md" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlayingAudio ? (isResonating ? 'bg-emerald-500 animate-ping' : 'bg-blue-500') : 'bg-slate-400'}`}></span>
              <span>Trạng thái Âm thanh:</span>
              <span className="font-bold text-blue-500">
                {!isPlayingAudio ? 'Đã tắt' : isResonating ? 'CỘNG HƯỞNG ÂM (Cực đại)' : 'Đang phát sóng bình thường'}
              </span>
            </div>
          </div>

          {/* Interactive Water Column Height Overlay Indicator */}
          <div className="absolute bottom-4 left-4 z-10 px-4 py-2 rounded-xl border shadow-xs text-xs font-mono" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <div>Cột không khí: L = <span className="font-bold text-blue-500">{waterLevel} cm</span></div>
            <div>Bước sóng lý thuyết λ: <span className="font-bold text-emerald-500">{lambda.toFixed(1)} cm</span></div>
          </div>
        </div>

        {/* Right: Control Sidebar Panel - Fixed No-Scroll */}
        <aside className="w-84 h-full border-l p-6 flex flex-col justify-between overflow-hidden shrink-0" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <div className="space-y-6">
            <div className="border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-bold text-sm uppercase tracking-wider">Điều Khiển Tần Số & Mực Nước</h3>
              <p className="text-xs opacity-70 mt-0.5">Khảo sát điểm cộng hưởng âm L1 và L2</p>
            </div>

            {/* Frequency Control Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Tần số sóng âm (f):</span>
                <span className="text-blue-500 font-mono text-sm">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min={200}
                max={1000}
                step={10}
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] opacity-60 font-mono">
                <span>200 Hz</span>
                <span>500 Hz</span>
                <span>1000 Hz</span>
              </div>
            </div>

            {/* Water Column Height Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Chiều dài cột không khí (L):</span>
                <span className="text-emerald-500 font-mono text-sm">{waterLevel} cm</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={1}
                value={waterLevel}
                onChange={(e) => setWaterLevel(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] opacity-60 font-mono">
                <span>0 cm (Đầy nước)</span>
                <span>45 cm</span>
                <span>90 cm</span>
              </div>
            </div>

            {/* Volume Control Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Âm lượng Loa:</span>
                <span className="font-mono text-xs">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 appearance-none cursor-pointer"
              />
            </div>

            {/* Mark Resonance Points */}
            <div className="space-y-3 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-xs font-bold opacity-90">Đánh dấu Điểm Cộng Hưởng:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleMarkL1}
                  className="py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer hover:bg-blue-600 hover:text-white"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                >
                  Đánh dấu L1 ({l1 !== null ? `${l1}cm` : 'Chưa chọn'})
                </button>
                <button
                  onClick={handleMarkL2}
                  className="py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer hover:bg-emerald-600 hover:text-white"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                >
                  Đánh dấu L2 ({l2 !== null ? `${l2}cm` : 'Chưa chọn'})
                </button>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-500 border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
              Kết Quả Đo Tốc Độ Truyền Âm
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="opacity-70">L2 - L1 = λ/2:</span>
                <span className="font-bold">{l1 !== null && l2 !== null ? `${(l2 - l1).toFixed(1)} cm` : '---'}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Bước sóng λ = 2(L2 - L1):</span>
                <span className="font-bold text-emerald-500">{l1 !== null && l2 !== null ? `${((l2 - l1) * 2).toFixed(1)} cm` : '---'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t text-sm font-bold" style={{ borderColor: 'var(--border-color)' }}>
                <span>Tốc độ truyền âm v:</span>
                <span className="text-blue-500">{calculatedV !== null ? `${calculatedV} m/s` : '--- m/s'}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SoundResonanceLab;
