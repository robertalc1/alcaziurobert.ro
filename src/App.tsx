import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import PixelPageViews from "@/components/PixelPageViews";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import { ContactModalProvider } from "@/components/ContactModal";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import Index from "./pages/Index";

const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Above the navbar on every route, like instantly.ai's. Lazy because it is not
// part of the first paint and it owns nothing the page needs to lay out — it
// publishes --bar-h, which defaults to 0px until it mounts.
const AnnouncementBar = lazy(() => import("@/components/AnnouncementBar"));
const CookieConsentBanner = lazy(() => import("@/components/CookieConsentBanner"));
const CookiePreferencesModal = lazy(() => import("@/components/CookiePreferencesModal"));
const Sonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

const App = () => {
  // One instance for the whole app. Mounted here rather than inside a route so
  // navigating never tears the scroll layer down and rebuilds it.
  useSmoothScroll();

  return (
    <CookieConsentProvider>
      <BrowserRouter>
        {/* One contact overlay for the whole app. Inside the router because the
            form links to the privacy policy; above the routes because a trigger
            unmounting — the fullscreen menu closing, a route change — must never
            be able to take the open form with it. */}
        <ContactModalProvider>
          <SEOHead />
          <PixelPageViews />

          {/* Inside the router: its CTA opens the contact modal, which navigates. */}
          <Suspense fallback={null}>
            <AnnouncementBar />
          </Suspense>

          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/studii-de-caz" element={<CaseStudy />} />
              <Route path="/termeni-si-conditii" element={<TermsConditions />} />
              <Route path="/politica-de-confidentialitate" element={<PrivacyPolicy />} />
              <Route path="/politica-de-cookie-uri" element={<CookiePolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Suspense fallback={null}>
            <Sonner />
            <CookieConsentBanner />
            <CookiePreferencesModal />
          </Suspense>
        </ContactModalProvider>
      </BrowserRouter>
    </CookieConsentProvider>
  );
};

export default App;
