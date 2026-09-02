"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { startLenis, stopLenis } from "@/lib/lenis";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ContactCTA from "@/components/ContactCTA";

const ANCHOR_IDS = ["work", "process", "results", "faq"] as const;

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

  // Escape closes the fullscreen menu, Tab stays trapped inside it, and body
  // scroll is locked while it is open. Focus returns to the trigger on close.
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
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    // The overlay owns the screen, so the smooth-scroll layer has to let go.
    // Left running, the wheel keeps advancing its internal target behind the
    // overlay and closing the menu snaps the page to wherever that drifted.
    stopLenis();
    window.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      startLenis();
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
                <span className="nav-ov-index">0{i + 1}</span>
                <span className="nav-ov-text">{t(`nav.${id}`)}</span>
              </a>
            </li>
          ))}
          <li
            className="nav-ov-item"
            style={{ ["--i" as string]: ANCHOR_IDS.length } as React.CSSProperties}
          >
            <Link to="/studii-de-caz" className="nav-ov-link" onClick={closeMenu}>
              <span className="nav-ov-index">0{ANCHOR_IDS.length + 1}</span>
              <span className="nav-ov-text">{t("nav.casestudy")}</span>
            </Link>
          </li>
        </ul>

        <div className="nav-ov-aside">
          <ContactCTA>
            <button type="button" className="nav-ov-cta" onClick={closeMenu}>
              {t("nav.cta")}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </button>
          </ContactCTA>

          <div className="nav-ov-contact">
            <a href="tel:+40773858164">+40 773 858 164</a>
            <a href="mailto:contact@alcaziurobert.ro">contact@alcaziurobert.ro</a>
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
        .site-nav {
          position: fixed;
          top: 0; left: 0;
          z-index: 60;
          width: 100%;
          height: 78px;
          display: flex;
          align-items: center;
          background: transparent;
          border-bottom: 1px solid transparent;
          transition: height .24s cubic-bezier(.23,1,.32,1),
                      background-color .3s ease,
                      border-color .3s ease,
                      opacity .25s ease;
        }
        /* Glass, not a tinted panel. The old values were 0.82 alpha over a 14px
           blur — at that opacity the blur is doing almost nothing, so we were
           paying for an expensive filter and getting a flat bar. Dropping the
           fill to ~0.55 is what lets the blur read. Saturate stays low: at this
           alpha, 140% makes the orange CTA behind the bar bloom. */
        .site-nav.is-scrolled {
          height: 66px;
          background: var(--nav-glass-bg);
          -webkit-backdrop-filter: saturate(130%) blur(var(--nav-glass-blur));
          backdrop-filter: saturate(130%) blur(var(--nav-glass-blur));
          border-bottom-color: rgba(255, 255, 255, 0.09);
        }
        /* Without the filter, a 0.55 fill is unreadable — fall back to opaque. */
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .site-nav.is-scrolled { background: rgba(12, 12, 12, 0.94); }
        }
        /* The fullscreen menu owns the screen — the bar steps out of the way. */
        .site-nav.is-menu-open { opacity: 0; pointer-events: none; }

        .nav-inner {
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
          padding: 0 clamp(16px, 3.4vw, 44px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

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
          /* Warm halo tied to the hero shader behind the bar. drop-shadow (not
             box-shadow) so the glow follows the mark's alpha, not its box.
             Two stops: a tight core that keeps the edges crisp against the
             glass, and a wide soft one that reads as light, not as a border. */
          filter: drop-shadow(0 0 3px rgba(237, 92, 27, 0.34))
                  drop-shadow(0 0 14px rgba(237, 92, 27, 0.20));
          animation: nav-logo-glow 7s ease-in-out infinite;
          transition: filter 320ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        /* Slow breathe — under one cycle per 7s it registers as the mark being
           lit rather than as an animation asking for attention. */
        @keyframes nav-logo-glow {
          0%, 100% {
            filter: drop-shadow(0 0 3px rgba(237, 92, 27, 0.30))
                    drop-shadow(0 0 12px rgba(237, 92, 27, 0.16));
          }
          50% {
            filter: drop-shadow(0 0 4px rgba(237, 92, 27, 0.42))
                    drop-shadow(0 0 20px rgba(237, 92, 27, 0.26));
          }
        }
        .nav-logo:hover img {
          animation: none;
          filter: drop-shadow(0 0 5px rgba(237, 92, 27, 0.55))
                  drop-shadow(0 0 24px rgba(237, 92, 27, 0.38));
          transform: translateY(-1px);
        }
        .nav-logo:active img { transform: scale(0.97); }
        /* On the scrolled glass bar the backdrop is darker and the halo blooms;
           pull it back so the bar stays a surface, not a light source. */
        .site-nav.is-scrolled .nav-logo img {
          filter: drop-shadow(0 0 3px rgba(237, 92, 27, 0.26))
                  drop-shadow(0 0 12px rgba(237, 92, 27, 0.14));
          animation: none;
        }
        .site-nav.is-scrolled .nav-logo:hover img {
          filter: drop-shadow(0 0 5px rgba(237, 92, 27, 0.48))
                  drop-shadow(0 0 20px rgba(237, 92, 27, 0.30));
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2vw, 26px);
        }

        /* Discreet inline language toggle — no boxed pill in the bar */
        .site-nav .lang-switch {
          background: transparent;
          border: none;
          -webkit-backdrop-filter: none;
          backdrop-filter: none;
          margin-right: 0;
          padding: 0;
          gap: 4px;
        }
        .site-nav .lang-btn {
          padding: 6px 8px;
          min-height: 32px;
          font-size: 12.5px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.58);
        }
        .site-nav .lang-btn:hover { color: #FFFFFF; }
        .site-nav .lang-btn.active { color: #FFFFFF; background: transparent; }
        .site-nav .lang-btn.active::after {
          content: '';
          display: block;
          height: 1.5px;
          margin-top: 3px;
          background: #ED5C1B;
          border-radius: 2px;
        }
        @media (max-width: 520px) {
          .site-nav .lang-switch { display: none; }
        }

        /* Menu trigger — label + burger, matching the reference bar */
        .nav-menu-trigger {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          padding: 8px 2px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.92);
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 15px;
          letter-spacing: -0.005em;
          transition: color .25s ease;
        }
        .nav-menu-trigger:hover { color: #FFFFFF; }
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
        @media (max-width: 400px) {
          .nav-menu-label { display: none; }
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
          filter: brightness(var(--btn-gloss-brightness, 1.06));
          box-shadow: var(--btn-gloss-shadow-sm-hover);
          transform: translateY(-1px);
        }
        .nav-cta:active { transform: scale(0.97); }
        @media (max-width: 767px) {
          /* 44px minimum touch targets — most of the traffic is phones */
          .nav-menu-trigger { padding: 11px 6px; min-height: 44px; min-width: 44px; justify-content: center; }
          .nav-logo { padding: 7px 2px; }
        }

        /* ─────────────────────── FULLSCREEN MENU ─────────────────────── */
        .nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          flex-direction: column;
          background: #121212;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: clamp(20px, 4vh, 40px) clamp(20px, 5vw, 96px) clamp(24px, 4vh, 44px);
          animation: navOverlayIn .42s cubic-bezier(.16,1,.3,1) both;
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
          background-image: linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: calc(100% / 6) 100%;
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
        }
        @media (max-width: 768px) {
          .nav-overlay-grid { background-size: calc(100% / 3) 100%; }
        }

        .nav-close {
          position: absolute;
          top: clamp(18px, 3.2vh, 34px);
          right: clamp(18px, 3.4vw, 44px);
          z-index: 2;
          width: var(--btn-h); height: var(--btn-h);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          /* Brighter rim than the standard steel: this is the only way out of
             a fullscreen overlay, so it has to read at a glance. */
          border: 1px solid var(--btn-steel-border-hover);
          background: var(--btn-steel);
          box-shadow: var(--btn-steel-shadow);
          color: #F5F5F5;
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
          background: var(--btn-steel-hover);
          border-color: rgba(255, 255, 255, 0.5);
          color: #ffffff;
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
          gap: clamp(14px, 1.6vw, 26px);
          text-decoration: none;
          color: #F5F5F5;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(2.1rem, 6.2vw, 4.6rem);
          line-height: 1.12;
          letter-spacing: -0.035em;
          transition: color .3s cubic-bezier(.23,1,.32,1);
        }
        .nav-ov-index {
          font-size: clamp(11px, 0.9vw, 13px);
          font-weight: 500;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.42);
          transition: color .3s ease;
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
          background: #ED5C1B;
          transition: width .35s cubic-bezier(.23,1,.32,1);
        }
        .nav-ov-link:hover { color: #ED5C1B; }
        .nav-ov-link:hover .nav-ov-index { color: rgba(237, 92, 27, 0.85); }
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
          filter: brightness(var(--btn-gloss-brightness, 1.06));
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
          color: rgba(255, 255, 255, 0.76);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.005em;
          transition: color .25s ease;
        }
        .nav-ov-contact a:hover { color: #FFFFFF; }

        .nav-overlay-foot {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          padding-top: clamp(18px, 2.4vh, 26px);
          border-top: 1px solid rgba(255, 255, 255, 0.10);
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
          color: rgba(255, 255, 255, 0.66);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          transition: color .25s ease;
        }
        .nav-ov-legal a:hover { color: #ED5C1B; }

        /* Language switcher inside the dark overlay */
        .nav-overlay .lang-switch {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          margin-right: 0;
        }
        .nav-overlay .lang-btn { color: rgba(255, 255, 255, 0.62); }
        .nav-overlay .lang-btn:hover { color: #FFFFFF; }
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
          /* Glow stays — it is colour, not motion. Only the breathe stops. */
          .nav-logo img { animation: none; }
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

          {/* LANGUAGE + MENU TRIGGER + CTA */}
          <div className="nav-actions">
            <LanguageSwitcher />

            <button
              type="button"
              ref={triggerRef}
              className="nav-menu-trigger"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-haspopup="dialog"
            >
              <span className="nav-menu-label">{t("nav.menu")}</span>
              <span className="nav-burger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>

            <ContactCTA>
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
