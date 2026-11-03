# Changelog

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
