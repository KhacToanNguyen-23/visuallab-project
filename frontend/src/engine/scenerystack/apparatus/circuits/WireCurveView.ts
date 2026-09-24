/**
 * DÂY CẮM TÍN HIỆU UỐN CONG (WIRE_CURVE VIEW)
 * 
 * Hiển thị đường dây cáp điện uốn cong mềm mại (Cubic/Quadratic Bezier)
 * kết nối giữa 2 điểm snap bất kỳ trên Canvas.
 */

import { Node, Path } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

export interface WireCurveOptions {
  stroke?: string;
  lineWidth?: number;
  sagFactor?: number; // Độ võng trọng lực của dây cáp
}

export class WireCurveView extends Node {
  private pathNode: Path;
  private strokeColor: string;
  private wireWidth: number;
  private sag: number;

  constructor(options: WireCurveOptions = {}) {
    super();
    this.strokeColor = options.stroke ?? '#3B82F6';
    this.wireWidth = options.lineWidth ?? 2.5;
    this.sag = options.sagFactor ?? 50;

    this.pathNode = new Path(new Shape(), {
      stroke: this.strokeColor,
      lineWidth: this.wireWidth,
      lineCap: 'round',
      lineJoin: 'round',
    });

    this.addChild(this.pathNode);
  }

  public updateCurve(p1: { x: number; y: number }, p2: { x: number; y: number }): void {
    const shape = new Shape();
    shape.moveTo(p1.x, p1.y);

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2 + this.sag;

    shape.quadraticCurveTo(midX, midY, p2.x, p2.y);
    this.pathNode.shape = shape;
  }
}
