# Phase 3: Frontend Screenshot Capture & Confirmation Modal

**Objective:** Implement client-side HTML5 Canvas screenshot helper, confirmation dialog modal, and integrate "📸 Lưu Kho Thí Nghiệm" button across all Lab Workspaces.

## Components & Files

### [NEW] `frontend/src/services/storageService.ts`
- Functions: `uploadSnapshot(payload)`, `getMySnapshots()`, `deleteSnapshot(id)`.

### [NEW] `frontend/src/components/common/ScreenshotCaptureModal.tsx`
- Modal dialog displaying captured image preview.
- Input field for optional student caption/reflection note.
- Uploading state with loading spinner & success toast.

### [MODIFY] `frontend/src/components/simulation/PhetPendulumLab.tsx`
- Add "📸 Lưu Kho Thí Nghiệm" button in lab toolbar.

### [MODIFY] `frontend/src/components/simulation/PhetSpringLab.tsx`
- Add "📸 Lưu Kho Thí Nghiệm" button in lab toolbar.

### [MODIFY] `frontend/src/components/simulation/PhetEmfLab.tsx`
- Add "📸 Lưu Kho Thí Nghiệm" button in lab toolbar.

### [MODIFY] `frontend/src/components/simulation/PhetRefractionLab.tsx`
- Add "📸 Lưu Kho Thí Nghiệm" button in lab toolbar.

### [MODIFY] `frontend/src/pages/SRSWorkflowPage.tsx`
- Add "📸 Lưu Kho Thí Nghiệm" button in step header.

---

## Verification Steps

1. Run `npm run build` in `frontend/`.
2. Open any Lab Workspace, click "📸 Lưu Kho Thí Nghiệm", confirm modal appears with canvas preview.
