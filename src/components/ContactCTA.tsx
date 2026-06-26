import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ContactForm from "@/components/ContactForm";

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
  const [open, setOpen] = React.useState(false);

  const close = React.useCallback(() => setOpen(false), []);

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
              <ContactForm onClose={close} />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop: smooth-scroll to the inline form section.
  const scrollToContact = (e: React.MouseEvent) => {
    const target = document.getElementById(CONTACT_SECTION_ID);
    if (!target) return;
    e.preventDefault();
    const offset = window.innerWidth < 768 ? 100 : 80;
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return <Slot onClick={scrollToContact}>{children}</Slot>;
};

export default ContactCTA;
