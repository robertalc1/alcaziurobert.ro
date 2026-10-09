# Design system

## Identity (updated 2026-10-09)

The original joined AR monogram sits on a blue rounded-square emblem. A fine bevel, inset border and short directional shadow give the mark restrained depth. The geometry remains specific to Alcaziu Robert; the supplied agency reference informs the symbol-plus-name presentation only.

- Vector master: `public/logo-mark.svg`, 104×104, brand-blue gradients, a fine border and an SVG shadow. No raster images or external dependencies.
- Full signature: `public/logo-wordmark.svg`, 503×104. “Alcaziu Robert” uses outlined Figtree at weight 650; the SVG needs no installed or embedded font.
- Navbar: full signature on desktop, 36px emblem on mobile. Loader and footer use the same emblem.
- Single-colour companion: `public/logo-mark-white.svg`, the original flat white AR geometry for tiny in-button applications.
- Favicons use the same emblem with tighter framing and no outer shadow, including SVG and 16/32/48px ICO frames.
- Run `npm run brand-assets` after editing the master. It synchronizes the signature emblem and generates the white companion, SVG/ICO/PNG favicons, Apple icon and PNG/WebP fallbacks.
- Run `npm run og-image` to regenerate the 1200×630 sharing card.
- Mobile WhatsApp shortcut: centred at the bottom, 54px tall, the existing blue gloss finish with inset shadows only. AR at left, name and translated invitation in the middle, WhatsApp at right. No outer glow. It links directly to the shared WhatsApp contact and retains hero/footer hiding and the safe-area inset.

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
- The client band has 12 logo cells, including Laura Predoi; the Alma text wordmark was removed.
- Wrapping, centred rows use 6/4/3 cells at desktop/tablet/mobile widths.
- Sources remain in `public/logos`; `npm run optimize-logos` creates optically balanced white marks on transparent 400×165 WebP canvases.

## Motion

Preserve existing transform/opacity animations and reduced-motion support. Carousel autoplay pauses on hover, focus and touch; keyboard and swipe navigation remain available. The logo introduces no new animation.
