# Implementation Plan: Comprehensive Experiments Catalog Page (Trang Thư Viện Bài Thí Nghiệm)

Mode: --fast
Risk: normal — Multi-file UI refactor (CatalogPage, LandingPage, labService) with zero backend/schema changes.
Spec: plans/experiments-catalog/spec.md

---

## Overview
Transform `CatalogPage.tsx` (`/thu-vien`) into a complete, interactive Physics Experiment Catalog page matching `DacTa.md` specifications. Implement Option B (Sidebar Tree View by Grade 10/11/12 and Chapter), keyword search filtering, and dynamic lab loading from `labService.getAllLabs()`. Connect Landing Page "Xem Tất Cả Bài Thí Nghiệm →" button directly to `/thu-vien`.

---

## Phase 1: Service Data Mapping & Enhancement (`labService.ts`)
- [MODIFY] `frontend/src/services/labService.ts`
  - Enhance `labService.getAllLabs()` to query `http://localhost:8080/api/curriculum/topics` and enrich data with `DacTa.md` metadata (Grade 10, 11, 12, Chapter, SGK page reference).
  - Add fallback catalog items structured directly from `DacTa.md` if backend array is empty, ensuring all 14 SGK 2018 labs are discoverable.

---

## Phase 2: Sidebar Tree View & Clean Text UI (`CatalogPage.tsx`)
- [MODIFY] `frontend/src/pages/CatalogPage.tsx`
  - Enforce **Zero Decorative Emojis/Icons**: Remove 🌙, ☀️, 🔍, 📖, etc. Replace theme toggle with clean text ("Giao diện: Tối" / "Giao diện: Sáng"), replace search emoji with "Tìm kiếm:" text label, replace book emoji with "SGK" text tag.
  - Interactive **Sidebar Tree View** (Option B):
    - Grade accordions: Lớp 10, Lớp 11, Lớp 12.
    - Sub-items: Chapters under each Grade (e.g. Chương II: Động học, Chương I: Dao động, Chương I: Vật lý nhiệt...).
  - Enable keyword search bar input to filter labs dynamically by title, chapter, or tool name.
  - Render lab card grid with grade badge, chapter badge, SGK page text reference, and direct "Vào Thực Hành →" action button.
  - Implement empty state when no labs match selected filters.

---

## Phase 3: Navigation Routing Integration & Build Verification
- [MODIFY] `frontend/src/pages/LandingPage.tsx`
  - Ensure "Xem Tất Cả Bài Thí Nghiệm →" catalog header button links to `/thu-vien`.
- Verification:
  - Execute `npm run build` in `frontend/` directory to ensure clean TypeScript compilation.
