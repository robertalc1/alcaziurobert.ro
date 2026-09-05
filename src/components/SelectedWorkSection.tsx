"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";
import { useIsMobile } from "@/hooks/use-mobile";

type Project = {
  slug: string;
  name: string;
  url: string;
  img: string;
  domain: string;
};

// Every live build, OCPI first — the carousel shows them all.
const PROJECTS: Project[] = [
  { slug: "sgc", name: "Oficiul de Cadastru — OCPI", url: "https://sgc.ocpict.ro/", img: "/sgc-live.webp", domain: "sgc.ocpict.ro" },
  { slug: "picaps", name: "Picaps", url: "https://picaps.ro/", img: "/picaps3.webp", domain: "picaps.ro" },
  { slug: "kickout", name: "Kickout", url: "https://kickout.ro/", img: "/kickout.webp", domain: "kickout.ro" },
  { slug: "rdraw", name: "R-Draw", url: "https://r-draw.com/", img: "/r-draw.com.webp", domain: "r-draw.com" },
  { slug: "everun", name: "Everun", url: "https://www.everunromania.ro/", img: "/everun.webp", domain: "everunromania.ro" },
  { slug: "everati", name: "Everati", url: "https://everati.ro/", img: "/everati.webp", domain: "everati.ro" },
  { slug: "alma", name: "Alma", url: "https://vopsitoriaalma.ro/", img: "/alma.webp", domain: "vopsitoriaalma.ro" },
  { slug: "lukton", name: "Lukton", url: "https://lukton.ro/", img: "/lukton.webp", domain: "lukton.ro" },
  { slug: "ecartop", name: "Ecartop", url: "https://ecartop.com/", img: "/ecartop.webp", domain: "ecartop.com" },
];

const AUTOPLAY_MS = 5200;

/* Depth ladder for the coverflow. Two of them: phones have no room for a
   second ring of cards, so the far slots collapse onto the near ones and
   fade out instead of piling up at the edge of a 390px screen.
   translateX is a percentage of the card's own width, so the whole stage
   stays fluid — the reference implementation used fixed pixel offsets and
   broke below ~1100px. */
const DEPTH = {
  desktop: [
    { x: 0, scale: 1, rotate: 0, opacity: 1, z: 30 },
    { x: 58, scale: 0.84, rotate: 22, opacity: 0.78, z: 20 },
    { x: 104, scale: 0.7, rotate: 32, opacity: 0.4, z: 10 },
  ],
  mobile: [
    { x: 0, scale: 1, rotate: 0, opacity: 1, z: 30 },
    { x: 66, scale: 0.8, rotate: 20, opacity: 0.45, z: 20 },
    { x: 96, scale: 0.7, rotate: 28, opacity: 0, z: 10 },
  ],
} as const;

const ArrowUpRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 19L19 5" />
    <path d="M9 5h10v10" />
  </svg>
);

const ChevronLeft = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

// CSS browser chrome around a screenshot — double-bezel: dark outer tray,
// darker inner core with concentric radii. Screenshots never ship raw here;
// the chrome is what makes them read as a live site rather than a mockup.
const BrowserFrame: React.FC<{ src: string; alt: string; domain?: string; eager?: boolean }> = ({
  src,
  alt,
  domain,
  eager,
}) => (
  <figure className="bf">
    <div className="bf-core">
      <div className="bf-bar" aria-hidden="true">
        <span className="bf-dot" />
        <span className="bf-dot" />
        <span className="bf-dot" />
        {domain && <span className="bf-domain">{domain}</span>}
      </div>
      <div className="bf-view">
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          width={1600}
          height={1000}
          className="bf-img"
          draggable={false}
        />
      </div>
    </div>
  </figure>
);

/**
 * The work, as a 3D coverflow. It used to be a horizontally drifting track of
 * nine equal cards, which made every project look equally weighted and asked
 * the visitor to scan rather than to look. A coverflow has one hero at a time:
 * the centre card is the argument, the flanking cards only say "there are
 * more". Same nine projects, same browser chrome, same buttons.
 *
 * Autoplay pauses on hover, focus and touch, and never runs under
 * prefers-reduced-motion.
 */
const SelectedWorkSection: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const total = PROJECTS.length;

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const touchX = React.useRef<number | null>(null);

  const go = React.useCallback(
    (delta: number) => setIndex((i) => (i + delta + total) % total),
    [total],
  );
  const goTo = React.useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);

  // Autoplay. Reduced motion turns it off entirely rather than shortening it:
  // the whole point of the setting is that nothing moves unasked.
  React.useEffect(() => {
    if (paused || total <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, go, total]);

  // Arrow keys are bound to the stage, not to window. A landing page has one
  // job below this section (the form); stealing the arrow keys page-wide to
  // drive a carousel would break scrolling for keyboard visitors.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
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
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
  };

  const ladder = isMobile ? DEPTH.mobile : DEPTH.desktop;

  return (
    <section className="work-section" id="work" aria-label={t("portfolio.title")}>
      <style>{`
        .work-section {
          position: relative;
          width: 100%;
          background: #0F0F0F;
          padding: clamp(64px, 9vh, 112px) 0 clamp(48px, 7vh, 88px);
          overflow: hidden;
        }
        .work-inner {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 clamp(18px, 3vw, 32px);
        }

        /* Same spec as every other section title (see .comp-title) */
        .work-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.022em;
          font-size: var(--text-section-title);
          line-height: 1.15;
          color: #F5F5F5;
          margin: 0 auto;
          max-width: 30ch;
          text-align: center;
          text-wrap: balance;
        }

        /* ── Coverflow stage ──────────────────────────────────────────────
           --cf-w is declared once and reused by the card width and by the
           centring margin, so there is only ever one number to change. */
        .cf-stage {
          --cf-w: clamp(290px, 36vw, 520px);
          position: relative;
          z-index: 1;
          width: 100%;
          height: clamp(360px, 40vw, 500px);
          margin: clamp(30px, 4.5vh, 54px) auto 0;
          perspective: 1600px;
          touch-action: pan-y;
          outline: none;
        }
        .cf-stage:focus-visible { outline: 2px solid #ED5C1B; outline-offset: 8px; border-radius: 12px; }

        .cf-card {
          position: absolute;
          top: 0;
          left: 50%;
          width: var(--cf-w);
          margin-left: calc(var(--cf-w) / -2);
          transform-origin: center center;
          transition: transform 760ms cubic-bezier(.23,1,.32,1),
                      opacity 520ms ease,
                      filter 520ms ease;
          will-change: transform, opacity;
        }
        /* Only the flanking cards are clickable, and only to bring themselves
           forward. The centre card's own links do the rest. */
        .cf-card[data-side="true"] { cursor: pointer; }

        .cf-shot {
          display: block;
          width: 100%;
          text-decoration: none;
        }

        /* ── Meta under the frame ── */
        .cf-meta {
          display: flex;
          flex-direction: column;
          padding: 16px 4px 0;
          transition: opacity 420ms ease, transform 420ms ease;
        }
        /* Off-centre cards keep the screenshot and drop the words: three sets
           of project names fighting for the same strip of page was the reason
           the old track read as a wall rather than as a portfolio. */
        .cf-card[data-side="true"] .cf-meta {
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
        }
        .pw-cat {
          display: inline-block;
          color: #ED5C1B;
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .pw-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .pw-metric {
          font-family: var(--font-sans);
          font-size: 13.5px;
          line-height: 1.5;
          color: rgba(245, 245, 245, 0.62);
          margin: 8px 0 0;
        }
        .pw-name {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(1.35rem, 1.9vw, 1.8rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #F5F5F5;
          margin: 0;
          text-wrap: balance;
        }
        /* Outlined display type, static — falls back to solid where text-stroke is unsupported */
        @supports (-webkit-text-stroke: 1px #fff) {
          .pw-name {
            color: transparent;
            -webkit-text-stroke: 1.4px #F5F5F5;
          }
        }
        .pw-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          color: #F5F5F5;
          font-family: var(--font-sans);
          font-size: 14.5px;
          font-weight: 500;
          text-decoration: none;
          transition: color .25s ease;
        }
        /* Label kept for screen readers; the round icon carries it visually */
        .pw-link-label {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .pw-link-icon {
          width: var(--btn-h); height: var(--btn-h);
          border-radius: 9999px;
          border: 1px solid var(--btn-steel-border);
          background: var(--btn-steel);
          box-shadow: var(--btn-steel-shadow);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: border-color .25s ease, background-color .25s ease,
                      transform .25s cubic-bezier(.23,1,.32,1);
        }
        .pw-link-icon svg { width: 12px; height: 12px; }
        .pw-link:hover { color: #ED5C1B; }
        .pw-link:hover .pw-link-icon {
          background: var(--btn-steel-hover);
          border-color: var(--btn-steel-border-hover);
          color: #ffffff;
          transform: translate(2px, -2px);
        }

        /* ── Browser chrome ── */
        .bf {
          margin: 0;
          border-radius: 14px;
          padding: 7px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.10);
          box-shadow: 0 30px 60px -34px rgba(0, 0, 0, 0.8);
          transition: box-shadow 520ms ease, border-color 520ms ease;
        }
        /* The centre card is lifted, not tinted. It briefly carried an orange
           rim and halo, which put a warm cast over a section whose whole job is
           to show nine screenshots truthfully — the colour was competing with
           the work. Depth alone separates it: it is the only card at full
           opacity and scale 1, and it is the only one with its own text. */
        .cf-card[data-side="false"] .bf {
          box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.95);
        }
        .bf-core {
          border-radius: 9px;
          overflow: hidden;
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .bf-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 12px;
          background: #191919;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        /* Brand orange rather than the usual grey or traffic-light dots. It is
           the one spot of colour inside the chrome, so the frame reads as ours
           instead of as a generic browser mockup. */
        .bf-dot {
          width: 8px; height: 8px;
          border-radius: 9999px;
          background: #ED5C1B;
        }

        .bf-domain {
          margin-left: 10px;
          font-family: var(--font-sans);
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bf-view {
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #0F0F0F;
        }
        .bf-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform .6s cubic-bezier(.23,1,.32,1);
          user-select: none;
        }
        .cf-shot:hover .bf-img { transform: scale(1.03); }

        /* ── Navigation — the site's own steel button, not a glass disc ── */
        .cf-nav {
          position: absolute;
          top: 50%;
          z-index: 40;
          width: var(--btn-h);
          height: var(--btn-h);
          margin-top: calc(var(--btn-h) / -2);
          border-radius: 9999px;
          border: 1px solid var(--btn-steel-border);
          background: var(--btn-steel);
          box-shadow: var(--btn-steel-shadow);
          color: #F5F5F5;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color .25s ease, border-color .25s ease,
                      transform .25s cubic-bezier(.23,1,.32,1);
        }
        .cf-nav svg { width: 17px; height: 17px; }
        .cf-nav:hover {
          background: var(--btn-steel-hover);
          border-color: var(--btn-steel-border-hover);
          color: #ffffff;
        }
        .cf-nav:active { transform: scale(0.94); }
        .cf-prev { left: clamp(10px, 4vw, 56px); }
        .cf-next { right: clamp(10px, 4vw, 56px); }
        .cf-prev:hover { transform: translateX(-2px); }
        .cf-next:hover { transform: translateX(2px); }

        /* ── Dots ── */
        .cf-dots {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: clamp(22px, 3vh, 34px);
        }
        .cf-dot {
          height: 7px;
          width: 7px;
          padding: 0;
          border: none;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.22);
          cursor: pointer;
          transition: width .35s cubic-bezier(.23,1,.32,1),
                      background-color .3s ease;
        }
        .cf-dot[aria-current="true"] {
          width: 26px;
          background: #ED5C1B;
        }
        .cf-dot:hover { background: rgba(255, 255, 255, 0.42); }
        .cf-dot[aria-current="true"]:hover { background: #ED5C1B; }

        /* ── Section CTA (funnel: every section ends at the form) ── */
        .pw-hint {
          display: none;
          font-family: var(--font-sans);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          text-align: center;
          margin: 18px 0 0;
        }
        .pw-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--btn-gap);
          min-height: var(--btn-h);
          margin-top: clamp(26px, 3.5vh, 40px);
          padding: 0 var(--btn-px);
          border: none;
          border-radius: 9999px;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--btn-font);
          cursor: pointer;
          transition: filter 220ms cubic-bezier(.23,1,.32,1),
                      box-shadow 220ms cubic-bezier(.23,1,.32,1),
                      transform 160ms cubic-bezier(.23,1,.32,1);
        }
        .pw-cta:hover {
          filter: brightness(var(--btn-gloss-brightness, 1.06));
          box-shadow: var(--btn-gloss-shadow-hover);
          transform: translateY(-1px);
        }
        .pw-cta:active { transform: scale(0.98); }
        .pw-cta svg { width: 15px; height: 15px; }
        .cf-cta-row { text-align: center; }

        @media (max-width: 767px) {
          .work-title { max-width: 100%; }
          /* The arrows would sit on top of the flanking cards on a 390px
             screen. Touch has the swipe and the dots; the arrows are a
             pointer-device affordance. */
          .cf-nav { display: none; }
          .cf-meta { padding: 14px 2px 0; }
          .pw-cat { font-size: 12px; margin-bottom: 8px; }
          .bf-domain { font-size: 12px; }
          .pw-name { font-size: 1.25rem; -webkit-text-stroke-width: 1px; }
          .pw-hint { display: block; }
          .pw-cta { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-card, .cf-meta, .bf-img, .pw-link-icon, .cf-nav, .cf-dot {
            transition: none;
          }
          .cf-shot:hover .bf-img,
          .cf-nav:hover,
          .pw-cta:hover { transform: none; }
        }
      `}</style>

      <div className="work-inner">
        <Reveal>
          <h2 className="work-title">{t("work.section_title")}</h2>
        </Reveal>
      </div>

      {/* blur={0}: the stage runs nine cards through a 3D transform on every
          index change. A live filter on the wrapper would force the browser to
          re-rasterise all of it each frame, and it would create a containing
          block the perspective should never have to reason about. */}
      <Reveal delay={90} blur={0}>
        <div
          className="cf-stage"
          role="region"
          aria-roledescription="carousel"
          aria-label={t("portfolio.title")}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {PROJECTS.map((p, i) => {
            // Shortest signed distance, so wrapping from the last card to the
            // first animates forward instead of rewinding through the deck.
            let d = i - index;
            if (d > total / 2) d -= total;
            if (d < -total / 2) d += total;

            const depth = ladder[Math.min(Math.abs(d), ladder.length - 1)];
            const beyond = Math.abs(d) >= ladder.length;
            const dir = Math.sign(d);
            const isCentre = d === 0;

            return (
              <div
                key={p.slug}
                className="cf-card"
                data-side={!isCentre}
                aria-hidden={isCentre ? undefined : true}
                onClick={isCentre ? undefined : () => goTo(i)}
                style={{
                  transform: `translateX(${dir * depth.x}%) scale(${depth.scale}) rotateY(${-dir * depth.rotate}deg)`,
                  opacity: beyond ? 0 : depth.opacity,
                  zIndex: beyond ? 0 : depth.z,
                  pointerEvents: beyond || depth.opacity === 0 ? "none" : undefined,
                }}
              >
                <a
                  className="cf-shot"
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isCentre ? undefined : -1}
                  aria-label={`${p.name} — ${t("work.visit")}`}
                >
                  <BrowserFrame src={p.img} alt={p.name} domain={p.domain} eager={i < 2} />
                </a>
                <div className="cf-meta">
                  <span className="pw-cat">{t(`portfolio.categories.${p.slug}`)}</span>
                  <div className="pw-meta-row">
                    <h3 className="pw-name">{p.name}</h3>
                    <a
                      className="pw-link"
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isCentre ? undefined : -1}
                      aria-label={`${p.name} — ${t("work.visit")}`}
                    >
                      <span className="pw-link-label">{t("work.visit")}</span>
                      <span className="pw-link-icon">{ArrowUpRight}</span>
                    </a>
                  </div>
                  {/* The outcome, not the craft. */}
                  <p className="pw-metric">{t(`portfolio.metrics.${p.slug}`)}</p>
                </div>
              </div>
            );
          })}

          <button type="button" className="cf-nav cf-prev" onClick={() => go(-1)} aria-label={t("work.prev")}>
            {ChevronLeft}
          </button>
          <button type="button" className="cf-nav cf-next" onClick={() => go(1)} aria-label={t("work.next")}>
            {ChevronRight}
          </button>
        </div>
      </Reveal>

      <div className="cf-dots">
        {PROJECTS.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            className="cf-dot"
            aria-current={i === index}
            aria-label={p.name}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className="work-inner cf-cta-row">
        {isMobile && <p className="pw-hint">{t("work.swipe_hint")}</p>}
        <ContactCTA>
          <button type="button" className="pw-cta">
            {t("nav.cta")}
            {ArrowUpRight}
          </button>
        </ContactCTA>
      </div>
    </section>
  );
};

export default SelectedWorkSection;
