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

## Architecture

This is a **single-page marketing site** built with Vite + React 18 + TypeScript, styled with Tailwind CSS and shadcn/ui (Radix-based) components. The project originates from Lovable (`lovable-tagger` runs as a Vite plugin in dev mode only).

### Top-level shape

- `src/main.tsx` → mounts `<App />`
- `src/App.tsx` → wraps the app in `QueryClientProvider` (TanStack Query), `TooltipProvider`, and two toasters (`Toaster` from shadcn + `Sonner`). Defines two routes via `react-router-dom`:
  - `/` → `pages/Index.tsx`
  - `*` → `pages/NotFound.tsx`
  - A global `<ScrollToTop />` button sits outside the router.
- `pages/Index.tsx` is the entire landing page: it composes section components (`Hero`, `HumanoidSection`, `SpecsSection`, `Features`, `GetInTouchSection`, `MadeByHumans`) under a `<Navbar />`. It also wires two global behaviors:
  - An `IntersectionObserver` that adds `animate-fade-in` to any element with the `.animate-on-scroll` class as it enters the viewport.
  - A click handler on every `a[href^="#"]` that performs smooth scrolling with a mobile-aware offset (100px under 768px width, 80px otherwise).

When adding a new section, add a component under `src/components/` and slot it into the `<main>` of `pages/Index.tsx`. New routes go above the `"*"` catch-all in `App.tsx`.

### Components

- `src/components/ui/` — shadcn/ui primitives (button, dialog, form, toast, etc.). Configured via `components.json` (style `default`, base color `slate`, CSS variables enabled). Use the shadcn CLI to add more.
- `src/components/*.tsx` — page-level section components. These are the things to edit for content changes.
- `src/hooks/` — `use-mobile`, `use-toast`.
- `src/lib/utils.ts` — shadcn `cn()` helper.

### Path alias

`@/*` resolves to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`). Always prefer `@/components/...` over relative paths.

### Styling

Tailwind is configured in `tailwind.config.ts` with `@tailwindcss/typography` and `tailwindcss-animate`. Global styles and CSS variables live in `src/index.css`. Custom fonts (`brockmann-medium`) are served from `public/`.

### Assets

All marketing imagery, logos, and the Lottie/WebM hero animation live in `public/` and are referenced by absolute paths (e.g. `/loop-animation.webm`).

## Lovable integration

This repo is connected to a Lovable project (see `README.md`). Changes pushed to git are reflected in Lovable and vice versa. `lovable-tagger` is a dev-only Vite plugin — do not remove it or its conditional inclusion in `vite.config.ts`.
