/**
 * MÁNG ĐỆM KHÍ & XE TRƯỢT VA CHẠM (AIR_TRACK & GLIDER VIEW)
 * 
 * Băng đệm khí phẳng dài kèm thước cm và 2 xe trượt glider va chạm đàn hồi/mềm
 */

import { Node, Rectangle, Text, Line } from 'scenerystack/scenery';
import { Font } from 'scenerystack/scenery';
import type { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';

export class GliderView extends Node {
  public readonly bodyNode: Rectangle;
  public readonly flagNode: Rectangle;
  public readonly bufferLeft: Rectangle;
  public readonly bufferRight: Rectangle;
  public readonly labelText: Text;

  constructor(_model?: LabDeviceModel, name = 'Xe 1', color = '#3B82F6') {
    super();

    // Thân xe nhôm (W=70, H=22)
    this.bodyNode = new Rectangle(-35, -11, 70, 22, {
      fill: color,
      stroke: '#1E293B',
      lineWidth: 1.5,
      cornerRadius: 3,
    });

    // Cờ chắn sáng 10mm nhô lên trên đỉnh xe
    this.flagNode = new Rectangle(-5, -28, 10, 17, {
      fill: '#1E293B',
      stroke: '#0F172A',
      lineWidth: 1,
    });

    // Cản va chạm đàn hồi 2 đầu xe (lò xo lá)
    this.bufferLeft = new Rectangle(-38, -6, 3, 12, { fill: '#94A3B8', cornerRadius: 1 });
    this.bufferRight = new Rectangle(35, -6, 3, 12, { fill: '#94A3B8', cornerRadius: 1 });

    // Nhãn tên xe
    this.labelText = new Text(name, {
      font: new Font({ size: 9, weight: 'bold' }),
      fill: '#FFFFFF',
      center: this.bodyNode.center,
    });

    this.addChild(this.bufferLeft);
    this.addChild(this.bufferRight);
    this.addChild(this.bodyNode);
    this.addChild(this.flagNode);
    this.addChild(this.labelText);
  }
}

export class AirTrackView extends Node {
  public readonly trackBody: Rectangle;
  public readonly airHoles: Node;
  public readonly rulerTicks: Node;

  constructor(_model?: LabDeviceModel) {
    super();

    // Thân máng đệm khí (W=600, H=24) bằng nhôm anodized xám
    this.trackBody = new Rectangle(-300, -12, 600, 24, {
      fill: '#E2E8F0',
      stroke: '#64748B',
      lineWidth: 2,
      cornerRadius: 4,
    });

    // Các lỗ thổi khí nén
    this.airHoles = new Node();
    for (let x = -280; x <= 280; x += 15) {
      this.airHoles.addChild(new Line(x, -6, x, -3, { stroke: '#94A3B8', lineWidth: 1 }));
    }

    // Thước chia cm dọc máng
    this.rulerTicks = new Node();
    for (let x = -280; x <= 280; x += 20) {
      this.rulerTicks.addChild(new Line(x, 4, x, 10, { stroke: '#475569', lineWidth: 1.5 }));
    }

    this.addChild(this.trackBody);
    this.addChild(this.airHoles);
    this.addChild(this.rulerTicks);
  }
}
