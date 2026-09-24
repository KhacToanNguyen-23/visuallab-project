/**
 * MÁNG ĐỆM KHÍ (AIR_TRACK_BASE APPARATUS)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 30: Khảo sát động lượng & va chạm)
 * - Chiều dài máng đệm khí trackLength = 1.2m, không ma sát (đệm không khí).
 * - Cung cấp ray trượt phẳng và các điểm bắt dính cổng quang điện.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { AirTrackView } from '../mechanics/GliderView.ts';
import type { StandardToolId, IMechanicalBase } from '../../core/contracts/IApparatus.ts';

export class AirTrackApparatus extends BaseApparatus implements IMechanicalBase {
  public readonly toolId: StandardToolId = 'INCLINED_TRACK';
  public readonly name = 'Máng Đệm Khí Phẳng';
  public readonly viewNode: AirTrackView;

  public trackLength = 1.2; // mét
  public inclinationAngleDeg = 0; // phẳng nằm ngang

  constructor(id?: string) {
    super(id);
    this.viewNode = new AirTrackView(this.model);

    // Cổng ray trượt cho xe
    this.snapPorts.push({
      id: `${this.id}_track_rail`,
      entityId: this.id,
      hostNode: this.viewNode.trackBody,
      constraintType: 'LINEAR_RAIL',
      railStart: { x: -240, y: -12 },
      railEnd: { x: 240, y: -12 },
      offsetX: 0,
      offsetY: -12,
      type: 'WHEEL_TRACK',
    });

    // Cổng gắn cổng quang điện trên ray
    this.snapPorts.push({
      id: `${this.id}_photogate_rail`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'LINEAR_RAIL',
      railStart: { x: -220, y: -16 },
      railEnd: { x: 220, y: -16 },
      offsetX: 0,
      offsetY: -16,
      type: 'RAIL_SLOT',
    });
  }
}
