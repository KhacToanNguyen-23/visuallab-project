import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkbenchPalette } from '../components/workbench/WorkbenchPalette';
import { SceneryUniversalWorkbench } from '../components/workbench/SceneryUniversalWorkbench';
import type { PaletteItemDef, PlacedItem } from '../components/workbench/types';
import { ScreenshotCaptureModal } from '../components/common/ScreenshotCaptureModal';

export const UniversalWorkbenchPage: React.FC = () => {
  const navigate = useNavigate();
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Screenshot Storage Modal State
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState<boolean>(false);
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddItem = (itemDef: PaletteItemDef) => {
    const newItem: PlacedItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: itemDef.type,
      name: itemDef.name,
      icon: itemDef.icon,
      category: itemDef.category,
      x: 350 + (placedItems.length % 5) * 40,
      y: 200 + (placedItems.length % 4) * 40,
      config: itemDef.defaultConfig ? { ...itemDef.defaultConfig } : {},
    };

    setPlacedItems(prev => [...prev, newItem]);
    showToast(`Đã thêm ${itemDef.icon} ${itemDef.name} vào bàn thí nghiệm`);
  };

  const handleAddItemAtPos = useCallback((itemDef: PaletteItemDef, x: number, y: number) => {
    const newItem: PlacedItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: itemDef.type,
      name: itemDef.name,
      icon: itemDef.icon,
      category: itemDef.category,
      x,
      y,
      config: itemDef.defaultConfig ? { ...itemDef.defaultConfig } : {},
    };

    setPlacedItems(prev => [...prev, newItem]);
    showToast(`Đã thả ${itemDef.icon} ${itemDef.name} vào bàn thí nghiệm`);
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setPlacedItems(prev => prev.filter(item => item.id !== id));
    showToast('Đã xóa linh kiện khỏi bàn thí nghiệm');
  }, []);

  const handleUpdateItemPosition = useCallback((id: string, x: number, y: number) => {
    setPlacedItems(prev =>
      prev.map(item => (item.id === id ? { ...item, x, y } : item))
    );
  }, []);

  const handleClearAll = () => {
    if (placedItems.length === 0) return;
    setPlacedItems([]);
    showToast('Đã dọn dẹp sạch bàn thí nghiệm');
  };

  const handleCaptureScreenshot = () => {
    const svgElement = document.querySelector('div[ref] svg') || document.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 600;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(image, 0, 0);
          const png = canvas.toDataURL('image/png');
          setScreenshotBase64(png);
          setIsScreenshotModalOpen(true);
        }
      };
      image.src = blobURL;
    } else {
      showToast('📸 Vui lòng đợi mô phỏng sẵn sàng để chụp ảnh');
    }
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-white font-sans flex flex-col select-none overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-cyan-400 font-bold text-xs animate-bounce flex items-center gap-2">
          <span>✨ {toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation & Action Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            ← Về Bảng Bài Tập
          </button>
          <h1 className="text-base font-black text-cyan-400 tracking-tight flex items-center gap-2">
            <span>🌀 Bàn Thí Nghiệm Vật Lý Tự Do (Universal Physics Sandbox)</span>
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-700/60">
            PhET SceneryStack 60 FPS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-red-950 hover:border-red-600/60 text-slate-300 hover:text-red-300 text-xs font-bold transition cursor-pointer flex items-center gap-1"
          >
            <span>🧹 Xóa Hết ({placedItems.length})</span>
          </button>

          <button
            onClick={handleCaptureScreenshot}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-600/60 text-cyan-300 hover:text-white text-xs font-extrabold transition shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>📸 Chụp Ảnh & Lưu Kho</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Component Tool Palette */}
        <WorkbenchPalette onAddItem={handleAddItem} />

        {/* Right SceneryStack Canvas Sandbox Workbench */}
        <SceneryUniversalWorkbench
          placedItems={placedItems}
          onRemoveItem={handleRemoveItem}
          onUpdateItemPosition={handleUpdateItemPosition}
          onAddItemAtPos={handleAddItemAtPos}
        />
      </div>

      {/* Screenshot Capture & Storage Modal */}
      <ScreenshotCaptureModal
        isOpen={isScreenshotModalOpen}
        onClose={() => setIsScreenshotModalOpen(false)}
        imageBase64={screenshotBase64}
        labId="workbench-universal"
        labTitle="Bàn Thí Nghiệm Vật Lý Tự Do Universal Sandbox"
        difficulty="HARD"
      />
    </div>
  );
};
