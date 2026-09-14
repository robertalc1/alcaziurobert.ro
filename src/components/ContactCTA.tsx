import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useContactModal } from "@/components/ContactModal";
import { scrollToEl } from "@/lib/scroll";

type Props = {
  children: React.ReactNode;
  /**
   * "auto" (default) keeps the original split: the overlay on phones, a smooth
   * scroll to the inline #contact form on desktop.
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
 *
 * A trigger and nothing more. The overlay itself lives once at the root of the
 * app (ContactModalProvider) — this component used to own a <Dialog>, a
 * <Drawer>, a lazy <ContactForm> and a scroll lock of its own, times the
 * thirteen places it is used. See ContactModal.tsx for what that cost.
 */
const ContactCTA: React.FC<Props> = ({ children, mode = "auto" }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { openContact } = useContactModal();

  const openOverlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Read synchronously: React nulls currentTarget once the handler returns.
    openContact(e.currentTarget as HTMLElement);
  };

  // Desktop, in-page triggers: smooth-scroll to the inline form section. When
  // the form isn't on the current page (e.g. /studii-de-caz), go home and let
  // Index scroll to it.
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(CONTACT_SECTION_ID);
    if (!target) {
      navigate("/", { state: { scrollTo: CONTACT_SECTION_ID } });
      return;
    }
    scrollToEl(target);
  };

  const useOverlay = isMobile || mode === "modal";

  return <Slot onClick={useOverlay ? openOverlay : scrollToContact}>{children}</Slot>;
};

export default ContactCTA;
