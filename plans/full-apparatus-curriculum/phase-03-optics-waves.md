# Phase 3: Optics, Waves & Acoustics (Khe Y-âng, Khúc xạ, Ống cộng hưởng)

## 1. Dụng cụ cần phát triển (OOP Classes & Views)
- `LaserApparatus.ts`: Nguồn laser bước sóng $\lambda = 380 - 750\text{nm}$.
- `YoungSlitApparatus.ts`: Bản hai khe hẹp $a = 0.1 - 1.0\text{mm}$.
- `ScreenApparatus.ts` & `CaliperApparatus.ts`: Màn hứng vân giao thoa và thước vi sai đo $i$.
- `GlassRefractorApparatus.ts`: Khối bán trụ thủy tinh trên đĩa chia độ tròn $360^\circ$.
- `ResonanceTubeApparatus.ts`: Ống thủy tinh chứa nước nâng hạ cột nước.

## 2. Các Lab Triển Khai
- `YoungInterferenceLab.tsx` (`sim-young-interference`): Đo bước sóng ánh sáng $\lambda = \frac{a \cdot i}{D}$.
- `RefractionLab.tsx` (`sim-refraction`): Định luật khúc xạ ánh sáng $n_1 \sin i = n_2 \sin r$.
- `SoundResonanceLab.tsx` (`sim-sound-resonance`): Tốc độ truyền âm $v = \lambda \cdot f$.
