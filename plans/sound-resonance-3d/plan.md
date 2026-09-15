# Implementation Plan: Bài 5 - Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng 3D WebGL)

**Spec Reference:** `plans/sound-resonance-3d/spec.md`  
**Mode:** Fast  
**Risk:** normal — Component upgrade within `SoundResonanceLab.tsx`, no backend schema changes.

---

## Proposed Changes

### Component: `SoundResonanceLab.tsx`

#### [MODIFY] [SoundResonanceLab.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/simulations/SoundResonanceLab.tsx)
1. **3D Acoustics Studio & Three.js Environment**:
   - WebGLRenderer with OrbitControls ($360^\circ$ inspection), Studio PBR Lighting.
   - 3D Laboratory Stand with precision graduated glass resonance tube ($0 \to 100\text{cm}$).
   - Movable water reservoir beaker (bình dâng nước thông nhau) with smooth vertical drag/slider.
   - Digital Audio Frequency Generator (`AUDIO_GENERATOR`) with LCD readout and interactive knob.
   - Acoustic mini speaker at tube top and decibel microphone sensor.
2. **Standing Wave Visualizer & Real-Time Air Particle Density**:
   - 3D Particle system simulating longitudinal air molecule displacement (compression/rarefaction).
   - Envelope mode toggle displaying standing wave amplitude envelope (displacement antinode at open top, displacement node at water surface).
   - Dynamic resonance markers indicating theoretical $L_1 = \lambda/4, L_2 = 3\lambda/4, L_3 = 5\lambda/4$.
3. **Web Audio API & Sound Level Meter**:
   - Synthesizer generating clean sine wave $f \in [100, 2000]\text{Hz}$.
   - Realistic volume amplification and live needle/digital dB meter when water level hits resonance peaks.
4. **Data Acquisition, Physics Calculations & Error Analysis**:
   - One-click record buttons for $L_1$ and $L_2$.
   - Live calculation: $\lambda = 2(L_2 - L_1)$, $v_{\text{thực nghiệm}} = \lambda \cdot f$.
   - Temperature comparison: $v_{\text{lý thuyết}} = 331.3 \sqrt{1 + \frac{t^\circ\text{C}}{273}}\text{ m/s}$ ($346.3\text{ m/s}$ at $25^\circ\text{C}$).
   - Auto error percentage calculation and data table recording multiple frequency trials.
   - Screenshot export via `ScreenshotCaptureModal`.

---

## Verification Plan
1. **Automated Build**: Run `npm run build` in `frontend/` to ensure zero compilation or type errors.
2. **Interactive Testing**: Navigate to `/lab/sound-resonance` on `http://localhost:5173/lab/sound-resonance`:
   - Verify 3D tube, stand, water column, speaker, and generator render cleanly.
   - Adjust frequency ($400\text{Hz}, 500\text{Hz}, 800\text{Hz}$) and drag water level to detect resonance peak.
   - Verify Web Audio sound amplifies at $L_1$ and $L_2$, and dB meter peaks.
   - Record $L_1, L_2$ and verify calculated speed of sound $v \approx 346\text{ m/s}$ ($\pm 2\%$).
