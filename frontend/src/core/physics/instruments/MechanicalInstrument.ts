import { Vector2 } from 'scenerystack/dot';
import { BaseInstrument } from './BaseInstrument';
import type { IInstrumentConfig, InstrumentCategory } from '../types';

/**
 * Lớp trừu tượng cho các dụng cụ Động học / Động lực học (Bi thép, Giá đỡ, Lò xo, Máng nghiêng, Lực kế, Quả cân).
 */
export abstract class MechanicalInstrument extends BaseInstrument {
  public velocity: Vector2 = new Vector2(0, 0);       // m/s
  public acceleration: Vector2 = new Vector2(0, 0);   // m/s^2
  public forces: Vector2[] = [];                       // Các lực tác dụng (N)

  constructor(
    id: string,
    toolId: string,
    name: string,
    category: InstrumentCategory,
    initialConfig: IInstrumentConfig,
    initialPosition: Vector2 = new Vector2(0, 0)
  ) {
    super(id, toolId, name, category, initialConfig, initialPosition);
  }

  /**
   * Khối lượng vật thể (kg), lấy động từ config
   */
  public get mass(): number {
    try {
      return this.getParam<number>('mass');
    } catch {
      return 0.1;
    }
  }

  /**
   * Hệ số ma sát, lấy động từ config
   */
  public get frictionCoeff(): number {
    try {
      return this.getParam<number>('frictionCoeff');
    } catch {
      return 0;
    }
  }

  /**
   * Tác dụng một lực lên vật thể
   */
  public applyForce(force: Vector2): void {
    this.forces.push(force.copy());
  }

  /**
   * Tính tổng hợp lực và gia tốc
   */
  public calculateNetForce(): Vector2 {
    const netForce = new Vector2(0, 0);
    for (const f of this.forces) {
      netForce.add(f);
    }
    return netForce;
  }

  /**
   * Bước tính toán động học (Kinematic Step) theo Semi-implicit Euler
   */
  public stepKinematics(dt: number): void {
    if (this.mass > 0) {
      const netForce = this.calculateNetForce();
      this.acceleration.setXY(netForce.x / this.mass, netForce.y / this.mass);
      this.velocity.addXY(this.acceleration.x * dt, this.acceleration.y * dt);
      this.position.addXY(this.velocity.x * dt, this.velocity.y * dt);
    }
    this.forces = []; // Reset lực sau mỗi frame
  }

  public override serialize(): Record<string, any> {
    const base = super.serialize();
    return {
      ...base,
      velocity: { x: this.velocity.x, y: this.velocity.y },
      acceleration: { x: this.acceleration.x, y: this.acceleration.y },
    };
  }
}
