# Functional Spec: Realistic Physics Audio Engine for 16 SGK GDPT 2018 Labs

**Status:** Draft
**Slug:** all-16-labs-realistic-audio

## User Stories & Scope

### P1: 100% 16-Lab Physics Audio Integration
- Every single one of the 16 labs must trigger authentic Web Audio API audio effects for all physical interactions.
- Mute toggle on Header must silence all active discrete and continuous sounds instantly across all 16 labs.

### P2: Discrete Event & Dynamic Continuous Audio Mapping
- **Mechanics (5 Labs)**:
  - `speed-measurement`: Metal latch release click, optical beam break beep, end bumper impact clack.
  - `free-fall`: Electromagnet release click, sensor impact clack.
  - `sliding-friction`: Surface friction slide sound scaling with velocity.
  - `momentum-collision`: Glider collision impact clack scaling with relative momentum.
  - `spring-mass`: Hooke's law spring stretch/twang tone.
- **Thermodynamics (3 Labs)**:
  - `specific-heat`: Heating element sizzle/hiss scaling with power P and temperature T.
  - `latent-heat`: Ice block splash/drop clack and melting sizzle.
  - `boyle-mariotte`: Piston gas compression hiss scaling with pressure P.
- **Electromagnetism (3 Labs)**:
  - `induction`: Induction hum pitch/volume scaling with magnet velocity.
  - `emf-internal-r`: Knife switch click, potentiometer dial tick.
  - `dc-circuit` / `ohm-vietnam`: Wire banana plug snap, circuit breaker click.
- **Waves & Optics (3 Labs)**:
  - `sound-resonance`: Tone generator resonance pitch matching SGK frequency.
  - `wave-interference`: Laser toggle click and fringe measurement tick.
  - `refraction`: Prism laser switch click and angle dial tick.
- **Sandbox & Pendulum (2 Labs)**:
  - `simple-pendulum`: Pendulum swing air swoop tone.
  - `universal-workbench`: Modular component snap click and wire connector snap.

## Success Criteria
- 100% (16/16) labs possess domain-specific Web Audio integration.
- Zero external NPM dependencies added (100% native Web Audio API).
- `npm run build` succeeds cleanly with 0 TypeScript/Vite compilation errors.
