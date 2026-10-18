// Small helpers for FCFA (XOF) amounts and Lightning sats. No dependencies.

export const SATS_PER_BTC = 100_000_000;

/** Groups the digits of a whole number by thousands with a space: 25000 → "25 000". */
export function groupThousands(n) {
  if (!Number.isInteger(n)) throw new TypeError(`expected a whole number, got ${n}`);
  const sign = n < 0 ? "-" : "";
  return sign + String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/, " ");
}

/** 25000 → "25 000 FCFA". FCFA has no cents: amounts are whole numbers. */
export function formatXof(amount) {
  return `${groupThousands(amount)} FCFA`;
}

/** 40323 → "40 323 sats". */
export function formatSats(sats) {
  return `${groupThousands(sats)} sats`;
}

/** FCFA → sats at a rate given in FCFA per bitcoin, rounded to the nearest sat. */
export function xofToSats(xof, xofPerBtc) {
  return Math.round((xof * SATS_PER_BTC) / xofPerBtc);
}

/** sats → FCFA at a rate given in FCFA per bitcoin, rounded to the nearest franc. */
export function satsToXof(sats, xofPerBtc) {
  return Math.round((sats * xofPerBtc) / SATS_PER_BTC);
}

// One group of digits, then groups of exactly three, all with the same separator:
// a space, a non-breaking space (U+00A0), a narrow non-breaking space (U+202F) or a dot.
const XOF_TEXT =
  /^(\d+|\d{1,3}(?:[ \u00A0\u202F]\d{3})+|\d{1,3}(?:\.\d{3})+)(?:[ \u00A0\u202F]*(?:F[ \u00A0\u202F]?CFA|CFA|XOF))?$/i;

/**
 * Reads an FCFA amount written by a person: "25 000 FCFA", "25.000 F CFA", "25000", "25 000 xof" → 25000.
 * Thousands may be separated by spaces, non-breaking spaces or dots; the FCFA, F CFA, CFA or XOF
 * suffix is optional and case-insensitive. FCFA has no cents, so anything else (decimals, a sign,
 * letters, an empty string) throws a RangeError.
 */
export function parseXof(text) {
  if (typeof text !== "string") throw new RangeError(`expected an FCFA amount as text, got ${text}`);
  const match = XOF_TEXT.exec(text.trim());
  if (!match) throw new RangeError(`not an FCFA amount: "${text}"`);
  const amount = Number(match[1].replace(/[ \u00A0\u202F.]/g, ""));
  if (!Number.isSafeInteger(amount)) throw new RangeError(`FCFA amount too large: "${text}"`);
  return amount;
}
