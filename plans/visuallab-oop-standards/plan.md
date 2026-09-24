# Kế Hoạch Triển Khai: Hệ Thống OOP, PhET Engine, Zustand & JSONB Trong VisualLab

**Risk: normal**  
**Spec:** `plans/visuallab-oop-standards/spec.md`  
**Status:** Completed

---

## 🎯 Mục Tiêu
Xây dựng bộ khung kiến trúc Core chuẩn OOP cho toàn bộ hệ thống mô phỏng thí nghiệm ảo VisualLab, giải quyết triệt để việc hardcode thuộc tính vật lý, tách biệt Model-View theo chuẩn PhET, và tích hợp 3 store Zustand cùng persistence JSONB.

---

## 📋 Các Giai Đoạn (Phases)

- [x] **Phase 1: Base OOP Types, Interfaces & Parameter Schema**
  - Đã tạo `frontend/src/core/physics/types.ts`: `InstrumentCategory`, `IPhysicsParamDescriptor`, `IInstrumentConfig`.
  - Đã tạo `frontend/src/core/physics/ILabInstrument.ts`: Base interface cho mọi dụng cụ.
  
- [x] **Phase 2: Domain Specialized Sub-Interfaces & Abstract Classes**
  - Đã tạo `frontend/src/core/physics/instruments/BaseInstrument.ts`
  - Đã tạo `frontend/src/core/physics/instruments/CircuitInstrument.ts`
  - Đã tạo `frontend/src/core/physics/instruments/MechanicalInstrument.ts`
  - Đã tạo `frontend/src/core/physics/instruments/OpticalInstrument.ts`
  - Đã tạo `frontend/src/core/physics/instruments/ThermalInstrument.ts`
  - Đã tạo `frontend/src/core/physics/instruments/AcousticInstrument.ts`

- [x] **Phase 3: Data-Driven Instrument Factory & Registry (No-Hardcoding)**
  - Đã tạo `frontend/src/core/physics/InstrumentRegistry.ts`: Đăng ký metadata và schema tham số của tất cả các Tool ID trong `DacTa.md`.
  - Đã tạo `frontend/src/core/physics/InstrumentFactory.ts`: Khởi tạo dụng cụ động từ config/JSON mà không hardcode hằng số.

- [x] **Phase 4: PhET Model-View-Transform & Physics Integrator Engine**
  - Đã tạo `frontend/src/core/physics/ModelViewTransform.ts`: Chuẩn hóa ánh xạ đơn vị SI $\leftrightarrow$ View Pixel.
  - Đã tạo `frontend/src/core/physics/PhysicsIntegrator.ts`: Tích phân số học Semi-implicit Euler / Verlet với fixed `dt`.

- [x] **Phase 5: Unified Zustand Stores**
  - Đã tạo `frontend/src/core/stores/useWorkbenchStore.ts`
  - Đã tạo `frontend/src/core/stores/useSimulationStore.ts`
  - Đã tạo `frontend/src/core/stores/useGradingStore.ts`
  - Đã tạo `frontend/src/core/index.ts` xuất khẩu toàn bộ hệ thống.

- [x] **Phase 6: Verification, Type-Check & Verification Gates**
  - Đã kiểm tra `npm run build` (`tsc -b && vite build`) $\to$ **Exit code 0, Clean build!**

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->
**Last active:** 2026-09-24 14:32
**Phase in progress:** All Phases Complete
**Status:** Successfully implemented core OOP architecture, PhET Engine, Zustand stores, and dynamic non-hardcoded physics parameters.

### Decisions made this session
- Cấm tuyệt đối hardcode các hằng số vật lý ($m, k, R, \mathcal{E}, \mu, n, c$) trong logic. Toàn bộ tham số được quản lý qua `IPhysicsParamDescriptor` với đầy đủ `min`, `max`, `step`, `defaultValue`, `value`.
- Phân tách độc lập 3 store Zustand: `useWorkbenchStore` (bàn thực hành), `useSimulationStore` (vòng lặp vật lý), `useGradingStore` (chấm điểm tự động).
- Chuẩn hóa ModelViewTransform và thuật toán tích phân số học PhET Semi-implicit Euler / Velocity Verlet.
- Tuân thủ nghiêm ngặt `verbatimModuleSyntax` với `import type`.
