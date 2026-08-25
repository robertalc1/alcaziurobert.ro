import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

interface Partner {
  name: string;
  description: string;
  url: string;
}

const PartnerTable: React.FC<{ partners: Partner[]; cookiesLabel: string; seeCookiesLabel: string }> = ({
  partners,
  cookiesLabel,
  seeCookiesLabel,
}) => (
  <div className="mt-3 overflow-x-auto rounded-lg border border-black/10">
    <table className="w-full min-w-[420px] border-collapse text-left text-xs">
      <thead>
        <tr className="bg-[#FAF8F6] text-[#5b6470]">
          <th className="px-3 py-2 font-medium">Nume</th>
          <th className="px-3 py-2 font-medium">Descriere partener folosit</th>
          <th className="px-3 py-2 font-medium">Cookies</th>
        </tr>
      </thead>
      <tbody>
        {partners.map((partner) => (
          <tr key={partner.name} className="border-t border-black/5">
            <td className="px-3 py-2 font-medium text-[#262626]">{partner.name}</td>
            <td className="px-3 py-2 text-[#4b5563]">{partner.description}</td>
            <td className="px-3 py-2">
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ED5C1B] hover:underline"
              >
                {seeCookiesLabel}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <span className="sr-only">{cookiesLabel}</span>
  </div>
);

const CookiePreferencesModal: React.FC = () => {
  const { t } = useTranslation();
  const {
    consent,
    isPreferencesOpen,
    closePreferences,
    acceptAll,
    acceptNecessaryOnly,
    savePreferences,
  } = useCookieConsent();

  const [performance, setPerformance] = useState(consent.performance);
  const [marketing, setMarketing] = useState(consent.marketing);

  useEffect(() => {
    if (isPreferencesOpen) {
      setPerformance(consent.performance);
      setMarketing(consent.marketing);
    }
  }, [isPreferencesOpen, consent.performance, consent.marketing]);

  return (
    <Dialog open={isPreferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto rounded-2xl p-0 sm:p-0">
        <div className="p-6 sm:p-7">
          <DialogHeader className="text-left">
            <DialogTitle className="text-[1.15rem] font-medium tracking-[-0.01em] text-[#262626]">
              {t("cookieConsent.modal.title")}
            </DialogTitle>
          </DialogHeader>

          <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">
            {t("cookieConsent.modal.intro")}
          </p>

          <Accordion type="single" collapsible defaultValue="performance" className="mt-4">
            <AccordionItem value="necessary">
              <div className="flex items-center gap-3">
                <AccordionTrigger className="flex-1 text-sm font-medium text-[#262626]">
                  {t("cookieConsent.modal.necessary.title")}
                </AccordionTrigger>
                <span className="flex shrink-0 items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-[#5b6470]">
                  {t("cookieConsent.modal.necessary.always_active")}
                  <Switch checked disabled aria-label={t("cookieConsent.modal.necessary.title")} />
                </span>
              </div>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-[#4b5563]">
                  {t("cookieConsent.modal.necessary.description")}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="performance">
              <div className="flex items-center gap-3">
                <AccordionTrigger className="flex-1 text-sm font-medium text-[#262626]">
                  {t("cookieConsent.modal.performance.title")}
                </AccordionTrigger>
                <Switch
                  checked={performance}
                  onCheckedChange={setPerformance}
                  aria-label={t("cookieConsent.modal.performance.title")}
                />
              </div>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-[#4b5563]">
                  {t("cookieConsent.modal.performance.description")}
                </p>
                <PartnerTable
                  partners={[
                    {
                      name: t("cookieConsent.modal.performance.partner_ga_name"),
                      description: t("cookieConsent.modal.performance.partner_ga_description"),
                      url: "https://policies.google.com/technologies/cookies",
                    },
                  ]}
                  cookiesLabel="Google Analytics cookies"
                  seeCookiesLabel={t("cookieConsent.modal.performance.see_cookies_link")}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="marketing" className="border-b-0">
              <div className="flex items-center gap-3">
                <AccordionTrigger className="flex-1 text-sm font-medium text-[#262626]">
                  {t("cookieConsent.modal.marketing.title")}
                </AccordionTrigger>
                <Switch
                  checked={marketing}
                  onCheckedChange={setMarketing}
                  aria-label={t("cookieConsent.modal.marketing.title")}
                />
              </div>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-[#4b5563]">
                  {t("cookieConsent.modal.marketing.description")}
                </p>
                <PartnerTable
                  partners={[
                    {
                      name: t("cookieConsent.modal.marketing.partner_google_ads_name"),
                      description: t("cookieConsent.modal.marketing.partner_google_ads_description"),
                      url: "https://business.safety.google/adscookies/",
                    },
                    {
                      name: t("cookieConsent.modal.marketing.partner_meta_name"),
                      description: t("cookieConsent.modal.marketing.partner_meta_description"),
                      url: "https://www.facebook.com/privacy/policies/cookies/",
                    },
                    {
                      name: t("cookieConsent.modal.marketing.partner_tiktok_name"),
                      description: t("cookieConsent.modal.marketing.partner_tiktok_description"),
                      url: "https://www.tiktok.com/legal/page/global/tiktok-website-cookies-policy/en",
                    },
                  ]}
                  cookiesLabel="Marketing cookies"
                  seeCookiesLabel={t("cookieConsent.modal.marketing.see_cookies_link")}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-black/5 pt-5 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              className="btn btn-secondary btn-block sm:w-auto"
              onClick={() => savePreferences({ performance, marketing })}
            >
              {t("cookieConsent.modal.save_btn")}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-block sm:w-auto"
              onClick={acceptNecessaryOnly}
            >
              {t("cookieConsent.modal.accept_necessary_btn")}
            </button>
            <button type="button" className="btn btn-primary btn-block sm:w-auto" onClick={acceptAll}>
              {t("cookieConsent.modal.accept_all_btn")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesModal;
