import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { type OpticalMedium, type RefractionRayState } from './refractionEngine';

interface RefractionWorkbench3DProps {
  medium1: OpticalMedium;
  medium2: OpticalMedium;
  direction: 'medium1_to_medium2' | 'medium2_to_medium1';
  incidentAngleDeg: number;
  rayState: RefractionRayState;
  laserWavelength: 'red' | 'green' | 'blue';
  cameraMode: 'perspective' | 'front' | 'top';
  onIncidentAngleChange?: (angle: number) => void;
}

const WAVELENGTH_COLORS = {
  red: 0xef4444,
  green: 0x22c55e,
  blue: 0x3b82f6,
};

function createProtractorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 512;
    const cy = 512;
    const r = 480;

    // Disc background
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Outer border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Inner concentric ring
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 60, 0, Math.PI * 2);
    ctx.stroke();

    // Center Crosshair & Normal Line axis
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r + 30);
    ctx.lineTo(cx, cy + r - 30);
    ctx.moveTo(cx - r + 30, cy);
    ctx.lineTo(cx + r + 30, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tick Marks (Every 1 deg, 5 deg, 10 deg)
    for (let deg = 0; deg < 360; deg++) {
      const rad = (deg * Math.PI) / 180;
      const isMajor10 = deg % 10 === 0;
      const isMajor5 = deg % 5 === 0;
      const tickLen = isMajor10 ? 28 : isMajor5 ? 18 : 10;

      const x1 = cx + Math.cos(rad) * r;
      const y1 = cy + Math.sin(rad) * r;
      const x2 = cx + Math.cos(rad) * (r - tickLen);
      const y2 = cy + Math.sin(rad) * (r - tickLen);

      ctx.strokeStyle = isMajor10 ? '#f8fafc' : isMajor5 ? '#94a3b8' : '#475569';
      ctx.lineWidth = isMajor10 ? 3 : isMajor5 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (isMajor10) {
        // Label relative to Normal line (0 at top, 90 on sides, or 0-360)
        let labelAngle = deg;
        if (deg <= 90) labelAngle = 90 - deg;
        else if (deg <= 180) labelAngle = deg - 90;
        else if (deg <= 270) labelAngle = 270 - deg;
        else labelAngle = deg - 270;

        const textR = r - 45;
        const tx = cx + Math.cos(rad) * textR;
        const ty = cy + Math.sin(rad) * textR;

        ctx.fillStyle = isMajor10 && labelAngle === 0 ? '#38bdf8' : '#e2e8f0';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${labelAngle}°`, tx, ty);
      }
    }

    // Normal labels: N (Top) and N' (Bottom)
    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N (PHÁP TUYẾN)', cx, cy - r + 80);
    ctx.fillText("N'", cx, cy + r - 80);

    // Interface labels (Mặt phân cách)
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('MẶT PHÂN CÁCH QUANG HỌC', cx, cy - 18);
  }
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export const RefractionWorkbench3D: React.FC<RefractionWorkbench3DProps> = ({
  medium1,
  medium2,
  direction,
  incidentAngleDeg,
  rayState,
  laserWavelength,
  cameraMode,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Optical Meshes Refs
  const laserEmitterRef = useRef<THREE.Group | null>(null);
  const semiCylinderMeshRef = useRef<THREE.Mesh | null>(null);
  const incidentRayRef = useRef<THREE.Line | null>(null);
  const reflectedRayRef = useRef<THREE.Line | null>(null);
  const refractedRayRef = useRef<THREE.Line | null>(null);
  const tirGlowRef = useRef<THREE.Mesh | null>(null);

  // Init 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.1);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.65, 0.85);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    (renderer as any).toneMapping = (THREE as any).ACESFilmicToneMapping ?? 3;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 0.02, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 0.35;
    controls.maxDistance = 2.4;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.SpotLight(0xfffaf0, 3.0);
    mainKeyLight.position.set(0.6, 1.4, 0.7);
    mainKeyLight.angle = Math.PI / 3.8;
    mainKeyLight.penumbra = 0.35;
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const blueFill = new THREE.DirectionalLight(0x38bdf8, 0.7);
    blueFill.position.set(-1.0, 0.8, -0.6);
    scene.add(blueFill);

    // Lab Table Base
    const tableGeo = new THREE.BoxGeometry(1.4, 0.03, 0.9);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.85,
      metalness: 0.2,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.015;
    table.receiveShadow = true;
    scene.add(table);

    // Circular Optics Protractor Disc ($R = 0.32m$)
    const discRadius = 0.32;
    const discGeo = new THREE.CylinderGeometry(discRadius, discRadius, 0.01, 64);
    const discTex = createProtractorTexture();
    const discMat = [
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 }), // Side
      new THREE.MeshBasicMaterial({ map: discTex }), // Top Disc Face
      new THREE.MeshStandardMaterial({ color: 0x0f172a }), // Bottom
    ];
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.005;
    disc.receiveShadow = true;
    disc.castShadow = true;
    scene.add(disc);

    // Center Pin Marker
    const pinGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.02, 16);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(0, 0.015, 0);
    scene.add(pin);

    // Semi-Cylindrical Glass Lens Block (Khối Bán Nguyệt Trụ Thủy Tinh)
    // Placed on bottom half (z >= 0) with flat face along X axis
    const blockRadius = 0.18;
    const blockHeight = 0.045;
    const semiCylinderGeo = new THREE.CylinderGeometry(
      blockRadius,
      blockRadius,
      blockHeight,
      48,
      1,
      false,
      0,
      Math.PI // Half cylinder
    );
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      opacity: 0.75,
      transparent: true,
      roughness: 0.1,
      metalness: 0.2,
    });
    const semiCylinder = new THREE.Mesh(semiCylinderGeo, glassMat);
    semiCylinder.position.set(0, 0.01 + blockHeight / 2, 0);
    semiCylinder.rotation.y = -Math.PI / 2;
    semiCylinder.castShadow = true;
    scene.add(semiCylinder);
    semiCylinderMeshRef.current = semiCylinder;

    // Laser Emitter Housing on Circular Rail ($R = 0.28m$)
    const emitterGroup = new THREE.Group();
    const laserBodyGeo = new THREE.BoxGeometry(0.06, 0.025, 0.025);
    const laserBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const laserBody = new THREE.Mesh(laserBodyGeo, laserBodyMat);
    emitterGroup.add(laserBody);

    const laserLensGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.015, 16);
    const laserLensMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
    const laserLens = new THREE.Mesh(laserLensGeo, laserLensMat);
    laserLens.rotation.z = Math.PI / 2;
    laserLens.position.x = -0.035;
    emitterGroup.add(laserLens);

    scene.add(emitterGroup);
    laserEmitterRef.current = emitterGroup;

    // Rays (Lines with glowing materials)
    const rayMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 });

    const incGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.25, 0.03, -0.25),
      new THREE.Vector3(0, 0.03, 0),
    ]);
    const incLine = new THREE.Line(incGeo, rayMat);
    scene.add(incLine);
    incidentRayRef.current = incLine;

    const refGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.03, 0),
      new THREE.Vector3(0.25, 0.03, -0.25),
    ]);
    const refLine = new THREE.Line(refGeo, rayMat.clone());
    scene.add(refLine);
    reflectedRayRef.current = refLine;

    const refrGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.03, 0),
      new THREE.Vector3(0.15, 0.03, 0.25),
    ]);
    const refrLine = new THREE.Line(refrGeo, rayMat.clone());
    scene.add(refrLine);
    refractedRayRef.current = refrLine;

    // TIR Point Glow
    const tirGlowGeo = new THREE.SphereGeometry(0.012, 16, 16);
    const tirGlowMat = new THREE.MeshBasicMaterial({ color: 0xffedd5, transparent: true, opacity: 0 });
    const tirGlow = new THREE.Mesh(tirGlowGeo, tirGlowMat);
    tirGlow.position.set(0, 0.03, 0);
    scene.add(tirGlow);
    tirGlowRef.current = tirGlow;

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render Loop
    let reqId: number;
    const renderLoop = () => {
      reqId = requestAnimationFrame(renderLoop);
      controls.update();
      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      renderer.dispose();
    };
  }, []);

  // Update Laser Color
  useEffect(() => {
    const col = WAVELENGTH_COLORS[laserWavelength] || 0xef4444;
    if (incidentRayRef.current) (incidentRayRef.current.material as THREE.LineBasicMaterial).color.setHex(col);
    if (reflectedRayRef.current) (reflectedRayRef.current.material as THREE.LineBasicMaterial).color.setHex(col);
    if (refractedRayRef.current) (refractedRayRef.current.material as THREE.LineBasicMaterial).color.setHex(col);
  }, [laserWavelength]);

  // Update Medium Color and Opacity
  useEffect(() => {
    if (!semiCylinderMeshRef.current) return;
    const targetMedium = direction === 'medium1_to_medium2' ? medium2 : medium1;
    const mat = semiCylinderMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.color = new THREE.Color(targetMedium.colorTint);
    mat.opacity = Math.min(0.85, 0.4 + targetMedium.opacity * 0.4);
  }, [medium1, medium2, direction]);

  // Update Laser Emitter & Rays based on incident angle i & refraction state
  useEffect(() => {
    const R_EMITTER = 0.28;
    const R_RAY = 0.27;
    const iRad = (incidentAngleDeg * Math.PI) / 180;
    const yHeight = 0.03;

    // Emitter Position
    // Direction 1: from Top-Left (z < 0, x < 0)
    // Direction 2: from Bottom-Left (z > 0, x < 0)
    const zSign = direction === 'medium1_to_medium2' ? -1 : 1;

    const emitterX = -Math.sin(iRad) * R_EMITTER;
    const emitterZ = zSign * Math.cos(iRad) * R_EMITTER;

    if (laserEmitterRef.current) {
      laserEmitterRef.current.position.set(emitterX, yHeight, emitterZ);
      laserEmitterRef.current.lookAt(0, yHeight, 0);
    }

    // 1. Incident Ray: Emitter -> Origin (0,0,0)
    if (incidentRayRef.current) {
      const incPoints = [
        new THREE.Vector3(emitterX, yHeight, emitterZ),
        new THREE.Vector3(0, yHeight, 0),
      ];
      incidentRayRef.current.geometry.setFromPoints(incPoints);
    }

    // 2. Reflected Ray: Origin -> (Reflected X, Z)
    // Angle of reflection = i (symmetrical with respect to Normal line)
    if (reflectedRayRef.current) {
      const refX = Math.sin(iRad) * R_RAY;
      const refZ = zSign * Math.cos(iRad) * R_RAY;
      const refPoints = [
        new THREE.Vector3(0, yHeight, 0),
        new THREE.Vector3(refX, yHeight, refZ),
      ];
      reflectedRayRef.current.geometry.setFromPoints(refPoints);
      const refMat = reflectedRayRef.current.material as THREE.LineBasicMaterial;
      refMat.opacity = Math.max(0.15, rayState.reflectance);
      refMat.transparent = true;
    }

    // 3. Refracted Ray: Origin -> (Refracted X, Z in opposite medium)
    if (refractedRayRef.current) {
      if (rayState.isTotalInternalReflection) {
        // No refracted ray emerges!
        refractedRayRef.current.visible = false;
        if (tirGlowRef.current) {
          (tirGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.9;
        }
      } else {
        refractedRayRef.current.visible = true;
        if (tirGlowRef.current) {
          (tirGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
        }

        const rRad = (rayState.refractionAngleDeg * Math.PI) / 180;
        const refrZSign = -zSign; // crosses interface into opposite side
        const refrX = Math.sin(rRad) * R_RAY;
        const refrZ = refrZSign * Math.cos(rRad) * R_RAY;

        const refrPoints = [
          new THREE.Vector3(0, yHeight, 0),
          new THREE.Vector3(refrX, yHeight, refrZ),
        ];
        refractedRayRef.current.geometry.setFromPoints(refrPoints);
        const refrMat = refractedRayRef.current.material as THREE.LineBasicMaterial;
        refrMat.opacity = Math.max(0.2, rayState.transmittance);
        refrMat.transparent = true;
      }
    }
  }, [incidentAngleDeg, rayState, direction]);

  // Camera Presets
  useEffect(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;

    if (cameraMode === 'front') {
      cam.position.set(0, 0.42, 0.75);
      ctrl.target.set(0, 0.02, 0);
    } else if (cameraMode === 'top') {
      cam.position.set(0, 0.98, 0.01);
      ctrl.target.set(0, 0, 0);
    } else {
      cam.position.set(0, 0.65, 0.85);
      ctrl.target.set(0, 0.02, 0);
    }
    ctrl.update();
  }, [cameraMode]);

  return (
    <div className="relative w-full h-full min-h-0 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
      {/* 3D Mount */}
      <div ref={mountRef} className="w-full h-full flex-1 min-h-0" />

      {/* Floating HUD: Optical Angles & Ratio Panel */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-xl flex items-center gap-3">
        {/* Incident Angle i */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Góc Tới (i)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-rose-400 font-mono">
              {incidentAngleDeg.toFixed(1)}°
            </span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-700/80" />

        {/* Refraction Angle r */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Góc Khúc Xạ (r)
          </span>
          <div className="flex items-baseline gap-1">
            {rayState.isTotalInternalReflection ? (
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                PHẢN XẠ TOÀN PHẦN
              </span>
            ) : (
              <>
                <span className="text-xl font-black text-sky-400 font-mono">
                  {rayState.refractionAngleDeg.toFixed(1)}°
                </span>
              </>
            )}
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-700/80" />

        {/* sin(i) / sin(r) */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            sin(i) / sin(r)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-emerald-400 font-mono">
              {rayState.isTotalInternalReflection
                ? '—'
                : incidentAngleDeg > 0.5
                ? (
                    Math.sin((incidentAngleDeg * Math.PI) / 180) /
                    Math.sin((rayState.refractionAngleDeg * Math.PI) / 180)
                  ).toFixed(3)
                : '1.000'}
            </span>
          </div>
        </div>

        {/* Critical angle badge if applicable */}
        {rayState.criticalAngleDeg && (
          <>
            <div className="h-6 w-[1px] bg-slate-700/80" />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                i_gh
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {rayState.criticalAngleDeg.toFixed(1)}°
              </span>
            </div>
          </>
        )}
      </div>

      {/* Direction & Medium Indicator */}
      <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/60 shadow-lg flex items-center gap-1.5 text-[11px]">
        <span className="text-slate-400 font-medium">Chiều:</span>
        <span className="font-bold text-amber-300 font-mono">
          {direction === 'medium1_to_medium2'
            ? `${medium1.name} → ${medium2.name}`
            : `${medium2.name} → ${medium1.name}`}
        </span>
      </div>
    </div>
  );
};
