# Khung Tài Liệu Đặc Tả Chi Tiết Bài Thực Hành Vật Lý (Phân Theo Chương & Chuẩn Hóa Dụng Cụ UI)

**Chuẩn chương trình:** SGK Vật Lý GDPT 2018 (NXB Giáo Dục Việt Nam - Bộ Kết nối tri thức với cuộc sống, Cánh diều, Chân trời sáng tạo)  
**Phân công trách nhiệm:**
- **Chuyên gia Nội dung & QC (Người lập tài liệu):** Chuẩn hóa Tên Dụng Cụ UI (Mã ID & Tên chính xác), Tên Chương, Tên bài, Trang SGK, Phân loại Giao diện UI (Kéo thả vs Tham số), Quy trình thực hành và Tiêu chí tự động chấm điểm.
- **Lập trình viên (Dev):** Dựa trên Mã Dụng Cụ (Tool ID) chuẩn hóa và Tiêu chí Chấm điểm trong tài liệu này để lập trình Bộ lõi UI và Auto-grading.

---

## 🧰 DANH MỤC MÃ & TÊN DỤNG CỤ CHUẨN HÓA LẬP TRÌNH (STANDARDIZED UI COMPONENT IDS)

Dưới đây là bảng chuẩn hóa **Mã ID & Tên Dụng Cụ** chính xác để lập trình viên (Dev) khởi tạo UI Component và vẽ Icon tương ứng:

| Mã Dụng Cụ (Tool ID) | Tên Dụng Cụ Tiếng Việt | Loại Component UI | Mô Tả & Thông Số Lập Trình |
| :--- | :--- | :--- | :--- |
| `PHOTOGATE_SENSOR` | Cổng quang điện | `DRAGGABLE_SENSOR` | Cảm biến hồng ngoại phát hiện vật chắn cổng |
| `DIGITAL_TIMER` | Đồng hồ đo thời gian hiện số | `DISPLAY_PANEL` | Đo $t_A, t_B, \Delta t$, độ chia $0.001\text{s}$ |
| `INCLINED_TRACK` | Máng nghiêng kèm thước | `STATIC_BASE` | Có chia độ dài cm và góc nghiêng |
| `STEEL_BALL` | Bi thép | `PHYSICS_RIGID_BODY` | Đường kính 2cm, khối lượng $0.05\text{kg}$ |
| `VERTICAL_STAND` | Giá đỡ thẳng đứng | `STATIC_BASE` | Giá đỡ thẳng đứng kèm thước milimét |
| `ELECTROMAGNET` | Nam châm điện giữ vật | `ACTIVE_COMPONENT` | Bật/Tắt công tắc ngắt điện thả vật |
| `SPRING_BALANCE` | Lực kế lò xo | `MEASUREMENT_TOOL` | Thang đo $0 - 5\text{N}$, hiển thị kim lực |
| `WOODEN_BLOCK` | Khối gỗ thí nghiệm | `PHYSICS_RIGID_BODY` | Mặt gỗ trượt trên bàn, có móc kéo |
| `HELICAL_SPRING` | Lò xo xoắn | `PHYSICS_SPRING` | Lò xo treo đứng, độ cứng $k$ |
| `MASS_WEIGHT_SET` | Bộ quả cân gia tải | `DRAGGABLE_MASS` | Các quả cân $50\text{g}, 100\text{g}, 200\text{g}$ |
| `DC_POWER_SUPPLY` | Nguồn Pin điện hóa | `CIRCUIT_SOURCE` | Pin 1.5V DC, có 2 cực dương/âm |
| `VOLTMETER_DC` | Vôn kế DC | `CIRCUIT_METER` | Thang đo $0 - 3\text{V}$, có 2 que đo âm/dương |
| `AMMETER_DC` | Ampe kế DC | `CIRCUIT_METER` | Thang đo $0 - 500\text{mA}$, nối tiếp |
| `RHEOSTAT_VARIABLE` | Biến trở con chạy | `CIRCUIT_RESISTOR` | Điện trở $0 - 100\Omega$, có cần gạt |
| `CIRCUIT_SWITCH` | Khóa K (Công tắc) | `CIRCUIT_SWITCH` | Nút bấm Đóng [ON] / Mở [OFF] |
| `LASER_SOURCE_RGB` | Nguồn phát Laser | `OPTICS_SOURCE` | Chọn bước sóng $\lambda = 380 - 750\text{nm}$ |
| `YOUNG_DOUBLE_SLIT` | Khe kép Y-âng | `OPTICS_SLIT` | Khoảng cách 2 khe $a = 0.1 - 1.0\text{mm}$ |
| `FRINGE_SCREEN` | Màn hứng vân giao thoa | `OPTICS_SCREEN` | Hiển thị vạch sáng/tối và đồ thị $I(x)$ |
| `CALIPER_CROSSHAIR` | Thước kẹp đo khoảng vân | `MEASUREMENT_TOOL` | Vạch đo di động màu vàng trên màn |
| `RESONANCE_TUBE` | Ống cộng hưởng âm | `ACOUSTICS_TUBE` | Ống thủy tinh chứa nước, nâng/hạ cột nước |
| `AUDIO_GENERATOR` | Máy phát tần số âm | `ACOUSTICS_SOURCE` | Tần số $f = 100 - 2000\text{Hz}$, kèm loa |
| `GLASS_HALF_CYLINDER` | Bán trụ thủy tinh | `OPTICS_REFRACTOR` | Đặt trên đĩa chia độ tròn $360^\circ$ |
| `CALORIMETER_CUP` | Bình nhiệt lượng kế | `THERMAL_CONTAINER` | Bình xốp đậy kín nắp cách nhiệt |
| `HEATING_COIL` | Dây điện trở đun nước | `THERMAL_HEATER` | Công suất đun $P = 10 - 50\text{W}$ |
| `DIGITAL_THERMOMETER`| Nhiệt kế điện tử | `MEASUREMENT_TOOL` | Đo nhiệt độ $0 - 100^\circ\text{C}$ |
| `GAS_CYLINDER_PISTON`| Xy-lanh nén khí pít-tông| `THERMAL_GAS` | Dung tích chia $V\text{ (cm}^3\text{)}$, pít-tông nén |
| `PRESSURE_GAUGE` | Áp kế đo áp suất khí | `MEASUREMENT_TOOL` | Đồng hồ đo áp suất $P\text{ (bar / Pa)}$ |
| `BAR_MAGNET` | Nam châm vĩnh cửu | `MAGNETIC_BODY` | Có 2 cực Bắc (N) - Nam (S) |
| `INDUCTION_COIL` | Cuộn dây cảm ứng | `MAGNETIC_COIL` | Cuộn dây quấn nhiều vòng nối điện kế |
| `GALVANOMETER_G` | Điện kế G | `CIRCUIT_METER` | Phát hiện dòng điện cảm ứng nhỏ |

---

## 📊 BẢNG PHÂN LOẠI GIAO DIỆN LAB (UX/UI CLASSIFICATION MATRIX)

| Lớp | Bài SGK & Tên Bài Thực Hành | Loại Giao Diện UI | Danh Sách Mã Dụng Cụ Cần Dùng (`Tool IDs`) |
| :--- | :--- | :--- | :--- |
| **10** | **Bài 6 (T28):** Đo tốc độ vật chuyển động | 🎯 **KÉO THẢ** | `INCLINED_TRACK`, `PHOTOGATE_SENSOR` (2), `DIGITAL_TIMER`, `STEEL_BALL` |
| **10** | **Bài 14 (T57):** Đo gia tốc rơi tự do | 🎯 **KÉO THẢ** | `VERTICAL_STAND`, `ELECTROMAGNET`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER`, `STEEL_BALL` |
| **10** | **Bài 21 (T83):** Đo hệ số ma sát trượt | 🎯 **KÉO THẢ** | `SPRING_BALANCE`, `WOODEN_BLOCK`, `MASS_WEIGHT_SET` |
| **10** | **Bài 30 (T117):** Khảo sát va chạm | 🎛️ **THAM SỐ** | `AIR_TRACK_BASE`, `GLIDER_CAR` (2), `PHOTOGATE_SENSOR` (2), `DIGITAL_TIMER` |
| **10** | **Bài 38 (T148):** Độ giãn lò xo (Định luật Hooke) | 🎯 **KÉO THẢ** | `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET` |
| **11** | **Bài 7 (T29):** Dao động con lắc lò xo | 🎛️ **THAM SỐ** | `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `DIGITAL_TIMER` |
| **11** | **Bài 5 (T22):** Tốc độ truyền âm (Ống cộng hưởng) | 🎛️ **THAM SỐ** | `RESONANCE_TUBE`, `AUDIO_GENERATOR` |
| **11** | **Bài 19 (T76):** Đo suất điện động $E$ & $r$ của Pin | 🎯 **KÉO THẢ** | `DC_POWER_SUPPLY`, `AMMETER_DC`, `VOLTMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH` |
| **11** | **Bài 21 (T85):** Đo chiết suất của nước | 🎛️ **THAM SỐ** | `GLASS_HALF_CYLINDER`, `LASER_SOURCE_RGB` |
| **11** | **Bài 12 (T50):** Đo bước sóng ánh sáng (Khe Y-âng) | 🎯 **KÉO THẢ** | `LASER_SOURCE_RGB`, `YOUNG_DOUBLE_SLIT`, `FRINGE_SCREEN`, `CALIPER_CROSSHAIR` |
| **12** | **Bài 3 (T15):** Đo nhiệt dung riêng của nước | 🎛️ **THAM SỐ** | `CALORIMETER_CUP`, `HEATING_COIL`, `DIGITAL_THERMOMETER`, `DIGITAL_TIMER` |
| **12** | **Bài 4 (T19):** Đo nhiệt nóng chảy nước đá | 🎛️ **THAM SỐ** | `CALORIMETER_CUP`, `DIGITAL_THERMOMETER` |
| **12** | **Bài 7 (T30):** Đẳng nhiệt (Boyle - Mariotte) | 🎛️ **THAM SỐ** | `GAS_CYLINDER_PISTON`, `PRESSURE_GAUGE` |
| **12** | **Bài 12 (T52):** Cảm ứng điện từ | 🎯 **KÉO THẢ** | `BAR_MAGNET`, `INDUCTION_COIL`, `GALVANOMETER_G` |

---

## 🤖 QUY TRÌNH & TIÊU CHÍ TỰ ĐỘNG CHẤM ĐIỂM (AUTO-GRADING SYSTEM)

Thành viên Lập trình (Dev) sẽ triển khai thuật toán Auto-grading dựa trên 3 tiêu chí chính sau:

```
Tổng Điểm Bài Thực Hành = Điểm Thao Tác (30%) + Điểm Sai Số (40%) + Điểm Báo Cáo (30%)
```

1. **Điểm Thao Tác (30%):**
   - Kiểm tra học sinh có lắp đúng dụng cụ không (`isCorrectAssembly === true`).
   - Kiểm tra học sinh có thực hiện đủ số lần đo tối thiểu ($N \ge 3$ lần đo).
2. **Điểm Sai Số & Độ Chính Xác (40%):**
   - So sánh kết quả tính toán của học sinh với giá trị lý thuyết:
     $$\text{Error} = \frac{|X_{học\_sinh} - X_{lý\_thuyết}|}{X_{lý\_thuyết}} \times 100\%$$
   - Cho tối đa điểm nếu $\text{Error} \le 5\%$.
3. **Điểm Báo Cáo & Trắc Nghiệm Thu Hoạch (30%):**
   - Chấm điểm các câu hỏi trắc nghiệm kiểm tra hiểu biết lý thuyết sau khi hoàn thành thí nghiệm.

---

## 📚 MỤC LỤC CHI TIẾT THEO CHƯƠNG & BÀI THỰC HÀNH (SGK VẬT LÝ 10, 11, 12)

```
LỚP 10
 ├── Chương II: Động học ➔ Bài 6 (Trang 28): Thực hành đo tốc độ của vật chuyển động thẳng [🎯 Kéo thả]
 ├── Chương III: Động lực học ➔ Bài 14 (Trang 57): Thực hành đo gia tốc rơi tự do [🎯 Kéo thả]
 ├── Chương IV: Năng lượng & Ma sát ➔ Bài 21 (Trang 83): Thực hành đo hệ số ma sát trượt [🎯 Kéo thả]
 ├── Chương V: Động lượng & Va chạm ➔ Bài 30 (Trang 117): Thực hành khảo sát động lượng & va chạm [🎛️ Tham số]
 └── Chương VI: Chuyển động tròn & Biến dạng ➔ Bài 38 (Trang 148): Định luật Hooke [🎯 Kéo thả]

LỚP 11
 ├── Chương I: Dao động ➔ Bài 7 (Trang 29): Khảo sát dao động con lắc lò xo [🎛️ Tham số]
 ├── Chương II: Sóng ➔ Bài 5 (Trang 22): Tốc độ truyền âm | Bài 12 (Trang 50): Bước sóng ánh sáng [🎯 Kéo thả]
 ├── Chương III: Quang học ➔ Bài 21 (Trang 85): Đo chiết suất của nước [🎛️ Tham số]
 └── Chương IV: Dòng điện không đổi ➔ Bài 19 (Trang 76): Suất điện động & Điện trở trong Pin [🎯 Kéo thả]

LỚP 12
 ├── Chương I: Vật lý nhiệt ➔ Bài 3 (Trang 15): Nhiệt dung riêng | Bài 4 (Trang 19): Nhiệt nóng chảy đá [🎛️ Tham số]
 ├── Chương II: Khí lý tưởng ➔ Bài 7 (Trang 30): Đẳng nhiệt Boyle - Mariotte [🎛️ Tham số]
 └── Chương III: Từ trường ➔ Bài 12 (Trang 52): Cảm ứng điện từ [🎯 Kéo thả]
```

---

## 📘 CHI TIẾT ĐẶC TẢ CÁC BÀI THỰC HÀNH THEO TỪNG CHƯƠNG - VẬT LÝ 10

### 1. CHƯƠNG II: ĐỘNG HỌC
#### **BÀI 6 (Trang 28 SGK Vật lý 10 - KNTT): Thực hành đo tốc độ của vật chuyển động thẳng**
* **Loại Giao Diện UI:** 🎯 **KÉO THẢ**
* **Danh sách Mã Dụng Cụ:** `INCLINED_TRACK`, `PHOTOGATE_SENSOR` (2), `DIGITAL_TIMER`, `STEEL_BALL`
* **Các bước tiến hành:**
  1. *Bước 1:* Bố trí máng nghiêng `INCLINED_TRACK`, lắp hai cổng quang điện `PHOTOGATE_SENSOR` E và F cách nhau $s = 0.3\text{m}$.
  2. *Bước 2:* Nối dây từ cổng quang E và F vào đồng hồ `DIGITAL_TIMER`. Chọn chế độ đo $\Delta t$.
  3. *Bước 3:* Đặt viên bi thép `STEEL_BALL` ở đỉnh máng nghiêng.
  4. *Bước 4:* Thả nhẹ viên bi rơi/lăn qua hai cổng quang điện.
  5. *Bước 5:* Đọc thời gian $\Delta t$ trên đồng hồ đo. Tính $v = \frac{s}{\Delta t}$.

---

### 2. CHƯƠNG III: ĐỘNG LỰC HỌC
#### **BÀI 14 (Trang 57 SGK Vật lý 10 - KNTT): Thực hành đo gia tốc rơi tự do**
* **Loại Giao Diện UI:** 🎯 **KÉO THẢ**
* **Danh sách Mã Dụng Cụ:** `VERTICAL_STAND`, `ELECTROMAGNET`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER`, `STEEL_BALL`
* **Các bước tiến hành:**
  1. *Bước 1:* Lắp `ELECTROMAGNET` ở đỉnh giá đỡ `VERTICAL_STAND`.
  2. *Bước 2:* Đặt `PHOTOGATE_SENSOR` bên dưới, cách nam châm điện khoảng $h = 0.5\text{m}$.
  3. *Bước 3:* Gắn quả nặng `STEEL_BALL` vào nam châm điện.
  4. *Bước 4:* Nhấn công tắc ngắt điện nam châm thả quả nặng rơi tự do.
  5. *Bước 5:* Đọc thời gian rơi $t$ trên `DIGITAL_TIMER`. Tính $g = \frac{2h}{t^2} \approx 9.81\text{m/s}^2$.

---

### 3. CHƯƠNG IV: NĂNG LƯỢNG, CÔNG, CÔNG SUẤT & MA SÁT
#### **BÀI 21 (Trang 83 SGK Vật lý 10 - KNTT): Thực hành đo hệ số ma sát trượt**
* **Loại Giao Diện UI:** 🎯 **KÉO THẢ**
* **Danh sách Mã Dụng Cụ:** `SPRING_BALANCE`, `WOODEN_BLOCK`, `MASS_WEIGHT_SET`
* **Các bước tiến hành:**
  1. *Bước 1:* Đặt `WOODEN_BLOCK` lên mặt phẳng ngang. Móc `SPRING_BALANCE` vào khối gỗ.
  2. *Bước 2:* Kéo lực kế sao cho khối gỗ trượt đều nằm ngang.
  3. *Bước 3:* Đọc giá trị lực kế $F_{ms}$. Đặt thêm `MASS_WEIGHT_SET` để thay đổi áp lực $N$.
  4. *Bước 4:* Tính hệ số ma sát trượt $\mu = \frac{F_{ms}}{N}$.

---

### 4. CHƯƠNG VI: CHUYỂN ĐỘNG TRÒN & BIẾN DẠNG
#### **BÀI 38 (Trang 148 SGK Vật lý 10 - KNTT): Thực hành khảo sát định luật Hooke (Độ giãn lò xo)**
* **Loại Giao Diện UI:** 🎯 **KÉO THẢ**
* **Danh sách Mã Dụng Cụ:** `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`
* **Các bước tiến hành:**
  1. *Bước 1:* Treo `HELICAL_SPRING` vào giá đỡ `VERTICAL_STAND`, đọc chiều dài tự nhiên $l_0$.
  2. *Bước 2:* Móc quả cân `MASS_WEIGHT_SET` ($50\text{g}, 100\text{g}$) vào lò xo, đọc chiều dài $l_1 \rightarrow \Delta l = l_1 - l_0$.
  3. *Bước 3:* Tính lực đàn hồi $F_{đh} = m \cdot g$ và độ cứng $k = \frac{F_{đh}}{\Delta l}$.

---

## 📙 CHI TIẾT ĐẶC TẢ CÁC BÀI THỰC HÀNH THEO TỪNG CHƯƠNG - VẬT LÝ 11

### 5. CHƯƠNG I: DAO ĐỘNG
#### **BÀI 7 (Trang 29 SGK Vật lý 11 - KNTT): Thực hành khảo sát dao động điều hòa con lắc lò xo**
* **Loại Giao Diện UI:** 🎛️ **THAM SỐ**
* **Danh sách Mã Dụng Cụ:** `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `DIGITAL_TIMER`
* **Các bước tiến hành:**
  1. *Bước 1:* Treo lò xo `HELICAL_SPRING` và quả cân `MASS_WEIGHT_SET` lên giá đỡ.
  2. *Bước 2:* Kéo quả cân lệch vị trí cân bằng đoạn $A$ rồi thả nhẹ.
  3. *Bước 3:* Đọc thời gian $t$ của 10 dao động trên `DIGITAL_TIMER` $\rightarrow T = \frac{t}{10} = 2\pi \sqrt{\frac{m}{k}}$.

---

### 6. CHƯƠNG II: SÓNG
#### **BÀI 5 (Trang 22 SGK Vật lý 11 - KNTT): Đo tần số của sóng âm & tốc độ truyền âm**
* **Loại Giao Diện UI:** 🎛️ **THAM SỐ**
* **Danh sách Mã Dụng Cụ:** `RESONANCE_TUBE`, `AUDIO_GENERATOR`
* **Các bước tiến hành:**
  1. *Bước 1:* Bật `AUDIO_GENERATOR` phát tần số $f = 500\text{Hz}$.
  2. *Bước 2:* Hạ từ từ mực nước trong `RESONANCE_TUBE` để lắng nghe âm to nhất lần 1 ($L_1$) và lần 2 ($L_2$).
  3. *Bước 3:* Tính bước sóng $\lambda = 2(L_2 - L_1)$ và tốc độ truyền âm $v = \lambda \cdot f \approx 340\text{m/s}$.

---

#### **BÀI 12 (Trang 50 SGK Vật lý 11 - KNTT): Đo bước sóng ánh sáng (Giao thoa Khe Y-âng)**
* **Loại Giao Diện UI:** 🎯 **KÉO THẢ**
* **Danh sách Mã Dụng Cụ:** `LASER_SOURCE_RGB`, `YOUNG_DOUBLE_SLIT`, `FRINGE_SCREEN`, `CALIPER_CROSSHAIR`
* **Các bước tiến hành:**
  1. *Bước 1:* Chiếu `LASER_SOURCE_RGB` qua `YOUNG_DOUBLE_SLIT` lên `FRINGE_SCREEN`.
  2. *Bước 2:* Kéo `CALIPER_CROSSHAIR` trên màn để đo khoảng cách giữa 5 vân sáng $\rightarrow i$.
  3. *Bước 3:* Tính bước sóng $\lambda = \frac{a \cdot i}{D}$.

---

### 7. CHƯƠNG IV: DÒNG ĐIỆN KHÔNG ĐỔI
#### **BÀI 19 (Trang 76 SGK Vật lý 11 - KNTT): Đo suất điện động ($E$) & điện trở trong ($r$) của Pin**
* **Loại Giao Diện UI:** 🎯 **KÉO THẢ**
* **Danh sách Mã Dụng Cụ:** `DC_POWER_SUPPLY`, `AMMETER_DC`, `VOLTMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH`
* **Các bước tiến hành:**
  1. *Bước 1:* Kéo nối mạch `DC_POWER_SUPPLY` nối tiếp `AMMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH`. Mắc `VOLTMETER_DC` song song nguồn.
  2. *Bước 2:* Đóng `CIRCUIT_SWITCH`, điều chỉnh `RHEOSTAT_VARIABLE` lấy 5 cặp số liệu $(I, U)$.
  3. *Bước 3:* Vẽ đồ thị $U = E - I \cdot r$ để tìm $E$ và $r$.

---

## 📕 CHI TIẾT ĐẶC TẢ CÁC BÀI THỰC HÀNH THEO TỪNG CHƯƠNG - VẬT LÝ 12

### 8. CHƯƠNG I: VẬT LÝ NHIỆT
#### **BÀI 3 (Trang 15 SGK Vật lý 12 - KNTT): Thực hành đo nhiệt dung riêng của nước**
* **Loại Giao Diện UI:** 🎛️ **THAM SỐ**
* **Danh sách Mã Dụng Cụ:** `CALORIMETER_CUP`, `HEATING_COIL`, `DIGITAL_THERMOMETER`, `DIGITAL_TIMER`
* **Các bước tiến hành:**
  1. *Bước 1:* Đổ nước vào `CALORIMETER_CUP`, đọc nhiệt độ ban đầu $T_1$ trên `DIGITAL_THERMOMETER`.
  2. *Bước 2:* Bật `HEATING_COIL` đun nước trong thời gian $\tau$ đo bằng `DIGITAL_TIMER`.
  3. *Bước 3:* Đọc nhiệt độ cực đại $T_2$, tính $c = \frac{P \cdot \tau}{m(T_2 - T_1)} \approx 4180\text{ J/(kg·K)}$.

---

### 9. CHƯƠNG II: KHÍ LÝ TƯỞNG
#### **BÀI 7 (Trang 30 SGK Vật lý 12 - KNTT): Thực hành khảo sát định luật Đẳng nhiệt (Boyle - Mariotte)**
* **Loại Giao Diện UI:** 🎛️ **THAM SỐ**
* **Danh sách Mã Dụng Cụ:** `GAS_CYLINDER_PISTON`, `PRESSURE_GAUGE`
* **Các bước tiến hành:**
  1. *Bước 1:* Đặt thể tích ban đầu $V_1$ trên `GAS_CYLINDER_PISTON`, đọc áp suất $P_1$ trên `PRESSURE_GAUGE`.
  2. *Bước 2:* Nén pít-tông từ từ giảm thể tích $V_2, V_3, V_4$.
  3. *Bước 3:* Đọc áp suất $P$ tương ứng và kiểm tra $P \cdot V = \text{hằng số}$.

---

### 10. CHƯƠNG III: TỪ TRƯỜNG & CẢM ỨNG ĐIỆN TỪ
#### **BÀI 12 (Trang 52 SGK Vật lý 12 - KNTT): Thực hành khảo sát hiện tượng cảm ứng điện từ**
* **Loại Giao Diện UI:** 🎯 **KÉO THẢ**
* **Danh sách Mã Dụng Cụ:** `BAR_MAGNET`, `INDUCTION_COIL`, `GALVANOMETER_G`
* **Các bước tiến hành:**
  1. *Bước 1:* Nối `INDUCTION_COIL` với `GALVANOMETER_G`.
  2. *Bước 2:* Kéo `BAR_MAGNET` đâm nhanh vào trong cuộn dây $\rightarrow$ Kim điện kế G lệch.
  3. *Bước 3:* Giữ nam châm đứng yên $\rightarrow$ Kim về 0.
  4. *Bước 4:* Rút nam châm ra ngoài $\rightarrow$ Kim lệch ngược chiều.
