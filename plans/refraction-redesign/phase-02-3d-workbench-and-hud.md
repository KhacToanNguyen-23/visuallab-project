# Phase 2: 3D Three.js Semi-Cylinder Optics Studio & HUD Dock

## Scope
1. Create `frontend/src/components/simulations/refraction/RefractionWorkbench3D.tsx`:
   - High-fidelity Three.js scene with PBR materials.
   - Circular Optics Protractor Disc ($0 - 360^\circ$ scale with $1^\circ$ precision ticks).
   - Semi-Cylindrical Glass Lens (Khối Bán Nguyệt Trụ Thủy Tinh Quang Học) centered at disc origin with transmission/refraction shaders.
   - Rotatable Laser Pointer Emitter on circular guide rail ($0^\circ \to 90^\circ$).
   - Glowing Incident Ray, Reflected Ray, and Refracted Ray with dynamic Fresnel opacity and pulse.
   - Normal line (Pháp tuyến $N-N'$) and Angle arc visualizers for $i$ and $r$.
2. Create `frontend/src/components/simulations/refraction/RefractionWorkbenchHudDock.tsx`:
   - Medium selector ($n_1$ and $n_2$), Direction toggle (Air $\to$ Medium vs Medium $\to$ Air).
   - Laser angle slider ($0^\circ \to 85^\circ$, step $0.5^\circ$) + direct angle stepper buttons.
   - Laser beam color picker (Red 650nm, Green 532nm, Blue 405nm).
   - Reset, Camera views (3D, Top-Down $2D$, Front), and "+ Ghi Số Liệu" button.
