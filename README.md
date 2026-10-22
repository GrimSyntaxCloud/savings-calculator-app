# Savings Calculator

An early JavaScript coursework app for estimating a balance after annual compounding.

[Live demo](https://grimsyntaxcloud.github.io/savings-calculator-app/) · [Portfolio](https://grimsyntaxcloud.github.io/)

## What it does

Enter an initial investment greater than zero and below 100,000, a whole number of years from 1 to 30, and an annual rate from 0% to 18%. Calculate displays the resulting balance; Clear resets the fields. Invalid input clears an earlier result rather than leaving a misleading total.

## How it works

The interface is static HTML and CSS, with native JavaScript in `scripts.js`. There are no npm dependencies, API keys, accounts, backend services or paid libraries.

This educational model assumes a fixed annual rate with no later deposits, withdrawals, fees or taxes. Inputs are not saved or sent to a server.

## Run locally

Use Python 3 to serve this directory:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/. No package installation is required to use the app.

## Verify changes

With Node.js 22 or newer:

```sh
node --test test/*.test.mjs
```

The regression tests cover the repaired behavior using lightweight DOM stand-ins. They do not replace a browser layout check. GitHub Actions runs them on pushes and pull requests. Dependabot checks the Actions used by CI weekly; there is no application dependency manifest to scan.

## Hosting and provenance

GitHub Pages serves the default branch for free. This remains an educational project by Andres Macias; the original exercise structure is retained. The October 2026 maintenance pass documents local setup and adds targeted correctness fixes and regression coverage without redesigning the interface.
