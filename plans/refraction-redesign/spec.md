# Specification: Thiết Kế Lại Thí Nghiệm Khúc Xạ Ánh Sáng & Phản Xạ Toàn Phần (Refraction & Total Internal Reflection Lab)

**Date:** 2026-09-18
**Status:** DRAFT / PROPOSED
**Target Route:** `http://localhost:5173/lab/refraction`
**Related Standard:** `/visuallab-standards` & SGK GDPT 2018 Vật Lý 11 (Chủ đề Quang hình học - Khúc xạ & Phản xạ toàn phần)

---

## 1. Mục Tiêu Sư Phạm & Kiến Trúc
Xây dựng lại module thí nghiệm ảo Khúc Xạ Ánh Sáng & Phản Xạ Toàn Phần theo chuẩn **VisualLab Parameter Concept Studio 3D (Three.js)** với:
1. **Khối Bán Nguyệt Trụ Quang Học 3D (Semi-Cylindrical Lens)** đặt tại tâm đĩa tròn chia độ $0 - 360^\circ$ khắc vạch chính xác.
2. **Nguồn Laser Đơn Sắc Xoay Động $0^\circ \to 90^\circ$** với tia tới (incident), tia phản xạ (reflected), và tia khúc xạ (refracted) phát sáng theo công thức Fresnel:
   - Chiếu $n_1 \to n_2$ (Khúc xạ thông thường $r < i$).
   - Chiếu $n_2 \to n_1$ (Phản xạ toàn phần khi $i \ge i_{\text{gh}} = \arcsin(n_1/n_2)$).
3. **Môi trường quang học phong phú**: Không khí ($n=1.00$), Nước ($n=1.33$), Thủy tinh Crown ($n=1.52$), Thủy tinh Flint ($n=1.66$), Kim cương ($n=2.42$), và **Khối vật liệu bí ẩn $X$ ($n_x$)**.
4. **Bảng Báo Cáo 3-Tab Wizard Worksheet**:
   - Tab 1: 3 Nhiệm vụ chuẩn SGK GDPT 2018.
   - Tab 2: Bảng số liệu $(i, r, \sin i, \sin r)$ & Đồ thị tuyến tính $\sin i - \sin r$ ngoại suy chiết suất $n_{21}$ và $R^2$.
   - Tab 3: Trắc nghiệm GDPT 2018, bảng điểm chi tiết 30/40/30 và nộp bài EduLab.

---

## 2. User Stories & Acceptance Criteria

### P1: 3D Semi-Cylindrical Lens Studio & Snell-Descartes Engine
- **As a** student,
- **I want to** observe a 3D glass semi-cylinder on a $360^\circ$ circular optics protractor, rotate the laser beam, and see glowing incident, reflected, and refracted rays with Fresnel intensities,
- **So that** I understand how light bends at the interface according to $n_1 \sin i = n_2 \sin r$.
- **Acceptance Criteria**:
  - Three.js WebGL studio renders transparent semi-cylindrical lens, protractor disc, laser emitter at 60 FPS.
  - Snell's Law solver accurately computes refraction angle $r = \arcsin\left(\frac{n_1 \sin i}{n_2}\right)$ or detects Total Internal Reflection ($i > i_{\text{gh}}$).

### P1: 3 GDPT 2018 Physics Missions with Mystery Medium
- **As a** student,
- **I want to** complete 3 structured missions (M1: Air $\to$ Glass Refraction, M2: Glass $\to$ Air Total Internal Reflection, M3: Identify Mystery Medium $X$),
- **So that** I master optical measurement methods and calculate refractive indices empirically.
- **Acceptance Criteria**:
  - Mission 1 validates $\ge 4$ measurement trials across $i \in [15^\circ, 75^\circ]$.
  - Mission 2 validates recording angle $i \approx i_{\text{gh}} \pm 1.5^\circ$ with total internal reflection.
  - Mission 3 calculates $n_x$ from $\sin i / \sin r$ linear regression and identifies the mystery material.

### P1: 3-Tab Wizard Worksheet with $\sin i - \sin r$ Linear Plot & Auto-Grading
- **As a** student,
- **I want to** log measurements to a data table, view a real-time $\sin i - \sin r$ scatter plot with regression slope $n_{21}$, complete a 3-question GDPT 2018 quiz, and get graded,
- **So that** I receive a 10-scale score (3.0 Operation, 4.0 Accuracy $\delta n$, 3.0 Quiz) and sync to EduLab storage.
- **Acceptance Criteria**:
  - Wizard worksheet manages 3 tabs smoothly without page refresh.
  - Auto-grading computes 30/40/30 score and saves report to `localStorage` under `edulab_refraction_grade_result`.

---

## 3. Measurable Success Criteria
1. **Kinematics & Optics Accuracy**: $\delta n = \frac{|n_{\text{calc}} - n_{\text{true}}|}{n_{\text{true}}} \times 100\% \le 3.0\%$.
2. **Build Verification**: `npm run build` exits 0 with 0 TypeScript/Rollup errors.
3. **Responsive UI**: Fit-to-viewport no scroll layout with OrbitControls and HUD dock.
