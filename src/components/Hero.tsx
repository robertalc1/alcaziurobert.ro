"use client";

import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";
import ShaderBackground from "@/components/ShaderBackground";

// The client logo band sits INSIDE the hero panel (instantly.ai puts its own
// logo wall there too), but it is twelve images and the hero is the LCP
// screen, so it stays in its own chunk behind a height-reserving fallback.
const ClientMarqueeSection = lazy(() => import("@/components/ClientMarqueeSection"));

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

const Hero = () => {
  const { t } = useTranslation();

  // Signal the boot loader (in index.html) that the real above-the-fold
  // content is mounted and painted — not just that App.tsx committed an
  // empty Suspense fallback. Two RAFs guarantee this fires after Hero's
  // own first paint, so the loader-to-page transition never reveals a
  // blank frame while Hero is still loading/rendering.
  React.useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        window.dispatchEvent(new Event("app-ready"));
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <style>{`
        /* ── Hero panel ──
           The page is light; the hero is a dark rounded object sitting on it.
           That inversion is the whole move — it is what instantly.ai does with
           its blue panel, and it is why the orange shader still reads as
           premium on a white page instead of as a loud banner. */
        .hero {
          position: relative;
          width: 100%;
          background: var(--page);
          /* Clears both pieces of fixed chrome above it. Neither number is
             written here: the announcement bar publishes --bar-h (0px when
             dismissed) and the navbar is --nav-h, so closing the bar pulls the
             hero up with it and nothing needs to be told twice. */
          padding: calc(var(--bar-h) + var(--nav-h) + var(--panel-gutter)) 0 0;
        }
        .hero-panel {
          position: relative;
          isolation: isolate;
          width: calc(100vw - var(--panel-gutter) * 2);
          max-width: var(--w-panel);
          margin-inline: auto;
          border-radius: var(--r-panel);
          /* Load-bearing: this is what clips the WebGL canvas to the radius. */
          overflow: hidden;
          /* The shader's own first colour stop, so a panel whose WebGL never
             starts is still the right colour rather than black. */
          background: var(--panel-ink);
          box-shadow: var(--shadow-panel);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
          /* No mask. The old hero faded the shader out at the bottom because it
             had to dissolve into an opaque dark section; the panel has a hard
             rounded edge of its own now, so a fade would just look like the
             effect running out of steam before the border. */
        }
        /* Darkens the field under the copy without touching the shader's own
           brightness. The h1 is white and the field's hot mid stop is #4580F7;
           without this the two fight in the middle of the panel. */
        .hero-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(4, 14, 34, 0.34) 0%, rgba(4, 14, 34, 0.10) 34%, rgba(4, 14, 34, 0) 58%),
            radial-gradient(90% 52% at 50% 30%, rgba(4, 14, 34, 0.30) 0%, rgba(4, 14, 34, 0) 72%);
        }
        /* instantly's hero, measured:
             padding-global              72px side gutters
               padding-section_home_hero 96px top AND bottom
                 container-small         768  <- the claim and the form
                 ab-test_logo-section    1123 <- the used-by band, 96px below

           The text column is 768, NOT the 1040 the body uses. That narrower
           measure is the whole reason their hero reads as a statement rather
           than as a page header: at 1040 a two-line headline spreads wide
           enough that the eye tracks it left-to-right instead of taking it in
           at once. The used-by band deliberately runs wider than the column
           it sits under. */
        .hero-stage {
          position: relative;
          z-index: 1;
          max-width: var(--w-page);
          margin: 0 auto;
          padding: var(--sp-96) var(--page-gutter);
        }
        .hero-inner {
          max-width: 768px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* ── Copy ── */
        /* One heading scale for the whole page. instantly's h1 is 40/600 —
           the same size as every h2 under it — at -1.5px of tracking rather
           than the h2's -2px. The hero headline used to climb to 64px, which
           made it the only type on the page with no sibling anywhere else and
           left a three-step gap down to the first section heading. */
        .hero-title {
          font-family: var(--font-sans);
          font-size: var(--text-section-title);
          font-weight: var(--text-heading-weight);
          letter-spacing: -0.0375em;   /* -1.5px at 40px, theirs exactly */
          line-height: var(--text-heading-lh);
          color: #FFFFFF;
          margin: 0 0 var(--sp-12);    /* spacer-xxsmall is-0-75rem */
          max-width: 22ch;
          text-wrap: balance;
        }
        .hero-accent {
          color: #C7D9FF;
          font-style: italic;
        }
        /* Semibold, not regular: instantly's hero standfirst is 16/600 while
           every other paragraph on their page is 16/400. It is the one line
           that has to survive being read over a moving field. */
        .hero-sub {
          font-family: var(--font-sans);
          font-size: var(--text-body);
          font-weight: 600;
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: #FFFFFF;
          max-width: 48ch;
          margin: 0 0 var(--sp-32);    /* spacer-medium */
          text-wrap: balance;
        }

        /* ── Trust strip ── */
        .hero-trust {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 8px 22px;
          margin: clamp(22px, 3vh, 30px) 0 0;
          padding: 0;
        }
        .hero-trust li {
          position: relative;
          font-family: var(--font-sans);
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.82);
          padding-left: 18px;
        }
        /* Tick drawn in CSS rather than an icon: three of them would otherwise
           pull an icon set into the eager hero chunk. White, not orange — the
           field behind is already orange, so an orange tick disappears. */
        .hero-trust li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.42em;
          width: 9px;
          height: 5px;
          border-left: 1.6px solid #FFFFFF;
          border-bottom: 1.6px solid #FFFFFF;
          transform: rotate(-45deg);
        }

        /* ── Client band inside the panel ── */
        /* 96px under the form block, and wider than the 768 column above it —
           it is a sibling of .hero-inner inside .hero-stage, not a child, so
           the marks run the full 1123 the way theirs do. */
        .hero-clients {
          margin-top: var(--sp-96);
        }
        .hero-clients-ph {
          min-height: 132px;
        }

        /* ── Load-in stagger ── */
        @keyframes hero-fade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        .hero-reveal-1 { animation: hero-fade 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.06s both; }
        .hero-reveal-2 { animation: hero-fade 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.16s both; }

        @media (max-width: 767px) {
          .hero { padding-top: calc(var(--bar-h) + var(--nav-h) + var(--panel-gutter)); }
          .hero-panel { border-radius: 18px; }
          .hero-stage { padding: var(--sp-64) var(--sp-24); }
          .hero-clients { margin-top: var(--sp-48); }
          .hero-title { max-width: 18ch; }
          .hero-cta { width: 100%; justify-content: center; }
          .hero-trust { gap: 6px 16px; margin-top: 20px; }
          .hero-trust li { font-size: 12.5px; }
        }
        /* Shortest phones: PRODUCT.md requires the message to land above the
           fold, and on a 360x640 screen a three-item trust strip pushes the
           CTA under it. The guarantee is the one worth keeping, so the other
           two step aside here and return in the offer section a screen later. */
        @media (max-width: 380px), (max-height: 680px) {
          .hero-trust li:nth-child(1),
          .hero-trust li:nth-child(2) { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-reveal-1, .hero-reveal-2 { animation: none; }
        }
      `}</style>

      <div className="hero-panel">
        <ShaderBackground className="hero-bg" />
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-stage">
        <div className="hero-inner">
          {/* No entrance animation on the h1: it's the LCP element, and Chrome
              discounts elements that start at opacity:0 when timing LCP —
              it must be visible immediately, not faded/blurred in. */}
          <h1 className="hero-title">
            {t("hero_v3.headline_pre")}
            <br />
            <span className="hero-accent">{t("hero_v3.headline_accent")}</span>
          </h1>

          <p className="hero-sub hero-reveal-1">{t("hero_v3.subtitle")}</p>

          {/* One button, every width. The hero carried the full form on
              desktop until now; it makes the ask here and the form itself
              lives in the closing panel, where the visitor arrives having read
              the argument. modal, not "auto": the form is at the very bottom
              of a long page, and scrolling someone the whole way down is worse
              than opening it where they are. */}
          <ContactCTA mode="modal">
            <button type="button" className="btn btn-primary hero-cta hero-reveal-2">
              {t("whatwedo.cta_primary")}
              {ArrowUpRight}
            </button>
          </ContactCTA>

          {/* Three things a visitor wants to know before they will type their
              phone number. The third is dropped on the shortest screens — see
              the 380px rule — because the CTA staying above the fold on a
              360x640 phone outranks it. */}
          <ul className="hero-trust hero-reveal-2">
            <li>{t("hero_v3.trust_1")}</li>
            <li>{t("hero_v3.trust_2")}</li>
            <li>{t("hero_v3.trust_3")}</li>
          </ul>
        </div>

        {/* Credibility inside the same frame as the claim: the headline makes
            a promise, the twelve client marks under it pay for it without the
            visitor having to scroll to a second section for the answer. */}
        <div className="hero-clients">
          <Suspense fallback={<div className="hero-clients-ph" aria-hidden="true" />}>
            <ClientMarqueeSection />
          </Suspense>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
