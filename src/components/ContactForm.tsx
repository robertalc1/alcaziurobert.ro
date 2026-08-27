import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { trackLead } from "@/lib/analytics";
import { trackPixelLead } from "@/lib/marketingPixels";
import { toast } from "sonner";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  onClose?: () => void;
};

const PROJECT_VALUES = ["website", "webapp", "other"] as const;

const ContactForm: React.FC<Props> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { consent } = useCookieConsent();
  const prefersReduced = useReducedMotion();

  // Schema rebuilt per render so validation messages follow the active language.
  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, { message: t("form.v_name") }).max(80),
        email: z
          .string()
          .trim()
          .email({ message: t("form.v_email") })
          .max(120),
        phone: z
          .string()
          .trim()
          .min(1, { message: t("form.v_phone_required") })
          .max(20, { message: t("form.v_phone") })
          .refine(
            (v) => /^(\+[1-9]\d{6,14}|0\d{9})$/.test(v.replace(/[\s\-().]/g, "")),
            { message: t("form.v_phone") }
          ),
        projectType: z.enum(PROJECT_VALUES, {
          errorMap: () => ({ message: t("form.v_project") }),
        }),
        message: z.string().trim().max(1000, { message: t("form.v_message") }).optional(),
        company: z.string().optional(),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language]
  );

  type Values = z.infer<typeof schema>;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "website",
      message: "",
      company: "",
    },
    mode: "onBlur",
  });

  const [submitting, setSubmitting] = React.useState(false);

  // Watch field values to drive sequential stage reveals.
  const name = form.watch("name");
  const phone = form.watch("phone");
  const email = form.watch("email");
  const projectType = form.watch("projectType");

  // Lightweight validity checks for reveal logic only — silent (no error UI).
  // Real validation still runs onBlur via zod resolver and on submit.
  const nameOk = (name?.trim().length ?? 0) >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? "");
  const phoneOk = /^(\+[1-9]\d{6,14}|0\d{9})$/.test(
    (phone ?? "").replace(/[\s\-().]/g, "")
  );
  const detailsOk = !!projectType;

  // Sticky max stage — only advances, never falls back. Prevents jarring
  // collapse if the user erases a field after revealing the next group.
  //
  // One step per commit, via the functional updater: reading `maxStage` from
  // the closure made all three `setMaxStage` calls see the same stale value in
  // a single effect run, so the last one won and stages 3 and 4 appeared at
  // the same instant — the reveal stopped being progressive past step 2.
  const [maxStage, setMaxStage] = React.useState(1);
  React.useEffect(() => {
    setMaxStage((stage) => {
      if (stage < 2) return nameOk ? 2 : stage;
      if (stage < 3) return nameOk && emailOk && phoneOk ? 3 : stage;
      if (stage < 4) return nameOk && emailOk && phoneOk && detailsOk ? 4 : stage;
      return stage;
    });
    // `maxStage` is a dependency so the effect re-runs after each advance and
    // can unlock the next step; returning the same value bails out of the
    // re-render, so this settles instead of looping.
  }, [nameOk, emailOk, phoneOk, detailsOk, maxStage]);

  const onSubmit = async (values: Values) => {
    setSubmitting(true);
    const locale = i18n.language?.startsWith("ro") ? "ro" : "en";
    // Shared between the browser pixel's Lead and the server's CAPI Lead so
    // Meta deduplicates the pair instead of counting one lead twice.
    const eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    try {
      const normalizedPhone = values.phone.replace(/[\s\-().]/g, "");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          phone: normalizedPhone,
          locale,
          eventId,
          pageUrl: window.location.href,
          // Gates the server-side Meta CAPI event — no marketing consent, no event.
          marketingConsent: consent.marketing === true,
        }),
      });

      if (res.status === 429) {
        toast.error(t("form.toast_rate_title"), {
          description: t("form.toast_rate_body"),
        });
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Conversion signals. Each no-ops unless its own consent category was
      // accepted, so this never fires anything the visitor refused.
      trackLead(values.projectType, locale);
      if (consent.marketing === true) trackPixelLead(eventId);

      toast.success(t("form.toast_ok_title"), {
        description: t("form.toast_ok_body"),
      });
      form.reset();
      setMaxStage(1);
      onClose?.();
    } catch {
      toast.error(t("form.toast_err_title"), {
        description: t("form.toast_err_body"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Shared input styling (premium hairline / brand orange focus).
  const fieldClass =
    "h-11 rounded-lg border border-white/20 bg-white/[0.04] px-4 text-[15px] text-[#F5F5F5] " +
    "placeholder:text-white/50 shadow-none " +
    "transition-[border-color,box-shadow] duration-150 ease-out " +
    "hover:border-white/30 " +
    "focus-visible:border-[#ED5C1B] focus-visible:ring-[3px] focus-visible:ring-[#ED5C1B]/15 focus-visible:ring-offset-0 " +
    "aria-[invalid=true]:border-[#EF4444] aria-[invalid=true]:hover:border-[#EF4444] " +
    "aria-[invalid=true]:focus-visible:border-[#EF4444] aria-[invalid=true]:focus-visible:ring-[#EF4444]/15";

  const labelClass = "text-[#F5F5F5] text-[13px] font-medium tracking-[0.01em]";

  const stepTitleClass =
    "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C4C9D0] mb-2";

  const required = (
    <span className="text-[#EF4444] ml-0.5" aria-hidden="true">
      *
    </span>
  );

  const stageTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.23, 1, 0.32, 1] as const };

  const stageInitial = prefersReduced ? false : { opacity: 0, y: 12 };
  const stageAnimate = { opacity: 1, y: 0 };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Honeypot — hidden field bots fill in; humans never see it */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          <label>
            Company
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("company")}
            />
          </label>
        </div>

        {/* Stage 1 — Name (always visible) */}
        <motion.div layout="position">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClass}>
                  {t("form.name_label")}
                  {required}
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder={t("form.name_placeholder")}
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[12.5px] font-normal text-[#EF4444]" />
              </FormItem>
            )}
          />
        </motion.div>

        <AnimatePresence mode="popLayout" initial={false}>
          {/* Stage 2 — Phone + Email */}
          {maxStage >= 2 && (
            <motion.div
              key="stage-2"
              layout="position"
              initial={stageInitial}
              animate={stageAnimate}
              transition={stageTransition}
            >
              <p className={stepTitleClass}>{t("form.step2_title")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className={labelClass}>
                        {t("form.phone_label")}
                        {required}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder={t("form.phone_placeholder")}
                          className={fieldClass}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[12.5px] font-normal text-[#EF4444]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className={labelClass}>
                        {t("form.email_label")}
                        {required}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder={t("form.email_placeholder")}
                          className={fieldClass}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[12.5px] font-normal text-[#EF4444]" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* Stage 3 — Project type + free-text brief */}
          {maxStage >= 3 && (
            <motion.div
              key="stage-3"
              layout="position"
              initial={stageInitial}
              animate={stageAnimate}
              transition={stageTransition}
            >
              <p className={stepTitleClass}>{t("form.step3_title")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className={labelClass}>
                        {t("form.project_label")}
                        {required}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger className={fieldClass}>
                            <SelectValue placeholder={t("form.project_placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="website">{t("form.project_website")}</SelectItem>
                          <SelectItem value="webapp">{t("form.project_webapp")}</SelectItem>
                          <SelectItem value="other">{t("form.project_other")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[12.5px] font-normal text-[#EF4444]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel className={labelClass}>{t("form.message_label")}</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={3}
                          maxLength={1000}
                          placeholder={t("form.message_placeholder")}
                          className={fieldClass.replace("h-11", "min-h-[88px] py-3") + " resize-y w-full"}
                        />
                      </FormControl>
                      <FormMessage className="text-[12.5px] font-normal text-[#EF4444]" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* Stage 4 — Send (+ Cancel on mobile drawer) */}
          {maxStage >= 4 && (
            <motion.div
              key="stage-4"
              layout="position"
              initial={stageInitial}
              animate={stageAnimate}
              transition={stageTransition}
              className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-end pt-2"
            >
              <p className="text-[12.5px] text-[#C4C9D0] text-center sm:text-left sm:mr-auto m-0">
                {t("form.subtitle")}
              </p>
              {onClose && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={submitting}
                  className="text-[#C4C9D0] hover:text-[#F5F5F5] hover:bg-transparent"
                >
                  {t("form.cancel")}
                </Button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={t("form.submit")}
              >
                <span className="flex items-center gap-2 leading-none">
                  {submitting ? t("form.submitting") : t("form.submit")}
                  {!submitting && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 19L19 5" />
                      <path d="M9 5h10v10" />
                    </svg>
                  )}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GDPR art. 13 — information notice at the point of collection, so it
            is visible from the first field, not only at the submit step. */}
        {(
          <p className="text-[12.5px] sm:text-[11.5px] leading-relaxed text-[#C4C9D0] m-0 pt-1">
            <Trans
              i18nKey="form.privacy_note"
              components={{
                privacy: (
                  <Link
                    to="/politica-de-confidentialitate"
                    className="underline underline-offset-2 hover:text-[#ED5C1B]"
                  />
                ),
              }}
            />
          </p>
        )}
      </form>
    </Form>
  );
};

export default ContactForm;
