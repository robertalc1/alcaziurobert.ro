import React from "react";
import { Trans, useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";

// Same orange highlight pill used across the site (compounding/testimonials).
const pillComponents = { pill: <span className="touch-pill" /> };

const GetInTouchSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        :root {
          --orange: #ED5C1B;
          --ink: #262626;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Light close — soft warm white with a whisper of orange */
        .touch-section {
          position: relative;
          padding: clamp(56px, 7.5vh, 96px) 0 clamp(48px, 6vh, 80px);
          background: linear-gradient(180deg, #ffffff 0%, #FAF8F6 100%);
        }
        .touch-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(46% 42% at 10% 100%, rgba(237, 92, 27, 0.07), transparent 70%),
            radial-gradient(36% 30% at 92% 2%, rgba(237, 92, 27, 0.04), transparent 70%);
        }

        .touch-title {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          letter-spacing: -0.028em;
          color: var(--ink);
          margin: 0 0 clamp(32px, 4vh, 56px);
          animation: fadeInUp 0.6s ease-out;
        }

        .touch-description {
          max-width: 56ch;
          margin: 0 auto 2rem auto;
          line-height: 1.75;
          color: rgba(38, 38, 38, 0.72);
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          text-wrap: balance;
          animation: fadeInUp 0.8s ease-out;
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .touch-pill {
          background: #ED5C1B;
          color: #ffffff;
          font-weight: 700;
          padding: 3px 11px;
          border-radius: 7px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          letter-spacing: -0.005em;
        }

        @media (min-width: 640px) {
          .touch-description { margin-bottom: 2.4rem; }
        }

        .touch-content-box {
          position: relative;
          max-width: 1180px;
          width: 90%;
          text-align: center;
          padding: 48px 40px;
          border-radius: 28px;
          background: transparent;
          border: none;
          box-shadow: none;
          backdrop-filter: none;
          animation: fadeIn 0.8s ease-out;
          margin: 0 auto;
        }

        /* 3D paper plane accent — reinforces the "send your message" intent */
        .touch-plane {
          position: absolute;
          top: clamp(-18px, -0.8vw, -4px);
          right: clamp(2%, 6vw, 11%);
          width: clamp(74px, 9vw, 126px);
          height: auto;
          pointer-events: none;
          filter: drop-shadow(0 22px 30px rgba(38, 38, 38, 0.20));
          animation: plane-float 5.5s ease-in-out infinite;
          will-change: transform;
          z-index: 2;
        }
        @keyframes plane-float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50%      { transform: translateY(-16px) rotate(-2deg); }
        }

        /* Inline form — white card in a double-bezel shell, mirroring the hero */
        .touch-form-shell {
          max-width: 656px;
          margin: 0 auto;
          background: rgba(38, 38, 38, 0.035);
          border: 1px solid rgba(38, 38, 38, 0.10);
          border-radius: 27px;
          padding: 7px;
          box-shadow: 0 40px 90px -48px rgba(38, 38, 38, 0.28);
          animation: fadeInUp 1s ease-out;
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .touch-form {
          text-align: left;
          padding: 30px 40px 40px;
          background: #ffffff;
          border: 1px solid rgba(38, 38, 38, 0.06);
          border-radius: 20px;
        }
        /* Same header pattern as the hero form card — the bare form field
           floating in white read as unfinished without it */
        .touch-form-title {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: #141414;
          margin: 0 0 4px;
        }
        .touch-form-note {
          font-family: var(--font-sans);
          font-size: 12.5px;
          color: rgba(38, 38, 38, 0.55);
          margin: 0 0 18px;
        }

        @media (max-width: 768px) {
          .touch-content-box { width: 100%; padding: 28px 16px; border-radius: 16px; }
          .touch-title { margin-bottom: 56px; }
          .touch-description { margin-bottom: 1.4rem; }
          .touch-form { padding: 28px 20px 32px; border-radius: 18px; }
          .touch-plane { width: 56px; right: 5%; top: -16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .touch-plane { animation: none; }
        }
      `}</style>

      {/* eliminat spațiul de jos: pb-0 */}
      <section className="w-full touch-section" id="contact">
        <div className="touch-glow" aria-hidden="true" />
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative">
          <div className="touch-content-box">
            <img
              src="/plane.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="touch-plane"
            />
            <h2 className="touch-title">{t("contact.title")}</h2>
            <p className="touch-description">
              <Trans i18nKey="contact.description_l1" components={pillComponents} />
              <br />
              <Trans i18nKey="contact.description_l2" components={pillComponents} />
            </p>

            <div className="touch-form-shell">
              <div className="touch-form">
                <h3 className="touch-form-title">{t("hero_v3.form_title")}</h3>
                <p className="touch-form-note">{t("hero_v3.form_note")}</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInTouchSection;
