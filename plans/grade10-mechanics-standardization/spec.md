# Spec: Grade 10 Mechanics Labs Standardization & Filtered Toolbox

**Date:** 2026-09-22  
**Status:** Ready  
**Brainstorm Report:** [plans/reports/260922-grade10-mechanics-standardization-brainstorm.md](file:///d:/Project/FptProject/visuallab-project/plans/reports/260922-grade10-mechanics-standardization-brainstorm.md)

---

## 1. Problem Statement
Hiện tại khay công cụ mở tự do và các bài cơ học Lớp 10 chưa có đủ hình ảnh SVG chi tiết cùng hành vi vật lý động học hoàn chỉnh (máng nghiêng, rơi tự do, ma sát trượt, va chạm đệm khí). Đặc tả này chuẩn hóa trọn bộ 5 bài Cơ học Lớp 10 theo đúng `DacTa.md` và áp dụng bộ lọc chỉ mở đúng danh mục Tool IDs của bài học đó (chỉ mở toàn bộ khi ở Sandbox tự do).

---

## 2. User Stories

- **[P1]** As a student doing a guided lab, I only want to see the standardized equipment from `DacTa.md` in the toolbox so that I don't get confused by unrelated tools from other subjects.  
  *Accepted when:* In `/lab/curriculum/:labId`, `ToolboxDrawer` displays only tools specified in `scenario.toolIds`. In `/workbench`, all tools remain available.

- **[P1]** As a student in Bài 6 (Đo tốc độ) & Bài 14 (Rơi tự do), I want the digital timer to register real pulse intervals when the steel ball triggers photogates so that I get authentic physical measurement data.  
  *Accepted when:* The ball triggers photogates, and `DIGITAL_TIMER` records accurate times $t_A, t_B, \Delta t$.

- **[P1]** As a student in Bài 21 (Ma sát trượt), I want dragging the wooden block with a spring dynamometer to register sliding friction force $F_{ms} = \mu N$ and increase linearly when adding slotted weights.  
  *Accepted when:* Dynamometer needle indicates $F_{ms}$ and responds to added weights on top of the block.

- **[P1]** As a student in Bài 30 (Va chạm đệm khí), I want two gliders on the air track to collide and conserve total linear momentum.  
  *Accepted when:* Gliders collide elastically or inelastically and pass through photogates, verifying $p_1 + p_2 = p'_1 + p'_2$.

---

## 3. Success Criteria
- [ ] Khay công cụ trong các bài thực hành Lớp 10 chỉ hiển thị đúng dụng cụ của bài đó.
- [ ] Khay công cụ trong Sandbox `/workbench` mở đủ toàn bộ danh mục dụng cụ.
- [ ] Đủ 5 kịch bản Cơ học Lớp 10 hoạt động mượt mà ở 60 FPS với SVG sprite độ nét cao.
- [ ] Bảng số liệu tự động đồng bộ giá trị đo đạc và chấm điểm 3 cột (30% + 40% + 30%).
