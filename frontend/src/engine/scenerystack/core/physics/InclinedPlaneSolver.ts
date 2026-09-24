import type { KinematicComponent } from '../models/components/KinematicComponent.ts';

export interface InclinedPlaneState {
  angleRad: number;       // Góc nghiêng (radian)
  frictionCoeff: number;  // Hệ số ma sát mu
  gravity: number;        // Gia tốc trọng trường g
  trackLength: number;    // Chiều dài máng (m)
}

export class InclinedPlaneSolver {
  /**
   * Tính gia tốc dọc theo mặt phẳng nghiêng:
   * a = g * (sin(alpha) - mu * cos(alpha))
   */
  public static calculateAcceleration(state: InclinedPlaneState): number {
    const { angleRad, frictionCoeff, gravity } = state;
    const sinA = Math.sin(angleRad);
    const cosA = Math.cos(angleRad);
    
    // Nếu lực kéo xuống dốc lớn hơn ma sát nghỉ cực đại
    if (sinA > frictionCoeff * cosA) {
      return gravity * (sinA - frictionCoeff * cosA);
    }
    return 0;
  }

  /**
   * Cập nhật chuyển động của xe trượt dọc theo máng nghiêng
   * s: Tọa độ dọc theo máng (m), từ 0 đến trackLength
   */
  public static step(
    kinematic: KinematicComponent,
    state: InclinedPlaneState,
    dt: number
  ): void {
    if (dt <= 0) return;

    const currentS = kinematic.yProperty.value; // Tọa độ vị trí s dọc máng
    if (currentS >= state.trackLength) {
      kinematic.vProperty.value = 0;
      return;
    }

    const a = this.calculateAcceleration(state);
    const v = kinematic.vProperty.value;

    const newV = v + a * dt;
    const newS = currentS + v * dt + 0.5 * a * dt * dt;

    kinematic.aProperty.value = a;
    kinematic.vProperty.value = newV;
    kinematic.yProperty.value = Math.min(newS, state.trackLength);
  }
}
