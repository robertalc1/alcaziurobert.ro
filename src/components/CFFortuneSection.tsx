"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const CFFortuneSection: React.FC = () => {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = rootRef.current?.querySelectorAll<HTMLElement>(".cf-reveal");
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
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="cf-fortune-section" aria-labelledby="cf-fortune-title">
      <style>{`
        .cf-fortune-section {
          width: 100%;
          background: #fff;
          padding: clamp(56px, 9vh, 112px) 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cf-fortune-inner {
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }
        .cf-fortune-title {
          font-family: var(--font-sans), 'General Sans', system-ui, sans-serif;
          font-weight: 500;
          letter-spacing: -0.028em;
          line-height: 1.08;
          font-size: clamp(2rem, 5.4vw, 3.75rem);
          color: var(--ink, #262626);
          margin: 0;
          max-width: 18ch;
        }
        .cf-fortune-subtitle {
          font-family: var(--font-sans), 'General Sans', system-ui, sans-serif;
          font-weight: 400;
          font-size: clamp(0.95rem, 1.15vw, 1.05rem);
          color: #8b95a3;
          margin: 0;
          max-width: 42ch;
          line-height: 1.55;
        }

        .cf-reveal {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 720ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 720ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cf-reveal.is-in { opacity: 1; transform: none; }
        .cf-reveal--delay { transition-delay: 110ms; }

        @media (max-width: 640px) {
          .cf-fortune-section { padding: 56px 20px; }
          .cf-fortune-inner { gap: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-reveal {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div ref={rootRef} className="cf-fortune-inner">
        <h2 id="cf-fortune-title" className="cf-fortune-title cf-reveal">
          {t("cf_fortune.headline")}
        </h2>
        <p className="cf-fortune-subtitle cf-reveal cf-reveal--delay">
          {t("cf_fortune.subtitle")}
        </p>
      </div>
    </section>
  );
};

export default CFFortuneSection;
