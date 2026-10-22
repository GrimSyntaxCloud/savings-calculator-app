"use strict";

var $ = function (id) {
  return document.getElementById(id);
};

// Preserve the original exercise's annual compounding model.
var calculateFV = function (investment, years, rate) {
  var futureValue = investment;
  for (var i = 1; i <= years; i++) {
    futureValue = futureValue + (futureValue * rate) / 100;
  }
  return futureValue.toFixed(2);
};

var formatFV = function (futureValue) {
  return Number(futureValue).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

var buildGrowth = function (investment, years, rate) {
  var rows = [{ year: 0, balance: investment, interest: 0 }];
  var balance = investment;
  for (var year = 1; year <= years; year++) {
    var interest = (balance * rate) / 100;
    balance += interest;
    rows.push({ year: year, balance: balance, interest: interest });
  }
  // Circle area, not radius, is proportional to the balance.
  return rows.map(function (row) {
    return Object.assign({}, row, {
      radius: 132 * Math.sqrt(row.balance / balance),
    });
  });
};

var svgElement = function (name, attributes) {
  var node = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.keys(attributes).forEach(function (key) {
    node.setAttribute(key, String(attributes[key]));
  });
  return node;
};

var resetResult = function () {
  $("result").value = "";
  $("balance-display").textContent = "A little starts a lot.";
  $("result-label").textContent = "Your future balance";
  $("result-note").textContent = "Your growth story begins with three numbers.";
  $("growth-pill").textContent = "READY TO PLANT";
  $("principal-display").textContent = "—";
  $("interest-display").textContent = "—";
  $("growth-rings").replaceChildren();
  $("empty-seed").style.display = "";
  $("garden-caption").textContent = "THE BEST PLACE TO BEGIN IS HERE.";
  $("chart-description").textContent =
    "Calculate a balance to see a ring for each year of growth.";
  $("year-details").hidden = true;
  $("year-details").open = false;
  $("year-rows").replaceChildren();
};

var renderGrowth = function (investment, years, rate) {
  var rows = buildGrowth(investment, years, rate);
  var finalBalance = rows[rows.length - 1].balance;
  $("balance-display").textContent = formatFV(finalBalance);
  $("result-label").textContent =
    "Your balance after " + years + (years === 1 ? " year" : " years");
  $("result-note").textContent =
    rate + "% fixed annual interest. One starting amount.";
  $("growth-pill").textContent = "A LITTLE PATIENCE";
  $("principal-display").textContent = formatFV(investment);
  $("interest-display").textContent = formatFV(finalBalance - investment);
  $("empty-seed").style.display = "none";
  $("garden-caption").textContent =
    rate === 0
      ? "ZERO INTEREST. YOUR STARTING AMOUNT STAYS THE SAME."
      : "ONE RING PER YEAR. A LITTLE MORE ROOM TO GROW.";
  $("chart-description").textContent =
    "The dark inner circle represents your initial " +
    formatFV(investment) +
    ". Each outer ring represents a year. Circle areas are proportional to balances, ending at " +
    formatFV(finalBalance) +
    ". " +
    (rate === 0
      ? "At zero interest, all yearly rings overlap."
      : "The yellow area represents accumulated interest.") +
    " Exact values are in the year-by-year table below.";
  var group = svgElement("g", { class: "ring-animation" });
  group.append(
    svgElement("circle", { cx: 240, cy: 164, r: 132, fill: "#f5df73" }),
  );
  group.append(
    svgElement("circle", {
      cx: 240,
      cy: 164,
      r: rows[0].radius,
      class: "ring-core",
    }),
  );
  rows.slice(1).forEach(function (row) {
    group.append(
      svgElement("circle", {
        cx: 240,
        cy: 164,
        r: row.radius,
        class: "ring" + (row.year === years ? " ring-last" : ""),
      }),
    );
  });
  var centerMark = svgElement("text", {
    x: 240,
    y: 176,
    "text-anchor": "middle",
    fill: "#f8f8ee",
    "font-size": 40,
    "aria-hidden": "true",
  });
  centerMark.textContent = "✳";
  group.append(centerMark);
  $("growth-rings").replaceChildren(group);
  var tableRows = rows.map(function (row) {
    var tr = document.createElement("tr");
    [
      row.year === 0 ? "Start" : String(row.year),
      formatFV(row.balance),
      row.year === 0 ? "—" : formatFV(row.interest),
    ].forEach(function (value, index) {
      var cell = document.createElement(index === 0 ? "th" : "td");
      if (index === 0) cell.setAttribute("scope", "row");
      cell.textContent = value;
      tr.append(cell);
    });
    return tr;
  });
  $("year-rows").replaceChildren.apply($("year-rows"), tableRows);
  $("year-details").hidden = false;
};

var setError = function (id, message) {
  $(id + "_error").firstChild.nodeValue = message;
  $(id).setAttribute("aria-invalid", message ? "true" : "false");
};

var processEntries = function () {
  var investment =
    $("investment").value.trim() === "" ? NaN : Number($("investment").value);
  var years = $("years").value.trim() === "" ? NaN : Number($("years").value);
  var rate = $("rate").value.trim() === "" ? NaN : Number($("rate").value);
  var invalid = [];
  resetResult();
  var rules = [
    [
      "investment",
      !Number.isFinite(investment) || investment <= 0 || investment >= 100000,
      "Enter an amount greater than 0 and below 100,000.",
    ],
    [
      "years",
      !Number.isInteger(years) || years <= 0 || years > 30,
      "Enter a whole number of years from 1 to 30.",
    ],
    [
      "rate",
      !Number.isFinite(rate) || rate < 0 || rate > 18,
      "Enter a rate between 0 and 18.",
    ],
  ];
  rules.forEach(function (rule) {
    setError(rule[0], rule[1] ? rule[2] : "");
    if (rule[1]) invalid.push(rule[0]);
  });
  if (invalid.length) {
    $("result-note").textContent =
      "Check the highlighted entries, then try again.";
    $(invalid[0]).focus();
    return;
  }
  $("result").value = formatFV(calculateFV(investment, years, rate));
  renderGrowth(investment, years, rate);
};

var clearEntries = function () {
  $("investment").value = "";
  $("years").value = "1";
  $("rate").value = "";
  ["investment", "years", "rate"].forEach(function (id) {
    setError(id, "");
  });
  resetResult();
  $("investment").focus();
};

window.onload = function () {
  $("savings-form").onsubmit = function (event) {
    event.preventDefault();
    processEntries();
  };
  $("reset").onclick = clearEntries;
  ["investment", "years", "rate"].forEach(function (id) {
    $(id).addEventListener("input", function () {
      if ($("result").value) resetResult();
      setError(id, "");
    });
  });
};
