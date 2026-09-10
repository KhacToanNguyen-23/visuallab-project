# Plan: Bộ Bài Thí Nghiệm Mô Phỏng Vật Lý (Spring Lab & EMF Lab)

**Slug:** `lab-suite`  
**Spec:** `plans/lab-suite/spec.md`  
**Mode:** `--fast`  
**Risk:** normal — Thêm 2 component mô phỏng mới và tích hợp routing/auto-grading hiện có.

---

## 🎯 Tổng Quan Kiến Trúc & Các Pha Triển Khai

Kế thừa kiến trúc chuẩn PhET của `PhetPendulumLab.tsx`, dự án sẽ triển khai 2 bộ thí nghiệm tiếp theo:

### Phase 1: Thí Nghiệm Con Lắc Lò Xo & Định Luật Hooke (`phase-01-spring-lab.md`)
- **Physics Engine:** Tạo `frontend/src/engine/physics/spring-engine.ts` (mô phỏng $m\ddot{x} + c\dot{x} + kx = mg$).
- **UI Component:** Tạo `frontend/src/components/simulation/PhetSpringLab.tsx` (vẽ lò xo zíc-zắc 2D, quả cân $m$, thước đo $\Delta l$, 6 Tab sư phạm).

### Phase 2: Thí Nghiệm Đo Suất Điện Động $E$ & Điện Trở Trong $r$ (`phase-02-emf-lab.md`)
- **Physics Engine:** Tạo `frontend/src/engine/physics/emf-engine.ts` (mô phỏng mạch điện DC $U = E - I \cdot r$).
- **UI Component:** Tạo `frontend/src/components/simulation/PhetEmfLab.tsx` (Vôn kế/Ampe kế kim quay, biến trở con chạy gạt $R$, công tắc $K$, 6 Tab sư phạm).

### Phase 3: Tích Hợp Routing & Tự Động Chấm Điểm Auto-Grading (`phase-03-routing-and-grading.md`)
- Update `StudentLabAssignmentView.tsx` & `TeacherAssignPage.tsx` để hỗ trợ chọn và khởi chạy `PENDULUM`, `SPRING`, `EMF`, `REFRACTION` chuẩn xác.
- Tích hợp công thức Auto-Grading & Groq AI verification.

---

## 📅 Kế Hoạch Các Pha (Phase Breakdown)
1. `plans/lab-suite/phase-01-spring-lab.md`
2. `plans/lab-suite/phase-02-emf-lab.md`
3. `plans/lab-suite/phase-03-routing-and-grading.md`
