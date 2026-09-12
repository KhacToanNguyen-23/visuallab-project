import React, { useState } from 'react';
import type { ComponentCategory, PaletteItemDef } from './types';

export const PALETTE_ITEMS: PaletteItemDef[] = [
  // Mechanics
  {
    type: 'SPRING',
    category: 'mechanics',
    name: 'Lò Xo Đàn Hồi',
    description: 'Lò xo tuân theo Định luật Hooke (k = 50 N/m)',
    icon: '🌀',
    badge: 'Cơ học',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40',
    defaultConfig: { stiffness: 50, naturalLength: 0.4 },
  },
  {
    type: 'MASS_BOB',
    category: 'mechanics',
    name: 'Quả Nặng (Mass)',
    description: 'Quả nặng gia công m = 200g có móc treo',
    icon: '🪨',
    badge: 'Cơ học',
    color: 'border-pink-500/40 text-pink-400 bg-pink-950/40',
    defaultConfig: { mass: 0.2 },
  },
  {
    type: 'STRING',
    category: 'mechanics',
    name: 'Dây Treo Không Co Co giãn',
    description: 'Dây mềm chiều dài L = 0.5m',
    icon: '🧶',
    badge: 'Cơ học',
    color: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
    defaultConfig: { length: 0.5 },
  },
  {
    type: 'CEILING_MOUNT',
    category: 'mechanics',
    name: 'Giá Cố Định Trần',
    description: 'Thanh treo kim loại đính trần',
    icon: '🧱',
    badge: 'Cơ học',
    color: 'border-slate-500/40 text-slate-300 bg-slate-900',
  },

  // Circuits
  {
    type: 'BATTERY',
    category: 'circuits',
    name: 'Nguồn Điện Pin DC 9V',
    description: 'Pin 1 chiều suất điện động E = 9V',
    icon: '🔋',
    badge: 'Điện học',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
    defaultConfig: { voltage: 9, internalR: 0.5 },
  },
  {
    type: 'BULB',
    category: 'circuits',
    name: 'Bóng Đèn Dây Tóc',
    description: 'Bóng đèn công suất 12W phát sáng',
    icon: '💡',
    badge: 'Điện học',
    color: 'border-yellow-500/40 text-yellow-400 bg-yellow-950/40',
    defaultConfig: { resistance: 6 },
  },
  {
    type: 'SWITCH',
    category: 'circuits',
    name: 'Công Tắc Dao Đóng/Mở',
    description: 'Khóa K điều khiển bật/tắt dòng điện',
    icon: '🔌',
    badge: 'Điện học',
    color: 'border-blue-500/40 text-blue-400 bg-blue-950/40',
    defaultConfig: { isOpen: true },
  },
  {
    type: 'RESISTOR',
    category: 'circuits',
    name: 'Điện Trở Mạch R',
    description: 'Điện trở cố định R = 10 Ohm',
    icon: '⚡',
    badge: 'Điện học',
    color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/40',
    defaultConfig: { resistance: 10 },
  },
  {
    type: 'WIRE',
    category: 'circuits',
    name: 'Dây Dẫn Điện Mềm',
    description: 'Dây đồng bọc cao su kết nối thiết bị',
    icon: '〰️',
    badge: 'Điện học',
    color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
  },

  // Optics
  {
    type: 'LASER',
    category: 'optics',
    name: 'Đèn Phát Laser Đỏ',
    description: 'Nguồn phát chùm sáng laser bước sóng 650nm',
    icon: '🔦',
    badge: 'Quang học',
    color: 'border-red-500/40 text-red-400 bg-red-950/40',
    defaultConfig: { wavelength: 650, isOn: true },
  },
  {
    type: 'CONVEX_LENS',
    category: 'optics',
    name: 'Thấu Kính Hội Tụ',
    description: 'Thấu kính mỏng hai mặt lồi (f = +15cm)',
    icon: '🔍',
    badge: 'Quang học',
    color: 'border-sky-500/40 text-sky-400 bg-sky-950/40',
    defaultConfig: { focalLength: 15, refractiveIndex: 1.5 },
  },
  {
    type: 'CONCAVE_LENS',
    category: 'optics',
    name: 'Thấu Kính Phân Kỳ',
    description: 'Thấu kính mỏng hai mặt lõm (f = -15cm)',
    icon: '👓',
    badge: 'Quang học',
    color: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
    defaultConfig: { focalLength: -15, refractiveIndex: 1.5 },
  },
  {
    type: 'MIRROR',
    category: 'optics',
    name: 'Gương Phẳng Phản Xạ',
    description: 'Bề mặt tráng bạc phản xạ toàn phần',
    icon: '🪞',
    badge: 'Quang học',
    color: 'border-slate-400/40 text-slate-200 bg-slate-800',
  },

  // Tools
  {
    type: 'RULER',
    category: 'tools',
    name: 'Thước Đo cm Chia Vạch',
    description: 'Thước đo mm độ dài 30cm',
    icon: '📏',
    badge: 'Dụng cụ',
    color: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
  },
  {
    type: 'PROTRACTOR',
    category: 'tools',
    name: 'Thước Đo Góc 360°',
    description: 'Thước đo góc tròn độ phân giải 1°',
    icon: '📐',
    badge: 'Dụng cụ',
    color: 'border-teal-500/40 text-teal-300 bg-teal-950/30',
  },
  {
    type: 'VOLTMETER',
    category: 'tools',
    name: 'Vôn Kế Đo Điện Áp',
    description: 'Đồng hồ đo hiệu điện thế (0-30V)',
    icon: '🎛️',
    badge: 'Dụng cụ',
    color: 'border-sky-500/40 text-sky-300 bg-sky-950/30',
  },
  {
    type: 'AMMETER',
    category: 'tools',
    name: 'Ampe Kế Đo Dòng Điện',
    description: 'Đồng hồ đo cường độ dòng điện (0-5A)',
    icon: '⏲️',
    badge: 'Dụng cụ',
    color: 'border-pink-500/40 text-pink-300 bg-pink-950/30',
  },
];

interface WorkbenchPaletteProps {
  onAddItem: (itemDef: PaletteItemDef) => void;
}

export const WorkbenchPalette: React.FC<WorkbenchPaletteProps> = ({ onAddItem }) => {
  const [activeTab, setActiveTab] = useState<ComponentCategory | 'all'>('all');

  const filteredItems =
    activeTab === 'all' ? PALETTE_ITEMS : PALETTE_ITEMS.filter(item => item.category === activeTab);

  return (
    <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col select-none overflow-hidden shadow-2xl">
      {/* Category Tabs Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800">
        <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center gap-2">
          <span>🎒 Bộ Dụng Cụ Thí Nghiệm PhET</span>
        </h2>
        <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'all' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setActiveTab('mechanics')}
            className={`py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'mechanics' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Cơ
          </button>
          <button
            onClick={() => setActiveTab('circuits')}
            className={`py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'circuits' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Điện
          </button>
          <button
            onClick={() => setActiveTab('optics')}
            className={`py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'optics' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔦 Quang
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'tools' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            📏 Đo
          </button>
        </div>
      </div>

      {/* Palette Items Grid Scroll List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {filteredItems.map(item => (
          <div
            key={item.type}
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify(item));
            }}
            className={`p-3 rounded-xl border transition shadow-md hover:border-cyan-400/60 flex flex-col justify-between gap-2 bg-slate-950/70 hover:bg-slate-800/80 group cursor-grab active:cursor-grabbing`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <div>
                  <h3 className="text-xs font-extrabold text-white tracking-tight">{item.name}</h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border inline-block mt-0.5 ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-snug">{item.description}</p>

            <button
              onClick={() => onAddItem(item)}
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700 hover:border-cyan-400 shadow cursor-pointer flex items-center justify-center gap-1.5 mt-1"
            >
              <span>➕ Thêm Vào Bàn</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
