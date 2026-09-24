import React, { useRef } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SpeedMeasurementScene } from '../../engine/scenerystack/labs/SpeedMeasurementScene.ts';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { SpeedDataTablePanel } from '../../components/workbench/SpeedDataTablePanel.tsx';

export const SpeedMeasurementLab: React.FC = () => {
  const sceneRef = useRef<SpeedMeasurementScene | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const scene = new SpeedMeasurementScene();
    sceneRef.current = scene;

    renderer.getRootNode().addChild(scene.planeView);

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
              sceneRef.current?.release();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 cursor-pointer pointer-events-auto"
          >
            Thả Xe
          </button>
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              sceneRef.current?.reset();
            }}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg shadow font-semibold hover:bg-slate-300 cursor-pointer pointer-events-auto"
          >
            Đặt lại
          </button>
        </div>

        {/* Stepper Guide */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Hướng dẫn thực hành Bài 6</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span>
              Kéo 2 Cổng quang E & F dọc máng để chọn s.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span>
              Điều chỉnh Góc dốc α ở bảng bên phải.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span>
              Bấm "Thả xe" để đo v_tb và gia tốc a.
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel: Data & Parameter Controls */}
      <div className="h-full flex-shrink-0 w-80">
        <SpeedDataTablePanel />
      </div>
    </>
  );
};
