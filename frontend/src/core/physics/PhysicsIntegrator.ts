import { Vector2 } from 'scenerystack/dot';

export type IntegrationMethod = 'SEMI_IMPLICIT_EULER' | 'VELOCITY_VERLET' | 'EXPLICIT_EULER';

/**
 * Lớp thuật toán tích phân số học mô phỏng chuyển động và dao động chuẩn PhET
 */
export class PhysicsIntegrator {
  private static MAX_DT = 0.033; // Giới hạn bước nhảy tối đa 33ms (~30 FPS min) để tránh xuyên thấu

  /**
   * Tích phân Semi-Implicit Euler (Ổn định năng lượng cho dao động điều hòa)
   * v(t + dt) = v(t) + a(t) * dt
   * x(t + dt) = x(t) + v(t + dt) * dt
   */
  public static semiImplicitEuler(
    pos: Vector2,
    vel: Vector2,
    acc: Vector2,
    dt: number
  ): { nextPos: Vector2; nextVel: Vector2 } {
    const clampedDt = Math.min(dt, this.MAX_DT);
    const nextVel = vel.copy().addXY(acc.x * clampedDt, acc.y * clampedDt);
    const nextPos = pos.copy().addXY(nextVel.x * clampedDt, nextVel.y * clampedDt);
    return { nextPos, nextVel };
  }

  /**
   * Tích phân Velocity Verlet (Bậc 2 chính xác cao cho con lắc / quỹ đạo hành tinh)
   * x(t + dt) = x(t) + v(t)*dt + 0.5*a(t)*dt^2
   * v(t + dt) = v(t) + 0.5*(a(t) + a(t + dt))*dt
   */
  public static velocityVerletPosition(
    pos: Vector2,
    vel: Vector2,
    acc: Vector2,
    dt: number
  ): Vector2 {
    const clampedDt = Math.min(dt, this.MAX_DT);
    return pos.copy()
      .addXY(vel.x * clampedDt, vel.y * clampedDt)
      .addXY(0.5 * acc.x * clampedDt * clampedDt, 0.5 * acc.y * clampedDt * clampedDt);
  }

  public static velocityVerletVelocity(
    vel: Vector2,
    accCur: Vector2,
    accNext: Vector2,
    dt: number
  ): Vector2 {
    const clampedDt = Math.min(dt, this.MAX_DT);
    return vel.copy().addXY(
      0.5 * (accCur.x + accNext.x) * clampedDt,
      0.5 * (accCur.y + accNext.y) * clampedDt
    );
  }
}
