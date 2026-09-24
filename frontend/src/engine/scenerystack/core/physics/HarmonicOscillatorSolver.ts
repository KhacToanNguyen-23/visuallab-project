import type { KinematicComponent } from '../models/components/KinematicComponent.ts';
import type { SpringComponent } from '../models/components/SpringComponent.ts';

export class HarmonicOscillatorSolver {
  /**
   * Tính bước vi phân dao động của hệ con lắc lò xo treo thẳng đứng
   * F_net = m*g - k*(y - l0) - gamma*v
   */
  public static step(
    kinematic: KinematicComponent,
    spring: SpringComponent,
    dt: number,
    gravity: number = 9.807
  ): void {
    if (dt <= 0) return;

    const m = Math.max(0.02, kinematic.mass.value); // Khối lượng tổng tải (kg)
    const k = spring.kProperty.value;               // Độ cứng (N/m)
    const l0 = spring.naturalLength.value;           // Chiều dài tự nhiên (m)
    const gamma = spring.damping.value;             // Hệ số cản

    const y = kinematic.yProperty.value;            // Chiều dài hiện tại của lò xo (m)
    const v = kinematic.vProperty.value;            // Vận tốc (m/s)

    const stretch = y - l0;                         // Độ giãn delta_l
    const springForce = -k * stretch;               // Lực đàn hồi hướng lên (âm)
    const dampingForce = -gamma * v;                // Lực cản môi trường
    const gravityForce = m * gravity;               // Trọng lực hướng xuống (dương)

    const netForce = gravityForce + springForce + dampingForce;
    const a = netForce / m;

    const newV = v + a * dt;
    const newY = y + newV * dt;

    kinematic.aProperty.value = a;
    kinematic.vProperty.value = newV;
    kinematic.yProperty.value = newY;
    spring.currentLength.value = newY;
  }
}
