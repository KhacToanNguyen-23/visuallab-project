# PRD & Spec: Nền tảng Thí nghiệm Vật lý Tương tác EduLab (PhET Việt Nam)

**Date:** 2026-09-08  
**Status:** Ready  

---

## Problem Statement

Học sinh THCS và THPT tại Việt Nam thường thiếu trang thiết bị thí nghiệm thực tế hoặc thiết bị trong phòng thí nghiệm trường học bị hỏng/cũ kỹ. Điều này khiến việc tiếp thu các khái niệm Vật lý trong chương trình GDPT 2018 trở nên trừu tượng và khô khan. Nền tảng EduLab cung cấp các mô phỏng thí nghiệm tương tác Canvas 2D / SVG mượt mà, trực quan, bám sát bộ sách giáo khoa Việt Nam (Kết nối tri thức, Cánh diều, Chân trời sáng tạo).

---

## User Stories

<!-- P1 = MVP (thí nghiệm cốt lõi), P2 = mở rộng & bài tập, P3 = tính năng nâng cao -->

### Thí nghiệm & Tương tác
- **[P1]** Là một học sinh, tôi muốn kéo thả các linh kiện điện (pin, bóng đèn, điện trở, công tắc, dây dẫn) và đo cường độ dòng điện/hiệu điện thế bằng ampe kế và von kế để kiểm chứng Định luật Ohm và mạch nối tiếp/song song.
  - *Acceptance Criteria:* Độ chính xác tính toán dòng điện/điện thế chuẩn 99% theo định luật Kirchhoff; hiển thị độ sáng bóng đèn và dòng electron chuyển động mượt mà.
- **[P1]** Là một học sinh, tôi muốn điều chỉnh chiều dài dây, khối lượng vật nặng, gia tốc trọng trường $g$, và lực cản không khí của con lắc đơn/con lắc lò xo để quan sát dao động và đồ thị $x-t, v-t, a-t$ theo thời gian thực.
  - *Acceptance Criteria:* Đồ thị dạng Canvas 2D vẽ liên tục theo thời gian thực, có nút Tạm dừng / Tiếp tục / Đặt lại (Reset) / Tua chậm (Slow Motion).
- **[P1]** Là một học sinh, tôi muốn chiếu tia sáng laser qua thấu kính hội tụ, thấu kính phân kỳ và khối thủy tinh để quan sát hiện tượng khúc xạ, phản xạ toàn phần và vẽ đường truyền của tia sáng.
  - *Acceptance Criteria:* Hiển thị rõ tiêu điểm $F$, tiêu diện, vật $AB$ và ảnh $A'B'$ đúng vị trí và tính chất (ảnh thật/ảnh ảo, cùng chiều/ngược chiều).
- **[P2]** Là một giáo viên, tôi muốn chọn các cấu hình bài thí nghiệm mẫu sẵn có theo chuẩn bài học SGK Lớp 6 - Lớp 12 để chiếu trên lớp học.
  - *Acceptance Criteria:* Danh mục phân loại bài mô phỏng theo Khối lớp (6-12) và Chủ đề (Cơ, Nhiệt, Điện, Quang, Từ, Hạt nhân).
- **[P3]** Là một người dùng, tôi muốn tự tạo sơ đồ mạch điện/mô phỏng phức tạp và lưu/chia sẻ dưới dạng đường link URL độc lập.
  - *Acceptance Criteria:* Export/Import trạng thái mô phỏng dưới dạng chuỗi JSON nén mã hóa trên URL parameter.

---

## Functional Requirements

### 1. Phân loại & Danh mục Bài mô phỏng (Curriculum Mapping - GDPT 2018)
1. **FR-01**: Hệ thống cung cấp danh mục thí nghiệm phân cấp theo 2 Cấp học (THCS & THPT) và 6 Chủ đề kiến thức chính:
   - **Cơ học**: Chuyển động thẳng, rơi tự do, ném ngang, con lắc đơn, con lắc lò xo, đòn đòn/mặt phẳng nghiêng.
   - **Nhiệt học**: Sự chuyển thể, sự nở vì nhiệt, định luật chất khí (Sạc-lơ, Bôi-lơ Ma-ri-ốt).
   - **Quang học**: Phản xạ ánh sáng, khúc xạ ánh sáng, thấu kính, lăng kính, tán sắc ánh sáng.
   - **Điện học**: Mạch điện DC, điện trở, định luật Ohm, tụ điện, từ trường & cảm ứng điện từ.
   - **Sóng học**: Sóng cơ, giao thoa sóng, sóng âm, sóng điện từ.
   - **Vật lý hiện đại**: Quang điện ngoài, mẫu nguyên tử Bo, bán rã hạt nhân.

### 2. Mô-đun Engine Mô phỏng (Canvas 2D + SVG Interactive)
2. **FR-02**: Màn hình mô phỏng bao gồm 3 khu vực chính:
   - **Canvas Vùng tương tác chính**: Cho phép kéo thả đối tượng, phóng to/thu nhỏ, xoay, nối dây.
   - **Bảng điều khiển thông số (Control Panel)**: Sliders điều chỉnh thông số (khối lượng, chiều dài, điện áp, chiết suất $n$, góc chiếu $\alpha$), nút bấm Tạm dừng/Play/Slow Motion/Reset.
   - **Bộ công cụ đo lường (Measurement Tools)**: Thước đo pixels/cm, đồng hồ bấm giờ, ampe kế, von kế, nhiệt kế, thước đo góc.
3. **FR-03**: Tất cả thuật toán vật lý sử dụng tích phân số mượt mà (Verlet Integration hoặc RK4 cho cơ học; Kirchhoff matrix solver cho mạch điện; Ray Tracing 2D cho quang học).

### 3. Giao diện & Trải nghiệm Người dùng (UI/UX)
4. **FR-04**: Hỗ trợ 100% tiếng Việt với thuật ngữ chuẩn SGK Vật lý GDPT 2018 Việt Nam.
5. **FR-05**: Hỗ trợ đầy đủ tương tác đa điểm (Touch events) cho máy tính bảng, điện thoại và chuột cho PC/Laptop.

---

## Non-Functional Requirements

- **Performance**: Frame rate đạt 60 FPS ổn định trên Canvas 2D; thời gian tải trang đầu tiên (FCP) < 1.5 giây.
- **Usability**: Giao diện đạt chuẩn WAG/Accessibility, màu sắc tương phản cao, phông chữ Inter/Roboto rõ ràng.
- **Compatibility**: Hoạt động mượt mà trên tất cả các trình duyệt hiện đại (Chrome, Safari, Edge, Firefox) mà không cần cài đặt plugin/extension.
- **Responsiveness**: Tự động co giãn theo độ phân giải màn hình từ Mobile (375px) đến Desktop (4K).

---

## Success Criteria

- [ ] Hiệu năng mô phỏng: Đạt 60 FPS ổn định khi kéo thả đối tượng và vẽ đồ thị đồng thời.
- [ ] Số lượng mô phỏng MVP (Giai đoạn 1): Đạt tối thiểu 3 bài thí nghiệm hoàn chỉnh (1 Mạch điện DC, 1 Con lắc đơn/lò xo, 1 Thấu kính quang học).
- [ ] Độ chính xác lý thuyết: Thuật toán mô phỏng sai số < 1% so với công thức lý thuyết SGK.
- [ ] Thời gian phản hồi điều khiển: Cập nhật thông số slider phản hồi ngay lập tức (< 16ms per frame).

---

## Technical Architecture & Stack

- **Frontend**: React + TypeScript + HTML5 Canvas 2D & SVG Interactive Renderer
- **Backend API**: Java (Spring Boot) - Quản lý danh mục bài học, lưu trữ presets bài tập và cấu hình bài thí nghiệm.
- **Physics Solver Engine**: Pure JS/TS Kirchhoff Matrix Solver cho mạch điện; Euler/Verlet numerical integration cho cơ học.
- **Export & Sharing**:
  1. Export PNG/SVG screenshot của vùng mô phỏng.
  2. Encode/Decode trạng thái mô phỏng qua URL Query String để chia sẻ bài tập trực tiếp qua link.

---

## MVP 1 Focus: Mô phỏng Mạch Điện DC Cơ Bản

- **Linh kiện hỗ trợ**: Pin (Nguồn điện DC), Bóng đèn, Điện trở, Công tắc (Switch), Dây dẫn, Ampe kế (Ammeter), Von kế (Voltmeter).
- **Tính năng chính**:
  - Kéo thả linh kiện trên grid 2D, tự động hít điểm nối (snapping nodes).
  - Điều chỉnh điện áp $U$ của Pin ($0 - 24V$), điện trở $R$ ($1 - 100\Omega$).
  - Tính toán và hiển thị đúng chỉ số Ampe kế (dòng điện $I$) và Von kế (hiệu điện thế $U$) theo Định luật Ohm ($I = U/R$) và Định luật Kirchhoff.
  - Hiệu ứng trực quan: Bóng đèn sáng theo công suất $P = I^2 R$, hiển thị dòng hạt electron di chuyển theo chiều dòng điện.

---

## Out of Scope (MVP 1)

- Đồ họa WebGL 3D.
- Kết nối thiết bị phần cứng IoT bên ngoài.
- Dòng điện xoay chiều AC & Mạch RLC (sẽ phát triển ở giai đoạn tiếp theo).

---

## Assumptions

- Học sinh và giáo viên truy cập qua trình duyệt web chuẩn (Chrome/Safari/Edge) có hỗ trợ Canvas 2D và SVG.
- Các bài thí nghiệm bám sát theo khung chương trình GDPT 2018 môn Vật lý của Bộ Giáo dục và Đào tạo Việt Nam.
