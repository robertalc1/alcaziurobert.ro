"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";
import { Pause, Play, ArrowUpRight } from "lucide-react";
import "./SelectedWorkSection.css";

type Project = {
  slug: string;
  name: string;
  short: string;
  url: string;
  domain: string;
};

/* Every live build, OCPI first. Images come from scripts/capture-portfolio.mjs
   and are named off the slug — there is no per-project filename to keep in
   sync here any more. */
const PROJECTS: Project[] = [
  { slug: "sgc", name: "Oficiul de Cadastru — OCPI", short: "OCPI", url: "https://sgc.ocpict.ro/", domain: "sgc.ocpict.ro" },
  { slug: "black-sea-gis", name: "Black Sea GIS", short: "Black Sea GIS", url: "https://bsgis.ocpict.ro/", domain: "bsgis.ocpict.ro" },
  { slug: "laura-predoi", name: "Laura Predoi — Cabinet de psihologie", short: "Laura Predoi", url: "https://psihologiecabinet.ro/", domain: "psihologiecabinet.ro" },
  { slug: "unbacde10", name: "UNBACDE10", short: "UNBACDE10", url: "https://unbacde10.ro/", domain: "unbacde10.ro" },
  { slug: "picaps", name: "Picaps", short: "Picaps", url: "https://picaps.ro/", domain: "picaps.ro" },
  { slug: "kickout", name: "Kickout", short: "Kickout", url: "https://kickout.ro/", domain: "kickout.ro" },
  { slug: "rdraw", name: "R-Draw", short: "R-Draw", url: "https://r-draw.com/", domain: "r-draw.com" },
  { slug: "everun", name: "Everun", short: "Everun", url: "https://www.everunromania.ro/", domain: "everunromania.ro" },
  { slug: "everati", name: "Everati", short: "Everati", url: "https://everati.ro/", domain: "everati.ro" },
  { slug: "alma", name: "Alma", short: "Alma", url: "https://vopsitoriaalma.ro/", domain: "vopsitoriaalma.ro" },
  { slug: "lukton", name: "Lukton", short: "Lukton", url: "https://lukton.ro/", domain: "lukton.ro" },
  { slug: "ecartop", name: "Ecartop", short: "Ecartop", url: "https://ecartop.com/", domain: "ecartop.com" },
];

const FEATURED = PROJECTS.slice(0, 2);
const OTHER_PROJECTS = PROJECTS.slice(2);

const SelectedWorkSection: React.FC = () => {
  const { t } = useTranslation();
  const railRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const [paused, setPaused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (railRef.current) observer.observe(railRef.current);
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (paused || hovered || focused || !inView || reducedMotion) return;
    const rail = railRef.current;
    const group = groupRef.current;
    if (!rail || !group) return;
    let frame: number;
    let previous = 0;
    let position = rail.scrollLeft;
    const tick = (now: number) => {
      // Keep a fractional position: scrollLeft is rounded on some displays.
      const delta = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      if (!document.hidden) {
        position += delta * 0.028;
        const loopWidth = group.getBoundingClientRect().width;
        if (loopWidth > 0) position %= loopWidth;
        rail.scrollLeft = position;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, hovered, focused, inView, reducedMotion]);

  const projectCard = (project: Project, duplicate: boolean) => (
    <a
      className="work-project"
      key={project.slug}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      aria-label={`${project.short} — ${t("work.visit")}`}
    >
      <div className="work-project-image">
        <img src={`/work/${project.slug}.webp`} alt={duplicate ? "" : project.name}
          width={1600} height={1000} loading="lazy" decoding="async" draggable={false} />
      </div>
      <div className="work-project-info">
        <h4>{project.short}</h4>
        <span>{project.domain}<ArrowUpRight size={16} aria-hidden="true" /></span>
      </div>
    </a>
  );

  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="work-inner">
        <Reveal>
          <h2 className="work-title" id="work-title">{t("work.section_title")}</h2>
          <p className="work-sub">{t("work.intro")}</p>
        </Reveal>

        <div className="work-featured">
          {FEATURED.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80} blur={0}>
              <article className="work-feature">
                <a className="work-feature-image" href={project.url} target="_blank"
                  rel="noopener noreferrer" aria-label={`${project.name} — ${t("work.visit")}`}>
                  <img src={`/work/${project.slug}.webp`} alt={project.name}
                    width={1600} height={1000} loading="lazy" decoding="async" />
                  <span className="work-feature-open" aria-hidden="true"><ArrowUpRight size={22} /></span>
                </a>
                <div className="work-feature-info">
                  <p className="work-feature-domain">{project.domain}</p>
                  <h3>{project.name}</h3>
                  <p className="work-feature-description">{t(`work.featured.${project.slug}`)}</p>
                  <a className="work-feature-link" href={project.url} target="_blank" rel="noopener noreferrer">
                    {t("work.visit")}<ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="work-other">
          <div className="work-other-heading">
            <h3 id="work-other-title">{t("work.other_title")}</h3>
            {!reducedMotion && (
              <button type="button" className="work-motion" onClick={() => setPaused(!paused)}
                aria-controls="work-rail" aria-pressed={paused}
                aria-label={t(paused ? "work.resume" : "work.pause")}>
                {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                <span>{t(paused ? "work.resume" : "work.pause")}</span>
              </button>
            )}
          </div>
          <div className="work-rail" id="work-rail" ref={railRef} data-lenis-prevent
            role="region" aria-labelledby="work-other-title" tabIndex={0}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
            }}
            onTouchStart={() => setPaused(true)} onWheel={() => setPaused(true)}>
            <div className="work-track">
              <div className="work-group" ref={groupRef}>
                {OTHER_PROJECTS.map((project) => projectCard(project, false))}
              </div>
              {!reducedMotion && (
                <div className="work-group" aria-hidden="true">
                  {OTHER_PROJECTS.map((project) => projectCard(project, true))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="work-cta">
          <ContactCTA mode="modal">
            <button type="button" className="btn btn-primary">
              {t("nav.cta")}<ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </ContactCTA>
        </div>
      </div>
    </section>
  );
};

export default SelectedWorkSection;
