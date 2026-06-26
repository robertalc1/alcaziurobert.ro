"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LiquidMesh from "@/components/LiquidMesh";
import ContactCTA from "@/components/ContactCTA";

// Renders text with <i>word</i> markers as <em className="hero-italic"> spans,
// so specific words in the headline appear italic while the rest stays upright.
const renderItalic = (text: string): React.ReactNode[] => {
  const parts = text.split(/<i>(.*?)<\/i>/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="hero-italic">{part}</em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
};

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onMql = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener?.("change", onMql);
    return () => {
      window.removeEventListener("resize", checkMobile);
      mql.removeEventListener?.("change", onMql);
    };
  }, []);

  return (
    <section className="hero-section" id="hero">
      <div className="hero-shell">
        <div className="hero-card" ref={cardRef}>
          {isMobile || reducedMotion ? (
            <div className="hero-mesh hero-mesh-static" aria-hidden="true" />
          ) : (
            <LiquidMesh className="hero-mesh" containerRef={cardRef} />
          )}

      <style>{`
        :root { --orange: #ED5C1B; }

        /* ===== Hero shell + rounded card layout ===== */
        .hero-section {
          position: relative;
          width: 100%;
          background: #ffffff;
        }
        .hero-shell {
          position: relative;
          padding: clamp(64px, 7.5vh, 96px) clamp(10px, 1.4vw, 18px) clamp(10px, 1.4vw, 18px);
        }

        /* ===== CTA bay — white "notch" carved into orange card bottom ===== */
        .hero-cta-bay {
          position: absolute;
          bottom: clamp(12px, 1.6vw, 20px);
          left: 50%;
          transform: translate(-50%, 15%);
          z-index: 10;
          background: #ffffff;
          padding: clamp(12px, 1.6vw, 16px) clamp(14px, 2vw, 22px);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: clamp(10px, 1.4vw, 18px);
          box-shadow: 0 -8px 28px -8px rgba(0, 0, 0, 0.08);
        }
        /* === Pill button — orange + white + ripple-expand hover === */
        .hero-bay-primary {
          position: relative;
          isolation: isolate;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 26px;
          background: #ED5C1B;
          color: #ffffff;
          border-radius: 9999px;
          overflow: hidden;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 14.5px;
          letter-spacing: -0.005em;
          text-transform: none;
          white-space: nowrap;
        }
        /* The ripple: darker orange circle that expands from center on hover */
        .hero-bay-primary-circle {
          position: absolute;
          width: 0;
          height: 0;
          background: #C44E17;
          border-radius: 9999px;
          transition: width 500ms cubic-bezier(0, 0, 0.2, 1),
                      height 500ms cubic-bezier(0, 0, 0.2, 1);
          z-index: 0;
          pointer-events: none;
        }
        .hero-bay-primary:hover .hero-bay-primary-circle {
          width: 224px;
          height: 224px;
        }
        /* Text stays above the ripple */
        .hero-bay-primary-text {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .hero-bay-primary-text svg { display: block; }
        .hero-bay-secondary {
          color: #262626;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 14.5px;
          letter-spacing: -0.005em;
          text-transform: none;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1.5px;
          padding: 0 6px;
          transition: color 220ms cubic-bezier(0.23, 1, 0.32, 1);
          white-space: nowrap;
        }
        .hero-bay-secondary:hover {
          color: #ED5C1B;
        }
        @media (max-width: 640px) {
          .hero-cta-bay {
            transform: translate(-50%, 10%);
            padding: 10px 14px;
            gap: 10px;
          }
          .hero-bay-primary { padding: 9px 24px; font-size: 13.5px; font-weight: 500; }
          .hero-bay-secondary { font-size: 13.5px; }
        }
        .hero-card {
          position: relative;
          width: 100%;
          min-height: min(82vh, 740px);
          border-radius: clamp(22px, 2.7vw, 48px);
          overflow: hidden;
          isolation: isolate;
        }
        .hero-mesh {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          z-index: 0;
        }
        .hero-mesh-static {
          background:
            radial-gradient(at 30% 20%, #FF8A3D 0%, transparent 55%),
            radial-gradient(at 80% 80%, #F0A172 0%, transparent 50%),
            radial-gradient(at 50% 50%, #DC5418 0%, transparent 60%),
            #ED5C1B;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: inherit;
          padding: clamp(56px, 7vh, 88px) clamp(14px, 2.5vw, 18px) clamp(40px, 5vh, 68px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 640px) {
          .hero-card { min-height: min(86vh, 720px); }
          .hero-content { padding: 80px 16px 40px; }
        }

        /* ===== Headline + subtitle + CTA ===== */
        .hero-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.025em;
          font-size: clamp(1.95rem, 4.95vw, 3.55rem);
          line-height: 1.08;
          color: #ffffff;
          max-width: 22ch;
          margin: 24px auto 12px;
          text-wrap: balance;
        }
        .hero-italic {
          font-style: italic;
        }
        .hero-sub {
          font-family: var(--font-sans);
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          line-height: 1.55;
          color: #5b6470;
          max-width: 54ch;
          margin: 0 auto clamp(20px, 2.4vh, 28px);
        }
        .hero-scarcity {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans);
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(38, 38, 38, 0.7);
          letter-spacing: 0.01em;
          margin-bottom: clamp(20px, 2.6vh, 28px);
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(237, 92, 27, 0.18);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .hero-scarcity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--orange, #ED5C1B);
          box-shadow: 0 0 0 0 rgba(237, 92, 27, 0.5);
          animation: scarcity-pulse 2s ease-out infinite;
          flex-shrink: 0;
        }
        @keyframes scarcity-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(237, 92, 27, 0.55); }
          70%  { box-shadow: 0 0 0 10px rgba(237, 92, 27, 0); }
          100% { box-shadow: 0 0 0 0 rgba(237, 92, 27, 0); }
        }
        .hero-cta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }
        .hero-cta .btn svg {
          width: 15px;
          height: 15px;
          transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hero-cta .btn:hover svg { transform: translateX(2px); }

        @media (max-width: 640px) {
          .hero-title { margin-top: 22px; }
          .hero-scarcity { font-size: 11.5px; padding: 5px 12px; }
          .hero-cta { flex-direction: column; align-items: stretch; width: 100%; max-width: 320px; }
          .hero-cta .btn { width: 100%; justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-scarcity-dot { animation: none; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }

        @keyframes smoothScroll {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%      { transform: translateY(12px); opacity: 0.3; }
        }
        .scroll-indicator { animation: smoothScroll 2s ease-in-out infinite; }

        .hero-subtitle {
          color: #FFFFFF !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
      `}</style>

          <div className="hero-content">
            <div
              className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10"
              ref={containerRef}
            >
        <div className="flex flex-col items-center text-center">
          {/* Headline with italic accent word */}
          <h1 className="hero-title">
            {renderItalic(t("hero_v2.headline_pre"))}{" "}
            {renderItalic(t("hero_v2.headline_accent"))}
            {t("hero_v2.headline_post") ? ` ${t("hero_v2.headline_post")}` : null}
          </h1>

            </div>
          </div>
        </div>
      </div>

      <div className="hero-cta-bay">
        <ContactCTA>
          <button type="button" className="hero-bay-primary">
            <span className="hero-bay-primary-circle" aria-hidden="true" />
            <span className="hero-bay-primary-text">
              {t("whatwedo.cta_primary")}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ width: 14, height: 14 }}
              >
                <path d="M5 19L19 5" />
                <path d="M9 5h10v10" />
              </svg>
            </span>
          </button>
        </ContactCTA>
        <Link to="/studii-de-caz" className="hero-bay-secondary">
          {t("whatwedo.cta_secondary")}
        </Link>
      </div>
      </div>
    </section>
  );
};

export default Hero;
