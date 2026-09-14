import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FrictionWorkbench3D,
  SURFACE_MATERIALS,
  type SurfaceType,
  type FrictionWorkbench3DHandle,
} from './sliding-friction/FrictionWorkbench3D';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';
import { ScreenshotCaptureModal } from '../common/ScreenshotCaptureModal';
import { soundEngine } from '../../utils/soundEngine';

interface Measurement {
  trial: number;
  surfaceName: string;
  normalForce: number; // N
  frictionForce: number; // N
  calculatedMu: number;
}

export const SlidingFrictionLab: React.FC = () => {
  const navigate = useNavigate();

  // Lab Control State
  const [surface, setSurface] = useState<SurfaceType>('WOOD');
  const [addedMassKg, setAddedMassKg] = useState<number>(0.1); // 100g default
  const [blockMassKg] = useState<number>(0.2); // 200g base block
  const [showVectors, setShowVectors] = useState<boolean>(true);

  // Pulling Kinematics State
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [liveForceN, setLiveForceN] = useState<number>(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  // Screenshot Capture State
  const [isScreenshotOpen, setIsScreenshotOpen] = useState<boolean>(false);
  const [screenshotData, setScreenshotData] = useState<string>('');
  const workbenchRef = useRef<FrictionWorkbench3DHandle | null>(null);

  const totalMassKg = blockMassKg + addedMassKg;
  const gravityG = 9.81;
  const normalForceN = parseFloat((totalMassKg * gravityG).toFixed(2));
  const activeSurfaceInfo = SURFACE_MATERIALS[surface];

  // Start Pull Simulation
  const handleStartPull = () => {
    if (isPulling) return;
    setIsPulling(true);

    // Multi-surface physical sound engine trigger
    if (surface === 'WOOD') {
      soundEngine.playFrictionNoise(2.2);
    } else if (surface === 'MICA') {
      soundEngine.playGasHiss(0.4);
    } else {
      soundEngine.playFrictionNoise(3.0);
    }
  };

  const handlePullProgress = (forceN: number) => {
    setLiveForceN(forceN);
  };

  const handlePullComplete = (finalForceN: number) => {
    setIsPulling(false);
    setLiveForceN(finalForceN);
  };

  const handleReset = () => {
    setIsPulling(false);
    setLiveForceN(0);
  };

  const handleRecordMeasurement = () => {
    if (liveForceN <= 0) return;
    const calcMu = parseFloat((liveForceN / normalForceN).toFixed(3));
    setMeasurements(prev => [
      ...prev,
      {
        trial: prev.length + 1,
        surfaceName: activeSurfaceInfo.name,
        normalForce: normalForceN,
        frictionForce: liveForceN,
        calculatedMu: calcMu,
      },
    ]);
  };

  const handleOpenScreenshot = () => {
    if (workbenchRef.current) {
      const dataUrl = workbenchRef.current.getCanvasDataURL();
      setScreenshotData(dataUrl);
    }
    setIsScreenshotOpen(true);
  };

  const avgMu =
    measurements.length > 0
      ? measurements.reduce((acc, m) => acc + m.calculatedMu, 0) / measurements.length
      : 0;

  const formattedRecords: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.normalForce,
    paramY: m.frictionForce,
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header Navigation */}
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
                Vật Lý 10 • Bài 21
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">Trang 83 SGK GDPT 2018</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>Thực Hành Đo Hệ Số Ma Sát Trượt</span>
              <span className="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 font-mono">
                3D Three.js
              </span>
            </h1>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenScreenshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <span className="hidden sm:inline">Chụp Báo Cáo</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Làm Mới</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* Formula & Objective Banner */}
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 font-mono font-bold">
              Công thức: μ = F_ms / N
            </span>
            <span className="text-slate-300">
              Kéo khối gỗ trượt đều trên mặt bàn bằng lực kế lò xo để đo lực ma sát trượt F_ms và tính hệ số μ.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVectors(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showVectors
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <span>Vector Lực 3D ({showVectors ? 'Bật' : 'Tắt'})</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (7 cols): 3D WebGL Workbench + Interactive Control Dock */}
          <div className="lg:col-span-7 space-y-3.5">
            {/* 3D Three.js Interactive Workbench Component */}
            <FrictionWorkbench3D
              ref={workbenchRef}
              surface={surface}
              addedMassKg={addedMassKg}
              blockMassKg={blockMassKg}
              isPulling={isPulling}
              onPullProgress={handlePullProgress}
              onPullComplete={handlePullComplete}
              showVectors={showVectors}
            />

            {/* Interactive Control HUD Dock */}
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Surface Material Switcher */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    1. Mặt tiếp xúc khối gỗ (SGK T83)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(SURFACE_MATERIALS) as SurfaceType[]).map(sKey => {
                      const item = SURFACE_MATERIALS[sKey];
                      const isSelected = surface === sKey;
                      return (
                        <button
                          key={sKey}
                          onClick={() => {
                            setSurface(sKey);
                            handleReset();
                          }}
                          disabled={isPulling}
                          className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                          } ${isPulling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span>{item.name}</span>
                          <span className="text-[10px] opacity-80 font-mono">μ ≈ {item.mu}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Added Slotted Weights Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      2. Quả cân gia tải m_thêm
                    </label>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      +{(addedMassKg * 1000).toFixed(0)}g (N = {normalForceN}N)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.05"
                    value={addedMassKg}
                    onChange={e => {
                      setAddedMassKg(parseFloat(e.target.value));
                      handleReset();
                    }}
                    disabled={isPulling}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>0g (Chỉ khối gỗ)</span>
                    <span>100g</span>
                    <span>200g</span>
                    <span>300g</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                <button
                  onClick={handleStartPull}
                  disabled={isPulling}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                    isPulling
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/20 active:scale-[0.98]'
                  }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>{isPulling ? 'Đang Kéo Khối Gỗ...' : 'Kéo Khối Gỗ (Start Pull)'}</span>
                </button>

                <button
                  onClick={handleRecordMeasurement}
                  disabled={liveForceN <= 0}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    liveForceN > 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 active:scale-[0.98]'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/40 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Ghi Số Liệu Đo (F_ms = {liveForceN > 0 ? `${liveForceN}N` : '---'})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): SGK GDPT 2018 Data Table & Live Graph */}
          <div className="lg:col-span-5">
            <DataTableAndGraph
              records={formattedRecords}
              xLabel="Áp lực N (Newton)"
              yLabel="Lực ma sát F_ms (Newton)"
              calculatedResult={`Hệ số ma sát trượt trung bình μ = ${avgMu.toFixed(3)}`}
            />
          </div>
        </div>
      </main>

      {/* Screenshot Capture Report Modal */}
      <ScreenshotCaptureModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        imageBase64={screenshotData}
        labId="sim-friction-coefficient"
        labTitle="Bài 21: Báo Cáo Thí Nghiệm Đo Hệ Số Ma Sát Trượt"
      />
    </div>
  );
};
