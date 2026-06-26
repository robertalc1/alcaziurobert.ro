"use client";

import React from "react";
import { InfiniteSlider } from "@/components/infinite-slider";

type Partner = { src: string; alt: string; weight?: "md" | "lg" | "xl" };

const PARTNERS: Partner[] = [
  { src: "/logos/cloudflare.png", alt: "Cloudflare" },
  { src: "/logos/meta-logo.png", alt: "Meta", weight: "lg" },
  { src: "/LI-Logo.png", alt: "LinkedIn" },
  { src: "/google maps.png", alt: "Google Maps", weight: "xl" },
  { src: "/logos/google-ads-logo.png", alt: "Google Ads", weight: "xl" },
];

const PARTNERS_LOOP: Partner[] = Array.from({ length: 5 }).flatMap(() => PARTNERS);

const PremiumPartnersSection: React.FC = () => {
  return (
    <section className="pp-section" id="premium-partners">
      <style>{`
        .pp-section {
          width: 100%;
          background: #fff;
          padding: clamp(48px, 6vh, 80px) 16px;
        }
        .pp-inner {
          max-width: 1180px;
          margin: 0 auto;
          text-align: center;
        }

        .pp-partners {
          max-width: 980px;
          margin: 0 auto;
          padding: clamp(28px, 4vw, 44px) 0;
          overflow: visible;
        }
        .pp-partner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 52px;
          color: #262626;
          opacity: 0.65;
          overflow: visible;
          transition: opacity 240ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 240ms cubic-bezier(0.23, 1, 0.32, 1);
          flex-shrink: 0;
        }
        .pp-partner:hover {
          opacity: 1;
          transform: scale(1.04);
        }
        .pp-partner img { height: 100%; width: auto; display: block; }
        .pp-partner.is-md img { transform: scale(1.23); transform-origin: center; }
        .pp-partner.is-lg img { transform: scale(1.45); transform-origin: center; }
        .pp-partner.is-xl img { transform: scale(1.85); transform-origin: center; }

        @media (max-width: 600px) {
          .pp-section { padding: clamp(40px, 6vh, 60px) 16px clamp(32px, 5vh, 52px); }
          .pp-partners { padding: clamp(22px, 5vw, 28px) 0; }
          .pp-partner { height: 38px; }
        }
      `}</style>

      <div className="pp-inner">
        <div className="pp-partners">
          <InfiniteSlider gap={72} speed={55} speedOnHover={22}>
            {PARTNERS_LOOP.map((p, i) => (
              <span
                key={`${p.alt}-${i}`}
                className={
                  p.weight === "xl"
                    ? "pp-partner is-xl"
                    : p.weight === "lg"
                    ? "pp-partner is-lg"
                    : p.weight === "md"
                    ? "pp-partner is-md"
                    : "pp-partner"
                }
                aria-label={p.alt}
              >
                <img src={p.src} alt={p.alt} loading="lazy" />
              </span>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
};

export default PremiumPartnersSection;
