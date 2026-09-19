# Phase 3: Assignment Drawer & Workbench Bidirectional Sync

## 1. Goal
Đồng bộ hai chiều giữa `StudentLabAssignmentWorkbenchPage`, `FloatingAssignmentDrawer`, và các bài thực hành:
1. Khi học sinh làm bài trên lab $\to$ Drawer nhận diện được trạng thái "Đang thực hiện (đã đo $N$ lần)".
2. Khi học sinh bấm nộp bài trong bài lab $\to$ Drawer nhận kết quả chấm điểm ngay lập tức và cho phép xác nhận nộp lên hệ thống giáo viên.
3. Khi bài nộp thành công $\to$ xóa draft của assignment đó và hiển thị thẻ "ĐÃ NỘP BÀI" (Read-only review mode).

## 2. Verification
- Test trọn vẹn luồng từ khi nhận bài $\to$ đo đạc $\to$ F5 $\to$ nộp bài $\to$ điểm số hiển thị trên dashboard của giáo viên.
