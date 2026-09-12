import React, { useEffect, useRef } from 'react';
import { Display, Node, Path, Circle, Rectangle, Line, Text } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { Vector2 } from 'scenerystack/dot';
import type { PlacedItem, PaletteItemDef } from './types';

interface SceneryUniversalWorkbenchProps {
  placedItems: PlacedItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItemPosition: (id: string, x: number, y: number) => void;
  onAddItemAtPos?: (itemDef: PaletteItemDef, x: number, y: number) => void;
}

export const SceneryUniversalWorkbench: React.FC<SceneryUniversalWorkbenchProps> = ({
  placedItems,
  onRemoveItem,
  onUpdateItemPosition,
  onAddItemAtPos,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const displayRef = useRef<Display | null>(null);
  const rootNodeRef = useRef<Node | null>(null);
  const itemNodesMapRef = useRef<Map<string, Node>>(new Map());
  const draggingSetRef = useRef<Set<string>>(new Set());

  // 1. Initialize SceneryStack SceneGraph & Display
  useEffect(() => {
    if (!containerRef.current) return;

    const width = 900;
    const height = 600;

    const rootNode = new Node();
    rootNodeRef.current = rootNode;

    // Background Decorative Physics Grid
    const gridNode = new Node();
    for (let x = 0; x < width; x += 40) {
      gridNode.addChild(new Line(x, 0, x, height, { stroke: '#1E293B', lineWidth: 1 }));
    }
    for (let y = 0; y < height; y += 40) {
      gridNode.addChild(new Line(0, y, width, y, { stroke: '#1E293B', lineWidth: 1 }));
    }
    rootNode.addChild(gridNode);

    // Workbench Outer Border Frame
    rootNode.addChild(
      new Rectangle(2, 2, width - 4, height - 4, {
        stroke: '#334155',
        lineWidth: 2,
        cornerRadius: 8,
      })
    );

    // Attach Display to DOM Container
    const display = new Display(rootNode, {
      container: containerRef.current,
      width,
      height,
      backgroundColor: '#020617',
      allowWebGL: false,
    });
    display.initializeEvents();
    displayRef.current = display;

    return () => {
      display.detachEvents();
      display.dispose();
      displayRef.current = null;
      rootNodeRef.current = null;
      itemNodesMapRef.current.clear();
      draggingSetRef.current.clear();
    };
  }, []);

  // 2. Sync Scenery Nodes with placedItems state
  useEffect(() => {
    const rootNode = rootNodeRef.current;
    const display = displayRef.current;
    if (!rootNode || !display) return;

    const itemNodesMap = itemNodesMapRef.current;

    // Remove nodes that were deleted
    const currentIds = new Set(placedItems.map(item => item.id));
    for (const [id, node] of itemNodesMap.entries()) {
      if (!currentIds.has(id)) {
        rootNode.removeChild(node);
        itemNodesMap.delete(id);
      }
    }

    // Add or update nodes for placedItems
    placedItems.forEach(item => {
      let itemNode = itemNodesMap.get(item.id);

      if (!itemNode) {
        itemNode = createSceneryNodeForItem(
          item,
          onRemoveItem,
          onUpdateItemPosition,
          displayRef,
          draggingSetRef
        );
        rootNode.addChild(itemNode);
        itemNodesMap.set(item.id, itemNode);
      }

      // Update position only if not currently actively dragged
      if (!draggingSetRef.current.has(item.id)) {
        itemNode.translation = new Vector2(item.x, item.y);
      }
    });

    display.updateDisplay();
  }, [placedItems, onRemoveItem, onUpdateItemPosition]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!containerRef.current || !onAddItemAtPos) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(40, Math.min(860, e.clientX - rect.left));
    const y = Math.max(40, Math.min(560, e.clientY - rect.top));

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const itemDef = JSON.parse(dataStr);
        onAddItemAtPos(itemDef, x, y);
      }
    } catch (err) {
      console.error('Failed to drop item:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div className="flex-1 h-full bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden select-none p-4">
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-[900px] h-[600px] relative rounded-2xl shadow-2xl overflow-hidden border border-slate-800 touch-none select-none"
      />

      {placedItems.length === 0 && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-500 gap-2">
          <span className="text-4xl animate-bounce">👈</span>
          <p className="text-sm font-bold">Hãy chọn hoặc kéo thả linh kiện từ bảng dụng cụ vào bàn thí nghiệm</p>
        </div>
      )}
    </div>
  );
};

// Factory helper to construct individual SceneryStack Nodes for each item type
function createSceneryNodeForItem(
  item: PlacedItem,
  onRemoveItem: (id: string) => void,
  onUpdateItemPosition: (id: string, x: number, y: number) => void,
  displayRef: React.RefObject<Display | null>,
  draggingSetRef: React.RefObject<Set<string>>
): Node {
  const containerNode = new Node({ cursor: 'pointer' });

  // Render Component Geometry Node based on type
  switch (item.type) {
    case 'SPRING': {
      // Metallic Mount + Coil
      const mount = new Rectangle(-30, -10, 60, 10, { fill: '#475569', stroke: '#94A3B8', lineWidth: 2, cornerRadius: 2 });
      const coilPath = new Path(null, { stroke: '#38BDF8', lineWidth: 4, lineCap: 'round', lineJoin: 'round' });
      
      const shape = new Shape();
      const coils = 12;
      const stepY = 120 / coils;
      shape.moveTo(0, 0);
      for (let i = 0; i <= coils; i++) {
        const y = i * stepY;
        const x = i === 0 || i === coils ? 0 : (i % 2 === 0 ? 18 : -18);
        shape.lineTo(x, y);
      }
      coilPath.setShape(shape);

      containerNode.addChild(mount);
      containerNode.addChild(coilPath);
      break;
    }

    case 'MASS_BOB': {
      const circle = new Circle(24, { fill: '#EC4899', stroke: '#F472B6', lineWidth: 3 });
      const label = new Text('200g', { fill: '#FFFFFF', font: 'bold 12px monospace' });
      label.center = new Vector2(0, 0);
      containerNode.addChild(circle);
      containerNode.addChild(label);
      break;
    }

    case 'BATTERY': {
      const body = new Rectangle(-45, -22, 90, 44, { fill: '#059669', stroke: '#34D399', lineWidth: 2, cornerRadius: 6 });
      const plusCap = new Rectangle(45, -8, 8, 16, { fill: '#F59E0B' });
      const label = new Text('DC 9V', { fill: '#FFFFFF', font: 'bold 12px monospace' });
      label.center = new Vector2(0, 0);
      containerNode.addChild(body);
      containerNode.addChild(plusCap);
      containerNode.addChild(label);
      break;
    }

    case 'BULB': {
      const bulbGlass = new Circle(22, { fill: '#FACC15', stroke: '#FDE047', lineWidth: 2, opacity: 0.85 });
      const base = new Rectangle(-10, 22, 20, 14, { fill: '#64748B' });
      const label = new Text('💡 12W', { fill: '#0F172A', font: 'bold 10px sans-serif' });
      label.center = new Vector2(0, 0);
      containerNode.addChild(bulbGlass);
      containerNode.addChild(base);
      containerNode.addChild(label);
      break;
    }

    case 'LASER': {
      const body = new Rectangle(-40, -18, 80, 36, { fill: '#DC2626', stroke: '#F87171', lineWidth: 2, cornerRadius: 4 });
      const lensTip = new Circle(6, { fill: '#EF4444', x: 40, y: 0 });
      const beamLine = new Line(46, 0, 180, 0, { stroke: '#EF4444', lineWidth: 3, opacity: 0.9 });
      const label = new Text('LASER', { fill: '#FFFFFF', font: 'bold 10px monospace' });
      label.center = new Vector2(-6, 0);

      containerNode.addChild(body);
      containerNode.addChild(lensTip);
      containerNode.addChild(beamLine);
      containerNode.addChild(label);
      break;
    }

    case 'CONVEX_LENS': {
      const lensPath = new Path(null, { fill: 'rgba(56, 189, 248, 0.35)', stroke: '#38BDF8', lineWidth: 2 });
      const shape = new Shape();
      shape.moveTo(0, -60);
      shape.quadraticCurveTo(24, 0, 0, 60);
      shape.quadraticCurveTo(-24, 0, 0, -60);
      lensPath.setShape(shape);

      const label = new Text('f = +15cm', { fill: '#38BDF8', font: '10px sans-serif', y: 68 });
      label.centerX = 0;

      containerNode.addChild(lensPath);
      containerNode.addChild(label);
      break;
    }

    default: {
      // Default Generic Component Badge Node
      const bg = new Rectangle(-40, -20, 80, 40, { fill: '#1E293B', stroke: '#38BDF8', lineWidth: 2, cornerRadius: 6 });
      const text = new Text(`${item.icon} ${item.name}`, { fill: '#FFFFFF', font: '11px sans-serif' });
      text.center = new Vector2(0, 0);
      containerNode.addChild(bg);
      containerNode.addChild(text);
      break;
    }
  }

  // Add Item Title Label overhead
  const titleText = new Text(item.name, { fill: '#94A3B8', font: '10px sans-serif', y: -38 });
  titleText.centerX = 0;
  containerNode.addChild(titleText);

  // Add Visual Snap Ports (Connection Hooks/Terminals)
  const snapPorts = getItemSnapPorts(item);
  snapPorts.forEach(port => {
    const portDot = new Circle(5, {
      x: port.localX,
      y: port.localY,
      fill: '#06B6D4',
      stroke: '#38BDF8',
      lineWidth: 1.5,
    });
    containerNode.addChild(portDot);
  });

  // Delete Button Node (X badge at top-right)
  const deleteBtn = new Rectangle(24, -38, 18, 18, {
    fill: '#EF4444',
    stroke: '#B91C1C',
    lineWidth: 1,
    cornerRadius: 9,
    cursor: 'pointer',
  });
  const deleteCross = new Text('×', { fill: '#FFFFFF', font: 'bold 13px sans-serif' });
  deleteCross.center = new Vector2(33, -29);
  deleteBtn.addChild(deleteCross);

  deleteBtn.addInputListener({
    down: (event) => {
      event.handle();
      onRemoveItem(item.id);
    },
  });
  containerNode.addChild(deleteBtn);

  // Scenery Pointer InputListener for direct, robust 60 FPS drag interaction
  let isDragging = false;
  let dragOffset = new Vector2(0, 0);

  containerNode.addInputListener({
    down: (event: any) => {
      if (event.trail && event.trail.nodes.includes(deleteBtn)) return;
      isDragging = true;
      draggingSetRef.current?.add(item.id);
      containerNode.moveToFront();

      const point = event.pointer.point;
      dragOffset = new Vector2(point.x - containerNode.translation.x, point.y - containerNode.translation.y);
    },
    drag: (event: any) => {
      if (!isDragging) return;
      const point = event.pointer.point;
      const newX = Math.max(20, Math.min(880, point.x - dragOffset.x));
      const newY = Math.max(20, Math.min(580, point.y - dragOffset.y));

      containerNode.translation = new Vector2(newX, newY);
      item.x = newX;
      item.y = newY;
      displayRef.current?.updateDisplay();
    },
    up: () => {
      if (!isDragging) return;
      isDragging = false;
      draggingSetRef.current?.delete(item.id);
      onUpdateItemPosition(item.id, containerNode.translation.x, containerNode.translation.y);
      displayRef.current?.updateDisplay();
    },
    cancel: () => {
      if (!isDragging) return;
      isDragging = false;
      draggingSetRef.current?.delete(item.id);
      onUpdateItemPosition(item.id, containerNode.translation.x, containerNode.translation.y);
      displayRef.current?.updateDisplay();
    },
  } as any);

  return containerNode;
}

interface ItemSnapPort {
  id: string;
  itemId: string;
  localX: number;
  localY: number;
  type: string;
}

function getItemSnapPorts(item: PlacedItem): ItemSnapPort[] {
  switch (item.type) {
    case 'SPRING':
      return [
        { id: `${item.id}-top`, itemId: item.id, localX: 0, localY: -10, type: 'SPRING_HOOK' },
        { id: `${item.id}-bottom`, itemId: item.id, localX: 0, localY: 120, type: 'SPRING_HOOK' },
      ];
    case 'MASS_BOB':
      return [
        { id: `${item.id}-top`, itemId: item.id, localX: 0, localY: -24, type: 'MASS_LOOP' },
        { id: `${item.id}-bottom`, itemId: item.id, localX: 0, localY: 24, type: 'MASS_LOOP' },
      ];
    case 'BATTERY':
      return [
        { id: `${item.id}-left`, itemId: item.id, localX: -45, localY: 0, type: 'CIRCUIT_TERMINAL' },
        { id: `${item.id}-right`, itemId: item.id, localX: 45, localY: 0, type: 'CIRCUIT_TERMINAL' },
      ];
    case 'BULB':
      return [
        { id: `${item.id}-left`, itemId: item.id, localX: -10, localY: 22, type: 'CIRCUIT_TERMINAL' },
        { id: `${item.id}-right`, itemId: item.id, localX: 10, localY: 22, type: 'CIRCUIT_TERMINAL' },
      ];
    case 'WIRE':
      return [
        { id: `${item.id}-left`, itemId: item.id, localX: -30, localY: 0, type: 'CIRCUIT_TERMINAL' },
        { id: `${item.id}-right`, itemId: item.id, localX: 30, localY: 0, type: 'CIRCUIT_TERMINAL' },
      ];
    case 'RESISTOR':
      return [
        { id: `${item.id}-left`, itemId: item.id, localX: -40, localY: 0, type: 'CIRCUIT_TERMINAL' },
        { id: `${item.id}-right`, itemId: item.id, localX: 40, localY: 0, type: 'CIRCUIT_TERMINAL' },
      ];
    case 'LASER':
      return [
        { id: `${item.id}-emitter`, itemId: item.id, localX: 40, localY: 0, type: 'OPTIC_SURFACE' },
      ];
    case 'CONVEX_LENS':
      return [
        { id: `${item.id}-center`, itemId: item.id, localX: 0, localY: 0, type: 'OPTIC_SURFACE' },
      ];
    default:
      return [];
  }
}

