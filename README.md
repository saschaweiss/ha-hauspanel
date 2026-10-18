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
3. **Geräte**: Entity suchen, am Griff auf den Plan ziehen. Tippen wählt das Gerät aus, dann lassen sich Name, Raum, Anzeige (Icon, Wert oder beides), Farbe (Status an/aus oder wie Messwert; bei Heizungen „heizt gerade“ oder „Heizmodus an“), Icon, Power-Button und Zusatzwerte einstellen.
4. **Allgemein**: Startetage, Wetter-Entity, Kalender mit Farbe, Müll-Sensoren mit Farbe und Nachtmodus festlegen.
5. **Design**: Farben für Hell und Nachtmodus getrennt (Grundfarben plus Detailfarben für Pins an/aus/Messwert/Kamera, Etagen-Buttons, Buttons, Schalter, Uhr, Wetter und Hervorhebungen; Schatten mit Farbe, Deckkraft, Weichheit und Versatz), außerdem Schriftgröße, Ecken, Abstände, Innenabstände, Kalenderhöhe, Pin-Größe und Label-Schrift. Mit „Vorschau“ siehst du das Ergebnis mit Kalender und Wetter, bevor du speicherst.
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

## Tablet (Fully Kiosk)

- Start-URL: `http://<ha-adresse>:8123/hauspanel?kiosk` (bzw. `https://<your-ha-address>/hauspanel?kiosk`). Mit `?kiosk` deckt das Panel die HA-Seitenleiste ab, und der Bearbeiten-Stift wird ausgeblendet.
- Für das Tablet einen eigenen HA-Benutzer **ohne** Adminrechte anlegen. Der kann schalten, aber nichts am Layout ändern.
- Nach 2 Minuten ohne Bedienung kehrt das Panel zur Startetage zurück und schließt offene Popups. Dadurch stoppt auch ein vergessener Kamerastream.
- Ein Tap auf die Uhr schaltet für 5 Minuten zwischen Hell und Dunkel um.

## Entwicklung

Der Quellcode liegt in `src/panel.src.js`. Gebaut wird mit:

```
npm i lucide-static
python3 tools/build.py node_modules/lucide-static/icons
```

Das schreibt `custom_components/hauspanel/frontend/hauspanel-panel.js` mit eingebetteten Lucide-Icons (ISC). Die Schrift ist Inter (SIL OFL) und wird lokal ausgeliefert.
