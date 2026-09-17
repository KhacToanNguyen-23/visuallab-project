import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface InductionWorkbench3DHandle {
  getCanvasDataURL: () => string;
}

interface InductionWorkbench3DProps {
  turnCountN: number; // 100, 200, 400
  pole: 'N-S' | 'S-N'; // N facing coil (left) or S facing coil (left)
  magnetX: number; // Current magnet X position (-3.0 to 3.0)
  onMagnetXChange: (newX: number, velocity: number) => void;
  instantEmfMv: number;
  instantCurrentMa: number;
  isAutoMoving: boolean;
}

export const InductionWorkbench3D = forwardRef<InductionWorkbench3DHandle, InductionWorkbench3DProps>(({
  turnCountN,
  pole,
  magnetX,
  onMagnetXChange,
  instantEmfMv,
  instantCurrentMa,
  isAutoMoving,
}, ref) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Dynamic references
  const magnetXRef = useRef<number>(magnetX);
  const poleRef = useRef<'N-S' | 'S-N'>(pole);
  const turnCountNRef = useRef<number>(turnCountN);
  const instantCurrentMaRef = useRef<number>(instantCurrentMa);
  const isAutoMovingRef = useRef<boolean>(isAutoMoving);

  magnetXRef.current = magnetX;
  poleRef.current = pole;
  turnCountNRef.current = turnCountN;
  instantCurrentMaRef.current = instantCurrentMa;
  isAutoMovingRef.current = isAutoMoving;

  // 3D Object Refs
  const magnetMeshRef = useRef<THREE.Group | null>(null);
  const coilGroupRef = useRef<THREE.Group | null>(null);
  const fieldLinesGroupRef = useRef<THREE.Group | null>(null);
  const bulbMeshRef = useRef<THREE.Mesh | null>(null);
  const bulbLightRef = useRef<THREE.PointLight | null>(null);
  const galvanometerNeedleRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Dragging state
  const isMouseDownRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; time: number }>({ x: 0, time: 0 });

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
      cameraRef.current.position.set(0, 3.2, 5.8);
      controlsRef.current.target.set(0, 0.2, 0);
      controlsRef.current.update();
    }
  }, []);

  // Build Solenoid Coil based on Turn Count
  const buildCoil = (group: THREE.Group, turns: number) => {
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    // Solenoid cylinder core (acrylic/glass support tube)
    const coreGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.2, 32, 1, true);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.z = Math.PI / 2;
    group.add(core);

    // Copper winding rings
    const ringGeo = new THREE.TorusGeometry(0.88, 0.035, 16, 48);
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Rich copper
      metalness: 0.85,
      roughness: 0.25,
    });

    const displayRings = Math.min(36, Math.max(12, Math.floor(turns / 10)));
    const startX = -0.95;
    const endX = 0.95;
    const stepX = (endX - startX) / (displayRings - 1);

    for (let i = 0; i < displayRings; i++) {
      const ring = new THREE.Mesh(ringGeo, copperMat);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(startX + i * stepX, 0, 0);
      group.add(ring);
    }

    // Terminal connection posts
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.9 });
    const post1 = new THREE.Mesh(postGeo, postMat);
    post1.position.set(-0.8, -1.0, 0.5);
    group.add(post1);

    const postMat2 = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    const post2 = new THREE.Mesh(postGeo, postMat2);
    post2.position.set(0.8, -1.0, 0.5);
    group.add(post2);
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    mount.innerHTML = '';

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a101d);
    sceneRef.current = scene;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.8);
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
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight1.position.set(6, 8, 6);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0);
    dirLight2.position.set(-6, 5, -4);
    scene.add(dirLight2);

    // 5. Workbench Mat
    const deskGeo = new THREE.BoxGeometry(10, 0.25, 6.5);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 });
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.set(0, -1.2, 0);
    scene.add(deskMesh);

    const gridHelper = new THREE.GridHelper(8, 16, 0x0284c7, 0x1e293b);
    gridHelper.position.set(0, -1.07, 0);
    scene.add(gridHelper);

    // Track guide rail for magnet
    const railGeo = new THREE.BoxGeometry(8, 0.06, 0.4);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(0, -0.95, 0);
    scene.add(railMesh);

    // 6. Solenoid Coil Group
    const coilGroup = new THREE.Group();
    coilGroup.position.set(0, 0, 0);
    scene.add(coilGroup);
    coilGroupRef.current = coilGroup;
    buildCoil(coilGroup, turnCountN);

    // 7. 3D Bar Magnet Group
    const magnetGroup = new THREE.Group();
    magnetGroup.position.set(magnetX, 0, 0);
    scene.add(magnetGroup);
    magnetMeshRef.current = magnetGroup;

    // North Pole (Red)
    const northGeo = new THREE.BoxGeometry(1.0, 0.65, 0.65);
    const northMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.3, roughness: 0.3 });
    const northMesh = new THREE.Mesh(northGeo, northMat);
    northMesh.position.set(-0.5, 0, 0);
    magnetGroup.add(northMesh);

    // South Pole (Blue)
    const southGeo = new THREE.BoxGeometry(1.0, 0.65, 0.65);
    const southMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.3, roughness: 0.3 });
    const southMesh = new THREE.Mesh(southGeo, southMat);
    southMesh.position.set(0.5, 0, 0);
    magnetGroup.add(southMesh);

    // 8. Magnetic Field Lines 3D
    const fieldGroup = new THREE.Group();
    magnetGroup.add(fieldGroup);
    fieldLinesGroupRef.current = fieldGroup;

    const lineMat = new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.45 });
    for (let r = 0.5; r <= 1.2; r += 0.35) {
      const curve = new THREE.EllipseCurve(0, 0, 1.4 * r, 0.9 * r, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
      const line = new THREE.Line(lineGeo, lineMat);
      fieldGroup.add(line);

      const line2 = new THREE.Line(lineGeo, lineMat);
      line2.rotation.x = Math.PI / 2;
      fieldGroup.add(line2);
    }

    // 9. LED Light Bulb in 3D
    const bulbGroup = new THREE.Group();
    bulbGroup.position.set(0, 1.6, 0);

    const bulbGlassGeo = new THREE.SphereGeometry(0.3, 24, 24);
    const bulbGlassMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.0,
    });
    const bulbGlass = new THREE.Mesh(bulbGlassGeo, bulbGlassMat);
    bulbGroup.add(bulbGlass);
    bulbMeshRef.current = bulbGlass;

    const bulbBaseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.25, 16);
    const bulbBaseMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const bulbBase = new THREE.Mesh(bulbBaseGeo, bulbBaseMat);
    bulbBase.position.set(0, -0.35, 0);
    bulbGroup.add(bulbBase);

    const bulbLight = new THREE.PointLight(0xfacc15, 0, 4);
    bulbLight.position.set(0, 0, 0);
    bulbGroup.add(bulbLight);
    bulbLightRef.current = bulbLight;

    scene.add(bulbGroup);

    // 10. Analog Galvanometer 3D Stand (at right side of desk)
    const meterStandGroup = new THREE.Group();
    meterStandGroup.position.set(2.8, -0.2, 0);

    // Outer Meter Box
    const boxGeo = new THREE.BoxGeometry(1.6, 1.6, 0.5);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.3 });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    meterStandGroup.add(boxMesh);

    // Meter Face Dial
    const dialGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const dialMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.position.set(0, 0, 0.26);
    meterStandGroup.add(dialMesh);

    // Meter Needle
    const needleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.65, 8);
    const needleMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const needleMesh = new THREE.Mesh(needleGeo, needleMat);
    needleMesh.position.set(0, 0.3, 0.28);
    needleMesh.geometry.translate(0, 0.3, 0); // Pivot at base
    meterStandGroup.add(needleMesh);
    galvanometerNeedleRef.current = needleMesh;

    // Pivot center cap
    const capGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
    const capMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.rotation.x = Math.PI / 2;
    capMesh.position.set(0, 0.3, 0.3);
    meterStandGroup.add(capMesh);

    scene.add(meterStandGroup);

    // 11. 60 FPS Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      controls.update();

      // Update Magnet Position & Pole orientation
      if (magnetMeshRef.current) {
        magnetMeshRef.current.position.x = magnetXRef.current;
        // If pole is S-N, flip magnet 180 degrees
        magnetMeshRef.current.rotation.y = poleRef.current === 'S-N' ? Math.PI : 0;
      }

      // Update Galvanometer needle rotation: -50mA to +50mA -> -45 deg to +45 deg
      const current = instantCurrentMaRef.current;
      if (galvanometerNeedleRef.current) {
        const angleRad = -(current / 50.0) * (Math.PI / 4.0);
        const clampedAngle = Math.max(-Math.PI / 3.5, Math.min(Math.PI / 3.5, angleRad));
        // Smooth damp needle
        galvanometerNeedleRef.current.rotation.z += (clampedAngle - galvanometerNeedleRef.current.rotation.z) * 0.25;
      }

      // Update LED Bulb glow intensity
      const currentMag = Math.abs(current);
      const intensity = Math.min(2.5, currentMag / 15.0);
      if (bulbMeshRef.current) {
        (bulbMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
      }
      if (bulbLightRef.current) {
        bulbLightRef.current.intensity = intensity * 2.0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse Interaction for Dragging Magnet along X-axis
    const dom = renderer.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      if (isAutoMovingRef.current) return;
      const rect = dom.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const mouse = new THREE.Vector2(
        (clientX / rect.width) * 2 - 1,
        -(clientY / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      if (magnetMeshRef.current) {
        const intersects = raycaster.intersectObjects(magnetMeshRef.current.children, true);
        if (intersects.length > 0) {
          isMouseDownRef.current = true;
          setIsDragging(true);
          controls.enabled = false; // Disable OrbitControls while dragging
          lastMousePosRef.current = { x: magnetXRef.current, time: performance.now() };
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isMouseDownRef.current || isAutoMovingRef.current) return;

      const rect = dom.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const mouse = new THREE.Vector2(
        (clientX / rect.width) * 2 - 1,
        -(clientY / rect.height) * 2 + 1
      );

      // Raycast against ground/track plane (Y = 0)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint) {
        const clampedX = Math.max(-3.5, Math.min(3.5, intersectPoint.x));
        const now = performance.now();
        const dt = Math.max(0.016, (now - lastMousePosRef.current.time) / 1000.0);
        const dx = clampedX - lastMousePosRef.current.x;
        const velocity = dx / dt; // m/s

        lastMousePosRef.current = { x: clampedX, time: now };
        onMagnetXChange(clampedX, velocity);
      }
    };

    const handlePointerUp = () => {
      if (isMouseDownRef.current) {
        isMouseDownRef.current = false;
        setIsDragging(false);
        controls.enabled = true; // Re-enable OrbitControls
        onMagnetXChange(magnetXRef.current, 0); // zero velocity
      }
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

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
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.innerHTML = '';
        rendererRef.current.dispose();
      }
    };
  }, [onMagnetXChange]);

  // Re-build coil if turn count changes
  useEffect(() => {
    if (coilGroupRef.current) {
      buildCoil(coilGroupRef.current, turnCountN);
    }
  }, [turnCountN]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className={`w-full h-full ${isDragging ? 'cursor-ew-resize' : 'cursor-grab active:cursor-grabbing'}`} />

      {/* Top Left Title & Status Badge */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 flex items-center space-x-2 shadow-lg z-10 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-200">
          Studio 3D Cảm Ứng Điện Từ (Faraday - Lenz)
        </span>
      </div>

      {/* Top Right Digital Readout & Galvanometer Dial Badge */}
      <div className="absolute top-3 right-3 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3.5 shadow-2xl z-10 min-w-[210px]">
        <div className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider text-right mb-1 flex items-center justify-between">
          <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[9px]">GALVANOMETER</span>
          <span>SUẤT ĐIỆN ĐỘNG e_c</span>
        </div>

        <div className="flex items-baseline justify-end space-x-1.5">
          <span className={`text-3xl font-mono font-extrabold tracking-tight ${
            instantEmfMv > 0.5 ? 'text-emerald-400' : instantEmfMv < -0.5 ? 'text-rose-400' : 'text-slate-300'
          }`}>
            {instantEmfMv > 0 ? `+${instantEmfMv.toFixed(1)}` : instantEmfMv.toFixed(1)}
          </span>
          <span className="text-sm font-mono text-cyan-300 font-bold">mV</span>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Dòng I_c: <b className="text-amber-300">{instantCurrentMa > 0 ? `+${instantCurrentMa.toFixed(2)}` : instantCurrentMa.toFixed(2)} mA</b></span>
          <span>•</span>
          <span>Cuộn: <b className="text-sky-300">{turnCountN} vòng</b></span>
        </div>
      </div>

      {/* Dragging Help Indicator */}
      <div className="absolute top-14 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1 text-[11px] text-slate-300 flex items-center space-x-1.5">
        <span>🧲</span>
        <span>Kéo giữ thanh nam châm để di chuyển tự do qua cuộn dây</span>
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

InductionWorkbench3D.displayName = 'InductionWorkbench3D';
