# Feature Spec: Comprehensive Experiments Catalog Page (Trang Thư Viện Bài Thí Nghiệm)

**Status:** Draft  
**Target Date:** 2026-09-11  

---

## Executive Summary
Phát triển trang **Thư Viện / Tổng Hợp Bài Thí Nghiệm (`/thu-vien`)** cho hệ thống VisualLab. Trang cho phép học sinh và giáo viên duyệt toàn bộ bài thí nghiệm Vật lý 10, 11, 12 chuẩn SGK GDPT 2018 (theo đặc tả `DacTa.md`), lọc theo Khối Lớp, lọc theo Chương bài học (Sidebar Tree View - Option B), và tìm kiếm theo từ khóa. Dữ liệu bài thí nghiệm được tải động từ API Backend `GET /api/curriculum/topics` (không dùng mock data cứng).

---

## User Stories

### P1: Strict Zero Decorative Icons / Emojis Constraint
- **As a** user,
- **I want** the entire CatalogPage and public components to strictly contain ZERO decorative emojis or icons (no 🌙, ☀️, 🔍, 📖, etc.),
- **So that** the application has a clean, professional academic SaaS look using pure text labels and minimal structural lines.
- **As a** student or teacher,
- **I want to** select a specific Grade (Lớp 10, Lớp 11, Lớp 12) and Chapter (Chương II: Động học, Chương I: Vật lý nhiệt...) from the Sidebar Tree View,
- **So that** I can view all matching Physics practical experiments specified in `DacTa.md`.

### P1: Real API Data Integration
- **As a** user,
- **I want to** see real experiment titles, descriptions, grade levels, tool badges, and SGK page numbers fetched from `http://localhost:8080/api/curriculum/topics`,
- **So that** I get accurate, live curriculum topics without static mock placeholders.

### P2: Keyword Search & UI Badging
- **As a** user,
- **I want to** type keywords into the search bar (e.g. "con lắc", "rơi tự do", "quang điện") and filter by Grade/Chapter,
- **So that** I can instantly find the physics labs I need.

### P2: Landing Page Navigation Integration
- **As a** visitor on the Landing Page,
- **I want** clicking "Xem Tất Cả Bài Thí Nghiệm →" to direct me straight to `/thu-vien` with active catalog filters,
- **So that** I can explore the complete catalog seamlessly.

---

## Success Criteria

1. **Routing & Landing Navigation**:
   - Clicking "Xem Tất Cả Bài Thí Nghiệm →" on Landing Page navigates to `/thu-vien`.
2. **Sidebar Tree View Filtering**:
   - Selecting a Grade (Lớp 10, 11, 12) filters labs instantly.
   - Selecting a Chapter filters labs under that specific chapter.
   - Selecting "Tất cả" resets the filter to show all labs.
3. **Data Integrity**:
   - Calls `labService.getAllLabs()` fetching from `http://localhost:8080/api/curriculum/topics`.
   - UI correctly displays badges (`🎯 Kéo thả` vs `🎛️ Tham số`), grade level, chapter, and SGK references.
4. **Build Verification**:
   - `npm run build` succeeds cleanly with exit code 0.

---

## Functional Specifications

### 1. Sidebar Component (Option B: Tree View Filter)
- Accordion / Tree view structure:
  - **Khối Lớp 10**:
    - Tất cả Chương Lớp 10
    - Chương II: Động học (Bài 6 T28)
    - Chương III: Động lực học (Bài 14 T57)
    - Chương IV: Năng lượng & Ma sát (Bài 21 T83)
    - Chương V: Động lượng & Va chạm (Bài 30 T117)
    - Chương VI: Định luật Hooke (Bài 38 T148)
  - **Khối Lớp 11**:
    - Tất cả Chương Lớp 11
    - Chương I: Dao động (Bài 7 T29)
    - Chương II: Sóng (Bài 5 T22, Bài 12 T50)
    - Chương III: Quang học (Bài 21 T85)
    - Chương IV: Dòng điện không đổi (Bài 19 T76)
  - **Khối Lớp 12**:
    - Tất cả Chương Lớp 12
    - Chương I: Vật lý nhiệt (Bài 3 T15, Bài 4 T19)
    - Chương II: Khí lý tưởng (Bài 7 T30)
    - Chương III: Từ trường (Bài 12 T52)

### 2. Live API Mapper (`labService.ts`)
- Transforms items returned by `GET /api/curriculum/topics` into `PublicLabItem`.
- Fallbacks to structured `DacTa.md` catalog items if API returns empty array, ensuring live compliance with SGK 2018.

---

## Verification Plan

### Automated Tests
- Build test: `cd frontend && npm run build` (tsc -b && vite build)

### Manual Verification
1. Navigate to `/` -> click "Xem Tất Cả Bài Thí Nghiệm →" -> lands on `/thu-vien`.
2. Test Sidebar Grade filter (Lớp 10, Lớp 11, Lớp 12).
3. Test Sidebar Chapter filter.
4. Test Search input with keywords like "rơi tự do", "con lắc".
