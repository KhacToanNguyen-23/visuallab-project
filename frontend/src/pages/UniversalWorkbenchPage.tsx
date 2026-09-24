import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../components/scenerystack/SceneryCanvas.tsx';
import { UniversalSandboxScene } from '../engine/scenerystack/labs/UniversalSandboxScene.ts';
import { SceneryRenderer } from '../engine/scenerystack/SceneryRenderer.ts';
import { WorkbenchPalette, type DeviceType } from '../components/workbench/WorkbenchPalette.tsx';

export const UniversalWorkbenchPage: React.FC = () => {
  const navigate = useNavigate();
  const sceneRef = useRef<UniversalSandboxScene | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const scene = new UniversalSandboxScene();
    sceneRef.current = scene;

    renderer.getRootNode().addChild(scene.rootNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    renderer.addUpdateListener((dt) => {
      scene.step(dt);
    });
  }, []);

  const handleSpawnDevice = (type: DeviceType) => {
    if (sceneRef.current) {
      sceneRef.current.spawnDevice(type);
    }
  };

  const handleTogglePlay = () => {
    if (sceneRef.current) {
      if (isPlaying) {
        sceneRef.current.pause();
        setIsPlaying(false);
      } else {
        sceneRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleReset = () => {
    if (sceneRef.current) {
      sceneRef.current.reset();
      setIsPlaying(false);
    }
  };

  const handleClearAll = () => {
    if (sceneRef.current) {
      sceneRef.current.clearAll();
      setIsPlaying(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs flex-shrink-0 z-30 pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              navigate('/thu-vien');
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Về Thư Viện"
          >
            ←
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                Universal Sandbox 2.0
              </span>
              <span className="text-xs text-slate-400">SceneryStack ECS Engine</span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Bàn Thí Nghiệm Vật Lý Tự Do (Universal Physics Workbench)
            </h1>
          </div>
        </div>

        {/* Global Simulation Control Bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              handleTogglePlay();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isPlaying ? '⏸️ Tạm Dừng' : '▶️ Chạy Mô Phỏng'}
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer active:scale-95"
          >
            Đặt Lại
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Sidebar: Component Palette */}
        <WorkbenchPalette
          onSpawnDevice={handleSpawnDevice}
          onClearAll={handleClearAll}
          onResetScene={handleReset}
        />

        {/* Center: Infinite Canvas */}
        <main className="flex-1 relative bg-white">
          <SceneryCanvas onRendererReady={handleRendererReady} />

          {/* Canvas Floating Instructions */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-600 pointer-events-none z-10 flex items-center gap-2">
            <span>💡 <b>Kéo thả linh kiện</b> lại gần nhau để <b>Tự Động Bắt Dính (Snapping)</b></span>
          </div>
        </main>
      </div>
    </div>
  );
};
