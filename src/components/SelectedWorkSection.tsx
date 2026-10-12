"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";

type Project = {
  slug: string;
  /** Full name — the stage heading and the image's alt text. */
  name: string;
  /** Roster label. A filmstrip cell is ~90px; full names do not fit in one. */
  short: string;
  url: string;
  domain: string;
};

/* Every live build, OCPI first. Images come from scripts/capture-portfolio.mjs
   and are named off the slug — there is no per-project filename to keep in
   sync here any more. */
const PROJECTS: Project[] = [
  { slug: "sgc", name: "Oficiul de Cadastru — OCPI", short: "OCPI", url: "https://sgc.ocpict.ro/", domain: "sgc.ocpict.ro" },
  { slug: "black-sea-gis", name: "Black Sea GIS", short: "Black Sea GIS", url: "https://bsgis.ocpict.ro/", domain: "bsgis.ocpict.ro" },
  { slug: "laura-predoi", name: "Laura Predoi — Cabinet de psihologie", short: "Laura Predoi", url: "https://psihologiecabinet.ro/", domain: "psihologiecabinet.ro" },
  { slug: "unbacde10", name: "UNBACDE10", short: "UNBACDE10", url: "https://unbacde10.ro/", domain: "unbacde10.ro" },
  { slug: "picaps", name: "Picaps", short: "Picaps", url: "https://picaps.ro/", domain: "picaps.ro" },
  { slug: "kickout", name: "Kickout", short: "Kickout", url: "https://kickout.ro/", domain: "kickout.ro" },
  { slug: "rdraw", name: "R-Draw", short: "R-Draw", url: "https://r-draw.com/", domain: "r-draw.com" },
  { slug: "everun", name: "Everun", short: "Everun", url: "https://www.everunromania.ro/", domain: "everunromania.ro" },
  { slug: "everati", name: "Everati", short: "Everati", url: "https://everati.ro/", domain: "everati.ro" },
  { slug: "alma", name: "Alma", short: "Alma", url: "https://vopsitoriaalma.ro/", domain: "vopsitoriaalma.ro" },
  { slug: "lukton", name: "Lukton", short: "Lukton", url: "https://lukton.ro/", domain: "lukton.ro" },
  { slug: "ecartop", name: "Ecartop", short: "Ecartop", url: "https://ecartop.com/", domain: "ecartop.com" },
];

const TOTAL = PROJECTS.length;

/* Up from 5.2s. The stage is five times the area it used to be and carries a
   sentence of its own; the old interval moved on before the picture had been
   read. */
const AUTOPLAY_MS = 6500;

const shot = (slug: string) => `/work/${slug}.webp`;
const thumb = (slug: string) => `/work/${slug}-thumb.webp`;

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ArrowUpRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 19L19 5" />
    <path d="M9 5h10v10" />
  </svg>
);

/* ── The dissolve ─────────────────────────────────────────────────────────
   Two slots that ping-pong. The incoming image is written into whichever slot
   is NOT in front, then front flips; the slot being left keeps its picture for
   the length of the dissolve and is dropped on the next change. So the DOM
   never holds more than two 1600x1000 bitmaps — rendering all twelve would be
   roughly 77MB of decoded image on a phone, for eleven pictures nobody is
   looking at.

   Both slots start on the same index, which is why the first paint is a single
   image and not a crossfade from nothing. */
type Stage = { a: number; b: number; front: "a" | "b" };

const current = (s: Stage) => (s.front === "a" ? s.a : s.b);

const moveTo = (s: Stage, to: number): Stage => {
  if (to === current(s)) return s;
  return s.front === "a" ? { a: s.a, b: to, front: "b" } : { a: to, b: s.b, front: "a" };
};

/**
 * The work, as a showcase: one project at full band width, every project named
 * underneath it.
 *
 * It was a 3D coverflow — a 520px centre card ringed by four rotated ghost
 * cards and twelve anonymous dots. Three things were wrong with that and only
 * one of them was the layout. The centre image rendered at 504x315, which is
 * too small to read a website in; the flanking cards were noise around the one
 * thing worth looking at; and eight of the twelve "screenshots" were not
 * screenshots at all but stock photos and product renders, so the browser
 * chrome was framing a picture of a tractor and calling it a website.
 *
 * Now: the stage runs the full 1240px band (the image lands near 1100px wide,
 * about five times the old area), the roster below it is a filmstrip of all
 * twelve real thumbnails with the client's name under each, and every image is
 * a capture of the page that is live at that address today.
 *
 * Autoplay runs only while the section is on screen, pauses on hover, focus
 * and touch, never runs under prefers-reduced-motion — and stops for good the
 * moment the visitor picks a project. Once somebody has taken the wheel you do
 * not take it back from them.
 */
const SelectedWorkSection: React.FC = () => {
  const { t } = useTranslation();

  const [stage, setStage] = React.useState<Stage>({ a: 0, b: 0, front: "a" });
  const index = current(stage);

  /** The visitor has chosen a project. Autoplay is over for this session. */
  const [taken, setTaken] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [inView, setInView] = React.useState(false);

  const sectionRef = React.useRef<HTMLElement>(null);
  const chipRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = React.useRef<number | null>(null);
  const firstPaint = React.useRef(true);

  const goTo = React.useCallback((to: number) => setStage((s) => moveTo(s, to)), []);
  const advance = React.useCallback(
    () => setStage((s) => moveTo(s, (current(s) + 1) % TOTAL)),
    [],
  );
  const pick = React.useCallback(
    (to: number) => {
      setTaken(true);
      goTo(to);
    },
    [goTo],
  );

  /* Autoplay is gated on visibility as well as on hover. A carousel ticking
     away four screens above the fold spends frames and bandwidth on a section
     nobody is looking at, and it means the first project a visitor actually
     sees is whichever one the timer happened to land on. */
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (taken || paused || !inView || TOTAL <= 1 || reduced()) return;
    const id = window.setInterval(advance, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [taken, paused, inView, advance]);

  /* Warm the two neighbours so stepping through the roster never shows an
     empty frame. Only once the section is on screen — this is 12 x ~60KB and
     none of it is needed by a visitor who never scrolls this far. */
  React.useEffect(() => {
    if (!inView) return;
    for (const d of [1, -1]) {
      const img = new Image();
      img.src = shot(PROJECTS[(index + d + TOTAL) % TOTAL].slug);
    }
  }, [index, inView]);

  /* Keep the active chip in frame. On desktop the filmstrip fits and this is a
     no-op; below 1024px it is a scroll-snap rail and the chip would otherwise
     march off the right edge while autoplay runs. */
  React.useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    chipRefs.current[index]?.scrollIntoView({
      behavior: reduced() ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  /* Arrow keys live on the tablist, never on window: this page's job below the
     fold is the contact form, and stealing the arrow keys page-wide would take
     scrolling away from keyboard visitors. */
  const onRosterKey = (e: React.KeyboardEvent) => {
    let to: number | null = null;
    if (e.key === "ArrowRight") to = (index + 1) % TOTAL;
    else if (e.key === "ArrowLeft") to = (index - 1 + TOTAL) % TOTAL;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = TOTAL - 1;
    if (to === null) return;
    e.preventDefault();
    pick(to);
    chipRefs.current[to]?.focus();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    setPaused(false);
    if (start === null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 45) pick((index + (dx < 0 ? 1 : -1) + TOTAL) % TOTAL);
  };

  const active = PROJECTS[index];

  return (
    <section
      className="work-section"
      id="work"
      ref={sectionRef}
      aria-label={t("work.section_title")}
    >
      <style>{`
        /* padding-section_testimonial: 0 top, 128 bottom. The body section
           above already spends 128 on its own bottom edge, and
           GetInTouchSection below opens with none — a top value here would
           double the gap above and leave a seam below. Load-bearing. */
        .work-section {
          position: relative;
          width: 100%;
          background: var(--page);
          padding: 0 0 var(--sp-128);
        }
        /* 1240, wider than the page's own 1296-minus-gutters and much wider
           than the body's 1040 column. This is the one band on the page that
           is allowed to break the grid, and the extra width is the whole
           argument: the screenshot has to be big enough to read. */
        .work-inner {
          position: relative;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(18px, 3vw, 32px);
        }

        /* Same spec as every other section title (see .leads-title). */
        .work-title {
          font-family: var(--font-sans);
          font-weight: var(--text-heading-weight);
          letter-spacing: var(--text-heading-ls);
          font-size: var(--text-section-title);
          line-height: var(--text-heading-lh);
          color: var(--ink);
          margin: 0 auto;
          max-width: 30ch;
          text-align: center;
          text-wrap: balance;
        }
        /* 16px under the heading, body scale, the only grey — the same header
           anatomy the five units in the body use. */
        .work-sub {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          text-align: center;
          max-width: var(--w-text);
          margin: var(--sp-16) auto 0;
          text-wrap: balance;
        }

        /* ── The case ───────────────────────────────────────────────────
           One white object on the grey page holding the screenshot, its
           caption and the roster. The alternative was three loose elements
           stacked on the page; the case is what makes them read as one
           exhibit rather than as three sections that happen to be adjacent. */
        .vt-case {
          margin-top: var(--sp-48);
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--r-panel);
          padding: clamp(14px, 1.6vw, 22px);
          box-shadow: var(--shadow-soft);
        }

        /* ── Browser chrome ─────────────────────────────────────────────
           Double bezel: light outer tray, dark core, concentric radii.
           Screenshots never ship raw here — the chrome is what makes the
           image read as a live site rather than as a picture. It used to run
           at 7px padding and a 9px radius, which were sized for a 520px card
           and looked like a toy at this width. */
        .vt-frame {
          position: relative;
          margin: 0;
          border-radius: 18px;
          padding: clamp(7px, 0.8vw, 10px);
          background: var(--surface);
          border: 1px solid #E6E7EB;
          /* The one real shadow in the section. Apple's rule, and it is right:
             a drop shadow belongs to the product image and to nothing else —
             not to the case, not to the chips, not to the buttons. */
          box-shadow:
            0 32px 64px -30px rgba(10, 22, 51, 0.34),
            0 8px 18px -12px rgba(10, 22, 51, 0.14);
        }
        .vt-core {
          border-radius: 12px;
          overflow: hidden;
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .vt-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          height: 40px;
          padding: 0 14px;
          background: #191919;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        /* The accent rather than traffic lights. It is the one spot of colour
           inside the chrome, so the frame reads as ours. */
        .vt-dot {
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: var(--brand);
          flex: 0 0 auto;
        }
        .vt-domain {
          margin-left: 12px;
          font-family: var(--font-sans);
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* Where a real browser keeps its go button. A second target for the
           same destination, in the place the eye already expects one. */
        .vt-bar-cta {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 26px;
          padding: 0 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.09);
          color: rgba(255, 255, 255, 0.82);
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
          flex: 0 0 auto;
          transition: background-color .2s ease, color .2s ease;
        }
        .vt-bar-cta svg { width: 10px; height: 10px; }

        .vt-view {
          position: relative;
          aspect-ratio: 16 / 10;
          background: #111111;
          overflow: hidden;
        }
        /* Both slots are absolutely placed and stacked. Only opacity, a hair of
           scale and a short blur move — the blur is what stops the dissolve
           reading as two separate pictures overlapping. */
        .vt-shot {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          user-select: none;
          opacity: 0;
          transform: scale(1.012);
          filter: blur(5px);
          transition: opacity 420ms var(--ease-out-quart),
                      transform 620ms var(--ease-out-quart),
                      filter 420ms var(--ease-out-quart);
        }
        .vt-shot[data-front="true"] {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
          z-index: 1;
        }

        /* ── Caption ────────────────────────────────────────────────────
           All twelve are in the DOM, stacked on one grid cell so the block is
           as tall as the longest of them and nothing reflows on change. Two
           reasons they are not conditionally rendered: the crossfade needs
           both present, and scripts/prerender.mjs snapshots this markup for
           the crawlers that do not run JavaScript — every project name and
           every line has to be in that HTML. */
        .vt-meta {
          display: grid;
          padding: 22px 6px 20px;
        }
        .vt-card {
          grid-area: 1 / 1;
          opacity: 0;
          transform: translateY(6px);
          pointer-events: none;
          transition: opacity 300ms ease, transform 300ms var(--ease-out-quart);
        }
        .vt-card[data-on="true"] {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        /* --brand-strong, not --brand: this runs at 11.5px and the palette note
           in index.css reserves the lighter accent for headings, chips and
           borders — never small copy. #1257C4 clears AA here. */
        .vt-cat {
          display: block;
          color: var(--brand-strong);
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin: 0 0 10px;
        }
        .vt-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--sp-24);
        }
        /* Solid, not outlined. The name used to render in -webkit-text-stroke,
           the only outlined type anywhere on the site; at this size a hollow
           letterform reads as a rendering fault rather than as display type,
           and it broke the one-typographic-system rule in index.css. */
        .vt-name {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(1.4rem, 2.1vw, 1.75rem);
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: var(--ink);
          margin: 0;
          text-wrap: balance;
        }
        .vt-line {
          font-family: var(--font-sans);
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          color: var(--text-muted);
          margin: 10px 0 0;
          max-width: 62ch;
        }
        /* The site's plain secondary pill — same height, padding and font as
           every other button here. The blue gloss is reserved for the one
           control that asks for the sale, and that is the CTA below. */
        .vt-visit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--btn-gap);
          height: var(--btn-h);
          padding: 0 var(--btn-px);
          border-radius: 9999px;
          background: var(--btn-plain-bg);
          border: 1px solid var(--btn-plain-border);
          color: var(--btn-plain-fg);
          font-family: var(--font-sans);
          font-size: var(--btn-font);
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
          flex: 0 0 auto;
          transition: border-color .22s ease, transform .16s var(--ease-out-quart);
        }
        .vt-visit svg { width: 13px; height: 13px; }
        .vt-visit:active { transform: scale(0.97); }

        /* ── Roster ─────────────────────────────────────────────────────
           A filmstrip, not a grid and not a row of dots. Twelve dots carry no
           information; twelve thumbnails with the client's name under them are
           themselves the proof, and they put every project on screen at once
           instead of behind a timer. */
        .vt-rosterwrap {
          border-top: 1px solid var(--line);
          padding-top: 18px;
        }
        .vt-rosterhead {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          margin: 0 2px 14px;
        }
        .vt-rosterlabel {
          font-family: var(--font-sans);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0;
        }
        .vt-count {
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.04em;
        }
        .vt-count b { color: var(--ink); font-weight: 700; }

        .vt-roster {
          display: grid;
          grid-template-columns: repeat(${TOTAL}, minmax(0, 1fr));
          gap: 10px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .vt-chip {
          display: block;
          width: 100%;
          /* 6px of padding plus the thumbnail and the label clears the 44px
             touch floor on its short side at every breakpoint. */
          padding: 6px 5px 0;
          border-radius: 12px;
          border: 1px solid transparent;
          /* Inactive sits recessed into the case; active lifts to white with a
             brand rim. Selection is a change of surface, not a splash of
             colour — same move Linear makes on its pricing tabs. */
          background: var(--page);
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background-color .22s ease, border-color .22s ease,
                      box-shadow .22s ease, transform .16s var(--ease-out-quart);
        }
        .vt-chip:active { transform: scale(0.97); }
        .vt-chip[aria-selected="true"] {
          background: var(--surface);
          border-color: var(--brand);
          box-shadow: 0 0 0 1px var(--brand);
        }
        .vt-chip-shot {
          display: block;
          aspect-ratio: 16 / 10;
          border-radius: 7px;
          overflow: hidden;
          background: #E9EBF1;
        }
        .vt-chip-shot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          opacity: 0.55;
          filter: saturate(0.75);
          transition: opacity .25s ease, filter .25s ease;
        }
        .vt-chip-name {
          display: block;
          font-family: var(--font-sans);
          /* 11px, not 11.5: at twelve columns the widest label in the set
             ("Black Sea GIS") clipped to "Black Sea ..." at the larger size,
             and a truncated client name is worse than a small one. */
          font-size: 11px;
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1.2;
          color: var(--text-muted);
          padding: 8px 1px 9px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color .22s ease;
        }
        .vt-chip[aria-selected="true"] .vt-chip-shot img { opacity: 1; filter: none; }
        .vt-chip[aria-selected="true"] .vt-chip-name { color: var(--ink); }

        /* Touch devices fire :hover on tap, which leaves a chip looking half
           selected after the finger lifts. */
        @media (hover: hover) and (pointer: fine) {
          .vt-chip:hover { border-color: var(--line-2); }
          .vt-chip:hover .vt-chip-shot img { opacity: 0.85; filter: saturate(0.9); }
          .vt-chip:hover .vt-chip-name { color: var(--ink-2); }
          .vt-chip[aria-selected="true"]:hover { border-color: var(--brand); }
          .vt-visit:hover { border-color: var(--btn-plain-border-hover); }
          .vt-bar-cta:hover { background: rgba(255, 255, 255, 0.17); color: #FFFFFF; }
        }

        /* ── Section CTA ────────────────────────────────────────────────
           Below the work, not above it. It used to sit between the standfirst
           and the deck, which asked for the sale before the visitor had been
           shown a single thing. */
        .work-cta { margin-top: var(--sp-48); text-align: center; }

        /* ── Tablet: the filmstrip becomes a rail ───────────────────────
           Twelve cells stop being legible somewhere under 1024px. A rail keeps
           each chip at a readable size and makes the overflow obvious, which a
           squeezed grid does not. The mask is the affordance — a cut-off chip
           at the right edge says "there is more" better than a hint line. */
        @media (max-width: 1024px) {
          .vt-roster {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 4px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            -webkit-mask-image: linear-gradient(90deg, #000 90%, transparent 100%);
            mask-image: linear-gradient(90deg, #000 90%, transparent 100%);
          }
          .vt-roster::-webkit-scrollbar { display: none; }
          .vt-roster li { flex: 0 0 132px; scroll-snap-align: center; }
        }

        @media (max-width: 767px) {
          /* Steps down with .leads above it — 128px of bottom padding on a
             phone is a fifth of a screen of nothing. */
          .work-section { padding-bottom: var(--sp-64); }
          .work-title { max-width: 100%; }
          /* The gutter tightens and the case gives up its own chrome. Nested
             padding was costing the screenshot 80px of a 390px screen — a
             fifth of the viewport spent on a border, and the stage came out
             narrower than the card it replaced. The case earns its keep on a
             desktop, where it groups three blocks that would otherwise float;
             on a phone they are stacked and obviously one thing already. */
          .work-inner { padding: 0 14px; }
          .vt-case {
            margin-top: var(--sp-32);
            padding: 0;
            background: none;
            border: none;
            border-radius: 0;
            box-shadow: none;
          }
          .vt-frame { border-radius: 13px; padding: 5px; }
          .vt-core { border-radius: 9px; }
          .vt-bar { height: 32px; padding: 0 10px; gap: 5px; }
          .vt-dot { width: 7px; height: 7px; }
          .vt-domain { font-size: 11px; margin-left: 8px; }
          .vt-bar-cta { display: none; }
          .vt-meta { padding: 16px 2px 18px; }
          .vt-rosterwrap { padding-top: 16px; }
          .vt-row { flex-direction: column; align-items: stretch; gap: 16px; }
          .vt-line { max-width: 100%; }
          .vt-visit { width: 100%; }
          .vt-roster li { flex-basis: 124px; }
          .work-cta { margin-top: var(--sp-32); }
          .work-cta .btn { width: 100%; }
        }

        /* Reduced motion keeps the crossfade — it is what makes the change
           comprehensible — and drops every movement and the blur. */
        @media (prefers-reduced-motion: reduce) {
          .vt-shot {
            transition: opacity 200ms ease;
            transform: none;
            filter: none;
          }
          .vt-shot[data-front="true"] { transform: none; }
          .vt-card { transition: opacity 180ms ease; transform: none; }
          .vt-chip, .vt-chip-shot img, .vt-chip-name, .vt-visit, .vt-bar-cta {
            transition: none;
          }
          .vt-chip:active, .vt-visit:active { transform: none; }
        }
      `}</style>

      <div className="work-inner">
        <Reveal>
          <h2 className="work-title">{t("work.section_title")}</h2>
          <p className="work-sub">{t("portfolio.title")}</p>
        </Reveal>

        {/* blur={0}: the subtree holds two full-size screenshots and twelve
            thumbnails, and filter: blur() re-rasterises all of it on every
            frame of the reveal. */}
        <Reveal delay={90} blur={0}>
          <div className="vt-case">
            <div
              id="vt-panel"
              role="tabpanel"
              aria-labelledby={`vt-tab-${active.slug}`}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{ touchAction: "pan-y" }}
            >
              <figure className="vt-frame">
                <div className="vt-core">
                  <div className="vt-bar">
                    <span className="vt-dot" aria-hidden="true" />
                    <span className="vt-dot" aria-hidden="true" />
                    <span className="vt-dot" aria-hidden="true" />
                    <span className="vt-domain">{active.domain}</span>
                    <a
                      className="vt-bar-cta"
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${active.name} — ${t("work.visit")}`}
                    >
                      {t("work.visit")}
                      {ArrowUpRight}
                    </a>
                  </div>

                  <div className="vt-view">
                    {(["a", "b"] as const).map((slot) => {
                      const p = PROJECTS[stage[slot]];
                      const front = stage.front === slot;
                      return (
                        <img
                          key={slot}
                          className="vt-shot"
                          data-front={front}
                          src={shot(p.slug)}
                          alt={front ? `${p.name} — ${p.domain}` : ""}
                          aria-hidden={front ? undefined : true}
                          width={1600}
                          height={1000}
                          decoding="async"
                          draggable={false}
                        />
                      );
                    })}
                  </div>
                </div>
              </figure>

              <div className="vt-meta">
                {PROJECTS.map((p, i) => {
                  const on = i === index;
                  return (
                    <div className="vt-card" key={p.slug} data-on={on} aria-hidden={on ? undefined : true}>
                      <span className="vt-cat">{t(`portfolio.categories.${p.slug}`)}</span>
                      <div className="vt-row">
                        <div>
                          <h3 className="vt-name">{p.name}</h3>
                          <p className="vt-line">{t(`portfolio.lines.${p.slug}`)}</p>
                        </div>
                        <a
                          className="vt-visit"
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={on ? undefined : -1}
                          aria-label={`${p.name} — ${t("work.visit")}`}
                        >
                          {t("work.visit")}
                          {ArrowUpRight}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="vt-rosterwrap">
              <div className="vt-rosterhead">
                <p className="vt-rosterlabel" id="vt-roster-label">
                  {t("work.roster_label")}
                </p>
                <span className="vt-count" aria-hidden="true">
                  <b>{String(index + 1).padStart(2, "0")}</b> / {TOTAL}
                </span>
              </div>

              {/* Roving tabindex: one stop for the whole strip, arrows move
                  inside it. Twelve separate tab stops between the screenshot
                  and the form would be twelve too many. */}
              <ul className="vt-roster" role="tablist" aria-labelledby="vt-roster-label">
                {PROJECTS.map((p, i) => {
                  const on = i === index;
                  return (
                    <li key={p.slug}>
                      <button
                        type="button"
                        role="tab"
                        id={`vt-tab-${p.slug}`}
                        className="vt-chip"
                        aria-selected={on}
                        aria-controls="vt-panel"
                        tabIndex={on ? 0 : -1}
                        onClick={() => pick(i)}
                        onKeyDown={onRosterKey}
                        ref={(el) => {
                          chipRefs.current[i] = el;
                        }}
                      >
                        <span className="vt-chip-shot">
                          <img
                            src={thumb(p.slug)}
                            alt=""
                            width={480}
                            height={300}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                        </span>
                        <span className="vt-chip-name">{p.short}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="work-cta">
          <ContactCTA mode="modal">
            <button type="button" className="btn btn-primary">
              {t("nav.cta")}
              {ArrowUpRight}
            </button>
          </ContactCTA>
        </div>
      </div>
    </section>
  );
};

export default SelectedWorkSection;
