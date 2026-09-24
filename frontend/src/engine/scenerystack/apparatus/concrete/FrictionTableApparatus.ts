/**
 * BÀN THÍ NGHIỆM MA SÁT (FRICTION_TABLE APPARATUS)
 * 
 * Chuẩn hóa OOP theo DacTa.md (Bài 21: Đo hệ số ma sát trượt)
 * Cung cấp mặt tiếp xúc tùy biến và hệ số ma sát tĩnh / trượt tương ứng.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import {
  FrictionTableView,
  SURFACE_CONFIGS,
  type SurfaceMaterialType,
} from '../mechanics/FrictionTableView.ts';
import type { StandardToolId, IMechanicalBase } from '../../core/contracts/IApparatus.ts';

export class FrictionTableApparatus extends BaseApparatus implements IMechanicalBase {
  public readonly toolId: StandardToolId = 'INCLINED_TRACK';
  public readonly name = 'Mặt Bàn Thí Nghiệm Ma Sát';
  public readonly viewNode: FrictionTableView;

  public trackLength = 0.6; // mét
  public inclinationAngleDeg = 0.0; // nằm ngang

  public surfaceType: SurfaceMaterialType = 'WOOD';
  public frictionCoeff = 0.25;

  constructor(id?: string, initialSurface: SurfaceMaterialType = 'WOOD', tableWidth = 600) {
    super(id);
    this.viewNode = new FrictionTableView(tableWidth, 40);
    this.setSurface(initialSurface);

    // Cổng ray trượt cho khối gỗ
    this.snapPorts.push({
      id: `${this.id}_surface_rail`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'LINEAR_RAIL',
      railStart: { x: -tableWidth / 2 + 50, y: 0 },
      railEnd: { x: tableWidth / 2 - 50, y: 0 },
      offsetX: 0,
      offsetY: 0,
      type: 'WHEEL_TRACK',
    });
  }

  public setSurface(surface: SurfaceMaterialType): void {
    this.surfaceType = surface;
    this.frictionCoeff = SURFACE_CONFIGS[surface].mu;
    this.viewNode.setMaterial(surface);
  }
}
