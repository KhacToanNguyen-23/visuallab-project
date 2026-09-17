import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InductionWorkbench3D, type InductionWorkbench3DHandle } from './InductionWorkbench3D';
import { InductionWorkbenchHudDock } from './InductionWorkbenchHudDock';
import { InductionLabWizardWorksheet, type InductionSubmissionDetails, type RawInductionTrial } from './InductionLabWizardWorksheet';
import {
  computeInductionEmf,
  type InductionGradingResult,
} from './inductionLabEngine';

interface InductionLabProps {
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: InductionGradingResult, details?: InductionSubmissionDetails) => void;
}

export const InductionLab: React.FC<InductionLabProps> = ({
  onOpenSubmissionDrawer,
  onGraded,
}) => {
  const navigate = useNavigate();
  const workbench3DRef = useRef<InductionWorkbench3DHandle | null>(null);

  // Physical State
  const [turnCountN, setTurnCountN] = useState<number>(200); // 200 turns default
  const [pole, setPole] = useState<'N-S' | 'S-N'>('N-S'); // 'N-S' (N on left) or 'S-N' (S on left)
  const [magnetX, setMagnetX] = useState<number>(-2.8); // Magnet starts to the left of the coil
  const [instantEmfMv, setInstantEmfMv] = useState<number>(0);
  const [instantCurrentMa, setInstantCurrentMa] = useState<number>(0);
  const [isAutoMoving, setIsAutoMoving] = useState<boolean>(false);

  // Peak EMF registered during current motion session
  const peakSessionEmfRef = useRef<number>(0);

  // Recorded Trials State
  const [trials, setTrials] = useState<RawInductionTrial[]>([]);

  // Update position & compute EMF during drag
  const handleMagnetXChange = useCallback((newX: number, velocity: number) => {
    setMagnetX(newX);
    const { emfMv, currentMa } = computeInductionEmf(newX, velocity, pole, turnCountN, true);
    setInstantEmfMv(emfMv);
    setInstantCurrentMa(currentMa);

    if (Math.abs(emfMv) > Math.abs(peakSessionEmfRef.current)) {
      peakSessionEmfRef.current = emfMv;
    }
  }, [pole, turnCountN]);

  // Flip pole
  const handleFlipPole = useCallback(() => {
    if (isAutoMoving) return;
    setPole(prev => (prev === 'N-S' ? 'S-N' : 'N-S'));
    setInstantEmfMv(0);
    setInstantCurrentMa(0);
    peakSessionEmfRef.current = 0;
  }, [isAutoMoving]);

  // Step motion: Move In Slow (v = 0.5 m/s)
  const handleMoveInSlow = useCallback(() => {
    if (isAutoMoving) return;
    setIsAutoMoving(true);
    peakSessionEmfRef.current = 0;

    const startX = -2.8;
    const targetX = 0.0;
    const speed = 0.5; // m/s
    const duration = (Math.abs(targetX - startX) / speed) * 400; // ms

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentX = startX + (targetX - startX) * progress;

      setMagnetX(currentX);
      const { emfMv, currentMa } = computeInductionEmf(currentX, speed, pole, turnCountN, true);
      setInstantEmfMv(emfMv);
      setInstantCurrentMa(currentMa);

      if (Math.abs(emfMv) > Math.abs(peakSessionEmfRef.current)) {
        peakSessionEmfRef.current = emfMv;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAutoMoving(false);
        setInstantEmfMv(0);
        setInstantCurrentMa(0);
      }
    };

    requestAnimationFrame(animate);
  }, [isAutoMoving, pole, turnCountN]);

  // Step motion: Move In Fast (v = 1.5 m/s)
  const handleMoveInFast = useCallback(() => {
    if (isAutoMoving) return;
    setIsAutoMoving(true);
    peakSessionEmfRef.current = 0;

    const startX = -2.8;
    const targetX = 0.0;
    const speed = 1.5; // m/s
    const duration = (Math.abs(targetX - startX) / speed) * 350; // ms

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentX = startX + (targetX - startX) * progress;

      setMagnetX(currentX);
      const { emfMv, currentMa } = computeInductionEmf(currentX, speed, pole, turnCountN, true);
      setInstantEmfMv(emfMv);
      setInstantCurrentMa(currentMa);

      if (Math.abs(emfMv) > Math.abs(peakSessionEmfRef.current)) {
        peakSessionEmfRef.current = emfMv;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAutoMoving(false);
        setInstantEmfMv(0);
        setInstantCurrentMa(0);
      }
    };

    requestAnimationFrame(animate);
  }, [isAutoMoving, pole, turnCountN]);

  // Step motion: Move Out (v = -1.0 m/s)
  const handleMoveOut = useCallback(() => {
    if (isAutoMoving) return;
    setIsAutoMoving(true);
    peakSessionEmfRef.current = 0;

    const startX = magnetX;
    const targetX = -2.8;
    const speed = -1.0; // m/s
    const duration = (Math.abs(targetX - startX) / Math.abs(speed)) * 400; // ms

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentX = startX + (targetX - startX) * progress;

      setMagnetX(currentX);
      const { emfMv, currentMa } = computeInductionEmf(currentX, speed, pole, turnCountN, true);
      setInstantEmfMv(emfMv);
      setInstantCurrentMa(currentMa);

      if (Math.abs(emfMv) > Math.abs(peakSessionEmfRef.current)) {
        peakSessionEmfRef.current = emfMv;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAutoMoving(false);
        setInstantEmfMv(0);
        setInstantCurrentMa(0);
      }
    };

    requestAnimationFrame(animate);
  }, [isAutoMoving, magnetX, pole, turnCountN]);

  // Reset lab
  const handleReset = useCallback(() => {
    setIsAutoMoving(false);
    setMagnetX(-2.8);
    setInstantEmfMv(0);
    setInstantCurrentMa(0);
    peakSessionEmfRef.current = 0;
  }, []);

  // Record trial from HUD button
  const handleRecordTrial = useCallback(() => {
    const recordedEmf = peakSessionEmfRef.current !== 0 ? peakSessionEmfRef.current : (instantEmfMv || -18.5);
    const speed = Math.abs(recordedEmf) > 30 ? 1.5 : 0.5;
    const direction: 'IN' | 'OUT' = recordedEmf < 0 ? 'IN' : 'OUT';

    let matchedMissionId: number | undefined;
    if (pole === 'N-S' && direction === 'IN' && speed <= 0.8) matchedMissionId = 1;
    else if (pole === 'N-S' && direction === 'IN' && speed > 0.8) matchedMissionId = 2;
    else if (pole === 'S-N' || direction === 'OUT') matchedMissionId = 3;

    setTrials(prev => {
      const filtered = matchedMissionId ? prev.filter(t => t.missionId !== matchedMissionId) : prev;
      return [
        ...filtered,
        {
          pole,
          direction,
          speedMps: speed,
          turnCountN,
          peakEmfMv: recordedEmf,
          missionId: matchedMissionId,
        },
      ];
    });
  }, [pole, turnCountN, instantEmfMv]);

  // Record trial specifically for mission
  const handleRecordTrialForMission = useCallback((missionId: number) => {
    if (missionId === 1) {
      setPole('N-S');
      setTurnCountN(200);
      handleMoveInSlow();
      // Record trial 1
      setTimeout(() => {
        setTrials(prev => {
          const filtered = prev.filter(t => t.missionId !== 1);
          return [
            ...filtered,
            {
              pole: 'N-S',
              direction: 'IN',
              speedMps: 0.5,
              turnCountN: 200,
              peakEmfMv: -18.6,
              missionId: 1,
            },
          ];
        });
      }, 1200);
    } else if (missionId === 2) {
      setPole('N-S');
      setTurnCountN(200);
      handleMoveInFast();
      // Record trial 2
      setTimeout(() => {
        setTrials(prev => {
          const filtered = prev.filter(t => t.missionId !== 2);
          return [
            ...filtered,
            {
              pole: 'N-S',
              direction: 'IN',
              speedMps: 1.5,
              turnCountN: 200,
              peakEmfMv: -45.2,
              missionId: 2,
            },
          ];
        });
      }, 900);
    } else if (missionId === 3) {
      setPole('S-N');
      setTurnCountN(200);
      handleMoveInSlow();
      // Record trial 3
      setTimeout(() => {
        setTrials(prev => {
          const filtered = prev.filter(t => t.missionId !== 3);
          return [
            ...filtered,
            {
              pole: 'S-N',
              direction: 'IN',
              speedMps: 0.5,
              turnCountN: 200,
              peakEmfMv: 18.4,
              missionId: 3,
            },
          ];
        });
      }, 1200);
    }
  }, [handleMoveInSlow, handleMoveInFast]);

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
                Thực Hành: Hiện Tượng Cảm Ứng Điện Từ (Định Luật Faraday & Lenz)
              </h1>
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-[10px] font-semibold">
                Vật lý 12
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Khảo sát từ thông biến thiên, suất điện động cảm ứng e_c & dòng điện cảm ứng I_c
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
            <InductionWorkbench3D
              ref={workbench3DRef}
              turnCountN={turnCountN}
              pole={pole}
              magnetX={magnetX}
              onMagnetXChange={handleMagnetXChange}
              instantEmfMv={instantEmfMv}
              instantCurrentMa={instantCurrentMa}
              isAutoMoving={isAutoMoving}
            />
          </div>

          {/* HUD Parameter Dock */}
          <InductionWorkbenchHudDock
            turnCountN={turnCountN}
            onTurnCountChange={setTurnCountN}
            pole={pole}
            onFlipPole={handleFlipPole}
            onMoveInSlow={handleMoveInSlow}
            onMoveInFast={handleMoveInFast}
            onMoveOut={handleMoveOut}
            onReset={handleReset}
            onRecord={handleRecordTrial}
            isAutoMoving={isAutoMoving}
            instantEmfMv={instantEmfMv}
            instantCurrentMa={instantCurrentMa}
            recordedCount={trials.length}
          />
        </div>

        {/* Right Column: 3-Step Wizard Worksheet */}
        <div className="w-full lg:w-5/12 h-full overflow-hidden">
          <InductionLabWizardWorksheet
            turnCountN={turnCountN}
            pole={pole}
            instantEmfMv={instantEmfMv}
            instantCurrentMa={instantCurrentMa}
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
