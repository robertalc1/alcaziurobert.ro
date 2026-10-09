import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WHATSAPP_URL } from "@/lib/contact";

/** Mobile WhatsApp shortcut, hidden over the hero and footer. */
const MobileBottomBar: React.FC = () => {
  const { t } = useTranslation();
  const [pastScroll, setPastScroll] = useState(false);
  const [overFooter, setOverFooter] = useState(false);
  const visible = pastScroll && !overFooter;

  useEffect(() => {
    const onScroll = () => setPastScroll(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let poll = 0;
    // The footer is lazy-loaded and may mount after this shortcut.
    const attach = () => {
      const footer = document.getElementById("made-by-humans");
      if (!footer) return false;
      observer = new IntersectionObserver(
        ([entry]) => setOverFooter(entry.isIntersecting),
        { rootMargin: "0px 0px -88px 0px", threshold: 0 }
      );
      observer.observe(footer);
      return true;
    };
    if (!attach()) {
      poll = window.setInterval(() => {
        if (attach()) window.clearInterval(poll);
      }, 300);
    }
    return () => {
      if (poll) window.clearInterval(poll);
      observer?.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        .mbb-shell {
          position: fixed;
          left: 50%;
          bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          z-index: 40;
          width: max-content;
          max-width: calc(100% - 32px);
          pointer-events: none;
          visibility: hidden;
          opacity: 0;
          transform: translate(-50%, 10px) scale(0.96);
          transition: opacity 220ms var(--ease-out-quart),
                      transform 220ms var(--ease-out-quart), visibility 220ms;
        }
        .mbb-shell.is-visible {
          visibility: visible;
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
          pointer-events: auto;
        }
        .mbb-fab {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 54px;
          padding: 6px 16px 6px 6px;
          border-radius: var(--r-pill);
          background: var(--btn-gloss);
          /* The site's inset finish, with no outer glow. */
          box-shadow: var(--btn-gloss-shadow-flat);
          color: #fff;
          font-family: var(--font-sans);
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
          transition: filter 160ms var(--ease-out-quart), transform 160ms var(--ease-out-quart);
        }
        @media (hover: hover) {
          .mbb-fab:hover { filter: brightness(var(--btn-gloss-brightness)); }
        }
        .mbb-fab:active { transform: scale(0.97); }
        .mbb-fab:focus-visible { outline: 2px solid var(--brand-strong); outline-offset: 4px; }
        .mbb-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
        }
        .mbb-avatar img { width: 29px; height: 25px; object-fit: contain; }
        .mbb-text { display: flex; flex-direction: column; text-align: left; }
        .mbb-name { font-size: 14px; font-weight: 700; line-height: 1.2; }
        .mbb-detail { margin-top: 1px; font-size: 12px; font-weight: 500; line-height: 1.25; white-space: nowrap; }
        .mbb-whatsapp { flex-shrink: 0; margin-left: 4px; }
        @media (min-width: 768px) { .mbb-shell { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .mbb-shell, .mbb-fab { transition: none; }
          .mbb-fab:active { transform: none; }
        }
      `}</style>
      <div className={`mbb-shell ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
        <a className="mbb-fab" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
          aria-label={t("fab.aria")} tabIndex={visible ? 0 : -1}>
          <span className="mbb-avatar" aria-hidden="true">
            <img src="/logo-mark-white.svg" alt="" width={29} height={25} />
          </span>
          <span className="mbb-text">
            <span className="mbb-name">Alcaziu Robert</span>
            <span className="mbb-detail">{t("fab.whatsapp")}</span>
          </span>
          <svg className="mbb-whatsapp" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.6-5.3A8.5 8.5 0 1 1 21 11.5Z" />
            <path d="M8.6 9.1c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.4c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3 0 .6a7 7 0 0 0 2.8 2.3c.3.1.5.1.6 0l.5-.6c.2-.2.4-.2.6-.1l1.4.7c.3.1.4.3.4.5 0 .6-.4 1.3-1.5 1.5-1 .2-2.6-.3-4.2-1.6a9 9 0 0 1-2.6-3.6c-.3-1-.2-1.8.1-2.3Z" />
          </svg>
        </a>
      </div>
    </>
  );
};

export default MobileBottomBar;
