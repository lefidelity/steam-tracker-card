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

function state(state, attributes = {}) { return { state, attributes }; }

function data() {
  const states = {
    "sensor.demo_presence": state("Online", { personaname: "Player One", avatar: art("avatar"), profileurl: "https://steamcommunity.com/" }),
    "sensor.demo_level": state("24", { player_xp: 4200, player_xp_needed_to_level_up: 300, player_xp_needed_current_level: 4000 }),
    "sensor.demo_current": state("Beyond the Blue", { name: "Beyond the Blue", logo: art("space"), total_playtime_hours: 168.6 }),
    "sensor.demo_recent": state("Beyond the Blue", { recent_games: sampleGames }),
    "sensor.demo_achievements": state("3", { recent_achievements: [
      { appid: 101, unlocked: 32, total: 50, percent: 64 }, { appid: 102, unlocked: 0, total: 24, percent: 0 },
      { appid: 103, unlocked: 0, total: 0, percent: null },
    ] }),
  };
  if (["unknown", "unavailable"].includes(scenario)) {
    for (const id of Object.keys(states)) states[id] = state(scenario);
  }
  if (scenario === "empty") {
    states["sensor.demo_current"] = state("none");
    states["sensor.demo_recent"] = state("none", { recent_games: [] });
    states["sensor.demo_level"] = state("0", { player_xp: 0, player_xp_needed_to_level_up: 100, player_xp_needed_current_level: 0 });
  }
  if (scenario === "missing") for (const id of Object.keys(states)) delete states[id];
  if (scenario === "private") {
    states["sensor.demo_level"] = state("unavailable");
    states["sensor.demo_achievements"] = state("unavailable");
  }
  const roleMap = { status: "presence", profile: "level", game: "current", recent_games: "recent", recent_achievements: "achievements" };
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
    states["sensor.second_presence"] = state("Offline", { personaname: "Player Two" });
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
