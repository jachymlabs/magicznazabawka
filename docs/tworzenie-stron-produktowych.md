# Tworzenie stron produktowych

## Jak to dziala

Kazdy produkt w sklepie ma **dwie warstwy**:

1. **Karta produktu** (gora strony) — STALA, automatyczna, dane z Vendure:
   - Zdjecie produktu + galeria
   - Nazwa, cena, warianty
   - Przycisk "Dodaj do koszyka"
   - Trust badges (BLIK, InPost, 14 dni zwrot)
   - Urgency timer ("Zamow w ciagu X — wysylka dzis!")

2. **Opis produktu** (dol strony) — CUSTOMOWY, tworzony recznie per produkt:
   - Sekcje sprzedazowe: problem, rozwiazanie, cechy, porownanie, opinie, FAQ, gwarancja, CTA
   - Budowany z gotowych komponentow (klocki)
   - Kazdy produkt moze miec inny uklad sekcji

## Krok po kroku: nowa strona produktowa

### 1. Upewnij sie ze produkt istnieje w Vendure

Produkt musi byc dodany w Vendure Dashboard (vendure.jachymlabs.pl/admin):
- Nazwa, cena, zdjecia, warianty
- Slug (np. `pluszak-panda`) — to bedzie URL: `/produkty/pluszak-panda`
- Produkt przypisany do channela `magicznazabawka`

### 2. Skopiuj szablon

Skopiuj plik szablonu:

```bash
cp src/pages/produkty/_szablon.astro src/pages/produkty/pluszak-panda.astro
```

Nazwa pliku = slug produktu z Vendure. To WAZNE — musi byc identyczna.

### 3. Zmien slug w pliku

Otworz nowy plik i zmien linie:

```typescript
const SLUG = 'pluszak-panda';  // <-- slug produktu z Vendure
```

### 4. Zmien meta description

```typescript
const metaDescription = 'Pluszak obciazeniowy Panda 45cm — pomaga dzieciom sie wyciszyc...';
```

### 5. Dodaj sekcje opisu

Pod komentarzem `CUSTOM SEKCJE` dodawaj komponenty. Kazdy komponent to osobna sekcja na stronie.
Mozesz je laczyc w dowolnej kolejnosci — jak klocki.

### 6. Commit i push

```bash
git add src/pages/produkty/pluszak-panda.astro
git commit -m "feat: strona produktowa pluszak-panda"
git push origin main
```

Vercel automatycznie deployuje po pushu na main. Strona bedzie live w ~30 sekund.

---

## Dostepne komponenty (sekcje)

Kazdy komponent akceptuje `theme` (`light` | `dark` | `accent` | `brand`) i `paddingY` (`sm` | `md` | `lg` | `xl`).

### StatsBar — pasek ze statystykami

```astro
<StatsBar
  theme="dark"
  stats={[
    { value: '500+', label: 'Sprzedanych sztuk' },
    { value: '4.9/5', label: 'Srednia ocena' },
    { value: '24h', label: 'Wysylka InPost' },
    { value: '30 dni', label: 'Darmowy zwrot' },
  ]}
/>
```

### FeaturesGrid — grid z ikonami i opisami cech

Ikony: `star`, `shield-check`, `truck`, `heart`, `leaf`, `wind`, `refresh-cw`, `zap`, `check-circle`, `clock`, `gift`, `smile`, `award`, `target`, `thumbs-up`

```astro
<FeaturesGrid
  headline="Dlaczego rodzice wybieraja tego pluszaka?"
  theme="accent"
  columns={3}
  features={[
    { icon: 'heart', title: 'Obciazeniowy', description: 'Waży 0.5 kg — pomaga sie wyciszyc i skupic' },
    { icon: 'shield-check', title: 'Bezpieczny', description: 'Certyfikat CE, materialy bez BPA i ftalanow' },
    { icon: 'smile', title: 'Miekki', description: 'Premium plusz — przyjemny w dotyku, nie mechaci sie' },
  ]}
/>
```

### ComparisonTable — porownanie my vs konkurencja

```astro
<ComparisonTable
  headline="Nasz pluszak vs zwykly z bazaru"
  ourBrand="Tulimis"
  competitor="Zwykly pluszak"
  rows={[
    { feature: 'Obciazeniowy (0.5 kg)', us: true, them: false },
    { feature: 'Certyfikat CE', us: true, them: false },
    { feature: 'Nie mechaci sie', us: true, them: false },
    { feature: 'Mozna prac w pralce', us: true, them: true },
    { feature: '30 dni na zwrot', us: true, them: false },
  ]}
/>
```

### TestimonialQuote — pojedyncza opinia klienta

```astro
<TestimonialQuote
  theme="accent"
  quote="Corka nie rozstaje sie z panda od 3 miesiecy. Wczesniej miala problem z zasypianiem — teraz przytula pluszaka i zasypia w 10 minut."
  authorName="Marta z Krakowa"
  authorTitle="Mama 5-latki, weryfikowany zakup"
  rating={5}
/>
```

### ReviewsCarousel — karuzela opinii

```astro
<ReviewsCarousel
  headline="Co mowia rodzice"
  reviews={[
    { body: 'Najlepsza inwestycja...', author: 'Anna z Gdanska', rating: 5 },
    { body: 'Corka go uwielbia...', author: 'Tomek z Warszawy', rating: 5 },
    { body: 'Swietna jakosc...', author: 'Kasia z Wroclawia', rating: 4 },
  ]}
/>
```

### FAQAccordion — rozwijane pytania i odpowiedzi

```astro
<FAQAccordion
  client:visible
  title="Czesto zadawane pytania"
  items={[
    { question: 'Jaki jest czas dostawy?', answer: 'Zamowienia zlozone do 14:00 wysylamy tego samego dnia. Ponad 95% przesylek InPost dociera w 24h.' },
    { question: 'Czy mozna prac pluszaka?', answer: 'Tak! Pralka 30°C na delikatnym programie. Szybko schnie.' },
    { question: 'Dla jakiego wieku?', answer: 'Od 3 lat. Certyfikat CE potwierdza bezpieczenstwo.' },
  ]}
/>
```

UWAGA: FAQAccordion to React component — wymaga `client:visible`.

### FinalCTA — koncowy przycisk "kup teraz"

Dane z Vendure (automatyczne) — nie trzeba wpisywac cen recznie.

```astro
<FinalCTA
  productName={product.name}
  price={lowestPrice}
  variantId={product.variants[0]?.id}
  image={product.featuredAsset?.preview}
  urgencyText="Zamow do 14:00 — wysylka dzis!"
/>
```

### BrandStory — historia marki / sekcja z tekstem + zdjecie

```astro
<BrandStory
  headline="Dlaczego stworzyliśmy Tulimisia"
  bodyHtml="<p>Jako rodzice wiedzielismy, ze dzieci potrzebuja czegos wiecej niz zwykly pluszak...</p>"
  imageUrl="/images/nasza-historia.jpg"
  imageAlignment="right"
/>
```

### HeroSection — baner z duzym naglowkiem

```astro
<HeroSection
  headline="Pluszak, ktory pomaga dzieciom sie wyciszyc"
  subheadline="Obciazeniowy, certyfikowany, uwielbiany przez 500+ rodzin"
  primaryCtaLabel="Kup teraz"
  primaryCtaUrl="#primary-atc-btn"
  imageUrl="/images/hero-panda.jpg"
/>
```

### BeforeAfter — sekcja przed/po

```astro
<BeforeAfter
  headline="Wieczorne zasypianie"
  beforeImageUrl="/images/before.jpg"
  beforeLabel="Bez pluszaka"
  afterImageUrl="/images/after.jpg"
  afterLabel="Z Tulimisiem"
  description="Sredni czas zasypiania skrocil sie z 45 do 15 minut"
/>
```

### CustomHtml — dowolny HTML

Gdy zadna z powyzszych sekcji nie pasuje — wrzuc wlasny HTML:

```astro
<CustomHtml htmlContent={`
  <section class="py-12 bg-gray-50">
    <div class="mx-auto max-w-4xl px-4 text-center">
      <h2 class="text-2xl font-bold mb-4">Twoj wlasny naglowek</h2>
      <p class="text-gray-600">Twoj wlasny tekst...</p>
    </div>
  </section>
`} />
```

---

## Zalecana kolejnosc sekcji (playbook sprzedazowy)

Nie musisz uzywac wszystkich — dobierz pod produkt:

1. **ProductDetail** (karta produktu — automatyczna, zawsze na gorze)
2. **StatsBar** — social proof w liczbach
3. **Problem** — bol klienta (CustomHtml lub FeaturesGrid z ikonami X)
4. **FeaturesGrid** — cechy/korzysci produktu
5. **ComparisonTable** — my vs konkurencja
6. **TestimonialQuote** — wyrozniajaca sie opinia
7. **ReviewsCarousel** — wiecej opinii
8. **FAQAccordion** — pytania i odpowiedzi
9. **FinalCTA** — ostateczne wezwanie do zakupu

---

## Dodawanie nowych komponentow (sekcji)

Jesli potrzebujesz sekcji ktora nie istnieje:

1. Stworz plik `src/components/sections/NazwaSekcji.astro`
2. Dodaj typy do `src/types/sections.ts`
3. Importuj w stronie produktowej

Przyklad minimalnego komponentu:

```astro
---
interface Props {
  headline: string;
  items: string[];
}
const { headline, items } = Astro.props;
---

<section class="py-12">
  <div class="mx-auto max-w-4xl px-4">
    <h2 class="text-2xl font-bold text-center mb-8">{headline}</h2>
    <ul class="space-y-2">
      {items.map(item => (
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
</section>
```

---

## Zdjecia i assety

- Zdjecia produktow — laduj do Vendure (Admin > Assets)
- Zdjecia do sekcji opisu — wrzuc do `public/images/` w repo
- Uzywaj: `/images/nazwa-pliku.jpg` w kodzie

---

## Testowanie lokalne

```bash
npm run dev
# Otworz http://localhost:4321/produkty/pluszak-panda
```

Strona odswiezy sie automatycznie po kazdym zapisie pliku.
