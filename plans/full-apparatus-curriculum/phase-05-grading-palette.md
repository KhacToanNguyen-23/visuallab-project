# Phase 5: Palette Integration, Wire Engine & Auto-Grading

## 1. Dụng cụ & Engine
- Cập nhật `WorkbenchPalette.tsx` để hiển thị đầy đủ 6 nhóm dụng cụ (Cơ học, Mạch điện, Quang học, Sóng & Âm, Nhiệt học, Cảm biến).
- Nâng cấp `SnapEngine.ts` với chế độ Wire Connection (cắm dây điện giữa 2 cực Port).
- Tích hợp `AutoGrader.ts` với 16 schemas từ `worksheetSchemas.ts`.

## 2. Tiêu chí Hoàn thành
- Sandbox 2.0 kéo thả và phối ghép được mọi dụng cụ từ 6 lĩnh vực.
- Tất cả bài lab có nút "Nộp bài" và gửi snapshot điểm số lên backend `/api/snapshots`.
