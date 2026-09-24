# Phase 5: Grade 10 Hooke's Law Curriculum Scenario & Auto-Grading

**File:** `plans/2d-workbench-sandbox/phase-05-curriculum-hooke-autograde.md`  
**Story Mapping:** `curriculum-grade10-hooke-auto-grading` [P1]  

---

## 1. Objective
Đóng gói kịch bản thực hành bài học theo SGK GDPT 2018: **Lớp 10 - Bài 38: Thực hành khảo sát định luật Hooke và đo độ cứng của lò xo**, tích hợp bảng ghi số liệu thực nghiệm và thuật toán chấm điểm tự động 3 tiêu chí.

---

## 2. Proposed Changes

### `frontend/src/engine/workbench/scenarios/HookeLawScenario.ts` [NEW]
- Khởi tạo mặt bàn mẫu:
  - 1 Giá đỡ đứng kẹp sẵn ở vị trí $x = 350, y = 150$.
  - 1 Lò xo xoắn gắn vào kẹp giá đỡ với $k = 40\text{N/m}$, chiều dài tự nhiên $l_0 = 12\text{cm}$.
  - Hộp chứa các quả cân $50\text{g}, 100\text{g}, 200\text{g}$ đặt trên khay cạnh bàn.
  - Thước đo milimét đặt dọc sát cạnh lò xo.

### `frontend/src/components/workbench/DataTablePanel.tsx` [NEW]
- Bảng thu thập số liệu:
  - Cột: Lần đo ($i$), Khối lượng tải $m (\text{kg})$, Lực đàn hồi $F = P = mg (\text{N})$, Chiều dài $l (\text{cm})$, Độ dãn $\Delta l = l - l_0 (\text{cm})$, Độ cứng $k_i = F / \Delta l (\text{N/m})$.
  - Nút "Ghi số liệu" tự động đọc giá trị hiện tại từ cảm biến/mô phỏng.
  - Tự động tính giá trị trung bình $\bar{k}$ và sai số $\Delta k$.

### `frontend/src/engine/workbench/grading/HookeAutoGrader.ts` [NEW]
- Áp dụng công thức chuẩn VisualLab:
  $$\text{Tổng Điểm} = \text{Thao tác (30%)} + \text{Sai số (40%)} + \text{Báo cáo (30%)}$$
  1. **Thao tác (30%):** Học sinh thực hiện tối thiểu $N \ge 3$ lần treo tải khác nhau.
  2. **Sai số (40%):** So sánh $\bar{k}$ đo được với $k_{\text{thực}} = 40\text{N/m}$:
     $$\text{Error} = \frac{|\bar{k} - k_{\text{thực}}|}{k_{\text{thực}}} \times 100\%$$
     Điểm tối đa 40 nếu $\text{Error} \le 5\%$.
  3. **Báo cáo trắc nghiệm (30%):** 3 câu hỏi trắc nghiệm kiểm tra bản chất định luật Hooke và giới hạn đàn hồi.

---

## 3. Verification Criteria
- Bấm "Ghi số liệu" nạp đúng các cặp $(m, \Delta l)$ vào bảng sau mỗi lần móc thêm quả cân.
- Khi học sinh hoàn thành $\ge 3$ lần đo và nộp bài, hệ thống tính ra bảng điểm chi tiết kèm nhận xét phản hồi ngay lập tức.
