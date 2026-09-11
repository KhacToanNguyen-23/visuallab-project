# PRD & Technical Spec: Bàn Làm Việc Thí Nghiệm Vật Lý Tự Do (PhET SceneryStack Universal Workbench)

**Slug:** `universal-physics-workbench`  
**Target Route:** `/workbench/universal`  
**Core Stack:** PhET SceneryStack (`scenerystack/scenery`, `scenerystack/dot`, `scenerystack/kite`, `scenerystack/axon`), KaTeX, Chart.js  

---

## 🎯 Executive Overview

Hệ thống **Universal Physics Workbench** cung cấp một "Bàn thí nghiệm trống" chuẩn PhET Interactive Simulations cho phép học sinh và giáo viên tự do kéo thả, lắp ráp và sáng tạo các bài thí nghiệm Vật lý thuộc 3 phân môn **Cơ học**, **Điện học** và **Quang học**. Hệ thống hỗ trợ điểm kết nối từ tính (`SnapPort`) tự động móc/nối các linh kiện thực tế (lò xo, quả nặng, pin, bóng đèn, thấu kính, laser) với trải nghiệm mượt mà 60 FPS.

---

## 👥 User Stories & Acceptance Criteria

### P1 — Core Sandbox & Snap-Port Engine (Bắt buộc MVP)

- **[P1-US1] Kéo thả linh kiện từ Palette vào Canvas**:
  - tư cách là học sinh, tôi muốn chọn bất kỳ linh kiện nào từ Palette bên trái (Lò xo, Quả nặng, Pin, Bóng đèn, Công tắc, Dây điện, Đèn Laser, Thấu kính) và kéo thả vào mặt bàn thí nghiệm SceneryStack.
  - *Acceptance Criteria*: Linh kiện xuất hiện tức thì tại tọa độ nhả chuột, di chuyển mượt 60 FPS không bị giật lag.

- **[P1-US2] Kết nối vật lý từ tính (Magnetic Snap-Port)**:
  - tư cách là học sinh, tôi muốn kéo 2 đầu linh kiện lại gần nhau (ví dụ: Móc quả nặng đến gần đầu lò xo, hoặc đầu dây điện đến cực Pin) để chúng tự động hút dính và nối liền.
  - *Acceptance Criteria*: Khi khoảng cách $<15\text{px}$, hiển thị vòng sáng gợi ý bắt dính (Snap Highlight). Khi nhả chuột, liên kết vật lý/điện học được khởi tạo.

- **[P1-US3] Mô phỏng đa phân môn (Cơ + Điện + Quang)**:
  - *Cơ học*: Ghép nối tiếp/song song lò xo và móc quả nặng $m \Rightarrow$ Lò xo giãn đúng theo $\Delta L = \frac{mg}{k}$.
  - *Điện học*: Khép kín mạch Pin + Công tắc + Bóng đèn $\Rightarrow$ Bóng đèn sáng lên theo công suất $P = I^2 R$.
  - *Quang học*: Bật Đèn Laser chiếu qua Thấu kính hội tụ/phân kỳ $\Rightarrow$ Tia sáng khúc xạ đúng theo Định luật Snell ($n_1 \sin i = n_2 \sin r$).

### P2 — Trực Quan Hóa & Xuất File (Nice-to-Have)

- **[P2-US1] Đo đạc & Đồ thị thực nghiệm**:
  - Học sinh có thể kéo Thước đo $cm$, Thước đo góc 360°, Vôn kế, Ampe kế vào đo các chỉ số thực tế trên canvas.
  - Tích hợp panel đồ thị Chart.js quan sát biến thiên real-time.

- **[P2-US2] Lưu & Chia sẻ sơ đồ thí nghiệm (Lab Snapshot)**:
  - Nút **📸 Chụp Ảnh & Lưu Kho** xuất cấu trúc JSON + Ảnh chụp Cloudinary lưu vào kho cá nhân.

---

## 📐 Measurable Success Criteria

1. **Performance**: Render pass SceneryStack duy trì $\ge 55$ FPS khi có đồng thời 25+ linh kiện trên Canvas.
2. **Precision**:
   - Sai số cơ học $\Delta L$ so với công thức lý thuyết $< 1\%$.
   - Sai số dòng điện $I$ mạch DC theo Định luật Ohm $< 0.5\%$.
   - Sai số góc khúc xạ tia sáng $< 0.1^\circ$.
3. **UX Accuracy**: Tỷ lệ nhận diện Snap-Port thành công khi kéo thả đạt $100\%$ trong phạm vi $15\text{px}$.

---

## 🛠️ Technical Architecture

### Component Hierarchy
```text
frontend/src/
├── pages/
│   └── UniversalWorkbenchPage.tsx          # Wrapper layout + Navigation header
├── components/workbench/
│   ├── SceneryUniversalWorkbench.tsx       # Main SceneryStack Canvas & Render Loop
│   ├── WorkbenchPalette.tsx                # Left Drawer Toolbox (Mechanics/Circuits/Optics)
│   ├── PhysicsSolverManager.ts             # Hybrid Solver (SpringChain + Kirchhoff + RayTracer)
│   └── SnapPortManager.ts                  # Magnetic Snap & Joint Connection Graph
```

---

## 📋 Definition of Done (DoD)

- [ ] `SceneryUniversalWorkbench.tsx` biên dịch `npx tsc --noEmit` 0 lỗi.
- [ ] Kéo thả mượt 3 nhóm linh kiện Cơ (Lò xo/Quả nặng), Điện (Pin/Bóng đèn/Dây), Quang (Laser/Thấu kính).
- [ ] Snap-Port từ tính hút dính chính xác khi khoảng cách $<15\text{px}$.
- [ ] Tích hợp nút Chụp ảnh & Lưu kho snapshot.
