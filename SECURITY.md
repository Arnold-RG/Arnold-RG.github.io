# Security

Hamwe Tourism is a **demo storefront**. Checkout draws MoMo, QR, card, and PayPal — it does not debit.

## What is stored

- Cart and issued tickets in the guest’s `localStorage`
- Trip-request drafts in `localStorage` (`hamwe-mail`)
- No server-side guest database

## What you should not open an issue for as a “leak”

- Demo card numbers typed in the UI
- The public office phone and email
- Catalog prices

## What to report

If you find a path that would *become* dangerous once a merchant account is connected — XSS on the ticket holder name, open redirects, or anything that would ship a secret — write **circle@hamwe.rw** or open a private note to [@Arnold-RG](https://github.com/Arnold-RG).

Do not file live card data or government ID in a public issue.
