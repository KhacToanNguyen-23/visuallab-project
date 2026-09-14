# Spec: Tích Hợp Tone.js Audio Engine Cho Các Phòng Lab VisualLab

**Trạng thái:** DRAFT  
**Ngày:** 2026-09-12  

---

## 🎯 Mục Tiêu

Tích hợp **Tone.js & Web Audio API** vào hệ thống các bài thực hành VisualLab nhằm tăng tính chân thực (tactile feedback), hỗ trợ trải nghiệm trực quan cho học sinh THPT và cung cấp chế độ Bật/Tắt âm thanh (Mute/Unmute) thuận tiện cho giáo viên khi trình chiếu.

---

## 👤 User Stories

### P1: Thao Tác Cơ Học Có Phản Hồi Âm Thanh (Tactile Mechanical SFX)
- Là **Học sinh**, tôi muốn nghe thấy tiếng cạch `click` khi bấm công tắc K, tiếng `tick` khi bấm đồng hồ hiện số và tiếng `splash` khi thả viên đá, để có cảm giác như đang thao tác dụng cụ thật trong phòng lab.

### P1: Âm Thanh Sóng & Tần Số Vật Lý (Physics Parametric Audio)
- Là **Học sinh**, tôi muốn nghe thấy tần số sóng âm $f = 500\text{Hz}$ trong bài Ống cộng hưởng tăng vọt biên độ khi mực nước đạt vị trí cộng hưởng ($L_1 = \lambda/4$), giúp tôi nhận biết hiện tượng sóng dừng bằng tai nghe.

### P2: Quản Lý Âm Thanh Dành Cho Giáo Viên (Teacher Audio Control)
- Là **Giáo viên**, tôi muốn có nút Mute/Unmute 1-click trên thanh Header để bật/tắt toàn bộ âm thanh khi đang giảng bài trước lớp.

---

## 📊 Tiêu Chí Nghiệm Thu (Acceptance Criteria)

1. **Khởi tạo An toàn (Autoplay Safe)**: Âm thanh chỉ phát sau khi học sinh có tương tác click chuột đầu tiên (`Tone.start()`).
2. **Quản lý Vòng đời (Clean Unmount)**: Mọi `AudioContext` / `Tone.Synth` được `dispose()` sạch sẽ khi học sinh rời khỏi phòng lab.
3. **Mute Toggle**: Nút Mute trên Header tắt ngắt hoàn toàn mọi âm thanh ngay lập tức.
