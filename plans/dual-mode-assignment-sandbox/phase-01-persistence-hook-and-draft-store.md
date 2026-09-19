# Phase 1: Unified Lab Persistence Hook & Draft Store

## 1. Goal
Xây dựng một module trung tâm `frontend/src/hooks/useLabPersistence.ts` chuyên quản lý:
1. Phát hiện chế độ `mode: 'assignment' | 'sandbox'`.
2. Lưu nháp tự động (`auto-save draft`) khi có thay đổi trong bảng đo hoặc bài trắc nghiệm với key chuẩn: `edulab_draft_${assignmentId}_${labSlug}`.
3. Phục hồi dữ liệu (`restore draft`) khi học sinh tải lại trang (F5).
4. Dọn dẹp bản nháp khi bài tập đã được nộp thành công (`clearDraft`).

## 2. Interface Design
```ts
export interface LabDraftState<TData = any, TQuiz = any> {
  assignmentId: string;
  labSlug: string;
  rows?: TData[];
  quizAnswers?: TQuiz;
  studentObservation?: string;
  gradeResult?: any;
  updatedAt: string;
}

export function useLabPersistence<TData, TQuiz>(options: {
  labSlug: string;
  assignmentId?: string;
  initialRows?: TData[];
  initialQuiz?: TQuiz;
}) {
  // Returns: { draft, saveDraft, clearDraft, isAssignmentMode }
}
```

## 3. Verification Criteria
- Khi `assignmentId` undefined (Sandbox Mode) $\to$ `isAssignmentMode = false`, không ghi vào `localStorage` draft.
- Khi `assignmentId` có giá trị $\to$ tự động load và khôi phục khi mount.
