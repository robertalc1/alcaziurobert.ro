import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";
import "./FunnelSections.css";

const VISUALS = ["website", "contact"] as const;
const SERVICES = [1, 2, 3, 4] as const;

const OfferSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="leads-block" id="problem">
        <Reveal>
          <header className="leads-head">
            <h2 className="leads-title">{t("offer.problem_title")}</h2>
            <p className="leads-sub">{t("offer.problem")}</p>
          </header>
        </Reveal>
        <div className="leads-panel is-bare funnel-wide">
          <div className="funnel-pair">
            {VISUALS.map((visual, i) => (
              <Reveal key={visual} delay={i * 80} blur={0}>
                <figure className="funnel-frame">
                  <img
                    src={`/visuals/${visual}-3d-cutout-1280.webp`}
                    srcSet={`/visuals/${visual}-3d-cutout-640.webp 640w, /visuals/${visual}-3d-cutout-1280.webp 1280w`}
                    sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1328px) calc((100vw - 56px) / 2), 636px"
                    width={1280} height={1280} loading="lazy" decoding="async"
                    alt={t(`offer.visual_${visual}_alt`)}
                  />
                  <figcaption>
                    <h3>{t(`offer.visual_${visual}_title`)}</h3>
                    <p>{t(`offer.visual_${visual}_line`)}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="leads-block" id="offer">
        <Reveal>
          <header className="leads-head">
            <h2 className="leads-title">{t("offer.title")}</h2>
            <p className="leads-sub">{t("offer.lead")}</p>
          </header>
        </Reveal>
        <div className="leads-panel is-bare">
          <ul className="offer-list">
            {SERVICES.map((n, i) => (
              <li key={n}>
                <Reveal delay={i * 70} className="offer-card-wrap">
                  <div className="offer-card">
                    <h3 className="offer-item-title">{t(`offer.d${n}_title`)}</h3>
                    <p className="offer-item-body">{t(`offer.d${n}_body`)}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <div className="funnel-action">
            <ContactCTA mode="modal">
              <button type="button" className="btn btn-primary">
                {t("offer.cta")}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
              </button>
            </ContactCTA>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferSection;
