# magicznazabawka.pl — Storefront

## Stack

Astro 6 (SSR) + React islands + Tailwind CSS 4. Deploy na Vercel (auto na push do main).
Backend: Vendure 3.x na vendure.jachymlabs.pl.

## Backend

- **Channel:** magicznazabawka (ID: 5, token: `magicznazabawka-shop`)
- **Admin:** https://vendure.jachymlabs.pl/admin
- **Shop API:** https://vendure.jachymlabs.pl/shop-api
- **Payment:** PayU (ID 7) + COD (ID 8)
- **Shipping:** InPost Paczkomat (ID 11), Kurier (ID 12), Kurier+COD (ID 13)

## Strony produktowe — KLUCZOWE

Kazdy produkt ma dwie warstwy:

1. **Karta produktu** (gora) — komponent `ProductDetail.astro`. Stala, automatyczna, dane z Vendure. NIE MODYFIKUJ.
2. **Opis produktu** (dol) — custom HTML + Tailwind, pisany recznie per produkt.

### Tworzenie nowej strony produktowej

1. `cp src/pages/produkty/_szablon.astro src/pages/produkty/<slug>.astro`
2. Zmien `SLUG` i `metaDescription` (jedyne 2 linie do zmiany)
3. Pisz opis miedzy komentarzami `OPIS PRODUKTU` i `KONIEC OPISU`
4. Opis = sekcje `<section>` z Tailwindem. Dowolna struktura.

### Czego NIE ruszac w szablonie

- Importy na gorze pliku
- POST handler (obsluga koszyka)
- Fetch produktu z Vendure
- `<ProductDetail product={product} />`
- `<StickyATCBar />`
- `<script>` na dole (obsluga ATC)

### Plik `[slug].astro`

Fallback — automatyczna strona dla produktow bez custom opisu. Dane z Vendure. Nie ruszaj.

## Wazne

- **Ceny w Vendure sa w GROSZACH** — 7900 = 79 zl, 12500 = 125 zl

## Zasady

- **Branding/dane firmy** — TYLKO przez Vendure Dashboard, nigdy hardcode w kodzie
- **Nie commituj .env** — jest w .gitignore
- **Testuj lokalnie** przed push (`npm run dev`)
- **Zdjecia produktu** (karta) — laduj przez Vendure Dashboard
- **Zdjecia do opisu** — wrzuc do `public/images/`, uzywaj jako `/images/nazwa.jpg`
- **Reuzywalne komponenty** — jesli powtarzasz layout, wyciagnij do `src/components/` i importuj

## Struktura

```
src/pages/produkty/
├── [slug].astro        ← automatyczna strona (fallback)
├── _szablon.astro      ← szablon do kopiowania
└── <slug>.astro        ← custom strona per produkt
```

## Dokumentacja

- `docs/dodawanie-produktow.md` — jak dodawac produkty w Vendure Dashboard
- `docs/tworzenie-stron-produktowych.md` — jak tworzyc custom strony produktowe
