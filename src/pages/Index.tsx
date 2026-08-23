import React, { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { navOffset } from "@/lib/scroll";

// Below-the-fold sections — lazy-loaded so the initial bundle stays small.
// Each Suspense fallback reserves enough vertical space to keep CLS = 0.
const StatsBandSection = lazy(() => import("@/components/StatsBandSection"));
const StatementSection = lazy(() => import("@/components/StatementSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const SelectedWorkSection = lazy(() => import("@/components/SelectedWorkSection"));
const CompoundingSection = lazy(() => import("@/components/CompoundingSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const GetInTouchSection = lazy(() => import("@/components/GetInTouchSection"));
const FaqsSection = lazy(() => import("@/components/FaqsSection"));
const MadeByHumans = lazy(() => import("@/components/MadeByHumans"));
const MobileBottomBar = lazy(() => import("@/components/MobileBottomBar"));

// Section-shaped placeholders so the page height matches its eventual content.
// Min-heights are conservative averages from observed layout — preventing layout
// shift when the chunk arrives. They never flash visibly: each section streams
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
        window.scrollTo({ top: el.offsetTop - navOffset(), behavior: "smooth" });
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
        <Suspense fallback={<Placeholder minHeight={480} />}>
          <StatsBandSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={300} />}>
          <StatementSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={640} />}>
          <ProcessSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={1600} />}>
          <SelectedWorkSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={760} />}>
          <CompoundingSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={520} />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={720} />}>
          <FaqsSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={640} />}>
          <GetInTouchSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={500} />}>
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
