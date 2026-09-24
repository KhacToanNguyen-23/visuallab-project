# Brainstorm: Interaction Engine & Physics State Management

**Date:** 2026-09-22

## Ideas Explored
- **Global Play/Pause (Simulator approach):** A single button controls all physics. Simple to build, but doesn't feel like a real lab table where some objects are always stable.
- **Object-Specific Physics (Real-life approach):** Objects spawn as Kinematic (fixed/frozen). Only specific objects (like the steel ball) can be "released" by the user to become Dynamic.
- **Static Board with Animation:** No real-time physics, just pre-baked animations. Dismissed because Rapier physics is already integrated and allows for dynamic collision.

## User's Direction
The user chose **Object-Specific Physics (Real-life approach)**. 
- The user explicitly wants objects to stay where they are dropped ("kéo ở đâu thì nó nằm ở đó").
- Only the experimental objects (e.g., steel ball) will move, and they will only move when explicitly commanded (e.g., clicking "Thả bi").

## Open Questions
All questions resolved during Clarification Gate:
- How to reset? -> A global "Làm lại" (Reset) button will be used.
- Can objects be moved during run? -> Yes, the user explicitly allowed moving equipment (like sensors/tracks) while the ball is rolling.

## Risks
1. **Zustand vs Rapier Sync:** Manually flipping a Rapier RigidBody from `KinematicPositionBased` to `Dynamic` requires accessing the imperative `RapierRigidBody` ref inside the component, which means Zustand state must trigger a ref update.
2. **Dragging while Dynamic:** If the user drags a moving object, we must temporarily set it back to Kinematic, then restore its velocity or reset it when dropped.
