# Phase 1: Optics Physics Engine & GDPT 2018 Missions

## Scope
1. Create `frontend/src/components/simulations/refraction/refractionEngine.ts`:
   - Medium Presets: Air ($n=1.000$), Water ($n=1.333$), Crown Glass ($n=1.520$), Flint Glass ($n=1.660$), Diamond ($n=2.417$), Mystery Medium $X$ ($n_x \in [1.40, 1.80]$).
   - Ray optics solver:
     - $n_1 \sin i = n_2 \sin r \implies r = \arcsin\left(\frac{n_1 \sin i}{n_2}\right)$.
     - Critical angle $i_{\text{gh}} = \arcsin(n_2/n_1)$ when $n_1 > n_2$.
     - Total Internal Reflection (TIR) when $n_1 > n_2$ and $i \ge i_{\text{gh}}$.
     - Fresnel reflection & transmission intensity calculation:
       $$R = \frac{1}{2}\left[\left(\frac{n_1 \cos i - n_2 \cos r}{n_1 \cos i + n_2 \cos r}\right)^2 + \left(\frac{n_1 \cos r - n_2 \cos i}{n_1 \cos r + n_2 \cos i}\right)^2\right], \quad T = 1 - R$$
   - 3 GDPT 2018 Missions:
     - Mission 1: Refraction (Air $\to$ Crown Glass, 5 trials).
     - Mission 2: Total Internal Reflection (Crown Glass $\to$ Air, identify $i_{\text{gh}} \approx 41.1^\circ$).
     - Mission 3: Mystery Medium $X$ (measure $\sin i / \sin r \to$ determine $n_x$).
   - Linear Regression Solver: computes slope $m = n_{21}$ and $R^2$ correlation.
   - 3-Tier Auto-Grading (3.0 Operation, 4.0 Accuracy $\delta n \le 3\%$, 3.0 Quiz).
   - SGK GDPT 2018 Multiple Choice Question Bank (3 questions).
