# Đặc Tả Kỹ Thuật (Spec): Bộ Thí Nghiệm Mô Phỏng Vật Lý Chuẩn PhET (Phần Con Lắc Lò Xo & Đo Suất Điện Động E, r)

**Slug:** `lab-suite`  
**Ngày lập:** 2026-09-10  
**Tài liệu tham chiếu:** `d:\6_OJT\EduLab\spec.md`  

---

## 🎯 1. Mục Tiêu Hệ Thống & Tiêu Chí Thành Công

### User Stories & Mức Độ Ưu Tiên
- **[P1 - Core]** Học sinh có thể chọn bài thực hành **Con Lắc Lò Xo (Định luật Hooke)** hoặc **Đo Suất Điện Động $E, r$** từ giao diện Dashboard/Bài tập.
- **[P1 - Core]** Mô phỏng chạy mượt mà ở 60 FPS trên Canvas HTML5 với bảng điều khiển thông số ⚙️ persistent (Khối lượng $m$, độ cứng $k$, biến trở $R$, suất điện động $E$).
- **[P1 - Core]** Tự động ghi số liệu thực hành vào Bảng đo (Table) và vẽ đồ thị (Graph) tương tác thời gian thực.
- **[P2 - High]** Tích hợp bộ tự động chấm điểm Auto-Grading (Thao tác 30% + Sai số 40% + Trả lời trắc nghiệm AI 30%).
- **[P3 - Medium]** Xuất bản tường trình thực hành định dạng PDF A4 kèm chữ ký điện tử học sinh.

### Tiêu Chí Thành Công Đo Lường Được
1. **Hiệu năng Canvas**: Đạt tối thiểu 55–60 FPS trong suốt quá trình chạy mô phỏng.
2. **Độ chính xác vật lý**: Sai số giữa tính toán mô phỏng và công thức lý thuyết $\le 1.0\%$.
3. **Thời gian tải**: Tải trang mô phỏng $< 1.5$ giây.

---

## 🧰 2. Danh Mục Dụng Cụ UI & Mô Phỏng Cần Triển Khai

### 1. Thí Nghiệm Con Lắc Lò Xo (`PhetSpringLab.tsx`)
- **Dụng cụ UI:** `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `DIGITAL_TIMER`.
- **Chế độ học (6 Tabs):** `explore` | `compare` | `predict` | `measure` | `graph` | `challenge`.
- **Thông số điều chỉnh:**
  - Độ cứng lò xo $k$: $10 - 100\text{ N/m}$.
  - Khối lượng quả nặng $m$: $0.05 - 0.5\text{ kg}$.
  - Lực cản môi trường (Damping): $0 - 0.5$.
  - Môi trường hấp dẫn $g$: Trái Đất ($9.81\text{m/s}^2$), Mặt Trăng ($1.62\text{m/s}^2$), Sao Hỏa ($3.71\text{m/s}^2$).

### 2. Thí Nghiệm Đo Suất Điện Động $E$ & Điện Trở Trong $r$ (`PhetEmfLab.tsx`)
- **Dụng cụ UI:** `DC_POWER_SUPPLY`, `AMMETER_DC`, `VOLTMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH`.
- **Chế độ học (6 Tabs):** `explore` | `compare` | `predict` | `measure` | `graph` | `challenge`.
- **Thông số điều chỉnh:**
  - Suất điện động $E$: $1.5\text{V} - 12\text{V}$.
  - Điện trở trong $r$: $0.5\Omega - 5.0\Omega$.
  - Khóa K: ON / OFF.
  - Biến trở gạt $R$: $0 - 100\Omega$.

---

## 🏗️ 3. Kiến Trúc Kỹ Thuật (Technical Architecture)

```
frontend/src/
 ├── components/
 │    └── simulation/
 │         ├── PhetSpringLab.tsx        # UI Con lắc lò xo
 │         ├── PhetEmfLab.tsx           # UI Suất điện động E, r
 │         └── common/
 │              ├── LabHeaderNav.tsx    # Thanh 6 Tab sư phạm
 │              ├── MeasurementTable.tsx# Bảng ghi số liệu
 │              └── RealtimeGraph.tsx   # Đồ thị tương tác Canvas/Chart
 └── engine/
      └── physics/
           ├── spring-engine.ts         # Spring-Mass Physics Engine (Euler/RK4)
           └── emf-engine.ts            # DC Circuit Physics Engine
```

---

## 🤖 4. Thuật Toán Auto-Grading & AI Verification

$$\text{Total Score} = \text{Score}_{\text{Assembly}} (30\%) + \text{Score}_{\text{Accuracy}} (40\%) + \text{Score}_{\text{Report}} (30\%)$$

- **Điểm thao tác (30%)**: Thực hiện tối thiểu 3-5 lần đo hợp lệ.
- **Điểm sai số (40%)**:
  $$\text{Error} = \frac{|k_{\text{đo}} - k_{\text{thật}}|}{k_{\text{thật}}} \times 100\% \le 5\% \implies 40\text{ điểm}$$
- **Điểm báo cáo (30%)**: Giải thích từng bước được chấm qua Groq AI.

---

## 📋 5. Kế Hoạch Triển Khai (Phase Handoff)
- **Phase 1**: Xây dựng `spring-engine.ts` và `PhetSpringLab.tsx`.
- **Phase 2**: Xây dựng `emf-engine.ts` và `PhetEmfLab.tsx`.
- **Phase 3**: Đóng gói bộ 6 Tab sư phạm dùng chung `BaseLabTemplate` & Tích hợp Auto-grading AI.
