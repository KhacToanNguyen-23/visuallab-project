import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LIQUID_PRESETS,
  type LiquidPreset,
  type SpecificHeatGradingResult,
  computeHeatingTemperature,
} from './specificHeatEngine';
import { SpecificHeatWorkbench3D } from './SpecificHeatWorkbench3D';
import { SpecificHeatWorkbenchHudDock } from './SpecificHeatWorkbenchHudDock';
import {
  SpecificHeatLabWizardWorksheet,
  type RawSpecificHeatTrial,
  type SpecificHeatSubmissionDetails,
} from './SpecificHeatLabWizardWorksheet';

export interface SpecificHeatLabProps {
  assignmentId?: string;
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: SpecificHeatGradingResult, details?: SpecificHeatSubmissionDetails) => void;
}

export const SpecificHeatLab: React.FC<SpecificHeatLabProps> = ({
  assignmentId,
  onOpenSubmissionDrawer,
  onGraded,
}) => {
  const navigate = useNavigate();

  // Workbench states
  const [selectedLiquid, setSelectedLiquid] = useState<LiquidPreset>(LIQUID_PRESETS[0]);
  const [massKg, setMassKg] = useState<number>(0.2); // 200g
  const [powerW, setPowerW] = useState<number>(50); // 50W
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [hasStirrer, setHasStirrer] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'front' | 'top'>('perspective');

  // Thermal state
  const initialTempC = 25.0; // 25°C ambient
  const [currentTempC, setCurrentTempC] = useState<number>(25.0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isBoiling, setIsBoiling] = useState<boolean>(false);
  const [heatJoules, setHeatJoules] = useState<number>(0);

  // Reference for last completed heating session
  const lastSessionRef = useRef<{
    liquidId: string;
    massKg: number;
    powerW: number;
    timeSec: number;
    tempInitialC: number;
    tempFinalC: number;
  } | null>(null);

  // Trials state
  const [trials, setTrials] = useState<RawSpecificHeatTrial[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Heating timer effect
  useEffect(() => {
    if (!isHeating) return;

    const interval = setInterval(() => {
      setElapsedSec(prevSec => {
        const nextSec = prevSec + 1;
        const res = computeHeatingTemperature(
          selectedLiquid.id,
          massKg,
          powerW,
          nextSec,
          initialTempC,
          hasStirrer
        );

        setCurrentTempC(res.currentTempC);
        setHeatJoules(res.heatJoules);

        lastSessionRef.current = {
          liquidId: selectedLiquid.id,
          massKg,
          powerW,
          timeSec: nextSec,
          tempInitialC: initialTempC,
          tempFinalC: res.currentTempC,
        };

        if (res.isBoiling) {
          setIsBoiling(true);
          setIsHeating(false);
          showNotification(`⚠️ Chất lỏng đã sôi (${selectedLiquid.boilingPointC}°C)! Đã tự động ngắt điện.`);
        }

        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isHeating, selectedLiquid.id, selectedLiquid.boilingPointC, massKg, powerW, hasStirrer]);

  // Handler: Start heating
  const handleStartHeating = useCallback(() => {
    if (isBoiling) {
      showNotification('⚠️ Chất lỏng đang ở nhiệt độ sôi. Hãy bấm "🔄 Đặt Lại" để làm nguội trước khi đun lại.');
      return;
    }
    setIsHeating(true);
  }, [isBoiling]);

  // Handler: Stop heating
  const handleStopHeating = useCallback(() => {
    setIsHeating(false);
    if (elapsedSec > 0) {
      showNotification('✓ Đã dừng đun! Hãy bấm "+ Ghi Số Liệu" để lưu kết quả.');
    }
  }, [elapsedSec]);

  // Handler: Reset lab
  const handleReset = useCallback(() => {
    setIsHeating(false);
    setIsBoiling(false);
    setElapsedSec(0);
    setCurrentTempC(25.0);
    setHeatJoules(0);
    lastSessionRef.current = null;
    showNotification('🔄 Đã làm nguội chất lỏng về nhiệt độ ban đầu (25°C).');
  }, []);

  // Handler: Record trial from HUD Dock
  const handleRecordTrial = useCallback(() => {
    if (!lastSessionRef.current || (lastSessionRef.current.timeSec < 8 && Math.abs(lastSessionRef.current.tempFinalC - lastSessionRef.current.tempInitialC) < 2.0)) {
      showNotification('⚠️ Vui lòng bật đun để có độ tăng nhiệt độ trước khi ghi số liệu.');
      return;
    }

    const { liquidId, massKg: m, powerW: p, timeSec: t, tempInitialC: t1, tempFinalC: t2 } = lastSessionRef.current;
    const deltaT = t2 - t1;

    let matchedMissionId: number | undefined;
    if (liquidId === 'water' && m <= 0.25 && p <= 120 && (t >= 30 || deltaT >= 4.0)) matchedMissionId = 1;
    else if (liquidId === 'water' && (m > 0.25 || p > 120) && (t >= 15 || deltaT >= 4.0)) matchedMissionId = 2;
    else if (liquidId !== 'water' && (t >= 15 || deltaT >= 4.0)) matchedMissionId = 3;

    setTrials(prev => {
      const filtered = matchedMissionId ? prev.filter(tr => tr.missionId !== matchedMissionId) : prev;
      return [
        ...filtered,
        {
          liquidId,
          massKg: m,
          powerW: p,
          timeSec: t,
          tempInitialC: t1,
          tempFinalC: t2,
          missionId: matchedMissionId,
        },
      ];
    });

    if (matchedMissionId) {
      showNotification(`✓ Đã ghi nhận số liệu và hoàn thành Nhiệm vụ ${matchedMissionId}!`);
    } else {
      showNotification('✓ Đã ghi nhận lần đo vào bảng số liệu.');
    }
  }, []);

  // Handler: Record specifically for mission
  const handleRecordTrialForMission = useCallback((missionId: number) => {
    if (!lastSessionRef.current || (lastSessionRef.current.timeSec < 8 && Math.abs(lastSessionRef.current.tempFinalC - lastSessionRef.current.tempInitialC) < 2.0)) {
      showNotification(`⚠️ Vui lòng thực hiện đun theo yêu cầu của Nhiệm vụ ${missionId} trước khi ghi số liệu!`);
      return;
    }

    const { liquidId, massKg: m, powerW: p, timeSec: t, tempInitialC: t1, tempFinalC: t2 } = lastSessionRef.current;
    const deltaT = t2 - t1;

    let isMatch = false;
    if (missionId === 1 && liquidId === 'water' && m <= 0.25 && p <= 120 && (t >= 30 || deltaT >= 4.0)) isMatch = true;
    else if (missionId === 2 && liquidId === 'water' && (m > 0.25 || p > 120) && (t >= 15 || deltaT >= 4.0)) isMatch = true;
    else if (missionId === 3 && liquidId !== 'water' && (t >= 15 || deltaT >= 4.0)) isMatch = true;

    if (!isMatch) {
      if (missionId === 1) showNotification('⚠️ Chưa khớp Nhiệm vụ 1: Cần chọn Nước (m = 200g, P = 50W - 100W).');
      else if (missionId === 2) showNotification('⚠️ Chưa khớp Nhiệm vụ 2: Cần giữ Nước và tăng m lên 300g-400g hoặc tăng P lên 250W - 1000W.');
      else if (missionId === 3) showNotification('⚠️ Chưa khớp Nhiệm vụ 3: Cần đổi sang Cồn Ethanol hoặc Dầu Thực Vật.');
      return;
    }

    setTrials(prev => {
      const filtered = prev.filter(tr => tr.missionId !== missionId);
      return [
        ...filtered,
        {
          liquidId,
          massKg: m,
          powerW: p,
          timeSec: t,
          tempInitialC: t1,
          tempFinalC: t2,
          missionId,
        },
      ];
    });

    showNotification(`✓ Đã xác nhận hoàn thành Nhiệm vụ ${missionId}!`);
  }, []);

  // Remove single trial
  const handleRemoveTrial = useCallback((index: number) => {
    setTrials(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all trials
  const handleClearTrials = useCallback(() => {
    setTrials([]);
    lastSessionRef.current = null;
    showNotification('🗑 Đã xóa toàn bộ số liệu đo.');
  }, []);

  // Graded callback
  const handleGraded = useCallback((result: SpecificHeatGradingResult, _details?: SpecificHeatSubmissionDetails) => {
    showNotification(`🏆 Chấm điểm hoàn tất: ${result.totalScore}/10.0 điểm! Báo cáo đã được lưu.`);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/labs')}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all active:scale-95"
            title="Quay lại danh sách bài Lab"
          >
            ←
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔥</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-100">
                  Thực Hành: Đo Nhiệt Dung Riêng Của Nước & Chất Lỏng
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vật lý 12
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Khảo sát định luật nhiệt lượng Q = m • c • ΔT bằng bình nhiệt lượng kế 3D
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            STUDIO 3D THREE.JS
          </span>
        </div>
      </header>

      {/* Main Workbench Layout */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Side: 3D Scene + HUD */}
        <div className="flex-[1.2] flex flex-col gap-3 min-w-0 h-full">
          <div className="flex-1 min-h-0">
            <SpecificHeatWorkbench3D
              selectedLiquid={selectedLiquid}
              massKg={massKg}
              powerW={powerW}
              isHeating={isHeating}
              isBoiling={isBoiling}
              hasStirrer={hasStirrer}
              currentTempC={currentTempC}
              initialTempC={initialTempC}
              elapsedSec={elapsedSec}
              heatJoules={heatJoules}
              soundEnabled={soundEnabled}
              cameraMode={cameraMode}
            />
          </div>

          <div className="shrink-0">
            <SpecificHeatWorkbenchHudDock
              selectedLiquid={selectedLiquid}
              massKg={massKg}
              powerW={powerW}
              isHeating={isHeating}
              hasStirrer={hasStirrer}
              soundEnabled={soundEnabled}
              cameraMode={cameraMode}
              onSelectLiquid={setSelectedLiquid}
              onSelectMass={setMassKg}
              onSelectPower={setPowerW}
              onToggleStirrer={() => setHasStirrer(prev => !prev)}
              onToggleSound={() => setSoundEnabled(prev => !prev)}
              onChangeCameraMode={setCameraMode}
              onStartHeating={handleStartHeating}
              onStopHeating={handleStopHeating}
              onReset={handleReset}
              onRecordTrial={handleRecordTrial}
            />
          </div>
        </div>

        {/* Right Side: 3-Tab Wizard Worksheet */}
        <div className="flex-1 min-w-0 h-full">
          <SpecificHeatLabWizardWorksheet
            currentLiquidId={selectedLiquid.id}
            currentMassKg={massKg}
            currentPowerW={powerW}
            trials={trials}
            assignmentId={assignmentId}
            onAddTrialForMission={handleRecordTrialForMission}
            onRemoveTrial={handleRemoveTrial}
            onClearTrials={handleClearTrials}
            onGraded={(res, det) => {
              handleGraded(res, det);
              if (onGraded) onGraded(res, det);
            }}
            onOpenSubmissionDrawer={onOpenSubmissionDrawer}
          />
        </div>
      </div>

      {/* Floating Toast */}
      {notification && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-slate-100 text-xs font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/50 backdrop-blur-md z-50 flex items-center gap-2 animate-fade-in">
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
};
