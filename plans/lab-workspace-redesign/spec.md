# Feature Spec: Immersive Realistic Physical Lab Workspace UX/UI

**Status:** Draft / Brainstormed & Planned
**Date:** 2026-09-12
**Target Area:** `frontend/src/components/simulations/`, `frontend/src/layouts/`

## 1. Context & Purpose
Nâng cấp toàn bộ giao diện bài thí nghiệm ảo VisualLab sang mô hình **Không gian Phòng Lab Thực tế (Immersive Physical Workspace)**. Khi bấm vào bài lab, giao diện hiển thị 100% toàn màn hình (`w-screen h-screen overflow-hidden`), sử dụng font chữ web chuẩn (`font-sans`), thông số vật lý PhET theo cây chương trình SGK GDPT 2018 (`spec.md`), và loại bỏ triệt để các thiết bị/UI bịa dữ liệu.

## 2. Requirements & Scope

### P1 — Essential UI/UX Standards (Phải làm ngay)
- [ ] **100% Fullscreen Viewport**: Tất cả các đường dẫn bài lab (`/lab/*`) được bọc trong giao diện Toàn Màn Hình tràn viền (`w-screen h-screen overflow-hidden`), ẩn hoàn toàn Header/Footer của Portal tin tức.
- [ ] **Bàn Thí Nghiệm Thực Tế (Physical Bench Atmosphere)**: Giao diện vùng làm việc mô phỏng mặt bàn lab thực sự với đường kẻ vạch chia lưới, thanh công cụ đo lường chuyên nghiệp (Đồng hồ hiện số, Vôn kế, Ampe kế, Thước kẹp).
- [ ] **Font Chữ Web Đồng Nhất**: Đảm bảo 100% chữ hiển thị dùng `font-sans` (Inter/System UI), đọc chuẩn tiếng Việt có dấu, không dùng font chữ phá cách gây khó đọc.
- [ ] **Sạch Sẽ & Không Bịa Dữ Liệu**: Loại bỏ hoàn toàn emoji nhếch nhác hay nút điều khiển bịa đặt. Chỉ dùng đúng các thiết bị chuẩn theo Tool IDs (`PHOTOGATE_SENSOR`, `VOLTMETER_DC`, `RESONANCE_TUBE`,...).

### P2 — PhET Parameter Mapping & Measurements
- [ ] **Chuẩn Hóa Hằng Số Vật Lý PhET**: Cập nhật dải tham số cho con lắc ($g=9.81\text{m/s}^2$), mạch điện ($E=1.5-12\text{V}$), sóng âm ($f=100-2000\text{Hz}$), khúc xạ ($n=1.0-1.7$).

## 3. Success Criteria
- [ ] Khi truy cập bất kỳ route `/lab/*`, giao diện phủ kín 100% màn hình không bị cuộn trang ngoài ý muốn.
- [ ] Font chữ chuẩn `font-sans` hiển thị tiếng Việt sắc nét.
- [ ] Tất cả công cụ đo lường và linh kiện đều có mã ID chuẩn và chia vạch kỹ thuật thực tế.
