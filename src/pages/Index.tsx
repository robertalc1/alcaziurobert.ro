import React, { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Below-the-fold sections — lazy-loaded so the initial bundle stays small.
// Each Suspense fallback reserves enough vertical space to keep CLS = 0.
const HumanoidSection = lazy(() => import("@/components/HumanoidSection"));
const FrictionlessSection = lazy(() => import("@/components/FrictionlessSection"));
const DifferenceSection = lazy(() => import("@/components/DifferenceSection"));
const CompoundingSection = lazy(() => import("@/components/CompoundingSection"));
const PremiumPartnersSection = lazy(() => import("@/components/PremiumPartnersSection"));
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
        const offset = window.innerWidth < 768 ? 100 : 80;
        window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
      }
      window.history.replaceState({}, document.title);
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.state]);

  // Initialize intersection observer to detect when elements enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    // This helps ensure smooth scrolling for the anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        // Increased offset to account for mobile nav
        const offset = window.innerWidth < 768 ? 100 : 80;

        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<Placeholder minHeight={400} />}>
          <PremiumPartnersSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={360} />}>
          <FrictionlessSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={620} />}>
          <DifferenceSection />
        </Suspense>
        <Suspense fallback={<Placeholder minHeight={1100} />}>
          <HumanoidSection />
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
