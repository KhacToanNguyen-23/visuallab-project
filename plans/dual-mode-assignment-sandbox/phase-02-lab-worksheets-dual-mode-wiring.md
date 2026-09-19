# Phase 2: Lab Worksheets Dual-Mode Integration

## 1. Goal
Tích hợp `useLabPersistence` vào các phòng thí nghiệm chính:
1. `RefractionLabWizardWorksheet.tsx`
2. `InductionLabWizardWorksheet.tsx`
3. `SpeedLabWizardWorksheet.tsx`
4. `MomentumLabWizardWorksheet.tsx`
5. `BoyleLabWizardWorksheet.tsx` & `LatentHeatLabWizardWorksheet.tsx`

## 2. Implementation Strategy
- Truyền `assignmentId` từ `StudentLabAssignmentWorkbenchPage` xuống các Lab component qua context / props.
- Khi người học ghi điểm đo hoặc trả lời trắc nghiệm $\to$ tự động gọi `saveDraft(...)`.
- Khi bấm "Nộp báo cáo" $\to$ đánh giá, lưu kết quả, đồng thời kích hoạt callback `onGraded` để cập nhật ngăn nộp bài.
