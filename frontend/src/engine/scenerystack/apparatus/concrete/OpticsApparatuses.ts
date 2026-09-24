/**
 * CÁC APPARATUS QUANG HỌC & ÂM HỌC (OOP CONTRACTS)
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import {
  LaserView,
  YoungSlitView,
  FringeScreenView,
  GlassRefractorView,
  ResonanceTubeView,
} from '../optics/OpticsViews.ts';
import type { StandardToolId, IMeasuringTool } from '../../core/contracts/IApparatus.ts';

export class LaserApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'LASER_SOURCE_RGB';
  public readonly name = 'Nguồn Phát Laser';
  public readonly viewNode: LaserView;
  public wavelengthNm = 650;

  constructor(id?: string, lambdaNm = 650) {
    super(id);
    this.wavelengthNm = lambdaNm;
    this.viewNode = new LaserView(lambdaNm);
  }

  public setWavelength(lambda: number): void {
    this.wavelengthNm = lambda;
    this.viewNode.setWavelength(lambda);
  }
}

export class YoungSlitApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'YOUNG_DOUBLE_SLIT';
  public readonly name = 'Khe Kép Y-âng';
  public readonly viewNode: YoungSlitView;
  public slitDistanceMm = 0.5;

  constructor(id?: string, aMm = 0.5) {
    super(id);
    this.slitDistanceMm = aMm;
    this.viewNode = new YoungSlitView(aMm);
  }

  public setSlitDistance(a: number): void {
    this.slitDistanceMm = a;
    this.viewNode.setSlitDistance(a);
  }
}

export class FringeScreenApparatus extends BaseApparatus implements IMeasuringTool {
  public readonly toolId: StandardToolId = 'FRINGE_SCREEN';
  public readonly name = 'Màn Hứng Vân & Thước Kẹp';
  public readonly viewNode: FringeScreenView;
  public readonly unit = 'mm';
  public readonly resolution = 0.01;
  public readonly maxRange = 50.0;
  public measuredValue = 0;

  constructor(id?: string) {
    super(id);
    this.viewNode = new FringeScreenView();
  }

  public readCurrentValue(): number {
    return this.measuredValue;
  }

  public setCaliperPosition(xMm: number): void {
    this.measuredValue = xMm;
    this.viewNode.setCaliperX(xMm);
  }
}

export class GlassRefractorApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'GLASS_HALF_CYLINDER';
  public readonly name = 'Bán Trụ Thủy Tinh Khúc Xạ';
  public readonly viewNode: GlassRefractorView;
  public refractiveIndex = 1.5;

  constructor(id?: string, n = 1.5) {
    super(id);
    this.refractiveIndex = n;
    this.viewNode = new GlassRefractorView();
  }

  public setAngle(deg: number): void {
    this.viewNode.setRays(deg, this.refractiveIndex);
  }
}

export class ResonanceTubeApparatus extends BaseApparatus {
  public readonly toolId: StandardToolId = 'RESONANCE_TUBE';
  public readonly name = 'Ống Cộng Hưởng Âm';
  public readonly viewNode: ResonanceTubeView;
  public airColumnLengthCm = 34.0;

  constructor(id?: string) {
    super(id);
    this.viewNode = new ResonanceTubeView();
  }

  public setAirLength(lenCm: number): void {
    this.airColumnLengthCm = lenCm;
    this.viewNode.setWaterLevel(lenCm);
  }
}
