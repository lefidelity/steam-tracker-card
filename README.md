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
| `library_stats` | Game count, hours, played percentage, unplayed games, top-five share, and playtime distribution |
| `player_stats` | Unlocked/possible achievements, perfect games, average completion, and badges |
| `top_games` | Up to five most-played games, hours, and optional achievement progress |
| `friends` | Friends, presence and current game; search and online-only filter |
| `games` | Complete library with hours; search and sorting by name or playtime |

With updated Steam Tracker sensor data, library statistics also show the played
percentage, played and unplayed game counts, and the top-five share of total time.
Detailed and compact layouts include five bars for unplayed games, played under
one hour, 1–<10 hours, 10–<50 hours, and 50 hours or more. Bars show the share of
the entire library, with the game count alongside. Exact Steam minutes determine
whether a game is unplayed; rounded hours are not used. Empty libraries show
zero values. Older sensors omit these additions until the integration is updated.
The single-line layout keeps its existing three primary metrics.
The shorter distribution labels are **Under 10 h**, **Under 50 h**, and
**At least 50 h**; the underlying groups remain 1–<10, 10–<50, and ≥50 hours.
Tooltips and accessible labels explain **1 to under 10 hours**, **10 to under
50 hours**, and **50 hours or more**. Exactly 50 hours belongs to the final group.
The top-five share tile appears next to played percentage, above played games.

View headings use a controller for the current game, a clock for recently played,
a chart for library statistics, a trophy for top-five games, people for friends,
and books for the full library. Current-game artwork leads directly into the
game name and playtime. Recently played and top-five lists have separators
between entries, with artwork aligned to the top of each game title.

Use a detailed, compact, or single-line layout, follow your Home Assistant theme, or enable
the optional Steam blue appearance. The card has **no runtime dependencies** and
does not require button-card, card-mod, or other custom cards.

![Eight Steam Tracker Card views in Steam blue, full layout, English, with fictional demo data](docs/preview.png)

[Visual guide: all eight views, appearances, languages, and layouts](docs/visual-guide.md).
Compare [Steam blue / English](docs/visual-guide/steam-en.md),
[Home Assistant theme / English](docs/visual-guide/theme-en.md),
[Steam blue / German](docs/visual-guide/steam-de.md), and
[Home Assistant theme / German](docs/visual-guide/theme-de.md).
The guide contains 96 individual images, with Full, Compact, and Single line
shown side by side for every view. Click a card image to open it at full resolution.

Compact mode uses small thumbnails, tighter spacing, and a horizontal profile and
current-game summary. Single-line mode reduces profiles, current games, and
statistics to one row; lists use one row per entry. It shows the three primary
statistics and omits XP details and achievement breakdowns. Friends and the full
library retain their search controls and scroll when long; neither list is
truncated to the recent-games limit. Temporary search, sorting, and filter choices
are local to the card; reloading restores the configured library defaults.

## Requirements

- Home Assistant 2025.10 or newer. Browser checks use a simulated HA host;
  installation in the actual Home Assistant frontend still needs verification.
- The [Steam Tracker integration](https://github.com/lefidelity/steam-tracker).
  Automatic account discovery uses its sensor unique IDs and account devices
  (integration 0.6.0 or later). Older registered sensors can also be
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
3. Add `/local/steam-tracker-card.js?v=0.9.5` as a **JavaScript module** under
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
visibility where applicable. Recent games adds a limit (1–5), sorting, and achievement visibility.
**Show username** controls the account label in the upper-right corner; the
player name in the profile remains visible. **Show title** controls the heading
and its icon independently. Hiding the title keeps your custom title saved.
Both options default to enabled; single-line layouts retain their hidden heading.
Top games also supports achievement visibility and always shows up to five games.
The integration currently supplies at most five recent games; sorting only applies
to that supplied list. “Steam order” preserves the API's order.

Offline profiles show **Last online …** directly below the presence status in
detailed and compact layouts, using the status sensor's `lastlogoff` timestamp.
The relative time refreshes every minute without Steam requests. Missing, invalid,
or future timestamps are hidden. Online profiles do not show a previous logout time.
When an online player is in a game, the same position shows **Playing: <game name>**
from that account's current-game sensor instead. This also covers active presence
states such as Away or Busy. Missing, unknown, unavailable, or idle game data hides
the line without affecting the rest of the profile; no extra Steam requests are needed.
The XP label reads **Progress to level …**.

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
| `view` | `profile` | `profile`, `current_game`, `recent_games`, `library_stats`, `player_stats`, `top_games`, `friends`, `games` |
| `account` | Automatic for one account | Account ID written by the visual editor |
| `title` | View title | Custom text |
| `show_title` | `true` | Boolean; hide the heading and icon while preserving `title` |
| `show_username` | `true` | Boolean; account label in the upper-right corner |
| `show_data_status` | `false` | Boolean; last successful fetch, available in every view and layout |
| `layout` | `detailed` | `detailed`, `compact`, `single_line` |
| `appearance` | `theme` | `theme`, `steam` |
| `language` | `auto` | `auto`, `de`, `en`; other HA languages fall back to English |
| `show_images` | `true` | Boolean |
| `show_achievements` | `true` | Boolean, recent and top games; hidden in single-line mode |
| `limit` | `3` | Integer, 1–5 recent games |
| `sort` | `recent` | `recent`, `playtime` (two weeks), `total` |
| `library_sort` | `hours` | `hours` (most played first), `name` (A–Z); full-library default |
| `library_filter` | `all` | `all`, `played`, `unplayed`, `under_1_hour`, `1_to_10_hours`, `10_to_50_hours`, `50_hours_or_more`; full-library default |
| `item_action` | `none` | `none`, `steam`, `more-info`; click a game or friend name |
| `entities` | Automatic | Overrides for `status`, `profile`, `game`, `recent_games`, `recent_achievements`, `playtime`, `global_stats`, `friends` |

All view values are listed in the views table above. For example, a compact
friends card and a single-line library summary:

```yaml
type: custom:steam-tracker-card
view: friends
layout: compact
```

```yaml
type: custom:steam-tracker-card
view: library_stats
layout: single_line
```

## Data freshness

In version 0.9.5, enable **Show data freshness** in the visual
editor, or add `show_data_status: true` to the card YAML. Every view and layout can
show a footer such as **Successfully updated 3 minutes ago**. Its tooltip gives
the absolute date/time. Relative text refreshes locally each minute, with no
Steam requests, and stops updating when the card is removed.

This requires the `last_successful_update` attribute from integration 0.9.5
or newer. The timestamp records a successful,
validated sensor fetch, including unchanged values and confirmed empty results.
It does not use Home Assistant's `last_changed` or `last_updated`.
The integration's 15-second player-summary cache keeps the original fetch time
for status and current game. A cache hit does not advance the footer timestamp.

When a view combines sensors, the footer uses the oldest successful timestamp
of the displayed sources. Profiles include status and level, plus the game
when playing is shown; recent games include achievements when displayed.
If any participating source lacks a valid timestamp or is unknown/unavailable,
the footer stays hidden. Older sensors remain usable with no footer.
The checkbox is off by default. Update both integration and card to use it.

![Optional data freshness with fictional player statistics](docs/images/data-status.png)

## Library filters and name click actions

These options are available from card 0.9.5. For **All games**,
choose **Default library sort** and **Default library filter** in the editor.
The card's search, sort selector, and playtime filter work together in all layouts.
Runtime choices last until reload; editor defaults remain saved in the card YAML.
Changing the account or manual sensor assignment resets temporary choices.

Filters use exact lifetime minutes: unplayed is 0; played is at least 1; the
range groups are 1–59, 60–599, 600–2999, and at least 3000 minutes. A one-minute
session counts as played even when the displayed hours are `0.0`.

For current, recent, top-five and full-library games, and for friends, choose
**Name click action**: **No action**, **Open Steam**, or **Sensor details**.
Game names open the Steam store; friend names open their Steam Community profile.
Steam links open a new tab. Sensor details opens the current-game, recent-games,
playtime, or friends sensor of the configured account, including manual assignments.
Names support keyboard navigation when an action is available.

Full-library Steam links require `appid` and playtime filters require
`playtime_minutes` on every `all_games` entry. Both fields require integration
0.9.5 or newer. Update the integration and card together to use them. With older or incomplete data, the filter is
disabled and all games stay visible; searching, sorting and sensor details still
work. Missing game IDs or valid profile links keep the name readable without
opening an external page.

```yaml
type: custom:steam-tracker-card
view: games
library_sort: name
library_filter: unplayed
item_action: steam
```

```yaml
type: custom:steam-tracker-card
view: friends
item_action: more-info
```

## Data states and privacy

- Missing sensors, `unknown`, and `unavailable` have distinct messages.
- Profile status and level are independent: the visible part remains useful when
  the other sensor is unavailable.
- “No game”, an empty library, and empty recent/friends lists are normal empty states.
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
Steam requests. Try light/dark, Steam blue, all three layouts, all eight views, both languages,
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

For live verification, test in Home Assistant with real account devices, editor saving
and reloading, renamed entities, restricted users, integration reload, multiple
accounts, Sections and Masonry dashboards, and mobile layout. No authenticated
Steam requests were made during development.

## Project naming and releases

The product and repository are named **Steam Tracker Card** and `steam-tracker-card`.
HACS is an installation method, not a required name prefix.

Integration and card are separate repositories with independent versions:
`steam-tracker` and `steam-tracker-card`. The integration repository is
`lefidelity/steam-tracker`. Its Home Assistant domain remains `steam_tracker`; removing the repository
prefix does not require changes to sensor IDs or attributes.

The card repository is [lefidelity/steam-tracker-card](https://github.com/lefidelity/steam-tracker-card).
Integration 0.9.5 and card 0.9.5 are installed and updated separately.
Version 0.9.5 is distributed as a standalone JavaScript release asset. HACS
installation and Home Assistant frontend checks remain pending. The matching
`dist/steam-tracker-card.js` and `hacs.json` use the card's
repository layout. No CI or publishing configuration is included.

MIT licensed. Not affiliated with Valve, Steam, Home Assistant, or HACS.
