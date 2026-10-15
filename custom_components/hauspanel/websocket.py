"""WebSocket-API für Panel und Editor."""

from __future__ import annotations

import json
import re
from typing import Any

try:  # HA >= 2026.x nutzt probatio, ältere Versionen voluptuous
    import probatio as vol
except ImportError:  # pragma: no cover
    import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import (
    async_dispatcher_connect,
    async_dispatcher_send,
)

from .const import DOMAIN, MAX_CONFIG_BYTES, MAX_PLAN_BYTES, SIGNAL_UPDATED

FLOOR_ID_RE = re.compile(r"^[a-z0-9_-]{1,40}$")

_SVG_STRIP = [
    re.compile(r"<\?xml[^>]*\?>", re.I),
    re.compile(r"<!DOCTYPE[^>\[]*(\[[\s\S]*?\])?\s*>", re.I),
    re.compile(r"<!ENTITY[\s\S]*?>", re.I),
    re.compile(r"<!--[\s\S]*?-->"),
    re.compile(r"<script[\s\S]*?</script\s*>", re.I),
    re.compile(r"<script[^>]*/>", re.I),
    re.compile(r"<foreignObject[\s\S]*?</foreignObject\s*>", re.I),
    re.compile(r"<(iframe|embed|object)[\s\S]*?(/>|</\1\s*>)", re.I),
    re.compile(r"\son[a-z]+\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)", re.I),
    re.compile(r"(href|xlink:href)\s*=\s*([\"'])\s*(javascript|data):[^\"']*\2", re.I),
]


def sanitize_svg(svg: str) -> str:
    """Entfernt alles Ausführbare. Das Frontend säubert zusätzlich per DOM."""
    for pattern in _SVG_STRIP:
        svg = pattern.sub("", svg)
    svg = svg.strip()
    if not svg.lower().startswith("<svg"):
        raise ValueError("Datei ist kein SVG")
    return svg


def _payload(hass: HomeAssistant) -> dict[str, Any]:
    data = hass.data[DOMAIN]
    return {"config": data.config, "plans": data.plans}


def _not_ready(connection: websocket_api.ActiveConnection, msg_id: int) -> bool:
    if DOMAIN not in connection.hass.data:
        connection.send_error(msg_id, "not_ready", "Hauspanel ist nicht eingerichtet")
        return True
    return False


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_save_plan)


@callback
@websocket_api.websocket_command({vol.Required("type"): "hauspanel/get"})
def ws_get(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    if _not_ready(connection, msg["id"]):
        return
    connection.send_result(msg["id"], _payload(hass))


@callback
@websocket_api.websocket_command({vol.Required("type"): "hauspanel/subscribe"})
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Liefert das Layout sofort und bei jeder Änderung erneut (Tablet aktualisiert live)."""
    if _not_ready(connection, msg["id"]):
        return

    @callback
    def forward() -> None:
        if DOMAIN in hass.data:
            connection.send_message(websocket_api.event_message(msg["id"], _payload(hass)))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UPDATED, forward)
    connection.send_result(msg["id"])
    forward()


@websocket_api.websocket_command(
    {vol.Required("type"): "hauspanel/config/save", vol.Required("config"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save_config(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    if _not_ready(connection, msg["id"]):
        return
    config = msg["config"]
    if len(json.dumps(config)) > MAX_CONFIG_BYTES:
        connection.send_error(msg["id"], "too_large", "Konfiguration ist zu groß")
        return
    floors = config.get("floors")
    if not isinstance(floors, list) or any(
        not isinstance(f, dict) or not FLOOR_ID_RE.match(str(f.get("id", ""))) for f in floors
    ):
        connection.send_error(msg["id"], "invalid", "Ungültige Etagen-Konfiguration")
        return
    await hass.data[DOMAIN].async_save_config(config)
    async_dispatcher_send(hass, SIGNAL_UPDATED)
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "hauspanel/plan/save",
        vol.Required("floor_id"): str,
        vol.Optional("svg"): vol.Any(str, None),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save_plan(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    if _not_ready(connection, msg["id"]):
        return
    floor_id = msg["floor_id"]
    if not FLOOR_ID_RE.match(floor_id):
        connection.send_error(msg["id"], "invalid", "Ungültige Etagen-ID")
        return
    svg = msg.get("svg")
    if svg is not None:
        if len(svg.encode()) > MAX_PLAN_BYTES:
            connection.send_error(msg["id"], "too_large", "SVG ist größer als 2 MB")
            return
        try:
            svg = sanitize_svg(svg)
        except ValueError as err:
            connection.send_error(msg["id"], "invalid", str(err))
            return
    await hass.data[DOMAIN].async_save_plan(floor_id, svg)
    async_dispatcher_send(hass, SIGNAL_UPDATED)
    connection.send_result(msg["id"])
