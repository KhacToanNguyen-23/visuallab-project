/**
 * GIÁ ĐỠ THÍ NGHIỆM THẲNG ĐỨNG (VERTICAL_STAND)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 14: Rơi tự do, Bài 38: Lò xo)
 * Cung cấp 2 cổng cái:
 * - RAIL_SLOT: Dọc cột để kẹp cổng quang điện.
 * - ARM_HANG: Đầu tay đòn để móc treo lò xo.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { StandView } from '../mechanics/StandView.ts';
import type { StandardToolId } from '../../core/contracts/IApparatus.ts';

export class StandApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'VERTICAL_STAND';
  public readonly name = 'Giá Đỡ Thí Nghiệm';
  public readonly viewNode: StandView;

  constructor(id?: string) {
    super(id);
    this.viewNode = new StandView();

    this.snapPorts.push({
      id: `${this.id}_top_magnet`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 10,
      type: 'MAGNET_MOUNT',
    });

    this.snapPorts.push({
      id: `${this.id}_rail`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'LINEAR_RAIL',
      railStart: { x: 0, y: 60 },
      railEnd: { x: 0, y: 390 },
      offsetX: 0,
      offsetY: 200,
      type: 'RAIL_SLOT',
    });

    this.snapPorts.push({
      id: `${this.id}_arm`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 60,
      offsetY: 50,
      type: 'ARM_HANG',
    });
  }
}
