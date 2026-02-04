"use client";

import React, { useEffect, useRef, useState } from "react";

const HumanoidSection = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Ensure the array of refs matches the data length (optional cleanup, but good practice)
    cardRefs.current = cardRefs.current.slice(0, cardData.length);

    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) newSet.add(index);
              else newSet.delete(index);
              return newSet;
            });
          });
        },
        { threshold: 0.2, rootMargin: "-50px" }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && cardRefs.current[index]) {
          observer.unobserve(cardRefs.current[index]!);
        }
      });
    };
  }, []); // Only run once on mount, logic handles refs. Or depend on cardData.length if specific behavior needed.

  const cardData = [
    {
      logo: "/picaps-logo.webp",
      title: "PICAPS",
      link: "https://picaps.ro/",
      image: "/picaps3.png",
      background: "/background-section1.png",
      label: "Picaps",
    },
    {
      logo: "/r-draw.com.png",
      title: "R-DRAW",
      link: "https://r-draw.com/",
      image: "/r-draw.com.png",
      background: "/background-section1.png",
      label: "R-DRAW",
    },
    {
      logo: "/kickout-logo.webp",
      title: "KICKOUT",
      link: "https://kickout.ro/",
      image: "/kickout.png",
      background: "/background-section2.png",
      label: "Kickout",
    },
    {
      logo: "/alma-logo.png",
      title: "ALMA",
      link: "https://vopsitoriaalma.ro/",
      image: "/alma.png",
      background: "/background-section3.png",
      label: "Alma",
    },
    {
      logo: "/lukton.png",
      title: "LUKTON",
      link: "https://lukton.ro/",
      image: "/lukton.png",
      background: "background-section2.png",
      label: "Lukton",
    },
    {
      logo: "/ecartop.png",
      title: "ECARTOP",
      link: "https://ecartop.com/",
      image: "/ecartop.png",
      background: "background-section2.png",
      label: "Ecartop",
    },
  ];

  return (
    <>
      <style>{`
        :root { --orange:#FE5C02; --ink:#1A1A1A; }

        .humanoid-wrapper {
          max-width: 100vw;
          overflow-x: hidden;
          width: 100%;
        }

        .project-card {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          margin-bottom: 3rem; /* crește spațiul între carduri */
        }

        .project-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .project-card:last-child {
          margin-bottom: 0;
        }

        .card-container {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        @media (pointer: fine) {
          .card-container:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
          }
        }

        .card-background {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
        }

        .card-content {
          position: relative;
          z-index: 10;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
          min-height: 400px;
        }

        @media (min-width: 768px) {
          .card-content {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 2rem;
            align-items: center;
            padding: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .card-content {
            padding: 3rem;
          }
        }

        .card-text {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .card-logo {
          display: none;
        }

        .divider {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.3);
          display: none;
        }

        @media (min-width: 640px) {
          .divider {
            display: block;
          }
        }

        .card-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: none;
        }

        @media (min-width: 640px) {
          .card-label {
            display: block;
          }
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          line-height: 1.3;
        }

        @media (min-width: 768px) {
          .card-title {
            font-size: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .card-title {
            font-size: 2.5rem;
          }
        }

        /* Buton */
        .card-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          background: transparent;
          color: #ffffff;
          font-family: "Manrope", sans-serif;
          font-weight: 500;
          font-size: 14px;
          line-height: 1;
          text-decoration: none;
          transition: transform .25s ease, background-color .25s ease, box-shadow .25s ease;
          overflow: hidden;
          align-self: flex-start;
          white-space: nowrap;
        }

        .card-link::before {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
          transition: transform .6s ease;
          pointer-events: none;
        }

        @media (pointer: fine) {
          .card-link:hover::before {
            transform: translateX(120%);
          }

          .card-link:hover {
            transform: translateY(-2px);
            background-color: rgba(255, 255, 255, 0.12);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
          }

          .card-link:hover svg {
            transform: translateX(3px);
          }
        }

        .card-link svg {
          width: 14px;
          height: 14px;
          transition: transform .25s ease;
          flex-shrink: 0;
        }

        .card-link svg path {
          stroke: #fff;
        }

        @media (max-width: 640px) {
          .card-link {
            padding: 9px 14px;
            font-size: 13px;
            gap: 6px;
          }
          .card-link svg {
            width: 12px;
            height: 12px;
            }
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          cursor: pointer;
        }

        .card-image-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(80% 60% at 50% 0%, rgba(255,255,255,0.1), transparent 60%),
          linear-gradient(135deg, rgba(255,255,255,0.06), transparent 40% 60%, rgba(0,0,0,0.08));
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 1;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(1.06) brightness(0.98);
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @media (pointer: fine) {
          .card-image-wrapper:hover .card-image {
            transform: scale(1.06);
          }
        }

        /* Header section */
        .head-grid {
          display: grid;
          grid-template-columns: 1fr;
          row-gap: 0.6rem;
          align-items: center;
        }

        .head-badge {
          justify-self: center;
        }

        .head-title {
          text-align: center;
        }

        .vline {
          width: 1px;
          height: 24px;
          background: #d7dbe0;
          opacity: 0.9;
          border-radius: 1px;
          justify-self: center;
        }

        @media (min-width: 768px) {
          .head-grid {
            grid-template-columns: auto 10px 1fr;
            column-gap: 18px;
            row-gap: 0;
          }
          .head-badge {
            justify-self: start;
          }
          .head-title {
            text-align: left;
          }
          .vline {
            height: 34px;
          }
        }

        @media (max-width: 767px) {
          .project-card { margin-bottom: 2rem; }
          .card-content {
            padding: 1.5rem;
            min-height: 350px;
          }
          .card-title { font-size: 1.25rem; }
        }
      `}</style>

      <section className="w-full py-8 md:py-10 bg-white humanoid-wrapper" id="why-humanoid">
        <div className="container px-6 lg:px-8 mx-auto">
          <div className="mb-6 md:mb-8 head-grid">
            <div className="head-badge">
              <div className="pulse-chip">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
                  2
                </span>
                <span>Portofolio</span>
              </div>
            </div>
            <span className="vline" aria-hidden="true" />
            <div className="head-title">
              <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-bold">
                our work speaks for itself.
              </h2>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {cardData.map((card, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`project-card ${visibleCards.has(index) ? "visible" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="card-container" style={{ position: "relative" }}>
                  <div
                    className="card-background"
                    style={{
                      backgroundImage: `url('${card.background}')`,
                    }}
                  />

                  <div className="card-content">
                    <div className="card-text">
                      <div className="card-header">
                        <img src={card.logo} alt={`${card.label} Logo`} className="card-logo" />
                        <div className="divider" />
                        <span className="card-label">PROJECT</span>
                      </div>

                      <h3 className="card-title">{card.title}</h3>

                      <a
                        href={card.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-link"
                      >
                        Check it out!
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
                      </a>
                    </div>

                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-image-wrapper"
                      aria-label={`View ${card.label} project`}
                    >
                      <img src={card.image} alt={`${card.label} Preview`} className="card-image" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HumanoidSection;
