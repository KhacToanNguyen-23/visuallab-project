/**
 * MÁNG NGHIÊNG ĐỊNH HƯỚNG (INCLINED_TRACK)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 6: Đo tốc độ chuyển động thẳng)
 * Quản lý góc dốc alpha, chiều cao h và ray trượt RAIL_SLOT để gá cổng quang hoặc xe trượt.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { InclinedPlaneView } from '../mechanics/InclinedPlaneView.ts';
import type { StandardToolId, IMechanicalBase } from '../../core/contracts/IApparatus.ts';

export class InclinedPlaneApparatus extends BaseApparatus implements IMechanicalBase {
  public readonly toolId: StandardToolId = 'INCLINED_TRACK';
  public readonly name = 'Máng Nghiêng Định Hướng';
  public readonly viewNode: InclinedPlaneView;
  public trackLength = 1.0;
  public inclinationAngleDeg = 15.0;

  constructor(id?: string, trackLengthPx = 500) {
    super(id);
    this.viewNode = new InclinedPlaneView({
      trackLengthPx,
      onAngleChange: (angle) => {
        this.inclinationAngleDeg = angle;
      },
    });

    this.snapPorts.push({
      id: `${this.id}_incline_rail`,
      entityId: this.id,
      hostNode: this.viewNode.trackNode,
      constraintType: 'LINEAR_RAIL',
      railStart: { x: 0, y: 0 },
      railEnd: { x: trackLengthPx, y: 0 },
      offsetX: trackLengthPx / 2,
      offsetY: 0,
      type: 'RAIL_SLOT',
    });
  }
}
