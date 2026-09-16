# Báo Cáo Brainstorm: Thiết Kế Lại Thí Nghiệm Nhiệt Nóng Chảy Riêng (Vật Lý 12)

**Ngày thực hiện:** 26/09/2026  
**Chủ đề:** Tái cấu trúc module thí nghiệm Đo Nhiệt Nóng Chảy Riêng của Nước Đá theo tiêu chuẩn `/visuallab-standards` & SGK Vật lý 12 GDPT 2018 (Bài 5).  
**Trạng thái:** Hoàn thành brainstorm, sẵn sàng tạo `spec.md`.

---

## 1. Mục Tiêu & Cơ Sở Khoa Học

- **Mục tiêu**: Xây dựng lại module `/lab/latent-heat` theo chuẩn **3D Three.js Studio** kết hợp phiếu thực hành **Wizard 3 bước**, tích hợp telemetry, tự động chấm điểm theo thang điểm 10 (Thao tác 30%, Sai số 40%, Trắc nghiệm 30%) và đồng bộ nộp bài với `FloatingAssignmentDrawer`.
- **Chương trình chuẩn**: SGK Vật lý 12 GDPT 2018 - Chủ đề: Khí lý tưởng & Nhiệt học - Bài 5: Thực hành đo nhiệt nóng chảy riêng của nước đá.
- **Công thức cốt lõi**:
  $$Q_{\text{tỏa}} = Q_{\text{thu}} \iff m_n \cdot c_n \cdot (t_1 - t_{cb}) = m_{\text{đá}} \cdot \lambda + m_{\text{đá}} \cdot c_n \cdot (t_{cb} - 0)$$
  $$\implies \lambda = \frac{m_n \cdot c_n \cdot (t_1 - t_{cb}) - m_{\text{đá}} \cdot c_n \cdot t_{cb}}{m_{\text{đá}}}$$
  *(Với $c_n = 4180\text{ J/(kg}\cdot\text{K)}$, lý thuyết $\lambda \approx 3.34 \times 10^5\text{ J/kg}$)*.

---

## 2. Kiến Trúc & Quyết Định Thiết Kế

### 2.1. Phân hệ 3D Three.js Studio (`LatentHeatWorkbench3D.tsx`)
- Bình nhiệt lượng kế 3D trong suốt có lớp xốp cách nhiệt.
- Nước ấm ban đầu ($m_n = 200\text{g} \div 300\text{g}$, $t_1 = 40^\circ\text{C} \div 50^\circ\text{C}$).
- Khối nước đá viên 3D ở $0^\circ\text{C}$ thả vào nước, tan dần theo tiến trình cân bằng nhiệt.
- Que khuấy nhẹ nhàng để nhiệt độ đồng đều.
- Cảm biến nhiệt kế kỹ thuật số LED hiển thị nhiệt độ tức thời $t$ và cân điện tử hiển thị $m_{\text{đá}}$.

### 2.2. Phiếu Báo Cáo Wizard 3 Bước (`LatentHeatLabWizardWorksheet.tsx`)
- **Bước 1 (3 Nhiệm vụ đề bài)**:
  - Nhiệm vụ 1: Khối lượng đá $m_{\text{đá}} = 20\text{g}$ ($0.02\text{ kg}$).
  - Nhiệm vụ 2: Khối lượng đá $m_{\text{đá}} = 35\text{g}$ ($0.035\text{ kg}$).
  - Nhiệm vụ 3: Khối lượng đá $m_{\text{đá}} = 50\text{g}$ ($0.05\text{ kg}$).
- **Bước 2 (Bảng số liệu & Sai số & Nhận xét)**:
  - Bảng ghi chép $m_n$, $m_{\text{đá}}$, $t_1$, $t_{cb}$, tính $\lambda$, $\overline{\lambda}$, sai số tuyệt đối $\Delta \lambda$, sai số tỉ đối $\delta \lambda$.
  - Ô nhận xét hiện tượng (sự giảm nhiệt độ, quá trình hấp thụ nhiệt của nước đá, các nguyên nhân gây sai số tỏa nhiệt ra môi trường).
- **Bước 3 (Đồ thị & Nộp bài)**:
  - Đồ thị $T - t$ (Nhiệt độ giảm dần tới trạng thái cân bằng nhiệt $t_{cb}$).
  - 3 câu hỏi trắc nghiệm SGK GDPT 2018.
  - Nút "Nộp Bài & Tính Điểm Thí Nghiệm" $\to$ Chấm điểm 3 tầng (3-4-3) và nút nộp bài vào bài tập nếu được giao.

---

## 3. Cấu Trúc Module

```
frontend/src/
├── components/
│   └── simulations/
│       └── latent-heat/
│           ├── LatentHeatLab.tsx
│           ├── LatentHeatWorkbench3D.tsx
│           ├── LatentHeatWorkbenchHudDock.tsx
│           ├── LatentHeatLabWizardWorksheet.tsx
│           └── latentHeatLabEngine.ts
```
