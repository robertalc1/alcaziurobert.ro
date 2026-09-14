import React from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Lazy: react-hook-form + zod arrive only when someone actually asks for the
// form, so they stay out of the eager Navbar/Hero graph.
const ContactForm = React.lazy(() => import("@/components/ContactForm"));

type ContactModalValue = {
  /** Opens the form. Pass the element that asked for it and focus returns there. */
  openContact: (trigger?: HTMLElement | null) => void;
};

const ContactModalContext = React.createContext<ContactModalValue | null>(null);

export function useContactModal(): ContactModalValue {
  const ctx = React.useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used inside <ContactModalProvider>");
  }
  return ctx;
}

/**
 * ONE contact overlay for the whole site.
 *
 * Every CTA on the page used to mount its own <Dialog> and its own copy of the
 * form — thirteen of them. That is what made the form "break on every button":
 *
 *  1. The fullscreen menu's CTA lived INSIDE the menu overlay, and Navbar
 *     unmounts that overlay 300ms after it closes (`{visible && createPortal}`).
 *     Tapping it opened the form and the form vanished with its own trigger.
 *  2. Thirteen `useScrollLock(open)` hooks fought over the same declarations on
 *     <html>.
 *  3. The page could hold two mounted forms at once (the inline card plus a
 *     modal), so `document.querySelector('[name="email"]')` — which is how the
 *     form focuses the first invalid field — could land in the wrong one.
 *
 * The overlay is mounted once, at the root, and the triggers only ask it to
 * open. Nothing that happens to a trigger can reach it any more.
 */
export const ContactModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [open, setOpen] = React.useState(false);
  // Once the lead is away the header is swapped rather than removed — Radix
  // needs a title for the dialog's accessible name, and "Tell me about the
  // project" sitting above "Got it" reads as a mistake.
  const [sent, setSent] = React.useState(false);

  // Radix restores focus to its own DialogTrigger, and there is none here: the
  // same overlay is opened from a dozen different buttons. Remember the one
  // that asked and hand focus back to it, or Escape drops a keyboard visitor
  // onto <body> at the top of the page.
  const restoreRef = React.useRef<HTMLElement | null>(null);

  // Vaul only locks the page on Safari and Radix writes to <body>, which this
  // site's `overflow-x: clip` root ignores — see use-scroll-lock. One lock,
  // owned here, instead of one per trigger.
  useScrollLock(open);

  const close = React.useCallback(() => setOpen(false), []);

  const openContact = React.useCallback((trigger?: HTMLElement | null) => {
    restoreRef.current = trigger ?? null;
    setSent(false);
    setOpen(true);
  }, []);

  const value = React.useMemo(() => ({ openContact }), [openContact]);

  const restoreFocus = React.useCallback((e: Event) => {
    if (!restoreRef.current?.isConnected) return;
    e.preventDefault();
    restoreRef.current.focus();
  }, []);

  const form = (
    <React.Suspense fallback={<div style={{ minHeight: 200 }} aria-hidden="true" />}>
      <ContactForm onClose={close} onSent={() => setSent(true)} />
    </React.Suspense>
  );

  const title = sent ? t("form.success_title") : t("form.title");

  return (
    <ContactModalContext.Provider value={value}>
      {children}

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent
            className="h-[92dvh] max-h-[92dvh] flex flex-col"
            onCloseAutoFocus={restoreFocus}
          >
            <DrawerHeader className="text-left flex-shrink-0">
              <DrawerTitle className={sent ? "sr-only" : undefined}>{title}</DrawerTitle>
              {!sent && <DrawerDescription>{t("form.subtitle")}</DrawerDescription>}
            </DrawerHeader>
            <div className="px-4 pb-8 overflow-y-auto flex-1 min-h-0">{form}</div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          {/* `flex flex-col` is load-bearing, not decoration: the shadcn base
              lays DialogContent out as a GRID, and in a grid the `flex-1
              min-h-0` on the scroller below is inert. The rows sized
              themselves to their content, overflowed `max-h-[88dvh]` and were
              CLIPPED by overflow-hidden — on a 720px-tall laptop the submit
              button sat outside the modal with no way to scroll to it.
              tailwind-merge drops `grid` for `flex`: same `display` group.

              Colours are inherited — --background / --border / --foreground are
              the light system (see the shadcn token bridge in index.css) — so
              the modal tracks the page instead of pinning its own hex. */}
          <DialogContent
            className="flex flex-col max-w-[560px] max-h-[88dvh] gap-0 overflow-hidden p-0 sm:rounded-2xl"
            onCloseAutoFocus={restoreFocus}
          >
            <DialogHeader className="flex-shrink-0 px-6 pt-6 text-left">
              <DialogTitle className={sent ? "sr-only" : undefined}>{title}</DialogTitle>
              {!sent && <DialogDescription>{t("form.subtitle")}</DialogDescription>}
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4">{form}</div>
          </DialogContent>
        </Dialog>
      )}
    </ContactModalContext.Provider>
  );
};

export default ContactModalProvider;
