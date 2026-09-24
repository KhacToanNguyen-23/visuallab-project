# Phase 2: DC Circuits & Electromagnetism (Pin DC, Ohm, Cảm ứng điện từ)

## 1. Dụng cụ cần phát triển (OOP Classes & Views)
- `PowerSupplyApparatus.ts`: Nguồn DC $1.5\text{V} - 12\text{V}$, suất điện động $E$, điện trở trong $r$.
- `MultimeterApparatus.ts`: Vôn kế DC ($0 - 3\text{V}$), Ampe kế DC ($0 - 500\text{mA}$), Điện kế G ($\pm 50\mu\text{A}$).
- `RheostatApparatus.ts`: Biến trở con chạy $0 - 100\Omega$.
- `SwitchApparatus.ts`: Khóa K đóng/ngắt.
- `MagnetApparatus.ts`: Nam châm vĩnh cửu N-S.
- `InductionCoilApparatus.ts`: Cuộn dây cảm ứng Faraday.

## 2. Các Lab Triển Khai
- `EmfInternalRLab.tsx` (`sim-emf-internal-r`): Khảo sát $U = E - I \cdot r$.
- `DcCircuitLab.tsx` (`sim-dc-circuit`): Định luật Ohm cho toàn mạch.
- `ElectromagneticInductionLab.tsx` (`sim-electromagnetic-induction`): Thí nghiệm Faraday & Chiều dòng điện theo định luật Lenz.
