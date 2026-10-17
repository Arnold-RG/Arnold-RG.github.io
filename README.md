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

Facts for the portfolio live in `site/content/profile.json` and must match `site/index.html`. The public name is Arnold Rurangwa.

## Checks

```bash
npm test
npm run check:links
npm run test:e2e
npm run build
```

`npm test` checks the published facts, local assets, and contrast. `check:links` requests the live project URLs. `test:e2e` opens the portfolio in Chromium. The published-content check also scans Markdown in this repo for placeholders and local file paths.

## Build

```bash
npm run build
```

GitHub Actions, on every push to `main`, runs the portfolio unit tests, assembles `site/` at the Pages root and Hamwe under `/hamwe/`, then deploys to GitHub Pages. Pull requests also run the link check and browser tests.
