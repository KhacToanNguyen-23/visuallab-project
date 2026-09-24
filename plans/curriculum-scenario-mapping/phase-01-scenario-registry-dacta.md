# Phase 1: Scenario Registry & Tool IDs Standardization

**File:** `plans/curriculum-scenario-mapping/phase-01-scenario-registry-dacta.md`  
**Story Mapping:** `curriculum-scenario-registry-dacta` [P1]  

---

## 1. Objective
Xây dựng `frontend/src/engine/workbench/scenarios/scenarioRegistry.ts` chuẩn hóa 14 bài thực hành SGK GDPT 2018 theo bảng phân loại trong `DacTa.md`, nạp đúng 100% danh mục `Tool IDs` cho từng bài.

---

## 2. Proposed Changes

### `frontend/src/engine/workbench/scenarios/scenarioRegistry.ts` [NEW]
- Khai báo danh mục Scenario cho 14 bài:
  - Lớp 10: `sim-speed-measurement` (Bài 6), `sim-free-fall` (Bài 14), `sim-friction-coefficient` (Bài 21), `sim-momentum-collision` (Bài 30), `sim-spring-mass` (Bài 38).
  - Lớp 11: `sim-simple-pendulum` (Bài 7), `sim-sound-resonance` (Bài 5), `sim-emf-internal-r` (Bài 19), `sim-refraction` (Bài 21), `sim-wave-interference` (Bài 12).
  - Lớp 12: `sim-specific-heat` (Bài 3), `sim-latent-heat` (Bài 4), `sim-boyle-mariotte` (Bài 7), `sim-induction` (Bài 12).
- Cung cấp hàm `getCurriculumScenario(labId: string): CurriculumScenario | null`.

---

## 3. Verification Criteria
- Unit test kiểm tra `getCurriculumScenario` với mỗi `labId` đều trả về đúng thông tin SGK, số trang, và danh mục `initialApparatus` chứa đúng các Tool IDs từ `DacTa.md`.
