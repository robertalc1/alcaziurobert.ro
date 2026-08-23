"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";

type Project = {
  slug: string;
  name: string;
  url: string;
  img: string;
  domain: string;
};

// Grid picks the 8 strongest builds; OCPI is featured above.
const PROJECTS: Project[] = [
  { slug: "picaps", name: "Picaps", url: "https://picaps.ro/", img: "/picaps3.webp", domain: "picaps.ro" },
  { slug: "kickout", name: "Kickout", url: "https://kickout.ro/", img: "/kickout.webp", domain: "kickout.ro" },
  { slug: "rdraw", name: "R-Draw", url: "https://r-draw.com/", img: "/r-draw.com.webp", domain: "r-draw.com" },
  { slug: "everun", name: "Everun", url: "https://www.everunromania.ro/", img: "/everun.webp", domain: "everunromania.ro" },
  { slug: "everati", name: "Everati", url: "https://everati.ro/", img: "/everati.webp", domain: "everati.ro" },
  { slug: "alma", name: "Alma", url: "https://vopsitoriaalma.ro/", img: "/alma.webp", domain: "vopsitoriaalma.ro" },
  { slug: "lukton", name: "Lukton", url: "https://lukton.ro/", img: "/lukton.webp", domain: "lukton.ro" },
  { slug: "ecartop", name: "Ecartop", url: "https://ecartop.com/", img: "/ecartop.webp", domain: "ecartop.com" },
];

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

// CSS browser chrome around a screenshot — double-bezel: warm outer tray,
// white inner core with concentric radii.
const BrowserFrame: React.FC<{ src: string; alt: string; domain?: string }> = ({
  src,
  alt,
  domain,
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
        <img src={src} alt={alt} loading="lazy" decoding="async" className="bf-img" />
      </div>
    </div>
  </figure>
);

const SelectedWorkSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="work-section" id="work" aria-label={t("portfolio.title")}>
      <style>{`
        .work-section {
          width: 100%;
          background: #ffffff;
          padding: clamp(64px, 9vh, 112px) clamp(18px, 3vw, 32px);
          border-top: 1px solid rgba(38, 38, 38, 0.08);
        }
        .work-inner {
          max-width: 1180px;
          margin: 0 auto;
        }
        .work-kicker {
          display: inline-block;
          color: #ED5C1B;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }
        .work-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #141414;
          margin: clamp(20px, 3vh, 30px) 0 0;
          max-width: 22ch;
          text-wrap: balance;
        }

        /* ── Browser frame (double-bezel) ── */
        .bf {
          margin: 0;
          background: #F4F2EE;
          border: 1px solid rgba(38, 38, 38, 0.07);
          border-radius: 18px;
          padding: 7px;
        }
        .bf-core {
          background: #ffffff;
          border: 1px solid rgba(38, 38, 38, 0.08);
          border-radius: 11px;
          overflow: hidden;
        }
        .bf-bar {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 9px 12px;
          border-bottom: 1px solid rgba(38, 38, 38, 0.07);
          background: #ffffff;
        }
        .bf-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(38, 38, 38, 0.14);
          flex-shrink: 0;
        }
        .bf-domain {
          margin-left: 9px;
          font-family: var(--font-sans);
          font-size: 10.5px;
          letter-spacing: 0.04em;
          color: rgba(38, 38, 38, 0.40);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bf-view {
          aspect-ratio: 16 / 10;
          overflow: hidden;
        }
        .bf-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 700ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        /* ── Featured case ── */
        .work-featured {
          display: block;
          text-decoration: none;
          color: inherit;
          margin-top: clamp(36px, 5vh, 56px);
          transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .work-featured:hover { transform: translateY(-3px); }
        .work-featured:hover .bf-img { transform: scale(1.02); }
        .work-featured-grid {
          display: grid;
          grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
          gap: clamp(28px, 4vw, 60px);
          align-items: center;
        }
        .work-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 9999px;
          background: #ED5C1B;
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          align-self: flex-start;
        }
        .work-featured-meta {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: flex-start;
        }
        .work-featured-name {
          font-family: var(--font-sans);
          font-size: clamp(1.35rem, 2.1vw, 1.85rem);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.15;
          color: #141414;
          margin: 0;
        }
        .work-featured-desc {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.6;
          color: rgba(38, 38, 38, 0.62);
          max-width: 44ch;
          margin: 0;
        }
        .work-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .work-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 13px;
          border-radius: 9999px;
          border: 1px solid rgba(38, 38, 38, 0.12);
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 500;
          color: rgba(38, 38, 38, 0.72);
          white-space: nowrap;
        }

        /* ── Visit affordance (button-in-button) ── */
        .work-visit {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          color: #141414;
        }
        .work-visit-icon {
          width: 30px;
          height: 30px;
          border-radius: 9999px;
          background: rgba(38, 38, 38, 0.06);
          color: #141414;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 320ms cubic-bezier(0.32, 0.72, 0, 1),
                      color 320ms cubic-bezier(0.32, 0.72, 0, 1),
                      transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
          flex-shrink: 0;
        }
        .work-visit-icon svg { width: 13px; height: 13px; }
        .work-featured:hover .work-visit-icon,
        .work-card:hover .work-visit-icon {
          background: #ED5C1B;
          color: #ffffff;
          transform: translate(2px, -2px);
        }

        /* ── Grid ── */
        .work-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(28px, 4vw, 48px) clamp(24px, 3vw, 40px);
          margin-top: clamp(48px, 7vh, 80px);
        }
        .work-card {
          display: block;
          text-decoration: none;
          color: inherit;
          transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .work-card:hover { transform: translateY(-4px); }
        .work-card:hover .bf-img { transform: scale(1.025); }
        .work-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 8px 0;
        }
        .work-name {
          font-family: var(--font-sans);
          font-size: clamp(1.05rem, 1.35vw, 1.25rem);
          font-weight: 600;
          letter-spacing: -0.015em;
          color: #141414;
          margin: 0 0 3px;
        }
        .work-metric {
          font-family: var(--font-sans);
          font-size: 13px;
          line-height: 1.5;
          color: rgba(38, 38, 38, 0.55);
          margin: 0;
        }

        @media (max-width: 1024px) {
          .work-featured-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        @media (max-width: 768px) {
          .work-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .work-card, .work-featured { transition: none; }
          .work-card:hover, .work-featured:hover { transform: none; }
          .bf-img { transition: none; }
          .work-card:hover .bf-img, .work-featured:hover .bf-img { transform: none; }
        }
      `}</style>

      <div className="work-inner">
        <Reveal>
          <span className="work-kicker">{t("work.kicker")}</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="work-title">{t("portfolio.title")}</h2>
        </Reveal>

        {/* Featured: government-grade build */}
        <Reveal delay={140}>
          <a
            className="work-featured"
            href="https://sgc.ocpict.ro/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("work.featured_name")} — ${t("work.visit")}`}
          >
            <div className="work-featured-grid">
              <BrowserFrame src="/sgc-live.webp" alt={t("work.featured_name")} domain="sgc.ocpict.ro" />
              <div className="work-featured-meta">
                <span className="work-badge">{t("portfolio.badges.public_institution")}</span>
                <h3 className="work-featured-name">{t("work.featured_name")}</h3>
                <p className="work-featured-desc">{t("portfolio.subtitles.sgc")}</p>
                <div className="work-chips">
                  <span className="work-chip">{t("work.featured_chip1")}</span>
                  <span className="work-chip">{t("work.featured_chip2")}</span>
                  <span className="work-chip">{t("work.featured_chip3")}</span>
                </div>
                <span className="work-visit">
                  {t("work.visit")}
                  <span className="work-visit-icon">{ArrowUpRight}</span>
                </span>
              </div>
            </div>
          </a>
        </Reveal>

        {/* Grid of selected builds */}
        <div className="work-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 80}>
              <a
                className="work-card"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} — ${t("work.visit")}`}
              >
                <BrowserFrame src={p.img} alt={p.name} domain={p.domain} />
                <div className="work-meta-row">
                  <div>
                    <h3 className="work-name">{p.name}</h3>
                    <p className="work-metric">{t(`portfolio.metrics.${p.slug}`)}</p>
                  </div>
                  <span className="work-visit-icon">{ArrowUpRight}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWorkSection;
