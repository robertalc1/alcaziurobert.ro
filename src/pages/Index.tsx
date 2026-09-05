import React, { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { scrollToEl } from "@/lib/scroll";

// Below-the-fold sections — lazy-loaded so the initial bundle stays small.
// Each Suspense fallback reserves enough vertical space to keep CLS = 0.
const ClientMarqueeSection = lazy(() => import("@/components/ClientMarqueeSection"));
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
        <Hero />
        {/* Credibility before anything else: the hero makes a claim, this pays
            for it with the twelve client marks. */}
        <Suspense fallback={<Placeholder minHeight={520} />}>
          <ClientMarqueeSection />
        </Suspense>
        {/* The problem, named — then the answer, in the same block: what you
            get, by when, and what is guaranteed. */}
        <Suspense fallback={<Placeholder minHeight={1780} />}>
          <OfferSection />
        </Suspense>
        {/* Proof: the work itself. */}
        <Suspense fallback={<Placeholder minHeight={725} />}>
          <SelectedWorkSection />
        </Suspense>
        {/* Then how it runs, and why it keeps paying. */}
        <Suspense fallback={<Placeholder minHeight={1000} />}>
          <ProcessSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={605} />}>
          <CompoundingSection />
        </Suspense>
        {/* Objections, in the order they come up on a call. */}
        <Suspense fallback={<Placeholder minHeight={634} />}>
          <FaqsSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={1105} />}>
          <GetInTouchSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={710} />}>
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
