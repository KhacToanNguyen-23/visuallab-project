# Master Feature Spec: Realistic Immersive Virtual Lab Suite (GDPT 2018 + World-Class UX)

**Status:** Draft / Master Consolidated Spec
**Date:** 2026-09-12
**Target Area:** `frontend/src/`

## 1. Context & Purpose
Tổng hợp toàn bộ yêu cầu nâng cấp dự án VisualLab thành hệ thống phòng thí nghiệm ảo chuẩn công nghiệp và quốc tế:
1. **14 Bài Thực Hành SGK GDPT 2018 (`DacTa.md`)**: Thay thế 100% mock data ở Landing Page, Thư viện Catalog, và giao diện làm bài.
2. **Giao Diện Không Gian Thật & 100% Fullscreen**: Khi vào bài lab (`/lab/*`), giao diện phủ kín 100% màn hình (`w-screen h-screen overflow-hidden`), ẩn Header/Footer portal, dùng font web chuẩn `font-sans`.
3. **Tạo Hình Chân Thực (Giảm Hoạt Hình)**: Hiệu ứng kim loại Metallic, mặt kính phản quang, vạch chia $0.01\text{mm}$, dây tóc bóng đèn phát sáng filament.
4. **Tính Năng Tương Tác Chuẩn Thế Giới**: Đồ thị động thời gian thực (Live Graphing), Phản hồi âm thanh/thị giác (Tone.js pitch/volume + visual glow), và Biểu đồ Năng lực Radar Chart 3 chiều (Thao tác 30% - Sai số 40% - Lý thuyết 30%).

## 2. Requirements & Scope

### P1 — Master Integration Items
- [ ] **14 Bài Thực Hành Chuẩn `DacTa.md`**: Cập nhật `DEFAULT_PUBLIC_LABS` trong `src/services/labService.ts` chuẩn hóa 14 bài thực hành Lớp 10, 11, 12 với đầy đủ Tool IDs, số trang SGK và đường dẫn mô phỏng.
- [ ] **Giao Diện Realistic Metallic & Glass (`CanvasRenderer.ts`)**: Nâng cấp hiệu ứng ánh kim cho Pin, Vôn kế, Ampe kế, Công tắc K, và hiệu ứng rực sáng sợi đốt bóng đèn Filament.
- [ ] **Đồ Thị Thời Gian Thực (`DataTableAndGraph.tsx`)**: Hiển thị đồ thị SVG động chạy song song với thao tác của học sinh.
- [ ] **Biểu Đồ Radar Năng Lực (`GradeResultView.tsx`)**: Nâng cấp màn hình nộp bài hiển thị biểu đồ Radar 3 trục (Thao tác - Sai số - Lý thuyết).

## 3. Success Criteria
- [ ] Màn hình Thư viện (`/thu-vien`) hiển thị đúng 14 bài thực hành chuẩn SGK GDPT 2018.
- [ ] Bộ linh kiện 2D Canvas có độ nổi 3D, ánh kim loại và mặt kính chân thực, không còn dáng vẻ hoạt hình phẳng.
- [ ] Đồ thị $U-I$, $x-t$, $v-t$ chạy sống động thời gian thực.
- [ ] Màn hình nộp bài vẽ biểu đồ Radar Chart năng lực mượt mà.
- [ ] Lệnh `npm run build` biên dịch thành công 0 lỗi.
