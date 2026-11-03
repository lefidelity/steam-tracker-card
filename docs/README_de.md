# Steam Tracker Card

Eine konfigurierbare Lovelace-Karte für **Steam Tracker**: Karte hinzufügen,
Steam-Konto und Ansicht auswählen, mehrere Karten zum eigenen Dashboard kombinieren.
Mit visuellem Editor, Deutsch/Englisch und Unterstützung für helle und dunkle Themes.

[English documentation and full configuration reference](../README.md)

![Acht Ansichten mit erfundenen Beispieldaten](preview.png)

Darstellungsvorschauen: [Kompakt](preview-compact.png) · [Einzeiler](preview-single-line.png).

## Ansichten

| Ansicht | Inhalt |
| --- | --- |
| Profil (`profile`) | Avatar, Spielername, Status, Level und XP-Fortschritt |
| Aktuelles Spiel (`current_game`) | Spielbild, Titel und Gesamtspielzeit |
| Kürzlich gespielt (`recent_games`) | Spiele der letzten zwei Wochen, Spielzeiten und optional Erfolge |
| Bibliothek-Statistik (`library_stats`) | Spieleanzahl, Spielzeit, Spielquote, ungespielte Spiele, Top-5-Anteil und Spielzeit-Verteilung |
| Spieler-Statistik (`player_stats`) | Erfolge, perfekte Spiele, durchschnittlicher Abschluss und Abzeichen |
| Top-5-Spiele (`top_games`) | Die fünf meistgespielten Spiele mit Spielzeit und optional Erfolgen |
| Freunde (`friends`) | Freunde mit Status und aktuellem Spiel; Suche und Online-Filter |
| Spiele-Gesamtübersicht (`games`) | Vollständige Bibliothek mit Spielzeiten, Suche und Sortierung |

Mit den erweiterten Sensordaten zeigt die Bibliothek-Statistik zusätzlich die
Spielquote, gespielte und ungespielte Spiele und den Top-5-Anteil an der Gesamtzeit.
Ausführlich und Kompakt enthalten fünf Balken: ungespielt, gespielt unter einer
Stunde, 1–<10 Stunden, 10–<50 Stunden und mindestens 50 Stunden. Jeder Balken zeigt
den Anteil an der gesamten Bibliothek und daneben die Spieleanzahl. Ob ein Spiel
ungespielt ist, bestimmen die exakten Steam-Minuten. Leere Bibliotheken zeigen
Nullwerte; bei älteren Sensoren erscheinen die Ergänzungen nach dem Update der
Integration. Der Einzeiler behält seine drei bisherigen Hauptkennzahlen.

Ausführlich, Kompakt oder Einzeiler; Home-Assistant-Theme oder Steam-Blau.
Zusätzliche Karten wie button-card, bar-card oder card-mod werden nicht benötigt.

**Kompakt** zeigt kleine Bilder, engere Abstände und Profil beziehungsweise
aktuelles Spiel nebeneinander statt untereinander. **Einzeiler** reduziert Profil,
aktuelles Spiel und Statistiken auf eine Zeile; Listen zeigen eine Zeile pro
Eintrag. Bei Statistiken bleiben die drei wichtigsten Kennzahlen sichtbar,
XP-Details und Erfolgsaufschlüsselungen entfallen. Freunde und Spiele behalten
ihre Suchfelder und werden bei langen Listen scrollbar. Die Begrenzung für
kürzlich gespielte Spiele kürzt diese vollständigen Listen nicht. Suche und
Listenfilter gelten lokal für die Karte und werden beim Neuladen zurückgesetzt.

## Voraussetzungen

- Home Assistant ab 2025.10. Browserprüfungen nutzen eine Simulation;
  die Installation in einer echten Home-Assistant-Oberfläche muss noch geprüft werden.
- Die [Steam-Tracker-Integration](https://github.com/lefidelity/steam-tracker).
  Die automatische Kontozuordnung nutzt Sensor-Unique-IDs und Kontogeräte
  (Integrationsstand `89b2fb8` oder neuer). Ältere registrierte Sensoren können
  über den Konfigurationseintrag gruppiert werden; YAML-Sensoren lassen sich
  manuell zuweisen.
- Die Integration muss auf die Steam-Daten zugreifen können. Die Karte behebt
  keine Zugangsdaten- oder Privatsphäre-Probleme.

## Installation

Das Repository ist [lefidelity/steam-tracker-card](https://github.com/lefidelity/steam-tracker-card).
Ein Eintrag in der HACS-Standardliste besteht noch nicht. HACS-Validierung und
Tests in einer echten Home-Assistant-Instanz stehen noch aus.

### HACS

1. `https://github.com/lefidelity/steam-tracker-card` als
   benutzerdefiniertes Repository vom Typ **Dashboard** hinzufügen.
2. Karte herunterladen.
3. Unter **Einstellungen → Dashboards → Ressourcen** prüfen, ob
   `/hacsfiles/steam-tracker-card/steam-tracker-card.js` als **JavaScript-Modul**
   eingetragen wurde. Falls nötig, selbst hinzufügen. Eventuell muss der
   erweiterte Modus aktiviert sein.
4. Browser neu laden und **Steam Tracker Card** zum Dashboard hinzufügen.

[![Steam Tracker Card in HACS öffnen](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=lefidelity&repository=steam-tracker-card&category=plugin)

### Manuell

1. `dist/steam-tracker-card.js` nach
   `<HA-Konfigurationsordner>/www/steam-tracker-card.js` kopieren.
2. Wenn `www` neu angelegt wurde, Home Assistant neu starten.
3. Unter **Einstellungen → Dashboards → Ressourcen**
   `/local/steam-tracker-card.js?v=0.7.2` als **JavaScript-Modul** hinzufügen.
4. Browser neu laden und die Karte über die Kartenauswahl hinzufügen.

Nur eine Ressource registrieren. Bei manuellen Updates den Versionsparameter
der URL ändern und den Browser neu laden.

## Bedienung

Im visuellen Editor **Konto** und **Ansicht** wählen. Ein einziges erkanntes Konto
wird automatisch verwendet. Bei mehreren Konten ist eine explizite Auswahl nötig.
Umbenannte Entity-IDs werden über die Registrierung erkannt. Bei gleichen
Kontonamen hilft ein eindeutiger Name für das jeweilige Kontogerät.

Titel, Darstellung, Aussehen, Sprache und Bilder sind einstellbar. Für kürzlich
gespielte Spiele gibt es zusätzlich Anzahl (1–5), Sortierung und Erfolge.
Auch bei den Top-5-Spielen lassen sich Erfolge ein- und ausblenden; diese Ansicht
zeigt immer bis zu fünf Spiele. Alle acht Sensorrollen können manuell zugewiesen werden.
Die Integration liefert derzeit höchstens fünf kürzlich gespielte Spiele;
Sortierung und Begrenzung wirken nur auf diese Liste. „Steam-Reihenfolge“ behält
die Reihenfolge der API bei.

Unter **Sensoren manuell zuweisen** können einzelne Zuordnungen überschrieben
werden. Das funktioniert auch bei älteren YAML-Sensoren oder fehlendem Zugriff
auf die Registrierungen. Ein API-Key gehört nicht in die Kartenkonfiguration.

```yaml
type: custom:steam-tracker-card
view: current_game
appearance: steam
entities:
  game: sensor.steam_tracker_game
```

Alle Optionen und weitere Beispiele stehen in der [englischen Referenz](../README.md#configure-in-the-visual-editor).

```yaml
type: custom:steam-tracker-card
view: friends
layout: compact
```

```yaml
type: custom:steam-tracker-card
view: library_stats
layout: single_line
```

## Fehlende Daten

Die Karte unterscheidet fehlende Sensoren, noch unbekannte Werte, nicht
verfügbare Daten und tatsächlich leere Listen. Level 0 und 0 % Erfolge bleiben
gültige Werte. Bei einem teilweise privaten Profil kann beispielsweise der
Status sichtbar bleiben, während das Level fehlt.

Die Karte liest vorhandene Home-Assistant-Sensoren und fragt Steam nicht selbst
ab. Spielbilder und Avatare werden im normalen Betrieb von den durch die
Integration angegebenen Bildservern geladen. Die lokale Vorschau nutzt nur
erfundene Daten und lokale Illustrationen.

## Vorschau und Prüfungen

Im Projektordner starten:

```console
python -m http.server 8129 --bind 127.0.0.1
```

Dann `http://127.0.0.1:8129/preview/index.html` öffnen. Theme, Sprache, Darstellung,
Datenzustände und mehrere Konten können interaktiv ausprobiert werden.

Mit Node.js ab Version 20:

```console
node --check dist/steam-tracker-card.js
node --test tests/card.test.mjs
```

Die optionale Browserprüfung mit Playwright ist in der englischen Anleitung
beschrieben. Für die Laufzeitprüfung sind Tests in Home Assistant nötig,
insbesondere Speichern/Neuladen des Editors, Kontoauswahl, umbenannte Entitäten,
eingeschränkte Benutzer sowie Sections- und Masonry-Dashboards.

## Namen und Veröffentlichung

Die beiden Projekte heißen `steam-tracker` und `steam-tracker-card`, ohne
`hacs-`-Präfix. Das Integrationsrepository ist unter
`https://github.com/lefidelity/steam-tracker` erreichbar. Die technische Domain bleibt `steam_tracker`;
Sensor-IDs und Attribute müssen wegen des Repository-Namens nicht geändert werden.

Die Karte hat mit [lefidelity/steam-tracker-card](https://github.com/lefidelity/steam-tracker-card)
ein eigenes Repository und eine unabhängige Version. Version 0.7.2 wird als
einzelne JavaScript-Datei im Release bereitgestellt. HACS-Installation und
Home-Assistant-Laufzeitprüfungen stehen noch aus.

MIT-Lizenz. Kein offizielles Produkt von Valve, Steam, Home Assistant oder HACS.
