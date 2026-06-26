"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  CloudflareLogo,
  ReactLogo,
  NodeLogo,
  TypeScriptLogo,
  VercelLogo,
} from "@/components/ui/tech-logos";

const TechStackSection: React.FC = () => {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = rootRef.current?.querySelectorAll<HTMLElement>(".ts-reveal");
    if (!els) return;
    if (reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="tech-stack-section" aria-labelledby="tech-stack-title">
      <style>{`
        .tech-stack-section {
          width: 100%;
          background: #fff;
          padding: clamp(56px, 9vh, 112px) 20px clamp(80px, 12vh, 140px);
        }
        .ts-inner {
          max-width: 1180px;
          margin: 0 auto;
          text-align: center;
        }

        .ts-title {
          font-family: var(--font-sans), 'General Sans', system-ui, sans-serif;
          font-weight: 500;
          letter-spacing: -0.028em;
          line-height: 1.1;
          font-size: clamp(1.85rem, 4.5vw, 3rem);
          color: var(--ink, #262626);
          margin: 0 auto 18px;
          max-width: 22ch;
        }
        .ts-subtitle {
          font-family: var(--font-sans), 'General Sans', system-ui, sans-serif;
          font-weight: 400;
          font-size: clamp(0.98rem, 1.15vw, 1.1rem);
          color: #8b95a3;
          margin: 0 auto;
          max-width: 48ch;
          line-height: 1.55;
        }

        .ts-arc {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: clamp(8px, 1.4vw, 18px);
          margin-top: clamp(40px, 6vh, 72px);
          padding-bottom: 60px;
        }

        .ts-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid rgba(38, 38, 38, 0.08);
          box-shadow: 0 6px 22px -10px rgba(38, 38, 38, 0.16),
                      0 1px 3px rgba(38, 38, 38, 0.04);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }
        .ts-circle svg {
          width: 30px;
          height: 30px;
          display: block;
        }

        .ts-circle--lg {
          width: 80px;
          height: 80px;
          box-shadow: 0 10px 32px -10px rgba(237, 92, 27, 0.28),
                      0 2px 6px rgba(38, 38, 38, 0.06);
        }
        .ts-circle--lg svg { width: 38px; height: 38px; }

        .ts-circle--empty {
          background: rgba(255, 255, 255, 0.7);
          border-color: rgba(38, 38, 38, 0.06);
          box-shadow: 0 4px 14px -8px rgba(38, 38, 38, 0.06);
        }

        /* CONVEX ARC: center highest, edges lowest */
        .ts-circle:nth-child(1)  { transform: translateY(56px); }
        .ts-circle:nth-child(2)  { transform: translateY(32px); }
        .ts-circle:nth-child(3)  { transform: translateY(12px); }
        .ts-circle:nth-child(4)  { transform: translateY(-4px); }
        .ts-circle:nth-child(5)  { transform: translateY(-18px); }
        .ts-circle:nth-child(6)  { transform: translateY(-4px); }
        .ts-circle:nth-child(7)  { transform: translateY(12px); }
        .ts-circle:nth-child(8)  { transform: translateY(32px); }
        .ts-circle:nth-child(9)  { transform: translateY(56px); }

        @media (max-width: 640px) {
          .tech-stack-section { padding: 56px 16px 80px; }
          .ts-arc { gap: 6px; padding-bottom: 40px; }
          .ts-circle { width: 48px; height: 48px; }
          .ts-circle svg { width: 22px; height: 22px; }
          .ts-circle--lg { width: 60px; height: 60px; }
          .ts-circle--lg svg { width: 28px; height: 28px; }

          .ts-circle:nth-child(1), .ts-circle:nth-child(9) { transform: translateY(36px); }
          .ts-circle:nth-child(2), .ts-circle:nth-child(8) { transform: translateY(20px); }
          .ts-circle:nth-child(3), .ts-circle:nth-child(7) { transform: translateY(8px); }
          .ts-circle:nth-child(4), .ts-circle:nth-child(6) { transform: translateY(-2px); }
          .ts-circle:nth-child(5) { transform: translateY(-12px); }
        }

        /* Reveal */
        .ts-reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 720ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 720ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .ts-reveal.is-in { opacity: 1; transform: translateY(0); }
        .ts-reveal--delay-1 { transition-delay: 90ms; }
        .ts-reveal--delay-2 { transition-delay: 180ms; }

        @media (prefers-reduced-motion: reduce) {
          .ts-reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div ref={rootRef} className="ts-inner">
        <h2 id="tech-stack-title" className="ts-title ts-reveal">
          {t("tech_stack.title")}
        </h2>
        <p className="ts-subtitle ts-reveal ts-reveal--delay-1">
          {t("tech_stack.subtitle")}
        </p>

        <div className="ts-arc ts-reveal ts-reveal--delay-2" aria-hidden="true">
          <div className="ts-circle ts-circle--empty" />
          <div className="ts-circle ts-circle--empty" />
          <div className="ts-circle">
            <ReactLogo />
          </div>
          <div className="ts-circle">
            <NodeLogo />
          </div>
          <div className="ts-circle ts-circle--lg">
            <CloudflareLogo />
          </div>
          <div className="ts-circle">
            <TypeScriptLogo />
          </div>
          <div className="ts-circle">
            <VercelLogo />
          </div>
          <div className="ts-circle ts-circle--empty" />
          <div className="ts-circle ts-circle--empty" />
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
