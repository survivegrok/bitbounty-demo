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

/**
 * Short FCFA amount for dashboards and small screens: 950 → "950 FCFA", 25000 → "25 k FCFA",
 * 1500000 → "1,5 M FCFA". Below 1 000 it is formatXof; above, at most one decimal, rounded,
 * with a comma as the decimal separator (French style). 999 950 rounds up to "1 M FCFA".
 */
export function formatXofShort(amount) {
  if (!Number.isInteger(amount)) throw new TypeError(`expected a whole number, got ${amount}`);
  const abs = Math.abs(amount);
  if (abs < 1000) return formatXof(amount);
  const sign = amount < 0 ? "-" : "";
  // Tenths of a thousand, computed on integers so 1 550 000 does not become 1,5 by float error.
  let tenths = Math.round(abs / 100);
  let unit = "k";
  if (tenths >= 10_000) {
    tenths = Math.round(abs / 100_000);
    unit = "M";
  }
  const whole = Math.trunc(tenths / 10);
  const decimal = tenths % 10;
  const number = decimal === 0 ? groupThousands(whole) : `${groupThousands(whole)},${decimal}`;
  return `${sign}${number} ${unit} FCFA`;
}
