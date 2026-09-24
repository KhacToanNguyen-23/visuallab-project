import React, { useRef, useState, useCallback } from 'react';
import { AnimatedPanZoomListener, DragListener, Node, Rectangle, Text, Circle } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { FrictionBlockApparatus } from '../../engine/scenerystack/apparatus/concrete/FrictionBlockApparatus.ts';
import { SpringBalanceApparatus } from '../../engine/scenerystack/apparatus/concrete/SpringBalanceApparatus.ts';
import { FrictionTableApparatus } from '../../engine/scenerystack/apparatus/concrete/FrictionTableApparatus.ts';
import { WeightApparatus } from '../../engine/scenerystack/apparatus/concrete/WeightApparatus.ts';
import type { SurfaceMaterialType } from '../../engine/scenerystack/apparatus/mechanics/FrictionTableView.ts';

export const SlidingFrictionLab: React.FC = () => {
  const [surface, setSurface] = useState<SurfaceMaterialType>('WOOD');
  const [weightsCount, setWeightsCount] = useState(0);
  const [weightMassG, setWeightMassG] = useState(50);
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; surface: string; mass: number; normalForce: number; frictionForce: number; mu: number }>>([]);

  const tableRef = useRef<FrictionTableApparatus | null>(null);
  const blockRef = useRef<FrictionBlockApparatus | null>(null);
  const balanceRef = useRef<SpringBalanceApparatus | null>(null);

  const initialBlockX = 220;
  const initialBlockY = 318;
  const initialBalanceX = 360;
  const initialBalanceY = 318;

  const handleRendererReady = useCallback((renderer: SceneryRenderer) => {
    const table = new FrictionTableApparatus('table-1', 'WOOD', 640);
    const block = new FrictionBlockApparatus('block-1', 0.2);
    const balance = new SpringBalanceApparatus('balance-1');

    tableRef.current = table;
    blockRef.current = block;
    balanceRef.current = balance;

    table.viewNode.x = 380;
    table.viewNode.y = 340;
    let isBlockSnappedToTable = true;

    // Thêm DragListener cho mặt bàn (kéo di chuyển đồng bộ nếu khối gỗ/lực kế đang bám dính)
    table.viewNode.addInputListener(
      new DragListener({
        targetNode: table.viewNode,
        drag: (_event, listener) => {
          const delta = listener.modelDelta;
          table.viewNode.translation = table.viewNode.translation.plus(delta);
          if (isBlockSnappedToTable) {
            block.viewNode.translation = block.viewNode.translation.plus(delta);
            balance.viewNode.translation = balance.viewNode.translation.plus(delta);
          }
        },
      })
    );

    block.viewNode.x = initialBlockX;
    block.viewNode.y = initialBlockY;
    block.viewNode.cursor = 'grab';

    // Cho phép KÉO KHỐI GỖ TỰ DO KHẮP MÀN HÌNH (Lại gần mặt bàn thì tự hút dính, kéo xa thì tự do)
    block.viewNode.addInputListener(
      new DragListener({
        drag: (event) => {
          const pt = event.pointer.point;
          const tablePos = table.viewNode;
          const surfaceY = tablePos.y - 17.5;
          const tableLeft = tablePos.x - 280;
          const tableRight = tablePos.x + 240;

          // Kiểm tra vùng bắt dính mặt bàn
          if (Math.abs(pt.y - surfaceY) < 35 && pt.x >= tableLeft && pt.x <= tableRight) {
            isBlockSnappedToTable = true;
            block.viewNode.x = pt.x;
            block.viewNode.y = surfaceY; // Khóa chặt trên mặt bàn
            balance.viewNode.x = pt.x + 125;
            balance.viewNode.y = surfaceY;
          } else {
            isBlockSnappedToTable = false;
            block.viewNode.x = pt.x;
            block.viewNode.y = pt.y; // Di chuyển tự do
            balance.viewNode.x = pt.x + 125;
            balance.viewNode.y = pt.y;
          }
        },
        end: () => {
          if (isBlockSnappedToTable) {
            block.viewNode.y = table.viewNode.y - 17.5;
            balance.viewNode.y = table.viewNode.y - 17.5;
          }
        },
      })
    );

    balance.viewNode.x = initialBalanceX;
    balance.viewNode.y = initialBalanceY;
    balance.viewNode.cursor = 'grab';

    renderer.getRootNode().addChild(table.viewNode);
    renderer.getRootNode().addChild(block.viewNode);
    renderer.getRootNode().addChild(balance.viewNode);

    // Tạo Khay Quả Cân kéo thả di chuyển tự do
    const trayNode = new Node({ x: 50, y: 380, cursor: 'grab' });
    const trayBg = new Rectangle(0, 0, 150, 110, 8, 8, { fill: '#F8FAFC', stroke: '#94A3B8', lineWidth: 1.5 });
    const trayTitle = new Text('✥ Khay Quả Cân', { font: 'bold 10px sans-serif', fill: '#334155', centerX: 75, top: 8 });
    const traySub = new Text('Kéo đặt lên khối gỗ', { font: 'bold 8px sans-serif', fill: '#2563EB', centerX: 75, top: 22 });
    trayNode.addChild(trayBg);
    trayNode.addChild(trayTitle);
    trayNode.addChild(traySub);

    // Kéo di chuyển toàn bộ khay quả cân
    trayBg.addInputListener(
      new DragListener({
        targetNode: trayNode,
        drag: (_event, listener) => {
          trayNode.translation = trayNode.translation.plus(listener.modelDelta);
        },
      })
    );

    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const wHomeX = 40 + col * 70;
      const wHomeY = 55 + row * 30;

      const wNode = new Node({ x: wHomeX, y: wHomeY, cursor: 'grab' });
      const disc = new Rectangle(-20, -10, 40, 18, 2, 2, { fill: '#475569', stroke: '#0F172A', lineWidth: 1.5 });
      const ring = new Circle(2.5, { fill: '#CBD5E1', y: -2 });
      const label = new Text('m', { font: 'bold 9px sans-serif', fill: '#FFFFFF', centerX: 0, centerY: 0 });
      wNode.addChild(disc);
      wNode.addChild(ring);
      wNode.addChild(label);

      wNode.addInputListener(
        new DragListener({
          start: () => {
            wNode.opacity = 0.8;
          },
          drag: (event) => {
            const posInTray = trayNode.globalToLocalPoint(event.pointer.point);
            wNode.x = posInTray.x;
            wNode.y = posInTray.y;
          },
          end: (event) => {
            wNode.opacity = 1.0;
            if (event?.pointer?.point && blockRef.current) {
              const blockGlobal = blockRef.current.viewNode.localToGlobalPoint(Vector2.ZERO);
              const dist = event.pointer.point.distance(blockGlobal);
              if (dist < 80) {
                const newWeight = new WeightApparatus(undefined, 1);
                blockRef.current.attachWeight(newWeight);
                setWeightsCount(blockRef.current.attachedWeights.length);
              }
            }
            wNode.x = wHomeX;
            wNode.y = wHomeY;
          },
        })
      );
      trayNode.addChild(wNode);
    }
    renderer.getRootNode().addChild(trayNode);

    let isBalanceHookedToBlock = true;

    // Click vào khối gỗ để gỡ ngay 1 quả cân
    block.viewNode.addInputListener({
      down: () => {
        if (block.attachedWeights.length > 0) {
          block.removeWeight();
          setWeightsCount(block.attachedWeights.length);
        }
      },
    });

    // Kéo thả lực kế (Có thể tách rời độc lập, khi lại gần móc thì tự móc vào)
    let hasMoved = false;
    let maxFrictionObserved = 0;

    balance.viewNode.addInputListener(
      new DragListener({
        start: () => {
          hasMoved = false;
          maxFrictionObserved = 0;
        },
        drag: (event) => {
          if (!blockRef.current || !balanceRef.current || !tableRef.current) return;

          const globalPoint = event.pointer.point;
          const currentTable = tableRef.current;
          const currentBlock = blockRef.current;
          const currentBalance = balanceRef.current;

          const blockHookX = currentBlock.viewNode.x + 45;
          const blockHookY = currentBlock.viewNode.y;

          // Nếu chưa móc vào khối gỗ: Cho phép di chuyển tự do và quét kiểm tra bắt dính móc
          if (!isBalanceHookedToBlock) {
            currentBalance.viewNode.x = globalPoint.x;
            currentBalance.viewNode.y = globalPoint.y;
            currentBalance.setForce(0);

            const distToHook = Math.hypot(globalPoint.x - 80 - blockHookX, globalPoint.y - blockHookY);
            if (distToHook < 60) {
              isBalanceHookedToBlock = true;
              currentBalance.viewNode.x = currentBlock.viewNode.x + 125;
              currentBalance.viewNode.y = currentBlock.viewNode.y;
            }
            return;
          }

          // Nếu ĐÃ MÓC: Kiểm tra nếu kéo giật lên trên hoặc sang trái -> Tự động tháo móc
          if (globalPoint.y < blockHookY - 45 || globalPoint.y > blockHookY + 45 || globalPoint.x < currentBlock.viewNode.x + 80) {
            isBalanceHookedToBlock = false;
            currentBalance.viewNode.x = globalPoint.x;
            currentBalance.viewNode.y = globalPoint.y;
            currentBalance.setForce(0);
            return;
          }

          // Nếu đang móc và kéo sang phải -> Kéo trượt theo vật lý ma sát
          const totalM = currentBlock.mass;
          const N = totalM * 9.807;
          const mu = currentTable.frictionCoeff;
          const F_ms = mu * N;

          const tableMinX = currentTable.viewNode.x - 260;
          const tableMaxX = currentTable.viewNode.x + 220;
          const targetBalanceX = Math.max(currentBlock.viewNode.x + 125, Math.min(tableMaxX, globalPoint.x));
          
          const stretchDx = targetBalanceX - (currentBlock.viewNode.x + 125);
          const pullForceN = Math.max(0, stretchDx * 0.05);

          if (pullForceN < F_ms) {
            // Lực kéo chưa thắng ma sát nghỉ -> Khối gỗ đứng yên
            currentBalance.setForce(Number(pullForceN.toFixed(2)));
            currentBalance.viewNode.x = currentBlock.viewNode.x + 125 + stretchDx * 0.4;
            currentBalance.viewNode.y = currentBlock.viewNode.y;
          } else {
            // Khối gỗ trượt đều theo tay kéo
            hasMoved = true;
            maxFrictionObserved = F_ms;
            currentBalance.setForce(Number(F_ms.toFixed(2)));

            const blockNewX = Math.max(tableMinX, Math.min(tableMaxX - 125, targetBalanceX - 125));
            currentBlock.viewNode.x = blockNewX;
            currentBalance.viewNode.x = blockNewX + 125;
            currentBalance.viewNode.y = currentBlock.viewNode.y;
          }
        },
        end: () => {
          if (!blockRef.current || !balanceRef.current || !tableRef.current) return;
          const currentTable = tableRef.current;
          const currentBlock = blockRef.current;
          const currentBalance = balanceRef.current;

          if (isBalanceHookedToBlock) {
            currentBalance.viewNode.x = currentBlock.viewNode.x + 125;
            currentBalance.viewNode.y = currentBlock.viewNode.y;
          }
          currentBalance.setForce(0);

          if (hasMoved && maxFrictionObserved > 0) {
            const totalM = currentBlock.mass;
            const N = totalM * 9.807;
            const muCalc = maxFrictionObserved / N;

            const surfaceName =
              currentTable.surfaceType === 'WOOD'
                ? 'Gỗ'
                : currentTable.surfaceType === 'SMOOTH_MICA'
                ? 'Mica'
                : 'Cao su';

            setDataLogs((prev) => [
              ...prev,
              {
                trial: prev.length + 1,
                surface: surfaceName,
                mass: Math.round(totalM * 1000),
                normalForce: Number(N.toFixed(2)),
                frictionForce: Number(maxFrictionObserved.toFixed(2)),
                mu: Number(muCalc.toFixed(3)),
              },
            ]);
          }
        },
      })
    );

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);
  }, []);

  const handleSurfaceChange = (mat: SurfaceMaterialType) => {
    setSurface(mat);
    tableRef.current?.setSurface(mat);
  };

  const handleResetPositions = () => {
    if (blockRef.current && balanceRef.current) {
      blockRef.current.viewNode.x = initialBlockX;
      blockRef.current.viewNode.y = initialBlockY;
      balanceRef.current.viewNode.x = initialBalanceX;
      balanceRef.current.viewNode.y = initialBalanceY;
      balanceRef.current.setForce(0);
    }
  };

  const handleWeightMassChange = (massG: number) => {
    setWeightMassG(massG);
    if (blockRef.current) {
      blockRef.current.attachedWeights.forEach((w) => (w.mass = massG / 1000));
      blockRef.current.recalculateMass();
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col min-w-0 h-full relative border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-white">
        <SceneryCanvas onRendererReady={handleRendererReady} />

        {/* Surface Material Switcher */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 z-10 flex gap-2 items-center text-xs font-semibold pointer-events-auto">
          <span className="text-slate-700">Mặt tiếp xúc:</span>
          {(['WOOD', 'SMOOTH_MICA', 'ROUGH_RUBBER'] as SurfaceMaterialType[]).map((mat) => (
            <button
              key={mat}
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                handleSurfaceChange(mat);
              }}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                surface === mat
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              {mat === 'WOOD' ? '🪵 Gỗ (μ=0.25)' : mat === 'SMOOTH_MICA' ? '✨ Mica (μ=0.15)' : '⬛ Cao su (μ=0.45)'}
            </button>
          ))}
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              handleResetPositions();
            }}
            className="ml-2 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold cursor-pointer"
          >
            🔄 Đặt lại vị trí
          </button>
        </div>

        {/* Mass Slider for Weights */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 z-10 flex flex-col gap-1 text-xs pointer-events-auto w-56">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700">Khối lượng mỗi quả cân:</span>
            <span className="font-bold text-indigo-600">{weightMassG}g</span>
          </div>
          <input
            type="range"
            min="20"
            max="150"
            step="10"
            value={weightMassG}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => handleWeightMassChange(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-300 rounded-lg"
          />
          <span className="text-[10px] text-slate-500">Đang đặt trên khối gỗ: {weightsCount} quả</span>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-84">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 21: Đo hệ số ma sát trượt</h4>
          <ul className="text-xs text-slate-600 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span>
              Kéo quả cân từ khay đặt lên lưng khối gỗ (nhấp đúp để gỡ).
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span>
              <strong>Dùng chuột giữ thân lực kế và kéo sang phải</strong> để khối gỗ trượt.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span>
              Kim lực kế nhảy số thực $F_{'{ms}'}$, nhả chuột để ghi kết quả.
            </li>
          </ul>
        </div>
      </div>

      {/* Right: Data Table */}
      <div className="w-84 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-sm text-slate-800">Bảng Số Liệu Thực Hành</h3>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              setDataLogs([]);
            }}
            className="text-xs text-rose-600 hover:text-rose-700 px-2 py-0.5 rounded bg-rose-50 border border-rose-200 cursor-pointer"
          >
            Xóa bảng
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-3">Hệ số ma sát trượt: $\mu = F_{'{ms}'} / N$</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-1.5">Lần</th>
                <th className="p-1.5">Mặt</th>
                <th className="p-1.5">m (g)</th>
                <th className="p-1.5">N (N)</th>
                <th className="p-1.5">F_ms (N)</th>
                <th className="p-1.5 font-bold text-blue-600">μ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-1.5 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-1.5 font-medium text-slate-600">{row.surface}</td>
                  <td className="p-1.5">{row.mass}</td>
                  <td className="p-1.5">{row.normalForce}</td>
                  <td className="p-1.5 font-mono text-blue-600 font-semibold">{row.frictionForce}</td>
                  <td className="p-1.5 font-mono font-bold text-emerald-600">{row.mu}</td>
                </tr>
              ))}
              {dataLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                    Chưa có số liệu. Dùng chuột kéo lực kế để đo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {dataLogs.length > 0 && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
            <span className="font-bold text-emerald-800">Hệ số ma sát trung bình:</span>
            <div className="mt-1 font-mono text-emerald-900 font-semibold text-sm">
              μ_tb = {(dataLogs.reduce((acc, r) => acc + r.mu, 0) / dataLogs.length).toFixed(3)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
