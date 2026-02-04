import React from "react";

const MadeByHumans = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        :root { --orange:#FE5C02; --ink:#1A1A1A; }

        /* ===== Background + seam fix (fără tăietură) ===== */
        .mbh-section {
          position: relative;
          overflow: hidden;
          background: #fff;
        }
        .mbh-bg {
          position: absolute; inset: 0;
          background-image: url("/Header-background.webp");
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
          transform: scaleY(-1); /* flip DOAR pe fundal */
          will-change: transform;
          z-index: 0;
        }
        .mbh-top-blend {
          position: absolute; left: 0; right: 0; top: 0;
          height: 140px;
          background: linear-gradient(180deg,#fff 0%,rgba(255,255,255,.92) 50%,rgba(255,255,255,0) 100%);
          pointer-events: none; z-index: 1;
        }
        .mbh-glow {
          position: absolute; left: 50%; bottom: -12%;
          transform: translateX(-50%);
          width: 70%; height: 75%;
          background: radial-gradient(circle at 50% 70%, rgba(254,92,2,.26), rgba(254,92,2,0) 60%);
          filter: blur(40px); opacity: .28; z-index: 0;
        }

        /* ===== Contact capsule (icoane elegante) ===== */
        .contact-container {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 10px 20px; border-radius: 9999px;
          background: rgba(255,255,255,.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(254,92,2,.15);
          color: var(--ink);
          font-family: "Manrope", sans-serif;
          font-size: 13px; font-weight: 500;
          transition: all .25s ease;
        }
        .contact-container:hover {
          background: #fff; border-color: rgba(254,92,2,.30);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,.08);
        }
        .contact-link {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--ink); text-decoration: none; transition: color .25s ease;
        }
        .contact-link:hover { color: var(--orange); }
        .contact-divider { width: 1px; height: 20px; background: rgba(254,92,2,.18); }

        /* Icoane fine: urmăresc currentColor (devin portocalii la hover) */
        .icon {
          width: 18px; height: 18px; flex: 0 0 18px;
        }
        .icon path, .icon circle, .icon line, .icon polyline, .icon rect {
          stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;
          fill: none;
        }

        /* Mobile: icon-only */
        @media (max-width: 640px) {
          .contact-container { padding: 0; gap: 16px; background: transparent; border: none; }
          .contact-container:hover { background: transparent; transform: none; box-shadow: none; }
          .contact-link {
            width: 48px; height: 48px; padding: 0; border-radius: 50%;
            background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
            border: 1.5px solid rgba(254,92,2,.2); justify-content: center; transition: all .3s ease;
          }
          .contact-link:hover {
            background: #fff; border-color: var(--orange);
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 20px rgba(254,92,2,.20);
          }
          .contact-link span { display: none; }
          .contact-divider { display: none; }
          .icon { width: 20px; height: 20px; flex-basis: 20px; }
        }
      `}</style>

      {/* SECȚIUNE LA FINAL – conținutul e jos */}
      <section
        id="made-by-humans"
        className="mbh-section w-full relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex flex-col items-center justify-end py-10 sm:py-12"
      >
        {/* Background + blends */}
        <div className="mbh-bg" />
        <div className="mbh-top-blend" />
        <div className="mbh-glow" />

        {/* Conținut jos */}
        <div className="z-20 flex flex-col items-center gap-6 sm:gap-8 mb-4 sm:mb-6">
          <div className="contact-container">
            {/* Telefon – icon elegant */}
            <a
              href="tel:+40773858164"
              className="contact-link"
              aria-label="Phone Number"
              title="+40 773 858 164"
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                {/* lucide-like phone */}
                <path d="M22 16.92v2.1a2 2 0 0 1-2.18 2 19.6 19.6 0 0 1-8.58-3.06 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3.06-8.58A2 2 0 0 1 4.18 2h2.1A2 2 0 0 1 8.2 3.72l.67 2a2 2 0 0 1-.46 2.02L7.3 8.9a16.5 16.5 0 0 0 7.8 7.8l1.15-1.11a2 2 0 0 1 2.02-.46l2 .67A2 2 0 0 1 22 16.92Z"/>
              </svg>
              <span>+40 773 858 164</span>
            </a>

            <div className="contact-divider" />

            {/* Email – icon elegant */}
            <a
              href="mailto:contact@alcaziurobert.ro"
              className="contact-link"
              aria-label="Email Address"
              title="contact@alcaziurobert.ro"
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                {/* lucide-like envelope */}
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
                <polyline points="3,7 12,13 21,7"/>
              </svg>
              <span>contact@alcaziurobert.ro</span>
            </a>
          </div>

          <p className="text-center text-gray-600 text-xs sm:text-sm font-light">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://alcaziurobert.ro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pulse-500 hover:underline font-medium transition-colors duration-200"
            >
              Designed by Alcaziu Robert
            </a>
            . All Rights Reserved.
          </p>
        </div>
      </section>
    </>
  );
};

export default MadeByHumans;
