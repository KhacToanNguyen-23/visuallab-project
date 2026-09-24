import { Vector2 } from 'scenerystack/dot';

/**
 * Bộ chuyển đổi toạ độ chuẩn PhET (Model-View-Transform 2D)
 * Đảm bảo Model chỉ tính toán trên đơn vị SI (mét, kg, s, N) và View chỉ hiển thị trên Pixel.
 */
export class ModelViewTransform {
  private modelOrigin: Vector2;
  private viewOrigin: Vector2;
  private scaleX: number; // Pixels per meter (X)
  private scaleY: number; // Pixels per meter (Y) - âm nếu trục Y hướng lên

  constructor(
    modelOrigin: Vector2 = new Vector2(0, 0),
    viewOrigin: Vector2 = new Vector2(400, 300),
    scale: number = 100, // 1m = 100px
    invertedY: boolean = true
  ) {
    this.modelOrigin = modelOrigin.copy();
    this.viewOrigin = viewOrigin.copy();
    this.scaleX = scale;
    this.scaleY = invertedY ? -scale : scale;
  }

  /**
   * Chuyển toạ độ điểm từ Model (SI meters) sang View (Pixels)
   */
  public modelToViewPosition(modelPos: Vector2): Vector2 {
    const x = this.viewOrigin.x + (modelPos.x - this.modelOrigin.x) * this.scaleX;
    const y = this.viewOrigin.y + (modelPos.y - this.modelOrigin.y) * this.scaleY;
    return new Vector2(x, y);
  }

  /**
   * Chuyển toạ độ điểm từ View (Pixels) sang Model (SI meters)
   */
  public viewToModelPosition(viewPos: Vector2): Vector2 {
    const x = this.modelOrigin.x + (viewPos.x - this.viewOrigin.x) / this.scaleX;
    const y = this.modelOrigin.y + (viewPos.y - this.viewOrigin.y) / this.scaleY;
    return new Vector2(x, y);
  }

  /**
   * Chuyển đổi khoảng cách / độ dài từ Model (m) sang View (px)
   */
  public modelToViewDeltaX(deltaMeters: number): number {
    return deltaMeters * this.scaleX;
  }

  public modelToViewDeltaY(deltaMeters: number): number {
    return deltaMeters * Math.abs(this.scaleY);
  }

  /**
   * Chuyển đổi khoảng cách / độ dài từ View (px) sang Model (m)
   */
  public viewToModelDeltaX(deltaPixels: number): number {
    return deltaPixels / this.scaleX;
  }

  public viewToModelDeltaY(deltaPixels: number): number {
    return deltaPixels / Math.abs(this.scaleY);
  }
}
