# Phase 2: Unified Curriculum Lab Page & Dynamic Table Adapter

**File:** `plans/curriculum-scenario-mapping/phase-02-unified-curriculum-lab-page.md`  
**Story Mapping:** `curriculum-unified-lab-page` [P1]  

---

## 1. Objective
Xây dựng trang `CurriculumLabPage.tsx` nhận `:labId`, nạp kịch bản động vào `Interactive2DWorkbench`, đồng thời thích ứng bảng đo số liệu và tiêu chí chấm điểm tự động theo từng bài.

---

## 2. Proposed Changes

### `frontend/src/pages/CurriculumLabPage.tsx` [NEW]
- Sử dụng `useParams<{ labId: string }>()`.
- Lấy kịch bản từ `getCurriculumScenario(labId)`.
- Kết nối Bàn 2.5D Workbench với Bảng số liệu và Auto-grader.

---

## 3. Verification Criteria
- Truy cập `/lab/curriculum/sim-speed-measurement` hoặc `/lab/curriculum/sim-free-fall` hiển thị chính xác tiêu đề, mục tiêu SGK và bảng dụng cụ tương ứng.
