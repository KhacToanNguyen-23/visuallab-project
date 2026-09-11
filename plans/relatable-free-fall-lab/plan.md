# Implementation Plan - Student-Friendly 3D Free Fall Lab

## Phase 1: Mở rộng Physics Engine (ree-fall-engine.ts)
- [ ] Bổ sung thông số Sức cản không khí $ và Hệ số Ma sát $, Diện tích $ của từng vật.
- [ ] Bổ sung biến hệ số tốc độ thời gian 	imeScale (1.0, 0.25, 0.1) vào hàm update().

## Phase 2: Dựng 3D Mesh Cho Các Vật Rơi & Vector Lực (PhetFreeFallLab.tsx)
- [ ] Tạo 3D Mesh cho Quả Táo (Đỏ/Cống), Bóng rổ (Cam/Vạch), Lông chim (Trắng/Mỏng).
- [ ] Tạo 3D Arrow Helper cho Vector Trọng lực $\vec{P}$ và Lực cản $\vec{F}_c$.

## Phase 3: Bảng Điều Khiển Học Sinh Thân Thiện (UI Control Panel)
- [ ] Thêm Bộ chọn Vật rơi (Icon Táo, Bóng, Bi, Lông chim).
- [ ] Thêm Công tắc Hút chân không (Vacuum Mode Switch).
- [ ] Thêm Bộ chọn Tốc độ Tua chậm (1x, 0.25x, 0.1x).
- [ ] Kiểm thử 
pm run build và kiểm tra 3D WebGL.
