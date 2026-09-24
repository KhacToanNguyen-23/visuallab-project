import { KinematicComponent } from '../models/components/KinematicComponent.ts';

/**
 * KIẾN TRÚC MÔ PHỎNG: LỚP SOLVER (BỘ GIẢI VẬT LÝ)
 * 
 * KinematicSolver là một module độc lập hoàn toàn với đồ họa (UI) và thiết bị.
 * Kiến trúc tách biệt này (Decoupled Physics) cho phép:
 * - Tái sử dụng solver này cho nhiều bài Lab khác nhau (Rơi tự do, ném ngang, con lắc...).
 * - Dễ dàng viết Unit Test kiểm tra tính chính xác của công thức vật lý mà không cần render UI.
 * 
 * Hàm applyFreeFallStep áp dụng công thức động học để tính quãng đường và vận tốc
 * dựa trên gia tốc trọng trường g và khoảng thời gian dt.
 */
export class KinematicSolver {
  public static readonly GRAVITY = 9.807;

  /**
   * Tính toán lại vị trí và vận tốc cho các vật thể sử dụng phương pháp Velocity Verlet
   */
  public static applyFreeFallStep(body: KinematicComponent, dt: number) {
    const v = body.vProperty.value;
    const m = body.mass.value;
    const k = body.dragCoefficient.value;

    // a = g - (k/m)*v^2
    const a = this.GRAVITY - (k / m) * (v * v); 
    body.aProperty.value = a;

    const currentY = body.yProperty.value;
    
    // Cập nhật vị trí và vận tốc (Euler phương pháp đơn giản hoặc Verlet)
    body.yProperty.value = currentY + v * dt + 0.5 * a * dt * dt;
    body.vProperty.value = v + a * dt;
  }
}
