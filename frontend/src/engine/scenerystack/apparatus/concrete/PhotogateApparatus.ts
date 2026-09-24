/**
 * CỔNG QUANG ĐIỆN HỒNG NGOẠI (PHOTOGATE_SENSOR)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 6: Đo tốc độ, Bài 14: Rơi tự do, Bài 30: Va chạm)
 * - Cổng đực RAIL_CLAMP: Bắt dính vào cột thẳng đứng hoặc máng nghiêng.
 * - Tự động đổi màu đèn LED xanh/đỏ và phát tín hiệu onTrigger khi có vật chắn cổng.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { PhotogateView } from '../sensors/PhotogateView.ts';
import { SensorComponent } from '../../core/models/components/SensorComponent.ts';
import { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';
import type { StandardToolId, ISensorDevice } from '../../core/contracts/IApparatus.ts';

export class PhotogateApparatus extends BaseApparatus implements ISensorDevice {
  public readonly toolId: StandardToolId = 'PHOTOGATE_SENSOR';
  public readonly name = 'Cổng Quang Điện';
  public readonly viewNode: PhotogateView;
  public isTriggered = false;
  public sampleRate = 1000;

  private sensorComp: SensorComponent;

  constructor(id?: string, label = 'Cổng quang') {
    super(id);
    this.sensorComp = new SensorComponent();
    const kinematic = new KinematicComponent();

    this.model.addComponent(this.sensorComp);
    this.model.addComponent(kinematic);

    this.viewNode = new PhotogateView(this.model, { label, isDraggable: false });

    this.snapPorts.push({
      id: `${this.id}_clamp`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'RAIL_CLAMP',
    });
  }

  public onTrigger(_time: number, _value: number): void {
    this.isTriggered = true;
    this.sensorComp.isTriggeredProperty.value = true;
  }
}
