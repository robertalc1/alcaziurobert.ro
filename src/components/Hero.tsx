import React from "react";
import { useTranslation } from "react-i18next";
import ShaderBackground from "@/components/ShaderBackground";
import ClientMarqueeSection from "@/components/ClientMarqueeSection";
import { scrollToId } from "@/lib/scroll";
import { trackFunnelAction } from "@/lib/analytics";
import "./Hero.css";

const SERVICES = ["website", "search", "apps"] as const;
const Hero = () => {
  const { t } = useTranslation();
  React.useEffect(() => {
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => window.dispatchEvent(new Event("app-ready")));
    });
    return () => { cancelAnimationFrame(firstFrame); cancelAnimationFrame(secondFrame); };
  }, []);
  const discover = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (scrollToId("offer")) {
      event.preventDefault();
      trackFunnelAction("explore_services");
      document.getElementById("offer")?.focus({ preventScroll: true });
    }
  };
  return (
    <section className="hero" id="hero">
      <div className="hero-panel">
        <ShaderBackground className="hero-bg" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-stage">
          <div className="hero-inner">
            <img className="hero-visual" src="/visuals/hero-search-960.webp"
              srcSet="/visuals/hero-search-480.webp 480w, /visuals/hero-search-960.webp 960w"
              sizes="(max-width: 767px) 300px, 560px" width={960} height={320}
              alt="" fetchPriority="high" />
            <h1 className="hero-title">
              {t("hero_v3.headline_pre")}<br />
              <span className="hero-accent">{t("hero_v3.headline_accent")}</span>
            </h1>
            <p className="hero-sub">{t("hero_v3.subtitle")}</p>
            <p className="hero-price">{t("hero_v3.price")}</p>
            <a className="btn btn-primary hero-cta" href="#offer" onClick={discover}>
              <span>{t("hero_v3.cta")}</span>
              <span className="hero-cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
              </span>
            </a>
            <ul className="hero-services" aria-label={t("hero_v3.services_label")}>
              {SERVICES.map(service => <li key={service}>
                <img src={`/visuals/icon-${service}.webp`} width={56} height={56} alt="" />
                <span>{t(`hero_v3.service_${service}`)}</span>
              </li>)}
            </ul>
          </div>
          <div className="hero-clients"><ClientMarqueeSection /></div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
