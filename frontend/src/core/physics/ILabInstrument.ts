import { Vector2 } from 'scenerystack/dot';
import { Node } from 'scenerystack/scenery';
import type { IInstrumentConfig, InstrumentCategory } from './types';

/**
 * Interface chung gốc cho toàn bộ dụng cụ thí nghiệm trong VisualLab.
 * Mọi dụng cụ đều phải implement ILabInstrument hoặc kế thừa từ BaseInstrument.
 */
export interface ILabInstrument {
  readonly id: string;                     // Unique Instance UUID
  readonly toolId: string;                 // Mã dụng cụ chuẩn SGK (VD: 'VOLTMETER_DC')
  readonly name: string;                   // Tên hiển thị tiếng Việt
  readonly category: InstrumentCategory;   // Phân loại bộ môn
  readonly config: IInstrumentConfig;      // Cấu hình tham số vật lý động (KHÔNG HARDCODE)
  
  position: Vector2;                       // Vị trí toạ độ không gian Model/World (SI đơn vị)
  rotation: number;                        // Góc xoay (radians)
  isInteractive: boolean;                  // Cho phép kéo thả / tương tác
  isSelected: boolean;                     // Trạng thái đang được chọn/focus
  
  // Dynamic Physics Parameter Access
  getParam<T = number>(paramId: string): T;
  setParam<T = number>(paramId: string, value: T): void;
  getAllParams(): Record<string, any>;
  
  // Lifecycle & Render Methods
  render(): Node;                          // Trả về SceneryStack Node đại diện
  update(dt: number): void;                // Cập nhật trạng thái vật lý theo bước thời gian dt
  onDragStart(pos: Vector2): void;         // Bắt đầu kéo
  onDrag(pos: Vector2): void;              // Đang kéo
  onDragEnd(): void;                       // Thả dụng cụ
  
  // Serialization & Memory Safety
  serialize(): Record<string, any>;        // Đóng gói trạng thái ra JSON lưu DB
  deserialize(data: Record<string, any>): void; // Khôi phục trạng thái từ JSON
  dispose(): void;                         // Dọn dẹp bộ nhớ, event listeners, sub-nodes
}
