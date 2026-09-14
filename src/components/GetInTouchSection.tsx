import React, { Suspense, lazy } from "react";
import { Trans, useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";

// The only form on the page, and the only place react-hook-form/zod are ever
// fetched. It arrives at the very bottom of the document, long after the LCP
// screen is done, which is exactly where that weight belongs.
const ContactFormCard = lazy(() => import("@/components/ContactFormCard"));

// Same highlight used across the site (offer/compounding).
const pillComponents = { pill: <span className="hl" /> };

/**
 * The closing ask — a heading, one paragraph, and the page's only form.
 *
 * NO PANEL. This section has now been through every version of a painted
 * background there is: the animated WebGL field, the frozen gradient that
 * replaced it, then flat panel ink. All three are gone and the section sits on
 * the page like the offer, the process and the FAQ do. That is the right answer
 * and it took three passes to see why: the section's whole job is one white
 * card, and a card on a dark panel needs a rim, a shadow and a scrim to read —
 * three pieces of scaffolding that exist only to solve a problem the panel
 * introduced. On the page's own ground the card is just a card, with the same
 * hairline every other card on the site has.
 *
 * The two dark objects left are the hero and the footer. They bookend the page;
 * everything between them is light, and this section is now part of that
 * middle rather than a third panel competing with the two ends.
 *
 * NO BUTTON either. It used to be a title, a paragraph and a pill that opened
 * the form in a modal. ContactForm brings its own primary pill ("Trimiteți
 * cererea"), so there is still exactly one blue button here — it is just the
 * one that actually sends something.
 *
 * Vertical space is deliberately NOT set here. SelectedWorkSection ends with
 * 128px of its own and .leads-tail below opens with 128px, so this section
 * padding itself would double every gap around it. It owns its side gutters and
 * nothing else.
 */
const GetInTouchSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        .touch-section {
          position: relative;
          background: var(--page);
          padding: 0;
          /* Load-bearing. The card is the LAST thing in this section and the
             section has no bottom padding, so the card's bottom edge is the
             section's bottom edge and its drop shadow falls outside the box.
             The next section (.leads-tail) is position:relative with an opaque
             background, so it painted straight over that shadow: the card ended
             up with a halo on its sides and nothing at all underneath, which is
             what a broken shadow looks like. Measured before the fix — #F7F8FB
             two pixels below the card, page colour exactly.
             z-index 1 puts this section above the next one, so the shadow lands
             on the 128px of empty page below it. Do not remove without giving
             the section its own bottom padding instead. */
          z-index: 1;
        }
        .touch-inner {
          max-width: var(--w-page);
          margin: 0 auto;
          text-align: center;
          padding: 0 var(--page-gutter);
        }
        /* 768, not 1040 — the hero's measure, and the one the form card was
           already built on. */
        .touch-col {
          max-width: 768px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .touch-title {
          font-family: var(--font-sans);
          font-weight: var(--text-heading-weight);
          font-size: var(--text-section-title);
          line-height: var(--text-heading-lh);
          letter-spacing: var(--text-heading-ls);
          color: var(--ink);
          margin: 0 auto;
          max-width: 22ch;
          text-wrap: balance;
        }
        /* 16px under the heading — the light page's step, not the 12px the dark
           panels used. Same as every other section header on the page now. */
        .touch-description {
          max-width: 46ch;
          margin: var(--sp-16) auto 0;
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          text-wrap: balance;
        }
        /* No .hl override here any more. It is --ink by default, which is what
           an emphasis on a light page should be; the white one existed only
           because the panel was dark. */

        /* 32px — spacer-medium. */
        .touch-form {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: var(--sp-32);
        }

        @media (max-width: 991px) {
          .touch-inner { padding: 0 var(--sp-32); }
        }
        @media (max-width: 768px) {
          .touch-inner { padding: 0 var(--sp-24); }
        }
      `}</style>

      <section className="touch-section" id="contact">
        <div className="touch-inner">
          <div className="touch-col">
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
              <div className="touch-form">
                <Suspense
                  fallback={<div className="form-card-ph" aria-hidden="true" />}
                >
                  <ContactFormCard
                    id="contact-form"
                    title={t("form.title")}
                    note={t("form.subtitle")}
                  />
                </Suspense>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInTouchSection;
