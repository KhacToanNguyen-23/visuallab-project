# Brainstorm: Tích Hợp Tone.js & Web Audio API Cho 14 Bài Lab VisualLab

**Ngày lập:** 2026-09-12  
**Đối tượng sử dụng:** Học sinh & Giáo viên THPT (SGK GDPT 2018)

---

## 💡 Các Hướng Đã Khảo Sát

1. **Hướng 1: Dynamic Physics Audio (Âm thanh biến thiên theo thông số vật lý)**
   - Tiếng va chạm, tiếng rít khí nén pít-tông, tiếng hum từ trường biến thiên.
2. **Hướng 2: Tactile Mechanical SFX (Âm thanh thao tác cơ học thiết bị)**
   - Tiếng cạch công tắc K, tiếng vặn núm xoay biến trở, tiếng thả đá splash, tiếng bấm đồng hồ hiện số.
3. **Hướng 3: Audio Resonance & Acoustics (Sóng âm & Tần số dao động)**
   - Tiếng loa sóng sin 500Hz trong bài ống cộng hưởng âm, tiếng nhịp Metronome dao động con lắc.

---

## 🎯 Đề Xuất Giải Pháp Tối Ưu (Khuyên Dùng Cho THPT)

Kết hợp **Mô Hình Âm Thanh Tương Tác 2 Lớp (Dual-Layer Adaptive Physics Audio)**:

- **Lớp 1 - Chân thực khi thao tác (Tactile Realism):** Giúp học sinh cảm nhận rõ nét khi ấn nút, kéo thả, đóng công tắc K, thả bi steel ball hay vặn nấc biến trở.
- **Lớp 2 - Bản chất vật lý (Physics Parametric Audio):** Phát tần số âm sóng sin khi đạt điểm cộng hưởng $L = \lambda/4$, phát tiếng `hum` từ trường khi dịch chuyển nam châm nhanh/chậm.
- **Tính năng bắt buộc cho Giáo viên:** Nút **Mute / Unmute (Âm thanh 1-click)** trên thanh Header để giáo viên chủ động bật/tắt tiếng khi trình chiếu giảng dạy trên lớp.

---

## ⚠️ Rủi Ro Cần Lưu Ý

1. **Browser Autoplay Policy:** Trình duyệt chặn phát âm thanh nếu học sinh chưa click vào màn hình ➔ Cần khởi tạo `Tone.start()` ngay khi học sinh tương tác click lần đầu (`user gesture`).
2. **Resource Cleanup:** Phải giải phóng `Tone.Synth` và `AudioContext` khi chuyển bài lab để tránh memory leak.
