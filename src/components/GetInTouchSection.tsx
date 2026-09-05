import React from "react";
import { Trans, useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

// Same orange highlight pill used across the site (statement/compounding).
const pillComponents = { pill: <span className="touch-pill" /> };

const GetInTouchSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        .touch-section {
          --orange: #ED5C1B;
          --ink: #F5F5F5;
        }

        .touch-section {
          position: relative;
          padding: clamp(56px, 7.5vh, 96px) 0 clamp(48px, 6vh, 80px);
          background: #0F0F0F;
        }
        .touch-title {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--text-section-title);
          line-height: 1.15;
          letter-spacing: -0.022em;
          color: var(--ink);
          margin: 0 0 clamp(32px, 4vh, 56px);
        }

        .touch-description {
          max-width: 56ch;
          margin: 0 auto 2rem auto;
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: rgba(255, 255, 255, 0.84);
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          text-wrap: balance;
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

        /* Inline form — dark card in a double-bezel shell, mirroring the hero */
        .touch-form-shell {
          max-width: 656px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 27px;
          padding: 7px;
          box-shadow: 0 40px 90px -48px rgba(0, 0, 0, 0.7);
        }
        .touch-form {
          text-align: left;
          padding: 30px 40px 40px;
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
        }
        /* Same header pattern as the hero form card */
        .touch-form-title {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: #F5F5F5;
          margin: 0 0 4px;
        }
        .touch-form-note {
          font-family: var(--font-sans);
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.72);
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
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative">
          <div className="touch-content-box">
            <img
              src="/plane.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              width={1000}
              height={1000}
              className="touch-plane"
            />
            {/* Scroll-gated, not mount-gated. These used to be CSS keyframes
                firing on mount — but the section is lazy-loaded, so the chunk
                mounts on scroll PROXIMITY and the animation regularly played
                out entirely off-screen, leaving a dead section on arrival. */}
            <Reveal>
              <h2 className="touch-title">{t("contact.title")}</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="touch-description">
                <Trans i18nKey="contact.description_l1" components={pillComponents} />
                <br />
                <Trans i18nKey="contact.description_l2" components={pillComponents} />
              </p>
            </Reveal>

            {/* blur={0}: form controls under a filter rasterise badly and the
                shell is a large painted area. */}
            <Reveal delay={160} blur={0}>
              <div className="touch-form-shell">
                <div className="touch-form">
                  <h3 className="touch-form-title">{t("hero_v3.form_title")}</h3>
                  <p className="touch-form-note">{t("hero_v3.form_note")}</p>
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInTouchSection;
