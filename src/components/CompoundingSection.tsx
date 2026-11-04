import React from "react";
import { useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";
import "./FunnelSections.css";

const CompoundingSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="leads-block" id="compounding">
      <div className="funnel-wide">
        <Reveal blur={0}>
          <figure className="funnel-frame funnel-panorama">
            <img src="/visuals/bridge-3d-white-1536.webp"
              srcSet="/visuals/bridge-3d-white-768.webp 768w, /visuals/bridge-3d-white-1536.webp 1536w"
              sizes="(max-width: 1328px) calc(100vw - 32px), 1296px"
              width={1536} height={768} loading="lazy" decoding="async"
              alt={t("compounding.visual_alt")} />
            <figcaption>
              <h2 className="leads-title">{t("compounding.title")}</h2>
              <p>{t("compounding.channels")}</p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
      <div className="funnel-action">
        <p className="funnel-note">{t("compounding.note")}</p>
        <p className="funnel-note">{t("compounding.aftercare")}</p>
        <ContactCTA mode="modal">
          <button type="button" className="btn btn-primary">
            {t("compounding.cta")}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </button>
        </ContactCTA>
      </div>
    </div>
  );
};

export default CompoundingSection;
