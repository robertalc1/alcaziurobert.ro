import React, { useEffect, useState } from "react";

const FOOTER_ID = "made-by-humans"; // id-ul secțiunii de footer (lasă-l așa dacă folosești componenta MadeByHumans)

const ScrollToTop: React.FC = () => {
  const [pastScroll, setPastScroll] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  // apare după ce ai scrollat un pic
  useEffect(() => {
    const onScroll = () => setPastScroll(window.scrollY > 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // se ascunde doar când ~80% din footer e vizibil (ține mai mult pe ecran)
  useEffect(() => {
    const footer = document.getElementById(FOOTER_ID);
    if (!footer) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // ține butonul până când aproape tot footer-ul intră în viewport
        setHideButton(entry.intersectionRatio > 0.8);
      },
      { threshold: [0, 0.25, 0.5, 0.8, 1] }
    );

    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const visible = pastScroll && !hideButton;

  return (
    <>
      <style>{`
        @keyframes smoothScroll {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.3; }
        }
        .scroll-indicator { animation: smoothScroll 2s ease-in-out infinite; }

        @keyframes orangePulse {
          0%   { box-shadow: 0 0 0 0 rgba(254,92,2,0.2); }
          70%  { box-shadow: 0 0 0 10px rgba(254,92,2,0); }
          100% { box-shadow: 0 0 0 0 rgba(254,92,2,0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-indicator { animation: none !important; }
        }
      `}</style>

      <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none">
        <button
          onClick={goTop}
          aria-label="Back to top"
          className={[
            "pointer-events-auto group relative transition-all duration-500",
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none",
          ].join(" ")}
          style={{ background: "transparent" }}
        >
          {/* glow portocaliu subtil */}
          <span
            className="absolute inset-0 rounded-full"
            style={{ animation: "orangePulse 2s ease-out infinite", filter: "blur(3px)" }}
          />

          {/* icon mouse identic cu Hero */}
          <div
            className="
              relative w-[24px] h-[38px] border-[2px] rounded-full flex items-start justify-center pt-[6px]
              transition-all duration-300
            "
            style={{
              borderColor: "#FE5C02",
              background: "rgba(255,255,255,0.05)",
              boxShadow: "0 0 8px rgba(254,92,2,0.25)",
            }}
          >
            <div
              className="scroll-wheel scroll-indicator w-[3px] h-[9px] rounded-full transition-all duration-300"
              style={{ background: "#FE5C02" }}
            />
          </div>
        </button>
      </div>
    </>
  );
};

export default ScrollToTop;
