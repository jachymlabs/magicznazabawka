# magicznazabawka.pl — Storefront

Sklep internetowy magicznazabawka.pl. Frontend Astro 6 (SSR) na Vercel, podpiety do wspoldzielonego backendu Vendure.

## Stack

- **Frontend:** Astro 6 + React islands + Tailwind CSS 4
- **Backend:** Vendure 3.x (vendure.jachymlabs.pl)
- **Platnosci:** PayU (BLIK, karta, przelew, PayPo) + COD
- **Dostawa:** InPost Paczkomaty + Kurier + Kurier pobranie
- **Deploy:** Vercel (auto-deploy na push do main)

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
| `VENDURE_API_URL` | URL Vendure Shop API (https://vendure.jachymlabs.pl/shop-api) |
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

## Deploy

Vercel auto-deploy — kazdy push do `main` automatycznie deployuje nowa wersje.

ENV vars ustawione w Vercel Dashboard (Settings > Environment Variables).

## Strony produktowe — jak to dziala

Sklep ma **dwa poziomy** stron produktowych:

### Poziom 1: Automatyczna strona (generic PDP)

Kazdy produkt dodany w Vendure automatycznie ma strone pod `/produkty/[slug]`.
Dane ciagniete z Vendure: nazwa, cena, zdjecia, warianty, opis HTML, stock.

**Nie trzeba nic robic w kodzie** — wystarczy dodac produkt w Vendure Dashboard.

### Poziom 2: Custom landing page (override)

Dla produktow pod reklamy — reczna strona z sekcjami sprzedazowymi.

Jak stworzyc:
1. Stworz plik `src/pages/produkty/<slug>.astro` (slug = taki sam jak w Vendure)
2. Na gorze uzyj `<ProductDetail product={product} />` — to stala karta (zdjecie, cena, warianty, ATC button)
3. Pod spodem dodaj custom sekcje: problem/bol, solution, features, comparison, testimonials, FAQ, guarantee, final CTA

Astro automatycznie priorytetyzuje static route nad `[slug]` — override po prostu dziala.

**Szablon nowej strony produktowej:**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import ProductDetail from '@/components/ProductDetail.astro';
import StickyATCBar from '@/components/StickyATCBar';
import FinalCTA from '@/components/FinalCTA.astro';
import FAQAccordion from '@/components/FAQAccordion';
import FeaturesGrid from '@/components/sections/FeaturesGrid.astro';
import ComparisonTable from '@/components/sections/ComparisonTable.astro';
import TestimonialQuote from '@/components/sections/TestimonialQuote.astro';
import StatsBar from '@/components/sections/StatsBar.astro';
import ReviewsCarousel from '@/components/sections/ReviewsCarousel.astro';
import { shopApi, shopApiRaw, redirectWithToken } from '@/lib/vendure';
import { GET_PRODUCT_DETAIL } from '@/lib/queries';
import { ADD_TO_CART } from '@/lib/mutations';
import { buildAssetUrl } from '@/lib/utils';
import type { VendureVariant } from '@/types/vendure';

const SLUG = 'twoj-slug-produktu';  // <-- ZMIEN NA SLUG PRODUKTU

// POST handler (no-JS fallback)
if (Astro.request.method === 'POST') {
  try {
    const formData = await Astro.request.formData();
    const variantId = formData.get('variantId') as string;
    const rawQty = parseInt(formData.get('quantity') as string || '1', 10);
    const quantity = Math.max(1, Math.min(99, isNaN(rawQty) ? 1 : rawQty));
    if (variantId) {
      const result = await shopApiRaw<any>(ADD_TO_CART, { variantId, quantity }, Astro.request);
      return redirectWithToken('/koszyk', result.authToken);
    }
  } catch {}
}

// Fetch product
const data = await shopApi<any>(GET_PRODUCT_DETAIL, { slug: SLUG }, Astro.request);
const product = data.product;
if (!product) return Astro.redirect('/');

const lowestPrice = product.variants?.length
  ? Math.min(...product.variants.map((v: VendureVariant) => v.priceWithTax))
  : 0;

const ogImageUrl = product?.featuredAsset?.preview
  ? buildAssetUrl(product.featuredAsset.preview, 'large')
  : undefined;
---

<BaseLayout
  title={`${product.name} — Sklep`}
  description="WPISZ META DESCRIPTION"
  ogImage={ogImageUrl}
  ogType="product"
>
  {/* 1. STALA KARTA PRODUKTU (z Vendure) */}
  <ProductDetail product={product} />

  {/* Sticky ATC bar */}
  {product.variants[0] && (
    <StickyATCBar
      client:idle
      productName={product.name}
      price={lowestPrice}
      variantId={product.variants[0].id}
    />
  )}

  {/* 2. CUSTOM SEKCJE — dodaj/usun/zmien wg potrzeb */}

  {/* Przykladowe sekcje (odkomentuj i wypelnij): */}

  {/* <StatsBar theme="dark" stats={[
    { value: '500+', label: 'Sprzedanych sztuk' },
    { value: '4.9/5', label: 'Srednia ocena' },
    { value: '24h', label: 'Wysylka InPost' },
  ]} /> */}

  {/* <FeaturesGrid headline="Dlaczego warto?" columns={3} features={[
    { icon: 'star', title: 'Cecha 1', description: 'Opis cechy' },
    { icon: 'shield-check', title: 'Cecha 2', description: 'Opis cechy' },
    { icon: 'truck', title: 'Cecha 3', description: 'Opis cechy' },
  ]} /> */}

  {/* <ComparisonTable
    headline="My vs konkurencja"
    ourBrand="Nasza marka"
    competitor="Konkurencja"
    rows={[
      { feature: 'Cecha', us: true, them: false },
    ]}
  /> */}

  {/* <TestimonialQuote
    quote="Opinia klienta..."
    authorName="Jan z Krakowa"
    authorTitle="Weryfikowany zakup"
    rating={5}
  /> */}

  {/* 3. FINAL CTA */}
  <FinalCTA
    productName={product.name}
    price={lowestPrice}
    variantId={product.variants[0]?.id}
    image={product.featuredAsset?.preview}
    urgencyText="Zamow do 14:00 — wysylka dzis!"
  />

  {/* ATC script */}
  <script>
    function initAddToCartForm() {
      const form = document.querySelector('form[method="POST"]') as HTMLFormElement | null;
      if (!form) return;
      const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      if (!btn) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const variantId = formData.get('variantId') as string;
        const quantity = parseInt(formData.get('quantity') as string || '1', 10);
        if (!variantId) return;
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = 'Dodawanie...';
        try {
          const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ variantId, quantity }),
          });
          if (res.ok) {
            const data = await res.json();
            window.dispatchEvent(new CustomEvent('cart-updated', { detail: data.order }));
          } else { form.submit(); return; }
        } catch { form.submit(); return; }
        btn.disabled = false;
        btn.textContent = originalText;
      });
    }
    initAddToCartForm();
  </script>
</BaseLayout>
```

### Dostepne sekcje (komponenty)

| Komponent | Opis | Props |
|-----------|------|-------|
| `StatsBar` | Pasek ze statystykami | `stats[]`, `theme` |
| `FeaturesGrid` | Grid z ikonami i opisami | `features[]`, `columns`, `headline`, `theme` |
| `ComparisonTable` | Tabela porownawcza my vs oni | `rows[]`, `ourBrand`, `competitor` |
| `TestimonialQuote` | Pojedyncza opinia | `quote`, `authorName`, `rating` |
| `ReviewsCarousel` | Karuzela opinii | `reviews[]`, `headline` |
| `FAQAccordion` | Rozwijane FAQ | `items[]`, `title` |
| `FinalCTA` | Koncowe wezwanie do akcji | `productName`, `price`, `variantId` |
| `HeroSection` | Hero banner | `headline`, `subheadline`, `image` |
| `BeforeAfter` | Przed/po | `before`, `after` |
| `BrandStory` | Historia marki | `title`, `paragraphs` |

## Struktura

```
src/
├── components/
│   ├── ProductDetail.astro   # Stala karta produktu (Vendure data)
│   ├── sections/             # Sekcje do custom landing pages
│   ├── Header.astro, Footer.astro, CartDrawer.tsx...
├── layouts/BaseLayout.astro  # SEO, OG, Meta Pixel, consent
├── lib/                      # vendure.ts, store-config.ts, cart-store.ts
├── pages/
│   ├── produkty/[slug].astro # Generic PDP (auto z Vendure)
│   ├── produkty/<slug>.astro # Override per produkt (custom landing)
│   ├── checkout.astro, koszyk.astro, regulamin.astro...
├── styles/global.css
└── types/
```

## Boilerplate

Bazuje na [astro-storefront-pl](https://github.com/jachymlabs/astro-storefront-pl). Aktualizacje boilerplate'u mozna mergowac recznie.
