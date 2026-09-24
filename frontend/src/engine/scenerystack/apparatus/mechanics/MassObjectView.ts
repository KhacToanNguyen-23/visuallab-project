import { Node, Circle, RadialGradient } from 'scenerystack/scenery';
import { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';
import type { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';

export class MassObjectView extends Node {
  constructor(model: LabDeviceModel, radius: number = 15) {
    super();

    // Bi thép bóng
    const gradient = new RadialGradient(-radius * 0.3, -radius * 0.3, 0, 0, 0, radius)
      .addColorStop(0, '#e2e8f0')   // Sáng ở góc trên trái
      .addColorStop(0.4, '#94a3b8')
      .addColorStop(1, '#334155');  // Tối ở rìa

    const circle = new Circle(radius, { fill: gradient, stroke: '#1e293b', lineWidth: 1 });
    this.addChild(circle);

    const kinematic = model.getComponent<KinematicComponent>('kinematic');
    if (kinematic) {
      kinematic.xProperty.link(x => { this.x = x; });
      kinematic.yProperty.link(y => { this.y = 50 + y * 400; });
    }
  }
}
