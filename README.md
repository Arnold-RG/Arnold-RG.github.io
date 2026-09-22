# Arnold Rurangwa â€” GitHub Pages

**Live portfolio:** [https://arnold-rg.github.io/](https://arnold-rg.github.io/)

This repository powers the personal GitHub Pages site:

| URL | What |
| --- | --- |
| [https://arnold-rg.github.io/](https://arnold-rg.github.io/) | Arnold Rurangwa portfolio (root) |
| [https://arnold-rg.github.io/hamwe/](https://arnold-rg.github.io/hamwe/) | Hamwe Tourism storefront |

Portfolio static files live in [`site/`](./site/). Hamwe Tourism is the React/Vite app in this repo, built with base `/hamwe/`.

## Develop Hamwe locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

GitHub Actions assembles `site/` at the Pages root and Hamwe under `/hamwe/`.

