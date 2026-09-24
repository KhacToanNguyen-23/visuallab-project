import React, { useRef } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { FreeFallScene } from '../../engine/scenerystack/labs/FreeFallScene.ts';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { DataTablePanel } from '../../components/workbench/DataTablePanel.tsx';

export const FreeFallLab: React.FC = () => {
  const sceneRef = useRef<FreeFallScene | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const scene = new FreeFallScene();
    sceneRef.current = scene;
    
    // Gắn view vào renderer
    renderer.getRootNode().addChild(scene.rootNode);

    // Kích hoạt Pan/Zoom toàn cảnh
    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    renderer.addUpdateListener((dt) => {
      scene.step(dt);
    });
  }, []);

  return (
    <>
      {/* Left/Center: SceneryStack Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-white">
        <SceneryCanvas onRendererReady={handleRendererReady} />
        
        {/* Overlay Controls */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button 
            onPointerDown={(e) => {
              e.stopPropagation();
              sceneRef.current?.drop();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 cursor-pointer pointer-events-auto text-xs"
          >
            ⚡ Thả Bi (Ngắt Nam Châm)
          </button>
          <button 
            onPointerDown={(e) => {
              e.stopPropagation();
              sceneRef.current?.reset();
            }}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg shadow font-semibold hover:bg-slate-300 cursor-pointer pointer-events-auto text-xs"
          >
            🔄 Đặt lại Bi
          </button>
          <button 
            onPointerDown={(e) => {
              e.stopPropagation();
              if (sceneRef.current) {
                sceneRef.current.timeScale = sceneRef.current.timeScale === 1.0 ? 0.5 : 1.0;
                const btn = e.currentTarget;
                btn.textContent = sceneRef.current.timeScale === 0.5 ? '🐌 Tốc độ: 0.5x' : '⚡ Tốc độ: 1.0x';
              }
            }}
            className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg shadow font-semibold hover:bg-amber-200 cursor-pointer pointer-events-auto text-xs"
          >
            ⚡ Tốc độ: 1.0x
          </button>
        </div>

        {/* Hướng dẫn thực hành (Stepper) */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-84">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 14: Đo gia tốc rơi tự do</h4>
          <ul className="text-xs text-slate-600 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span>
              Kéo bi thép lại gần nam châm điện ở đỉnh giá đỡ để hút giữ.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span>
              Kéo trượt 2 Cổng quang lên/xuống để chọn khoảng cách $s_1, s_2$.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span>
              <strong>Bấm nút đỏ ⏻ trên nam châm điện</strong> để thả bi rơi tự do.
            </li>
          </ul>
        </div>
      </div>

      {/* Right: Data Collection & Auto-Grading Panel */}
      <div className="h-full flex-shrink-0 w-80">
        <DataTablePanel />
      </div>
    </>
  );
};
