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
  console.log("PASS: three views, XP, zero achievements, and artwork");
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
  assert.equal(await profile.locator('[role="progressbar"]').getAttribute("aria-valuenow"), "0");
  for (const [scenario, label] of [["unknown", "Sensordaten werden erwartet"], ["unavailable", "Steam-Daten nicht verfügbar"], ["missing", "Sensor nicht gefunden"]]) {
    await page.locator("#scenario").selectOption(scenario);
    await current.getByText(label, { exact: true }).waitFor();
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
  for (const card of [profile, current, recent]) {
    assert.equal(await card.evaluate((node) => node.shadowRoot.querySelector("ha-card").scrollWidth <= node.clientWidth), true);
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
