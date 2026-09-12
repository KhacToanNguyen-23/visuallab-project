import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { calculateTheoreticalAcceleration } from './speedLabEngine';

export interface SpeedWorkbenchCanvasHandle {
  getCanvasDataURL: () => string;
}

interface SpeedWorkbenchCanvasProps {
  trackAngleDeg: number;
  gateEPosCm: number;
  gateFPosCm: number;
  onGateEChange: (cm: number) => void;
  onGateFChange: (cm: number) => void;
  isBallReleased: boolean;
  onBallPassGateE: () => void;
  onBallPassGateF: () => void;
  onBallReachEnd: () => void;
  wireEConnected: boolean;
  wireFConnected: boolean;
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED';
}

export const SpeedWorkbenchCanvas = forwardRef<SpeedWorkbenchCanvasHandle, SpeedWorkbenchCanvasProps>(({
  trackAngleDeg,
  gateEPosCm,
  gateFPosCm,
  onGateEChange,
  onGateFChange,
  isBallReleased,
  onBallPassGateE,
  onBallPassGateF,
  onBallReachEnd,
  wireEConnected,
  wireFConnected,
  mode,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    getCanvasDataURL: () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL('image/png');
      }
      return '';
    },
  }));

  // Dragging states for gates
  const [draggingGate, setDraggingGate] = useState<'E' | 'F' | null>(null);

  // Ball animation state refs for 60 FPS loop
  const animRef = useRef<number | null>(null);
  const ballPosRef = useRef<number>(0); // cm from top (0 to 100)
  const ballVelocityRef = useRef<number>(0); // cm/s
  const ballRotationRef = useRef<number>(0); // radians
  const lastTimeRef = useRef<number | null>(null);
  const hasTriggeredERef = useRef<boolean>(false);
  const hasTriggeredFRef = useRef<boolean>(false);

  // Reset ball to top when isBallReleased turns false
  useEffect(() => {
    if (!isBallReleased) {
      ballPosRef.current = 0;
      ballVelocityRef.current = 0;
      ballRotationRef.current = 0;
      hasTriggeredERef.current = false;
      hasTriggeredFRef.current = false;
    }
  }, [isBallReleased]);

  // Main Render & Animation Loop
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Workbench background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Geometry calculations for inclined track
    const rad = (trackAngleDeg * Math.PI) / 180;
    const trackLengthPx = width * 0.72;
    const startX = width * 0.12;
    const startY = height * 0.22;

    // 1. Draw Support Stand at the Top
    ctx.save();
    // Base table
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(width * 0.05, height * 0.88, width * 0.9, 14);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(width * 0.05, height * 0.88, width * 0.9, 14);

    // Vertical Stand Pole
    const poleX = startX - 18;
    const poleBottomY = height * 0.88;
    const gradPole = ctx.createLinearGradient(poleX - 6, 0, poleX + 6, 0);
    gradPole.addColorStop(0, '#94a3b8');
    gradPole.addColorStop(0.5, '#f8fafc');
    gradPole.addColorStop(1, '#64748b');
    ctx.fillStyle = gradPole;
    ctx.fillRect(poleX - 6, startY - 20, 12, poleBottomY - startY + 20);

    // Stand Clamp fixing track
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.fillRect(poleX - 10, startY - 10, 28, 20);
    ctx.strokeRect(poleX - 10, startY - 10, 28, 20);
    ctx.restore();

    // 2. Draw Inclined Track Body (Thân Máng Nghiêng)
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(rad);

    // Aluminum Track Profile
    const trackThickness = 18;
    const gradTrack = ctx.createLinearGradient(0, 0, 0, trackThickness);
    gradTrack.addColorStop(0, '#64748b');
    gradTrack.addColorStop(0.3, '#cbd5e1');
    gradTrack.addColorStop(0.7, '#94a3b8');
    gradTrack.addColorStop(1, '#475569');

    ctx.fillStyle = gradTrack;
    ctx.fillRect(0, 0, trackLengthPx, trackThickness);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, trackLengthPx, trackThickness);

    // Top Release Stop / Latch
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-8, -12, 10, 24);
    ctx.strokeStyle = '#b91c1c';
    ctx.strokeRect(-8, -12, 10, 24);

    // Millimeter & Centimeter Ruler Scale on the Track
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 3, trackLengthPx, 10);

    ctx.font = '8px ui-monospace, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';

    for (let cm = 0; cm <= 100; cm += 5) {
      const x = (cm / 100) * trackLengthPx;
      const isMajor = cm % 10 === 0;
      ctx.strokeStyle = isMajor ? '#38bdf8' : '#64748b';
      ctx.lineWidth = isMajor ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(x, 3);
      ctx.lineTo(x, isMajor ? 11 : 7);
      ctx.stroke();

      if (isMajor && cm > 0 && cm < 100) {
        ctx.fillText(`${cm}`, x, 17);
      }
    }

    // Ruler label
    ctx.font = 'italic 7px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('cm (0 - 100)', trackLengthPx - 25, -4);

    // 3. Draw Photogates along Track
    const drawPhotogate = (gateId: 'E' | 'F', posCm: number, isWireConnected: boolean) => {
      const gateX = (posCm / 100) * trackLengthPx;
      ctx.save();
      ctx.translate(gateX, 0);

      // Gate Bracket & U-Shaped Sensor Housing
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = isWireConnected ? '#06b6d4' : '#64748b';
      ctx.lineWidth = 2;

      // Bottom mounting clamp
      ctx.fillRect(-10, trackThickness, 20, 10);
      ctx.strokeRect(-10, trackThickness, 20, 10);

      // U-frame extending above track
      ctx.beginPath();
      ctx.moveTo(-9, trackThickness);
      ctx.lineTo(-9, -32);
      ctx.lineTo(9, -32);
      ctx.lineTo(9, trackThickness);
      ctx.stroke();

      // Top sensor head
      ctx.fillStyle = isWireConnected ? '#083344' : '#1e293b';
      ctx.fillRect(-12, -36, 24, 12);
      ctx.strokeRect(-12, -36, 24, 12);

      // Infrared Beam
      ctx.strokeStyle = isWireConnected ? 'rgba(239, 68, 68, 0.85)' : 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(0, -2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label Badge
      ctx.fillStyle = isWireConnected ? '#06b6d4' : '#94a3b8';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`CỔNG ${gateId}`, 0, -40);
      ctx.font = '8px ui-monospace, monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`${posCm.toFixed(0)}cm`, 0, -20);

      // Wire terminal port
      ctx.fillStyle = isWireConnected ? '#22c55e' : '#ef4444';
      ctx.beginPath();
      ctx.arc(0, trackThickness + 5, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    drawPhotogate('E', gateEPosCm, wireEConnected);
    if (mode === 'AVERAGE_SPEED') {
      drawPhotogate('F', gateFPosCm, wireFConnected);
    }

    // 4. Draw Steel Ball (Bi Thép SGK)
    const ballRadiusPx = 10;
    const currentBallX = (ballPosRef.current / 100) * trackLengthPx;
    const currentBallY = -ballRadiusPx;

    ctx.save();
    ctx.translate(currentBallX, currentBallY);
    ctx.rotate(ballRotationRef.current);

    // Ball Drop Shadow on track
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, ballRadiusPx, ballRadiusPx * 0.8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chrome Steel Ball Radial Gradient
    const ballGrad = ctx.createRadialGradient(
      -ballRadiusPx * 0.35,
      -ballRadiusPx * 0.35,
      1,
      0,
      0,
      ballRadiusPx
    );
    ballGrad.addColorStop(0, '#ffffff');
    ballGrad.addColorStop(0.3, '#e2e8f0');
    ballGrad.addColorStop(0.7, '#64748b');
    ballGrad.addColorStop(1, '#1e293b');

    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(0, 0, ballRadiusPx, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Metallic reflection line to visualize rolling rotation
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, ballRadiusPx * 0.65, 0, Math.PI * 0.7);
    ctx.stroke();

    ctx.restore();
    ctx.restore();

    // 5. Draw Wires connecting to Digital Timer at Bottom Right
    const timerJackAX = width * 0.80;
    const timerJackAY = height * 0.82;
    const timerJackBX = width * 0.88;
    const timerJackBY = height * 0.82;

    const drawWire = (gateCm: number, targetX: number, targetY: number, color: string) => {
      const gateTrackPx = (gateCm / 100) * trackLengthPx;
      const gX = startX + gateTrackPx * Math.cos(rad);
      const gY = startY + gateTrackPx * Math.sin(rad) + trackThickness;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(gX, gY);
      const midX = (gX + targetX) / 2;
      const midY = Math.max(gY, targetY) + 30;
      ctx.quadraticCurveTo(midX, midY, targetX, targetY);
      ctx.stroke();
      ctx.restore();
    };

    if (wireEConnected) {
      drawWire(gateEPosCm, timerJackAX, timerJackAY, '#06b6d4');
    }
    if (wireFConnected && mode === 'AVERAGE_SPEED') {
      drawWire(gateFPosCm, timerJackBX, timerJackBY, '#a855f7');
    }
  }, [
    trackAngleDeg,
    gateEPosCm,
    gateFPosCm,
    wireEConnected,
    wireFConnected,
    mode,
  ]);

  // 60 FPS Physics Simulation Step
  useEffect(() => {
    let active = true;

    const stepSimulation = (now: number) => {
      if (!active) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      if (isBallReleased && ballPosRef.current < 100) {
        const a_mps = calculateTheoreticalAcceleration(trackAngleDeg);
        const a_cmps = a_mps * 100;

        ballVelocityRef.current += a_cmps * dt;
        ballPosRef.current += ballVelocityRef.current * dt;

        const ballRadiusCm = 1.0;
        ballRotationRef.current += (ballVelocityRef.current / ballRadiusCm) * dt;

        // Trigger Optical Gates
        if (!hasTriggeredERef.current && ballPosRef.current >= gateEPosCm) {
          hasTriggeredERef.current = true;
          onBallPassGateE();
        }

        if (mode === 'AVERAGE_SPEED') {
          if (!hasTriggeredFRef.current && ballPosRef.current >= gateFPosCm) {
            hasTriggeredFRef.current = true;
            onBallPassGateF();
          }
        }

        // Reached end of track (100 cm)
        if (ballPosRef.current >= 100) {
          ballPosRef.current = 100;
          onBallReachEnd();
        }
      }

      renderFrame();
      animRef.current = requestAnimationFrame(stepSimulation);
    };

    animRef.current = requestAnimationFrame(stepSimulation);

    return () => {
      active = false;
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
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
    renderFrame,
  ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clientY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const rad = (trackAngleDeg * Math.PI) / 180;
    const trackLengthPx = canvas.width * 0.72;
    const startX = canvas.width * 0.12;
    const startY = canvas.height * 0.22;

    const gEPx = (gateEPosCm / 100) * trackLengthPx;
    const gEX = startX + gEPx * Math.cos(rad);
    const gEY = startY + gEPx * Math.sin(rad);
    const distE = Math.hypot(clientX - gEX, clientY - gEY);

    if (distE < 35) {
      setDraggingGate('E');
      return;
    }

    if (mode === 'AVERAGE_SPEED') {
      const gFPx = (gateFPosCm / 100) * trackLengthPx;
      const gFX = startX + gFPx * Math.cos(rad);
      const gFY = startY + gFPx * Math.sin(rad);
      const distF = Math.hypot(clientX - gFX, clientY - gFY);

      if (distF < 35) {
        setDraggingGate('F');
        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingGate) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clientY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const rad = (trackAngleDeg * Math.PI) / 180;
    const trackLengthPx = canvas.width * 0.72;
    const startX = canvas.width * 0.12;
    const startY = canvas.height * 0.22;

    const dx = clientX - startX;
    const dy = clientY - startY;
    const proj = dx * Math.cos(rad) + dy * Math.sin(rad);
    const cm = Math.max(5, Math.min(95, Math.round((proj / trackLengthPx) * 100)));

    if (draggingGate === 'E') {
      if (mode === 'AVERAGE_SPEED') {
        if (cm < gateFPosCm - 10) {
          onGateEChange(cm);
        }
      } else {
        onGateEChange(cm);
      }
    } else if (draggingGate === 'F') {
      if (cm > gateEPosCm + 10) {
        onGateFChange(cm);
      }
    }
  };

  const handlePointerUp = () => {
    setDraggingGate(null);
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-[16/9] max-h-[520px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className="w-full h-full cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      <div className="absolute top-3 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Kéo <strong>Cổng quang điện</strong> dọc theo thước để đổi vị trí đo</span>
      </div>
    </div>
  );
});

SpeedWorkbenchCanvas.displayName = 'SpeedWorkbenchCanvas';
