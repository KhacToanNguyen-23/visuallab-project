import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type SurfaceType = 'WOOD' | 'MICA' | 'RUBBER';

export interface SurfaceInfo {
  id: SurfaceType;
  name: string;
  mu: number;
  color: string;
  roughness: number;
}

export const SURFACE_MATERIALS: Record<SurfaceType, SurfaceInfo> = {
  WOOD: { id: 'WOOD', name: 'Mặt Gỗ Nhẵn', mu: 0.25, color: '#b45309', roughness: 0.6 },
  MICA: { id: 'MICA', name: 'Mặt Nhựa Mica', mu: 0.15, color: '#38bdf8', roughness: 0.15 },
  RUBBER: { id: 'RUBBER', name: 'Mặt Cao Su Nhám', mu: 0.45, color: '#1e293b', roughness: 0.9 },
};

export interface FrictionWorkbench3DHandle {
  getCanvasDataURL: () => string;
}

interface FrictionWorkbench3DProps {
  surface: SurfaceType;
  addedMassKg: number;
  blockMassKg?: number;
  isPulling: boolean;
  onPullStart?: () => void;
  onPullProgress?: (forceN: number, blockX: number) => void;
  onPullComplete?: (finalForceN: number) => void;
  showVectors?: boolean;
}

export const FrictionWorkbench3D = forwardRef<FrictionWorkbench3DHandle, FrictionWorkbench3DProps>(({
  surface,
  addedMassKg,
  blockMassKg = 0.2, // 200g base block
  isPulling,
  onPullProgress,
  onPullComplete,
  showVectors = true,
}, ref) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // 3D Object Group References
  const blockMeshRef = useRef<THREE.Mesh | null>(null);
  const weightsGroupRef = useRef<THREE.Group | null>(null);
  const dynamometerGroupRef = useRef<THREE.Group | null>(null);
  const pointerMeshRef = useRef<THREE.Mesh | null>(null);
  const stringLineRef = useRef<THREE.Line | null>(null);

  // Force Vector Arrow Helpers
  const arrowFpullRef = useRef<THREE.ArrowHelper | null>(null);
  const arrowFfricRef = useRef<THREE.ArrowHelper | null>(null);
  const arrowNormalRef = useRef<THREE.ArrowHelper | null>(null);
  const arrowGravityRef = useRef<THREE.ArrowHelper | null>(null);

  // Kinematic state
  const animFrameRef = useRef<number | null>(null);
  const blockXRef = useRef<number>(-3.0); // Start X position in Three.js units
  const currentForceRef = useRef<number>(0);

  const totalMass = blockMassKg + addedMassKg;
  const gravityG = 9.81;
  const normalForce = totalMass * gravityG;
  const surfaceInfo = SURFACE_MATERIALS[surface];
  const frictionForce = normalForce * surfaceInfo.mu;

  // Expose screenshot capture handle
  useImperativeHandle(ref, () => ({
    getCanvasDataURL: () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return rendererRef.current.domElement.toDataURL('image/png');
      }
      return '';
    },
  }));

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712'); // Dark slate background
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 7.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below floor
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.target.set(0, 0.8, 0);
    controls.update();
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight('#38bdf8', 0.4);
    fillLight.position.set(-5, 4, -5);
    scene.add(fillLight);

    // 6. Workbench Table Surface
    const tableGeo = new THREE.BoxGeometry(12, 0.4, 4);
    const tableMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.4,
      metalness: 0.2,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.set(0, -0.2, 0);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // Bench Grid Ruler Markings Line
    const rulerGeo = new THREE.PlaneGeometry(10, 0.3);
    const rulerCanvas = document.createElement('canvas');
    rulerCanvas.width = 1024;
    rulerCanvas.height = 64;
    const rCtx = rulerCanvas.getContext('2d');
    if (rCtx) {
      rCtx.fillStyle = '#1e293b';
      rCtx.fillRect(0, 0, 1024, 64);
      rCtx.fillStyle = '#94a3b8';
      rCtx.font = 'bold 20px monospace';
      for (let i = 0; i <= 50; i += 5) {
        const x = (i / 50) * 1024;
        rCtx.fillRect(x, 0, 2, 25);
        rCtx.fillText(`${i}cm`, x + 4, 50);
      }
    }
    const rulerTex = new THREE.CanvasTexture(rulerCanvas);
    const rulerMat = new THREE.MeshBasicMaterial({ map: rulerTex, transparent: true, opacity: 0.8 });
    const rulerMesh = new THREE.Mesh(rulerGeo, rulerMat);
    rulerMesh.rotation.x = -Math.PI / 2;
    rulerMesh.position.set(0, 0.01, 1.2);
    scene.add(rulerMesh);

    // 7. Wooden Block
    const blockGeo = new THREE.BoxGeometry(1.6, 0.7, 1.0);
    const blockMat = new THREE.MeshStandardMaterial({
      color: surfaceInfo.color,
      roughness: surfaceInfo.roughness,
      metalness: 0.1,
    });
    const blockMesh = new THREE.Mesh(blockGeo, blockMat);
    blockMesh.position.set(blockXRef.current, 0.35, 0);
    blockMesh.castShadow = true;
    blockMesh.receiveShadow = true;
    scene.add(blockMesh);
    blockMeshRef.current = blockMesh;

    // 8. Stackable Weights Group (Parented to Block)
    const weightsGroup = new THREE.Group();
    blockMesh.add(weightsGroup);
    weightsGroupRef.current = weightsGroup;

    // 9. Dynamometer (Spring Force Meter Assembly)
    const dynamometerGroup = new THREE.Group();
    scene.add(dynamometerGroup);
    dynamometerGroupRef.current = dynamometerGroup;

    // Outer Transparent Tube
    const tubeGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16);
    tubeGeo.rotateZ(Math.PI / 2);
    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    dynamometerGroup.add(tubeMesh);

    // Dynamometer Handle Ring
    const ringGeo = new THREE.TorusGeometry(0.2, 0.03, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: '#ea580c', metalness: 0.8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(1.2, 0, 0);
    dynamometerGroup.add(ringMesh);

    // Internal Red Pointer Mark
    const pointerGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
    const pointerMat = new THREE.MeshStandardMaterial({ color: '#ef4444' });
    const pointerMesh = new THREE.Mesh(pointerGeo, pointerMat);
    pointerMesh.rotation.z = -Math.PI / 2;
    pointerMesh.position.set(-0.8, 0, 0);
    dynamometerGroup.add(pointerMesh);
    pointerMeshRef.current = pointerMesh;

    // Connecting String line between Block Hook and Dynamometer
    const stringGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(blockXRef.current + 0.8, 0.35, 0),
      new THREE.Vector3(blockXRef.current + 1.8, 0.35, 0),
    ]);
    const stringMat = new THREE.LineBasicMaterial({ color: '#f8fafc', linewidth: 2 });
    const stringLine = new THREE.Line(stringGeo, stringMat);
    scene.add(stringLine);
    stringLineRef.current = stringLine;

    // 10. Force Vector Arrow Helpers
    const origin = new THREE.Vector3(blockXRef.current, 0.35, 0);

    // F_pull (Forward +X, Cyan)
    const arrowFpull = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 1.0, 0x06b6d4, 0.2, 0.15);
    scene.add(arrowFpull);
    arrowFpullRef.current = arrowFpull;

    // F_fric (Backward -X, Orange)
    const arrowFfric = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), origin, 1.0, 0xf97316, 0.2, 0.15);
    scene.add(arrowFfric);
    arrowFfricRef.current = arrowFfric;

    // Normal N (Upward +Y, Green)
    const arrowNormal = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, 1.0, 0x22c55e, 0.2, 0.15);
    scene.add(arrowNormal);
    arrowNormalRef.current = arrowNormal;

    // Gravity P (Downward -Y, Red)
    const arrowGravity = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), origin, 1.0, 0xef4444, 0.2, 0.15);
    scene.add(arrowGravity);
    arrowGravityRef.current = arrowGravity;

    // 11. Pointer Raycaster Drag Controls (Direct Manual Pulling)
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();
    let isManualDragging = false;
    let dragStartX = 0;
    let initialBlockX = blockXRef.current;

    const onPointerDown = (e: PointerEvent) => {
      if (!container || !cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVec, cameraRef.current);
      const intersects = raycaster.intersectObjects(dynamometerGroup.children, true);

      if (intersects.length > 0) {
        isManualDragging = true;
        dragStartX = e.clientX;
        initialBlockX = blockXRef.current;
        if (controlsRef.current) controlsRef.current.enabled = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isManualDragging) return;
      const deltaPx = e.clientX - dragStartX;
      const deltaUnits = deltaPx * 0.015; // Pixel scale factor

      // Calculate manual force & block position
      const calcForce = Math.min(5.0, Math.max(0.1, deltaUnits * 2.0 * surfaceInfo.mu * normalForce));
      currentForceRef.current = parseFloat(calcForce.toFixed(2));

      if (calcForce >= surfaceInfo.mu * normalForce * 0.9) {
        const nextX = Math.min(1.5, Math.max(-3.0, initialBlockX + (deltaUnits - 0.2)));
        blockXRef.current = nextX;
        if (blockMeshRef.current) {
          blockMeshRef.current.position.set(nextX, 0.35, 0);
        }
      }

      if (onPullProgress) {
        onPullProgress(currentForceRef.current, blockXRef.current);
      }
    };

    const onPointerUp = () => {
      if (isManualDragging) {
        isManualDragging = false;
        if (controlsRef.current) controlsRef.current.enabled = true;
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 12. Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 13. Render Animation Loop
    const renderLoop = () => {
      animFrameRef.current = requestAnimationFrame(renderLoop);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    renderLoop();

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Surface Material Color & Roughness
  useEffect(() => {
    if (!blockMeshRef.current) return;
    const mat = blockMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.color.set(surfaceInfo.color);
    mat.roughness = surfaceInfo.roughness;
  }, [surface, surfaceInfo]);

  // Update Stacked Slotted Weights on Block Top
  useEffect(() => {
    if (!weightsGroupRef.current) return;
    const group = weightsGroupRef.current;

    // Clear old weights
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (addedMassKg <= 0) return;

    // Add weights visually (each weight disc is 50g)
    const count = Math.round(addedMassKg / 0.05); // e.g. 0.1kg = 2 discs
    const discGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.12, 24);
    const discMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.9, roughness: 0.2 });

    for (let i = 0; i < Math.min(6, count); i++) {
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.set(0, 0.35 + i * 0.13, 0);
      disc.castShadow = true;
      group.add(disc);
    }
  }, [addedMassKg]);

  // Update Force Vectors & Dynamometer Position
  useEffect(() => {
    if (!blockMeshRef.current) return;

    const blockX = blockXRef.current;
    const origin = new THREE.Vector3(blockX, 0.35, 0);

    // Update String Line
    if (stringLineRef.current) {
      const points = [
        new THREE.Vector3(blockX + 0.8, 0.35, 0),
        new THREE.Vector3(blockX + 1.8, 0.35, 0),
      ];
      stringLineRef.current.geometry.setFromPoints(points);
    }

    // Update Dynamometer Group Position
    if (dynamometerGroupRef.current) {
      dynamometerGroupRef.current.position.set(blockX + 2.8, 0.35, 0);
    }

    // Update Vector Arrows
    const vecScale = 0.4;
    const fMag = Math.max(0.1, currentForceRef.current);
    const nMag = normalForce;

    if (arrowFpullRef.current) {
      arrowFpullRef.current.position.copy(origin);
      arrowFpullRef.current.setLength(Math.min(2.5, fMag * vecScale), 0.2, 0.15);
      arrowFpullRef.current.visible = showVectors;
    }
    if (arrowFfricRef.current) {
      arrowFfricRef.current.position.copy(origin);
      arrowFfricRef.current.setLength(Math.min(2.5, fMag * vecScale), 0.2, 0.15);
      arrowFfricRef.current.visible = showVectors;
    }
    if (arrowNormalRef.current) {
      arrowNormalRef.current.position.copy(origin);
      arrowNormalRef.current.setLength(Math.min(2.5, nMag * vecScale), 0.2, 0.15);
      arrowNormalRef.current.visible = showVectors;
    }
    if (arrowGravityRef.current) {
      arrowGravityRef.current.position.copy(origin);
      arrowGravityRef.current.setLength(Math.min(2.5, nMag * vecScale), 0.2, 0.15);
      arrowGravityRef.current.visible = showVectors;
    }

    // Update Pointer Position inside Dynamometer Scale (-0.8 to +0.8)
    if (pointerMeshRef.current) {
      const scalePos = -0.8 + Math.min(1.6, (currentForceRef.current / 5.0) * 1.6);
      pointerMeshRef.current.position.set(scalePos, 0, 0);
    }
  }, [normalForce, showVectors]);

  // Pulling Kinematics Loop
  useEffect(() => {
    if (!isPulling) {
      blockXRef.current = -3.0;
      currentForceRef.current = 0;
      if (blockMeshRef.current) {
        blockMeshRef.current.position.set(-3.0, 0.35, 0);
      }
      return;
    }

    const startTime = performance.now();
    const durationMs = 2500;
    const startX = -3.0;
    const endX = 1.5;

    let animId: number;

    const animatePull = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Block position sliding
      const currentX = startX + progress * (endX - startX);
      blockXRef.current = currentX;

      if (blockMeshRef.current) {
        blockMeshRef.current.position.set(currentX, 0.35, 0);
      }

      // Force ramp up & peak static friction effect
      let calculatedForce = frictionForce;
      if (progress < 0.15) {
        // Ramp up to static friction peak (1.1x dynamic friction)
        calculatedForce = (progress / 0.15) * (frictionForce * 1.1);
      } else {
        // Stabilize at constant sliding friction with realistic tiny fluctuations
        calculatedForce = frictionForce + (Math.sin(elapsed * 0.02) * 0.03);
      }

      const fVal = parseFloat(Math.max(0, calculatedForce).toFixed(2));
      currentForceRef.current = fVal;

      if (onPullProgress) {
        onPullProgress(fVal, currentX);
      }

      // Update positions
      if (stringLineRef.current) {
        stringLineRef.current.geometry.setFromPoints([
          new THREE.Vector3(currentX + 0.8, 0.35, 0),
          new THREE.Vector3(currentX + 1.8, 0.35, 0),
        ]);
      }
      if (dynamometerGroupRef.current) {
        dynamometerGroupRef.current.position.set(currentX + 2.8, 0.35, 0);
      }
      if (pointerMeshRef.current) {
        const scalePos = -0.8 + Math.min(1.6, (fVal / 5.0) * 1.6);
        pointerMeshRef.current.position.set(scalePos, 0, 0);
      }

      if (progress < 1) {
        animId = requestAnimationFrame(animatePull);
      } else {
        if (onPullComplete) {
          onPullComplete(parseFloat(frictionForce.toFixed(2)));
        }
      }
    };

    animId = requestAnimationFrame(animatePull);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPulling, frictionForce, onPullProgress, onPullComplete]);

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Surface Material Floating Tag */}
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full border border-white/20"
          style={{ backgroundColor: surfaceInfo.color }}
        />
        <span className="text-xs font-bold text-slate-100">{surfaceInfo.name}</span>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
          μ = {surfaceInfo.mu}
        </span>
      </div>

      {/* Dynamic HUD Forces Readout */}
      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/60 font-mono text-xs space-y-1 shadow-lg">
        <div className="flex items-center justify-between gap-4 text-cyan-400">
          <span>Lực ma sát F_ms:</span>
          <span className="font-extrabold text-sm text-yellow-400">
            {currentForceRef.current > 0 ? `${currentForceRef.current.toFixed(2)} N` : '0.00 N'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-slate-300">
          <span>Áp lực N (= P):</span>
          <span className="font-bold text-emerald-400">{normalForce.toFixed(2)} N</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
          <span>Tổng khối lượng m:</span>
          <span>{(totalMass * 1000).toFixed(0)} g</span>
        </div>
      </div>

      {/* Vector Color Legend Overlay */}
      {showVectors && (
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> F_kéo
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> F_ms
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> N
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> P
          </span>
        </div>
      )}

      {/* Direct Drag Instruction Banner */}
      <div className="absolute bottom-3 right-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-md animate-pulse">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span>Nhấp giữ chuột hoặc chạm kéo Vòng Lực Kế 3D để kéo khối gỗ trực tiếp</span>
      </div>
    </div>
  );
});
