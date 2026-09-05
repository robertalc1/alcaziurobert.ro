/**
 * The one place the contact details live.
 *
 * The phone number used to be re-typed in four components (footer, mobile bar,
 * navbar overlay, form success screen) in three different shapes — E.164 for
 * `tel:`, digits-only for `wa.me`, spaced for display. A fifth copy was about
 * to land in the navbar's new call button. Changing a number that exists in
 * five places is a change you get wrong once and never notice, because every
 * copy still renders fine.
 */

/** E.164, for `tel:` and `wa.me`. Always dialable from abroad — the business
 *  takes traffic from outside Romania and `0773…` only works domestically. */
export const PHONE_TEL = "+40773858164";

/** wa.me refuses the leading `+`. */
export const PHONE_WA = "40773858164";

/** Human grouping, for anywhere the number is actually shown. */
export const PHONE_DISPLAY = "+40 773 858 164";

export const EMAIL_ADDRESS = "contact@alcaziurobert.ro";

export const WHATSAPP_URL = `https://wa.me/${PHONE_WA}`;
