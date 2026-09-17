import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface BoyleWorkbench3DHandle {
  getCanvasDataURL: () => string;
}

interface BoyleWorkbench3DProps {
  volume: number; // 10 to 50 cm³
  pressure: number; // bar
  isCompressing?: boolean;
}

interface ParticleState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export const BoyleWorkbench3D = forwardRef<BoyleWorkbench3DHandle, BoyleWorkbench3DProps>(({
  volume,
  pressure,
}, ref) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // References to keep up to date across renders
  const volumeRef = useRef<number>(volume);
  const pressureRef = useRef<number>(pressure);
  volumeRef.current = volume;
  pressureRef.current = pressure;

  // 3D Object Refs
  const pistonGroupRef = useRef<THREE.Group | null>(null);
  const needleMeshRef = useRef<THREE.Mesh | null>(null);
  const particleMeshesRef = useRef<THREE.Mesh[]>([]);
  const particlesDataRef = useRef<ParticleState[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Expose screenshot capability
  useImperativeHandle(ref, () => ({
    getCanvasDataURL: () => {
      if (rendererRef.current) {
        return rendererRef.current.domElement.toDataURL('image/png');
      }
      return '';
    },
  }));

  // Physical coordinates mapping:
  // V = 50 -> x = 2.5
  // V = 40 -> x = 1.5
  // V = 10 -> x = -1.5
  const getPistonX = (v: number) => -2.5 + (v / 50) * 5.0;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Clean up any stale canvas
    mount.innerHTML = '';

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.2);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 3.2;
    controls.maxDistance = 14;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.0);
    dirLight2.position.set(-5, 6, -3);
    scene.add(dirLight2);

    // 5. Laboratory Table Base
    const tableGeo = new THREE.BoxGeometry(9, 0.25, 4.5);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.6,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.set(0, -1.2, 0);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // Stand pillars
    const standMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
    const leftStand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 16), standMat);
    leftStand.position.set(-2.6, -0.5, 0);
    scene.add(leftStand);

    const rightStand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 16), standMat);
    rightStand.position.set(2.6, -0.5, 0);
    scene.add(rightStand);

    // 6. Transparent Glass Cylinder
    const cylRadius = 0.9;
    const cylLength = 5.2;
    const glassGeo = new THREE.CylinderGeometry(cylRadius, cylRadius, cylLength, 32, 1, true);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.24,
      roughness: 0.1,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const cylinderMesh = new THREE.Mesh(glassGeo, glassMat);
    cylinderMesh.rotation.z = Math.PI / 2;
    cylinderMesh.position.set(0, 0, 0);
    scene.add(cylinderMesh);

    // Left sealed cap
    const capMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const leftCap = new THREE.Mesh(new THREE.CylinderGeometry(cylRadius * 1.05, cylRadius * 1.05, 0.3, 32), capMat);
    leftCap.rotation.z = Math.PI / 2;
    leftCap.position.set(-2.65, 0, 0);
    scene.add(leftCap);

    // Right open flange
    const rightFlange = new THREE.Mesh(new THREE.TorusGeometry(cylRadius * 1.02, 0.06, 16, 32), capMat);
    rightFlange.rotation.y = Math.PI / 2;
    rightFlange.position.set(2.6, 0, 0);
    scene.add(rightFlange);

    // Volume Graduation Marks (10 to 50 cm³)
    const markMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let v = 10; v <= 50; v += 5) {
      const markX = getPistonX(v);
      const isMajor = v % 10 === 0;
      const markRing = new THREE.Mesh(
        new THREE.RingGeometry(cylRadius + 0.005, cylRadius + (isMajor ? 0.04 : 0.02), 32),
        markMat
      );
      markRing.rotation.y = Math.PI / 2;
      markRing.position.set(markX, 0, 0);
      scene.add(markRing);
    }

    // 7. Movable Piston Group
    const pistonGroup = new THREE.Group();
    pistonGroupRef.current = pistonGroup;

    // Piston Head (Disc)
    const pistonHeadMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.15,
    });
    const pistonHead = new THREE.Mesh(new THREE.CylinderGeometry(cylRadius * 0.98, cylRadius * 0.98, 0.25, 32), pistonHeadMat);
    pistonHead.rotation.z = Math.PI / 2;
    pistonHead.position.set(0, 0, 0);
    pistonGroup.add(pistonHead);

    // Piston Rod / Shaft
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16), rodMat);
    rod.rotation.z = Math.PI / 2;
    rod.position.set(1.6, 0, 0);
    pistonGroup.add(rod);

    // Piston Handle
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5, roughness: 0.5 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16), handleMat);
    handle.position.set(3.2, 0, 0);
    pistonGroup.add(handle);

    pistonGroup.position.x = getPistonX(volumeRef.current);
    scene.add(pistonGroup);

    // 8. 3D Bourdon Pressure Gauge
    const gaugeGroup = new THREE.Group();
    gaugeGroup.position.set(-2.65, 1.4, 0);

    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16), capMat);
    pipe.position.set(0, -0.7, 0);
    gaugeGroup.add(pipe);

    const gaugeBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 })
    );
    gaugeBody.rotation.x = Math.PI / 2;
    gaugeGroup.add(gaugeBody);

    const dialFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.64, 32),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    dialFace.position.set(0, 0, 0.11);
    gaugeGroup.add(dialFace);

    const needleGeo = new THREE.ConeGeometry(0.04, 0.5, 8);
    const needleMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const needle = new THREE.Mesh(needleGeo, needleMat);
    needle.position.set(0, 0.2, 0.13);
    needleMeshRef.current = needle;
    gaugeGroup.add(needle);

    scene.add(gaugeGroup);

    // 9. 3D Gas Particles with Solid Spheres
    const particleCount = 75;
    const pData: ParticleState[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.4,
    });

    const currentMaxX = getPistonX(volumeRef.current) - 0.15;
    const minX = -2.4;
    const meshes: THREE.Mesh[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * (cylRadius * 0.75);
      const x = minX + Math.random() * (currentMaxX - minX);
      const y = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;

      const speed = 0.02 + Math.random() * 0.025;
      const vx = (Math.random() > 0.5 ? 1 : -1) * speed;
      const vy = (Math.random() > 0.5 ? 1 : -1) * speed;
      const vz = (Math.random() > 0.5 ? 1 : -1) * speed;

      pData.push({ x, y, z, vx, vy, vz });

      const m = new THREE.Mesh(sphereGeo, sphereMat);
      m.position.set(x, y, z);
      scene.add(m);
      meshes.push(m);
    }
    particleMeshesRef.current = meshes;
    particlesDataRef.current = pData;

    // 10. Robust 60 FPS Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // OrbitControls update
      controls.update();

      // Smoothly interpolate piston position towards current target volume
      const targetPistonX = getPistonX(volumeRef.current);
      if (pistonGroupRef.current) {
        pistonGroupRef.current.position.x += (targetPistonX - pistonGroupRef.current.position.x) * 0.15;
      }

      // Smoothly interpolate needle angle
      if (needleMeshRef.current) {
        const targetNeedleAngle = -((pressureRef.current - 1.0) / 3.5) * (Math.PI * 1.3);
        needleMeshRef.current.rotation.z += (targetNeedleAngle - needleMeshRef.current.rotation.z) * 0.15;
      }

      // Particle Kinematics
      const currentPistonFaceX = pistonGroupRef.current ? pistonGroupRef.current.position.x : targetPistonX;
      const activeMinX = -2.42;
      const activeMaxX = currentPistonFaceX - 0.14;
      const maxR = cylRadius * 0.82;

      const pList = particlesDataRef.current;
      const mList = particleMeshesRef.current;

      for (let i = 0; i < pList.length; i++) {
        const p = pList[i];

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Reflection on Left Cap
        if (p.x <= activeMinX) {
          p.x = activeMinX + 0.02;
          p.vx = Math.abs(p.vx);
        }
        // Reflection on Piston Face
        else if (p.x >= activeMaxX) {
          p.x = activeMaxX - 0.02;
          p.vx = -Math.abs(p.vx);
        }

        // Radial reflection on cylinder wall
        const r = Math.sqrt(p.y * p.y + p.z * p.z);
        if (r >= maxR) {
          const invR = 1 / (r || 1);
          const ny = p.y * invR;
          const nz = p.z * invR;

          p.y = ny * (maxR - 0.02);
          p.z = nz * (maxR - 0.02);

          const dot = p.vy * ny + p.vz * nz;
          if (dot > 0) {
            p.vy -= 2 * dot * ny;
            p.vz -= 2 * dot * nz;
          }
        }

        // Update 3D mesh position directly
        if (mList[i]) {
          mList[i].position.set(p.x, p.y, p.z);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
    <div className="relative w-full h-full select-none overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Overlays */}
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 text-[11px] text-slate-300 flex items-center space-x-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Mô phỏng 3D Khí Lý Tưởng (T = 25°C Đẳng nhiệt)</span>
      </div>

      <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-sky-500/30 text-right space-y-1 shadow-lg pointer-events-none">
        <div className="text-[10px] uppercase font-mono tracking-widest text-sky-400 font-bold">
          Áp Kế Kỹ Thuật Số
        </div>
        <div className="text-2xl font-mono font-black text-sky-300">
          {pressure.toFixed(2)} <span className="text-xs font-normal text-slate-400">bar</span>
        </div>
        <div className="text-xs font-mono text-slate-300 flex items-center justify-end space-x-2">
          <span>V = <strong className="text-amber-400">{volume}</strong> cm³</span>
          <span className="text-slate-600">•</span>
          <span>p·V = <strong className="text-emerald-400">{(pressure * volume).toFixed(1)}</strong></span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center space-x-2">
        <div className="text-[10px] text-slate-400 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-800">
          🖱️ Kéo chuột trái để xoay 360° • Chuột phải để di chuyển • Cuộn để zoom
        </div>
        <button
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
              controlsRef.current.autoRotateSpeed = 2.0;
            }
          }}
          className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-sky-400 text-[10px] font-bold rounded-lg border border-sky-500/30 transition cursor-pointer"
        >
          🔄 Xoay Tự Động
        </button>
        <button
          onClick={() => {
            if (cameraRef.current && controlsRef.current) {
              cameraRef.current.position.set(0, 3.2, 7.2);
              controlsRef.current.target.set(0, 0, 0);
              controlsRef.current.update();
            }
          }}
          className="px-2 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-[10px] rounded-lg border border-slate-700 transition cursor-pointer"
        >
          🎯 Góc Mặc Định
        </button>
      </div>
    </div>
  );
});

BoyleWorkbench3D.displayName = 'BoyleWorkbench3D';
