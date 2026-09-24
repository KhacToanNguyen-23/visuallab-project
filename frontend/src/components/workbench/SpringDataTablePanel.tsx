import React from 'react';
import { useSpringMassStore } from '../../store/useSpringMassStore.ts';

interface SpringDataTablePanelProps {
  onRecord: () => void;
  onPerturb: () => void;
}

export const SpringDataTablePanel: React.FC<SpringDataTablePanelProps> = ({ onRecord, onPerturb }) => {
  const {
    weightsCount,
    setWeightsCount,
    customWeightMassKg,
    setCustomWeightMassKg,
    stiffnessK,
    setStiffnessK,
    measurements,
    clearMeasurements,
  } = useSpringMassStore();

  const currentTotalMassG = weightsCount * customWeightMassKg * 1000;

  return (
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm pointer-events-auto select-auto"
    >
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Bảng Số Liệu Định Luật Hooke</h3>
          <p className="text-xs text-slate-500">F_đh = k · Δl | Khảo sát độ giãn</p>
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

      {/* Control Panel: Weights & Stiffness & Drag Tip */}
      <div className="p-3 bg-slate-100 border-b border-slate-200 text-xs space-y-3">
        {/* Số quả cân */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-slate-700">Treo quả cân trên móc:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setWeightsCount(weightsCount - 1);
                }}
                className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-200 font-bold cursor-pointer text-sm shadow-xs"
              >
                -
              </button>
              <span className="font-bold text-blue-600 min-w-20 text-center text-xs">
                {weightsCount} quả ({currentTotalMassG.toFixed(0)}g)
              </span>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setWeightsCount(weightsCount + 1);
                }}
                className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-200 font-bold cursor-pointer text-sm shadow-xs"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={weightsCount}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setWeightsCount(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-300 rounded-lg appearance-none"
          />
        </div>

        {/* Khối lượng tùy biến mỗi quả cân */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-slate-700">Khối lượng mỗi quả (m):</span>
            <span className="font-bold text-indigo-600 text-xs">{(customWeightMassKg * 1000).toFixed(0)} g</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={customWeightMassKg * 1000}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setCustomWeightMassKg(Number(e.target.value) / 1000)}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-300 rounded-lg appearance-none"
          />
        </div>

        {/* Độ cứng lò xo k */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-slate-700">Độ cứng chuẩn k:</span>
            <span className="font-bold text-slate-600 text-xs">{stiffnessK} N/m</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={stiffnessK}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setStiffnessK(Number(e.target.value))}
            className="w-full accent-slate-600 cursor-pointer h-2 bg-slate-300 rounded-lg appearance-none"
          />
        </div>

        {/* Tip tương tác */}
        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 leading-snug">
          💡 <strong>Kéo chuột:</strong> Giữ chuột vào quả cân/móc treo và kéo dãn để kích dao động tự nhiên; hoặc kéo giá đỡ để di chuyển bàn thí nghiệm.
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              onRecord();
            }}
            className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 shadow-sm cursor-pointer"
          >
            📸 Ghi số liệu (Lần đo)
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              onPerturb();
            }}
            className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs hover:bg-slate-300 shadow-xs cursor-pointer"
            title="Kích dao động nhanh"
          >
            Dao động
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-200/60 text-slate-700 font-bold border-b border-slate-300">
              <th className="p-1.5">Lần</th>
              <th className="p-1.5">m (g)</th>
              <th className="p-1.5">P (N)</th>
              <th className="p-1.5">Δl (cm)</th>
              <th className="p-1.5">k (N/m)</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m, index) => (
              <tr key={m.id} className="border-b border-slate-200 hover:bg-white transition">
                <td className="p-1.5 font-semibold text-slate-500">{index + 1}</td>
                <td className="p-1.5 font-medium">{(m.m * 1000).toFixed(0)}</td>
                <td className="p-1.5">{m.p.toFixed(3)}</td>
                <td className="p-1.5 font-bold text-emerald-600">{(m.deltaL * 100).toFixed(2)}</td>
                <td className="p-1.5 font-bold text-blue-600">{m.kCalculated.toFixed(1)}</td>
              </tr>
            ))}
            {measurements.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400 italic">
                  Chưa có số liệu. Bấm "+" thêm quả cân và bấm "Ghi số liệu".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
