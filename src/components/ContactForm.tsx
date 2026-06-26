import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
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
const BUDGET_VALUES = ["1.5-3k", "3-5k", "5k+", "discuss"] as const;

const ContactForm: React.FC<Props> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
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
        budget: z.enum(BUDGET_VALUES, {
          errorMap: () => ({ message: t("form.v_budget") }),
        }),
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
      budget: undefined as unknown as Values["budget"],
      company: "",
    },
    mode: "onBlur",
  });

  const [submitting, setSubmitting] = React.useState(false);

  // Watch field values to drive sequential stage reveals.
  const name = form.watch("name");
  const phone = form.watch("phone");
  const email = form.watch("email");
  const budget = form.watch("budget");

  // Lightweight validity checks for reveal logic only — silent (no error UI).
  // Real validation still runs onBlur via zod resolver and on submit.
  const nameOk = (name?.trim().length ?? 0) >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? "");
  const phoneOk = /^(\+[1-9]\d{6,14}|0\d{9})$/.test(
    (phone ?? "").replace(/[\s\-().]/g, "")
  );
  const detailsOk = !!budget;

  // Sticky max stage — only advances, never falls back. Prevents jarring
  // collapse if the user erases a field after revealing the next group.
  const [maxStage, setMaxStage] = React.useState(1);
  React.useEffect(() => {
    if (nameOk && maxStage < 2) setMaxStage(2);
    if (nameOk && emailOk && phoneOk && maxStage < 3) setMaxStage(3);
    if (nameOk && emailOk && phoneOk && detailsOk && maxStage < 4) setMaxStage(4);
  }, [nameOk, emailOk, phoneOk, detailsOk, maxStage]);

  const onSubmit = async (values: Values) => {
    setSubmitting(true);
    try {
      const normalizedPhone = values.phone.replace(/[\s\-().]/g, "");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          phone: normalizedPhone,
          locale: i18n.language?.startsWith("ro") ? "ro" : "en",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    "h-11 rounded-lg border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#262626] " +
    "placeholder:text-[#9CA3AF] shadow-none " +
    "transition-[border-color,box-shadow] duration-150 ease-out " +
    "hover:border-[#D1D5DB] " +
    "focus-visible:border-[#ED5C1B] focus-visible:ring-[3px] focus-visible:ring-[#ED5C1B]/15 focus-visible:ring-offset-0 " +
    "aria-[invalid=true]:border-[#EF4444] aria-[invalid=true]:hover:border-[#EF4444] " +
    "aria-[invalid=true]:focus-visible:border-[#EF4444] aria-[invalid=true]:focus-visible:ring-[#EF4444]/15";

  const labelClass = "text-[#262626] text-[13px] font-medium tracking-[0.01em]";

  const stepTitleClass =
    "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF] mb-2";

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

          {/* Stage 3 — Project Type + Budget */}
          {maxStage >= 3 && (
            <motion.div
              key="stage-3"
              layout="position"
              initial={stageInitial}
              animate={stageAnimate}
              transition={stageTransition}
            >
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className={labelClass}>
                      {t("form.budget_label")}
                      {required}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger className={fieldClass}>
                          <SelectValue placeholder={t("form.budget_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1.5-3k">{t("form.budget_low")}</SelectItem>
                        <SelectItem value="3-5k">{t("form.budget_mid")}</SelectItem>
                        <SelectItem value="5k+">{t("form.budget_high")}</SelectItem>
                        <SelectItem value="discuss">{t("form.budget_discuss")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[12.5px] font-normal text-[#EF4444]" />
                  </FormItem>
                )}
              />
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
              className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2"
            >
              {onClose && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={submitting}
                  className="text-[#5b6470] hover:text-[#262626] hover:bg-transparent"
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
      </form>
    </Form>
  );
};

export default ContactForm;
