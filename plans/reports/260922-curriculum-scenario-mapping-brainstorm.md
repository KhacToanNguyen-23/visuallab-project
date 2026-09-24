# Brainstorm: Dynamic Curriculum Scenario Engine & DacTa Mapping

**Date:** 2026-09-22  
**Status:** Completed  

---

## 1. Ideas Explored

1. **Phương án 1 (Dynamic Scenario Engine - Được chọn):**
   - Xây dựng 1 Scenario Registry trung tâm (`scenarioRegistry.ts`) chứa định nghĩa chuẩn của các bài SGK GDPT 2018 theo đúng file [DacTa.md](file:///d:/Project/FptProject/visuallab-project/DacTa.md).
   - Trang `CurriculumLabPage.tsx` nhận tham số `:labId` qua URL (`/lab/curriculum/:labId`), tự động nạp đúng bộ dụng cụ (`Tool IDs`), bảng ghi số liệu, công thức lý thuyết và câu hỏi thu hoạch.
   - Thư viện Catalog (`CatalogPage.tsx` và `labService.ts`) map toàn bộ link bài học vào router này, kèm route alias cho các link cũ (`/lab/speed-measurement`, `/lab/free-fall`, `/lab/sliding-friction`, v.v.).
2. **Phương án 2 (Mỗi bài 1 trang riêng biệt - Bị loại bỏ):**
   - Tạo 14-17 file trang độc lập gây phân mảnh code, khó bảo trì, trùng lặp logic giao diện.

---

## 2. User's Direction

- **Chốt Phương án 1:** Hệ thống kịch bản động (Dynamic Scenario Engine).
- Toàn bộ thiết bị hiển thị và logic thực hành phải khớp 100% với danh mục chuẩn hóa trong [DacTa.md](file:///d:/Project/FptProject/visuallab-project/DacTa.md).
- Thư viện Catalog khi học sinh bấm bất kỳ bài nào đều mở đúng bài đó trên nền Bàn 2.5D Workbench, không còn hiện tượng 404 hay màn hình trắng.

---

## 3. Danh Mục Map Bài SGK Chuẩn Hóa Theo DacTa.md

| Mã Route (`labId`) | Tên Bài SGK | Khối Lớp | Tool IDs Chuẩn Từ DacTa.md |
| :--- | :--- | :--- | :--- |
| `sim-speed-measurement` | Bài 6: Đo tốc độ vật chuyển động | Lớp 10 | `INCLINED_TRACK`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER`, `STEEL_BALL` |
| `sim-free-fall` | Bài 14: Đo gia tốc rơi tự do | Lớp 10 | `VERTICAL_STAND`, `ELECTROMAGNET`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER`, `STEEL_BALL` |
| `sim-friction-coefficient` | Bài 21: Đo hệ số ma sát trượt | Lớp 10 | `SPRING_BALANCE`, `WOODEN_BLOCK`, `MASS_WEIGHT_SET` |
| `sim-momentum-collision` | Bài 30: Khảo sát va chạm | Lớp 10 | `AIR_TRACK_BASE`, `GLIDER_CAR`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER` |
| `sim-spring-mass` | Bài 38: Khảo sát định luật Hooke | Lớp 10 | `VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `RULER` |
| `sim-simple-pendulum` | Bài 7: Dao động con lắc đơn | Lớp 11 | `VERTICAL_STAND`, `MASS_WEIGHT_SET`, `DIGITAL_TIMER` |
| `sim-sound-resonance` | Bài 5: Tốc độ truyền âm | Lớp 11 | `RESONANCE_TUBE`, `AUDIO_GENERATOR` |
| `sim-emf-internal-r` | Bài 19: Đo E & r của Pin | Lớp 11 | `DC_POWER_SUPPLY`, `AMMETER_DC`, `VOLTMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH` |
| `sim-refraction` | Bài 21: Đo chiết suất của nước | Lớp 11 | `GLASS_HALF_CYLINDER`, `LASER_SOURCE_RGB` |
| `sim-wave-interference` | Bài 12: Bước sóng khe Y-âng | Lớp 11 | `LASER_SOURCE_RGB`, `YOUNG_DOUBLE_SLIT`, `FRINGE_SCREEN`, `CALIPER_CROSSHAIR` |
| `sim-specific-heat` | Bài 3: Nhiệt dung riêng của nước | Lớp 12 | `CALORIMETER_CUP`, `HEATING_COIL`, `DIGITAL_THERMOMETER`, `DIGITAL_TIMER` |
| `sim-latent-heat` | Bài 4: Nhiệt nóng chảy nước đá | Lớp 12 | `CALORIMETER_CUP`, `DIGITAL_THERMOMETER` |
| `sim-boyle-mariotte` | Bài 7: Đẳng nhiệt Boyle-Mariotte | Lớp 12 | `GAS_CYLINDER_PISTON`, `PRESSURE_GAUGE` |
| `sim-induction` | Bài 12: Cảm ứng điện từ | Lớp 12 | `BAR_MAGNET`, `INDUCTION_COIL`, `GALVANOMETER_G` |

---

## 4. Risks & Mitigations

1. **Khả năng tương thích route cũ:**
   - *Risk:* Các đường dẫn cũ (`/lab/free-fall`, `/lab/sliding-friction`) bị hỏng.
   - *Mitigation:* Khai báo Route redirect hoặc render `CurriculumLabPage` với `labId` tương ứng trong `main.tsx`.
2. **Bộ dụng cụ cho các phân hệ ngoài Cơ học (Điện, Quang, Nhiệt):**
   - *Risk:* Thiếu template cho các bài Lớp 11 và 12.
   - *Mitigation:* Sử dụng `apparatusTemplates.ts` mở rộng với Fallback Vector Assets có sẵn.
