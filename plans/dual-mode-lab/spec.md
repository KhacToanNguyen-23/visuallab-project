# Spec: VisualLab Dual-Mode Virtual Physics Lab

**Date:** 2026-09-21
**Status:** Draft

---

## Problem Statement

Học sinh THPT Việt Nam cần một phòng thí nghiệm vật lý ảo vừa đáp ứng yêu cầu **thực hành theo giáo trình SGK GDPT 2018** (14 bài, auto-grading), vừa có **phòng thực hành tự do** (sandbox kéo thả) để khám phá và sáng tạo — tất cả trên nền tảng web, dùng chung bộ 30 dụng cụ chuẩn hóa.

---

## User Stories

- **[P1]** As a Học sinh, I want to mở bài thực hành theo giáo trình (Guided Lab) so that tôi làm theo quy trình step-by-step và được chấm điểm tự động.
  Accepted when: HS chọn bài từ catalog → workbench hiển thị dụng cụ cần thiết → hoàn thành các bước → nhận điểm auto-grade (Thao tác 30% + Sai số 40% + Báo cáo 30%).

- **[P1]** As a Học sinh, I want to truy cập Sandbox Lab với thanh công cụ đầy đủ 30 dụng cụ so that tôi tự kéo thả, lắp ghép và tạo thí nghiệm theo ý mình.
  Accepted when: HS mở Sandbox → thấy thanh sidebar/toolbar chứa tất cả 30 Tool IDs → kéo thả vào workspace trống → vật lý mô phỏng chính xác (trọng lực, va chạm, điện, quang...).

- **[P1]** As a Giáo viên, I want to tạo lớp học, mời HS và giao bài thực hành so that tôi quản lý tiến độ và xem điểm từng HS.
  Accepted when: GV tạo class → share link/code mời HS → giao assignment (chọn bài Guided Lab) → xem dashboard điểm số và trạng thái hoàn thành.

- **[P1]** As a Admin, I want to quản lý toàn bộ GV/HS, nội dung bài lab và cấu hình hệ thống so that nền tảng vận hành ổn định.
  Accepted when: Admin CRUD users, manage labs catalog, view system analytics.

- **[P2]** As a Học sinh, I want to lưu lại thí nghiệm sandbox của mình so that tôi có thể mở lại hoặc chia sẻ.
  Accepted when: HS save sandbox state → load lại đúng layout và parameters.

- **[P2]** As a Giáo viên, I want to tạo bài thực hành custom từ Sandbox Lab so that tôi giao bài ngoài 14 bài SGK chuẩn.
  Accepted when: GV thiết kế TN trong Sandbox → save as template → giao cho HS.

- **[P3]** _(out of scope — noted for future)_ Real-time collaboration: nhiều HS cùng 1 sandbox.

---

## Functional Requirements

1. **FR-01: Experiment Catalog (Guided Lab)**
   - Hiển thị 14 bài thực hành theo Lớp (10/11/12) → Chương → Bài
   - Mỗi bài card hiển thị: tên, loại UI (🎯/🎛️), chương, trang SGK, tags
   - Search và filter theo lớp, chương, loại giao diện
   - Click → mở workbench với bộ dụng cụ tương ứng

2. **FR-02: Guided Lab Workbench**
   - **Kéo thả (8 bài)**: Sidebar chứa đúng dụng cụ của bài đó → kéo vào workspace → snap/connect theo quy trình → physics simulation → đo lường → ghi số liệu
   - **Tham số (6 bài)**: Workspace pre-configured → sliders/inputs điều chỉnh → real-time animation + charts → ghi số liệu
   - Step indicator hiển thị tiến độ (Bước 1/5, 2/5...)
   - Theory panel (collapsible) giải thích công thức

3. **FR-03: Sandbox Lab Workbench**
   - Workspace trống (môi trường 2D phẳng giống NoBooK, không phải 3D xoay chiều)
   - Sidebar toolbar chứa **tất cả 30 dụng cụ** phân theo category:
     - Cơ học: INCLINED_TRACK, STEEL_BALL, WOODEN_BLOCK, HELICAL_SPRING, MASS_WEIGHT_SET...
     - Điện: DC_POWER_SUPPLY, AMMETER_DC, VOLTMETER_DC, RHEOSTAT_VARIABLE, CIRCUIT_SWITCH...
     - Quang: LASER_SOURCE_RGB, YOUNG_DOUBLE_SLIT, FRINGE_SCREEN...
     - Nhiệt: CALORIMETER_CUP, HEATING_COIL, DIGITAL_THERMOMETER...
     - Từ: BAR_MAGNET, INDUCTION_COIL, GALVANOMETER_G
     - Đo lường: PHOTOGATE_SENSOR, DIGITAL_TIMER, SPRING_BALANCE, PRESSURE_GAUGE...
   - Drag từ toolbar → workspace → place → connect/interact
   - Physics engine xử lý tương tác tự nhiên giữa các vật
   - Không có step guidance, không auto-grading (tự do khám phá)

4. **FR-04: Auto-grading System (Guided Lab only)**
   - Điểm Thao tác (30%): kiểm tra lắp đúng + đủ N≥3 lần đo
   - Điểm Sai số (40%): |X_hs - X_lt| / X_lt ≤ 5% → max điểm
   - Điểm Báo cáo (30%): trắc nghiệm thu hoạch 5-10 câu
   - Tổng điểm lưu vào DB, GV xem trên dashboard

5. **FR-05: Teacher Dashboard**
   - Tạo lớp, mời HS (link/code)
   - Giao assignment: chọn bài Guided Lab → đặt deadline
   - Xem điểm: bảng điểm chi tiết từng HS, từng bài, export CSV
   - Xem tiến độ: bao nhiêu HS đã hoàn thành

6. **FR-06: Student Dashboard**
   - Xem lớp đã tham gia
   - Xem assignments (bài được giao, deadline, trạng thái)
   - Mở Guided Lab hoặc Sandbox Lab
   - Xem lịch sử điểm

7. **FR-07: Admin Portal**
   - CRUD users (GV, HS)
   - Manage labs catalog
   - System analytics (active users, lab usage, performance)

---

## Non-Functional Requirements

- **Performance**: Lab workbench render ≥30fps trên thiết bị Pentium G6400 / 4GB RAM. First paint <3s.
- **Responsiveness**: Desktop-first (1280px+), tablet support (768px+). Không yêu cầu mobile phone.
- **Browser**: Chrome 90+, Edge 90+, Firefox 90+. Không cần Safari/iOS.
- **Availability**: 99% uptime (self-hosted VPS). Sandbox mode chạy fully client-side, không cần server.

---

## Success Criteria

- [ ] 14 bài Guided Lab hoạt động đầy đủ với auto-grading chính xác (error <1% so với công thức lý thuyết)
- [ ] Sandbox Lab hiển thị 30 dụng cụ, kéo thả mượt, physics simulation real-time
- [ ] GV tạo lớp → giao bài → xem điểm end-to-end trong <5 phút
- [ ] HS hoàn thành 1 bài Guided Lab trong <15 phút (average)
- [ ] Workbench render ≥30fps với ≤10 dụng cụ đồng thời trên cấu hình tối thiểu

---

## Out of Scope

- Hóa học, Sinh học (chỉ Vật lý THPT)
- Mobile phone native app
- Real-time multiplayer collaboration
- AI tutor / chatbot hỗ trợ
- VR/AR mode
- Offline mode (PWA)

---

## Assumptions

- Bộ 30 Tool IDs trong DacTa.md là FINAL — không thêm dụng cụ mới cho MVP
- SGK bộ "Kết nối tri thức với cuộc sống" là bộ chính, các bộ khác (Cánh diều, Chân trời sáng tạo) bổ sung sau
- Physics engine hiện tại (Rapier3D/2D hoặc Matter.js) đủ cho cả Guided và Sandbox
- Backend đã có authentication (Google OAuth) và database (PostgreSQL)

---

## Open Questions & Clarifications

- **[ĐÃ CHỐT] Sandbox Save State**: Sử dụng kiến trúc `Zustand` (Client State) + `JSONB` trong PostgreSQL. Sandbox state được serialize thành cục JSON lưu ở backend. Cho phép HS mở lại bài cũ.
- **[ĐÃ CHỐT] Custom Labs (GV tự tạo bài)**: GV tự thiết kế bài lab bằng Sandbox → Save as template → Giao cho lớp. (Phân quyền: P2 / Phase 2).
- **[ĐÃ CHỐT HƯỚNG MỚI] Physics Engine Architecture**: Sử dụng Entity-Component-System / View-Physics Split (`UI --> Vật ---> Tính chất vật lý`).
  - Môi trường Render: **Three.js** (qua `@react-three/fiber`) sử dụng `OrthographicCamera` (góc nhìn vuông góc). Đem lại cảm giác 2D phẳng (UI dễ nhìn như NoBooK) nhưng có chiều sâu 3D thật (ánh sáng, vật liệu).
  - Lõi vật lý: **Rapier.js** (`@react-three/rapier`). Xử lý mô phỏng 3D vật lý tĩnh/động mượt mà, khóa trục khi cần.
  - Âm thanh vật lý: **Tone.js**. Lắng nghe sự kiện va chạm từ Rapier để phát âm thanh tự động.
  - React (UI) không ôm state tọa độ của Physics để tránh lag (60fps re-renders). Zustand chỉ quản lý cấu hình tĩnh (khối lượng, kích thước). UI bind trực tiếp vào Physics object qua hook của Rapier để update hình ảnh mượt mà.
