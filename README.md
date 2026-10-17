# Arnold Rurangwa — GitHub Pages

**Live site:** [https://arnold-rg.github.io/](https://arnold-rg.github.io/)

This repository powers the personal GitHub Pages site:

| URL | What |
| --- | --- |
| [https://arnold-rg.github.io/](https://arnold-rg.github.io/) | Arnold Rurangwa portfolio (root) |
| [https://arnold-rg.github.io/hamwe/](https://arnold-rg.github.io/hamwe/) | Hamwe Tourism storefront |

Portfolio static files live in [`site/`](./site/). Hamwe Tourism is the React/Vite app in this repo, built with base `/hamwe/`.

`robots.txt` and `sitemap.xml` ship with the portfolio at the site root.

## Develop

Hamwe (Vite):

```bash
npm install
npm run dev
```

The dev server uses the same `/hamwe/` base as production.

Portfolio page (static files in `site/`):

```bash
npm run dev:portfolio
```

Facts for the portfolio live in `site/content/profile.json` and must match `site/index.html`. The public name is Arnold Rurangwa. Do not put private notes, placeholders, or machine paths on the page.

## Alias held back

An alias was discussed and is not on the site until Arnold confirms it. The unconfirmed alias is Ateck. To add it later, edit `site/index.html` in three places together: the meta description, a JSON-LD `alternateName`, and one short line under the main heading. `npm test` checks that the JSON-LD content-security hash still matches.

## Still needed from Arnold

These are not on the website. Fill them in only with his own facts.

1. Issuer and credential ID for AI Augmented Engineering Lead (LangGraph, Azure with GHCP) and AI Essentials: Policy, Governance and Use. The folio only says “Professional credential”, so those two cards show the name and nothing else.
2. Verification links for the Oracle, Cisco Networking Academy, Python Institute, Google Career Certificates, and Udemy credentials.
3. A role title and dates for ARNOVA Group, if it is an employer. GitHub lists it as the company, and AbroadCost names it, but no title or dates were found, so it is not a job on the page.
4. GitHub still says the location is Kigali, Rwanda. The resume and this site say Kraków, Poland. Which location should be public?
5. Whether a public alias should be shown. It is not the GitHub display name.
6. Work authorization in Poland, notice period, and whether the search is full-time, contract, or open to relocation.
7. Real outcomes for the experience bullets (tools used by name, volumes, or results). None are published.
8. A Polish language level, if Kraków employers should see one. The folio lists English, Kinyarwanda, French, and Swahili only.

## Checks

```bash
npm test
npm run check:links
npm run test:e2e
npm run build
```

`npm test` checks the published facts, local assets, and contrast. `check:links` requests the live project URLs. `test:e2e` opens the portfolio in Chromium.

## Build

```bash
npm run build
```

GitHub Actions, on every push to `main`, runs the portfolio unit tests, assembles `site/` at the Pages root and Hamwe under `/hamwe/`, then deploys to GitHub Pages. Pull requests also run the link check and browser tests.
