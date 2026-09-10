# 🔬 Báo Cáo Nghiên Cứu Chuyên Sâu & Brainstorm: Bộ Bài Thực Hành Mô Phỏng Vật Lý GDPT 2018 (Chuẩn EduLab)

**Ngày lập:** 2026-09-10  
**Tài liệu tham chiếu:** `d:\6_OJT\EduLab\spec.md`  
**Kiến trúc kế thừa:** PhET Interactive Engine & Custom Physics Engine (Tương tự `PhetPendulumLab.tsx` & `PendulumEngine`)

---

## 📌 1. Tóm Tắt Nhanh (Executive Summary)
Dựa trên tài liệu đặc tả `spec.md`, hệ thống EduLab định hướng phát triển bộ 14 bài thí nghiệm mô phỏng Vật Lý GDPT 2018 (Bộ sách Kết nối tri thức). Cấu trúc các bài Lab mới sẽ kế thừa hoàn toàn mô hình của bài **Con lắc đơn (PhetPendulumLab)**:
1. **Lõi vật lý HTML5 Canvas / Scenerystack**: Tính toán thời gian thực (Real-time physics loop với Euler/Runge-Kutta).
2. **Giao diện 6 Tab sư phạm chuẩn PhET**: Khám phá $\rightarrow$ So sánh $\rightarrow$ Dự đoán $\rightarrow$ Đo đạc số liệu $\rightarrow$ Đồ thị $\rightarrow$ Thử thách AI.
3. **Bảng điều khiển thông số ⚙️ persistent**: Cho phép điều chỉnh thông số đề bài cá nhân hóa.
4. **Tích hợp Auto-grading & Groq AI**: Chấm điểm tự động 3 phần (Thao tác 30% + Sai số 40% + Báo cáo 30%).

---

## 🔍 2. Phân Tách 4 Hướng Bài Lab Tiềm Năng (Ideas Explored)

### 🔴 Hướng A: Nhóm Cơ Học — **Bài 38 (Lớp 10): Định Luật Hooke & Bài 7 (Lớp 11): Con Lắc Lò Xo**
- **Cơ chế vật lý:** Phương trình vi phân dao động lò xo $m \ddot{x} + c \dot{x} + k x = m g$.
- **Dụng cụ UI chuẩn:** `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `DIGITAL_TIMER`.
- **Điểm mạnh:** Cực kỳ gần gũi với Con lắc đơn (Pendulum), dùng chung mô hình toán vi phân và công cụ vẽ lò xo lò xo dạng zigzag trên Canvas.
- **Tính năng mở rộng:** Đo độ giãn $\Delta l$ theo lực kéo $F$, tính độ cứng $k$, vẽ đồ thị lực $F(\Delta l)$ và đồ thị li độ $x(t)$.

### 🔵 Hướng B: Nhóm Điện Học — **Bài 19 (Lớp 11): Đo Suất Điện Động $E$ & Điện Trở Trong $r$ Của Pin**
- **Cơ chế vật lý:** Giải mạch điện DC Định luật Ohm cho toàn mạch: $U = E - I \cdot r$.
- **Dụng cụ UI chuẩn:** `DC_POWER_SUPPLY`, `AMMETER_DC`, `VOLTMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH`.
- **Điểm mạnh:** Kế thừa bộ giải mạch `CircuitSolver.ts` và thư viện linh kiện đã có sẵn trong dự án.
- **Tính năng mở rộng:** Kéo gạt biến trở con chạy, ghi nhận 5 cặp số liệu $(I, U)$, vẽ đường thẳng suy diễn đồ thị $U(I)$ để tìm tung độ gốc $E$ và độ dốc $-r$.

### 🟢 Hướng C: Nhóm Quang Học — **Bài 12 (Lớp 11): Bước Sóng Ánh Sáng (Giao Thoa Khe Y-âng)**
- **Cơ chế vật lý:** Giao thoa ánh sáng đơn sắc $\lambda = \frac{a \cdot i}{D}$.
- **Dụng cụ UI chuẩn:** `LASER_SOURCE_RGB`, `YOUNG_DOUBLE_SLIT`, `FRINGE_SCREEN`, `CALIPER_CROSSHAIR`.
- **Điểm mạnh:** Hình ảnh giao thoa ánh sáng (Laser RGB đỏ/lục/lam) rực rỡ, trực quan cao.
- **Tính năng mở rộng:** Thay đổi màu Laser $\lambda$, khoảng cách 2 khe $a$, khoảng cách màn $D$, kéo thước kẹp vi sai `CALIPER_CROSSHAIR` để đo khoảng vân $i$.

### 🟡 Hướng D: Nhóm Nhiệt Học — **Bài 3 (Lớp 12): Đo Nhiệt Dung Riêng Của Nước & Bài 7 (Lớp 12): Đẳng Nhiệt (Boyle - Mariotte)**
- **Cơ chế vật lý:** Pháo nhiệt lượng $P \cdot \tau = m c (T_2 - T_1)$ hoặc Đẳng nhiệt $P \cdot V = \text{const}$.
- **Dụng cụ UI chuẩn:** `GAS_CYLINDER_PISTON`, `PRESSURE_GAUGE`, `CALORIMETER_CUP`, `DIGITAL_THERMOMETER`.
- **Điểm mạnh:** Đóng góp bộ bài thực hành chuẩn hóa cho chương trình Vật Lý 12 mới (Thi TN THPT 2025+).
- **Tính năng mở rộng:** Kéo Piston nén khí, đồ thị $P(V)$ dạng Hyperbol thời gian thực.

---

## ⚖️ 3. So Sánh & Đánh Giá Đa Chiều (Trade-offs & Feasibility)

| Tiêu chí | Hướng A: Con Lắc Lò Xo / Định Luật Hooke | Hướng B: Suất Điện Động $E, r$ | Hướng C: Giao Thoa Khe Y-âng | Hướng D: Đẳng Nhiệt Boyle-Mariotte |
| :--- | :--- | :--- | :--- | :--- |
| **Độ tương đồng với Pendulum Lab** | ⭐⭐⭐⭐⭐ (Rất cao - 90%) | ⭐⭐⭐⭐ (Cao - 80%) | ⭐⭐⭐ (Trung bình - 70%) | ⭐⭐⭐⭐ (Cao - 75%) |
| **Tái sử dụng code Engine hiện có** | Dùng lại Canvas loop & Euler solver | Dùng lại `CircuitSolver.ts` | Dùng lại Canvas Optics shader/gradient | Dùng lại Thermodynamic math |
| **Độ hấp dẫn UI/UX (Visual Wow Factor)** | Lò xo nhún mịn, đồ thị li độ | Đồng hồ Vôn/Ampe kim quay | Vân giao thoa ánh sáng Laser RGB rực rỡ | Piston nén khí & áp kế quay |
| **Khả năng Auto-Grading AI** | Rất dễ (Tính $k, T$, sai số %) | Rất dễ (Tìm $E, r$ từ đồ thị) | Rất dễ (Tính bước sóng $\lambda$) | Rất dễ (Tính $P \cdot V$) |
| **Khuyên dùng cho Phase tiếp theo** | **Ưu tiên #1 (MVP 1)** | **Ưu tiên #2 (MVP 2)** | **Ưu tiên #3** | **Ưu tiên #4** |

---

## 💡 4. Khuyến Nghị Đề Xuất Thực Hiện (Recommended Roadmap)

1. **Giai đoạn 1 (Lựa chọn Hướng A & B):**
   - Triển khai **Con lắc lò xo & Định luật Hooke (`PhetSpringLab.tsx`)**: Đã có nền tảng vững từ Pendulum Lab.
   - Triển khai **Đo Suất Điện Động $E, r$ (`PhetEmfLab.tsx`)**: Tận dụng bộ giải mạch điện DC hiện có.
2. **Chuẩn hóa kiến trúc dùng chung (`BaseLabTemplate`):**
   - Đóng gói khung 6 Tab sư phạm, bảng thông số ⚙️, bảng ghi nhận dữ liệu `MeasurementTable` và đồ thị `ChartPanel` thành các Shared Components để tái sử dụng 100% cho mọi bài Lab tiếp theo.

---

## 🔗 Nguồn Tham Khảo
- [1] SGK Vật lý 10, 11, 12 — Bộ sách Kết nối tri thức với cuộc sống (NXB Giáo Dục Việt Nam).
- [2] Đặc tả bài thực hành EduLab: `d:\6_OJT\EduLab\spec.md`.
