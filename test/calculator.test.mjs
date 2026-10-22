import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
function element() {
  return {
    value: "",
    firstChild: { nodeValue: "" },
    style: {},
    children: [],
    attributes: {},
    focus() {},
    setAttribute(key, value) {
      this.attributes[key] = value;
    },
    replaceChildren(...children) {
      this.children = children;
    },
    append(child) {
      this.children.push(child);
    },
    addEventListener() {},
  };
}
const elements = Object.fromEntries(
  [
    "investment",
    "rate",
    "years",
    "result",
    "investment_error",
    "rate_error",
    "years_error",
    "balance-display",
    "result-label",
    "result-note",
    "growth-pill",
    "principal-display",
    "interest-display",
    "growth-rings",
    "empty-seed",
    "garden-caption",
    "chart-description",
    "year-details",
    "year-rows",
  ].map((id) => [id, element()]),
);
const context = vm.createContext({
  window: {},
  document: {
    getElementById: (id) => elements[id],
    createElement: element,
    createElementNS: element,
  },
});
vm.runInContext(
  fs.readFileSync(new URL("../scripts.js", import.meta.url), "utf8"),
  context,
);
function inputs(amount, years, rate) {
  elements.investment.value = String(amount);
  elements.years.value = String(years);
  elements.rate.value = String(rate);
}
test("currency groups small values and millions correctly", () => {
  assert.equal(context.formatFV("105.00"), "$105.00");
  assert.equal(context.formatFV("1234567.89"), "$1,234,567.89");
});
test("annual compounding retains the known example", () => {
  assert.equal(
    context.formatFV(context.calculateFV(10000, 3, 5)),
    "$11,576.25",
  );
});
test("rejects fractional years, blank fields and numeric text suffixes without stale results", () => {
  for (const [field, value] of [
    ["years", "1.5"],
    ["investment", "100oops"],
    ["rate", ""],
  ]) {
    inputs(100, 2, 5);
    context.processEntries();
    elements[field].value = value;
    context.processEntries();
    assert.equal(elements.result.value, "");
    assert.notEqual(elements[field + "_error"].firstChild.nodeValue, "");
    assert.equal(elements["year-details"].hidden, true);
    assert.equal(elements["growth-rings"].children.length, 0);
  }
});
test("ring areas match balances and yearly table agrees with the final result", () => {
  inputs(2500, 10, 5);
  context.processEntries();
  const rows = context.buildGrowth(2500, 10, 5);
  assert.equal(rows.length, 11);
  assert.ok(
    Math.abs(
      (rows[0].radius / rows[10].radius) ** 2 - 2500 / rows[10].balance,
    ) < 1e-12,
  );
  assert.equal(elements["balance-display"].textContent, elements.result.value);
  assert.equal(elements["year-rows"].children.length, 11);
  assert.equal(
    elements["year-rows"].children[10].children[1].textContent,
    elements.result.value,
  );
  assert.equal(elements["interest-display"].textContent, "$1,572.24");
});
test("zero interest keeps all yearly balances and radii identical", () => {
  inputs(100.5, 30, 0);
  context.processEntries();
  const rows = context.buildGrowth(100.5, 30, 0);
  assert.ok(
    rows.every(
      (row) =>
        row.balance === 100.5 && row.radius === 132 && row.interest === 0,
    ),
  );
  assert.equal(elements.result.value, "$100.50");
  assert.match(elements["chart-description"].textContent, /overlap/);
});
test("clear resets inputs, errors, result and chart together", () => {
  inputs(2500, 10, 5);
  context.processEntries();
  context.clearEntries();
  assert.equal(elements.investment.value, "");
  assert.equal(elements.years.value, "1");
  assert.equal(elements.rate.value, "");
  assert.equal(elements.result.value, "");
  assert.equal(elements["year-details"].hidden, true);
  assert.equal(elements["growth-rings"].children.length, 0);
  assert.equal(elements["investment_error"].firstChild.nodeValue, "");
});
