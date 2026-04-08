# magicznazabawka.pl — Storefront

## Projekt

Sklep internetowy magicznazabawka.pl — zabawki dla dzieci. Astro 6 SSR storefront podpiety do wspoldzielonego backendu Vendure.

## Backend

- **Vendure:** vendure.jachymlabs.pl (DO 138.68.69.145)
- **Channel:** magicznazabawka (ID: 5, token: magicznazabawka-shop)
- **Admin:** https://vendure.jachymlabs.pl/admin
- **Payment:** PayU (ID 7) + COD (ID 8)
- **Shipping:** InPost Paczkomat (ID 11), Kurier (ID 12), Kurier+COD (ID 13)

## Boilerplate

Bazuje na https://github.com/jachymlabs/astro-storefront-pl. Branding z Vendure Channel custom fields, nie z kodu.

## Deploy

VPS (pm2) lub Vercel. Env vars w .env.example.

## Zasady

- Branding/dane firmy — TYLKO przez Vendure Dashboard, nigdy hardcode
- Nie commituj .env
- Testuj lokalnie przed deploy (`npm run dev`)
