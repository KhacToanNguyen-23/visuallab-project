import React from 'react';
import { useSpeedMeasurementStore } from '../../store/useSpeedMeasurementStore.ts';

export const SpeedDataTablePanel: React.FC = () => {
  const { measurements, angleDeg, setAngleDeg, frictionCoeff, setFrictionCoeff, clearMeasurements } = useSpeedMeasurementStore();

  return (
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm pointer-events-auto select-auto"
    >
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Bảng Số Liệu Đo Tốc Độ</h3>
          <p className="text-xs text-slate-500">Máng nghiêng & Cổng quang E-F</p>
        </div>
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
            clearMeasurements();
          }}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded bg-rose-50 border border-rose-200 cursor-pointer"
        >
          Xóa bảng
        </button>
      </div>

      {/* Control sliders for Ramp parameters */}
      <div className="p-3 bg-slate-100 border-b border-slate-200 text-xs space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-slate-700">Góc dốc α:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setAngleDeg(Math.max(5, angleDeg - 1));
                }}
                className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-200 font-bold cursor-pointer text-sm shadow-xs active:scale-95"
              >
                -
              </button>
              <span className="font-bold text-blue-600 min-w-8 text-center text-sm">{angleDeg}°</span>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setAngleDeg(Math.min(45, angleDeg + 1));
                }}
                className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-200 font-bold cursor-pointer text-sm shadow-xs active:scale-95"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={angleDeg}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-300 rounded-lg appearance-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-slate-700">Hệ số ma sát μ:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setFrictionCoeff(Math.max(0, Number((frictionCoeff - 0.01).toFixed(2))));
                }}
                className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-200 font-bold cursor-pointer text-sm shadow-xs active:scale-95"
              >
                -
              </button>
              <span className="font-bold text-slate-600 min-w-10 text-center text-sm">{frictionCoeff.toFixed(2)}</span>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setFrictionCoeff(Math.min(0.2, Number((frictionCoeff + 0.01).toFixed(2))));
                }}
                className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-200 font-bold cursor-pointer text-sm shadow-xs active:scale-95"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="0.2"
            step="0.01"
            value={frictionCoeff}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setFrictionCoeff(Number(e.target.value))}
            className="w-full accent-slate-600 cursor-pointer h-2 bg-slate-300 rounded-lg appearance-none"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-200/60 text-slate-700 font-bold border-b border-slate-300">
              <th className="p-1.5">Lần</th>
              <th className="p-1.5">s (m)</th>
              <th className="p-1.5">Δt (s)</th>
              <th className="p-1.5">v_tb (m/s)</th>
              <th className="p-1.5">a (m/s²)</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m, index) => (
              <tr key={m.id} className="border-b border-slate-200 hover:bg-white transition">
                <td className="p-1.5 font-semibold text-slate-500">{index + 1}</td>
                <td className="p-1.5">{m.s.toFixed(2)}</td>
                <td className="p-1.5">{m.t.toFixed(4)}</td>
                <td className="p-1.5 font-bold text-emerald-600">{m.vAvg.toFixed(3)}</td>
                <td className="p-1.5 font-bold text-blue-600">{m.aCalculated.toFixed(2)}</td>
              </tr>
            ))}
            {measurements.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400 italic">
                  Chưa có số liệu. Bấm "Thả xe" để ghi nhận lần đo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
