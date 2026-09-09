import React from 'react';
import type { ComponentData } from '../../engine/physics/CircuitSolver';

interface Props {
  selectedComponent: ComponentData | null;
  onUpdateComponent: (updated: ComponentData) => void;
  onDeleteComponent: (id: string) => void;
}

export const InspectorPanel: React.FC<Props> = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
}) => {
  if (!selectedComponent) {
    return (
      <div className="w-72 bg-slate-900 text-slate-400 p-4 border-l border-slate-800 text-sm flex flex-col justify-center items-center text-center gap-2">
        <span className="text-3xl">👆</span>
        <p>Nhấp chọn một linh kiện trên sơ đồ để điều chỉnh thông số hoặc xóa.</p>
      </div>
    );
  }

  const { id, type, label, value, isOpen, current = 0, voltageDrop = 0, power = 0 } = selectedComponent;

  return (
    <div className="w-72 bg-slate-900 text-white p-4 border-l border-slate-800 flex flex-col gap-4 text-sm">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <h3 className="font-semibold text-base text-slate-100">Thông Số Linh Kiện</h3>
        <button
          onClick={() => onDeleteComponent(id)}
          className="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded transition text-xs font-semibold"
        >
          Xóa Linh Kiện
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-medium uppercase">Tên Linh Kiện</label>
        <span className="font-semibold text-slate-200">{label} ({type})</span>
      </div>

      {type === 'battery' && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400 font-medium uppercase">Điện Áp U (Volt)</label>
            <span className="font-mono text-amber-400 font-bold">{value} V</span>
          </div>
          <input
            type="range"
            min="1"
            max="24"
            step="0.5"
            value={value}
            onChange={e =>
              onUpdateComponent({ ...selectedComponent, value: parseFloat(e.target.value) })
            }
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      )}

      {(type === 'resistor' || type === 'bulb') && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400 font-medium uppercase">Điện Trở R (Ohm)</label>
            <span className="font-mono text-cyan-400 font-bold">{value} Ω</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={value}
            onChange={e =>
              onUpdateComponent({ ...selectedComponent, value: parseFloat(e.target.value) })
            }
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>
      )}

      {type === 'switch' && (
        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-slate-400 font-medium uppercase">Trạng Thái Công Tắc</span>
          <button
            onClick={() =>
              onUpdateComponent({ ...selectedComponent, isOpen: !isOpen })
            }
            className={`px-3 py-1.5 rounded font-semibold text-xs transition ${
              isOpen
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {isOpen ? 'Mở (Ngắt mạch)' : 'Đóng (Kín mạch)'}
          </button>
        </div>
      )}

      {/* Telemetry Readout */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Đo Đạc Thực Tế
        </span>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Dòng điện I:</span>
          <span className="font-mono font-bold text-sky-400">{Math.abs(current).toFixed(3)} A</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Hiệu điện thế U:</span>
          <span className="font-mono font-bold text-amber-400">{Math.abs(voltageDrop).toFixed(3)} V</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Công suất P:</span>
          <span className="font-mono font-bold text-emerald-400">{Math.abs(power).toFixed(3)} W</span>
        </div>
      </div>
    </div>
  );
};
