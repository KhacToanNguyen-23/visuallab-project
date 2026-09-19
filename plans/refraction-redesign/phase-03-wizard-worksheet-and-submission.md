# Phase 3: Wizard Worksheet, Linear Scatter Plot & Submission Integration

## Scope
1. Create `frontend/src/components/simulations/refraction/RefractionLabWizardWorksheet.tsx`:
   - Tab 1 (Nhiệm Vụ): 3 GDPT 2018 mission cards with live progress badges and direct recording actions.
   - Tab 2 (Số Liệu & Đồ Thị):
     - Data table recording ($i^\circ, r^\circ, \sin i, \sin r, \frac{\sin i}{\sin r}$).
     - Dynamic SVG scatter plot for $\sin i$ vs $\sin r$ with linear regression fit line, estimated refractive index $n_{21}$, and correlation coefficient $R^2$.
   - Tab 3 (Nộp Bài): 3-question GDPT 2018 quiz bank, observations, score breakdown (Operation 3.0, Accuracy 4.0, Quiz 3.0), and EduLab storage sync.
2. Create `frontend/src/components/simulations/refraction/RefractionLab.tsx`:
   - Main container orchestrating 3D studio, HUD dock, and wizard worksheet.
3. Update `frontend/src/main.tsx`:
   - Route `/lab/refraction` to lazy-loaded `RefractionLab`.
4. Update `frontend/src/pages/student/StudentLabAssignmentWorkbenchPage.tsx` and `StudentLabAssignmentView.tsx`.
