/**
 * LỚP CƠ SỞ BASE APPARATUS (OOP BASE CLASS)
 * 
 * Đóng gói toàn bộ hành vi chung của mọi dụng cụ thí nghiệm:
 * 1. Khởi tạo mã định danh ID và SceneryStack Model.
 * 2. Tự động xử lý kéo thả 2D vi phân (không bị giật lag/teleport).
 * 3. Quản lý danh sách cổng gá lắp (SnapPort) và hook kết nối (onSnapped / onUnsnapped).
 */

import { Node, DragListener } from 'scenerystack/scenery';
import { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';
import type { IApparatus, StandardToolId } from '../../core/contracts/IApparatus.ts';
import type { SnapPort } from '../../interaction/SnapEngine.ts';

export abstract class BaseApparatus implements IApparatus {
  public readonly id: string;
  public abstract readonly toolId: StandardToolId;
  public abstract readonly name: string;
  public readonly model: LabDeviceModel;
  public abstract readonly viewNode: Node;
  public readonly snapPorts: SnapPort[] = [];
  public connectedHostId?: string;

  constructor(id?: string) {
    this.id = id || `apparatus_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.model = new LabDeviceModel();
  }

  /**
   * Cập nhật tính toán vật lý mỗi frame dt (Lớp con ghi đè nếu có hành vi liên tục)
   */
  public updatePhysics(_dt: number): void {
    // Mặc định rỗng, các lớp con có solver sẽ ghi đè
  }

  /**
   * Hook được gọi khi thiết bị được hút dính vào một thiết bị khác
   */
  public onSnapped(_target: IApparatus, _myPort: SnapPort, _targetPort: SnapPort): void {
    // Lớp con ghi đè để xử lý logic ràng buộc dữ liệu
  }

  /**
   * Hook được gọi khi thiết bị bị gỡ khỏi thiết bị khác
   */
  public onUnsnapped(): void {
    this.connectedHostId = undefined;
  }

  /**
   * Kích hoạt kéo thả vi phân 2D mượt mà trên Canvas SceneryStack
   */
  public enableDragging(parentContainer: Node, onDragMove?: () => void, onDragEnd?: () => void): void {
    let startPointerPos: { x: number; y: number } | null = null;
    let startNodePos: { x: number; y: number } | null = null;

    const dragListener = new DragListener({
      start: (event: any) => {
        // Nếu bấm vào nút bấm hoặc control con (cursor = pointer), không kéo apparatus
        if (event.trail && event.trail.nodes.some((n: any) => n.cursor === 'pointer')) {
          startPointerPos = null;
          startNodePos = null;
          return;
        }
        const pt = parentContainer.globalToParentPoint(event.pointer.point);
        startPointerPos = { x: pt.x, y: pt.y };
        startNodePos = { x: this.viewNode.x, y: this.viewNode.y };
      },

      drag: (event: any) => {
        if (!startPointerPos || !startNodePos) return;
        const currentPt = parentContainer.globalToParentPoint(event.pointer.point);
        this.viewNode.x = startNodePos.x + (currentPt.x - startPointerPos.x);
        this.viewNode.y = startNodePos.y + (currentPt.y - startPointerPos.y);

        if (onDragMove) onDragMove();
      },

      end: () => {
        startPointerPos = null;
        startNodePos = null;
        if (onDragEnd) onDragEnd();
      },
    });

    this.viewNode.addInputListener(dragListener);
    this.viewNode.cursor = 'grab';
  }

  public setPosition(x: number, y: number): void {
    this.viewNode.x = x;
    this.viewNode.y = y;
  }

  public dispose(): void {
    // Dọn dẹp tài nguyên khi xóa khỏi Scene
  }
}
