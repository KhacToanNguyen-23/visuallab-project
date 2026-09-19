# Brainstorm: Tái Cấu Trúc Mô Phỏng Va Chạm & Bảo Toàn Động Lượng (Momentum Collision Lab)

**Date:** 2026-09-18  
**Module:** `/lab/momentum-collision` (SGK Vật lý 10 GDPT 2018 / Bài 18, 19: Động lượng & Định luật bảo toàn động lượng)  
**Standard:** `/visuallab-standards`

---

## 1. Ideas Explored
- **Option A (2D Canvas only)**: Giữ Canvas 2D hiện tại nhưng nâng cấp UI. (Bỏ qua vì không mang lại tính trực quan chân thực của máng đệm không khí, cổng quang điện và quả cân).
- **Option B (3D Studio Three.js + Air Track + Spring Launcher Slider + Dual Photogate 3D Timer + Elastic/Inelastic Toggle)**:
  - Máng đệm không khí 3D (Air Track) nằm ngang với thước đo milimet.
  - 2 Xe trượt ($G_1, G_2$) có cờ chắn sáng ($d = 2\text{ cm}$), quả cân tùy chỉnh khối lượng ($m_1, m_2 \in [100\text{g}, 300\text{g}]$).
  - Thanh kéo lò xo tùy chỉnh lực nén / vận tốc đẩy ban đầu ($v_0 \in [0.5, 2.0]\text{ m/s}$).
  - Đầu va chạm hoán đổi: Lò xo đàn hồi (Elastic) vs Đầu dính sáp/nam châm (Inelastic).
  - 2 Cổng quang điện nối với Đồng hồ kỹ thuật số LED 3D hiển thị thời gian $\Delta t_1, \Delta t_2$ (độ phân giải $0.001\text{ s}$).
  - Wizard Worksheet 3 bước: 3 nhiệm vụ đề bài (đàn hồi cùng khối lượng, đàn hồi khác khối lượng, va chạm mềm), bảng số liệu tự động tính $p_{\text{trước}}, p_{\text{sau}}, \delta p\%$, nhận xét thực nghiệm với gợi ý nhanh, 3 câu trắc nghiệm SGK.
  - Chấm điểm 3 tầng $30-40-30$, nút nộp bài và đồng bộ `FloatingAssignmentDrawer`.

---

## 2. User's Direction
- Đồng hồ thời gian kỹ thuật số hiển thị trực tiếp trên mặt bàn thí nghiệm 3D.
- Hỗ trợ thanh kéo lò xo tùy chỉnh lực đẩy ban đầu để học sinh làm chủ vận tốc xuất phát của xe 1.

---

## 3. Physical Models & Formulas
- **Vận tốc đo qua cổng quang**:
  $$v = \frac{d}{\Delta t}$$
- **Tổng động lượng trước va chạm**:
  $$p_{\text{trước}} = m_1 v_1 + m_2 v_2 \quad (\text{với } v_2 = 0 \implies p_{\text{trước}} = m_1 v_1)$$
- **Va chạm đàn hồi 1 chiều (Elastic Collision)**:
  $$v_1' = \frac{m_1 - m_2}{m_1 + m_2} v_1, \quad v_2' = \frac{2 m_1}{m_1 + m_2} v_1$$
- **Va chạm mềm 1 chiều (Inelastic Collision)**:
  $$v' = v_1' = v_2' = \frac{m_1 v_1}{m_1 + m_2}$$
- **Tổng động lượng sau va chạm**:
  $$p_{\text{sau}} = m_1 v_1' + m_2 v_2'$$
- **Sai số bảo toàn động lượng**:
  $$\delta p\% = \frac{|p_{\text{sau}} - p_{\text{trước}}|}{p_{\text{trước}}} \times 100\%$$

---

## 4. Key Missions (3 Nhiệm Vụ Đề Bài)
1. **Nhiệm vụ 1**: Va chạm đàn hồi $m_1 = m_2 = 200\text{g}$, xe 2 đứng yên $\to v_1' \approx 0, v_2' \approx v_1$, kiểm chứng chuyển giao toàn bộ động lượng.
2. **Nhiệm vụ 2**: Va chạm đàn hồi $m_1 = 300\text{g}, m_2 = 150\text{g}$, xe 2 đứng yên $\to v_1' > 0, v_2' > 0$, kiểm chứng $p_{\text{trước}} = p_{\text{sau}}$.
3. **Nhiệm vụ 3**: Va chạm mềm $m_1 = 200\text{g}, m_2 = 200\text{g} \to 2$ xe dính nhau chuyển động $v' = v_1 / 2$, kiểm chứng bảo toàn động lượng trong va chạm mềm.
