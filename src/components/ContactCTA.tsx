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
import { scrollToEl } from "@/lib/scroll";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// Lazy: the drawer's form chunk (react-hook-form + zod) loads only when the
// drawer actually opens — keeps it out of the eager Navbar/Hero graph.
const ContactForm = React.lazy(() => import("@/components/ContactForm"));

type Props = {
  children: React.ReactNode;
};

const CONTACT_SECTION_ID = "contact";

/**
 * Wraps any trigger element. On mobile (<768px), opens a bottom-sheet Drawer
 * containing the ContactForm. On desktop, smooth-scrolls to the inline form
 * rendered inside GetInTouchSection (id="contact").
 */
const ContactCTA: React.FC<Props> = ({ children }) => {
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

  if (isMobile) {
    const openDrawer = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSent(false);
      setOpen(true);
    };
    return (
      <>
        <Slot onClick={openDrawer}>{children}</Slot>
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
            <div className="px-4 pb-8 overflow-y-auto flex-1 min-h-0">
              <React.Suspense fallback={<div style={{ minHeight: 200 }} aria-hidden="true" />}>
                <ContactForm onClose={close} onSent={() => setSent(true)} />
              </React.Suspense>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop: smooth-scroll to the inline form section. When the form isn't on
  // the current page (e.g. /studii-de-caz), go home and let Index scroll to it.
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
