import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpeedWorkbench3D } from './SpeedWorkbench3D';
import type { SpeedWorkbench3DHandle } from './SpeedWorkbench3D';
import { SpeedWorkbenchHudDock } from './SpeedWorkbenchHudDock';
import { SpeedLabWizardWorksheet } from './SpeedLabWizardWorksheet';
import { generateSimulatedMeasurement } from './speedLabEngine';
import { ScreenshotCaptureModal } from '../../common/ScreenshotCaptureModal';

interface LabTaskTarget {
  id: string;
  targetAngle: number;
  targetDistance: number;
  targetGateE: number;
  targetTrials: number;
  description: string;
}

export const SpeedMeasurementLab: React.FC = () => {
  const navigate = useNavigate();

  // Lab Operational Mode
  const [mode, setMode] = useState<'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED'>('AVERAGE_SPEED');

  // Track Parameters
  const [trackAngleDeg, setTrackAngleDeg] = useState<number>(15);
  const [gateEPosCm, setGateEPosCm] = useState<number>(20);
  const [gateFPosCm, setGateFPosCm] = useState<number>(70);
  const [ballDiameterCm] = useState<number>(2.0);

  // Wire Connections
  const [wireEConnected, setWireEConnected] = useState<boolean>(true);
  const [wireFConnected, setWireFConnected] = useState<boolean>(true);

  // Simulation & Timer State
  const [isBallReleased, setIsBallReleased] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [displayTimeSec, setDisplayTimeSec] = useState<number | null>(null);
  const [totalTrialsCount, setTotalTrialsCount] = useState<number>(0);

  // Screenshot Capture State
  const [isScreenshotOpen, setIsScreenshotOpen] = useState<boolean>(false);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string>('');
  const canvasHandleRef = useRef<SpeedWorkbench3DHandle | null>(null);

  // Randomized Task Generator
  const [task, setTask] = useState<LabTaskTarget>({
    id: 'task-1',
    targetAngle: 15,
    targetDistance: 50,
    targetGateE: 20,
    targetTrials: 3,
    description: 'Điều chỉnh máng nghiêng góc α = 15°, đặt 2 cổng quang cách nhau s = 50.0 cm và đo thời gian 3 lần.',
  });

  const generateRandomTask = useCallback((activeMode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED') => {
    const angles = [10, 12, 15, 18, 20, 25];
    const distances = [30, 40, 50, 60];
    const gateEs = [10, 15, 20];

    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    const randomDist = distances[Math.floor(Math.random() * distances.length)];
    const randomGateE = gateEs[Math.floor(Math.random() * gateEs.length)];

    if (activeMode === 'AVERAGE_SPEED') {
      setTask({
        id: `task-${Date.now()}`,
        targetAngle: randomAngle,
        targetDistance: randomDist,
        targetGateE: randomGateE,
        targetTrials: 3,
        description: `Hãy điều chỉnh máng nghiêng ở góc α = ${randomAngle}°, bố trí 2 cổng quang cách nhau s = ${randomDist}.0 cm (Cổng E tại ${randomGateE}cm, Cổng F tại ${randomGateE + randomDist}cm) và thực hiện đo thời gian 3 lần.`,
      });
    } else {
      const instantGateE = [30, 40, 50, 60][Math.floor(Math.random() * 4)];
      setTask({
        id: `task-${Date.now()}`,
        targetAngle: randomAngle,
        targetDistance: 2.0,
        targetGateE: instantGateE,
        targetTrials: 3,
        description: `Hãy điều chỉnh máng nghiêng ở góc α = ${randomAngle}°, đặt Cổng E tại vạch s_E = ${instantGateE} cm, tiến hành đo thời gian viên bi chắn cổng quang 3 lần để tính tốc độ tức thời.`,
      });
    }
  }, []);

  useEffect(() => {
    generateRandomTask(mode);
  }, [mode, generateRandomTask]);

  // Reset ball & timer
  const handleReset = () => {
    setIsBallReleased(false);
    setIsTimerRunning(false);
  };

  const handleFullReset = () => {
    handleReset();
    setDisplayTimeSec(null);
    setTrackAngleDeg(15);
    setGateEPosCm(20);
    setGateFPosCm(70);
  };

  // Ball Release Trigger
  const handleReleaseBall = () => {
    if (isBallReleased) return;
    setIsBallReleased(true);
    setTotalTrialsCount(prev => prev + 1);
  };

  // Optical Sensor Callbacks
  const handleBallPassGateE = () => {
    if (mode === 'AVERAGE_SPEED') {
      if (wireEConnected) {
        setIsTimerRunning(true);
      }
    } else {
      if (wireEConnected) {
        const measured = generateSimulatedMeasurement(
          'INSTANTANEOUS_SPEED',
          trackAngleDeg,
          gateEPosCm,
          gateFPosCm,
          ballDiameterCm
        );
        setDisplayTimeSec(measured);
      }
    }
  };

  const handleBallPassGateF = () => {
    if (mode === 'AVERAGE_SPEED' && wireFConnected && isTimerRunning) {
      setIsTimerRunning(false);
      const measured = generateSimulatedMeasurement(
        'AVERAGE_SPEED',
        trackAngleDeg,
        gateEPosCm,
        gateFPosCm,
        ballDiameterCm
      );
      setDisplayTimeSec(measured);
    }
  };

  const handleBallReachEnd = () => {
    setIsTimerRunning(false);
  };

  const isAssemblyValid =
    mode === 'AVERAGE_SPEED'
      ? wireEConnected && wireFConnected && gateFPosCm > gateEPosCm + 15
      : wireEConnected;

  const handleOpenScreenshot = () => {
    if (canvasHandleRef.current) {
      const dataUrl = canvasHandleRef.current.getCanvasDataURL();
      setCapturedImageBase64(dataUrl);
    }
    setIsScreenshotOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/thu-vien')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Quay lại Thư viện"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                Vật Lý 10 • Bài 6
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">Trang 28 SGK GDPT 2018</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>Thực Hành Đo Tốc Độ Của Vật Chuyển Động</span>
              <span className="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 font-mono">
                3D Three.js
              </span>
            </h1>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenScreenshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Chụp Báo Cáo</span>
          </button>
          <button
            onClick={handleFullReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Làm Mới</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Fits entirely in viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-3.5">
        {/* Dual Mode Switcher Tabs + Task Generator Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 gap-2">
          <div className="grid grid-cols-2 w-full sm:w-auto gap-1">
            <button
              onClick={() => {
                setMode('AVERAGE_SPEED');
                handleReset();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'AVERAGE_SPEED'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>Thí Nghiệm 1: Đo Tốc Độ Trung Bình</span>
              <span className="text-[10px] font-mono opacity-80">(s / Δt)</span>
            </button>

            <button
              onClick={() => {
                setMode('INSTANTANEOUS_SPEED');
                handleReset();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'INSTANTANEOUS_SPEED'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>Thí Nghiệm 2: Đo Tốc Độ Tức Thời</span>
              <span className="text-[10px] font-mono opacity-80">(d / Δt_E)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1 bg-slate-950/60 rounded-xl border border-slate-800 font-mono">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {mode === 'AVERAGE_SPEED'
                ? 'Công thức: v_tb = (s_F - s_E) / Δt'
                : 'Công thức: v = d / Δt_E (d = 2.0cm)'}
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left = 3D Workbench + Unified HUD Dock with Target, Right = 3-Step Wizard Worksheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column (7 cols): 3D Three.js Workbench + Compact HUD Dock */}
          <div className="lg:col-span-7 space-y-3">
            {/* 3D Three.js Virtual Workbench */}
            <SpeedWorkbench3D
              ref={canvasHandleRef}
              trackAngleDeg={trackAngleDeg}
              gateEPosCm={gateEPosCm}
              gateFPosCm={gateFPosCm}
              onGateEChange={setGateEPosCm}
              onGateFChange={setGateFPosCm}
              isBallReleased={isBallReleased}
              onBallPassGateE={handleBallPassGateE}
              onBallPassGateF={handleBallPassGateF}
              onBallReachEnd={handleBallReachEnd}
              wireEConnected={wireEConnected}
              wireFConnected={wireFConnected}
              mode={mode}
            />

            {/* Unified Canvas HUD Dock with Integrated Task & Target Sliders */}
            <SpeedWorkbenchHudDock
              displayTimeSec={displayTimeSec}
              isRunning={isTimerRunning}
              trackAngleDeg={trackAngleDeg}
              gateEPosCm={gateEPosCm}
              gateFPosCm={gateFPosCm}
              onTrackAngleChange={angle => {
                setTrackAngleDeg(angle);
                handleReset();
              }}
              onGateEChange={cm => {
                setGateEPosCm(cm);
                handleReset();
              }}
              onGateFChange={cm => {
                setGateFPosCm(cm);
                handleReset();
              }}
              wireEConnected={wireEConnected}
              wireFConnected={wireFConnected}
              onToggleWireE={() => setWireEConnected(prev => !prev)}
              onToggleWireF={() => setWireFConnected(prev => !prev)}
              onReleaseBall={handleReleaseBall}
              onReset={handleReset}
              mode={mode}
              isBallReleased={isBallReleased}
              task={task}
              onRandomizeTask={() => generateRandomTask(mode)}
            />
          </div>

          {/* Right Column (5 cols): 3-Step Wizard Worksheet */}
          <div className="lg:col-span-5">
            <SpeedLabWizardWorksheet
              mode={mode}
              trackAngleDeg={trackAngleDeg}
              gateEPosCm={gateEPosCm}
              gateFPosCm={gateFPosCm}
              ballDiameterCm={ballDiameterCm}
              isCorrectAssembly={isAssemblyValid}
              totalTrialsCount={totalTrialsCount}
              currentTimerReading={displayTimeSec}
            />
          </div>
        </div>
      </main>

      {/* Screenshot Modal */}
      {isScreenshotOpen && (
        <ScreenshotCaptureModal
          isOpen={isScreenshotOpen}
          onClose={() => setIsScreenshotOpen(false)}
          imageBase64={capturedImageBase64}
          labId="sim-speed-measurement"
          labTitle="Báo Cáo Thực Hành Đo Tốc Độ - Vật Lý 10 Bài 6"
        />
      )}
    </div>
  );
};
