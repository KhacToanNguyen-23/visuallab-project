# Brainstorm: Full Apparatus Ecosystem & 16 Curriculum Labs (SGK GDPT 2018)

**Date:** 2026-09-23  
**Target:** Toàn diện 16 bài thực hành chuẩn SGK GDPT 2018 (Lớp 10, 11, 12) và chuẩn hóa đầy đủ danh mục dụng cụ OOP Apparatus theo `DacTa.md`.

---

## 1. Ideas Explored

1. **Ý tưởng A (Scaffold All-in-One Framework):**
   - Định nghĩa toàn bộ hệ thống Base Contracts cho cả 6 lĩnh vực: Cơ học (`IMechanicalBase`, `IPhysicsRigidBody`, `IElasticBody`), Điện từ (`ICircuitComponent`, `IMeterDevice`), Sóng & Quang (`IOpticsSource`, `ISlitApparatus`, `IAcousticTube`), Nhiệt học (`IThermalContainer`, `IGasPiston`).
   - Mở rộng `ApparatusFactory` và `SnapEngine` để hỗ trợ tất cả các cơ chế ghép nối (cắm dây mạch điện, đặt trên ray quang học, ghép van áp suất, treo lò xo/dây chỉ).
   - Tích hợp và liên kết trực tiếp với `UniversalSandboxScene` và các trang thực hành chuyên sâu.

2. **Ý tưởng B (Rollout theo 4 Phase Chuyên Biệt):**
   - **Phase 1 (Cơ học Lớp 10 & 11 - 5 bài):** Rơi tự do, Máng nghiêng, Ma sát trượt khối gỗ, Va chạm đệm khí, Lò xo Hooke, Con lắc đơn/lò xo.
   - **Phase 2 (Điện học & Từ trường - 3 bài):** Đo $E$ & $r$ nguồn Pin, Mạch DC Định luật Ohm, Cảm ứng điện từ Faraday & Điện kế G.
   - **Phase 3 (Sóng & Quang học - 4 bài):** Giao thoa Khe Y-âng, Chiết suất lăng kính/bán trụ, Đo tốc độ âm ống cộng hưởng.
   - **Phase 4 (Nhiệt học & Chất khí - 3 bài):** Nhiệt dung riêng nước, Nhiệt nóng chảy đá, Đẳng nhiệt Boyle - Mariotte.

---

## 2. User's Direction & Consensus

- Chuẩn hóa toàn diện **16 bài thực hành** phủ sóng trọn vẹn chương trình SGK GDPT 2018 (Lớp 10, 11, 12) từ file `DacTa.md` và `data.sql`.
- Xây dựng **đủ bộ dụng cụ chuẩn hóa (25+ Tool IDs)** theo kiến trúc OOP kế thừa từ `BaseApparatus` và các Interface đặc thù, tích hợp port-based snapping và visual feedback.

---

## 3. Danh Mục 16 Bài Thực Hành & Bộ Dụng Cụ (Full Catalog)

| STT | Mã Lab (`lab_id`) | Tên Bài Thực Hành (SGK GDPT 2018) | Lớp | Danh Mục Dụng Cụ (`Tool IDs`) | Loại Tương Tác |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `sim-speed-measurement` | Bài 6: Đo tốc độ vật chuyển động | 10 | `INCLINED_TRACK`, `PHOTOGATE_SENSOR` (2), `DIGITAL_TIMER`, `STEEL_BALL` | 🎯 Kéo thả |
| **2** | `sim-free-fall` | Bài 14: Đo gia tốc rơi tự do | 10 | `VERTICAL_STAND`, `ELECTROMAGNET`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER`, `STEEL_BALL` | 🎯 Kéo thả |
| **3** | `sim-friction-coefficient` | Bài 21: Đo hệ số ma sát trượt | 10 | `SPRING_BALANCE`, `WOODEN_BLOCK`, `MASS_WEIGHT_SET`, `FRICTION_SURFACE` | 🎯 Kéo thả |
| **4** | `sim-momentum-collision` | Bài 30: Khảo sát động lượng & va chạm | 10 | `AIR_TRACK_BASE`, `GLIDER_CAR` (2), `PHOTOGATE_SENSOR` (2), `DIGITAL_TIMER` | 🎛️ Tham số / Kéo thả |
| **5** | `sim-hooke-law` | Bài 38: Độ biến dạng lò xo (Hooke) | 10 | `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET` | 🎯 Kéo thả |
| **6** | `sim-simple-pendulum` | Bài 7: Dao động con lắc đơn | 11 | `VERTICAL_STAND`, `PENDULUM_BOB`, `MEASURING_TAPE`, `DIGITAL_TIMER` | 🎛️ Tham số |
| **7** | `sim-spring-oscillation` | Bài 7: Dao động điều hòa con lắc lò xo | 11 | `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `DIGITAL_TIMER` | 🎛️ Tham số |
| **8** | `sim-sound-resonance` | Bài 5: Đo tốc độ truyền âm (Ống cộng hưởng) | 11 | `RESONANCE_TUBE`, `AUDIO_GENERATOR`, `TUNING_FORK` | 🎛️ Tham số |
| **9** | `sim-young-interference` | Bài 12: Đo bước sóng ánh sáng (Khe Y-âng) | 11 | `LASER_SOURCE_RGB`, `YOUNG_DOUBLE_SLIT`, `FRINGE_SCREEN`, `CALIPER_CROSSHAIR` | 🎯 Kéo thả |
| **10** | `sim-refraction` | Bài 21: Đo chiết suất của nước & khúc xạ | 11 | `GLASS_HALF_CYLINDER`, `LASER_SOURCE_RGB`, `PROTRACTOR_DISC` | 🎛️ Tham số |
| **11** | `sim-emf-internal-r` | Bài 19: Đo suất điện động $E$ & điện trở $r$ | 11 | `DC_POWER_SUPPLY`, `AMMETER_DC`, `VOLTMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH` | 🎯 Kéo thả |
| **12** | `sim-dc-circuit` | Mạch điện một chiều & Định luật Ohm | 11 | `DC_POWER_SUPPLY`, `AMMETER_DC`, `VOLTMETER_DC`, `RESISTOR_BOX`, `CIRCUIT_SWITCH` | 🎯 Kéo thả |
| **13** | `sim-specific-heat` | Bài 3: Đo nhiệt dung riêng của nước | 12 | `CALORIMETER_CUP`, `HEATING_COIL`, `DIGITAL_THERMOMETER`, `DIGITAL_TIMER` | 🎛️ Tham số |
| **14** | `sim-latent-heat` | Bài 4: Đo nhiệt nóng chảy của nước đá | 12 | `CALORIMETER_CUP`, `DIGITAL_THERMOMETER`, `ICE_MASS_SET` | 🎛️ Tham số |
| **15** | `sim-boyle-mariotte` | Bài 7: Quá trình đẳng nhiệt (Boyle - Mariotte) | 12 | `GAS_CYLINDER_PISTON`, `PRESSURE_GAUGE`, `VOLUME_SCALE` | 🎛️ Tham số |
| **16** | `sim-electromagnetic-induction` | Bài 12: Cảm ứng điện từ (Faraday & Lenz) | 12 | `BAR_MAGNET`, `INDUCTION_COIL`, `GALVANOMETER_G` | 🎯 Kéo thả |

---

## 4. Open Questions & Solvers

1. **Hệ thống dây nối điện (Wire / Circuit Snapping):** Dùng cơ chế click 2 cổng nối (Port $A \rightarrow B$) sinh đường Bezier Curve động và cập nhật đồ thị Kirchhoff/Ohm real-time.
2. **Quang phổ & Giao thoa:** Tính toán hàm cường độ sáng $I(x) = I_0 \cos^2\left(\frac{\pi a x}{\lambda D}\right)$ render trực tiếp lên Canvas + thước kẹp Caliper di chuyển lấy vi sai $\Delta x$.
3. **Nhiệt & Khí:** Áp dụng phương trình trạng thái khí lý tưởng $P \cdot V = n R T$ và phương trình cân bằng nhiệt $Q_{tỏa} = Q_{thu} \Rightarrow mc\Delta T + L m_{nc} = P \tau$.

---

## 5. Risks & Mitigations

- **Rủi ro:** Số lượng dụng cụ lớn (25+ class) gây phình to bundle hoặc trùng lặp logic.
- **Giải pháp:** Tái sử dụng `BaseApparatus`, chia module theo từng domain (`mechanics`, `circuits`, `optics`, `thermal`, `sensors`), và kế thừa interface rõ ràng.
