"use client";

import React, { useEffect, useRef, useState } from "react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll<HTMLElement>(".parallax");
      elements.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.1");
        const yPos = -scrollY * speed;
        el.style.setProperty("--parallax-y", `${yPos}px`);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const scrollToNext = () => {
    const target = document.getElementById("portfolio");
    if (!target) return;
    const offset = 80;
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const testimonials = [
    { name: "@lukton", text: "Cool" },
    { name: "@picaps", text: "Best" },
    { name: "@kickout", text: "🔥" },
    { name: "@ecartop", text: "Profesional" },
  ];

  return (
    <section
      className="overflow-hidden relative min-h-screen flex items-center justify-center"
      id="hero"
      style={{
        padding: isMobile ? "80px 16px 60px" : "100px 20px 80px",
        background:
          "linear-gradient(to bottom, #ffffff 0%, #ffffff 60%, #fff5e6 85%, transparent 100%)",
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: 'url("/Header-background.webp")',
          backgroundPosition: "center 85%",
          backgroundSize: "cover",
          zIndex: 0,
        }}
      ></div>

      <style>{`
        :root { --orange: #FE5C02; }

        /* ——— efect glassy, border fin, hover subtil ——— */
        .chip-effect {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(254, 92, 2, 0.15) !important;
          box-shadow: none !important;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .chip-effect:hover {
          background: rgba(255, 255, 255, 1) !important;
          border-color: rgba(254, 92, 2, 0.3) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .chip-effect svg path {
          stroke: #fe5c02;
          transition: filter 0.25s ease;
        }
        .chip-effect:hover svg path {
          filter: drop-shadow(0 0 4px rgba(254, 92, 2, 0.5));
        }

        /* ——— și pe mobil efect identic ——— */
        @media (max-width: 768px) {
          .chip-effect {
            background: rgba(255, 255, 255, 0.95) !important;
            border: 1px solid rgba(254, 92, 2, 0.2) !important;
            backdrop-filter: blur(12px);
            box-shadow: none !important;
          }
          .chip-effect:hover {
            background: rgba(255, 255, 255, 1) !important;
            border-color: rgba(254, 92, 2, 0.3) !important;
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes smoothScroll {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(12px); opacity: 0.3; }
        }
        .scroll-indicator { animation: smoothScroll 2s ease-in-out infinite; }
        
        /* Forțăm textul alb pentru subtitlu */
        .hero-subtitle {
          color: #FFFFFF !important;
        }
      `}</style>

      <div
        className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10"
        ref={containerRef}
      >
        <div className="flex flex-col items-center text-center">
          {/* Testimonials */}
          <div
            className="w-full mb-16 sm:mb-24 opacity-0 animate-fade-in"
            style={{ animationDelay: "0s", maxWidth: "95vw" }}
          >
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              {/* 1 */}
              <div
                className="bg-[#FFF5E6]/90 border border-[#FE5C02]/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 chip-effect"
                style={{ animationDelay: "0s" }}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm">
                  <span className="text-gray-900 font-semibold">
                    {testimonials[0].name}
                  </span>
                  <svg
                    className="w-3 sm:w-3.5 h-3 sm:h-3.5"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{testimonials[0].text}</span>
                </div>
              </div>

              {/* 2-3 */}
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 w-full flex-wrap">
                {testimonials.slice(1, 3).map((item, i) => (
                  <div
                    key={item.name}
                    className="bg-[#FFF5E6]/90 border border-[#FE5C02]/20 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 chip-effect"
                    style={{ animationDelay: `${0.1 + i * 0.1}s`, minWidth: 0 }}
                  >
                    <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
                      <span className="text-gray-900 font-semibold">
                        {item.name}
                      </span>
                      <svg
                        className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4 */}
              <div
                className="bg-[#FFF5E6]/90 border border-[#FE5C02]/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 chip-effect"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm">
                  <span className="text-gray-900 font-semibold">
                    {testimonials[3].name}
                  </span>
                  <svg
                    className="w-3 sm:w-3.5 h-3 sm:h-3.5"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{testimonials[3].text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight opacity-0 animate-fade-in mt-0 mb-6 sm:mb-8 font-bold"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="block sm:hidden text-white">
              Let's make it<br />
              <span className="text-[#FE5C02]">Happen!</span>
            </span>
            <span className="hidden sm:block">
              <span className="text-white">Let's make it </span>
              <span className="text-[#FE5C02]">Happen!</span>
            </span>
          </h1>

          {/* Subtitle - FORȚĂM CULOAREA ALBĂ */}
          <p
            style={{ 
              animationDelay: "0.5s",
              color: "#FFFFFF",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            className="max-w-3xl mx-auto mb-12 sm:mb-16 leading-relaxed opacity-0 animate-fade-in font-medium text-lg sm:text-xl"
          >
            Building an business? Need a new website? We got you!
          </p>

          {/* Scroll Indicator */}
          <div
            className="flex flex-col items-center gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.7s" }}
          >
            <button
              onClick={scrollToNext}
              className="group cursor-pointer scroll-mouse"
              aria-label="Scroll to next section"
            >
              <div className="relative w-7 h-11 border-2 border-white/60 rounded-full flex items-start justify-center pt-2 transition-all duration-300">
                <div className="scroll-wheel scroll-indicator w-1 h-2.5 bg-white rounded-full transition-all duration-300"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;