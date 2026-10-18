"""Hauspanel-Werkzeuge für KI-Assistenten (LLM-API, z. B. über den MCP-Server von HA).

Die Werkzeuge ändern ausschließlich das Hauspanel-Layout. Vor jeder Änderung wird
der vorherige Stand als Sicherung abgelegt und lässt sich mit hauspanel_undo
wiederherstellen. Grundriss-Dateien werden nicht verändert.
"""

from __future__ import annotations

import copy
import hashlib
import math
import re
import secrets
from typing import Any
import xml.etree.ElementTree as ET

try:  # HA >= 2026.x nutzt probatio, ältere Versionen voluptuous
    import probatio as vol
except ImportError:  # pragma: no cover
    import voluptuous as vol

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
    llm,
)
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import DOMAIN, SIGNAL_UPDATED

API_ID = DOMAIN
API_NAME = "Hauspanel"

_ToolResult = getattr(llm, "ToolResult", None)
_ToolAnnotations = getattr(llm, "ToolAnnotations", None)

FLOOR_ID_RE = re.compile(r"^[a-z0-9_-]{1,40}$")
ENTITY_ID_RE = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")

PIN_KEYS = {"id", "entity_id", "x", "y", "name", "room", "icon", "display", "status", "power_off", "extras"}
ROOM_KEYS = {"id", "name", "x", "y"}
FLOOR_KEYS = {"code", "name", "separated", "recolor", "css", "position"}
SETTINGS_KEYS = {"theme", "css", "night", "calendars", "waste", "weather_entity", "default_floor"}

PROMPT = """Hauspanel ist ein Grundriss-Dashboard für Wandtablets in Home Assistant.
Aufbau der Konfiguration:
- floors: Etagen mit id, code (Kürzel auf dem Etagen-Button, z. B. "EG"), name, separated, recolor, css
  - rooms: Raum-Labels {id, name, x, y}; x/y in Prozent der Grundrissbreite/-höhe ab oben links, das Label sitzt an der oberen linken Raumecke
  - pins: Geräte {id, entity_id, x, y (Prozent, Mittelpunkt des Pins), name, room, icon (mdi-/lucide-Name oder null), display ("icon"|"value"|"both"), status (null=automatisch, "mode", "none"), power_off (wird vom Power-Button der Etage ausgeschaltet), extras (bis zu 4 Zusatz-Entities im Popup, z. B. Leistung/Verbrauch)}
- theme: {light:{...Farben}, dark:{...Farben}, size:{font, radius, gap, margin, pad, cal, pin, pinFont, label}}
- css: eigenes CSS für die ganze Seite; floors[].css gilt nur für diese Etage
- calendars/waste: Listen {entity_id, name, color}; weather_entity; default_floor; night {mode:"time"|"sun"|"off", from, to}

Arbeitsweise: Erst hauspanel_get_config lesen. Für Positionen hauspanel_plan_info nutzen (erkannte Räume mit Prozent-Koordinaten, Textkarte). Die Raumerkennung kennt keine Namen – welcher Raum welcher ist, beim Nutzer erfragen, falls unklar.
Entities mit hauspanel_find_entities suchen, nie erfinden. Mehrere Pins/Räume in einem Aufruf setzen.
Jede Änderung legt automatisch eine Sicherung an; hauspanel_undo stellt den vorherigen Stand wieder her.
Änderungen erscheinen sofort auf allen Tablets. Ist der Editor im Browser gerade offen, kann dessen Speichern nicht mehr überschreiben, sondern meldet einen Konflikt."""


def _result(data: dict, error: bool = False):
    if _ToolResult is not None:
        return _ToolResult(data=data, error=error)
    return data


def _annotations(read_only: bool, destructive: bool = False, idempotent: bool = False):
    if _ToolAnnotations is None:
        return None
    return _ToolAnnotations(read_only=read_only, destructive=destructive, idempotent=idempotent, open_world=False)


class _HPTool(llm.Tool):
    integration = DOMAIN
    read_only = False

    def __init__(self) -> None:
        ann = _annotations(self.read_only, getattr(self, "destructive", False), getattr(self, "idempotent", False))
        if ann is not None:
            self.annotations = ann

    async def async_call(self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context: llm.LLMContext):
        data = hass.data.get(DOMAIN)
        if data is None:
            return _result({"error": "Hauspanel ist nicht eingerichtet"}, True)
        try:
            out = await self._run(hass, data, dict(tool_input.tool_args or {}), llm_context)
        except (ValueError, HomeAssistantError) as err:
            return _result({"error": str(err)}, True)
        return _result(out)

    async def _run(self, hass, data, args, llm_context) -> dict:  # pragma: no cover
        raise NotImplementedError


# ---------------------------------------------------------------- Hilfen

def _floor(cfg: dict, floor_id: str) -> dict:
    for f in cfg.get("floors", []):
        if f.get("id") == floor_id:
            return f
    raise ValueError(f"Etage '{floor_id}' gibt es nicht. Vorhanden: " + ", ".join(f"{f.get('id')} ({f.get('code')})" for f in cfg.get("floors", [])))


def _pct(v: Any, what: str) -> float:
    try:
        n = float(v)
    except (TypeError, ValueError) as err:
        raise ValueError(f"{what} muss eine Zahl sein") from err
    if not 0 <= n <= 100 or math.isnan(n):
        raise ValueError(f"{what} muss zwischen 0 und 100 liegen (Prozent)")
    return round(n, 1)


def _uid(prefix: str) -> str:
    return prefix + secrets.token_hex(4)


def _deep_merge(base: Any, patch: Any) -> Any:
    """JSON-Merge-Patch (RFC 7386): Objekte werden gemischt, null löscht, Listen werden ersetzt."""
    if not isinstance(patch, dict):
        return copy.deepcopy(patch)
    out = copy.deepcopy(base) if isinstance(base, dict) else {}
    for k, v in patch.items():
        if v is None:
            out.pop(k, None)
        else:
            out[k] = _deep_merge(out.get(k), v)
    return out


def _entity_info(hass: HomeAssistant, entity_id: str) -> dict:
    st = hass.states.get(entity_id)
    if st is None:
        return {"entity_id": entity_id, "missing": True}
    info = {"entity_id": entity_id, "name": st.name, "state": st.state}
    if unit := st.attributes.get("unit_of_measurement"):
        info["unit"] = unit
    return info


def _summary(hass: HomeAssistant, data) -> dict:
    cfg = data.config
    floors = []
    for f in cfg.get("floors", []):
        plan = data.plans.get(f.get("id"))
        floors.append({
            **{k: f.get(k) for k in ("id", "code", "name", "separated", "recolor")},
            "plan": None if not plan else ("bild" if f.get("raster") else "svg"),
            "css_zeilen": len((f.get("css") or "").splitlines()),
            "rooms": f.get("rooms", []),
            "pins": [
                {**p, **({"state": hass.states.get(p["entity_id"]).state} if hass.states.get(p.get("entity_id", "")) else {"missing": True})}
                for p in f.get("pins", [])
            ],
        })
    rest = {k: v for k, v in cfg.items() if k not in ("floors", "css")}
    rest["css"] = cfg.get("css") or ""
    return {"rev": cfg.get("_rev", 0), "floors": floors, **rest}


# ---------------------------------------------------------------- SVG-Analyse

_NUM = r"-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?"


def _parse_transform(t: str | None) -> tuple:
    m = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
    if not t:
        return m
    for name, raw in re.findall(r"(\w+)\s*\(([^)]*)\)", t):
        a = [float(x) for x in re.findall(_NUM, raw, re.I)]
        if name == "matrix" and len(a) == 6:
            n = tuple(a)
        elif name == "translate" and a:
            n = (1, 0, 0, 1, a[0], a[1] if len(a) > 1 else 0)
        elif name == "scale" and a:
            n = (a[0], 0, 0, a[1] if len(a) > 1 else a[0], 0, 0)
        elif name == "rotate" and a:
            r = math.radians(a[0]); c, s = math.cos(r), math.sin(r)
            cx, cy = (a[1], a[2]) if len(a) == 3 else (0, 0)
            n = (c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy)
        else:
            continue
        m = _mul(m, n)
    return m


def _mul(m, n):
    a, b, c, d, e, f = m
    A, B, C, D, E, F = n
    return (a * A + c * B, b * A + d * B, a * C + c * D, b * C + d * D, a * E + c * F + e, b * E + d * F + f)


def _first_num(v: str | None) -> float:
    if not v:
        return 0.0
    x = re.findall(_NUM, v, re.I)
    return float(x[0]) if x else 0.0


def plan_labels(svg: str) -> dict:
    """Liest viewBox und Textbeschriftungen (mit Prozent-Koordinaten) aus einem SVG."""
    root = ET.fromstring(svg)
    vb = [float(x) for x in re.findall(_NUM, root.get("viewBox", ""), re.I)]
    if len(vb) != 4:
        w, h = _first_num(root.get("width")) or 100, _first_num(root.get("height")) or 100
        vb = [0, 0, w, h]
    labels = []

    def walk(el, m):
        m = _mul(m, _parse_transform(el.get("transform")))
        tag = el.tag.rsplit("}", 1)[-1]
        if tag == "text":
            text = " ".join("".join(el.itertext()).split())
            if text:
                x, y = _first_num(el.get("x")), _first_num(el.get("y"))
                if not el.get("x"):
                    for ts in el:
                        if ts.get("x"):
                            x, y = _first_num(ts.get("x")), _first_num(ts.get("y"))
                            break
                px, py = m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]
                labels.append({"text": text, "x": round((px - vb[0]) / vb[2] * 100, 1), "y": round((py - vb[1]) / vb[3] * 100, 1)})
            return
        for ch in el:
            walk(ch, m)

    walk(root, (1.0, 0.0, 0.0, 1.0, 0.0, 0.0))
    return {"viewBox": vb, "seitenverhaeltnis": round(vb[2] / vb[3], 3) if vb[3] else None, "labels": labels}


# ---------------------------------------------------------------- Werkzeuge (lesen)

class GetConfigTool(_HPTool):
    name = "hauspanel_get_config"
    title = "Hauspanel-Layout lesen"
    description = "Liefert das komplette Hauspanel-Layout: Etagen mit Räumen und Pins (inkl. aktuellem Zustand), Design, CSS und Einstellungen. Grundriss-Dateien selbst sind nicht enthalten."
    read_only = True
    idempotent = True

    async def _run(self, hass, data, args, ctx):
        return _summary(hass, data)


class PlanInfoTool(_HPTool):
    name = "hauspanel_plan_info"
    title = "Grundriss analysieren"
    description = ("Analysiert den Grundriss einer Etage: erkennt Räume als helle Bodenflächen (getrennt an Türöffnungen) mit "
                   "Bounding-Box und Mittelpunkt in Prozent, liefert eine grobe Textkarte (Buchstaben = Räume, # = Wände) und "
                   "eventuelle Textbeschriftungen im SVG. Damit Raum-Labels an die obere linke Innenecke (links+1.5, oben+1.5) "
                   "und Pins sinnvoll in die Räume setzen. Funktioniert für SVG und Bilder; die Raumerkennung ist eine Schätzung.")
    parameters = vol.Schema({vol.Required("floor_id"): str})
    read_only = True
    idempotent = True

    async def _run(self, hass, data, args, ctx):
        f = _floor(data.config, args["floor_id"])
        svg = data.plans.get(f["id"])
        if not svg:
            return {"floor_id": f["id"], "plan": None, "hinweis": "Für diese Etage ist kein Grundriss hochgeladen."}
        key = hashlib.sha1(svg.encode()).hexdigest()
        cache = data.__dict__.setdefault("_plan_cache", {})
        if key not in cache:
            def work():
                from .plan_analysis import analyze  # noqa: PLC0415 – Pillow erst bei Bedarf laden

                out = analyze(svg)
                try:
                    out["beschriftungen"] = plan_labels(svg)["labels"]
                except ET.ParseError:
                    out["beschriftungen"] = []
                return out
            try:
                cache.clear()
                cache[key] = await hass.async_add_executor_job(work)
            except Exception as err:  # noqa: BLE001
                raise ValueError(f"Grundriss konnte nicht analysiert werden: {err}") from err
        info = cache[key]
        rooms = f.get("rooms", [])
        return {"floor_id": f["id"], "typ": "bild" if f.get("raster") else "svg", **info,
                "vorhandene_raum_labels": [{"name": r.get("name"), "x": r.get("x"), "y": r.get("y")} for r in rooms]}


class FindEntitiesTool(_HPTool):
    name = "hauspanel_find_entities"
    title = "Entities suchen"
    description = "Sucht Home-Assistant-Entities nach Text (ID, Name, Bereich) und/oder Domain. Liefert entity_id, Name, Zustand, Einheit, Bereich und ob sie schon als Pin im Hauspanel liegt."
    parameters = vol.Schema({
        vol.Optional("query"): str,
        vol.Optional("domains"): [str],
        vol.Optional("area"): str,
        vol.Optional("limit"): int,
    })
    read_only = True
    idempotent = True

    async def _run(self, hass, data, args, ctx):
        q = (args.get("query") or "").lower().split()
        domains = {d.lower() for d in args.get("domains") or []}
        area_q = (args.get("area") or "").lower()
        limit = max(1, min(int(args.get("limit") or 60), 300))
        ent_reg, dev_reg, area_reg = er.async_get(hass), dr.async_get(hass), ar.async_get(hass)
        placed = {}
        for f in data.config.get("floors", []):
            for p in f.get("pins", []):
                placed.setdefault(p.get("entity_id"), []).append(f.get("code"))
        out, total = [], 0
        for st in sorted(hass.states.async_all(), key=lambda s: s.entity_id):
            if domains and st.domain not in domains:
                continue
            entry = ent_reg.async_get(st.entity_id)
            if entry and (entry.hidden_by or entry.disabled_by):
                continue
            area_id = entry.area_id if entry else None
            if not area_id and entry and entry.device_id and (dev := dev_reg.async_get(entry.device_id)):
                area_id = dev.area_id
            area = area_reg.async_get_area(area_id).name if area_id and area_reg.async_get_area(area_id) else None
            if area_q and area_q not in (area or "").lower():
                continue
            hay = f"{st.entity_id} {st.name} {area or ''}".lower()
            if any(t not in hay for t in q):
                continue
            total += 1
            if len(out) >= limit:
                continue
            item = {"entity_id": st.entity_id, "name": st.name, "state": st.state}
            if unit := st.attributes.get("unit_of_measurement"):
                item["unit"] = unit
            if dc := st.attributes.get("device_class"):
                item["device_class"] = dc
            if area:
                item["area"] = area
            if st.entity_id in placed:
                item["im_panel"] = placed[st.entity_id]
            out.append(item)
        return {"treffer": total, "angezeigt": len(out), "entities": out}


class ListBackupsTool(_HPTool):
    name = "hauspanel_list_backups"
    title = "Sicherungen anzeigen"
    description = "Listet die automatischen Sicherungen des Layouts (neueste zuerst) mit Zeitpunkt und Auslöser."
    read_only = True
    idempotent = True

    async def _run(self, hass, data, args, ctx):
        return {"backups": [
            {"id": b["id"], "zeit": b["ts"], "vor": b["reason"], "zurueckgespielt": bool(b.get("restored")), "etagen": len(b["config"].get("floors", [])),
             "pins": sum(len(f.get("pins", [])) for f in b["config"].get("floors", []))}
            for b in reversed(data.history)
        ]}


# ---------------------------------------------------------------- Werkzeuge (schreiben)

class _WriteTool(_HPTool):
    async def _run(self, hass, data, args, ctx):
        cfg = copy.deepcopy(data.config)
        out = self._apply(hass, cfg, args) or {}
        if cfg == data.config:
            return {"ok": True, "geaendert": False, **out}
        rev = await data.async_save_config(cfg, reason=self.name)
        async_dispatcher_send(hass, SIGNAL_UPDATED)
        return {"ok": True, "geaendert": True, "rev": rev, **out}

    def _apply(self, hass, cfg, args) -> dict | None:  # pragma: no cover
        raise NotImplementedError


class UpsertPinsTool(_WriteTool):
    name = "hauspanel_set_pins"
    title = "Geräte-Pins setzen"
    description = ("Legt Geräte-Pins auf einer Etage an oder ändert sie (mehrere auf einmal). Ein Pin wird über 'id' gefunden, "
                   "sonst über 'entity_id' auf dieser Etage; gibt es keinen, wird er neu angelegt (dann sind entity_id, x und y Pflicht). "
                   "x/y = Mittelpunkt in Prozent der Grundrissbreite/-höhe ab oben links. Nur angegebene Felder werden geändert, null setzt ein Feld zurück.")
    parameters = vol.Schema({
        vol.Required("floor_id"): str,
        vol.Required("pins"): [vol.Schema({
            vol.Optional("id"): str,
            vol.Optional("entity_id"): str,
            vol.Optional("x"): vol.Coerce(float),
            vol.Optional("y"): vol.Coerce(float),
            vol.Optional("name"): vol.Any(str, None),
            vol.Optional("room"): vol.Any(str, None),
            vol.Optional("icon"): vol.Any(str, None),
            vol.Optional("display"): vol.In(["icon", "value", "both"]),
            vol.Optional("status"): vol.Any(None, vol.In(["mode", "none"])),
            vol.Optional("power_off"): bool,
            vol.Optional("extras"): [str],
        })],
    })

    def _apply(self, hass, cfg, args):
        f = _floor(cfg, args["floor_id"])
        pins = f.setdefault("pins", [])
        done, warn = [], []
        for item in args["pins"]:
            unknown = set(item) - PIN_KEYS
            if unknown:
                raise ValueError(f"Unbekannte Pin-Felder: {', '.join(sorted(unknown))}")
            pin = None
            if item.get("id"):
                pin = next((p for p in pins if p.get("id") == item["id"]), None)
                if pin is None:
                    raise ValueError(f"Pin-ID '{item['id']}' gibt es auf dieser Etage nicht")
            elif item.get("entity_id"):
                same = [p for p in pins if p.get("entity_id") == item["entity_id"]]
                if len(same) > 1:
                    raise ValueError(f"{item['entity_id']} liegt mehrfach auf der Etage – bitte per 'id' ansprechen")
                pin = same[0] if same else None
            else:
                raise ValueError("Jeder Pin braucht 'id' oder 'entity_id'")
            if pin is None:
                if "x" not in item or "y" not in item:
                    raise ValueError(f"Neuer Pin {item['entity_id']}: x und y sind Pflicht")
                eid = item["entity_id"]
                st = hass.states.get(eid)
                numeric = st is not None and _is_number(st.state)
                pin = {"id": _uid("p"), "entity_id": eid, "x": 0, "y": 0, "name": None, "room": None, "icon": None,
                       "power_off": eid.split(".")[0] in ("light", "switch", "fan", "media_player", "input_boolean"),
                       "extras": [], "display": "value" if eid.startswith("sensor.") and numeric else "icon"}
                pins.append(pin)
                action = "neu"
            else:
                action = "geändert"
            for k, v in item.items():
                if k == "id":
                    continue
                if k == "entity_id" and not ENTITY_ID_RE.match(v):
                    raise ValueError(f"Ungültige entity_id '{v}'")
                if k in ("x", "y"):
                    v = _pct(v, k)
                if k == "extras":
                    if len(v) > 4:
                        raise ValueError("Höchstens 4 Zusatzwerte pro Pin")
                    for e in v:
                        if not ENTITY_ID_RE.match(e):
                            raise ValueError(f"Ungültige entity_id '{e}' in extras")
                pin[k] = v
            for e in [pin["entity_id"], *pin.get("extras", [])]:
                if hass.states.get(e) is None:
                    warn.append(f"{e} existiert in HA nicht")
            done.append({"id": pin["id"], "entity_id": pin["entity_id"], "aktion": action, "x": pin["x"], "y": pin["y"]})
        return {"pins": done, **({"warnungen": warn} if warn else {})}


def _is_number(v: str) -> bool:
    try:
        float(v)
        return True
    except (TypeError, ValueError):
        return False


class RemovePinsTool(_WriteTool):
    name = "hauspanel_remove_pins"
    title = "Geräte-Pins entfernen"
    description = "Entfernt Pins von einer Etage, angegeben über Pin-ID oder entity_id."
    parameters = vol.Schema({vol.Required("floor_id"): str, vol.Required("pins"): [str]})
    destructive = True

    def _apply(self, hass, cfg, args):
        f = _floor(cfg, args["floor_id"])
        keys = set(args["pins"])
        before = f.get("pins", [])
        f["pins"] = [p for p in before if p.get("id") not in keys and p.get("entity_id") not in keys]
        return {"entfernt": len(before) - len(f["pins"])}


class UpsertRoomsTool(_WriteTool):
    name = "hauspanel_set_rooms"
    title = "Raum-Labels setzen"
    description = ("Legt Raum-Labels an oder ändert sie (mehrere auf einmal). Gefunden über 'id', sonst über den Namen. "
                   "x/y = obere linke Ecke des Labels in Prozent; das Label gehört an die obere linke Innenecke des Raums. "
                   "Wird ein Raum umbenannt, ziehen die zugeordneten Pins mit.")
    parameters = vol.Schema({
        vol.Required("floor_id"): str,
        vol.Required("rooms"): [vol.Schema({
            vol.Optional("id"): str,
            vol.Optional("name"): str,
            vol.Optional("x"): vol.Coerce(float),
            vol.Optional("y"): vol.Coerce(float),
        })],
    })

    def _apply(self, hass, cfg, args):
        f = _floor(cfg, args["floor_id"])
        rooms = f.setdefault("rooms", [])
        done = []
        for item in args["rooms"]:
            if set(item) - ROOM_KEYS:
                raise ValueError("Unbekannte Raum-Felder")
            room = None
            if item.get("id"):
                room = next((r for r in rooms if r.get("id") == item["id"]), None)
                if room is None:
                    raise ValueError(f"Raum-ID '{item['id']}' gibt es nicht")
            elif item.get("name"):
                room = next((r for r in rooms if r.get("name") == item["name"]), None)
            else:
                raise ValueError("Jeder Raum braucht 'id' oder 'name'")
            if room is None:
                if "x" not in item or "y" not in item or not item.get("name"):
                    raise ValueError("Neuer Raum: name, x und y sind Pflicht")
                room = {"id": _uid("r"), "name": item["name"], "x": 0, "y": 0}
                rooms.append(room)
            old = room.get("name")
            for k in ("name", "x", "y"):
                if k in item:
                    room[k] = _pct(item[k], k) if k != "name" else item[k].strip()
            if old and room["name"] != old:
                for p in f.get("pins", []):
                    if p.get("room") == old:
                        p["room"] = room["name"]
            done.append(room)
        return {"rooms": done}


class RemoveRoomsTool(_WriteTool):
    name = "hauspanel_remove_rooms"
    title = "Raum-Labels entfernen"
    description = "Entfernt Raum-Labels einer Etage (über ID oder Name)."
    parameters = vol.Schema({vol.Required("floor_id"): str, vol.Required("rooms"): [str]})
    destructive = True

    def _apply(self, hass, cfg, args):
        f = _floor(cfg, args["floor_id"])
        keys = set(args["rooms"])
        before = f.get("rooms", [])
        f["rooms"] = [r for r in before if r.get("id") not in keys and r.get("name") not in keys]
        return {"entfernt": len(before) - len(f["rooms"])}


class UpdateFloorTool(_WriteTool):
    name = "hauspanel_set_floor"
    title = "Etage anlegen/ändern"
    description = ("Ändert die Eigenschaften einer Etage oder legt sie an, wenn floor_id unbekannt ist (dann code und name angeben). "
                   "Felder: code (Kürzel, max. 4 Zeichen), name, separated (Trennlinie darüber), recolor (Farben anpassen bzw. Bild invertieren), "
                   "css (CSS nur für diese Etage), position (0 = oben in der Etagenliste). Grundrisse lassen sich nur im Editor hochladen.")
    parameters = vol.Schema({
        vol.Required("floor_id"): str,
        vol.Optional("code"): str,
        vol.Optional("name"): str,
        vol.Optional("separated"): bool,
        vol.Optional("recolor"): bool,
        vol.Optional("css"): str,
        vol.Optional("position"): int,
    })

    def _apply(self, hass, cfg, args):
        fid = args["floor_id"]
        if not FLOOR_ID_RE.match(fid):
            raise ValueError("floor_id: nur a-z, 0-9, _ und -, max. 40 Zeichen")
        floors = cfg.setdefault("floors", [])
        f = next((x for x in floors if x.get("id") == fid), None)
        created = f is None
        if created:
            if not args.get("code") or not args.get("name"):
                raise ValueError("Neue Etage: code und name sind Pflicht")
            f = {"id": fid, "code": "", "name": "", "separated": False, "recolor": True, "rooms": [], "pins": []}
            floors.append(f)
        for k in FLOOR_KEYS - {"position"}:
            if k in args:
                f[k] = args[k]
        if "code" in args and len(args["code"]) > 4:
            raise ValueError("code: höchstens 4 Zeichen")
        if "position" in args:
            floors.remove(f)
            floors.insert(max(0, min(args["position"], len(floors))), f)
        return {"etage": {k: f.get(k) for k in ("id", "code", "name", "separated", "recolor")}, "neu": created,
                "reihenfolge": [x.get("code") for x in floors]}


class RemoveFloorTool(_WriteTool):
    name = "hauspanel_remove_floor"
    title = "Etage löschen"
    description = "Löscht eine Etage samt Pins, Räumen und Grundriss. Lässt sich mit hauspanel_undo rückgängig machen, solange der Grundriss erhalten ist (er wird erst beim nächsten Speichern im Editor entfernt)."
    parameters = vol.Schema({vol.Required("floor_id"): str})
    destructive = True

    def _apply(self, hass, cfg, args):
        f = _floor(cfg, args["floor_id"])
        cfg["floors"].remove(f)
        if cfg.get("default_floor") == f["id"]:
            cfg.pop("default_floor", None)
        return {"geloescht": f["id"]}


class UpdateSettingsTool(_WriteTool):
    name = "hauspanel_update_settings"
    title = "Design & Einstellungen ändern"
    description = ("Ändert Design und allgemeine Einstellungen per JSON-Merge-Patch: Objekte werden gemischt, null löscht einen Wert "
                   "(= zurück zum Standard), Listen werden komplett ersetzt. Erlaubte Schlüssel: theme, css, night, calendars, waste, "
                   "weather_entity, default_floor. Beispiel: {\"theme\": {\"light\": {\"accent\": \"#2F6DD0\"}, \"size\": {\"pin\": 40}}}. "
                   "Farbschlüssel in theme.light/dark: accent, bg, card, tile, text, muted, dark, wall, floor, outside, pinOnBg, pinOnFg, "
                   "pinOffBg, pinOffFg, pinValBg, pinValFg, pinCamBg, pinCamFg, floorOnBg, floorOnFg, floorOffBg, floorOffFg, btnBg, btnFg, "
                   "btnSelBg, btnSelFg, powerBg, powerFg, toggleOn, toggleOff, clockBg, clockFg, weatherBg, weatherFg, soonBg, todayBg; "
                   "Schatten: sh.{pin|pinOn|floorOn|card} = {c: Farbe oder 'accent', o: Deckkraft 0-100, b: Weichheit px, y: Versatz px}. "
                   "theme.size: font (%), radius, gap, margin, pad, cal, pin, pinFont, label (px).")
    parameters = vol.Schema({vol.Required("patch"): dict})

    def _apply(self, hass, cfg, args):
        patch = args["patch"]
        bad = set(patch) - SETTINGS_KEYS
        if bad:
            raise ValueError(f"Nicht erlaubt: {', '.join(sorted(bad))}. Etagen bitte mit hauspanel_set_floor/_set_pins/_set_rooms ändern.")
        if "default_floor" in patch and patch["default_floor"] is not None:
            _floor(cfg, patch["default_floor"])
        for key, val in patch.items():
            if val is None:
                cfg.pop(key, None)
            else:
                cfg[key] = _deep_merge(cfg.get(key), val)
        return {k: cfg.get(k) for k in patch if k != "css"} | ({"css_zeilen": len((cfg.get("css") or "").splitlines())} if "css" in patch else {})


class UndoTool(_HPTool):
    name = "hauspanel_undo"
    title = "Änderung rückgängig machen"
    description = "Macht die letzte Änderung rückgängig (mehrfach aufrufbar, geht jeweils einen Schritt weiter zurück). Mit backup_id wird gezielt diese Sicherung wiederhergestellt – auch eine 'undo …'-Sicherung, das entspricht Wiederholen. Der aktuelle Stand wird vorher gesichert."
    parameters = vol.Schema({vol.Optional("backup_id"): str})

    async def _run(self, hass, data, args, ctx):
        if not data.history:
            raise ValueError("Es gibt keine Sicherung")
        bid = args.get("backup_id")
        if bid:
            b = next((x for x in data.history if x["id"] == bid), None)
            if b is None:
                raise ValueError(f"Sicherung '{bid}' gibt es nicht")
        else:  # neueste Sicherung, die noch nicht zurückgespielt wurde und nicht selbst von einem Undo stammt
            b = next((x for x in reversed(data.history) if not x.get("restored") and not x["reason"].startswith("undo")), None)
            if b is None:
                raise ValueError("Es gibt nichts mehr rückgängig zu machen")
        restored = copy.deepcopy(b["config"])
        restored["_rev"] = data.config.get("_rev", 0)
        b["restored"] = True
        rev = await data.async_save_config(restored, reason=f"undo {b['id']}")
        async_dispatcher_send(hass, SIGNAL_UPDATED)
        return {"ok": True, "wiederhergestellt": b["id"], "von": b["ts"], "rev": rev}


class HauspanelAPI(llm.API):
    """Werkzeuge zum Bearbeiten des Hauspanel-Layouts."""

    async def async_get_api_instance(self, llm_context: llm.LLMContext) -> llm.APIInstance:
        tools = [GetConfigTool(), PlanInfoTool(), FindEntitiesTool(), ListBackupsTool(), UpsertPinsTool(),
                 RemovePinsTool(), UpsertRoomsTool(), RemoveRoomsTool(), UpdateFloorTool(), RemoveFloorTool(),
                 UpdateSettingsTool(), UndoTool()]
        return llm.APIInstance(api=self, api_prompt=PROMPT, llm_context=llm_context, tools=tools)


@callback
def async_register_llm_api(hass: HomeAssistant):
    """Registriert die API; liefert die Abmelde-Funktion."""
    return llm.async_register_api(hass, HauspanelAPI(hass=hass, id=API_ID, name=API_NAME))
