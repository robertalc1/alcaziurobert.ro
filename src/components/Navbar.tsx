"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ContactCTA from "@/components/ContactCTA";
import { PHONE_TEL, PHONE_DISPLAY, EMAIL_ADDRESS } from "@/lib/contact";
import { trackCall } from "@/lib/analytics";
import { trackPixelCall } from "@/lib/marketingPixels";

// Order mirrors the page. A menu that lists sections in a different order than
// the visitor meets them feels broken the first time it is used.
// "results" is gone with the testimonials section — it owned that anchor, and
// a menu entry pointing at a missing id is a dead link, not a missing section.
const ANCHOR_IDS = ["offer", "work", "process", "faq"] as const;

// Same path as the footer's phone row (MadeByHumans). One glyph for the number
// wherever it appears, rather than a second phone icon drawn slightly
// differently on the same page.
const PhoneGlyph = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 16.92v2.1a2 2 0 0 1-2.18 2 19.6 19.6 0 0 1-8.58-3.06 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3.06-8.58A2 2 0 0 1 4.18 2h2.1A2 2 0 0 1 8.2 3.72l.67 2a2 2 0 0 1-.46 2.02L7.3 8.9a16.5 16.5 0 0 0 7.8 7.8l1.15-1.11a2 2 0 0 1 2.02-.46l2 .67A2 2 0 0 1 22 16.92Z" />
  </svg>
);

// How long the overlay's exit animation runs — keep in sync with `navOverlayOut`.
const CLOSE_MS = 300;

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const scrolled = useScroll(10);

  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const closeTimer = React.useRef<number | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const visible = open || closing;

  const isHome = location.pathname === "/";

  const closeMenu = React.useCallback(() => {
    setOpen((wasOpen) => {
      if (wasOpen) {
        setClosing(true);
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setClosing(false), CLOSE_MS);
      }
      return false;
    });
  }, []);

  React.useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  // Page scroll is locked on the root element while the menu is open — see
  // use-scroll-lock for why `body { overflow: hidden }`, which is what this
  // component used to do, locked nothing at all on phones.
  useScrollLock(open);

  // Escape closes the fullscreen menu and Tab stays trapped inside it. Focus
  // returns to the trigger on close.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;
      const focusables = overlayRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !overlayRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const trigger = triggerRef.current;
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      trigger?.focus({ preventScroll: true });
    };
  }, [open, closeMenu]);

  // Route changes always dismiss the menu.
  React.useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // scrollToTop imported from lib/scroll — routed through the smooth layer.

  // Logo: scroll to top on the homepage, otherwise navigate home.
  // Both call entry points in this component report the same event with a
  // different source, so the two can be told apart in GA without a second
  // event name. Consent gating lives inside the two helpers.
  const handleCall = (source: string) => () => {
    trackCall(source);
    trackPixelCall();
  };

  const handleLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    if (isHome) scrollToTop();
    else navigate("/");
  };

  // Anchor links work from any route: scroll on home, navigate+scroll elsewhere.
  // From inside the overlay we wait out the exit animation before scrolling so
  // the user actually sees where the page lands.
  const handleAnchor =
    (id: string, fromOverlay = false) =>
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (fromOverlay) closeMenu();
      if (!isHome) {
        navigate("/", { state: { scrollTo: id } });
        return;
      }
      if (fromOverlay) window.setTimeout(() => scrollToId(id), CLOSE_MS - 60);
      else scrollToId(id);
    };

  const overlay = (
    <div
      ref={overlayRef}
      id="site-menu"
      className={cn("nav-overlay", closing && !open && "is-closing")}
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.menu")}
    >
      <div className="nav-overlay-grid" aria-hidden="true" />

      <button
        type="button"
        className="nav-close"
        onClick={closeMenu}
        aria-label={t("nav.close")}
        autoFocus
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <nav className="nav-overlay-main" aria-label={t("nav.menu")}>
        <ul className="nav-ov-list">
          {ANCHOR_IDS.map((id, i) => (
            <li
              key={id}
              className="nav-ov-item"
              style={{ ["--i" as string]: i } as React.CSSProperties}
            >
              <a
                href={`#${id}`}
                className="nav-ov-link"
                onClick={handleAnchor(id, true)}
              >
                <span className="nav-ov-text">{t(`nav.${id}`)}</span>
              </a>
            </li>
          ))}
          <li
            className="nav-ov-item"
            style={{ ["--i" as string]: ANCHOR_IDS.length } as React.CSSProperties}
          >
            <Link to="/studii-de-caz" className="nav-ov-link" onClick={closeMenu}>
              <span className="nav-ov-text">{t("nav.casestudy")}</span>
            </Link>
          </li>
        </ul>

        <div className="nav-ov-aside">
          <ContactCTA mode="modal">
            <button type="button" className="nav-ov-cta" onClick={closeMenu}>
              {t("nav.cta")}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </button>
          </ContactCTA>

          <div className="nav-ov-contact">
            <a href={`tel:${PHONE_TEL}`} onClick={handleCall("menu")}>
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
          </div>
        </div>
      </nav>

      <div className="nav-overlay-foot">
        <div className="nav-ov-legal">
          <Link to="/termeni-si-conditii" onClick={closeMenu}>
            {t("footer.terms_link")}
          </Link>
          <Link to="/politica-de-confidentialitate" onClick={closeMenu}>
            {t("footer.privacy_link")}
          </Link>
          <Link to="/politica-de-cookie-uri" onClick={closeMenu}>
            {t("footer.cookies_link")}
          </Link>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  );

  return (
    <>
      <header className={cn("site-nav", scrolled && "is-scrolled", open && "is-menu-open")}>
        <style>{`
        /* ─────────────────────────── TOP BAR ─────────────────────────── */
        /* The bar is opaque from the first frame now, not a transparent overlay
           that fills in on scroll. It has to be: the hero is a panel inset from
           the viewport edges rather than a full-bleed background, so there is
           light page either side of it and a transparent bar would float over
           nothing. 72px is instantly.ai's measured height. */
        .site-nav {
          position: fixed;
          /* Reads the announcement bar's published height. When the bar is
             dismissed --bar-h becomes 0px and the nav slides up on its own. */
          top: var(--bar-h);
          left: 0;
          z-index: 60;
          width: 100%;
          /* Fixed at instantly's 72px. It used to shrink to 66 on scroll; that
             is gone, because the grid now depends on the nav being one known
             height — the hero pads itself by --nav-h. */
          height: var(--nav-h);
          display: flex;
          align-items: center;
          background: var(--page);
          border-bottom: 1px solid transparent;
          transition: top .25s cubic-bezier(.23,1,.32,1),
                      background-color .3s ease,
                      border-color .3s ease,
                      opacity .25s ease;
        }
        /* Scrolled: the fill goes translucent so the blur has something to do,
           and the hairline appears. That hairline is the only thing separating
           the bar from the page — on a light design it does the whole job that
           a shadow would do badly. */
        .site-nav.is-scrolled {
          background: var(--nav-glass-bg);
          -webkit-backdrop-filter: blur(var(--nav-glass-blur));
          backdrop-filter: blur(var(--nav-glass-blur));
          border-bottom-color: var(--nav-glass-line);
        }
        /* Without the filter, a 0.72 fill is muddy — fall back to opaque. */
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .site-nav.is-scrolled { background: rgba(255, 255, 255, 0.97); }
        }
        /* The fullscreen menu owns the screen — the bar steps out of the way. */
        .site-nav.is-menu-open { opacity: 0; pointer-events: none; }

        .nav-inner {
          width: 100%;
          max-width: var(--w-page);
          margin: 0 auto;
          padding: 0 var(--page-gutter);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-32);
        }
        @media (max-width: 991px) { .nav-inner { padding: 0 var(--sp-32); } }
        @media (max-width: 767px) { .nav-inner { padding: 0 var(--sp-24); } }

        .nav-logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          line-height: 1;
          text-decoration: none;
        }
        .nav-logo img {
          /* Mark is wider than tall (222x128) — size by height, keep the ratio */
          height: 30px;
          width: auto;
          user-select: none;
          transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
          /* No halo. The mark's rays are black on transparent, so on the dark
             bar they were invisible and an orange drop-shadow was the only
             thing making it legible. On the light bar the artwork reads on its
             own and the glow would be a smudge — the mark is finally being
             shown as drawn. Do not put the drop-shadow back. */
        }
        .nav-logo:hover img { transform: translateY(-1px); }
        .nav-logo:active img { transform: scale(0.97); }

        /* ── Inline section links (>=1024px) ──
           Centred in the bar, the way instantly.ai centres its menu. Grey at
           rest, ink on hover — the same two-value treatment as every other
           piece of secondary text on the page. No underline, no pill: the
           orange CTA to their right is the only thing in the bar that is
           allowed to look clickable at a glance. */
        .nav-links {
          display: none;
          align-items: center;
          gap: clamp(18px, 2vw, 34px);
        }
        @media (min-width: 1024px) {
          .nav-links { display: flex; }
        }
        .nav-link {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: normal;
          color: var(--ink);
          text-decoration: none;
          white-space: nowrap;
          transition: color .22s ease;
        }
        .nav-link:hover { color: var(--brand); }
        .nav-link:focus-visible {
          outline: 2px solid rgba(69, 128, 247, 0.65);
          outline-offset: 4px;
          border-radius: 4px;
        }

        /* Tighter than before: three items where there were four, and two of
           them are now icon buttons carrying their own 44px padding, so the
           old gap left the cluster looking scattered. */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: clamp(4px, 1vw, 12px);
        }
        /* The CTA is the one thing in the row that is not a bare icon; it gets
           the separation the uniform gap no longer provides. */
        .nav-actions .nav-cta { margin-left: clamp(6px, 1vw, 14px); }


        /* Call and menu are one pair of icon-only buttons: same 44x44 target
           at every width, same resting colour, same hover. The trigger used to
           be a text label plus a burger at padding 8px 2px, which on a
           pointer device was a 20px-tall target — under the 44px floor the rest
           of the site's buttons hold (--btn-h in index.css). */
        .nav-phone,
        .nav-menu-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          color: var(--ink-2);
          transition: color .25s ease, background-color .25s ease;
        }
        .nav-phone:hover,
        .nav-menu-trigger:hover {
          color: var(--ink);
          background: rgba(10, 10, 10, 0.05);
        }
        .nav-phone:focus-visible,
        .nav-menu-trigger:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }
        .nav-phone:active,
        .nav-menu-trigger:active { transform: scale(0.94); }
        .nav-phone svg {
          width: 19px;
          height: 19px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .nav-burger {
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 22px;
        }
        .nav-burger span {
          display: block;
          height: 1.6px;
          width: 100%;
          background: currentColor;
          border-radius: 2px;
          transition: transform .3s cubic-bezier(.23,1,.32,1),
                      width .3s cubic-bezier(.23,1,.32,1);
        }
        .nav-menu-trigger:hover .nav-burger span:nth-child(1) { width: 86%; }
        .nav-menu-trigger:hover .nav-burger span:nth-child(3) { width: 70%; }
        /* Above 1024 the sections are already in the bar, so the burger would
           open an overlay listing the same five links. It goes. */
        @media (min-width: 1024px) {
          .nav-menu-trigger { display: none; }
        }

        /* NAV CTA — compact orange pill, mirrors the hero primary button */
        .nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--btn-gap);
          padding: 0 var(--btn-px);
          min-height: var(--btn-h);
          border-radius: 9999px;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow-sm);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--btn-font);
          letter-spacing: -0.005em;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          transition: filter 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .nav-cta:hover {
          background: var(--btn-gloss-hover);
          box-shadow: var(--btn-gloss-shadow-sm-hover);
          transform: translateY(-1px);
        }
        .nav-cta:active { transform: scale(0.97); }
        @media (max-width: 767px) {
          /* 44px minimum touch targets — most of the traffic is phones */
          /* .nav-phone / .nav-menu-trigger are already 44x44 at every width. */
          .nav-logo { padding: 7px 2px; }
          /* The .site-nav .lang-btn rule above is more specific than the
             component's own mobile rule, so without this the language buttons
             stayed at 32px on phones while everything else moved to 44px. */
        }

        /* ─────────────────────── FULLSCREEN MENU ─────────────────────── */
        .nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          flex-direction: column;
          background: var(--page);
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: clamp(20px, 4vh, 40px) clamp(20px, 5vw, 96px) clamp(24px, 4vh, 44px);
          animation: navOverlayIn .42s cubic-bezier(.16,1,.3,1) both;
          /* inset:0 alone sizes the box from the layout viewport, which on a
             phone lags behind the visible area while the browser toolbar slides
             in and out — that lag is the strip of page that shows through at
             the bottom. dvh tracks the toolbar; vh stays as the fallback. */
          height: 100vh;
          height: 100dvh;
          /* Home indicator and notch: without this the legal row and the
             language switcher sit underneath the phone's own chrome. */
          padding-bottom: calc(clamp(24px, 4vh, 44px) + env(safe-area-inset-bottom, 0px));
          padding-top: calc(clamp(20px, 4vh, 40px) + env(safe-area-inset-top, 0px));
        }
        .nav-overlay.is-closing {
          animation: navOverlayOut ${CLOSE_MS}ms cubic-bezier(.4,0,1,1) both;
          pointer-events: none;
        }
        @keyframes navOverlayIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes navOverlayOut {
          from { opacity: 1; transform: none; }
          to   { opacity: 0; transform: translateY(-8px); }
        }

        /* Faint editorial column rules, like the reference */
        .nav-overlay-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px);
          background-size: calc(100% / 6) 100%;
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
        }
        @media (max-width: 768px) {
          .nav-overlay-grid { background-size: calc(100% / 3) 100%; }
        }

        .nav-close {
          position: absolute;
          top: calc(clamp(18px, 3.2vh, 34px) + env(safe-area-inset-top, 0px));
          right: clamp(18px, 3.4vw, 44px);
          z-index: 2;
          width: var(--btn-h); height: var(--btn-h);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          /* Brighter rim than the standard steel: this is the only way out of
             a fullscreen overlay, so it has to read at a glance. */
          border: 1px solid var(--line-2);
          background: var(--surface);
          color: var(--ink);
          cursor: pointer;
          transition: border-color .25s ease, color .25s ease,
                      transform .35s cubic-bezier(.23,1,.32,1);
        }
        /* The pill is round — the global focus ring's 10px radius would draw a
           rounded square around it. */
        .nav-close:focus-visible { border-radius: 9999px; }
        .nav-close svg {
          width: 20px; height: 20px;
          fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round;
        }
        .nav-close:hover {
          border-color: var(--ink);
          transform: rotate(90deg);
        }
        @media (max-width: 640px) {
          .nav-close svg { width: 18px; height: 18px; }
        }

        .nav-overlay-main {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(32px, 6vw, 80px);
          flex-wrap: wrap;
          padding: clamp(48px, 8vh, 96px) 0 clamp(24px, 4vh, 48px);
        }

        .nav-ov-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(2px, 0.8vh, 10px);
        }
        .nav-ov-item {
          animation: navItemIn .6s cubic-bezier(.16,1,.3,1) both;
          animation-delay: calc(0.06s * var(--i, 0) + 0.12s);
        }
        @keyframes navItemIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: none; }
        }
        .nav-ov-link {
          display: inline-flex;
          align-items: baseline;
          text-decoration: none;
          color: var(--ink);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(2.1rem, 6.2vw, 4.6rem);
          line-height: 1.12;
          letter-spacing: -0.035em;
          transition: color .3s cubic-bezier(.23,1,.32,1);
        }
        .nav-ov-text {
          position: relative;
          display: inline-block;
        }
        .nav-ov-text::after {
          content: '';
          position: absolute;
          left: 0; bottom: 0.12em;
          height: 2px; width: 0;
          background: var(--brand);
          transition: width .35s cubic-bezier(.23,1,.32,1);
        }
        .nav-ov-link:hover { color: var(--brand); }
        .nav-ov-link:hover .nav-ov-text::after { width: 100%; }

        .nav-ov-aside {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(18px, 2.6vh, 28px);
          animation: navItemIn .6s cubic-bezier(.16,1,.3,1) both;
          animation-delay: .42s;
        }
        .nav-ov-cta {
          display: inline-flex;
          align-items: center;
          gap: var(--btn-gap);
          min-height: var(--btn-h);
          padding: 0 var(--btn-px);
          border-radius: 9999px;
          border: none;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--btn-font);
          letter-spacing: -0.005em;
          cursor: pointer;
          transition: filter .25s ease, box-shadow .25s ease,
                      transform .2s cubic-bezier(.23,1,.32,1);
        }
        .nav-ov-cta svg {
          width: 15px; height: 15px;
          fill: none; stroke: currentColor; stroke-width: 2;
          stroke-linecap: round; stroke-linejoin: round;
          transition: transform .25s cubic-bezier(.23,1,.32,1);
        }
        .nav-ov-cta:hover {
          background: var(--btn-gloss-hover);
          box-shadow: var(--btn-gloss-shadow-hover);
          transform: translateY(-1px);
        }
        .nav-ov-cta:hover svg { transform: translate(2px, -2px); }
        .nav-ov-cta:active { transform: scale(0.98); }

        .nav-ov-contact {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nav-ov-contact a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.005em;
          transition: color .25s ease;
        }
        .nav-ov-contact a:hover { color: var(--ink); }

        .nav-overlay-foot {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          padding-top: clamp(18px, 2.4vh, 26px);
          border-top: 1px solid var(--line);
          animation: navItemIn .6s cubic-bezier(.16,1,.3,1) both;
          animation-delay: .5s;
        }
        .nav-ov-legal {
          display: flex;
          align-items: center;
          gap: clamp(16px, 2.4vw, 32px);
          flex-wrap: wrap;
        }
        .nav-ov-legal a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          transition: color .25s ease;
        }
        .nav-ov-legal a:hover { color: var(--brand); }

        /* Language switcher inside the dark overlay */
        .nav-overlay .lang-switch {
          background: var(--surface);
          border-color: var(--line-2);
          margin-right: 0;
        }
        .nav-overlay .lang-btn { color: var(--text-muted); }
        .nav-overlay .lang-btn:hover { color: var(--ink); }
        .nav-overlay .lang-btn.active {
          color: #FFFFFF;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow-flat);
        }

        @media (max-width: 900px) {
          .nav-overlay-main {
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-overlay,
          .nav-overlay.is-closing,
          .nav-ov-item,
          .nav-ov-aside,
          .nav-overlay-foot { animation: none; }
          .nav-close:hover { transform: none; }
          .nav-logo:hover img,
          .nav-logo:active img { transform: none; }
        }
      `}</style>

        <div className="nav-inner">
          {/* LOGO + NAME */}
          <a
            href="/"
            onClick={handleLogo}
            className="nav-logo"
            aria-label="Alcaziu Robert - Home"
          >
            <img src="/logo-mark.webp" alt="" width={52} height={30} />
          </a>

          {/* Inline section links, >=1024px only. The anchors already existed
              inside the fullscreen menu; on a light bar with room to spare
              there is no reason to make a desktop visitor open an overlay to
              find out what is on the page. Below 1024 they collapse back into
              the burger, which stays the only navigation on phones. */}
          <nav className="nav-links" aria-label={t("nav.menu")}>
            {ANCHOR_IDS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="nav-link"
                onClick={handleAnchor(id)}
              >
                {t(`nav.${id}`)}
              </a>
            ))}
            <Link to="/studii-de-caz" className="nav-link">
              {t("nav.casestudy")}
            </Link>
          </nav>

          {/* CALL + MENU TRIGGER + CTA.
              The EN/RO switcher used to open this row. It now lives in the menu
              overlay's footer, where it already had a second instance: nothing
              in the bar should cost a tap without moving someone toward the
              form or the phone, and a language toggle is the one control here
              that no buying visitor uses. */}
          <div className="nav-actions">
            <a
              className="nav-phone"
              href={`tel:${PHONE_TEL}`}
              onClick={handleCall("navbar")}
              // Icon-only, so the number carries the accessible name — "call"
              // alone would leave a screen-reader user with no idea what they
              // are about to dial.
              aria-label={`${t("nav.call")} ${PHONE_DISPLAY}`}
            >
              {PhoneGlyph}
            </a>

            <button
              type="button"
              ref={triggerRef}
              className="nav-menu-trigger"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-haspopup="dialog"
              // The burger is aria-hidden and the word "Meniu" is gone, so this
              // label is the button's only accessible name.
              aria-label={t("nav.menu")}
            >
              <span className="nav-burger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>

            <ContactCTA mode="modal">
              <button type="button" className="nav-cta">
                {t("nav.cta")}
              </button>
            </ContactCTA>
          </div>
        </div>
      </header>

      {visible && typeof document !== "undefined"
        ? createPortal(overlay, document.body)
        : null}
    </>
  );
};

export default Navbar;
