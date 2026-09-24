# Brainstorm Report: Chuẩn Hóa OOP, Engine PhET, Zustand & JSONB Trong VisualLab

**Ngày:** 2026-09-24  
**Chủ đề:** Quy định thiết kế chuẩn Hướng đối tượng (OOP), Mô hình hóa Dụng cụ & Thuộc tính Vật lý, Quản lý State với Zustand, Lưu trữ JSONB và Quy tắc thuật toán PhET Interactive Simulations.

---

## 1. Bối cảnh & Mục tiêu (Context & Goals)
VisualLab là nền tảng phòng thí nghiệm ảo vật lý chuẩn GDPT 2018. Để đảm bảo code sạch, mở rộng tốt, tương thích đa nền tảng và giúp tất cả các thành viên trong nhóm cũng như các AI Agent (bb-cook, bb-plan, subagents) tuân thủ nhất quán, hệ thống cần một bộ khung tiêu chuẩn kiến trúc toàn diện gồm:
1. **Thiết kế OOP cho Dụng cụ Thí nghiệm**: Gom nhóm qua các Interface chung (`ILabInstrument`, `IPhysicsModel`), cho phép từng dụng cụ tự định nghĩa thuộc tính và hành vi chuyên biệt.
2. **Quy tắc Thuật toán & Kiến trúc PhET**: Tách biệt hoàn toàn giữa Model (tính toán hệ SI, $m, kg, s, V, A$) và View (tọa độ pixel màn hình) qua `ModelViewTransform2D`, vòng lặp thời gian cố định `fixedDeltaTime`.
3. **Quản lý State tập trung bằng Zustand**: Phân tách rõ ràng Store bàn thực hành (`workbench`), Store mô phỏng vật lý (`simulation`), và Store chấm điểm nộp bài (`submission`).
4. **Quy định Lưu trữ Dữ liệu JSONB**: Định nghĩa schema JSONB phiên bản hóa (`schemaVersion: 1.0`) cho trạng thái phiên làm việc và bài nộp học sinh ở cả Frontend TypeScript và Backend Spring Boot.

---

## 2. Các Ý Tưởng & Hướng Tiếp Cận Đã Khảo Sát (Ideas Explored)

### A. Phân cấp Đối tượng Dụng cụ Thí nghiệm (OOP Hierarchy)
- **Cách tiếp cận 1 (Flat Components - Đã loại bỏ)**: Mỗi dụng cụ viết độc lập dạng React Component không có interface chung. *Nhược điểm*: Trùng lặp code, khó quản lý kết nối, không serialize lưu DB được.
- **Cách tiếp cận 2 (OOP Polymorphic Hierarchy - Được chọn)**:
  - Base Interface `ILabInstrument` định nghĩa các hành vi chung (id, vị trí, render, drag, serialize, dispose).
  - Domain Sub-Interfaces: `ICircuitInstrument`, `IMechanicalInstrument`, `IOpticalInstrument`, `IThermalInstrument`, `IAcousticInstrument`.
  - Concrete Classes: Mỗi dụng cụ đóng gói thuộc tính vật lý riêng (ví dụ: `VoltmeterDC` có điện trở trong $R_V$, thang đo $0-3\text{V}$, sai số $\pm 0.001\text{V}$).

### B. Kiến trúc Thuật toán Mô phỏng (PhET Standard)
- Tách biệt **Model - View - Controller / Transform**:
  - Model không bao giờ chứa thông tin màu sắc, font chữ hay pixel.
  - View quan sát Model thông qua Reactive Properties (`Property`, `DerivedProperty` từ Axon hoặc Zustand selector).
  - Tích phân số học ổn định (Semi-implicit Euler / Velocity Verlet) với bước thời gian nhỏ cố định để tránh lệch tích lũy năng lượng.

### C. Quản lý State (Zustand Stores)
- Phân tách 3 store theo Single Responsibility Principle:
  1. `useWorkbenchStore`: Bố cục bàn thí nghiệm, danh sách dụng cụ, kết nối dây dẫn.
  2. `useSimulationStore`: Thời gian thực, trạng thái Play/Pause, bước nhảy $dt$, dữ liệu sóng/đồ thị.
  3. `useGradingStore`: Điểm thao tác (30%), điểm sai số thực nghiệm (40%), điểm trắc nghiệm (30%).

### D. Chuẩn Persistence JSONB (PostgreSQL + Spring Boot)
- Schema JSONB có `schemaVersion`, mảng `instruments`, `connections`, `measuredData`.
- Backend Spring Boot ánh xạ qua Jackson DTO / JPA `@Type(JsonType.class)` đảm bảo an toàn kiểu dữ liệu.

---

## 3. Rủi Ro & Biện Pháp Kiểm Soát (Risks & Mitigations)
1. **Memory Leak khi unmount thí nghiệm**:
   - *Rủi ro*: SceneryStack Display, Tone.js AudioContext, AnimationFrame không được dọn dẹp.
   - *Kiểm soát*: Bắt buộc phương thức `dispose()` trong `ILabInstrument` và gọi `display.dispose()` trong React `useEffect` cleanup.
2. **Lệch tọa độ giữa Màn hình và Vật lý**:
   - *Rủi ro*: Lập trình viên tính toán gia tốc/vận tốc trực tiếp theo pixel gây sai lệch định luật vật lý.
   - *Kiểm soát*: Bắt buộc dùng `ModelViewTransform2D` quy đổi giữa Hệ SI và Hệ Pixel.

---

## 4. Kế Hoạch Bàn Giao (Handoff)
- Tạo tài liệu Spec chi tiết tại `plans/visuallab-oop-standards/spec.md`.
- Nâng cấp Skill `visuallab-standards` và tạo Workspace Rule `.agents/rules/visuallab-oop-architecture.md` để toàn bộ Agent và thành viên tuân thủ khi viết code.
