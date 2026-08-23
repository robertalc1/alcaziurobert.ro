# DESIGN.md

## System (light-only since 2026-07-03)

100% light editorial site. NO dark sections — Robert explicitly rejected all dark UI (hero included) on 2026-07-03. The wow moments are the orange accents, the giant type, and the single orange mesh footer card floating on warm white.

## Color

- Surfaces: white `#ffffff` → warm white `#FAF8F6` gradients (hero, #contact); body white; footer section `#FAF8F6`; html canvas `#FCFBF9` (iOS overscroll).
- Brand orange `#ED5C1B` (hover `#C44E17`), used surgically: ONE accent word per headline (italic), CTAs, metric small-caps labels, process numbers, highlight pills, whisper glows (`rgba(237,92,27,0.04–0.10)` radials).
- Text: `#121212` display / `#141414`–`#262626` body, secondary `rgba(38,38,38,0.72)`, tertiary `0.55`. White text ONLY on orange surfaces (CTA, footer mesh card).
- Hairlines: `rgba(38,38,38,0.10–0.12)`; card hairline `rgba(38,38,38,0.06)`.
- Warm tray neutral for double-bezel frames: `#F4F2EE`; form shells `rgba(38,38,38,0.035)` + border `0.10` + shadow `0 40px 90px -48px rgba(38,38,38,0.28)`.

## Typography

Single family: General Sans (Fontshare), loaded in index.html. Weights 400/500/600/700.
- Hero display: `clamp(2.55rem, 6.2vw, 4.9rem)`, weight 500, tracking -0.04em, line-height 1.03.
- Stats display: `clamp(2.9rem, 6.6vw, 5.6rem)`, tabular-nums.
- Section H2: `clamp(1.8rem, 4.6vw, 3rem)`, tracking -0.028em.
- Statement: `clamp(1.5rem, 3.1vw, 2.4rem)`.
- Body-lg: `clamp(1.05rem, 1.5vw, 1.3rem)`; UI meta 13–15px.
- Kickers/eyebrows: 10.5px, 600, uppercase, tracking 0.18em, orange, pill with `rgba(237,92,27,0.24)` border.

## Components

- Double-bezel frames: outer tray (`#F4F2EE`, radius 18, padding 7) + inner core (white, radius 11, hairline). Form shells (hero + #contact): `rgba(38,38,38,0.035)` tray + radius 27/20, white core with `rgba(38,38,38,0.06)` hairline, header inside card (title 1.15rem/600 + 12.5px muted note).
- Button-in-button CTA: orange pill with trailing arrow inside its own circle (`rgba(255,255,255,0.16)`); hover darkens pill, arrow translates (2px, -2px); active scale 0.98.
- Browser chrome for screenshots: 3 dots + domain, never raw images.
- Section padding: `clamp(56–64px, 8–9vh, 104–112px)`. Inner max-width 1180–1240px.

## Motion

- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` (quart) or `cubic-bezier(0.32, 0.72, 0, 1)`; 260–700ms. No linear, no ease-in-out, no bounce.
- Entrances: `<Reveal>` (per-instance IntersectionObserver, opacity + translateY(16px) → none, staggered delays 70–90ms). Hero uses keyframe stagger (pill → title → sub → card).
- `motion/react` available (used by ContactForm stage reveals, testimonials marquee). Animate only transform/opacity. `prefers-reduced-motion` respected everywhere.

## Breakpoints

640 / 768 / 1024. Hero form column mounts only ≥1024 (matchMedia, lazy chunk). Mobile keeps drawer flow.
