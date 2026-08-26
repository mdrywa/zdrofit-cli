<div align="center">

<img src="assets/zdrofit-cli-banner.svg" alt="Zdrofit CLI" width="650">

### Book your Zdrofit classes without leaving the terminal.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](...)
[![Bun](https://img.shields.io/badge/Bun-Runtime-black?logo=bun)](...)
[![React](https://img.shields.io/badge/React-Ink-61DAFB?logo=react)](...)
[![License](https://img.shields.io/badge/license-MIT-green)](...)

</div>


# About

Zdrofit CLI is an unofficial interactive terminal client for browsing, 
booking and managing Zdrofit fitness classes.

It provides a fast keyboard-driven interface foir checking class schedules, 
managing reservations and working with multiple accounts without manually 
using the Zdrofit website.

## Preview

<p>
    
</p>

# Zdrofit CLI

Nieoficjalny, interaktywny klient terminalowy do obsługi konta [Zdrofit](https://zdrofit.pl). Pozwala sprawdzić grafik wybranego klubu oraz zapisywać się na zajęcia bez ręcznego przeglądania strony internetowej.

> [!WARNING]
> Projekt nie jest powiązany ze Zdrofit ani przez niego wspierany. Korzysta z aktualnej struktury strony zdrofit.pl, dlatego jej zmiany mogą czasowo zaburzyć działanie aplikacji.

## Możliwości

- obsługa wielu kont Zdrofit,
- wybór domyślnego klubu,
- przeglądanie grafiku według dnia,
- podgląd dostępności miejsc i statusu zajęć,
- zapisywanie się na zajęcia i anulowanie zapisów,
- lista zaplanowanych rezerwacji,
- bezpieczny zapis haseł i sesji w systemowym magazynie poświadczeń.

## Wymagania

- [Bun](https://bun.sh) — menedżer pakietów i środowisko uruchomieniowe,
- Node.js 22 lub nowszy dostępny jako `node` w zmiennej `PATH`,
- połączenie z internetem,
- istniejące konto Zdrofit.

Node.js jest potrzebny do uruchamiania procesu Playwright odpowiedzialnego za logowanie. Projekt był sprawdzany z Bun 1.3.14 oraz Node.js 22.

## Instalacja

Sklonuj repozytorium, przejdź do jego katalogu i zainstaluj zależności:

```bash
git clone https://github.com/1maciek90/zdrofit-cli.git
cd zdrofit-cli
bun install
bunx playwright install chromium
```

## Uruchomienie

```bash
bun run src/index.ts
```

## Pierwsze użycie

1. Otwórz ekran kont klawiszem `A` i dodaj dane istniejącego konta Zdrofit. Ta operacja nie tworzy nowego konta na stronie zdrofit.pl.
2. Wróć do menu głównego i naciśnij `R`, aby rozpocząć logowanie.
3. W otwartym oknie przeglądarki rozwiąż CAPTCHA, jeśli się pojawi, i zatwierdź logowanie. Okno zamknie się automatycznie po uzyskaniu sesji.
4. Klawiszem `C` wybierz klub.
5. Otwórz listę zajęć, wybierz termin strzałkami i zatwierdź rezerwację klawiszem `Enter`.

Aktualne podpowiedzi klawiszowe są zawsze widoczne na dole ekranu. Najczęściej używane klawisze to:

| Klawisz | Działanie |
| --- | --- |
| `↑` / `↓` | zmiana wybranej pozycji |
| `←` / `→` | zmiana dnia w grafiku |
| `Enter` | zatwierdzenie wyboru |
| `Esc` | powrót do poprzedniego ekranu |
| `A` | wybór konta |
| `C` | wybór klubu |
| `R` | odświeżenie sesji |
| `Q` | zamknięcie aplikacji |

## Dane i bezpieczeństwo

Hasła oraz identyfikatory sesji są przechowywane przez `Bun.secrets` w systemowym magazynie poświadczeń. Nie trafiają do plików konfiguracyjnych projektu.

Pozostałe dane aplikacji — profile kont bez haseł, wybrany klub i lokalna lista rezerwacji — są zapisywane w katalogu systemowym:

| System | Katalog |
| --- | --- |
| Windows | `%APPDATA%\zdrofit-cli` |
| macOS | `~/Library/Application Support/zdrofit-cli` |
| Linux | `$XDG_CONFIG_HOME/zdrofit-cli` lub `~/.config/zdrofit-cli` |

## Rozwój projektu

Kod jest napisany w TypeScript i React. Interfejs terminalowy wykorzystuje [Ink](https://github.com/vadimdemedes/ink), logowanie odbywa się przez [Playwright](https://playwright.dev), a dane z grafiku są przetwarzane za pomocą [Cheerio](https://cheerio.js.org).

Sprawdzenie typów:

```bash
bunx tsc --noEmit
```

Najważniejsze katalogi:

```text
src/
├── app/             # główna aplikacja i nawigacja
├── features/        # konta, kluby, zajęcia i rezerwacje
├── infrastructure/  # Playwright i zapis danych
├── shared/          # współdzielone komponenty interfejsu
└── zdrofit/         # adresy i stałe serwisu Zdrofit
```

## Status projektu

Projekt jest na wczesnym etapie rozwoju. Przed użyciem na głównym koncie warto samodzielnie przejrzeć kod, a problemy wynikające ze zmian na stronie Zdrofit zgłaszać w repozytorium.
