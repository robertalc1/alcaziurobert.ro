import React, { useEffect, useRef, useState } from "react";

// Real portfolio screenshots inside the pills — premium proof, not generic stock.
const PILL_1 = { src: "/travel-twin.webp", alt: "Travel Twin" };
const PILL_2 = { src: "/r-draw.com.webp", alt: "R-Draw" };

const IntroLanding: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Mount → entrance stagger (next frame to avoid the initial-paint flash).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll-driven exit: cloud dissolve (blur + mask + lift + fog overlay).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let scrolled = false;

    const render = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const y = window.scrollY || window.pageYOffset || 0;
      const p = Math.min(1, Math.max(0, y / vh));

      // Once the user starts scrolling, stop the entrance transitions —
      // we want scroll movement to feel direct, not eased over entrance curves.
      if (!scrolled && p > 0.002) {
        scrolled = true;
        section.dataset.scrolling = "1";
      } else if (scrolled && p === 0) {
        scrolled = false;
        delete section.dataset.scrolling;
      }

      // Expose p to CSS for per-child parallax + fog overlay opacity.
      section.style.setProperty("--p", String(p));

      if (reduce) {
        // Reduced-motion: simple opacity fade only.
        section.style.opacity = String(Math.max(0, 1 - p * 1.2));
        section.style.pointerEvents = p > 0.95 ? "none" : "auto";
        return;
      }

      // Decisive exit: gone by p ≈ 0.45 (first half of viewport scroll) so the
      // intro feels like it CLEARS, not lingers as a ghost over the hero.
      const blur = Math.min(20, p * 28);
      const opacity = Math.max(0, 1 - p * 2.2);
      const ty = -p * 110;
      const scale = 1 + p * 0.06;

      section.style.filter = `blur(${blur}px)`;
      section.style.opacity = String(opacity);
      section.style.transform = `translateY(${ty}px) scale(${scale})`;

      // Mask erodes hard from the top — clouds dissipating quickly.
      const topErode = Math.min(85, p * 160);
      const mask = `linear-gradient(to bottom, transparent 0%, black ${topErode}%, black 100%)`;
      section.style.maskImage = mask;
      (section.style as CSSStyleDeclaration & { webkitMaskImage?: string }).webkitMaskImage = mask;

      section.style.pointerEvents = p > 0.45 ? "none" : "auto";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`intro-landing${loaded ? " is-loaded" : ""}`}
      aria-label="Welcome"
    >
      <style>{`
        :root { --orange:#ED5C1B; --ink:#262626; }

        .intro-landing {
          --p: 0;
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 100svh;
          background: #FAFAFA;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: clamp(80px, 12vh, 140px) 16px clamp(96px, 14vh, 160px);
          transform-origin: 50% 40%;
          will-change: opacity, transform, filter;
        }

        /* Soft white fog rising from the top — strengthens the "clouds" metaphor.
           Tied to scroll progress via --p, no transition (we drive it directly). */
        .intro-landing::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(250, 250, 250, 0.92) 0%,
            rgba(250, 250, 250, 0.55) 35%,
            rgba(250, 250, 250, 0) 70%
          );
          opacity: calc(var(--p) * 1.25);
          z-index: 2;
        }

        .intro-content { position: relative; z-index: 1; }

        .intro-statement {
          position: relative; z-index: 1;
          max-width: 840px; margin: 0 auto;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
          text-align: center;
          gap: clamp(16px, 2.8vw, 40px) clamp(20px, 3vw, 44px);
          font-family: var(--font-sans);
          font-weight: 600; letter-spacing: -0.03em; line-height: 1;
          font-size: clamp(2.3rem, 8vw, 5.2rem);
          color: var(--ink);
        }
        .ms-it { font-style: italic; font-weight: 500; color: var(--orange); }
        .ms-accent { color: var(--orange); }
        .ms-pill {
          height: clamp(50px, 8.2vw, 94px);
          width: clamp(116px, 18.5vw, 208px);
          object-fit: cover; border-radius: 9999px;
          user-select: none;
        }
        .ms-spark { width: clamp(20px, 2.8vw, 38px); height: auto; color: var(--orange); flex: 0 0 auto; }
        .ms-fire { font-size: 0.62em; line-height: 1; }

        /* =========================================================
           ENTRANCE — slow, word-by-word cinematic reveal with blur-in
           ========================================================= */
        .intro-statement > * {
          opacity: 0;
          transform: translateY(38px);
          filter: blur(10px);
          transition:
            opacity 1100ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 1100ms cubic-bezier(0.23, 1, 0.32, 1),
            filter 900ms cubic-bezier(0.23, 1, 0.32, 1);
          will-change: opacity, transform, filter;
        }
        .intro-statement > .ms-pill-1 { transform: translateY(38px) scale(0.86) rotate(0deg); }
        .intro-statement > .ms-pill-2 { transform: translateY(38px) scale(0.86) rotate(0deg); }

        .intro-landing.is-loaded .intro-statement > * {
          opacity: 1;
          transform: none;
          filter: blur(0);
        }
        .intro-landing.is-loaded .intro-statement > .ms-pill-1 { transform: rotate(-2deg); }
        .intro-landing.is-loaded .intro-statement > .ms-pill-2 { transform: rotate(1.5deg); }

        .intro-statement > *:nth-child(1) { transition-delay:   80ms, 80ms, 80ms; }
        .intro-statement > *:nth-child(2) { transition-delay:  240ms, 240ms, 240ms; }
        .intro-statement > *:nth-child(3) { transition-delay:  400ms, 400ms, 400ms; }
        .intro-statement > *:nth-child(4) { transition-delay:  560ms, 560ms, 560ms; }
        .intro-statement > *:nth-child(5) { transition-delay:  720ms, 720ms, 720ms; }
        .intro-statement > *:nth-child(6) { transition-delay:  880ms, 880ms, 880ms; }
        .intro-statement > *:nth-child(7) { transition-delay: 1040ms, 1040ms, 1040ms; }
        .intro-statement > *:nth-child(8) { transition-delay: 1200ms, 1200ms, 1200ms; }
        .intro-statement > *:nth-child(9) { transition-delay: 1360ms, 1360ms, 1360ms; }

        /* =========================================================
           PER-WORD PARALLAX on scroll — words detach slightly as they lift
           Once the section is scrolling, drop the entrance transitions so
           the parallax responds 1:1 to scroll (no easing lag).
           ========================================================= */
        .intro-landing[data-scrolling="1"] .intro-statement > * {
          transition: none;
        }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(1) { transform: translateY(calc(var(--p) * -10px)); }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(2) { transform: translateY(calc(var(--p) * -28px)) rotate(-2deg); }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(3) { transform: translateY(calc(var(--p) * -18px)); }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(4) { transform: translateY(calc(var(--p) * -14px)); }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(5) { transform: translateY(calc(var(--p) * -36px)); }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(6) { transform: translateY(calc(var(--p) * -22px)); }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(7) { transform: translateY(calc(var(--p) * -32px)) rotate(1.5deg); }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(8) { transform: translateY(calc(var(--p) * -16px)); }
        .intro-landing[data-scrolling="1"] .intro-statement > *:nth-child(9) { transform: translateY(calc(var(--p) * -42px)); }

        /* =========================================================
           SCROLL PROMPT — minimalist mouse, appears AFTER manifesto lands
           ========================================================= */
        .intro-scroll {
          position: absolute;
          bottom: clamp(28px, 5vh, 56px);
          left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          opacity: 0;
          transition: opacity 500ms 1700ms cubic-bezier(0.23, 1, 0.32, 1);
          pointer-events: none;
          z-index: 3;
        }
        .intro-landing.is-loaded .intro-scroll { opacity: 1; }
        /* As soon as user scrolls, hide the prompt — its job is done. */
        .intro-landing[data-scrolling="1"] .intro-scroll {
          opacity: calc(1 - var(--p) * 4);
          transition: none;
        }

        .scroll-mouse {
          width: 26px; height: 42px;
          border: 1.8px solid var(--ink);
          border-radius: 14px;
          position: relative;
          opacity: 0.85;
        }
        .scroll-mouse-dot {
          position: absolute;
          top: 7px; left: 50%;
          width: 3px; height: 8px;
          background: var(--ink);
          border-radius: 2px;
          transform: translateX(-50%);
          animation: scroll-drop 1.7s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        .scroll-label {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.65;
        }

        @keyframes scroll-drop {
          0%   { transform: translate(-50%, 0); opacity: 0; }
          25%  { opacity: 1; }
          75%  { transform: translate(-50%, 16px); opacity: 0; }
          100% { transform: translate(-50%, 16px); opacity: 0; }
        }

        /* ============================================================
           MOBILE — fill the whole screen, no boxed-in feeling.
           Bigger type (vw-driven), tight side padding, tall hierarchy.
           ============================================================ */
        @media (max-width: 768px) {
          .intro-landing {
            padding: clamp(72px, 10vh, 100px) 10px clamp(80px, 11vh, 110px);
            justify-content: space-between;
          }
          .intro-content {
            flex: 1;
            display: flex;
            align-items: center;
            width: 100%;
          }
          .intro-statement {
            max-width: 100%;
            gap: clamp(14px, 3.4vw, 22px) clamp(16px, 3.8vw, 26px);
            font-size: clamp(2.7rem, 13vw, 4.6rem);
            line-height: 0.96;
          }
          .ms-pill {
            height: clamp(62px, 12vw, 92px);
            width: clamp(148px, 30vw, 220px);
          }
          .ms-spark { width: clamp(22px, 4.6vw, 36px); }
        }

        @media (max-width: 420px) {
          .intro-landing {
            padding: clamp(64px, 9vh, 92px) 8px clamp(72px, 10vh, 100px);
          }
          .intro-statement {
            gap: 12px 16px;
            font-size: clamp(2.9rem, 14.5vw, 4.4rem);
          }
          .ms-pill {
            height: clamp(64px, 13vw, 86px);
            width: clamp(152px, 33vw, 200px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-statement > * {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          .intro-statement > .ms-pill-1 { transform: rotate(-2deg) !important; }
          .intro-statement > .ms-pill-2 { transform: rotate(1.5deg) !important; }
          .intro-scroll { transition: none !important; opacity: 1 !important; }
          .scroll-mouse-dot { animation: none; opacity: 0.7; top: 12px; }
          .intro-landing::after { display: none; }
          .intro-landing[data-scrolling="1"] .intro-statement > * { transform: none !important; }
        }
      `}</style>

      <div className="intro-content">
        <h1 className="intro-statement">
          <span>Escape</span>
          <img className="ms-pill ms-pill-1" src={PILL_1.src} alt={PILL_1.alt} loading="eager" decoding="async" />
          <span className="ms-it">the</span>
          <span>generic</span>
          <svg className="ms-spark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c.4 6 5.6 11.6 12 12-6.4.4-11.6 6-12 12-.4-6-5.6-11.6-12-12C6.4 11.6 11.6 6 12 0Z" />
          </svg>
          <span>AI</span>
          <img className="ms-pill ms-pill-2" src={PILL_2.src} alt={PILL_2.alt} loading="eager" decoding="async" />
          <span className="ms-accent">slop.</span>
          <span className="ms-fire" aria-hidden="true">🔥</span>
        </h1>
      </div>

    </section>
  );
};

export default IntroLanding;
