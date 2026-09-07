import React from "react";
import { Trans, useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";
import ShaderBackground from "@/components/ShaderBackground";

// Same highlight used across the site (offer/compounding).
const pillComponents = { pill: <span className="hl" /> };

/**
 * The closing CTA — instantly.ai's `section_cta`, measured off the live page
 * and reproduced to the pixel:
 *
 *   .padding-16px            16px gutter, so the panel lands at 1408
 *     section_cta            radius 24, animated field behind everything
 *       padding-global       72px side gutters
 *         padding-section-xlarge   184px top AND bottom
 *           h2               40/600, ls -2px, white, centred
 *           ↓12              spacer-xxsmall is-0-75rem
 *           p                16/400/24, white, centred, short measure
 *           ↓32              spacer-medium
 *           button           41px pill
 *
 *   184 + 224 of content + 184 = 592, which is the panel height on their page.
 *
 * It carried the full contact form until now, which made it 958px tall and the
 * single heaviest object on the page. The form lives in the hero, where the
 * visitor meets it first; down here the panel does what instantly's does —
 * makes the ask, and opens the form in place rather than sending anyone
 * somewhere. The button is `mode="modal"` for exactly that reason: with no
 * inline form left in this section, an "auto" CTA would smooth-scroll to a
 * section that no longer has anywhere to land.
 *
 * It is deliberately the same object as the hero. The page opens on a dark
 * panel making a promise and closes on a dark panel asking for the phone
 * number, with the light argument in between. Those two panels are also the
 * page's only two WebGL surfaces.
 */
const GetInTouchSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        .touch-section {
          position: relative;
          padding: 0;
          background: var(--page);
        }
        .touch-panel {
          position: relative;
          isolation: isolate;
          width: calc(100vw - var(--panel-gutter) * 2);
          max-width: var(--w-panel);
          margin-inline: auto;
          border-radius: var(--r-panel);
          /* Clips the canvas to the radius. */
          overflow: hidden;
          background: var(--panel-ink);
          box-shadow: var(--shadow-panel);
        }
        .touch-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
        }
        /* Sinks the field under the copy — same job as .hero-scrim. */
        .touch-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(4, 14, 34, 0.34) 0%, rgba(4, 14, 34, 0.10) 34%, rgba(4, 14, 34, 0) 58%),
            radial-gradient(90% 52% at 50% 30%, rgba(4, 14, 34, 0.30) 0%, rgba(4, 14, 34, 0) 72%);
        }
        /* padding-global + padding-section-xlarge, theirs exactly. The 184px is
           the largest vertical value anywhere on the page and it is what makes
           this panel read as an ending rather than as one more section. */
        .touch-inner {
          position: relative;
          z-index: 1;
          max-width: var(--w-page);
          margin: 0 auto;
          text-align: center;
          padding: 184px var(--page-gutter);
        }

        .touch-title {
          font-family: var(--font-sans);
          font-weight: var(--text-heading-weight);
          font-size: var(--text-section-title);
          line-height: var(--text-heading-lh);
          letter-spacing: var(--text-heading-ls);
          color: #FFFFFF;
          margin: 0 auto;
          max-width: 22ch;
          text-wrap: balance;
        }
        /* 12px under the heading — spacer-xxsmall is-0-75rem, not the 16px the
           light sections use. Theirs is tighter on the dark panels. */
        .touch-description {
          max-width: 46ch;
          margin: var(--sp-12) auto 0;
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--on-panel-muted);
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          text-wrap: balance;
        }
        /* .hl is ink-coloured for the light page; on this panel that is
           near-black on dark blue. White + the same 600 weight keeps the
           emphasis doing its job. */
        .touch-description .hl { color: #FFFFFF; }
        /* 32px — spacer-medium. */
        .touch-actions {
          display: flex;
          justify-content: center;
          gap: var(--sp-16);
          margin-top: var(--sp-32);
        }

        /* Webflow's breakpoints. 184px of padding on a phone is half a screen
           of nothing, so it steps down twice — but the panel keeps its shape:
           heading, one short paragraph, one button, nothing else. */
        @media (max-width: 991px) {
          .touch-inner { padding: 128px var(--sp-32); }
        }
        @media (max-width: 768px) {
          .touch-panel { border-radius: 18px; }
          .touch-inner { padding: var(--sp-80) var(--sp-24); }
          .touch-actions { margin-top: var(--sp-24); }
        }
      `}</style>

      <section className="touch-section" id="contact">
        <div className="touch-panel">
          <ShaderBackground className="touch-bg" />
          <div className="touch-scrim" aria-hidden="true" />

          <div className="touch-inner">
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
                {" "}
                <Trans i18nKey="contact.description_l2" components={pillComponents} />
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="touch-actions">
                <ContactCTA mode="modal">
                  <button type="button" className="btn btn-primary">
                    {t("offer.cta")}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </button>
                </ContactCTA>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInTouchSection;
