# Spec: Tái Cấu Trúc Mô Phỏng Va Chạm & Bảo Toàn Động Lượng (Momentum Collision Lab)

**Module**: `/lab/momentum-collision`  
**Grade**: Vật lý 10 / GDPT 2018 (Chủ đề Động lượng & Định luật bảo toàn động lượng)  
**Standard**: `/visuallab-standards`

---

## 1. Mục Tiêu & User Stories

### P1 — User Stories
- **US1 (3D Air Track Studio & Spring Launcher)**: Học sinh tương tác với mô hình máng đệm không khí 3D Three.js, tùy chỉnh thanh kéo lò xo phóng xe $1$ ($v_0 \in [0.5, 2.0]\text{ m/s}$), chọn khối lượng xe trượt $m_1, m_2 \in [100\text{g}, 300\text{g}]$, và chuyển đổi giữa 2 chế độ va chạm Đàn hồi / Mềm.
- **US2 (3D Tabletop Digital Timer & Photogates)**: 2 cổng quang điện gắn trên máng đo thời gian cờ chắn sáng $d = 2\text{ cm}$ đi qua, đồng hồ LED đặt trực tiếp trên mặt bàn 3D hiển thị thời gian $\Delta t_1, \Delta t_2$ chính xác $0.001\text{ s}$.
- **US3 (3-Step Wizard Worksheet)**: Bảng hướng dẫn 3 nhiệm vụ đề bài độc lập (đàn hồi cùng khối lượng, đàn hồi khác khối lượng, va chạm mềm), bảng tính tự động $(m, v, p_{\text{trước}}, p_{\text{sau}}, \delta p\%)$, ô nhận xét thực nghiệm với gợi ý nhanh (chips) và bộ 3 câu hỏi trắc nghiệm SGK.
- **US4 (3-Tier Auto Grading & Submission Sync)**: Chấm điểm tự động $30\%$ Thao tác $+ 40\%$ Độ chính xác bảo toàn $+ 30\%$ Trắc nghiệm $\to 10.0$. Chỉ chấm điểm khi nhấn "Nộp Bài" và hiển thị nút đồng bộ Drawer nộp bài tập được giao.

---

## 2. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

1. **Vật lý Va chạm**:
   - Vận tốc đo: $v = d / \Delta t$ với $d = 0.02\text{ m}$.
   - Tổng động lượng trước và sau va chạm bảo toàn với sai số $\delta p\% \le 5\%$ trong điều kiện thực nghiệm có nhiễu cảm biến nhẹ ($1-2\%$).
   - Va chạm mềm: 2 xe dính nhau di chuyển cùng vận tốc $v' = \frac{m_1 v_1}{m_1 + m_2}$.
2. **Hiển Thị 3D**:
   - Đồng hồ thời gian LED 3D hiển thị rõ nét trên mặt bàn, cập nhật thời gian tức thì khi xe đi qua cổng quang.
   - Thanh trượt lò xo nén lại và bung ra đẩy xe 1 chuyển động 60 FPS mượt mà.
3. **Báo Cáo & Chấm Điểm**:
   - Ghi nhận tối thiểu 3 lần đo theo 3 nhiệm vụ đề bài.
   - Nhấn "📝 Nộp Bài & Tính Điểm Thí Nghiệm" xuất kết quả điểm tổng kết, đánh giá chi tiết và lưu `edulab_momentum_grade_result` vào `localStorage`.
   - Nút "🚀 Nộp Bài Vào Bài Tập Được Giao" kích hoạt khi mở trong bài tập và gửi payload hợp lệ tới backend.

---

## 3. Kiến Trúc Tệp Tin (File Structure)

- `frontend/src/components/simulations/momentum-collision/`
  - `momentumCollisionEngine.ts`: Tính toán vật lý va chạm, vận tốc cổng quang, 3 nhiệm vụ đề bài, và thuật toán chấm điểm 3 tầng $30-40-30$.
  - `MomentumWorkbench3D.tsx`: Three.js Studio với Máng đệm không khí, 2 xe trượt, 2 cổng quang, lò xo phóng xe, và đồng hồ LED kỹ thuật số trên mặt bàn 3D.
  - `MomentumWorkbenchHudDock.tsx`: HUD điều khiển khối lượng $m_1, m_2$, kiểu va chạm Đàn hồi / Mềm, thanh trượt lực phóng lò xo, nút "▶ Phóng Xe 1", "↺ Đặt Lại", "+ Ghi Số Liệu".
  - `MomentumLabWizardWorksheet.tsx`: 3-Step Wizard Worksheet, bảng số liệu, kiểm chứng bảo toàn động lượng, ô nhận xét thực nghiệm và 3 câu hỏi trắc nghiệm.
  - `MomentumCollisionLab.tsx`: Container điều phối chính.
- `frontend/src/components/simulations/MomentumCollisionLab.tsx`: Re-export container mới.
- `frontend/src/utils/worksheetSchemas.ts`: Đăng ký `sim-momentum-collision` / `LAB_MOMENTUM_COLLISION`.
- `frontend/src/components/assignment/FloatingAssignmentDrawer.tsx`: Đồng bộ `edulab_momentum_grade_result`.
