import { Node, Rectangle, Text, DragListener, Path } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';
import type { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';
import type { SensorComponent } from '../../core/models/components/SensorComponent.ts';

export interface PhotogateOptions {
  label?: string;
  isDraggable?: boolean;
  getMinY?: () => number;
  getMaxY?: () => number;
}

export class PhotogateView extends Node {
  constructor(model: LabDeviceModel, options?: PhotogateOptions) {
    super();

    const labelStr = options?.label || 'Cổng quang';
    const isDraggable = options?.isDraggable !== false;

    // Vẽ ngoàm cổng quang (Bracket chữ U ngang)
    const bracketShape = new Shape()
      .moveTo(-45, -15)
      .lineTo(-30, -15)
      .lineTo(15, -15)
      .lineTo(15, 15)
      .lineTo(-30, 15)
      .lineTo(-45, 15)
      .close();

    const bracket = new Path(bracketShape, { fill: '#334155', stroke: '#0f172a', lineWidth: 2 });
    this.addChild(bracket);

    // Mắt thu/phát hồng ngoại
    const irSensor = new Rectangle(-10, -12, 10, 4, 1, 1, { fill: '#ef4444' });
    this.addChild(irSensor);

    const labelNode = new Text(labelStr, { font: 'bold 10px Arial', fill: 'white', left: -42, centerY: 0 });
    this.addChild(labelNode);

    const kinematic = model.getComponent<KinematicComponent>('kinematic');
    if (kinematic) {
      kinematic.xProperty.link(x => { this.x = x; });
      kinematic.yProperty.link(y => { this.y = 50 + y * 400; });
    }

    const sensor = model.getComponent<SensorComponent>('sensor');
    if (sensor) {
      sensor.isTriggeredProperty.link(triggered => {
        irSensor.fill = triggered ? '#22c55e' : '#ef4444'; 
      });
    }

    if (isDraggable) {
      const dragListener = new DragListener({
        drag: (event: any) => {
          const parentPoint = this.globalToParentPoint(event.pointer.point);
          let targetYMath = (parentPoint.y - 50) / 400;

          if (options?.getMinY) targetYMath = Math.max(targetYMath, options.getMinY());
          if (options?.getMaxY) targetYMath = Math.min(targetYMath, options.getMaxY());

          if (kinematic) {
            kinematic.yProperty.value = targetYMath;
          }
        }
      });

      this.addInputListener(dragListener);
      this.cursor = 'ns-resize'; 
    }
  }
}
