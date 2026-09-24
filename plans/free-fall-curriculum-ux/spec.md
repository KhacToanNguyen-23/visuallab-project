# Spec: Free Fall Curriculum Lab UX (Hybrid)

**Date:** 2026-09-23
**Status:** Ready

---

## Problem Statement
Bài thực hành Đo gia tốc rơi tự do SGK Vật lý 10 cần một môi trường ảo vừa đủ trực quan để học sinh thao tác, nhưng cũng phải đủ "vững chắc" để hệ thống Auto-Grading có thể theo dõi và chấm điểm (tránh trường hợp học sinh đặt lệch dụng cụ làm hỏng thí nghiệm).

---

## User Stories

- **[P1]** As a học sinh, I want to dùng chuột kéo trượt cổng quang E và F lên/xuống dọc theo giá đỡ so that thay đổi được quãng đường rơi $s$.
  Accepted when: Cổng E và F chỉ trượt theo trục Y, và E luôn cao hơn F ít nhất 10cm.

- **[P1]** As a học sinh, I want to bấm nút "Thả bi" / "Nhả nam châm" so that đo được thời gian $t$ hiển thị trên đồng hồ số.
  Accepted when: Thời gian $t_1, t_2$ được cập nhật lên bảng số liệu bên cạnh ngay lập tức.

- **[P1]** As a hệ thống chấm điểm, I want to chặn các thay đổi kiến trúc (không cho kéo cổng quang vứt ra ngoài) so that bảng số liệu luôn hợp lệ để chạy công thức chấm điểm 3 phần.
  Accepted when: Các thiết bị có trạng thái `isLockedX = true`.

- **[P2]** As a học sinh, I want to bấm nút "Đổi bi" so that thử nghiệm với khối lượng khác (chứng minh $g$ không đổi).
  Accepted when: Khối lượng thay đổi nhưng gia tốc không bị ảnh hưởng.

---

## Functional Requirements

1. FR-01: UI hiển thị giá đỡ thẳng đứng, nam châm điện ở mốc $y=0$, cổng E ở $y=0.2m$, cổng F ở $y=0.8m$.
2. FR-02: Cho phép dùng thao tác Drag (Kéo chuột) trên cổng quang để đổi thuộc tính `yProperty`. Trục $X$ bị khóa cứng (Locked).
3. FR-03: Ràng buộc vị trí: $Y_E \ge 0.05m$, $Y_F \ge Y_E + 0.1m$, $Y_F \le 1.0m$.
4. FR-04: Đồng hồ điện tử nhảy số thực tế khi cổng quang báo Trigger.

---

## Non-Functional Requirements

- Performance: Mô phỏng vật lý và kéo thả trơn tru ở 60 FPS (tái sử dụng SceneryStack).
- Tương thích: Hoạt động tốt trên màn hình cảm ứng (iPad/Tablet) thông qua `onPointerDown`.

---

## Success Criteria

- [ ] Kéo cổng quang: Cổng quang bám chặt vào trục Y, không bị rớt ra ngoài.
- [ ] Thả bi: Đồng hồ nhảy số đúng $t_1, t_2$ dựa trên tọa độ Y mới nhất của cổng.

---

## Out of Scope

- Không hỗ trợ ngắt dây điện khỏi cổng quang.
- Không hỗ trợ tự đặt thêm cổng quang số 3.

---

## Assumptions

- Học sinh đã học lý thuyết bài 14 trên lớp và hiểu ý nghĩa của thao tác trượt cổng quang để thay đổi quãng đường $s$.

---
