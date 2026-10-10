# alcaziurobert.ro

Bilingual (EN/RO) premium web-development funnel site for Alcaziu Robert.

## Tech stack

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

## Getting started

```sh
# Install dependencies
npm install

# Start the dev server (http://localhost:8080)
npm run dev

# Production build
npm run build

# Lint
npm run lint
```

## Google Analytics

The production web stream is `G-PJKHF484GD`. Its public measurement ID is set
in `.github/workflows/deploy.yml` at build time; an older repository secret
does not override it. For local tracking, copy the `VITE_GA_MEASUREMENT_ID`
value from `.env.example` into `.env.local` before starting or building Vite.
The existing integration loads GA4 only after Performance cookie consent and
measures successful contact requests with `generate_lead`.

See `CLAUDE.md` for architecture notes and `ANALIZA-SI-PLAN.md` for the living audit/backlog.
