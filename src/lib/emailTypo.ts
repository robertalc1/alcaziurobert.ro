/**
 * Domain-typo suggestion for the contact form's email field.
 *
 * A mistyped domain is the one form error that passes validation and still
 * loses the lead: the message arrives, the reply bounces, and nobody finds out.
 * So a syntactically valid address whose domain is one edit away from a common
 * provider gets a soft "did you mean…?" the visitor can accept in one click —
 * never a blocking error, because the odd real address on `gmial.ro` must
 * still go through.
 */

const COMMON_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.ro",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "live.com",
  "msn.com",
];

/** Levenshtein distance, capped — only distances of 1–2 are ever interesting. */
function distance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = curr;
  }
  return prev[b.length];
}

/**
 * Returns a corrected address when the domain looks like a typo of a common
 * provider, or `null` when there is nothing to suggest. Exact matches and
 * business domains (which are not in the list and not near it) return `null`.
 */
export function suggestEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (COMMON_DOMAINS.includes(domain)) return null;

  let best: string | null = null;
  let bestDistance = 3; // strictly better than 3 → only 1 or 2 edits qualify

  for (const candidate of COMMON_DOMAINS) {
    const d = distance(domain, candidate);
    if (d < bestDistance) {
      bestDistance = d;
      best = candidate;
    }
  }

  // A two-edit "match" on a very short domain is noise (`abc.ro` → `msn.com`),
  // so short domains must be a single edit away to earn a suggestion.
  if (best && bestDistance === 2 && domain.length < 8) return null;

  return best ? `${local}@${best}` : null;
}
