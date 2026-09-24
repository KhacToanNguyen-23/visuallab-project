/**
 * CÁC APPARATUS NHIỆT HỌC & CHẤT KHÍ (OOP CONTRACTS)
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import {
  CalorimeterView,
  GasPistonView,
  PressureGaugeView,
} from '../thermal/ThermalViews.ts';
import type { StandardToolId, IMeasuringTool } from '../../core/contracts/IApparatus.ts';

export class CalorimeterApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'CALORIMETER_CUP';
  public readonly name = 'Bình Nhiệt Lượng Kế';
  public readonly viewNode: CalorimeterView;
  public temperatureC = 25.0;

  constructor(id?: string, initTemp = 25.0) {
    super(id);
    this.temperatureC = initTemp;
    this.viewNode = new CalorimeterView();
  }

  public setTemperature(t: number): void {
    this.temperatureC = t;
    this.viewNode.setTemperature(t);
  }
}

export class GasPistonApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'GAS_CYLINDER_PISTON';
  public readonly name = 'Xy-Lanh Khí Nén Pít-Tông';
  public readonly viewNode: GasPistonView;
  public volumeCm3 = 60.0;

  constructor(id?: string, initV = 60.0) {
    super(id);
    this.volumeCm3 = initV;
    this.viewNode = new GasPistonView();
  }

  public setVolume(v: number): void {
    this.volumeCm3 = v;
    this.viewNode.setVolume(v);
  }
}

export class PressureGaugeApparatus extends BaseApparatus implements IMeasuringTool {
  public readonly toolId: StandardToolId = 'PRESSURE_GAUGE';
  public readonly name = 'Áp Kế Đo Áp Suất';
  public readonly viewNode: PressureGaugeView;
  public readonly unit = 'bar';
  public readonly resolution = 0.01;
  public readonly maxRange = 3.0;
  public measuredValue = 1.0;

  constructor(id?: string) {
    super(id);
    this.viewNode = new PressureGaugeView();
  }

  public readCurrentValue(): number {
    return this.measuredValue;
  }

  public setPressure(p: number): void {
    this.measuredValue = p;
    this.viewNode.setPressure(p);
  }
}
