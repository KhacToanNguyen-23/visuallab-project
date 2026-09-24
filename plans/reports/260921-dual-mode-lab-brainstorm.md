# Brainstorm: Dual-Mode Virtual Physics Lab (Guided + Sandbox)

**Date:** 2026-09-21

## Ideas Explored

### 1. NoBooK-style Template System (Guided Lab)
- Bài cố định theo giáo trình SGK GDPT 2018, step-by-step
- Học sinh vào → chọn bài → làm theo quy trình → auto-grading
- Ưu: mapping 1:1 với giáo trình, GV dễ giao bài, auto-grading rõ ràng
- Nhược: cứng nhắc, không khuyến khích sáng tạo

### 2. APMonitor Apps-style Interactive Simulations (Parameter Mode)
- Mỗi app là một hệ thống độc lập, sliders điều chỉnh tham số, real-time charts
- 65+ apps chia theo ngành (Process Control, Nuclear, Mining, Aerospace...)
- Ưu: rất rich interaction, mỗi sim là self-contained
- Nhược: không có kéo thả lắp ghép, không phải sandbox tự do

### 3. NoBooK Console + Workbench Split
- Console = thư viện browser tìm bài (category, tags, search)
- Workbench = vùng làm việc tương tác khi mở bài
- Ưu: clean separation giữa discovery và execution

### 4. Full Sandbox Mode (PhET/Algodoo-inspired)
- Phòng lab trống + thanh công cụ đầy đủ 30 dụng cụ
- Học sinh tự kéo thả, lắp ghép, nối dây, tạo thí nghiệm
- Physics engine mô phỏng kết quả tự nhiên (không bị scripted)
- Ưu: khuyến khích sáng tạo, khám phá tự do
- Nhược: phức tạp hơn về physics simulation, khó auto-grade

### 5. Hybrid: 2 modes dùng chung Component Library (CHỌN)
- Guided Lab dùng đúng các Tool IDs đã chuẩn hóa (30 components)
- Sandbox Lab mở toàn bộ 30 components + có thể mở rộng thêm
- Cùng physics engine, cùng drag-drop, cùng render pipeline
- Ưu: tái sử dụng code tối đa, consistent UX
- Nhược: cần thiết kế component system linh hoạt

### 6. GEKKO-style Backend Solver (bị loại)
- Dùng GEKKO/APMonitor solver trên server cho optimization
- Quá nặng cho bài lab THPT, latency cao
- Không phù hợp — VisualLab cần real-time client-side physics

## User's Direction

Người dùng muốn **2 chế độ rõ ràng**, cụ thể:

1. **📚 Guided Lab (Bài cố định)**: Học sinh truy cập bài thực hành theo giáo trình SGK. Mỗi bài có quy trình step-by-step, dụng cụ cố định, auto-grading. Giáo viên giao bài → học sinh làm → hệ thống chấm điểm.

2. **🔬 Sandbox Lab (Phòng thực hành tự do)**: Phòng lab trống với thanh công cụ FULL 30 dụng cụ. Học sinh kéo thả bất kỳ dụng cụ nào vào workspace, tự lắp ghép, tự tạo thí nghiệm. Không bị ràng buộc quy trình.

**3 actors**: Admin, Giáo viên (tạo lớp, mời HS, giao bài), Học sinh (user chính).

Hướng này kết hợp điểm mạnh của cả NoBooK (guided templates) và PhET/Algodoo (sandbox creativity), trong khi dùng chung bộ 30 component UI đã chuẩn hóa.

## Open Questions & Decisions

1. **Sandbox auto-save**: **[ĐÃ CHỐT]** Lưu trạng thái phòng lab bằng cấu trúc JSONB trong Database. Dùng Zustand để quản lý state (tọa độ, thông số vật lý) trên client trước khi sync lên server.
2. **GV tự tạo bài**: **[ĐÃ CHỐT]** Tạm thời đưa vào Phase 2 (P2). MVP tập trung vào học sinh tự do khám phá và lưu/tải lại sandbox.
3. **Physics engine scope & complexity**: **[ĐÃ CHỐT HƯỚNG MỚI]** Áp dụng kiến trúc ECS với 2.5D rendering.
   - Thư viện Render: **Three.js** (thông qua `@react-three/fiber`).
   - Môi trường: Dùng `OrthographicCamera` (góc nhìn vuông góc) để tạo cảm giác 2D phẳng nhưng thực chất là không gian 3D, hỗ trợ ánh sáng, bóng đổ (shadows) và material đẹp mắt.
   - Lõi vật lý: **Rapier.js** (thông qua `@react-three/rapier`). Xử lý va chạm 3D nhưng có thể khóa trục Z (tùy bài) để hoạt động như 2D.
   - Âm thanh vật lý: **Tone.js**. Bắt sự kiện va chạm (onCollision) từ Rapier để trigger âm thanh procedural (tiếng gõ, kim loại va đập) qua Tone.js.
   - Pattern: React không quản lý tọa độ 60fps. Physics Engine (Rapier) ôm toàn bộ vật lý. Zustand lưu cấu hình tĩnh. R3F render mượt mà bằng cơ chế hook của `@react-three/rapier`.
4. **Real-time collaboration**: Nhiều HS cùng làm 1 sandbox? → Vẫn đang là Out of Scope (P3).

## Risks

1. **Physics engine complexity**: Sandbox mode cần physics engine tổng quát hơn Guided mode (vd: va chạm giữa các vật bất kỳ, lực tổng hợp). Guided mode chỉ cần scripted physics cho từng bài cụ thể.
2. **Performance on low-end devices**: Sandbox với nhiều vật thể + physics real-time có thể lag trên máy tính học sinh (thường cấu hình thấp).
3. **Scope creep**: Sandbox "full" rất dễ phình to scope — cần rõ MVP boundary.
