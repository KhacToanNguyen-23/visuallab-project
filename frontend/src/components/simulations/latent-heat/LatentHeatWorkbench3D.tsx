import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface LatentHeatWorkbench3DHandle {
  getCanvasDataURL: () => string;
}

interface LatentHeatWorkbench3DProps {
  waterMassKg: number; // e.g. 0.25 kg
  iceMassKg: number; // e.g. 0.02, 0.035, 0.05 kg
  currentTemp: number; // °C
  isMelting: boolean;
  meltProgress: number; // 0.0 to 1.0
}

export const LatentHeatWorkbench3D = forwardRef<LatentHeatWorkbench3DHandle, LatentHeatWorkbench3DProps>(({
  waterMassKg,
  iceMassKg,
  currentTemp,
  isMelting,
  meltProgress,
}, ref) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Dynamic references for 60fps animation loop
  const isMeltingRef = useRef<boolean>(isMelting);
  const meltProgressRef = useRef<number>(meltProgress);
  const currentTempRef = useRef<number>(currentTemp);
  const iceMassKgRef = useRef<number>(iceMassKg);
  isMeltingRef.current = isMelting;
  meltProgressRef.current = meltProgress;
  currentTempRef.current = currentTemp;
  iceMassKgRef.current = iceMassKg;

  // 3D Object Refs
  const iceGroupRef = useRef<THREE.Group | null>(null);
  const stirrerMeshRef = useRef<THREE.Group | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const bubblesGroupRef = useRef<THREE.Group | null>(null);
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

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 2.6, 5.0);
      controlsRef.current.target.set(0, 0.3, 0);
      controlsRef.current.update();
    }
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
    camera.position.set(0, 2.6, 5.0);
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
    controls.maxDistance = 10;
    controls.target.set(0, 0.3, 0);
    controlsRef.current = controls;

    // 4. Lighting - Crisp & Bright Studio
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 8, 6);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-5, 6, -4);
    scene.add(dirLight2);

    const bottomGlow = new THREE.PointLight(0x0284c7, 1.5, 6);
    bottomGlow.position.set(0, -0.5, 0);
    scene.add(bottomGlow);

    // 5. Lab Desk with Grid Mat
    const deskGeo = new THREE.BoxGeometry(9, 0.25, 6);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.3,
    });
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.set(0, -1.3, 0);
    deskMesh.receiveShadow = true;
    scene.add(deskMesh);

    const gridHelper = new THREE.GridHelper(7, 14, 0x0284c7, 0x1e293b);
    gridHelper.position.set(0, -1.17, 0);
    scene.add(gridHelper);

    // 6. Transparent Double-Walled Calorimeter (Bình Nhiệt Lượng Kế Thủy Tinh & Vỏ Cách Nhiệt)
    const vesselGroup = new THREE.Group();

    // Metallic Base & Rim
    const baseGeo = new THREE.CylinderGeometry(1.35, 1.4, 0.25, 48);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const baseMesh = new THREE.Mesh(baseGeo, metalMat);
    baseMesh.position.set(0, -1.05, 0);
    vesselGroup.add(baseMesh);

    const topRimGeo = new THREE.TorusGeometry(1.3, 0.06, 16, 48);
    const topRim = new THREE.Mesh(topRimGeo, metalMat);
    topRim.rotation.x = Math.PI / 2;
    topRim.position.set(0, 1.3, 0);
    vesselGroup.add(topRim);

    // Outer Glass Vessel (Trong suốt cao cấp để quan sát)
    const outerGlassGeo = new THREE.CylinderGeometry(1.3, 1.25, 2.4, 48, 1, true);
    const outerGlassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const outerGlass = new THREE.Mesh(outerGlassGeo, outerGlassMat);
    outerGlass.position.set(0, 0.1, 0);
    vesselGroup.add(outerGlass);

    // Inner Glass Vessel
    const innerGlassGeo = new THREE.CylinderGeometry(1.15, 1.12, 2.3, 48, 1, true);
    const innerGlassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      side: THREE.DoubleSide,
    });
    const innerGlass = new THREE.Mesh(innerGlassGeo, innerGlassMat);
    innerGlass.position.set(0, 0.1, 0);
    vesselGroup.add(innerGlass);

    // Bottom inner glass disk
    const innerBottomGeo = new THREE.CylinderGeometry(1.12, 1.12, 0.05, 48);
    const innerBottom = new THREE.Mesh(innerBottomGeo, innerGlassMat);
    innerBottom.position.set(0, -1.0, 0);
    vesselGroup.add(innerBottom);

    scene.add(vesselGroup);

    // 7. Water Body Inside Calorimeter
    const waterGeo = new THREE.CylinderGeometry(1.1, 1.08, 1.6, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.15,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -0.15, 0);
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // Water Surface meniscus ring / disc
    const surfaceGeo = new THREE.CircleGeometry(1.1, 48);
    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
      roughness: 0.05,
      side: THREE.DoubleSide,
    });
    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
    surfaceMesh.rotation.x = -Math.PI / 2;
    surfaceMesh.position.set(0, 0.65, 0);
    scene.add(surfaceMesh);

    // 8. 3D Stirrer (Que khuấy di chuyển & khuấy nước)
    const stirrerGroup = new THREE.Group();
    stirrerMeshRef.current = stirrerGroup;

    // Upper handle
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.5 });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.set(0.5, 2.2, 0);
    stirrerGroup.add(handleMesh);

    // Stirrer Rod
    const stirrerRodGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.8, 16);
    const stirrerRodMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const stirrerRod = new THREE.Mesh(stirrerRodGeo, stirrerRodMat);
    stirrerRod.position.set(0.5, 0.8, 0);
    stirrerGroup.add(stirrerRod);

    // Stirrer Ring / Loop at bottom
    const loopGeo = new THREE.TorusGeometry(0.4, 0.035, 16, 32);
    const loopMesh = new THREE.Mesh(loopGeo, stirrerRodMat);
    loopMesh.rotation.x = Math.PI / 2;
    loopMesh.position.set(0.5, -0.55, 0);
    stirrerGroup.add(loopMesh);

    scene.add(stirrerGroup);

    // 9. Digital Thermometer Probe (Nhiệt kế điện tử cắm sâu vào nước)
    const probeGroup = new THREE.Group();

    // Red/Black Thermometer body on top
    const probeBodyGeo = new THREE.BoxGeometry(0.3, 0.6, 0.2);
    const probeBodyMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const probeBody = new THREE.Mesh(probeBodyGeo, probeBodyMat);
    probeBody.position.set(-0.5, 2.1, 0);
    probeGroup.add(probeBody);

    // Small LED on probe
    const probeLedGeo = new THREE.PlaneGeometry(0.2, 0.12);
    const probeLedMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
    const probeLed = new THREE.Mesh(probeLedGeo, probeLedMat);
    probeLed.position.set(-0.5, 2.1, 0.105);
    probeGroup.add(probeLed);

    // Long stainless steel probe dipping into water
    const stainlessProbeGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.7, 16);
    const stainlessMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.95, roughness: 0.1 });
    const stainlessProbe = new THREE.Mesh(stainlessProbeGeo, stainlessMat);
    stainlessProbe.position.set(-0.5, 0.7, 0);
    probeGroup.add(stainlessProbe);

    scene.add(probeGroup);

    // 10. Floating Ice Cubes Group (Đá viên tinh thể nổi trên mặt nước)
    const iceGroup = new THREE.Group();
    iceGroupRef.current = iceGroup;

    const iceMat = new THREE.MeshStandardMaterial({
      color: 0xf0f9ff,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1,
      metalness: 0.05,
    });

    const createIceCube = (size: number, x: number, y: number, z: number, rx: number, ry: number, rz: number) => {
      const cubeGeo = new THREE.BoxGeometry(size, size, size);
      const mesh = new THREE.Mesh(cubeGeo, iceMat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.castShadow = true;
      return mesh;
    };

    const iceCubes = [
      createIceCube(0.38, -0.15, 0.65, 0.1, 0.2, 0.4, 0.1),
      createIceCube(0.35, 0.2, 0.63, -0.15, 0.5, 0.2, 0.3),
      createIceCube(0.32, -0.05, 0.66, -0.25, 0.1, 0.6, 0.4),
      createIceCube(0.30, 0.25, 0.64, 0.2, 0.3, 0.1, 0.5),
    ];
    iceCubes.forEach(c => iceGroup.add(c));
    scene.add(iceGroup);

    // 11. Dissolution Bubbles & Convection Currents
    const bubblesGroup = new THREE.Group();
    bubblesGroupRef.current = bubblesGroup;
    const bubbleGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.6 });

    const bubbleMeshes: { mesh: THREE.Mesh; speed: number; startY: number }[] = [];
    for (let i = 0; i < 20; i++) {
      const bMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.8;
      const startY = -0.8 + Math.random() * 1.3;
      bMesh.position.set(Math.cos(angle) * radius, startY, Math.sin(angle) * radius);
      bubblesGroup.add(bMesh);
      bubbleMeshes.push({ mesh: bMesh, speed: 0.008 + Math.random() * 0.012, startY: -0.8 });
    }
    scene.add(bubblesGroup);

    // 12. Animation Loop (60 FPS)
    let time = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      time += 0.03;

      controls.update();

      const isMeltingNow = isMeltingRef.current;
      const progress = meltProgressRef.current;

      // Stirrer motion: smoothly moves up, down, and rotates when melting
      if (stirrerMeshRef.current) {
        if (isMeltingNow) {
          stirrerMeshRef.current.position.y = Math.sin(time * 3.5) * 0.15;
          stirrerMeshRef.current.rotation.y = Math.sin(time * 2.0) * 0.3;
        } else {
          stirrerMeshRef.current.position.y = 0;
          stirrerMeshRef.current.rotation.y = 0;
        }
      }

      // Ice Cubes: Floating bobbing on water waves + shrinking as progress increases
      if (iceGroupRef.current) {
        const scaleFactor = Math.max(0.001, 1.0 - progress * 0.98);
        iceGroupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
        iceGroupRef.current.visible = scaleFactor > 0.03;

        // Bobbing & slow rotation
        const bob = Math.sin(time * 2.0) * 0.025;
        iceGroupRef.current.position.y = bob;
        if (isMeltingNow) {
          iceGroupRef.current.rotation.y += 0.015;
        }
      }

      // Bubbles convection animation during melting
      if (bubblesGroupRef.current) {
        bubblesGroupRef.current.visible = isMeltingNow;
        if (isMeltingNow) {
          bubbleMeshes.forEach(b => {
            b.mesh.position.y += b.speed;
            if (b.mesh.position.y > 0.65) {
              b.mesh.position.y = b.startY;
            }
          });
        }
      }

      // Water color transition based on temperature (Warm 40°C -> Cool ~25-30°C)
      if (waterMeshRef.current) {
        const temp = currentTempRef.current;
        // 40°C is brighter cyan-sky, 20°C is deep blue
        const tRatio = Math.max(0, Math.min(1, (temp - 20) / 20));
        const color = new THREE.Color().setHSL(0.55 + tRatio * 0.05, 0.85, 0.35 + tRatio * 0.1);
        (waterMeshRef.current.material as THREE.MeshStandardMaterial).color = color;
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
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-200">
          Bình Nhiệt Lượng Kế Thủy Tinh 3D
        </span>
      </div>

      {/* Top Right Digital LED Thermometer & Mass Badge */}
      <div className="absolute top-3 right-3 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-2xl z-10 min-w-[190px]">
        <div className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider text-right mb-1">
          NHIỆT KẾ ĐIỆN TỬ
        </div>
        <div className="flex items-baseline justify-end space-x-1">
          <span className="text-3xl font-mono font-extrabold text-rose-400 tracking-tight">
            {currentTemp.toFixed(1)}
          </span>
          <span className="text-sm font-mono text-rose-300 font-bold">°C</span>
        </div>
        <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>m_n = <b className="text-sky-300">{(waterMassKg * 1000).toFixed(0)}g</b></span>
          <span>•</span>
          <span>m_đá = <b className="text-emerald-300">{(iceMassKg * 1000).toFixed(0)}g</b></span>
        </div>
      </div>

      {/* Bottom Floating Control Shortcuts */}
      <div className="absolute bottom-3 left-3 flex items-center space-x-2 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
          🖱️ Kéo chuột trái để xoay 360° • Cuộn để zoom
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

LatentHeatWorkbench3D.displayName = 'LatentHeatWorkbench3D';
