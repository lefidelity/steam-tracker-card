# Steam Tracker Card

A configurable Home Assistant dashboard card for **Steam Tracker**. Add a card,
choose your Steam account and a view, and combine several cards into your own
dashboard. Includes a visual editor, English and German, and light/dark theme support.

[Deutsche Anleitung](docs/README_de.md)

## Views

| View | Content |
| --- | --- |
| `profile` | Avatar, player name, presence, level, and XP progress |
| `current_game` | Game artwork, title, and total playtime |
| `recent_games` | Games played in the last two weeks, hours, and optional achievement progress |

Use a detailed or compact layout, follow your Home Assistant theme, or enable
the optional Steam blue appearance. The card has **no runtime dependencies** and
does not require button-card, card-mod, or other custom cards.

![Three Steam Tracker Card views with fictional demo data](docs/preview.png)

## Requirements

- Home Assistant 2025.10 or newer. Actual Home Assistant runtime verification is
  still required before the first release; browser checks use a simulated HA host.
- The [Steam Tracker integration](https://github.com/lefidelity/steam-tracker).
  Automatic account discovery uses its sensor unique IDs and account devices
  (integration commit `89b2fb8` or later). Older registered sensors can also be
  grouped by configuration entry; legacy YAML sensors can be assigned manually.
- Steam data must be accessible to the integration. This card does not fix API
  credentials or private profiles, and does not call the Steam API itself.

## Installation

The repository is [lefidelity/steam-tracker-card](https://github.com/lefidelity/steam-tracker-card).
It is not yet a default HACS entry; HACS validation and tests in a real Home
Assistant instance are still pending.

### HACS

1. Add `https://github.com/lefidelity/steam-tracker-card` as a custom repository
   in HACS, with type **Dashboard**.
2. Download the card.
3. Check **Settings → Dashboards → Resources** (advanced mode may be needed).
   If HACS has not registered it, add `/hacsfiles/steam-tracker-card/steam-tracker-card.js`
   as a **JavaScript module**.
4. Reload your browser and add **Steam Tracker Card** to a dashboard.

[![Open Steam Tracker Card in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=lefidelity&repository=steam-tracker-card&category=plugin)

### Manual

1. Copy `dist/steam-tracker-card.js` to
   `<HA configuration>/www/steam-tracker-card.js`.
2. If `www` was just created, restart Home Assistant.
3. Add `/local/steam-tracker-card.js?v=0.1.0` as a **JavaScript module** under
   **Settings → Dashboards → Resources**.
4. Reload the browser, then select **Steam Tracker Card** in the card picker.

Only register one resource for the card. After updating manually, change the
URL's version parameter and reload the browser to avoid stale cached code.

## Configure in the visual editor

Select your **Steam account** and **view**. With exactly one discoverable account,
automatic selection works without further configuration. With multiple accounts,
choose one explicitly; the card never silently selects a different account.
Account discovery handles renamed entity IDs. When duplicate account names are
confusing, rename the account device in Home Assistant.

The editor also provides a custom title, layout, appearance, language, and image
visibility. Recent games adds a limit (1–5), sorting, and achievement visibility.
The integration currently supplies at most five recent games; sorting only applies
to that supplied list. “Steam order” preserves the API's order.

If discovery is unavailable or you use legacy YAML sensors, open **Manual sensor
assignment** in the editor. Manual assignments override automatic assignments.
Unassigned optional data stays unknown; it is never substituted with zero.

Optional YAML configuration:

```yaml
type: custom:steam-tracker-card
view: profile
# account: <account device ID selected by the editor>
appearance: steam
layout: detailed
```

```yaml
type: custom:steam-tracker-card
view: recent_games
limit: 3
sort: playtime
show_achievements: true
entities:
  recent_games: sensor.steam_tracker_recent
  recent_achievements: sensor.steam_tracker_recent_achievements
```

| Option | Default | Values |
| --- | --- | --- |
| `view` | `profile` | `profile`, `current_game`, `recent_games` |
| `account` | Automatic for one account | Account ID written by the visual editor |
| `title` | View title | Custom text |
| `layout` | `detailed` | `detailed`, `compact` |
| `appearance` | `theme` | `theme`, `steam` |
| `language` | `auto` | `auto`, `de`, `en`; other HA languages fall back to English |
| `show_images` | `true` | Boolean |
| `show_achievements` | `true` | Boolean, recent games only |
| `limit` | `3` | Integer, 1–5 recent games |
| `sort` | `recent` | `recent`, `playtime` (two weeks), `total` |
| `entities` | Automatic | Overrides for `status`, `profile`, `game`, `recent_games`, `recent_achievements` |

## Data states and privacy

- Missing sensors, `unknown`, and `unavailable` have distinct messages.
- Profile status and level are independent: the visible part remains useful when
  the other sensor is unavailable.
- “No game” and an empty recent list are normal empty states.
- A genuine level 0, 0 hours, or 0% achievement progress is displayed as zero.
- Unknown achievement counts stay unknown; confirmed games without achievements
  have a separate message.
- Game artwork and avatars load from URLs supplied by the integration. In normal
  use this contacts Steam's image CDN from your browser. Images use no-referrer.
- The card does not need, store, or transmit a Steam API key. Account discovery
  reads Home Assistant's entity and device registries via its existing session.
  If the current user cannot read these, use manual sensor assignments.

## Local preview and checks

No build step or dependency installation is needed to use the card. The file in
`dist/` is both the source and the distributable JavaScript module.

From the repository directory, start a server bound to your own machine:

```console
python -m http.server 8129 --bind 127.0.0.1
```

Open `http://127.0.0.1:8129/preview/index.html`. The interactive preview includes
the real card and editor, synthetic accounts, and local SVG artwork. It makes no
Steam requests. Try light/dark, Steam blue, compact layout, both languages,
private/unavailable data, and multiple accounts.

Run the dependency-free checks with Node.js 20 or newer:

```console
node --check dist/steam-tracker-card.js
node --test tests/card.test.mjs
```

An optional browser regression check uses Playwright and either its installed
Chromium or an existing Chrome/Edge executable. Playwright is a development-only
dependency; install it in your preferred development environment, then run:

```console
node tests/browser.mjs
```

It can instead load an external Playwright installation using `--playwright
<path-to-playwright/index.mjs>`, select a browser using `--browser <executable>`,
and save the preview using `--screenshot docs/preview.png`. The browser check starts
and stops its own local HTTP server.

Before release, test in Home Assistant with real account devices, editor saving
and reloading, renamed entities, restricted users, integration reload, multiple
accounts, Sections and Masonry dashboards, and mobile layout. No authenticated
Steam requests were made during development.

## Project naming and release preparation

The product and repository are named **Steam Tracker Card** and `steam-tracker-card`.
HACS is an installation method, not a required name prefix.

Integration and card are separate repositories with independent versions:
`steam-tracker` and `steam-tracker-card`. The integration repository is
`lefidelity/steam-tracker`. There are no existing installations to migrate.
Its Home Assistant domain remains `steam_tracker`; removing the repository
prefix does not require changes to sensor IDs or attributes.

The card repository is [lefidelity/steam-tracker-card](https://github.com/lefidelity/steam-tracker-card).
Before the first release, complete HACS validation and Home Assistant runtime
checks. The matching `dist/steam-tracker-card.js` and `hacs.json` use the card's
repository layout. No CI or publishing configuration is included.

MIT licensed. Not affiliated with Valve, Steam, Home Assistant, or HACS.
