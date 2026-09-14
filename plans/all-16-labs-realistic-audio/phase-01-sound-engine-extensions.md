# Phase 1: SoundEngine Core Extensions

## Goal
Extend `soundEngine.ts` with dedicated physical Web Audio API synthesis methods for all 5 domains:
- Spring twang tone (`playSpringTwang`)
- Water boiling / heating sizzle (`playBoilingSizzle`)
- Banana plug snap & switch click (`playBananaPlugSnap`, `playSwitchClick`)
- Continuous tone generator (`startToneGenerator`, `stopToneGenerator`)
- Air swoop tone for pendulum (`playAirSwoop`)

## Verification
- Run `npm run build` in `frontend/` to confirm 0 compilation errors.
