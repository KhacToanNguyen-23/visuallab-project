# Brainstorm Report: Realistic Engineering Lab Equipment UI (Giảm Hoạt Hình - Tăng Chân Thực)

**Date:** 2026-09-12
**Focus:** Nâng cấp tạo hình dụng cụ phòng lab từ phong cách "Hoạt hình/Cartoon" sang "Thiết bị Kỹ thuật Chân thực (Realistic Photorealistic Lab Equipment)".

---

## 🎨 Phân Tích & Giải Pháp Đổi Mới Phong Cách UI Dụng Cụ

### ❌ Phong cách Hoạt hình (Cần loại bỏ)
- Màu sắc vector phẳng rực rỡ, đường viền đen dày kiểu hoạt hình thiếu chiều sâu.
- Các linh kiện Pin, Ampe kế, Công tắc trông giống "đồ chơi mầm non".
- Thiếu hiệu ứng chất liệu (mặt kính, ánh kim loại, độ trong suốt của thủy tinh).

---

### ✔️ Phong cách Kỹ Thuật Chân Thực (Realistic Lab Equipment - Áp dụng mới)

#### 1. 🔬 Chất Liệu & Bề Mặt Kỹ Thuật (Metallic & Glass Textures)
- **Kim loại (Metal & Brass)**: Thêm hiệu ứng Metallic Gradient (ánh kim loại bóng cho chấu cắm, cuộn dây đồng, công tắc dao ngắt điện).
- **Mặt Kính & Thủy Tinh (Glass Sheen & Reflection)**: Mặt đồng hồ Vôn kế/Ampe kế và Ống nghiệm có lớp bóng phản quang kính (Specular Highlight & Glass Sheen).
- **Nhựa Kỹ Thuật (Industrial ABS Plastic)**: Thân thiết bị mang sắc màu nhựa kỹ thuật trầm tĩnh (Slate-800, Charcoal, Brushed Steel).

#### 2. 📏 Vạch Chia & Chi Tiết Độ Chia Chuẩn Xác (Precision Markings)
- Vạch chia thước milimét và mặt đồng hồ được khắc mỏng nét ($0.01\text{mm}$ precision stroke), chữ số kỹ thuật sắc nét chuẩn phông sans.
- Kim chỉ thị kim loại thanh mảnh có độ nảy kim nhẹ khi đóng mạch điện.
- Tem thông số kỹ thuật (Spec Labelplate) ngả vàng nhạt dán trên thiết bị ghi rõ $E = 9\text{V}$, $R_{\max} = 100\Omega$.

#### 3. 💡 Hiệu Ứng Ánh Sáng & Chiều Sâu (Soft Lighting & PBR)
- **Canvas 2D**: Dùng Radial/Linear Gradients cho khối hình trụ bi thép, cuộn dây, bóng đèn filament phát sáng sợi đốt vàng cam khi có dòng điện.
- **Three.js 3D**: Sử dụng `MeshPhysicalMaterial` với `metalness: 0.85`, `roughness: 0.2`, `transmission: 0.9` (cho thủy tinh) và Environment Map tạo độ phản chiếu môi trường.

---

## 🚀 Các Phương Án Triển Khai (Implementation Options)

### Option A: Nâng cấp Canvas Renderer 2D (Tạo hình Kim loại & Kính cho Mạch DC / Rơi tự do)
- Viết lại hàm vẽ `CanvasRenderer.ts` với Radial Gradients ánh kim, bóng đổ kim quay Vôn kế và quầng sáng sợi đốt bóng đèn.

### Option B: Nâng cấp Vật liệu 3D PBR (Three.js Realistic Shading)
- Áp dụng PBR Materials cho `SoundResonanceLab.tsx` và `PhetPendulumLab.tsx` với ánh sáng kim loại và kính thủy tinh chân thực.

---

## Open Questions & Handoff
- Bạn muốn nâng cấp hiệu ứng chân thực cho **Bộ mô phỏng Mạch điện 2D Canvas** trước hay **Các bài lab 3D Three.js** trước?
