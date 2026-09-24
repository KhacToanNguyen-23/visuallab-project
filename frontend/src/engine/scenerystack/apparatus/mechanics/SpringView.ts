import { Node, Path } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

export interface SpringViewOptions {
  numCoils?: number;
  radius?: number;
  scalePxPerMeter?: number; // 1m = 600px
}

export class SpringView extends Node {
  private numCoils: number;
  private radius: number;
  private scalePxPerMeter: number;
  private springPath: Path;

  constructor(options?: SpringViewOptions) {
    super();

    this.numCoils = options?.numCoils || 14;
    this.radius = options?.radius || 16;
    this.scalePxPerMeter = options?.scalePxPerMeter || 600;

    this.springPath = new Path(new Shape(), {
      stroke: '#475569',
      lineWidth: 3.5,
      lineCap: 'round',
      lineJoin: 'round',
    });
    this.addChild(this.springPath);

    this.updateLength(0.2); // Chiều dài mặc định 20cm
  }

  public updateLength(lengthMeters: number): void {
    const totalHeight = Math.max(40, lengthMeters * this.scalePxPerMeter);
    const topLead = 15;
    const bottomLead = 15;
    const coilHeight = totalHeight - topLead - bottomLead;
    const step = coilHeight / (this.numCoils * 2);

    const shape = new Shape();
    // Đầu móc trên
    shape.moveTo(0, 0);
    shape.lineTo(0, topLead);

    // Các vòng xoắn lò xo
    for (let i = 0; i < this.numCoils * 2; i++) {
      const y = topLead + (i + 1) * step;
      const x = (i % 2 === 0 ? 1 : -1) * this.radius;
      shape.lineTo(x, y);
    }

    // Đầu móc dưới
    shape.lineTo(0, totalHeight - bottomLead);
    shape.lineTo(0, totalHeight);

    this.springPath.shape = shape;
  }
}
