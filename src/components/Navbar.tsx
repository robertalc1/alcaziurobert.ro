"use client";

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const scrolled = useScroll(10);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Logo: scroll to top on the homepage, otherwise navigate home.
  const handleLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") scrollToTop();
    else navigate("/");
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
          color: var(--ink);
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.02em;
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
            className="h-8 w-8 select-none rounded-md"
          />
          <span
            className="text-[#262626] tracking-tight leading-none text-[14px] sm:text-[15px] md:text-[16px]"
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
          <nav className="hidden md:flex items-center gap-10 mr-8">
            <Link to="/studii-de-caz" className="nav-link">
              {t("nav.casestudy")}
            </Link>
          </nav>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
