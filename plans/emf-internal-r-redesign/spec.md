# Spec: Thiết Kế Lại Thí Nghiệm Đo Suất Điện Động & Điện Trở Trong (EMF & Internal Resistance Lab)

**Feature Slug:** `emf-internal-r-redesign`
**Curriculum Standard:** SGK GDPT 2018 Vật Lý 11 - Bài Thực Hành Đo Suất Điện Động & Điện Trở Trong Của Nguồn Điện
**Route:** `http://localhost:5173/lab/emf-internal-r`

---

## 1. Mục Tiêu & Mô Hình Vật Lý
- Định luật Ohm cho toàn mạch: $I = \frac{\mathcal{E}}{R + r}$
- Hiệu điện thế hai cực nguồn điện: $U = I \cdot R = \mathcal{E} - I \cdot r$
- Phương trình đường hồi quy thực nghiệm: $U = a \cdot I + b$
  - Suất điện động: $\mathcal{E} = b = U_{(I=0)}$ (V)
  - Điện trở trong: $r = -a = -\frac{\Delta U}{\Delta I}$ ($\Omega$)
- Danh mục nguồn pin khảo sát:
  1. **Pin Đơn 1.5V (Mới)**: $\mathcal{E} = 1.50\text{V}, r = 0.50\Omega$
  2. **Bộ 2 Pin Ghép Nối Tiếp 3.0V**: $\mathcal{E} = 3.00\text{V}, r = 1.00\Omega$
  3. **Pin Cũ (Chai nội trở lớn)**: $\mathcal{E} = 1.45\text{V}, r = 2.80\Omega$

---

## 2. User Stories & Tiêu Chí Nghiệm Thu

### P1 — Core 3D Workbench & Circuit Solver
- **US1.1**: Bàn thí nghiệm 3D với Hộp Pin, Biến trở con chạy trượt mượt mà ($2\Omega \to 100\Omega$), Khóa K đóng/mở mạch, Vôn kế và Ampe kế.
- **US1.2**: Cho phép kéo con chạy biến trở bằng chuột trực tiếp trên 3D hoặc qua slider HUD, chuyển đổi giữa chế độ Vôn/Ampe kế kim vạch và số điện tử.
- **US1.3**: Dòng điện chạy qua mạch làm dây dẫn phát sáng, kim đồng hồ lệch góc chính xác.

### P1 — 3 Nhiệm Vụ Khảo Sát GDPT 2018
- **Nhiệm vụ 1 (Đo Pin Đơn 1.5V)**: Đóng khóa K, đo ít nhất 4 giá trị $R$ ($5\Omega, 10\Omega, 20\Omega, 50\Omega$), vẽ đồ thị suy ra $\mathcal{E} \approx 1.5\text{V}, r \approx 0.5\Omega$.
- **Nhiệm vụ 2 (Đo Bộ 2 Pin Nối Tiếp 3.0V)**: Đổi sang hộp nguồn đôi, đo $U-I$, chứng minh $\mathcal{E}_{\text{bộ}} \approx 3.0\text{V}, r_{\text{bộ}} \approx 1.0\Omega$.
- **Nhiệm vụ 3 (Đo Pin Cũ Nội Trở Lớn)**: Khảo sát nguồn pin chai, đo sụt áp khi tăng tải, xác định $r \ge 2.5\Omega$.

### P1 — 3-Tab Wizard Worksheet & Đồ Thị Ngoại Suy $U-I$
- **Tab 1: 1. Nhiệm Vụ**: 3 Thẻ nhiệm vụ với trạng thái & nút ghi nhận số liệu.
- **Tab 2: 2. Số Liệu**: Bảng số liệu $(R, I, U)$, đồ thị phân tán $U - I$ có đường hồi quy ngoại suy tuyến tính $U = \mathcal{E} - I \cdot r$, hiển thị giá trị $\mathcal{E}_{\text{đo}}, r_{\text{đo}}, R^2$.
- **Tab 3: 3. Nộp Bài**: 3 câu trắc nghiệm GDPT 2018 Vật Lý 11, bảng điểm chi tiết 10.0 (Thao tác 3.0đ, Độ chính xác 4.0đ, Trắc nghiệm 3.0đ) & nộp bài lên EduLab.

---

## 3. Kiến Trúc Files
```
frontend/src/components/simulations/emf-internal-r/
├── emfInternalREngine.ts              # Circuit physics, linear regression solver, 3 missions, auto-grading
├── EmfInternalRWorkbench3D.tsx        # 3D Three.js battery box, rheostat slider, switch, meters (analog/digital)
├── EmfInternalRWorkbenchHudDock.tsx   # Controls: Source switcher, rheostat slider, switch toggle, meter mode, record button
├── EmfInternalRLabWizardWorksheet.tsx # 3-tab worksheet (1. Nhiệm Vụ, 2. Số Liệu & Đồ Thị U-I, 3. Nộp Bài)
└── EmfInternalRLab.tsx                # Main container component
```
Export và kết nối route `/lab/emf-internal-r`.
