import assert from "node:assert/strict";
import { test } from "node:test";
import { formatXof, formatXofShort } from "../src/fcfa.js";

test("formatXofShort gives the examples from the issue", () => {
  assert.equal(formatXofShort(25000), "25 k FCFA");
  assert.equal(formatXofShort(1500000), "1,5 M FCFA");
  assert.equal(formatXofShort(2000000), "2 M FCFA");
});

test("formatXofShort is formatXof below 1 000", () => {
  for (const n of [0, 5, 500, 999, -999]) assert.equal(formatXofShort(n), formatXof(n));
});

test("formatXofShort uses k from 1 000, with at most one decimal and a comma", () => {
  assert.equal(formatXofShort(1000), "1 k FCFA");
  assert.equal(formatXofShort(1500), "1,5 k FCFA");
  assert.equal(formatXofShort(7500), "7,5 k FCFA");
  assert.equal(formatXofShort(12345), "12,3 k FCFA");
  assert.equal(formatXofShort(12350), "12,4 k FCFA"); // rounded, not truncated
  assert.equal(formatXofShort(999000), "999 k FCFA");
});

test("formatXofShort uses M from 1 000 000", () => {
  assert.equal(formatXofShort(1000000), "1 M FCFA");
  assert.equal(formatXofShort(1550000), "1,6 M FCFA");
  assert.equal(formatXofShort(12345678), "12,3 M FCFA");
  assert.equal(formatXofShort(2500000000), "2 500 M FCFA");
});

test("formatXofShort moves to M when rounding reaches 1 000 k", () => {
  assert.equal(formatXofShort(999949), "999,9 k FCFA");
  assert.equal(formatXofShort(999950), "1 M FCFA");
});

test("formatXofShort keeps the sign and refuses decimals", () => {
  assert.equal(formatXofShort(-25000), "-25 k FCFA");
  assert.equal(formatXofShort(-1500000), "-1,5 M FCFA");
  assert.throws(() => formatXofShort(10.5), TypeError);
});
