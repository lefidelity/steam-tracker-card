import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const { values } = parseArgs({ options: {
  playwright: { type: "string" }, browser: { type: "string" }, screenshot: { type: "string" },
} });
const { chromium } = await import(values.playwright ? pathToFileURL(resolve(values.playwright)).href : "playwright");
const root = fileURLToPath(new URL("../", import.meta.url));
const types = { ".html": "text/html", ".js": "text/javascript", ".svg": "image/svg+xml" };
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const path = resolve(root, `.${pathname}`);
  if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const content = await readFile(path);
    response.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream" });
    response.end(content);
  } catch { response.writeHead(404).end(); }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(values.browser ? { executablePath: values.browser } : {}) });
  const page = await browser.newPage({ viewport: { width: 1240, height: 1000 }, deviceScaleFactor: 1 });
  await page.clock.install({ time: new Date("2026-11-04T12:00:00Z") });
  await page.clock.pauseAt(new Date("2026-11-04T12:00:01Z"));
  const errors = [];
  const externalRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:")) externalRequests.push(request.url());
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/preview/index.html`);
  const profile = page.locator("#profile");
  const current = page.locator("#current_game");
  const recent = page.locator("#recent_games");
  const text = async (locator) => locator.locator("ha-card").innerText();
  const checkGameRows = async (card) => {
    const rows = await card.locator(".games .game-row").evaluateAll((rows) => rows.map((row) => ({
      border: getComputedStyle(row).borderTopWidth,
      imageTop: row.querySelector(".game-art")?.getBoundingClientRect().top,
      titleTop: row.querySelector("h3").getBoundingClientRect().top,
    })));
    assert.ok(rows.length > 1);
    rows.forEach((row, index) => {
      assert.equal(row.border, index ? "1px" : "0px");
      if (row.imageTop !== undefined) assert.ok(Math.abs(row.imageTop - row.titleTop) < 1, "Game image and title must align at the top");
    });
  };
  await profile.getByText("Player One", { exact: true }).waitFor();
  assert.match(await text(current), /Beyond the Blue/);
  assert.equal(await current.locator(".game-kicker").count(), 0);
  assert.equal(await current.locator(".heading svg path").getAttribute("d"),
    await current.locator(".hero > svg path").getAttribute("d"));
  const steamPath = await profile.locator(".heading svg path").getAttribute("d");
  const headingPaths = [];
  for (const id of ["current_game", "recent_games", "library_stats", "top_games", "friends", "games"]) {
    const path = await page.locator(`#${id}`).locator(".heading svg path").getAttribute("d");
    assert.notEqual(path, steamPath);
    headingPaths.push(path);
  }
  assert.equal(new Set(headingPaths).size, 6);
  assert.match(await text(recent), /The Last Outpost/);
  assert.match(await text(recent), /0 \/ 24/);
  assert.match(await text(recent), /Keine Erfolge vorhanden/);
  assert.equal(await profile.locator('[role="progressbar"]').getAttribute("aria-valuenow"), "40");
  assert.match(await text(profile), /Fortschritt zu Level 25/);
  assert.equal(await profile.locator(".last-online").count(), 0);
  assert.equal(await profile.locator(".playing").innerText(), "Spielt: Beyond the Blue");
  assert.equal(await profile.evaluate((node) => node.shadowRoot.querySelector(".playing").previousElementSibling.classList.contains("status")), true);
  await profile.evaluate((node) => { window.profileHass = node._hass; });
  const setPresence = async (state, lastlogoff) => profile.evaluate((node, { state, lastlogoff }) => {
    node.hass = { ...window.profileHass, states: { ...window.profileHass.states,
      "sensor.demo_presence": { state, attributes: {
        ...window.profileHass.states["sensor.demo_presence"].attributes, lastlogoff,
      } },
    } };
  }, { state, lastlogoff });
  const now = await page.evaluate(() => Math.floor(Date.now() / 1000));
  await setPresence("Offline", now - 59);
  assert.equal(await profile.locator(".playing").count(), 0);
  assert.equal(await profile.locator(".last-online").innerText(), "Zuletzt online gerade eben");
  assert.equal(await profile.evaluate((node) => node.shadowRoot.querySelector(".last-online").previousElementSibling.classList.contains("status")), true);
  await page.clock.fastForward(60000);
  assert.equal(await profile.locator(".last-online").innerText(), "Zuletzt online vor 1 Minute");
  await profile.evaluate((node) => {
    window.lastSeen = node.shadowRoot.querySelector(".last-online");
    window.offlineCard = node;
    window.offlineParent = node.parentNode;
    window.offlineNext = node.nextSibling;
    node.remove();
  });
  await page.clock.fastForward(120000);
  assert.equal(await page.evaluate(() => window.lastSeen.textContent), "Zuletzt online vor 1 Minute");
  await page.evaluate(() => window.offlineParent.insertBefore(window.offlineCard, window.offlineNext));
  assert.equal(await profile.locator(".last-online").innerText(), "Zuletzt online vor 3 Minuten");
  await page.clock.fastForward(60000);
  assert.equal(await profile.locator(".last-online").innerText(), "Zuletzt online vor 4 Minuten");
  for (const layout of ["compact", "detailed"]) {
    await profile.evaluate((node, layout) => node.setConfig({ ...node._config, layout }), layout);
    assert.equal(await profile.locator(".last-online").isVisible(), true);
  }
  await profile.evaluate((node) => node.setConfig({ ...node._config, language: "en" }));
  assert.match(await text(profile), /Last online 4 minutes ago/);
  assert.match(await text(profile), /Progress to level 25/);
  await profile.evaluate((node) => node.setConfig({ ...node._config, layout: "single_line" }));
  assert.equal(await profile.locator(".last-online").count(), 0);
  await profile.evaluate((node) => node.setConfig({ ...node._config, language: "de", layout: "detailed" }));
  for (const timestamp of [undefined, null, 0, -1, "invalid", "1800000000", true, now + 86400]) {
    await setPresence("Offline", timestamp);
    assert.equal(await profile.locator(".last-online").count(), 0);
  }
  for (const state of ["Online", "Busy", "Away", "Unknown", "unknown", "unavailable"]) {
    await setPresence(state, now - 7200);
    assert.equal(await profile.locator(".last-online").count(), 0);
    assert.equal(await profile.locator(".playing").count(), ["Online", "Busy", "Away"].includes(state) ? 1 : 0);
  }
  await setPresence("Online", now - 7200);
  const setGame = async (game) => profile.evaluate((node, game) => {
    const states = { ...node._hass.states };
    if (game) states["sensor.demo_current"] = game;
    else delete states["sensor.demo_current"];
    node.hass = { ...node._hass, states };
  }, game);
  await setGame({ state: "A new game", attributes: { name: "Different game name" } });
  assert.equal(await profile.locator(".playing").innerText(), "Spielt: Different game name");
  for (const layout of ["compact", "detailed"]) {
    await profile.evaluate((node, layout) => node.setConfig({ ...node._config, layout }), layout);
    assert.equal(await profile.locator(".playing").isVisible(), true);
  }
  await profile.evaluate((node) => node.setConfig({ ...node._config, language: "en" }));
  assert.equal(await profile.locator(".playing").innerText(), "Playing: Different game name");
  await profile.evaluate((node) => node.setConfig({ ...node._config, layout: "single_line" }));
  assert.equal(await profile.locator(".playing").count(), 0);
  await profile.evaluate((node) => node.setConfig({ ...node._config, language: "de", layout: "detailed" }));
  await setGame({ state: "State name fallback", attributes: {} });
  assert.equal(await profile.locator(".playing").innerText(), "Spielt: State name fallback");
  await setGame({ state: "Safe game", attributes: { name: '<img src=x onerror="window.injected=true">' } });
  assert.equal(await profile.locator(".playing").textContent(), 'Spielt: <img src=x onerror="window.injected=true">');
  assert.equal(await profile.locator(".playing img").count(), 0);
  assert.equal(await page.evaluate(() => window.injected), undefined);
  for (const game of [null, { state: "none", attributes: { name: "Stale game" } },
    { state: "unknown", attributes: {} }, { state: "unavailable", attributes: {} },
    { state: "", attributes: {} }]) {
    await setGame(game);
    assert.equal(await profile.locator(".playing").count(), 0);
    assert.equal(await profile.locator(".last-online").count(), 0);
    assert.match(await text(profile), /Player One/);
    assert.match(await text(profile), /Fortschritt zu Level 25/);
  }
  await profile.evaluate((node) => { node.hass = window.profileHass; });
  await page.clock.resume();
  console.log("PASS: last-online localization, placement, ticking, invalid data and timer cleanup/reconnect");
  console.log("PASS: online game display, game-only updates, both languages, idle/missing data and safe text");
  const friends = page.locator("#friends");
  const games = page.locator("#games");
  const top = page.locator("#top_games");
  assert.equal(await top.locator('.game-row').count(), 5);
  for (const card of [recent, top]) {
    await checkGameRows(card);
    await card.evaluate((node) => node.setConfig({ ...node._config, show_images: false }));
    assert.equal(await card.locator(".game-art").count(), 0);
    await checkGameRows(card);
    await card.evaluate((node) => node.setConfig({ ...node._config, show_images: true }));
  }
  assert.match(await text(top), /Erfolgsdaten nicht verfügbar/);
  const library = page.locator("#library_stats");
  assert.match(await text(library), /337,8/);
  assert.match(await text(library), /Spielquote/);
  assert.match(await text(library), /85,7 %/);
  assert.match(await text(library), /Ungespielte Spiele/);
  assert.match(await text(library), /99,9 %/);
  assert.equal(await library.locator(".stat").count(), 8);
  assert.deepEqual(await library.locator(".stat-label").allTextContents(), [
    "Spiele", "Gesamtspielzeit", "Unter 1 Stunde", "Top-5-Spielzeit", "Spielquote",
    "Top-5-Anteil", "Ungespielte Spiele", "Gespielte Spiele",
  ]);
  assert.deepEqual(await library.locator(".distribution-label").allTextContents(), [
    "Ungespielt", "Gespielt unter 1 h", "unter 10 h", "unter 50 h", "ab 50 h",
  ]);
  assert.deepEqual((await library.locator(".distribution-label").evaluateAll((labels) => labels.map((label) => label.title))).slice(2), [
    "1 bis unter 10 Stunden", "10 bis unter 50 Stunden", "50 Stunden oder mehr",
  ]);
  await library.locator(".distribution-label").nth(2).focus();
  assert.equal(await library.locator(".distribution-label").nth(2).getAttribute("aria-label"), "1 bis unter 10 Stunden");
  assert.equal(await library.locator('.stat[aria-label="Gespielte Spiele: 6"]').count(), 1);
  assert.equal(await library.locator('.distribution [role="progressbar"]').count(), 5);
  assert.deepEqual(await library.locator(".distribution-count").allTextContents(), ["1", "1", "0", "3", "2"]);
  assert.deepEqual(await library.locator('.distribution [role="progressbar"]').evaluateAll(
    (bars) => bars.map((bar) => bar.getAttribute("aria-valuenow"))), ["14", "14", "0", "43", "29"]);
  await library.evaluate((node) => {
    window.libraryHass = node._hass;
    const attributes = { ...node._hass.states["sensor.demo_playtime"].attributes };
    for (const key of ["played_percentage", "played_game_count", "unplayed_game_count", "top_5_playtime_percentage", "playtime_distribution"]) delete attributes[key];
    node.hass = { ...node._hass, states: { ...node._hass.states,
      "sensor.demo_playtime": { state: "337.8", attributes } } };
  });
  assert.equal(await library.locator(".stat").count(), 4);
  assert.equal(await library.locator(".distribution").count(), 0);
  assert.doesNotMatch(await text(library), /Spielquote|Ungespielte Spiele/);
  for (const distribution of [{}, { unplayed: -1 }, { unplayed: 7 }]) {
    await library.evaluate((node, distribution) => {
      node.hass = { ...window.libraryHass, states: { ...window.libraryHass.states,
        "sensor.demo_playtime": { state: "337.8", attributes: {
          ...window.libraryHass.states["sensor.demo_playtime"].attributes,
          playtime_distribution: distribution,
        } } } };
    }, distribution);
    assert.equal(await library.locator(".distribution").count(), 0);
  }
  await library.evaluate((node) => {
    node.hass = window.libraryHass;
    node.setConfig({ ...node._config, language: "en" });
  });
  assert.match(await text(library), /Played library/);
  assert.match(await text(library), /Playtime distribution/);
  assert.deepEqual((await library.locator(".distribution-label").allTextContents()).slice(2), [
    "Under 10 h", "Under 50 h", "At least 50 h",
  ]);
  assert.deepEqual((await library.locator(".distribution-label").evaluateAll((labels) => labels.map((label) => label.title))).slice(2), [
    "1 to under 10 hours", "10 to under 50 hours", "50 hours or more",
  ]);
  await library.evaluate((node) => node.setConfig({ ...node._config, language: "de" }));
  console.log("PASS: new library metrics, five distribution bars, both languages and older sensor compatibility");
  assert.match(await text(page.locator("#player_stats")), /Perfekte Spiele/);
  assert.equal(await games.locator('.game-row').count(), 7);
  await games.getByRole("searchbox").fill("uncharted");
  assert.equal(await games.locator('.game-row').count(), 1);
  assert.match(await text(games), /0 h/);
  await games.getByRole("searchbox").fill("nothing matches");
  assert.match(await text(games), /Keine passenden Ergebnisse/);
  await games.getByRole("searchbox").fill("");
  await games.locator('[data-control="library_sort"]').selectOption("name");
  assert.equal(await games.locator("h3").first().innerText(), "Beyond the Blue");
  await friends.locator("select").selectOption("online");
  assert.equal(await friends.locator('.game-row').count(), 2);
  assert.doesNotMatch(await text(friends), /Morgan/);
  await friends.locator("select").selectOption("all");
  await friends.getByRole("searchbox").fill("Morgan");
  assert.match(await text(friends), /Offline/);
  await friends.getByRole("searchbox").fill("");
  const playtimeFilter = games.locator('[data-control="library_filter"]');
  for (const [filter, count] of [["played", 6], ["unplayed", 1], ["under_1_hour", 1],
    ["1_to_10_hours", 0], ["10_to_50_hours", 3], ["50_hours_or_more", 2]]) {
    await playtimeFilter.selectOption(filter);
    assert.equal(await games.locator(".game-row").count(), count);
  }
  await playtimeFilter.selectOption("unplayed");
  await games.getByRole("searchbox").fill("uncharted");
  assert.equal(await games.locator(".game-row").count(), 1);
  await games.getByRole("searchbox").fill("beyond");
  assert.match(await text(games), /Keine passenden Ergebnisse/);
  await games.getByRole("searchbox").fill("");
  await games.evaluate((node) => {
    window.gamesHass = node._hass;
    window.gamesConfig = node._config;
    node.setConfig({ ...node._config, library_sort: "name", library_filter: "unplayed" });
    node.hass = { ...node._hass, states: { ...node._hass.states,
      "sensor.demo_playtime": { state: "0", attributes: { all_games: [
        { appid: 1, name: "Untouched", hours: 0, playtime_minutes: 0 },
        { appid: 2, name: "One minute", hours: 0, playtime_minutes: 1 },
        { appid: 3, name: "Two minutes", hours: 0, playtime_minutes: 2 },
      ] } },
    } };
  });
  assert.equal(await games.locator("h3").innerText(), "Untouched");
  await playtimeFilter.selectOption("played");
  assert.deepEqual(await games.locator("h3").allTextContents(), ["One minute", "Two minutes"]);
  await games.evaluate((node) => node.setConfig(JSON.parse(JSON.stringify(node._config))));
  assert.equal(await playtimeFilter.inputValue(), "played");
  await games.evaluate((node) => {
    const restored = document.createElement("steam-tracker-card");
    restored.id = "restored-library";
    restored.setConfig(JSON.parse(JSON.stringify(node._config)));
    restored.hass = node._hass;
    document.body.append(restored);
  });
  const restoredLibrary = page.locator("#restored-library");
  await restoredLibrary.getByText("Untouched", { exact: true }).waitFor();
  assert.equal(await restoredLibrary.locator('[data-control="library_sort"]').inputValue(), "name");
  assert.equal(await restoredLibrary.locator('[data-control="library_filter"]').inputValue(), "unplayed");
  await restoredLibrary.evaluate((node) => node.remove());
  await games.evaluate((node) => node.setConfig({ ...node._config, library_filter: "played" }));
  await games.evaluate((node) => {
    const legacy = window.gamesHass.states["sensor.demo_playtime"].attributes.all_games.map(({ name, hours }) => ({ name, hours }));
    node.hass = { ...window.gamesHass, states: { ...window.gamesHass.states,
      "sensor.demo_playtime": { state: "337.8", attributes: { all_games: legacy } },
    } };
    node.setConfig({ ...node._config, item_action: "steam" });
  });
  assert.equal(await playtimeFilter.isDisabled(), true);
  assert.equal(await games.locator(".game-row").count(), 7);
  assert.match(await text(games), /Alle Spiele werden angezeigt/);
  assert.equal(await games.locator("a.item-action").count(), 0);
  await games.evaluate((node) => {
    node.setConfig(window.gamesConfig);
    node.hass = window.gamesHass;
  });
  assert.equal(await playtimeFilter.isEnabled(), true);
  assert.equal(await playtimeFilter.inputValue(), "all");
  console.log("PASS: exact-minute library filters, search composition, saved defaults and legacy fallback");

  for (const [card, entityId] of [[current, "sensor.demo_current"], [recent, "sensor.demo_recent"],
    [top, "sensor.demo_playtime"], [friends, "sensor.demo_friends"], [games, "sensor.demo_playtime"]]) {
    await card.evaluate((node) => {
      node._testConfig = node._config;
      node.setConfig({ ...node._config, item_action: "steam" });
      node.shadowRoot.addEventListener("click", (event) => {
        const link = event.target.closest?.("a.item-action");
        if (link) { event.preventDefault(); window.clickedItemUrl = link.href; }
      }, { capture: true });
      node.addEventListener("hass-more-info", (event) => { window.moreInfoEvent = { ...event.detail, bubbles: event.bubbles, composed: event.composed }; });
    });
    const link = card.locator("a.item-action").first();
    const href = await link.getAttribute("href");
    assert.ok(href.startsWith(card === friends ? "https://steamcommunity.com/id/fictional-" : "https://store.steampowered.com/app/"));
    assert.equal(await link.getAttribute("target"), "_blank");
    assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
    await link.click();
    assert.equal(await page.evaluate(() => window.clickedItemUrl), href);
    await card.evaluate((node) => node.setConfig({ ...node._config, language: "en" }));
    assert.equal(await card.locator("a.item-action").first().getAttribute("title"), "Open Steam");
    await card.evaluate((node) => node.setConfig({ ...node._config, item_action: "more-info" }));
    await card.locator("button.item-action").first().press("Enter");
    assert.deepEqual(await page.evaluate(() => window.moreInfoEvent), { entityId, bubbles: true, composed: true });
    await card.evaluate((node) => node.setConfig(node._testConfig));
    assert.equal(await card.locator(".item-action").count(), 0);
  }
  console.log("PASS: Steam links and keyboard-accessible sensor actions in all five views and both languages");
  console.log("PASS: eight views, five top games, full library, search, sorting, friend filtering and zero values");
  const detailedHeight = await current.evaluate((node) => node.getBoundingClientRect().height);
  await page.locator("#compact").click();
  for (const card of [recent, top]) await checkGameRows(card);
  if (values.screenshot) await page.screenshot({ path: values.screenshot.replace(/(\.[^.]+)$/, "-compact$1"), fullPage: true });
  const compactHeight = await current.evaluate((node) => node.getBoundingClientRect().height);
  assert.ok(compactHeight < detailedHeight * 0.6, `Compact height ${compactHeight} versus detailed ${detailedHeight}`);
  await page.locator("#single_line").click();
  for (const card of [recent, top]) await checkGameRows(card);
  if (values.screenshot) await page.screenshot({ path: values.screenshot.replace(/(\.[^.]+)$/, "-single-line$1"), fullPage: true });
  for (const card of [profile, current, page.locator("#library_stats"), page.locator("#player_stats")]) {
    assert.ok(await card.evaluate((node) => node.getBoundingClientRect().height) <= 55, "Single-line card exceeds one row");
  }
  assert.equal(await library.locator(".stat").count(), 3);
  assert.equal(await library.locator(".distribution").count(), 0);
  const rowHeights = await recent.locator(".game-row").evaluateAll((rows) => rows.map((row) => row.getBoundingClientRect().height));
  assert.ok(rowHeights.every((height) => height <= 40));
  await page.locator("#single_line").click();
  console.log("PASS: compact mode is substantially smaller; single-line summaries and list rows fit one line");
  console.log("PASS: view icons, current-game heading, list separators/alignment, tile order and distribution labels");
  if (values.screenshot) await page.screenshot({ path: values.screenshot, fullPage: true });

  await page.evaluate(() => {
    const card = document.querySelector("#profile");
    window.originalBody = card.shadowRoot.querySelector(".body");
    card.hass = { ...card._hass, states: { ...card._hass.states, "sensor.unrelated": { state: "1", attributes: {} } } };
  });
  assert.equal(await page.evaluate(() => window.originalBody === document.querySelector("#profile").shadowRoot.querySelector(".body")), true);
  console.log("PASS: unrelated HA state changes do not rebuild the card");

  await page.locator("#scenario").selectOption("empty");
  await current.getByText("Zeit für eine Pause", { exact: true }).waitFor();
  assert.match(await text(current), /Aktuell wird kein Spiel gespielt\./);
  assert.equal(await current.locator(".hero,.current-summary").count(), 0);
  assert.equal(await current.locator(".empty-icon svg path").getAttribute("d"),
    await current.locator(".heading svg path").getAttribute("d"));
  assert.match(await text(recent), /Eine ruhige Zeit/);
  assert.match(await text(top), /Deine Bibliothek ist leer/);
  assert.match(await text(games), /Deine Bibliothek ist leer/);
  assert.match(await text(friends), /Noch keine Freunde/);
  assert.equal(await library.locator(".stat").count(), 8);
  assert.equal(await library.locator('.distribution [aria-valuenow="0"]').count(), 5);
  assert.doesNotMatch(await text(library), /NaN|Infinity/);
  assert.equal(await profile.locator('[role="progressbar"]').getAttribute("aria-valuenow"), "0");
  for (const [scenario, label] of [["unknown", "Sensordaten werden erwartet"], ["unavailable", "Steam-Daten nicht verfügbar"], ["missing", "Sensor nicht gefunden"]]) {
    await page.locator("#scenario").selectOption(scenario);
    await current.getByText(label, { exact: true }).waitFor();
    for (const id of ["library_stats", "player_stats", "top_games", "friends", "games"]) {
      assert.match(await text(page.locator(`#${id}`)), new RegExp(label));
    }
  }
  await page.locator("#scenario").selectOption("private");
  await profile.getByText("Player One", { exact: true }).waitFor();
  assert.match(await text(profile), /Profil: Steam-Daten nicht verfügbar/);
  assert.match(await text(recent), /Erfolgsdaten nicht verfügbar/);
  console.log("PASS: empty, unknown, unavailable, missing, and partial private data");

  await page.locator("#scenario").selectOption("multi");
  await profile.getByText("Wähle ein Steam-Konto im Karteneditor aus.", { exact: true }).waitFor();
  await page.locator("details.editor > summary").click();
  const editor = page.locator("#editor");
  await editor.locator('[data-field="account"]').selectOption("second-account");
  await profile.getByText("Player Two", { exact: true }).waitFor();
  assert.match(await text(profile), /Offline/);
  assert.match(await text(profile), /Zuletzt online vor 2 Stunden/);
  assert.equal(await profile.locator(".playing").count(), 0);
  await profile.evaluate((node) => {
    window.secondProfileHass = node._hass;
    node.hass = { ...node._hass, states: { ...node._hass.states,
      "sensor.second_presence": { state: "Online", attributes: { personaname: "Player Two" } },
      "sensor.second_current": { state: "Another account's game", attributes: {} },
    } };
  });
  assert.equal(await profile.locator(".playing").innerText(), "Spielt: Another account's game");
  assert.doesNotMatch(await text(profile), /Beyond the Blue|Zuletzt online/);
  await profile.evaluate((node) => { node.hass = window.secondProfileHass; });
  await editor.locator('[data-field="title"]').fill("My saved title");
  await editor.locator('[data-field="title"]').dispatchEvent("change");
  assert.equal(await profile.locator(".eyebrow").textContent(), "My saved title");
  await editor.locator('[data-field="show_title"]').uncheck();
  assert.equal(await profile.locator(".eyebrow").count(), 0);
  assert.equal(await profile.locator(".heading > svg").count(), 0);
  assert.equal(await profile.locator(".account-label").innerText(), "Steam Account B");
  assert.equal(await editor.locator('[data-field="title"]').inputValue(), "My saved title");
  await editor.locator('[data-field="show_username"]').uncheck();
  assert.equal(await profile.locator(".heading").count(), 0);
  assert.match(await text(profile), /Player Two/);
  for (const view of ["library_stats", "player_stats", "games", "friends", "top_games", "recent_games", "current_game", "profile"]) {
    await editor.locator('[data-field="view"]').selectOption(view);
    assert.equal(await editor.locator('[data-field="show_username"]').count(), 1);
    assert.equal(await editor.locator('[data-field="show_title"]').count(), 1);
    assert.equal(await editor.locator('[data-field="show_data_status"]').count(), 1);
    assert.equal(await profile.locator(".heading").count(), 0);
    assert.equal(await editor.locator('[data-field="title"]').inputValue(), "My saved title");
  }
  await editor.locator('[data-field="show_title"]').check();
  assert.equal(await profile.locator(".eyebrow").textContent(), "My saved title");
  assert.equal(await profile.locator(".account-label").count(), 0);
  await editor.locator('[data-field="show_username"]').check();
  assert.equal(await profile.locator(".account-label").innerText(), "Steam Account B");
  await profile.evaluate((node) => {
    const saved = JSON.parse(JSON.stringify(node._config));
    node.setConfig(saved);
  });
  assert.equal(await profile.locator(".eyebrow").textContent(), "My saved title");
  await editor.locator('[data-field="title"]').fill("");
  await editor.locator('[data-field="title"]').dispatchEvent("change");
  console.log("PASS: independent heading checkboxes in all views and custom-title preservation");
  await editor.locator('[data-field="view"]').selectOption("current_game");
  await profile.getByText("Beyond the Blue", { exact: true }).waitFor();
  await editor.locator('[data-field="language"]').selectOption("en");
  assert.equal(await profile.locator(".eyebrow").textContent(), "Now playing");
  await editor.locator('[data-field="view"]').selectOption("friends");
  await editor.locator('[data-field="item_action"]').selectOption("more-info");
  await profile.evaluate((node) => node.addEventListener("hass-more-info", (event) => { window.selectedAccountEntity = event.detail.entityId; }));
  await profile.locator("button.item-action").first().click();
  assert.equal(await page.evaluate(() => window.selectedAccountEntity), "sensor.second_friends");
  await editor.locator('[data-field="view"]').selectOption("games");
  await editor.locator('[data-field="library_sort"]').selectOption("name");
  await editor.locator('[data-field="library_filter"]').selectOption("unplayed");
  assert.equal(await profile.locator(".game-row").count(), 1);
  assert.match(await text(profile), /Uncharted Pages/);
  await profile.locator("button.item-action").first().press("Space");
  assert.equal(await page.evaluate(() => window.selectedAccountEntity), "sensor.second_playtime");
  await editor.locator('[data-field="view"]').selectOption("friends");
  await editor.locator('[data-field="item_action"]').selectOption("none");
  await editor.locator('[data-field="layout"]').selectOption("single_line");
  assert.equal(await profile.locator("ha-card").getAttribute("class"), "theme single_line");
  assert.match(await text(profile), /Alex/);
  await editor.locator('[data-field="show_title"]').uncheck();
  assert.equal(await profile.locator(".body").getAttribute("title"), "");
  await editor.locator('[data-field="show_title"]').check();
  assert.equal(await editor.locator('[data-field="entities.playtime"]').count(), 1);
  assert.equal(await editor.locator('[data-field="entities.global_stats"]').count(), 1);
  assert.equal(await editor.locator('[data-field="entities.friends"]').count(), 1);
  console.log("PASS: visual editor, account selection, view switch, and language");

  await page.locator("#scenario").selectOption("registry");
  await profile.getByText("Konten können nicht automatisch erkannt werden. Weise Sensoren im Karteneditor manuell zu.", { exact: true }).waitFor();
  await editor.locator("summary").click();
  await editor.locator('[data-field="entities.status"]').selectOption("sensor.demo_presence");
  await profile.getByText("Player One", { exact: true }).waitFor();
  console.log("PASS: manual assignment with denied registry access");

  await page.locator("#scenario").selectOption("ready");
  await profile.getByText("Player One", { exact: true }).waitFor();
  await page.evaluate(() => {
    const card = document.querySelector("#profile");
    card.setConfig({ view: "profile", title: '<img src=x onerror="window.injected=true">' });
    card.hass = { ...card._hass, states: { ...card._hass.states,
      "sensor.demo_presence": { state: "Online", attributes: {
        personaname: '<script>window.injected=true</script>', avatar: "javascript:alert(1)", profileurl: "javascript:alert(1)",
      } },
    } };
  });
  assert.match(await text(profile), /<script>/);
  assert.equal(await profile.locator("img").count(), 0);
  assert.equal(await profile.locator("a").count(), 0);
  assert.equal(await page.evaluate(() => window.injected), undefined);
  console.log("PASS: untrusted Steam text and URLs cannot insert markup or script");

  await page.locator("#scenario").selectOption("ready");
  await page.evaluate(() => {
    const card = document.createElement("steam-tracker-card");
    card.id = "freshness-check";
    card.style.width = "320px";
    const hass = document.querySelector("#profile")._hass;
    const timestamp = new Date(Date.now() - 180000).toISOString();
    window.freshnessHass = { ...hass, states: Object.fromEntries(Object.entries(hass.states).map(([id, value]) => [id,
      { ...value, attributes: { ...value.attributes, last_successful_update: timestamp } }])) };
    card.setConfig({ view: "player_stats" });
    card.hass = window.freshnessHass;
    document.body.append(card);
  });
  const freshness = page.locator("#freshness-check");
  assert.equal(await freshness.locator(".data-status").count(), 0);
  for (const language of ["de", "en"]) {
    for (const layout of ["detailed", "compact", "single_line"]) {
      for (const view of ["profile", "current_game", "recent_games", "library_stats", "player_stats", "top_games", "friends", "games"]) {
        await freshness.evaluate((node, config) => node.setConfig({ ...config, show_data_status: true }), { view, layout, language });
        assert.equal(await freshness.locator(".data-status").innerText(), language === "de"
          ? "Erfolgreich aktualisiert vor 3 Minuten" : "Successfully updated 3 minutes ago");
        assert.equal(await freshness.locator(".data-status").isVisible(), true);
        assert.ok(await freshness.locator(".data-status").getAttribute("datetime"));
        assert.equal(await freshness.evaluate((node) => node.shadowRoot.querySelector("ha-card").scrollWidth <= node.clientWidth), true);
      }
    }
  }
  await freshness.evaluate((node) => {
    node.setConfig({ view: "profile", show_data_status: true, language: "en" });
    node.hass = { ...window.freshnessHass, states: { ...window.freshnessHass.states,
      "sensor.demo_level": { ...window.freshnessHass.states["sensor.demo_level"], attributes: {
        ...window.freshnessHass.states["sensor.demo_level"].attributes,
        last_successful_update: new Date(Date.now() - 21600000).toISOString(),
      } },
    } };
  });
  assert.equal(await freshness.locator(".data-status").innerText(), "Successfully updated 6 hours ago");
  assert.match(await freshness.locator(".data-status").getAttribute("title"), /Oldest successful update/);
  await freshness.evaluate((node) => {
    node.setConfig({ view: "recent_games", show_data_status: true, show_achievements: false, language: "en" });
    node.hass = { ...window.freshnessHass, states: { ...window.freshnessHass.states,
      "sensor.demo_achievements": { state: "unavailable", attributes: {} },
    } };
  });
  assert.equal(await freshness.locator(".data-status").innerText(), "Successfully updated 3 minutes ago");
  await freshness.evaluate((node) => node.setConfig({ ...node._config, show_achievements: true }));
  assert.equal(await freshness.locator(".data-status").count(), 0);
  for (const value of [undefined, "invalid", "2026-11-05", "<img src=x onerror=alert(1)>"]) {
    await freshness.evaluate((node, value) => {
      node.setConfig({ view: "player_stats", show_data_status: true });
      node.hass = { ...window.freshnessHass, states: { ...window.freshnessHass.states,
        "sensor.demo_stats": { state: "0", attributes: { last_successful_update: value },
          last_updated: new Date().toISOString(), last_changed: new Date().toISOString() },
      } };
    }, value);
    assert.equal(await freshness.locator(".data-status").count(), 0);
  }
  for (const state of ["unknown", "unavailable"]) {
    await freshness.evaluate((node, state) => {
      node.hass = { ...window.freshnessHass, states: { ...window.freshnessHass.states,
        "sensor.demo_stats": { ...window.freshnessHass.states["sensor.demo_stats"], state },
      } };
    }, state);
    assert.equal(await freshness.locator(".data-status").count(), 0);
  }
  await freshness.evaluate((node) => {
    node.hass = window.freshnessHass;
    node.setConfig({ ...node._config, language: "en" });
  });
  await page.clock.fastForward(60000);
  assert.equal(await freshness.locator(".data-status").innerText(), "Successfully updated 4 minutes ago");
  await freshness.evaluate((node) => {
    window.detachedFreshness = node;
    window.detachedStatus = node.shadowRoot.querySelector(".data-status");
    node.remove();
  });
  await page.clock.fastForward(120000);
  assert.equal(await page.evaluate(() => window.detachedStatus.textContent), "Successfully updated 4 minutes ago");
  await page.evaluate(() => document.body.append(window.detachedFreshness));
  assert.equal(await freshness.locator(".data-status").innerText(), "Successfully updated 6 minutes ago");
  await freshness.evaluate((node) => node.setConfig({ ...node._config, show_data_status: false }));
  assert.equal(await freshness.locator(".data-status").count(), 0);
  await freshness.evaluate((node) => node.remove());
  await editor.locator('[data-field="show_data_status"]').check();
  assert.equal(await profile.evaluate((node) => node._config.show_data_status), true);
  await editor.locator('[data-field="show_data_status"]').uncheck();
  console.log("PASS: optional successful-fetch timestamps, oldest source, all views/layouts/languages, editor and timer cleanup");

  await page.locator("#scenario").selectOption("ready");
  await page.setViewportSize({ width: 390, height: 900 });
  await profile.getByText("Player One", { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  for (const layout of ["detailed", "compact", "single_line"]) {
    for (const id of ["profile", "current_game", "recent_games", "library_stats", "player_stats", "top_games", "friends", "games"]) {
      const card = page.locator(`#${id}`);
      await card.evaluate((node, layout) => node.setConfig({ ...node._config, layout, item_action: "steam" }), layout);
      assert.equal(await card.evaluate((node) => node.shadowRoot.querySelector("ha-card").scrollWidth <= node.clientWidth), true, `${id} overflows in ${layout}`);
      if (["recent_games", "top_games"].includes(id)) await checkGameRows(card);
    }
  }
  await page.locator("#theme").click();
  await page.locator("#compact").click();
  assert.equal(await profile.locator("ha-card").getAttribute("class"), "theme compact");
  console.log("PASS: mobile layout, light theme, and compact mode");
  assert.deepEqual(errors, []);
  assert.deepEqual(externalRequests, []);
  await page.evaluate(() => {
    const hosts = [...document.querySelectorAll("steam-tracker-card,steam-tracker-card-editor")];
    window.stores = hosts.map((host) => host._registry);
    hosts.forEach((host) => host.remove());
  });
  assert.equal(await page.evaluate(() => window.stores.every((store) => store.listeners.size === 0 && store.disposed)), true);
  console.log("PASS: registry subscriptions clean up when all cards are removed");
  console.log("Browser checks passed; no JavaScript errors or external requests.");
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
