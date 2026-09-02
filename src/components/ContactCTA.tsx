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
import { startLenis, stopLenis } from "@/lib/lenis";

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

  const close = React.useCallback(() => setOpen(false), []);

  // The drawer is mobile-first, but a narrow desktop window (<768px with a
  // mouse) gets both the drawer AND the smooth-scroll layer — so the layer has
  // to be paused for the same reason the cookie dialog pauses it.
  React.useEffect(() => {
    if (!open) return;
    stopLenis();
    return () => startLenis();
  }, [open]);

  if (isMobile) {
    const openDrawer = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    };
    return (
      <>
        <Slot onClick={openDrawer}>{children}</Slot>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="h-[92vh] max-h-[92vh] flex flex-col">
            <DrawerHeader className="text-left flex-shrink-0">
              <DrawerTitle>{t("form.title")}</DrawerTitle>
              <DrawerDescription>{t("form.subtitle")}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-8 overflow-y-auto flex-1 min-h-0">
              <React.Suspense fallback={<div style={{ minHeight: 200 }} aria-hidden="true" />}>
                <ContactForm onClose={close} />
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
