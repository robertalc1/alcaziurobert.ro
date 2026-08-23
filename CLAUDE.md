# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies (a `bun.lockb` is also present; bun works too)
- `npm run dev` — start Vite dev server on **port 8080** (`vite.config.ts` overrides the default 5173)
- `npm run build` — production build
- `npm run build:dev` — build in development mode (keeps `lovable-tagger` enabled)
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint over the repo

No test runner is configured.

## What this site is

Bilingual (EN default / RO) **premium web-development funnel** for Alcaziu Robert, a solo operator selling high-ticket site/funnel builds. The funnel: Meta/IG ad → this landing → progressive qualification form (budget) → discovery call. Positioning is premium/exclusive — no generic-agency tone, brand orange `#ED5C1B`, single typeface General Sans. See `ANALIZA-SI-PLAN.md` for the living audit + improvement backlog.

## Architecture

Vite + React 18 + TypeScript, Tailwind + shadcn/ui (Radix), `react-i18next`, `react-hook-form` + zod, `motion/react`. Originates from Lovable (`lovable-tagger` runs as a Vite plugin in dev mode only).

### Top-level shape

- `src/App.tsx` → providers (`QueryClientProvider`, `TooltipProvider`, helmet, both toasters) + lazy routes: `/` (Index), `/studii-de-caz` (CaseStudy), `/termeni-si-conditii`, `/politica-de-confidentialitate`, `*` (NotFound). `SEOHead` mounts globally; an `app-ready` event hides the boot loader defined in `index.html`.
- `pages/Index.tsx` — the landing (redesigned 2026-07: dark cinematic conversion hero + white editorial body). Render order: `Navbar` (transparent/light-on-dark over the hero on `/`, white floating pill after 10px scroll; anchor links Work/Process/Results/FAQ) → `Hero` (ink `#121212`, huge headline with one orange italic accent word, proof row, primary CTA; on ≥1024px the right column lazy-mounts `HeroContactCard` with the qualification form) → `StatsBandSection` (giant metrics + client wordmarks) → `StatementSection` → `ProcessSection` (`#process`, numbered 01–05 rows) → `SelectedWorkSection` (`#work`, featured OCPI + 2-col grid in CSS browser frames) → `CompoundingSection` → `TestimonialsSection` (`#results`) → `FaqsSection` (`#faq`) → `GetInTouchSection` (`#contact`, inline `ContactForm`) → `MadeByHumans` (footer, the only remaining `LiquidMesh` WebGL user) + `MobileBottomBar` (mobile FAB). Below-the-fold sections are `React.lazy` with height-reserving placeholders (keep this pattern). Anchor scrolling goes through `src/lib/scroll.ts` (`scrollToId`, navbar offsets 100/80).
- **Copy lives in `src/locales/en.json` + `ro.json`** — edit those for content changes, both languages together. Several components are orphaned (never imported) and many locale keys are dormant; check `pages/Index.tsx` for render truth before assuming a component is live.

### Conversion path (don't break these)

- `ContactCTA` wraps any trigger: mobile → bottom Drawer with the form (lazy-loaded on open); desktop → smooth-scroll to `#contact` (navigates home first if the section isn't on the page). Used by Hero (mobile), Navbar, CompoundingSection, TestimonialsSection, MobileBottomBar. On desktop the hero primary CTA focuses the in-hero form instead. Up to two `ContactForm` instances render simultaneously (hero card + `#contact`) — they are independent react-hook-form instances; ids come from `React.useId`, so no collisions.
- `ContactForm` → `POST /api/contact` → `api/contact.ts` (Vercel, nodemailer SMTP; Express mirror in `server.js`). Honeypot field `company`. Meta Conversions API `Lead` event fires server-side only when `FB_PIXEL_ID` + `FB_CAPI_ACCESS_TOKEN` env vars are set (see `.env.example`).
- Scroll-reveal animations use `src/components/Reveal.tsx` (per-instance IntersectionObserver; settles on `transform: none` so sticky descendants keep working). Do NOT add a page-level `.animate-on-scroll` observer — lazy sections mount after page effects run.

### Components

- `src/components/ui/` — shadcn/ui primitives; only ~9 are actually used (toast, sonner, tooltip, drawer, button, input, select, form, accordion, popover).
- `src/components/*.tsx` — section components. Styling is per-section inline `<style>` blocks with hardcoded `#ED5C1B` and `clamp()` scales (section titles `clamp(1.8rem, 4.6vw, 3rem)`, body `clamp(1.05rem, 1.5vw, 1.3rem)`, card-section padding `clamp(48px, 6vh, 80px)`) — match these when adding sections.
- `src/hooks/` — `use-mobile` (768px), `use-scroll`, `use-toast`.

### Path alias

`@/*` resolves to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`). Always prefer `@/components/...` over relative paths.

### Styling

Tailwind config in `tailwind.config.ts`; global styles + shadcn CSS variables in `src/index.css` (`--primary` is tuned to exactly `#ED5C1B`). Single typeface **General Sans** loaded from Fontshare in `index.html` (the `brockmann`/`playfair` aliases in the Tailwind config are dead template leftovers). The site is light-only; the `.dark` token set is unused.

### Assets

Everything in `public/`, referenced by absolute paths. Watch out: `CompoundingSection` references `plane (1).png` URL-encoded as `/plane%20(1).png` — a filename grep won't find it. `public/` also contains ~1.8MB of orphaned legacy images (list in `ANALIZA-SI-PLAN.md`).

## Lovable integration

This repo is connected to a Lovable project (see `README.md`). Changes pushed to git are reflected in Lovable and vice versa. `lovable-tagger` is a dev-only Vite plugin — do not remove it or its conditional inclusion in `vite.config.ts`.
