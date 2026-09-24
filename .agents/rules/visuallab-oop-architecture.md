# Quy Chuẩn Kiến Trúc OOP, PhET Engine, Zustand & JSONB Trong VisualLab

**MỤC ĐÍCH:**
Quy tắc này bắt buộc tất cả các AI Agent (bb-cook, bb-plan, subagents) và Lập trình viên khi tạo mới, tái cấu trúc hoặc bảo trì các bài thí nghiệm ảo và hệ thống chấm điểm phải tuân thủ nghiêm ngặt 6 chuẩn kiến trúc cốt lõi dưới đây.

---

## 1. 🚫 TUYỆT ĐỐI KHÔNG HARDCODE TÍNH CHẤT VẬT LÝ & VẬT THỂ (Data-Driven Physics & Parameterized Objects)

- **Cấm Tuyệt Đối Hardcode**: Không được hardcode các hằng số vật lý hoặc thông số dụng cụ trực tiếp trong thân code logic/component (Ví dụ CẤM: `const mass = 0.05;`, `const R = 10;`, `const emf = 1.5;`, `new Circle({ radius: 20 })`).
- **Data-Driven Configuration (Cấu hình Hóa Dữ Liệu)**:
  - Mọi thuộc tính vật lý của vật thể và dụng cụ phải được định nghĩa thông qua **Config Interface / Descriptor Schema** (`IPhysicsPropertiesConfig`, `IInstrumentConfig`).
  - Mỗi thông số phải có: `id`, `name`, `unit`, `min`, `max`, `step`, `defaultValue`, `currentValue` để hỗ trợ hiển thị Control Slider / Input và thay đổi linh hoạt trong runtime hoặc từ Database JSONB.
- **Factory & Registry Pattern**:
  - Dụng cụ và vật thể phải được tạo thông qua `InstrumentFactory.create(toolId, initialConfig)` hoặc Registry.
  - Cho phép nạp cấu hình từ DB (`LabTemplateConfig`) hoặc người dùng tinh chỉnh mà không cần sửa code engine.
- **Reactive Dynamic Properties**:
  - Các biến số vật lý (vận tốc, khối lượng, điện trở, suất điện động, nhiệt độ) phải sử dụng `Property<T>` (từ `scenerystack/axon`) hoặc Zustand dynamic store để hỗ trợ reactive updates 2 chiều giữa UI Control Panel và Physics Simulation Loop.

---

## 2. 🏛️ Chuẩn Thiết Kế Hướng Đối Tượng Dụng Cụ (OOP Instrument Hierarchy)

- **Interface gốc chung (`ILabInstrument`)**:
  - Mọi dụng cụ thí nghiệm đều phải implement `ILabInstrument` chứa các thuộc tính (`id`, `toolId`, `name`, `category`, `position: Vector2`, `rotation`, `isInteractive`, `config: IInstrumentConfig`) và các hàm vòng đời (`render()`, `update(dt)`, `onDragStart()`, `onDrag()`, `onDragEnd()`, `serialize()`, `deserialize()`, `dispose()`).
- **Phân nhánh Interface chuyên ngành**:
  - `ICircuitInstrument`: Quản lý các chân cực (`terminals`), điện trở trong, độ giảm thế, dòng điện, hàm tính toán trạng thái mạch `calculateCircuitState()`.
  - `IMechanicalInstrument`: Quản lý khối lượng `mass`, vận tốc `velocity`, gia tốc `acceleration`, danh sách lực `forces[]`, hệ số ma sát `frictionCoeff`.
  - `IOpticalInstrument`: Quản lý chiết suất `refractiveIndex`, tiêu cự `focalLength`, hàm dò tia sáng `traceRay(incomingRay)`.
  - `IThermalInstrument`: Quản lý nhiệt dung riêng `specificHeat`, nhiệt độ `temperature`, công suất truyền nhiệt.
  - `IAcousticInstrument`: Quản lý tần số $f$, biên độ $A$, tốc độ truyền âm $v$, hàm phát sóng `generateWave()`.
- **Đóng gói thuộc tính riêng (Encapsulation)**: Mỗi lớp dụng cụ cụ thể tự quản lý và bảo toàn tính toàn vẹn của các tham số vật lý của riêng mình thông qua getter/setter hoặc reactive properties.

---

## 3. ⚛️ Quy Tắc Thuật Toán & Kiến Trúc PhET (PhET Simulation Standards)

- **Tách biệt Model & View (Model-View Separation)**:
  - **Model**: Chỉ tính toán vật lý thuần túy theo hệ SI chuẩn ($m, kg, s, V, A, N, K, J$). TUYỆT ĐỐI KHÔNG đưa tọa độ pixel, màu sắc, font chữ vào Model.
  - **ModelViewTransform2D**: Mọi biến đổi từ Model sang View pixel trên màn hình phải dùng `ModelViewTransform2D`.
- **Tích phân Số học Ổn định (Numerical Integration)**:
  - Chuyển động và dao động phải dùng **Semi-implicit Euler** hoặc **Velocity Verlet** với `dt` cố định (`dt <= 0.033s`) để chống hiện tượng xuyên thấu và trôi năng lượng.
- **Reactive State**: Dùng `Property` / `DerivedProperty` từ Axon hoặc liên kết reactive để View tự động render khi Model thay đổi.

---

## 4. 📦 Chuẩn Quản Lý State Với Zustand (Lab State Management)

Chia tách thành 3 Store độc lập theo Single Responsibility Principle (SRP):
1. `useWorkbenchStore`: Bố cục không gian làm việc, danh sách dụng cụ trên bàn, trạng thái snap lưới, kết nối dây dẫn.
2. `useSimulationStore`: Thời gian thực, tốc độ `timeScale`, trạng thái chạy/dừng (`isRunning`, `isPaused`), thông số đo trực tiếp.
3. `useGradingStore`: Nhật ký các lần đo ($N \ge 3$), tính toán sai số thực nghiệm, điểm thao tác, điểm trắc nghiệm.

---

## 5. 💾 Quy Định Lưu Trữ Dữ Liệu Cột JSONB (Database & API)

- Mọi dữ liệu lưu phiên làm việc học sinh hoặc mẫu cấu hình bài lab vào cột `jsonb` trong PostgreSQL đều phải có:
  - `"schemaVersion": "1.0"`
  - `"workbench": { "instruments": [...], "connections": [...] }`
  - `"measurements": [...]`
- **Backend Spring Boot**: Dùng DTO Jackson có kiểu dữ liệu rõ ràng kết hợp `@Type(JsonType.class)`. Tuyệt đối không lưu chuỗi JSON tự do không kiểm soát cấu trúc.

---

## 6. 🛡️ An Toàn Bộ Nhớ & Vòng Đời Component (Memory Safety)

- Mọi React Component chứa SceneryStack / Canvas / Three.js / Tone.js / Web Audio **BẮT BUỘC** phải gọi hàm dọn dẹp `dispose()` và ngắt kết nối AudioContext, hủy `requestAnimationFrame` khi unmount trong `useEffect`.
