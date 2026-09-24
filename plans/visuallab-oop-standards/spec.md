# Đặc Tả Kỹ Thuật: Chuẩn Kiến Trúc OOP, PhET Engine, Zustand & Lưu Trữ JSONB (VisualLab)

**Tài liệu chuẩn hóa dành cho Toàn bộ Lập trình viên & AI Agents trong dự án VisualLab**

---

## 1. Mục Đích & Phạm Vi Áp Dụng (Scope & Purpose)
Quy chuẩn này định nghĩa các nguyên tắc kiến trúc hướng đối tượng (OOP), cấu trúc dữ liệu, thuật toán mô phỏng vật lý và lưu trữ dữ liệu bắt buộc áp dụng khi xây dựng hoặc cập nhật bất kỳ bài thí nghiệm ảo nào trong VisualLab.

---

## 2. Chuẩn Thiết Kế Hướng Đối Tượng & Không Hardcode Tính Chất Vật Lý (OOP & Data-Driven Physics)

### 2.0. 🚫 Quy Định Nghiêm Ngặt: Không Hardcode Thuộc Tính Vật Lý & Vật Thể (No-Hardcoded Parameters)
- **Cấm Tuyệt Đối Hardcode**: Không fix cứng các giá trị như khối lượng $m$, điện trở $R$, suất điện động $\mathcal{E}$, độ cứng lò xo $k$, chiết suất $n$, v.v. trực tiếp trong code logic hoặc giao diện.
- **Data-Driven Configuration & Parameter Schema**:
  Mọi thông số vật lý phải được mô tả thông qua Schema tham số:
  ```typescript
  export interface IPhysicsParamDescriptor<T = number> {
    readonly id: string;           // Tên biến (VD: 'springConstant', 'mass')
    readonly name: string;         // Tên hiển thị tiếng Việt (VD: 'Độ cứng lò xo')
    readonly symbol: string;       // Ký hiệu toán học (VD: 'k')
    readonly unit: string;         // Đơn vị SI (VD: 'N/m', 'kg', 'V', 'Ohm')
    readonly min: number;          // Giới hạn dưới
    readonly max: number;          // Giới hạn trên
    readonly step: number;         // Bước nhảy slider/input
    readonly defaultValue: T;      // Giá trị mặc định
    value: T;                      // Giá trị hiện tại (hoặc Property<T>)
  }

  export interface IInstrumentConfig {
    readonly toolId: string;
    name: string;
    params: Record<string, IPhysicsParamDescriptor<any>>;
    customMetadata?: Record<string, any>;
  }
  ```
- **Factory & Registry Pattern**: Dụng cụ được khởi tạo động qua `InstrumentFactory.create(toolId, customConfig)` cho phép nạp từ Database JSONB hoặc do người dùng tuỳ chỉnh từ UI slider.

### 2.1. Base Instrument Interface (`ILabInstrument`)

```typescript
import { Vector2 } from 'scenerystack/dot';
import { Node } from 'scenerystack/scenery';

export type InstrumentCategory = 'KINEMATICS' | 'DYNAMICS' | 'ELECTRICITY' | 'OPTICS' | 'THERMODYNAMICS' | 'ACOUSTICS';

export interface ILabInstrument {
  readonly id: string;                     // Unique UUID hoặc ID instance trên bàn
  readonly toolId: string;                 // Mã dụng cụ chuẩn (VD: 'VOLTMETER_DC')
  readonly name: string;                   // Tên tiếng Việt hiển thị
  readonly category: InstrumentCategory;   // Phân loại bộ môn
  readonly config: IInstrumentConfig;      // Cấu hình tham số vật lý động (KHÔNG HARDCODE)
  position: Vector2;                       // Tọa độ hiện tại trên bàn thí nghiệm (Model Space)
  rotation: number;                        // Góc xoay (radians)
  isInteractive: boolean;                  // Cho phép kéo thả / tương tác không
  isSelected: boolean;                     // Đang được focus/chọn không
  
  // Dynamic Parameter API
  getParam<T>(paramId: string): T;
  setParam<T>(paramId: string, value: T): void;
  
  // Lifecycle & Render Methods
  render(): Node;                          // Trả về SceneryStack Node đại diện
  update(dt: number): void;                // Cập nhật trạng thái vật lý theo bước thời gian dt
  onDragStart(pos: Vector2): void;         // Bắt đầu kéo
  onDrag(pos: Vector2): void;              // Đang kéo
  onDragEnd(): void;                       // Thả dụng cụ (snap grid/dock)
  
  // Serialization & Memory Management
  serialize(): Record<string, any>;        // Đóng gói trạng thái ra JSON lưu trữ
  deserialize(data: Record<string, any>): void; // Khôi phục trạng thái từ JSON
  dispose(): void;                         // Dọn dẹp bộ nhớ, event listeners, canvas/audio node
}
```

### 2.2. Phân Nhánh Interface & Class Cụ Thể (Concrete Sub-interfaces)

#### A. Dụng cụ Mạch Điện (`ICircuitInstrument`)
```typescript
export interface ITerminal {
  id: string;
  name: string;
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  localOffset: Vector2;
  connectedTo?: { instrumentId: string; terminalId: string };
}

export interface ICircuitInstrument extends ILabInstrument {
  category: 'ELECTRICITY';
  terminals: ITerminal[];
  internalResistance: number; // Ohm
  voltageDrop: number;        // Volt
  current: number;            // Ampere
  calculateCircuitState(sourceVoltage: number): void;
}
```

#### B. Dụng cụ Cơ học / Động lực học (`IMechanicalInstrument`)
```typescript
export interface IMechanicalInstrument extends ILabInstrument {
  category: 'KINEMATICS' | 'DYNAMICS';
  mass: number;               // kg
  velocity: Vector2;          // m/s
  acceleration: Vector2;      // m/s^2
  forces: Vector2[];          // Danh sách lực tác dụng (N)
  frictionCoeff: number;      // Hệ số ma sát mu
  applyForce(force: Vector2): void;
}
```

#### C. Dụng cụ Quang học (`IOpticalInstrument`)
```typescript
export interface IRay {
  origin: Vector2;
  direction: Vector2;
  wavelength: number; // nm (VD: 632.8nm)
  intensity: number;
}

export interface IOpticalInstrument extends ILabInstrument {
  category: 'OPTICS';
  refractiveIndex: number;    // Chiết suất n
  focalLength?: number;       // Tiêu cự f (m)
  traceRay(incomingRay: IRay): IRay[];
}
```

---

## 3. Quy Tắc Thuật Toán & Kiến Trúc PhET (PhET Algorithm Standards)

1. **Phân Tách Tuyệt Đối Model - View (Model-View Separation)**:
   - **Model**: Chỉ tính toán vật lý bằng **Hệ Đo Lường Quốc Tế (SI Units)**: mét ($m$), giây ($s$), kilôgam ($kg$), Vôn ($V$), Ampe ($A$), Newton ($N$).
   - **ModelViewTransform2D**: Mọi biến đổi từ toạ độ vật lý sang pixel hiển thị phải thông qua bộ biến đổi tỉ lệ chuẩn:
     ```typescript
     import { ModelViewTransform2D } from 'scenerystack/phetcommon';
     // Ví dụ: 1 mét vật lý = 100 pixels màn hình
     const mvt = ModelViewTransform2D.createSinglePointScaleInvertedYMapping(
       new Vector2(0, 0),        // Model origin
       new Vector2(400, 300),    // View center (pixel)
       100                       // Scale: 100 px / meter
     );
     ```
2. **Vòng Lặp Mô Phỏng Ổn Định Số Học (Numerical Integration)**:
   - Dùng phương pháp **Semi-implicit Euler** hoặc **Velocity Verlet** cho các hệ chuyển động dao động/con lắc để tránh trôi năng lượng:
     ```typescript
     // Semi-implicit Euler Step:
     velocity.add(acceleration.times(dt));
     position.add(velocity.times(dt));
     ```
   - Cố định bước thời gian tối đa `dt = Math.min(actualDt, 0.033)` ($30\text{Hz}$) để ngăn hiện tượng xuyên thấu vật thể khi giật lag.
3. **Reactive Property Binding**:
   - Sử dụng `Property<T>` và `DerivedProperty<T>` để tự động kích hoạt render khi Model thay đổi giá trị.

---

## 4. Quản Lý State Với Zustand (Lab State Architecture)

Dự án chia nhỏ State thành 3 Store độc lập:

### 4.1. `useWorkbenchStore` (Quản lý Bàn Thí Nghiệm & Dụng Cụ)
```typescript
import { create } from 'zustand';
import { ILabInstrument } from '@/core/physics/ILabInstrument';

interface WorkbenchState {
  instruments: ILabInstrument[];
  selectedInstrumentId: string | null;
  isGridSnapEnabled: boolean;
  addInstrument: (instrument: ILabInstrument) => void;
  removeInstrument: (id: string) => void;
  updateInstrumentPos: (id: string, pos: { x: number; y: number }) => void;
  selectInstrument: (id: string | null) => void;
  clearWorkbench: () => void;
}
```

### 4.2. `useSimulationStore` (Quản lý Vòng Lặp & Trạng Thái Mô Phỏng)
```typescript
interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  timeScale: number;          // 0.5x, 1x, 2x
  elapsedTime: number;        // Tổng thời gian mô phỏng đã trôi qua (giây)
  liveReadings: Record<string, number>;
  setRunning: (running: boolean) => void;
  stepSimulation: (dt: number) => void;
  resetSimulation: () => void;
}
```

### 4.3. `useGradingStore` (Quản lý Bảng Số Liệu & Tự Động Chấm Điểm)
```typescript
interface MeasurementTrial {
  trialIndex: number;
  params: Record<string, number>;
  measuredValues: Record<string, number>;
  calculatedValues: Record<string, number>;
  timestamp: number;
}

interface GradingState {
  trials: MeasurementTrial[];
  isCorrectAssembly: boolean;
  operationScore: number;     // max 30
  accuracyScore: number;      // max 40
  quizScore: number;          // max 30
  totalScore: number;         // 100
  recordTrial: (trial: MeasurementTrial) => void;
  calculateFinalGrade: (theoreticalValue: number) => void;
}
```

---

## 5. Chuẩn Lưu Trữ Dữ Liệu Cột JSONB (Database & API Contracts)

### 5.1. JSONB Schema Lưu Phiên Làm Việc (`lab_sessions.state_data`)
```json
{
  "$schema": "https://visuallab.edu.vn/schemas/lab-session-v1.json",
  "schemaVersion": "1.0",
  "labId": "BAI_19_DO_SUAT_DIEN_DONG",
  "userId": "usr_99812",
  "lastSavedAt": "2026-09-24T07:15:30Z",
  "workbench": {
    "instruments": [
      {
        "id": "inst_01",
        "toolId": "DC_POWER_SUPPLY",
        "position": { "x": 1.2, "y": 0.8 },
        "properties": { "emf": 1.5, "internalR": 0.5 }
      },
      {
        "id": "inst_02",
        "toolId": "VOLTMETER_DC",
        "position": { "x": 2.4, "y": 0.8 },
        "properties": { "selectedRange": 3.0 }
      }
    ],
    "connections": [
      {
        "from": { "instrumentId": "inst_01", "terminalId": "POS" },
        "to": { "instrumentId": "inst_02", "terminalId": "POS" },
        "wireColor": "RED"
      }
    ]
  },
  "simulation": {
    "elapsedTime": 14.5,
    "currentParams": { "rheostatResistance": 25.0 }
  },
  "measurements": [
    { "trial": 1, "rheostatR": 10.0, "currentA": 0.14, "voltageV": 1.36 },
    { "trial": 2, "rheostatR": 20.0, "currentA": 0.07, "voltageV": 1.43 },
    { "trial": 3, "rheostatR": 30.0, "currentA": 0.05, "voltageV": 1.45 }
  ]
}
```

### 5.2. Backend Spring Boot JPA Mapping
```java
@Entity
@Table(name = "lab_sessions")
public class LabSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "lab_id", nullable = false)
    private String labId;

    @Type(JsonType.class)
    @Column(name = "state_data", columnDefinition = "jsonb")
    private LabSessionStateDto stateData;
}
```

---

## 6. Tiêu Chuẩn Kiểm Thử & Nghiệm Thu (Acceptance Criteria)
1. **100% Class dụng cụ** kế thừa từ đúng Interface chuyên biệt trong `ILabInstrument`.
2. **Không có bất kỳ phép tính vật lý nào** sử dụng trực tiếp pixel mà không qua `ModelViewTransform2D`.
3. **Mọi React Component chứa Canvas / Three.js / Tone.js / SceneryStack** phải cài đặt hàm dọn dẹp bộ nhớ `dispose()` trong `useEffect`.
4. **Trạng thái lưu DB dạng JSONB** phải chứa đầy đủ trường `schemaVersion: "1.0"` và serialize/deserialize được 100% không mất mát thông tin.
