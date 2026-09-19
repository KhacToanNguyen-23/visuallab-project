import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  OPTICAL_MEDIA_PRESETS,
  type OpticalMedium,
  type RefractionMeasurementRecord,
  type RefractionGradingResult,
  solveRayRefraction,
} from './refractionEngine';
import { RefractionWorkbench3D } from './RefractionWorkbench3D';
import { RefractionWorkbenchHudDock } from './RefractionWorkbenchHudDock';
import {
  RefractionLabWizardWorksheet,
  type RefractionSubmissionDetails,
} from './RefractionLabWizardWorksheet';

import { useLabPersistence } from '../../../hooks/useLabPersistence';

interface RefractionLabProps {
  assignmentId?: string;
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: RefractionGradingResult, details: RefractionSubmissionDetails) => void;
}

export const RefractionLab: React.FC<RefractionLabProps> = ({
  assignmentId,
  onOpenSubmissionDrawer,
  onGraded: propOnGraded,
}) => {
  const navigate = useNavigate();

  // Dual-mode Persistence Hook
  const {
    isAssignmentMode,
    saveDraft,
    savedRows,
    savedQuiz,
    savedObservation,
    savedGradeResult,
  } = useLabPersistence<RefractionMeasurementRecord, Record<number, number>>({
    labSlug: 'sim-refraction',
    assignmentId,
    initialRows: [],
    initialQuiz: {},
  });

  // Optical Setup States
  const [medium1, setMedium1] = useState<OpticalMedium>(OPTICAL_MEDIA_PRESETS[0]); // Air
  const [medium2, setMedium2] = useState<OpticalMedium>(OPTICAL_MEDIA_PRESETS[2]); // Crown Glass
  const [direction, setDirection] = useState<'medium1_to_medium2' | 'medium2_to_medium1'>('medium1_to_medium2');
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(45);
  const [laserWavelength, setLaserWavelength] = useState<'red' | 'green' | 'blue'>('red');
  const [cameraMode, setCameraMode] = useState<'perspective' | 'front' | 'top'>('perspective');

  // Solved Ray State
  const rayState = useMemo(() => {
    const fromN = direction === 'medium1_to_medium2' ? medium1.refractiveIndex : medium2.refractiveIndex;
    const toN = direction === 'medium1_to_medium2' ? medium2.refractiveIndex : medium1.refractiveIndex;
    return solveRayRefraction(fromN, toN, incidentAngleDeg, true);
  }, [medium1, medium2, direction, incidentAngleDeg]);

  // Recorded Measurements (restored from draft if available)
  const [records, setRecords] = useState<RefractionMeasurementRecord[]>(savedRows || []);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync draft when records change in assignment mode
  useEffect(() => {
    if (isAssignmentMode && records.length > 0) {
      saveDraft({ rows: records });
    }
  }, [records, isAssignmentMode, saveDraft]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Toggle Direction
  const handleToggleDirection = useCallback(() => {
    setDirection(prev => {
      const next = prev === 'medium1_to_medium2' ? 'medium2_to_medium1' : 'medium1_to_medium2';
      showNotification(
        next === 'medium1_to_medium2'
          ? '🔄 Đã đổi chiều: Không Khí → Khối Kính (Khảo sát Khúc Xạ)'
          : '🔄 Đã đổi chiều: Khối Kính → Không Khí (Khảo sát Phản Xạ Toàn Phần)'
      );
      return next;
    });
  }, []);

  // Reset Angles
  const handleReset = useCallback(() => {
    setIncidentAngleDeg(45);
    showNotification('🔄 Đã đặt lại góc tới i = 45.0°');
  }, []);

  // Record Trial from HUD
  const handleRecordTrial = useCallback(() => {
    const fromMedium = direction === 'medium1_to_medium2' ? medium1 : medium2;
    const toMedium = direction === 'medium1_to_medium2' ? medium2 : medium1;

    let matchedMissionId: number | undefined;
    if (direction === 'medium1_to_medium2' && medium2.id === 'crown_glass') {
      matchedMissionId = 1;
    } else if (direction === 'medium2_to_medium1' && medium2.id === 'crown_glass') {
      matchedMissionId = 2;
    } else if (medium2.id === 'mystery_x') {
      matchedMissionId = 3;
    }

    // Duplicate check
    const existing = records.find(
      r =>
        r.medium2Id === medium2.id &&
        Math.abs(r.incidentAngleDeg - incidentAngleDeg) < 0.25 &&
        (r.isTIR === rayState.isTotalInternalReflection)
    );
    if (existing) {
      showNotification(`⚠️ Đã có số liệu tại góc tới i = ${incidentAngleDeg.toFixed(1)}°. Hãy xoay góc khác.`);
      return;
    }

    const sinI = Math.sin((incidentAngleDeg * Math.PI) / 180);
    const sinR = Math.sin((rayState.refractionAngleDeg * Math.PI) / 180);
    const ratio = sinR > 0.001 ? sinI / sinR : 1.0;

    setRecords(prev => [
      ...prev,
      {
        step: prev.length + 1,
        missionId: matchedMissionId,
        medium1Id: fromMedium.id,
        medium1Name: fromMedium.name,
        medium2Id: toMedium.id,
        medium2Name: toMedium.name,
        incidentAngleDeg,
        refractionAngleDeg: rayState.refractionAngleDeg,
        sinI: parseFloat(sinI.toFixed(3)),
        sinR: parseFloat(sinR.toFixed(3)),
        ratioSinISinR: parseFloat(ratio.toFixed(3)),
        isTIR: rayState.isTotalInternalReflection,
      },
    ]);

    showNotification(
      rayState.isTotalInternalReflection
        ? `✓ Đã ghi nhận hiện tượng Phản Xạ Toàn Phần tại góc tới i = ${incidentAngleDeg.toFixed(1)}°!`
        : `✓ Đã ghi điểm đo: i = ${incidentAngleDeg.toFixed(1)}°, r = ${rayState.refractionAngleDeg.toFixed(1)}°, sin(i)/sin(r) = ${ratio.toFixed(3)}`
    );
  }, [direction, medium1, medium2, incidentAngleDeg, rayState, records]);

  // Select setup and angle for mission without auto-forging data
  const handleSelectMissionAngle = useCallback(
    (missionId: number, targetAngle?: number) => {
      if (missionId === 1) {
        setMedium1(OPTICAL_MEDIA_PRESETS[0]); // Air
        setMedium2(OPTICAL_MEDIA_PRESETS[2]); // Crown Glass
        setDirection('medium1_to_medium2');
      } else if (missionId === 2) {
        setMedium1(OPTICAL_MEDIA_PRESETS[0]); // Air
        setMedium2(OPTICAL_MEDIA_PRESETS[2]); // Crown Glass
        setDirection('medium2_to_medium1');
      } else if (missionId === 3) {
        setMedium1(OPTICAL_MEDIA_PRESETS[0]); // Air
        setMedium2(OPTICAL_MEDIA_PRESETS[5]); // Mystery X
        setDirection('medium1_to_medium2');
      }

      if (targetAngle !== undefined) {
        setIncidentAngleDeg(targetAngle);
        showNotification(`🎯 Nhiệm vụ ${missionId}: Đã xoay góc tới i = ${targetAngle}°. Hãy quan sát tia sáng 3D và bấm "+ Ghi Số Liệu".`);
      } else {
        showNotification(`🎯 Đã kích hoạt Nhiệm vụ ${missionId}. Hãy điều chỉnh góc i và bấm "+ Ghi Số Liệu" để thu thập số liệu.`);
      }
    },
    []
  );

  const handleClearRecords = useCallback(() => {
    setRecords([]);
    if (isAssignmentMode) {
      saveDraft({ rows: [] });
    }
    showNotification('🗑️ Đã xóa toàn bộ bảng số liệu thực nghiệm.');
  }, [isAssignmentMode, saveDraft]);

  const handleGraded = useCallback((result: RefractionGradingResult, details: RefractionSubmissionDetails) => {
    if (isAssignmentMode) {
      saveDraft({
        rows: details.records,
        quizAnswers: details.quizAnswers,
        studentObservation: details.studentObservation,
        gradeResult: result,
      });
    }
    showNotification(`🏆 Đã chấm điểm: ${result.totalScore}/10.0đ (${result.isPass ? 'ĐẠT' : 'CHƯA ĐẠT'})!`);
    if (propOnGraded) {
      propOnGraded(result, details);
    }
  }, [isAssignmentMode, saveDraft, propOnGraded]);

  return (
    <div className="w-full h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-14 right-6 z-50 bg-slate-900/95 border border-amber-500/60 text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
          {notification}
        </div>
      )}

      {/* Main Studio Header */}
      <header className="h-12 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs"
            title="Quay lại"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-sm">⚡</span>
            <h1 className="text-xs sm:text-sm font-bold text-slate-100">
              Thực Hành: Khúc Xạ Ánh Sáng & Phản Xạ Toàn Phần
            </h1>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
              Vật lý 11
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAssignmentMode ? (
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              CHẾ ĐỘ BÀI TẬP (AUTO-SAVE)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              THƯ VIỆN SANDBOX 3D
            </span>
          )}
        </div>
      </header>

      {/* Main 2-Column Split Workspace (Strictly 100vh fit, 0 page scrolling) */}
      <main className="flex-1 min-h-0 p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        {/* Left Column: 3D Workbench & HUD Dock */}
        <div className="lg:col-span-6 flex flex-col gap-2.5 h-full min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 w-full relative overflow-hidden rounded-xl">
            <RefractionWorkbench3D
              medium1={medium1}
              medium2={medium2}
              direction={direction}
              incidentAngleDeg={incidentAngleDeg}
              rayState={rayState}
              laserWavelength={laserWavelength}
              cameraMode={cameraMode}
              onIncidentAngleChange={setIncidentAngleDeg}
            />
          </div>

          <div className="shrink-0">
            <RefractionWorkbenchHudDock
              medium1={medium1}
              medium2={medium2}
              direction={direction}
              incidentAngleDeg={incidentAngleDeg}
              laserWavelength={laserWavelength}
              cameraMode={cameraMode}
              onSelectMedium1={setMedium1}
              onSelectMedium2={setMedium2}
              onToggleDirection={handleToggleDirection}
              onIncidentAngleChange={setIncidentAngleDeg}
              onSelectWavelength={setLaserWavelength}
              onChangeCameraMode={setCameraMode}
              onReset={handleReset}
              onRecordTrial={handleRecordTrial}
            />
          </div>
        </div>

        {/* Right Column: 3-Tab Wizard Worksheet */}
        <div className="lg:col-span-6 h-full min-h-0 flex flex-col overflow-hidden">
          <RefractionLabWizardWorksheet
            records={records}
            initialObservation={savedObservation}
            initialQuizAnswers={savedQuiz}
            initialGradeResult={savedGradeResult}
            onSelectMissionAngle={handleSelectMissionAngle}
            onClearRecords={handleClearRecords}
            onGraded={handleGraded}
            onOpenSubmissionDrawer={onOpenSubmissionDrawer}
            onDraftChange={saveDraft}
          />
        </div>
      </main>
    </div>
  );
};
