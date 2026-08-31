import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="nf-root">
      <style>{`
        .nf-root {
          min-height: 100vh;
          background: #0F0F0F;
          color: #F5F5F5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }
        .nf-code {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(3.5rem, 12vw, 7rem);
          line-height: 1;
          letter-spacing: -0.04em;
          color: #ED5C1B;
          margin: 0 0 12px;
        }
        .nf-title {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(1.3rem, 3vw, 1.8rem);
          letter-spacing: -0.025em;
          margin: 0 0 10px;
        }
        .nf-body {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
          margin: 0 0 28px;
          max-width: 44ch;
        }
        .nf-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 28px;
          min-height: 48px;
          border-radius: 9999px;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          transition: filter 220ms cubic-bezier(.23,1,.32,1),
                      box-shadow 220ms cubic-bezier(.23,1,.32,1),
                      transform 160ms cubic-bezier(.23,1,.32,1);
        }
        .nf-link:hover {
          filter: brightness(var(--btn-gloss-brightness, 1.06));
          box-shadow: var(--btn-gloss-shadow-hover);
          transform: translateY(-1px);
        }
      `}</style>

      <div>
        <p className="nf-code">404</p>
        <h1 className="nf-title">{t("legal.notfound_title", "Page not found")}</h1>
        <p className="nf-body">
          {t(
            "legal.notfound_body",
            "The page you are looking for does not exist or has been moved."
          )}
        </p>
        <Link to="/" className="nf-link">
          {t("legal.notfound_cta", "Back to home")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
