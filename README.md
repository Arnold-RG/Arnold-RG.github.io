# Arnold Rurangwa — Portfolio

Computer engineer in Kraków, Poland, open to software development, Linux and systems administration, and IT support.

**Live site:** [https://arnold-rg.github.io](https://arnold-rg.github.io/)

<!-- Screenshot placeholder: add a desktop capture of the hero section (dark theme) here, e.g.
![Portfolio hero, dark theme](docs/screenshot-hero.png)
The Open Graph card at site/assets/og.png can stand in until a real screenshot is added. -->

This repository powers two things on GitHub Pages:

| URL | What |
| --- | --- |
| [arnold-rg.github.io](https://arnold-rg.github.io/) | Portfolio (static site in [`site/`](./site/)) |
| [arnold-rg.github.io/hamwe/](https://arnold-rg.github.io/hamwe/) | Hamwe Tourism, a React + TypeScript app built from [`src/`](./src/) with base `/hamwe/` |

## What's on the site

The public name is Arnold Rurangwa. Section order on the page:

- **Hero:** Arnold Rurangwa, “Open to work · Kraków, Poland”, the three target roles, then Download resume (PDF), Email me, and See projects.
- **Projects:** four featured cards (Africa Shield Cyber Centre, STANS, Hamwe Tourism, Peakwise), each with a short stack line, then eight more behind “More projects”. Twelve public projects in all.
- **Experience:** Cognizant, LG Energy Solution, Escola S.A, and I&M Bank, most recent first.
- **Skills:** Networking and security; Linux, cloud, and DevOps; Software development; IT support and data.
- **Education and certifications:** B.Sc. Computer Engineering (Cybersecurity and Computer Networks) at Wrocławska Akademia Biznesu (ATA Wrocław), then credentials from Cisco Networking Academy, Oracle, Python Institute, Google Career Certificates, and Udemy, plus two further credentials.
- **About:** a short profile, languages (English C1, Kinyarwanda C2, French C1, Swahili B2), and interests.
- **Contact:** Email me, Download resume (PDF), and links for GitHub, LinkedIn, and phone.

The site also has dark and light themes (it follows the system setting until a choice is saved), a skip link, keyboard access, a mobile menu, and Open Graph/Twitter card metadata.

### Projects

| Project | What it is | Links |
| --- | --- | --- |
| Africa Shield Cyber Centre | Cybersecurity operations desk: SOC monitoring, threat map, incident reporting, admin authentication. | [Live](https://arnold-rg.github.io/Africa-shield-cyber-centre/) · [Repo](https://github.com/Arnold-RG/Africa-shield-cyber-centre) |
| STANS | Live traffic and routing dashboard on OpenStreetMap: search, GPS, weather, points of interest. | [Live](https://arnold-rg.github.io/STANS/) · [Repo](https://github.com/Arnold-RG/STANS) |
| Hamwe Tourism | Rwanda tour-booking app: catalogues, booking, QR-pass tickets, and interactive maps. Built in this repo. | [Live](https://arnold-rg.github.io/hamwe/) · [Repo](https://github.com/Arnold-RG/Arnold-RG.github.io) |
| Peakwise | AI-assisted mass-spectrometry tool: ranks candidate molecules from LC-MS/MS peaks. | [Live](https://arnold-rg.github.io/peakwise/) · [Repo](https://github.com/Arnold-RG/peakwise) |
| Elvora | AI wellness coach (iOS, Android, web): nutrition, training, hydration, sleep. Flutter, FastAPI. The GitHub repo is `nfl-bot`. | [Live](https://arnold-rg.github.io/nfl-bot/) · [App](https://arnold-rg.github.io/nfl-bot/app/) · [Repo](https://github.com/Arnold-RG/nfl-bot) |
| AbroadCost | Cost-of-living budget planner for 195 countries (ReloLedger). | [Live](https://arnold-rg.github.io/AbroadCost/) · [Repo](https://github.com/Arnold-RG/AbroadCost) |
| Boutique La Différence | Kigali supermarket storefront with Excel-driven inventory and an owner admin panel. | [Live](https://arnold-rg.github.io/Boutique-la-difference/) · [Repo](https://github.com/Arnold-RG/Boutique-la-difference) |
| Our Money Hub | Private household ledger; PLN by default. | [Live](https://arnold-rg.github.io/our-money-hub/) · [Repo](https://github.com/Arnold-RG/our-money-hub) |
| RAGI | Owner-only private secretary (public code, private locks). | [Live](https://arnold-rg.github.io/ragi/) · [Repo](https://github.com/Arnold-RG/ragi) |
| 2daymovie | Legal movie discovery: browse, trailers, where to watch. Python. | [Live](https://twodaymovie.onrender.com/) · [Mirror](https://arnold-rg.github.io/2daymovie/) · [Repo](https://github.com/Arnold-RG/2daymovie) |
| Kingdom Life Kraków | English church website in Kraków. | [Live](https://arnold-rg.github.io/kingdom-life-krakow/) · [Repo](https://github.com/Arnold-RG/kingdom-life-krakow) |
| AI & Data Scientist Roadmap | AI/data-science study curriculum: 10 stages, quizzes, and projects, per roadmap.sh. | [Live](https://arnold-rg.github.io/ai-data-scientist-roadmap/) · [Repo](https://github.com/Arnold-RG/ai-data-scientist-roadmap) |

## Tech stack

- **Portfolio (`site/`):** hand-written HTML, CSS, and vanilla JavaScript. System fonts, no framework, no build step for the page itself. Profile facts live in `site/content/profile.json`.
- **Hamwe Tourism (`src/`):** React 19, React Router 7, TypeScript 5.9, Vite 7.
- **Testing:** Node's built-in test runner (`node --test`) for fact, asset, and contrast checks; Playwright (Chromium) for browser tests; a link checker; and a published-text scan.
- **CI/CD:** GitHub Actions (Node 22, actions pinned to commit SHAs) deploying to GitHub Pages.

## Run it locally

Requires Node.js (CI uses Node 22) and npm.

```bash
git clone https://github.com/Arnold-RG/Arnold-RG.github.io.git
cd Arnold-RG.github.io
npm install
```

| Command | What it does |
| --- | --- |
| `npm run dev:portfolio` | Serves the static portfolio from `site/` at http://127.0.0.1:4177 (`PORT` overrides the port) |
| `npm run dev` | Starts the Vite dev server for Hamwe Tourism (port 5173, base `/hamwe/`) |
| `npm run build` | Type-checks and builds Hamwe into `dist/`, adds the SPA fallback, then scans the published text |
| `npm run preview` | Previews the Vite build |
| `npm test` | Runs the portfolio unit checks (`tests/portfolio.test.mjs`) |
| `npm run check:links` | Checks local files and the live project URLs |
| `npm run test:e2e` | Runs the Playwright browser tests (first run: `npx playwright install chromium`) |

## Deployment

Two GitHub Actions workflows live in [`.github/workflows/`](./.github/workflows/):

- **`pages.yml` (Deploy site):** runs on every push to `main` and on manual dispatch. The build job runs `npm ci`, `npm test`, and `npm run build`. It then assembles the Pages artifact: `site/` at the root, the Hamwe build under `/hamwe/`, and `SECURITY.md` in both. It scans the assembled site again and uploads it. A separate deploy job, the only one with `pages: write` and `id-token: write`, publishes it to GitHub Pages.
- **`ci.yml` (Checks):** runs on pull requests and pushes to `main`. One job runs `npm test`, `npm run check:links`, and `npm run build`; a second installs Chromium and runs `npm run test:e2e`.

## Contact

- Email: [rurangwaarnold32@gmail.com](mailto:rurangwaarnold32@gmail.com)
- Phone: [+48 575 217 930](tel:+48575217930)
- GitHub: [Arnold-RG](https://github.com/Arnold-RG)
- LinkedIn: [rurangwa-arnold](https://www.linkedin.com/in/rurangwa-arnold-53b90520b/)

## License

[MIT](./LICENSE) © 2026 Arnold-RG / Hamwe Tourism
