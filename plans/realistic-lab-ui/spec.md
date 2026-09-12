# Feature Spec: Photorealistic Engineering Lab Equipment UI

**Status:** Draft / Brainstormed & Planned
**Date:** 2026-09-12
**Target Area:** `frontend/src/engine/canvas/CanvasRenderer.ts`, `frontend/src/components/simulations/`

## 1. Context & Purpose
Chuyển đổi phong cách tạo hình dụng cụ thí nghiệm từ dạng "Hoạt hình vector phẳng" sang "Thiết bị Kỹ thuật Chân thực (Realistic Photorealistic Lab Equipment)". Áp dụng chất liệu kim loại (Metallic gradients), mặt kính phản quang (Glass sheen), vạch chia mỏng nét kỹ thuật và bóng đổ PBR.

## 2. Requirements & Scope

### P1 — Essential Realistic UI Upgrades (Phải làm ngay)
- [ ] **Canvas 2D Metallic & Filament Shading (`CanvasRenderer.ts`)**:
  - Pin nguồn: Bề mặt kim loại có ánh kim Metallic Gradient, chấu âm/dương bằng đồng thau.
  - Bóng đèn: Khung thủy tinh có bóng phản quang kính, sợi đốt W (Filament) phát sáng vàng cam rực rỡ khi đóng mạch ($P > 0$).
  - Vôn kế / Ampe kế: Mặt đồng hồ hình tròn nắp kính, kim chỉ thị kim loại thanh mảnh có vạch chia đen $0.01\text{mm}$.
  - Công tắc K: Cần gạt kim loại ánh vàng đồng có hiệu ứng nổi 3D.
- [ ] **Vạch Chia & Tem Nhãn Kỹ Thuật (Labelplate & Scale)**:
  - Thêm nhãn tem bạc/vàng kim dán trên thiết bị ghi thông số ($E=9\text{V}, R=10\Omega$).

### P2 — 3D PBR Materials (Nâng cấp Three.js)
- [ ] **Chất liệu 3D Chân thực (`SoundResonanceLab.tsx`)**:
  - Áp dụng `MeshPhysicalMaterial` với độ bóng kính `transmission: 0.9` và ánh kim `metalness: 0.85`.

## 3. Success Criteria
- [ ] Dụng cụ trên Canvas 2D không còn cảm giác vẽ phẳng hoạt hình mà có hiệu ứng ánh kim loại và bóng kính 3D mượt mà.
- [ ] Sợi đốt bóng đèn phát sáng sống động khi dòng điện chạy qua.
