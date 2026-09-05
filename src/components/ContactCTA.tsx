import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { scrollToEl } from "@/lib/scroll";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// Lazy: the drawer's form chunk (react-hook-form + zod) loads only when the
// drawer actually opens — keeps it out of the eager Navbar/Hero graph.
const ContactForm = React.lazy(() => import("@/components/ContactForm"));

type Props = {
  children: React.ReactNode;
  /**
   * "auto" (default) keeps the original split: a bottom sheet on phones, a
   * smooth scroll to the inline #contact form on desktop.
   *
   * "modal" opens the form in place on desktop too, without moving the page.
   * It is for triggers that live in persistent chrome — the navbar sits on top
   * of whatever the visitor is reading, so sending them to the bottom of the
   * page costs them their place. In-page section CTAs deliberately stay on
   * "auto": there the scroll is the funnel, not a detour.
   */
  mode?: "auto" | "modal";
};

const CONTACT_SECTION_ID = "contact";

/**
 * Wraps any trigger element and gives it the contact form.
 */
const ContactCTA: React.FC<Props> = ({ children, mode = "auto" }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const [sent, setSent] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  // Vaul only locks the page on Safari: `usePositionFixed` returns early when
  // `!isSafari()`, and its mobile path runs `if (isIOS())`. On Android Chrome
  // the drawer opened over a page that was still free to scroll — the same
  // defect that was reported on the fullscreen menu, in the one component that
  // brings in leads. This lock is on the root element, Vaul's is on <body>, so
  // the two can hold at once without fighting. It also pauses Lenis, which a
  // narrow desktop window (<768px with a mouse) still has running.
  useScrollLock(open);

  // Radix restores focus to its own DialogTrigger on close, and this component
  // does not use one — it owns `open` so the same trigger can drive a Drawer on
  // phones. Without the trigger, closing the modal dropped focus onto <body>: a
  // keyboard visitor who opened the form from the navbar and pressed Escape had
  // to tab from the top of the page to get anywhere. Remember the element that
  // opened it and hand focus back.
  const restoreRef = React.useRef<HTMLElement | null>(null);

  const openOverlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    restoreRef.current = e.currentTarget as HTMLElement;
    setSent(false);
    setOpen(true);
  };

  const form = (
    <React.Suspense fallback={<div style={{ minHeight: 200 }} aria-hidden="true" />}>
      <ContactForm onClose={close} onSent={() => setSent(true)} />
    </React.Suspense>
  );

  if (isMobile) {
    return (
      <>
        <Slot onClick={openOverlay}>{children}</Slot>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="h-[92dvh] max-h-[92dvh] flex flex-col">
            {/* Radix requires a title for the dialog's accessible name, so once
                the form is sent the header is swapped rather than removed. */}
            <DrawerHeader className="text-left flex-shrink-0">
              <DrawerTitle className={sent ? "sr-only" : undefined}>
                {sent ? t("form.success_title") : t("form.title")}
              </DrawerTitle>
              {!sent && <DrawerDescription>{t("form.subtitle")}</DrawerDescription>}
            </DrawerHeader>
            <div className="px-4 pb-8 overflow-y-auto flex-1 min-h-0">{form}</div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop, persistent-chrome triggers: the same form, centred, page left
  // where it was.
  if (mode === "modal") {
    return (
      <>
        <Slot onClick={openOverlay}>{children}</Slot>
        <Dialog open={open} onOpenChange={setOpen}>
          {/* The shadcn default is max-w-lg on `bg-background`, which is a light
              surface — every colour here is stated rather than inherited so the
              modal cannot drift away from the dark system around it. p-0 + an
              inner scroller keeps a long form scrolling inside the modal
              instead of growing it past the viewport. */}
          <DialogContent
            className="max-w-[560px] max-h-[88dvh] gap-0 overflow-hidden border-white/10 bg-[#141414] p-0 text-[#F5F5F5] sm:rounded-2xl"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              restoreRef.current?.focus();
            }}
          >
            <DialogHeader className="flex-shrink-0 px-6 pt-6 text-left">
              <DialogTitle className={sent ? "sr-only" : undefined}>
                {sent ? t("form.success_title") : t("form.title")}
              </DialogTitle>
              {!sent && (
                <DialogDescription className="text-[rgba(245,245,245,0.62)]">
                  {t("form.subtitle")}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4">{form}</div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop, in-page triggers: smooth-scroll to the inline form section. When
  // the form isn't on the current page (e.g. /studii-de-caz), go home and let
  // Index scroll to it.
  const scrollToContact = (e: React.MouseEvent) => {
    const target = document.getElementById(CONTACT_SECTION_ID);
    if (!target) {
      e.preventDefault();
      navigate("/", { state: { scrollTo: CONTACT_SECTION_ID } });
      return;
    }
    e.preventDefault();
    scrollToEl(target);
  };

  return <Slot onClick={scrollToContact}>{children}</Slot>;
};

export default ContactCTA;
