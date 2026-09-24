---
name: visuallab-standards
description: "Enforce VisualLab Virtual Physics Laboratory standards for UI components, 2D Canvas workbench, 3D Three.js, Web Audio (Tone.js), Rapier3D physics, SGK GDPT 2018 curriculum mapping, and auto-grading formulas. Trigger whenever creating, building, refactoring, or planning any virtual physics lab module in VisualLab."
---

# VisualLab Virtual Physics Laboratory Standards

This skill defines the mandatory technical, architectural, and pedagogical standards for developing virtual physics experiment modules in VisualLab.

---

## 1. 🎨 UI & Engine Selection Matrix (Phân Loại Giao Diện UX/UI)

Every virtual lab module MUST follow one of two standardized UI categories:

### A. 🎯 Draggable Workbench Canvas (`DRAGGABLE_WORKBENCH`)
- **Use Case**: Component assembly labs (DC circuits, photogate free-fall, Hooke's spring extension, sliding friction).
- **Technology**: HTML5 2D Canvas API + Custom Physics/Circuit Solver (`CircuitSolver.ts`).
- **Required Features**:
  - 60 FPS smooth rendering loop (`requestAnimationFrame`).
  - Visual animations: moving electron dots proportional to current $I$, bulb glow dynamic intensity $P = I^2 R$.
  - Drag-and-drop component positioning with grid snapping.

### B. 🎛️ Parameter Concept Studio (`PARAMETER_STUDIO`)
- **Use Case**: 3D spatial or wave phenomenon labs (Sound resonance tube, simple pendulum, 3D refraction, air track collisions).
- **Technology**: Three.js WebGL + Web Audio API / Tone.js + Rapier3D (`@dimforge/rapier3d-compat`).
- **Required Features**:
  - $360^\circ$ OrbitControls camera navigation.
  - Real-time audio synthesis (Sine wave $f \in [100, 2000]\text{Hz}$) with peak volume on resonance $L_1 = \lambda/4$ or $L_2 = 3\lambda/4$.
  - Clean unmount resource cleanup (`AudioContext.close()`, `renderer.dispose()`).

---

## 2. 🧰 Standardized Component Tool IDs (Mã Dụng Cụ UI)

Always use exact Tool IDs when defining lab apparatus and props:

| Category | Tool ID | English Name | Vietnamese Name | UI Component Type |
| :--- | :--- | :--- | :--- | :--- |
| **Kinematics** | `PHOTOGATE_SENSOR` | Photogate Sensor | Cổng quang điện | `DRAGGABLE_SENSOR` |
| **Kinematics** | `DIGITAL_TIMER` | Digital Timer | Đồng hồ hiện số ($0.001\text{s}$) | `DISPLAY_PANEL` |
| **Kinematics** | `INCLINED_TRACK` | Inclined Track | Máng nghiêng kèm thước | `STATIC_BASE` |
| **Kinematics** | `STEEL_BALL` | Steel Ball | Bi thép ($0.05\text{kg}$) | `PHYSICS_RIGID_BODY` |
| **Dynamics** | `VERTICAL_STAND` | Vertical Stand | Giá đỡ thẳng đứng | `STATIC_BASE` |
| **Dynamics** | `ELECTROMAGNET` | Electromagnet | Nam châm điện thả vật | `ACTIVE_COMPONENT` |
| **Dynamics** | `HELICAL_SPRING` | Helical Spring | Lò xo xoắn | `PHYSICS_SPRING` |
| **Dynamics** | `MASS_WEIGHT_SET` | Weight Set | Bộ quả cân ($50\text{g}, 100\text{g}$) | `DRAGGABLE_MASS` |
| **Electricity** | `DC_POWER_SUPPLY` | DC Power Supply | Nguồn Pin DC ($1.5 - 12\text{V}$) | `CIRCUIT_SOURCE` |
| **Electricity** | `VOLTMETER_DC` | DC Voltmeter | Vôn kế DC | `CIRCUIT_METER` |
| **Electricity** | `AMMETER_DC` | DC Ammeter | Ampe kế DC | `CIRCUIT_METER` |
| **Electricity** | `RHEOSTAT_VARIABLE`| Rheostat | Biến trở con chạy | `CIRCUIT_RESISTOR` |
| **Electricity** | `CIRCUIT_SWITCH` | Switch | Khóa K (Công tắc) | `CIRCUIT_SWITCH` |
| **Optics** | `LASER_SOURCE_RGB` | Laser Source | Nguồn phát Laser | `OPTICS_SOURCE` |
| **Optics** | `YOUNG_DOUBLE_SLIT`| Double Slit | Khe kép Y-âng | `OPTICS_SLIT` |
| **Optics** | `FRINGE_SCREEN` | Fringe Screen | Màn hứng vân giao thoa | `OPTICS_SCREEN` |
| **Acoustics** | `RESONANCE_TUBE` | Resonance Tube | Ống cộng hưởng âm | `ACOUSTICS_TUBE` |
| **Acoustics** | `AUDIO_GENERATOR` | Audio Generator | Máy phát tần số âm | `ACOUSTICS_SOURCE` |

---

## 3. 🤖 Auto-Grading System Standard (Chuẩn Chấm Điểm Tự Động)

All student submission worksheets MUST follow the standard 3-tier scoring formula:

$$\text{Total Score} = \text{Operation (30\%)} + \text{Accuracy/Error (40\%)} + \text{Report Quiz (30\%)}$$

1. **Operation Score (30%)**:
   - Verify correct assembly (`isCorrectAssembly === true`).
   - Require minimum $N \ge 3$ distinct measurement trials.
2. **Error & Accuracy Score (40%)**:
   - Percentage error calculation:
     $$\text{Error} = \frac{|X_{\text{student}} - X_{\text{theoretical}}|}{X_{\text{theoretical}}} \times 100\%$$
   - Award maximum points if $\text{Error} \le 5\%$. Linear deduction for higher error up to $20\%$.
3. **Report Quiz (30%)**:
   - Assess theoretical comprehension post-experiment via 3-5 multiple-choice questions.

---

## 4. 🏛️ Chuẩn Thiết Kế Hướng Đối Tượng & Data-Driven Physics (Không Hardcode)

- **CẤM TUYỆT ĐỐI HARDCODE THUỘC TÍNH VẬT LÝ & VẬT THỂ**:
  - Không fix cứng hằng số vật lý ($m, k, R, \mathcal{E}, \mu, n, c$) trong thân code/component.
  - Mọi thuộc tính vật lý phải định nghĩa qua Schema Descriptor (`IPhysicsParamDescriptor`: `id`, `name`, `unit`, `min`, `max`, `step`, `defaultValue`, `value`) và nạp động qua `IInstrumentConfig` hoặc Database JSONB.
  - Khởi tạo dụng cụ động qua `InstrumentFactory.create(toolId, config)`.
- Mọi dụng cụ thí nghiệm phải kế thừa từ interface gốc `ILabInstrument` (chứa `id`, `toolId`, `name`, `category`, `config`, `position`, `render()`, `update(dt)`, `onDragStart()`, `onDrag()`, `onDragEnd()`, `serialize()`, `deserialize()`, `dispose()`).
- Phân nhóm chuyên ngành qua các sub-interfaces:
  - `ICircuitInstrument`: Quản lý `terminals`, điện trở trong, độ giảm thế, cường độ dòng điện, hàm `calculateCircuitState()`.
  - `IMechanicalInstrument`: Quản lý khối lượng `mass`, vận tốc `velocity`, gia tốc `acceleration`, các vectơ lực `forces[]`.
  - `IOpticalInstrument`: Quản lý chiết suất `refractiveIndex`, tiêu cự `focalLength`, hàm dò tia `traceRay()`.
  - `IThermalInstrument`: Quản lý nhiệt dung riêng `specificHeat`, nhiệt độ `temperature`, công suất trao đổi nhiệt.
  - `IAcousticInstrument`: Quản lý tần số $f$, biên độ $A$, hàm phát sóng `generateWave()`.

---

## 5. ⚛️ Quy Tắc Thuật Toán & Kiến Trúc PhET (PhET Simulation Standard)

- **Tách biệt Model - View**:
  - Model chỉ hoạt động trên đơn vị chuẩn SI ($m, kg, s, A, V, N, J$). Tuyệt đối không dùng pixel trong Model.
  - View sử dụng `ModelViewTransform2D` để ánh xạ giữa tọa độ vật lý và pixel màn hình.
- **Tích phân Số học Cố định Bước Nhảy**:
  - Chuyển động và dao động sử dụng thuật toán **Semi-implicit Euler** hoặc **Velocity Verlet** với `dt` cố định ($\le 0.033\text{s}$) để chống xuyên thấu và trôi năng lượng.
- **Reactive State**: Sử dụng `Property` / `DerivedProperty` từ `scenerystack/axon` để View tự động phản ứng khi Model thay đổi.

---

## 6. 📦 Chuẩn Quản Lý State Với Zustand & Lưu Trữ JSONB

- **3 Store Zustand Độc Lập**:
  1. `useWorkbenchStore`: Quản lý danh sách dụng cụ, vị trí, snap lưới, dây nối.
  2. `useSimulationStore`: Quản lý vòng lặp mô phỏng, Play/Pause, `timeScale`, dữ liệu đo trực tiếp.
  3. `useGradingStore`: Quản lý bảng số liệu các lần đo ($N \ge 3$), tính sai số và chấm điểm.
- **Cột JSONB Persistence (`lab_sessions.state_data`)**:
  - Phải có `"schemaVersion": "1.0"`.
  - Ánh xạ qua Jackson DTO có validation ở Backend Spring Boot (`@Type(JsonType.class)`).

---

## 7. 🏗️ Code Architecture & Memory Safety Rules

- **Code Splitting**: Always wrap lab engine components with `React.lazy()` and `LabErrorBoundary` in `src/main.tsx`.
- **API Configuration**: Always import `API_BASE_URL` from `src/config/api.ts`. Never hardcode `http://localhost:8080`.
- **Role Security**: Wrap all `/admin/*`, `/teacher/*`, and `/student/*` routes with `ProtectedRoute` supplying explicit `allowedRoles`.
- **Clean Unmount**: Every 3D/Canvas/WebAudio lab component MUST clean up animation frames, event listeners, and audio contexts on component unmount via `dispose()`.

