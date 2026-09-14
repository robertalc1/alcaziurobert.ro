import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import MadeByHumans from "@/components/MadeByHumans";
import ContactCTA from "@/components/ContactCTA";
import { jumpToTop, scrollToEl } from "@/lib/scroll";

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
        /* ─────────────────────────────────────────────────────────────────
           This page was built before the token system and never joined it: it
           carried its own type ramp (clamp(1.7rem, 3.6vw, 2.4rem) headings,
           clamp(.97rem, 1.2vw, 1.07rem) body), its own widths (1180, 880) and
           a different clamp for every vertical gap. That is exactly the thing
           index.css warns about — "no two gaps in the page were ever the same
           number" — and it is why this page read as a different site.

           Everything below now resolves to the same tokens the landing page
           uses. If a value here is not a var(), it should have a reason
           written next to it.
           ───────────────────────────────────────────────────────────────── */
        .cs-root {
          /* Reads the chrome instead of guessing at it. This was a flat 78px
             while the bar and the nav come to 124 — the content cleared them
             by 6px, and the moment the announcement bar was dismissed (--bar-h
             goes to 0) it left a 52px hole instead of moving up. */
          padding-top: calc(var(--bar-h) + var(--nav-h));
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--page);
          color: var(--ink);
        }
        .cs-page { padding: var(--sp-96) 0 var(--sp-128); }

        /* Layout: sticky TOC rail + reading column on desktop, one column below.
           On the page's own grid now — --w-page and --page-gutter, the same
           column the navbar and the landing page's body sit on, so the TOC's
           left edge lines up with the logo above it instead of landing 17px
           off. The article takes whatever is left of the row rather than being
           capped at 880 and centred inside its own cell, which is what left a
           band of dead page down the right-hand side. Line length is handled
           where it belongs: on the paragraphs, in ch. */
        .cs-layout {
          max-width: var(--w-page);
          margin: 0 auto;
          padding: 0 var(--page-gutter);
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 1024px) {
          .cs-layout {
            grid-template-columns: 200px minmax(0, 1fr);
            gap: var(--sp-64);
            align-items: start;
          }
        }
        @media (max-width: 991px) { .cs-layout { padding: 0 var(--sp-32); } }
        @media (max-width: 767px) {
          .cs-layout { padding: 0 var(--sp-24); }
          .cs-page { padding: var(--sp-64) 0 var(--sp-80); }
        }

        /* TOC SIDEBAR */
        .cs-toc { display: none; }
        @media (min-width: 1024px) {
          .cs-toc {
            display: block;
            /* Clears the same chrome the page does, plus one spacing step. */
            position: sticky;
            top: calc(var(--bar-h) + var(--nav-h) + var(--sp-32));
            align-self: start;
          }
        }
        .cs-toc-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--ink);
          margin: 0 0 var(--sp-16);
        }
        .cs-toc nav { display: flex; flex-direction: column; gap: 2px; }
        .cs-toc a {
          display: block;
          /* 13px, not 8: the rows measured 34px tall and these are the page's
             primary navigation. 12 landed at 43 — one pixel short of the floor,
             which is the same as being short. */
          padding: 13px 0 13px 14px;
          border-left: 2px solid var(--line);
          font-size: 14px; font-weight: 500;
          color: var(--text-muted); text-decoration: none;
          line-height: 1.35;
          transition:
            color 220ms cubic-bezier(0.23,1,0.32,1),
            border-color 220ms cubic-bezier(0.23,1,0.32,1);
        }
        .cs-toc a:hover { color: var(--ink); }
        .cs-toc a.active {
          color: var(--ink);
          font-weight: 600;
          border-left-color: var(--brand);
        }

        /* CONTENT COLUMN */
        .cs-col {
          margin: 0;
          text-align: left;
        }
        /* 80px between units — the landing page's .leads-col gap, not a fifth
           clamp of this page's own. */
        .cs-col > section + section { margin-top: var(--sp-80); }

        /* HERO */
        /* One heading metric for the whole site: 40/600 at -0.05em on 1.1.
           This ran at 500 weight and -0.025em, which is a different typeface's
           worth of difference from every other h2 on the site. */
        .cs-h1 {
          font-family: var(--font-sans);
          font-weight: var(--text-heading-weight);
          letter-spacing: var(--text-heading-ls);
          line-height: var(--text-heading-lh);
          font-size: var(--text-section-title);
          color: var(--ink);
          margin: 0 0 var(--sp-16); max-width: 24ch;
        }
        .cs-lead {
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted); margin: 0 0 var(--sp-24); max-width: 60ch;
        }

        /* PAIN */
        .cs-pain-list {
          list-style: none; padding: 0; margin: var(--sp-24) 0 0;
          display: grid; gap: var(--sp-16);
        }
        .cs-pain-list li {
          position: relative; padding-left: 36px;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--ink);
        }
        /* Tinted chip, coloured glyph — the same construction as
           .faq-trigger-icon on the landing page, so this page does not invent
           a second kind of chip. The fill used to be #C44E17, the last piece
           of the orange palette left anywhere on the site. --danger is the red
           the contact form already flags invalid fields with; there is now one
           red, in one place. The glyph is a CSS ::before, so it is not in the
           accessibility tree — the meaning is carried by the sentence next to
           it, and the chip itself clears the 3:1 floor for non-text. */
        .cs-pain-list li::before {
          content: "✕"; position: absolute; left: 0; top: 1px;
          width: 22px; height: 22px;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
          color: var(--danger);
          background: var(--danger-soft); border-radius: 6px;
        }

        /* ROADMAP */
        .cs-roadmap {
          list-style: none; padding: 0; margin: var(--sp-24) 0 0;
          display: grid; gap: var(--sp-32);
        }
        .cs-stage {
          display: grid; grid-template-columns: 88px 1fr; gap: var(--sp-32);
          align-items: start;
          padding-bottom: var(--sp-24);
          border-bottom: 1px solid var(--line);
        }
        .cs-stage:last-child { border-bottom: none; padding-bottom: 0; }
        /* Numerals are one of the four things the palette note allows the
           accent on, so --brand stays. The size joins the heading scale. */
        .cs-stage-num {
          font-family: var(--font-sans);
          font-weight: 600; font-size: var(--text-section-title);
          letter-spacing: -0.04em; color: var(--brand); line-height: 1;
        }
        .cs-stage-title {
          font-family: var(--font-sans);
          font-weight: 600; font-size: var(--text-card-title);
          letter-spacing: -0.02em; color: var(--ink); margin: 0 0 var(--sp-8);
        }
        .cs-stage-lead {
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted); margin: 0 0 var(--sp-16); max-width: 58ch;
        }
        .cs-stage-tech {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-wrap: wrap; gap: var(--sp-8);
        }
        .cs-stage-tech li {
          font-size: 12.5px; font-weight: 600; letter-spacing: 0.02em;
          padding: 5px 11px; border-radius: 6px;
          background: var(--line); color: var(--ink);
          border: 1px solid var(--line);
        }

        /* CHANNELS */
        .cs-channels-body p {
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted); margin: 0 0 var(--sp-16); max-width: 62ch;
        }
        .cs-channels-body p strong { color: var(--ink); font-weight: 600; }
        .cs-channels-grid {
          display: flex; flex-wrap: wrap;
          gap: var(--sp-48) var(--sp-64);
          margin-top: var(--sp-48);
          align-items: flex-end;
        }
        .cs-channel {
          display: inline-flex; flex-direction: column; align-items: flex-start;
          gap: var(--sp-16);
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
          background: var(--surface);
          border-radius: var(--r-card);
          padding: 10px 16px;
        }
        .cs-channel span {
          font-size: var(--text-body);
          font-weight: 600;
          letter-spacing: -0.005em;
          color: var(--ink);
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-channel { transition: none; }
          .cs-channel:hover { transform: none; }
        }

        /* ADDON — clean inline layout, no box */
        .cs-addon-cta {
          margin-top: var(--sp-24);
        }
        .cs-addon-cta svg {
          width: 15px; height: 15px;
          transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cs-addon-cta:hover svg { transform: translateX(2px); }

        /* CTA */
        .cs-cta {
          padding-top: var(--sp-48);
          border-top: 1px solid var(--line);
        }
        .cs-cta-title {
          font-family: var(--font-sans);
          font-weight: var(--text-heading-weight);
          letter-spacing: var(--text-heading-ls);
          line-height: var(--text-heading-lh);
          font-size: var(--text-section-title);
          color: var(--ink);
          margin: 0 0 var(--sp-16);
        }
        .cs-cta-body {
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          margin: 0 0 var(--sp-24); max-width: 54ch;
        }
        .cs-cta .btn svg {
          width: 15px; height: 15px;
          transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cs-cta .btn:hover svg { transform: translateX(2px); }

        /* MOBILE */
        @media (max-width: 640px) {
          .cs-stage { grid-template-columns: 1fr; gap: var(--sp-12); }
          .cs-stage-num { font-size: 2rem; }
          .cs-channels-grid {
            gap: var(--sp-32) clamp(28px, 8vw, 44px);
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
          .cs-channels-grid { gap: var(--sp-24); }
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
              {/* Was a raw mailto, which dropped the visitor into their mail
                  client and out of the funnel — the form never saw them and
                  neither did the lead backup. */}
              <ContactCTA>
                <button type="button" className="btn btn-primary cs-addon-cta">
                  {t("approach.addon_cta")}
                  {ArrowIcon}
                </button>
              </ContactCTA>
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
              <ContactCTA>
                <button type="button" className="btn btn-primary">
                  {t("approach.cta_button")}
                  {ArrowIcon}
                </button>
              </ContactCTA>
            </section>

          </article>
        </div>
      </main>

      <MadeByHumans />
    </div>
  );
};

export default Approach;
