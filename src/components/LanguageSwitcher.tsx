import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith("ro") ? "ro" : "en";

  const setLang = (lng: "en" | "ro") => {
    if (lng !== current) i18n.changeLanguage(lng);
  };

  return (
    <>
      <style>{`
        .lang-switch {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 4px 6px;
          border-radius: var(--btn-radius, 10px);
          border: 1px solid rgba(237, 92, 27, 0.18);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          margin-right: 12px;
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .lang-btn {
          padding: 6px 12px;
          min-height: 30px;
          border-radius: 7px;
          color: #6b7280;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color var(--duration-medium, 220ms) ease,
                      background-color var(--duration-medium, 220ms) ease,
                      transform var(--duration-fast, 160ms) var(--ease-out-quart, cubic-bezier(0.23, 1, 0.32, 1));
        }
        .lang-btn:hover { color: #262626; }
        .lang-btn:active { transform: scale(0.96); }
        .lang-btn.active {
          color: #ffffff;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow-flat);
        }
        @media (max-width: 640px) {
          .lang-switch { margin-right: 8px; padding: 3px 4px; }
          .lang-btn { padding: 9px 11px; font-size: 11px; min-height: 36px; }
        }
      `}</style>
      <div className="lang-switch" role="group" aria-label={t("lang.switch_to")}>
        <button
          type="button"
          className={`lang-btn ${current === "en" ? "active" : ""}`}
          onClick={() => setLang("en")}
          aria-pressed={current === "en"}
        >
          EN
        </button>
        <button
          type="button"
          className={`lang-btn ${current === "ro" ? "active" : ""}`}
          onClick={() => setLang("ro")}
          aria-pressed={current === "ro"}
        >
          RO
        </button>
      </div>
    </>
  );
};

export default LanguageSwitcher;
