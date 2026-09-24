/**
 * NAM CHÂM ĐIỆN GIỮ VẬT (ELECTROMAGNET APPARATUS)
 * 
 * Chuẩn hóa OOP theo DacTa.md (Bài 14: Đo gia tốc rơi tự do)
 * - Cổng kẹp CLAMP_STAND: Gá vào giá đỡ thẳng đứng.
 * - Cổng giữ MAGNETIC_HOLD: Giữ bi thép khi có điện.
 * - Công tắc bấm nhả Release Switch để thả rơi tự do.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { ElectromagnetView } from '../mechanics/ElectromagnetView.ts';
import type { StandardToolId } from '../../core/contracts/IApparatus.ts';
import type { BallApparatus } from './BallApparatus.ts';

export class ElectromagnetApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'ELECTROMAGNET';
  public readonly name = 'Nam Châm Điện Giữ Vật';
  public readonly viewNode: ElectromagnetView;

  public isEnergized = true;
  public heldBall: BallApparatus | null = null;
  public onBallRelease?: () => void;

  constructor(id?: string) {
    super(id);
    this.viewNode = new ElectromagnetView({
      isEnergized: true,
      onRelease: () => {
        this.releaseBall();
      },
    });

    // Cổng kẹp vào cột giá đỡ
    this.snapPorts.push({
      id: `${this.id}_clamp`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'MAGNET_CLAMP',
    });

    // Cổng giữ từ tính đáy (chạm vạch 0.0m)
    this.snapPorts.push({
      id: `${this.id}_mag_bottom`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'HOOK_BOTTOM',
    });
  }

  public holdBall(ball: BallApparatus): void {
    this.heldBall = ball;
    this.isEnergized = true;
    this.viewNode.setEnergized(true);
  }

  public releaseBall(): void {
    if (!this.isEnergized) return;
    this.isEnergized = false;
    this.viewNode.setEnergized(false);
    if (this.heldBall) {
      this.heldBall = null;
    }
    if (this.onBallRelease) {
      this.onBallRelease();
    }
  }
}
