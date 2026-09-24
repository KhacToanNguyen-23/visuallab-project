/**
 * KHỐI GỖ THÍ NGHIỆM MA SÁT (WOODEN_BLOCK VIEW)
 * 
 * Hiển thị khối gỗ vân gỗ chân thực, có móc kim loại kéo lực kế và bề mặt đặt quả cân
 */

import { Node, Rectangle, Text, Line, Circle } from 'scenerystack/scenery';
import { Font } from 'scenerystack/scenery';
import type { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';

export class FrictionBlockView extends Node {
  public readonly blockBody: Rectangle;
  public readonly hookNode: Node;
  public readonly massLabel: Text;

  constructor(_model?: LabDeviceModel) {
    super();

    // Thân khối gỗ (W=90, H=35) vân màu gỗ tự nhiên
    this.blockBody = new Rectangle(-45, -17.5, 90, 35, {
      fill: '#D2996E',
      stroke: '#8C5A32',
      lineWidth: 2,
      cornerRadius: 3,
    });

    // Vân gỗ trang trí
    const grain1 = new Line(-35, -5, 35, -5, { stroke: '#BA7A48', lineWidth: 1.5 });
    const grain2 = new Line(-40, 6, 30, 6, { stroke: '#BA7A48', lineWidth: 1.5 });

    // Móc kim loại bên phải để móc lực kế
    this.hookNode = new Node({ x: 45, y: 0 });
    const hookLoop = new Circle(4, {
      stroke: '#475569',
      lineWidth: 2,
    });
    this.hookNode.addChild(hookLoop);

    // Nhãn khối lượng
    this.massLabel = new Text('m = 200g', {
      font: new Font({ size: 10, weight: 'bold', family: 'sans-serif' }),
      fill: '#4A2810',
      center: this.blockBody.center,
    });

    this.addChild(this.blockBody);
    this.addChild(grain1);
    this.addChild(grain2);
    this.addChild(this.hookNode);
    this.addChild(this.massLabel);

    this.weightsContainer = new Node();
    this.addChild(this.weightsContainer);
  }

  private weightsContainer: Node;

  public updateWeightsStack(weightCount: number, customMassG = 50): void {
    this.weightsContainer.removeAllChildren();
    for (let i = 0; i < weightCount; i++) {
      const y = -17.5 - (i + 1) * 12;
      const disc = new Rectangle(-25, y, 50, 10, 2, 2, {
        fill: '#475569',
        stroke: '#0F172A',
        lineWidth: 1.5,
      });
      const label = new Text(`${customMassG.toFixed(0)}g`, {
        font: 'bold 8px sans-serif',
        fill: '#FFFFFF',
        centerX: 0,
        centerY: y + 5,
      });
      this.weightsContainer.addChild(disc);
      this.weightsContainer.addChild(label);
    }
  }
}
