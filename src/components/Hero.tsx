"use client";

import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";
import { useMediaQuery } from "@/hooks/use-media-query";
import { scrollToId } from "@/lib/scroll";
import ShaderBackground from "@/components/ShaderBackground";

// Lazy: keeps react-hook-form/zod out of the critical bundle; never fetched
// below 1024px because the component simply isn't mounted there.
const HeroContactCard = lazy(() => import("@/components/HeroContactCard"));

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
  const isLg = useMediaQuery("(min-width: 1024px)");
  const shellRef = React.useRef<HTMLDivElement>(null);

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

  // Desktop primary CTA drives the adjacent form: focus the name input and
  // pulse the card so the visitor's eye lands exactly where the action is.
  const focusHeroForm = () => {
    const input = document.querySelector<HTMLInputElement>(
      '#hero-form input[name="name"]'
    );
    if (input) {
      input.focus();
      const shell = shellRef.current;
      if (shell) {
        shell.classList.remove("is-attn");
        void shell.offsetWidth; // restart the one-shot animation
        shell.classList.add("is-attn");
      }
    } else {
      scrollToId("contact");
    }
  };

  const handleSeeWork = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId("work");
  };

  return (
    <section className="hero3" id="hero">
      <style>{`
        .hero3 {
          position: relative;
          width: 100%;
          background: #0F0F0F;
          overflow: hidden;
        }
        .hero3-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
          /* No z-index needed: .hero3-inner already sits at 1, so the canvas
             stays behind it without adding another stacking context.

             The mask answers the seam complaint. The section below is opaque
             #0F0F0F, so fading the shader out before the bottom edge turns
             the boundary into a gradient instead of a cut. The top edge stays
             at full strength, so the field starts right under the navbar. */
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 52%, transparent 94%);
                  mask-image: linear-gradient(to bottom, #000 0%, #000 52%, transparent 94%);
        }
        .hero3-inner {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: clamp(118px, 16vh, 168px) clamp(18px, 3vw, 32px) clamp(64px, 9vh, 108px);
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 1024px) {
          .hero3-inner {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 450px;
            gap: clamp(48px, 5vw, 88px);
            align-items: center;
            min-height: min(92vh, 880px);
            min-height: min(92svh, 880px);
          }
        }

        /* ── Copy column ── */
        .hero3-title {
          font-family: var(--font-sans);
          font-size: clamp(2.55rem, 6.2vw, 4.9rem);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1.03;
          color: #F5F5F5;
          margin: clamp(22px, 3vh, 30px) 0 clamp(18px, 2.4vh, 24px);
          max-width: 14ch;
          text-wrap: balance;
        }
        .hero3-accent {
          color: #ED5C1B;
          font-style: italic;
        }
        .hero3-sub {
          font-family: var(--font-sans);
          font-size: clamp(1.05rem, 1.35vw, 1.2rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.84);
          max-width: 46ch;
          margin: 0 0 clamp(28px, 3.6vh, 38px);
        }
        .hero3-cta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero3-primary {
          display: inline-flex;
          align-items: center;
          gap: var(--btn-gap);
          padding: 0 var(--btn-px);
          min-height: var(--btn-h);
          border-radius: 9999px;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow);
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: var(--btn-font);
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          transition: filter 260ms cubic-bezier(0.32, 0.72, 0, 1),
                      box-shadow 260ms cubic-bezier(0.32, 0.72, 0, 1),
                      transform 200ms cubic-bezier(0.32, 0.72, 0, 1);
        }
        .hero3-primary:hover {
          filter: brightness(var(--btn-gloss-brightness, 1.06));
          box-shadow: var(--btn-gloss-shadow-hover);
          transform: translateY(-1px);
        }
        .hero3-primary:active { transform: scale(0.98); }
        /* Bare arrow — no disc behind it. The pill is already the shape; a
           second circle inside it was one container too many. */
        .hero3-primary-icon {
          display: inline-flex;
          align-items: center;
          transition: transform 260ms cubic-bezier(0.32, 0.72, 0, 1);
          flex-shrink: 0;
        }
        .hero3-primary-icon svg { width: 16px; height: 16px; }
        .hero3-primary:hover .hero3-primary-icon { transform: translate(2px, -2px); }
        .hero3-secondary {
          font-family: var(--font-sans);
          font-size: 14.5px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.92);
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1.5px;
          transition: color 220ms cubic-bezier(0.23, 1, 0.32, 1);
          padding: 6px 2px;
        }
        .hero3-secondary:hover { color: #ED5C1B; }

        /* ── Form column (double-bezel shell, dark) ── */
        .hero3-card-shell {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 27px;
          padding: 7px;
          box-shadow: 0 40px 90px -48px rgba(0, 0, 0, 0.7);
        }
        .hero3-card-ph {
          min-height: 520px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
        }

        /* ── Load-in stagger ── */
        @keyframes hero3-fade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        .hero3-reveal-1 { animation: hero3-fade 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.05s both; }
        .hero3-reveal-3 { animation: hero3-fade 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.34s both; }
        .hero3-reveal-4 { animation: hero3-fade 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.38s both; }

        /* One-shot attention pulse on the form card (triggered by the CTA) */
        .hero3-card-shell.is-attn {
          animation: hero3-attn 900ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes hero3-attn {
          0% {
            box-shadow: 0 40px 90px -48px rgba(0, 0, 0, 0.7),
                        0 0 0 0 rgba(237, 92, 27, 0.55);
          }
          100% {
            box-shadow: 0 40px 90px -48px rgba(0, 0, 0, 0.7),
                        0 0 0 20px rgba(237, 92, 27, 0);
          }
        }

        @media (max-width: 640px) {
          .hero3-cta { flex-direction: column; align-items: stretch; gap: 12px; }
          /* Full width on phones, but the label and arrow stay together in the
             middle — space-between flung the bare arrow to the far edge. */
          .hero3-primary { width: 100%; justify-content: center; }
          .hero3-secondary { text-align: center; padding: 10px 2px; }
          .hero3-title { max-width: 12ch; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero3-card-shell.is-attn { animation: none; }
          .hero3-reveal-1, .hero3-reveal-3, .hero3-reveal-4 { animation: none; }
        }
      `}</style>

      <ShaderBackground className="hero3-bg" />

      <div className="hero3-inner">
        <div className="hero3-copy">

          {/* No entrance animation on the h1: it's the LCP element, and Chrome
              discounts elements that start at opacity:0 when timing LCP —
              it must be visible immediately, not faded/blurred in. */}
          <h1 className="hero3-title">
            {t("hero_v3.headline_pre")}
            <br />
            <span className="hero3-accent">{t("hero_v3.headline_accent")}</span>
          </h1>

          <p className="hero3-sub hero3-reveal-3">{t("hero_v3.subtitle")}</p>

          <div className="hero3-cta hero3-reveal-3">
            {isLg ? (
              <button type="button" className="hero3-primary" onClick={focusHeroForm}>
                {t("whatwedo.cta_primary")}
                <span className="hero3-primary-icon">{ArrowUpRight}</span>
              </button>
            ) : (
              <ContactCTA>
                <button type="button" className="hero3-primary">
                  {t("whatwedo.cta_primary")}
                  <span className="hero3-primary-icon">{ArrowUpRight}</span>
                </button>
              </ContactCTA>
            )}
            <a href="#work" className="hero3-secondary" onClick={handleSeeWork}>
              {t("hero_v3.cta_secondary")} ↓
            </a>
          </div>
        </div>

        {isLg && (
          <div ref={shellRef} className="hero3-card-shell hero3-reveal-4">
            <Suspense fallback={<div className="hero3-card-ph" aria-hidden="true" />}>
              <HeroContactCard />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
