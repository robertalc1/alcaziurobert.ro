"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Features / WorkMap — Timeline cu progres
 * - Culori brand: orange #ED5C1B, cream #FFF5F0
 * - Background alb
 * - Header identic cu GetInTouchSection
 * - Desktop: path curbat cu fill progresiv + card-chips
 * - Mobile: timeline vertical cu puncte pe mijlocul liniilor
 */

const MOBILE_BP = 640;

type NodeDef = {
  id: string;
  title: string;
  subtitle: string;
  cx: number;
  cy: number;
  t: number;
  side?: "left" | "right";
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const Features: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mobileTimelineRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [pathLen, setPathLen] = useState(220);
  const [particlePos, setParticlePos] = useState<{ x: number; y: number } | null>(null);

  // mobile-only
  const [mobileLineProgress, setMobileLineProgress] = useState(0);
  const [activeCards, setActiveCards] = useState<number[]>([]);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const on = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener?.("change", on);
    return () => mql.removeEventListener?.("change", on);
  }, []);

  // Breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll progress
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!sectionRef.current) return;
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const rect = sectionRef.current!.getBoundingClientRect();
        const vh = window.innerHeight;
        const topTrigger = 0.75;
        const rangeFactor = isMobile ? 2.0 : 1.5;

        if (rect.top < vh * topTrigger && rect.bottom > 0) {
          const range = vh * rangeFactor;
          const p = Math.max(0, Math.min(1, (vh * topTrigger - rect.top) / range));
          setProgress(p);

          if (isMobile && mobileTimelineRef.current) {
            const timelineRect = mobileTimelineRef.current.getBoundingClientRect();
            const timelineProgress = Math.max(
              0,
              Math.min(1, (vh * 0.7 - timelineRect.top) / Math.max(1, timelineRect.height))
            );
            setMobileLineProgress(timelineProgress);

            const newActive: number[] = [];
            for (let i = 0; i < 4; i++) if (timelineProgress >= i * 0.25) newActive.push(i);
            setActiveCards(newActive);
          }
        } else if (rect.top >= vh * topTrigger) {
          setProgress(0);
          setMobileLineProgress(0);
          setActiveCards([]);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  // Smooth visual easing
  useEffect(() => {
    if (reducedMotion) {
      setDisplayProgress(easeInOutCubic(progress));
      return;
    }
    let raf = 0;
    const tick = () => {
      const target = easeInOutCubic(progress);
      const alpha = 0.1;
      setDisplayProgress((prev) => {
        const next = prev + (target - prev) * alpha;
        return Math.abs(next - target) < 0.0005 ? target : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, reducedMotion]);

  // Path length (desktop)
  useEffect(() => {
    if (!activePathRef.current) return;
    try {
      const len = activePathRef.current.getTotalLength();
      if (Number.isFinite(len)) setPathLen(len);
    } catch {}
  }, [isMobile]);

  // Particle position (desktop)
  useEffect(() => {
    if (!activePathRef.current || isMobile || reducedMotion) {
      setParticlePos(null);
      return;
    }
    const path = activePathRef.current;
    const l = displayProgress * pathLen;
    try {
      const pt = path.getPointAtLength(Math.max(0, Math.min(pathLen, l)));
      setParticlePos({ x: pt.x, y: pt.y });
    } catch {}
  }, [displayProgress, pathLen, isMobile, reducedMotion]);

  // Nodes & path
  const { pathD, nodes, desktopHeight } = useMemo(() => {
    const base = [
      { id: "analyze", title: t("roadmap.phases.analyze_title"), subtitle: t("roadmap.phases.analyze_subtitle") },
      { id: "develop", title: t("roadmap.phases.develop_title"), subtitle: t("roadmap.phases.develop_subtitle") },
      { id: "create", title: t("roadmap.phases.create_title"), subtitle: t("roadmap.phases.create_subtitle") },
      { id: "deliver", title: t("roadmap.phases.deliver_title"), subtitle: t("roadmap.phases.deliver_subtitle") },
    ];

    if (isMobile) {
      return {
        pathD: "",
        nodes: base.map((b, i) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          cx: 0,
          cy: 0,
          t: 0,
          side: i % 2 ? "right" : "left",
        })) as NodeDef[],
        desktopHeight: "auto",
      };
    }

    // Path în viewBox 100x100
    return {
      pathD: `
        M 10 18
        C 28 28, 45 35, 62 46
        S 86 67, 70 78
        S 36 88, 14 92
      `,
      nodes: [
        { cx: 10, cy: 18, t: 0.04, side: "left",  ...base[0] },
        { cx: 62, cy: 46, t: 0.45, side: "right", ...base[1] },
        { cx: 70, cy: 78, t: 0.75, side: "right", ...base[2] },
        { cx: 14, cy: 92, t: 0.96, side: "left",  ...base[3] },
      ] as NodeDef[],
      desktopHeight: "clamp(620px, 74vh, 880px)",
    };
  }, [isMobile, t]);

  return (
    <>
      <style>{`
        :root {
          --orange:#ED5C1B;
          --cream:#FFF5F0;
          --ink:#262626;
        }

        .wm-section{ background:#ffffff; position:relative }
        .wm-container{ position:relative; z-index:1 }

        /* Desktop timeline */
        .desktop-timeline{
          position:relative; border-radius:20px; overflow:hidden;
          background:#ffffff; border:1px solid #eceff3;
          box-shadow:0 10px 40px rgba(0,0,0,.06)
        }

        .card-chip{
          position:absolute; display:inline-flex; align-items:center; gap:12px;
          padding:14px 18px; border-radius:14px; background:#ffffff;
          border:1px solid #eef1f5; box-shadow:0 8px 24px rgba(0,0,0,.08);
          transform:translateY(-50%); opacity:0;
          transition:opacity .45s ease, transform .45s ease; z-index:5
        }
        .card-chip.active{ opacity:1 }
        .card-chip.left{ left:5%; transform:translateY(-50%) translateX(-16px) }
        .card-chip.left.active{ transform:translateY(-50%) translateX(0) }
        .card-chip.right{ right:5%; transform:translateY(-50%) translateX(16px) }
        .card-chip.right.active{ transform:translateY(-50%) translateX(0) }

        .chip-title{ font-weight:600; color:#262626; font-size:15px; letter-spacing:-.01em }
        .chip-sub{ font-size:13px; color:#6b7280 }

        .dot{ width:40px; height:40px; border-radius:9999px; background:linear-gradient(135deg,var(--cream), #ffffff); display:grid; place-items:center }
        .dot::after{ content:''; width:18px; height:18px; border-radius:9999px; background:var(--orange) }

        /* SVG */
        .timeline-bg{ stroke:#E2E8F0; stroke-width:.6; fill:none; stroke-linecap:square }
        .timeline-active{ stroke-width:.9; fill:none; stroke-linecap:round }

        /* Mobile */
        .mobile-timeline{ padding:36px 18px; position:relative; max-width:420px; margin:0 auto }
        .mobile-line-container{ position:absolute; left:50%; top:60px; bottom:60px; transform:translateX(-50%); width:2px }
        .mobile-line-bg{ position:absolute; inset:0; background:#E2E8F0; border-radius:1px }
        .mobile-line-fill{ position:absolute; top:0; left:0; right:0; background:linear-gradient(180deg, var(--orange) 0%, var(--orange) 100%); border-radius:1px; transform-origin:top; transition:height .3s ease-out }
        
        /* Punctele pe mijlocul liniilor */
        .mobile-line-dots{ position:absolute; top:0; left:50%; transform:translateX(-50%); width:100%; height:100% }
        .mobile-dot{ 
          position:absolute; 
          left:50%; 
          transform:translate(-50%, -50%); 
          width:14px; 
          height:14px; 
          border-radius:9999px; 
          background:#fff; 
          border:3px solid #E2E8F0; 
          z-index:4;
          transition:border-color .3s ease, background-color .3s ease, box-shadow .3s ease
        }
        .mobile-dot.active{ 
          border-color:var(--orange); 
          background:var(--orange); 
          box-shadow:0 0 0 6px rgba(237, 92, 27,.15) 
        }
        
        .mobile-cards{ position:relative; z-index:2; display:flex; flex-direction:column; gap:72px }
        .mobile-card{ background:#fff; border-radius:16px; padding:22px; border:1px solid #eef1f5; box-shadow:0 10px 30px rgba(0,0,0,.06); position:relative; opacity:0; transform:translateY(24px) scale(.97); transition:transform .45s var(--ease-out-quart,cubic-bezier(0.23,1,0.32,1)), opacity .45s var(--ease-out-quart,cubic-bezier(0.23,1,0.32,1)); text-align:center }
        .mobile-card.active{ opacity:1; transform:translateY(0) scale(1) }
        .mobile-card-title{ font-size:20px; font-weight:600; color:#262626; margin-bottom:6px; letter-spacing:-.01em }
        .mobile-card-sub{ font-size:15px; color:#6b7280 }
      `}</style>

      <section ref={sectionRef} className="w-full pt-8 sm:pt-12 pb-20 bg-white" id="features">
        <div className="wm-container container px-4 sm:px-6 lg:px-8 mx-auto">

          {/* Header identic cu GetInTouchSection */}
          <div className="flex items-center gap-4 mb-6 sm:mb-12">
            <div className="flex items-center gap-4">
              <div className="pulse-chip">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
                  3
                </span>
                <span>{t("roadmap.badge")}</span>
              </div>
            </div>
            <div className="divider-line"></div>
          </div>

          {/* Desktop Timeline */}
          {!isMobile && (
            <div className="desktop-timeline mt-8" style={{ height: desktopHeight }}>
              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="pathGradientDynamic" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ED5C1B" stopOpacity="0.12" />
                    <stop offset={`${displayProgress * 100}%`} stopColor="#ED5C1B" stopOpacity="1" />
                    <stop offset={`${Math.min(100, displayProgress * 100 + 10)}%`} stopColor="#ED5C1B" stopOpacity="0.12" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="0.5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Background path */}
                <path d={pathD} className="timeline-bg" />

                {/* Active path */}
                <path
                  ref={activePathRef}
                  d={pathD}
                  className="timeline-active"
                  stroke="url(#pathGradientDynamic)"
                  strokeDasharray={pathLen}
                  strokeDashoffset={pathLen - displayProgress * pathLen}
                  filter="url(#glow)"
                />

                {/* Nodes */}
                {nodes.map((node) => {
                  const isActive = displayProgress >= node.t;
                  return (
                    <g key={node.id}>
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r={isActive ? 1.8 : 1.25}
                        fill={isActive ? "#ED5C1B" : "#CBD5E1"}
                        style={{ transition: "all .35s ease" }}
                      />
                      {isActive && (
                        <circle
                          cx={node.cx}
                          cy={node.cy}
                          r="3.4"
                          fill="none"
                          stroke="#ED5C1B"
                          strokeWidth="0.18"
                          opacity="0.35"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Moving particle */}
                {particlePos && displayProgress > 0 && displayProgress < 1 && (
                  <g>
                    <circle cx={particlePos.x} cy={particlePos.y} r="1.1" fill="#ED5C1B" />
                    <circle cx={particlePos.x} cy={particlePos.y} r="0.55" fill="#fff" />
                  </g>
                )}
              </svg>

              {/* Card chips */}
              {nodes.map((node) => {
                const isActive = displayProgress >= node.t - 0.05;
                const position = node.side === "right"
                  ? { right: "5%", top: `${node.cy}%` }
                  : { left: "5%", top: `${node.cy}%` };

                return (
                  <div
                    key={`card-${node.id}`}
                    className={`card-chip ${node.side} ${isActive ? "active" : ""}`}
                    style={position}
                  >
                    <div className="dot" />
                    <div className="info">
                      <div className="chip-title">{node.title}</div>
                      <div className="chip-sub">{node.subtitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile Timeline */}
          {isMobile && (
            <div className="mobile-timeline mt-6" ref={mobileTimelineRef}>
              <div className="mobile-line-container">
                <div className="mobile-line-bg" />
                <div className="mobile-line-fill" style={{ height: `${mobileLineProgress * 100}%` }} />
                
                {/* Punctele pe mijlocul liniilor - doar 3 puncte între cele 4 carduri */}
                <div className="mobile-line-dots">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={`dot-${i}`}
                      className={`mobile-dot ${mobileLineProgress >= (i + 1) * 0.33 ? "active" : ""}`}
                      style={{ top: `${16.66 + (i * 33.33)}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="mobile-cards">
                {nodes.map((node, i) => {
                  const isActive = activeCards.includes(i);

                  return (
                    <div key={node.id} className={`mobile-card ${isActive ? "active" : ""}`}>
                      <div className="mobile-card-title">{node.title}</div>
                      <div className="mobile-card-sub">{node.subtitle}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default Features;