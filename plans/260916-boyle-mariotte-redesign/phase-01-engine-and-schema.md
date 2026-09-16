# Phase 1: Physics Engine & Worksheet Schema Registration

## Mục Tiêu
1. Xây dựng module `boyleLabEngine.ts` mô phỏng vật lý quá trình đẳng nhiệt và tính toán sai số.
2. Đăng ký schema `sim-boyle-mariotte` (`LAB_BOYLE_MARIOTTE`) trong `frontend/src/utils/worksheetSchemas.ts`.

## Chi Tiết Kỹ Thuật
- `boyleLabEngine.ts`:
  - `computePressure(volume: number, baseV0 = 40, baseP0 = 1.0, withNoise = true): number`
  - `calculateBoyleStats(trials: { volume: number; pressure: number }[])`: Tính $\overline{pV}$, $\Delta(pV)$, $\delta(pV)\%$, điểm thao tác, điểm sai số.
  - `generateGasParticles(count: number, cylinderBounds: { minX: number; maxX: number; radius: number })`: Khởi tạo và cập nhật vị trí hạt phân tử khí lý tưởng.
- `worksheetSchemas.ts`:
  - Thêm entry `sim-boyle-mariotte` với các cột: `trial`, `volume` ($V\text{ cm}^3$), `pressure` ($p\text{ bar}$), `pV` ($p \cdot V\text{ bar}\cdot\text{cm}^3$), `invV` ($1/V\text{ cm}^{-3}$).
  - Cập nhật hàm `getWorksheetSchema` nhận diện từ khóa `BOYLE`, `MARIOTTE`, `KHÍ LÝ TƯỞNG`, `ĐẲNG NHIỆT`.

## Nghiệm Thu
- Hàm tính toán trả về kết quả số học chính xác, biên độ sai số được kiểm soát chặt chẽ.
