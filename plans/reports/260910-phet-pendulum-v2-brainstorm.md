# Brainstorm: Phet Pendulum Lab V2 with SceneryStack

**Date:** 2026-09-10

## Ideas Explored
1. **Option A: Pure React HTML5 Canvas Upgrade**: Keep existing custom Canvas engine and rewrite vector overlays. Fast to build, but lacks PhET's exact DOM/SVG hybrid tree and native Accessibility support.
2. **Option B: PhET SceneryStack Integration (Selected)**: Install official `scenerystack` npm package, leverage `Scenery` SceneGraph, `Axon` observable properties, and `Sun` components inside a React `useRef` container to deliver a true PhET-architected lab experience v2.

## User's Direction
The user selected Option B to test and evaluate how PhET's core libraries (`SceneryStack`) render interactive physics scenes, bobs, vectors, and UI components directly inside the EduLab React frontend.

## Open Questions
- Compatibility of `scenerystack` bundler setup with Vite in React TSX environment (handled via dynamic container attachment in `useEffect`).

## Risks
- Bundle size overhead from `scenerystack`.
- Canvas/SVG DOM lifecycle sync in React strict mode.
