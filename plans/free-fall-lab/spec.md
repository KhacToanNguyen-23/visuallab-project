# Feature Spec: Redesign Bài Thực Hành Đo Gia Tốc Rơi Tự Do (SGK Vật Lý 10 - Trang 57)

**Status:** Draft  
**Target Date:** 2026-09-11  

---

## Executive Summary
Thiết kế lại toàn bộ giao diện & lõi mô phỏng cho bài thực hành **Đo gia tốc rơi tự do** (`SRSWorkflowPage.tsx` / `/srs-lab`) theo đúng tài liệu đặc tả `DacTa.md` (Bài 14 - Trang 57 SGK Vật lý 10). Giao diện chuyển sang dạng **Phòng Lab 2D Tương Tác Học Thuật (PhET Style)** gần gũi, sạch sẽ, không có emoji trang trí, thao tác kéo thả chọn độ cao $h$ chính xác, tính toán công thức vật lý chuẩn $g = \frac{2h}{t^2} \approx 9.81\text{ m/s}^2$.

---

## User Stories

### P1: Accurate Physics & Standard Equipment
- **As a** student or teacher,
- **I want** the free-fall apparatus to use standard tools (`VERTICAL_STAND`, `ELECTROMAGNET`, `PHOTOGATE_SENSOR`, `DIGITAL_TIMER`, `STEEL_BALL`),
- **So that** calculated free fall acceleration $g$ yields real-world value $g = 9.807 \pm 0.15\text{ m/s}^2$ instead of non-physical numbers.

### P1: Clean & Friendly Academic UI (Zero Emojis)
- **As a** user,
- **I want** a clean, responsive lab workspace synchronized with VisualLab light/dark theme CSS variables,
- **So that** I can easily measure $h$, release the steel ball, read timer $t_A, t_B, \Delta t$, and fill in the experimental table.

### P2: Step-by-Step Pedagogy Workflow
- **As a** student,
- **I want** a 5-step guided process (1. Bố trí độ cao $h$ -> 2. Gắn bi thép -> 3. Thả rơi -> 4. Đọc đồng hồ -> 5. Báo cáo & Sai số),
- **So that** I learn the exact scientific method required by SGK GDPT 2018.

---

## Success Criteria

1. **Physics Accuracy**:
   - Time $t = \sqrt{\frac{2h}{g}}$ calculated accurately with $g \approx 9.807\text{ m/s}^2$.
   - $g_{\text{calculated}} = \frac{2h}{t^2}$ results in $9.81 \pm 0.2\text{ m/s}^2$.
2. **Clean Typography UI**:
   - Zero decorative emojis or sci-fi banners.
   - Synchronized with theme variables (`var(--bg-panel)`, `var(--bg-main)`, `var(--border-color)`).
3. **Interactive Controls**:
   - Drag/slider adjustment of photogate height $h$ ($0.2\text{m} \le h \le 0.8\text{m}$).
   - Release button to drop ball, triggering 60 FPS animation.
   - Automatic record to data table ($N = 1..5$ measurements).
