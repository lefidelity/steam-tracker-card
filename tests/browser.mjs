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
  await profile.getByText("Player One", { exact: true }).waitFor();
  assert.match(await text(current), /Beyond the Blue/);
  assert.match(await text(recent), /The Last Outpost/);
  assert.match(await text(recent), /0 \/ 24/);
  assert.match(await text(recent), /Keine Erfolge vorhanden/);
  assert.equal(await profile.locator('[role="progressbar"]').getAttribute("aria-valuenow"), "40");
  const friends = page.locator("#friends");
  const games = page.locator("#games");
  const top = page.locator("#top_games");
  assert.equal(await top.locator('.game-row').count(), 5);
  assert.match(await text(top), /Erfolgsdaten nicht verfügbar/);
  const library = page.locator("#library_stats");
  assert.match(await text(library), /337,8/);
  assert.match(await text(library), /Spielquote/);
  assert.match(await text(library), /85,7 %/);
  assert.match(await text(library), /Ungespielte Spiele/);
  assert.match(await text(library), /99,9 %/);
  assert.equal(await library.locator(".stat").count(), 8);
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
  await games.locator("select").selectOption("name");
  assert.equal(await games.locator("h3").first().innerText(), "Beyond the Blue");
  await friends.locator("select").selectOption("online");
  assert.equal(await friends.locator('.game-row').count(), 2);
  assert.doesNotMatch(await text(friends), /Morgan/);
  await friends.locator("select").selectOption("all");
  await friends.getByRole("searchbox").fill("Morgan");
  assert.match(await text(friends), /Offline/);
  await friends.getByRole("searchbox").fill("");
  console.log("PASS: eight views, five top games, full library, search, sorting, friend filtering and zero values");
  const detailedHeight = await current.evaluate((node) => node.getBoundingClientRect().height);
  await page.locator("#compact").click();
  if (values.screenshot) await page.screenshot({ path: values.screenshot.replace(/(\.[^.]+)$/, "-compact$1"), fullPage: true });
  const compactHeight = await current.evaluate((node) => node.getBoundingClientRect().height);
  assert.ok(compactHeight < detailedHeight * 0.6, `Compact height ${compactHeight} versus detailed ${detailedHeight}`);
  await page.locator("#single_line").click();
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
  await editor.locator('[data-field="view"]').selectOption("current_game");
  await profile.getByText("Beyond the Blue", { exact: true }).waitFor();
  await editor.locator('[data-field="language"]').selectOption("en");
  assert.match(await text(profile), /Now playing/);
  await editor.locator('[data-field="view"]').selectOption("friends");
  await editor.locator('[data-field="layout"]').selectOption("single_line");
  assert.equal(await profile.locator("ha-card").getAttribute("class"), "theme single_line");
  assert.match(await text(profile), /Alex/);
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
  await page.setViewportSize({ width: 390, height: 900 });
  await profile.getByText("Player One", { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  for (const layout of ["detailed", "compact", "single_line"]) {
    for (const id of ["profile", "current_game", "recent_games", "library_stats", "player_stats", "top_games", "friends", "games"]) {
      const card = page.locator(`#${id}`);
      await card.evaluate((node, layout) => node.setConfig({ ...node._config, layout }), layout);
      assert.equal(await card.evaluate((node) => node.shadowRoot.querySelector("ha-card").scrollWidth <= node.clientWidth), true, `${id} overflows in ${layout}`);
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
