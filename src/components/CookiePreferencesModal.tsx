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

/** One storage entry disclosed to the visitor: what it is, why, how long. */
interface StorageRow {
  name: string;
  purpose: string;
  duration: string;
  /** Provider's own cookie policy — omitted for first-party storage. */
  url?: string;
}

const StorageTable: React.FC<{ rows: StorageRow[]; linkLabel: string }> = ({
  rows,
  linkLabel,
}) => {
  const { t } = useTranslation();
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[460px] border-collapse text-left text-xs">
        <thead>
          <tr className="bg-white/[0.06] text-white/60">
            <th className="px-3 py-2 font-medium">{t("cookieConsent.modal.table_name")}</th>
            <th className="px-3 py-2 font-medium">{t("cookieConsent.modal.table_purpose")}</th>
            <th className="px-3 py-2 font-medium">{t("cookieConsent.modal.table_duration")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-white/10 align-top">
              <td className="px-3 py-2 font-medium text-[#F5F5F5] whitespace-nowrap">
                {row.name}
              </td>
              <td className="px-3 py-2 text-white/70">
                {row.purpose}
                {row.url && (
                  <>
                    {" "}
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ED5C1B] hover:underline whitespace-nowrap"
                    >
                      {linkLabel}
                    </a>
                  </>
                )}
              </td>
              <td className="px-3 py-2 text-white/70 whitespace-nowrap">{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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

  const linkLabel = t("cookieConsent.modal.see_cookies_link");
  const titleClass = "flex-1 text-sm font-medium text-[#F5F5F5]";
  const bodyClass = "text-sm leading-relaxed text-white/70";

  return (
    <Dialog open={isPreferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto rounded-2xl p-0 sm:p-0">
        <div className="p-6 sm:p-7">
          <DialogHeader className="text-left">
            <DialogTitle className="text-[1.15rem] font-medium tracking-[-0.01em] text-[#F5F5F5]">
              {t("cookieConsent.modal.title")}
            </DialogTitle>
          </DialogHeader>

          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {t("cookieConsent.modal.intro")}
          </p>

          <Accordion type="single" collapsible defaultValue="performance" className="mt-4">
            <AccordionItem value="necessary" className="border-white/10">
              <div className="flex items-center gap-3">
                <AccordionTrigger className={titleClass}>
                  {t("cookieConsent.modal.necessary.title")}
                </AccordionTrigger>
                <span className="flex shrink-0 items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/55">
                  {t("cookieConsent.modal.necessary.always_active")}
                  <Switch checked disabled aria-label={t("cookieConsent.modal.necessary.title")} />
                </span>
              </div>
              <AccordionContent>
                <p className={bodyClass}>{t("cookieConsent.modal.necessary.description")}</p>
                <StorageTable
                  linkLabel={linkLabel}
                  rows={[
                    {
                      name: "cookieConsent",
                      purpose: t("cookieConsent.modal.necessary.row_consent_purpose"),
                      duration: t("cookieConsent.modal.duration_12m"),
                    },
                    {
                      name: "lang",
                      purpose: t("cookieConsent.modal.necessary.row_lang_purpose"),
                      duration: t("cookieConsent.modal.duration_until_cleared"),
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="performance" className="border-white/10">
              <div className="flex items-center gap-3">
                <AccordionTrigger className={titleClass}>
                  {t("cookieConsent.modal.performance.title")}
                </AccordionTrigger>
                <Switch
                  checked={performance}
                  onCheckedChange={setPerformance}
                  aria-label={t("cookieConsent.modal.performance.title")}
                />
              </div>
              <AccordionContent>
                <p className={bodyClass}>{t("cookieConsent.modal.performance.description")}</p>
                <StorageTable
                  linkLabel={linkLabel}
                  rows={[
                    {
                      name: "_ga, _ga_*",
                      purpose: t("cookieConsent.modal.performance.partner_ga_description"),
                      duration: t("cookieConsent.modal.duration_2y"),
                      url: "https://policies.google.com/technologies/cookies",
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="marketing" className="border-b-0">
              <div className="flex items-center gap-3">
                <AccordionTrigger className={titleClass}>
                  {t("cookieConsent.modal.marketing.title")}
                </AccordionTrigger>
                <Switch
                  checked={marketing}
                  onCheckedChange={setMarketing}
                  aria-label={t("cookieConsent.modal.marketing.title")}
                />
              </div>
              <AccordionContent>
                <p className={bodyClass}>{t("cookieConsent.modal.marketing.description")}</p>
                <StorageTable
                  linkLabel={linkLabel}
                  rows={[
                    {
                      name: "_fbp",
                      purpose: t("cookieConsent.modal.marketing.partner_meta_description"),
                      duration: t("cookieConsent.modal.duration_3m"),
                      url: "https://www.facebook.com/privacy/policies/cookies/",
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-5 sm:flex-row sm:flex-wrap">
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
