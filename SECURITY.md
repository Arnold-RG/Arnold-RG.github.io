# Security Policy

This repository powers **arnold-rg.github.io** — a static personal hub and the **Hamwe Tourism** demo storefront on GitHub Pages.

## Supported surfaces

| Surface | Path | Notes |
| --- | --- | --- |
| Portfolio hub | `/` | Static HTML/CSS/JS in `site/` |
| Hamwe Tourism | `/hamwe/` | React + Vite demo; checkout does **not** debit |

## What is stored (client only)

- Hamwe cart and issued tickets in the guest’s `localStorage`
- Trip-request drafts in `localStorage` (`hamwe-mail`)
- Portfolio theme preference in `localStorage` (`theme`)
- No server-side guest database; no payment processor secrets in this repo

## What is not a vulnerability

- Demo card / MoMo / PayPal UI that never charges
- Catalog prices and public office contact details
- Theme preference stored locally

## Reporting a vulnerability

If you find XSS on ticket or form fields, open redirects, secret exposure, or anything that would become dangerous once a merchant account is connected:

1. Email **rurangwaarnold32@gmail.com** or **circle@hamwe.rw**
2. Or open a private advisory to [@Arnold-RG](https://github.com/Arnold-RG)

Please include steps to reproduce and expected vs actual behavior.

**Do not** file live card data, government ID, or private credentials in a public issue.

## Hardening in this project

- External links use `rel="noopener noreferrer"`
- Referrer policy: `strict-origin-when-cross-origin`
- Forms use `maxlength` and basic validation
- No secrets committed; `.env*` excluded via `.gitignore`
- Dependabot watches npm and GitHub Actions
- GitHub Actions use least privilege (`contents: read` on build; Pages deploy only)
