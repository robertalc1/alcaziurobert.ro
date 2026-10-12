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

### The showcase (replaced the coverflow, 2026-10-12)

Twelve projects; OCPI first. The 3D coverflow is gone — it showed one project at 504×315 inside a ring of rotated ghost cards and twelve anonymous dots. The section is now a single white case holding three things in order:

1. **Stage** — the active project in browser chrome at the full 1240px band. The image lands near 1100px wide, roughly five times the old area. This frame carries **the only drop shadow in the section**; the case, the chips and the buttons carry none. One shadow, and it belongs to the product image.
2. **Caption** — project name set solid (never `-webkit-text-stroke`; the outlined name was the only outlined type on the site), one line of result or description, and the plain secondary pill to the live site. Nothing sits above the name.
3. **Roster** — a filmstrip of all twelve thumbnails with the client's short name under each, as an ARIA tablist with roving tabindex, named by `aria-label` rather than by a visible heading. Selection is a change of surface, not a splash of colour: inactive chips sit recessed on `--page`, the active one lifts to `--surface` with a `--brand` rim. Below 1024px the strip becomes a scroll-snap rail with a mask at the right edge.

Autoplay runs only while the section is on screen, pauses on hover/focus/touch, never runs under `prefers-reduced-motion`, and stops permanently once the visitor picks a project.

### Screenshots

- **Every image is a capture of the live page, nothing else.** Before 2026-10-12, eight of the twelve were product photos, stock images or — for `r-draw.com` — a generated image still carrying its watermark. A photo inside a browser frame labelled with a client's domain is a false claim, and `PRODUCT.md` bans exactly that look.
- Run `npm run capture-portfolio` to refresh all twelve, or `npm run capture-portfolio -- <slug> <slug>` for a few. The script captures at 1600×1000 and deviceScaleFactor 2, dismisses cookie walls, scrolls the page so IntersectionObserver reveals fire, then writes `public/work/<slug>.webp` (1600×1000) and `public/work/<slug>-thumb.webp` (480×300). A site that fails keeps its existing files.
- Filenames key off the slug. Do not reintroduce per-project filenames (`sgc-live.webp`, `picaps3.webp`, `r-draw.com.webp`) — the component derives both paths from the slug.
- Re-measure `Placeholder minHeight` for the work section in `src/pages/Index.tsx` after any change to this section's content.

### Copy

- `portfolio.lines` (renamed from `portfolio.metrics`, which was never only metrics) has matching Romanian and English keys.
- Lines carry a number only where one is documented in `ANALIZA-SI-PLAN.md` (OCPI, Picaps, R-Draw, Kickout). The other eight describe what the site does. No invented metrics, and no English in the Romanian file — `"Conversion rate 4.2% · Industry avg: 1.8%"` was sitting untranslated in `ro.json`.
- **`portfolio.categories` is gone and is not coming back** (removed 2026-10-12, the day it shipped). It rendered as an 11.5px line in brand blue, in capitals, tracked out to 0.14em, above every project name. See the next section.
- The client band has 12 logo cells, including Laura Predoi; the Alma text wordmark was removed.
- Wrapping, centred rows use 6/4/3 cells at desktop/tablet/mobile widths.
- Sources remain in `public/logos`; `npm run optimize-logos` creates optically balanced white marks on transparent 400×165 WebP canvases.

## No eyebrow labels

There are no small-caps "eyebrow" labels anywhere on this site, and none are to be added. The pattern — roughly 10–12px, weight 600+, `text-transform: uppercase`, `letter-spacing` above `0.1em`, often in the accent colour, sitting above a heading — is the most recognisable signature of a generated landing page, and `PRODUCT.md` bans that look outright.

Swept out on 2026-10-12: `.vt-cat` and `.vt-rosterlabel` (portfolio), `.offer-guar-label` (offer), plus the dead `.sec-eyebrow` in `index.css` and four unused copies of `.cs-toc-eyebrow` in the case-study and legal pages.

Where the words carried real information they survived as ordinary text — 13px / 500 / normal tracking / `--text-muted`: `.offer-meta` ("Site", "Funnel", "Tracking", "Reclame") and `.proc-meta` ("Zilele 1–5" …). Without them the second offer card reads as "Nu un teanc de pagini" with nothing saying it is about the funnel, and `PRODUCT.md` requires the process to be "a dated table, not a narrative". **Those two rules are deliberately identical** — the two sections run the same card grid, so change one and change the other. Where a label only restated the heading under it, it was deleted outright: "GARANȚIE" sat above "Garanție pe rezultat, la 90 de zile".

A grep that must keep returning nothing inside `src/`:

```
text-transform: *uppercase
letter-spacing: *0\.(1[0-9]|[2-9])
```

Two all-caps strings are not this pattern and stay: `nav.faq` ("FAQ", an acronym) and `footer.wordmark` ("ALCAZIU ROBERT", a 104px SVG logotype with a gradient fill).

## Motion

Preserve existing transform/opacity animations and reduced-motion support. Keyboard and swipe navigation remain available everywhere they were. The logo introduces no new animation.

The showcase's stage dissolves rather than slides: opacity over 420ms on `--ease-out-quart`, a 1.2% scale settle over 620ms, and a 5px blur that resolves with the opacity. The blur is load-bearing — without it a crossfade reads as two separate pictures overlapping rather than as one changing. Under `prefers-reduced-motion` the opacity change survives (it is what makes the change comprehensible) and the movement and the blur do not.

Press feedback is `transform: scale(0.97)` on every pressable thing, matching `.btn:active`. Hover states on the roster sit behind `@media (hover: hover) and (pointer: fine)`, because a touch device fires `:hover` on tap and leaves the chip looking half-selected after the finger lifts.
