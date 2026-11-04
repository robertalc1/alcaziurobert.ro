# Design system

## Transparent introductory renders — 2026-11-04

The owner approved the two introductory 3D illustrations and requested transparent backgrounds with no white surrounding panels. They now use `website-3d-cutout-{640,1280}.webp` and `contact-3d-cutout-{640,1280}.webp`, with real alpha and subtle contact shadows. Only `.funnel-pair .funnel-frame` loses its white fill, corner rounding and clipping. Its dimensions, captions, responsive layout and motion stay the same. The separate panoramic section retains its white presentation. Original white assets remain available for comparison.

## White 3D visual funnel — owner revision, 2026-11-04

The latest owner request explicitly replaces the earlier small image/caption pair and long explanatory copy with a wide, image-led funnel. Two original 3D renders on white introduce design and easy contact. A panoramic search bridge appears separately after the real portfolio. Their short headings are real, translated HTML inside the image panels. Width uses the existing 1296px page token, with 16px minimum viewport gutters. At mobile widths the pair stacks and the panorama headline moves above its image inside the same white panel.

The hero layout, Figtree, blue/glass identity, CTA components, consent and form integration remain. Body copy is condensed, the numbered service/process presentation becomes concise service benefits and three collaboration assurances, and FAQ stays at five. Existing guarantee conditions remain in FAQ. Detailed commercial scope is still agreed per project; the starting price is not a fixed bundle.

See `docs/white-funnel-2026-11-04.md` for assets, prompts and verification. This direction supersedes the content-only and previous illustration-layout rules below where they conflict.

## Educational illustrations and shorter FAQ — 2026-11-04

Following the content-only revision, the owner explicitly requested two reference-inspired visuals in the existing brand palette and a maximum of five FAQ questions. The problem unit now uses the existing two-column offer grid for two original illustrations: search on a phone and a search bridge connecting a business with prospective customers. They explain discovery and the path to contact; they are not portfolio evidence or real search results. The hero, shared typography, palette and existing motion remain unchanged. The illustrations use responsive, lazy-loaded WebP files with reserved square dimensions; the grid stacks only below 640px. FAQ uses the same accordion with five grouped questions in both languages. The existing guarantee wording is retained within the post-launch answer.

Assets: `public/visuals/search-phone-{480,960}.webp` and `search-bridge-{480,960}.webp`. Generation prompts and provenance: `docs/educational-visuals-2026-11-04.md`.

## Content-only intervention — 2026-11-04

The user requires the existing design to remain unchanged. This revision changes copy, metadata, semantic associations and load timing only. No stylesheets, typography tokens, colours, radii, shadows, component layouts or animation definitions were changed. Before/after computed styles and screenshots at 360/390/768/1440px are under `artifacts.local/commercial/`. Existing hero/chrome are rendered earlier to eliminate measured late layout changes; their final styling is unchanged. The compact navbar CTA keeps its existing visible label and exposes the full request action through its accessible name.


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

## 3D numerals (2026-10-12)

- Independent, transparent outlined digits: `public/numbers/0.svg` through `9.svg`. The requested 1–9 set is complete; 0 supports the existing 01–05 stage labels.
- Figtree at weight 800, with the exact primary-button face gradient (`#6294F8` → `#4580F7` → `#286CF6`), a light top bevel, a short darker extrusion and a restrained blue shadow. No badge or container behind the glyph.
- `BrandNumber` renders the same assets in offer, process and case-study stage numbering, preserving readable text for assistive technology. Figures in copy, measurements, prices and contact details stay ordinary text.
- The shared frame is 72px tall on desktop and 60px on mobile, including case-study pairs. All SVG geometry is outlined, so rendering needs no font, bitmap or new runtime dependency.
- Regenerate with `python scripts/make-number-assets.py` (tooling: `fonttools` and `brotli`). The SVGs live in `public`; regeneration is not a build step.

## Typography and layout

- Figtree, self-hosted variable font (300–900), including Latin Extended for Romanian.
- Use the existing responsive typography and spacing tokens in `src/index.css`.
- Page/inner/text maximum widths: 1296/1040/880px; panel maximum width: 1408px.
- Radii: cards 16px, panels 24px, fields 12px, pills 100px.
- Preserve the light page, blue hero, generous spacing and existing responsive navigation.

## Portfolio and client marks

### Featured platforms and continuous project rail (2026-11-04)

- The section is bounded to a 1120px container with 24px gutters (20px on mobile), never full bleed.
- SGC OCPI and Black Sea GIS are permanent featured cards, first and separate from the rail. Two columns on desktop; stacked below 640px. Each has a real screenshot, domain, name, descriptive copy and live link.
- The other ten projects run in a continuous horizontal rail: screenshot, short project name and domain link. Cards are 320px wide on desktop and 280px on mobile, with 20px/16px gaps.
- Native horizontal scrolling advances at 28px per second, only while visible. A second, accessibility-hidden group makes the loop seamless; its links are excluded from keyboard navigation.
- Hover and keyboard focus pause movement. Touch or wheel interaction pauses until the visitor explicitly resumes. A labelled pause/resume button is always available while motion is enabled.
- Reduced motion disables autoplay and removes the duplicate group; all projects remain accessible by native horizontal scrolling and keyboard navigation.
- Images, type, colour and CTA reuse the existing assets and design tokens. There is no oversized browser frame, filmstrip, active-project counter or crossfade.
- Verify with `node scripts/verify-portfolio.mjs` while the dev server is running at port 8080. The script checks desktop/mobile layouts, continuous movement, looping, pause behaviour, keyboard focus, reduced motion and contact CTA, and writes local screenshots.

### Screenshots

- **Every image is a capture of the live page, nothing else.** Before 2026-10-12, eight of the twelve were product photos, stock images or — for `r-draw.com` — a generated image still carrying its watermark. A photo inside a browser frame labelled with a client's domain is a false claim, and `PRODUCT.md` bans exactly that look.
- Run `npm run capture-portfolio` to refresh all twelve, or `npm run capture-portfolio -- <slug> <slug>` for a few. The script captures at 1600×1000 and deviceScaleFactor 2, dismisses cookie walls, scrolls the page so IntersectionObserver reveals fire, then writes `public/work/<slug>.webp` (1600×1000) and `public/work/<slug>-thumb.webp` (480×300). A site that fails keeps its existing files.
- Filenames key off the slug. Do not reintroduce per-project filenames (`sgc-live.webp`, `picaps3.webp`, `r-draw.com.webp`) — the component derives both paths from the slug.
- Re-measure `Placeholder minHeight` for the work section in `src/pages/Index.tsx` after any change to this section's content.

### Copy

- Featured copy and rail controls live in `work` with matching Romanian and English keys. Existing `portfolio.lines` is retained for other references.
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
