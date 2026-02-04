import React, { useEffect, useRef, useState } from "react";

const SpecsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleWords, setVisibleWords] = useState(0);

  const text =
    "Superior development. Real results. I build high-performance websites and applications focused on speed, clarity, and scalable growth.";

  const words = text.split(" ");

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        const scrollRange = windowHeight * 0.8;
        const progress = Math.max(
          0,
          Math.min(1, (windowHeight * 0.8 - rect.top) / scrollRange)
        );
        const wordsToShow = Math.floor(progress * words.length);
        setVisibleWords(wordsToShow);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [words.length]);

  const normalize = (w: string) => w.toLowerCase().replace(/[^\w-]/g, "");
  const accentSet = new Set([
    "development",
    "results",
    "high-performance",
    "speed",
    "clarity",
    "growth",
  ]);

  return (
    <>
      <style>{`
        @keyframes elegantShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .word-item {
          display: inline-block;
          opacity: 0;
          transform: translateY(15px);
          margin-right: 0.35em;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .word-item.show {
          opacity: 1;
          transform: translateY(0);
        }

        .word-gradient {
          background: linear-gradient(
            120deg,
            #FE5C02 0%,
            #FF8C42 15%,
            #FFA500 25%,
            #FF8C42 35%,
            #1a1a1a 45%,
            #2d3748 50%,
            #1a1a1a 55%,
            #FF8C42 65%,
            #FFA500 75%,
            #FF8C42 85%,
            #FE5C02 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: elegantShimmer 4s ease-in-out infinite;
        }

        .word-normal {
          color: #1e293b;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="w-full py-6 sm:py-10 bg-white"
        id="specifications"
      >
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex items-center gap-4 mb-8 sm:mb-16">
            <div className="flex items-center gap-4">
              <div className="pulse-chip">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
                  3
                </span>
                <span>About</span>
              </div>
            </div>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          <div className="max-w-5xl pl-4 sm:pl-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-8 sm:mb-12">
              {words.map((word, index) => {
                const isAccent = accentSet.has(normalize(word));
                return (
                  <span
                    key={`${word}-${index}`}
                    className={`word-item ${index < visibleWords ? "show" : ""} ${
                      isAccent ? "word-gradient" : "word-normal"
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </h2>
          </div>
        </div>
      </section>
    </>
  );
};

export default SpecsSection;