"use client";

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { scrollToId } from "@/lib/scroll";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ContactCTA from "@/components/ContactCTA";

const ANCHOR_IDS = ["work", "process", "results", "faq"] as const;

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const scrolled = useScroll(10);

  const isHome = location.pathname === "/";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Logo: scroll to top on the homepage, otherwise navigate home.
  const handleLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHome) scrollToTop();
    else navigate("/");
  };

  // Anchor links work from any route: scroll on home, navigate+scroll elsewhere.
  const handleAnchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHome) scrollToId(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  return (
    <header
      className={cn(
        "fixed left-1/2 z-50 -translate-x-1/2 w-full",
        "transition-all duration-300 ease-out",
        "border-transparent border-b",
        scrolled
          ? [
              "top-0 md:top-3",
              "max-w-7xl md:max-w-4xl",
              "bg-white/90 backdrop-blur-md md:rounded-2xl md:border-[#26262614] md:shadow-[0_8px_24px_-12px_rgba(38,38,38,0.18)]",
            ]
          : [
              "top-0",
              "max-w-7xl",
              "bg-white/70 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none",
            ]
      )}
      style={{ minHeight: 64 }}
    >
      <style>{`
        :root {
          --orange: #ED5C1B;
          --ink: #262626;
        }

        /* NAVIGATION LINKS */
        .nav-link {
          position: relative;
          white-space: nowrap;
          color: var(--ink);
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 14.5px;
          letter-spacing: 0.01em;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color .25s ease;
        }
        .nav-link:hover { color: var(--orange); }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -6px;
          height: 2px; width: 0;
          background: var(--orange);
          transition: width .25s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .nav-logo-name {
          color: var(--ink);
          transition: color .3s ease;
        }
        .nav-logo-img {
          background: transparent;
          border-radius: 8px;
          transition: background .3s ease;
        }

        /* NAV CTA — compact orange pill, mirrors the hero primary button */
        .nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 9px 18px;
          min-height: 38px;
          border-radius: 9999px;
          background: var(--orange);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 13.5px;
          letter-spacing: -0.005em;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          transition: background 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .nav-cta:hover { background: #C44E17; }
        .nav-cta:active { transform: scale(0.97); }
        @media (max-width: 640px) {
          .nav-cta { padding: 8px 14px; font-size: 12.5px; min-height: 36px; }
        }
      `}</style>

      <div
        className={cn(
          "mx-auto flex items-center justify-between w-full transition-all duration-300 ease-out",
          scrolled ? "h-14 px-4 sm:px-5" : "h-16 px-4 sm:px-6 lg:px-8"
        )}
      >
        {/* LOGO + NUME */}
        <a
          href="/"
          onClick={handleLogo}
          className="flex items-center gap-3 leading-none"
          aria-label="Alcaziu Robert - Home"
        >
          <img
            src="/favicon.ico"
            alt="Logo Alcaziu"
            width={32}
            height={32}
            className="nav-logo-img h-8 w-8 select-none"
          />
          <span
            className="nav-logo-name tracking-tight leading-none text-[14px] sm:text-[15px] md:text-[16px]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              textTransform: "capitalize",
              letterSpacing: "0.02em",
            }}
          >
            Alcaziu Robert
          </span>
        </a>

        {/* NAVIGATION + CTA */}
        <div className="ml-auto flex items-center">
          <nav className="hidden md:flex items-center gap-7 mr-7">
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

          <LanguageSwitcher />

          <ContactCTA>
            <button type="button" className="nav-cta">
              {t("nav.cta")}
            </button>
          </ContactCTA>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
