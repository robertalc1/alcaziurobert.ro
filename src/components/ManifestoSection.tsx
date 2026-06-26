import React, { useEffect, useRef } from "react";

// Inline pill images — real portfolio work (swap freely).
const PILL_1 = { src: "/travel-twin.webp", alt: "Travel Twin" };
const PILL_2 = { src: "/r-draw.com.webp", alt: "R-Draw" };

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const statementRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const statement = statementRef.current;
    if (!section || !statement) return;
    const items = Array.from(statement.children) as HTMLElement[];

    const rotOf = (el: HTMLElement) =>
      el.classList.contains("ms-pill-1") ? -2 : el.classList.contains("ms-pill-2") ? 1.5 : 0;
    const isPill = (el: HTMLElement) => el.classList.contains("ms-pill");

    // Reduced motion: show everything, no scroll binding.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = isPill(el) ? `rotate(${rotOf(el)}deg)` : "none";
      });
      return;
    }

    let raf = 0;
    const render = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // 0 when section enters from the bottom → 1 as it rises to ~38% of viewport.
      const p = clamp01((vh - rect.top) / (vh * 0.62));
      items.forEach((el, i) => {
        const o = clamp01((p - i * 0.06) / 0.26);
        const scale = isPill(el) ? 0.9 + o * 0.1 : 1;
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 24}px) scale(${scale}) rotate(${rotOf(el)}deg)`;
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    render(); // set correct state immediately (no flash)
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="ms-section">
      <style>{`
        :root { --orange:#ED5C1B; --ink:#262626; }

        .ms-section {
          position:relative; width:100%; background:#fff; overflow:hidden;
          padding:clamp(64px,11vw,140px) 0;
        }

        .ms-statement {
          position:relative; z-index:1;
          max-width:840px; margin:0 auto;
          display:flex; flex-wrap:wrap; align-items:center; justify-content:center;
          text-align:center;
          gap:clamp(16px,2.8vw,40px) clamp(20px,3vw,44px);
          font-family:var(--font-sans);
          font-weight:600; letter-spacing:-0.03em; line-height:1;
          font-size:clamp(2.3rem,8vw,5.2rem);
          color:var(--ink);
        }

        .ms-it { font-style:italic; font-weight:500; color:var(--orange); }
        .ms-accent { color:var(--orange); }

        .ms-pill {
          height:clamp(50px,8.2vw,94px);
          width:clamp(116px,18.5vw,208px);
          object-fit:cover; border-radius:9999px;
          user-select:none;
        }

        .ms-spark { width:clamp(20px,2.8vw,38px); height:auto; color:var(--orange); flex:0 0 auto; }
        .ms-fire { font-size:0.62em; line-height:1; }

        /* Scroll-scrubbed reveal: JS drives opacity/transform per item.
           Hidden by default so there's no flash before the first frame runs. */
        .ms-statement > * {
          opacity:0; will-change:opacity, transform;
          transition:opacity .12s linear;
        }

        @media (prefers-reduced-motion: reduce) {
          .ms-statement > * { transition:none; }
        }
      `}</style>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <h2 className="ms-statement" ref={statementRef}>
          <span>Escape</span>
          <img className="ms-pill ms-pill-1" src={PILL_1.src} alt={PILL_1.alt} loading="lazy" decoding="async" />
          <span className="ms-it">the</span>
          <span>generic</span>
          <svg className="ms-spark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c.4 6 5.6 11.6 12 12-6.4.4-11.6 6-12 12-.4-6-5.6-11.6-12-12C6.4 11.6 11.6 6 12 0Z" />
          </svg>
          <span>AI</span>
          <img className="ms-pill ms-pill-2" src={PILL_2.src} alt={PILL_2.alt} loading="lazy" decoding="async" />
          <span className="ms-accent">slop.</span>
          <span className="ms-fire" aria-hidden="true">🔥</span>
        </h2>
      </div>
    </section>
  );
};

export default ManifestoSection;
