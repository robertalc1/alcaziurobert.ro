import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const COUNT_TARGET = 125;

const WhyCloudflare: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  // Reveal once when the section scrolls into view (reduced-motion safe).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setInView(true);
      setCount(COUNT_TARGET);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Animated counter for the "Pushed N new updates" toast.
  useEffect(() => {
    if (!inView || count === COUNT_TARGET) return;
    let raf = 0;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setCount(Math.round(eased * COUNT_TARGET));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <section ref={sectionRef} className={`wcf-section ${inView ? "is-in" : ""}`}>
      <style>{`
        :root { --orange:#ED5C1B; --ink:#262626; }

        .wcf-section { width:100%; padding: 40px 0 8px; background:#fff; overflow:hidden; }

        /* Header */
        .wcf-head { text-align:center; max-width:760px; margin:0 auto 8px; }
        .wcf-title {
          font-family:var(--font-sans); font-weight:600; color:var(--ink);
          letter-spacing:-0.025em; line-height:1.05;
          font-size:clamp(2rem,5vw,3.4rem);
        }
        .wcf-sub {
          margin:14px auto 0; color:#5b6470; line-height:1.6;
          font-size:clamp(15px,1.6vw,18px); max-width:42ch;
        }
        .wcf-mark {
          color:var(--orange); font-weight:600; white-space:nowrap;
          background:linear-gradient(120deg, rgba(237, 92, 27,.15), rgba(237, 92, 27,.09));
          padding:2px 8px; border-radius:6px;
          -webkit-box-decoration-break:clone; box-decoration-break:clone;
        }
        @media (max-width:520px){ .wcf-mark{ white-space:normal; } }

        /* Comparison shell */
        .wcf-compare {
          position:relative;
          max-width:1100px; margin:36px auto 0;
          display:grid; grid-template-columns:1fr;
          border-radius:24px; overflow:hidden;
          border:1px solid rgba(0,0,0,.06);
          box-shadow:0 24px 60px rgba(38,38,38,.08);
        }
        @media (min-width:880px){ .wcf-compare{ grid-template-columns:1fr 1fr; } }

        .wcf-panel {
          position:relative; overflow:hidden;
          min-height:clamp(440px,52vw,560px);
          padding:clamp(24px,3vw,36px);
        }

        /* dotted bridge line crossing both panels */
        .wcf-bridge {
          position:absolute; left:0; right:0; top:62%;
          border-top:1px dashed rgba(38,38,38,.18);
          z-index:0; pointer-events:none;
        }
        .wcf-calm .wcf-bridge { border-top-color:rgba(255,255,255,.4); }

        .wcf-h3 {
          position:relative; z-index:2;
          font-family:var(--font-sans); font-weight:600; color:var(--ink);
          letter-spacing:-0.025em; line-height:1.1;
          font-size:clamp(1.5rem,3.2vw,2.4rem); max-width:11ch;
        }
        .wcf-h3-light { color:#fff; }

        /* ===== LEFT: chaos ===== */
        .wcf-chaos {
          background:#fff;
          background-image:radial-gradient(rgba(38,38,38,.10) 1px, transparent 1px);
          background-size:18px 18px;
        }

        .wcf-ghost {
          position:absolute; z-index:1; pointer-events:none;
          color:rgba(38,38,38,.13); font-weight:600; letter-spacing:-0.01em;
          font-size:clamp(12px,1.3vw,15px); white-space:nowrap;
        }

        .wcf-toast {
          position:absolute; z-index:3;
          background:#fff; border:1px solid rgba(38,38,38,.08);
          border-radius:10px; box-shadow:0 8px 22px rgba(38,38,38,.10);
          padding:10px 12px; width:min(74%, 290px);
          opacity:0; transform:translateY(14px) scale(.96) rotate(var(--rot,0deg));
          transition:opacity .5s var(--ease-out-quart,cubic-bezier(.23,1,.32,1)),
                     transform .55s var(--ease-out-quart,cubic-bezier(.23,1,.32,1));
          transition-delay:var(--d,0ms);
        }
        .wcf-section.is-in .wcf-toast { opacity:1; transform:translateY(0) scale(1) rotate(var(--rot,0deg)); }

        .wcf-toast-ghost { box-shadow:none; }
        .wcf-section.is-in .wcf-toast-ghost { opacity:.4; }

        .wcf-toast-row { display:flex; align-items:flex-start; gap:8px; }
        .wcf-p0 {
          flex:0 0 auto; font-size:10px; font-weight:700; letter-spacing:.04em;
          color:#dc2626; background:rgba(220,38,38,.10);
          border:1px solid rgba(220,38,38,.22); border-radius:6px;
          padding:2px 6px; line-height:1.2;
        }
        .wcf-tt { font-weight:600; color:var(--ink); font-size:13.5px; line-height:1.25; }
        .wcf-tb { color:#6b7280; font-size:12.5px; line-height:1.4; margin-top:3px; }
        .wcf-ic { flex:0 0 auto; color:#dc2626; }

        .wcf-status {
          width:auto; display:inline-flex; align-items:center; gap:7px;
          background:#fff; color:var(--ink); font-weight:600; font-size:12.5px;
          border:1px solid rgba(38,38,38,.10); border-radius:9999px; padding:7px 13px;
          box-shadow:0 6px 18px rgba(38,38,38,.08);
        }
        .wcf-status svg { color:#d97706; }

        .wcf-chat {
          width:min(78%,300px);
          background:#fff; border:1px solid rgba(38,38,38,.08);
          border-radius:12px; border-top-left-radius:4px;
        }
        .wcf-chat .wcf-tb { color:#3a4250; font-size:12.5px; font-style:italic; }
        .wcf-avatar { color:#7c3aed; }

        /* ===== RIGHT: calm ===== */
        .wcf-calm { background:var(--orange); color:#fff; }
        .wcf-calm-inner {
          position:relative; z-index:2; height:100%;
          display:flex; flex-direction:column; justify-content:space-between;
        }

        .wcf-pushed {
          align-self:center; margin-top:auto; margin-bottom:auto;
          display:inline-flex; align-items:center; gap:10px;
          background:rgba(255,255,255,.16);
          border:1px solid rgba(255,255,255,.30);
          border-radius:12px; padding:14px 20px;
          color:#fff; font-weight:600; font-size:clamp(14px,1.5vw,16px);
          backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
          box-shadow:0 10px 30px rgba(0,0,0,.12);
          opacity:0; transform:translateY(10px) scale(.97);
          transition:opacity .6s var(--ease-out-quart,cubic-bezier(.23,1,.32,1)),
                     transform .6s var(--ease-out-quart,cubic-bezier(.23,1,.32,1));
          transition-delay:.25s;
        }
        .wcf-section.is-in .wcf-pushed { opacity:1; transform:none; }
        .wcf-check {
          flex:0 0 auto; width:22px; height:22px; border-radius:50%;
          background:rgba(255,255,255,.22); display:inline-flex; align-items:center; justify-content:center;
        }
        .wcf-count { font-variant-numeric:tabular-nums; }

        .wcf-h3-light { opacity:0; transform:translateY(10px);
          transition:opacity .55s var(--ease-out-quart,cubic-bezier(.23,1,.32,1)),
                     transform .55s var(--ease-out-quart,cubic-bezier(.23,1,.32,1)); }
        .wcf-section.is-in .wcf-h3-light { opacity:1; transform:none; }

        @media (prefers-reduced-motion: reduce) {
          .wcf-toast, .wcf-pushed, .wcf-h3-light { transition:none !important; opacity:1 !important; transform:none !important; }
          .wcf-toast-ghost { opacity:.4 !important; }
          .wcf-toast { transform:rotate(var(--rot,0deg)) !important; }
        }

        /* ===== Mobile (<880px): stack panels; chaos toasts flow vertically ===== */
        @media (max-width:879px){
          .wcf-chaos { min-height:auto; padding-bottom:28px; }
          .wcf-calm { min-height:440px; }
          .wcf-bridge { display:none; }
          .wcf-decorative-hide { display:none; }   /* hide ghost duplicates + bg labels */
          .wcf-h3 { max-width:none; margin-bottom:18px; }
          .wcf-toast {
            position:static !important;
            width:100% !important;
            margin-top:12px;
            transform:translateY(14px) scale(.98) !important;  /* no rotation in stack */
          }
          .wcf-section.is-in .wcf-toast { transform:none !important; }
          .wcf-status { width:auto !important; }
        }
      `}</style>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="wcf-head">
          <h2 className="wcf-title">{t("whyCf.title")}</h2>
          <p className="wcf-sub">
            {t("whyCf.sub_pre")} <span className="wcf-mark">{t("whyCf.sub_mark")}</span>
          </p>
        </div>

        <div className="wcf-compare">
          {/* LEFT — chaos */}
          <div className="wcf-panel wcf-chaos">
            <div className="wcf-bridge" />
            <h3 className="wcf-h3">{t("whyCf.chaos_title")}</h3>

            {/* background ghost labels */}
            <span className="wcf-ghost wcf-decorative-hide" style={{ top: "10%", left: "-2%" }}>
              {t("whyCf.open_incidents")}
            </span>
            <span className="wcf-ghost wcf-decorative-hide" style={{ bottom: "4%", left: "2%" }}>
              circuit down
            </span>

            {/* status pill */}
            <div className="wcf-toast wcf-status" style={{ top: "6%", left: "42%", ["--rot" as string]: "1deg", ["--d" as string]: "60ms" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <path d="M12 9v4" /><path d="M12 17h.01" />
              </svg>
              {t("whyCf.status")}
            </div>

            {/* credential stuffing — ghost behind + real */}
            <div className="wcf-toast wcf-toast-ghost wcf-decorative-hide" style={{ top: "24%", left: "22%", ["--rot" as string]: "-3deg", ["--d" as string]: "0ms" }}>
              <div className="wcf-toast-row">
                <span className="wcf-p0">{t("whyCf.p0")}</span>
                <div>
                  <div className="wcf-tt">{t("whyCf.cred_title")}</div>
                  <div className="wcf-tb">{t("whyCf.cred_body")}</div>
                </div>
              </div>
            </div>
            <div className="wcf-toast" style={{ top: "29%", left: "27%", ["--rot" as string]: "2deg", ["--d" as string]: "140ms" }}>
              <div className="wcf-toast-row">
                <span className="wcf-p0">{t("whyCf.p0")}</span>
                <div>
                  <div className="wcf-tt">{t("whyCf.cred_title")}</div>
                  <div className="wcf-tb">{t("whyCf.cred_body")}</div>
                </div>
              </div>
            </div>

            {/* high latency — stacked x3 */}
            <div className="wcf-toast wcf-toast-ghost wcf-decorative-hide" style={{ top: "60%", left: "2%", ["--rot" as string]: "-4deg", ["--d" as string]: "0ms" }}>
              <div className="wcf-toast-row">
                <span className="wcf-p0">{t("whyCf.p0")}</span>
                <div>
                  <div className="wcf-tt">{t("whyCf.latency_title")}</div>
                  <div className="wcf-tb">{t("whyCf.latency_body")}</div>
                </div>
              </div>
            </div>
            <div className="wcf-toast wcf-toast-ghost wcf-decorative-hide" style={{ top: "64%", left: "5%", ["--rot" as string]: "-2deg", ["--d" as string]: "90ms" }}>
              <div className="wcf-toast-row">
                <span className="wcf-p0">{t("whyCf.p0")}</span>
                <div>
                  <div className="wcf-tt">{t("whyCf.latency_title")}</div>
                  <div className="wcf-tb">{t("whyCf.latency_body")}</div>
                </div>
              </div>
            </div>
            <div className="wcf-toast" style={{ top: "68%", left: "8%", ["--rot" as string]: "1deg", ["--d" as string]: "200ms" }}>
              <div className="wcf-toast-row">
                <span className="wcf-p0">{t("whyCf.p0")}</span>
                <div>
                  <div className="wcf-tt">{t("whyCf.latency_title")}</div>
                  <div className="wcf-tb">{t("whyCf.latency_body")}</div>
                </div>
              </div>
            </div>

            {/* data exfiltration */}
            <div className="wcf-toast" style={{ top: "62%", left: "48%", ["--rot" as string]: "-1deg", ["--d" as string]: "260ms" }}>
              <div className="wcf-toast-row">
                <svg className="wcf-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <div>
                  <div className="wcf-tt">{t("whyCf.exfil_title")}</div>
                  <div className="wcf-tb">{t("whyCf.exfil_body")}</div>
                </div>
              </div>
            </div>

            {/* DDoS chat bubble */}
            <div className="wcf-toast wcf-chat" style={{ top: "85%", left: "30%", ["--rot" as string]: "1deg", ["--d" as string]: "330ms" }}>
              <div className="wcf-toast-row">
                <svg className="wcf-avatar" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
                <div className="wcf-tb">“{t("whyCf.ddos")}”</div>
              </div>
            </div>
          </div>

          {/* RIGHT — calm */}
          <div className="wcf-panel wcf-calm">
            <div className="wcf-bridge" />
            <div className="wcf-calm-inner">
              <h3 className="wcf-h3 wcf-h3-light">{t("whyCf.calm_title")}</h3>

              <div className="wcf-pushed">
                <span className="wcf-check" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  {t("whyCf.pushed_pre")} <span className="wcf-count">{count}</span> {t("whyCf.pushed_post")}
                </span>
              </div>

              <div aria-hidden="true" style={{ height: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCloudflare;
