import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import "./FunnelSections.css";

const ProcessSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="leads-block" id="process">
      <Reveal>
        <header className="leads-head">
          <h2 className="leads-title">{t("process.title")}</h2>
          <p className="leads-sub">{t("process.lead")}</p>
        </header>
      </Reveal>
      <div className="leads-panel is-bare">
        <ul className="proc-list">
          {(["scope", "direction", "handover"] as const).map((key, i) => (
            <li key={key}>
              <Reveal delay={i * 70}>
                <h3 className="proc-step-title">{t(`process.${key}.title`)}</h3>
                <p className="proc-body">{t(`process.${key}.body`)}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="funnel-action">
          <Link className="funnel-detail-link" to="/studii-de-caz">{t("process.details")} <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
