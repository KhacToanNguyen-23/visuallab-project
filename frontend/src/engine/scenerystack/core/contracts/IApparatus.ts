/**
 * KIẾN TRÚC CONTRACTS & INTERFACES THIẾT BỊ VẬT LÝ (THEO DACTA.MD)
 * 
 * Chuẩn hóa 30 ToolID của SGK Vật Lý GDPT 2018 thành các Interface phân cấp,
 * cho phép các linh kiện tự công bố đặc tính vật lý (Khối lượng, Độ đàn hồi, Ma sát, Cảm biến,...)
 * và ma trận bắt dính (SnapPort) độc lập mà không cần hard-code.
 */

import { Node } from 'scenerystack/scenery';
import type { SnapPort } from '../../interaction/SnapEngine.ts';
import type { LabDeviceModel } from '../models/LabDeviceModel.ts';

/**
 * Danh mục chuẩn hóa 30 Mã Dụng Cụ UI (Tool IDs) theo bảng đặc tả DacTa.md
 */
export type StandardToolId =
  | 'PHOTOGATE_SENSOR'      // Cổng quang điện hồng ngoại
  | 'DIGITAL_TIMER'         // Đồng hồ đo thời gian hiện số
  | 'INCLINED_TRACK'        // Máng nghiêng định hướng
  | 'STEEL_BALL'            // Bi thép rơi tự do / lăn máng
  | 'VERTICAL_STAND'        // Giá đỡ thẳng đứng kèm thước
  | 'ELECTROMAGNET'         // Nam châm điện giữ/thả vật
  | 'SPRING_BALANCE'        // Lực kế lò xo
  | 'WOODEN_BLOCK'          // Khối gỗ thí nghiệm ma sát
  | 'HELICAL_SPRING'        // Lò xo xoắn đàn hồi
  | 'MASS_WEIGHT_SET'       // Bộ quả cân gia tải 50g-200g
  | 'CART_FLAG'             // Xe trượt có cờ chắn sáng 10mm
  | 'DC_POWER_SUPPLY'       // Nguồn Pin điện hóa 1.5V DC
  | 'VOLTMETER_DC'          // Vôn kế DC đo hiệu điện thế
  | 'AMMETER_DC'            // Ampe kế DC đo cường độ dòng điện
  | 'RHEOSTAT_VARIABLE'     // Biến trở con chạy
  | 'CIRCUIT_SWITCH'        // Khóa K (Công tắc)
  | 'LASER_SOURCE_RGB'      // Nguồn phát Laser chọn bước sóng
  | 'YOUNG_DOUBLE_SLIT'     // Khe kép Y-âng giao thoa
  | 'FRINGE_SCREEN'         // Màn hứng vân giao thoa
  | 'CALIPER_CROSSHAIR'     // Thước kẹp đo khoảng vân
  | 'RESONANCE_TUBE'        // Ống cộng hưởng sóng âm
  | 'AUDIO_GENERATOR'       // Máy phát tần số âm kèm loa
  | 'GLASS_HALF_CYLINDER'   // Bán trụ thủy tinh khúc xạ
  | 'CALORIMETER_CUP'       // Bình nhiệt lượng kế
  | 'HEATING_COIL'          // Dây điện trở đun nước
  | 'DIGITAL_THERMOMETER'   // Nhiệt kế điện tử
  | 'GAS_CYLINDER_PISTON'   // Xy-lanh nén khí pít-tông
  | 'PRESSURE_GAUGE'        // Áp kế đo áp suất khí
  | 'BAR_MAGNET'            // Nam châm vĩnh cửu
  | 'INDUCTION_COIL'        // Cuộn dây cảm ứng điện từ
  | 'GALVANOMETER_G';       // Điện kế G

/**
 * Interface cơ sở cho mọi dụng cụ/thiết bị thí nghiệm trong VisualLab
 */
export interface IApparatus {
  readonly id: string;
  readonly toolId: StandardToolId;
  readonly name: string;
  readonly viewNode: Node;
  readonly model: LabDeviceModel;
  readonly snapPorts: SnapPort[];
  connectedHostId?: string;

  /** Cập nhật vi phân chuyển động vật lý mỗi frame dt */
  updatePhysics(dt: number): void;

  /** Hook được gọi khi thiết bị hút dính thành công vào thiết bị khác */
  onSnapped?(target: IApparatus, myPort: SnapPort, targetPort: SnapPort): void;

  /** Hook được gọi khi thiết bị bị tháo rời */
  onUnsnapped?(): void;

  /** Dọn dẹp bộ nhớ/sự kiện */
  dispose?(): void;
}

/**
 * Interface cho nhóm dụng cụ đo lường (Thước, Lực kế, Nhiệt kế, Áp kế,...)
 */
export interface IMeasuringTool extends IApparatus {
  readonly unit: string;        // Đơn vị đo: 'cm', 'N', '°C', 's', 'bar'
  readonly resolution: number;  // Độ chia nhỏ nhất (ĐCNN)
  readonly maxRange: number;    // Giới hạn đo (GHĐ)
  readCurrentValue(): number;   // Trả về số đo tức thời
}

/**
 * Interface cho nhóm cảm biến xuất tín hiệu (Cổng quang, Cảm biến lực,...)
 */
export interface ISensorDevice extends IApparatus {
  isTriggered: boolean;
  sampleRate: number;
  onTrigger(time: number, value: number): void;
}

/**
 * Interface cho vật thể có khối lượng và động học Newton (Bi, Xe, Khối gỗ)
 */
export interface IPhysicsRigidBody extends IApparatus {
  mass: number;
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
  frictionCoeff: number;
}

/**
 * Interface cho vật thể có tính đàn hồi theo định luật Hooke (Lò xo)
 */
export interface IElasticBody extends IApparatus {
  stiffnessK: number;       // Độ cứng k (N/m)
  naturalLengthL0: number;  // Chiều dài tự nhiên l0 (m)
  currentLength: number;    // Chiều dài tức thời l (m)
}

/**
 * Interface cho giá đỡ, ray trượt dẫn hướng (Cột thẳng, Máng nghiêng)
 */
export interface IMechanicalBase extends IApparatus {
  trackLength: number;
  inclinationAngleDeg: number;
}
