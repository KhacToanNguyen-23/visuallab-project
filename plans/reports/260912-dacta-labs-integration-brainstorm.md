# Brainstorm Report: Thay Thế Mock Data Bài Lab Theo Đúng DacTa.md (SGK GDPT 2018)

**Date:** 2026-09-12
**Focus:** Thay thế toàn bộ mảng dữ liệu lab mẫu (mock data) ở Landing Page, Trang Thư Viện (CatalogPage), Trang Học Sinh (Student Workspace) và Trang Giáo Viên (Teacher Assign) theo chuẩn 14 bài thực hành trong `DacTa.md`.

---

## 📚 Danh Mục 14 Bài Thực Hành Chuẩn DacTa.md (SGK GDPT 2018)

### Khối Lớp 10
1. `sim-speed-measurement` — **Bài 6 (T28)**: Đo tốc độ của vật chuyển động thẳng [🎯 Kéo thả] (`INCLINED_TRACK`, `PHOTOGATE_SENSOR` x2, `DIGITAL_TIMER`, `STEEL_BALL`) -> Route `/lab/free-fall`
2. `sim-free-fall` — **Bài 14 (T57)**: Đo gia tốc rơi tự do $g$ [🎯 Kéo thả] (`VERTICAL_STAND`, `ELECTROMAGNET`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER`, `STEEL_BALL`) -> Route `/lab/free-fall`
3. `sim-friction-coefficient` — **Bài 21 (T83)**: Đo hệ số ma sát trượt [🎯 Kéo thả] (`SPRING_BALANCE`, `WOODEN_BLOCK`, `MASS_WEIGHT_SET`) -> Route `/lab/dc-circuit`
4. `sim-momentum-collision` — **Bài 30 (T117)**: Khảo sát động lượng & va chạm [🎛️ Tham số] (`AIR_TRACK_BASE`, `GLIDER_CAR` x2, `PHOTOGATE_SENSOR` x2, `DIGITAL_TIMER`) -> Route `/lab/free-fall`
5. `sim-hooke-law` — **Bài 38 (T148)**: Độ giãn lò xo (Định luật Hooke) [🎯 Kéo thả] (`VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`) -> Route `/lab/spring-mass`

### Khối Lớp 11
6. `sim-sound-resonance` — **Bài 5 (T22)**: Đo tốc độ truyền âm (Ống cộng hưởng) [🎛️ Tham số] (`RESONANCE_TUBE`, `AUDIO_GENERATOR`) -> Route `/lab/sound-resonance`
7. `sim-simple-pendulum` — **Bài 7 (T29)**: Dao động con lắc đơn & con lắc lò xo [🎛️ Tham số] (`VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `DIGITAL_TIMER`) -> Route `/lab/simple-pendulum`
8. `sim-young-interference` — **Bài 12 (T50)**: Đo bước sóng ánh sáng (Khe Y-âng) [🎯 Kéo thả] (`LASER_SOURCE_RGB`, `YOUNG_DOUBLE_SLIT`, `FRINGE_SCREEN`, `CALIPER_CROSSHAIR`) -> Route `/lab/wave-interference`
9. `sim-emf-internal-r` — **Bài 19 (T76)**: Đo suất điện động $E$ & $r$ của Pin [🎯 Kéo thả] (`DC_POWER_SUPPLY`, `AMMETER_DC`, `VOLTMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH`) -> Route `/lab/emf-internal-r`
10. `sim-refraction` — **Bài 21 (T85)**: Đo chiết suất của nước & Khúc xạ [🎛️ Tham số] (`GLASS_HALF_CYLINDER`, `LASER_SOURCE_RGB`) -> Route `/lab/refraction`

### Khối Lớp 12
11. `sim-specific-heat` — **Bài 3 (T15)**: Đo nhiệt dung riêng của nước [🎛️ Tham số] (`CALORIMETER_CUP`, `HEATING_COIL`, `DIGITAL_THERMOMETER`, `DIGITAL_TIMER`) -> Route `/lab/spring-mass`
12. `sim-latent-heat` — **Bài 4 (T19)**: Đo nhiệt nóng chảy nước đá [🎛️ Tham số] (`CALORIMETER_CUP`, `DIGITAL_THERMOMETER`) -> Route `/lab/spring-mass`
13. `sim-boyle-mariotte` — **Bài 7 (T30)**: Quá trình đẳng nhiệt (Boyle - Mariotte) [🎛️ Tham số] (`GAS_CYLINDER_PISTON`, `PRESSURE_GAUGE`) -> Route `/lab/emf-internal-r`
14. `sim-electromagnetic-induction` — **Bài 12 (T52)**: Cảm ứng điện từ [🎯 Kéo thả] (`BAR_MAGNET`, `INDUCTION_COIL`, `GALVANOMETER_G`) -> Route `/lab/dc-circuit`

---

## 🎯 Phạm Vi Nâng Cấp (Refactoring Scope)

1. **`src/services/labService.ts`**: Cập nhật mảng `DEFAULT_PUBLIC_LABS` chuẩn hóa 14 bài thực hành trên với đầy đủ Tên bài, SGK Trang, Lớp, Phân loại (Kéo thả / Tham số) và Tool IDs.
2. **`src/pages/CatalogPage.tsx`**: Đồng bộ các bộ lọc Lớp (Lớp 10, Lớp 11, Lớp 12) và Chủ đề (Cơ học, Điện học, Quang học, Nhiệt học).
3. **`src/pages/LandingPage.tsx`**: Hiển thị các bài nổi bật chuẩn DacTa.md.
4. **`src/pages/teacher/TeacherLabsPage.tsx` & `TeacherAssignPage.tsx`**: Cho phép giáo viên giao các bài lab chuẩn DacTa.md.

---

## 🚀 Các Bước Thực Thi
- **Step 1**: Cập nhật `DEFAULT_PUBLIC_LABS` trong `src/services/labService.ts`.
- **Step 2**: Kiểm tra biên dịch TypeScript `npm run build` nghiệm thu.
