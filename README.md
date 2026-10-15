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

**HACS**: Repo auf GitHub legen, dann in HACS über ⋮ → *Benutzerdefinierte Repositories* die URL mit dem Typ *Integration* hinzufügen.

Danach: *Einstellungen → Geräte & Dienste → Integration hinzufügen → Hauspanel*. In der Seitenleiste erscheint dann „Hauspanel“.

## Einrichten

Als Admin im Panel oben auf den Stift tippen:

1. **Etage** anlegen, Kürzel und Name vergeben, SVG hochladen.
2. **Raum-Label** setzen und an die obere linke Ecke des jeweiligen Raums ziehen.
3. **Geräte**: Entity suchen, am Griff auf den Plan ziehen. Tippen wählt das Gerät aus, dann lassen sich Name, Raum, Icon, Power-Button und Zusatzwerte einstellen.
4. **Allgemein**: Startetage, Wetter-Entity, Kalender mit Farbe, Müll-Sensoren mit Farbe und Nachtmodus festlegen.
5. **Speichern**.

### Müll-Sensoren

**Waste Collection Schedule** funktioniert direkt, egal in welchem Format: Zustand „in 3 Tagen“, „Morgen“ oder „Heute“, das Attribut `daysTo` oder die Termine in den Attributen (`details_format` *upcoming* bzw. *appointment_types*).
Eigene Template-Sensoren dürfen als Zustand ein Datum (`2026-10-16` oder `16.10.2026`) oder eine Anzahl Tage (`3`) liefern.
Im Editor steht unter *Allgemein* bei jedem Sensor, was erkannt wurde.

### Google Kalender

Die offizielle Integration *Google Calendar* einrichten. Die Kalender tauchen dann als `calendar.*` auf und lassen sich unter *Allgemein* auswählen.

## Tablet (Fully Kiosk)

- Start-URL: `http://<ha-adresse>:8123/hauspanel?kiosk`. Mit `?kiosk` deckt das Panel die HA-Seitenleiste ab, und der Bearbeiten-Stift wird ausgeblendet.
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
