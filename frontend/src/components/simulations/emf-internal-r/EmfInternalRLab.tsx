import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  POWER_SOURCE_PRESETS,
  type PowerSourcePreset,
  type EmfMeasurementRecord,
  type EmfGradingResult,
  solveCircuit,
} from './emfInternalREngine';
import { EmfInternalRWorkbench3D } from './EmfInternalRWorkbench3D';
import { EmfInternalRWorkbenchHudDock } from './EmfInternalRWorkbenchHudDock';
import {
  EmfInternalRLabWizardWorksheet,
  type EmfSubmissionDetails,
} from './EmfInternalRLabWizardWorksheet';

export interface EmfInternalRLabProps {
  assignmentId?: string;
  onOpenSubmissionDrawer?: () => void;
  onGraded?: (result: EmfGradingResult, details?: EmfSubmissionDetails) => void;
}

export const EmfInternalRLab: React.FC<EmfInternalRLabProps> = ({
  assignmentId,
  onOpenSubmissionDrawer,
  onGraded,
}) => {
  const navigate = useNavigate();

  // Circuit States
  const [selectedSource, setSelectedSource] = useState<PowerSourcePreset>(POWER_SOURCE_PRESETS[0]);
  const [rheostatROhms, setRheostatROhms] = useState<number>(20); // 20 Ohm
  const [switchOpen, setSwitchOpen] = useState<boolean>(false);
  const [meterMode, setMeterMode] = useState<'analog' | 'digital'>('analog');
  const [cameraMode, setCameraMode] = useState<'perspective' | 'front' | 'top'>('perspective');

  // Solved Circuit Values
  const circuitState = useMemo(() => {
    return solveCircuit(selectedSource.id, rheostatROhms, switchOpen, true);
  }, [selectedSource.id, rheostatROhms, switchOpen]);

  // Recorded Measurements
  const [records, setRecords] = useState<EmfMeasurementRecord[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Toggle Switch
  const handleToggleSwitch = useCallback(() => {
    setSwitchOpen(prev => {
      const next = !prev;
      showNotification(next ? '🔌 Đã mở khóa K (Ngắt mạch điện)' : '⚡ Đã đóng khóa K (Mạch điện kín)');
      return next;
    });
  }, []);

  // Toggle Meter Mode
  const handleToggleMeterMode = useCallback(() => {
    setMeterMode(prev => (prev === 'analog' ? 'digital' : 'analog'));
  }, []);

  // Reset Circuit
  const handleReset = useCallback(() => {
    setSwitchOpen(false);
    setRheostatROhms(20);
    showNotification('🔄 Đã đặt lại mạch điện về cấu hình ban đầu.');
  }, []);

  // Record Data from HUD Dock
  const handleRecordTrial = useCallback(() => {
    if (switchOpen) {
      showNotification('⚠️ Khóa K đang mở (dòng điện I = 0)! Hãy bấm "⚡ Đóng Khóa K" để ghi nhận số liệu.');
      return;
    }

    const { currentIAmps, voltageUVolts } = circuitState;

    let matchedMissionId: number | undefined;
    if (selectedSource.id === 'battery_1x') matchedMissionId = 1;
    else if (selectedSource.id === 'battery_2x') matchedMissionId = 2;
    else if (selectedSource.id === 'battery_old') matchedMissionId = 3;

    // Check duplicate resistance on same source
    const existing = records.find(
      r => r.sourceId === selectedSource.id && Math.abs(r.rheostatROhms - rheostatROhms) < 0.05
    );
    if (existing) {
      showNotification(`⚠️ Đã có số liệu tại mức R = ${rheostatROhms}Ω. Vui lòng kéo biến trở sang nấc khác để có điểm đo mới.`);
      return;
    }

    setRecords(prev => [
      ...prev,
      {
        step: prev.length + 1,
        missionId: matchedMissionId,
        sourceId: selectedSource.id,
        sourceName: selectedSource.name,
        rheostatROhms,
        currentIAmps,
        voltageUVolts,
      },
    ]);

    showNotification(`✓ Đã ghi điểm đo: R = ${rheostatROhms}Ω, I = ${currentIAmps}A, U = ${voltageUVolts}V!`);
  }, [switchOpen, circuitState, selectedSource, rheostatROhms, records]);

  // Record for specific mission
  const handleRecordForMission = useCallback(
    (missionId: number) => {
      if (switchOpen) {
        showNotification('⚠️ Khóa K đang mở! Hãy đóng khóa K trước khi ghi số liệu.');
        return;
      }

      let isMatch = false;
      if (missionId === 1 && selectedSource.id === 'battery_1x') isMatch = true;
      else if (missionId === 2 && selectedSource.id === 'battery_2x') isMatch = true;
      else if (missionId === 3 && selectedSource.id === 'battery_old') isMatch = true;

      if (!isMatch) {
        if (missionId === 1) showNotification('⚠️ Chưa khớp Nhiệm vụ 1: Vui lòng chọn nguồn Pin Đơn 1.5V.');
        else if (missionId === 2) showNotification('⚠️ Chưa khớp Nhiệm vụ 2: Vui lòng chọn Bộ 2 Pin Nối Tiếp 3.0V.');
        else if (missionId === 3) showNotification('⚠️ Chưa khớp Nhiệm vụ 3: Vui lòng chọn Pin Cũ (Nội trở cao).');
        return;
      }

      const { currentIAmps, voltageUVolts } = circuitState;

      setRecords(prev => [
        ...prev,
        {
          step: prev.length + 1,
          missionId,
          sourceId: selectedSource.id,
          sourceName: selectedSource.name,
          rheostatROhms,
          currentIAmps,
          voltageUVolts,
        },
      ]);

      showNotification(`✓ Đã ghi nhận số liệu vào Nhiệm vụ ${missionId}!`);
    },
    [switchOpen, selectedSource.id, selectedSource.name, circuitState, rheostatROhms]
  );

  // Remove single record
  const handleRemoveRecord = useCallback((index: number) => {
    setRecords(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all records
  const handleClearRecords = useCallback(() => {
    setRecords([]);
    showNotification('🗑 Đã xóa toàn bộ số liệu đo.');
  }, []);

  // Graded Callback
  const handleGraded = useCallback((result: EmfGradingResult, _details?: EmfSubmissionDetails) => {
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
            <span className="text-xl">⚡</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-100">
                  Thực Hành: Đo Suất Điện Động & Điện Trở Trong Của Nguồn Điện
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vật lý 11
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Phương pháp ngoại suy đồ thị tuyến tính U = E - I • r theo định luật Ohm toàn mạch
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
        {/* Left: 3D Circuit Workbench + HUD Dock */}
        <div className="flex-[1.2] flex flex-col gap-3 min-w-0 h-full">
          <div className="flex-1 min-h-0">
            <EmfInternalRWorkbench3D
              selectedSource={selectedSource}
              rheostatROhms={rheostatROhms}
              switchOpen={switchOpen}
              meterMode={meterMode}
              currentIAmps={circuitState.currentIAmps}
              voltageUVolts={circuitState.voltageUVolts}
              cameraMode={cameraMode}
            />
          </div>

          <div className="shrink-0">
            <EmfInternalRWorkbenchHudDock
              selectedSource={selectedSource}
              rheostatROhms={rheostatROhms}
              switchOpen={switchOpen}
              meterMode={meterMode}
              cameraMode={cameraMode}
              onSelectSource={setSelectedSource}
              onRheostatChange={setRheostatROhms}
              onToggleSwitch={handleToggleSwitch}
              onToggleMeterMode={handleToggleMeterMode}
              onChangeCameraMode={setCameraMode}
              onReset={handleReset}
              onRecordTrial={handleRecordTrial}
            />
          </div>
        </div>

        {/* Right: 3-Tab Wizard Worksheet */}
        <div className="flex-1 min-w-0 h-full">
          <EmfInternalRLabWizardWorksheet
            currentSourceId={selectedSource.id}
            currentRheostatROhms={rheostatROhms}
            currentIAmps={circuitState.currentIAmps}
            currentUVolts={circuitState.voltageUVolts}
            records={records}
            assignmentId={assignmentId}
            onAddRecordForMission={handleRecordForMission}
            onRemoveRecord={handleRemoveRecord}
            onClearRecords={handleClearRecords}
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
