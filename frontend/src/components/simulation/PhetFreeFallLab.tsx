import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Display, Node, Circle, Rectangle } from 'scenerystack/scenery';
import { FreeFallEngine } from '../../engine/physics/free-fall-engine';
import { ScreenshotCaptureModal } from '../common/ScreenshotCaptureModal';

const GRAVITY_PRESETS = [
  { label: '🌍 Trái Đất', value: 9.81 },
  { label: '🌕 Mặt Trăng', value: 1.62 },
  { label: '🔴 Sao Hỏa', value: 3.71 },
];

export const PhetFreeFallLab: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const displayRef = useRef<Display | null>(null);

  const nodesRef = useRef<{
    rootNode: Node;
    ball: Circle;
    gateE: Rectangle;
    gateF: Rectangle;
    rulerGroup: Node;
  } | null>(null);

  const [gravity, setGravity] = useState(9.81);
  const gateEY = 0.2; // m
  const gateFY = 0.8; // m
  
  const [timeE, setTimeE] = useState<number | null>(null);
  const [timeF, setTimeF] = useState<number | null>(null);
  
  const engineRef = useRef(new FreeFallEngine({ gravity: 9.81, dropHeight: 1.0 }));
  const requestRef = useRef<number>(undefined);
  const lastTimeRef = useRef<number>(undefined);

  const PIXELS_PER_METER = 500;
  const ORIGIN_X = 300;
  const ORIGIN_Y = 100; // Y coordinate for y=0

  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);

  // Initialize Scenery
  useEffect(() => {
    if (!containerRef.current || displayRef.current) return;
    const container = containerRef.current;
    
    const rootNode = new Node();
    
    // Stand
    const stand = new Rectangle(ORIGIN_X - 20, ORIGIN_Y, 10, 1.0 * PIXELS_PER_METER, { fill: '#64748b' });
    rootNode.addChild(stand);
    
    // Magnet
    const magnet = new Rectangle(ORIGIN_X - 40, ORIGIN_Y - 20, 50, 20, { fill: '#b91c1c' });
    rootNode.addChild(magnet);

    // Ball
    const ball = new Circle(10, { fill: '#94a3b8', stroke: '#333', lineWidth: 1, x: ORIGIN_X + 15, y: ORIGIN_Y });
    rootNode.addChild(ball);

    // Gate E
    const gateE = new Rectangle(ORIGIN_X - 10, ORIGIN_Y + gateEY * PIXELS_PER_METER - 5, 50, 10, { 
      fill: 'rgba(59, 130, 246, 0.5)', stroke: '#2563eb', lineWidth: 2, cursor: 'pointer' 
    });
    rootNode.addChild(gateE);

    // Gate F
    const gateF = new Rectangle(ORIGIN_X - 10, ORIGIN_Y + gateFY * PIXELS_PER_METER - 5, 50, 10, { 
      fill: 'rgba(239, 68, 68, 0.5)', stroke: '#dc2626', lineWidth: 2, cursor: 'pointer' 
    });
    rootNode.addChild(gateF);

    const display = new Display(rootNode, {
      container: container,
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundColor: '#f8fafc',
    });

    display.updateDisplay();
    displayRef.current = display;
    nodesRef.current = { rootNode, ball, gateE, gateF, rulerGroup: new Node() };

    return () => {
      display.dispose();
      displayRef.current = null;
    };
  }, []);

  // Main Loop
  useEffect(() => {
    const tick = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        const dt = (time - lastTimeRef.current) / 1000;
        const engine = engineRef.current;
        engine.update(dt);
        
        const state = engine.getState();
        if (nodesRef.current) {
          nodesRef.current.ball.y = ORIGIN_Y + state.y * PIXELS_PER_METER;
        }

        // Logic to trigger photogates
        if (state.y >= gateEY && timeE === null && state.isDropping) setTimeE(state.t);
        if (state.y >= gateFY && timeF === null && state.isDropping) setTimeF(state.t);

        if (displayRef.current) displayRef.current.updateDisplay();
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(tick);
    };
    requestRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gateEY, gateFY, timeE, timeF]);

  const handleStart = () => {
    engineRef.current.start();
  };

  const handleReset = () => {
    engineRef.current.reset();
    setTimeE(null);
    setTimeF(null);
  };

  const dtStr = (timeF !== null && timeE !== null) ? (timeF - timeE).toFixed(3) : '---';

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* 70% Canvas */}
      <div className="w-[70%] h-full relative" ref={containerRef}>
        <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Đo Gia Tốc Rơi Tự Do</h2>
          <p className="text-slate-500 text-sm">Bài 14 - SGK Vật lý 10</p>
        </div>
      </div>

      {/* 30% Control Panel */}
      <div className="w-[30%] h-full bg-white border-l border-slate-200 shadow-xl flex flex-col z-10">
        <div className="p-4 border-b flex items-center justify-between">
          <button onClick={() => navigate('/thu-vien')} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200">
            Thoát
          </button>
          <button onClick={() => setIsScreenshotOpen(true)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-200">
            📸 Lưu kho
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono space-y-2">
            <div className="flex justify-between">
              <span>CỔNG E (t1):</span>
              <span>{timeE !== null ? timeE.toFixed(3) : '---'} s</span>
            </div>
            <div className="flex justify-between">
              <span>CỔNG F (t2):</span>
              <span>{timeF !== null ? timeF.toFixed(3) : '---'} s</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2 font-bold text-yellow-400">
              <span>ĐO Δt:</span>
              <span>{dtStr} s</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Môi trường trọng trường (g)</label>
            <div className="grid grid-cols-2 gap-2">
              {GRAVITY_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setGravity(p.value); engineRef.current.setGravity(p.value); handleReset(); }}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    gravity === p.value ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleStart} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Thả Bi</button>
            <button onClick={handleReset} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold">Làm Lại</button>
          </div>
        </div>
      </div>
      
      {isScreenshotOpen && <ScreenshotCaptureModal isOpen={isScreenshotOpen} imageBase64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" labId="sim-free-fall" labTitle="Đo Gia Tốc Rơi Tự Do" difficulty="DỄ" onClose={() => setIsScreenshotOpen(false)} />}
    </div>
  );
};
