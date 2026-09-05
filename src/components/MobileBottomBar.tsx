import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { scrollToEl } from "@/lib/scroll";
import { PHONE_TEL, PHONE_DISPLAY, EMAIL_ADDRESS } from "@/lib/contact";
import { trackCall } from "@/lib/analytics";
import { trackPixelCall } from "@/lib/marketingPixels";

const PHONE_NUMBER = PHONE_TEL;

/**
 * Floating Action Button (mobile only, <md).
 * - Pill-shaped FAB in bottom-right corner, orange brand, elevated shadow.
 * - On tap, opens a Popover with 3 quick contact actions (call, email, scroll to form).
 * - Reveals after a small scroll so the hero stays unobstructed.
 * - Auto-hides when the footer (#made-by-humans) enters view, so it never overlaps
 *   the final contact icons.
 */
const MobileBottomBar: React.FC = () => {
  const { t } = useTranslation();
  const [pastScroll, setPastScroll] = useState(false);
  const [overFooter, setOverFooter] = useState(false);
  const [open, setOpen] = useState(false);
  const visible = pastScroll && !overFooter;

  useEffect(() => {
    const onScroll = () => {
      setPastScroll(window.scrollY > 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The footer is lazy-loaded, so it is usually not in the DOM yet when this
  // effect first runs. Poll briefly for it, then observe. (The previous
  // selector, `.mbh-section`, no longer existed after the footer redesign —
  // the observer was never attached and the FAB sat on top of the footer's
  // contact rows.)
  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let poll = 0;

    const attach = () => {
      const footer = document.getElementById("made-by-humans");
      if (!footer) return false;
      io = new IntersectionObserver(
        ([entry]) => setOverFooter(entry.isIntersecting),
        { rootMargin: "0px 0px -88px 0px", threshold: 0 }
      );
      io.observe(footer);
      return true;
    };

    if (!attach()) {
      poll = window.setInterval(() => {
        if (attach()) window.clearInterval(poll);
      }, 300);
    }

    return () => {
      if (poll) window.clearInterval(poll);
      io?.disconnect();
    };
  }, []);

  // Close the popover automatically when the FAB hides (scrolled to top or over footer)
  // so it doesn't reopen out-of-view on the next scroll.
  useEffect(() => {
    if (!visible && open) setOpen(false);
  }, [visible, open]);

  const scrollToContact = () => {
    setOpen(false);
    const target = document.getElementById("contact");
    if (!target) return;
    // 100 regardless of viewport: this only ever runs from the mobile bar.
    scrollToEl(target, 100);
  };

  return (
    <>
      <style>{`
        .mbb-shell {
          position: fixed;
          right: 16px;
          bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          z-index: 40;
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px) scale(0.96);
          transition: opacity 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .mbb-shell.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .mbb-fab {
          width: var(--btn-h);
          height: var(--btn-h);
          border-radius: 9999px;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow-sm);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          padding: 0;
          cursor: pointer;
          transition: filter 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
          -webkit-tap-highlight-color: transparent;
        }
        .mbb-fab:hover {
          filter: brightness(var(--btn-gloss-brightness, 1.06));
          box-shadow: var(--btn-gloss-shadow-sm-hover);
        }
        .mbb-fab:active {
          transform: scale(0.96);
        }

        /* Popover panel */
        .mbb-panel {
          width: 260px;
          padding: 8px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(38, 38, 38, 0.06);
          box-shadow:
            0 24px 60px -28px rgba(38, 38, 38, 0.20),
            0 4px 12px -6px rgba(38, 38, 38, 0.06);
          font-family: var(--font-sans);
          /* Anchor scale to the trigger corner — Radix exposes the origin var */
          transform-origin: var(--radix-popover-content-transform-origin);
        }
        .mbb-panel[data-state="open"] {
          animation: mbb-pop-in 180ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .mbb-panel[data-state="closed"] {
          animation: mbb-pop-out 140ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes mbb-pop-in {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes mbb-pop-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.97); }
        }

        .mbb-heading {
          padding: 8px 12px 4px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #5b6470;
        }

        .mbb-action {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          background: transparent;
          border: 0;
          color: #262626;
          font-family: var(--font-sans);
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 150ms ease-out;
          -webkit-tap-highlight-color: transparent;
        }
        .mbb-action:hover {
          background: #FAFAFA;
        }
        .mbb-action:active {
          background: #F5F5F5;
        }

        .mbb-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(237, 92, 27, 0.10);
          color: var(--orange, #ED5C1B);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mbb-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .mbb-label {
          font-size: 14px;
          font-weight: 500;
          color: #262626;
          line-height: 1.2;
        }
        .mbb-detail {
          font-size: 12px;
          color: #6B7280;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (min-width: 768px) {
          .mbb-shell { display: none; }
        }
      `}</style>

      <div
        className={`mbb-shell ${visible ? "is-visible" : ""}`}
        aria-hidden={!visible}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="mbb-fab"
              aria-label={t("fab.aria")}
            >
              <MessageSquare size={22} strokeWidth={2} aria-hidden="true" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            side="top"
            sideOffset={12}
            collisionPadding={16}
            className="mbb-panel p-0 border-0 shadow-none bg-transparent"
          >
            <div className="mbb-heading">{t("fab.heading")}</div>

            <button
              type="button"
              className="mbb-action"
              onClick={scrollToContact}
            >
              <span className="mbb-icon">
                <MessageSquare size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="mbb-text">
                <span className="mbb-label">{t("fab.message")}</span>
              </span>
            </button>

            <a
              href={`tel:${PHONE_NUMBER}`}
              className="mbb-action"
              onClick={() => {
                trackCall("bottom_bar");
                trackPixelCall();
                setOpen(false);
              }}
            >
              <span className="mbb-icon">
                <Phone size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="mbb-text">
                <span className="mbb-label">{t("fab.call")}</span>
                <span className="mbb-detail">{PHONE_DISPLAY}</span>
              </span>
            </a>

            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="mbb-action"
              onClick={() => setOpen(false)}
            >
              <span className="mbb-icon">
                <Mail size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="mbb-text">
                <span className="mbb-label">{t("fab.email")}</span>
                <span className="mbb-detail">{EMAIL_ADDRESS}</span>
              </span>
            </a>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default MobileBottomBar;
