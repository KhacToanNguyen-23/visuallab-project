# Phase 2: Views (Apparatus)

## Objective
Migrate legacy monolithic classes into pure `Scenery` Views that observe `LabDeviceModel`.

## Tasks
1. Create `apparatus/mechanics/MassObjectView.ts` inheriting from `Node`, observing `KinematicComponent`.
2. Create `apparatus/sensors/PhotogateView.ts` inheriting from `Node`, observing `KinematicComponent` (for Y placement).
