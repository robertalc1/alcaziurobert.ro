import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import MadeByHumans from "@/components/MadeByHumans";
import { jumpToTop, scrollToEl } from "@/lib/scroll";

const SECTIONS = [
  "intro",
  "data",
  "source",
  "purpose",
  "refusal",
  "recipients",
  "transfers",
  "storage",
  "rights",
  "cookies",
  "security",
  "changes",
  "contact",
] as const;

const TOC_IDS = SECTIONS.map((s) => `pp-${s}`);
const NAV_OFFSET = 96;

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>(TOC_IDS[0]);

  useEffect(() => {
    jumpToTop();
  }, []);

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
        .cs-root { padding-top: 78px; min-height: 100vh; background: #0F0F0F; color: #F5F5F5; }
        .cs-page { padding: clamp(28px, 4vh, 52px) 20px clamp(36px, 5.5vh, 60px); }

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

        .cs-col {
          max-width: 880px;
          margin: 0 auto;
          text-align: left;
        }
        .cs-col > section + section { margin-top: clamp(40px, 6.5vh, 80px); }

        .cs-back {
          display: inline-flex; align-items: center;
          font-family: var(--font-sans);
          font-size: 13px; font-weight: 500;
          color: rgba(255, 255, 255, 0.72); text-decoration: none;
          margin-bottom: clamp(24px, 3vh, 36px);
          transition: color 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cs-back:hover { color: #F5F5F5; }

        .cs-h1 {
          font-family: var(--font-sans);
          font-weight: 500; letter-spacing: -0.025em; line-height: 1.15;
          font-size: clamp(1.7rem, 3.6vw, 2.4rem); color: #F5F5F5;
          margin: 0 0 12px; max-width: 24ch;
        }
        .cs-lead {
          font-size: clamp(0.95rem, 1.1vw, 1.05rem); line-height: 1.6;
          color: rgba(255, 255, 255, 0.72); margin: 0 0 clamp(28px, 4vh, 44px);
        }

        .cs-h2 {
          font-family: var(--font-sans);
          font-weight: 500; letter-spacing: -0.025em; line-height: 1.2;
          font-size: clamp(1.25rem, 2.2vw, 1.55rem); color: #F5F5F5;
          margin: 0 0 14px; max-width: 32ch;
        }
        .cs-body {
          font-family: var(--font-sans);
          font-size: clamp(0.95rem, 1.15vw, 1.05rem);
          line-height: 1.65;
          color: #4b5563;
          margin: 0;
          max-width: 64ch;
        }

        /* Shared tokens, same as <Reveal> on the landing page, so the two
           reveal systems cannot drift apart. No blur here on purpose: these
           wrap whole page sections and filter() cost scales with painted area. */
        .cs-reveal {
          opacity: 0;
          transform: translateY(var(--reveal-distance, 20px));
          transition:
            opacity var(--reveal-duration, 800ms) var(--reveal-ease, ease-out),
            transform var(--reveal-duration, 800ms) var(--reveal-ease, ease-out);
        }
        .cs-reveal.is-in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <Navbar />

      <main className="cs-page">
        <div className="cs-layout">
          <aside className="cs-toc">
            <nav>
              {SECTIONS.map((key) => {
                const id = `pp-${key}`;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={activeId === id ? "active" : ""}
                    onClick={handleTocClick(id)}
                  >
                    {t(`privacy.toc.${key}`)}
                  </a>
                );
              })}
            </nav>
          </aside>

          <div className="cs-col">
            <Link to="/" className="cs-back">{t("legal.back_home")}</Link>
            <h1 className="cs-h1">{t("privacy.title")}</h1>
            <p className="cs-lead">{t("legal.last_updated")}</p>

            {SECTIONS.map((key) => (
              <section key={key} id={`pp-${key}`} className="cs-reveal">
                <h2 className="cs-h2">{t(`privacy.${key}_title`)}</h2>
                <p className="cs-body">{t(`privacy.${key}_body`)}</p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <MadeByHumans />
    </div>
  );
};

export default PrivacyPolicy;
