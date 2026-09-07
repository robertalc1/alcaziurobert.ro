import React from "react";
import { useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";

/**
 * The form card centred inside the hero panel (>=768px). Lives in its own lazy
 * chunk so react-hook-form/zod never enter the critical bundle — Hero mounts
 * it behind a matchMedia guard.
 */
const HeroContactCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hero-card" id="hero-form">
      <style>{`
        /* Plain white card, same anatomy as every other card on the page. It
           reads as bright because it sits on the dark panel, not because it is
           styled up — no shadow, no gradient, no glass. */
        .hero-card {
          background: var(--surface);
          border-radius: var(--r-card);
          padding: clamp(20px, 2.2vw, 30px);
          text-align: left;
        }
        .hero-card-title {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          color: var(--ink);
          margin: 0 0 4px;
        }
        .hero-card-note {
          font-family: var(--font-sans);
          font-size: 12.5px;
          color: var(--text-muted);
          margin: 0 0 18px;
        }
      `}</style>
      <h2 className="hero-card-title">{t("hero_v3.form_title")}</h2>
      <p className="hero-card-note">{t("hero_v3.form_note")}</p>
      <ContactForm />
    </div>
  );
};

export default HeroContactCard;
