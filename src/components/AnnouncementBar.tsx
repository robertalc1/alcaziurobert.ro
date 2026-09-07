"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";

const STORAGE_KEY = "bar-dismissed";

/**
 * The blue strip above the navbar, matching instantly.ai's announcement bar.
 *
 * It owns `--bar-h` on <html>, and that is the whole trick: the navbar is
 * `position: fixed; top: var(--bar-h)` and the hero pads itself by the same
 * variable, so dismissing the bar moves everything up without a single
 * hardcoded offset anywhere else. When the bar is closed the variable goes to
 * 0px and the page closes the gap on its own.
 *
 * Deliberately NOT carrying an emoji, even though instantly's does: PRODUCT.md
 * lists emoji in copy under the hard bans. The bar reads fine without one.
 *
 * The dismissal is per-browser and permanent (localStorage, same pattern as
 * use-cookie-consent). It is wrapped in try/catch because Safari private mode
 * throws on access rather than returning null.
 */
const AnnouncementBar: React.FC = () => {
  const { t } = useTranslation();

  // Start hidden and reveal after the storage read, so a returning visitor who
  // already dismissed it never sees a frame of the bar and never sees the page
  // jump down and back up.
  const [ready, setReady] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* private mode — treat as not dismissed */
    }
    setOpen(!dismissed);
    setReady(true);
  }, []);

  // Publish the height as a CSS variable for the navbar and the hero to read.
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bar-h", open ? "var(--bar-h-base)" : "0px");
    // Braces on purpose: removeProperty returns a string, and a concise arrow
    // body would make this cleanup return it, which is not a valid Destructor.
    return () => {
      root.style.removeProperty("--bar-h");
    };
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* nothing to do — it just reappears next visit */
    }
  };

  if (!ready || !open) return null;

  return (
    <div className="bar" role="region" aria-label={t("bar.text")}>
      <style>{`
        .bar {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 70;
          width: 100%;
          height: var(--bar-h-base);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 48px;
          background: var(--brand);
          color: #FFFFFF;
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.005em;
          text-align: center;
        }
        .bar-text { margin: 0; }
        .bar-cta {
          color: #FFFFFF;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          background: none;
          border: 0;
          padding: 0;
          font: inherit;
          cursor: pointer;
          white-space: nowrap;
        }
        .bar-cta:hover { text-decoration-thickness: 2px; }
        .bar-close {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #FFFFFF;
          cursor: pointer;
          opacity: 0.85;
          transition: opacity .2s ease, background-color .2s ease;
        }
        .bar-close:hover { opacity: 1; background: rgba(255, 255, 255, 0.16); }
        .bar-close svg { width: 16px; height: 16px; }
        .bar-close:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }

        /* Phones: the sentence and the link stack, so the bar grows. The height
           is a variable rather than a literal precisely so this case does not
           need the navbar to know anything about it. */
        @media (max-width: 767px) {
          .bar {
            font-size: 13.5px;
            padding: 0 44px 0 16px;
            gap: 6px;
            line-height: 1.3;
          }
        }
      `}</style>

      <p className="bar-text">{t("bar.text")}</p>
      <ContactCTA mode="modal">
        <button type="button" className="bar-cta">
          {t("bar.cta")} &rarr;
        </button>
      </ContactCTA>

      <button
        type="button"
        className="bar-close"
        onClick={dismiss}
        aria-label={t("bar.close")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
};

export default AnnouncementBar;
