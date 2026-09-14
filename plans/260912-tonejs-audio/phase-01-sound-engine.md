# Phase 1: Lightweight Web Audio Synthesizer Engine

## Summary
Tạo file `src/utils/soundEngine.ts` dựa trên HTML5 Web Audio API chuẩn, không phụ thuộc thư viện nặng, hỗ trợ khởi tạo an toàn sau tương tác chuột (`user gesture`) và cung cấp các hàm phát âm thanh:
- `playSwitchClick()`: Tiếng cạch công tắc K.
- `playButtonBeep()`: Tiếng beep đồng hồ hiện số.
- `playCollisionClack(intensity)`: Tiếng va chạm đệm không khí.
- `playFrictionNoise(duration)`: Tiếng rít ma sát khối gỗ.
- `playGasHiss(pressure)`: Tiếng rít nén khí xy-lanh.
- `playResonanceTone(freq, isResonant)`: Tiếng loa sóng sin 500Hz.
- `playMagneticHum(speed)`: Tiếng hum từ trường cảm ứng.

## Success Criteria
- [ ] Thuật toán tổng hợp âm thanh chạy mượt mà 60 FPS, không gây lag UI.
- [ ] Tự động ngắt âm thanh sạch sẽ khi ngắt tương tác.
