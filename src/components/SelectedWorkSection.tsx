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

// px per second the track drifts on its own.
const AUTO_SPEED = 42;

const ArrowUpRight = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 19L19 5" />
    <path d="M9 5h10v10" />
  </svg>
);

// CSS browser chrome around a screenshot — double-bezel: dark outer tray,
// white inner core with concentric radii.
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

const SelectedWorkSection: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const viewportRef = React.useRef<HTMLDivElement>(null);
  // Auto-drift only on pointer devices; on touch the visitor swipes.
  // Auto-scroll bookkeeping: `pos` is the float position we own, `paused`
  // covers hover/drag, `selfScroll` tells our own writes apart from the
  // user's native (touch / trackpad) scrolling.
  const pos = React.useRef(0);
  const paused = React.useRef(false);
  const selfScroll = React.useRef(false);

  // Infinite drift. The track renders the project list twice, so wrapping by
  // one list's width lands on an identical frame — seamless in both directions.
  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    if (isMobile) {
      el.scrollLeft = 0;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    pos.current = el.scrollLeft;

    // Exact distance between an item and its duplicate — derived from layout,
    // so track padding and gaps can change without leaving a seam.
    let loopWidth = 0;
    const measure = () => {
      const items = el.firstElementChild?.children;
      if (!items || items.length <= PROJECTS.length) return;
      loopWidth =
        (items[PROJECTS.length] as HTMLElement).offsetLeft -
        (items[0] as HTMLElement).offsetLeft;
    };
    measure();
    window.addEventListener("resize", measure);

    const onScroll = () => {
      // A scroll we did not cause (drag, wheel, swipe) becomes the new truth.
      if (selfScroll.current) selfScroll.current = false;
      else pos.current = el.scrollLeft;
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!loopWidth) measure();
      if (loopWidth > 0) {
        if (!paused.current) pos.current += AUTO_SPEED * dt;
        if (pos.current >= loopWidth) pos.current -= loopWidth;
        else if (pos.current < 0) pos.current += loopWidth;
        selfScroll.current = true;
        el.scrollLeft = pos.current;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      el.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);

  // Mouse drag-to-scroll. Touch keeps native momentum scrolling.
  const drag = React.useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    paused.current = true;
    if (e.pointerType !== "mouse") return;
    const el = viewportRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = viewportRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    selfScroll.current = true;
    el.scrollLeft = drag.current.startScroll - dx;
    pos.current = el.scrollLeft;
  };

  const endDrag = (e: React.PointerEvent) => {
    const el = viewportRef.current;
    paused.current = false;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  // A drag that moved must not open the project it ended on.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const renderItem = (p: Project, i: number, copy: number) => (
    <div className="pw-item" key={`${copy}-${p.slug}`} aria-hidden={copy === 1 ? true : undefined}>
      <a
        className="pw-shot"
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={copy === 1 ? -1 : undefined}
        aria-label={`${p.name} — ${t("work.visit")}`}
      >
        <BrowserFrame src={p.img} alt={p.name} domain={p.domain} eager={copy === 0 && i < 2} />
      </a>
      <div className="pw-meta">
        <span className="pw-cat">{t(`portfolio.categories.${p.slug}`)}</span>
        <div className="pw-meta-row">
          <h3 className="pw-name">{p.name}</h3>
          <a
            className="pw-link"
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={copy === 1 ? -1 : undefined}
            aria-label={`${p.name} — ${t("work.visit")}`}
          >
            <span className="pw-link-label">{t("work.visit")}</span>
            <span className="pw-link-icon">{ArrowUpRight}</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section className="work-section" id="work" aria-label={t("portfolio.title")}>
      <style>{`
        .work-section {
          width: 100%;
          background: #0F0F0F;
          padding: clamp(64px, 9vh, 112px) 0;
          overflow: hidden;
        }
        .work-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 clamp(18px, 3vw, 32px);
        }

        /* Same spec as every other section title (see .comp-title) */
        .work-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #F5F5F5;
          margin: 0 auto clamp(36px, 5vh, 60px);
          max-width: 22ch;
          text-align: center;
          text-wrap: balance;
        }

        /* ── Carousel ── */
        .pw-viewport {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          /* Edges fade into the page so the loop has no visible seam */
          -webkit-mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
        }
        .pw-viewport::-webkit-scrollbar { display: none; }
        .pw-viewport:active { cursor: grabbing; }

        .pw-track {
          display: flex;
          align-items: center;
          width: max-content;
          gap: clamp(40px, 5vw, 80px);
          padding: 6px clamp(18px, 3vw, 32px);
        }

        .pw-item {
          display: flex;
          flex-direction: column;
          width: clamp(300px, 32vw, 460px);
          flex-shrink: 0;
          padding: 10px 10px 18px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          transition: border-color .35s ease, background-color .35s ease,
                      transform .45s cubic-bezier(.23,1,.32,1);
        }
        .pw-item:hover {
          border-color: rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-4px);
        }
        .pw-shot {
          display: block;
          width: 100%;
          text-decoration: none;
        }

        .pw-meta {
          display: flex;
          flex-direction: column;
          padding: 18px 10px 0;
        }
        .pw-cat {
          display: inline-block;
          color: #ED5C1B;
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .pw-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
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
          transition: border-color .25s ease, transform .25s cubic-bezier(.23,1,.32,1);
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
        .bf-dot {
          width: 8px; height: 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.22);
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
        .pw-shot:hover .bf-img { transform: scale(1.03); }

        /* ── Mobile: swipe hint + section CTA (funnel: most traffic is phones) ── */
        .pw-hint {
          display: none;
          font-family: var(--font-sans);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          text-align: center;
          margin: 18px 0 0;
        }
        .pw-cta {
          display: none;
          align-items: center;
          justify-content: center;
          gap: var(--btn-gap);
          width: 100%;
          min-height: var(--btn-h);
          margin-top: 18px;
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
        @media (max-width: 767px) {
          .pw-cta { display: inline-flex; }
        }

        /* ── Legacy wordmark grid (unused since the cards work on phones too) ── */
        .pw-marks {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid rgba(255, 255, 255, 0.10);
          border-left: 1px solid rgba(255, 255, 255, 0.10);
        }
        .pw-marks li {
          border-right: 1px solid rgba(255, 255, 255, 0.10);
          border-bottom: 1px solid rgba(255, 255, 255, 0.10);
        }
        /* Odd project count: the last one fills the row instead of leaving a hole */
        .pw-marks li:last-child:nth-child(odd) { grid-column: 1 / -1; }
        .pw-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 104px;
          padding: 18px 12px;
          text-align: center;
          text-decoration: none;
          color: #F5F5F5;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(15px, 4.4vw, 19px);
          letter-spacing: -0.02em;
          line-height: 1.2;
          text-wrap: balance;
          transition: color .25s ease, background-color .25s ease;
        }
        .pw-mark:active { background: rgba(255, 255, 255, 0.04); color: #ED5C1B; }

        @media (max-width: 767px) {
          .work-title { max-width: 100%; }
          .pw-viewport {
            scroll-snap-type: x mandatory;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .pw-track { gap: 14px; padding: 6px 16px; }
          .pw-item {
            width: min(84vw, 340px);
            scroll-snap-align: center;
            padding: 8px 8px 14px;
          }
          .pw-meta { padding: 14px 6px 0; }
          .pw-cat { font-size: 12px; margin-bottom: 8px; }
          .bf-domain { font-size: 12px; }
          .pw-name { font-size: 1.25rem; -webkit-text-stroke-width: 1px; }
          .pw-hint { display: block; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pw-shot, .bf-img, .pw-link-icon { transition: none; }
          .pw-shot:hover { transform: none; }
          .pw-shot:hover .bf-img { transform: none; }
        }
      `}</style>

      <div className="work-inner">
        <Reveal>
          <h2 className="work-title">{t("work.section_title")}</h2>
        </Reveal>
      </div>

      {/* Same cards everywhere. On desktop the track drifts on its own and can be
          dragged; on touch it is a snap carousel the visitor swipes — the list is
          rendered once there, since there is no auto-loop to feed. */}
      <div
        className="pw-viewport"
        ref={viewportRef}
        role="region"
        aria-label={t("portfolio.title")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocusCapture={() => (paused.current = true)}
        onBlurCapture={() => (paused.current = false)}
      >
        <div className="pw-track">
          {PROJECTS.map((p, i) => renderItem(p, i, 0))}
          {!isMobile && PROJECTS.map((p, i) => renderItem(p, i, 1))}
        </div>
      </div>

      {isMobile && (
        <div className="work-inner">
          <p className="pw-hint">{t("work.swipe_hint")}</p>
          <ContactCTA>
            <button type="button" className="pw-cta">
              {t("nav.cta")}
              {ArrowUpRight}
            </button>
          </ContactCTA>
        </div>
      )}
    </section>
  );
};

export default SelectedWorkSection;
