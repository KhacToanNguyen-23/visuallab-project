import React, { useState } from 'react';

export type DeviceType =
  | 'STAND'
  | 'INCLINED_PLANE'
  | 'SPRING'
  | 'WEIGHT'
  | 'PHOTOGATE'
  | 'CART'
  | 'BALL'
  | 'FRICTION_BLOCK'
  | 'SPRING_BALANCE'
  | 'AIR_TRACK'
  | 'PENDULUM'
  | 'POWER_SUPPLY'
  | 'VOLTMETER'
  | 'AMMETER'
  | 'GALVANOMETER'
  | 'RHEOSTAT'
  | 'SWITCH'
  | 'MAGNET'
  | 'INDUCTION_COIL'
  | 'LASER'
  | 'YOUNG_SLIT'
  | 'FRINGE_SCREEN'
  | 'REFRACTOR'
  | 'RESONANCE_TUBE'
  | 'CALORIMETER'
  | 'GAS_PISTON'
  | 'PRESSURE_GAUGE'
  | 'ELECTROMAGNET'
  | 'FRICTION_TABLE'
  | 'DIGITAL_TIMER';

export interface PaletteItem {
  type: DeviceType;
  name: string;
  category: 'MECHANICS' | 'CIRCUITS' | 'OPTICS' | 'THERMAL' | 'SENSORS' | 'LOADS';
  icon: string;
  description: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  // CƠ HỌC
  {
    type: 'STAND',
    name: 'Giá Đỡ Thí Nghiệm',
    category: 'MECHANICS',
    icon: '🏗️',
    description: 'Cột trụ thẳng đứng có tay đòn treo lò xo và thước đo mm',
  },
  {
    type: 'INCLINED_PLANE',
    name: 'Máng Nghiêng Định Hướng',
    category: 'MECHANICS',
    icon: '📐',
    description: 'Máng ray hợp kim nhôm chỉnh được góc dốc và chiều cao',
  },
  {
    type: 'AIR_TRACK',
    name: 'Máng Đệm Khí Phẳng',
    category: 'MECHANICS',
    icon: '🛝',
    description: 'Máng nhôm đệm khí không ma sát kèm thước đo va chạm',
  },
  {
    type: 'FRICTION_BLOCK',
    name: 'Khối Gỗ Thí Nghiệm',
    category: 'LOADS',
    icon: '🪵',
    description: 'Khối gỗ có móc kéo lực kế và bề mặt gia tải quả cân',
  },
  {
    type: 'SPRING_BALANCE',
    name: 'Lực Kế Lò Xo',
    category: 'SENSORS',
    icon: '📏',
    description: 'Lực kế 0-5N hiển thị vạch Newton và kim chỉ lực kéo',
  },
  {
    type: 'PENDULUM',
    name: 'Con Lắc Đơn',
    category: 'LOADS',
    icon: '⏱️',
    description: 'Dây treo điều chỉnh độ dài và quả cầu kim loại dao động',
  },
  {
    type: 'SPRING',
    name: 'Lò Xo Xoắn Đàn Hồi',
    category: 'LOADS',
    icon: '➰',
    description: 'Lò xo đàn hồi đo độ cứng k và dao động điều hòa',
  },
  {
    type: 'WEIGHT',
    name: 'Quả Cân 50g',
    category: 'LOADS',
    icon: '⚖️',
    description: 'Quả nặng có móc xâu chuỗi nhiều quả nối tiếp',
  },
  {
    type: 'PHOTOGATE',
    name: 'Cổng Quang Điện',
    category: 'SENSORS',
    icon: '⏱️',
    description: 'Cảm biến hồng ngoại bắt dính vào cột giá hoặc máng nghiêng',
  },
  {
    type: 'CART',
    name: 'Xe Trượt Có Cờ Chắn',
    category: 'MECHANICS',
    icon: '🚗',
    description: 'Xe lăn 4 bánh gắn cờ chắn sáng 10mm trượt trên máng',
  },
  {
    type: 'BALL',
    name: 'Viên Bi Thép',
    category: 'LOADS',
    icon: '⚪',
    description: 'Bi thép tròn rơi tự do hoặc lăn trong lòng máng',
  },

  // MẠCH ĐIỆN & TỪ TRƯỜNG
  {
    type: 'POWER_SUPPLY',
    name: 'Nguồn Pin DC 1.5V',
    category: 'CIRCUITS',
    icon: '🔋',
    description: 'Nguồn pin điện hóa 1.5V DC có cực dương (+) và cực âm (-)',
  },
  {
    type: 'VOLTMETER',
    name: 'Vôn Kế DC',
    category: 'CIRCUITS',
    icon: '📟',
    description: 'Đo hiệu điện thế U giữa 2 điểm mạch (0 - 3V)',
  },
  {
    type: 'AMMETER',
    name: 'Ampe Kế DC',
    category: 'CIRCUITS',
    icon: '📟',
    description: 'Đo cường độ dòng điện I nối tiếp trong mạch (0 - 500mA)',
  },
  {
    type: 'GALVANOMETER',
    name: 'Điện Kế G',
    category: 'CIRCUITS',
    icon: '🧭',
    description: 'Phát hiện dòng điện cảm ứng nhỏ và xác định chiều dòng điện',
  },
  {
    type: 'RHEOSTAT',
    name: 'Biến Trở Con Chạy',
    category: 'CIRCUITS',
    icon: '🎚️',
    description: 'Thay đổi điện trở mạch 0 - 100Ω bằng cần gạt',
  },
  {
    type: 'SWITCH',
    name: 'Khóa K (Công Tắc)',
    category: 'CIRCUITS',
    icon: '🔘',
    description: 'Đóng/ngắt mạch điện an toàn',
  },
  {
    type: 'MAGNET',
    name: 'Nam Châm Vĩnh Cửu',
    category: 'CIRCUITS',
    icon: '🧲',
    description: 'Thanh nam châm 2 cực Bắc (N) và Nam (S)',
  },
  {
    type: 'INDUCTION_COIL',
    name: 'Cuộn Dây Cảm Ứng',
    category: 'CIRCUITS',
    icon: '🌀',
    description: 'Cuộn dây đồng 500 vòng sinh suất điện động cảm ứng',
  },

  // QUANG HỌC & SÓNG
  {
    type: 'LASER',
    name: 'Nguồn Phát Laser RGB',
    category: 'OPTICS',
    icon: '🔦',
    description: 'Nguồn laser chọn bước sóng 380 - 750nm (Đỏ, Lục, Lam)',
  },
  {
    type: 'YOUNG_SLIT',
    name: 'Khe Kép Y-âng',
    category: 'OPTICS',
    icon: '🚪',
    description: 'Bản 2 khe hẹp song song a = 0.1 - 1.0mm giao thoa',
  },
  {
    type: 'FRINGE_SCREEN',
    name: 'Màn Hứng Vân & Thước Kẹp',
    category: 'OPTICS',
    icon: '🖥️',
    description: 'Màn hứng vân giao thoa kèm vạch đo vi sai khoảng vân i',
  },
  {
    type: 'REFRACTOR',
    name: 'Bán Trụ Thủy Tinh Khúc Xạ',
    category: 'OPTICS',
    icon: '🔮',
    description: 'Khối bán trụ chiết suất n = 1.5 trên đĩa chia độ 360°',
  },
  {
    type: 'RESONANCE_TUBE',
    name: 'Ống Cộng Hưởng Sóng Âm',
    category: 'OPTICS',
    icon: '🧪',
    description: 'Ống thủy tinh chứa nước dâng hạ để đo bước sóng âm',
  },

  // NHIỆT HỌC & KHÍ
  {
    type: 'CALORIMETER',
    name: 'Bình Nhiệt Lượng Kế',
    category: 'THERMAL',
    icon: '🫙',
    description: 'Bình xốp 2 vỏ cách nhiệt kèm dây nung điện trở',
  },
  {
    type: 'GAS_PISTON',
    name: 'Xy-Lanh Nén Khí Pít-tông',
    category: 'THERMAL',
    icon: '💉',
    description: 'Xy-lanh nén khí đẳng nhiệt 100cm³ kiểm chứng pV = const',
  },
  {
    type: 'PRESSURE_GAUGE',
    name: 'Áp Kế Đo Áp Suất',
    category: 'THERMAL',
    icon: '⏱️',
    description: 'Đồng hồ áp kế cơ hiển thị thang đo 0 - 3 bar',
  },
  {
    type: 'ELECTROMAGNET',
    name: 'Nam Châm Điện Kẹp Cột',
    category: 'CIRCUITS',
    icon: '⚡',
    description: 'Nam châm điện kèm công tắc nhả bi và cọc đấu dây nguồn',
  },
  {
    type: 'FRICTION_TABLE',
    name: 'Bàn Trượt Đa Bề Mặt',
    category: 'MECHANICS',
    icon: '🛹',
    description: 'Bàn trượt 3 bề mặt (Gỗ, Mica, Cao su) đo hệ số ma sát',
  },
  {
    type: 'DIGITAL_TIMER',
    name: 'Đồng Hồ Đo Hiện Số',
    category: 'SENSORS',
    icon: '📟',
    description: 'Đồng hồ điện tử 3 ngõ vào A/B/Nam châm độ chia 0.001s',
  },
];

interface WorkbenchPaletteProps {
  onSpawnDevice: (type: DeviceType) => void;
  onClearAll: () => void;
  onResetScene: () => void;
}

export const WorkbenchPalette: React.FC<WorkbenchPaletteProps> = ({
  onSpawnDevice,
  onClearAll,
  onResetScene,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = PALETTE_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <aside
      onPointerDown={(e) => e.stopPropagation()}
      className="w-72 h-full flex flex-col bg-white border-r border-slate-200 select-none shadow-sm z-20"
    >
      {/* Palette Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="font-extrabold text-sm text-slate-800 tracking-tight">Hộp Dụng Cụ (Palette)</h2>
          <p className="text-[11px] text-slate-500">Bấm để thêm linh kiện ra bàn</p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResetScene();
            }}
            title="Đặt lại vị trí"
            className="p-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
          >
            🔄
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              onClearAll();
            }}
            title="Xóa sạch bàn làm việc"
            className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex p-2 gap-1 border-b border-slate-100 bg-slate-50 text-[11px] font-bold overflow-x-auto">
        {[
          { id: 'ALL', label: 'Tất Cả' },
          { id: 'MECHANICS', label: 'Cơ Học' },
          { id: 'CIRCUITS', label: 'Điện Từ' },
          { id: 'OPTICS', label: 'Quang Sóng' },
          { id: 'THERMAL', label: 'Nhiệt Khí' },
          { id: 'LOADS', label: 'Vật Thể' },
          { id: 'SENSORS', label: 'Cảm Biến' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              setSelectedCategory(tab.id);
            }}
            className={`flex-1 py-1.5 px-1.5 rounded-md transition-colors cursor-pointer text-center whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-slate-100">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Tìm linh kiện..."
          className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
        />
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.type}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSpawnDevice(item.type);
            }}
            className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h4>
              <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400 italic">
            Không tìm thấy linh kiện phù hợp
          </div>
        )}
      </div>
    </aside>
  );
};
