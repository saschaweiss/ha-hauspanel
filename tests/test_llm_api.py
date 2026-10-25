"""Tools for AI assistants (exposed through HA's MCP server)."""

import pytest
from homeassistant.core import Context
from homeassistant.helpers import llm

from custom_components.hauspanel.const import DOMAIN


@pytest.fixture
async def call(hass, setup_hauspanel):
    """Return a helper that calls a Hauspanel tool and returns its result data."""
    ctx = llm.LLMContext(platform="test", context=Context(), language="en", assistant=None, device_id=None)
    api = await llm.async_get_api(hass, DOMAIN, ctx)

    tools = {t.name: t for t in api.tools}

    async def _call(_tool, **args):
        tool = tools[_tool]
        args = tool.parameters(args)  # same schema validation HA applies before calling a tool
        out = await tool.async_call(hass, llm.ToolInput(tool_name=_tool, tool_args=args), ctx)
        return getattr(out, "data", out)

    return _call


async def test_tools_are_listed(hass, setup_hauspanel):
    ctx = llm.LLMContext(platform="test", context=Context(), language="en", assistant=None, device_id=None)
    api = await llm.async_get_api(hass, DOMAIN, ctx)
    names = {t.name for t in api.tools}
    assert {"hauspanel_get_config", "hauspanel_set_pins", "hauspanel_undo", "hauspanel_plan_info"} <= names


async def test_floor_pins_and_undo(hass, call):
    hass.states.async_set("light.flur", "on")
    out = await call("hauspanel_set_floor", floor_id="eg", code="EG", name="Erdgeschoss")
    assert out["ok"] and out["neu"]

    out = await call(
        "hauspanel_set_pins",
        floor_id="eg",
        pins=[{"entity_id": "light.flur", "x": 40, "y": 60, "scale": 80, "bare": True, "off_style": "strike", "flip": "h",
               "alerts": [{"kind": "state", "state": "on", "for": 3, "unit": "h", "color": "#ff0000", "blink": True, "speed": "fast"}]}],
    )
    assert out["ok"], out
    pin = hass.data[DOMAIN].config["floors"][0]["pins"][0]
    assert pin["entity_id"] == "light.flur" and pin["x"] == 40 and pin["scale"] == 80
    assert pin["bare"] is True and pin["off_style"] == "strike" and pin["flip"] == "h"
    assert pin["alerts"][0]["speed"] == "fast"

    # updating by entity_id changes only the given fields
    await call("hauspanel_set_pins", floor_id="eg", pins=[{"entity_id": "light.flur", "x": 10}])
    pin = hass.data[DOMAIN].config["floors"][0]["pins"][0]
    assert pin["x"] == 10 and pin["y"] == 60

    await call("hauspanel_remove_pins", floor_id="eg", pins=[pin["id"]])
    assert hass.data[DOMAIN].config["floors"][0]["pins"] == []

    out = await call("hauspanel_undo")
    assert out["ok"]
    assert hass.data[DOMAIN].config["floors"][0]["pins"][0]["x"] == 10


async def test_set_pins_validation(hass, call):
    await call("hauspanel_set_floor", floor_id="eg", code="EG", name="EG")
    out = await call("hauspanel_set_pins", floor_id="eg", pins=[{"entity_id": "light.x"}])
    assert "error" in out  # new pin without coordinates
    out = await call("hauspanel_set_pins", floor_id="eg", pins=[{"entity_id": "light.x", "x": 150, "y": 10}])
    assert "error" in out
    out = await call("hauspanel_set_pins", floor_id="nope", pins=[{"entity_id": "light.x", "x": 1, "y": 1}])
    assert "error" in out
    out = await call("hauspanel_set_pins", floor_id="eg", pins=[{"entity_id": "light.missing", "x": 1, "y": 1}])
    assert out["ok"] and out["warnungen"]


async def test_update_settings_merge_patch(hass, call):
    await call("hauspanel_update_settings", patch={"theme": {"light": {"accent": "#2F6DD0"}, "size": {"pin": 40}}})
    await call("hauspanel_update_settings", patch={"theme": {"light": {"bg": "#ffffff"}}, "header": [{"entity_id": "sensor.akku"}]})
    cfg = hass.data[DOMAIN].config
    assert cfg["theme"] == {"light": {"accent": "#2F6DD0", "bg": "#ffffff"}, "size": {"pin": 40}}
    assert cfg["header"] == [{"entity_id": "sensor.akku"}]
    await call("hauspanel_update_settings", patch={"cam_popups": [{"trigger": "event.doorbell", "camera": "camera.door", "seconds": 60}]})
    assert hass.data[DOMAIN].config["cam_popups"][0]["camera"] == "camera.door"
    await call("hauspanel_update_settings", patch={"theme": None})
    assert "theme" not in hass.data[DOMAIN].config
    out = await call("hauspanel_update_settings", patch={"floors": []})
    assert "error" in out


async def test_unchanged_write_creates_no_backup(hass, call):
    await call("hauspanel_set_floor", floor_id="eg", code="EG", name="EG")
    n = len(hass.data[DOMAIN].history)
    out = await call("hauspanel_set_floor", floor_id="eg", name="EG")
    assert out["geaendert"] is False
    assert len(hass.data[DOMAIN].history) == n


async def test_rooms_and_remove_floor(hass, call):
    await call("hauspanel_set_floor", floor_id="eg", code="EG", name="EG")
    await call("hauspanel_set_rooms", floor_id="eg", rooms=[{"name": "Küche", "x": 50, "y": 20}])
    assert hass.data[DOMAIN].config["floors"][0]["rooms"][0]["name"] == "Küche"
    tint = {"entity_id": "binary_sensor.kueche", "kind": "state", "state": "on", "color": "#F5A623"}
    await call("hauspanel_set_rooms", floor_id="eg", rooms=[{"name": "Küche", "tints": [tint]}])
    assert hass.data[DOMAIN].config["floors"][0]["rooms"][0]["tints"] == [tint]
    out = await call("hauspanel_set_rooms", floor_id="eg", rooms=[{"name": "Küche", "tints": [{"kind": "state"}]}])
    assert "error" in out
    await call("hauspanel_set_rooms", floor_id="eg", rooms=[{"name": "Küche", "tints": None}])
    assert "tints" not in hass.data[DOMAIN].config["floors"][0]["rooms"][0]
    await call("hauspanel_remove_floor", floor_id="eg")
    assert hass.data[DOMAIN].config["floors"] == []
    await call("hauspanel_undo")
    assert hass.data[DOMAIN].config["floors"][0]["id"] == "eg"


async def test_plan_info(hass, call):
    from .test_plan_analysis import TWO_ROOMS  # noqa: PLC0415

    await call("hauspanel_set_floor", floor_id="eg", code="EG", name="EG")
    await hass.data[DOMAIN].async_save_plan("eg", TWO_ROOMS)
    out = await call("hauspanel_plan_info", floor_id="eg")
    assert out["floor_id"] == "eg" and len(out["flaechen"]) >= 2
