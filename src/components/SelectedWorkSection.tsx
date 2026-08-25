"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
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
    if (!el || isMobile) return;
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
        <h3 className="pw-name">{p.name}</h3>
        <a
          className="pw-link"
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={copy === 1 ? -1 : undefined}
        >
          {t("work.visit")}
          <span className="pw-link-icon">{ArrowUpRight}</span>
        </a>
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
          align-items: center;
          gap: clamp(24px, 3vw, 48px);
          flex-shrink: 0;
        }
        .pw-shot {
          display: block;
          width: clamp(420px, 44vw, 620px);
          text-decoration: none;
          transition: transform .45s cubic-bezier(.23,1,.32,1);
        }
        .pw-shot:hover { transform: translateY(-6px); }

        .pw-meta {
          width: clamp(230px, 20vw, 300px);
          flex-shrink: 0;
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
        .pw-name {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(1.6rem, 2.5vw, 2.35rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #F5F5F5;
          margin: 0 0 20px;
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
          color: #F5F5F5;
          font-family: var(--font-sans);
          font-size: 14.5px;
          font-weight: 500;
          text-decoration: none;
          transition: color .25s ease;
        }
        .pw-link-icon {
          width: 30px; height: 30px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color .25s ease, border-color .25s ease, transform .25s cubic-bezier(.23,1,.32,1);
        }
        .pw-link-icon svg { width: 12px; height: 12px; }
        .pw-link:hover { color: #ED5C1B; }
        .pw-link:hover .pw-link-icon {
          background: #ED5C1B;
          border-color: #ED5C1B;
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

        /* ── Mobile: wordmark grid instead of the carousel ── */
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

        @media (max-width: 640px) {
          .work-title { max-width: 100%; }
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

      {isMobile ? (
        <div className="work-inner">
          <ul className="pw-marks">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <a
                  className="pw-mark"
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
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
            {PROJECTS.map((p, i) => renderItem(p, i, 1))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SelectedWorkSection;
