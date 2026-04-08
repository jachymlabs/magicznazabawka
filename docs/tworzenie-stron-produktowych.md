# Tworzenie stron produktowych

## Jak to dziala

Kazdy produkt ma dwie warstwy:

1. **Karta produktu** (gora) — STALA, automatyczna, dane z Vendure:
   - Zdjecie + galeria, nazwa, cena, warianty, "Dodaj do koszyka", trust badges

2. **Opis produktu** (dol) — TWOJ, pisany recznie w HTML + Tailwind

## Nowa strona — krok po kroku

### 1. Sprawdz ze produkt istnieje w Vendure

Jesli produkt nie jest jeszcze dodany — zobacz `docs/dodawanie-produktow.md`.

Produkt musi miec:
- Nazwe, cene, zdjecia, warianty
- Slug (np. `pluszak-panda`)
- Przypisany do channela `magicznazabawka`

### 2. Skopiuj szablon

```bash
cp src/pages/produkty/_szablon.astro src/pages/produkty/pluszak-panda.astro
```

Nazwa pliku = slug z Vendure. Musi byc identyczna.

### 3. Zmien 2 rzeczy w pliku

```typescript
const SLUG = 'pluszak-panda';
const metaDescription = 'Pluszak obciazeniowy Panda 45cm — opis do Google, max 160 znakow.';
```

### 4. Napisz opis

Miedzy komentarzami `OPIS PRODUKTU` i `KONIEC OPISU` — pisz sekcje w HTML + Tailwind.

Przyklad sekcji:

```html
<section class="py-12 bg-gray-50">
  <div class="mx-auto max-w-4xl px-4">
    <h2 class="text-2xl font-bold text-center mb-8">Dlaczego rodzice wybieraja Pande?</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="text-center">
        <p class="text-3xl font-bold">0.5 kg</p>
        <p class="text-gray-500 text-sm mt-1">Obciazenie uspokajajace</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold">45 cm</p>
        <p class="text-gray-500 text-sm mt-1">Idealny rozmiar do przytulania</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold">500+</p>
        <p class="text-gray-500 text-sm mt-1">Zadowolonych rodzin</p>
      </div>
    </div>
  </div>
</section>
```

Kazda sekcja to `<section>` z wlasnym tlem i paddingiem. Uzyj Tailwind do stylowania.

### 5. Testuj lokalnie

```bash
npm run dev
# Otworz http://localhost:4321/produkty/pluszak-panda
```

Strona odswiezy sie automatycznie po kazdym zapisie.

### 6. Push

```bash
git add src/pages/produkty/pluszak-panda.astro
git commit -m "feat: strona produktowa pluszak-panda"
git push origin main
```

Vercel automatycznie deployuje. Live w ~30 sekund.

## Zasady

- **Nie ruszaj** gory pliku (importy, POST handler, fetch produktu) ani dolu (script koszyka)
- **Pisz miedzy komentarzami** `OPIS PRODUKTU` i `KONIEC OPISU`
- **Tailwind classes** — uzyj https://tailwindcss.com/docs do referencji
- **Zdjecia do opisu** — wrzuc do `public/images/`, uzywaj jako `/images/nazwa.jpg`
- **Zdjecia produktu** (karta) — laduj przez Vendure Dashboard (Admin > Assets)
- **Reuzywalne komponenty** — jesli powtarzasz ten sam layout na wielu produktach, wyciagnij do `src/components/` i importuj

## Struktura plikow

```
src/pages/produkty/
├── [slug].astro           ← automatyczna strona (fallback z Vendure)
├── _szablon.astro          ← szablon do kopiowania
├── pluszak-panda.astro     ← custom strona (nadpisuje [slug] dla tego produktu)
└── kuleczki-magnetyczne.astro
```

Jesli produkt NIE ma custom strony — Vendure automatycznie generuje podstawowa pod `[slug]`.
