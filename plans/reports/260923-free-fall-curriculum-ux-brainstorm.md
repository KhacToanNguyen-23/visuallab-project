# Brainstorm: Free Fall Curriculum UX

**Date:** 2026-09-23

## Ideas Explored
1. **Guided / Tối giản**: Dụng cụ ráp sẵn cố định, học sinh chỉ nhập tọa độ cổng quang để trượt lên xuống, bấm "Thả bi". Dễ lập trình, tránh sai sót cơ học, nhưng hơi khô khan.
2. **Kéo thả tương tác cao (Sandbox-style)**: Có hộp công cụ (Toolbox), học sinh tự lắp ráp giá đỡ, gắn đồng hồ, cắm dây diện vào cổng quang rồi tự canh chỉnh. Mang lại cảm giác thực tế cao nhưng rủi ro "lỗi tương tác vi mô" (đặt lệch cổng quang 1 pixel làm bi rơi xuyên qua).
3. **Hybrid (Lắp ráp dọc trục)**: Thiết bị cố định trên màn hình (để hỗ trợ chấm điểm và chống nhiễu vật lý). Tuy nhiên học sinh có quyền trượt cổng quang lên xuống dọc theo trục Y của giá đỡ, đổi khối lượng bi, tự bấm công tắc nam châm. Cân bằng hoàn hảo giữa tính sư phạm và tương tác.

## User's Direction
Người dùng chọn hướng **Hybrid (Lắp ráp bán tự động / Guided Assembly dọc trục)**. Trọng tâm của bài lab này là lấy số liệu, vẽ đồ thị và tính toán sai số, nên việc cố định đồ họa sẽ giúp hệ thống Auto-Grading ổn định, đồng thời học sinh vẫn có tính tương tác khi trực tiếp thay đổi tham số khoảng cách (s).

## Open Questions
- Không có.

## Risks
- Nếu kéo quá nhanh, cổng quang E và F có thể bị trùng tọa độ Y gây lỗi logic đo đạc (Cần ràng buộc tọa độ $Y_E < Y_F - \text{khoảng đệm}$).
