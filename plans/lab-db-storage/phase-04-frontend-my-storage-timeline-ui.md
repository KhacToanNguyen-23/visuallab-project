# Phase 4: Frontend Student "My Storage" Timeline UI

**Objective:** Implement dedicated Student "My Storage" (Kho lưu trữ thí nghiệm) page with chronological timeline, filter tags, and Lightbox modal preview.

## Components & Files

### [NEW] `frontend/src/pages/student/StudentStoragePage.tsx`
- Timeline layout grouped by date (e.g. "Hôm nay", "10 Tháng 9, 2026").
- Cards showing screenshot thumbnail, lab title, domain badge, difficulty badge (`DỄ`, `TRUNG BÌNH`, `NÂNG CAO`), caption notes, timestamp.
- Full-screen Lightbox image preview modal.
- Delete snapshot action with confirmation dialog.

### [MODIFY] `frontend/src/components/student/StudentSidebar.tsx`
- Add "Kho Lưu Trữ" tab with camera/image icon routing to `/student/storage`.

### [MODIFY] `frontend/src/main.tsx`
- Register route `/student/storage` under `StudentLayout`.

---

## Verification Steps

1. Run `npm run build` in `frontend/`.
2. Navigate to `/student/storage` in browser and verify timeline renders stored snapshots cleanly.
