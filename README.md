# Hamwe Tourism

I built this Kigali travel house myself. Hosted Rwanda itineraries for small groups — dated seats, a bilingual host, and a table that already has a road.

<p align="center">
  <a href="https://arnold-rg.github.io"><img src="https://img.shields.io/badge/live-arnold--rg.github.io-050a07?style=for-the-badge&labelColor=e2b23a" alt="Live site" /></a>
  <img src="https://img.shields.io/badge/5_languages-TypeScript_CSS_JS_HTML_YAML-3178C6?style=for-the-badge" alt="5 languages" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/github/actions/workflow/status/Arnold-RG/Arnold-RG.github.io/pages.yml?style=for-the-badge&label=Pages" alt="Pages workflow" />
</p>

<p align="center">
  <strong><a href="https://arnold-rg.github.io">Open the live site</a></strong>
  ·
  <a href="#how-the-website-works">How it works · 12 screens</a>
  ·
  <a href="docs/DASHBOARD.md">Dashboard</a>
  ·
  <a href="docs/ARCHITECTURE.md">Architecture</a>
</p>

![Hamwe Tourism home](.github/assets/01-home.jpg)

Hamwe means *together*. This is my public source for Hamwe Tourism: a React 19 + Vite 7 + TypeScript storefront that sells hosted tours and day tickets, keeps a live Kigali desk clock, and answers Rwanda questions in English through Gisubizo.

It is a private travel company site — not [Visit Rwanda](https://www.visitrwanda.com) and not the Rwanda Development Board.

**Author:** [Arnold-RG](https://github.com/Arnold-RG)

---

## Languages I used

**Five programming languages** ship this product.

| # | Language | Role | Files | Lines |
| --- | --- | --- | ---: | ---: |
| 1 | **TypeScript** | App, pages, catalog, desk clock, Gisubizo, checkout | 58 | 6,267 |
| 2 | **CSS** | Brand system, layout, mobile | 1 | 3,549 |
| 3 | **JavaScript** | Vite / Node build scripts | 4 | 348 |
| 4 | **YAML** | GitHub Actions Pages pipeline | 4 | 108 |
| 5 | **HTML** | Document shell and intro | 1 | 49 |

```mermaid
pie showData
  title Lines of code by language
  "TypeScript" : 6267
  "CSS" : 3549
  "JavaScript" : 348
  "YAML" : 108
  "HTML" : 49
```

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Arnold-RG&layout=compact&langs_count=5&theme=transparent&hide_border=true&title_color=e2b23a&text_color=f7f4ea&bg_color=050a07&card_width=420" alt="Language mix on GitHub" />
</p>

TypeScript is the spine. CSS is the house. HTML is the door. JavaScript is the build. YAML is how it ships.

---

## How the website works

Twelve live screens from the product I built. Walk them in this order.

### 1. Land — desk clock and the next seat

The home page opens with the Hamwe Tourism lockup, a CAT office countdown (open / lunch / closed), and the next hosted departure.

![Home](.github/assets/01-home.jpg)

### 2. Choose a hosted tour

Six dated itineraries. Fares FRw 32,000–80,000. Luxury packages sit at the ceiling.

![Tours](.github/assets/02-tours.jpg)

### 3. Read one trip

A tour page is the journal: region, length, fare, and a buy action. This is The Full Gathering.

![Tour detail](.github/assets/03-tour-detail.jpg)

### 4. Walk the country as a map

Six grounds I actually use: Kigali, Volcanoes, Kivu, Nyungwe, Akagera, Nyanza. Each plate opens a tour that already has a date.

![Destinations](.github/assets/04-destinations.jpg)

### 5. Day tickets and daily costs

Extras and budget bands. Day tickets FRw 8,000–20,000. Nothing listed is above FRw 80,000.

![Activities](.github/assets/05-activities.jpg)

### 6. Photo album

Sixteen photographs of Rwanda — one frame for each subject.

![Album](.github/assets/06-album.jpg)

### 7. Plan the trip

Visa, season, packing, money, health, and how you reach Ikaze House.

![Plan](.github/assets/07-plan.jpg)

### 8. How Hamwe works

Why the group is small, what the seat buys, what happens after pay.

![About](.github/assets/08-about.jpg)

### 9. Request a custom window

Name, dates, party size, and what you need — or write the Kigali house.

![Request a trip](.github/assets/09-contact.jpg)

### 10. Ask Gisubizo

My English desk for Rwanda facts and this company. Type a question. One hundred and twenty-plus answers sit under the chat.

![Gisubizo](.github/assets/10-gisubizo.jpg)

### 11. Reserve the seat

Demo checkout in francs: traveler, circle notes, MoMo / QR / card / PayPal. No live debit.

![Checkout](.github/assets/11-checkout.jpg)

### 12. Keep the pass

The wallet holds QR tickets, a Calendar file, and a Wallet download after pay.

![Tickets](.github/assets/12-tickets.jpg)

---

## Why this repo exists

Hamwe is a **booking product** with a real operating model:

| Constraint | How it is enforced |
| --- | --- |
| Fares live in Rwandan francs | Display is FRw-first; USD is a locked 1,450 line |
| Day tickets FRw 8,000–20,000 | `ticketFromRwf` clamps the band |
| Luxury ceiling FRw 80,000 | `fareFromRwf` / `LUXURY_PACKAGE_RWF` |
| Office in Kisimenti | Ikaze House, KG 11 Ave · +250 794 607 518 |
| Desk clock is Rwanda time | Fixed CAT UTC+2, no DST |
| Lunch is not “closed” | 12:00–13:30 is a yellow *on lunch* state |
| Payments are honest | Demo checkout — no live MoMo or card charge |
| Gisubizo is English-only | 120+ question bank, scored locally |

---

## Product surface

```mermaid
flowchart LR
  subgraph Guest
    A[Land on Hamwe] --> B[Read the country]
    B --> C[Pick a dated tour]
    B --> D[Or a day ticket]
    B --> E[Or request a custom window]
  end

  subgraph House
    C --> F[Demo checkout]
    D --> F
    F --> G[Digital pass + QR]
    G --> H[Calendar / Wallet file]
    E --> I[Kigali desk]
  end

  subgraph Desk
    J[Gisubizo English desk]
    K[CAT open / lunch / closed]
  end

  A --> J
  A --> K
```

| Route | Role |
| --- | --- |
| `/` | Hero, live desk countdown, method, destinations, request |
| `/tours`, `/tours/:slug` | Six hosted itineraries |
| `/activities`, `/activities/:slug` | Day tickets and extras |
| `/destinations` | Six grounds on the map |
| `/album` | Curated Rwanda photographs |
| `/plan` | Visa, season, packing, money, health |
| `/included` | What the seat buys |
| `/responsible` | Memorials, parks, plastic-bag ban |
| `/contact` | Request a trip |
| `/gisubizo` | English Rwanda desk |
| `/checkout`, `/tickets`, `/ticket/:id` | Demo pay and the pass |

`/circles` and `/membership` redirect to `/tours`.

---

## System architecture

```mermaid
flowchart TB
  Browser["Browser · SPA"] --> Router["react-router-dom 7"]
  Router --> Pages["17 product pages"]
  Pages --> Data["src/data.ts catalog"]
  Pages --> Hours["src/lib/hours.ts · CAT desk"]
  Pages --> Money["src/lib/format.ts · FRw / USD"]
  Pages --> Book["BookingContext · localStorage"]
  Book --> Ticket["src/lib/ticket.ts · ICS + Wallet"]
  Pages --> Giso["Gisubizo engine"]
  Giso --> QA["qa.ts · 120+ English answers"]
  Giso --> Know["knowledge.ts · topic cards"]
  Giso --> Tools["mcp.ts · catalog / desk / phrasebook"]

  GH["push main"] --> CI["GitHub Actions · pages.yml"]
  CI --> Vite["tsc + vite build + SPA fallback"]
  Vite --> PagesHost["GitHub Pages · arnold-rg.github.io"]
```

Full charts: **[docs/DASHBOARD.md](docs/DASHBOARD.md)**. Design notes: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## Repository map

```
src/
  pages/           Product routes
  components/      Lockup, desk, Gisubizo, tickets
  gisubizo/        QA bank, knowledge, tools, engine
  context/         Booking cart + issued tickets
  lib/             FRw math, CAT hours, ICS / Wallet
  data.ts          Tours, extras, destinations, FAQs
public/brand/      Hamwe Tourism lockup
.github/assets/    Walkthrough screens for this README
docs/              Architecture + dashboard
```

The live site is **only** the Vite `dist/` upload. These markdown files are for GitHub reviewers.

---

## Local

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. `npm run build` typechecks and writes the Pages artifact.

---

## House

Ikaze House, KG 11 Ave, Kisimenti, Kigali  
+250 794 607 518 · circle@hamwe.rw

Built by [Arnold-RG](https://github.com/Arnold-RG). © 2026 Hamwe Tourism. Demo payments. Public source.
