# Savings Calculator

A botanical growth studio for exploring annual compound interest. Enter one starting amount, a fixed annual rate and a number of years, then see your future balance take shape as a set of growth rings.

[Live demo](https://grimsyntaxcloud.github.io/savings-calculator-app/) · [Portfolio](https://grimsyntaxcloud.github.io/)

## What it does

- Calculate an initial amount greater than zero and below $100,000 over 1–30 whole years at a fixed annual rate of 0–18%.
- Separate the starting amount from accumulated interest and inspect the year-by-year balances and interest.
- Show a ring for each year. Circle **areas** are proportional to the balance; the dark center represents principal and the yellow area represents interest. At 0%, every ring overlaps and the amount stays unchanged.
- Clear entries and results together. Invalid inputs or edited assumptions clear an earlier result so it cannot be mistaken for the new calculation.

The moss, mint and yellow interface uses a native SVG seed illustration and a short growth-ring reveal. It supports keyboard submission, visible focus states, labeled errors, responsive layouts, screen-reader descriptions and reduced-motion preferences. There is no continuous animation.

## How it works

Static HTML and CSS provide the interface. Native JavaScript in `scripts.js` validates entries and compounds the balance once for each year:

```text
balance = initial amount × (1 + annual rate / 100) ^ years
```

Calculation uses full JavaScript numeric precision; currency is rounded to cents only for display. The chart and table use the same annual progression as the original calculator. Values are not stored or sent to a server.

This educational model assumes a constant rate with no additional deposits, withdrawals, taxes, fees or inflation. It is not a bank quote, a promised return or personalized financial advice.

## Run locally

Use Python 3 to serve this directory:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/. No package installation is required.

## Verify changes

With Node.js 22 or newer:

```sh
node --test test/*.test.mjs
```

Six regression tests cover currency formatting, the original compounding example, invalid inputs and stale results, chart/table agreement, zero interest and full reset behavior. Lightweight DOM stand-ins complement manual browser checks; they do not replace visual testing. GitHub Actions runs these tests on pushes and pull requests. Dependabot checks CI Actions weekly.

## Hosting, security and provenance

GitHub Pages serves the default branch for free. There are no application dependencies, remote fonts, paid libraries, API keys, accounts or backend services. Rendering uses DOM text nodes and SVG attributes rather than injecting user-provided HTML. No database cleanup is needed because this calculator does not persist data.

Andres Macias created the original JavaScript coursework exercise. The October 2026 redesign was built collaboratively with AI assistance: Andres chose the direction, while the implementation adds the botanical interface, accessible growth visualization and regression coverage. The original annual-compounding behavior and input limits remain intact.
