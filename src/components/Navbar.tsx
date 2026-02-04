import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
      style={{ minHeight: 64 }}
    >
      <style>{`
        :root {
          --orange: #FE5C02;
          --ink: #1A1A1A;
        }

        /* NAVIGATION LINKS */
        .nav-link {
          position: relative;
          color: var(--ink);
          font-family: "Brockmann", Manrope, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
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

        /* CTA – fundal portocaliu, text alb, icon negru */
        .cta-solid {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 9999px;
          border: none;
          background: var(--orange);
          color: #ffffff;
          font-family: "Manrope", sans-serif;
          font-weight: 500;
          font-size: 14px;
          line-height: 1;
          text-decoration: none;
          transition: transform .25s ease, background-color .25s ease, box-shadow .25s ease;
          overflow: hidden;
        }

        .cta-solid:hover {
          transform: translateY(-1px);
          background-color: #ff7328; /* ușor mai deschis la hover */
          box-shadow: 0 4px 14px rgba(254, 92, 2, 0.4);
        }

        .cta-solid svg {
          width: 14px;
          height: 14px;
          transition: transform .25s ease;
        }

        .cta-solid:hover svg {
          transform: translateX(2px);
        }

        .cta-solid svg path {
          stroke: #000000; /* icon negru */
        }

        @media (max-width: 640px) {
          .cta-solid {
            padding: 9px 14px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
        {/* LOGO + NUME */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          className="flex items-center gap-3 leading-none"
          aria-label="Alcaziu Robert - Home"
        >
          <img
            src="/logo.svg"
            alt="Logo Alcaziu"
            className="h-8 w-auto select-none"
          />
          <span
            className="text-slate-900 tracking-tight leading-none text-[14px] sm:text-[15px] md:text-[16px]"
            style={{
              fontFamily: "Brockmann, Manrope, sans-serif",
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
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="nav-link"
            >
              Portfolio
            </a>

            <a href="#features" className="nav-link">
              About
            </a>
          </nav>

          {/* CTA Button */}
          <a
            href="mailto:contact@alcaziurobert.ro"
            className="cta-solid"
            aria-label="Get In Touch"
          >
            <span className="flex items-center gap-2 leading-none">
              Get In Touch
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 19L19 5" />
                <path d="M9 5h10v10" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
