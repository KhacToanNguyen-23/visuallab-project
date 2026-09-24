# Brainstorm: VisualLab 2.0 Architectural Overhaul (Nobook Clone)

**Date:** 2026-09-22

## Problem Addressed
The MVP architecture was highly coupled, hardcoded, and lacked consistent physical properties and UI. The user requested a scalable platform architecture identical to "Nobook Physics", which features a 2.5D orthographic workspace, dynamic properties panels, magnetic snapping, and a visual node-based wiring system.

## Strategy Chosen
We will adopt a **2.5D Orthographic + ECS Architecture**:
- **Rendering:** React Three Fiber using `OrthographicCamera` to provide a 2.5D flat look while retaining 3D lighting/shadows.
- **Physics:** Rapier3D with the Z-axis locked for 2D deterministic physics.
- **State:** Zustand acting as an Entity-Component-System (ECS) where every tool has standard configurable properties (Mass, Friction, Restitution).

## Implementation Roadmap
1. **Phase 1: ECS Core & Properties Panel** - Rebuild object selection. Add a right-side UI panel to edit physical properties in real-time.
2. **Phase 2: Magnetic Snapping** - Add anchor points to objects so they snap together logically (e.g. tracks snapping to stands).
3. **Phase 3: Visual Wiring** - Build a visual node graph to connect sensors (Out) to displays (In).
4. **Phase 4: Save/Load System** - Serialize the entire ECS state to JSON.
