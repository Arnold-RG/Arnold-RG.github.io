# Arnold Rurangwa — GitHub Pages

**Live site:** [https://arnold-rg.github.io/](https://arnold-rg.github.io/)

This repository powers the personal GitHub Pages site:

| URL | What |
| --- | --- |
| [https://arnold-rg.github.io/](https://arnold-rg.github.io/) | Arnold Rurangwa portfolio (root) |
| [https://arnold-rg.github.io/hamwe/](https://arnold-rg.github.io/hamwe/) | Hamwe Tourism storefront |

Portfolio static files live in [`site/`](./site/). Hamwe Tourism is the React/Vite app in this repo, built with base `/hamwe/`.

`robots.txt` and `sitemap.xml` ship with the portfolio at the site root.

## Develop Hamwe locally

```bash
npm install
npm run dev
```

The dev server uses the same `/hamwe/` base as production.

## Build

```bash
npm run build
```

GitHub Actions, on every push to `main`, assembles `site/` at the Pages root and Hamwe under `/hamwe/`, then deploys to GitHub Pages.
