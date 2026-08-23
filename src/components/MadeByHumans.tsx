"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LiquidMesh from "@/components/LiquidMesh";
import { useIsMobile } from "@/hooks/use-mobile";

const MadeByHumans = () => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isMobile = useIsMobile();
  const useWebGL = !isMobile && !reducedMotion;

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onMql = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener?.("change", onMql);
    return () => mql.removeEventListener?.("change", onMql);
  }, []);

  return (
    <>
      <style>{`
        :root { --orange:#ED5C1B; --ink:#262626; }

        /* ===== Shell + rounded mesh card (orange card floating on white) ===== */
        .mbh-section {
          position: relative;
          width: 100%;
          background: #FAF8F6;
        }
        /* iOS overscroll below the page is covered by the html background
           (src/index.css) — no ::after hack, which used to add 240px of dead
           scrollable space under the footer. */
        .mbh-shell {
          padding: clamp(12px, 1.6vw, 20px);
        }
        .mbh-card {
          position: relative;
          width: 100%;
          min-height: min(58vh, 480px);
          border-radius: clamp(24px, 3vw, 56px);
          overflow: hidden;
          isolation: isolate;
        }
        .mbh-mesh {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          z-index: 0;
        }
        .mbh-mesh-static {
          background:
            radial-gradient(at 30% 20%, #FF8A3D 0%, transparent 55%),
            radial-gradient(at 80% 80%, #F0A172 0%, transparent 50%),
            radial-gradient(at 50% 50%, #DC5418 0%, transparent 60%),
            #ED5C1B;
        }
        .mbh-content {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: inherit;
          padding: clamp(48px, 6vh, 80px) clamp(16px, 3vw, 24px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: clamp(20px, 3vh, 32px);
        }
        @media (max-width: 640px) {
          .mbh-card { min-height: min(52vh, 420px); }
          .mbh-content { padding: 40px 16px; }
        }

        /* ===== Footer text (white-on-orange with subtle shadow) ===== */
        .mbh-copyright {
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.18);
          font-family: var(--font-sans);
          font-weight: 400;
          letter-spacing: 0.005em;
        }
        .mbh-copyright-link {
          color: #ffffff;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 220ms ease;
        }
        .mbh-copyright-link:hover { opacity: 0.85; text-decoration: underline; }
        .mbh-legal-link {
          color: rgba(255, 255, 255, 0.78);
          text-decoration: none;
          transition: color 220ms ease;
        }
        .mbh-legal-link:hover { color: #ffffff; }
        .mbh-legal-divider { color: rgba(255, 255, 255, 0.45); }

        /* ===== Contact capsule (white pill on orange) ===== */
        .contact-container {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 10px 20px; border-radius: 12px;
          background: rgba(255,255,255,.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: var(--ink);
          font-family: var(--font-sans);
          font-size: 13px; font-weight: 500;
          box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.18);
          transition: background-color .25s ease, border-color .25s ease, transform .25s var(--ease-out-quart, cubic-bezier(0.23, 1, 0.32, 1)), box-shadow .25s ease;
        }
        .contact-container:hover {
          background: #fff;
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.22);
        }
        .contact-link {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--ink); text-decoration: none; transition: color .25s ease;
        }
        .contact-link:hover { color: var(--orange); }
        .contact-divider { width: 1px; height: 20px; background: rgba(38, 38, 38, .18); }

        .icon {
          width: 18px; height: 18px; flex: 0 0 18px;
        }
        .icon path, .icon circle, .icon line, .icon polyline, .icon rect {
          stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;
          fill: none;
        }

        @media (max-width: 640px) {
          .contact-container { padding: 0; gap: 16px; background: transparent; border: none; box-shadow: none; }
          .contact-container:hover { background: transparent; transform: none; box-shadow: none; }
          .contact-link {
            width: 48px; height: 48px; padding: 0; border-radius: 10px;
            background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
            border: 1.5px solid rgba(255, 255, 255, 0.5); justify-content: center;
            transition: background-color .3s ease, border-color .3s ease, transform .3s var(--ease-out-quart, cubic-bezier(0.23, 1, 0.32, 1)), box-shadow .3s ease;
            box-shadow: 0 6px 18px -6px rgba(0, 0, 0, 0.22);
          }
          .contact-link:hover {
            background: #fff; border-color: #ffffff;
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 22px rgba(0, 0, 0, .22);
          }
          .contact-link span { display: none; }
          .contact-divider { display: none; }
          .icon { width: 20px; height: 20px; flex-basis: 20px; }
        }
      `}</style>

      <section className="mbh-section" id="made-by-humans">
        <div className="mbh-shell">
          <div className="mbh-card" ref={cardRef}>
            {useWebGL ? (
              <LiquidMesh className="mbh-mesh" containerRef={cardRef} />
            ) : (
              <div className="mbh-mesh mbh-mesh-static" aria-hidden="true" />
            )}

            <div className="mbh-content">
              <div className="contact-container">
                <a
                  href="tel:+40773858164"
                  className="contact-link"
                  aria-label="Phone Number"
                  title="+40 773 858 164"
                >
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 16.92v2.1a2 2 0 0 1-2.18 2 19.6 19.6 0 0 1-8.58-3.06 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3.06-8.58A2 2 0 0 1 4.18 2h2.1A2 2 0 0 1 8.2 3.72l.67 2a2 2 0 0 1-.46 2.02L7.3 8.9a16.5 16.5 0 0 0 7.8 7.8l1.15-1.11a2 2 0 0 1 2.02-.46l2 .67A2 2 0 0 1 22 16.92Z"/>
                  </svg>
                  <span>+40 773 858 164</span>
                </a>

                <div className="contact-divider" />

                <a
                  href="mailto:contact@alcaziurobert.ro"
                  className="contact-link"
                  aria-label="Email Address"
                  title="contact@alcaziurobert.ro"
                >
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
                    <polyline points="3,7 12,13 21,7"/>
                  </svg>
                  <span>contact@alcaziurobert.ro</span>
                </a>
              </div>

              <p className="mbh-copyright text-center text-xs sm:text-sm">
                © {new Date().getFullYear()}{" "}
                <a
                  href="https://alcaziurobert.ro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mbh-copyright-link"
                >
                  {t("footer.copyright_l")}
                </a>
              </p>

              <p className="text-center text-[11px] sm:text-xs">
                <Link to="/termeni-si-conditii" className="mbh-legal-link">
                  {t("footer.terms_link")}
                </Link>
                <span className="mx-2 mbh-legal-divider">·</span>
                <Link to="/politica-de-confidentialitate" className="mbh-legal-link">
                  {t("footer.privacy_link")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MadeByHumans;
