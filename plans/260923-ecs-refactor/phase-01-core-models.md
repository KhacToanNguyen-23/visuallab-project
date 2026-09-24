# Phase 1: Core Models & Components

## Objective
Establish the ECS foundation by defining `LabDeviceModel` and individual `IPhysicsComponent`s.

## Tasks
1. Create `core/models/IPhysicsComponent.ts` defining the base interface.
2. Create `core/models/LabDeviceModel.ts` to hold a Map of components.
3. Create `core/models/components/KinematicComponent.ts` (mass, position, velocity).
4. Create `core/models/components/SensorComponent.ts` (isTriggeredProperty, checkTrigger).
