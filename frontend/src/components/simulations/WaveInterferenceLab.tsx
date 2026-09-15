import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Convert physical wavelength (nm) to RGB string & Three.js Color (CIE 1931 approx)
function wavelengthToRGB(wavelength: number): { r: number; g: number; b: number; hex: string; threeColor: THREE.Color } {
  let r = 0, g = 0, b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0.0;
    g = (wavelength - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1.0;
    g = -(wavelength - 645) / (645 - 580);
    b = 0.0;
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  }

  // Vision sensitivity falloff at spectrum edges
  let factor = 0.0;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 420 && wavelength < 701) {
    factor = 1.0;
  } else if (wavelength >= 701 && wavelength <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 701);
  }

  const R = Math.round(r * factor * 255);
  const G = Math.round(g * factor * 255);
  const B = Math.round(b * factor * 255);
  const hex = `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;

  return { r: R, g: G, b: B, hex, threeColor: new THREE.Color(R / 255, G / 255, B / 255) };
}

// 5-Step Guided Lab Workflow
interface StepGuide {
  step: number;
  title: string;
  desc: string;
}

const STEPS: StepGuide[] = [
  { step: 1, title: 'Bật Nguồn Laser', desc: 'Bật công tắc nguồn phát Laser và quan sát chùm tia 3D chiếu tới khe kép Y-âng.' },
  { step: 2, title: 'Cài Đặt D & a', desc: 'Điều chỉnh khoảng cách màn D (m) và khoảng cách 2 khe a (mm) trên thanh trượt.' },
  { step: 3, title: 'Đo Tọa Độ x1, x6', desc: 'Mở Thị Kính Phóng Đại, rê sợi chỉ chữ thập (Crosshair) để bắt vị trí 6 vân sáng.' },
  { step: 4, title: 'Ghi Dữ Liệu', desc: 'Nhấn "Lưu Lần Đo" vào bảng số liệu thực nghiệm để tính khoảng vân i và bước sóng λ.' },
  { step: 5, title: 'Hoàn Tất & Nộp Bài', desc: 'Trả lời 3 câu hỏi trắc nghiệm củng cố lý thuyết và nhận điểm số đánh giá 3-Tier.' },
];

interface MeasurementTrial {
  id: number;
  mode: 'laser' | 'white';
  wavelengthNominal: number; // nm
  a: number; // mm
  D: number; // m
  x1: number; // mm
  x6: number; // mm
  deltaX: number; // mm
  iExp: number; // mm
  lambdaExp: number; // nm
  errorPct: number; // %
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Trong thí nghiệm giao thoa khe Y-âng, khoảng cách giữa hai vân sáng liên tiếp (khoảng vân i) được tính bằng công thức nào?',
    options: [
      'i = λ * D / a',
      'i = λ * a / D',
      'i = a * D / λ',
      'i = 2 * λ * D / a',
    ],
    correct: 0,
    explanation: 'Theo SGK Vật lý 11 GDPT 2018, khoảng vân i = λD / a.',
  },
  {
    id: 2,
    question: 'Khi thay nguồn sáng đơn sắc màu đỏ bằng nguồn sáng đơn sắc màu tím thì khoảng vân i trên màn sẽ biến đổi như thế nào?',
    options: [
      'Khoảng vân i tăng lên',
      'Khoảng vân i giảm đi',
      'Khoảng vân i không đổi',
      'Hệ vân biến mất hoàn toàn',
    ],
    correct: 1,
    explanation: 'Vì bước sóng ánh sáng tím (λ_tím ≈ 400nm) nhỏ hơn ánh sáng đỏ (λ_đỏ ≈ 700nm), nên i = λD/a sẽ giảm.',
  },
  {
    id: 3,
    question: 'Khi chiếu chùm ánh sáng trắng qua khe Y-âng, hiện tượng gì xảy ra ở vân chính giữa (vân trung tâm)?',
    options: [
      'Là một dải cầu vồng có màu từ đỏ đến tím',
      'Là một vân tối hoàn toàn',
      'Là một vân sáng màu trắng',
      'Không có hiện tượng giao thoa',
    ],
    correct: 2,
    explanation: 'Tại vị trí chính giữa O, hiệu đường đi d2 - d1 = 0 đối với mọi bước sóng, nên các vân sáng đơn sắc đều hội tụ cho màu trắng tổng hợp.',
  },
];

export const WaveInterferenceLab: React.FC = () => {
  const navigate = useNavigate();

  // Three.js Mount Container
  const mountRef = useRef<HTMLDivElement | null>(null);
  const screenTextureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Optics Parameters
  const [isLaserOn, setIsLaserOn] = useState<boolean>(true);
  const [lightMode, setLightMode] = useState<'laser' | 'white'>('laser');
  const [wavelength, setWavelength] = useState<number>(632.8); // nm (He-Ne Red)
  const [slitSeparation, setSlitSeparation] = useState<number>(0.50); // a in mm (0.15 - 1.00 mm)
  const [screenDistance, setScreenDistance] = useState<number>(1.20); // D in meters (0.50 - 2.50 m)
  const [laserPower] = useState<number>(5); // mW (1 - 10 mW)

  // Eyepiece HUD & Crosshair
  const [isEyepieceOpen, setIsEyepieceOpen] = useState<boolean>(true);
  const [isGraphOpen, setIsGraphOpen] = useState<boolean>(true);
  const [crosshairPos, setCrosshairPos] = useState<number>(0); // mm relative to center (-10 to +10 mm)
  const [isDraggingCrosshair, setIsDraggingCrosshair] = useState<boolean>(false);
  const [recordedX1, setRecordedX1] = useState<number | null>(null);
  const [recordedX6, setRecordedX6] = useState<number | null>(null);

  // Workflow & Grading
  const [isProblemStatementOpen, setIsProblemStatementOpen] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [trials, setTrials] = useState<MeasurementTrial[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'bench' | 'worksheet' | 'quiz'>('bench');
  // Problem Statement Requirements (Target to be set by student)
  interface ProblemRequirement {
    id: number;
    laserName: string;
    targetWavelength: number; // nm
    targetA: number; // mm
    targetD: number; // m
  }

  const [targetReq, setTargetReq] = useState<ProblemRequirement>({
    id: 1,
    laserName: 'Laser He-Ne Đỏ (632.8 nm)',
    targetWavelength: 632.8,
    targetA: 0.50,
    targetD: 1.20,
  });

  // Predefined realistic laser wavelengths & optical configurations
  const RANDOM_PRESETS = [
    { name: 'Laser He-Ne Đỏ (632.8 nm)', wavelength: 632.8 },
    { name: 'Laser DPSS Lục (532.0 nm)', wavelength: 532.0 },
    { name: 'Laser Diode Lam (450.0 nm)', wavelength: 450.0 },
    { name: 'Laser Diode Tím (405.0 nm)', wavelength: 405.0 },
    { name: 'Laser He-Ne Vàng (594.1 nm)', wavelength: 594.1 },
    { name: 'Laser He-Ne Cam (612.0 nm)', wavelength: 612.0 },
    { name: 'Laser Ruby Đỏ Thẫm (694.3 nm)', wavelength: 694.3 },
  ];

  const handleRandomizeProblem = () => {
    const preset = RANDOM_PRESETS[Math.floor(Math.random() * RANDOM_PRESETS.length)];
    const possibleA = [0.20, 0.25, 0.30, 0.40, 0.50, 0.60, 0.75];
    const possibleD = [0.80, 1.00, 1.20, 1.40, 1.50, 1.80, 2.00];
    const randomA = possibleA[Math.floor(Math.random() * possibleA.length)];
    const randomD = possibleD[Math.floor(Math.random() * possibleD.length)];

    // Set new problem target for the student to configure manually
    setTargetReq((prev) => ({
      id: prev.id + 1,
      laserName: preset.name,
      targetWavelength: preset.wavelength,
      targetA: randomA,
      targetD: randomD,
    }));

    // Reset student measurement markers so they perform fresh measurements
    setRecordedX1(null);
    setRecordedX6(null);
    setCrosshairPos(0);
    setIsProblemStatementOpen(true);
  };

  const handleApplyTargetSettings = () => {
    setWavelength(targetReq.targetWavelength);
    setSlitSeparation(targetReq.targetA);
    setScreenDistance(targetReq.targetD);
    setLightMode('laser');
    setIsLaserOn(true);
  };

  // Match validation between student slider settings and problem requirement
  const isAMatched = Math.abs(slitSeparation - targetReq.targetA) < 0.001;
  const isDMatched = Math.abs(screenDistance - targetReq.targetD) < 0.001;
  const isLambdaMatched = Math.abs(wavelength - targetReq.targetWavelength) <= 1 && lightMode === 'laser';
  const isAllConfigMatched = isAMatched && isDMatched && isLambdaMatched;

  // Physics Calculations
  const exactColor = useMemo(() => wavelengthToRGB(wavelength), [wavelength]);
  // Theoretical fringe spacing: i = (lambda in m * D in m) / (a in m)
  // in mm: i = (lambda * 1e-9 * D) / (a * 1e-3) * 1e3 = (lambda * 1e-6 * D) / (a * 1e-3) = lambda(nm) * 1e-6 * D(m) / a(mm) * 1e3 = lambda(nm) * D(m) / (a(mm) * 1000)
  const theoreticalFringeSpacing = useMemo(() => {
    return (wavelength * 1e-9 * screenDistance) / (slitSeparation * 1e-3) * 1e3; // mm
  }, [wavelength, screenDistance, slitSeparation]);

  // Current Measured i from X1 and X6
  const measuredDeltaX = recordedX1 !== null && recordedX6 !== null ? Math.abs(recordedX6 - recordedX1) : null;
  const measuredFringeSpacing = measuredDeltaX !== null ? measuredDeltaX / 5 : null; // 5 intervals for 6 fringes
  const measuredWavelength = measuredFringeSpacing !== null ? (measuredFringeSpacing * 1e-3 * slitSeparation * 1e-3) / screenDistance * 1e9 : null; // nm
  const currentErrorPct = measuredWavelength !== null ? Math.abs(measuredWavelength - wavelength) / wavelength * 100 : null;

  // -------------------------------------------------------------
  // THREE.JS 3D SCENE SETUP
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Create Offscreen Canvas for Dynamic Fringe Texture on 3D Screen
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 1024;
    texCanvas.height = 512;
    screenTextureCanvasRef.current = texCanvas;

    const screenTexture = new THREE.CanvasTexture(texCanvas);
    screenTexture.wrapS = THREE.ClampToEdgeWrapping;
    screenTexture.wrapT = THREE.ClampToEdgeWrapping;
    screenTextureRef.current = screenTexture;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.08);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.8, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below workbench
    controls.minDistance = 1.0;
    controls.maxDistance = 7.0;
    controls.target.set(0, 0.4, 0);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // Lab Workbench Table Surface
    const tableGeo = new THREE.BoxGeometry(5.0, 0.1, 2.0);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.3,
      metalness: 0.8,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, -0.05, 0);
    table.receiveShadow = true;
    scene.add(table);

    // Optical Bench Rail (Anodized Aluminum)
    const railGeo = new THREE.BoxGeometry(3.6, 0.08, 0.2);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2,
    });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, 0.04, 0);
    rail.castShadow = true;
    rail.receiveShadow = true;
    scene.add(rail);

    // Rail Millimeter Scale Inset
    const scaleGeo = new THREE.PlaneGeometry(3.5, 0.04);
    const scaleMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat);
    scaleMesh.rotation.x = -Math.PI / 2;
    scaleMesh.position.set(0, 0.081, 0.05);
    scene.add(scaleMesh);

    // -------------------------------------------------------------
    // OPTICAL COMPONENTS (Riders)
    // -------------------------------------------------------------
    const riderGeo = new THREE.BoxGeometry(0.2, 0.12, 0.25);
    const riderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
    const rodGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 16);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.1 });

    // 1. LASER SOURCE (Fixed at X = -1.4)
    const laserGroup = new THREE.Group();
    laserGroup.position.set(-1.4, 0, 0);

    const laserRider = new THREE.Mesh(riderGeo, riderMat);
    laserRider.position.y = 0.06;
    laserGroup.add(laserRider);

    const laserRod = new THREE.Mesh(rodGeo, rodMat);
    laserRod.position.y = 0.35;
    laserGroup.add(laserRod);

    // Laser Box Body
    const laserBodyGeo = new THREE.BoxGeometry(0.35, 0.18, 0.18);
    const laserBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const laserBody = new THREE.Mesh(laserBodyGeo, laserBodyMat);
    laserBody.position.set(0, 0.6, 0);
    laserBody.castShadow = true;
    laserGroup.add(laserBody);

    // Laser Aperture Bezel
    const apertureGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16);
    const apertureMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
    const aperture = new THREE.Mesh(apertureGeo, apertureMat);
    aperture.rotation.z = Math.PI / 2;
    aperture.position.set(0.18, 0.6, 0);
    laserGroup.add(aperture);

    // Power Indicator LED
    const ledGeo = new THREE.SphereGeometry(0.02, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-0.1, 0.7, 0.07);
    laserGroup.add(led);

    scene.add(laserGroup);

    // 2. DOUBLE SLIT HOLDER (Fixed at X = -0.7)
    const slitGroup = new THREE.Group();
    slitGroup.position.set(-0.7, 0, 0);

    const slitRider = new THREE.Mesh(riderGeo, riderMat);
    slitRider.position.y = 0.06;
    slitGroup.add(slitRider);

    const slitRod = new THREE.Mesh(rodGeo, rodMat);
    slitRod.position.y = 0.35;
    slitGroup.add(slitRod);

    // Slit Disk Frame
    const slitFrameGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.03, 32);
    const slitFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const slitFrame = new THREE.Mesh(slitFrameGeo, slitFrameMat);
    slitFrame.rotation.z = Math.PI / 2;
    slitFrame.position.set(0, 0.6, 0);
    slitGroup.add(slitFrame);

    // Slit Glass Slide with double slit line
    const glassGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.035, 32);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      opacity: 0.6,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.rotation.z = Math.PI / 2;
    glass.position.set(0, 0.6, 0);
    slitGroup.add(glass);

    scene.add(slitGroup);

    // 3. FRINGE SCREEN (Movable along X from 0.0 to 1.5)
    const screenGroup = new THREE.Group();
    const screenRider = new THREE.Mesh(riderGeo, riderMat);
    screenRider.position.y = 0.06;
    screenGroup.add(screenRider);

    const screenRod = new THREE.Mesh(rodGeo, rodMat);
    screenRod.position.y = 0.35;
    screenGroup.add(screenRod);

    // White Screen Plate with Dynamic Canvas Texture
    const screenPlateGeo = new THREE.BoxGeometry(0.04, 0.6, 0.6);
    const screenPlateMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
    });
    const screenPlate = new THREE.Mesh(screenPlateGeo, screenPlateMat);
    screenPlate.position.set(0, 0.6, 0);
    screenGroup.add(screenPlate);

    // Screen Front Surface (displays interference fringes)
    const screenFrontGeo = new THREE.PlaneGeometry(0.56, 0.56);
    const screenFrontMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      side: THREE.FrontSide,
    });
    const screenFront = new THREE.Mesh(screenFrontGeo, screenFrontMat);
    screenFront.rotation.y = -Math.PI / 2;
    screenFront.position.set(-0.021, 0.6, 0);
    screenGroup.add(screenFront);

    scene.add(screenGroup);

    // 4. VOLUMETRIC LASER BEAMS (Dynamic Mesh)
    // Primary Beam (Laser -> Slit)
    const primaryBeamGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.7, 16);
    const primaryBeamMat = new THREE.MeshBasicMaterial({
      color: exactColor.threeColor,
      transparent: true,
      opacity: 0.85,
    });
    const primaryBeam = new THREE.Mesh(primaryBeamGeo, primaryBeamMat);
    primaryBeam.rotation.z = Math.PI / 2;
    primaryBeam.position.set(-1.05, 0.6, 0);
    scene.add(primaryBeam);

    // Fan Beam (Slit -> Screen) - Expanding cone/cylinder
    const fanBeamGeo = new THREE.ConeGeometry(0.2, 1.5, 32, 1, true);
    const fanBeamMat = new THREE.MeshBasicMaterial({
      color: exactColor.threeColor,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const fanBeam = new THREE.Mesh(fanBeamGeo, fanBeamMat);
    fanBeam.rotation.z = -Math.PI / 2;
    scene.add(fanBeam);

    // -------------------------------------------------------------
    // RENDER LOOP
    // -------------------------------------------------------------
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Update Screen Position along X mapped from screenDistance (D: 0.5 - 2.5m mapped to X: -0.2 to 1.4)
      const mappedScreenX = -0.7 + (screenDistance / 2.5) * 2.1;
      screenGroup.position.x = mappedScreenX;

      // Update Fan Beam geometry length & position to connect Slit (-0.7) to Screen (mappedScreenX)
      const beamLength = Math.max(0.1, mappedScreenX - (-0.7));
      fanBeam.scale.set(beamLength * 0.4, beamLength, beamLength * 0.4);
      fanBeam.position.set(-0.7 + beamLength / 2, 0.6, 0);

      // Update Laser Visibility & Colors
      if (!isLaserOn) {
        primaryBeam.visible = false;
        fanBeam.visible = false;
        ledMat.color.setHex(0xef4444); // Red LED off
      } else {
        primaryBeam.visible = true;
        fanBeam.visible = true;
        ledMat.color.setHex(0x10b981); // Green LED on

        if (lightMode === 'white') {
          primaryBeamMat.color.setHex(0xffffff);
          fanBeamMat.color.setHex(0xffffff);
          fanBeamMat.opacity = 0.35;
        } else {
          primaryBeamMat.color.copy(exactColor.threeColor);
          fanBeamMat.color.copy(exactColor.threeColor);
          fanBeamMat.opacity = 0.25 + (laserPower / 10) * 0.2;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [screenDistance, isLaserOn, lightMode, exactColor, laserPower]);

  // -------------------------------------------------------------
  // DYNAMIC TEXTURE & EYEPIECE FRINGE RENDERING ENGINE
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = screenTextureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark Background on Screen
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, w, h);

    if (!isLaserOn) {
      if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
      return;
    }

    // Fringe spacing in screen pixels (centered at w/2)
    // Physical width of screen in mm is ~ 50mm, represented by w = 1024px -> ~ 20.48 px / mm
    const pxPerMm = w / 50;
    const iMm = theoreticalFringeSpacing;

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    if (lightMode === 'laser') {
      const { r, g, b } = exactColor;
      const powerMultiplier = (laserPower / 5);

      for (let x = 0; x < w; x++) {
        const xDistMm = (x - w / 2) / pxPerMm;
        // Interference Intensity: I(x) = cos^2(pi * x / i) with diffraction envelope sinc^2(pi * b * x / (lambda * D))
        const phase = (Math.PI * xDistMm) / iMm;
        const cosVal = Math.cos(phase);
        let intensity = cosVal * cosVal;

        // Gaussian spotlight falloff from center
        const falloff = Math.exp(-Math.pow(xDistMm / 15, 2));
        intensity *= falloff * powerMultiplier;
        intensity = Math.min(1.0, intensity);

        const ir = Math.round(r * intensity);
        const ig = Math.round(g * intensity);
        const ib = Math.round(b * intensity);

        for (let y = 0; y < h; y++) {
          const yDistMm = (y - h / 2) / pxPerMm;
          const yFalloff = Math.exp(-Math.pow(yDistMm / 8, 2));

          const idx = (y * w + x) * 4;
          data[idx] = Math.round(ir * yFalloff);
          data[idx + 1] = Math.round(ig * yFalloff);
          data[idx + 2] = Math.round(ib * yFalloff);
          data[idx + 3] = 255;
        }
      }
    } else {
      // White Light Multi-Spectrum Dispersion Synthesis
      const wavelengths = [
        { wl: 410, weight: 0.8 }, // Violet
        { wl: 460, weight: 1.0 }, // Blue
        { wl: 520, weight: 1.1 }, // Green
        { wl: 580, weight: 1.2 }, // Yellow
        { wl: 615, weight: 1.0 }, // Orange
        { wl: 670, weight: 0.9 }, // Red
      ];

      for (let x = 0; x < w; x++) {
        const xDistMm = (x - w / 2) / pxPerMm;
        let totR = 0, totG = 0, totB = 0;

        for (const spec of wavelengths) {
          const specI = (spec.wl * 1e-9 * screenDistance) / (slitSeparation * 1e-3) * 1e3;
          const phase = (Math.PI * xDistMm) / specI;
          const cosVal = Math.cos(phase);
          const intensity = cosVal * cosVal * spec.weight;

          const col = wavelengthToRGB(spec.wl);
          totR += col.r * intensity;
          totG += col.g * intensity;
          totB += col.b * intensity;
        }

        const falloff = Math.exp(-Math.pow(xDistMm / 18, 2));
        totR = Math.min(255, Math.round((totR / wavelengths.length) * 1.5 * falloff));
        totG = Math.min(255, Math.round((totG / wavelengths.length) * 1.5 * falloff));
        totB = Math.min(255, Math.round((totB / wavelengths.length) * 1.5 * falloff));

        for (let y = 0; y < h; y++) {
          const yDistMm = (y - h / 2) / pxPerMm;
          const yFalloff = Math.exp(-Math.pow(yDistMm / 8, 2));

          const idx = (y * w + x) * 4;
          data[idx] = Math.round(totR * yFalloff);
          data[idx + 1] = Math.round(totG * yFalloff);
          data[idx + 2] = Math.round(totB * yFalloff);
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Overlay Measurement Center Reference Grid on Screen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    if (screenTextureRef.current) {
      screenTextureRef.current.needsUpdate = true;
    }
  }, [isLaserOn, lightMode, exactColor, wavelength, screenDistance, slitSeparation, laserPower, theoreticalFringeSpacing]);

  // -------------------------------------------------------------
  // RECORD TRIAL HANDLER
  // -------------------------------------------------------------
  const handleRecordTrial = () => {
    if (recordedX1 === null || recordedX6 === null || measuredFringeSpacing === null || measuredWavelength === null || currentErrorPct === null) {
      alert('Vui lòng dùng Thị Kính lấy đủ 2 mốc tọa độ Vân 1 (x1) và Vân 6 (x6) trước khi ghi dữ liệu!');
      return;
    }

    const newTrial: MeasurementTrial = {
      id: trials.length + 1,
      mode: lightMode,
      wavelengthNominal: wavelength,
      a: slitSeparation,
      D: screenDistance,
      x1: recordedX1,
      x6: recordedX6,
      deltaX: Number(measuredDeltaX!.toFixed(3)),
      iExp: Number(measuredFringeSpacing.toFixed(3)),
      lambdaExp: Number(measuredWavelength.toFixed(1)),
      errorPct: Number(currentErrorPct.toFixed(2)),
    };

    setTrials((prev) => [...prev, newTrial]);
    if (currentStep === 3) setCurrentStep(4);
  };

  // -------------------------------------------------------------
  // AUTO-GRADING 3-TIER SCORING ENGINE
  // -------------------------------------------------------------
  const gradeResult = useMemo(() => {
    if (!isSubmitted) return null;

    // 1. Operation Score (30%): minimum 3 trials
    const operationCount = trials.length;
    let operationScore = 0;
    if (operationCount >= 5) operationScore = 30;
    else if (operationCount >= 3) operationScore = 20 + (operationCount - 3) * 5;
    else operationScore = operationCount * 7;

    // 2. Accuracy Score (40%): Average error <= 5% gets full 40 pts
    let accuracyScore = 0;
    if (trials.length > 0) {
      const avgError = trials.reduce((sum, t) => sum + t.errorPct, 0) / trials.length;
      if (avgError <= 5.0) accuracyScore = 40;
      else if (avgError <= 10.0) accuracyScore = 30;
      else if (avgError <= 20.0) accuracyScore = 20;
      else accuracyScore = 10;
    }

    // 3. Quiz Score (30%): 3 questions * 10 pts
    let quizScore = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) quizScore += 10;
    });

    const totalScore = operationScore + accuracyScore + quizScore;
    return {
      totalScore,
      operationScore,
      accuracyScore,
      quizScore,
      passed: totalScore >= 70,
    };
  }, [isSubmitted, trials, quizAnswers]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none flex flex-col">
      {/* =========================================================
          TOP HEADER BAR
          ========================================================= */}
      <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/thu-vien')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            ← Thư Viện
          </button>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
              Bài 12: Đo Bước Sóng Ánh Sáng (Khe Y-âng 3D)
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                GDPT 2018
              </span>
            </h1>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('bench')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'bench' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔬 Băng Quang Học 3D
          </button>
          <button
            onClick={() => setActiveTab('worksheet')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'worksheet' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Bảng Số Liệu
            {trials.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold">
                {trials.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'quiz' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            📝 Bài Thu Hoạch Quiz
          </button>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomizeProblem}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Đổi sang đề bài thí nghiệm mới với các giá trị λ, a, D ngẫu nhiên"
          >
            <span>🎲</span>
            <span>Đổi Đề Bài Mới</span>
          </button>
          <button
            onClick={() => setIsProblemStatementOpen(!isProblemStatementOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isProblemStatementOpen
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Đóng / Mở Thanh Đề Bài & Hướng Dẫn"
          >
            <span>📌</span>
            <span>{isProblemStatementOpen ? 'Ẩn Đề Bài' : 'Xem Đề Bài'}</span>
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>☰</span>
            <span>{isMenuOpen ? 'Ẩn Menu' : 'Mở Menu'}</span>
          </button>
        </div>
      </header>

      {/* =========================================================
          COLLAPSIBLE PROBLEM STATEMENT & MISSION BANNER
          ========================================================= */}
      {isProblemStatementOpen && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border-b border-blue-500/30 px-6 py-3 z-25 flex-shrink-0 shadow-lg animate-fadeIn">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                  🎯 Yêu Cầu Đề Bài #{targetReq.id}
                </span>
                <span className="text-xs font-extrabold text-white">
                  {targetReq.laserName} — Hãy điều chỉnh thanh trượt đúng với đề bài:
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  isAMatched ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 font-bold' : 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse'
                }`}>
                  {isAMatched ? `✓ a = ${slitSeparation.toFixed(2)} mm` : `⚠️ Cần đặt a = ${targetReq.targetA.toFixed(2)} mm (hiện tại: ${slitSeparation.toFixed(2)})`}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  isDMatched ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 font-bold' : 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse'
                }`}>
                  {isDMatched ? `✓ D = ${screenDistance.toFixed(2)} m` : `⚠️ Cần đặt D = ${targetReq.targetD.toFixed(2)} m (hiện tại: ${screenDistance.toFixed(2)})`}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  isLambdaMatched ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 font-bold' : 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse'
                }`}>
                  {isLambdaMatched ? `✓ λ = ${wavelength} nm` : `⚠️ Cần chọn λ = ${targetReq.targetWavelength} nm (hiện tại: ${wavelength})`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
                <span>
                  <strong className="text-amber-400">Công thức tính:</strong>{' '}
                  <code className="font-mono bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800 text-cyan-300">
                    i = λ·D / a  ⟹  λ = a·i / D
                  </code>{' '}
                  <span className="text-slate-400">(với i = Δx / 5 = |x₆ - x₁| / 5)</span>
                </span>
                <span className="hidden lg:inline text-slate-600">|</span>
                <span className="text-slate-400">
                  {isAllConfigMatched ? (
                    <strong className="text-emerald-400">✓ Đã chỉnh đúng thông số! Hãy dùng Thị kính 10× đo x₁, x₆ ➔ Bấm "Lưu Lần Đo".</strong>
                  ) : (
                    <strong className="text-amber-300">Học sinh hãy tự kéo các thanh trượt bên phải để khớp với đề bài trước khi đo.</strong>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              {!isAllConfigMatched && (
                <button
                  onClick={handleApplyTargetSettings}
                  className="px-2.5 py-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  title="Tự động gán đúng các thông số của đề bài"
                >
                  <span>⚡</span>
                  <span>Căn Chỉnh Nhanh</span>
                </button>
              )}
              <button
                onClick={handleRandomizeProblem}
                className="px-3 py-1 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
                title="Đổi sang đề bài thí nghiệm mới ngẫu nhiên"
              >
                <span>🎲</span>
                <span>Đổi Đề Mới</span>
              </button>
              <button
                onClick={() => setIsProblemStatementOpen(false)}
                className="px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700/50 transition cursor-pointer flex items-center gap-1"
              >
                <span>Thu gọn</span>
                <span>▴</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MAIN WORKSPACE
          ========================================================= */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* TAB 1: 3D OPTICAL BENCH VIEW */}
        {activeTab === 'bench' && (
          <div className="w-full h-full relative">
            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

            {/* Left 5-Step Guided Workflow Banner */}
            <div className="absolute top-4 left-4 z-20 max-w-sm bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 shadow-xl space-y-2.5 pointer-events-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  Quy Trình 5 Bước Thực Hành
                </span>
                <span className="text-[10px] font-mono text-slate-400">Bước {currentStep}/5</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{STEPS[currentStep - 1].title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{STEPS[currentStep - 1].desc}</div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-semibold cursor-pointer"
                >
                  ← Trước
                </button>
                <button
                  disabled={currentStep === 5}
                  onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
                  className="px-2.5 py-1 text-[11px] rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 font-bold text-white cursor-pointer"
                >
                  Tiếp Theo →
                </button>
              </div>
            </div>

            {/* =========================================================
                BOTTOM-LEFT: EYEPIECE MEASURING MICROSCOPE HUD
                ========================================================= */}
            {isEyepieceOpen && (
              <div className="absolute bottom-4 left-4 z-20 w-80 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-2xl space-y-3 pointer-events-auto animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🔍</span>
                    <span className="text-xs font-extrabold text-white">Thị Kính Đo Vi Trắc (10×)</span>
                  </div>
                  <button
                    onClick={() => setIsEyepieceOpen(false)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Circular Reticle Viewer with Fringes and Draggable Crosshair */}
                <div
                  className="relative h-32 w-full rounded-xl bg-black overflow-hidden border border-slate-700 flex items-center justify-center cursor-ew-resize"
                  onMouseDown={(e) => {
                    setIsDraggingCrosshair(true);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const mmVal = ((clickX - rect.width / 2) / (rect.width / 2)) * 6; // +/- 6 mm view
                    setCrosshairPos(Number(mmVal.toFixed(2)));
                  }}
                  onMouseMove={(e) => {
                    if (!isDraggingCrosshair) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const mmVal = ((clickX - rect.width / 2) / (rect.width / 2)) * 6;
                    setCrosshairPos(Math.max(-6, Math.min(6, Number(mmVal.toFixed(2)))));
                  }}
                  onMouseUp={() => setIsDraggingCrosshair(false)}
                  onMouseLeave={() => setIsDraggingCrosshair(false)}
                >
                  {/* Background Simulated Reticle Ticks */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                    <div className="w-full h-px bg-white" />
                    <div className="h-full w-px bg-white absolute" />
                  </div>

                  {/* Interference Pattern Overlay in Eyepiece */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        lightMode === 'laser'
                          ? `repeating-linear-gradient(90deg, transparent, transparent ${
                              theoreticalFringeSpacing * 12
                            }px, ${exactColor.hex} ${theoreticalFringeSpacing * 12 + 2}px, transparent ${
                              theoreticalFringeSpacing * 12 + 4
                            }px)`
                          : 'linear-gradient(90deg, violet, blue, green, yellow, orange, red, white, red, orange, yellow, green, blue, violet)',
                      opacity: isLaserOn ? (lightMode === 'laser' ? 0.75 : 0.6) : 0,
                    }}
                  />

                  {/* Draggable Vertical Red Crosshair */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] pointer-events-none z-10"
                    style={{
                      left: `calc(50% + ${(crosshairPos / 6) * 50}%)`,
                    }}
                  >
                    <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-rose-500 rounded-full border border-white text-[8px] flex items-center justify-center text-white font-bold">
                      •
                    </div>
                  </div>

                  {/* Center Zero Marker */}
                  <div className="absolute bottom-1 text-[9px] font-mono text-slate-400 pointer-events-none">
                    Tọa độ x = {crosshairPos > 0 ? `+${crosshairPos}` : crosshairPos} mm
                  </div>
                </div>

                {/* Micrometer Dial Stepper Controls */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={() => setCrosshairPos((p) => Number(Math.max(-6, p - 0.05).toFixed(2)))}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono cursor-pointer"
                  >
                    ◀ -0.05mm
                  </button>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    x = {crosshairPos.toFixed(2)} mm
                  </span>
                  <button
                    onClick={() => setCrosshairPos((p) => Number(Math.min(6, p + 0.05).toFixed(2)))}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono cursor-pointer"
                  >
                    +0.05mm ▶
                  </button>
                </div>

                {/* Coordinate Capture Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => setRecordedX1(crosshairPos)}
                    className="py-1.5 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex flex-col items-center cursor-pointer"
                  >
                    <span>Lấy Vân 1 (x₁)</span>
                    <span className="font-mono text-[10px] text-white">
                      {recordedX1 !== null ? `${recordedX1} mm` : '--'}
                    </span>
                  </button>
                  <button
                    onClick={() => setRecordedX6(crosshairPos)}
                    className="py-1.5 px-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex flex-col items-center cursor-pointer"
                  >
                    <span>Lấy Vân 6 (x₆)</span>
                    <span className="font-mono text-[10px] text-white">
                      {recordedX6 !== null ? `${recordedX6} mm` : '--'}
                    </span>
                  </button>
                </div>

                {/* Real-time Calculation Summary */}
                {measuredFringeSpacing !== null && (
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Δx = |x₆ - x₁|:</span>
                      <span className="font-mono font-bold text-white">{measuredDeltaX?.toFixed(2)} mm</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Khoảng vân i = Δx / 5:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {measuredFringeSpacing.toFixed(3)} mm
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Bước sóng λ = ai/D:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {measuredWavelength?.toFixed(1)} nm
                      </span>
                    </div>
                    <button
                      onClick={handleRecordTrial}
                      className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition shadow-md cursor-pointer"
                    >
                      💾 Lưu Vào Bảng Số Liệu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================
                BOTTOM-RIGHT: WAVE INTENSITY GRAPH I(x)
                ========================================================= */}
            {isGraphOpen && (
              <div className="absolute bottom-4 right-4 z-20 w-80 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-2xl space-y-2 pointer-events-auto animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📊</span>
                    <span className="text-xs font-extrabold text-white">
                      Đồ Thị Cường Độ Sáng I(x) = I₀cos²(πax/λD)
                    </span>
                  </div>
                  <button
                    onClick={() => setIsGraphOpen(false)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* SVG Live Cos^2 Graph */}
                <div className="h-28 w-full bg-slate-950 rounded-xl border border-slate-800 p-1 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="150" y1="0" x2="150" y2="100" stroke="#475569" strokeWidth="1" />

                    {/* Live Wave Curve */}
                    <path
                      d={(() => {
                        let pathStr = 'M 0 ';
                        const iScale = (theoreticalFringeSpacing / 1.5) * 30; // normalized visual scale
                        for (let px = 0; px <= 300; px += 2) {
                          const xDist = (px - 150) / iScale;
                          const cosVal = Math.cos(Math.PI * xDist);
                          const intensity = cosVal * cosVal;
                          const py = 85 - intensity * 70;
                          pathStr += `${px === 0 ? '' : 'L '}${px} ${py} `;
                        }
                        return pathStr;
                      })()}
                      fill="none"
                      stroke={lightMode === 'laser' ? exactColor.hex : '#38bdf8'}
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="absolute top-1 right-2 text-[9px] font-mono text-slate-400">I_max</span>
                  <span className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-400">x (mm)</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Khoảng vân lý thuyết i:</span>
                  <span className="font-mono font-bold text-blue-400">
                    {theoreticalFringeSpacing.toFixed(3)} mm
                  </span>
                </div>
              </div>
            )}

            {/* =========================================================
                RIGHT COLLAPSIBLE CONTROL DRAWER
                ========================================================= */}
            {isMenuOpen && (
              <div className="absolute top-4 right-4 z-20 w-84 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl space-y-4 pointer-events-auto max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Bảng Điều Khiển Quang Học
                  </h3>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Random Scenario Generator Button */}
                <button
                  onClick={handleRandomizeProblem}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🎲</span>
                  <span>Đổi Đề Bài Mới (Random Thông Số)</span>
                </button>

                {/* 1. Laser Power & Light Mode Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Nguồn Phát Sáng:</span>
                    <button
                      onClick={() => setIsLaserOn(!isLaserOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                        isLaserOn ? 'bg-emerald-600 text-white shadow-md' : 'bg-rose-900 text-rose-300'
                      }`}
                    >
                      {isLaserOn ? '● BẬT (ON)' : '○ TẮT (OFF)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setLightMode('laser')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        lightMode === 'laser'
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      Laser Đơn Sắc
                    </button>
                    <button
                      onClick={() => setLightMode('white')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        lightMode === 'white'
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      🌈 Ánh Sáng Trắng
                    </button>
                  </div>
                </div>

                {/* 2. Monochromatic Wavelength Slider (only for laser mode) */}
                {lightMode === 'laser' && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Bước sóng Laser (λ):</span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: exactColor.hex }}>
                        {wavelength} nm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={380}
                      max={780}
                      step={1}
                      value={wavelength}
                      onChange={(e) => setWavelength(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>380nm (Tím)</span>
                      <span>532nm (Lục)</span>
                      <span>633nm (Đỏ)</span>
                      <span>780nm</span>
                    </div>
                  </div>
                )}

                {/* 3. Slit Separation Slider (a in mm) */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Khoảng cách 2 khe (a):</span>
                    <span className="font-mono font-bold text-blue-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {slitSeparation.toFixed(2)} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.15}
                    max={1.00}
                    step={0.05}
                    value={slitSeparation}
                    onChange={(e) => setSlitSeparation(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0.15 mm</span>
                    <span>0.50 mm</span>
                    <span>1.00 mm</span>
                  </div>
                </div>

                {/* 4. Screen Distance Slider (D in m) */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Khoảng cách màn (D):</span>
                    <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {screenDistance.toFixed(2)} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.50}
                    max={2.50}
                    step={0.05}
                    value={screenDistance}
                    onChange={(e) => setScreenDistance(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0.50 m</span>
                    <span>1.20 m</span>
                    <span>2.50 m</span>
                  </div>
                </div>

                {/* HUD View Toggles */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Công Cụ Đo Trực Quan</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsEyepieceOpen(!isEyepieceOpen)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        isEyepieceOpen ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {isEyepieceOpen ? '✓ Thị Kính 10×' : '+ Thị Kính 10×'}
                    </button>
                    <button
                      onClick={() => setIsGraphOpen(!isGraphOpen)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        isGraphOpen ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {isGraphOpen ? '✓ Đồ Thị I(x)' : '+ Đồ Thị I(x)'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 2: EXPERIMENTAL DATA WORKSHEET
            ========================================================= */}
        {activeTab === 'worksheet' && (
          <div className="w-full h-full overflow-y-auto p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">Bảng Số Liệu Báo Cáo Thí Nghiệm</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Đo khoảng vân i và xác định bước sóng ánh sáng λ theo công thức λ = a * i / D
                </p>
              </div>
              <button
                onClick={() => setActiveTab('bench')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                + Thực Hiện Đo Mới (3D)
              </button>
            </div>

            {/* Trials Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Lần</th>
                    <th className="p-3">Nguồn</th>
                    <th className="p-3">a (mm)</th>
                    <th className="p-3">D (m)</th>
                    <th className="p-3">x₁ (mm)</th>
                    <th className="p-3">x₆ (mm)</th>
                    <th className="p-3">Δx (mm)</th>
                    <th className="p-3">i = Δx/5 (mm)</th>
                    <th className="p-3 text-amber-400">λ_exp (nm)</th>
                    <th className="p-3">Sai số (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {trials.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-500 text-sm">
                        Chưa có dữ liệu lần đo nào. Hãy chuyển sang tab "Băng Quang Học 3D", dùng thị kính đo và nhấn "Lưu Vào Bảng Số Liệu"!
                      </td>
                    </tr>
                  ) : (
                    trials.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-blue-400">#{t.id}</td>
                        <td className="p-3">{t.mode === 'laser' ? `Laser (${t.wavelengthNominal}nm)` : 'Ánh sáng trắng'}</td>
                        <td className="p-3 font-mono">{t.a}</td>
                        <td className="p-3 font-mono">{t.D}</td>
                        <td className="p-3 font-mono">{t.x1}</td>
                        <td className="p-3 font-mono">{t.x6}</td>
                        <td className="p-3 font-mono font-semibold">{t.deltaX}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">{t.iExp}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">{t.lambdaExp}</td>
                        <td className="p-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.errorPct <= 5.0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50' : 'bg-amber-950 text-amber-400'
                          }`}>
                            {t.errorPct}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Statistical Summary Box */}
            {trials.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Số Lần Đo Thành Công</div>
                  <div className="text-2xl font-extrabold text-white mt-1">{trials.length} / 5</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">
                    {trials.length >= 3 ? '✓ Đạt yêu cầu thực hành' : 'Cần đo tối thiểu 3 lần'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Bước Sóng Trung Bình (λ̄)</div>
                  <div className="text-2xl font-extrabold text-amber-400 mt-1">
                    {(trials.reduce((sum, t) => sum + t.lambdaExp, 0) / trials.length).toFixed(1)} nm
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Lý thuyết: {wavelength} nm
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Sai Số Trung Bình (δ%)</div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                    {(trials.reduce((sum, t) => sum + t.errorPct, 0) / trials.length).toFixed(2)}%
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">
                    Chuẩn GDPT 2018 (≤ 5%)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: POST-LAB QUIZ & AUTO-GRADING
            ========================================================= */}
        {activeTab === 'quiz' && (
          <div className="w-full h-full overflow-y-auto p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">Bài Thu Hoạch & Đánh Giá Tự Động 3-Tier</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Đánh giá toàn diện: Thao tác (30%) + Độ chính xác (40%) + Trắc nghiệm hiểu sâu (30%)
                </p>
              </div>
            </div>

            {/* Quiz Questions List */}
            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, qIndex) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-relaxed">{q.question}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = quizAnswers[q.id] === optIndex;
                      const isCorrect = isSubmitted && optIndex === q.correct;
                      const isWrong = isSubmitted && isSelected && !isCorrect;

                      return (
                        <button
                          key={optIndex}
                          disabled={isSubmitted}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIndex }))}
                          className={`p-3 text-left text-xs rounded-xl border transition cursor-pointer flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                              : isWrong
                              ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                              : isSelected
                              ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-semibold'
                              : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-mono">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-emerald-400">Giải thích: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submission CTA */}
            {!isSubmitted ? (
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsSubmitted(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition cursor-pointer"
                >
                  Nộp Bài & Nhận Điểm Số Đánh Giá →
                </button>
              </div>
            ) : (
              gradeResult && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/40 shadow-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-white">Kết Quả Đánh Giá Thực Hành VisualLab</h3>
                      <p className="text-xs text-slate-400">Tiêu chuẩn kiểm định SGK GDPT 2018</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        {gradeResult.totalScore} / 100 Điểm
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        gradeResult.passed ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {gradeResult.passed ? '✓ ĐẠT CHUẨN THỰC HÀNH' : '✗ CHƯA ĐẠT'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400">1. Thao tác (30%):</span>
                      <div className="text-base font-bold text-white mt-0.5">{gradeResult.operationScore} / 30</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400">2. Độ chính xác (40%):</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{gradeResult.accuracyScore} / 40</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400">3. Trắc nghiệm (30%):</span>
                      <div className="text-base font-bold text-blue-400 mt-0.5">{gradeResult.quizScore} / 30</div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaveInterferenceLab;
