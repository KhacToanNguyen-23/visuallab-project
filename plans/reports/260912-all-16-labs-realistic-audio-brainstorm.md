# Brainstorm: Realistic Physics Sound Engine for 16 SGK GDPT 2018 Labs

**Date:** 2026-09-12
**Slug:** all-16-labs-realistic-audio

## Ideas Explored
1. **Event-Only Sound System (Basic)**: Only play sharp sound effects on user interaction (clicks, drops, button beeps). Dismissed as too static and lacking realism.
2. **Domain-Specific Physics Audio Engine (Selected)**: Map realistic synthesized Web Audio API sounds for each of the 5 physics domains:
   - Mechanics: Steel ball click, rolling track friction, spring oscillation tone.
   - Thermodynamics: Water boiling hiss, ice melting splash/drop, piston gas compression hiss.
   - Electromagnetism: Relay switch click, banana wire plug sound, magnetic induction hum.
   - Waves & Optics: Tone generator resonance, optical sensor laser beep.
   - Sandbox/General: Dial knob clicks, caliper slider clicks.
3. **Hybrid Event + Dynamic Continuous Audio Loop (Selected)**: Combine instant discrete event sound effects (unlatch, impact, beam break) with real-time continuous dynamic audio feedback (pitch/volume changes with speed, pressure, temperature, or frequency).

## User's Direction
The user confirmed both requirements:
1. **Domain-Specific Realism**: Each of the 16 labs must have authentic physical audio tailored to its real-world lab equipment.
2. **Hybrid Feedback**: Combine interactive event triggers and dynamic continuous audio loops (e.g., continuous magnetic hum varying with magnet velocity, boiling water hiss varying with temperature).

## Open Questions
1. How to manage Web Audio API AudioContext state across React route transitions so continuous loops clean up on unmount.
2. Ensure master Mute toggle on Header overrides all active continuous Web Audio nodes instantly.

## Risks
1. **Autoplay Policy**: Web Audio API requires a user gesture before playing sound on browser start. Must resume `AudioContext` on first click.
2. **Audio Overlap**: Multiple overlapping Web Audio nodes could saturate the audio destination if not capped or cleaned up properly.
