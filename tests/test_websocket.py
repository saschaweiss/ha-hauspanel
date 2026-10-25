"""WebSocket API used by the panel and the editor."""

import pytest

from custom_components.hauspanel.const import DOMAIN
from custom_components.hauspanel.websocket import sanitize_svg

from .conftest import floor

SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'


async def test_get_returns_config_and_plans(hass, setup_hauspanel, hass_ws_client):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "hauspanel/get"})
    msg = await ws.receive_json()
    assert msg["success"]
    assert msg["result"]["config"]["floors"] == []
    assert msg["result"]["plans"] == {}


async def test_save_config_increments_rev_and_backs_up(hass, setup_hauspanel, hass_ws_client):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "hauspanel/config/save", "config": {"floors": [floor()]}})
    msg = await ws.receive_json()
    assert msg["success"] and msg["result"]["rev"] == 1
    await ws.send_json({"id": 2, "type": "hauspanel/config/save", "config": {"floors": [floor(), floor("eg")], "_rev": 1}})
    msg = await ws.receive_json()
    assert msg["success"] and msg["result"]["rev"] == 2
    data = hass.data[DOMAIN]
    assert [f["id"] for f in data.config["floors"]] == ["og", "eg"]
    assert len(data.history) == 1 and data.history[0]["config"]["_rev"] == 1


async def test_save_config_conflict(hass, setup_hauspanel, hass_ws_client):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "hauspanel/config/save", "config": {"floors": [floor()]}})
    await ws.receive_json()
    # an editor that loaded rev 0 must not silently overwrite rev 1
    await ws.send_json({"id": 2, "type": "hauspanel/config/save", "config": {"floors": [], "_rev": 0}})
    msg = await ws.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "conflict"
    await ws.send_json({"id": 3, "type": "hauspanel/config/save", "config": {"floors": [], "_rev": 0}, "force": True})
    assert (await ws.receive_json())["success"]


@pytest.mark.parametrize("floors", [None, "x", [{"id": "Bad ID"}], [{"id": "a" * 41}], ["og"]])
async def test_save_config_rejects_invalid_floors(hass, setup_hauspanel, hass_ws_client, floors):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "hauspanel/config/save", "config": {"floors": floors}})
    msg = await ws.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "invalid"


async def test_save_config_requires_admin(hass, setup_hauspanel, hass_ws_client, hass_read_only_access_token):
    ws = await hass_ws_client(hass, hass_read_only_access_token)
    await ws.send_json({"id": 1, "type": "hauspanel/config/save", "config": {"floors": []}})
    msg = await ws.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "unauthorized"


async def test_save_plan_sanitizes_and_notifies(hass, setup_hauspanel, hass_ws_client):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "hauspanel/subscribe"})
    assert (await ws.receive_json())["success"]
    first = await ws.receive_json()
    assert first["type"] == "event" and first["event"]["plans"] == {}
    evil = SVG.replace("<rect", '<script>alert(1)</script><rect onclick="x()"')
    await ws.send_json({"id": 2, "type": "hauspanel/plan/save", "floor_id": "og", "svg": evil})
    msgs = [await ws.receive_json(), await ws.receive_json()]
    event = next(m for m in msgs if m["type"] == "event")
    assert next(m for m in msgs if m["type"] == "result")["success"]
    stored = event["event"]["plans"]["og"]
    assert "<script" not in stored and "onclick" not in stored and "<rect" in stored


async def test_save_plan_rejects_non_svg_and_bad_id(hass, setup_hauspanel, hass_ws_client):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "hauspanel/plan/save", "floor_id": "og", "svg": "<html></html>"})
    assert (await ws.receive_json())["error"]["code"] == "invalid"
    await ws.send_json({"id": 2, "type": "hauspanel/plan/save", "floor_id": "../x", "svg": SVG})
    assert (await ws.receive_json())["error"]["code"] == "invalid"


async def test_plan_of_deleted_floor_removed_on_editor_save(hass, setup_hauspanel, hass_ws_client):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "hauspanel/config/save", "config": {"floors": [floor()]}})
    await ws.receive_json()
    await ws.send_json({"id": 2, "type": "hauspanel/plan/save", "floor_id": "og", "svg": SVG})
    await ws.receive_json()
    await ws.send_json({"id": 3, "type": "hauspanel/config/save", "config": {"floors": [], "_rev": 1}})
    await ws.receive_json()
    assert hass.data[DOMAIN].plans == {}


@pytest.mark.parametrize(
    ("svg", "absent"),
    [
        ('<svg><a href="javascript:alert(1)">x</a></svg>', "javascript:"),
        ("<svg><foreignObject><div>x</div></foreignObject></svg>", "foreignObject"),
        ('<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY x "y">]><svg/>', "ENTITY"),
        ('<svg><iframe src="x"></iframe></svg>', "iframe"),
    ],
)
def test_sanitize_svg(svg, absent):
    assert absent not in sanitize_svg(svg)


def test_sanitize_svg_keeps_embedded_raster_images():
    svg = '<svg><image href="data:image/png;base64,AAAA"/></svg>'
    assert "data:image/png" in sanitize_svg(svg)
