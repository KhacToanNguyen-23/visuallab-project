/**
 * LỰC KẾ LÒ XO (SPRING_BALANCE APPARATUS)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 21: Đo hệ số ma sát trượt)
 * - Thang đo 0-5N, độ chia 0.01N.
 * - Kéo vật trượt và đọc lực ma sát trượt F_ms.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { SpringBalanceView } from '../mechanics/SpringBalanceView.ts';
import type { StandardToolId, IMeasuringTool } from '../../core/contracts/IApparatus.ts';

export class SpringBalanceApparatus extends BaseApparatus implements IMeasuringTool {
  public readonly toolId: StandardToolId = 'SPRING_BALANCE';
  public readonly name = 'Lực Kế Lò Xo';
  public readonly viewNode: SpringBalanceView;

  public readonly unit = 'N';
  public readonly resolution = 0.01;
  public readonly maxRange = 5.0;
  public measuredValue = 0; // Newton

  constructor(id?: string) {
    super(id);
    this.viewNode = new SpringBalanceView(this.model);

    // Cổng móc kéo bên phải để nối vào khối gỗ hoặc vật nặng
    this.snapPorts.push({
      id: `${this.id}_hook_out`,
      entityId: this.id,
      hostNode: this.viewNode.hookRight,
      offsetX: 0,
      offsetY: 0,
      type: 'HOOK_TOP',
    });
  }

  public readCurrentValue(): number {
    return this.measuredValue;
  }

  public setForce(forceN: number): void {
    this.measuredValue = forceN;
    this.viewNode.setForce(forceN);
  }
}
