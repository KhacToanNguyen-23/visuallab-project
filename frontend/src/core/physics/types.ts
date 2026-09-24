import { Vector2 } from 'scenerystack/dot';

export type InstrumentCategory = 
  | 'KINEMATICS' 
  | 'DYNAMICS' 
  | 'ELECTRICITY' 
  | 'OPTICS' 
  | 'THERMODYNAMICS' 
  | 'ACOUSTICS';

/**
 * Parameter Descriptor: Định nghĩa Schema cho các thuộc tính vật lý.
 * TUYỆT ĐỐI KHÔNG HARDCODE các giá trị vật lý. Mọi giá trị đều có min, max, step, defaultValue.
 */
export interface IPhysicsParamDescriptor<T = number> {
  readonly id: string;           // Tên định danh (VD: 'mass', 'springConstant', 'internalResistance')
  readonly name: string;         // Tên hiển thị tiếng Việt (VD: 'Khối lượng bi', 'Độ cứng lò xo')
  readonly symbol: string;       // Ký hiệu toán học (VD: 'm', 'k', 'R')
  readonly unit: string;         // Đơn vị đo SI chuẩn (VD: 'kg', 'N/m', 'V', 'Ohm')
  readonly min: number;          // Giới hạn dưới
  readonly max: number;          // Giới hạn trên
  readonly step: number;         // Bước nhảy slider/input
  readonly defaultValue: T;      // Giá trị mặc định
  value: T;                      // Giá trị hiện tại
}

/**
 * Cấu hình khởi tạo dụng cụ động (Data-driven Configuration)
 */
export interface IInstrumentConfig {
  readonly toolId: string;
  name: string;
  category: InstrumentCategory;
  params: Record<string, IPhysicsParamDescriptor<any>>;
  customMetadata?: Record<string, any>;
}

/**
 * Cổng cực nối dây điện (Circuit Terminals)
 */
export interface ITerminal {
  readonly id: string;
  readonly name: string;
  readonly type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  localOffset: Vector2;
  connectedTo?: {
    instrumentId: string;
    terminalId: string;
  };
}

/**
 * Tia sáng quang học (Optical Ray)
 */
export interface IOpticalRay {
  origin: Vector2;
  direction: Vector2;
  wavelength: number; // nm (VD: 632.8 cho Laser đỏ)
  intensity: number;  // 0 -> 1.0
}
