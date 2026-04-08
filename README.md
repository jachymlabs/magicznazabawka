# Vendure + Astro Ecommerce Boilerplate (PL)

Gotowy do produkcji sklep internetowy zoptymalizowany pod polski rynek: PayU (BLIK, karta, przelew, PayPo), InPost (Paczkomaty + kurier), BaseLinker, polski regulamin, RODO.

## Stack

| Warstwa | Technologia |
|---------|------------|
| **Backend** | [Vendure 3.x](https://vendure.io) (NestJS, TypeORM, GraphQL) |
| **Frontend** | [Astro 6](https://astro.build) (SSR) + React islands + Tailwind CSS 4 |
| **Baza danych** | PostgreSQL |
| **Platnosci** | PayU (BLIK, karta, przelew, PayPo) + platnosc przy odbiorze (COD) |
| **Dostawa** | InPost Paczkomaty (Geowidget v5) + InPost Kurier + Kurier pobranie |
| **Integracje** | BaseLinker (sync zamowien), Meta Pixel + CAPI |
| **Security** | AES-256-GCM encryption, sanitize-html, CSRF, rate limiting |

## Architektura

```
boilerplate/
├── apps/
│   ├── server/          # Vendure backend
│   │   ├── src/
│   │   │   ├── plugins/
│   │   │   │   ├── payu/           # PayU BLIK + redirect + PayPo + webhook
│   │   │   │   ├── encryption/     # AES-256-GCM dla Channel credentials
│   │   │   │   ├── baselinker/     # BaseLinker sync zamowien
│   │   │   │   ├── alerts/         # Discord alerty na nowe zamowienia
│   │   │   │   └── dashboard-extensions/  # Custom dashboard widgets
│   │   │   ├── vendure-config.ts   # Channel custom fields, plugins, auth
│   │   │   └── initial-data-pl.ts  # PLN, VAT 23%, strefy PL
│   │   └── .env.example
│   │
│   └── storefront/      # Astro SSR storefront
│       ├── src/
│       │   ├── components/   # Header, Footer, PromoBar, CartDrawer, TrustBadges...
│       │   ├── layouts/      # BaseLayout (SEO, OG, Meta Pixel, consent)
│       │   ├── lib/          # vendure.ts, store-config.ts, cart-store.ts, utils
│       │   ├── pages/
│       │   │   ├── index.astro           # Homepage
│       │   │   ├── produkty/[slug].astro # PDP (dynamic)
│       │   │   ├── kolekcje/[slug].astro # Collection page
│       │   │   ├── koszyk.astro          # Cart page
│       │   │   ├── checkout.astro        # One-page checkout
│       │   │   ├── checkout/
│       │   │   │   ├── confirmation.astro   # Order confirmation + polling
│       │   │   │   └── blik-waiting.astro   # BLIK bank confirmation wait
│       │   │   ├── upsell.astro          # Post-purchase upsell
│       │   │   ├── regulamin.astro       # Regulamin (szablon z placeholderami)
│       │   │   └── polityka-prywatnosci.astro
│       │   └── styles/global.css
│       ├── astro.config.mjs  # Node adapter (zmien na @astrojs/vercel dla Vercel)
│       └── .env.example
│
└── README.md
```

## Multi-tenant (Multi-channel)

Jeden backend Vendure obsluguje wiele sklepow przez **Channels**. Kazdy channel ma wlasne:

### Channel Custom Fields (konfiguracja z dashboardu Vendure)

| Pole | Typ | Opis |
|------|-----|------|
| `storeName` | string | Nazwa sklepu (header, footer, meta) |
| `storeTagline` | string | Tagline w footer |
| `contactEmail` | string | Email kontaktowy |
| `contactPhone` | string | Telefon kontaktowy |
| `freeShippingThreshold` | int | UI hint: kwota do progress bar koszyka (grosze). Faktyczna darmowa dostawa = Vendure Promotion |
| `promoBarText` | string | Tekst paska promocyjnego. Pusty = ukryty |
| `promoBarLink` | string | Link CTA w promo bar |
| `companyName` | string | Nazwa firmy (regulamin, faktury) |
| `companyNip` | string | NIP |
| `companyAddress` | string | Adres siedziby |
| `returnAddress` | string | Adres do zwrotow |
| `storefrontUrl` | string | URL sklepu (PayU continueUrl, emaile). Np. https://mooly.pl |
| `inpostGeowidgetToken` | text | Token InPost Geowidget (mapa paczkomatow) |
| `payuPosId` | string | PayU POS ID (per channel) |
| `payuClientSecret` | string | PayU Client Secret (szyfrowane AES-256-GCM) |
| `payuSecondKey` | string | PayU Second Key MD5 (szyfrowane) |
| `payuSandbox` | boolean | PayU tryb testowy |
| `baseLinkerToken` | string | BaseLinker API token (szyfrowane) |
| `baseLinkerStatusId` | int | BaseLinker status ID dla nowych zamowien |

### ENV vars storefrontu (tylko tech/infra)

```env
VENDURE_API_URL=https://your-vendure.com/shop-api
VENDURE_CHANNEL_TOKEN=your-channel-token
PUBLIC_SITE_URL=https://your-store.com
PUBLIC_COOKIE_DOMAIN=.your-store.com
```

Branding, ceny, promo, dane firmy — wszystko z dashboardu Vendure, **zero redeployu**.

## Quick Start (development)

### 1. Backend

```bash
cd apps/server
cp .env.example .env
# Edytuj .env — ustaw DB credentials

# Docker Postgres (opcjonalnie)
docker run -d --name vendure-db -p 5432:5432 \
  -e POSTGRES_DB=vendure -e POSTGRES_USER=vendure -e POSTGRES_PASSWORD=vendure \
  postgres:16

npm install
npm run dev
# Admin: http://localhost:3001/admin (superadmin / superadmin)
```

### 2. Storefront

```bash
cd apps/storefront
cp .env.example .env
# Edytuj .env — VENDURE_API_URL, VENDURE_CHANNEL_TOKEN

npm install
npm run dev
# Sklep: http://localhost:4321
```

### 3. Konfiguracja channelu

W Vendure Dashboard (http://localhost:3001/admin):
1. Settings → Channels → Default Channel
2. Wypelnij custom fields: storeName, contactEmail, promoBarText, etc.
3. Dodaj shipping methods (Paczkomat, Kurier, Pobranie)
4. Dodaj payment methods (PayU, COD)
5. Dodaj produkty

## Deploy produkcja

### Backend (VPS / Digital Ocean)

```bash
# Na serwerze
git clone [repo] /opt/vendure
cd /opt/vendure/apps/server
cp .env.example .env
# Edytuj .env z produkcyjnymi credentials
npm ci
npm run build
# PM2
pm2 start dist/index.js --name vendure-server
pm2 start dist/worker.js --name vendure-worker
pm2 save
```

### Storefront — opcja A: VPS (Node adapter)

```bash
cd apps/storefront
npm ci && npm run build
pm2 start dist/server/entry.mjs --name storefront
```

### Storefront — opcja B: Vercel

1. Zmien adapter w `astro.config.mjs`:
```javascript
import vercel from '@astrojs/vercel';
// ...
adapter: vercel(),
```

2. `npm install @astrojs/vercel`
3. Deploy:
```bash
vercel --yes --prod
vercel env add VENDURE_API_URL production
vercel env add VENDURE_CHANNEL_TOKEN production
vercel env add PUBLIC_SITE_URL production
vercel env add PUBLIC_COOKIE_DOMAIN production
vercel domains add your-domain.pl
```

## Nowy sklep (multi-tenant)

Pelna instrukcja: [proces-nowy-sklep-vendure.md](../../baza-wiedzy/proces-nowy-sklep-vendure.md)

Skrocona wersja:
1. **Vendure Dashboard** → Settings → Channels → Create channel (PLN, pl, Polska)
2. **Wypelnij custom fields** — storeName, PayU credentials, storefrontUrl, etc.
3. **Dodaj Promotion** "Darmowa dostawa" — condition: minimum_order_amount, action: free_shipping
4. **Shipping methods** — przypisz do channelu
5. **Payment methods** — przypisz do channelu
6. **Produkty** — przypisz do channelu
7. **Skopiuj storefront** → nowy folder, zmien adapter (jesli Vercel), ustaw 4 env vars
8. **Deploy** + DNS

## Platnosci PayU

### Obslugiwane metody
- **BLIK** — kod 6-cyfrowy, potwierdzenie w aplikacji banku, waiting screen z pollingiem
- **Karta/przelew** — redirect na strone PayU
- **PayPo** — kup teraz, zaplac za 30 dni
- **COD** — platnosc przy odbiorze (kurierowi)

### Flow BLIK
1. Klient wpisuje 6 cyfr → checkout POST
2. PayU tworzy order z BLIK_AUTHORIZATION_CODE
3. Redirect na `/checkout/blik-waiting` — spinner + "Potwierdz w aplikacji bankowej"
4. Polling `/api/payment/status?code=XXX` co 2 sekundy
5. Klient potwierdza w banku → PayU webhook COMPLETED → payment Settled → order PaymentSettled
6. Storefront wykrywa COMPLETED → redirect na confirmation page
7. Timeout 120s → komunikat bledu + "Sprobuj ponownie"

### Webhook
- Endpoint: `/payu/notify`
- Zawsze HTTP 200 (PayU docs requirement)
- MD5 signature verification per-channel (secondKey z Channel custom fields)
- Amount verification (anti-fraud)
- Auto-transition: payment Settled → order PaymentSettled

### Sandbox
W Channel custom fields ustaw `payuSandbox: true`. Sandbox URL: secure.snd.payu.com.

## Darmowa dostawa

**Jedno zrodlo prawdy: Vendure Promotion.**

1. W dashboardzie: Marketing → Promotions → Create
2. Condition: `minimum_order_amount` (np. 15000 = 150 PLN)
3. Action: `free_shipping`
4. Enable

Storefront automatycznie wykrywa darmowa dostawe z `order.discounts` i wyswietla "Gratis" przy shipping.

`freeShippingThreshold` w Channel custom fields to **UI hint** — wyswietlany w progress bar koszyka i exit intent overlay. Nie wplywa na kalkulacje.

## Security

- AES-256-GCM encryption: PayU credentials, BaseLinker token (at rest w DB)
- CSRF: Astro checkOrigin + Origin header validation
- Rate limiting: cart API, payment status, webhook (per IP)
- sanitize-html: HTML product descriptions
- Bearer-only auth: zero session cookies od Vendure
- Input validation: email, phone, postal code, BLIK code, variant IDs
- Secure cookies: HttpOnly, SameSite=Lax, Secure (production)
- PayU redirect whitelist: only secure.payu.com domains

## Struktura storefrontu

### Strony

| Strona | Plik | Opis |
|--------|------|------|
| Homepage | `pages/index.astro` | Kolekcje + grid produktow |
| PDP | `pages/produkty/[slug].astro` | Dynamic product page |
| Kolekcja | `pages/kolekcje/[slug].astro` | Collection page |
| Koszyk | `pages/koszyk.astro` | Full cart page |
| Checkout | `pages/checkout.astro` | One-page checkout |
| BLIK wait | `pages/checkout/blik-waiting.astro` | BLIK confirmation polling |
| Confirmation | `pages/checkout/confirmation.astro` | Order confirmation |
| Upsell | `pages/upsell.astro` | Post-purchase interstitial |
| Regulamin | `pages/regulamin.astro` | Szablon z [PLACEHOLDERS] |
| Prywatnosc | `pages/polityka-prywatnosci.astro` | RODO compliant |
| 404 | `pages/404.astro` | Not found |

### Komponenty

| Komponent | Opis |
|-----------|------|
| `Header.astro` | Logo (z Channel storeName), nawigacja kolekcji, cart badge |
| `Footer.astro` | Brand, linki, kontakt (z Channel custom fields) |
| `PromoBar.astro` | Dismissable promo bar (tekst z Channel promoBarText) |
| `BaseLayout.astro` | SEO meta, OG tags, fonts, pixel, consent, store config |
| `CartDrawer.tsx` | Slide-out cart (React island), free shipping progress |
| `ProductCard.astro` | Grid card z cena i obrazkiem |
| `ProductDetail.astro` | PDP: galeria, warianty, ATC, trust badges, urgency |
| `TrustBadges.astro` | BLIK, InPost, 14 dni zwrotu, bezpieczna platnosc |
| `ExitIntentOverlay.tsx` | Exit intent popup (visibility API + scroll velocity) |
| `SMSCaptureOverlay.tsx` | SMS opt-in overlay (RODO compliant) |
| `CookieConsent.astro` | RODO cookie consent banner |

### API Routes

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/cart` | GET | Pobierz aktywne zamowienie |
| `/api/cart` | POST | Dodaj produkt do koszyka |
| `/api/cart/adjust` | POST | Zmien ilosc |
| `/api/cart/remove` | POST | Usun z koszyka |
| `/api/cart/coupon` | POST | Zastosuj/usun kupon |
| `/api/payment/status` | GET | Status platnosci (polling, ?code=) |
| `/api/postal-lookup` | GET | Kod pocztowy → miasto |

### Store Config

Storefront laduje konfiguracje sklepu z Vendure Channel custom fields przez `getStoreConfig()`:

```typescript
import { getStoreConfig } from '@/lib/store-config';

const config = await getStoreConfig(Astro.request);
// config.storeName, config.contactEmail, config.promoBarText, ...
```

Cache: 60 sekund TTL (zmiana w dashboardzie widoczna po max 1 minucie).

## Vendure plugins

### PayuPlugin
PayU BLIK + redirect + PayPo. Per-channel credentials. OAuth2 token cache z dedup. Webhook z MD5 signature verification. Cancel + refund API.

### EncryptionPlugin
AES-256-GCM encryption at rest dla Channel credentials (payuClientSecret, payuSecondKey, baseLinkerToken). TypeORM EventSubscriber: encrypt on save, decrypt on load.

### BaseLinkerPlugin
Sync zamowien do BaseLinker via Job Queue. Per-channel token. Idempotency (extOrderId). Discord alert on failure.

### AlertsPlugin
Discord webhook na nowe zamowienia. Rich embeds z produktami, klientem, kwota, metoda dostawy, linkiem do dashboardu.

### DashboardExtensionsPlugin
Custom widgets: action queue, stock runway, UTM tracking block.

## License

Private — Jachym Labs. Not for redistribution.
