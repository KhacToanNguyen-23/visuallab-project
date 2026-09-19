import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface MomentumWorkbench3DHandle {
  getCanvasDataURL: () => string;
}

interface MomentumWorkbench3DProps {
  m1G: number;
  m2G: number;
  collisionType: 'elastic' | 'inelastic';
  springForce: number; // 0.5 to 2.0 m/s launch speed
  car1X: number; // position on track (-2.5 to 2.5)
  car2X: number; // position on track (-2.5 to 2.5)
  dt1: number; // photogate 1 transit time (s)
  dt2: number; // photogate 2 transit time (s)
  isLaunched: boolean;
}

export const MomentumWorkbench3D = forwardRef<MomentumWorkbench3DHandle, MomentumWorkbench3DProps>(({
  m1G,
  m2G,
  collisionType,
  springForce: _springForce,
  car1X,
  car2X,
  dt1,
  dt2,
  isLaunched: _isLaunched,
}, ref) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Dynamic values
  const car1XRef = useRef<number>(car1X);
  const car2XRef = useRef<number>(car2X);
  const m1GRef = useRef<number>(m1G);
  const m2GRef = useRef<number>(m2G);
  const collisionTypeRef = useRef<'elastic' | 'inelastic'>(collisionType);
  const dt1Ref = useRef<number>(dt1);
  const dt2Ref = useRef<number>(dt2);

  car1XRef.current = car1X;
  car2XRef.current = car2X;
  m1GRef.current = m1G;
  m2GRef.current = m2G;
  collisionTypeRef.current = collisionType;
  dt1Ref.current = dt1;
  dt2Ref.current = dt2;

  // 3D Object Refs
  const car1MeshRef = useRef<THREE.Group | null>(null);
  const car2MeshRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    getCanvasDataURL: () => {
      if (rendererRef.current) {
        return rendererRef.current.domElement.toDataURL('image/png');
      }
      return '';
    },
  }));

  const handleResetCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 3.4, 5.8);
      controlsRef.current.target.set(0, 0.1, 0);
      controlsRef.current.update();
    }
  }, []);

  // Build Glider 3D mesh
  const createGlider = (colorHex: number, label: string) => {
    const gliderGroup = new THREE.Group();

    // Body (Inverted V-shape or hollow aluminum block)
    const bodyGeo = new THREE.BoxGeometry(0.7, 0.35, 0.45);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.8,
      roughness: 0.25,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.set(0, 0.25, 0);
    bodyMesh.castShadow = true;
    gliderGroup.add(bodyMesh);

    // Photogate Flag (Tấm chắn sáng d = 2cm)
    const flagGeo = new THREE.BoxGeometry(0.12, 0.45, 0.02);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(0, 0.65, 0);
    gliderGroup.add(flagMesh);

    // Bumper / Spring tip or Inelastic Velcro tip
    const bumperGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 16);
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
    const bumperFront = new THREE.Mesh(bumperGeo, bumperMat);
    bumperFront.rotation.z = Math.PI / 2;
    bumperFront.position.set(0.38, 0.25, 0);
    gliderGroup.add(bumperFront);

    const bumperBack = new THREE.Mesh(bumperGeo, bumperMat);
    bumperBack.rotation.z = Math.PI / 2;
    bumperBack.position.set(-0.38, 0.25, 0);
    gliderGroup.add(bumperBack);

    // Additional weight discs on top
    const discGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 24);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.1 });
    const disc1 = new THREE.Mesh(discGeo, discMat);
    disc1.position.set(-0.16, 0.45, 0);
    gliderGroup.add(disc1);

    const disc2 = new THREE.Mesh(discGeo, discMat);
    disc2.position.set(0.16, 0.45, 0);
    gliderGroup.add(disc2);

    gliderGroup.name = label;
    return gliderGroup;
  };

  // Build Photogate Sensor 3D
  const createPhotogate = (xPos: number, label: string) => {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(xPos, 0, 0);

    // U-shaped bracket
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.3 });
    const pole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16), poleMat);
    pole1.position.set(0, 0.6, -0.4);
    gateGroup.add(pole1);

    const pole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16), poleMat);
    pole2.position.set(0, 0.6, 0.4);
    gateGroup.add(pole2);

    const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.88), poleMat);
    topBar.position.set(0, 1.18, 0);
    gateGroup.add(topBar);

    // Infrared Beam Visual Line
    const beamGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.8, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.85 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.x = Math.PI / 2;
    beam.position.set(0, 0.65, 0);
    gateGroup.add(beam);

    // Sensor Badge
    const badgeGeo = new THREE.BoxGeometry(0.2, 0.15, 0.05);
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0, 1.28, 0);
    gateGroup.add(badge);

    gateGroup.name = label;
    return gateGroup;
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    mount.innerHTML = '';

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a101d);

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 5.8);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 12;
    controls.target.set(0, 0.1, 0);
    controlsRef.current = controls;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.7);
    dirLight1.position.set(6, 8, 6);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.1);
    dirLight2.position.set(-6, 6, -4);
    scene.add(dirLight2);

    // 5. Workbench Table Mat
    const tableGeo = new THREE.BoxGeometry(10, 0.25, 6.5);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.set(0, -1.2, 0);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    const gridHelper = new THREE.GridHelper(8, 16, 0x0284c7, 0x1e293b);
    gridHelper.position.set(0, -1.07, 0);
    scene.add(gridHelper);

    // 6. Air Track 3D (Máng đệm không khí nhôm phay)
    const trackGroup = new THREE.Group();

    // Aluminum Rail Beam
    const railGeo = new THREE.BoxGeometry(6.6, 0.22, 0.55);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2,
    });
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(0, 0, 0);
    railMesh.castShadow = true;
    trackGroup.add(railMesh);

    // Air Holes along track
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const holeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 8);
    for (let x = -3.0; x <= 3.0; x += 0.2) {
      const h1 = new THREE.Mesh(holeGeo, holeMat);
      h1.position.set(x, 0.111, -0.15);
      trackGroup.add(h1);
      const h2 = new THREE.Mesh(holeGeo, holeMat);
      h2.position.set(x, 0.111, 0.15);
      trackGroup.add(h2);
    }

    // Support legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.95, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
    const leg1 = new THREE.Mesh(legGeo, legMat);
    leg1.position.set(-2.6, -0.55, 0);
    trackGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, legMat);
    leg2.position.set(2.6, -0.55, 0);
    trackGroup.add(leg2);

    // Spring Launcher at left end of track
    const springBaseGeo = new THREE.BoxGeometry(0.4, 0.35, 0.5);
    const springBaseMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6 });
    const springBase = new THREE.Mesh(springBaseGeo, springBaseMat);
    springBase.position.set(-3.2, 0.12, 0);
    trackGroup.add(springBase);

    // Spring coil
    const springCoilGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16);
    const springCoilMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 });
    const springCoil = new THREE.Mesh(springCoilGeo, springCoilMat);
    springCoil.rotation.z = Math.PI / 2;
    springCoil.position.set(-2.9, 0.15, 0);
    trackGroup.add(springCoil);

    scene.add(trackGroup);

    // 7. Photogates (Cổng quang điện S1 tại x = -0.6m, S2 tại x = 1.2m)
    const gate1 = createPhotogate(-0.6, 'Photogate 1');
    scene.add(gate1);
    const gate2 = createPhotogate(1.2, 'Photogate 2');
    scene.add(gate2);

    // 8. Tabletop Digital Timer 3D (Đồng hồ hiện số 2 kênh đặt trên bàn)
    const timerStand = new THREE.Group();
    timerStand.position.set(2.4, -0.4, -1.2);

    // Housing Box
    const timerBoxGeo = new THREE.BoxGeometry(1.8, 0.9, 0.5);
    const timerBoxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.3 });
    const timerBox = new THREE.Mesh(timerBoxGeo, timerBoxMat);
    timerStand.add(timerBox);

    // Two 7-segment LED Display Windows
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const ledWindow1 = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.35), ledMat);
    ledWindow1.position.set(-0.42, 0.08, 0.26);
    timerStand.add(ledWindow1);

    const ledWindow2 = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.35), ledMat);
    ledWindow2.position.set(0.42, 0.08, 0.26);
    timerStand.add(ledWindow2);

    scene.add(timerStand);

    // 9. Gliders (Xe 1 Đỏ, Xe 2 Xanh)
    const car1 = createGlider(0xef4444, 'Glider 1 (Red)');
    car1.position.set(car1XRef.current, 0, 0);
    scene.add(car1);
    car1MeshRef.current = car1;

    const car2 = createGlider(0x3b82f6, 'Glider 2 (Blue)');
    car2.position.set(car2XRef.current, 0, 0);
    scene.add(car2);
    car2MeshRef.current = car2;

    // 10. 60 FPS Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      controls.update();

      // Update Glider Positions
      if (car1MeshRef.current) {
        car1MeshRef.current.position.x = car1XRef.current;
      }
      if (car2MeshRef.current) {
        car2MeshRef.current.position.x = car2XRef.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.innerHTML = '';
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Title & Status Badge */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 flex items-center space-x-2 shadow-lg z-10 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-200">
          Máng Đệm Không Khí 3D (Bảo Toàn Động Lượng)
        </span>
      </div>

      {/* Top Right Digital Timer HUD Readout (Kênh 1 & Kênh 2) */}
      <div className="absolute top-3 right-3 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3.5 shadow-2xl z-10 min-w-[220px]">
        <div className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider text-right mb-1.5 flex items-center justify-between">
          <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[9px]">ĐỒNG HỒ HIỆN SỐ 3D</span>
          <span>ĐỘ PHÂN GIẢI 0.001s</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Gate 1 */}
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Cổng S1 (Δt₁)</span>
            <span className="text-lg font-mono font-bold text-rose-400">
              {dt1 > 0 ? `${dt1.toFixed(4)}s` : '0.0000s'}
            </span>
          </div>

          {/* Gate 2 */}
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Cổng S2 (Δt₂)</span>
            <span className="text-lg font-mono font-bold text-sky-400">
              {dt2 > 0 ? `${dt2.toFixed(4)}s` : '0.0000s'}
            </span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>m₁ = <b className="text-rose-400">{m1G}g</b></span>
          <span>•</span>
          <span>m₂ = <b className="text-sky-400">{m2G}g</b></span>
          <span>•</span>
          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
            {collisionType === 'elastic' ? 'Đàn hồi' : 'Va chạm mềm'}
          </span>
        </div>
      </div>

      {/* Bottom Floating Control Shortcuts */}
      <div className="absolute bottom-3 left-3 flex items-center space-x-2 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
          🖱️ Kéo chuột trái xoay 360° • Cuộn zoom
        </div>
        <button
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.autoRotate = !autoRotate;
              setAutoRotate(!autoRotate);
            }
          }}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer flex items-center space-x-1 ${
            autoRotate
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span>🔄 Xoay Tự Động</span>
        </button>
        <button
          onClick={handleResetCamera}
          className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 text-[11px] font-semibold transition cursor-pointer"
        >
          🎯 Góc Mặc Định
        </button>
      </div>
    </div>
  );
});

MomentumWorkbench3D.displayName = 'MomentumWorkbench3D';
