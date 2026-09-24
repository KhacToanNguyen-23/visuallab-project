import { Node, Rectangle, Text, DragListener, Path } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';
import type { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';
import type { SensorComponent } from '../../core/models/components/SensorComponent.ts';

export interface RampPhotogateOptions {
  label?: string;
  isDraggable?: boolean;
  getMinS?: () => number;
  getMaxS?: () => number;
  trackLengthPx?: number; // 700px = 1.0m
}

export class RampPhotogateView extends Node {
  constructor(model: LabDeviceModel, options?: RampPhotogateOptions) {
    super();

    const labelStr = options?.label || 'Cổng E';
    const isDraggable = options?.isDraggable !== false;
    const trackLengthPx = options?.trackLengthPx || 700;

    // Khung chữ U chụp qua đường ray máng nghiêng
    const bracketShape = new Shape()
      .moveTo(-15, -45) // Đỉnh trên
      .lineTo(15, -45)
      .lineTo(15, 10)
      .lineTo(-15, 10)
      .close();

    const bracket = new Path(bracketShape, { fill: '#1e293b', stroke: '#0f172a', lineWidth: 1.5 });
    this.addChild(bracket);

    // Khe cảm biến hồng ngoại
    const slot = new Rectangle(-8, -40, 16, 30, 1, 1, { fill: 'rgba(255,255,255,0.15)' });
    this.addChild(slot);

    // Mắt LED cảm biến
    const led = new Rectangle(-4, -38, 8, 4, 1, 1, { fill: '#ef4444' });
    this.addChild(led);

    // Nhãn tên cổng
    const labelNode = new Text(labelStr, { font: 'bold 10px Arial', fill: '#38bdf8', centerX: 0, top: 12 });
    this.addChild(labelNode);

    const kinematic = model.getComponent<KinematicComponent>('kinematic');
    if (kinematic) {
      kinematic.yProperty.link(s => {
        // s là mét dọc theo máng (0 -> 1.0)
        this.x = s * trackLengthPx;
      });
    }

    const sensor = model.getComponent<SensorComponent>('sensor');
    if (sensor) {
      sensor.isTriggeredProperty.link(triggered => {
        led.fill = triggered ? '#22c55e' : '#ef4444';
      });
    }

    if (isDraggable) {
      const dragListener = new DragListener({
        drag: (event: any) => {
          const parentPoint = this.globalToParentPoint(event.pointer.point);
          let targetS = parentPoint.x / trackLengthPx;

          if (options?.getMinS) targetS = Math.max(targetS, options.getMinS());
          if (options?.getMaxS) targetS = Math.min(targetS, options.getMaxS());

          if (kinematic) {
            kinematic.yProperty.value = targetS;
          }
        }
      });

      this.addInputListener(dragListener);
      this.cursor = 'ew-resize';
    }
  }
}
