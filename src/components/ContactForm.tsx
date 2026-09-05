import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { trackFormStart, trackLead } from "@/lib/analytics";
import { WHATSAPP_URL } from "@/lib/contact";
import { trackPixelFormStart, trackPixelLead } from "@/lib/marketingPixels";
import { caretAfterFormat, formatPhone, isValidPhone, toE164 } from "@/lib/phone";
import { suggestEmail } from "@/lib/emailTypo";
import { toast } from "sonner";

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
  /** Fired once the lead is away, so a surrounding drawer can drop its header —
      "Tell me about the project" sitting above "Got it" reads as a mistake. */
  onSent?: () => void;
};

const PROJECT_VALUES = ["website", "webapp", "other"] as const;
const MESSAGE_MAX = 1000;

/** Small inline tick shown once a required field is filled in correctly. */
const ValidTick: React.FC = () => (
  <svg
    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#22C55E"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ContactForm: React.FC<Props> = ({ onClose, onSent }) => {
  const { t, i18n } = useTranslation();
  const { consent } = useCookieConsent();

  // Schema rebuilt per render so validation messages follow the active language.
  const schema = React.useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(2, { message: t("form.v_name") })
          .max(80, { message: t("form.v_name_long") }),
        email: z
          .string()
          .trim()
          .min(1, { message: t("form.v_email_required") })
          .email({ message: t("form.v_email") })
          .max(120, { message: t("form.v_email") }),
        phone: z
          .string()
          .trim()
          .min(1, { message: t("form.v_phone_required") })
          .refine(isValidPhone, { message: t("form.v_phone") }),
        projectType: z.enum(PROJECT_VALUES, {
          errorMap: () => ({ message: t("form.v_project") }),
        }),
        message: z
          .string()
          .trim()
          .max(MESSAGE_MAX, { message: t("form.v_message") })
          .optional(),
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
      projectType: undefined,
      message: "",
      company: "",
    },
    // Errors appear when the visitor leaves a field, then clear the moment the
    // field becomes valid again. Validating on every keystroke from the first
    // character would flag every half-typed email as wrong.
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [emailSuggestion, setEmailSuggestion] = React.useState<string | null>(null);

  const { isSubmitted, touchedFields, errors } = form.formState;

  // Upper-funnel signal: the visitor engaged with the form, whether or not they
  // finish. Fires once per mounted form, and only through the consent-gated
  // trackers, so a refused category still sends nothing.
  const startedRef = React.useRef(false);
  const markStarted = React.useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStart();
    trackPixelFormStart();
  }, []);

  /** A required field counts as "good" once it has been touched and has no error. */
  const isGood = (field: keyof Values) => {
    const value = form.watch(field);
    return (
      (touchedFields[field] || isSubmitted) &&
      !errors[field] &&
      typeof value === "string" &&
      value.trim().length > 0
    );
  };

  const messageValue = form.watch("message") ?? "";

  const onSubmit = async (values: Values) => {
    setSubmitting(true);
    const locale = i18n.language?.startsWith("ro") ? "ro" : "en";
    // Shared between the browser pixel's Lead and the server's CAPI Lead so
    // Meta deduplicates the pair instead of counting one lead twice.
    const eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          // E.164 everywhere downstream: the inbox shows a dialable number and
          // Meta gets the exact shape it hashes for matching.
          phone: toE164(values.phone),
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

      // No success toast. This is the single most important moment on the site
      // and it used to be a notification that vanished in three seconds while
      // the drawer shut itself — the visitor was returned to the page they had
      // already decided to leave. The form hands over to a success screen
      // instead, and the visitor closes it themselves.
      setSent(true);
      onSent?.();
      form.reset();
      setEmailSuggestion(null);
      // `startedRef` deliberately stays true. Clearing it here re-armed the
      // event, and the field changes that reset() itself produces then bubbled
      // into onChangeCapture — every successful lead was followed by a phantom
      // FormStart. One start per mounted form is what the metric means anyway.
    } catch {
      toast.error(t("form.toast_err_title"), {
        description: t("form.toast_err_body"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Submitting with errors must land the visitor on the first thing to fix —
   * on mobile the offending field is often well off screen, and a form that
   * simply refuses to send without saying where is a lead lost outright.
   */
  const onInvalid = (fieldErrors: Record<string, unknown>) => {
    const order: (keyof Values)[] = ["name", "phone", "email", "projectType", "message"];
    const first = order.find((key) => key in fieldErrors);
    if (!first) return;
    // The project-type control is a Radix trigger, not an <input>, so it is
    // tagged with data-field instead of name — without the second selector the
    // one field a visitor is most likely to skip would never get focused.
    const el = document.querySelector<HTMLElement>(
      `[name="${first}"], [data-field="${first}"]`
    );
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      el.focus({ preventScroll: true });
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

  const labelClass =
    "flex items-center gap-1.5 text-[#F5F5F5] text-[13px] font-medium tracking-[0.01em]";
  const messageClass = "text-[12.5px] font-normal text-[#EF4444]";
  const optionalClass = "text-[11.5px] font-normal text-[#8A9099]";

  const required = (
    <span className="text-[#ED5C1B]" aria-hidden="true">
      *
    </span>
  );

  if (sent) {
    return (
      <div className="cf-sent" role="status" aria-live="polite">
        <style>{`
          .cf-sent {
            display: flex;
            flex-direction: column;
            gap: 16px;
            font-family: var(--font-sans);
            animation: cfSentIn .4s cubic-bezier(.16,1,.3,1) both;
          }
          @keyframes cfSentIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: none; }
          }
          .cf-sent-tick {
            width: 40px; height: 40px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--btn-gloss);
            box-shadow: var(--btn-gloss-shadow-sm);
            color: #fff;
          }
          .cf-sent-tick svg {
            width: 19px; height: 19px;
            fill: none; stroke: currentColor; stroke-width: 2.4;
            stroke-linecap: round; stroke-linejoin: round;
          }
          .cf-sent-title {
            margin: 0;
            font-size: clamp(1.15rem, 2.2vw, 1.45rem);
            font-weight: 500;
            letter-spacing: -0.022em;
            line-height: 1.25;
            color: #F5F5F5;
          }
          .cf-sent-body {
            margin: 0;
            font-size: 14.5px;
            line-height: 1.62;
            color: rgba(245, 245, 245, 0.72);
          }
          .cf-sent-guarantee {
            margin: 0;
            padding: 14px 16px;
            border-radius: 12px;
            border: 1px solid rgba(237, 92, 27, 0.28);
            background: rgba(237, 92, 27, 0.08);
            font-size: 13.5px;
            line-height: 1.55;
            color: rgba(245, 245, 245, 0.82);
          }
          .cf-sent-proof {
            margin: 0;
            font-size: 13px;
            color: rgba(245, 245, 245, 0.55);
          }
          .cf-sent-actions {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px 18px;
            margin-top: 4px;
          }
          .cf-sent-wa {
            display: inline-flex;
            align-items: center;
            min-height: var(--btn-h);
            padding: 0 var(--btn-px);
            border-radius: 9999px;
            border: 1px solid var(--btn-steel-border-hover);
            background: var(--btn-steel);
            color: #F5F5F5;
            font-size: var(--btn-font);
            font-weight: 500;
            text-decoration: none;
          }
          .cf-sent-wa:hover { background: var(--btn-steel-hover); color: #fff; }
          .cf-sent-close {
            min-height: var(--btn-h);
            padding: 0 8px;
            background: none;
            border: 0;
            color: rgba(245, 245, 245, 0.62);
            font-family: var(--font-sans);
            font-size: var(--btn-font);
            cursor: pointer;
          }
          .cf-sent-close:hover { color: #F5F5F5; }
          @media (prefers-reduced-motion: reduce) {
            .cf-sent { animation: none; }
          }
        `}</style>

        <span className="cf-sent-tick" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 12.5l5.2 5.2L20 7" />
          </svg>
        </span>

        <h3 className="cf-sent-title">{t("form.success_title")}</h3>
        <p className="cf-sent-body">{t("form.success_body")}</p>
        <p className="cf-sent-guarantee">{t("form.success_guarantee")}</p>
        <p className="cf-sent-proof">{t("form.success_proof")}</p>

        <div className="cf-sent-actions">
          <a
            className="cf-sent-wa"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("form.success_whatsapp")}
          </a>
          {onClose && (
            <button type="button" className="cf-sent-close" onClick={onClose}>
              {t("form.success_close")}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        onChangeCapture={markStarted}
        className="space-y-4"
        noValidate
      >
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

        {/* Name */}
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
                <div className="relative">
                  <Input
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    aria-required="true"
                    placeholder={t("form.name_placeholder")}
                    className={fieldClass + (isGood("name") ? " pr-10" : "")}
                    {...field}
                  />
                  {isGood("name") && <ValidTick />}
                </div>
              </FormControl>
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone — formatted live as the visitor types */}
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
                  <div className="relative">
                    <Input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      enterKeyHint="next"
                      aria-required="true"
                      maxLength={22}
                      placeholder={t("form.phone_placeholder")}
                      className={fieldClass + (isGood("phone") ? " pr-10" : "")}
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const input = e.currentTarget;
                        const caret = input.selectionStart ?? input.value.length;
                        const formatted = formatPhone(input.value);
                        const next = caretAfterFormat(input.value, caret, formatted);
                        field.onChange(formatted);
                        // The value React writes back lands after this tick, so
                        // the caret has to be restored after the paint or it
                        // snaps to the end on every separator insertion.
                        requestAnimationFrame(() => {
                          try {
                            input.setSelectionRange(next, next);
                          } catch {
                            /* input type may not support selection ranges */
                          }
                        });
                      }}
                    />
                    {isGood("phone") && <ValidTick />}
                  </div>
                </FormControl>
                <FormMessage className={messageClass} />
              </FormItem>
            )}
          />

          {/* Email */}
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
                  <div className="relative">
                    <Input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      enterKeyHint="next"
                      aria-required="true"
                      spellCheck={false}
                      placeholder={t("form.email_placeholder")}
                      className={fieldClass + (isGood("email") ? " pr-10" : "")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (emailSuggestion) setEmailSuggestion(null);
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        setEmailSuggestion(suggestEmail(e.currentTarget.value));
                      }}
                    />
                    {isGood("email") && !emailSuggestion && <ValidTick />}
                  </div>
                </FormControl>
                <FormMessage className={messageClass} />
                {/* A valid-but-probably-mistyped domain: offered, never enforced. */}
                {emailSuggestion && !errors.email && (
                  <p className="text-[12.5px] text-[#C4C9D0] m-0">
                    <Trans
                      i18nKey="form.email_suggestion"
                      values={{ suggestion: emailSuggestion }}
                      components={{
                        fix: (
                          <button
                            type="button"
                            className="underline underline-offset-2 text-[#ED5C1B] hover:opacity-80"
                            onClick={() => {
                              form.setValue("email", emailSuggestion, {
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                              setEmailSuggestion(null);
                            }}
                          />
                        ),
                      }}
                    />
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* Project type */}
        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className={labelClass}>
                {t("form.project_label")}
                {required}
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  markStarted();
                  field.onChange(value);
                }}
                value={field.value ?? ""}
              >
                <FormControl>
                  <SelectTrigger
                    aria-required="true"
                    data-field="projectType"
                    className={fieldClass + " [&>span]:truncate"}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder={t("form.project_placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="website">{t("form.project_website")}</SelectItem>
                  <SelectItem value="webapp">{t("form.project_webapp")}</SelectItem>
                  <SelectItem value="other">{t("form.project_other")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className={labelClass}>
                {t("form.message_label")}
                <span className={optionalClass}>{t("form.optional")}</span>
              </FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={3}
                  maxLength={MESSAGE_MAX}
                  placeholder={t("form.message_placeholder")}
                  className={
                    fieldClass.replace("h-11", "min-h-[92px] py-3") + " resize-y w-full"
                  }
                />
              </FormControl>
              <div className="flex items-start justify-between gap-3">
                <FormMessage className={messageClass} />
                {messageValue.length > MESSAGE_MAX - 200 && (
                  <span className="ml-auto text-[11.5px] tabular-nums text-[#8A9099]">
                    {messageValue.length}/{MESSAGE_MAX}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-end pt-1">
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
        </div>

        {/* GDPR art. 13 — information notice at the point of collection, so it
            is visible from the first field, not only at the submit step. */}
        <p className="text-[12.5px] sm:text-[11.5px] leading-relaxed text-[#C4C9D0] m-0">
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
      </form>
    </Form>
  );
};

export default ContactForm;
