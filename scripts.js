"use strict";

var $ = function (id) {
  return document.getElementById(id);
};

var calculateFV = function (investment, years, rate) {
  var futureValue = investment;
  for (var i = 1; i <= years; i++) {
    futureValue = futureValue + (futureValue * rate) / 100;
  }
  futureValue = futureValue.toFixed(2);
  return futureValue;
};

var formatFV = function (futureValue) {
  return Number(futureValue).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

var processEntries = function () {
  var futureValue;
  var investment =
    $("investment").value.trim() === "" ? NaN : Number($("investment").value);
  var years = $("years").value.trim() === "" ? NaN : Number($("years").value);
  var rate = $("rate").value.trim() === "" ? NaN : Number($("rate").value);

  var isValid = true;
  $("result").value = "";

  if (!Number.isFinite(investment) || investment <= 0 || investment >= 100000) {
    $("investment_error").firstChild.nodeValue =
      "Enter a number between 1 and 99999";
    isValid = false;
  } else {
    $("investment_error").firstChild.nodeValue = "";
  }

  if (!Number.isInteger(years) || years <= 0 || years > 30) {
    $("years_error").firstChild.nodeValue =
      "Enter a whole number of years from 1 to 30";
    isValid = false;
  } else {
    $("years_error").firstChild.nodeValue = "";
  }

  if (!Number.isFinite(rate) || rate < 0 || rate > 18) {
    $("rate_error").firstChild.nodeValue = "Enter a rate between 0 and 18";
    isValid = false;
  } else {
    $("rate_error").firstChild.nodeValue = "";
  }

  if (isValid) {
    futureValue = calculateFV(investment, years, rate);
    $("result").value = formatFV(futureValue);
  }
};

var clearEntries = function () {
  $("investment").value = "";
  $("years").value = "1";
  $("rate").value = "";
  $("result").value = "";
};

window.onload = function () {
  $("calculate").onclick = processEntries;
  $("reset").onclick = clearEntries;
  $("investment").focus();
};
