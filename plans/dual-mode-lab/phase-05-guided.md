# Phase 5: Guided Lab Engine & Auto-grading

## Goal
Xây dựng engine điều khiển luồng cho các bài thực hành theo SGK (Guided Lab) với step-by-step guidance và module tự động chấm điểm.

## Stories Covered
- **[P1]** As a Học sinh, I want to mở bài thực hành theo giáo trình (Guided Lab) so that tôi làm theo quy trình step-by-step và được chấm điểm tự động.

## File Ownership
- Guided Lab Page: `frontend/src/pages/lab/GuidedLab.tsx`
- Lab Steps Config: `frontend/src/config/labs/*.json` (Cấu hình các bước cho 14 bài)
- Auto-grader: `frontend/src/services/AutoGrader.ts`

## Proposed Changes
1. **Lab Configuration**
   - Mỗi bài lab (ví dụ: Bài 6 - Tốc độ vật chuyển động) có 1 file config định nghĩa: mảng các dụng cụ được phép dùng (restrict toolbar), các bước thực hành (step 1, step 2...), và công thức nghiệm đúng.
2. **Step-by-step UI**
   - Hiển thị bảng "Hướng dẫn thực hành" nổi trên màn hình.
   - Nút "Tiếp tục" bị khóa cho đến khi HS hoàn thành action của step (ví dụ: Cảm biến báo đã lắp `PHOTOGATE_SENSOR` đúng vị trí).
3. **Auto-grading Logic**
   - Tính 30% Điểm thao tác: check `useLabStore().entities` có đủ và đúng vị trí config yêu cầu không.
   - Tính 40% Điểm sai số: so sánh Data Log của HS so với công thức lý thuyết của bài.
   - Khi HS submit, post tổng điểm về `POST /api/assignments/{id}/submit`.

## Tests to Write First
- Unit test cho module `AutoGrader.ts` với các trường hợp dữ liệu mẫu (đúng hoàn toàn, sai số > 5%, thiếu bước).
