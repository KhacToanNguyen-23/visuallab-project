/**
 * ĐỒNG HỒ ĐO THỜI GIAN HIỆN SỐ (DIGITAL_TIMER APPARATUS)
 * 
 * Chuẩn hóa OOP theo DacTa.md (Bài 6: Đo tốc độ, Bài 14: Rơi tự do, Bài 30: Va chạm)
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { DigitalTimerView } from '../sensors/DigitalTimerView.ts';
import type { StandardToolId, IMeasuringTool } from '../../core/contracts/IApparatus.ts';

export class DigitalTimerApparatus extends BaseApparatus implements IMeasuringTool {
  public readonly toolId: StandardToolId = 'DIGITAL_TIMER';
  public readonly name = 'Đồng Hồ Đo Thời Gian Hiện Số';
  public readonly viewNode: DigitalTimerView;

  public readonly unit = 's';
  public readonly resolution = 0.001;
  public readonly maxRange = 99.999;
  public measuredValue = 0.000;

  constructor(id?: string) {
    super(id);
    this.viewNode = new DigitalTimerView({
      onReset: () => {
        this.measuredValue = 0;
      },
    });

    // 3 Cổng nhận tín hiệu
    this.snapPorts.push({
      id: `${this.id}_jack_magnet`,
      entityId: this.id,
      hostNode: this.viewNode.magnetJack,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'CIRCUIT_TERMINAL',
    });

    this.snapPorts.push({
      id: `${this.id}_jack_gate_a`,
      entityId: this.id,
      hostNode: this.viewNode.gateAJack,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'CIRCUIT_TERMINAL',
    });

    this.snapPorts.push({
      id: `${this.id}_jack_gate_b`,
      entityId: this.id,
      hostNode: this.viewNode.gateBJack,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'CIRCUIT_TERMINAL',
    });
  }

  public readCurrentValue(): number {
    return this.measuredValue;
  }

  public setRecordedTime(t: number): void {
    this.measuredValue = t;
    this.viewNode.setTime(t);
  }
}
