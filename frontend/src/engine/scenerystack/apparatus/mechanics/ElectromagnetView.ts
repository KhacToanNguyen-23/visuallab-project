/**
 * NAM CHÂM ĐIỆN GIỮ VẬT (ELECTROMAGNET VIEW)
 * 
 * Hiển thị cuộn nam châm điện có đèn LED trạng thái (xanh = hút bi, đỏ = ngắt điện)
 * và nút bấm nhả bi (Release button) trực tiếp trên thân thiết bị.
 */

import { Node, Rectangle, Text, Circle } from 'scenerystack/scenery';

export interface ElectromagnetViewOptions {
  onRelease?: () => void;
  isEnergized?: boolean;
}

export class ElectromagnetView extends Node {
  private bodyRect: Rectangle;
  private coilRect: Rectangle;
  private poleTip: Rectangle;
  private ledIndicator: Circle;
  private releaseButton: Node;
  public isEnergized: boolean;

  constructor(options: ElectromagnetViewOptions = {}) {
    super();
    this.isEnergized = options.isEnergized ?? true;

    // 1. Thân gá kẹp vào cột (Clamp bracket) - nằm trên đỉnh cột
    this.bodyRect = new Rectangle(-25, -56, 50, 30, 4, 4, {
      fill: '#334155',
      stroke: '#0F172A',
      lineWidth: 1.5,
    });

    // 2. Cuộn dây đồng (Copper Coil)
    this.coilRect = new Rectangle(-18, -26, 36, 20, 2, 2, {
      fill: '#B45309',
      stroke: '#78350F',
      lineWidth: 1.5,
    });

    // 3. Cực từ tính đáy (Magnetic Pole Tip) - chạm vạch 0.0m
    this.poleTip = new Rectangle(-12, -6, 24, 6, 1, 1, {
      fill: '#94A3B8',
      stroke: '#475569',
      lineWidth: 1,
    });

    // 4. Đèn LED chỉ thị
    this.ledIndicator = new Circle(4, {
      fill: this.isEnergized ? '#22C55E' : '#EF4444',
      stroke: '#0F172A',
      lineWidth: 1,
      x: -14,
      y: -41,
    });

    // 5. Nút bấm công tắc nhả bi (Release Switch Button)
    this.releaseButton = new Node({ x: 8, y: -41, cursor: 'pointer' });
    const btnBg = new Rectangle(-10, -8, 22, 16, 3, 3, {
      fill: '#EF4444',
      stroke: '#991B1B',
      lineWidth: 1,
    });
    const btnLabel = new Text('⏻', {
      font: 'bold 10px sans-serif',
      fill: '#FFFFFF',
      centerX: 1,
      centerY: 0,
    });
    this.releaseButton.addChild(btnBg);
    this.releaseButton.addChild(btnLabel);

    this.releaseButton.addInputListener({
      down: () => {
        this.togglePower(options.onRelease);
      },
    });

    this.addChild(this.bodyRect);
    this.addChild(this.coilRect);
    this.addChild(this.poleTip);
    this.addChild(this.ledIndicator);
    this.addChild(this.releaseButton);
  }

  public setEnergized(energized: boolean): void {
    this.isEnergized = energized;
    this.ledIndicator.fill = energized ? '#22C55E' : '#EF4444';
  }

  public togglePower(callback?: () => void): void {
    this.setEnergized(!this.isEnergized);
    if (!this.isEnergized && callback) {
      callback();
    }
  }
}
