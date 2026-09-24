# Phase 3: Route Synchronization & Catalog Mapping

**File:** `plans/curriculum-scenario-mapping/phase-03-catalog-routing-sync.md`  
**Story Mapping:** `curriculum-catalog-route-sync` [P1], `curriculum-legacy-routes-alias` [P2]  

---

## 1. Objective
Cập nhật `labRoutes.ts`, `labService.ts` và `main.tsx` để đồng bộ 100% các liên kết từ Thư viện bài thí nghiệm (Catalog), đảm bảo bấm vào bất kỳ thẻ nào trong 17 thẻ bài học đều điều hướng mượt mà, không gặp lỗi 404 hay màn hình trắng.

---

## 2. Proposed Changes

### `frontend/src/utils/labRoutes.ts` & `src/services/labService.ts` [MODIFY]
- Chuẩn hóa trường `route` cho toàn bộ 17 bài về `/lab/curriculum/:labId`.

### `frontend/src/main.tsx` [MODIFY]
- Khai báo route `/lab/curriculum/:labId` trỏ vào `CurriculumLabPage`.
- Đăng ký alias cho tất cả route cũ (`/lab/speed-measurement`, `/lab/free-fall`, v.v.) render `CurriculumLabPage` tương ứng.

---

## 3. Verification Criteria
- Duyệt qua toàn bộ 17 thẻ trên trang Catalog, bấm "Trải Nghiệm Thí Nghiệm →", xác nhận 100% điều hướng thành công.
