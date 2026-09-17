# Đặc Tả Kỹ Thuật (Spec): Thiết Kế Lại Thí Nghiệm Nhiệt Nóng Chảy Riêng 3D

**Mã bài thí nghiệm:** `sim-latent-heat`  
**Tiêu chuẩn áp dụng:** `/visuallab-standards` & SGK Vật lý 12 GDPT 2018 (Bài 5: Thực hành đo nhiệt nóng chảy riêng của nước đá)  
**Mục đích:** Đặc tả kiến trúc, công thức vật lý, 3 nhiệm vụ đề bài, tiêu chí chấm điểm và tích hợp nộp bài cho module `LatentHeatLab`.

---

## 1. Yêu Cầu Chức Năng

### 1.1. Bàn Thí Nghiệm 3D (`LatentHeatWorkbench3D.tsx` & `LatentHeatWorkbenchHudDock.tsx`)
- **Mô hình 3D**:
  - Bình nhiệt lượng kế (Calorimeter) trong suốt, có lớp chân không / xốp cách nhiệt.
  - Lớp nước ấm bên trong ($m_n = 250\text{g}$, nhiệt độ ban đầu $t_1 = 40^\circ\text{C}$).
  - Khối nước đá viên 3D ở $0^\circ\text{C}$ ($m_{\text{đá}} = 20\text{g}, 35\text{g}, 50\text{g}$ theo đề bài) thả vào nước, tan dần (scale nhỏ dần theo thời gian đến khi tan hết).
  - Que khuấy 3D xoay nhẹ để hòa tan và đạt cân bằng nhiệt.
  - Nhiệt kế điện tử kỹ thuật số hiển thị nhiệt độ tức thời hạ dần từ $t_1 \to t_{cb}$.
- **Thanh HUD**:
  - Slider/chọn khối lượng đá $m_{\text{đá}}$, nút "Thả Đá & Bắt Đầu Hòa Tan", nút "Đặt Lại", và nút "+ Ghi Số Liệu".

### 1.2. Mô hình Vật Lý (`latentHeatLabEngine.ts`)
- Công thức tính nhiệt độ cân bằng lý thuyết:
  $$t_{cb} = \frac{m_n c_n t_1 - m_{\text{đá}} \lambda}{(m_n + m_{\text{đá}}) c_n}$$
  *(Với $c_n = 4180\text{ J/(kg}\cdot\text{K)}$, $\lambda_{\text{lý thuyết}} = 3.34 \times 10^5\text{ J/kg}$, kèm sai số ngẫu nhiên thực nghiệm $\pm 2.0\%$)*.
- Công thức tính nhiệt nóng chảy riêng thực nghiệm:
  $$\lambda = \frac{m_n c_n (t_1 - t_{cb}) - m_{\text{đá}} c_n t_{cb}}{m_{\text{đá}}}$$

### 1.3. Phiếu Thực Hành Wizard 3 Bước (`LatentHeatLabWizardWorksheet.tsx`)
- **Bước 1: 3 Nhiệm vụ đề bài**:
  - Nhiệm vụ 1: $m_{\text{đá}} = 20\text{g}$ ($0.02\text{ kg}$).
  - Nhiệm vụ 2: $m_{\text{đá}} = 35\text{g}$ ($0.035\text{ kg}$).
  - Nhiệm vụ 3: $m_{\text{đá}} = 50\text{g}$ ($0.05\text{ kg}$).
- **Bước 2: Bảng số liệu, Tính toán sai số & Nhận xét**:
  - Bảng đo: $m_n, m_{\text{đá}}, t_1, t_{cb}$, tính $\lambda$ cho từng lần đo.
  - Tính $\overline{\lambda}$, sai số tuyệt đối $\Delta \lambda$, sai số tỉ đối $\delta \lambda$.
  - Ô nhận xét hiện tượng: Mối quan hệ giữa lượng đá tan và độ giảm nhiệt độ, nguyên nhân thất thoát nhiệt.
- **Bước 3: Đồ thị & Nộp bài**:
  - Đồ thị quá trình cân bằng nhiệt $T(t)$ theo thời gian.
  - 3 câu trắc nghiệm SGK Vật lý 12 GDPT 2018.
  - Nút "📝 Nộp Bài & Tính Điểm Thí Nghiệm" $\to$ Chấm điểm 3 tầng (Thao tác 3đ, Sai số 4đ, Trắc nghiệm 3đ $\to$ Tổng / 10.0).
  - Nút "🚀 Nộp Bài Vào Bài Tập Được Giao" (nếu có `onOpenSubmissionDrawer`).

---

## 2. Tiêu Chuẩn Chấm Điểm 3 Tầng (`visuallab-standards`)
- **Thao tác (3.0đ)**: Hoàn thành đủ 3 nhiệm vụ đề bài ($m_{\text{đá}} = 20\text{g}, 35\text{g}, 50\text{g}$) $\to 3.0$ điểm (mỗi nhiệm vụ 1.0đ).
- **Sai số & Tính toán (4.0đ)**: $\lambda$ trung bình xấp xỉ $3.34 \times 10^5\text{ J/kg}$ (sai số $\le 6\%$) và tính đúng sai số $\to 4.0$ điểm.
- **Trắc nghiệm (3.0đ)**: 3 câu hỏi trắc nghiệm SGK GDPT 2018 (mỗi câu 1.0đ).

---

## 3. Tích Hợp Hệ Thống
- Đăng ký `sim-latent-heat` (`LAB_LATENT_HEAT`) trong `worksheetSchemas.ts`.
- Tự động lưu `edulab_latent_heat_grade_result` vào `localStorage`.
- Đồng bộ với `FloatingAssignmentDrawer.tsx`.
