# Hauspanel

Grundriss-Dashboard für Home Assistant, gebaut für Wandtablets (Fire HD 10 + Fully Kiosk).
Etagen, Grundrisse und Geräte richtest du direkt im Panel ein: SVG hochladen und Geräte per Drag & Drop platzieren.

- Grundriss pro Etage als SVG, Farben passen sich automatisch an Hell/Dunkel an
- Pins für Licht, Schalter, Heizung, Sensoren, Kameras, Rollläden, Schlösser, Media-Player, Szenen
- Popups: Helligkeit, Temperatur & Modus, Zusatzwerte (z. B. Watt/kWh), Kamera-Livebild erst nach Tap
- Power-Button pro Etage schaltet alle markierten Geräte aus
- Wetter mit 4-Tage-Vorschau, Müllabfuhr, Wochenkalender (Google Calendar über HA)
- Nachtmodus nach Uhrzeit oder Sonnenstand
- Layout liegt in HAs `.storage` und ist damit Teil des HA-Backups. Änderungen erscheinen sofort auf allen Tablets.

## Installation

**Manuell**: Den Ordner `custom_components/hauspanel` nach `/config/custom_components/hauspanel` kopieren, z. B. über das Samba- oder Studio-Code-Server-Add-on. Danach Home Assistant neu starten.

**HACS** (empfohlen): HACS → ⋮ → *Benutzerdefinierte Repositories* → `https://github.com/saschaweiss/ha-hauspanel`, Typ *Integration* → hinzufügen, dann „Hauspanel“ herunterladen und HA neu starten. Updates erscheinen danach automatisch in HACS.

Danach: *Einstellungen → Geräte & Dienste → Integration hinzufügen → Hauspanel*. In der Seitenleiste erscheint dann „Hauspanel“.

## Einrichten

Als Admin im Panel oben auf den Stift tippen:

1. **Etage** anlegen, Kürzel und Name vergeben, Grundriss hochladen: SVG (wird ans Design angepasst) oder JPG/PNG/WebP (wird auf 2400 px verkleinert und kann im Nachtmodus invertiert werden).
2. **Raum-Label** setzen und an die obere linke Ecke des jeweiligen Raums ziehen.
3. **Geräte**: Entity suchen, am Griff auf den Plan ziehen. Tippen wählt das Gerät aus, dann lassen sich Name, Raum, Anzeige (Icon, Wert oder beides), Farbe (Status an/aus oder wie Messwert; bei Heizungen „heizt gerade“ oder „Heizmodus an“), Icon, Größe (50–200 %, nur für dieses Gerät), Power-Button und Zusatzwerte einstellen. Raum-Labels haben ebenfalls eine eigene Größe.
4. **Allgemein**: Startetage, Wetter-Entity, Kalender mit Farbe und Zeitraum (Kalenderwoche, am Wochenende schon ab heute, oder immer die nächsten 7 Tage), Müll-Sensoren mit Farbe und Nachtmodus festlegen.
5. **Design**: Farben für Hell und Nachtmodus getrennt (Grundfarben plus Detailfarben für Pins an/aus/Messwert/Kamera, Etagen-Buttons, Buttons, Schalter, Uhr, Wetter und Hervorhebungen; Schatten mit Farbe, Deckkraft, Weichheit und Versatz), unter *Layout* die Breite der Etagen-Spalte und der rechten Spalte sowie die Kalenderhöhe (ganz nach links = ausblenden), außerdem Schriftgröße, Ecken, Abstände, Innenabstände, Pin-Größe und Label-Schrift. Ein Tipp auf ein Farbfeld öffnet einen eigenen Farbwähler: Hex-Code eintippen (auch kurz, z. B. `abc`), eine Farbe aus deiner Palette oder aus den schon benutzten Farben antippen oder das Farbrad öffnen. Mit + legst du Farben in die Palette, sie wird mit dem Layout gespeichert. Mit „Vorschau“ siehst du das Ergebnis mit Kalender und Wetter, bevor du speicherst.
6. **Eigenes CSS** (im Design-Tab → „CSS bearbeiten“): Ein verschiebbares Fenster mit vier Tabs. *Ganze Seite* gilt überall, *Nur <Etage>* nur solange diese Etage offen ist. Dazu ein *Spickzettel* mit allen Selektoren und Variablen und das *eingebaute CSS* zum Nachschlagen. Änderungen wirken sofort, auch in der Vorschau.
7. **Speichern**.

> Eigenes CSS ist eine Ebene über dem eingebauten und bleibt bei Updates erhalten. Hat man sich das Layout zerschossen: Panel mit `?nocss` aufrufen (z. B. `/hauspanel?nocss`), dann wird eigenes CSS ignoriert und der Editor ist wieder erreichbar.

Pins und Raum-Labels wachsen mit dem Grundriss mit. Was du im Editor platzierst, sitzt deshalb auf jedem Bildschirm proportional an derselben Stelle.

### Müll-Sensoren

**Waste Collection Schedule** funktioniert direkt, egal in welchem Format: Zustand „in 3 Tagen“, „Morgen“ oder „Heute“, das Attribut `daysTo` oder die Termine in den Attributen (`details_format` *upcoming* bzw. *appointment_types*).
Eigene Template-Sensoren dürfen als Zustand ein Datum (`2026-10-16` oder `16.10.2026`) oder eine Anzahl Tage (`3`) liefern.
Im Editor steht unter *Allgemein* bei jedem Sensor, was erkannt wurde.

### Google Kalender

Die offizielle Integration *Google Calendar* einrichten. Die Kalender tauchen dann als `calendar.*` auf und lassen sich unter *Allgemein* auswählen.

## Als Startseite

HA lässt im Profil nur Dashboards auswählen. Im Editor unter *Allgemein → Als Startseite* trägt „Für mich“ bzw. „Für alle Benutzer“ das Hauspanel direkt als Startseite ein. Es steht dann oben in der Seitenleiste und wird als aktiv markiert.

## Handy & Hochformat

Im Hochformat (Handy, Tablet hochkant) schaltet das Panel automatisch auf ein scrollbares Layout um: Etagen als Reiter oben, Grundriss in voller Breite, darunter Wetter, Müll und die Termine als Liste. Bearbeiten geht nur im Querformat.

## Tablet (Fully Kiosk)

- Start-URL: `http://<ha-adresse>:8123/hauspanel?kiosk` (bzw. `https://dyn.streb.digital/hauspanel?kiosk`). Mit `?kiosk` deckt das Panel die HA-Seitenleiste ab, und der Bearbeiten-Stift wird ausgeblendet.
- Für das Tablet einen eigenen HA-Benutzer **ohne** Adminrechte anlegen. Der kann schalten, aber nichts am Layout ändern.
- Nach 2 Minuten ohne Bedienung kehrt das Panel zur Startetage zurück und schließt offene Popups. Dadurch stoppt auch ein vergessener Kamerastream.
- Ein Tap auf die Uhr schaltet für 5 Minuten zwischen Hell und Dunkel um.

## KI-Assistent (Claude & Co.) über MCP

Hauspanel bringt Werkzeuge für KI-Assistenten mit. Damit kann z. B. Claude das Layout direkt in deinem HA bearbeiten: Entities suchen, Pins und Raum-Labels setzen, Etagen anlegen, Design und CSS ändern.

- Die Werkzeuge ändern **nur das Hauspanel-Layout**: keine Geräte schalten, keine Dateien schreiben, keine Neustarts.
- Vor jeder Änderung wird automatisch gesichert (die letzten 30 Stände). „Rückgängig“ geht jederzeit, auch für Änderungen aus dem Editor.
- Ist der Editor gerade offen, wenn sich das Layout von woanders ändert, meldet er das. Speichern überschreibt fremde Änderungen dann nicht stillschweigend.
- Grundrisse analysiert das Werkzeug selbst (Räume an Türöffnungen erkennen), damit Pins in den richtigen Raum kommen.

**Einrichten:**
1. *Einstellungen → System → Netzwerk → Home-Assistant-URL → Internet*: die externe Adresse eintragen, z. B. `https://dyn.streb.digital`. Ohne diese URL funktioniert die Anmeldung über OAuth nicht.
2. *Einstellungen → Geräte & Dienste → Integration hinzufügen → **Model Context Protocol Server***. Die Standardeinstellungen passen („Admin erforderlich“ bleibt an).
3. Im KI-Client einen eigenen Connector mit der URL `https://<deine-adresse>/api/mcp/hauspanel` anlegen und mit einem **Admin**-Konto bei HA anmelden. Diese URL bietet nur die Hauspanel-Werkzeuge an, nicht die Gerätesteuerung von Assist.

Werkzeuge: `hauspanel_get_config`, `hauspanel_plan_info`, `hauspanel_find_entities`, `hauspanel_set_pins`, `hauspanel_remove_pins`, `hauspanel_set_rooms`, `hauspanel_remove_rooms`, `hauspanel_set_floor`, `hauspanel_remove_floor`, `hauspanel_update_settings`, `hauspanel_list_backups`, `hauspanel_undo`.

## Entwicklung

Der Quellcode liegt in `src/panel.src.js`. Gebaut wird mit:

```
npm i lucide-static
python3 tools/build.py node_modules/lucide-static/icons
```

Das schreibt `custom_components/hauspanel/frontend/hauspanel-panel.js` mit eingebetteten Lucide-Icons (ISC). Die Schrift ist Inter (SIL OFL) und wird lokal ausgeliefert.
