# Steam Tracker Card

Eine Home-Assistant-Dashboardkarte für [Steam Tracker](https://github.com/lefidelity/steam-tracker).
Im visuellen Editor Konto und Ansicht wählen; mehrere Karten lassen sich zu einem Dashboard kombinieren.

**Quellcode-Version: 1.0.0** · [English documentation](../README.md) · [Bildübersicht](visual-guide.md)

![Eight card views in Steam blue, English, with fictional data](preview.png)

## Voraussetzungen

- Home Assistant **2025.10.0 oder neuer**.
- Die Steam-Tracker-Integration. Integration **1.0.0** liefert alle beschriebenen
  Attribute; ältere Versionen sind unter [Kompatibilität](#kompatibilität) aufgeführt.
- Die Integration muss auf die gewünschten Steam-Daten zugreifen können.
  Die Karte liest Home-Assistant-Sensoren und benötigt keinen API-Key.

Integration und Karte werden getrennt installiert. Die Integration funktioniert
auch ohne diese Karte. Zustände, Attribute und Aktualisierungsintervalle stehen in der
[deutschen Sensorreferenz](https://github.com/lefidelity/steam-tracker/blob/main/docs/sensors_de.md)
und der [englischen Referenz](https://github.com/lefidelity/steam-tracker/blob/main/docs/sensors_en.md).

## Installation

### HACS

1. Falls die Karte nicht gelistet ist, in HACS
   `https://github.com/lefidelity/steam-tracker-card` als benutzerdefiniertes
   Repository vom Typ **Dashboard** hinzufügen.
2. Steam Tracker Card herunterladen.
3. Unter **Einstellungen > Dashboards > Ressourcen** prüfen, ob
   `/hacsfiles/steam-tracker-card/steam-tracker-card.js` als **JavaScript-Modul**
   eingetragen ist. Falls nötig, hinzufügen. Das Ressourcenmenü kann den
   erweiterten Modus im Home-Assistant-Benutzerprofil voraussetzen.
4. Browser neu laden und **Steam Tracker Card** zum Dashboard hinzufügen.

[![Open Steam Tracker Card in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=lefidelity&repository=steam-tracker-card&category=plugin)

### Manuell

1. `dist/steam-tracker-card.js` aus dem Quellcode oder die JavaScript-Datei eines
   Releases nach `<HA-Konfigurationsordner>/www/steam-tracker-card.js` kopieren.
2. Falls `www` neu angelegt wurde, Home Assistant neu starten.
3. Unter **Einstellungen > Dashboards > Ressourcen**
   `/local/steam-tracker-card.js?v=1.0.0` als **JavaScript-Modul** eintragen.
4. Browser neu laden und die Karte hinzufügen.

Die Ressource nur einmal registrieren, entweder über den HACS- oder den manuellen
Pfad. Bei manuellen Updates die Datei ersetzen und den Versionsparameter ändern,
damit der Browser die neue Datei lädt.

## Ansichten und Darstellungen

| `view` | Inhalt |
| --- | --- |
| `profile` | Avatar, Name, Status, Steam-Level und XP-Fortschritt |
| `current_game` | Aktuelles Spiel mit Bild, Titel und Gesamtspielzeit |
| `recent_games` | Bis zu fünf kürzlich gespielte Spiele, Zwei-Wochen-Spielzeit und optional Erfolge |
| `library_stats` | Spieleanzahlen, Stunden, Anteil gespielter Spiele, Top-5-Anteil und Spielzeit-Verteilung |
| `player_stats` | Erfolgsanzahlen und -quoten, Abschlussgruppen, Kandidaten und Abzeichen |
| `top_games` | Bis zu fünf meistgespielte Spiele, Gesamtstunden und optional Erfolge |
| `friends` | Freunde mit Status und aktuellem Spiel; Suche und Online-Filter |
| `games` | Gesamte Bibliothek; Suche, Sortierung und minutengenaue Spielzeitfilter |

**Ausführlich** zeigt die meisten Informationen. **Kompakt** nutzt kleinere Bilder
und engere Abstände. **Einzeiler** zeigt je Listeneintrag eine Zeile beziehungsweise
eine Zusammenfassungszeile für Profil, aktuelles Spiel und Statistiken.
Die Bibliothekszusammenfassung enthält Spieleanzahl, Gesamtstunden und Spiele
unter einer Stunde; die Spielerzusammenfassung enthält freigeschaltete Erfolge,
perfekte Spiele und durchschnittlichen Erfolgsfortschritt.

Freunde und die gesamte Bibliothek werden bei langen Listen scrollbar. Die
Begrenzung kürzlich gespielter Spiele kürzt diese Listen nicht. Als Aussehen
stehen das Home-Assistant-Theme und **Steam-Blau** zur Wahl. Weitere Custom Cards
werden nicht benötigt.

Die [Bildübersicht](visual-guide.md) vergleicht alle 96 Kombinationen aus Ansicht,
Darstellung, Sprache und Aussehen. Konten und Spielgrafiken sind erfunden.

## Kontoauswahl und Konfiguration

Im visuellen Editor **Steam-Konto** und **Ansicht** wählen. Ein einziges erkanntes
Konto wird automatisch verwendet; bei mehreren Konten ist eine Auswahl nötig.
Die Erkennung nutzt die Entitätsregistrierung und funktioniert auch mit
umbenannten Entity-IDs. Bei gleichen Kontonamen helfen eindeutige Namen für die
jeweiligen Kontogeräte in Home Assistant.

**Benutzernamen anzeigen** steuert den Kontonamen in der Kopfzeile; der Spielername
im Profil bleibt sichtbar. **Titel anzeigen** steuert Überschrift und Symbol.
Ein eigener Titel bleibt beim Ausblenden gespeichert. Im Einzeiler ist die
Kopfzeile unabhängig von diesen Einstellungen verborgen.

Unter **Sensoren manuell zuweisen** lassen sich Sensoren desselben Kontos zuordnen.
Das funktioniert auch mit alten YAML-Sensoren oder ohne Zugriff auf die
Entitäts- und Geräteregistrierungen.

```yaml
type: custom:steam-tracker-card
view: profile
appearance: steam
layout: detailed
```

Bei mehreren Konten das Konto im Editor wählen, damit er den richtigen
`account`-Wert speichert. Dieser ist eine interne Konto-ID, kein Anzeigename.

```yaml
type: custom:steam-tracker-card
view: recent_games
limit: 3
sort: playtime
show_achievements: true
entities:
  recent_games: sensor.steam_tracker_recent
  recent_achievements: sensor.steam_tracker_recent_achievements
```

Bei manueller Zuordnung die tatsächlichen Entity-IDs verwenden.

| Option | Standard | Werte / Bedeutung |
| --- | --- | --- |
| `view` | `profile` | Eine der acht Ansichten oben |
| `account` | Automatisch bei einem Konto | Vom visuellen Editor gespeicherte Konto-ID |
| `title` | Ansichtstitel | Eigener Text |
| `show_title` | `true` | Überschrift und Symbol anzeigen |
| `show_username` | `true` | Kontonamen in der Kopfzeile anzeigen |
| `show_data_status` | `false` | Letzten erfolgreichen Abruf anzeigen |
| `layout` | `detailed` | `detailed`, `compact`, `single_line` |
| `appearance` | `theme` | `theme`, `steam` |
| `language` | `auto` | `auto`, `de`, `en`; andere Home-Assistant-Sprachen verwenden Englisch |
| `show_images` | `true` | Bilder in Ansichten mit Bildunterstützung anzeigen |
| `show_achievements` | `true` | Erfolge kürzlich gespielter und Top-5-Spiele; im Einzeiler verborgen |
| `limit` | `3` | Ganzzahl 1–5; nur kürzlich gespielte Spiele |
| `sort` | `recent` | Reihenfolge kürzlicher Spiele: `recent` (Steam-Reihenfolge), `playtime` (zwei Wochen), `total` (gesamt) |
| `library_sort` | `hours` | Bibliotheksvorgabe: `hours` (meistgespielt), `name` (A–Z) |
| `library_filter` | `all` | Bibliotheksvorgabe: `all`, `played`, `unplayed`, `under_1_hour`, `1_to_10_hours`, `10_to_50_hours`, `50_hours_or_more` |
| `item_action` | `none` | `none`, `steam`, `more-info`; Aktion beim Auswählen eines Spiel-/Freundesnamens |
| `entities` | Automatisch | Sensorzuordnung: `status`, `profile`, `game`, `recent_games`, `recent_achievements`, `playtime`, `global_stats`, `friends` |

### Profil und kürzlich gespielte Spiele

Ein Offline-Profil zeigt **Zuletzt online …**, wenn der Statussensor einen
gültigen `lastlogoff` liefert. Bei einem verbundenen Spieler mit laufendem Spiel
steht dort **Spielt: <Spielname>**. Der Status `Snooze` heißt in der Karte
**Inaktiv**, `Away` heißt **Abwesend**. Die Sensorwerte ändern sich dadurch nicht.

Kürzlich gespielte Spiele verwenden die Liste der Integration mit höchstens
fünf Einträgen. Sortiert wird nur innerhalb dieser Liste; **Steam-Reihenfolge**
behält die Reihenfolge der Antwort bei. Ausführliche Zeilen zeigen beispielsweise
`1,5 h / 240 h insgesamt`, mit **Letzte 2 Wochen** im Footer. Kompakt und Einzeiler
zeigen nur die Zwei-Wochen-Spielzeit. Die Erfolge beschreiben den gesamten
Spielfortschritt, nicht nur neu freigeschaltete Erfolge der letzten zwei Wochen.

### Bibliothek-Statistik

Die beiden Kacheln **Gespielte Spiele** zeigen den Prozentwert und die Anzahl.
Ab einer erfassten Minute zählt ein Spiel als gespielt, auch wenn gerundete
Stunden `0,0` anzeigen. Die Kachel **Unter 1 h gespielt** zählt auch ungespielte
Spiele. Der Verteilungsbalken **unter 1 h** zählt dagegen nur Spiele mit 1–59 Minuten.

| Verteilungslabel | Gesamte Spielminuten |
| --- | --- |
| Ungespielt | 0 |
| unter 1 h | 1–59 |
| unter 10 h | 60–599 |
| unter 50 h | 600–2999 |
| ab 50 h | Ab 3000 |

Die Balken zeigen den Anteil an der Bibliothek und die Spieleanzahl. Der
**Top-5-Anteil** ist der Anteil der fünf meistgespielten Spiele an allen erfassten
Minuten. Leere Bibliotheken zeigen null Anzahlen und Prozentwerte. Tooltips
erklären die genauen Zeitbereiche.

### Spieler-Statistik

Ausführlich und Kompakt verwenden diese Kachelpaare:

| Links | Rechts |
| --- | --- |
| Mögliche Erfolge | Freigeschaltete Erfolge (Anzahl) |
| Gesperrte Erfolge | ø Erfolgsfortschritt / Spiel |
| Freigeschaltete Erfolge (Prozentwert) | Perfekte Spiele |
| Abzeichen | Spielabzeichen |

**ø Erfolgsfortschritt / Spiel** mittelt die Abschlussquoten aller Spiele mit
Erfolgen. Jedes Spiel zählt gleich viel, auch eines ohne freigeschalteten Erfolg.
**Freigeschaltete Erfolge** als Prozentwert teilt alle freigeschalteten durch alle
möglichen Erfolge. Bei Spielen mit 1/1 und 0/99 ergeben sich durchschnittlich
50 Prozent und insgesamt 1 Prozent.

Spiele ohne Erfolge zählen bei beiden Quoten und perfekten Spielen nicht mit.
Sind keine Erfolge möglich, zeigt die Gesamtquote `—`; der Durchschnitt der
Integration ist dann 0. **Spielabzeichen** zählt Spiel-/Sammelkartenabzeichen,
keine einzelnen Sammelkarten.

Die Abschlussbalken verwenden sechs getrennte Gruppen: 0 %, >0–<25 %, 25–<50 %,
50–<75 %, 75–<100 % und 100 %. Die kurzen Labels lauten **0%**, **unter 25%**,
**unter 50%**, **unter 75%**, **unter 100%** und **100%**. Tooltips erklären die
genauen Grenzen. Spiele ohne Erfolge stehen unterhalb der Balken.

**Am nächsten dran an 100%** zeigt bis zu fünf unvollständige Spiele mit den
wenigsten fehlenden Erfolgen. Bei Gleichstand zählt der höhere exakte Fortschritt,
dann Name und App-ID. Spiele ohne freigeschalteten Erfolg können dazugehören;
abgeschlossene Spiele und Spiele ohne Erfolge nicht. Die Reihenfolge schätzt
weder die Schwierigkeit noch die benötigte Zeit bis zum Abschluss.

![Player statistics with fictional data](images/player-statistics.png)

### Datenstand

**Datenstand anzeigen** beziehungsweise `show_data_status: true` blendet einen
Footer wie **Erfolgreich aktualisiert vor 3 Minuten** ein. Sein Tooltip zeigt den
genauen Zeitpunkt. Der Text aktualisiert sich lokal jede Minute ohne Steam-Abfragen.

Der Footer nutzt `last_successful_update`. Bei mehreren Sensoren gilt der älteste
Zeitpunkt der angezeigten Quellen: im Profil Status und Level sowie das
eingeblendete aktuelle Spiel; bei kürzlich gespielten Spielen zusätzlich die
angezeigten Erfolgsdaten. Fehlt eine Quelle, ist sie unbekannt/nicht verfügbar
oder ihr Zeitpunkt fehlt, ist ungültig oder liegt in der Zukunft, bleibt der
Footer verborgen. `last_changed` und `last_updated` werden nicht verwendet.
Ein Cache-Treffer für Status/Spiel behält den ursprünglichen Abrufzeitpunkt.

![Data freshness with fictional player statistics](images/data-status.png)

### Bibliotheksfilter und Namensaktionen

In der **Spiele-Gesamtübersicht** lassen sich Suche, Sortierung und Spielzeitfilter
kombinieren. **Standardsortierung der Bibliothek** und **Standardfilter der Bibliothek**
legen die gespeicherten Vorgaben fest. Änderungen direkt auf der Karte gelten
bis zum Neuladen. Ein anderes Konto oder geänderte manuelle Sensorzuordnungen
setzen diese vorübergehende Auswahl zurück.

Die Filter verwenden die Minutenbereiche oben. **Bereits gespielt** bedeutet
mindestens eine Minute. Fehlende oder ungültige exakte Minutenwerte deaktivieren
den Spielzeitfilter und lassen alle Spiele sichtbar; Suche und Sortierung bleiben nutzbar.

Für aktuelles Spiel, kürzlich gespielte Spiele, Top-5-Spiele, die Bibliothek und
Freunde bietet **Klickaktion für Namen** die Auswahl **Keine Aktion**, **Steam öffnen**
oder **Sensordetails**. Steam-Links öffnen einen neuen Tab: Spiele den Shop,
Freunde eine gültige Steam-Profiladresse oder SteamID64. Sensordetails öffnet
den jeweiligen Kontosensor. Dieselbe Einstellung `item_action` gilt per YAML
auch für Abschlusskandidaten. Die Aktionen sind per Tastatur bedienbar und
standardmäßig deaktiviert.

```yaml
type: custom:steam-tracker-card
view: games
library_sort: name
library_filter: unplayed
item_action: steam
```

## Fehlende Daten und Privatsphäre

Fehlende Sensoren, `unknown` und `unavailable` haben unterschiedliche Meldungen.
Leere Bibliotheken und Freundeslisten sind gültige Ergebnisse. Nullwerte bleiben
sichtbar; unbekannter Erfolgsfortschritt wird nicht durch null ersetzt.
Status und Level eines Profils lassen sich auch anzeigen, wenn eine Quelle ausfällt.

Der Filter **Nur online** schließt verbundene Zustände wie Beschäftigt, Abwesend
und Inaktiv ein. Offline und unbekannter Status werden ausgeschlossen.

Spielbilder und Avatare lädt der Browser von den Adressen der Sensoren,
normalerweise Steams Bildserver. Bilder verwenden no-referrer. Die Karte
speichert und sendet keine Steam-API-Keys; sie nutzt die vorhandene Home-Assistant-Sitzung.

## Kompatibilität

| Funktion | Mindestversion der Integration |
| --- | --- |
| Kontogeräte für automatische Auswahl | 0.6.0 |
| Bibliothekskennzahlen und Spielzeit-Verteilung | 0.7.1 |
| Minutengenaue Filter, Bibliothekslinks zu Steam, Datenstand | 0.9.5 |
| Fehlende Erfolge, Gesamtquote, Abschlussgruppen und Kandidaten | 0.9.8 |

Ältere registrierte Sensoren lassen sich auch über Konfigurationseintrag oder
Unique-IDs gruppieren. YAML-Sensoren können manuell zugewiesen werden. Fehlende
neue Attribute blenden ihre zusätzlichen Kacheln/Balken aus; Werte werden nicht
erfunden. Integration und Karte haben unabhängige Versionen und werden separat aktualisiert.

## Vorschau und Prüfungen

`dist/steam-tracker-card.js` ist Quellcode und auslieferbares Modul. Die Karte
benötigt weder einen Build-Schritt noch zusätzliche Laufzeitpakete.

Im Projektordner starten:

```console
python -m http.server 8129 --bind 127.0.0.1
```

Dann `http://127.0.0.1:8129/preview/index.html` öffnen. Die Vorschau verwendet
erfundene Konten, fünf Spielillustrationen und lokale SVG-Dateien. Sie fragt Steam nicht ab.

Mit Node.js ab Version 20:

```console
node --check dist/steam-tracker-card.js
node --test tests/card.test.mjs
```

Die Browserprüfungen benötigen eine Entwicklungsinstallation von Playwright:

```console
node tests/browser.mjs
```

Optionale Argumente sind `--playwright <Pfad-zu-playwright/index.mjs>`,
`--browser <Browser-Datei>` und `--screenshot <Ausgabe.png>`. Testbilder in einem
temporären Ordner ablegen. Das Skript startet und beendet seinen lokalen HTTP-Server.

Automatische Prüfungen nutzen nachgebildete Home-Assistant-Daten. In einer
Installation insbesondere Editor speichern/neuladen, Kontoauswahl, umbenannte
Entitäten, eingeschränkte Benutzer, Neuladen der Integration, mobile Darstellungen
und Sections-/Masonry-Dashboards prüfen. Die HACS-Installation ist eine eigene
Prüfung neben der Browservorschau.

## Lizenz

[MIT-Lizenz](../LICENSE). Der vollständige Lizenztext und Copyright-Hinweis stehen
auch in `dist/steam-tracker-card.js` und werden mit der einzelnen Datei ausgeliefert.

Kein offizielles Produkt von Valve, Steam, Home Assistant oder HACS.
