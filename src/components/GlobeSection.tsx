"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import createGlobe from "@/lib/cobe/cobe";
import { FeatureCard } from "@/components/feature-section";

const ORANGE: [number, number, number] = [255 / 255, 108 / 255, 54 / 255]; // #FF6C36

const BASE_THETA = 0.25;

// Icons sit ON the globe at real lat/long and are projected to screen every
// frame in sync with the globe's phi/theta (cobe markers can only be dots).
const RADIUS_FACTOR = 1.0; // fine-tune so icons land on the dotted surface
const ELEV = 0.85; // marker elevation off the unit sphere (matches cobe)

type IconKind = "database" | "user" | "shield" | "code";
type Node = { lat: number; lng: number; fill: boolean; icon: IconKind };

const NODES: Node[] = [
  { lat: 50, lng: -10, fill: true, icon: "database" },
  { lat: 41, lng: 22, fill: false, icon: "user" },
  { lat: 33, lng: 55, fill: true, icon: "shield" },
  { lat: 54, lng: 95, fill: false, icon: "user" },
  { lat: 36, lng: 140, fill: true, icon: "code" },
  { lat: 47, lng: 185, fill: true, icon: "user" },
  { lat: 29, lng: 240, fill: true, icon: "database" },
  { lat: 52, lng: 300, fill: false, icon: "user" },
];

// Network edges (indices into NODES)
const LINKS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
  [0, 2], [4, 6],
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const GlobeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18" />
    <path d="M12 3a14 14 0 0 0 0 18" />
  </svg>
);

const PinIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const FrameIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8V5a1 1 0 0 1 1-1h3" />
    <path d="M20 8V5a1 1 0 0 0-1-1h-3" />
    <path d="M4 16v3a1 1 0 0 0 1 1h3" />
    <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
  </svg>
);

const PILLARS: Array<{ key: string; icon: React.ReactNode }> = [
  { key: "pillar1", icon: GlobeIcon },
  { key: "pillar2", icon: PinIcon },
  { key: "pillar3", icon: FrameIcon },
];

const NodeIcon: React.FC<{ kind: IconKind }> = ({ kind }) => {
  switch (kind) {
    case "database":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
          <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7 3v5c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z" />
          <path d="M12 9v5M9.5 11.5h5" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
        </svg>
      );
  }
};

type Props = {
  /**
   * "section" (default) — renders the full section with heading + subtitle + stat card.
   * "backdrop" — renders only the canvas + node network as a non-interactive ambient
   * background layer; heading and stat are hidden. Used inside Hero to merge the
   * globe visual with the hero copy.
   */
  variant?: "section" | "backdrop";
};

const GlobeSection: React.FC<Props> = ({ variant = "section" }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const linkRefs = useRef<(SVGPathElement | null)[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Drag state
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractingY = useRef<number | null>(null);
  const rTarget = useRef(0); // horizontal drag offset (added to phi)
  const thetaTarget = useRef(BASE_THETA);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onMql = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener?.("change", onMql);
    return () => mql.removeEventListener?.("change", onMql);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mobile gets a lighter framebuffer + fewer dots — most traffic is mobile.
    const isMobile = window.innerWidth < 768;
    const res = isMobile ? 1.5 : 2;

    let width = canvas.offsetWidth || 800;
    const onResize = () => {
      width = canvas.offsetWidth || width;
    };
    window.addEventListener("resize", onResize);

    const globe = createGlobe(canvas, {
      devicePixelRatio: res,
      width: width * res,
      height: width * res,
      phi: 0,
      theta: BASE_THETA,
      dark: 0,
      diffuse: 1.2, // edge fade so dots read as a sphere
      mapSamples: isMobile ? 13000 : 22000,
      mapBrightness: 6,
      mapBaseBrightness: 0,
      baseColor: ORANGE, // #FF6C36 → colors the dots (body stays white via shader)
      markerColor: ORANGE,
      glowColor: [1, 1, 1], // white glow blends into white background
      markers: [],
    });

    let phi = 0;
    let rCurrent = 0;
    let thetaCurrent = BASE_THETA;
    let raf = 0;

    // Project a lat/long to clip-space pixels using the globe's current phi/theta.
    const project = (
      lat: number,
      lng: number,
      cP: number,
      sP: number,
      cT: number,
      sT: number,
      cx: number,
      cy: number,
      R: number
    ) => {
      const latR = (lat * Math.PI) / 180;
      const lngR = (lng * Math.PI) / 180 - Math.PI;
      const cl = Math.cos(latR);
      let x = -cl * Math.sin(lngR);
      let y = Math.sin(latR);
      let z = cl * Math.cos(lngR);
      x *= ELEV; y *= ELEV; z *= ELEV;
      const xr = cP * x + sP * z;
      const yr = sP * sT * x + cT * y - cP * sT * z;
      const zr = -sP * cT * x + sT * y + cP * cT * z;
      return { x: cx + xr * R, y: cy - yr * R, zr };
    };

    const renderOverlay = () => {
      const stageEl = stageRef.current;
      const netEl = netRef.current;
      if (!stageEl || !netEl) return;
      const s = stageEl.getBoundingClientRect();
      if (s.width < 2) return;
      const n = netEl.getBoundingClientRect();
      const cx = s.left + s.width / 2 - n.left;
      const cy = s.top + s.height / 2 - n.top;
      const R = (s.width / 2) * RADIUS_FACTOR;

      const ph = phi + rCurrent;
      const cP = Math.cos(ph), sP = Math.sin(ph);
      const cT = Math.cos(thetaCurrent), sT = Math.sin(thetaCurrent);

      const proj = NODES.map((nd) => project(nd.lat, nd.lng, cP, sP, cT, sT, cx, cy, R));

      // Visibility/opacity ramp near the limb so nodes fade instead of popping.
      const visOf = (zr: number) => clamp01((zr + 0.12) / 0.3);

      for (let i = 0; i < NODES.length; i++) {
        const el = nodeRefs.current[i];
        if (!el) continue;
        const p = proj[i];
        const vis = visOf(p.zr);
        const scale = 0.82 + 0.18 * clamp01((p.zr + 1) / 2);
        el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(vis);
        el.style.zIndex = String(100 + Math.round(p.zr * 50));
      }

      for (let i = 0; i < LINKS.length; i++) {
        const el = linkRefs.current[i];
        if (!el) continue;
        const a = proj[LINKS[i][0]];
        const b = proj[LINKS[i][1]];
        const vis = Math.min(visOf(a.zr), visOf(b.zr));
        if (vis <= 0.02) {
          el.style.opacity = "0";
          continue;
        }
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const bow = len * 0.16;
        const qx = mx + (-dy / len) * bow;
        const qy = my + (dx / len) * bow;
        el.setAttribute("d", `M ${a.x} ${a.y} Q ${qx} ${qy} ${b.x} ${b.y}`);
        el.style.opacity = String(vis * 0.55);
      }
    };

    const tick = () => {
      // auto-rotate only when not dragging
      if (pointerInteracting.current === null && !reducedMotion) phi += 0.004;
      // smooth toward drag targets
      rCurrent += (rTarget.current - rCurrent) * 0.08;
      thetaCurrent += (thetaTarget.current - thetaCurrent) * 0.08;
      globe.update({
        phi: phi + rCurrent,
        theta: thetaCurrent,
        width: width * res,
        height: width * res,
      });
      renderOverlay();
      raf = requestAnimationFrame(tick);
    };
    tick();

    requestAnimationFrame(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    // ---- Drag interaction ----
    const onDown = (clientX: number, clientY: number) => {
      pointerInteracting.current = clientX - rTarget.current / 0.01;
      pointerInteractingY.current = clientY;
      canvas.style.cursor = "grabbing";
    };
    const onMove = (clientX: number, clientY: number) => {
      if (pointerInteracting.current !== null) {
        const deltaX = clientX - pointerInteracting.current;
        rTarget.current = deltaX * 0.01;
      }
      if (pointerInteractingY.current !== null) {
        const deltaY = clientY - pointerInteractingY.current;
        const next = thetaTarget.current + deltaY * 0.002;
        thetaTarget.current = Math.max(-0.5, Math.min(0.5, next));
        pointerInteractingY.current = clientY;
      }
    };
    const onUp = () => {
      pointerInteracting.current = null;
      pointerInteractingY.current = null;
      canvas.style.cursor = "grab";
    };

    const handlePointerDown = (e: PointerEvent) => onDown(e.clientX, e.clientY);
    const handlePointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [reducedMotion]);

  const isBackdrop = variant === "backdrop";
  const Wrapper = isBackdrop ? "div" : "section";

  return (
    <Wrapper className={`globe-section${isBackdrop ? " is-backdrop" : ""}`} id={isBackdrop ? undefined : "reach"}>
      <style>{`
        .globe-section {
          position: relative;
          width: 100%;
          padding: 48px 16px clamp(40px, 6vh, 72px);
          background: #ffffff;
          overflow: hidden;
        }

        .globe-head {
          position: relative;
          z-index: 3;
          max-width: 680px;
          margin: 0 auto 8px;
          text-align: center;
        }
        .globe-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.08;
          font-size: clamp(24px, 3.4vw, 40px);
          color: #262626;
          margin-bottom: 12px;
        }
        .globe-sub {
          font-family: var(--font-sans);
          font-size: clamp(14px, 1.6vw, 16px);
          line-height: 1.6;
          color: #6b7280;
          max-width: 46ch;
          margin: 0 auto;
        }

        /* ============================================================
           BACKDROP VARIANT — used inside Hero as ambient globe layer.
           Hides head + stat, removes padding/background, softens
           opacity, disables interaction. Canvas fills the parent.
           ============================================================ */
        .globe-section.is-backdrop {
          position: absolute;
          inset: 0;
          padding: 0;
          background: transparent;
          opacity: 0.5;
          pointer-events: none;
        }
        .globe-section.is-backdrop .globe-head,
        .globe-section.is-backdrop .globe-stat {
          display: none;
        }
        .globe-section.is-backdrop .globe-clip {
          width: 100%;
          height: 100%;
          margin-top: 0;
        }
        .globe-section.is-backdrop .globe-stage {
          width: min(1280px, 220vw);
          top: 22%;
        }
        @media (max-width: 768px) {
          .globe-section.is-backdrop {
            opacity: 0.35;
          }
          .globe-section.is-backdrop .globe-stage {
            width: 280vw;
            top: 30%;
          }
        }

        /* Clip window — only the top dome of a large globe shows */
        .globe-clip {
          position: relative;
          width: 100%;
          height: clamp(360px, 46vw, 600px);
          margin-top: 8px;
          overflow: hidden;
        }
        .globe-stage {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: min(1080px, 168vw);
          aspect-ratio: 1 / 1;
        }
        .globe-canvas {
          width: 100%;
          height: 100%;
          aspect-ratio: 1 / 1;
          contain: layout paint size;
          opacity: 0;
          transition: opacity 1s var(--ease-out-quart, cubic-bezier(0.23, 1, 0.32, 1));
          touch-action: pan-y;
        }

        /* Icon node network overlay (positions set per-frame in JS) */
        .globe-net {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .globe-links {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .net-node {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          will-change: transform, opacity;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 22px rgba(255, 108, 54, 0.22);
        }
        .net-node svg { width: 24px; height: 24px; }
        .net-node.is-fill {
          background: #FF6C36;
          color: #ffffff;
        }
        .net-node.is-outline {
          background: #ffffff;
          color: #FF6C36;
          border: 1.5px solid rgba(255, 108, 54, 0.45);
        }
        @media (max-width: 768px) {
          .net-node { width: 42px; height: 42px; }
          .net-node svg { width: 19px; height: 19px; }
        }

        /* Floating stat card */
        .globe-stat {
          position: absolute;
          left: max(16px, 6%);
          bottom: 14%;
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(237, 92, 27, 0.4);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
        }
        .globe-stat-value {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 20px;
          color: #262626;
          letter-spacing: -0.02em;
        }
        .globe-stat-label {
          font-family: var(--font-sans);
          font-size: 12px;
          color: #6b7280;
        }
        @media (max-width: 640px) {
          .globe-section { padding: 24px 16px clamp(24px, 4vh, 40px); }
          .globe-head { margin: 0 auto 4px; }
          .globe-title { font-size: clamp(22px, 6vw, 28px); margin-bottom: 8px; }
          .globe-sub { font-size: 13.5px; line-height: 1.55; max-width: 38ch; }
          .globe-clip { height: clamp(300px, 70vw, 420px); margin-top: 0; }
          .globe-stage { width: 200vw; }
          .globe-stat { left: 12px; bottom: 10%; padding: 10px 13px; }
          .globe-stat-value { font-size: 17px; }
          .globe-stat-label { font-size: 11px; }
        }
      `}</style>

      {!isBackdrop && (
        <div className="globe-head">
          <h2 className="globe-title">{t("globe.title")}</h2>
          <p className="globe-sub">{t("globe.subtitle")}</p>
        </div>
      )}

      <div className="globe-clip">
        <div className="globe-stage" ref={stageRef}>
          <canvas
            ref={canvasRef}
            className="globe-canvas"
            aria-label={t("globe.title")}
          />
        </div>

        {/* Icon node network overlay — anchored to the globe, projected each frame */}
        <div className="globe-net" aria-hidden="true" ref={netRef}>
          <svg className="globe-links">
            {LINKS.map((_, i) => (
              <path
                key={i}
                ref={(el) => (linkRefs.current[i] = el)}
                fill="none"
                stroke="#FF6C36"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ opacity: 0 }}
              />
            ))}
          </svg>
          {NODES.map((n, i) => (
            <span
              key={i}
              ref={(el) => (nodeRefs.current[i] = el)}
              className={`net-node ${n.fill ? "is-fill" : "is-outline"}`}
            >
              <NodeIcon kind={n.icon} />
            </span>
          ))}
        </div>

        {!isBackdrop && (
          <div className="globe-stat">
            <span className="globe-stat-value">{t("globe.stat_value")}</span>
            <span className="globe-stat-label">{t("globe.stat_label")}</span>
          </div>
        )}
      </div>

      {!isBackdrop && (
        <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-8">
          {PILLARS.map((p) => (
            <FeatureCard
              key={p.key}
              feature={{
                title: t(`globe.${p.key}_title`),
                description: t(`globe.${p.key}_body`),
                icon: p.icon,
              }}
            />
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default GlobeSection;
