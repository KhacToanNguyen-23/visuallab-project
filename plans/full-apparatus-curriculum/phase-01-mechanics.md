# Phase 1: Mechanics Expansion (Ma sát trượt, Va chạm đệm khí, Con lắc đơn)

## 1. Dụng cụ cần phát triển (OOP Classes & Views)
- `FrictionBlockApparatus.ts` & `FrictionBlockView.ts`: Khối gỗ có móc kéo, hệ số ma sát $\mu_s, \mu_k$, đặt quả cân lên trên.
- `SpringBalanceApparatus.ts` & `SpringBalanceView.ts`: Lực kế lò xo $0 - 5\text{N}$, hiển thị kim chỉ vạch $0.1\text{N}$.
- `AirTrackApparatus.ts` & `GliderView.ts`: Đệm khí không ma sát, 2 xe trượt khối lượng $m_1, m_2$, cản đàn hồi/dính.
- `PendulumApparatus.ts` & `PendulumView.ts`: Con lắc đơn góc lệch $\alpha_0$, chiều dài dây $l$.

## 2. Các Lab Triển Khai
- `SlidingFrictionLab.tsx` (`sim-friction-coefficient`): Kéo lực kế đo lực ma sát trượt $F_{ms} = \mu N$.
- `MomentumCollisionLab.tsx` (`sim-momentum-collision`): Va chạm 2 xe qua cổng quang điện, kiểm chứng $p = m_1 v_1 + m_2 v_2$.
- `SimplePendulumLab.tsx` (`sim-simple-pendulum`): Đo chu kỳ $T = 2\pi\sqrt{l/g}$ với đồng hồ hiện số.

## 3. Tiêu chí Hoàn thành
- Các class đăng ký vào `ApparatusFactory.ts`.
- Routes tương ứng `/lab/sliding-friction`, `/lab/momentum-collision`, `/lab/simple-pendulum` hoạt động ổn định.
