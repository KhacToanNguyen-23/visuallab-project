import React from 'react';
import type { ComponentType } from '../../engine/physics/CircuitSolver';

interface ComponentOption {
  type: ComponentType;
  label: string;
  icon: string;
  defaultValue: number;
}

const COMPONENT_OPTIONS: ComponentOption[] = [
  { type: 'battery', label: 'Pin (Nguồn DC)', icon: '🔋', defaultValue: 9 },
  { type: 'resistor', label: 'Điện trở (Ω)', icon: '⚡', defaultValue: 10 },
  { type: 'bulb', label: 'Bóng đèn', icon: '💡', defaultValue: 10 },
  { type: 'switch', label: 'Công tắc', icon: '🔘', defaultValue: 0 },
  { type: 'wire', label: 'Dây dẫn', icon: '〰️', defaultValue: 0 },
  { type: 'ammeter', label: 'Ampe kế (A)', icon: '🅰️', defaultValue: 0 },
  { type: 'voltmeter', label: 'Von kế (V)', icon: 'Ⓥ', defaultValue: 0 },
];

interface Props {
  onAddComponent: (type: ComponentType, defaultValue: number) => void;
}

export const ComponentToolbar: React.FC<Props> = ({ onAddComponent }) => {
  return (
    <div className="w-64 bg-slate-900 text-white p-4 border-r border-slate-800 flex flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
        Bảng Linh Kiện
      </h3>

      <div className="flex flex-col gap-2">
        {COMPONENT_OPTIONS.map(item => (
          <button
            key={item.type}
            onClick={() => onAddComponent(item.type, item.defaultValue)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-left text-sm font-medium text-slate-200 shadow-sm"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
