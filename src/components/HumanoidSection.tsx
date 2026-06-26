"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "motion/react";

type CardItem = {
  title: string;
  link: string;
  image: string;
  background: string;
  labelKey: string;
  badgeKey?: string;
};

const CARDS: CardItem[] = [
  {
    title: "Oficiul de Cadastru OCPI",
    link: "https://sgc.ocpict.ro/",
    image: "/gov.png",
    background: "/background-section2.webp",
    labelKey: "portfolio.labels.sgc",
    badgeKey: "portfolio.badges.public_institution",
  },
  {
    title: "BAC DE 10",
    link: "https://unbacde10.ro/bacalaureat-informatica/",
    image: "/unbacde-10.png",
    background: "/background-section2.webp",
    labelKey: "portfolio.labels.bacde10",
  },
  {
    title: "PICAPS",
    link: "https://picaps.ro/",
    image: "/picaps3.webp",
    background: "/background-section1.webp",
    labelKey: "portfolio.labels.picaps",
  },
  {
    title: "R-DRAW",
    link: "https://r-draw.com/",
    image: "/r-draw.com.webp",
    background: "/background-section2.webp",
    labelKey: "portfolio.labels.rdraw",
  },
  {
    title: "EVERUN",
    link: "https://www.everunromania.ro/",
    image: "/everun.webp",
    background: "/background-section3.webp",
    labelKey: "portfolio.labels.everun",
  },
  {
    title: "EVERATI",
    link: "https://everati.ro/",
    image: "/everati.webp",
    background: "/background-section1.webp",
    labelKey: "portfolio.labels.everati",
  },
  {
    title: "KICKOUT",
    link: "https://kickout.ro/",
    image: "/kickout.webp",
    background: "/background-section3.webp",
    labelKey: "portfolio.labels.kickout",
  },
  {
    title: "ALMA",
    link: "https://vopsitoriaalma.ro/",
    image: "/alma.webp",
    background: "/background-section1.webp",
    labelKey: "portfolio.labels.alma",
  },
  {
    title: "LUKTON",
    link: "https://lukton.ro/",
    image: "/lukton.webp",
    background: "/background-section3.webp",
    labelKey: "portfolio.labels.lukton",
  },
  {
    title: "ECARTOP",
    link: "https://ecartop.com/",
    image: "/ecartop.webp",
    background: "/background-section1.webp",
    labelKey: "portfolio.labels.ecartop",
  },
  {
    title: "TRAVEL TWIN",
    link: "https://travel-twin.vercel.app/",
    image: "/travel-twin.webp",
    background: "/background-section1.webp",
    labelKey: "portfolio.labels.traveltwin",
  },
];

const StarIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: 10, height: 10 }}>
    <path d="M12 2l2.939 6.95L22 10.061l-5.5 5.213L17.878 22 12 18.605 6.122 22l1.378-6.726L2 10.061l7.061-1.111L12 2z" />
  </svg>
);

const ArrowUpRight = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ width: 13, height: 13 }}
  >
    <path d="M5 19L19 5" />
    <path d="M9 5h10v10" />
  </svg>
);

type ProjectCardProps = {
  card: CardItem;
  t: (key: string) => string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ card, t }) => (
  <a
    href={card.link}
    target="_blank"
    rel="noopener noreferrer"
    className="ww-card"
    aria-label={`${card.title} — ${t("portfolio.card_link")}`}
  >
    <div className="ww-card-image-wrap">
      <img src={card.image} alt={card.title} loading="lazy" className="ww-card-img" />
    </div>

    {card.badgeKey && (
      <span className="ww-card-badge">
        {StarIcon}
        {t(card.badgeKey)}
      </span>
    )}

    <div className="ww-card-foot">
      <h3 className="ww-card-title">{card.title}</h3>
      <span className="ww-card-cta">
        {t("portfolio.card_link")}
        {ArrowUpRight}
      </span>
    </div>
  </a>
);

const ROW_1 = CARDS.slice(0, 5);
const ROW_2 = CARDS.slice(5);

const HumanoidSection: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardsZoneRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({
    range1: 0, range2: 0, rowH: 0, introH: 0, vh: 0,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setLayout({
        range1: Math.max(0, (row1Ref.current?.scrollWidth ?? 0) - vw),
        range2: Math.max(0, (row2Ref.current?.scrollWidth ?? 0) - vw),
        rowH: row1Ref.current?.offsetHeight ?? 0,
        introH: introRef.current?.offsetHeight ?? 0,
        vh,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Sequential reveal: phase 1 shows Row 1 at top of cards-zone (below intro).
  // Transition slides Row 2 up from below into position below Row 1.
  // Phase 2 keeps Row 1 fixed and scrolls Row 2 rightward (opposite direction).
  const { range1, range2, rowH, introH, vh } = layout;
  const HOLD_PX = 220;
  const TRANSITION_PX = 300;
  const GAP_PX = 56;
  const STAGE_BOTTOM_PADDING = 40;
  const TOP_PADDING = 20;
  // Fixed navbar height — pin the sticky stage below it so the title isn't hidden behind the navbar.
  const NAV_CLEARANCE = 88;

  // Adaptive stage height — just enough for intro + 2 rows + tight padding.
  // No more empty space below cards. Cap at viewport so sticky works.
  const desiredStageH =
    introH > 0 && rowH > 0
      ? introH + TOP_PADDING + 2 * rowH + GAP_PX + STAGE_BOTTOM_PADDING
      : 800;
  const stageH = vh > 0 ? Math.min(desiredStageH, vh - NAV_CLEARANCE) : 800;
  const zoneH = Math.max(0, stageH - introH);

  const totalScrollPx = HOLD_PX + range1 + range2 + TRANSITION_PX;
  const pHoldEnd = totalScrollPx > 0 ? HOLD_PX / totalScrollPx : 0;
  const p1End =
    totalScrollPx > 0 ? (HOLD_PX + range1) / totalScrollPx : 0.33;
  const p2Start =
    totalScrollPx > 0
      ? (HOLD_PX + range1 + TRANSITION_PX) / totalScrollPx
      : 0.66;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Horizontal — Row 1 holds at start (HOLD_PX), then leftward to p1End, then held.
  const x1 = useTransform(
    scrollYProgress,
    [0, pHoldEnd, p1End, 1],
    [0, 0, -range1, -range1]
  );
  // Horizontal — Row 2 held until p2Start, then rightward (-range2 → 0).
  const x2 = useTransform(scrollYProgress, [0, p2Start, 1], [-range2, -range2, 0]);

  // Vertical — Row 1 fixed at top of cards-zone (intro is above in pinned stage).
  const y1Top = TOP_PADDING;
  const y1 = useTransform(scrollYProgress, [0, 1], [y1Top, y1Top]);

  // Vertical — Row 2 hidden below cards-zone in phase 1, slides up below Row 1.
  const y2Hidden = zoneH;
  const y2Below = TOP_PADDING + rowH + GAP_PX;
  const y2 = useTransform(scrollYProgress, [p1End, p2Start], [y2Hidden, y2Below]);

  return (
    <section className="ww-projects" id="projects" aria-label={t("portfolio.title")}>
      <style>{`
        .ww-projects { width: 100%; background: #ffffff; }

        /* ===== Intro header (PINNED inside sticky stage, above cards-zone) ===== */
        .ww-projects-intro {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          max-width: 980px;
          margin: 0 auto;
          padding: 16px 16px 14px;
          text-align: center;
          background: #ffffff;
        }
        .ww-projects-intro h2 {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #262626;
          margin: 0 auto;
          max-width: 22ch;
        }

        /* ===== Scroll-pinned sequential carousel (phase 1 → phase 2) ===== */
        .ww-carousel { position: relative; width: 100%; }
        .ww-carousel-stage {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }
        .ww-cards-zone {
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        .ww-track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: clamp(24px, 2.6vw, 44px);
          padding: 0 clamp(24px, 5vw, 80px);
          will-change: transform, opacity;
        }

        /* ===== Card (solid cream bg, dark text) ===== */
        .ww-card {
          position: relative;
          flex: 0 0 auto;
          width: clamp(260px, min(28vw, calc(48vh - 80px)), 460px);
          aspect-ratio: 10 / 9;
          border-radius: 14px;
          overflow: hidden;
          isolation: isolate;
          text-decoration: none;
          color: #1a1a1a;
          background: #F2ECE2;
          border: 1px solid rgba(0, 0, 0, 0.06);
          transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1),
                      border-color 320ms cubic-bezier(0.23, 1, 0.32, 1);
          display: flex;
          flex-direction: column;
        }
        .ww-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 0, 0, 0.14);
        }

        /* === Screenshot panel (top portion — fixed 16/10 ratio) === */
        .ww-card-image-wrap {
          position: relative;
          z-index: 1;
          margin: clamp(12px, 1.2vw, 18px);
          margin-bottom: 0;
          aspect-ratio: 16 / 10;
          border-radius: 10px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .ww-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          filter: grayscale(100%);
          transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1),
                      filter 400ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .ww-card:hover .ww-card-img {
          transform: scale(1.04);
          filter: grayscale(0);
        }

        /* === Badge (top-right) === */
        .ww-card-badge {
          position: absolute;
          top: clamp(20px, 2vw, 28px);
          right: clamp(20px, 2vw, 28px);
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 9999px;
          font-family: var(--font-sans);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffffff;
          background: #ED5C1B;
        }

        /* === Foot (project title / CTA) === */
        .ww-card-foot {
          position: relative;
          z-index: 1;
          margin-top: auto;
          padding: clamp(18px, 2vw, 26px);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ww-card-eyebrow {
          font-family: var(--font-sans);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
          margin: 0;
        }
        .ww-card-title {
          font-family: var(--font-sans);
          font-weight: 600;
          letter-spacing: -0.025em;
          font-size: clamp(1.15rem, 1.55vw, 1.55rem);
          line-height: 1.1;
          color: #1a1a1a;
          margin: 0;
        }
        .ww-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 7px 14px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.06);
          border: none;
          color: #1a1a1a;
          font-family: var(--font-sans);
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          align-self: flex-start;
          transition: background 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .ww-card:hover .ww-card-cta {
          background: rgba(0, 0, 0, 0.12);
        }
        .ww-card-cta svg { transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1); }
        .ww-card:hover .ww-card-cta svg { transform: translate(2px, -2px); }

        @media (max-width: 768px) {
          .ww-card { width: 290px; }
          .ww-card-title { font-size: 1.35rem; }
          .ww-projects-intro { padding: 14px 16px 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ww-card-img { transition: none !important; }
          .ww-card:hover { transform: none; }
          .ww-card:hover .ww-card-img { transform: none; }
        }
      `}</style>

      <div
        ref={sectionRef}
        className="ww-carousel"
        style={{ height: `${totalScrollPx + stageH}px` }}
      >
        <div className="ww-carousel-stage" style={{ height: `${stageH}px`, top: NAV_CLEARANCE }}>
          <div ref={introRef} className="ww-projects-intro">
            <h2>{t("portfolio.title")}</h2>
          </div>
          <div ref={cardsZoneRef} className="ww-cards-zone">
            <motion.div
              ref={row1Ref}
              className="ww-track"
              style={{ x: x1, y: y1 }}
            >
              {ROW_1.map((card) => (
                <ProjectCard key={card.title} card={card} t={t} />
              ))}
            </motion.div>
            <motion.div
              ref={row2Ref}
              className="ww-track"
              style={{ x: x2, y: y2 }}
            >
              {ROW_2.map((card) => (
                <ProjectCard key={card.title} card={card} t={t} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HumanoidSection;
