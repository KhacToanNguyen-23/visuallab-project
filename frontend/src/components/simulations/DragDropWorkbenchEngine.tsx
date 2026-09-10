import React, { useState } from 'react';

interface ComponentItem {
  id: string;
  name: string;
  badge: string;
  type: 'battery' | 'resistor' | 'bulb' | 'voltmeter' | 'ammeter' | 'switch' | 'spring' | 'mass';
}

const PALETTE_ITEMS: ComponentItem[] = [
  { id: 'item-battery', name: 'Nguồn Điện Pin 9V', badge: '[PIN]', type: 'battery' },
  { id: 'item-resistor', name: 'Điện Trở 10 Ω', badge: '[R]', type: 'resistor' },
  { id: 'item-bulb', name: 'Bóng Đèn Sáng', badge: '[ĐÈN]', type: 'bulb' },
  { id: 'item-voltmeter', name: 'Vôn Kế Đo U', badge: '[VÔN KẾ]', type: 'voltmeter' },
  { id: 'item-ammeter', name: 'Ampe Kế Đo I', badge: '[AMPE KẾ]', type: 'ammeter' },
  { id: 'item-switch', name: 'Công Tắc Nối', badge: '[CÔNG TẮC]', type: 'switch' },
  { id: 'item-spring', name: 'Lò Xo Thẳng Đứng', badge: '[LÒ XO]', type: 'spring' },
  { id: 'item-mass', name: 'Quả Cân 200g', badge: '[QUẢ CÂN]', type: 'mass' },
];

export const DragDropWorkbenchEngine: React.FC = () => {
  const [workbenchItems, setWorkbenchItems] = useState<{ id: string; item: ComponentItem; x: number; y: number }[]>([]);
  const [isCircuitClosed, setIsCircuitClosed] = useState(false);
  const [currentI, setCurrentI] = useState<number>(0);
  const [voltageU] = useState<number>(9.0);

  const handleAddComponent = (item: ComponentItem) => {
    const newItem = {
      id: `wb-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      item,
      x: 100 + (workbenchItems.length % 4) * 110,
      y: 80 + Math.floor(workbenchItems.length / 4) * 80,
    };
    setWorkbenchItems(prev => [...prev, newItem]);
    recalculateCircuit([...workbenchItems, newItem], isCircuitClosed);
  };

  const handleRemoveComponent = (id: string) => {
    const next = workbenchItems.filter(i => i.id !== id);
    setWorkbenchItems(next);
    recalculateCircuit(next, isCircuitClosed);
  };

  const handleToggleSwitch = () => {
    const nextClosed = !isCircuitClosed;
    setIsCircuitClosed(nextClosed);
    recalculateCircuit(workbenchItems, nextClosed);
  };

  const recalculateCircuit = (items: { item: ComponentItem }[], closed: boolean) => {
    if (!closed) {
      setCurrentI(0);
      return;
    }
    const hasBattery = items.some(i => i.item.type === 'battery');
    const resistors = items.filter(i => i.item.type === 'resistor' || i.item.type === 'bulb').length;

    if (hasBattery && resistors > 0) {
      const totalR = resistors * 10;
      setCurrentI(Number((voltageU / totalR).toFixed(2)));
    } else {
      setCurrentI(0);
    }
  };

  return (
    <div className="border rounded-xl p-5 space-y-4" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
      <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            [ENGINE 1: KÉO-THẢ WORKBENCH]
          </span>
          <h3 className="font-bold text-sm">Phòng Lab Mô Phỏng Điện Học & Cơ Học</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span>HĐTH (U): <strong className="text-cyan-600">{voltageU}V</strong></span>
          <span>Dòng điện (I): <strong className="text-emerald-600">{currentI}A</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Component Palette (3 cols) */}
        <div className="md:col-span-3 border rounded-lg p-3 space-y-2" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-bold text-xs uppercase tracking-wider opacity-70 mb-2">Hộp Linh Kiện Mô Phỏng</h4>
          <div className="space-y-1.5">
            {PALETTE_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleAddComponent(item)}
                className="w-full text-left p-2 rounded border text-xs font-semibold flex justify-between items-center cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
              >
                <span>{item.name}</span>
                <span className="text-[9px] font-mono opacity-80 px-1 py-0.5 rounded border" style={{ borderColor: 'currentColor' }}>
                  {item.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Workbench Canvas Area (9 cols) */}
        <div className="md:col-span-9 border rounded-lg p-4 flex flex-col justify-between min-h-[320px] relative overflow-hidden" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-center border-b pb-2 text-xs" style={{ borderColor: 'var(--border-color)' }}>
            <span className="font-mono text-[11px] opacity-75">Mặt Bàn Thí Nghiệm (Canvas Grid) — {workbenchItems.length} Linh Kiện</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSwitch}
                className={`px-3 py-1 text-xs font-bold rounded border cursor-pointer ${isCircuitClosed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
              >
                {isCircuitClosed ? '[MẠCH ĐÓNG - ON]' : '[MẠCH NGẮT - OFF]'}
              </button>
              <button
                onClick={() => {
                  setWorkbenchItems([]);
                  setCurrentI(0);
                  setIsCircuitClosed(false);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded border cursor-pointer"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-panel)' }}
              >
                Đặt Lại
              </button>
            </div>
          </div>

          {/* Workbench Placed Elements */}
          <div className="flex-1 my-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {workbenchItems.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-center opacity-50 py-12">
                <span className="text-xs font-mono">Bấm chọn linh kiện từ Hộp Linh Kiện bên trái để đưa ra bàn thí nghiệm</span>
              </div>
            ) : (
              workbenchItems.map((wb) => (
                <div
                  key={wb.id}
                  className="p-3 border rounded-lg flex flex-col justify-between items-center text-center relative transition-all"
                  style={{ backgroundColor: 'var(--bg-panel)', borderColor: isCircuitClosed ? 'var(--accent-primary)' : 'var(--border-color)' }}
                >
                  <button
                    onClick={() => handleRemoveComponent(wb.id)}
                    className="absolute top-1 right-1 text-[10px] opacity-50 hover:opacity-100 cursor-pointer font-bold px-1"
                  >
                    ✕
                  </button>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                    {wb.item.badge}
                  </span>
                  <span className="font-bold text-xs mt-1">{wb.item.name}</span>
                  {isCircuitClosed && (wb.item.type === 'battery' || wb.item.type === 'resistor' || wb.item.type === 'bulb') && (
                    <span className="text-[9px] text-emerald-600 font-mono font-bold mt-1">● Dòng điện chạy</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Realtime Output Bar */}
          <div className="p-3 rounded-lg border text-xs flex justify-between items-center font-mono" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <span>Trạng thái: <strong className={isCircuitClosed ? 'text-emerald-600' : 'text-rose-500'}>{isCircuitClosed ? 'Đang dẫn điện' : 'Ngắt mạch'}</strong></span>
            <span>Cường độ I = U/R: <strong className="text-emerald-600">{currentI} A</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
