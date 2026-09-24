/**
 * ĐỘNG CƠ BẮT DÍNH THEO CỔNG & RÀNG BUỘC VẬT LÝ 2.0 (DUAL CONSTRAINT SNAP ENGINE)
 * 
 * Quản lý logic gá lắp các thiết bị thí nghiệm:
 * 1. POINT_ANCHOR: Bắt dính cố định tại tọa độ điểm (Móc lò xo, Quả cân, Chốt điện).
 * 2. LINEAR_RAIL: Chiếu trực giao và khóa thiết bị trượt 1 chiều dọc theo ray/trục (Máng nghiêng, Đệm khí, Pít-tông).
 * 3. Ma trận tương thích cổng: Khớp nối đực/cái chính xác theo nguyên lý vật lý.
 */

import { Node } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';

export type SnapConstraintType = 'POINT_ANCHOR' | 'LINEAR_RAIL';

/**
 * Các loại cổng gá lắp chuẩn hóa trong phòng thí nghiệm
 */
export type SnapPortType = 
  | 'RAIL_SLOT'     // Cổng cái: Rãnh ray máng nghiêng hoặc cột thẳng
  | 'RAIL_CLAMP'    // Cổng đực: Chân kẹp của cổng quang điện
  | 'MAGNET_MOUNT'  // Cổng cái: Vị trí gá đỉnh cột cho nam châm điện
  | 'MAGNET_CLAMP'  // Cổng đực: Chân kẹp nam châm điện
  | 'ARM_HANG'      // Cổng cái: Tay đòn giá đỡ để móc lò xo
  | 'HOOK_TOP'      // Cổng đực: Đầu móc trên (lò xo, quả cân, bi)
  | 'HOOK_BOTTOM'   // Cổng cái: Lỗ móc dưới (lò xo, quả cân, nam châm điện)
  | 'WHEEL_TRACK'   // Cổng đực: Bánh xe lăn tiếp xúc ray
  | 'CIRCUIT_TERMINAL' // Chốt cắm điện cực
  | 'OPTICAL_BENCH' // Trục quang học
  | 'GAS_CHAMBER';  // Ống xy-lanh khí

/**
 * Định nghĩa một cổng kết nối trên thiết bị
 */
export interface SnapPort {
  id: string;
  entityId: string;
  hostNode: Node;
  constraintType?: SnapConstraintType;
  // POINT_ANCHOR offsets
  offsetX?: number;
  offsetY?: number;
  // LINEAR_RAIL start & end points (local to hostNode)
  railStart?: { x: number; y: number };
  railEnd?: { x: number; y: number };
  type: SnapPortType;
}

export interface SnapResult {
  targetPort: SnapPort;
  distance: number;
  globalTarget: { x: number; y: number };
  railParameter?: number; // s in [0, 1] for LINEAR_RAIL
  targetAngleRad?: number; // Angle of rail for automatic orientation
}

export class SnapEngine {
  /**
   * Ma trận tương thích: Khai báo các loại cổng được phép ghép nối với nhau
   */
  private static compatibilityMatrix: Record<SnapPortType, SnapPortType[]> = {
    MAGNET_CLAMP: ['MAGNET_MOUNT'],
    MAGNET_MOUNT: ['MAGNET_CLAMP'],
    RAIL_CLAMP: ['RAIL_SLOT'],
    RAIL_SLOT: ['RAIL_CLAMP', 'WHEEL_TRACK'],
    ARM_HANG: ['HOOK_TOP'],
    HOOK_TOP: ['ARM_HANG', 'HOOK_BOTTOM'],
    HOOK_BOTTOM: ['HOOK_TOP'],
    WHEEL_TRACK: ['RAIL_SLOT'],
    CIRCUIT_TERMINAL: ['CIRCUIT_TERMINAL'],
    OPTICAL_BENCH: ['OPTICAL_BENCH'],
    GAS_CHAMBER: ['GAS_CHAMBER'],
  };

  /**
   * Kiểm tra 2 loại cổng có thể ghép đôi với nhau không
   */
  public static isCompatible(typeA: SnapPortType, typeB: SnapPortType): boolean {
    const allowed = this.compatibilityMatrix[typeA];
    return allowed ? allowed.includes(typeB) : false;
  }

  /**
   * Chiếu vuông góc một điểm P lên đoạn thẳng AB.
   * Trả về điểm chiếu Q trên đoạn thẳng và tham số s in [0, 1].
   */
  public static projectPointToSegment(
    p: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number }
  ): { point: { x: number; y: number }; s: number; distance: number } {
    const abX = b.x - a.x;
    const abY = b.y - a.y;
    const abLenSq = abX * abX + abY * abY;

    if (abLenSq === 0) {
      const dx = p.x - a.x;
      const dy = p.y - a.y;
      return { point: { ...a }, s: 0, distance: Math.sqrt(dx * dx + dy * dy) };
    }

    const apX = p.x - a.x;
    const apY = p.y - a.y;

    // Tham số vô hướng s: t = (AP . AB) / |AB|^2
    let s = (apX * abX + apY * abY) / abLenSq;
    s = Math.max(0, Math.min(1, s)); // Kẹp trong đoạn [0, 1]

    const projX = a.x + s * abX;
    const projY = a.y + s * abY;

    const dx = p.x - projX;
    const dy = p.y - projY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return {
      point: { x: projX, y: projY },
      s,
      distance,
    };
  }

  /**
   * Tìm cổng bắt dính gần nhất (hỗ trợ cả POINT_ANCHOR và LINEAR_RAIL)
   */
  public static findNearestSnap(
    draggedPort: SnapPort,
    candidatePorts: SnapPort[],
    snapRadius = 50
  ): SnapResult | null {
    let nearest: SnapResult | null = null;
    let minDistance = snapRadius;

    // Chuyển đổi tọa độ cổng đang kéo sang hệ tọa độ toàn cục Canvas
    const draggedOffsetX = draggedPort.offsetX ?? 0;
    const draggedOffsetY = draggedPort.offsetY ?? 0;
    const draggedVec = new Vector2(draggedOffsetX, draggedOffsetY);
    const draggedGlobal = draggedPort.hostNode.localToGlobalPoint(draggedVec);

    for (const candidate of candidatePorts) {
      if (candidate.entityId === draggedPort.entityId) continue;
      if (!this.isCompatible(draggedPort.type, candidate.type)) continue;

      if (candidate.constraintType === 'LINEAR_RAIL' && candidate.railStart && candidate.railEnd) {
        // LINEAR_RAIL: Chiếu điểm kéo lên ray toàn cục
        const startGlobal = candidate.hostNode.localToGlobalPoint(new Vector2(candidate.railStart.x, candidate.railStart.y));
        const endGlobal = candidate.hostNode.localToGlobalPoint(new Vector2(candidate.railEnd.x, candidate.railEnd.y));

        const projection = this.projectPointToSegment(
          { x: draggedGlobal.x, y: draggedGlobal.y },
          { x: startGlobal.x, y: startGlobal.y },
          { x: endGlobal.x, y: endGlobal.y }
        );

        if (projection.distance <= minDistance) {
          minDistance = projection.distance;
          const dx = endGlobal.x - startGlobal.x;
          const dy = endGlobal.y - startGlobal.y;
          // Ray đứng (như giá đỡ thẳng đứng) giữ góc thẳng 0 rad
          const railAngle = Math.abs(dx) < 2 ? 0 : Math.atan2(dy, dx);
          nearest = {
            targetPort: candidate,
            distance: projection.distance,
            globalTarget: projection.point,
            railParameter: projection.s,
            targetAngleRad: railAngle,
          };
        }
      } else {
        // POINT_ANCHOR: Khoảng cách Euclidean 2 điểm
        const candOffsetX = candidate.offsetX ?? 0;
        const candOffsetY = candidate.offsetY ?? 0;
        const candidateVec = new Vector2(candOffsetX, candOffsetY);
        const candidateGlobal = candidate.hostNode.localToGlobalPoint(candidateVec);

        const dx = draggedGlobal.x - candidateGlobal.x;
        const dy = draggedGlobal.y - candidateGlobal.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= minDistance) {
          minDistance = dist;
          nearest = {
            targetPort: candidate,
            distance: dist,
            globalTarget: { x: candidateGlobal.x, y: candidateGlobal.y },
          };
        }
      }
    }

    return nearest;
  }

  /**
   * Nội suy vị trí chuyển động mềm (Magnetic Lerp)
   */
  public static lerp(current: number, target: number, speed = 0.35): number {
    return current + (target - current) * speed;
  }
}
