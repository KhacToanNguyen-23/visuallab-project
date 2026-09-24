import React, { useRef } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SpringMassScene } from '../../engine/scenerystack/labs/SpringMassScene.ts';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { SpringDataTablePanel } from '../../components/workbench/SpringDataTablePanel.tsx';
import { useSpringMassStore } from '../../store/useSpringMassStore.ts';

export const SpringMassLab: React.FC = () => {
  const sceneRef = useRef<SpringMassScene | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const scene = new SpringMassScene();
    sceneRef.current = scene;

    renderer.getRootNode().addChild(scene.rootNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    renderer.addUpdateListener((dt) => {
      scene.step(dt);
    });
  }, []);

  const handleRecord = () => {
    if (sceneRef.current) {
      const currentL = sceneRef.current.getCurrentLength();
      useSpringMassStore.getState().recordCurrentState(currentL);
    }
  };

  const handlePerturb = () => {
    if (sceneRef.current) {
      sceneRef.current.perturb();
    }
  };

  return (
    <>
      {/* Left/Center: SceneryStack Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-white">
        <SceneryCanvas onRendererReady={handleRendererReady} />

        {/* Stepper Guide */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Hướng dẫn thực hành Bài 38</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span>
              Bấm nút `+` để thêm từng quả cân 50g vào móc treo.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span>
              Quan sát lò xo dãn và kim đỏ chỉ vạch trên thước.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span>
              Bấm "Ghi số liệu" để kiểm chứng tỉ số k = P / Δl.
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel: Data & Parameter Controls */}
      <div className="h-full flex-shrink-0 w-80">
        <SpringDataTablePanel onRecord={handleRecord} onPerturb={handlePerturb} />
      </div>
    </>
  );
};
