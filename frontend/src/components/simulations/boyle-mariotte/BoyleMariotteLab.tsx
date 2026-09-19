import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoyleWorkbench3D, type BoyleWorkbench3DHandle } from './BoyleWorkbench3D';
import { BoyleWorkbenchHudDock } from './BoyleWorkbenchHudDock';
import { BoyleLabWizardWorksheet } from './BoyleLabWizardWorksheet';
import { computeBoylePressure } from './boyleLabEngine';

export interface BoyleMariotteLabProps {
  assignmentId?: string;
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: any, details?: any) => void;
}

export const BoyleMariotteLab: React.FC<BoyleMariotteLabProps> = ({
  assignmentId,
  onOpenSubmissionDrawer,
  onGraded,
}) => {
  const navigate = useNavigate();
  const workbench3DRef = useRef<BoyleWorkbench3DHandle | null>(null);

  // Physical State
  const [volume, setVolume] = useState<number>(40); // 40 cm³ initial
  const [pressure, setPressure] = useState<number>(() => computeBoylePressure(40, 40, 1.0, false));
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // Recorded Trials State
  const [trials, setTrials] = useState<Array<{ volume: number; pressure: number; missionId?: number }>>([]);

  // Change volume and recalculate pressure
  const handleVolumeChange = useCallback((newV: number) => {
    const clampedV = Math.max(10, Math.min(45, newV));
    setVolume(clampedV);
    setPressure(computeBoylePressure(clampedV, 40, 1.0, true));
  }, []);

  // Smooth compress step animation (-5 cm³)
  const handleCompressStep = useCallback(() => {
    if (isCompressing || volume <= 10) return;
    setIsCompressing(true);

    const targetV = Math.max(10, volume - 5);
    const startV = volume;
    const startTime = performance.now();
    const duration = 600; // ms

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out quad
      const ease = 1 - (1 - progress) * (1 - progress);
      const v = startV - (startV - targetV) * ease;
      const roundedV = parseFloat(v.toFixed(1));

      setVolume(roundedV);
      setPressure(computeBoylePressure(roundedV, 40, 1.0, true));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setVolume(targetV);
        setPressure(computeBoylePressure(targetV, 40, 1.0, true));
        setIsCompressing(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isCompressing, volume]);

  // Smooth expand step animation (+5 cm³)
  const handleExpandStep = useCallback(() => {
    if (isCompressing || volume >= 45) return;
    setIsCompressing(true);

    const targetV = Math.min(45, volume + 5);
    const startV = volume;
    const startTime = performance.now();
    const duration = 600;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - (1 - progress) * (1 - progress);
      const v = startV + (targetV - startV) * ease;
      const roundedV = parseFloat(v.toFixed(1));

      setVolume(roundedV);
      setPressure(computeBoylePressure(roundedV, 40, 1.0, true));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setVolume(targetV);
        setPressure(computeBoylePressure(targetV, 40, 1.0, true));
        setIsCompressing(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isCompressing, volume]);

  // Reset to initial state
  const handleReset = useCallback(() => {
    setIsCompressing(false);
    setVolume(40);
    setPressure(computeBoylePressure(40, 40, 1.0, false));
  }, []);

  // Record current trial for general HUD button
  const handleRecordTrial = useCallback(() => {
    const currentP = computeBoylePressure(volume, 40, 1.0, true);
    // Find matching mission if any
    let matchedMissionId: number | undefined;
    if (Math.abs(volume - 35) <= 1.5) matchedMissionId = 1;
    else if (Math.abs(volume - 25) <= 1.5) matchedMissionId = 2;
    else if (Math.abs(volume - 15) <= 1.5) matchedMissionId = 3;

    setTrials(prev => {
      const filtered = matchedMissionId ? prev.filter(t => t.missionId !== matchedMissionId) : prev;
      return [...filtered, { volume, pressure: currentP, missionId: matchedMissionId }];
    });
  }, [volume]);

  // Record trial specifically for mission
  const handleRecordTrialForMission = useCallback((missionId: number, _targetV: number) => {
    const currentP = computeBoylePressure(volume, 40, 1.0, true);
    setTrials(prev => {
      const filtered = prev.filter(t => t.missionId !== missionId);
      return [...filtered, { volume, pressure: currentP, missionId }];
    });
  }, [volume]);

  // Remove specific trial
  const handleRemoveTrial = useCallback((index: number) => {
    setTrials(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all trials
  const handleClearTrials = useCallback(() => {
    setTrials([]);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/thu-vien')}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            title="Quay lại thư viện bài học"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-slate-100">
                Bài 7 (SGK T30): Quá Trình Đẳng Nhiệt (Định Luật Boyle - Mariotte)
              </h1>
              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded text-[10px] font-semibold">
                Vật lý 12
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Khảo sát định luật Boyle qua 3 nhiệm vụ đề bài & mô phỏng 3D phân tử khí
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>STUDIO 3D THREE.JS</span>
          </span>
        </div>
      </div>

      {/* Main Content Workspace (2 Columns) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* Left Column: 3D Workbench & HUD Dock */}
        <div className="w-full lg:w-7/12 flex flex-col gap-4 overflow-hidden h-full">
          {/* 3D Parameter Studio Canvas */}
          <div className="flex-1 min-h-[360px] relative">
            <BoyleWorkbench3D
              ref={workbench3DRef}
              volume={volume}
              pressure={pressure}
              isCompressing={isCompressing}
            />
          </div>

          {/* HUD Parameter Dock */}
          <BoyleWorkbenchHudDock
            volume={volume}
            pressure={pressure}
            isCompressing={isCompressing}
            onVolumeChange={handleVolumeChange}
            onCompressStep={handleCompressStep}
            onExpandStep={handleExpandStep}
            onReset={handleReset}
            onRecord={handleRecordTrial}
            recordedCount={trials.length}
          />
        </div>

        {/* Right Column: 3-Step Wizard Worksheet */}
        <div className="w-full lg:w-5/12 h-full overflow-hidden">
          <BoyleLabWizardWorksheet
            currentVolume={volume}
            currentPressure={pressure}
            trials={trials}
            assignmentId={assignmentId}
            onAddTrialForMission={handleRecordTrialForMission}
            onRemoveTrial={handleRemoveTrial}
            onClearTrials={handleClearTrials}
            onGraded={onGraded}
            onOpenSubmissionDrawer={onOpenSubmissionDrawer}
          />
        </div>
      </div>
    </div>
  );
};
