# Changelog

## 1.0.0 - 2026-11-13

### Changes

- Update the card version to 1.0.0. Existing configuration options and supported
  sensor attributes remain compatible with 0.9.9.
- Review the English/German installation and configuration guides. Document the
  current statistic labels, exact playtime groups, account selection, and missing
  data; remove repeated development notes and obsolete version instructions.
- Give Paper Kingdom and Orbit Runner their own illustrations. Draw the rear
  half of Beyond the Blue's ring behind the planet.
- Regenerate all 96 gallery images, three overview images, and the player-statistics
  and data-freshness illustrations from the current card. Keep both languages and
  appearances consistent with the 1.0.0 documentation.

### Updating

- Replace the card file and reload the browser. For manual installations use
  `/local/steam-tracker-card.js?v=1.0.0` as a JavaScript module.
- Existing configurations remain valid. Integration 1.0.0 supplies all documented
  attributes; the compatibility table lists minimum versions for older sensors.

### Validation

- JavaScript syntax, all 21 logic tests, and browser checks passed for both
  languages, all views/layouts, mobile sizes, editor/account behavior, missing
  data, safe rendering, and cleanup. No external preview requests were made.
- Checked all 18 public Markdown files across both repositories: 520 local and
  cross-project links, 23 YAML blocks, and 22 card configurations. Both guides
  list all 17 supported configuration options.
- SVG files and PNG captures are valid. Verified the 192 gallery files and 11
  shared/special image copies across both repositories. Historical changelog
  entries and the 16 sensor JSON examples are unchanged.

## 0.9.9 - 2026-11-08

### Changes

- Display Steam's `Snooze` presence as "Idle" in English and "Inaktiv" in German
  for friends and profiles. Preserve the integration's raw `Snooze` sensor value
  and keep `Away` / "Abwesend" distinct.
- Shorten recent-game playtime rows, keeping lifetime hours and the two-week
  footer. Update library labels and swap played percentage with unplayed games.
- Arrange player-statistics tiles in four pairs and rename completion candidates
  to "Closest to 100%" / "Am nächsten dran an 100%". Keep English/German labels
  and documentation aligned; preserve single-line metrics and sensor contracts.
- Shorten completion-group labels and explain exact ranges with accessible
  tooltips. Retain all six distinct groups, including the under-100% group.
- Label average progress as "ø Achievement progress / game" and the overall
  percentage as "Unlocked achievements", with matching German labels and no
  explanatory subtitles. Add spacing above games without achievements.
- Include the full MIT license and existing copyright notice in the standalone
  JavaScript file, matching the repository's `LICENSE`.
- Link the license and document its inclusion in the English/German READMEs.

### Distribution

- Bump the source version and JavaScript banner to 0.9.9 alongside integration
  0.9.9. Commit and push source changes without publishing GitHub releases or assets.
- Refresh manual-installation cache examples to `?v=0.9.9`. Existing sensor
  contracts and the minimum integration version for each feature remain unchanged.

### Validation

- JavaScript syntax and all 21 logic tests passed. Browser checks passed for
  both languages, paired tile order, recent-game hours, six completion groups,
  mobile layouts, older/invalid data, safe rendering, and subscription cleanup.
- The embedded MIT text matches `LICENSE`; Git whitespace checks passed. Browser
  checks made no external requests. Integration Python code and tests are unchanged;
  Python syntax and integration/HACS JSON checks passed.

## 0.9.8 - 2026-11-06

### Changes

- Link both sensor references in the integration repository. Its documentation
  now replaces retired dashboards/third-party card examples with complete
  English/German sensor contracts and small companion-card configurations.
- Extend player statistics with overall achievement rate, locked achievements,
  six exact completion groups, a separate count of games without achievements,
  and up to five completion candidates. Consume new integration attributes with
  no Steam requests; preserve older sensors and original single-line metrics.
- Validate totals, distribution counts, and candidate records before rendering.
  Preserve zero values, use safe text and existing name actions, and provide
  German/English labels, fictional preview data, and compatibility documentation.

### Installation and update

- Install Steam Tracker Card 0.9.8 separately from integration 0.9.8 and reload
  the browser. Manual installations can use `/local/steam-tracker-card.js?v=0.9.8`
  as a JavaScript module to refresh the cache.
- The new player-statistics additions require integration 0.9.8. Existing card
  configurations, manual assignments, and older supported sensor data remain
  usable; single-line summaries retain their three original metrics.
- The integration's English/German sensor references replace the old complete
  dashboards and third-party card examples. The card needs no Steam API key.

### Validation

- JavaScript syntax and 21 logic tests passed, including missing/invalid totals,
  Python rounding ties, distribution consistency, and candidate validation.
- Playwright passed with both languages, three layouts, legacy/empty/unavailable
  data, mobile sizes, safe text, Steam links, sensor-detail actions, and cleanup.
- The matching integration passed 60 retained mocked tests after retiring the
  seven checks for removed YAML templates. Sensor request-budget checks remain;
  new reference examples and documentation links were validated separately.
  No external preview requests.
- New player statistics have not yet been installed in a live Home Assistant.

## 0.9.5 - 2026-11-05

### Changes

- Add full-library filters for played/unplayed games and exact lifetime-minute
  ranges. Search, sorting, and filtering work together in every layout. Save
  default library sorting/filtering in the editor; reset temporary choices when
  changing the account or manual sensor assignments.
- Add configurable game/friend name actions: **No action**, **Open Steam**, or
  **Sensor details**. Keep no action as the default, support keyboard navigation,
  restrict external links to Steam app/profile URLs, and preserve account isolation.
- Consume integration 0.9.5 `all_games` IDs/minutes without making Steam requests.
  Older/incomplete minute data disables range filtering and keeps all games
  visible; existing search/sort and sensor details remain usable.
- Add **Show data freshness** (`show_data_status`, off by default) for every view
  and layout. Display localized relative time and an absolute-time tooltip using
  only confirmed successful-fetch timestamps. Combined views use the oldest
  displayed source; missing/invalid/future/unavailable data hides the footer.
- Keep the integration's original summary timestamp on cache hits. Refresh relative
  text locally each minute and stop its timer when the card is removed.
- Correct the inclusive final library group to **At least 50 h** / **ab 50 h**.
  Tooltips and accessible labels explain 1–<10 h, 10–<50 h, and ≥50 h; exact-minute
  boundaries and counts are unchanged.
- Update English/German editor text and instructions, fictional preview data,
  library screenshots, the complete overview, and data-freshness documentation.

### Installation and update

- Install Steam Tracker Card 0.9.5 separately from integration 0.9.5 and reload
  the browser. Existing card configurations remain valid; name actions and the
  freshness footer are disabled by default.
- For manual installation, replace the JavaScript file and register
  `/local/steam-tracker-card.js?v=0.9.5` as a JavaScript module to refresh the cache.
- Integration 0.9.5 supplies the IDs, exact minutes, and successful-fetch times
  needed by the new library filters, full-library Steam links, and freshness footer.
  Older sensors keep their supported features without fabricated replacement data.
- The card never calls Steam and needs no API key or runtime dependencies.

### Validation

- JavaScript syntax and 18 logic tests passed.
- Playwright browser checks passed for German/English, all eight views and three
  layouts, older/empty/malformed/unavailable data, mobile, editor/account selection,
  exact-minute filters, secure links, keyboard actions, and untrusted text/URLs.
- Freshness checks cover source selection, all views/layouts, localization,
  ticking, reconnect, and timer cleanup. Registry subscriptions also clean up.
- Documentation links and Git whitespace checks passed. Preview images use
  fictional accounts/games and local artwork; no external preview requests occurred.
- Live Home Assistant frontend behavior and HACS installation remain unverified.

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
