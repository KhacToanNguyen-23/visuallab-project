import React, { useEffect, useRef, useState } from 'react';
import { Header } from './components/header/Header';
import { ComponentToolbar } from './components/controls/ComponentToolbar';
import { InspectorPanel } from './components/controls/InspectorPanel';
import { solveDCCircuit } from './engine/physics/CircuitSolver';
import type { ComponentData, ComponentType } from './engine/physics/CircuitSolver';
import { CanvasRenderer } from './engine/canvas/CanvasRenderer';
import { exportCanvasToPNG } from './utils/exportImage';
import { decodeStateFromURL, encodeStateToURL } from './utils/urlState';

// Default initial circuit: Battery + Bulb + Switch
const INITIAL_COMPONENTS: ComponentData[] = [
  {
    id: 'c-1',
    type: 'battery',
    label: 'Pin Nguồn',
    nodeA: 'n-1',
    nodeB: 'n-2',
    posA: { x: 150, y: 150 },
    posB: { x: 350, y: 150 },
    value: 9,
  },
  {
    id: 'c-2',
    type: 'switch',
    label: 'Công Tắc',
    nodeA: 'n-2',
    nodeB: 'n-3',
    posA: { x: 350, y: 150 },
    posB: { x: 350, y: 350 },
    value: 0,
    isOpen: false,
  },
  {
    id: 'c-3',
    type: 'bulb',
    label: 'Bóng Đèn',
    nodeA: 'n-3',
    nodeB: 'n-4',
    posA: { x: 350, y: 350 },
    posB: { x: 150, y: 350 },
    value: 10,
  },
  {
    id: 'c-4',
    type: 'wire',
    label: 'Dây Nối Mạch',
    nodeA: 'n-4',
    nodeB: 'n-1',
    posA: { x: 150, y: 350 },
    posB: { x: 150, y: 150 },
    value: 0,
  },
];

export const App: React.FC = () => {
  const [components, setComponents] = useState<ComponentData[]>(() => {
    const fromURL = decodeStateFromURL();
    return fromURL || INITIAL_COMPONENTS;
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedCompId, setDraggedCompId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  // Auto-solve physics on component changes
  const solvedState = solveDCCircuit(components);

  // Sync animation frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    rendererRef.current = new CanvasRenderer(ctx);

    let animationId: number;
    const renderLoop = () => {
      if (rendererRef.current && canvas) {
        rendererRef.current.render(
          canvas.width,
          canvas.height,
          solvedState.components,
          selectedId
        );
      }
      animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [solvedState.components, selectedId]);

  // Handle adding new component
  const handleAddComponent = (type: ComponentType, defaultValue: number) => {
    const id = `c-${Date.now()}`;
    const nextNodeA = `n-${Date.now()}-A`;
    const nextNodeB = `n-${Date.now()}-B`;

    const newComp: ComponentData = {
      id,
      type,
      label: type.toUpperCase(),
      nodeA: nextNodeA,
      nodeB: nextNodeB,
      posA: { x: 200, y: 200 },
      posB: { x: 360, y: 200 },
      value: defaultValue,
      isOpen: type === 'switch' ? false : undefined,
    };

    setComponents(prev => [...prev, newComp]);
    setSelectedId(id);
  };

  // Canvas Mouse Interactions (Dragging components & snapping)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked component
    const clicked = components.find(c => {
      const midX = (c.posA.x + c.posB.x) / 2;
      const midY = (c.posA.y + c.posB.y) / 2;
      return Math.hypot(x - midX, y - midY) < 30;
    });

    if (clicked) {
      setSelectedId(clicked.id);
      setDraggedCompId(clicked.id);
      setDragStartPos({ x, y });
    } else {
      setSelectedId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedCompId || !dragStartPos || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const dx = currentX - dragStartPos.x;
    const dy = currentY - dragStartPos.y;

    setComponents(prev =>
      prev.map(c => {
        if (c.id === draggedCompId) {
          return {
            ...c,
            posA: { x: Math.round((c.posA.x + dx) / 10) * 10, y: Math.round((c.posA.y + dy) / 10) * 10 },
            posB: { x: Math.round((c.posB.x + dx) / 10) * 10, y: Math.round((c.posB.y + dy) / 10) * 10 },
          };
        }
        return c;
      })
    );

    setDragStartPos({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    setDraggedCompId(null);
    setDragStartPos(null);
  };

  // Preset Handler
  const handleLoadPreset = (presetType: string) => {
    if (presetType === 'preset-dc-basic') {
      setComponents(INITIAL_COMPONENTS);
      showToast('Đã tải bài thí nghiệm Mạch Điện Đơn Giản');
    } else if (presetType === 'preset-dc-parallel') {
      setComponents([
        { id: 'p-1', type: 'battery', label: 'Pin 12V', nodeA: 'n1', nodeB: 'n2', posA: { x: 100, y: 150 }, posB: { x: 100, y: 350 }, value: 12 },
        { id: 'p-2', type: 'resistor', label: 'R1 (20Ω)', nodeA: 'n1', nodeB: 'n2', posA: { x: 300, y: 150 }, posB: { x: 300, y: 350 }, value: 20 },
        { id: 'p-3', type: 'resistor', label: 'R2 (20Ω)', nodeA: 'n1', nodeB: 'n2', posA: { x: 450, y: 150 }, posB: { x: 450, y: 350 }, value: 20 },
        { id: 'p-4', type: 'wire', label: 'Dây Trên', nodeA: 'n1', nodeB: 'n1', posA: { x: 100, y: 150 }, posB: { x: 450, y: 150 }, value: 0 },
        { id: 'p-5', type: 'wire', label: 'Dây Dưới', nodeA: 'n2', nodeB: 'n2', posA: { x: 100, y: 350 }, posB: { x: 450, y: 350 }, value: 0 }
      ]);
      showToast('Đã tải bài thí nghiệm Mạch Song Song');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareURL = () => {
    const shareableLink = encodeStateToURL(components);
    navigator.clipboard.writeText(shareableLink);
    showToast('Đã sao chép link thí nghiệm vào clipboard!');
  };

  const handleExportPNG = () => {
    if (canvasRef.current) {
      exportCanvasToPNG(canvasRef.current);
      showToast('Đã xuất ảnh PNG thí nghiệm thành công!');
    }
  };

  const selectedComp = solvedState.components.find(c => c.id === selectedId) || null;

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 font-sans select-none overflow-hidden">
      <Header
        onExportImage={handleExportPNG}
        onShareURL={handleShareURL}
        onReset={() => setComponents(INITIAL_COMPONENTS)}
        onLoadPreset={handleLoadPreset}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <ComponentToolbar onAddComponent={handleAddComponent} />

        {/* Canvas Workspace Area */}
        <div className="flex-1 relative bg-slate-100 flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            width={900}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="bg-white rounded-xl shadow-xl border border-slate-300 cursor-crosshair"
          />

          {toastMessage && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl border border-slate-700 animate-bounce">
              ✨ {toastMessage}
            </div>
          )}
        </div>

        <InspectorPanel
          selectedComponent={selectedComp}
          onUpdateComponent={updated => {
            setComponents(prev => prev.map(c => (c.id === updated.id ? updated : c)));
          }}
          onDeleteComponent={id => {
            setComponents(prev => prev.filter(c => c.id !== id));
            setSelectedId(null);
          }}
        />
      </div>
    </div>
  );
};

export default App;
