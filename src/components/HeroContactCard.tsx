import React from "react";
import { useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";

/**
 * White form card for the hero's right column (desktop only). Lives in its
 * own lazy chunk so react-hook-form/zod never enter the critical bundle —
 * Hero mounts it behind a matchMedia guard.
 */
const HeroContactCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hero3-card" id="hero-form">
      <style>{`
        .hero3-card {
          background: #ffffff;
          border: 1px solid rgba(38, 38, 38, 0.06);
          border-radius: 20px;
          padding: clamp(22px, 2vw, 30px);
        }
        .hero3-card-title {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: #141414;
          margin: 0 0 4px;
        }
        .hero3-card-note {
          font-family: var(--font-sans);
          font-size: 12.5px;
          color: rgba(38, 38, 38, 0.55);
          margin: 0 0 18px;
        }
      `}</style>
      <h2 className="hero3-card-title">{t("hero_v3.form_title")}</h2>
      <p className="hero3-card-note">{t("hero_v3.form_note")}</p>
      <ContactForm />
    </div>
  );
};

export default HeroContactCard;
