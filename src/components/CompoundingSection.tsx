import React from "react";
import { useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";
import { trackFunnelAction } from "@/lib/analytics";
import "./FunnelSections.css";

const CompoundingSection: React.FC = () => {
  const { t } = useTranslation();
  const options = t("compounding.options", { returnObjects: true }) as { title: string; body: string; scope: string; details: string[] }[];
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
      <header className="leads-head funnel-options-head">
        <h2 className="leads-title">{t("compounding.options_title")}</h2>
        <p className="leads-sub">{t("compounding.options_lead")}</p>
      </header>
      <ul className="offer-list funnel-options">
        {options.map(option => <li key={option.title}>
          <div className="offer-card">
            <h3 className="offer-item-title">{option.title}</h3>
            <p className="offer-item-body">{option.body}</p>
            <p className="funnel-option-scope">{option.scope}</p>
            <details onToggle={event => { if (event.currentTarget.open) trackFunnelAction("view_service_options"); }}>
              <summary>{t("compounding.details")}<span aria-hidden="true">+</span></summary>
              {option.details.map(line => <p key={line}>{line}</p>)}
            </details>
          </div>
        </li>)}
      </ul>
      <div className="funnel-action">
        <p className="funnel-note">{t("compounding.note")}</p>
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
