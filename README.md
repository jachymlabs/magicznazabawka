# magicznazabawka.pl — Storefront

Sklep internetowy magicznazabawka.pl. Frontend Astro 6 (SSR) podpiety do wspoldzielonego backendu Vendure.

## Stack

- **Frontend:** Astro 6 + React islands + Tailwind CSS 4
- **Backend:** Vendure 3.x (vendure.jachymlabs.pl)
- **Platnosci:** PayU (BLIK, karta, przelew, PayPo) + COD
- **Dostawa:** InPost Paczkomaty + Kurier + Kurier pobranie
- **Deploy:** VPS (pm2) lub Vercel

## Quick Start (dev)

```bash
# 1. Zainstaluj dependencies
npm install

# 2. Skopiuj env
cp .env.example .env
# Edytuj .env — ustaw VENDURE_API_URL i VENDURE_CHANNEL_TOKEN

# 3. Odpal dev server
npm run dev
# Sklep: http://localhost:4321
```

## ENV vars

| Zmienna | Opis |
|---------|------|
| `VENDURE_API_URL` | URL Vendure Shop API (np. https://vendure.jachymlabs.pl/shop-api) |
| `VENDURE_CHANNEL_TOKEN` | Token channela Vendure (`magicznazabawka-shop`) |
| `PUBLIC_SITE_URL` | URL sklepu (https://magicznazabawka.pl) |
| `PUBLIC_COOKIE_DOMAIN` | Domena cookie (.magicznazabawka.pl) |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel ID (opcjonalne) |
| `META_CAPI_ACCESS_TOKEN` | Meta CAPI token (opcjonalne) |

## Konfiguracja sklepu

Caly branding, dane firmy, promo bar — konfiguracja z **Vendure Dashboard**, nie z kodu:

1. Wejdz na https://vendure.jachymlabs.pl/admin
2. Settings > Channels > magicznazabawka
3. Wypelnij custom fields: storeName, contactEmail, promoBarText, etc.

Zmiany widoczne natychmiast (cache 60s).

## Deploy (VPS)

```bash
# Na serwerze
git clone https://github.com/jachymlabs/magicznazabawka.git /opt/magicznazabawka
cd /opt/magicznazabawka
cp .env.example .env
# Edytuj .env z produkcyjnymi credentials
npm ci
npm run build
pm2 start dist/server/entry.mjs --name magicznazabawka
pm2 save
```

## Deploy (Vercel)

1. Zmien adapter w `astro.config.mjs`:
```js
import vercel from '@astrojs/vercel';
// adapter: vercel(),
```
2. `npm install @astrojs/vercel`
3. `vercel --yes --prod`
4. Ustaw env vars w Vercel Dashboard
5. `vercel domains add magicznazabawka.pl`

## Boilerplate

Ten storefront bazuje na [astro-storefront-pl](https://github.com/jachymlabs/astro-storefront-pl). Aktualizacje boilerplate'u mozna mergowac recznie.

## Struktura

```
src/
├── components/   # Header, Footer, PromoBar, CartDrawer, TrustBadges...
├── layouts/      # BaseLayout (SEO, OG, Meta Pixel, consent)
├── lib/          # vendure.ts, store-config.ts, cart-store.ts
├── pages/        # index, produkty/[slug], checkout, koszyk, regulamin...
├── styles/       # global.css (Tailwind)
└── types/        # TypeScript types
```
