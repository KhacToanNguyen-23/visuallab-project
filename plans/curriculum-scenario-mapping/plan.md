# Implementation Plan: Dynamic Curriculum Scenario Engine & DacTa Mapping

**Directory:** plans/curriculum-scenario-mapping/  
**Mode:** --hard  
**Risk:** normal — multi-file frontend routing and scenario registry mapping, testable, no auth/schema/infra risk  
**Spec Reference:** [plans/curriculum-scenario-mapping/spec.md](file:///d:/Project/FptProject/visuallab-project/plans/curriculum-scenario-mapping/spec.md)  
**Brainstorm Report:** [plans/reports/260922-curriculum-scenario-mapping-brainstorm.md](file:///d:/Project/FptProject/visuallab-project/plans/reports/260922-curriculum-scenario-mapping-brainstorm.md)  

---

## Architecture Overview
1. **`scenarioRegistry.ts`:** Khai báo kịch bản cho 14 bài SGK GDPT 2018 theo đúng danh mục Tool IDs chuẩn trong `DacTa.md`.
2. **`CurriculumLabPage.tsx`:** Nhận `:labId` qua URL, nạp Scenario tương ứng vào `Interactive2DWorkbench`, đồng thời hiển thị bảng số liệu đo đạc và câu hỏi trắc nghiệm thu hoạch.
3. **Route & Catalog Synchronization:** Map toàn bộ 17 thẻ bài học trong `labService.ts` và `main.tsx` trỏ đúng vào `CurriculumLabPage`, hỗ trợ alias cho tất cả đường dẫn cũ (`/lab/speed-measurement`, `/lab/free-fall`, `/lab/sliding-friction`, v.v.).

---

## Phase Breakdown

- **[x] Phase 1:** Scenario Registry & Tool IDs Standardization (`phase-01-scenario-registry-dacta.md`)
  - Maps to: `curriculum-scenario-registry-dacta` [P1] (Status: PASSING)
- **[x] Phase 2:** Unified Curriculum Lab Page & Dynamic Table Adapter (`phase-02-unified-curriculum-lab-page.md`)
  - Maps to: `curriculum-unified-lab-page` [P1] (Status: PASSING)
- **[x] Phase 3:** Route Synchronization & Catalog Mapping (`phase-03-catalog-routing-sync.md`)
  - Maps to: `curriculum-catalog-route-sync` [P1], `curriculum-legacy-routes-alias` [P2] (Status: PASSING)

---

## Risks & Mitigations
- **Dữ liệu bài thí nghiệm chưa có sẵn:** Áp dụng Fallback Apparatus Template với đầy đủ Tool IDs và nhãn tiếng Việt chuẩn SGK.
- **Tương thích URL cũ:** Khai báo route alias song song cả `/lab/curriculum/:labId` và các route cũ trong `main.tsx`.

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-22 14:55
**Phase in progress:** Completed all phases (Phase 1, 2, 3)
**Status:** All curriculum scenarios mapped, route aliases active, build clean (0 errors) and all 4 test suites passing.

### Decisions made this session
- Unified all simulation routes to `CurriculumLabPage` with dynamic `:labId` resolver and backwards-compatible path segment recognition.
- Cleaned up dangling imports in `StudentLabAssignmentWorkbenchPage`, `StudentLabAssignmentView`, and `SRSWorkflowPage`.
- Resolved TypeScript compiler errors (`node:assert`, `toolId`, `useThree`, and unused variables) yielding 100% clean `tsc -b && vite build`.

### Next immediate action
- Ready for user review / end-to-end verification.

