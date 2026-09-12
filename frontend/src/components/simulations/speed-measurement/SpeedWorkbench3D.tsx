import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { calculateTheoreticalAcceleration } from './speedLabEngine';

export interface SpeedWorkbench3DHandle {
  getCanvasDataURL: () => string;
}

interface SpeedWorkbench3DProps {
  trackAngleDeg: number;
  gateEPosCm: number;
  gateFPosCm: number;
  onGateEChange?: (cm: number) => void;
  onGateFChange?: (cm: number) => void;
  isBallReleased: boolean;
  onBallPassGateE: () => void;
  onBallPassGateF: () => void;
  onBallReachEnd: () => void;
  wireEConnected: boolean;
  wireFConnected: boolean;
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED';
}

export const SpeedWorkbench3D = forwardRef<SpeedWorkbench3DHandle, SpeedWorkbench3DProps>(({
  trackAngleDeg,
  gateEPosCm,
  gateFPosCm,
  isBallReleased,
  onBallPassGateE,
  onBallPassGateF,
  onBallReachEnd,
  wireEConnected,
  wireFConnected,
  mode,
}, ref) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // 3D Object Group References
  const trackGroupRef = useRef<THREE.Group | null>(null);
  const ballMeshRef = useRef<THREE.Mesh | null>(null);
  const gateEMeshRef = useRef<THREE.Group | null>(null);
  const gateFMeshRef = useRef<THREE.Group | null>(null);
  const beamEMeshRef = useRef<THREE.Line | null>(null);
  const beamFMeshRef = useRef<THREE.Line | null>(null);
  const wireEMeshRef = useRef<THREE.Mesh | null>(null);
  const wireFMeshRef = useRef<THREE.Mesh | null>(null);
  const standGroupRef = useRef<THREE.Group | null>(null);
  const clampMeshRef = useRef<THREE.Mesh | null>(null);

  // Ball kinematics state for 60 FPS loop
  const animFrameIdRef = useRef<number | null>(null);
  const ballPosCmRef = useRef<number>(0); // cm along track (0 to 100)
  const ballVelocityRef = useRef<number>(0); // cm/s
  const lastTimeRef = useRef<number | null>(null);
  const hasTriggeredERef = useRef<boolean>(false);
  const hasTriggeredFRef = useRef<boolean>(false);

  // Track physical dimensions in Three.js units (1 Three.js unit = 10 cm = 0.1m)
  // Track length = 100 cm = 10 units.
  const TRACK_LENGTH = 10.0;
  const BALL_RADIUS = 0.15; // 1.5 cm radius = 3.0 cm diameter scale

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

  // Create Ruler Texture with Millimeter Marks and Numbers
  const createRulerTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background aluminum brushed metallic tint
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, '#f1f5f9');
    grad.addColorStop(0.5, '#e2e8f0');
    grad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 128);

    // Top border groove
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 2048, 4);
    ctx.fillRect(0, 124, 2048, 4);

    // Ruler markings: 0 to 100 cm across 2048px width
    const totalCm = 100;
    const pxPerCm = 2048 / totalCm;

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let cm = 0; cm <= totalCm; cm++) {
      const x = cm * pxPerCm;

      // 10cm major tick + text
      if (cm % 10 === 0) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x - 1.5, 4, 3, 36);
        ctx.font = 'bold 24px monospace';
        ctx.fillText(`${cm}`, x, 44);
      } else if (cm % 5 === 0) {
        // 5cm medium tick
        ctx.fillStyle = '#334155';
        ctx.fillRect(x - 1, 4, 2, 24);
      } else {
        // 1cm minor tick
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x - 0.5, 4, 1, 14);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.025);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 6, 12);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 22;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controls.target.set(0, 1.5, 0);
    controlsRef.current = controls;

    // 5. Lighting Setup (Laboratory Studio Setup)
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);

    const mainSpotLight = new THREE.SpotLight('#e0f2fe', 3.5, 30, Math.PI / 4, 0.4, 1);
    mainSpotLight.position.set(5, 12, 8);
    mainSpotLight.castShadow = true;
    mainSpotLight.shadow.mapSize.width = 2048;
    mainSpotLight.shadow.mapSize.height = 2048;
    mainSpotLight.shadow.bias = -0.0001;
    scene.add(mainSpotLight);

    const fillLight = new THREE.DirectionalLight('#38bdf8', 1.0);
    fillLight.position.set(-8, 6, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#818cf8', 1.2);
    rimLight.position.set(0, 4, -8);
    scene.add(rimLight);

    // 6. Workbench Table / Ground Platform with Grid
    const floorGeo = new THREE.PlaneGeometry(30, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(24, 24, new THREE.Color('#0284c7'), new THREE.Color('#1e293b'));
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 7. Laboratory Vertical Stand (Giá Đỡ Thí Nghiệm Thẳng Đứng)
    const standGroup = new THREE.Group();
    // Stand Heavy Base (Gang đúc)
    const standBaseGeo = new THREE.BoxGeometry(1.6, 0.15, 1.2);
    const standBaseMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7, metalness: 0.6 });
    const standBase = new THREE.Mesh(standBaseGeo, standBaseMat);
    standBase.position.set(-4.5, 0.075, 0);
    standBase.castShadow = true;
    standBase.receiveShadow = true;
    standGroup.add(standBase);

    // Vertical Stainless Steel Rod (Trụ Thép)
    const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 6.0, 32);
    const rodMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.95, roughness: 0.15 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.position.set(-4.5, 3.0, 0);
    rod.castShadow = true;
    standGroup.add(rod);

    // Height Clamp (Khớp Nối Di Động)
    const clampGeo = new THREE.BoxGeometry(0.3, 0.3, 0.4);
    const clampMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.5, roughness: 0.4 });
    const clamp = new THREE.Mesh(clampGeo, clampMat);
    clamp.position.set(-4.5, 2.5, 0);
    clamp.castShadow = true;
    standGroup.add(clamp);
    clampMeshRef.current = clamp;

    scene.add(standGroup);
    standGroupRef.current = standGroup;

    // 8. Track Assembly (Máng Nghiêng Nhôm Định Hình Kèm Thước)
    const trackGroup = new THREE.Group();

    // Aluminum Track Extrusion Profile
    // Main rail body (10 units length)
    const rulerTexture = createRulerTexture();
    const railMat = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      metalness: 0.85,
      roughness: 0.25,
      map: rulerTexture || undefined,
    });

    const railGeo = new THREE.BoxGeometry(TRACK_LENGTH, 0.15, 0.8);
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(TRACK_LENGTH / 2, 0.075, 0);
    railMesh.castShadow = true;
    railMesh.receiveShadow = true;
    trackGroup.add(railMesh);

    // Ball Groove / Guide Rails (2 side rails forming a center groove)
    const sideRailGeo = new THREE.BoxGeometry(TRACK_LENGTH, 0.08, 0.08);
    const sideRailMat = new THREE.MeshStandardMaterial({ color: '#0284c7', metalness: 0.9, roughness: 0.1 });
    
    const sideRail1 = new THREE.Mesh(sideRailGeo, sideRailMat);
    sideRail1.position.set(TRACK_LENGTH / 2, 0.18, -0.32);
    sideRail1.castShadow = true;
    trackGroup.add(sideRail1);

    const sideRail2 = new THREE.Mesh(sideRailGeo, sideRailMat);
    sideRail2.position.set(TRACK_LENGTH / 2, 0.18, 0.32);
    sideRail2.castShadow = true;
    trackGroup.add(sideRail2);

    // Bottom Bumper Stop Cushion (Đệm cao su chặn cuối máng)
    const bumperGeo = new THREE.BoxGeometry(0.12, 0.35, 0.8);
    const bumperMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.6 });
    const bumper = new THREE.Mesh(bumperGeo, bumperMat);
    bumper.position.set(TRACK_LENGTH + 0.06, 0.175, 0);
    bumper.castShadow = true;
    trackGroup.add(bumper);

    // Release Plunger / Lever at Top (Cơ chế nhả bi ở vạch 0)
    const releaseBaseGeo = new THREE.BoxGeometry(0.2, 0.3, 0.7);
    const releaseBaseMat = new THREE.MeshStandardMaterial({ color: '#0369a1', metalness: 0.7, roughness: 0.3 });
    const releaseBase = new THREE.Mesh(releaseBaseGeo, releaseBaseMat);
    releaseBase.position.set(0.1, 0.18, 0);
    trackGroup.add(releaseBase);

    // 9. Chrome Steel Ball (Viên Bi Thép PBR Siêu Bóng)
    const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0.98,
      roughness: 0.04,
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.position.set(0.3, 0.15 + BALL_RADIUS, 0);
    ballMesh.castShadow = true;
    trackGroup.add(ballMesh);
    ballMeshRef.current = ballMesh;

    // Helper: Build U-Shaped Photogate Assembly
    const createPhotogateMesh = (gateColor: string) => {
      const gateGroup = new THREE.Group();

      // Base clamp block onto track
      const baseClampGeo = new THREE.BoxGeometry(0.3, 0.25, 1.1);
      const baseClampMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5, metalness: 0.5 });
      const baseClamp = new THREE.Mesh(baseClampGeo, baseClampMat);
      baseClamp.position.set(0, 0.1, 0);
      baseClamp.castShadow = true;
      gateGroup.add(baseClamp);

      // Left Pillar (Transmitter)
      const pillarGeo = new THREE.BoxGeometry(0.18, 0.8, 0.18);
      const gateMat = new THREE.MeshStandardMaterial({ color: gateColor, roughness: 0.3, metalness: 0.4 });

      const pillarLeft = new THREE.Mesh(pillarGeo, gateMat);
      pillarLeft.position.set(0, 0.5, -0.45);
      pillarLeft.castShadow = true;
      gateGroup.add(pillarLeft);

      // Right Pillar (Receiver)
      const pillarRight = new THREE.Mesh(pillarGeo, gateMat);
      pillarRight.position.set(0, 0.5, 0.45);
      pillarRight.castShadow = true;
      gateGroup.add(pillarRight);

      // Top Cross Arch Bridge
      const archGeo = new THREE.BoxGeometry(0.18, 0.15, 1.08);
      const arch = new THREE.Mesh(archGeo, gateMat);
      arch.position.set(0, 0.9, 0);
      arch.castShadow = true;
      gateGroup.add(arch);

      // Optical Laser Infrared Beam (Red line across gap)
      const beamGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.35, -0.38),
        new THREE.Vector3(0, 0.35, 0.38),
      ]);
      const beamMat = new THREE.LineBasicMaterial({ color: '#ef4444', linewidth: 2 });
      const beamLine = new THREE.Line(beamGeo, beamMat);
      gateGroup.add(beamLine);

      // Indicator LED (Top of arch)
      const ledGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16);
      const ledMat = new THREE.MeshBasicMaterial({ color: '#22c55e' });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0, 0.98, 0);
      gateGroup.add(led);

      return { gateGroup, beamLine };
    };

    // 10. Gate E (Blue Accent)
    const gateEObj = createPhotogateMesh('#0284c7');
    trackGroup.add(gateEObj.gateGroup);
    gateEMeshRef.current = gateEObj.gateGroup;
    beamEMeshRef.current = gateEObj.beamLine;

    // 11. Gate F (Orange Accent)
    const gateFObj = createPhotogateMesh('#ea580c');
    trackGroup.add(gateFObj.gateGroup);
    gateFMeshRef.current = gateFObj.gateGroup;
    beamFMeshRef.current = gateFObj.beamLine;

    scene.add(trackGroup);
    trackGroupRef.current = trackGroup;

    // 12. Digital Timer Bench Box (Đồng hồ đo hiện số trên bàn)
    const timerBoxGroup = new THREE.Group();
    // Chassis
    const timerChassisGeo = new THREE.BoxGeometry(2.0, 0.45, 1.3);
    const timerChassisMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.5 });
    const timerChassis = new THREE.Mesh(timerChassisGeo, timerChassisMat);
    timerChassis.position.set(0, 0.225, 0);
    timerChassis.castShadow = true;
    timerChassis.receiveShadow = true;
    timerBoxGroup.add(timerChassis);

    // Front LCD Screen Panel
    const lcdScreenGeo = new THREE.BoxGeometry(1.2, 0.28, 0.05);
    const lcdScreenMat = new THREE.MeshStandardMaterial({ color: '#064e3b', roughness: 0.2, metalness: 0.1 });
    const lcdScreen = new THREE.Mesh(lcdScreenGeo, lcdScreenMat);
    lcdScreen.position.set(0, 0.28, 0.65);
    timerBoxGroup.add(lcdScreen);

    // Socket E Port (Cyan)
    const socketEGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
    const socketEMat = new THREE.MeshStandardMaterial({ color: '#0284c7', metalness: 0.8, roughness: 0.2 });
    const socketE = new THREE.Mesh(socketEGeo, socketEMat);
    socketE.rotation.x = Math.PI / 2;
    socketE.position.set(-0.6, 0.15, 0.65);
    timerBoxGroup.add(socketE);

    // Socket F Port (Orange)
    const socketFGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
    const socketFMat = new THREE.MeshStandardMaterial({ color: '#ea580c', metalness: 0.8, roughness: 0.2 });
    const socketF = new THREE.Mesh(socketFGeo, socketFMat);
    socketF.rotation.x = Math.PI / 2;
    socketF.position.set(0.6, 0.15, 0.65);
    timerBoxGroup.add(socketF);

    timerBoxGroup.position.set(0.5, 0, 2.0);
    scene.add(timerBoxGroup);

    // 13. 3D Flexible Signal Cables (Connecting Gates to Bench Timer Box)
    const wireMatE = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.5 });
    const wireGeoE = new THREE.BufferGeometry();
    const wireMeshE = new THREE.Mesh(wireGeoE, wireMatE);
    scene.add(wireMeshE);
    wireEMeshRef.current = wireMeshE;

    const wireMatF = new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.5 });
    const wireGeoF = new THREE.BufferGeometry();
    const wireMeshF = new THREE.Mesh(wireGeoF, wireMatF);
    scene.add(wireMeshF);
    wireFMeshRef.current = wireMeshF;

    // 14. Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 15. Render / Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [createRulerTexture]);

  // Update Track Angle & Stand Clamp Position
  useEffect(() => {
    if (!trackGroupRef.current || !clampMeshRef.current) return;

    const angleRad = (trackAngleDeg * Math.PI) / 180;
    const topX = -4.5;
    const topY = TRACK_LENGTH * Math.sin(angleRad) + 0.2;

    trackGroupRef.current.position.set(topX, topY, 0);
    trackGroupRef.current.rotation.z = -angleRad;

    // Adjust Stand Clamp position to meet the top of the track
    clampMeshRef.current.position.set(-4.5, topY, 0);
  }, [trackAngleDeg]);

  // Update Gate Positions along Track
  useEffect(() => {
    // Gate E: gateEPosCm (0 to 100 cm -> 0 to 10.0 units)
    if (gateEMeshRef.current) {
      const eUnits = (gateEPosCm / 100) * TRACK_LENGTH;
      gateEMeshRef.current.position.set(eUnits, 0, 0);
    }

    // Gate F: gateFPosCm (0 to 100 cm -> 0 to 10.0 units)
    if (gateFMeshRef.current) {
      const fUnits = (gateFPosCm / 100) * TRACK_LENGTH;
      gateFMeshRef.current.position.set(fUnits, 0, 0);
      gateFMeshRef.current.visible = mode === 'AVERAGE_SPEED';
    }
  }, [gateEPosCm, gateFPosCm, mode]);

  // Update Dynamic 3D Cables with Realistic Catenary Droop
  useEffect(() => {
    if (!trackGroupRef.current || !sceneRef.current) return;

    const timerSocketEWorld = new THREE.Vector3(0.5 - 0.6, 0.15, 2.0 + 0.65);
    const timerSocketFWorld = new THREE.Vector3(0.5 + 0.6, 0.15, 2.0 + 0.65);

    // Gate E Cable
    if (gateEMeshRef.current && wireEMeshRef.current && wireEConnected) {
      const gateEWorld = new THREE.Vector3();
      gateEMeshRef.current.getWorldPosition(gateEWorld);
      // Socket on side of gate E (+Z pillar)
      const startE = new THREE.Vector3(gateEWorld.x, gateEWorld.y + 0.4, gateEWorld.z + 0.45);
      const droop1E = new THREE.Vector3(gateEWorld.x + 0.2, Math.max(0.06, gateEWorld.y * 0.4), gateEWorld.z + 0.8);
      const droop2E = new THREE.Vector3((startE.x + timerSocketEWorld.x) / 2, 0.04, (startE.z + timerSocketEWorld.z) / 2);
      const leadInE = new THREE.Vector3(timerSocketEWorld.x, 0.08, timerSocketEWorld.z + 0.3);

      const curveE = new THREE.CatmullRomCurve3([startE, droop1E, droop2E, leadInE, timerSocketEWorld]);
      wireEMeshRef.current.geometry.dispose();
      wireEMeshRef.current.geometry = new THREE.TubeGeometry(curveE, 32, 0.025, 8, false);
      wireEMeshRef.current.visible = true;
    } else if (wireEMeshRef.current) {
      wireEMeshRef.current.visible = false;
    }

    // Gate F Cable
    if (gateFMeshRef.current && wireFMeshRef.current && wireFConnected && mode === 'AVERAGE_SPEED') {
      const gateFWorld = new THREE.Vector3();
      gateFMeshRef.current.getWorldPosition(gateFWorld);
      // Socket on side of gate F (+Z pillar)
      const startF = new THREE.Vector3(gateFWorld.x, gateFWorld.y + 0.4, gateFWorld.z + 0.45);
      const droop1F = new THREE.Vector3(gateFWorld.x + 0.2, Math.max(0.06, gateFWorld.y * 0.4), gateFWorld.z + 0.8);
      const droop2F = new THREE.Vector3((startF.x + timerSocketFWorld.x) / 2, 0.04, (startF.z + timerSocketFWorld.z) / 2);
      const leadInF = new THREE.Vector3(timerSocketFWorld.x, 0.08, timerSocketFWorld.z + 0.3);

      const curveF = new THREE.CatmullRomCurve3([startF, droop1F, droop2F, leadInF, timerSocketFWorld]);
      wireFMeshRef.current.geometry.dispose();
      wireFMeshRef.current.geometry = new THREE.TubeGeometry(curveF, 32, 0.025, 8, false);
      wireFMeshRef.current.visible = true;
    } else if (wireFMeshRef.current) {
      wireFMeshRef.current.visible = false;
    }
  }, [trackAngleDeg, gateEPosCm, gateFPosCm, wireEConnected, wireFConnected, mode]);

  // Ball Kinematics & Optical Sensor Interception Simulation
  useEffect(() => {
    let animationId: number;

    if (!isBallReleased) {
      // Reset ball position to top of track
      ballPosCmRef.current = 0;
      ballVelocityRef.current = 0;
      lastTimeRef.current = null;
      hasTriggeredERef.current = false;
      hasTriggeredFRef.current = false;

      if (ballMeshRef.current) {
        const xUnits = 0.3; // Start near top
        ballMeshRef.current.position.set(xUnits, 0.15 + BALL_RADIUS, 0);
        ballMeshRef.current.rotation.set(0, 0, 0);
      }
      return;
    }

    // Ball is released -> calculate theoretical acceleration: a = g * sin(alpha) in cm/s^2
    const accelCmS2 = calculateTheoreticalAcceleration(trackAngleDeg) * 100;

    const runPhysicsLoop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // seconds
      lastTimeRef.current = timestamp;

      // Update kinematics
      ballVelocityRef.current += accelCmS2 * dt;
      ballPosCmRef.current += ballVelocityRef.current * dt;

      // Update 3D Mesh
      if (ballMeshRef.current) {
        const xUnits = (ballPosCmRef.current / 100) * TRACK_LENGTH + 0.3;
        ballMeshRef.current.position.set(Math.min(xUnits, TRACK_LENGTH), 0.15 + BALL_RADIUS, 0);

        // Realistic Rolling Ball Rotation: dTheta = dx / radius
        const dTheta = (ballVelocityRef.current * dt) / (BALL_RADIUS * 10);
        ballMeshRef.current.rotation.z -= dTheta;
      }

      // Optical Trigger Checks
      // Check Gate E
      if (!hasTriggeredERef.current && ballPosCmRef.current >= gateEPosCm) {
        hasTriggeredERef.current = true;
        onBallPassGateE();
        // Laser beam flash effect
        if (beamEMeshRef.current) {
          (beamEMeshRef.current.material as THREE.LineBasicMaterial).color.set('#22c55e');
          setTimeout(() => {
            if (beamEMeshRef.current) {
              (beamEMeshRef.current.material as THREE.LineBasicMaterial).color.set('#ef4444');
            }
          }, 150);
        }
      }

      // Check Gate F (in Average Speed mode)
      if (
        mode === 'AVERAGE_SPEED' &&
        !hasTriggeredFRef.current &&
        ballPosCmRef.current >= gateFPosCm
      ) {
        hasTriggeredFRef.current = true;
        onBallPassGateF();
        // Laser beam flash effect
        if (beamFMeshRef.current) {
          (beamFMeshRef.current.material as THREE.LineBasicMaterial).color.set('#22c55e');
          setTimeout(() => {
            if (beamFMeshRef.current) {
              (beamFMeshRef.current.material as THREE.LineBasicMaterial).color.set('#ef4444');
            }
          }, 150);
        }
      }

      // Check End of Track
      if (ballPosCmRef.current >= 98) {
        onBallReachEnd();
        return; // Ball stops at bumper
      }

      animationId = requestAnimationFrame(runPhysicsLoop);
    };

    animationId = requestAnimationFrame(runPhysicsLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [
    isBallReleased,
    trackAngleDeg,
    gateEPosCm,
    gateFPosCm,
    mode,
    onBallPassGateE,
    onBallPassGateF,
    onBallReachEnd,
  ]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 6, 12);
      controlsRef.current.target.set(0, 1.5, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badges */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-[11px] font-bold text-cyan-400 font-mono shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          3D WebGL Three.js Workbench
        </span>

        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md">
          Góc: <b className="text-amber-400">{trackAngleDeg}°</b>
        </span>

        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md">
          {mode === 'AVERAGE_SPEED'
            ? `Quãng đường: s = ${Math.max(0, gateFPosCm - gateEPosCm)} cm`
            : `Vị trí cổng E: s_E = ${gateEPosCm} cm`}
        </span>
      </div>

      {/* Top Right 3D Controls Helper */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <button
          onClick={handleResetCamera}
          className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/70 text-[11px] text-slate-300 font-medium transition-all shadow-md cursor-pointer flex items-center gap-1"
          title="Đặt lại góc nhìn camera"
        >
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Góc nhìn 3D</span>
        </button>
      </div>

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Cổng E: {gateEPosCm} cm ({wireEConnected ? 'Đã nối dây' : 'Chưa nối'})
          </span>
          {mode === 'AVERAGE_SPEED' && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Cổng F: {gateFPosCm} cm ({wireFConnected ? 'Đã nối dây' : 'Chưa nối'})
            </span>
          )}
        </div>
        <span className="font-mono text-slate-400 hidden sm:inline">
          🖱️ Kéo chuột xoay 360° • Cuộn để phóng to/thu nhỏ
        </span>
      </div>
    </div>
  );
});

SpeedWorkbench3D.displayName = 'SpeedWorkbench3D';
