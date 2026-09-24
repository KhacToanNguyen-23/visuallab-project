/**
 * APPARATUS REGISTRY (SELF-REGISTERING FACTORY PATTERN)
 * 
 * Thay thế hoàn toàn khối switch-case khổng lồ bằng Registry Pattern:
 * - Tuân thủ triệt để nguyên lý Open/Closed (OCP): Thêm linh kiện mới chỉ cần gọi `ApparatusRegistry.register(...)`
 * - Tra cứu và khởi tạo linh kiện tức thì O(1) qua Map
 * - Hỗ trợ dynamic plugins và lazy loading các bộ thí nghiệm chuyên sâu
 */

import type { BaseApparatus } from './BaseApparatus.ts';

// Import concrete apparatuses for default catalog registration
import { StandApparatus } from '../concrete/StandApparatus.ts';
import { InclinedPlaneApparatus } from '../concrete/InclinedPlaneApparatus.ts';
import { SpringApparatus } from '../concrete/SpringApparatus.ts';
import { WeightApparatus } from '../concrete/WeightApparatus.ts';
import { PhotogateApparatus } from '../concrete/PhotogateApparatus.ts';
import { CartApparatus } from '../concrete/CartApparatus.ts';
import { BallApparatus } from '../concrete/BallApparatus.ts';
import { FrictionBlockApparatus } from '../concrete/FrictionBlockApparatus.ts';
import { SpringBalanceApparatus } from '../concrete/SpringBalanceApparatus.ts';
import { AirTrackApparatus } from '../concrete/AirTrackApparatus.ts';
import { PendulumApparatus } from '../concrete/PendulumApparatus.ts';
import {
  PowerSupplyApparatus,
  MultimeterApparatus,
  RheostatApparatus,
  SwitchApparatus,
  MagnetApparatus,
  InductionCoilApparatus,
} from '../concrete/CircuitApparatuses.ts';
import {
  LaserApparatus,
  YoungSlitApparatus,
  FringeScreenApparatus,
  GlassRefractorApparatus,
  ResonanceTubeApparatus,
} from '../concrete/OpticsApparatuses.ts';
import {
  CalorimeterApparatus,
  GasPistonApparatus,
  PressureGaugeApparatus,
} from '../concrete/ThermalApparatuses.ts';
import { ElectromagnetApparatus } from '../concrete/ElectromagnetApparatus.ts';
import { FrictionTableApparatus } from '../concrete/FrictionTableApparatus.ts';
import { DigitalTimerApparatus } from '../concrete/DigitalTimerApparatus.ts';

export type ApparatusCreator = (id?: string) => BaseApparatus;

export class ApparatusRegistry {
  private static readonly registry = new Map<string, ApparatusCreator>();

  /**
   * Đăng ký một Creator function cho loại thiết bị cụ thể (OCP Compliance)
   */
  public static register(type: string, creator: ApparatusCreator): void {
    this.registry.set(type, creator);
  }

  /**
   * Khởi tạo thể hiện mới của linh kiện dựa trên Registry Map O(1)
   */
  public static create(type: string, id?: string): BaseApparatus {
    const creator = this.registry.get(type);
    if (!creator) {
      console.warn(`[ApparatusRegistry] Unknown device type "${type}", falling back to BallApparatus`);
      return new BallApparatus(id);
    }
    return creator(id);
  }

  /**
   * Kiểm tra xem một loại thiết bị đã được đăng ký hay chưa
   */
  public static has(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * Lấy danh sách tất cả các loại thiết bị đã đăng ký
   */
  public static getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }
}

// Khởi tạo đăng ký danh mục mặc định (Default Catalog Initializer)
ApparatusRegistry.register('STAND', (id) => new StandApparatus(id));
ApparatusRegistry.register('INCLINED_PLANE', (id) => new InclinedPlaneApparatus(id));
ApparatusRegistry.register('SPRING', (id) => new SpringApparatus(id));
ApparatusRegistry.register('WEIGHT', (id) => new WeightApparatus(id));
ApparatusRegistry.register('PHOTOGATE', (id) => new PhotogateApparatus(id));
ApparatusRegistry.register('CART', (id) => new CartApparatus(id));
ApparatusRegistry.register('BALL', (id) => new BallApparatus(id));
ApparatusRegistry.register('FRICTION_BLOCK', (id) => new FrictionBlockApparatus(id));
ApparatusRegistry.register('SPRING_BALANCE', (id) => new SpringBalanceApparatus(id));
ApparatusRegistry.register('AIR_TRACK', (id) => new AirTrackApparatus(id));
ApparatusRegistry.register('PENDULUM', (id) => new PendulumApparatus(id));
ApparatusRegistry.register('POWER_SUPPLY', (id) => new PowerSupplyApparatus(id));
ApparatusRegistry.register('VOLTMETER', (id) => new MultimeterApparatus(id, 'VOLTMETER'));
ApparatusRegistry.register('AMMETER', (id) => new MultimeterApparatus(id, 'AMMETER'));
ApparatusRegistry.register('GALVANOMETER', (id) => new MultimeterApparatus(id, 'GALVANOMETER'));
ApparatusRegistry.register('RHEOSTAT', (id) => new RheostatApparatus(id));
ApparatusRegistry.register('SWITCH', (id) => new SwitchApparatus(id));
ApparatusRegistry.register('MAGNET', (id) => new MagnetApparatus(id));
ApparatusRegistry.register('INDUCTION_COIL', (id) => new InductionCoilApparatus(id));
ApparatusRegistry.register('LASER', (id) => new LaserApparatus(id));
ApparatusRegistry.register('YOUNG_SLIT', (id) => new YoungSlitApparatus(id));
ApparatusRegistry.register('FRINGE_SCREEN', (id) => new FringeScreenApparatus(id));
ApparatusRegistry.register('REFRACTOR', (id) => new GlassRefractorApparatus(id));
ApparatusRegistry.register('RESONANCE_TUBE', (id) => new ResonanceTubeApparatus(id));
ApparatusRegistry.register('CALORIMETER', (id) => new CalorimeterApparatus(id));
ApparatusRegistry.register('GAS_PISTON', (id) => new GasPistonApparatus(id));
ApparatusRegistry.register('PRESSURE_GAUGE', (id) => new PressureGaugeApparatus(id));
ApparatusRegistry.register('ELECTROMAGNET', (id) => new ElectromagnetApparatus(id));
ApparatusRegistry.register('FRICTION_TABLE', (id) => new FrictionTableApparatus(id));
ApparatusRegistry.register('DIGITAL_TIMER', (id) => new DigitalTimerApparatus(id));

// Alias backward compatibility
export const ApparatusFactory = ApparatusRegistry;
