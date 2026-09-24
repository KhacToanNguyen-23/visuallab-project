# Brainstorm: Refactor VisualLab Landing Page theo phong cách APMonitor (Academic Editorial)

**Date:** 2026-09-23  
**Target Users:** Học sinh THPT (Lớp 10, 11, 12) & Giáo viên Vật lý  

---

## 1. Ideas Explored

1. **Ý tưởng 1: Áp dụng nguyên bản 100% phong cách APMonitor (Text-heavy & Code GEKKO)**
   * *Đặc điểm:* Chỉ tập trung vào typography đơn giản, text học thuật, khối code Python.
   * *Đánh giá:* Quá khô cứng đối với học sinh phổ thông; thiếu tính trực quan đồ họa của các hiện tượng Vật lý 2D/3D.

2. **Ý tưởng 2: Giữ nguyên style SaaS gradient hiện tại, chỉ thêm một số card**
   * *Đặc điểm:* Rườm rà hiệu ứng chuyển động thương mại, không tạo được ấn tượng "chuẩn học thuật GDPT 2018".
   * *Đánh giá:* Thiếu tính tra cứu nhanh (`⌘K`), cấu trúc điều hướng chưa tối ưu cho giảng dạy và học tập.

3. **Ý tưởng 3 (Chọn lọc tối ưu): Modern Academic & Interactive Lab (Kết hợp APMonitor + VisualLab Core)**
   * *Đặc điểm:*
     - Thừa hưởng hệ thống typography sạch (`Inter`, `JetBrains Mono` cho mã môn học `VL10-CD1`, `VL11-DD1`), cấu trúc Hero Split + Proof Rail (`01 Học sinh`, `02 Giáo viên`, `03 Dụng cụ ảo`, `04 Chuẩn GDPT 2018`).
     - Tích hợp **Command Palette (`⌘K`)** để học sinh/giáo viên gõ nhanh tên bài thí nghiệm.
     - Mega-panel chia theo 2 luồng: *Góc Học sinh* (Thực hành SGK 10-11-12) & *Góc Giáo viên* (Giáo án số, bài tập tự chấm).
     - Khối **Interactive Lab Bench** tương phản: thay vì hiển thị code Python như APMonitor, hiển thị **Live Interactive Physics Mini-Widget** (kéo thả tương tác tức thì) kèm bảng thông số dụng cụ đo lường ảo.

---

## 2. User's Direction

* Định hướng người dùng trọng tâm: **Học sinh THPT & Giáo viên Vật lý**.
* Mục tiêu: Vừa mang vẻ đẹp học thuật, chuẩn mực, độ tin cậy cao của một cổng phòng thí nghiệm khoa học (giống APMonitor), vừa đảm bảo tính trực quan, hấp dẫn và tiện dụng cho học sinh - giáo viên Việt Nam.

---

## 3. Kiến trúc Đề xuất cho Landing Page mới

### A. Navigation & Search (`⌘K`)
* Logo VisualLab kèm badge `GDPT 2018`.
* Mega-Menu "Khám phá" phân loại rõ: Lớp 10 / Lớp 11 / Lớp 12, Dụng cụ đo lường ảo, Tài nguyên Giáo viên.
* Command Palette (`Ctrl+K` / `⌘K`) hỗ trợ tìm kiếm bài lab theo từ khóa (VD: "con lắc", "khúc xạ", "sóng dừng", "lớp 10").

### B. Hero Section: "Khám phá. Mô phỏng. Thực nghiệm. Đo lường."
* Split Layout:
  * Trái: Thông điệp súc tích, định vị Cổng thí nghiệm Vật lý ảo, 2 CTA phân luồng (`[Vào phòng Lab]` và `[Dành cho Giáo viên]`).
  * Phải: Hero Proof Rail dẫn hướng nhanh tới 4 khu vực (`01 Học sinh`, `02 Giáo viên`, `03 Dụng cụ đo`, `04 Thẩm định SGK`).

### C. Dải Số liệu & Chuẩn SGK (Social Proof)
* Tỷ lệ phủ sóng SGK GDPT 2018 (3 bộ sách KNTT, Cánh Diều, CTST), số lượng phòng lab, độ chính xác mô phỏng thời gian thực.

### D. Dual-track Value Proposition (Học sinh vs Giáo viên)
* **Dành cho Học sinh:** Thực hành không giới hạn, an toàn tuyệt đối, quan sát đồ thị dao động/động lực học thời gian thực.
* **Dành cho Giáo viên:** Trợ giảng trực quan, xuất dữ liệu đo lường sang Excel/CSV, bài tập tự động chấm điểm.

### E. Catalog Thí nghiệm chuẩn GDPT (Course & Lab Grid)
* Thẻ phẳng tinh gọn với mã định danh Monospace: `VL10-DH01`, `VL11-DD01`, `VL11-SG02`, `VL12-KT01`...

### F. Interactive Lab Bench Showcase (Live Workbench)
* Khu vực tương phản cao mô phỏng bàn thực hành Vật lý: Dụng cụ ảo (Cổng quang, Đồng hồ mili giây, Cảm biến lực, Thước kẹp) + Mini Simulation canvas có thể kéo thả trực tiếp.

---

## 4. Open Questions

1. Có cần hỗ trợ chế độ đa ngôn ngữ (Tiếng Việt / English) trong tương lai hay tập trung 100% Tiếng Việt chuẩn GDPT 2018 trước?
2. Mini simulation trên Hero/Showcase nên ưu tiên bài nào (Con lắc lò xo dao động điều hòa hay Con lắc đơn đo gia tốc trọng trường $g$)?

---

## 5. Risks & Mitigations

* **Risk:** Giao diện học thuật quá nhiều chữ có thể làm học sinh THPT cảm thấy nặng nề.
  * **Mitigation:** Luôn kết hợp nhãn Monospace với màu sắc trạng thái rõ ràng, icon trực quan và card có thumbnail đồ thị/hình ảnh mô phỏng đẹp mắt.
* **Risk:** Tích hợp Command Palette `⌘K` có thể trùng phím tắt với một số browser/OS.
  * **Mitigation:** Bắt sự kiện bàn phím an toàn (`e.ctrlKey || e.metaKey` + `key.toLowerCase() === 'k'`), kèm nút bấm trực tiếp trên Header.
