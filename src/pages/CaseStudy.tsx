import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import MadeByHumans from "@/components/MadeByHumans";
import { jumpToTop, scrollToEl } from "@/lib/scroll";

const MAIL = "mailto:contact@alcaziurobert.ro";

const STAGES = [
  "discovery",
  "performance",
  "security",
  "tracking",
  "seo",
] as const;

const CHANNELS = [
  { key: "meta",    src: "/logos/meta.png",       labelKey: "approach.channel_meta",   w: 500, h: 375 },
  { key: "google",  src: "/logos/google-ads.png", labelKey: "approach.channel_google", w: 501, h: 376 },
] as const;

const TOC_IDS = [
  "cs-overview",
  "cs-problem",
  "cs-addon",
  "cs-roadmap",
  "cs-channels",
  "cs-cta",
] as const;

const NAV_OFFSET = 96;

const ArrowIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

const Approach: React.FC = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>("cs-overview");

  useEffect(() => {
    jumpToTop();
  }, []);

  // Reveal-on-scroll for any element with .cs-reveal.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".cs-reveal"));
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scrollspy — highlights the TOC entry of the section currently being read.
  useEffect(() => {
    const els = TOC_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(top.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleTocClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    scrollToEl(el, NAV_OFFSET);
  };

  return (
    <div className="cs-root">
      <style>{`
        .cs-root { padding-top: 78px; min-height: 100vh; min-height: 100dvh; background: #0F0F0F; color: #F5F5F5; }
        .cs-page { padding: clamp(28px, 4vh, 52px) 20px clamp(36px, 5.5vh, 60px); }

        /* Layout: 2-col on desktop (sticky TOC + content), single column mobile */
        .cs-layout {
          max-width: 1180px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 1024px) {
          .cs-layout {
            grid-template-columns: 200px minmax(0, 1fr);
            gap: 56px;
            align-items: start;
          }
        }

        /* TOC SIDEBAR */
        .cs-toc { display: none; }
        @media (min-width: 1024px) {
          .cs-toc {
            display: block;
            position: sticky; top: 96px;
            align-self: start;
          }
        }
        .cs-toc-eyebrow {
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #F5F5F5;
          margin: 0 0 14px;
        }
        .cs-toc nav { display: flex; flex-direction: column; gap: 2px; }
        .cs-toc a {
          display: block;
          padding: 8px 0 8px 14px;
          border-left: 2px solid rgba(255,255,255,.10);
          font-size: 13.5px; font-weight: 500;
          color: rgba(255, 255, 255, 0.72); text-decoration: none;
          line-height: 1.35;
          transition:
            color 220ms cubic-bezier(0.23,1,0.32,1),
            border-color 220ms cubic-bezier(0.23,1,0.32,1),
            font-weight 220ms cubic-bezier(0.23,1,0.32,1);
        }
        .cs-toc a:hover { color: #F5F5F5; }
        .cs-toc a.active {
          color: #F5F5F5;
          font-weight: 600;
          border-left-color: #ED5C1B;
        }

        /* CONTENT COLUMN */
        .cs-col {
          max-width: 880px;
          margin: 0 auto;
          text-align: left;
        }
        .cs-col > section + section { margin-top: clamp(40px, 6.5vh, 80px); }

        /* HERO */
        .cs-h1 {
          font-family: var(--font-sans);
          font-weight: 500; letter-spacing: -0.025em; line-height: 1.15;
          font-size: clamp(1.7rem, 3.6vw, 2.4rem); color: #F5F5F5;
          margin: 0 0 16px; max-width: 24ch;
        }
        .cs-lead {
          font-size: clamp(1rem, 1.4vw, 1.15rem); line-height: 1.6;
          color: rgba(255, 255, 255, 0.72); margin: 0 0 20px; max-width: 60ch;
        }

        /* PAIN */
        .cs-pain-list {
          list-style: none; padding: 0; margin: 22px 0 0;
          display: grid; gap: 14px;
        }
        .cs-pain-list li {
          position: relative; padding-left: 36px;
          font-size: clamp(.97rem, 1.2vw, 1.07rem); line-height: 1.55; color: #F5F5F5;
        }
        .cs-pain-list li::before {
          content: "✕"; position: absolute; left: 0; top: 1px;
          width: 22px; height: 22px;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          background: #C44E17; border-radius: 6px;
        }

        /* ROADMAP */
        .cs-roadmap {
          list-style: none; padding: 0; margin: 24px 0 0;
          display: grid; gap: clamp(20px, 3vh, 32px);
        }
        .cs-stage {
          display: grid; grid-template-columns: 88px 1fr; gap: 28px; align-items: start;
          padding-bottom: clamp(20px, 3vh, 28px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .cs-stage:last-child { border-bottom: none; padding-bottom: 0; }
        .cs-stage-num {
          font-family: var(--font-sans);
          font-weight: 600; font-size: clamp(2rem, 4.5vw, 3rem);
          letter-spacing: -0.04em; color: #ED5C1B; line-height: 1;
        }
        .cs-stage-title {
          font-family: var(--font-sans);
          font-weight: 500; font-size: clamp(1.15rem, 2vw, 1.4rem);
          letter-spacing: -0.02em; color: #F5F5F5; margin: 0 0 8px;
        }
        .cs-stage-lead {
          font-size: clamp(.97rem, 1.2vw, 1.05rem); line-height: 1.55;
          color: rgba(255, 255, 255, 0.72); margin: 0 0 14px; max-width: 58ch;
        }
        .cs-stage-tech {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .cs-stage-tech li {
          font-size: 12.5px; font-weight: 600; letter-spacing: 0.02em;
          padding: 5px 11px; border-radius: 6px;
          background: rgba(255,255,255,.05); color: #F5F5F5;
          border: 1px solid rgba(255,255,255,.10);
        }

        /* CHANNELS */
        .cs-channels-body p {
          font-size: clamp(.97rem, 1.2vw, 1.05rem); line-height: 1.6;
          color: rgba(255, 255, 255, 0.72); margin: 0 0 14px; max-width: 62ch;
        }
        .cs-channels-body p strong { color: #F5F5F5; font-weight: 600; }
        .cs-channels-grid {
          display: flex; flex-wrap: wrap;
          gap: clamp(36px, 5vw, 72px) clamp(40px, 6vw, 80px);
          margin-top: clamp(36px, 5vh, 56px);
          align-items: flex-end;
        }
        .cs-channel {
          display: inline-flex; flex-direction: column; align-items: flex-start;
          gap: clamp(14px, 1.6vw, 18px);
          background: none;
          border: none;
          padding: 0;
          transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform;
        }
        .cs-channel:hover { transform: translateY(-4px); }
        .cs-channel img {
          height: clamp(56px, 7.5vw, 88px);
          width: auto;
          display: block;
          object-fit: contain;
          background: #ffffff;
          border-radius: 14px;
          padding: 10px 16px;
        }
        .cs-channel span {
          font-size: clamp(14.5px, 1.25vw, 16.5px);
          font-weight: 600;
          letter-spacing: -0.005em;
          color: #F5F5F5;
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-channel { transition: none; }
          .cs-channel:hover { transform: none; }
        }

        /* ADDON — clean inline layout, no box */
        .cs-addon-cta {
          margin-top: clamp(20px, 3vh, 28px);
        }
        .cs-addon-cta svg {
          width: 15px; height: 15px;
          transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cs-addon-cta:hover svg { transform: translateX(2px); }

        /* CTA */
        .cs-cta {
          padding-top: clamp(28px, 5vh, 56px);
          border-top: 1px solid rgba(255,255,255,.08);
        }
        .cs-cta-title {
          font-family: var(--font-sans);
          font-weight: 500; letter-spacing: -0.025em;
          font-size: clamp(1.7rem, 3.6vw, 2.4rem); color: #F5F5F5;
          margin: 0 0 14px;
        }
        .cs-cta-body {
          font-size: clamp(1rem, 1.3vw, 1.1rem); color: rgba(255, 255, 255, 0.72);
          line-height: 1.6; margin: 0 0 22px; max-width: 54ch;
        }
        .cs-cta .btn svg {
          width: 15px; height: 15px;
          transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cs-cta .btn:hover svg { transform: translateX(2px); }

        /* MOBILE */
        @media (max-width: 640px) {
          .cs-stage { grid-template-columns: 1fr; gap: 10px; }
          .cs-stage-num { font-size: 2rem; }
          .cs-channels-grid {
            gap: 32px clamp(28px, 8vw, 44px);
            justify-content: center;
            align-items: center;
          }
          .cs-channel {
            align-items: center;
            text-align: center;
          }
          .cs-channel img { height: clamp(56px, 14vw, 72px); }
          .cs-channel span { font-size: 14px; }
        }
        @media (max-width: 380px) {
          .cs-channels-grid { gap: 28px 24px; }
          .cs-channel img { height: 52px; }
        }

        /* REVEAL */
        /* Same timing as <Reveal> on the landing page, driven by the shared
           tokens so the two reveal systems cannot drift apart. Deliberately
           NO blur here: these wrap whole page sections, and filter() cost
           scales with painted area — the landing page blurs paragraphs and
           cards, not full-width sections. */
        .cs-reveal {
          opacity: 0;
          transform: translateY(var(--reveal-distance, 20px));
          transition:
            opacity var(--reveal-duration, 800ms) var(--reveal-ease, ease-out),
            transform var(--reveal-duration, 800ms) var(--reveal-ease, ease-out);
        }
        .cs-reveal.is-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .cs-reveal { transition: none; opacity: 1; transform: none; }
          .cs-toc a { transition: none; }
        }
      `}</style>

      <Navbar />

      <main className="cs-page">
        <div className="cs-layout">

          {/* STICKY TOC SIDEBAR */}
          <aside className="cs-toc" aria-label={t("approach.toc.title")}>
            <nav>
              <a href="#cs-overview"  onClick={handleTocClick("cs-overview")}  className={activeId === "cs-overview"  ? "active" : ""}>{t("approach.toc.overview")}</a>
              <a href="#cs-problem"   onClick={handleTocClick("cs-problem")}   className={activeId === "cs-problem"   ? "active" : ""}>{t("approach.toc.problem")}</a>
              <a href="#cs-addon"     onClick={handleTocClick("cs-addon")}     className={activeId === "cs-addon"     ? "active" : ""}>{t("approach.toc.addon")}</a>
              <a href="#cs-roadmap"   onClick={handleTocClick("cs-roadmap")}   className={activeId === "cs-roadmap"   ? "active" : ""}>{t("approach.toc.roadmap")}</a>
              <a href="#cs-channels"  onClick={handleTocClick("cs-channels")}  className={activeId === "cs-channels"  ? "active" : ""}>{t("approach.toc.channels")}</a>
              <a href="#cs-cta"       onClick={handleTocClick("cs-cta")}       className={activeId === "cs-cta"       ? "active" : ""}>{t("approach.toc.cta")}</a>
            </nav>
          </aside>

          <article className="cs-col">

            {/* 1. HERO */}
            <section id="cs-overview" className="cs-hero cs-reveal">
              <h1 className="cs-h1">{t("approach.h1")}</h1>
              <p className="cs-lead">{t("approach.lead")}</p>
            </section>

            {/* 2. PAIN */}
            <section id="cs-problem" className="cs-pain cs-reveal">
              <h2 className="cs-h2">{t("approach.pain_title")}</h2>
              <ul className="cs-pain-list">
                <li>{t("approach.pain_1")}</li>
                <li>{t("approach.pain_2")}</li>
                <li>{t("approach.pain_3")}</li>
              </ul>
            </section>

            {/* 3. CUSTOM INFRASTRUCTURE — VPS, premium positioning early */}
            <section id="cs-addon" className="cs-addon cs-reveal">
              <h2 className="cs-h2">{t("approach.addon_title")}</h2>
              <p className="cs-lead">{t("approach.addon_body")}</p>
              <a href={MAIL} className="btn btn-primary cs-addon-cta">
                {t("approach.addon_cta")}
                {ArrowIcon}
              </a>
            </section>

            {/* 4. ROADMAP */}
            <section id="cs-roadmap" className="cs-roadmap-section cs-reveal">
              <h2 className="cs-h2">{t("approach.road_title")}</h2>
              <p className="cs-lead">{t("approach.road_lead")}</p>

              <ol className="cs-roadmap">
                {STAGES.map((key, i) => (
                  <li key={key} className="cs-stage">
                    <span className="cs-stage-num">{String(i + 1).padStart(2, "0")}</span>
                    <div className="cs-stage-body">
                      <h3 className="cs-stage-title">{t(`approach.stage.${key}.title`)}</h3>
                      <p className="cs-stage-lead">{t(`approach.stage.${key}.lead`)}</p>
                      <ul className="cs-stage-tech">
                        <li>{t(`approach.stage.${key}.t1`)}</li>
                        <li>{t(`approach.stage.${key}.t2`)}</li>
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* 5. CHANNELS */}
            <section id="cs-channels" className="cs-channels cs-reveal">
              <h2 className="cs-h2">{t("approach.channels_title")}</h2>
              <div className="cs-channels-body">
                <p>{t("approach.channels_p1")}</p>
              </div>
              <div className="cs-channels-grid">
                {CHANNELS.map((c) => (
                  <div key={c.key} className="cs-channel">
                    <img src={c.src} alt="" aria-hidden="true" width={c.w} height={c.h} />
                    <span>{t(c.labelKey)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. CTA */}
            <section id="cs-cta" className="cs-cta cs-reveal">
              <h2 className="cs-cta-title">{t("approach.cta_title")}</h2>
              <p className="cs-cta-body">{t("approach.cta_body")}</p>
              <a href={MAIL} className="btn btn-primary">
                {t("approach.cta_button")}
                {ArrowIcon}
              </a>
            </section>

          </article>
        </div>
      </main>

      <MadeByHumans />
    </div>
  );
};

export default Approach;
