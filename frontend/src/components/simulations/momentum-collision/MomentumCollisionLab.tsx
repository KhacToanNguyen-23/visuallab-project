import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MomentumWorkbench3D, type MomentumWorkbench3DHandle } from './MomentumWorkbench3D';
import { MomentumWorkbenchHudDock } from './MomentumWorkbenchHudDock';
import { MomentumLabWizardWorksheet, type MomentumSubmissionDetails, type RawMomentumTrial } from './MomentumLabWizardWorksheet';
import {
  computeCollisionPhysics,
  type MomentumGradingResult,
} from './momentumCollisionEngine';

interface MomentumCollisionLabProps {
  assignmentId?: string;
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: MomentumGradingResult, details?: MomentumSubmissionDetails) => void;
}

export const MomentumCollisionLab: React.FC<MomentumCollisionLabProps> = ({
  assignmentId,
  onOpenSubmissionDrawer,
  onGraded,
}) => {
  const navigate = useNavigate();
  const workbench3DRef = useRef<MomentumWorkbench3DHandle | null>(null);

  // Physical State (controlled by student)
  const [m1G, setM1G] = useState<number>(200); // 200g
  const [m2G, setM2G] = useState<number>(200); // 200g
  const [collisionType, setCollisionType] = useState<'elastic' | 'inelastic'>('elastic');
  const [springSpeed, setSpringSpeed] = useState<number>(1.2); // 1.2 m/s

  // Glider Positions on Track
  const [car1X, setCar1X] = useState<number>(-2.2);
  const [car2X, setCar2X] = useState<number>(0.2);

  // Photogate Transit Times (s)
  const [dt1, setDt1] = useState<number>(0);
  const [dt2, setDt2] = useState<number>(0);

  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  const [hasLaunchedOnce, setHasLaunchedOnce] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Active Session Results
  const sessionResultRef = useRef<any>(null);

  // Recorded Trials State
  const [trials, setTrials] = useState<RawMomentumTrial[]>([]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Launch Glider 1
  const handleLaunch = useCallback(() => {
    if (isLaunched) return;
    setIsLaunched(true);

    const m1Kg = m1G / 1000;
    const m2Kg = m2G / 1000;
    const physics = computeCollisionPhysics(m1Kg, m2Kg, springSpeed, collisionType, true);
    sessionResultRef.current = {
      ...physics,
      m1Kg,
      m2Kg,
      collisionType,
    };

    const start1X = -2.2;
    const contactX = 0.2 - 0.7; // car 1 hits car 2
    const v1 = springSpeed; // m/s

    const durationToCollision = (Math.abs(contactX - start1X) / v1) * 600; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < durationToCollision) {
        const p = elapsed / durationToCollision;
        const x1 = start1X + (contactX - start1X) * p;
        setCar1X(x1);
        setCar2X(0.2);

        // Passed gate 1 (at x = -0.6)
        if (x1 >= -0.6 && dt1 === 0) {
          setDt1(physics.dt1Sec);
        }

        requestAnimationFrame(animate);
      } else {
        // After collision
        setDt1(physics.dt1Sec);
        const elapsedAfter = (elapsed - durationToCollision) / 1000; // seconds
        const dtDurationSec = 1.2; // animate for 1.2s post collision

        const current1X = contactX + physics.v1PrimeMps * elapsedAfter * 1.5;
        const current2X = 0.2 + physics.v2PrimeMps * elapsedAfter * 1.5;

        setCar1X(Math.min(2.8, Math.max(-2.8, current1X)));
        setCar2X(Math.min(2.8, Math.max(-2.8, current2X)));

        // Passed gate 2 (at x = 1.2)
        if (current2X >= 1.2) {
          setDt2(physics.dt2Sec);
        }

        if (elapsedAfter < dtDurationSec) {
          requestAnimationFrame(animate);
        } else {
          setDt2(physics.dt2Sec);
          setIsLaunched(false);
          setHasLaunchedOnce(true);
          showNotification('✓ Đã đo xong va chạm! Hãy bấm "+ Ghi Số Liệu" để lưu vào bảng báo cáo.');
        }
      }
    };

    requestAnimationFrame(animate);
  }, [isLaunched, m1G, m2G, springSpeed, collisionType, dt1]);

  // Reset lab
  const handleReset = useCallback(() => {
    setIsLaunched(false);
    setCar1X(-2.2);
    setCar2X(0.2);
    setDt1(0);
    setDt2(0);
    sessionResultRef.current = null;
    setHasLaunchedOnce(false);
  }, []);

  // Record trial from HUD button using actual student-adjusted parameters & measured results
  const handleRecordTrial = useCallback(() => {
    if (!hasLaunchedOnce || !sessionResultRef.current) {
      showNotification('⚠️ Bạn chưa phóng xe! Vui lòng điều chỉnh thông số và bấm "🚀 Phóng Xe 1" trước khi ghi số liệu.');
      return;
    }

    const physics = sessionResultRef.current;

    let matchedMissionId: number | undefined;
    if (physics.collisionType === 'elastic' && Math.abs(physics.m1Kg - 0.2) <= 0.02 && Math.abs(physics.m2Kg - 0.2) <= 0.02) {
      matchedMissionId = 1;
    } else if (physics.collisionType === 'elastic' && physics.m1Kg > physics.m2Kg + 0.05) {
      matchedMissionId = 2;
    } else if (physics.collisionType === 'inelastic') {
      matchedMissionId = 3;
    }

    setTrials(prev => {
      const filtered = matchedMissionId ? prev.filter(t => t.missionId !== matchedMissionId) : prev;
      return [
        ...filtered,
        {
          collisionType: physics.collisionType,
          m1Kg: physics.m1Kg,
          m2Kg: physics.m2Kg,
          v1Mps: physics.v1Mps,
          v2Mps: physics.v2Mps,
          v1PrimeMps: physics.v1PrimeMps,
          v2PrimeMps: physics.v2PrimeMps,
          dt1Sec: physics.dt1Sec,
          dt2Sec: physics.dt2Sec,
          pBeforeKgmS: physics.pBeforeKgmS,
          pAfterKgmS: physics.pAfterKgmS,
          relativeErrorPercent: physics.relativeErrorPercent,
          missionId: matchedMissionId,
        },
      ];
    });

    if (matchedMissionId) {
      showNotification(`✓ Đã ghi nhận số liệu và hoàn thành Nhiệm vụ ${matchedMissionId}!`);
    } else {
      showNotification('✓ Đã ghi lại lần đo vào bảng số liệu.');
    }
  }, [hasLaunchedOnce]);

  // Record trial specifically when student clicks on a mission card
  const handleRecordTrialForMission = useCallback((missionId: number) => {
    if (!hasLaunchedOnce || !sessionResultRef.current) {
      showNotification(`⚠️ Vui lòng điều chỉnh các thông số theo yêu cầu của Nhiệm vụ ${missionId} và bấm "🚀 Phóng Xe 1" trước!`);
      return;
    }

    const physics = sessionResultRef.current;
    let isMatch = false;

    if (missionId === 1 && physics.collisionType === 'elastic' && Math.abs(physics.m1Kg - 0.2) <= 0.02 && Math.abs(physics.m2Kg - 0.2) <= 0.02) {
      isMatch = true;
    } else if (missionId === 2 && physics.collisionType === 'elastic' && physics.m1Kg > physics.m2Kg + 0.05) {
      isMatch = true;
    } else if (missionId === 3 && physics.collisionType === 'inelastic') {
      isMatch = true;
    }

    if (!isMatch) {
      if (missionId === 1) {
        showNotification('⚠️ Thông số vừa đo chưa khớp Nhiệm vụ 1: Cần chọn m1=200g, m2=200g và kiểu va chạm Đàn hồi.');
      } else if (missionId === 2) {
        showNotification('⚠️ Thông số vừa đo chưa khớp Nhiệm vụ 2: Cần chọn m1=300g, m2=150g và kiểu va chạm Đàn hồi.');
      } else if (missionId === 3) {
        showNotification('⚠️ Thông số vừa đo chưa khớp Nhiệm vụ 3: Cần chuyển sang chế độ Va chạm Mềm.');
      }
      return;
    }

    setTrials(prev => {
      const filtered = prev.filter(t => t.missionId !== missionId);
      return [
        ...filtered,
        {
          collisionType: physics.collisionType,
          m1Kg: physics.m1Kg,
          m2Kg: physics.m2Kg,
          v1Mps: physics.v1Mps,
          v2Mps: physics.v2Mps,
          v1PrimeMps: physics.v1PrimeMps,
          v2PrimeMps: physics.v2PrimeMps,
          dt1Sec: physics.dt1Sec,
          dt2Sec: physics.dt2Sec,
          pBeforeKgmS: physics.pBeforeKgmS,
          pAfterKgmS: physics.pAfterKgmS,
          relativeErrorPercent: physics.relativeErrorPercent,
          missionId,
        },
      ];
    });

    showNotification(`✓ Đã xác nhận hoàn thành Nhiệm vụ ${missionId}!`);
  }, [hasLaunchedOnce]);

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
                Bài 18: Thực Hành Khảo Sát Va Chạm & Bảo Toàn Động Lượng
              </h1>
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[10px] font-semibold">
                Vật lý 10
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Học sinh tự điều chỉnh khối lượng, đầu va chạm, phóng xe và ghi lại số liệu thực nghiệm
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
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-sky-500/40 text-sky-200 px-4 py-2 rounded-xl shadow-2xl text-xs font-medium backdrop-blur-md animate-fade-in flex items-center space-x-2">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Workspace (2 Columns) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* Left Column: 3D Workbench & HUD Dock */}
        <div className="w-full lg:w-7/12 flex flex-col gap-4 overflow-hidden h-full">
          {/* 3D Parameter Studio Canvas */}
          <div className="flex-1 min-h-[360px] relative">
            <MomentumWorkbench3D
              ref={workbench3DRef}
              m1G={m1G}
              m2G={m2G}
              collisionType={collisionType}
              springForce={springSpeed}
              car1X={car1X}
              car2X={car2X}
              dt1={dt1}
              dt2={dt2}
              isLaunched={isLaunched}
            />
          </div>

          {/* HUD Parameter Dock */}
          <MomentumWorkbenchHudDock
            m1G={m1G}
            onM1Change={val => {
              setM1G(val);
              handleReset();
            }}
            m2G={m2G}
            onM2Change={val => {
              setM2G(val);
              handleReset();
            }}
            collisionType={collisionType}
            onCollisionTypeChange={type => {
              setCollisionType(type);
              handleReset();
            }}
            springSpeed={springSpeed}
            onSpringSpeedChange={val => {
              setSpringSpeed(val);
              handleReset();
            }}
            onLaunch={handleLaunch}
            onReset={handleReset}
            onRecord={handleRecordTrial}
            isLaunched={isLaunched}
            recordedCount={trials.length}
          />
        </div>

        {/* Right Column: 3-Step Wizard Worksheet */}
        <div className="w-full lg:w-5/12 h-full overflow-hidden">
          <MomentumLabWizardWorksheet
            m1G={m1G}
            m2G={m2G}
            collisionType={collisionType}
            springSpeed={springSpeed}
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
