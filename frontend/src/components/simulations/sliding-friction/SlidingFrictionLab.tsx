import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SURFACE_PRESETS,
  type SurfacePreset,
  type SlidingFrictionGradingResult,
  computeFrictionPhysics,
} from './slidingFrictionEngine';
import { SlidingFrictionWorkbench3D } from './SlidingFrictionWorkbench3D';
import { SlidingFrictionWorkbenchHudDock } from './SlidingFrictionWorkbenchHudDock';
import {
  SlidingFrictionLabWizardWorksheet,
  type RawSlidingFrictionTrial,
  type SlidingFrictionSubmissionDetails,
} from './SlidingFrictionLabWizardWorksheet';

export interface SlidingFrictionLabProps {
  assignmentId?: string;
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: SlidingFrictionGradingResult, details?: SlidingFrictionSubmissionDetails) => void;
}

export const SlidingFrictionLab: React.FC<SlidingFrictionLabProps> = ({
  assignmentId,
  onOpenSubmissionDrawer,
  onGraded,
}) => {
  const navigate = useNavigate();

  // Workbench states
  const [selectedSurface, setSelectedSurface] = useState<SurfacePreset>(SURFACE_PRESETS[0]);
  const [addedMassKg, setAddedMassKg] = useState<number>(0.1); // 100g = 0.1kg
  const baseBlockMassKg = 0.2; // 200g base wooden block
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [currentForceN, setCurrentForceN] = useState<number>(0);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showMicroView, setShowMicroView] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'side' | 'top'>('perspective');

  // Last motion / pull recorded reference
  const lastPullRef = useRef<{
    surfaceId: string;
    totalMassKg: number;
    frictionForceN: number;
  } | null>(null);

  // Trials state
  const [trials, setTrials] = useState<RawSlidingFrictionTrial[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  const totalMassKg = baseBlockMassKg + addedMassKg;

  // Handler: Start pulling block
  const handleStartPull = useCallback(() => {
    if (isPulling) return;
    setIsPulling(true);
    setCurrentForceN(0);
  }, [isPulling]);

  // Handler: Force dynamic update during pulling
  const handleForceChange = useCallback((f: number) => {
    setCurrentForceN(f);
  }, []);

  // Handler: Pull complete
  const handlePullComplete = useCallback(
    (_finalForceN: number) => {
      setIsPulling(false);
      const measured = computeFrictionPhysics(selectedSurface.id, totalMassKg, true);
      lastPullRef.current = {
        surfaceId: selectedSurface.id,
        totalMassKg,
        frictionForceN: measured.frictionForceN,
      };
      setCurrentForceN(measured.frictionForceN);
      showNotification(`✓ Đã kéo đo xong lực ma sát trượt F_mst = ${measured.frictionForceN}N! Hãy bấm "+ Ghi Số Liệu" để lưu.`);
    },
    [selectedSurface.id, totalMassKg]
  );

  // Handler: Reset block position
  const handleReset = useCallback(() => {
    setIsPulling(false);
    setCurrentForceN(0);
    lastPullRef.current = null;
    showNotification('🔄 Đã đặt lại vị trí ban đầu của khối gỗ.');
  }, []);

  // Handler: Record trial from HUD Dock
  const handleRecordTrial = useCallback(() => {
    if (!lastPullRef.current && currentForceN === 0) {
      showNotification('⚠️ Bạn chưa thực hiện kéo khối gỗ! Vui lòng bấm "▶ Kéo Khối Gỗ" để lực kế đo lực ma sát trước khi ghi số liệu.');
      return;
    }

    const currentSurfaceId = lastPullRef.current ? lastPullRef.current.surfaceId : selectedSurface.id;
    const currentTotalMass = lastPullRef.current ? lastPullRef.current.totalMassKg : totalMassKg;
    const currentF = lastPullRef.current ? lastPullRef.current.frictionForceN : (currentForceN > 0 ? currentForceN : computeFrictionPhysics(currentSurfaceId, currentTotalMass, true).frictionForceN);

    let matchedMissionId: number | undefined;
    if (currentSurfaceId === 'wood' && currentTotalMass <= 0.35) matchedMissionId = 1;
    else if (currentSurfaceId === 'wood' && currentTotalMass > 0.35) matchedMissionId = 2;
    else if (currentSurfaceId !== 'wood') matchedMissionId = 3;

    setTrials(prev => {
      const filtered = matchedMissionId ? prev.filter(t => t.missionId !== matchedMissionId) : prev;
      return [
        ...filtered,
        {
          surfaceId: currentSurfaceId,
          totalMassKg: currentTotalMass,
          frictionForceN: currentF,
          missionId: matchedMissionId,
        },
      ];
    });

    if (matchedMissionId) {
      showNotification(`✓ Đã ghi nhận số liệu và hoàn thành Nhiệm vụ ${matchedMissionId}!`);
    } else {
      showNotification('✓ Đã ghi nhận lần đo vào bảng số liệu.');
    }
  }, [currentForceN, selectedSurface.id, totalMassKg]);

  // Handler: Record specifically for mission
  const handleRecordTrialForMission = useCallback(
    (missionId: number) => {
      if (!lastPullRef.current && currentForceN === 0) {
        showNotification(`⚠️ Vui lòng bấm "▶ Kéo Khối Gỗ" theo yêu cầu của Nhiệm vụ ${missionId} trước khi ghi số liệu!`);
        return;
      }

      const activeSurfaceId = lastPullRef.current ? lastPullRef.current.surfaceId : selectedSurface.id;
      const activeTotalMass = lastPullRef.current ? lastPullRef.current.totalMassKg : totalMassKg;
      const activeF = lastPullRef.current ? lastPullRef.current.frictionForceN : (currentForceN > 0 ? currentForceN : computeFrictionPhysics(activeSurfaceId, activeTotalMass, true).frictionForceN);

      let isMatch = false;
      if (missionId === 1 && activeSurfaceId === 'wood' && activeTotalMass <= 0.35) isMatch = true;
      else if (missionId === 2 && activeSurfaceId === 'wood' && activeTotalMass > 0.35) isMatch = true;
      else if (missionId === 3 && activeSurfaceId !== 'wood') isMatch = true;

      if (!isMatch) {
        if (missionId === 1) showNotification('⚠️ Chưa khớp Nhiệm vụ 1: Cần chọn Bề mặt Gỗ Tự Nhiên và tải trọng chuẩn m = 300g (+100g).');
        else if (missionId === 2) showNotification('⚠️ Chưa khớp Nhiệm vụ 2: Cần giữ Bề mặt Gỗ và tăng tải trọng lên +200g hoặc +300g (m = 400g - 500g).');
        else if (missionId === 3) showNotification('⚠️ Chưa khớp Nhiệm vụ 3: Cần đổi sang Bề mặt Kính, Nhôm hoặc Cao su.');
        return;
      }

      setTrials(prev => {
        const filtered = prev.filter(t => t.missionId !== missionId);
        return [
          ...filtered,
          {
            surfaceId: activeSurfaceId,
            totalMassKg: activeTotalMass,
            frictionForceN: activeF,
            missionId,
          },
        ];
      });

      showNotification(`✓ Đã xác nhận hoàn thành Nhiệm vụ ${missionId}!`);
    },
    [currentForceN, selectedSurface.id, totalMassKg]
  );

  // Remove single trial
  const handleRemoveTrial = useCallback((index: number) => {
    setTrials(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all trials
  const handleClearTrials = useCallback(() => {
    setTrials([]);
    lastPullRef.current = null;
    showNotification('🗑 Đã xóa toàn bộ số liệu đo.');
  }, []);

  // Graded callback
  const handleGraded = useCallback((result: SlidingFrictionGradingResult, _details?: SlidingFrictionSubmissionDetails) => {
    showNotification(`🏆 Chấm điểm hoàn tất: ${result.totalScore}/10.0 điểm! Báo cáo đã được lưu.`);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
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
            <span className="text-xl">🛷</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-100">
                  Thực Hành: Đo Hệ Số Ma Sát Trượt & Khảo Sát Định Luật Ma Sát
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vật lý 10
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Khảo sát sự phụ thuộc của lực ma sát trượt vào áp lực và bản chất bề mặt tiếp xúc
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

      {/* Main Workbench Layout: Left 3D + HUD, Right Worksheet */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Side: 3D Scene + Dock */}
        <div className="flex-[1.2] flex flex-col gap-3 min-w-0 h-full">
          <div className="flex-1 min-h-0">
            <SlidingFrictionWorkbench3D
              selectedSurface={selectedSurface}
              addedMassKg={addedMassKg}
              baseBlockMassKg={baseBlockMassKg}
              isPulling={isPulling}
              currentForceN={currentForceN}
              showVectors={showVectors}
              showMicroView={showMicroView}
              soundEnabled={soundEnabled}
              cameraMode={cameraMode}
              onForceChange={handleForceChange}
              onPullComplete={handlePullComplete}
            />
          </div>

          <div className="shrink-0">
            <SlidingFrictionWorkbenchHudDock
              selectedSurface={selectedSurface}
              addedMassKg={addedMassKg}
              isPulling={isPulling}
              showVectors={showVectors}
              showMicroView={showMicroView}
              soundEnabled={soundEnabled}
              cameraMode={cameraMode}
              onSelectSurface={setSelectedSurface}
              onSelectAddedMass={setAddedMassKg}
              onStartPull={handleStartPull}
              onReset={handleReset}
              onToggleVectors={() => setShowVectors(prev => !prev)}
              onToggleMicroView={() => setShowMicroView(prev => !prev)}
              onToggleSound={() => setSoundEnabled(prev => !prev)}
              onChangeCameraMode={setCameraMode}
              onRecordTrial={handleRecordTrial}
            />
          </div>
        </div>

        {/* Right Side: 3-Tab Wizard Worksheet */}
        <div className="flex-1 min-w-0 h-full">
          <SlidingFrictionLabWizardWorksheet
            currentSurfaceId={selectedSurface.id}
            currentTotalMassKg={totalMassKg}
            currentFrictionForceN={currentForceN}
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

      {/* Floating Notification Toast */}
      {notification && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-slate-100 text-xs font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/50 backdrop-blur-md z-50 flex items-center gap-2 animate-fade-in">
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
};
