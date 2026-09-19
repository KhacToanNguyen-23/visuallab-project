# Spec: Thiết Kế Lại Thí Nghiệm Đo Nhiệt Dung Riêng (Specific Heat Lab)

**Feature Slug:** `specific-heat-redesign`
**Curriculum Standard:** SGK GDPT 2018 Vật Lý 12 - Bài Thực Hành Đo Nhiệt Dung Riêng
**Route:** `http://localhost:5173/lab/specific-heat`

---

## 1. Mục Tiêu & Mô Hình Vật Lý
- Định luật nhiệt lượng: $Q = P \cdot t = m \cdot c \cdot (T_2 - T_1)$
- Công thức tính nhiệt dung riêng: $c = \frac{P \cdot t}{m \cdot \Delta T}$
- Sai số tương đối: $\delta c = \frac{|c_{\text{đo}} - c_{\text{chuẩn}}|}{c_{\text{chuẩn}}} \times 100\%$
- Danh mục chất lỏng:
  1. **Nước tinh khiết**: $c = 4180\text{ J/(kg}\cdot\text{K)}$, Điểm sôi $100^\circ\text{C}$
  2. **Cồn Ethanol**: $c = 2440\text{ J/(kg}\cdot\text{K)}$, Điểm sôi $78^\circ\text{C}$
  3. **Dầu thực vật**: $c = 2000\text{ J/(kg}\cdot\text{K)}$, Điểm sôi $200^\circ\text{C}$

---

## 2. User Stories & Tiêu Chí Nghiệm Thu

### P1 — Core 3D Workbench & Physics Engine
- **US1.1**: Học sinh có thể tương tác với Bình nhiệt lượng kế 3D Three.js, quan sát dây mayso phát sáng đỏ cam theo công suất $P \in [30\text{W}, 100\text{W}]$, que khuấy quay vòng, và bọt khí sôi.
- **US1.2**: Có thể chọn chất lỏng (Nước, Cồn, Dầu), điều chỉnh khối lượng $m \in [0.1\text{kg}, 0.4\text{kg}]$, bật/tắt que khuấy, bắt đầu đun, tạm dừng và đặt lại thí nghiệm.
- **US1.3**: Tự động ngắt nhiệt và hiển thị cảnh báo an toàn khi chất lỏng đạt đến nhiệt độ sôi.

### P1 — 3 Nhiệm Vụ Khảo Sát GDPT 2018
- **Nhiệm vụ 1 (Đo nhiệt dung riêng của Nước)**: Chọn Nước ($m = 200\text{g}$), công suất $P = 50\text{W}$, đun trong $t = 120\text{s}$, đo $\Delta T \approx 7.2^\circ\text{C} \implies c \approx 4180\text{ J/(kg}\cdot\text{K)}$.
- **Nhiệm vụ 2 (Khảo sát tăng công suất / khối lượng)**: Tăng $P = 80\text{W}$ hoặc $m = 300\text{g}$, chứng minh $c$ là hằng số đặc trưng của chất lỏng.
- **Nhiệm vụ 3 (So sánh chất lỏng khác - Cồn / Dầu)**: Đo nhiệt dung riêng của Cồn ($c \approx 2440$) hoặc Dầu ($c \approx 2000$), so sánh độ tăng nhiệt $\Delta T$ nhanh hơn nước.

### P1 — 3-Tab Wizard Worksheet & Auto-Grading
- **Tab 1: 1. Nhiệm Vụ**: 3 Thẻ nhiệm vụ trực quan kèm nút "Ghi Nhận Số Liệu Hiện Tại".
- **Tab 2: 2. Số Liệu**: Bảng số liệu chi tiết ($m, P, t, T_1, T_2, \Delta T, c_{\text{đo}}, c_{\text{chuẩn}}, \delta\%$) và đồ thị đường nhiệt độ $T(t)$.
- **Tab 3: 3. Nộp Bài**: 3 câu trắc nghiệm GDPT 2018, hệ thống chấm điểm 10.0 (Thao tác 3.0đ, Độ chính xác 4.0đ, Trắc nghiệm 3.0đ) & nộp bài lên EduLab.

---

## 3. Kiến Trúc Files
```
frontend/src/components/simulations/specific-heat/
├── specificHeatEngine.ts              # Physics engine, 3 missions, auto-grading, quiz bank
├── SpecificHeatWorkbench3D.tsx        # 3D Three.js calorimeter, heating coil, stirrer, liquid, steam
├── SpecificHeatWorkbenchHudDock.tsx   # Controls: Liquid switcher, mass, power, stirrer, heat timer, record button
├── SpecificHeatLabWizardWorksheet.tsx # 3-tab worksheet (1. Nhiệm Vụ, 2. Số Liệu, 3. Nộp Bài)
└── SpecificHeatLab.tsx                # Main container component
```
Re-export from `frontend/src/components/simulations/SpecificHeatLab.tsx`.
