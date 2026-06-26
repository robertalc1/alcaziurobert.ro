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

        .touch-section {
          padding: clamp(48px, 6vh, 80px) 0;
        }

        .touch-title {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          letter-spacing: -0.028em;
          color: #262626;
          margin: 0 0 clamp(32px, 4vh, 56px);
          animation: fadeInUp 0.6s ease-out;
        }

        .touch-description {
          max-width: 56ch;
          margin: 0 auto 2rem auto;
          line-height: 1.75;
          color: #1f1f1f;
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

        /* Inline form — premium card with layered shadow + hairline border */
        .touch-form {
          max-width: 640px;
          margin: 0 auto;
          text-align: left;
          padding: 36px 40px 40px;
          background: #ffffff;
          border: 1px solid rgba(38, 38, 38, 0.06);
          border-radius: 20px;
          box-shadow:
            0 24px 60px -28px rgba(38, 38, 38, 0.12),
            0 4px 12px -6px rgba(38, 38, 38, 0.04);
          animation: fadeInUp 1s ease-out;
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        @media (max-width: 768px) {
          .touch-content-box { width: 100%; padding: 28px 16px; border-radius: 16px; }
          .touch-title { margin-bottom: 56px; }
          .touch-description { margin-bottom: 1.4rem; }
          .touch-form { padding: 28px 24px 32px; border-radius: 18px; }
          .touch-plane { width: 56px; right: 5%; top: -16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .touch-plane { animation: none; }
        }
      `}</style>

      {/* eliminat spațiul de jos: pb-0 */}
      <section className="w-full bg-white touch-section" id="contact">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="touch-content-box">
            <img
              src="/plane.png"
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

            <div className="touch-form">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInTouchSection;
