import assert from "node:assert/strict";
import { test } from "node:test";
import { formatXof, parseXof } from "../src/fcfa.js";

test("parseXof reads the examples from the issue", () => {
  assert.equal(parseXof("25 000 FCFA"), 25000);
  assert.equal(parseXof("25.000 F CFA"), 25000);
  assert.equal(parseXof("25000"), 25000);
  assert.equal(parseXof("25 000 xof"), 25000);
});

test("parseXof accepts every separator and suffix, in any case", () => {
  assert.equal(parseXof("25\u00A0000\u00A0FCFA"), 25000); // non-breaking spaces
  assert.equal(parseXof("25\u202F000 FCFA"), 25000); // narrow non-breaking space (Intl fr-FR)
  assert.equal(parseXof("1.500.000 CFA"), 1500000);
  assert.equal(parseXof("1 500 000 f cfa"), 1500000);
  assert.equal(parseXof("7500fcfa"), 7500);
  assert.equal(parseXof("500 Xof"), 500);
  assert.equal(parseXof("  10 000 FCFA  "), 10000);
  assert.equal(parseXof("0"), 0);
});

test("parseXof is the reverse of formatXof", () => {
  for (const n of [0, 5, 500, 5000, 25000, 999999]) assert.equal(parseXof(formatXof(n)), n);
});

test("parseXof throws a RangeError for anything else", () => {
  for (const bad of [
    "abc",
    "12,5",
    "",
    "   ",
    "-500",
    "-500 FCFA",
    "+500",
    "12.5",
    "25 00",
    "2 5000",
    "25 000.000",
    "FCFA",
    "25 000 EUR",
    "25 000 FCFA FCFA",
    "1e6",
    "99999999999999999999",
  ]) {
    assert.throws(() => parseXof(bad), RangeError, `should reject ${JSON.stringify(bad)}`);
  }
  assert.throws(() => parseXof(25000), RangeError);
  assert.throws(() => parseXof(undefined), RangeError);
});
