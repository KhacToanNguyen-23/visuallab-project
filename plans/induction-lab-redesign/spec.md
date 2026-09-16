# Spec: Tái Cấu Trúc Mô Phỏng Cảm Ứng Điện Từ (Electromagnetic Induction Lab)

**Module**: `/lab/induction`  
**Grade**: Vật lý 12 / GDPT 2018 (Chủ đề Từ trường & Cảm ứng điện từ)  
**Standard**: `/visuallab-standards`

---

## 1. Mục Tiêu & Yêu Cầu

### P1 — User Stories
- **US1 (3D Interactive Studio)**: Học sinh tương tác với mô hình 3D Three.js gồm cuộn dây Solenoid ($N = 100, 200, 400$ vòng), thanh nam châm vĩnh cửu N-S có thể kéo thả chuột tự do hoặc bấm nút bước chạy tự động (Đưa vào / Rút ra nhanh / chậm), đường sức từ 3D động và bóng đèn LED phát sáng theo dòng cảm ứng.
- **US2 (Hybrid Meters Display)**: Hiển thị song song đồng hồ điện kế kim Galvanometer (thang đo $-50\text{mA} \dots +50\text{mA}$ với kim chỉ thị độ lệch thời gian thực) và Màn hình số LED đo suất điện động $e_c$ (mV).
- **US3 (3-Step Wizard Worksheet)**: Bảng báo cáo thí nghiệm 3 bước hướng dẫn học sinh qua 3 nhiệm vụ đề bài độc lập (khảo sát dấu cực, tốc độ biến thiên, đảo chiều), bảng ghi số liệu, kiểm chứng định luật Faraday & Lenz, ô nhận xét thực nghiệm với gợi ý nhanh (chips) và bộ 3 câu hỏi trắc nghiệm SGK.
- **US4 (3-Tier Auto Grading & Submission Sync)**: Chấm điểm tự động 3 tầng ($30\%$ Thao tác $+ 40\%$ Độ chính xác định luật $+ 30\%$ Trắc nghiệm $\to 10.0$). Nút nộp bài chỉ kích hoạt chấm điểm khi học sinh hoàn thành và hiển thị nút đồng bộ Drawer nộp bài tập được giao.

---

## 2. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

1. **Vật lý & Tương tác**:
   - Khi kéo nam châm lại gần cuộn dây ($dx/dt < 0$ hoặc $dx/dt > 0$), kim điện kế lệch ngay lập tức theo đúng quy tắc Lenz:
     $$e_c = -N \cdot \frac{\Delta \Phi}{\Delta t}$$
   - Khi nam châm dừng lại ($v = 0$), $e_c = 0$ và kim điện kế quay về vạch 0.
   - Khi đảo cực nam châm (N sang S hoặc S sang N) và chuyển động cùng chiều, dấu của $e_c$ và chiều lệch của kim điện kế đảo ngược $180^\circ$.
2. **Kéo Thả Chuột**:
   - Kéo chuột trên thanh nam châm mượt mà, tính toán vận tốc tức thời không bị gián đoạn hay rung lắc.
3. **Bảng Báo Cáo & Nộp Bài**:
   - Ghi lại tối thiểu 3 lần đo ứng với 3 nhiệm vụ đề bài.
   - Nhấn "📝 Nộp Bài & Tính Điểm Thí Nghiệm" xuất kết quả điểm tổng kết, đánh giá chi tiết và lưu `edulab_induction_grade_result` vào `localStorage`.
   - Nút "🚀 Nộp Bài Vào Bài Tập Được Giao" chỉ hiển thị khi mở trong bài tập và gửi payload hợp lệ tới backend.

---

## 3. Kiến Trúc Tệp Tin (File Structure)

- `frontend/src/components/simulations/induction/`
  - `inductionLabEngine.ts`: Physics calculations ($B(x), \Phi(x), e_c(x, v)$), 3 missions schema, evaluation & 3-tier scoring logic.
  - `InductionWorkbench3D.tsx`: Three.js Studio với Solenoid coil, Draggable Bar Magnet, Magnetic Field Lines 3D, LED bulb, và Galvanometer 3D/2D overlay.
  - `InductionWorkbenchHudDock.tsx`: HUD điều khiển thanh trượt số vòng $N$, nút Đảo Cực, nút Đưa Vào / Rút Ra tự động, nút Đặt Lại và Ghi Số Liệu.
  - `InductionLabWizardWorksheet.tsx`: 3-Step Wizard Worksheet, bảng số liệu, kiểm chứng Faraday/Lenz, ô nhận xét thực nghiệm và 3 câu hỏi trắc nghiệm.
  - `InductionLab.tsx`: Container điều phối chính.
- `frontend/src/components/simulations/InductionLab.tsx`: Re-export container mới.
- `frontend/src/utils/worksheetSchemas.ts`: Đăng ký `sim-induction` / `LAB_INDUCTION`.
- `frontend/src/components/assignment/FloatingAssignmentDrawer.tsx`: Đồng bộ `edulab_induction_grade_result`.
