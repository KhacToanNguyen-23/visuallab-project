import React, { useState } from 'react';

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  isCorrect: boolean;
  spec: string;
}

interface Props {
  availableItems: EquipmentItem[];
  onCompleteEquipmentSelection: (selectedIds: string[]) => void;
}

export const EquipmentTray: React.FC<Props> = ({
  availableItems,
  onCompleteEquipmentSelection,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const toggleSelect = (item: EquipmentItem) => {
    if (selectedIds.includes(item.id)) {
      setSelectedIds(prev => prev.filter(id => id !== item.id));
      setWarningMessage(null);
    } else {
      if (!item.isCorrect) {
        setWarningMessage(`⚠️ Cảnh báo: Dụng cụ "${item.name}" không cần thiết cho bài thực hành này!`);
        setTimeout(() => setWarningMessage(null), 3500);
      }
      setSelectedIds(prev => [...prev, item.id]);
    }
  };

  const correctItemIds = availableItems.filter(i => i.isCorrect).map(i => i.id);
  const isAllCorrectSelected = correctItemIds.every(id => selectedIds.includes(id));

  const handleConfirm = () => {
    if (isAllCorrectSelected) {
      onCompleteEquipmentSelection(selectedIds);
    } else {
      setWarningMessage('⚠️ Bạn chưa chọn đủ các dụng cụ cần thiết theo hướng dẫn SGK!');
      setTimeout(() => setWarningMessage(null), 3500);
    }
  };

  return (
    <div className="h-full w-full p-8 bg-slate-950 text-slate-100 flex flex-col gap-6 overflow-y-auto">
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Bước 2: Lựa Chọn Dụng Cụ Thí Nghiệm
        </span>
        <h3 className="text-2xl font-bold text-white mt-1">
          Khay Dụng Cụ Chuẩn Thông Tư 39/2021/TT-BGDĐT
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Hãy nhấp chọn đúng các thiết bị cần thiết cho bài thực hành trước khi tiến hành thao tác trên Canvas.
        </p>
      </div>

      {warningMessage && (
        <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-4 py-3 rounded-xl animate-bounce">
          {warningMessage}
        </div>
      )}

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {availableItems.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleSelect(item)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-100">{item.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.spec}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800 flex justify-end">
        <button
          onClick={handleConfirm}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg transition"
        >
          Xác Nhận Đủ Dụng Cụ & Sang Bước 3 →
        </button>
      </div>
    </div>
  );
};
