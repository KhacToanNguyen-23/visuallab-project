# Plan: Free Fall Lab OOP Decoupling & Pluggable Electromagnet

Mode: --fast
Risk: normal — Tách ElectromagnetApparatus thành class độc lập có công tắc nhả bi, hỗ trợ kéo trượt cổng quang và bắt dính bi thép chuẩn OOP.

## Mục tiêu
1. **Tạo Class OOP `ElectromagnetApparatus.ts` & `ElectromagnetView.ts`**:
   - Mã chuẩn `ELECTROMAGNET`.
   - Có công tắc bấm nhả (Release Switch) ngay trên thân nam châm điện để ngắt từ trường thả bi.
   - Cổng kẹp `CLAMP_STAND` (bắt dính vào giá đỡ `LINEAR_RAIL`) và cổng đáy `MAGNETIC_HOLD` (hút giữ bi thép).
2. **Nâng cấp `BallApparatus.ts`**:
   - Cho phép nhặt bi kéo thả tự do, đưa lại gần nam châm điện thì tự hút dính vào đáy nam châm.
   - Khi bấm công tắc ngắt điện: bi rơi tự do vi phân $y(t) = y_0 + \frac{1}{2}gt^2$ qua các cổng quang.
3. **Cổng quang `PhotogateApparatus` trượt linh hoạt**:
   - Cổng quang 1 và Cổng quang 2 kẹp trên ray đứng `LINEAR_RAIL`, học sinh dùng chuột kéo trượt lên/xuống để đổi độ cao $s_1, s_2$.
4. **Tích hợp vào `FreeFallLab.tsx` & Đăng ký `ApparatusRegistry`**:
   - Đồng bộ kết quả đo $t_1, t_2, \Delta t$ vào Bảng số liệu thực hành và tính $g = \frac{2s}{t^2}$.

---

## Các Phase Triển Khai Chi Tiết

- [ ] **Phase 1: ElectromagnetApparatus & ElectromagnetView**
  - Tạo `ElectromagnetView.ts` (cuộn dây, đèn LED trạng thái, nút bấm nhả).
  - Tạo `ElectromagnetApparatus.ts` với các cổng snap và đăng ký vào `ApparatusRegistry`.
- [ ] **Phase 2: BallApparatus Snapping & Free Fall Physics Integration**
  - Cập nhật `BallApparatus.ts` hỗ trợ bắt dính nam châm điện và rơi tự do vi phân.
- [ ] **Phase 3: FreeFallLab UI & Scenery Scene Refactor**
  - Cập nhật `FreeFallScene.ts` và `FreeFallLab.tsx` sử dụng trực tiếp các class `StandApparatus`, `ElectromagnetApparatus`, `BallApparatus`, `PhotogateApparatus`.
- [ ] **Phase 4: Build Verification**
  - Chạy `npm run build` và kiểm thử tương tác thực tế.

---

## Session Notes
**Status:** Plan Created. Ready for execution via `$bb-cook`.
