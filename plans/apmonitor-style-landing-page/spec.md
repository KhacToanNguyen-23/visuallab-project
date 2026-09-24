# Spec: VisualLab Landing Page Refactor (APMonitor Academic Editorial Style)

**Date:** 2026-09-23  
**Status:** Ready  

---

## Problem Statement

Landing page hiện tại của VisualLab mang phong cách thiết kế chung chung, chưa làm nổi bật được tính học thuật chuẩn mực, độ tin cậy khoa học của chương trình GDPT 2018, và thiếu tính năng tra cứu nhanh bài học dành cho 2 đối tượng trọng tâm: Học sinh THPT và Giáo viên Vật lý. Refactor sang phong cách Academic Editorial (tương tự APMonitor) với Command Palette `⌘K`, hệ thống phân loại mã bài học Monospace, điều hướng Mega-panel và khu vực Interactive Workbench sẽ nâng tầm trải nghiệm và độ uy tín của nền tảng.

---

## User Stories

- **[P1]** As a **Học sinh THPT**, I want to search and jump directly to any physics lab module using a Command Palette (`⌘K` / `Ctrl+K`) or the Lab Catalog so that I can immediately start experimenting without browsing through complex menus.  
  *Accepted when:* Pressing `⌘K` or clicking "Tìm bài thí nghiệm" opens a searchable dialog with instant filtering across all GDPT 2018 labs (Lớp 10, 11, 12).

- **[P1]** As a **Giáo viên Vật lý**, I want to clearly view the curriculum alignment (GDPT 2018, learning outcomes, virtual instruments, and auto-grading specs) so that I can trust and adopt VisualLab for classroom teaching and homework assignments.  
  *Accepted when:* The landing page showcases verified learning standards, virtual instrument capabilities (Cổng quang, Đồng hồ đo, Cảm biến lực), and dedicated teacher value propositions.

- **[P1]** As a **Visitor (Student/Teacher)**, I want to experience a live interactive physics preview widget directly on the landing page so that I can see the real-time simulation capability before logging in.  
  *Accepted when:* An interactive canvas widget (e.g. spring-mass oscillator or wave simulation) is playable directly on the page with parameter sliders.

- **[P2]** As a **User**, I want a sleek Mega-panel navigation organized by Grade Level (10, 11, 12), Instruments, and Teacher Resources with smooth open/close and keyboard accessibility.  
  *Accepted when:* Clicking "Khám phá" smoothly displays categorized links with full responsive support on desktop and mobile.

- **[P3]** Multi-language switch (EN / VI) for international science competitions (out of scope for MVP).

---

## Functional Requirements

1. **FR-01 (Modern Academic Header):**
   * Logo VisualLab + badge `GDPT 2018`.
   * Mega-menu dropdown ("Khám phá") chia 3 cột: *Học sinh (Lớp 10, 11, 12)*, *Giáo viên (Giáo án & Chấm tự động)*, *Thiết bị & Dụng cụ ảo*.
   * Command Palette trigger button (`Tìm nhanh bài học... ⌘K`).
   * Dark/Light theme toggle và nút Đăng nhập / Đăng ký / Avatar Menu nếu đã đăng nhập.

2. **FR-02 (Command Palette Dialog `⌘K`):**
   * Phím tắt toàn cục `Ctrl+K` / `⌘K` hoặc click mở `<dialog>` tìm kiếm.
   * Tìm kiếm theo tên bài, mã bài học (VD: `VL10-DH01`, `VL11-DD01`), từ khóa (VD: con lắc, sóng, điện, quang, nhiệt).
   * Điều hướng phím mũi tên Lên/Xuống và `Enter` để vào thẳng phòng lab tương ứng.

3. **FR-03 (Hero Section with Proof Rail):**
   * Tiêu đề chính dạng Academic Manifesto: *"Khám phá. Mô phỏng. Thực nghiệm. Đo lường."*
   * Subtitle giới thiệu chuẩn GDPT 2018.
   * Action CTA kép: `[Vào làm Thí nghiệm]` và `[Dành cho Giáo viên]`.
   * Hero Proof Rail: Hộp chỉ mục nhanh 4 hướng đi (`01 Học sinh`, `02 Giáo viên`, `03 Dụng cụ đo lường ảo`, `04 Tiêu chuẩn thẩm định`).

4. **FR-04 (Metrics & Curriculum Strip):**
   * 4 chỉ số nổi bật: `100%` Chuẩn GDPT 2018, `30+` Phòng Lab 2D/3D, `0.01s` Độ trễ thời gian thực, `3 Khối lớp` (10, 11, 12).

5. **FR-05 (Dual-Track Value Section):**
   * Tab hoặc 2 cột so sánh trực quan giá trị cốt lõi mang lại cho Học sinh vs Giáo viên.

6. **FR-06 (Lab Catalog Grid with Monospace Code):**
   * Grid danh sách bài lab tiêu biểu với mã định danh monospace (`VL10-DH01`, `VL11-DD01`, `VL11-SG02`, `VL12-KT01`...).
   * Thông số kỹ thuật hiển thị tinh gọn: Khối lớp, thời lượng thực hành, dạng mô phỏng (2D Canvas / 3D Three.js).

7. **FR-07 (Interactive Workbench & Virtual Instruments Showcase):**
   * Bố cục tương phản (Dark band hoặc Panel nổi bật):
     - Trái: Bảng đặc tả thiết bị thực hành ảo (`<dl>` với Cảm biến, Sai số dụng cụ, Thuật toán giải tích Euler/Verlet).
     - Phải: Live Interactive Physics Widget có thể kéo thả tương tác ngay trên landing page.

8. **FR-08 (Academic Footer):**
   * Footer tối giản, cung cấp liên kết tài liệu hướng dẫn, tiêu chuẩn SGK, hỗ trợ kỹ thuật và thông tin bản quyền.

---

## Non-Functional Requirements

- **Performance:** First Contentful Paint (FCP) < 1.0s, tương tác Command Palette phản hồi dưới 50ms khi gõ tìm kiếm.
- **Accessibility:** Hỗ trợ đầy đủ phím tắt `Esc` để đóng dialog, `Tab` focus hợp lệ, nhãn `aria-label` và `aria-expanded` chuẩn.
- **Theme Compatibility:** Hỗ trợ hoàn hảo cả 2 chế độ Dark Mode và Light Mode kế thừa hệ thống CSS variables `--bg-main`, `--bg-panel`, `--border-color`, `--accent-primary`.

---

## Success Criteria

- [ ] Command Palette (`⌘K`) hoạt động mượt mà, tìm kiếm được tất cả các bài thí nghiệm mẫu.
- [ ] Mega-menu hiển thị rõ ràng 2 luồng Học sinh và Giáo viên.
- [ ] Tích hợp ít nhất 1 Mini Live Interactive Physics Canvas trên landing page hoạt động tương tác thời gian thực.
- [ ] 100% tương thích cả Light mode & Dark mode, không lỗi vỡ giao diện trên Mobile/Tablet/Desktop.

---

## Out of Scope

- Không thay đổi logic backend của API Authentication và Class Management.
- Không thay đổi các trang không gian riêng bên trong (`/student/*`, `/teacher/*`, `/admin/*`).

---

## Assumptions

- Các bài thí nghiệm đã có sẵn route chuyển hướng (`/lab/...` hoặc `/student/classes`).
- VisualLab đã có hệ thống biến màu sắc chuẩn trong `ThemeContext`.
