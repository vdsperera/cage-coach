# Product Brief — Cagecraft 3D (Cage Coach)

## Problem
Combat sports practitioners (MMA, Muay Thai, Boxing, BJJ, Wrestling) and coaches struggle to master and teach subtle biomechanical details—such as foot pivot angles, hip rotation torque, weight transfer, and strike trajectory lines—using traditional 2D video. YouTube instructional videos suffer from occluded camera angles, inconsistent pacing, and lack of spatial reference. Existing 3D motion analysis tools are bloated, expensive, and require dedicated high-performance hardware, making them impractical for quick reference on the mat or at home.

## Target Users
- **Primary:** Martial arts athletes and students seeking an interactive, spatial 3D study tool to inspect technique milestones, compare Orthodox vs. Southpaw stances, and practice combination timing outside of class.
- **Secondary:** Combat sports instructors and coaches who need a visual demonstration tool to explain joint angles, defensive slips, and takedown penetration steps during coaching sessions.
- **Not for:** Gamers looking for an arcade combat simulation or fighters seeking medical-grade orthopedic rehabilitation telemetry.

## Value Proposition
For combat sports practitioners who need clear, spatial biomechanical reference and rhythm training, **Cagecraft 3D** is a lightweight, zero-install web visualizer that delivers instant 3D technique playback, multi-angle quad viewports, real-time joint angle telemetry, and interactive audio-visual drill coaching. Unlike 2D video instructionals, it allows users to orbit any angle, step through critical phases, mirror stances dynamically, and practice combinations with zero load time.

## Business Model
- **Core Tier (Free / Open Reference):** Standalone web viewer providing access to the standard 24 techniques, procedural clay visualization, telemetry readouts, local notes, and basic drill coach.
- **Pro / Gym Tier (Future Consideration):** Dedicated coach portal with custom sequence/combination builder, team drill playlists, motion capture clip library ingestion, and printable technique cards.
- **Unit Economics:** Negligible hosting and compute costs due to client-side procedural geometry and local-first persistence; scalable distribution with zero recurring server infrastructure.

## MVP Scope

### Core Hypothesis
Martial arts practitioners will actively use an instant-loading, procedural 3D technique viewer with phase-stepping and audio-visual drill prompts to reinforce biomechanical technique memory and practice reaction timing.

### In MVP (Launch Capabilities)
1. **Curated 24-Technique Library:** 10 striking strikes & defenses, 8 grappling & submission maneuvers, and 6 core combinations.
2. **Deterministic Kinematics & Dual Stance:** Parametric keyframe interpolation with automatic Orthodox / Southpaw horizontal symmetry mirroring.
3. **Biomechanical Telemetry:** Live joint angle readouts (lead/rear knee flexion, elbow extension, hip rotation angle, torso lean).
4. **Multi-Camera & Quad-Split Viewports:** Free orbit, Front, Side, Above, Behind, Partner's Eyes POV, and simultaneous 4-way split screen.
5. **Interactive Audio-Visual Drill Trainer:** Configurable timer intervals (3s, 5s, 8s) with oscillator audio metronome ticks, synthesized speech callouts, and reference replay.
6. **Local-First Notes Persistence:** Autosaving user study cues with single-click JSON export.

### NOT in MVP (Deferred to Later Milestones)
1. **Interactive Custom Combination Builder UI:** Deferred to Milestone 4 (users currently execute curated combos Z, X, N, H, J, K).
2. **Camera-Based AI Pose Estimation (Video Analysis):** High computational complexity; deferred until core toolchain is modernized.
3. **Immersive WebXR / Headset Integration:** Deferred to Milestone 4.
4. **Cloud User Accounts & Social Sharing:** Unnecessary friction for the core learning loop.

### Success Metric
- **Retention & Engagement:** Weekly active practitioners engage with Drill Mode at least 3 sessions per week with an average session duration > 8 minutes.
- **Performance Standard:** Stable 60 fps rendering on desktop and modern mobile devices with 0 unhandled runtime exceptions.

## Risks & Assumptions

| # | Risk | Assumption | Impact if wrong | Validation Approach |
|---|------|------------|-----------------|---------------------|
| 1 | **Visual Fidelity Risk** | Practitioners will find stylized "clay" humanoids sufficient for technical study without photorealistic graphics. | Athletes reject the visual style and prefer 2D video. | User feedback testing comparing clay model clarity vs. video screenshots for joint angles. |
| 2 | **Gym Usability Risk** | Users will use the application on mobile phones and tablets during solo mat practice. | Keyboard-heavy hotkeys make mobile usage frustrating. | Test touch-friendly ergonomics and oversized touch buttons on phones. |
| 3 | **Kinematic Accuracy Risk** | Procedural keyframes accurately represent authentic fight mechanics without imparting bad habits. | Experienced coaches criticize technique biomechanics. | Review keyframe angles with certified martial arts black belts and professional striking coaches. |
| 4 | **Distribution Risk** | Standalone HTML distribution is convenient for offline study. | Lack of app store presence limits organic discovery. | Package as Progressive Web App (PWA) with offline service workers. |

## Recommendation
**Go** — The foundational 3D engine is operational, technical debt has been stabilized, the value proposition is uniquely differentiated from 2D instructional videos, and the MVP scope is clear and testable.

