import React from "react";
import ContactForm from "@/components/ContactForm";

type Props = {
  /** DOM id for the card, so anything can link or scroll to the form. */
  id: string;
  title: string;
  note: string;
};

/**
 * The white form card that sits on a dark panel.
 *
 * It began as HeroContactCard, with the hero's copy and its id baked in. The
 * hero makes its ask with a button now and the closing panel owns the only
 * form on the page, so everything that was hardcoded is a prop: whoever mounts
 * it says what it is called and what it says.
 *
 * Lives in its own lazy chunk so react-hook-form/zod never enter the critical
 * bundle — mount it behind a <Suspense> with .form-card-ph as the fallback, or
 * the card landing shifts the page.
 *
 * Styling is in index.css (.form-card*) rather than a local <style>, so a
 * second instance anywhere would not inject the same rules twice.
 */
const ContactFormCard: React.FC<Props> = ({ id, title, note }) => (
  <div className="form-card" id={id}>
    <h2 className="form-card-title">{title}</h2>
    <p className="form-card-note">{note}</p>
    <ContactForm />
  </div>
);

export default ContactFormCard;
