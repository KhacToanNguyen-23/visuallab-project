/**
 * LỰC KẾ LÒ XO (SPRING_BALANCE VIEW)
 * 
 * Thang đo 0-5N, vạch chia 0.1N, kim chỉ thị di chuyển theo lực kéo F
 */

import { Node, Rectangle, Text, Line, Circle } from 'scenerystack/scenery';
import { Font } from 'scenerystack/scenery';
import type { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';

export class SpringBalanceView extends Node {
  public readonly casing: Rectangle;
  public readonly pointerLine: Line;
  public readonly forceText: Text;
  public readonly hookLeft: Node;
  public readonly hookRight: Node;

  constructor(_model?: LabDeviceModel) {
    super();

    // Vỏ bọc lực kế (W=160, H=28) màu vàng acrylic trong suốt
    this.casing = new Rectangle(-80, -14, 160, 28, {
      fill: 'rgba(254, 240, 138, 0.9)',
      stroke: '#CA8A04',
      lineWidth: 2,
      cornerRadius: 6,
    });

    // Vòng tròn tay cầm bên trái
    this.hookLeft = new Node({ x: -80, y: 0 });
    this.hookLeft.addChild(new Circle(5, { stroke: '#475569', lineWidth: 2 }));

    // Móc kéo lò xo bên phải
    this.hookRight = new Node({ x: 80, y: 0 });
    this.hookRight.addChild(new Circle(5, { stroke: '#DC2626', lineWidth: 2 }));

    // Kim chỉ lực (màu đỏ)
    this.pointerLine = new Line(0, -10, 0, 10, {
      stroke: '#DC2626',
      lineWidth: 2.5,
      x: -50,
    });

    // Thang đo vạch chia Newton
    const scaleGroup = new Node();
    for (let i = 0; i <= 5; i++) {
      const x = -50 + i * 20;
      scaleGroup.addChild(new Line(x, -8, x, -2, { stroke: '#854D0E', lineWidth: 1.5 }));
      scaleGroup.addChild(
        new Text(`${i}`, {
          font: new Font({ size: 9, weight: 'bold' }),
          fill: '#854D0E',
          centerX: x,
          centerY: 5,
        })
      );
    }

    // Hiển thị số đo chính xác
    this.forceText = new Text('F = 0.00 N', {
      font: new Font({ size: 10, weight: 'bold', family: 'monospace' }),
      fill: '#1E293B',
      centerX: 0,
      y: 22,
    });

    this.addChild(this.casing);
    this.addChild(this.hookLeft);
    this.addChild(this.hookRight);
    this.addChild(scaleGroup);
    this.addChild(this.pointerLine);
    this.addChild(this.forceText);
  }

  public setForce(f: number): void {
    const clampedF = Math.max(0, Math.min(5, f));
    this.pointerLine.x = -50 + (clampedF / 5) * 100;
    this.forceText.string = `F = ${clampedF.toFixed(2)} N`;
  }
}
