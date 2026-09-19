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
  assignmentId?: string;
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: InductionGradingResult, details?: InductionSubmissionDetails) => void;
}

export const InductionLab: React.FC<InductionLabProps> = ({
  assignmentId,
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
  const [notification, setNotification] = useState<string | null>(null);

  // Peak EMF & Last Motion Info registered during current motion session
  const peakSessionEmfRef = useRef<number>(0);
  const lastMotionRef = useRef<{
    direction: 'IN' | 'OUT';
    speed: number;
    pole: 'N-S' | 'S-N';
  } | null>(null);

  // Recorded Trials State
  const [trials, setTrials] = useState<RawInductionTrial[]>([]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Update position & compute EMF during drag
  const handleMagnetXChange = useCallback((newX: number, velocity: number) => {
    setMagnetX(newX);
    const { emfMv, currentMa } = computeInductionEmf(newX, velocity, pole, turnCountN, true);
    setInstantEmfMv(emfMv);
    setInstantCurrentMa(currentMa);

    if (Math.abs(velocity) > 0.05) {
      // For magnet starting at left (x < 0), velocity > 0 means moving IN towards coil
      const direction: 'IN' | 'OUT' = velocity > 0 ? 'IN' : 'OUT';
      const speed = Math.abs(velocity);
      lastMotionRef.current = {
        direction,
        speed,
        pole,
      };
    }

    if (Math.abs(emfMv) > Math.abs(peakSessionEmfRef.current)) {
      peakSessionEmfRef.current = emfMv;
    }
  }, [pole, turnCountN]);

  // Flip pole
  const handleFlipPole = useCallback(() => {
    if (isAutoMoving) return;
    setPole(prev => {
      const next = prev === 'N-S' ? 'S-N' : 'N-S';
      if (lastMotionRef.current) {
        lastMotionRef.current.pole = next;
      }
      return next;
    });
    setInstantEmfMv(0);
    setInstantCurrentMa(0);
    peakSessionEmfRef.current = 0;
    showNotification(`🔄 Đã đổi sang Cực ${pole === 'N-S' ? 'Nam (S)' : 'Bắc (N)'}.`);
  }, [isAutoMoving, pole]);

  // Step motion: Move In Slow (v = 0.5 m/s)
  const handleMoveInSlow = useCallback(() => {
    if (isAutoMoving) return;
    setIsAutoMoving(true);
    peakSessionEmfRef.current = 0;
    lastMotionRef.current = {
      direction: 'IN',
      speed: 0.5,
      pole,
    };

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
        showNotification('✓ Đã đưa nam châm vào chậm! Hãy bấm "+ Ghi Số Liệu" để lưu kết quả.');
      }
    };

    requestAnimationFrame(animate);
  }, [isAutoMoving, pole, turnCountN]);

  // Step motion: Move In Fast (v = 1.5 m/s)
  const handleMoveInFast = useCallback(() => {
    if (isAutoMoving) return;
    setIsAutoMoving(true);
    peakSessionEmfRef.current = 0;
    lastMotionRef.current = {
      direction: 'IN',
      speed: 1.5,
      pole,
    };

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
        showNotification('✓ Đã đưa nam châm vào nhanh! Hãy bấm "+ Ghi Số Liệu" để lưu kết quả.');
      }
    };

    requestAnimationFrame(animate);
  }, [isAutoMoving, pole, turnCountN]);

  // Step motion: Move Out (v = -1.0 m/s)
  const handleMoveOut = useCallback(() => {
    if (isAutoMoving) return;
    setIsAutoMoving(true);
    peakSessionEmfRef.current = 0;
    lastMotionRef.current = {
      direction: 'OUT',
      speed: 1.0,
      pole,
    };

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
        showNotification('✓ Đã rút nam châm ra! Hãy bấm "+ Ghi Số Liệu" để lưu kết quả.');
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
    lastMotionRef.current = null;
  }, []);

  // Record trial from HUD button
  const handleRecordTrial = useCallback(() => {
    const recordedEmf = peakSessionEmfRef.current !== 0 ? peakSessionEmfRef.current : instantEmfMv;
    if (Math.abs(recordedEmf) < 0.5 || !lastMotionRef.current) {
      showNotification('⚠️ Bạn chưa di chuyển nam châm! Vui lòng kéo thanh nam châm hoặc bấm nút đưa vào/rút ra để tạo suất điện động trước khi ghi số liệu.');
      return;
    }

    const { direction, speed, pole: currentPole } = lastMotionRef.current;

    let matchedMissionId: number | undefined;
    if (currentPole === 'N-S' && direction === 'IN' && speed <= 0.8) matchedMissionId = 1;
    else if (currentPole === 'N-S' && direction === 'IN' && speed > 0.8) matchedMissionId = 2;
    else if (currentPole === 'S-N' || direction === 'OUT') matchedMissionId = 3;

    setTrials(prev => {
      const filtered = matchedMissionId ? prev.filter(t => t.missionId !== matchedMissionId) : prev;
      return [
        ...filtered,
        {
          pole: currentPole,
          direction,
          speedMps: speed,
          turnCountN,
          peakEmfMv: recordedEmf,
          missionId: matchedMissionId,
        },
      ];
    });

    if (matchedMissionId) {
      showNotification(`✓ Đã ghi nhận số liệu và hoàn thành Nhiệm vụ ${matchedMissionId}!`);
    } else {
      showNotification('✓ Đã ghi lại lần đo vào bảng số liệu.');
    }
  }, [turnCountN, instantEmfMv]);

  // Record trial specifically for mission
  const handleRecordTrialForMission = useCallback((missionId: number) => {
    const recordedEmf = peakSessionEmfRef.current !== 0 ? peakSessionEmfRef.current : instantEmfMv;
    if (Math.abs(recordedEmf) < 0.5 || !lastMotionRef.current) {
      showNotification(`⚠️ Vui lòng thực hiện thao tác theo yêu cầu của Nhiệm vụ ${missionId} (di chuyển nam châm) trước khi ghi số liệu!`);
      return;
    }

    const { direction, speed, pole: currentPole } = lastMotionRef.current;

    let isMatch = false;
    if (missionId === 1 && currentPole === 'N-S' && direction === 'IN' && speed <= 0.8) isMatch = true;
    else if (missionId === 2 && currentPole === 'N-S' && direction === 'IN' && speed > 0.8) isMatch = true;
    else if (missionId === 3 && (currentPole === 'S-N' || direction === 'OUT')) isMatch = true;

    if (!isMatch) {
      if (missionId === 1) showNotification('⚠️ Lần đo vừa rồi chưa khớp Nhiệm vụ 1: Cần chọn Cực Bắc (N) và đưa vào với tốc độ chậm.');
      else if (missionId === 2) showNotification('⚠️ Lần đo vừa rồi chưa khớp Nhiệm vụ 2: Cần chọn Cực Bắc (N) và đưa vào với tốc độ nhanh.');
      else if (missionId === 3) showNotification('⚠️ Lần đo vừa rồi chưa khớp Nhiệm vụ 3: Cần đổi Cực Nam (S) hoặc rút nam châm ra.');
      return;
    }

    setTrials(prev => {
      const filtered = prev.filter(t => t.missionId !== missionId);
      return [
        ...filtered,
        {
          pole: currentPole,
          direction,
          speedMps: speed,
          turnCountN,
          peakEmfMv: recordedEmf,
          missionId,
        },
      ];
    });

    showNotification(`✓ Đã xác nhận hoàn thành Nhiệm vụ ${missionId}!`);
  }, [turnCountN, instantEmfMv]);

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
              Học sinh tự điều chỉnh số vòng N, đảo cực, di chuyển nam châm và ghi nhận suất điện động e_c
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

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-500/40 text-cyan-200 px-4 py-2 rounded-xl shadow-2xl text-xs font-medium backdrop-blur-md animate-fade-in flex items-center space-x-2">
          <span>{notification}</span>
        </div>
      )}

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
