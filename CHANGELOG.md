# Changelog

## 0.8.0 - 2026-11-04

### Changes

- Use view-specific heading icons for current game, recent games, library
  statistics, top-five games, friends, and the full library. Remove the repeated
  current-game label/icon below the artwork while preserving the idle content.
- Separate recent and top-five game entries with lines and align artwork with
  game titles at the top, including compact, single-line, and mobile layouts.
- Swap the played-games and top-five-share tiles. Shorten German/English
  distribution labels to under 10 h, under 50 h, and over 50 h without changing
  the underlying lifetime-minute groups.
- Add editor checkboxes for the upper-right account label (`show_username`) and
  the title/icon (`show_title`). Both default to visible; hiding a custom title
  preserves it for later use.
- Show the relative last-online time below the status of offline profiles in
  detailed and compact layouts when a valid `lastlogoff` timestamp is available.
  Refresh it every minute and stop the timer when the card is removed.
- Show “Playing: <game name>” / “Spielt: <Spielname>” in the same position for
  online players with a current game. Read the selected account's existing game
  sensor, react to game-only changes, and hide absent or unavailable game data.
- Change the XP label to “Progress to level” / “Fortschritt zu Level” and update
  English/German documentation and regression checks.
- Refresh detailed, compact, and single-line previews using fictional accounts
  and English labels.

### Installation and update

- Install this card separately from Steam Tracker 0.9.0 and reload the browser.
  Existing card configurations remain valid; both new heading options default
  to enabled. Custom titles remain editable and saved when hidden.
- For manual installation, replace `steam-tracker-card.js` and register
  `/local/steam-tracker-card.js?v=0.8.0` as a JavaScript module to refresh the cache.
- The card reads the existing status, profile, and current-game sensors for the
  profile details. Library additions require integration 0.7.1 or newer; older
  sensors retain the original library statistics. No new Steam requests or
  dependencies are introduced.
- Minimum supported Home Assistant version remains 2025.10.0.

### Validation

- JavaScript syntax check, card metadata JSON validation, 14 automated logic
  tests, and Git whitespace checks.
- Browser checks for all eight views, custom-title preservation, heading
  options, offline last-online time and timer cleanup, online game changes,
  account isolation, safe rendering, view icons, list separators/alignment,
  tile order, both languages, three layouts, and mobile sizes.
- No external requests were made by the preview. Installation through HACS and
  behavior in a live Home Assistant frontend remain to be verified.

## 0.7.2 - 2026-11-03

### Changes

- Extend library statistics with played percentage, played and unplayed game
  counts, and the top-five share of lifetime playtime.
- Add five playtime-distribution bars in detailed and compact layouts, with
  exact game counts and accessible progress labels. Keep the single-line
  summary's existing three primary metrics.
- Read the new attributes from Steam Tracker 0.7.1 without additional API
  calls or runtime dependencies. Older sensors retain the original statistics;
  missing or inconsistent distributions are hidden instead of fabricated.
- Update German and English labels and documentation, synthetic preview data,
  and browser regression checks. Existing card configurations remain valid.

### Installation and update

- Update Steam Tracker to 0.7.1 and restart Home Assistant to populate the new
  library attributes. Install this card release separately and reload the browser.
- For manual installation, replace `steam-tracker-card.js` and use the resource
  `/local/steam-tracker-card.js?v=0.7.2` as a JavaScript module to refresh the cache.
- For HACS, use the custom dashboard repository `lefidelity/steam-tracker-card`.
- Minimum supported Home Assistant version remains 2025.10.0.

### Validation

- JavaScript syntax check and 13 automated logic tests.
- Browser checks for new library metrics, distribution bars, German and English,
  zero and empty values, older sensor compatibility, malformed distributions,
  all layouts, mobile sizes, and existing views/editor behavior.
- No external requests were made by the preview. Installation through HACS and
  behavior in a live Home Assistant frontend remain to be verified.

## 0.7.0 - 2026-11-03

### Changes

- Add library statistics, player statistics, top-five games, friends, and full
  library views alongside profile, current game, and recently played.
- Make compact mode substantially smaller with thumbnails, tighter spacing,
  and horizontal profile and current-game summaries.
- Add a single-line layout: one row for summaries and one row per list entry.
- Add library search and sorting by name or hours, plus friend search and an
  online-only filter. Full lists are scrollable and are not truncated to the
  recent-games limit.
- Support all eight integration sensor roles in automatic discovery and manual
  assignments. Preserve account isolation and support renamed entity IDs.
- Update the German/English editor, documentation, synthetic preview, and layout
  screenshots. No additional runtime dependencies or Steam API calls are needed.

### Installation and update

- This is the first published card release. The version matches the companion
  integration's 0.7.0 release; the repositories remain independently installed.
- For HACS, use the custom dashboard repository `lefidelity/steam-tracker-card`.
- For manual installation, copy the release's `steam-tracker-card.js` to the
  Home Assistant `www` folder and register `/local/steam-tracker-card.js?v=0.7.0`
  as a JavaScript module. Reload the browser after updating.
- Existing profile, current-game, and recent-games configurations remain valid.
  Choose new views and layouts in the visual editor.

### Validation

- JavaScript syntax check and 13 automated logic tests.
- Browser regression checks for all eight views, compact/single-line sizes,
  mobile layouts, searching, sorting, filtering, the editor, manual assignments,
  multiple accounts, unavailable/empty data, zero values, safe rendering, and
  subscription cleanup. No external requests were made by the preview.
- The Home Assistant frontend, HACS installation, Sections, and Masonry still
  need verification in a live Home Assistant instance.
