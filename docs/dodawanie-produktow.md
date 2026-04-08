# Dodawanie produktow w Vendure

Dashboard: https://vendure.jachymlabs.pl/admin

Login: dostaniesz od Patryka.

WAZNE: Po zalogowaniu upewnij sie ze jestes na channelu **magicznazabawka** — sprawdz w prawym gornym rogu. Jesli widzisz inny channel, kliknij i zmien.

## Nowy produkt — krok po kroku

### 1. Wejdz w Catalog > Products > Create Product

### 2. Podstawowe dane

| Pole | Co wpisac | Przyklad |
|------|-----------|---------|
| **Name** | Nazwa produktu (wyswietlana w sklepie) | `Pluszak obciazeniowy Panda` |
| **Slug** | URL produktu — male litery, myslniki, bez spacji | `pluszak-panda` |
| **Description** | Krotki opis HTML (wyswietlany na automatycznej stronie) | `<p>Pluszak obciazeniowy 45cm, 0.5 kg...</p>` |

Slug jest KLUCZOWY — to z niego bierze sie URL (`/produkty/pluszak-panda`) i nazwa pliku custom strony (`pluszak-panda.astro`).

### 3. Zdjecia (Assets)

1. Kliknij **Assets** tab
2. Przeciagnij zdjecia lub kliknij "Upload"
3. Pierwsze zdjecie = glowne (Featured Asset) — to co widac w karcie produktu i liście
4. Reszta = galeria pod spodem

Formaty: JPG, PNG, WebP. Zalecany rozmiar: min 800x800px, kwadratowe.

### 4. Warianty

Vendure rozroznia **Product** (np. "Pluszak Panda") i **Variants** (np. "Panda 45cm", "Panda 60cm"). Kazdy produkt musi miec minimum 1 wariant.

**Produkt z jednym wariantem** (najczesciej):
- Zapisz produkt (Create) — Vendure automatycznie tworzy domyslny wariant
- Wroc do produktu, kliknij na wariant zeby ustawic cene i stock

**Produkt z wieloma wariantami** (np. rozmiary):
1. Przed zapisaniem — w sekcji "Product variants" kliknij "Add option group"
2. Nazwa grupy: np. `Rozmiar`
3. Dodaj opcje: `45cm`, `60cm`
4. Zapisz produkt — Vendure wygeneruje wariant per opcje
5. Kliknij na kazdy wariant i ustaw cene + stock osobno

### 5. Ceny (per wariant)

1. Kliknij na wariant (lub jedyny wariant)
2. Ustaw **Price** — cena w GROSZACH (np. `7900` = 79,00 zl)
3. Waluta: PLN (ustawiona domyslnie)
4. Ceny zawieraja VAT (tak jest skonfigurowane)

UWAGA: Vendure trzyma ceny w groszach! 7900 = 79 zl, 12500 = 125 zl.

### 6. SKU i stan magazynowy

Per wariant:

| Pole | Co wpisac |
|------|-----------|
| **SKU** | Twoj wewnetrzny kod produktu (np. `PANDA-45`) |
| **Stock on hand** | Ile masz na stanie (np. `50`) |
| **Track inventory** | Wlacz jesli chcesz zeby Vendure pilnowal stanu |

Jesli stock spadnie do 0 — produkt pokaze "Niedostepny" w sklepie.

### 7. Kolekcje (opcjonalne)

Kolekcje = kategorie w sklepie (np. "Pluszaki", "Zabawki sensoryczne").

1. Catalog > Collections
2. Stworz kolekcje (jesli nie istnieje): nazwa, slug, zdjecie
3. Wroc do produktu > tab "Collections" > przypisz

### 8. Custom fields (opcjonalne)

| Pole | Co robi |
|------|---------|
| **shortDescription** | Krotki opis pod cena na karcie produktu (HTML) |
| **lowestPrice30d** | Najnizsza cena z 30 dni w groszach (Omnibus) |

### 9. Zapisz

Kliknij **Create** (lub **Update** jesli edytujesz).

Produkt jest od razu widoczny w sklepie pod `/produkty/<slug>`.

---

## Edycja istniejacego produktu

1. Catalog > Products > kliknij na produkt
2. Zmien co trzeba
3. Kliknij **Update**

Zmiany widoczne natychmiast.

## Usuwanie produktu

1. Catalog > Products > kliknij na produkt
2. Kliknij **Delete** (prawy gorny rog)

UWAGA: Jesli produkt ma custom strone (`src/pages/produkty/<slug>.astro`) — usun ja tez z repo.

---

## Typowe bledy

| Problem | Przyczyna | Rozwiazanie |
|---------|-----------|-------------|
| Produkt nie wyswietla sie | Nie przypisany do channela magicznazabawka | Sprawdz channel w prawym gornym rogu dashboardu |
| Cena wyglada dziwnie (np. 79 000 zl) | Wpisales zlotwki zamiast groszy | Cena w groszach: 7900 = 79 zl |
| Slug nie dziala | Spacje lub wielkie litery | Male litery, myslniki: `pluszak-panda` |
| Zdjecie nie laduje sie | Za duzy plik lub zly format | Max ~5MB, JPG/PNG/WebP |
| "Niedostepny" mimo ze jest na stanie | Stock = 0 lub tracking wlaczony z zerem | Ustaw stock on hand > 0 |

---

## Checklist nowego produktu

- [ ] Nazwa i slug ustawione
- [ ] Zdjecia wgrane (min 1, kwadratowe, 800x800+)
- [ ] Warianty stworzone
- [ ] Cena ustawiona (w GROSZACH!)
- [ ] SKU wpisany
- [ ] Stock ustawiony
- [ ] Channel: magicznazabawka
- [ ] Custom strona stworzona (jesli potrzebna) — `src/pages/produkty/<slug>.astro`
