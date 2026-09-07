import React, { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { scrollToEl } from "@/lib/scroll";

// Below-the-fold sections — lazy-loaded so the initial bundle stays small.
// Each Suspense fallback reserves enough vertical space to keep CLS = 0.
const OfferSection = lazy(() => import("@/components/OfferSection"));
const SelectedWorkSection = lazy(() => import("@/components/SelectedWorkSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const CompoundingSection = lazy(() => import("@/components/CompoundingSection"));
const FaqsSection = lazy(() => import("@/components/FaqsSection"));
const GetInTouchSection = lazy(() => import("@/components/GetInTouchSection"));
const MadeByHumans = lazy(() => import("@/components/MadeByHumans"));
const MobileBottomBar = lazy(() => import("@/components/MobileBottomBar"));

// Section-shaped placeholders so the page height matches its eventual content.
// Min-heights are measured in a real browser at 390x844 and 1440x900, then set
// to roughly the midpoint of the two — one number has to serve both viewports.
// Re-measure after changing any section's content; a stale reservation is a
// visible jump on arrival. They never flash visibly: each section streams
// in within ~50–150ms once its bundle is fetched.
//
// Measured 2026-09-07 at 1440x900 / 390x844, after the page moved onto
// instantly's one-section body. Each number is the midpoint of the two:
//   offer(2 units + gap) 1136/1692 · process 777/1097 · compounding 528/492
//   faq 694/736 · work 979/791 · contact 548/319 · footer 418/856
//
// A unit's reservation covers only the unit; the 80px (48px on phones) that
// separates it from its neighbour belongs to .leads-col's gap and is there
// whether the chunk has landed or not. The one exception is OfferSection,
// which resolves to TWO units behind a single boundary, so its number
// carries the gap between them.
const Placeholder: React.FC<{ minHeight: number }> = ({ minHeight }) => (
  <div aria-hidden="true" style={{ minHeight }} />
);

const Index = () => {
  const location = useLocation();

  // When arriving from another route (e.g. the case study page) with a target
  // section, scroll to it once the page has rendered, then clear the state.
  useEffect(() => {
    const id = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!id) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        scrollToEl(el);
      }
      window.history.replaceState({}, document.title);
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.state]);

  // Scroll-reveal animations are handled per-section by <Reveal />
  // (src/components/Reveal.tsx); in-page anchors own their click handlers
  // (Navbar, Hero, ContactCTA) — no global listeners needed here.

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero carries the client proof band inside its own panel — the claim
            and the twelve marks that pay for it share one frame. */}
        <Hero />

        {/* ── The body: one section, five units, 80px apart ──────────────
            This is instantly.ai's structure and it is the reason the page
            reads as one argument instead of a stack of pages. Five topics
            used to be five <section>s, each with its own 128px of padding
            top and bottom, so consecutive topics sat 256px apart and every
            one of them announced itself as a fresh start.

            Here the 128px is spent ONCE, by `.leads`, and the units inside
            sit 80px apart in a shared 1040px column. Each unit is a centred
            880px header (h2 ↓16 sub ↓24 pill) over its own panel. Do not give
            a unit its own vertical padding — that is exactly the thing this
            structure exists to prevent.

            Order is the funnel: name the problem, answer it, show how it
            runs, show why it keeps paying, clear the objections. */}
        <section className="leads" id="body">
          <div className="leads-wrap">
            <div className="leads-col">
              <Suspense fallback={<Placeholder minHeight={1414} />}>
                {/* Units 1 and 2 — the problem, then the offer. */}
                <OfferSection />
              </Suspense>
              <Suspense fallback={<Placeholder minHeight={937} />}>
                <ProcessSection />
              </Suspense>
              <Suspense fallback={<Placeholder minHeight={510} />}>
                <CompoundingSection />
              </Suspense>
              <Suspense fallback={<Placeholder minHeight={715} />}>
                <FaqsSection />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Proof: the work itself. Full-bleed, outside the body column —
            instantly's testimonial slot, which is the one band on their page
            that breaks the 1040 grid so the carousel can run edge to edge. */}
        <Suspense fallback={<Placeholder minHeight={885} />}>
          <SelectedWorkSection />
        </Suspense>

        <Suspense fallback={<Placeholder minHeight={434} />}>
          <GetInTouchSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={637} />}>
          <MadeByHumans />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <MobileBottomBar />
      </Suspense>
    </div>
  );
};

export default Index;
