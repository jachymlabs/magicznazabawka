# magicznazabawka.pl

Sklep internetowy z zabawkami. Astro 6 (SSR) na Vercel + Vendure backend.

## Stack

| Warstwa | Technologia |
|---------|-------------|
| **Frontend** | Astro 6 + React islands + Tailwind CSS 4 |
| **Backend** | Vendure 3.x (vendure.jachymlabs.pl) |
| **Platnosci** | PayU (BLIK, karta, przelew, PayPo) + platnosc przy odbiorze |
| **Dostawa** | InPost Paczkomaty + InPost Kurier + Kurier pobranie |
| **Hosting** | Vercel (auto-deploy na push do main) |

## Jak uruchomic lokalnie

```bash
git clone https://github.com/jachymlabs/magicznazabawka.git
cd magicznazabawka
npm install
cp .env.example .env
npm run dev
```

Sklep: http://localhost:4321

## ENV

| Zmienna | Wartosc |
|---------|---------|
| `VENDURE_API_URL` | `https://vendure.jachymlabs.pl/shop-api` |
| `VENDURE_CHANNEL_TOKEN` | `magicznazabawka-shop` |
| `PUBLIC_SITE_URL` | `https://magicznazabawka.pl` |
| `PUBLIC_COOKIE_DOMAIN` | `.magicznazabawka.pl` |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel ID (opcjonalne) |
| `META_CAPI_ACCESS_TOKEN` | Meta CAPI token (opcjonalne) |

Env vars sa ustawione w Vercel Dashboard (Settings > Environment Variables).
Lokalnie: `.env` (nie commituj).

## Deploy

Kazdy push do `main` automatycznie deployuje nowa wersje na Vercel.
Nie trzeba nic robic recznie — push i gotowe.

## Konfiguracja sklepu

Branding, dane firmy, promo bar — wszystko z **Vendure Dashboard**, nie z kodu:

1. https://vendure.jachymlabs.pl/admin
2. Settings > Channels > magicznazabawka
3. Wypelnij: storeName, contactEmail, promoBarText, companyName, companyNip, companyAddress, etc.

Zmiany widoczne bez deployu (cache 60s).

---

## Strony produktowe

Kazdy produkt ma dwie warstwy:

### Gora: Karta produktu (stala)

Automatyczna dla kazdego produktu. Dane z Vendure:
- Zdjecie + galeria
- Nazwa, cena, warianty
- Przycisk "Dodaj do koszyka"
- Trust badges, urgency timer
- Komponent: `ProductDetail.astro` — **nie ruszaj**

### Dol: Opis produktu (custom)

Pisany recznie per produkt w HTML + Tailwind. Kazdy produkt moze miec inny opis.

## Tworzenie strony produktowej — krok po kroku

### 1. Produkt musi istniec w Vendure

W dashboardzie (vendure.jachymlabs.pl/admin):
- Dodaj produkt: nazwa, cena, zdjecia, warianty
- Ustaw slug (np. `pluszak-panda`) — to bedzie URL
- Przypisz do channela `magicznazabawka`

Po dodaniu produkt automatycznie dziala pod `/produkty/pluszak-panda` (podstawowa strona z Vendure).

### 2. Skopiuj szablon

```bash
cp src/pages/produkty/_szablon.astro src/pages/produkty/pluszak-panda.astro
```

**Nazwa pliku = slug produktu z Vendure.** Musi byc identyczna.

### 3. Zmien 2 linie w pliku

Otworz nowy plik i zmien:

```typescript
const SLUG = 'pluszak-panda';
const metaDescription = 'Pluszak obciazeniowy Panda 45cm — opis do Google, max 160 znakow.';
```

### 4. Napisz opis

Miedzy komentarzami `OPIS PRODUKTU` i `KONIEC OPISU` pisz sekcje w HTML + Tailwind.

**Przyklad sekcji — statystyki:**
```html
<section class="py-12 bg-gray-900 text-white">
  <div class="mx-auto max-w-5xl px-4">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
      <div>
        <p class="text-3xl font-bold">500+</p>
        <p class="text-sm text-white/60 mt-1">Sprzedanych sztuk</p>
      </div>
      <div>
        <p class="text-3xl font-bold">4.9/5</p>
        <p class="text-sm text-white/60 mt-1">Srednia ocena</p>
      </div>
      <div>
        <p class="text-3xl font-bold">24h</p>
        <p class="text-sm text-white/60 mt-1">Wysylka InPost</p>
      </div>
      <div>
        <p class="text-3xl font-bold">30 dni</p>
        <p class="text-sm text-white/60 mt-1">Darmowy zwrot</p>
      </div>
    </div>
  </div>
</section>
```

**Przyklad sekcji — cechy produktu:**
```html
<section class="py-12">
  <div class="mx-auto max-w-4xl px-4">
    <h2 class="text-2xl font-bold text-center mb-8">Dlaczego rodzice wybieraja Pande?</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="text-center p-6 rounded-lg bg-gray-50">
        <p class="font-semibold text-lg">Obciazeniowy</p>
        <p class="text-gray-500 text-sm mt-2">Wazy 0.5 kg — pomaga sie wyciszyc i skupic</p>
      </div>
      <div class="text-center p-6 rounded-lg bg-gray-50">
        <p class="font-semibold text-lg">Bezpieczny</p>
        <p class="text-gray-500 text-sm mt-2">Certyfikat CE, materialy bez BPA</p>
      </div>
      <div class="text-center p-6 rounded-lg bg-gray-50">
        <p class="font-semibold text-lg">Miekki</p>
        <p class="text-gray-500 text-sm mt-2">Premium plusz, nie mechaci sie</p>
      </div>
    </div>
  </div>
</section>
```

**Przyklad sekcji — opinia klienta:**
```html
<section class="py-12 bg-amber-50">
  <div class="mx-auto max-w-2xl px-4 text-center">
    <div class="text-amber-500 text-lg mb-3">★★★★★</div>
    <blockquote class="text-lg text-gray-800 italic leading-relaxed">
      "Corka nie rozstaje sie z Panda od 3 miesiecy. Wczesniej miala problem
      z zasypianiem — teraz przytula pluszaka i zasypia w 10 minut."
    </blockquote>
    <p class="mt-4 text-sm text-gray-500">Marta z Krakowa — mama 5-latki</p>
  </div>
</section>
```

**Przyklad sekcji — FAQ:**
```html
<section class="py-12">
  <div class="mx-auto max-w-3xl px-4">
    <h2 class="text-2xl font-bold text-center mb-8">Czesto zadawane pytania</h2>
    <div class="space-y-4">
      <details class="border border-gray-200 rounded-lg">
        <summary class="px-4 py-3 font-medium cursor-pointer">Jaki jest czas dostawy?</summary>
        <p class="px-4 pb-3 text-gray-600 text-sm">Zamowienia zlozone do 14:00 wysylamy tego samego dnia. Ponad 95% przesylek InPost dociera w 24h.</p>
      </details>
      <details class="border border-gray-200 rounded-lg">
        <summary class="px-4 py-3 font-medium cursor-pointer">Czy mozna prac pluszaka?</summary>
        <p class="px-4 pb-3 text-gray-600 text-sm">Tak! Pralka 30°C na delikatnym programie.</p>
      </details>
    </div>
  </div>
</section>
```

Mozesz tworzyc dowolne sekcje — kazda to `<section>` z Tailwindem.

### 5. Testuj lokalnie

```bash
npm run dev
```

Otworz `http://localhost:4321/produkty/pluszak-panda` — strona odswiezy sie po kazdym zapisie.

### 6. Push na produkcje

```bash
git add src/pages/produkty/pluszak-panda.astro
git commit -m "feat: strona produktowa pluszak-panda"
git push origin main
```

Vercel deployuje automatycznie. Live w ~30 sekund.

## Reuzywalne komponenty

Jesli powtarzasz ten sam layout na wielu produktach — wyciagnij do komponentu:

1. Stworz `src/components/MojaSekcja.astro`
2. Importuj w stronie produktowej: `import MojaSekcja from '@/components/MojaSekcja.astro';`
3. Uzyj: `<MojaSekcja title="..." />`

## Zdjecia

| Typ | Gdzie | Jak uzywac |
|-----|-------|------------|
| Zdjecia produktu (karta) | Vendure Dashboard > Assets | Automatyczne — laduje sie z Vendure |
| Zdjecia do opisu | `public/images/` w repo | `<img src="/images/nazwa.jpg" />` |

## Struktura plikow

```
src/
├── components/
│   ├── ProductDetail.astro    ← Karta produktu (nie ruszaj)
│   ├── Header.astro           ← Naglowek sklepu
│   ├── Footer.astro           ← Stopka
│   ├── CartDrawer.tsx         ← Koszyk (boczny panel)
│   └── ...
├── layouts/
│   └── BaseLayout.astro       ← SEO, OG tags, Meta Pixel
├── lib/
│   ├── vendure.ts             ← Komunikacja z Vendure API
│   ├── store-config.ts        ← Config sklepu z Vendure Channel
│   └── cart-store.ts          ← Stan koszyka
├── pages/
│   ├── index.astro            ← Strona glowna
│   ├── produkty/
│   │   ├── [slug].astro       ← Automatyczna strona (fallback)
│   │   ├── _szablon.astro     ← Szablon do kopiowania
│   │   └── pluszak-panda.astro ← Custom strona (przyklad)
│   ├── koszyk.astro           ← Koszyk
│   ├── checkout.astro         ← Checkout
│   ├── regulamin.astro        ← Regulamin
│   └── polityka-prywatnosci.astro
├── styles/global.css
├── types/
└── docs/
    └── tworzenie-stron-produktowych.md  ← Pelna dokumentacja
```

## Przydatne linki

- **Vendure Dashboard:** https://vendure.jachymlabs.pl/admin
- **Tailwind docs:** https://tailwindcss.com/docs
- **Vercel Dashboard:** https://vercel.com/jachymlabs-projects/magicznazabawka
- **Boilerplate:** https://github.com/jachymlabs/astro-storefront-pl
