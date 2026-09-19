import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { type PowerSourcePreset } from './emfInternalREngine';

interface EmfInternalRWorkbench3DProps {
  selectedSource: PowerSourcePreset;
  rheostatROhms: number;
  switchOpen: boolean;
  meterMode: 'analog' | 'digital';
  currentIAmps: number;
  voltageUVolts: number;
  cameraMode: 'perspective' | 'front' | 'top';
  onRheostatChange?: (newROhms: number) => void;
  onToggleSwitch?: () => void;
}

// Helpers for procedural canvas textures
function createBatteryTexture(label: string, voltage: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.3, '#38bdf8');
    grad.addColorStop(0.7, '#0284c7');
    grad.addColorStop(1, '#0369a1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, 60, 256);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(450, 0, 62, 256);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('+', 20, 140);
    ctx.fillText('−', 475, 140);

    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(label, 120, 110);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(voltage, 120, 160);
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#e0f2fe';
    ctx.fillText('DC POWER CELL • GDPT 2018', 120, 200);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function createRheostatCoilTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, 1024, 128);

    for (let x = 0; x < 1024; x += 4) {
      const grad = ctx.createLinearGradient(x, 0, x + 4, 0);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(0.8, '#d97706');
      grad.addColorStop(1, '#451a03');
      ctx.fillStyle = grad;
      ctx.fillRect(x, 0, 3, 128);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 1);
  return tex;
}

function createMeterDialTexture(type: 'VOLT' | 'AMPERE', maxVal: number, unit: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 340);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 492, 320);

    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(256, 310, 195, -Math.PI * 0.78, -Math.PI * 0.22);
    ctx.arc(256, 310, 185, -Math.PI * 0.22, -Math.PI * 0.78, true);
    ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 310, 210, -Math.PI * 0.78, -Math.PI * 0.22);
    ctx.stroke();

    const totalDivs = 30;
    const startAngle = -Math.PI * 0.78;
    const endAngle = -Math.PI * 0.22;
    const angleRange = endAngle - startAngle;

    for (let i = 0; i <= totalDivs; i++) {
      const angle = startAngle + (i / totalDivs) * angleRange;
      const isMajor = i % 5 === 0;
      const tickLen = isMajor ? 20 : 10;

      const r1 = 210;
      const r2 = r1 - tickLen;

      const x1 = 256 + Math.cos(angle) * r1;
      const y1 = 310 + Math.sin(angle) * r1;
      const x2 = 256 + Math.cos(angle) * r2;
      const y2 = 310 + Math.sin(angle) * r2;

      ctx.beginPath();
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (isMajor) {
        const val = ((i / totalDivs) * maxVal).toFixed(maxVal < 2 ? 1 : 0);
        const textR = r2 - 16;
        const tx = 256 + Math.cos(angle) * textR;
        const ty = 310 + Math.sin(angle) * textR;
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val, tx, ty);
      }
    }

    ctx.fillStyle = type === 'VOLT' ? '#b45309' : '#0284c7';
    ctx.font = '900 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(type === 'VOLT' ? 'VÔN KẾ (V)' : 'AMPE KẾ (A)', 256, 175);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`DC • CLASS 1.5 • MAX ${maxVal}${unit}`, 256, 205);

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(256, 305, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

function createBananaJack(colorHex: number): THREE.Group {
  const group = new THREE.Group();

  const nutGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 6);
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
  const nut = new THREE.Mesh(nutGeo, brassMat);
  nut.position.y = 0.004;
  group.add(nut);

  const collarGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.02, 24);
  const plasticMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.1 });
  const collar = new THREE.Mesh(collarGeo, plasticMat);
  collar.position.y = 0.018;
  group.add(collar);

  const holeGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.005, 16);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const hole = new THREE.Mesh(holeGeo, holeMat);
  hole.position.y = 0.028;
  group.add(hole);

  return group;
}

// Clean Curved Wire
function createCatenaryWire(
  start: THREE.Vector3,
  end: THREE.Vector3,
  colorHex: number,
  droop = 0.03
): THREE.Group {
  const group = new THREE.Group();

  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  mid.y = Math.min(start.y, end.y) - droop;

  const p1 = new THREE.Vector3().lerpVectors(start, mid, 0.45);
  p1.y = Math.max(start.y - 0.008, mid.y + 0.008);
  const p2 = new THREE.Vector3().lerpVectors(mid, end, 0.55);
  p2.y = Math.max(end.y - 0.008, mid.y + 0.008);

  const curve = new THREE.CatmullRomCurve3([start, p1, mid, p2, end]);
  const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.0042, 12, false);
  const wireMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.35,
    metalness: 0.2,
  });
  const wireMesh = new THREE.Mesh(tubeGeo, wireMat);
  wireMesh.castShadow = true;
  group.add(wireMesh);

  // Banana Plug Caps on ends
  const plugGeo = new THREE.CylinderGeometry(0.0065, 0.0065, 0.022, 16);
  const plugMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3 });

  const plug1 = new THREE.Mesh(plugGeo, plugMat);
  plug1.position.copy(start);
  plug1.position.y -= 0.005;
  group.add(plug1);

  const plug2 = new THREE.Mesh(plugGeo, plugMat);
  plug2.position.copy(end);
  plug2.position.y -= 0.005;
  group.add(plug2);

  return group;
}

// Label on board
function createBoardLabel(text: string, color = '#94a3b8', width = 256, height = 64): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect(4, 4, width - 8, height - 8, 8);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry((width / 512) * 0.25, (height / 512) * 0.25);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

export const EmfInternalRWorkbench3D: React.FC<EmfInternalRWorkbench3DProps> = ({
  selectedSource,
  rheostatROhms,
  switchOpen,
  meterMode,
  currentIAmps,
  voltageUVolts,
  cameraMode,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Component Mesh Refs
  const switchLeverRef = useRef<THREE.Group | null>(null);
  const rheostatSliderRef = useRef<THREE.Group | null>(null);
  const voltmeterNeedleRef = useRef<THREE.Mesh | null>(null);
  const ammeterNeedleRef = useRef<THREE.Mesh | null>(null);
  const cell2MeshRef = useRef<THREE.Mesh | null>(null);

  // Init 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.08);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.65, 0.95);
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
    controls.target.set(0, 0.03, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 0.45;
    controls.maxDistance = 2.6;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.SpotLight(0xfffaf0, 3.2);
    mainKeyLight.position.set(0.6, 1.4, 0.8);
    mainKeyLight.angle = Math.PI / 3.8;
    mainKeyLight.penumbra = 0.35;
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 2048;
    mainKeyLight.shadow.mapSize.height = 2048;
    scene.add(mainKeyLight);

    const blueFill = new THREE.DirectionalLight(0x38bdf8, 0.8);
    blueFill.position.set(-1.2, 0.9, -0.6);
    scene.add(blueFill);

    const warmRim = new THREE.DirectionalLight(0xf59e0b, 0.7);
    warmRim.position.set(0, 0.2, -1.2);
    scene.add(warmRim);

    // 0. AUTHENTIC LABORATORY BENCH & CIRCUIT BREADBOARD
    const tableGeo = new THREE.BoxGeometry(1.6, 0.04, 1.0);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.85,
      metalness: 0.15,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.02;
    table.receiveShadow = true;
    scene.add(table);

    // Clean Physics Circuit Board Tray
    const boardGeo = new THREE.BoxGeometry(1.02, 0.016, 0.64);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.25,
    });
    const circuitBoard = new THREE.Mesh(boardGeo, boardMat);
    circuitBoard.position.set(0, 0.008, 0);
    circuitBoard.receiveShadow = true;
    circuitBoard.castShadow = true;
    scene.add(circuitBoard);

    // Board Beveled Border Trim
    const trimGeo = new THREE.BoxGeometry(1.04, 0.018, 0.66);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 0.005, 0);
    scene.add(trim);

    // Subtle Board Label Badges
    const lblBatt = createBoardLabel('NGUỒN PIN (E, r)', '#38bdf8', 256, 56);
    lblBatt.position.set(-0.33, 0.018, -0.24);
    scene.add(lblBatt);

    const lblSwitch = createBoardLabel('KHÓA K', '#fbbf24', 180, 56);
    lblSwitch.position.set(-0.04, 0.018, -0.24);
    scene.add(lblSwitch);

    const lblAmmeter = createBoardLabel('AMPE KẾ (A)', '#38bdf8', 220, 56);
    lblAmmeter.position.set(0.28, 0.018, -0.24);
    scene.add(lblAmmeter);

    const lblVoltmeter = createBoardLabel('VÔN KẾ (V)', '#fbbf24', 220, 56);
    lblVoltmeter.position.set(0.28, 0.018, 0.25);
    scene.add(lblVoltmeter);

    const lblRheo = createBoardLabel('BIẾN TRỞ CON CHẠY R', '#34d399', 300, 56);
    lblRheo.position.set(-0.11, 0.018, 0.25);
    scene.add(lblRheo);

    // ==========================================
    // 1. BATTERY HOLDER (Top-Left: x = -0.33, z = -0.14)
    // ==========================================
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(-0.33, 0.016, -0.14);

    const battBoxGeo = new THREE.BoxGeometry(0.18, 0.032, 0.12);
    const battBoxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.5 });
    const battBox = new THREE.Mesh(battBoxGeo, battBoxMat);
    battBox.position.y = 0.016;
    battBox.castShadow = true;
    batteryGroup.add(battBox);

    const nickelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.2 });
    const springPlate1 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.022, 0.04), nickelMat);
    springPlate1.position.set(-0.075, 0.022, 0);
    batteryGroup.add(springPlate1);

    const springPlate2 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.022, 0.04), nickelMat);
    springPlate2.position.set(0.075, 0.022, 0);
    batteryGroup.add(springPlate2);

    const cellsGroup = new THREE.Group();
    const cellGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.12, 32);
    const cellTex = createBatteryTexture('PIN AA 1.5V', '1.5V DC');
    const cellMat = new THREE.MeshStandardMaterial({ map: cellTex, metalness: 0.6, roughness: 0.35 });

    const cell1 = new THREE.Mesh(cellGeo, cellMat);
    cell1.rotation.z = Math.PI / 2;
    cell1.position.set(0, 0.022, -0.028);
    cell1.castShadow = true;
    cellsGroup.add(cell1);

    const cell2 = new THREE.Mesh(cellGeo, cellMat);
    cell2.rotation.z = Math.PI / 2;
    cell2.position.set(0, 0.022, 0.028);
    cell2.castShadow = true;
    cellsGroup.add(cell2);
    cell2MeshRef.current = cell2;

    batteryGroup.add(cellsGroup);

    // Terminal Jacks: (+) Red on Right, (-) Black on Left
    const battPosJack = createBananaJack(0xef4444);
    battPosJack.position.set(0.06, 0.032, 0);
    batteryGroup.add(battPosJack);

    const battNegJack = createBananaJack(0x0f172a);
    battNegJack.position.set(-0.06, 0.032, 0);
    batteryGroup.add(battNegJack);

    scene.add(batteryGroup);

    // ==========================================
    // 2. KNIFE SWITCH (Top-Center: x = -0.04, z = -0.14)
    // ==========================================
    const switchGroup = new THREE.Group();
    switchGroup.position.set(-0.04, 0.016, -0.14);

    const swBaseGeo = new THREE.BoxGeometry(0.13, 0.018, 0.07);
    const swBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const swBase = new THREE.Mesh(swBaseGeo, swBaseMat);
    swBase.position.y = 0.009;
    swBase.castShadow = true;
    switchGroup.add(swBase);

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 });
    const swPivotPost = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.022, 16), brassMat);
    swPivotPost.position.set(-0.038, 0.02, 0);
    switchGroup.add(swPivotPost);

    const swJawPost = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.022, 0.012), brassMat);
    swJawPost.position.set(0.038, 0.02, 0);
    switchGroup.add(swJawPost);

    const leverGroup = new THREE.Group();
    leverGroup.position.set(-0.038, 0.025, 0);

    const bladeGeo = new THREE.BoxGeometry(0.076, 0.008, 0.0035);
    const blade = new THREE.Mesh(bladeGeo, brassMat);
    blade.position.x = 0.038;
    blade.castShadow = true;
    leverGroup.add(blade);

    const handleGeo = new THREE.CylinderGeometry(0.005, 0.007, 0.03, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0.076, 0.015, 0);
    leverGroup.add(handle);

    switchGroup.add(leverGroup);
    switchLeverRef.current = leverGroup;

    // Switch Jacks: In Left, Out Right
    const swInJack = createBananaJack(0xef4444);
    swInJack.position.set(-0.038, 0.018, 0);
    switchGroup.add(swInJack);

    const swOutJack = createBananaJack(0xef4444);
    swOutJack.position.set(0.038, 0.018, 0);
    switchGroup.add(swOutJack);

    scene.add(switchGroup);

    // ==========================================
    // 3. AMMETER HOUSING (Top-Right: x = 0.28, z = -0.14)
    // ==========================================
    const ammeterGroup = new THREE.Group();
    ammeterGroup.position.set(0.28, 0.016, -0.14);

    const aBoxGeo = new THREE.BoxGeometry(0.14, 0.08, 0.12);
    const meterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 });
    const aBox = new THREE.Mesh(aBoxGeo, meterMat);
    aBox.position.y = 0.04;
    aBox.castShadow = true;
    ammeterGroup.add(aBox);

    const aDialTex = createMeterDialTexture('AMPERE', 1.0, 'A');
    const aFaceGeo = new THREE.PlaneGeometry(0.11, 0.07);
    const aFaceMat = new THREE.MeshBasicMaterial({ map: aDialTex });
    const aFace = new THREE.Mesh(aFaceGeo, aFaceMat);
    aFace.rotation.x = -Math.PI / 3.8;
    aFace.position.set(0, 0.05, 0.015);
    ammeterGroup.add(aFace);

    const needleGeo = new THREE.BoxGeometry(0.0016, 0.034, 0.0016);
    const needleMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const aNeedle = new THREE.Mesh(needleGeo, needleMat);
    aNeedle.position.set(0, 0.051, 0.018);
    aNeedle.rotation.x = -Math.PI / 3.8;
    ammeterGroup.add(aNeedle);
    ammeterNeedleRef.current = aNeedle;

    // Ammeter Jacks: (+) Red Left, (-) Black Right
    const aPosJack = createBananaJack(0xef4444);
    aPosJack.position.set(-0.035, 0.04, 0.05);
    ammeterGroup.add(aPosJack);

    const aNegJack = createBananaJack(0x0284c7); // Blue
    aNegJack.position.set(0.035, 0.04, 0.05);
    ammeterGroup.add(aNegJack);

    scene.add(ammeterGroup);

    // ==========================================
    // 4. VOLTMETER HOUSING (Bottom-Right: x = 0.28, z = 0.14)
    // ==========================================
    const voltmeterGroup = new THREE.Group();
    voltmeterGroup.position.set(0.28, 0.016, 0.14);

    const vBox = new THREE.Mesh(aBoxGeo, meterMat);
    vBox.position.y = 0.04;
    vBox.castShadow = true;
    voltmeterGroup.add(vBox);

    const vDialTex = createMeterDialTexture('VOLT', 3.0, 'V');
    const vFaceMat = new THREE.MeshBasicMaterial({ map: vDialTex });
    const vFace = new THREE.Mesh(aFaceGeo, vFaceMat);
    vFace.rotation.x = -Math.PI / 3.8;
    vFace.position.set(0, 0.05, 0.015);
    voltmeterGroup.add(vFace);

    const vNeedle = new THREE.Mesh(needleGeo, needleMat);
    vNeedle.position.set(0, 0.051, 0.018);
    vNeedle.rotation.x = -Math.PI / 3.8;
    voltmeterGroup.add(vNeedle);
    voltmeterNeedleRef.current = vNeedle;

    // Voltmeter Jacks: (+) Red Left, (-) Black Right
    const vPosJack = createBananaJack(0xf59e0b); // Gold
    vPosJack.position.set(-0.035, 0.04, 0.05);
    voltmeterGroup.add(vPosJack);

    const vNegJack = createBananaJack(0x475569); // Slate
    vNegJack.position.set(0.035, 0.04, 0.05);
    voltmeterGroup.add(vNegJack);

    scene.add(voltmeterGroup);

    // ==========================================
    // 5. RHEOSTAT (Bottom-Center/Left: x = -0.11, z = 0.14)
    // ==========================================
    const rheoGroup = new THREE.Group();
    rheoGroup.position.set(-0.11, 0.016, 0.14);

    const rhBaseGeo = new THREE.BoxGeometry(0.44, 0.016, 0.09);
    const rhBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const rhBase = new THREE.Mesh(rhBaseGeo, rhBaseMat);
    rhBase.position.y = 0.008;
    rhBase.castShadow = true;
    rheoGroup.add(rhBase);

    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const bracket1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 0.08), bracketMat);
    bracket1.position.set(-0.19, 0.035, 0);
    rheoGroup.add(bracket1);

    const bracket2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 0.08), bracketMat);
    bracket2.position.set(0.19, 0.035, 0);
    rheoGroup.add(bracket2);

    const coilGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.36, 36);
    const coilTex = createRheostatCoilTexture();
    const coilMat = new THREE.MeshStandardMaterial({ map: coilTex, metalness: 0.85, roughness: 0.3 });
    const coilMesh = new THREE.Mesh(coilGeo, coilMat);
    coilMesh.rotation.z = Math.PI / 2;
    coilMesh.position.set(0, 0.035, 0);
    coilMesh.castShadow = true;
    rheoGroup.add(coilMesh);

    const barGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.38, 20);
    const barMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.1 });
    const guideBar = new THREE.Mesh(barGeo, barMat);
    guideBar.rotation.z = Math.PI / 2;
    guideBar.position.set(0, 0.068, 0);
    rheoGroup.add(guideBar);

    const riderGroup = new THREE.Group();
    riderGroup.position.set(0, 0.068, 0);

    const sliderBlockGeo = new THREE.BoxGeometry(0.034, 0.03, 0.036);
    const sliderBlockMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.2 });
    const sliderBlock = new THREE.Mesh(sliderBlockGeo, sliderBlockMat);
    sliderBlock.castShadow = true;
    riderGroup.add(sliderBlock);

    const wiperGeo = new THREE.BoxGeometry(0.012, 0.02, 0.01);
    const wiperMesh = new THREE.Mesh(wiperGeo, brassMat);
    wiperMesh.position.set(0, -0.018, 0);
    riderGroup.add(wiperMesh);

    const sliderJack = createBananaJack(0x0f172a);
    sliderJack.position.set(0, 0.015, 0);
    riderGroup.add(sliderJack);

    rheoGroup.add(riderGroup);
    rheostatSliderRef.current = riderGroup;

    // Fixed Terminals: A on Left, B on Right
    const rhJackA = createBananaJack(0x0f172a); // Black (to Batt -)
    rhJackA.position.set(-0.19, 0.07, 0.02);
    rheoGroup.add(rhJackA);

    const rhJackB = createBananaJack(0x0284c7); // Blue (from Ammeter -)
    rhJackB.position.set(0.19, 0.07, 0.02);
    rheoGroup.add(rhJackB);

    scene.add(rheoGroup);

    // ==========================================
    // 6. PERFECT UNCLUTTERED CIRCUIT WIRES
    // 100% matched to terminal jack coordinates
    // ==========================================
    const wiresGroup = new THREE.Group();

    // 1. DÂY ĐỎ 1: Cực (+) Nguồn Pin -> Cọc vào Khóa K
    // Batt(+) = (-0.27, 0.048, -0.14) -> Sw In = (-0.078, 0.034, -0.14)
    const wire1 = createCatenaryWire(
      new THREE.Vector3(-0.27, 0.048, -0.14),
      new THREE.Vector3(-0.078, 0.034, -0.14),
      0xdc2626, // Red
      0.02
    );
    wiresGroup.add(wire1);

    // 2. DÂY ĐỎ 2: Cọc ra Khóa K -> Cọc (+) Ampe Kế
    // Sw Out = (-0.002, 0.034, -0.14) -> Ammeter (+) = (0.245, 0.056, -0.09)
    const wire2 = createCatenaryWire(
      new THREE.Vector3(-0.002, 0.034, -0.14),
      new THREE.Vector3(0.245, 0.056, -0.09),
      0xdc2626, // Red
      0.025
    );
    wiresGroup.add(wire2);

    // 3. DÂY XANH DƯƠNG: Cọc (-) Ampe Kế -> Cọc B Biến Trở
    // Ammeter (-) = (0.315, 0.056, -0.09) -> Rheostat B = (0.08, 0.086, 0.16)
    const wire3 = createCatenaryWire(
      new THREE.Vector3(0.315, 0.056, -0.09),
      new THREE.Vector3(0.08, 0.086, 0.16),
      0x0284c7, // Blue
      0.035
    );
    wiresGroup.add(wire3);

    // 4. DÂY ĐEN: Cọc A Biến Trở -> Cực (-) Nguồn Pin
    // Rheostat A = (-0.30, 0.086, 0.16) -> Batt (-) = (-0.39, 0.048, -0.14)
    const wire4 = createCatenaryWire(
      new THREE.Vector3(-0.30, 0.086, 0.16),
      new THREE.Vector3(-0.39, 0.048, -0.14),
      0x111827, // Black
      0.04
    );
    wiresGroup.add(wire4);

    // 5. DÂY VÀNG (Shunt Vôn kế +): Cọc (+) Vôn kế -> Cọc B Biến Trở
    // Voltmeter (+) = (0.245, 0.056, 0.19) -> Rheostat B = (0.08, 0.086, 0.16)
    const wire5 = createCatenaryWire(
      new THREE.Vector3(0.245, 0.056, 0.19),
      new THREE.Vector3(0.08, 0.086, 0.16),
      0xf59e0b, // Gold
      0.02
    );
    wiresGroup.add(wire5);

    // 6. DÂY XÁM (Shunt Vôn kế -): Cọc (-) Vôn kế -> Cọc A Biến Trở
    // Voltmeter (-) = (0.315, 0.056, 0.19) -> Rheostat A = (-0.30, 0.086, 0.16)
    const wire6 = createCatenaryWire(
      new THREE.Vector3(0.315, 0.056, 0.19),
      new THREE.Vector3(-0.30, 0.086, 0.16),
      0x64748b, // Slate
      0.05
    );
    wiresGroup.add(wire6);

    scene.add(wiresGroup);

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

  // Update battery cells when preset changes
  useEffect(() => {
    if (cell2MeshRef.current) {
      cell2MeshRef.current.visible = selectedSource.id === 'double_series';
    }
  }, [selectedSource]);

  // Update Switch Lever Angle
  useEffect(() => {
    if (!switchLeverRef.current) return;
    switchLeverRef.current.rotation.z = switchOpen ? -Math.PI * 0.27 : 0;
  }, [switchOpen]);

  // Update Rheostat Slider Position along X axis (-0.15 to +0.15)
  useEffect(() => {
    if (!rheostatSliderRef.current) return;
    const t = Math.min(1, Math.max(0, (rheostatROhms - 0.1) / 99.9));
    rheostatSliderRef.current.position.x = -0.15 + t * 0.30;
  }, [rheostatROhms]);

  // Update Meter Needles
  useEffect(() => {
    if (ammeterNeedleRef.current) {
      const maxI = 1.0;
      const tI = Math.min(1, Math.max(0, currentIAmps / maxI));
      const angleI = 0.42 - tI * 0.84;
      ammeterNeedleRef.current.rotation.z = angleI;
    }

    if (voltmeterNeedleRef.current) {
      const maxU = 3.0;
      const tU = Math.min(1, Math.max(0, voltageUVolts / maxU));
      const angleU = 0.42 - tU * 0.84;
      voltmeterNeedleRef.current.rotation.z = angleU;
    }
  }, [currentIAmps, voltageUVolts]);

  // Camera Presets
  useEffect(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;

    if (cameraMode === 'front') {
      cam.position.set(0, 0.42, 0.78);
      ctrl.target.set(0, 0.03, 0);
    } else if (cameraMode === 'top') {
      cam.position.set(0, 1.05, 0.02);
      ctrl.target.set(0, 0, 0);
    } else {
      cam.position.set(0, 0.65, 0.95);
      ctrl.target.set(0, 0.03, 0);
    }
    ctrl.update();
  }, [cameraMode]);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
      {/* 3D Mount */}
      <div ref={mountRef} className="w-full h-full flex-1" />

      {/* Floating HUD: Digital / Analog Readings Panel */}
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/60 shadow-xl flex items-center gap-4">
        {/* Voltage U */}
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Hiệu Điện Thế Mạch Ngoài (U)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {voltageUVolts.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">V</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-700/80" />

        {/* Current I */}
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Cường Độ Dòng Điện (I)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-sky-400 font-mono">
              {currentIAmps.toFixed(3)}
            </span>
            <span className="text-xs font-bold text-slate-400">A</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-700/80" />

        {/* Rheostat R */}
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Biến Trở (R)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-emerald-400 font-mono">
              {rheostatROhms}
            </span>
            <span className="text-xs font-bold text-slate-400">Ω</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-700/80" />

        {/* Switch Status */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Khóa K</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
              switchOpen
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {switchOpen ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG'}
          </span>
        </div>
      </div>

      {/* Meter Mode Badge */}
      <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-medium">Đồng hồ:</span>
        <span className="text-xs font-bold text-amber-300 font-mono uppercase">
          {meterMode === 'analog' ? 'Kim Vạch (Analog)' : 'Hiện Số (Digital LED)'}
        </span>
      </div>
    </div>
  );
};
