import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LatentHeatWorkbench3D, type LatentHeatWorkbench3DHandle } from './LatentHeatWorkbench3D';
import { LatentHeatWorkbenchHudDock } from './LatentHeatWorkbenchHudDock';
import { LatentHeatLabWizardWorksheet, type LatentHeatSubmissionDetails } from './LatentHeatLabWizardWorksheet';
import {
  computeEquilibriumTemp,
  type LatentHeatGradingResult,
} from './latentHeatLabEngine';

export interface RawLatentHeatTrial {
  waterMassKg: number;
  iceMassKg: number;
  initialWaterTemp: number;
  equilibriumTemp: number;
  missionId?: number;
}

interface LatentHeatLabProps {
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: LatentHeatGradingResult, details?: LatentHeatSubmissionDetails) => void;
}

export const LatentHeatLab: React.FC<LatentHeatLabProps> = ({
  onOpenSubmissionDrawer,
  onGraded,
}) => {
  const navigate = useNavigate();
  const workbench3DRef = useRef<LatentHeatWorkbench3DHandle | null>(null);

  // Physical State
  const [waterMassKg] = useState<number>(0.25); // 250g warm water
  const [iceMassG, setIceMassG] = useState<number>(20); // 20g default (Mission 1)
  const [initialWaterTemp] = useState<number>(40.0); // 40.0°C initial warm water
  const [currentTemp, setCurrentTemp] = useState<number>(40.0);
  const [isMelting, setIsMelting] = useState<boolean>(false);
  const [meltProgress, setMeltProgress] = useState<number>(0.0);

  // Recorded Trials State
  const [trials, setTrials] = useState<RawLatentHeatTrial[]>([]);

  // Update ice mass
  const handleIceMassChange = useCallback((valG: number) => {
    if (isMelting) return;
    setIceMassG(valG);
    // When mass changes before melting, reset temp to initial
    setCurrentTemp(initialWaterTemp);
    setMeltProgress(0.0);
  }, [isMelting, initialWaterTemp]);

  // Start melting animation & thermal equilibrium calculation
  const handleStartMelting = useCallback(() => {
    if (isMelting) return;
    setIsMelting(true);
    setMeltProgress(0.0);

    const iceMassKg = iceMassG / 1000;
    const targetTcb = computeEquilibriumTemp(waterMassKg, iceMassKg, initialWaterTemp, true);

    const startTime = performance.now();
    const duration = 2800; // ms for melting animation

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setMeltProgress(progress);

      const temp = initialWaterTemp - (initialWaterTemp - targetTcb) * ease;
      setCurrentTemp(parseFloat(temp.toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentTemp(targetTcb);
        setMeltProgress(1.0);
        setIsMelting(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isMelting, iceMassG, waterMassKg, initialWaterTemp]);

  // Reset lab state
  const handleReset = useCallback(() => {
    setIsMelting(false);
    setMeltProgress(0.0);
    setCurrentTemp(initialWaterTemp);
  }, [initialWaterTemp]);

  // Record trial from HUD button
  const handleRecordTrial = useCallback(() => {
    if (currentTemp >= initialWaterTemp) return;

    let matchedMissionId: number | undefined;
    if (Math.abs(iceMassG - 20) <= 1.0) matchedMissionId = 1;
    else if (Math.abs(iceMassG - 35) <= 1.0) matchedMissionId = 2;
    else if (Math.abs(iceMassG - 50) <= 1.0) matchedMissionId = 3;

    setTrials(prev => {
      const filtered = matchedMissionId ? prev.filter(t => t.missionId !== matchedMissionId) : prev;
      return [
        ...filtered,
        {
          waterMassKg,
          iceMassKg: iceMassG / 1000,
          initialWaterTemp,
          equilibriumTemp: currentTemp,
          missionId: matchedMissionId,
        },
      ];
    });
  }, [currentTemp, initialWaterTemp, iceMassG, waterMassKg]);

  // Record trial specifically for a mission step
  const handleRecordTrialForMission = useCallback((missionId: number, targetIceMassG: number) => {
    // If current ice mass does not match mission, we adjust and compute equilibrium
    const iceMassKg = targetIceMassG / 1000;
    const tcb = computeEquilibriumTemp(waterMassKg, iceMassKg, initialWaterTemp, true);

    setTrials(prev => {
      const filtered = prev.filter(t => t.missionId !== missionId);
      return [
        ...filtered,
        {
          waterMassKg,
          iceMassKg,
          initialWaterTemp,
          equilibriumTemp: tcb,
          missionId,
        },
      ];
    });
  }, [waterMassKg, initialWaterTemp]);

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
                Bài 5 (SGK T23): Thực Hành Đo Nhiệt Nóng Chảy Riêng Của Nước Đá
              </h1>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-semibold">
                Vật lý 12
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Phương pháp nhiệt lượng kế • 3 Nhiệm vụ khối lượng đá • Tự động chấm điểm SGK GDPT 2018
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
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
            <LatentHeatWorkbench3D
              ref={workbench3DRef}
              waterMassKg={waterMassKg}
              iceMassKg={iceMassG / 1000}
              currentTemp={currentTemp}
              isMelting={isMelting}
              meltProgress={meltProgress}
            />
          </div>

          {/* HUD Parameter Dock */}
          <LatentHeatWorkbenchHudDock
            iceMassG={iceMassG}
            onIceMassChange={handleIceMassChange}
            isMelting={isMelting}
            onStartMelting={handleStartMelting}
            onReset={handleReset}
            onRecord={handleRecordTrial}
            currentTemp={currentTemp}
            recordedCount={trials.length}
          />
        </div>

        {/* Right Column: 3-Step Wizard Worksheet */}
        <div className="w-full lg:w-5/12 h-full overflow-hidden">
          <LatentHeatLabWizardWorksheet
            waterMassKg={waterMassKg}
            iceMassKg={iceMassG / 1000}
            initialWaterTemp={initialWaterTemp}
            equilibriumTemp={currentTemp}
            trials={trials}
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
