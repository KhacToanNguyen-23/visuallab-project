import { Vector2 } from 'scenerystack/dot';
import { BaseInstrument } from './BaseInstrument';
import type { IInstrumentConfig } from '../types';

/**
 * Lớp trừu tượng cho các dụng cụ Nhiệt học & Thủy khí (Nhiệt lượng kế, Dây nung, Piston xilanh, Áp kế).
 */
export abstract class ThermalInstrument extends BaseInstrument {
  public temperature: number = 293.15; // Kelvin (20 độ C mặc định)

  constructor(
    id: string,
    toolId: string,
    name: string,
    initialConfig: IInstrumentConfig,
    initialPosition: Vector2 = new Vector2(0, 0)
  ) {
    super(id, toolId, name, 'THERMODYNAMICS', initialConfig, initialPosition);
  }

  /**
   * Nhiệt dung riêng c (J/kg.K) lấy động từ config
   */
  public get specificHeat(): number {
    try {
      return this.getParam<number>('specificHeat');
    } catch {
      return 4200; // Mặc định nước
    }
  }

  /**
   * Nhiệt độ Celsius hiển thị
   */
  public get temperatureCelsius(): number {
    return this.temperature - 273.15;
  }

  public abstract transferHeat(deltaJoules: number): void;
}
