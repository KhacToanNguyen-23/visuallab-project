import { Vector2 } from 'scenerystack/dot';
import { BaseInstrument } from './BaseInstrument';
import type { IInstrumentConfig } from '../types';

/**
 * Lớp trừu tượng cho các dụng cụ Âm học & Sóng cơ (Ống cộng hưởng, Máy phát âm, Âm thoa).
 */
export abstract class AcousticInstrument extends BaseInstrument {
  constructor(
    id: string,
    toolId: string,
    name: string,
    initialConfig: IInstrumentConfig,
    initialPosition: Vector2 = new Vector2(0, 0)
  ) {
    super(id, toolId, name, 'ACOUSTICS', initialConfig, initialPosition);
  }

  /**
   * Tần số f (Hz) lấy động từ config
   */
  public get frequency(): number {
    try {
      return this.getParam<number>('frequency');
    } catch {
      return 440; // Nốt La A4
    }
  }

  /**
   * Biên độ âm thanh (0 -> 1.0) lấy động từ config
   */
  public get amplitude(): number {
    try {
      return this.getParam<number>('amplitude');
    } catch {
      return 0.5;
    }
  }

  public abstract playSound(): void;
  public abstract stopSound(): void;
}
