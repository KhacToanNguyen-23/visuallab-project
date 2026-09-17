# Phase 3: 3-Step Wizard Worksheet & SGK Quiz

## Objectives
- Tạo `frontend/src/components/simulations/induction/InductionLabWizardWorksheet.tsx`:
  - **Bước 1: Thực Hiện 3 Nhiệm Vụ Đề Bài**:
    - Nhiệm vụ 1: Cực N đưa vào chậm $\to$ ghi lại $e_{c1}$.
    - Nhiệm vụ 2: Cực N đưa vào nhanh $\to$ ghi lại $e_{c2}$ ($e_{c2} > e_{c1}$).
    - Nhiệm vụ 3: Cực S đưa vào hoặc cực N rút ra $\to$ ghi lại chiều đảo ngược ($e_{c3} < 0$).
  - **Bước 2: Bảng Số Liệu & Nhận Xét Thực Nghiệm**:
    - Bảng số liệu: Lần đo, Đầu cực, Chiều dịch chuyển, Vận tốc $v$, Số vòng $N$, $e_{c,\max}$ (mV), Chiều dòng điện.
    - Đồ thị hoặc biểu đồ so sánh suất điện động cảm ứng theo vận tốc $e_c(v)$.
    - Ô nhận xét thực nghiệm với các gợi ý nhanh (chips).
  - **Bước 3: Trắc Nghiệm Củng Cố & Nộp Bài**:
    - 3 câu hỏi trắc nghiệm SGK Vật lý GDPT 2018 về Định luật Faraday, Định luật Lenz và ứng dụng.
    - Nút "📝 Nộp Bài & Tính Điểm Thí Nghiệm".
    - Hiển thị bảng điểm tổng kết (Thao tác 30% + Độ chính xác 40% + Trắc nghiệm 30% $\to 10.0$).
    - Nút "🚀 Nộp Bài Vào Bài Tập Được Giao" khi mở trong bài tập.
