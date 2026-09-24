import { Vector2 } from 'scenerystack/dot';
import { BaseInstrument } from './BaseInstrument';
import type { IInstrumentConfig, IOpticalRay } from '../types';

/**
 * Lớp trừu tượng cho các dụng cụ Quang học (Laser RGB, Khe Y-âng, Bán trụ thủy tinh, Màn hứng vân).
 */
export abstract class OpticalInstrument extends BaseInstrument {
  constructor(
    id: string,
    toolId: string,
    name: string,
    initialConfig: IInstrumentConfig,
    initialPosition: Vector2 = new Vector2(0, 0)
  ) {
    super(id, toolId, name, 'OPTICS', initialConfig, initialPosition);
  }

  /**
   * Chiết suất n (lấy động từ config)
   */
  public get refractiveIndex(): number {
    try {
      return this.getParam<number>('refractiveIndex');
    } catch {
      return 1.0;
    }
  }

  /**
   * Phương thức dò tia sáng tương tác qua dụng cụ quang học
   */
  public abstract traceRay(incomingRay: IOpticalRay): IOpticalRay[];
}
