import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import PixelPageViews from "@/components/PixelPageViews";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import Index from "./pages/Index";

const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
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
        <SEOHead />
        <PixelPageViews />

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
      </BrowserRouter>
    </CookieConsentProvider>
  );
};

export default App;
