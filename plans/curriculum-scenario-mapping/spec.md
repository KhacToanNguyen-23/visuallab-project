# Spec: Dynamic Curriculum Scenario Engine & DacTa Mapping

**Date:** 2026-09-22  
**Status:** Ready  

---

## Problem Statement
Các thẻ bài học trong Thư viện Catalog hiện dẫn đến các route phân mảnh hoặc thiếu component. Đặc tả này thống nhất toàn bộ các bài thực hành SGK GDPT 2018 (Lớp 10, 11, 12) vào một Kiến trúc Scenario Registry trung tâm, ánh xạ chính xác danh mục Tool IDs từ file `DacTa.md` lên Bàn thí nghiệm 2.5D Workbench kèm bảng số liệu và chấm điểm tự động.

---

## User Stories

- **[P1]** As a student clicking any lab in the catalog, I want to immediately open the exact lab scenario with its standardized equipment from `DacTa.md` so that I can practice the curriculum lesson without 404 errors.  
  *Accepted when:* Clicking any lab card in Catalog navigates to `/lab/curriculum/:labId` or its alias route, loading all required Tool IDs from `DacTa.md`.

- **[P1]** As a student, I want each lab to display the correct SGK metadata (Grade, Lesson Number, Page, Objective, Instructions) in the workbench header so that I know what practical task to perform.  
  *Accepted when:* Header displays exact Grade, Lesson title, SGK page, and step-by-step instructions matching `DacTa.md`.

- **[P1]** As a student, I want an integrated measurement table tailored to each lab (e.g. $s, \Delta t, v$ for speed; $s, t, g$ for free fall; $F_{ms}, N, \mu$ for friction; $F, \Delta l, k$ for spring) so that I can collect data and evaluate results.  
  *Accepted when:* Data table records parameters specific to the active experiment and evaluates auto-grading score ($30\% + 40\% + 30\%$).

- **[P2]** As an admin or teacher, I want backwards-compatible routing for legacy simulation routes (`/lab/speed-measurement`, `/lab/free-fall`, `/lab/sliding-friction`, etc.) so that all existing links continue to function seamlessly.  
  *Accepted when:* Navigating to legacy URLs renders the corresponding scenario in the 2.5D Workbench.

---

## Functional Requirements

1. **FR-01 (Scenario Registry):** Cung cấp `getCurriculumScenario(labId: string): CurriculumScenario | null` hỗ trợ 14 bài chuẩn theo `DacTa.md`.
2. **FR-02 (Tool ID Mapping):** Thiết bị ban đầu của mỗi bài phải chứa chính xác các mã Tool ID tương ứng (ví dụ Bài 6: `INCLINED_TRACK`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER`, `STEEL_BALL`).
3. **FR-03 (Unified Lab Page):** `CurriculumLabPage` kết nối `Interactive2DWorkbench` với `DataTablePanel` phù hợp với bài đang chọn.
4. **FR-04 (Router & Catalog Synchronization):** Cập nhật `labRoutes.ts`, `labService.ts` và `main.tsx` để đồng bộ 100% các liên kết từ Catalog.

---

## Non-Functional Requirements
- **Reliability:** 0 broken links / 0 white screens across all 17 catalog cards.
- **Performance:** Chuyển đổi giữa các bài thực hành trong vòng $< 100\text{ms}$.

---

## Success Criteria
- [ ] Tất cả 17 thẻ bài học trên Catalog bấm vào đều mở đúng bài thực hành 2.5D Workbench.
- [ ] Danh mục thiết bị trên bàn của mỗi bài khớp 100% với danh mục Tool IDs trong `DacTa.md`.
- [ ] Bảng số liệu đo đạc và chấm điểm tự động hoạt động đồng bộ với từng bài.
