# Phase 3: Measurement Tools, Routing & Snapshot Export

**Plan:** [`plans/universal-physics-workbench/plan.md`](file:///d:/6_OJT/EduLab/plans/universal-physics-workbench/plan.md)  
**Spec Story:** P2-US1 & P2-US2 (Đo đạc, Đồ thị & Lưu kho Snapshot)

---

## 🎯 Phase Goal
Tích hợp các dụng cụ đo (Thước đo $cm$, Thước đo góc 360°, Vôn kế, Ampe kế), tính năng chụp ảnh lưu vào kho bài tập (Cloudinary API) và cập nhật đường dẫn ứng dụng.

---

## 🛠️ Proposed Changes

### Frontend Integration

#### [MODIFY] [UniversalWorkbenchPage.tsx](file:///d:/6_OJT/EduLab/frontend/src/pages/UniversalWorkbenchPage.tsx)
- Tích hợp modal `ScreenshotCaptureModal` chụp ảnh canvas và gửi về backend `/api/snapshots`.

#### [MODIFY] [labRoutes.ts](file:///d:/6_OJT/EduLab/frontend/src/utils/labRoutes.ts) & [main.tsx](file:///d:/6_OJT/EduLab/frontend/src/main.tsx)
- Đăng ký route `/workbench/universal` trỏ đến `UniversalWorkbenchPage`.

#### [MODIFY] [DashboardPage.tsx](file:///d:/6_OJT/EduLab/frontend/src/pages/DashboardPage.tsx) & [SimCard.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/dashboard/SimCard.tsx)
- Thêm thẻ thí nghiệm "Bàn Thí Nghiệm Tự Do (Universal Sandbox)" lên trang Dashboard cho Học sinh & Giáo viên.

---

## 🧪 Verification Criteria

- [ ] Route `/workbench/universal` truy cập trực tiếp thành công.
- [ ] Chụp ảnh sandbox custom và gửi lưu vào kho cá nhân thành công.
