import "../dist/steam-tracker-card.js";

const cards = [...document.querySelectorAll("steam-tracker-card")];
const editor = document.querySelector("steam-tracker-card-editor");
const subscribers = new Map();
const options = { language: "de", layout: "detailed", appearance: "theme" };
let scenario = "ready";
let currentHass;
let profileConfig;

const art = (name) => `/preview/art/${name}.svg`;
const sampleGames = [
  { appid: 101, name: "Beyond the Blue", playtime_2weeks_h: 12.4, playtime_total_h: 168.6, logo: art("space") },
  { appid: 102, name: "The Last Outpost", playtime_2weeks_h: 8.2, playtime_total_h: 42.5, logo: art("mountain") },
  { appid: 103, name: "Neon Circuit", playtime_2weeks_h: 3.6, playtime_total_h: 76.2, logo: art("neon") },
];
const topGames = [...sampleGames, { appid: 104, name: "Paper Kingdom", logo: art("mountain") },
  { appid: 105, name: "Orbit Runner", logo: art("space") }].map((game, index) => ({
  ...game, hours: [168.6, 42.5, 76.2, 32, 18][index],
  achievements_unlocked: [32, 0, 0, null, 8][index], achievements_total: [50, 24, 0, null, 10][index],
}));

function state(state, attributes = {}) {
  return { state, attributes: { last_successful_update: new Date(Date.now() - 180000).toISOString(), ...attributes } };
}

function data() {
  const states = {
    "sensor.demo_presence": state("Online", { personaname: "Player One", avatar: art("avatar"), profileurl: "https://steamcommunity.com/" }),
    "sensor.demo_level": state("24", { player_xp: 4200, player_xp_needed_to_level_up: 300, player_xp_needed_current_level: 4000 }),
    "sensor.demo_current": state("Beyond the Blue", { gameid: "101", name: "Beyond the Blue", logo: art("space"), total_playtime_hours: 168.6 }),
    "sensor.demo_recent": state("Beyond the Blue", { recent_games: sampleGames }),
    "sensor.demo_achievements": state("3", { recent_achievements: [
      { appid: 101, unlocked: 32, total: 50, percent: 64 }, { appid: 102, unlocked: 0, total: 24, percent: 0 },
      { appid: 103, unlocked: 0, total: 0, percent: null },
    ] }),
    "sensor.demo_playtime": state("337.8", { game_count: 7, total_playtime_hours: 337.8,
      top_5_playtime_hours: 337.3, pile_of_shame_count: 2, top_5_games: topGames,
      played_game_count: 6, unplayed_game_count: 1, played_percentage: 85.7,
      top_5_playtime_percentage: 99.9,
      playtime_distribution: { unplayed: 1, under_1_hour: 1, "1_to_10_hours": 0,
        "10_to_50_hours": 3, "50_hours_or_more": 2 },
      all_games: [...topGames.map(({ appid, name, hours }) => ({ appid, name, hours, playtime_minutes: Math.round(hours * 60) })),
        { appid: 106, name: "Little Garden", hours: 0.5, playtime_minutes: 30 },
        { appid: 107, name: "Uncharted Pages", hours: 0, playtime_minutes: 0 }] }),
    "sensor.demo_stats": state("40", { achievements_total: 40, achievements_possible: 84,
      perfect_games: 0, avg_completion_rate: 48, badge_count: 12, card_badge_count: 5 }),
    "sensor.demo_friends": state("3", { friends: [
      { personaname: "Alex", status: "Online", avatar: art("avatar"), game: "Beyond the Blue", profileurl: "https://steamcommunity.com/id/fictional-steam-tracker-alex/" },
      { personaname: "Jamie", status: "Away", avatar: art("avatar"), game: null, profileurl: "https://steamcommunity.com/id/fictional-steam-tracker-jamie/" },
      { personaname: "Morgan", status: "Offline", avatar: art("avatar"), game: null, profileurl: "https://steamcommunity.com/id/fictional-steam-tracker-morgan/" },
    ] }),
  };
  if (["unknown", "unavailable"].includes(scenario)) {
    for (const id of Object.keys(states)) states[id] = state(scenario);
  }
  if (scenario === "empty") {
    states["sensor.demo_current"] = state("none");
    states["sensor.demo_recent"] = state("none", { recent_games: [] });
    states["sensor.demo_level"] = state("0", { player_xp: 0, player_xp_needed_to_level_up: 100, player_xp_needed_current_level: 0 });
    states["sensor.demo_playtime"] = state("0", { game_count: 0, total_playtime_hours: 0,
      top_5_playtime_hours: 0, pile_of_shame_count: 0, top_5_games: [], all_games: [],
      played_game_count: 0, unplayed_game_count: 0, played_percentage: 0,
      top_5_playtime_percentage: 0,
      playtime_distribution: { unplayed: 0, under_1_hour: 0, "1_to_10_hours": 0,
        "10_to_50_hours": 0, "50_hours_or_more": 0 } });
    states["sensor.demo_stats"] = state("0", { achievements_total: 0, achievements_possible: 0,
      perfect_games: 0, avg_completion_rate: 0, badge_count: 0, card_badge_count: 0 });
    states["sensor.demo_friends"] = state("0", { friends: [] });
  }
  if (scenario === "missing") for (const id of Object.keys(states)) delete states[id];
  if (scenario === "private") {
    states["sensor.demo_level"] = state("unavailable");
    states["sensor.demo_achievements"] = state("unavailable");
    states["sensor.demo_stats"] = state("unavailable");
    states["sensor.demo_friends"] = state("unavailable");
  }
  const roleMap = { status: "presence", profile: "level", game: "current", recent_games: "recent", recent_achievements: "achievements",
    playtime: "playtime", global_stats: "stats", friends: "friends" };
  const entries = Object.entries(roleMap).map(([role, suffix]) => ({
    entity_id: `sensor.demo_${suffix}`, platform: "steam_tracker", unique_id: `DEMO_ACCOUNT_${role}`,
    device_id: "demo-account", config_entry_id: "demo-entry", disabled_by: null,
  }));
  const devices = [{ id: "demo-account", name: "Steam Account A" }];
  if (scenario === "multi") {
    entries.push(...entries.map((entry) => ({ ...entry, entity_id: entry.entity_id.replace("demo_", "second_"),
      unique_id: entry.unique_id.replace("DEMO_ACCOUNT", "SECOND_ACCOUNT"), device_id: "second-account", config_entry_id: "second-entry" })));
    devices.push({ id: "second-account", name: "Steam Account B" });
    for (const [id, value] of Object.entries(states)) states[id.replace("demo_", "second_")] = value;
    states["sensor.second_presence"] = state("Offline", {
      personaname: "Player Two", lastlogoff: Math.floor(Date.now() / 1000) - 7200,
    });
  }
  return { states, entries, devices };
}

const connection = {
  async subscribeEvents(callback, event) {
    if (!subscribers.has(event)) subscribers.set(event, new Set());
    subscribers.get(event).add(callback);
    return () => subscribers.get(event).delete(callback);
  },
};

function update(refreshRegistry = false) {
  const sample = data();
  currentHass = {
    language: options.language, states: sample.states, connection,
    entities: Object.fromEntries(sample.entries.map((entry) => [entry.entity_id, entry])),
    async callWS(message) {
      if (scenario === "registry") throw new Error("Mock permission denied");
      if (message.type === "config/entity_registry/list") return data().entries;
      if (message.type === "config/device_registry/list") return data().devices;
      throw new Error("Unexpected mock command");
    },
  };
  for (const card of cards) {
    card.setConfig({ type: "custom:steam-tracker-card", view: card.id, ...options,
      ...(card.id === "profile" ? profileConfig : {}) });
    card.hass = currentHass;
  }
  editor.setConfig({ type: "custom:steam-tracker-card", view: "profile", ...options, ...profileConfig });
  editor.hass = currentHass;
  if (refreshRegistry) for (const callback of subscribers.get("entity_registry_updated") || []) callback();
}

document.querySelector("#theme").addEventListener("click", (event) => {
  const light = document.documentElement.classList.toggle("light");
  event.currentTarget.textContent = light ? "Dunkles Theme" : "Helles Theme";
});
document.querySelector("#appearance").addEventListener("click", (event) => {
  options.appearance = options.appearance === "theme" ? "steam" : "theme";
  event.currentTarget.classList.toggle("active", options.appearance === "steam");
  update();
});
document.querySelector("#compact").addEventListener("click", (event) => {
  options.layout = options.layout === "detailed" ? "compact" : "detailed";
  event.currentTarget.classList.toggle("active", options.layout === "compact");
  document.querySelector("#single_line").classList.remove("active");
  update();
});
document.querySelector("#single_line").addEventListener("click", (event) => {
  options.layout = options.layout === "single_line" ? "detailed" : "single_line";
  event.currentTarget.classList.toggle("active", options.layout === "single_line");
  document.querySelector("#compact").classList.remove("active");
  update();
});
document.querySelector("#language").addEventListener("click", (event) => {
  options.language = options.language === "de" ? "en" : "de";
  event.currentTarget.textContent = options.language === "de" ? "English" : "Deutsch";
  update();
});
document.querySelector("#scenario").addEventListener("change", (event) => {
  scenario = event.target.value;
  profileConfig = undefined;
  update(true);
});
editor.addEventListener("config-changed", (event) => {
  profileConfig = event.detail.config;
  cards[0].setConfig(profileConfig);
  cards[0].hass = currentHass;
});
update();
