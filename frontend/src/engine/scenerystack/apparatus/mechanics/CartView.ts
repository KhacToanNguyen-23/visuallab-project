import { Node, Rectangle, Circle, LinearGradient } from 'scenerystack/scenery';
import { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';
import type { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';

export class CartView extends Node {
  public flagNode: Rectangle;

  constructor(model: LabDeviceModel) {
    super();

    // Thân xe lăn (Cart Body)
    const bodyGradient = new LinearGradient(0, -15, 0, 15)
      .addColorStop(0, '#38bdf8')
      .addColorStop(0.5, '#0284c7')
      .addColorStop(1, '#0369a1');

    const body = new Rectangle(-35, -12, 70, 24, 4, 4, {
      fill: bodyGradient,
      stroke: '#0c4a6e',
      lineWidth: 1.5,
    });
    this.addChild(body);

    // Cờ chắn sáng (Flag - 10mm width representation) cắm trên nóc xe
    this.flagNode = new Rectangle(-5, -36, 10, 24, 1, 1, {
      fill: '#f59e0b',
      stroke: '#b45309',
      lineWidth: 1,
    });
    this.addChild(this.flagNode);

    // 2 Bánh xe trước & sau
    const wheel1 = new Circle(7, { fill: '#334155', stroke: '#0f172a', lineWidth: 1.5, x: -22, y: 12 });
    const wheel2 = new Circle(7, { fill: '#334155', stroke: '#0f172a', lineWidth: 1.5, x: 22, y: 12 });
    const hub1 = new Circle(2.5, { fill: '#94a3b8', x: -22, y: 12 });
    const hub2 = new Circle(2.5, { fill: '#94a3b8', x: 22, y: 12 });

    this.addChild(wheel1);
    this.addChild(wheel2);
    this.addChild(hub1);
    this.addChild(hub2);

    const kinematic = model.getComponent<KinematicComponent>('kinematic');
    if (kinematic) {
      // Kinematic yProperty chứa vị trí s (mét)
      // Tọa độ render thực tế sẽ do Scene tính theo góc xoay của máng
    }
  }
}
