/**
 * CÁC APPARATUS MẠCH ĐIỆN VÀ CẢM ỨNG TỪ (OOP CONTRACTS)
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import {
  PowerSupplyView,
  MeterView,
  RheostatView,
  SwitchView,
  BarMagnetView,
  InductionCoilView,
} from '../circuits/CircuitViews.ts';
import type { StandardToolId, IMeasuringTool } from '../../core/contracts/IApparatus.ts';

export class PowerSupplyApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'DC_POWER_SUPPLY';
  public readonly name = 'Nguồn Pin Điện Hóa DC';
  public readonly viewNode: PowerSupplyView;

  public emf = 1.5; // Suất điện động E = 1.5V
  public internalR = 1.2; // Điện trở trong r = 1.2Ω

  constructor(id?: string, emf = 1.5, internalR = 1.2) {
    super(id);
    this.emf = emf;
    this.internalR = internalR;
    this.viewNode = new PowerSupplyView(emf);
  }
}

export class MultimeterApparatus extends BaseApparatus implements IMeasuringTool {
  public readonly toolId: StandardToolId;
  public readonly name: string;
  public readonly viewNode: MeterView;
  public readonly unit: string;
  public readonly resolution: number;
  public readonly maxRange: number;
  public measuredValue = 0;

  constructor(id?: string, mode: 'VOLTMETER' | 'AMMETER' | 'GALVANOMETER' = 'VOLTMETER') {
    super(id);
    if (mode === 'VOLTMETER') {
      this.toolId = 'VOLTMETER_DC';
      this.name = 'Vôn Kế DC';
      this.unit = 'V';
      this.resolution = 0.01;
      this.maxRange = 3.0;
    } else if (mode === 'AMMETER') {
      this.toolId = 'AMMETER_DC';
      this.name = 'Ampe Kế DC';
      this.unit = 'mA';
      this.resolution = 0.1;
      this.maxRange = 500.0;
    } else {
      this.toolId = 'GALVANOMETER_G';
      this.name = 'Điện Kế G Cảm Ứng';
      this.unit = 'μA';
      this.resolution = 0.1;
      this.maxRange = 50.0;
    }

    this.viewNode = new MeterView(mode);
  }

  public readCurrentValue(): number {
    return this.measuredValue;
  }

  public setValue(val: number): void {
    this.measuredValue = val;
    this.viewNode.setValue(val, this.unit);
  }
}

export class RheostatApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'RHEOSTAT_VARIABLE';
  public readonly name = 'Biến Trở Con Chạy';
  public readonly viewNode: RheostatView;
  public maxResistance = 100; // 100Ω
  public currentResistance = 50; // 50Ω

  constructor(id?: string, maxR = 100) {
    super(id);
    this.maxResistance = maxR;
    this.viewNode = new RheostatView(maxR);
  }

  public setResistance(r: number): void {
    this.currentResistance = Math.max(0, Math.min(this.maxResistance, r));
    this.viewNode.setSliderRatio(this.currentResistance / this.maxResistance, this.currentResistance);
  }
}

export class SwitchApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'CIRCUIT_SWITCH';
  public readonly name = 'Khóa K (Công Tắc)';
  public readonly viewNode: SwitchView;
  public isClosed = false;

  constructor(id?: string) {
    super(id);
    this.viewNode = new SwitchView();
  }

  public toggle(): boolean {
    this.isClosed = !this.isClosed;
    this.viewNode.setClosed(this.isClosed);
    return this.isClosed;
  }
}

export class MagnetApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'BAR_MAGNET';
  public readonly name = 'Nam Châm Vĩnh Cửu';
  public readonly viewNode: BarMagnetView;

  constructor(id?: string) {
    super(id);
    this.viewNode = new BarMagnetView();
  }
}

export class InductionCoilApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'INDUCTION_COIL';
  public readonly name = 'Cuộn Dây Cảm Ứng';
  public readonly viewNode: InductionCoilView;

  constructor(id?: string) {
    super(id);
    this.viewNode = new InductionCoilView();
  }
}
