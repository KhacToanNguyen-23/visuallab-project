import { Vector2 } from 'scenerystack/dot';
import { BaseInstrument } from './BaseInstrument';
import type { IInstrumentConfig, ITerminal } from '../types';

/**
 * Lớp trừu tượng cho các thiết bị mạch điện (Nguồn pin, Điện trở, Vôn kế, Ampe kế, Biến trở, Khóa K).
 */
export abstract class CircuitInstrument extends BaseInstrument {
  public terminals: ITerminal[] = [];
  public voltageDrop: number = 0; // Vôn (V)
  public current: number = 0;     // Ampe (A)

  constructor(
    id: string,
    toolId: string,
    name: string,
    initialConfig: IInstrumentConfig,
    initialPosition: Vector2 = new Vector2(0, 0),
    terminals: ITerminal[] = []
  ) {
    super(id, toolId, name, 'ELECTRICITY', initialConfig, initialPosition);
    this.terminals = terminals;
  }

  /**
   * Điện trở tương đương của dụng cụ (Ohm).
   * Lấy động từ cấu hình tham số chứ không hardcode.
   */
  public get resistance(): number {
    try {
      return this.getParam<number>('resistance');
    } catch {
      return 0;
    }
  }

  /**
   * Tính toán phản ứng điện thế và dòng điện khi đóng mạch
   */
  public abstract calculateCircuitState(sourceVoltage: number, totalResistance: number): void;

  public override serialize(): Record<string, any> {
    const base = super.serialize();
    return {
      ...base,
      voltageDrop: this.voltageDrop,
      current: this.current,
      terminals: this.terminals.map(t => ({
        id: t.id,
        name: t.name,
        type: t.type,
        connectedTo: t.connectedTo,
      })),
    };
  }
}
