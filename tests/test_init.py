"""Setup, config flow and unload."""

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResultType

from custom_components.hauspanel.const import DOMAIN, PANEL_URL


async def test_config_flow_single_instance(hass, setup_hauspanel):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.ABORT


async def test_config_flow_creates_entry(hass):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Hauspanel"


async def test_setup_registers_panel(hass, setup_hauspanel):
    panels = hass.data["frontend_panels"]
    assert PANEL_URL in panels
    assert panels[PANEL_URL].config["_panel_custom"]["name"] == "hauspanel-panel"
    data = hass.data[DOMAIN]
    assert data.config["floors"] == []
    assert data.config["night"]["mode"] == "time"


async def test_unload(hass, setup_hauspanel):
    assert await hass.config_entries.async_unload(setup_hauspanel.entry_id)
    await hass.async_block_till_done()
    assert PANEL_URL not in hass.data["frontend_panels"]
    assert DOMAIN not in hass.data


async def test_reload_keeps_layout(hass, setup_hauspanel):
    data = hass.data[DOMAIN]
    await data.async_save_config({**data.config, "floors": [{"id": "eg", "code": "EG", "name": "EG"}]})
    assert await hass.config_entries.async_reload(setup_hauspanel.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN].config["floors"][0]["id"] == "eg"
