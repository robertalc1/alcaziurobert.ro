/**
 * Phone-number formatting for the contact form.
 *
 * A prospect types a phone number once, under mild friction, and any hiccup
 * there costs a lead — so the field formats while they type instead of
 * scolding them afterwards. Romania is the primary market, so RO numbers get
 * exact grouping; everything else falls back to a sane international grouping.
 *
 * Deliberately dependency-free: libphonenumber-js would add ~75KB to a bundle
 * whose sections are lazy-loaded precisely to stay light, and the two shapes
 * that actually reach this form (`07xx xxx xxx` and `+40 7xx xxx xxx`) are
 * fully covered here.
 */

/**
 * Country calling codes that are one or three digits. Everything else is
 * treated as two digits — the standard heuristic, and the only ambiguity it
 * leaves is in cosmetic grouping, never in validation.
 */
const CC_ONE_DIGIT = new Set(["1", "7"]);

const CC_THREE_DIGIT = new Set([
  // Europe
  "350", "351", "352", "353", "354", "355", "356", "357", "358", "359",
  "370", "371", "372", "373", "374", "375", "376", "377", "378", "379",
  "380", "381", "382", "383", "385", "386", "387", "389",
  "420", "421", "423",
  // Africa / Middle East / Asia / Oceania (the common ones)
  "212", "213", "216", "218", "220", "221", "222", "223", "224", "225",
  "226", "227", "228", "229", "230", "231", "232", "233", "234", "235",
  "236", "237", "238", "239", "240", "241", "242", "243", "244", "245",
  "248", "249", "250", "251", "252", "253", "254", "255", "256", "257",
  "258", "260", "261", "262", "263", "264", "265", "266", "267", "268",
  "269", "290", "291", "297", "298", "299",
  "500", "501", "502", "503", "504", "505", "506", "507", "508", "509",
  "590", "591", "592", "593", "594", "595", "596", "597", "598", "599",
  "670", "672", "673", "674", "675", "676", "677", "678", "679",
  "680", "681", "682", "683", "685", "686", "687", "688", "689",
  "690", "691", "692",
  "850", "852", "853", "855", "856",
  "880", "886",
  "960", "961", "962", "963", "964", "965", "966", "967", "968",
  "970", "971", "972", "973", "974", "975", "976", "977",
  "992", "993", "994", "995", "996", "998",
]);

/** Everything except digits and a single leading "+". */
function stripToDialable(raw: string): { plus: boolean; digits: string } {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+");
  return { plus, digits: trimmed.replace(/\D/g, "") };
}

/** Splits `digits` into the given group sizes, dropping empty trailing groups. */
function group(digits: string, sizes: number[]): string {
  const out: string[] = [];
  let i = 0;
  for (const size of sizes) {
    if (i >= digits.length) break;
    out.push(digits.slice(i, i + size));
    i += size;
  }
  // Anything past the expected shape (over-typed) is appended in threes rather
  // than swallowed — the user must always see every digit they entered.
  while (i < digits.length) {
    out.push(digits.slice(i, i + 3));
    i += 3;
  }
  // A lone trailing digit reads as a typo ("791 112 345 6"), so it joins the
  // group before it instead of standing on its own.
  if (out.length > 1 && out[out.length - 1].length === 1) {
    out[out.length - 2] += out.pop();
  }
  return out.join(" ");
}

function callingCodeLength(digits: string): number {
  if (CC_THREE_DIGIT.has(digits.slice(0, 3))) return 3;
  if (CC_ONE_DIGIT.has(digits.slice(0, 1))) return 1;
  return 2;
}

/**
 * Live formatting while the visitor types.
 *
 * - `0712345678`     → `0712 345 678`   (RO national, 4-3-3)
 * - `+40712345678`   → `+40 712 345 678`
 * - `+33612345678`   → `+33 6 12 34 56 78` is *not* attempted; generic 3s are
 *   used for non-RO numbers, which stays readable without pretending to know
 *   every national convention.
 *
 * Never rejects input — an unfinished number formats as far as it goes.
 */
export function formatPhone(raw: string): string {
  const { plus, digits } = stripToDialable(raw);
  if (!digits) return plus ? "+" : "";

  if (!plus) {
    // Romanian national form: 0 + 9 digits.
    if (digits.startsWith("0")) return group(digits, [4, 3, 3]);
    // Bare digits with no prefix — group in threes until they add a 0 or +.
    return group(digits, [3, 3, 3, 3]);
  }

  const ccLen = callingCodeLength(digits);
  const cc = digits.slice(0, ccLen);
  const rest = digits.slice(ccLen);
  if (!rest) return `+${cc}`;

  // +40 numbers are 9 national digits, read as 3-3-3.
  const sizes = cc === "40" ? [3, 3, 3] : [3, 3, 3, 3];
  return `+${cc} ${group(rest, sizes)}`;
}

/**
 * E.164 for storage and for Meta's Conversions API: leading "+", country code,
 * no separators. A Romanian `07…` is promoted to `+407…` because that is the
 * number the advertiser can actually match on.
 */
export function toE164(raw: string): string {
  const { plus, digits } = stripToDialable(raw);
  if (!digits) return "";
  if (plus) return `+${digits}`;
  if (digits.startsWith("0")) return `+4${digits}`; // RO national → +40…
  return `+${digits}`;
}

/**
 * True when the number is plausibly dialable: a Romanian national number
 * (0 + 9 digits) or an international number of 7–15 digits after the "+".
 * Deliberately shape-based, not carrier-exact — rejecting a real number is far
 * more expensive than accepting an odd one.
 */
export function isValidPhone(raw: string): boolean {
  const { plus, digits } = stripToDialable(raw);
  if (!digits) return false;
  if (!plus && digits.startsWith("0")) return /^0\d{9}$/.test(digits);
  if (plus) return /^[1-9]\d{6,14}$/.test(digits);
  return false;
}

/**
 * Placement of the caret after reformatting. Without this the caret jumps to
 * the end whenever a separator is inserted, which makes editing the middle of
 * a number impossible on desktop.
 *
 * Counts how many digits precede the caret in the raw value, then finds the
 * position just after that many digits in the formatted value.
 */
export function caretAfterFormat(
  rawValue: string,
  rawCaret: number,
  formatted: string
): number {
  const digitsBefore = rawValue.slice(0, rawCaret).replace(/\D/g, "").length;
  if (digitsBefore === 0) return formatted.startsWith("+") ? 1 : 0;

  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === digitsBefore) return i + 1;
    }
  }
  return formatted.length;
}
