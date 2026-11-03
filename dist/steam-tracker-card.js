/** Steam Tracker Card v0.7.0 · MIT License · No runtime dependencies. */

export const ROLES = ["status", "profile", "game", "recent_games", "recent_achievements", "playtime", "global_stats", "friends"];
export const VIEWS = ["profile", "current_game", "recent_games", "library_stats", "player_stats", "top_games", "friends", "games"];
export const VIEW_ROLES = {
  profile: ["status", "profile"], current_game: ["game"],
  recent_games: ["recent_games", "recent_achievements"], library_stats: ["playtime"],
  player_stats: ["global_stats"], top_games: ["playtime"], friends: ["friends"], games: ["playtime"],
};

export const TRANSLATIONS = {
  en: {
    profile: "Profile", current_game: "Now playing", recent_games: "Recently played",
    library_stats: "Library statistics", player_stats: "Player statistics", top_games: "Top 5 games",
    friends: "Friends", games: "All games", global_stats: "Global statistics", single_line: "Single line",
    game_count: "Games", total_hours: "Total playtime", top_hours: "Top 5 playtime", pile_of_shame: "Under 1 hour",
    unlocked: "Unlocked achievements", possible: "Possible achievements", perfect: "Perfect games",
    completion: "Average completion", badges: "Badges", card_badges: "Game badges",
    search_games: "Search games", search_friends: "Search friends", name_order: "Name A–Z",
    hours_order: "Most played", all_friends: "All friends", online_only: "Online only",
    no_library: "Your library is empty", no_friends: "No friends yet", no_matches: "No matching results",
    results: "Shown", online_count: "Online",
    status: "Status", game: "Current game", recent_achievements: "Recent achievements",
    account: "Steam account", automatic: "Automatic (one account)", view: "View",
    title: "Custom title", layout: "Layout", detailed: "Detailed", compact: "Compact",
    appearance: "Appearance", theme: "Home Assistant theme", steam: "Steam blue",
    language: "Language", auto: "Automatic", show_images: "Show images",
    show_achievements: "Show achievements", limit: "Number of games",
    sort: "Sort games by", recent: "Steam order", playtime: "Last two weeks", total: "Total playtime",
    advanced: "Manual sensor assignment", default_entity: "Automatic assignment",
    loading: "Loading Steam accounts…", choose_account: "Select a Steam account in the card editor.",
    no_accounts: "No Steam Tracker account found. Install the integration or assign sensors in the editor.",
    account_missing: "This Steam account could not be found. Select it again in the editor.",
    registry_error: "Account discovery is unavailable. Assign sensors manually in the card editor.",
    missing: "Sensor not found", unknown: "Waiting for sensor data", unavailable: "Steam data unavailable",
    missing_hint: "Check the sensor assignment in the card editor.",
    unavailable_hint: "Check the integration and Steam privacy settings.",
    unknown_hint: "The integration has not provided a value yet.",
    no_game: "Taking a break", no_game_hint: "No game is currently being played.",
    no_recent: "A quiet fortnight", no_recent_hint: "No games played in the last two weeks.",
    level: "Level", next_level: "Next level", xp: "XP", hours: "h", last_two_weeks: "Last 2 weeks",
    lifetime: "All time", achievements: "Achievements", no_achievements: "No achievements",
    unknown_achievements: "Achievement data unavailable", profile_link: "Open Steam profile",
    player: "Steam player", online: "Online", offline: "Offline", busy: "Busy", away: "Away",
    snooze: "Snooze", trade: "Looking to trade", play: "Looking to play", unexpected_status: "Unknown status",
    more_info: "Sensor details", editor_hint: "Use one card per view. Add more cards to build your dashboard.",
    invalid_config: "Invalid Steam Tracker Card configuration",
  },
  de: {
    profile: "Profil", current_game: "Aktuelles Spiel", recent_games: "Kürzlich gespielt",
    library_stats: "Bibliothek-Statistik", player_stats: "Spieler-Statistik", top_games: "Top-5-Spiele",
    friends: "Freunde", games: "Spiele-Gesamtübersicht", global_stats: "Gesamtstatistik", single_line: "Einzeiler",
    game_count: "Spiele", total_hours: "Gesamtspielzeit", top_hours: "Top-5-Spielzeit", pile_of_shame: "Unter 1 Stunde",
    unlocked: "Freigeschaltete Erfolge", possible: "Mögliche Erfolge", perfect: "Perfekte Spiele",
    completion: "Durchschnittlicher Abschluss", badges: "Abzeichen", card_badges: "Spielabzeichen",
    search_games: "Spiele suchen", search_friends: "Freunde suchen", name_order: "Name A–Z",
    hours_order: "Meistgespielt", all_friends: "Alle Freunde", online_only: "Nur online",
    no_library: "Deine Bibliothek ist leer", no_friends: "Noch keine Freunde", no_matches: "Keine passenden Ergebnisse",
    results: "Angezeigt", online_count: "Online",
    status: "Status", game: "Aktuelles Spiel", recent_achievements: "Kürzliche Erfolge",
    account: "Steam-Konto", automatic: "Automatisch (ein Konto)", view: "Ansicht",
    title: "Eigener Titel", layout: "Darstellung", detailed: "Ausführlich", compact: "Kompakt",
    appearance: "Aussehen", theme: "Home-Assistant-Theme", steam: "Steam-Blau",
    language: "Sprache", auto: "Automatisch", show_images: "Bilder anzeigen",
    show_achievements: "Erfolge anzeigen", limit: "Anzahl der Spiele",
    sort: "Spiele sortieren nach", recent: "Steam-Reihenfolge", playtime: "Letzte zwei Wochen", total: "Gesamtspielzeit",
    advanced: "Sensoren manuell zuweisen", default_entity: "Automatische Zuordnung",
    loading: "Steam-Konten werden geladen…", choose_account: "Wähle ein Steam-Konto im Karteneditor aus.",
    no_accounts: "Kein Steam-Tracker-Konto gefunden. Installiere die Integration oder weise Sensoren im Editor zu.",
    account_missing: "Dieses Steam-Konto wurde nicht gefunden. Wähle es im Editor erneut aus.",
    registry_error: "Konten können nicht automatisch erkannt werden. Weise Sensoren im Karteneditor manuell zu.",
    missing: "Sensor nicht gefunden", unknown: "Sensordaten werden erwartet", unavailable: "Steam-Daten nicht verfügbar",
    missing_hint: "Prüfe die Sensorzuordnung im Karteneditor.",
    unavailable_hint: "Prüfe die Integration und die Steam-Privatsphäre-Einstellungen.",
    unknown_hint: "Die Integration hat noch keinen Wert geliefert.",
    no_game: "Zeit für eine Pause", no_game_hint: "Aktuell wird kein Spiel gespielt.",
    no_recent: "Eine ruhige Zeit", no_recent_hint: "In den letzten zwei Wochen wurde kein Spiel gespielt.",
    level: "Level", next_level: "Nächstes Level", xp: "XP", hours: "h", last_two_weeks: "Letzte 2 Wochen",
    lifetime: "Insgesamt", achievements: "Erfolge", no_achievements: "Keine Erfolge vorhanden",
    unknown_achievements: "Erfolgsdaten nicht verfügbar", profile_link: "Steam-Profil öffnen",
    player: "Steam-Spieler", online: "Online", offline: "Offline", busy: "Beschäftigt", away: "Abwesend",
    snooze: "Schlummernd", trade: "Möchte handeln", play: "Möchte spielen", unexpected_status: "Status unbekannt",
    more_info: "Sensordetails", editor_hint: "Eine Ansicht pro Karte. Füge weitere Karten für dein eigenes Dashboard hinzu.",
    invalid_config: "Ungültige Konfiguration der Steam Tracker Card",
  },
};

export function languageFor(config = {}, hass = {}) {
  const language = config.language === "auto" || !config.language ? hass.language : config.language;
  return String(language || "en").toLowerCase().startsWith("de") ? "de" : "en";
}

export function normalizeConfig(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) throw new Error("Invalid configuration");
  const result = { view: "profile", layout: "detailed", appearance: "theme", language: "auto",
    show_images: true, show_achievements: true, limit: 3, sort: "recent", ...config };
  for (const [key, options] of Object.entries({ view: VIEWS, layout: ["compact", "detailed", "single_line"],
    appearance: ["theme", "steam"], language: ["auto", "de", "en"], sort: ["recent", "playtime", "total"] })) {
    if (!options.includes(result[key])) throw new Error(`Invalid ${key}: ${String(result[key])}`);
  }
  if (!Number.isInteger(result.limit) || result.limit < 1 || result.limit > 5) throw new Error("limit must be 1–5");
  for (const key of ["show_images", "show_achievements"]) {
    if (typeof result[key] !== "boolean") throw new Error(`${key} must be a boolean`);
  }
  for (const key of ["account", "title"]) {
    if (result[key] !== undefined && typeof result[key] !== "string") throw new Error(`${key} must be text`);
  }
  if (result.entities !== undefined) {
    if (!result.entities || typeof result.entities !== "object" || Array.isArray(result.entities)) throw new Error("Invalid entities");
    for (const [role, id] of Object.entries(result.entities)) {
      if (!ROLES.includes(role) || typeof id !== "string" || !/^sensor\.[a-z0-9_]+$/.test(id)) {
        throw new Error(`Invalid sensor assignment: ${role}`);
      }
    }
  }
  return { ...result, entities: { ...result.entities } };
}

export function sensorIdentity(entry) {
  if (entry.platform !== "steam_tracker" || typeof entry.unique_id !== "string") return null;
  const roles = ["recent_achievements", "recent_games", "global_stats", "playtime", "profile", "friends", "status", "game"];
  const role = roles.find((value) => entry.unique_id.endsWith(`_${value}`));
  if (!role) return null;
  const account = entry.unique_id.slice(0, -role.length - 1);
  return account ? { account, role } : null;
}

export function discoverAccounts(entries = [], devices = []) {
  const deviceMap = new Map(devices.map((device) => [device.id, device]));
  const groups = new Map();
  for (const entry of entries) {
    const identity = sensorIdentity(entry);
    if (!identity || entry.disabled_by) continue;
    const id = entry.device_id || entry.config_entry_id || identity.account;
    if (!groups.has(id)) {
      const device = deviceMap.get(entry.device_id);
      const name = device?.name_by_user || device?.name || "Steam Tracker";
      groups.set(id, { id, name, entities: {} });
    }
    groups.get(id).entities[identity.role] = entry.entity_id;
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function resolveEntities(config, accounts = []) {
  const account = config.account ? accounts.find((item) => item.id === config.account)
    : accounts.length === 1 ? accounts[0] : undefined;
  return { account, entities: { ...account?.entities, ...config.entities } };
}

export function sensorState(state) {
  if (!state) return "missing";
  if (state.state === "unknown" || state.state === "unavailable") return state.state;
  return "ready";
}

export function nonnegative(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

export function xpProgress(attributes = {}) {
  const xp = nonnegative(attributes.player_xp);
  const needed = nonnegative(attributes.player_xp_needed_to_level_up);
  const minimum = nonnegative(attributes.player_xp_needed_current_level);
  if (xp === null || needed === null || minimum === null || xp < minimum) return null;
  const span = xp + needed - minimum;
  if (span <= 0) return null;
  const value = xp - minimum;
  return { value, span, percent: Math.min(100, Math.max(0, value / span * 100)) };
}

export function achievementProgress(item, prefix = "") {
  if (!item) return null;
  const unlocked = nonnegative(item[`${prefix}unlocked`]);
  const total = nonnegative(item[`${prefix}total`]);
  if (!Number.isInteger(unlocked) || !Number.isInteger(total) || unlocked > total) return null;
  return { unlocked, total, percent: total > 0 ? unlocked / total * 100 : null };
}

export function recentGames(games, config) {
  if (!Array.isArray(games)) return null;
  const items = games.filter((game) => game && typeof game === "object");
  if (config.sort !== "recent") {
    const key = config.sort === "playtime" ? "playtime_2weeks_h" : "playtime_total_h";
    items.sort((a, b) => (nonnegative(b[key]) ?? -1) - (nonnegative(a[key]) ?? -1));
  }
  return items.slice(0, config.limit);
}

export function collectionItems(items, { query = "", sort = "name", onlineOnly = false } = {}) {
  if (!Array.isArray(items)) return null;
  const search = query.trim().toLocaleLowerCase();
  return items.filter((item) => item && typeof item === "object")
    .filter((item) => String(item.personaname || item.name || "").toLocaleLowerCase().includes(search))
    .filter((item) => !onlineOnly || isOnline(item.status))
    .sort((a, b) => {
      const order = sort === "hours" ? (nonnegative(b.hours) ?? -1) - (nonnegative(a.hours) ?? -1)
        : sort === "status" ? Number(isOnline(b.status)) - Number(isOnline(a.status)) : 0;
      return order || String(a.personaname || a.name || "").localeCompare(String(b.personaname || b.name || ""));
    });
}

function isOnline(status) {
  return ["Online", "Busy", "Away", "Snooze", "Looking to trade", "Looking to play"].includes(status);
}

export function safeUrl(value, allowLocal = false) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value, globalThis.location?.origin || "https://home-assistant.invalid");
    if (url.username || url.password) return "";
    if (url.protocol === "https:") return url.href;
    if (allowLocal && globalThis.location && url.origin === location.origin && url.protocol === "http:") return url.href;
  } catch { /* Missing or malformed image URLs use the placeholder. */ }
  return "";
}

const registryStores = new WeakMap();

class RegistryStore {
  constructor(hass) {
    this.hass = hass;
    this.accounts = [];
    this.loading = true;
    this.error = false;
    this.listeners = new Set();
    this.unsubscribes = [];
    this.disposed = false;
    this.refresh();
    if (hass.connection?.subscribeEvents) {
      for (const event of ["entity_registry_updated", "device_registry_updated"]) {
        Promise.resolve(hass.connection.subscribeEvents(() => this.refresh(), event))
          .then((unsubscribe) => {
            if (this.disposed) unsubscribe();
            else this.unsubscribes.push(unsubscribe);
          }).catch(() => { /* Manual assignment remains usable without registry subscriptions. */ });
      }
    }
  }

  async refresh() {
    if (this.pending) {
      this.again = true;
      return;
    }
    this.pending = true;
    try {
      const [entries, devices] = await Promise.all([
        this.hass.callWS({ type: "config/entity_registry/list" }),
        this.hass.callWS({ type: "config/device_registry/list" }),
      ]);
      if (!Array.isArray(entries) || !Array.isArray(devices)) throw new Error("Invalid registry data");
      this.accounts = discoverAccounts(entries, devices);
      this.error = false;
    } catch {
      this.error = true;
    } finally {
      this.pending = false;
      this.loading = false;
      if (!this.disposed) {
        for (const listener of this.listeners) listener();
        if (this.again) {
          this.again = false;
          this.refresh();
        }
      }
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.disposed = true;
        for (const unsubscribe of this.unsubscribes) unsubscribe();
        registryStores.delete(this.hass.connection || this.hass);
      }
    };
  }
}

function connectRegistry(host) {
  if (!host.isConnected || !host._hass?.callWS) return;
  const key = host._hass.connection || host._hass;
  if (host._registryKey === key) return;
  host._unsubscribeRegistry?.();
  let store = registryStores.get(key);
  if (!store) {
    store = new RegistryStore(host._hass);
    registryStores.set(key, store);
  }
  host._registryKey = key;
  host._registry = store;
  host._unsubscribeRegistry = store.subscribe(() => host._render(true));
}

function disconnectRegistry(host) {
  host._unsubscribeRegistry?.();
  host._unsubscribeRegistry = undefined;
  host._registryKey = undefined;
  host._registry = undefined;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);
  return node;
}

const ICONS = {
  steam: "M17.5 3a4.5 4.5 0 0 0-4.46 5.1l-4.38 6.37a3.7 3.7 0 0 0-2.17.12L1 12.3v4.4l3.47 1.44a3.75 3.75 0 0 0 7.25-1.3l6.35-4.4A4.5 4.5 0 0 0 17.5 3Zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM8 15a1.75 1.75 0 1 1-1.62 2.4l1.47.61a1 1 0 0 0 .76-1.85l-1.42-.59c.24-.32.52-.57.81-.57Z",
  game: "M7 7h10a4 4 0 0 1 3.9 3.1l1.2 5.4A3.7 3.7 0 0 1 16 19l-2-2h-4l-2 2a3.7 3.7 0 0 1-6.1-3.5l1.2-5.4A4 4 0 0 1 7 7Zm0 3v2H5v2h2v2h2v-2h2v-2H9v-2H7Zm9 1a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm3 3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 2v7l5 3 1-1.7-4-2.3V6Z",
  trophy: "M7 2h10v3h4v3a5 5 0 0 1-5 5h-.1a5 5 0 0 1-2.9 1.9V18h4v3H7v-3h4v-3.1A5 5 0 0 1 8.1 13H8a5 5 0 0 1-5-5V5h4V2ZM5 7v1a3 3 0 0 0 2.2 2.9A5 5 0 0 1 7 9V7H5Zm12 0v2c0 .7-.1 1.3-.2 1.9A3 3 0 0 0 19 8V7h-2Z",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 4h2v2h-2V6Zm0 4h2v8h-2v-8Z",
  arrow: "M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
};

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("d", ICONS[name] || ICONS.steam);
  svg.append(path);
  return svg;
}

function picture(url, className, fallback = "game") {
  const frame = element("div", `picture ${className}`);
  frame.append(icon(fallback));
  const src = safeUrl(url, true);
  if (src) {
    const img = element("img");
    img.alt = "";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.src = src;
    img.addEventListener("error", () => img.remove(), { once: true });
    frame.append(img);
  }
  return frame;
}

const CARD_STYLES = `
  :host { display:block; --st-accent:var(--primary-color,#1689cf); --st-ink:var(--primary-text-color,#172331); --st-muted:var(--secondary-text-color,#657588); --st-surface:var(--ha-card-background,var(--card-background-color,#fff)); --st-line:var(--divider-color,rgba(120,140,165,.2)); --st-tint:color-mix(in srgb,var(--st-accent) 9%,transparent); color:var(--st-ink); font-family:var(--paper-font-body1_-_font-family,system-ui,sans-serif); container-type:inline-size; }
  * { box-sizing:border-box; } ha-card { display:block; background:var(--st-surface); color:var(--st-ink); border-radius:var(--ha-card-border-radius,20px); border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--st-line)); box-shadow:var(--ha-card-box-shadow,none); overflow:hidden; }
  ha-card.steam { --st-accent:#66c9f4; --st-ink:#edf6ff; --st-muted:#a1b7ca; --st-surface:#142535; --st-line:rgba(170,205,230,.13); background:linear-gradient(135deg,#1b354a,#101d2c); }
  .body { padding:22px; } .heading { display:flex; align-items:center; gap:9px; margin-bottom:22px; } .heading svg { width:19px; color:var(--st-accent); } .eyebrow { margin:0; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.15em; flex:1; } svg { width:20px; height:20px; fill:currentColor; flex-shrink:0; }
  .account-label { max-width:44%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--st-muted); font-size:11px; } .identity { display:flex; align-items:center; gap:17px; min-width:0; } .identity-text { min-width:0; flex:1; } h2,h3,p { margin:0; } h2 { font-size:25px; font-weight:750; line-height:1.15; letter-spacing:-.035em; overflow-wrap:anywhere; } h3 { font-size:16px; line-height:1.35; font-weight:650; overflow-wrap:anywhere; } .picture { position:relative; background:var(--st-tint); display:grid; place-items:center; overflow:hidden; color:var(--st-accent); flex-shrink:0; } .picture>svg { width:32px; height:32px; opacity:.65; } .picture img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; } .avatar { width:72px; height:72px; border-radius:20px; border:1px solid var(--st-line); }
  .status { display:inline-flex; align-items:center; gap:7px; margin-top:10px; font-size:12px; color:var(--st-muted); } .dot { width:7px; height:7px; background:var(--st-muted); border-radius:50%; } .status.online { color:#21a77a; } .status.online .dot { background:#21a77a; box-shadow:0 0 0 4px #21a77a14; } .steam .status.online { color:#77e3b6; } .steam .status.online .dot { background:#77e3b6; }
  .level { display:flex; align-items:baseline; gap:6px; margin-top:24px; } .level strong { font-size:34px; font-weight:700; letter-spacing:-.06em; } .level span { color:var(--st-muted); font-size:12px; } .level .xp-total { margin-left:auto; } .progress-meta { display:flex; justify-content:space-between; gap:8px; color:var(--st-muted); font-size:11px; margin-top:13px; } .progress { height:6px; border-radius:20px; overflow:hidden; background:var(--st-line); margin-top:9px; } .progress-fill { height:100%; border-radius:inherit; background:linear-gradient(90deg,var(--st-accent),color-mix(in srgb,var(--st-accent) 50%,#5ddfbc)); }
  a { color:var(--st-accent); text-decoration:none; } .profile-link { display:inline-flex; gap:7px; align-items:center; font-size:11px; margin-top:21px; } .profile-link svg { width:13px; height:13px; } .notice { color:var(--st-muted); font-size:12px; margin-top:15px; display:flex; gap:8px; align-items:flex-start; } .notice svg { width:15px; height:15px; } .notice p { line-height:1.5; } .notice strong { font-weight:600; }
  .hero { width:100%; aspect-ratio:460/215; margin-bottom:19px; border-radius:13px; } .hero>svg { width:48px; height:48px; } .game-title { font-size:27px; } .game-kicker { display:flex; align-items:center; gap:7px; margin-bottom:9px; color:var(--st-accent); font-size:11px; } .game-kicker svg { width:15px; height:15px; } .metrics { display:flex; gap:24px; margin-top:17px; } .metric strong { font-size:20px; font-weight:650; letter-spacing:-.03em; } .metric small { font-size:11px; color:var(--st-muted); margin-left:4px; } .metric p { font-size:10px; color:var(--st-muted); margin-top:4px; }
  .games { display:flex; flex-direction:column; gap:17px; } .game-row { display:flex; gap:13px; align-items:center; min-width:0; } .game-art { width:110px; aspect-ratio:460/215; border-radius:9px; } .game-content { flex:1; min-width:0; } .row-times { display:flex; flex-wrap:wrap; gap:5px 12px; margin-top:7px; color:var(--st-muted); font-size:11px; line-height:1.4; } .row-times strong { color:var(--st-ink); font-weight:600; } .row-achievements { display:flex; align-items:center; gap:6px; margin-top:9px; font-size:10px; color:var(--st-muted); } .row-achievements svg { width:13px; height:13px; color:var(--st-accent); } .achievement-bar { width:48px; height:3px; margin:0 0 0 auto; } .footnote { margin-top:18px; padding-top:12px; border-top:1px solid var(--st-line); font-size:10px; color:var(--st-muted); }
  .empty { display:flex; flex-direction:column; align-items:center; text-align:center; padding:20px 8px 23px; gap:10px; } .empty-icon { display:grid; place-items:center; width:56px; height:56px; border-radius:18px; background:var(--st-tint); color:var(--st-accent); margin-bottom:5px; } .empty p { color:var(--st-muted); font-size:12px; line-height:1.6; max-width:280px; } .details { display:inline-flex; align-items:center; gap:5px; border:0; background:transparent; color:var(--st-accent); cursor:pointer; font:inherit; font-size:11px; margin-top:3px; padding:8px; border-radius:6px; } button:focus-visible,a:focus-visible { outline:2px solid var(--st-accent); outline-offset:4px; } .details svg { width:14px; height:14px; }
  .stat-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .stat { min-width:0; padding:15px; border-radius:12px; background:var(--st-tint); }
  .stat-value { display:block; font-size:25px; font-weight:700; letter-spacing:-.035em; }
  .stat-label { display:block; color:var(--st-muted); font-size:11px; margin-top:6px; }
  .collection-tools { display:flex; gap:8px; margin-bottom:16px; }
  .collection-tools input,.collection-tools select { min-width:0; min-height:36px; border:1px solid var(--st-line); border-radius:8px; background:var(--st-surface); color:var(--st-ink); padding:7px 9px; font:inherit; font-size:12px; }
  .collection-tools input { flex:1; width:50%; } .collection-tools select { max-width:45%; }
  input:focus-visible,select:focus-visible { outline:2px solid var(--st-accent); outline-offset:2px; }
  .collection-list { max-height:380px; overflow-y:auto; overscroll-behavior:contain; scrollbar-width:thin; }
  .collection-list .game-row { padding:11px 0; border-bottom:1px solid var(--st-line); }
  .collection-list .game-row:last-child { border:0; } .collection-list .avatar { width:40px; height:40px; border-radius:12px; }
  .collection-list .status { margin-top:5px; } .collection-total { color:var(--st-muted); font-size:11px; margin-bottom:12px; }
  .row-value { color:var(--st-accent); font-size:13px; white-space:nowrap; flex-shrink:0; }
  .friend-game { color:var(--st-muted); font-size:11px; margin-top:5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .compact .body { padding:12px; } .compact .heading { margin-bottom:10px; gap:6px; }
  .compact .heading svg { width:15px; height:15px; } .compact .eyebrow { font-size:10px; letter-spacing:.08em; }
  .compact .profile-summary { display:flex; align-items:center; gap:12px; } .compact .identity { flex:1; gap:10px; }
  .compact .avatar { width:36px; height:36px; border-radius:10px; } .compact h2 { font-size:16px; }
  .compact .status { margin-top:4px; font-size:11px; } .compact .level { margin:0; gap:5px; flex-shrink:0; }
  .compact .level strong { font-size:22px; } .compact .xp-total,.compact .profile-link { display:none; }
  .compact .progress-meta { margin-top:9px; font-size:10px; } .compact .progress { margin-top:5px; height:4px; }
  .compact .current-summary { display:flex; gap:12px; align-items:center; } .compact .current-content { flex:1; min-width:0; }
  .compact .hero { width:86px; height:48px; margin:0; border-radius:8px; } .compact .game-kicker { display:none; }
  .compact .metrics { margin-top:5px; } .compact .metric strong { font-size:15px; } .compact .metric p { display:none; }
  .compact .games { gap:10px; } .compact .game-art { width:60px; } .compact h3 { font-size:13px; }
  .compact .row-times { margin-top:3px; font-size:10px; } .compact .row-achievements { margin-top:4px; }
  .compact .achievement-bar,.compact .footnote { display:none; } .compact .stat-grid { gap:6px; }
  .compact .stat { padding:9px 10px; border-radius:8px; } .compact .stat-value { font-size:19px; }
  .compact .stat-label { margin-top:2px; font-size:10px; } .compact .collection-list .game-row { padding:7px 0; }
  .compact .collection-tools { margin-bottom:7px; } .compact .empty { flex-direction:row; text-align:left; padding:4px 0; flex-wrap:wrap; gap:7px; }
  .compact .empty-icon { width:28px; height:28px; border-radius:8px; margin:0; } .compact .empty-icon svg { width:17px; height:17px; }
  .compact .empty p { max-width:none; } .compact .notice { margin-top:7px; font-size:11px; }
  .single_line .body { padding:9px 12px; } .single_line .heading { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); margin:0; }
  .single_line .profile-summary,.single_line .identity,.single_line .identity-text { display:flex; align-items:center; min-width:0; gap:9px; }
  .single_line .identity { flex:1; } .single_line .identity-text { flex:1; } .single_line .identity-text h2 { flex:1; }
  .single_line h2,.single_line h3 { font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; letter-spacing:0; }
  .single_line .avatar { width:26px; height:26px; border-radius:7px; } .single_line .status { margin:0; font-size:11px; white-space:nowrap; }
  .single_line .level { margin:0 0 0 auto; gap:4px; white-space:nowrap; } .single_line .level strong { font-size:14px; }
  .single_line .xp-total,.single_line .progress-meta,.single_line .progress,.single_line .profile-link,.single_line .game-kicker,.single_line .footnote { display:none; }
  .single_line .current-summary { display:flex; align-items:center; gap:9px; }
  .single_line .hero { width:45px; height:26px; margin:0; border-radius:5px; } .single_line .current-content { display:flex; flex:1; min-width:0; gap:9px; align-items:center; }
  .single_line .game-title { flex:1; } .single_line .metrics { margin:0; flex-shrink:0; } .single_line .metric { white-space:nowrap; }
  .single_line .metric strong { font-size:13px; } .single_line .metric p { display:none; }
  .single_line .games { gap:0; } .single_line .game-row { gap:9px; min-height:31px; padding:5px 0; }
  .single_line .game-art { width:45px; height:26px; border-radius:5px; } .single_line .game-content { display:flex; gap:9px; align-items:center; }
  .single_line .game-content h3 { flex:1; } .single_line .row-times { flex-shrink:0; margin:0; font-size:11px; }
  .single_line .row-achievements,.single_line .friend-game { display:none; }
  .single_line .stat-grid { display:flex; gap:15px; justify-content:space-between; }
  .single_line .stat { background:transparent; padding:0; border-radius:0; }
  .single_line .stat-value { font-size:14px; } .single_line .stat-label { display:none; }
  .single_line .stat-value::after { content:attr(data-short-label); margin-left:4px; font-size:10px; font-weight:400; color:var(--st-muted); }
  .single_line .collection-tools { margin-bottom:7px; } .single_line .collection-tools input,.single_line .collection-tools select { min-height:30px; padding:4px 7px; font-size:11px; }
  .single_line .collection-list .avatar { width:26px; height:26px; border-radius:7px; } .single_line .collection-total { font-size:10px; margin-bottom:7px; }
  .single_line .empty { padding:0; flex-direction:row; gap:8px; text-align:left; }
  .single_line .empty-icon { width:25px; height:25px; border-radius:6px; margin:0; flex-shrink:0; }
  .single_line .empty-icon svg { width:16px; height:16px; } .single_line .empty p { display:none; }
  .single_line .details { margin:0 0 0 auto; font-size:0; padding:4px; } .single_line .notice { margin-top:6px; font-size:11px; }
  @container (max-width:310px) { .body { padding:16px; } .identity { gap:12px; } .avatar { width:54px; height:54px; border-radius:15px; } h2 { font-size:22px; } .game-art { width:76px; } .game-row { gap:10px; } .account-label { display:none; } .row-times { font-size:10px; } .achievement-bar { display:none; } }
`;

const HTMLElementBase = globalThis.HTMLElement || class {};

export class SteamTrackerCard extends HTMLElementBase {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = element("style", "", CARD_STYLES);
    this._card = element("ha-card");
    this.shadowRoot.append(style, this._card);
  }

  static getConfigElement() { return document.createElement("steam-tracker-card-editor"); }
  static getStubConfig() { return { view: "profile" }; }

  setConfig(config) {
    this._config = normalizeConfig(config);
    this._render(true);
  }

  set hass(hass) {
    this._hass = hass;
    connectRegistry(this);
    this._render();
  }

  connectedCallback() { connectRegistry(this); this._render(true); }
  disconnectedCallback() { disconnectRegistry(this); }
  getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }
  getCardSize() {
    const list = ["recent_games", "top_games", "friends", "games"].includes(this._config?.view);
    if (this._config?.layout === "single_line") return list ? 3 : 1;
    if (this._config?.layout === "compact") return list ? 3 : 2;
    return list ? 1 + (this._config?.limit || 3) : 4;
  }

  _number(value, digits = 0) {
    if (nonnegative(value) === null) return "—";
    return new Intl.NumberFormat(this._language, { maximumFractionDigits: digits }).format(value);
  }

  _heading(body, label, account) {
    const heading = element("div", "heading");
    heading.append(icon("steam"), element("p", "eyebrow", this._config.title || label));
    if (account) heading.append(element("span", "account-label", account.name));
    body.append(heading);
  }

  _empty(body, title, hint, symbol = "info", entityId) {
    const empty = element("div", "empty");
    const badge = element("div", "empty-icon");
    badge.append(icon(symbol));
    empty.append(badge, element("h3", "", title));
    if (hint) empty.append(element("p", "", hint));
    if (entityId && this._hass.states[entityId]) {
      const button = element("button", "details", this._t.more_info);
      button.type = "button";
      button.prepend(icon("info"));
      button.addEventListener("click", () => this.dispatchEvent(new CustomEvent("hass-more-info", {
        detail: { entityId }, bubbles: true, composed: true,
      })));
      empty.append(button);
    }
    body.append(empty);
  }

  _notice(body, text) {
    const notice = element("div", "notice");
    notice.append(icon("info"), element("p", "", text));
    body.append(notice);
  }

  _sensorNotice(body, state, label) {
    const kind = sensorState(state);
    this._notice(body, `${label}: ${this._t[kind === "ready" ? "unavailable" : kind]}`);
  }

  _progress(parent, percent, label, className = "") {
    const bar = element("div", `progress ${className}`);
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", label);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(Math.round(percent)));
    const fill = element("div", "progress-fill");
    fill.style.width = `${percent}%`;
    bar.append(fill);
    parent.append(bar);
  }

  _profile(body, entities) {
    const status = this._hass.states[entities.status];
    const profile = this._hass.states[entities.profile];
    const hasStatus = sensorState(status) === "ready";
    const hasProfile = sensorState(profile) === "ready";
    const summary = element("div", "profile-summary");
    body.append(summary);
    if (hasStatus) {
      const identity = element("div", "identity");
      if (this._config.show_images) identity.append(picture(status.attributes.avatar, "avatar", "steam"));
      const text = element("div", "identity-text");
      text.append(element("h2", "", status.attributes.personaname || this._t.player));
      const names = { Online: "online", Offline: "offline", Busy: "busy", Away: "away", Snooze: "snooze",
        "Looking to trade": "trade", "Looking to play": "play" };
      const indicator = element("div", `status ${status.state !== "Offline" && names[status.state] ? "online" : ""}`);
      indicator.append(element("span", "dot"), element("span", "", this._t[names[status.state] || "unexpected_status"]));
      text.append(indicator);
      identity.append(text);
      summary.append(identity);
    } else this._sensorNotice(body, status, this._t.status);

    if (hasProfile) {
      const level = Number(profile.state);
      const row = element("div", "level");
      row.append(element("span", "", this._t.level), element("strong", "", this._number(level)));
      const xp = nonnegative(profile.attributes.player_xp);
      if (xp !== null) row.append(element("span", "xp-total", `${this._number(xp)} ${this._t.xp}`));
      summary.append(row);
      const progress = xpProgress(profile.attributes);
      if (progress) {
        const meta = element("div", "progress-meta");
        meta.append(element("span", "", `${this._t.next_level} · ${this._number(level + 1)}`),
          element("span", "", `${this._number(progress.value)} / ${this._number(progress.span)} ${this._t.xp}`));
        body.append(meta);
        this._progress(body, progress.percent, this._t.next_level);
      }
    } else this._sensorNotice(body, profile, this._t.profile);

    const url = hasStatus ? safeUrl(status.attributes.profileurl) : "";
    if (url) {
      const link = element("a", "profile-link", this._t.profile_link);
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.append(icon("arrow"));
      body.append(link);
    }
  }

  _currentGame(body, state) {
    if (state.state === "none") {
      this._empty(body, this._t.no_game, this._t.no_game_hint, "game");
      return;
    }
    const summary = element("div", "current-summary");
    const content = element("div", "current-content");
    if (this._config.show_images) summary.append(picture(state.attributes.logo, "hero"));
    const kicker = element("div", "game-kicker", this._t.current_game);
    kicker.prepend(icon("game"));
    content.append(kicker, element("h2", "game-title", state.attributes.name || state.state));
    const metrics = element("div", "metrics");
    const metric = element("div", "metric");
    metric.append(element("strong", "", this._number(nonnegative(state.attributes.total_playtime_hours), 1)),
      element("small", "", this._t.hours), element("p", "", this._t.lifetime));
    metrics.append(metric);
    content.append(metrics);
    summary.append(content);
    body.append(summary);
  }

  _recentGames(body, state, entities) {
    const games = recentGames(state.attributes.recent_games, this._config);
    if (games === null) {
      this._empty(body, this._t.unavailable, this._t.unavailable_hint);
      return;
    }
    if (games.length === 0) {
      this._empty(body, this._t.no_recent, this._t.no_recent_hint, "clock");
      return;
    }
    const achievements = this._hass.states[entities.recent_achievements];
    const achievementList = sensorState(achievements) === "ready" && Array.isArray(achievements.attributes.recent_achievements)
      ? achievements.attributes.recent_achievements : [];
    const achievementMap = new Map(achievementList.filter((item) => item && typeof item === "object")
      .map((item) => [String(item.appid), item]));
    const list = element("div", "games");
    list.setAttribute("role", "list");
    for (const game of games) {
      const row = element("div", "game-row");
      row.setAttribute("role", "listitem");
      if (this._config.show_images) row.append(picture(game.logo, "game-art"));
      const content = element("div", "game-content");
      content.append(element("h3", "", game.name || "—"));
      const times = element("div", "row-times");
      const recent = element("span");
      recent.append(element("strong", "", `${this._number(nonnegative(game.playtime_2weeks_h), 1)} ${this._t.hours}`));
      if (this._config.layout !== "single_line") recent.append(document.createTextNode(` · ${this._t.last_two_weeks}`));
      times.append(recent);
      if (this._config.layout === "detailed") times.append(element("span", "", `${this._number(nonnegative(game.playtime_total_h), 1)} ${this._t.hours} ${this._t.lifetime.toLowerCase()}`));
      content.append(times);
      if (this._config.show_achievements && this._config.layout !== "single_line") {
        const progress = achievementProgress(achievementMap.get(String(game.appid)));
        const line = element("div", "row-achievements");
        line.append(icon("trophy"));
        if (progress?.total > 0) {
          line.append(element("span", "", `${this._number(progress.unlocked)} / ${this._number(progress.total)}`));
          line.title = `${this._t.achievements}: ${this._number(progress.percent)}%`;
          this._progress(line, progress.percent, this._t.achievements, "achievement-bar");
        } else line.append(element("span", "", this._t[progress ? "no_achievements" : "unknown_achievements"]));
        content.append(line);
      }
      row.append(content);
      list.append(row);
    }
    body.append(list, element("div", "footnote", this._t.last_two_weeks));
  }

  _statistics(body, state) {
    const data = state.attributes;
    const library = this._config.view === "library_stats";
    const stats = library ? [
      ["game_count", data.game_count], ["total_hours", data.total_playtime_hours, this._t.hours],
      ["pile_of_shame", data.pile_of_shame_count], ["top_hours", data.top_5_playtime_hours, this._t.hours],
    ] : [
      ["unlocked", data.achievements_total], ["perfect", data.perfect_games],
      ["completion", data.avg_completion_rate, "%"], ["possible", data.achievements_possible],
      ["badges", data.badge_count], ["card_badges", data.card_badge_count],
    ];
    const grid = element("div", "stat-grid");
    for (const [label, value, unit] of this._config.layout === "single_line" ? stats.slice(0, 3) : stats) {
      const tile = element("div", "stat");
      const formatted = `${this._number(nonnegative(value), unit ? 1 : 0)}${unit ? ` ${unit}` : ""}`;
      tile.title = `${this._t[label]}: ${formatted}`;
      tile.setAttribute("aria-label", tile.title);
      const number = element("strong", "stat-value", formatted);
      const shortLabel = { total_hours: "", unlocked: this._t.achievements, completion: "", perfect: this._t.perfect };
      number.dataset.shortLabel = shortLabel[label] ?? this._t[label];
      tile.append(number, element("span", "stat-label", this._t[label]));
      grid.append(tile);
    }
    body.append(grid);
  }

  _topGames(body, state) {
    const games = collectionItems(state.attributes.top_5_games, { sort: "hours" });
    if (games === null) return this._empty(body, this._t.unavailable, this._t.unavailable_hint);
    if (!games.length) return this._empty(body, this._t.no_library, "", "game");
    const list = element("div", "games");
    list.setAttribute("role", "list");
    for (const game of games.slice(0, 5)) {
      const row = element("div", "game-row");
      row.setAttribute("role", "listitem");
      if (this._config.show_images) row.append(picture(game.logo, "game-art"));
      const content = element("div", "game-content");
      content.append(element("h3", "", game.name || "—"));
      content.append(element("div", "row-times", `${this._number(nonnegative(game.hours), 1)} ${this._t.hours}`));
      if (this._config.show_achievements && this._config.layout !== "single_line") {
        const progress = achievementProgress(game, "achievements_");
        const line = element("div", "row-achievements");
        line.append(icon("trophy"));
        if (progress?.total > 0) {
          line.append(element("span", "", `${this._number(progress.unlocked)} / ${this._number(progress.total)} · ${this._number(progress.percent)}%`));
          this._progress(line, progress.percent, this._t.achievements, "achievement-bar");
        } else line.append(element("span", "", this._t[progress ? "no_achievements" : "unknown_achievements"]));
        content.append(line);
      }
      row.append(content);
      list.append(row);
    }
    body.append(list);
  }

  _collection(body, state) {
    const friends = this._config.view === "friends";
    const source = state.attributes[friends ? "friends" : "all_games"];
    if (!Array.isArray(source)) return this._empty(body, this._t.unavailable, this._t.unavailable_hint);
    if (!source.length) return this._empty(body, this._t[friends ? "no_friends" : "no_library"], "", friends ? "steam" : "game");
    this._filters ||= {};
    const filters = this._filters[this._config.view] ||= { query: "", sort: friends ? "status" : "hours", onlineOnly: false };
    const tools = element("div", "collection-tools");
    const search = element("input");
    search.type = "search";
    search.placeholder = this._t[friends ? "search_friends" : "search_games"];
    search.setAttribute("aria-label", search.placeholder);
    search.value = filters.query;
    const select = element("select");
    select.setAttribute("aria-label", this._t[friends ? "friends" : "sort"]);
    for (const [value, label] of friends ? [["all", "all_friends"], ["online", "online_only"]]
      : [["hours", "hours_order"], ["name", "name_order"]]) {
      const option = element("option", "", this._t[label]);
      option.value = value;
      select.append(option);
    }
    select.value = friends ? (filters.onlineOnly ? "online" : "all") : filters.sort;
    tools.append(search, select);
    const total = element("div", "collection-total");
    total.setAttribute("aria-live", "polite");
    const list = element("div", "collection-list");
    list.setAttribute("role", "list");
    const renderItems = () => {
      const items = collectionItems(source, filters);
      total.textContent = `${this._t.results}: ${this._number(items.length)} / ${this._number(source.length)}`;
      if (friends) total.textContent += ` · ${this._t.online_count}: ${this._number(source.filter((item) => item && isOnline(item.status)).length)}`;
      list.replaceChildren();
      if (!items.length) {
        const empty = element("div", "", this._t.no_matches);
        empty.setAttribute("role", "listitem");
        list.append(empty);
      }
      for (const item of items) {
        const row = element("div", "game-row");
        row.setAttribute("role", "listitem");
        if (friends && this._config.show_images) row.append(picture(item.avatar, "avatar", "steam"));
        const content = element("div", "game-content");
        const name = element("h3", "", item.personaname || item.name || "—");
        name.title = name.textContent;
        content.append(name);
        if (friends) {
          const names = { Online: "online", Offline: "offline", Busy: "busy", Away: "away", Snooze: "snooze",
            "Looking to trade": "trade", "Looking to play": "play" };
          const status = element("div", `status ${isOnline(item.status) ? "online" : ""}`);
          status.append(element("span", "dot"), element("span", "", this._t[names[item.status] || "unexpected_status"]));
          content.append(status);
          if (item.game && this._config.layout !== "single_line") content.append(element("p", "friend-game", item.game));
        }
        row.append(content);
        if (!friends) row.append(element("span", "row-value", `${this._number(nonnegative(item.hours), 1)} ${this._t.hours}`));
        list.append(row);
      }
    };
    search.addEventListener("input", () => { filters.query = search.value; renderItems(); });
    select.addEventListener("change", () => {
      if (friends) filters.onlineOnly = select.value === "online";
      else filters.sort = select.value;
      renderItems();
    });
    body.append(tools, total, list);
    renderItems();
  }

  _render(force = false) {
    if (!this._hass || !this._config) return;
    const { account, entities } = resolveEntities(this._config, this._registry?.accounts);
    const roles = VIEW_ROLES[this._config.view];
    const language = languageFor(this._config, this._hass);
    const watched = roles.map((role) => this._hass.states[entities[role]]);
    if (!force && this._language === language && this._watched?.length === watched.length
      && this._watched.every((value, index) => value === watched[index])) return;
    this._watched = watched;
    this._language = language;
    this._t = TRANSLATIONS[language];
    this._card.className = `${this._config.appearance} ${this._config.layout}`;
    const body = element("div", "body");
    this._heading(body, this._t[this._config.view], account);
    body.title = this._config.layout === "single_line" ? this._config.title || this._t[this._config.view] : "";
    const manual = roles.some((role) => this._config.entities[role]);
    if (!account && !manual) {
      const registry = this._registry;
      const message = registry?.loading ? "loading" : registry?.error ? "registry_error"
        : this._config.account ? "account_missing" : registry?.accounts.length > 1 ? "choose_account" : "no_accounts";
      this._empty(body, "Steam Tracker", this._t[message], "steam");
    } else if (this._config.view === "profile") this._profile(body, entities);
    else {
      const role = roles[0];
      const state = this._hass.states[entities[role]];
      const kind = sensorState(state);
      if (kind !== "ready") this._empty(body, this._t[kind], this._t[`${kind}_hint`], "info", entities[role]);
      else if (this._config.view === "current_game") this._currentGame(body, state);
      else if (this._config.view === "recent_games") this._recentGames(body, state, entities);
      else if (["library_stats", "player_stats"].includes(this._config.view)) this._statistics(body, state);
      else if (this._config.view === "top_games") this._topGames(body, state);
      else this._collection(body, state);
    }
    this._card.replaceChildren(body);
  }
}

const EDITOR_STYLES = `
  :host { display:block; color:var(--primary-text-color,#172331); font-family:system-ui,sans-serif; } * { box-sizing:border-box; }
  .form { display:grid; gap:17px; } .fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; } label { display:flex; flex-direction:column; gap:7px; font-size:12px; font-weight:600; } label.wide { grid-column:1/-1; }
  select,input:not([type=checkbox]) { width:100%; min-height:44px; border:1px solid var(--divider-color,#bdc8d2); border-radius:9px; padding:10px; background:var(--card-background-color,#fff); color:var(--primary-text-color,#172331); font:inherit; font-size:14px; }
  select:focus-visible,input:focus-visible,summary:focus-visible { outline:2px solid var(--primary-color,#1689cf); outline-offset:3px; } .check { flex-direction:row; align-items:center; gap:9px; min-height:34px; } input[type=checkbox] { width:18px; height:18px; accent-color:var(--primary-color,#1689cf); }
  .hint { color:var(--secondary-text-color,#657588); font-size:12px; line-height:1.6; margin:0; } details { border-top:1px solid var(--divider-color,#bdc8d2); padding-top:15px; } summary { font-size:13px; cursor:pointer; margin-bottom:15px; } .manual { display:grid; gap:12px; } .error { padding:12px; background:var(--error-color,#b33); color:#fff; border-radius:8px; font-size:12px; } @media(max-width:350px) { .fields { grid-template-columns:1fr; } }
`;

export class SteamTrackerCardEditor extends HTMLElementBase {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  setConfig(config) { this._config = normalizeConfig(config); this._render(true); }
  set hass(hass) {
    const previous = this._hass;
    this._hass = hass;
    connectRegistry(this);
    if (!this._rendered || previous?.language !== hass.language || previous?.entities !== hass.entities) this._render(true);
  }
  connectedCallback() { connectRegistry(this); this._render(true); }
  disconnectedCallback() { disconnectRegistry(this); }

  _change(key, value) {
    const config = { ...this._config, [key]: value };
    if (value === "" && ["account", "title"].includes(key)) delete config[key];
    this._config = normalizeConfig(config);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
    if (["view", "language", "account"].includes(key)) this._render(true);
  }

  _select(parent, label, key, options, value, change) {
    const field = element("label", key === "account" ? "wide" : "", label);
    const select = element("select");
    select.dataset.field = key;
    for (const [id, name] of options) {
      const option = element("option", "", name);
      option.value = id;
      select.append(option);
    }
    select.value = value ?? "";
    select.addEventListener("change", () => change ? change(select.value) : this._change(key, select.value));
    field.append(select);
    parent.append(field);
  }

  _render() {
    if (!this._config || !this._hass) return;
    const t = TRANSLATIONS[languageFor(this._config, this._hass)];
    const detailsOpen = this.shadowRoot.querySelector("details")?.open;
    const form = element("div", "form");
    form.append(element("p", "hint", t.editor_hint));
    if (this._registry?.error) form.append(element("p", "hint", t.registry_error));
    const fields = element("div", "fields");
    const accounts = this._registry?.accounts || [];
    const accountOptions = [["", t.automatic], ...accounts.map((account) => [account.id, account.name])];
    if (this._config.account && !accounts.some((account) => account.id === this._config.account)) {
      accountOptions.push([this._config.account, `${t.account_missing} (${this._config.account})`]);
    }
    this._select(fields, t.account, "account", accountOptions, this._config.account);
    this._select(fields, t.view, "view", VIEWS.map((view) => [view, t[view]]), this._config.view);
    this._select(fields, t.layout, "layout", ["detailed", "compact", "single_line"].map((value) => [value, t[value]]), this._config.layout);
    const title = element("label", "wide", t.title);
    const input = element("input");
    input.type = "text";
    input.value = this._config.title || "";
    input.dataset.field = "title";
    input.addEventListener("change", () => this._change("title", input.value));
    title.append(input);
    fields.append(title);
    this._select(fields, t.appearance, "appearance", [["theme", t.theme], ["steam", t.steam]], this._config.appearance);
    this._select(fields, t.language, "language", [["auto", t.auto], ["de", "Deutsch"], ["en", "English"]], this._config.language);
    if (this._config.view === "recent_games") {
      this._select(fields, t.limit, "limit", [1, 2, 3, 4, 5].map((value) => [String(value), String(value)]), String(this._config.limit),
        (value) => this._change("limit", Number(value)));
      this._select(fields, t.sort, "sort", [["recent", t.recent], ["playtime", t.playtime], ["total", t.total]], this._config.sort);
    }
    form.append(fields);
    const options = ["library_stats", "player_stats", "games"].includes(this._config.view) ? []
      : ["recent_games", "top_games"].includes(this._config.view) ? ["show_images", "show_achievements"] : ["show_images"];
    for (const key of options) {
      const label = element("label", "check");
      const check = element("input");
      check.type = "checkbox";
      check.checked = this._config[key];
      check.dataset.field = key;
      check.addEventListener("change", () => this._change(key, check.checked));
      label.append(check, document.createTextNode(t[key]));
      form.append(label);
    }
    const details = element("details");
    details.open = Boolean(detailsOpen);
    details.append(element("summary", "", t.advanced));
    const manual = element("div", "manual");
    const sensorIds = Object.keys(this._hass.states).filter((id) => id.startsWith("sensor.")).sort();
    for (const role of ROLES) {
      const configured = this._config.entities[role];
      const ids = configured && !sensorIds.includes(configured) ? [configured, ...sensorIds] : sensorIds;
      this._select(manual, role === "playtime" ? t.total_hours : t[role], `entities.${role}`, [["", t.default_entity], ...ids.map((id) => [id, id])], configured,
        (value) => {
          const entities = { ...this._config.entities };
          if (value) entities[role] = value;
          else delete entities[role];
          this._change("entities", entities);
        });
    }
    details.append(manual);
    form.append(details);
    this.shadowRoot.replaceChildren(element("style", "", EDITOR_STYLES), form);
    this._rendered = true;
  }
}

if (globalThis.customElements) {
  if (!customElements.get("steam-tracker-card")) customElements.define("steam-tracker-card", SteamTrackerCard);
  if (!customElements.get("steam-tracker-card-editor")) customElements.define("steam-tracker-card-editor", SteamTrackerCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((card) => card.type === "steam-tracker-card")) {
    window.customCards.push({ type: "steam-tracker-card", name: "Steam Tracker Card", preview: true,
      description: "Steam profile, games, library, achievements and friends. / Steam-Profil, Spiele, Bibliothek, Erfolge und Freunde." });
  }
}
