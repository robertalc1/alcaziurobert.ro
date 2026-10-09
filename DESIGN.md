# Design system

## Identity (updated 2026-10-09)

The AR monogram joins a geometric A and R around one vertical stem. Its open counters and flat colour keep it legible at navigation and favicon sizes.

- Vector master: `public/logo-mark.svg`, blue `#4580F7`, transparent, viewBox `0 0 118 98`.
- Dark surfaces: `public/logo-mark-white.svg`, the same paths in white.
- Navbar: blue mark, 36px image height; loader: blue mark, 56–82px.
- Footer: white mark on a subtle translucent tile over the navy panel.
- No fonts, embedded raster images, gradients or filters inside the logo.
- Run `npm run brand-assets` after editing the master. It generates the white version, SVG/ICO/PNG favicons, Apple touch icon and legacy PNG/WebP fallbacks.
- Run `npm run og-image` to regenerate the 1200×630 sharing card.

## Colour

The current implementation in `src/index.css` is the source of truth. The previous orange palette and General Sans typography have been replaced.

- Brand: `#4580F7`; stronger blue for small text: `#1257C4`.
- Page: `#F7F8FB`; alternate page: `#FBFBFC`; cards: `#FFFFFF`.
- Headings: `#0A0A0A`; body: `#14171F`; muted text: `#6D727E`.
- Lines: `#EDEDEF`; inputs: `#E4E4E7`.
- Hero and footer panels: `#0B2A5C` with white text and blue shader accents.
- The lighter brand blue is reserved for marks, controls and large accents; small text uses the stronger blue or the body text colours.

## Typography and layout

- Figtree, self-hosted variable font (300–900), including Latin Extended for Romanian.
- Use the existing responsive typography and spacing tokens in `src/index.css`.
- Page/inner/text maximum widths: 1296/1040/880px; panel maximum width: 1408px.
- Radii: cards 16px, panels 24px, fields 12px, pills 100px.
- Preserve the light page, blue hero, generous spacing and existing responsive navigation.

## Portfolio and client marks

- Ten projects in the existing coverflow; OCPI first, Laura Predoi second.
- Laura Predoi links to `https://psihologiecabinet.ro/`. Its WebP is a 1600×1000 crop of the local project's `artifacts/home-1440.png` captured on 2026-10-09; live browser access was unavailable during this update.
- Project categories and descriptions have matching Romanian and English keys.
- The client band preserves all existing clients and adds Laura Predoi: 13 cells.
- Wrapping, centred rows use 6/4/3 cells at desktop/tablet/mobile widths.
- Sources remain in `public/logos`; `npm run optimize-logos` creates optically balanced white marks on transparent 400×165 WebP canvases.

## Motion

Preserve existing transform/opacity animations and reduced-motion support. Carousel autoplay pauses on hover, focus and touch; keyboard and swipe navigation remain available. The logo introduces no new animation.
