import test from "node:test";
import assert from "node:assert/strict";
import {
  TRANSLATIONS, normalizeConfig, languageFor, sensorIdentity, discoverAccounts,
  resolveEntities, sensorState, xpProgress, achievementProgress, recentGames, safeUrl,
  VIEWS, VIEW_ROLES, ROLES, collectionItems, lastOnlineText,
  LIBRARY_FILTERS, libraryFiltersAvailable, steamItemUrl,
  successfulUpdateText, oldestSuccessfulUpdate,
} from "../dist/steam-tracker-card.js";

const entry = (overrides = {}) => ({
  platform: "steam_tracker", entity_id: "sensor.renamed_presence", unique_id: "ACCOUNT_A_status",
  device_id: "device-a", config_entry_id: "entry-a", disabled_by: null, ...overrides,
});

test("configuration validates choices, sensor IDs, and list bounds", () => {
  assert.equal(normalizeConfig({}).view, "profile");
  assert.equal(normalizeConfig({ limit: 5 }).limit, 5);
  assert.equal(normalizeConfig({}).show_username, true);
  assert.equal(normalizeConfig({}).show_title, true);
  assert.equal(normalizeConfig({}).show_data_status, false);
  assert.equal(normalizeConfig({ show_data_status: true }).show_data_status, true);
  assert.equal(normalizeConfig({}).library_sort, "hours");
  assert.equal(normalizeConfig({}).library_filter, "all");
  assert.equal(normalizeConfig({}).item_action, "none");
  for (const library_filter of LIBRARY_FILTERS) assert.equal(normalizeConfig({ library_filter }).library_filter, library_filter);
  const hidden = normalizeConfig({ show_username: false, show_title: false, title: "My profile" });
  assert.equal(hidden.show_username, false);
  assert.equal(hidden.show_title, false);
  assert.equal(hidden.title, "My profile");
  for (const config of [null, [], { view: "invalid" }, { layout: "other" }, { limit: 0 },
    { limit: 6 }, { limit: "3" }, { show_images: "false" }, { show_username: "false" },
    { show_title: null }, { show_data_status: "true" }, { entities: [] }, { library_sort: "recent" }, { library_filter: "invalid" },
    { item_action: "javascript:alert(1)" }, { item_action: { action: "url" } },
    { entities: { game: "light.invalid" } }, { entities: { surprise: "sensor.a" } }]) {
    assert.throws(() => normalizeConfig(config));
  }
  const original = { entities: { game: "sensor.custom_game" } };
  normalizeConfig(original).entities.game = "sensor.changed";
  assert.equal(original.entities.game, "sensor.custom_game");
});

test("last online formats Steam timestamps and rejects missing, invalid or future data", () => {
  const timestamp = 1800000000;
  const now = timestamp * 1000;
  assert.equal(lastOnlineText(timestamp, "de", now), "Zuletzt online gerade eben");
  assert.equal(lastOnlineText(timestamp, "en", now + 59000), "Last online just now");
  for (const [seconds, de, en] of [
    [60, "vor 1 Minute", "1 minute ago"], [120, "vor 2 Minuten", "2 minutes ago"],
    [3600, "vor 1 Stunde", "1 hour ago"], [7200, "vor 2 Stunden", "2 hours ago"],
    [86400, "vor 1 Tag", "1 day ago"], [2592000, "vor 1 Monat", "1 month ago"],
    [31536000, "vor 1 Jahr", "1 year ago"],
  ]) {
    assert.equal(lastOnlineText(timestamp, "de", now + seconds * 1000), `Zuletzt online ${de}`);
    assert.equal(lastOnlineText(timestamp, "en", now + seconds * 1000), `Last online ${en}`);
  }
  for (const value of [undefined, null, false, true, "1800000000", "invalid", 0, -1,
    1.5, NaN, Infinity, timestamp + 1, now]) {
    assert.equal(lastOnlineText(value, "en", now), null);
  }
});

test("data freshness uses explicit successful fetch timestamps and the oldest source", () => {
  const timestamp = "2026-11-05T12:00:00.123456+00:00";
  const now = Date.parse("2026-11-05T12:03:00.123Z");
  assert.equal(successfulUpdateText(timestamp, "de", now), "Erfolgreich aktualisiert vor 3 Minuten");
  assert.equal(successfulUpdateText(timestamp, "en", now), "Successfully updated 3 minutes ago");
  assert.equal(successfulUpdateText(timestamp, "en", Date.parse(timestamp)), "Successfully updated just now");
  assert.equal(successfulUpdateText("2026-11-04T13:00:00+01:00", "en", now), "Successfully updated 1 day ago");
  for (const value of [undefined, null, 0, false, true, 1800000000, "invalid", "2026-11-05", "2026-11-05T12:00:00", "2026-11-06T12:00:00Z"]) {
    assert.equal(successfulUpdateText(value, "en", now), null);
  }
  const fresh = { state: "0", attributes: { last_successful_update: timestamp } };
  const old = { state: "none", attributes: { last_successful_update: "2026-11-04T12:00:00Z" } };
  assert.equal(oldestSuccessfulUpdate([fresh, old], now), "2026-11-04T12:00:00.000Z");
  assert.equal(oldestSuccessfulUpdate([fresh], now), "2026-11-05T12:00:00.123Z");
  for (const states of [[], [undefined], [fresh, { state: "unavailable", attributes: old.attributes }],
    [fresh, { state: "unknown" }], [fresh, { state: "0", attributes: {} }],
    [{ state: "0", attributes: {}, last_changed: timestamp, last_updated: timestamp }]]) {
    assert.equal(oldestSuccessfulUpdate(states, now), null);
  }
});

test("all eight views and three layouts support their required sensor assignments", () => {
  assert.equal(VIEWS.length, 8);
  for (const view of VIEWS) {
    for (const layout of ["detailed", "compact", "single_line"]) {
      assert.equal(normalizeConfig({ view, layout }).layout, layout);
    }
    for (const role of VIEW_ROLES[view]) assert.ok(ROLES.includes(role), role);
  }
  assert.deepEqual(normalizeConfig({ entities: { playtime: "sensor.my_library", friends: "sensor.my_friends",
    global_stats: "sensor.my_stats" } }).entities, {
    playtime: "sensor.my_library", friends: "sensor.my_friends", global_stats: "sensor.my_stats",
  });
});

test("library search and sorting preserve zero, unknown hours and input order", () => {
  const games = [{ name: "Unplayed", hours: 0 }, { name: "Big Game", hours: 10 },
    { name: "Unknown", hours: null }, { name: "Small Game", hours: 2 }];
  assert.equal(collectionItems(null), null);
  assert.deepEqual(collectionItems([]), []);
  assert.deepEqual(collectionItems(games, { query: " GAME ", sort: "hours" }).map((item) => item.name), ["Big Game", "Small Game"]);
  assert.deepEqual(collectionItems(games, { sort: "hours" }).map((item) => item.hours), [10, 2, 0, null]);
  assert.equal(games[0].name, "Unplayed");
});

test("friends filter includes active presence states without inventing offline status", () => {
  const friends = [{ personaname: "Zoe", status: "Online" }, { personaname: "Alex", status: "Offline" },
    { personaname: "Jamie", status: "Away" }, { personaname: "Unknown" }];
  assert.deepEqual(collectionItems(friends, { sort: "status", onlineOnly: true }).map((item) => item.personaname), ["Jamie", "Zoe"]);
  assert.equal(collectionItems(friends, { query: "missing" }).length, 0);
  assert.equal(friends[0].personaname, "Zoe");
});

test("playtime filters use exact, disjoint minute boundaries and compose with search", () => {
  const games = [0, 1, 2, 59, 60, 599, 600, 2999, 3000].map((minutes) =>
    Object.freeze({ name: `Game ${minutes}`, hours: Math.round(minutes / 6) / 10, playtime_minutes: minutes }));
  Object.freeze(games);
  assert.equal(libraryFiltersAvailable(games), true);
  const filtered = (playtimeFilter, query = "") => collectionItems(games, { playtimeFilter, query }).map((item) => item.playtime_minutes).sort((a, b) => a - b);
  assert.deepEqual(filtered("unplayed"), [0]);
  assert.deepEqual(filtered("played"), [1, 2, 59, 60, 599, 600, 2999, 3000]);
  assert.deepEqual(filtered("under_1_hour"), [1, 2, 59]);
  assert.deepEqual(filtered("1_to_10_hours"), [60, 599]);
  assert.deepEqual(filtered("10_to_50_hours"), [600, 2999]);
  assert.deepEqual(filtered("50_hours_or_more"), [3000]);
  assert.deepEqual(filtered("played", "GAME 2"), [2, 2999]);
  assert.deepEqual(filtered("unplayed", "missing"), []);
  assert.deepEqual(collectionItems(games.slice(0, 3), { sort: "hours" }).map((item) => item.playtime_minutes), [2, 1, 0]);
});

test("legacy and invalid minutes never become unplayed or range-filter matches", () => {
  assert.equal(libraryFiltersAvailable(null), false);
  for (const value of [undefined, null, true, false, -1, 1.5, "0", NaN, Infinity]) {
    const game = { name: "Unknown", hours: 0, playtime_minutes: value };
    assert.equal(libraryFiltersAvailable([{ playtime_minutes: 0 }, game]), false);
    assert.equal(collectionItems([game], { playtimeFilter: "all" }).length, 1);
    for (const playtimeFilter of LIBRARY_FILTERS.filter((value) => value !== "all")) {
      assert.deepEqual(collectionItems([game], { playtimeFilter }), []);
    }
  }
});

test("Steam game and friend links accept identifiers and restrict profile origins", () => {
  assert.equal(steamItemUrl({ appid: 101 }), "https://store.steampowered.com/app/101/");
  assert.equal(steamItemUrl({ gameid: "102" }), "https://store.steampowered.com/app/102/");
  assert.equal(steamItemUrl({ profileurl: "https://steamcommunity.com/id/fictional-steam-tracker-alex/" }, true),
    "https://steamcommunity.com/id/fictional-steam-tracker-alex/");
  for (const appid of [undefined, null, true, 0, -1, 1.5, "101/../../login", "javascript:alert(1)", "1e3", "01", Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(steamItemUrl({ appid }), "");
  }
  for (const profileurl of ["javascript:alert(1)", "https://evil.example/id/name", "https://steamcommunity.com.evil.example/id/name",
    "https://user:secret@steamcommunity.com/id/name", "http://steamcommunity.com/id/name",
    "https://steamcommunity.com/id/name?redirect=evil", "https://steamcommunity.com/linkfilter/?url=evil", null]) {
    assert.equal(steamItemUrl({ profileurl }, true), "");
  }
  assert.equal(steamItemUrl(null), "");
});

test("German and English expose the same labels and follow HA's language", () => {
  assert.deepEqual(Object.keys(TRANSLATIONS.de).sort(), Object.keys(TRANSLATIONS.en).sort());
  assert.equal(languageFor({}, { language: "de-AT" }), "de");
  assert.equal(languageFor({ language: "en" }, { language: "de" }), "en");
  assert.equal(languageFor({}, { language: "fr" }), "en");
});

test("discovery uses platform and unique IDs rather than entity names", () => {
  assert.deepEqual(sensorIdentity(entry({ unique_id: "ACCOUNT_A_recent_achievements" })),
    { account: "ACCOUNT_A", role: "recent_achievements" });
  assert.equal(sensorIdentity(entry({ platform: "other" })), null);
  assert.equal(sensorIdentity(entry({ unique_id: "_status" })), null);
  const accounts = discoverAccounts([
    entry(), entry({ unique_id: "ACCOUNT_A_profile", entity_id: "sensor.my_level" }),
    entry({ device_id: "device-b", unique_id: "ACCOUNT_B_status", entity_id: "sensor.second" }),
    entry({ unique_id: "ACCOUNT_A_game", disabled_by: "user", entity_id: "sensor.disabled" }),
    entry({ platform: "unrelated", entity_id: "sensor.unrelated" }),
  ], [{ id: "device-a", name: "Original", name_by_user: "Living room" }, { id: "device-b", name: "Other account" }]);
  assert.equal(accounts.length, 2);
  assert.deepEqual(accounts[0], { id: "device-a", name: "Living room",
    entities: { status: "sensor.renamed_presence", profile: "sensor.my_level" } });
});

test("older accounts without a device group by config entry or unique ID", () => {
  const accounts = discoverAccounts([entry({ device_id: null }),
    entry({ device_id: null, unique_id: "ACCOUNT_A_game", entity_id: "sensor.game" }),
    entry({ device_id: null, config_entry_id: null, unique_id: "ACCOUNT_B_status" })]);
  assert.equal(accounts.length, 2);
  assert.equal(accounts.find((account) => account.id === "entry-a").entities.game, "sensor.game");
});

test("multiple accounts require an explicit selection and never mix sensors", () => {
  const accounts = [{ id: "a", entities: { status: "sensor.a" } }, { id: "b", entities: { status: "sensor.b" } }];
  assert.deepEqual(resolveEntities(normalizeConfig({}), accounts).entities, {});
  assert.equal(resolveEntities(normalizeConfig({}), accounts.slice(0, 1)).entities.status, "sensor.a");
  assert.equal(resolveEntities(normalizeConfig({ account: "b" }), accounts).entities.status, "sensor.b");
  assert.deepEqual(resolveEntities(normalizeConfig({ account: "deleted" }), accounts).entities, {});
  assert.deepEqual(resolveEntities(normalizeConfig({ account: "b", entities: { game: "sensor.manual" } }), accounts).entities,
    { status: "sensor.b", game: "sensor.manual" });
});

test("missing, unknown, unavailable, and genuine zero are distinct", () => {
  assert.equal(sensorState(), "missing");
  assert.equal(sensorState({ state: "unknown" }), "unknown");
  assert.equal(sensorState({ state: "unavailable" }), "unavailable");
  assert.equal(sensorState({ state: "0" }), "ready");
  assert.equal(sensorState({ state: "none" }), "ready");
});

test("XP progress handles a new account and invalid or missing fields", () => {
  assert.deepEqual(xpProgress({ player_xp: 0, player_xp_needed_to_level_up: 100, player_xp_needed_current_level: 0 }),
    { value: 0, span: 100, percent: 0 });
  assert.deepEqual(xpProgress({ player_xp: 650, player_xp_needed_to_level_up: 150, player_xp_needed_current_level: 500 }),
    { value: 150, span: 300, percent: 50 });
  assert.equal(xpProgress({}), null);
  assert.equal(xpProgress({ player_xp: 0, player_xp_needed_to_level_up: 0, player_xp_needed_current_level: 0 }), null);
  assert.equal(xpProgress({ player_xp: 5, player_xp_needed_to_level_up: -2, player_xp_needed_current_level: 0 }), null);
});

test("achievements preserve unknown progress and true zero percent", () => {
  assert.deepEqual(achievementProgress({ unlocked: 0, total: 10 }), { unlocked: 0, total: 10, percent: 0 });
  assert.deepEqual(achievementProgress({ unlocked: 0, total: 0 }), { unlocked: 0, total: 0, percent: null });
  for (const value of [undefined, {}, { unlocked: null, total: 10 }, { unlocked: 11, total: 10 }, { unlocked: .5, total: 1 }]) {
    assert.equal(achievementProgress(value), null);
  }
});

test("recent sorting and limiting do not mutate Home Assistant attributes", () => {
  const games = Object.freeze([Object.freeze({ name: "First", playtime_2weeks_h: 1, playtime_total_h: 500 }),
    Object.freeze({ name: "Second", playtime_2weeks_h: 20, playtime_total_h: 50 })]);
  assert.equal(recentGames(games, normalizeConfig({ sort: "playtime", limit: 1 }))[0].name, "Second");
  assert.equal(recentGames(games, normalizeConfig({ sort: "total" }))[0].name, "First");
  assert.equal(games[0].name, "First");
  assert.equal(recentGames(undefined, normalizeConfig({})), null);
  assert.deepEqual(recentGames([], normalizeConfig({})), []);
});

test("URLs reject script and data protocols and embedded credentials", () => {
  for (const url of ["javascript:alert(1)", "data:image/svg+xml,<svg/>", "http://external.example/image.png",
    "https://user:secret@example.com/image.png", "file:///tmp/image", null]) assert.equal(safeUrl(url), "");
  assert.equal(safeUrl("https://cdn.example.test/art.jpg"), "https://cdn.example.test/art.jpg");
});
