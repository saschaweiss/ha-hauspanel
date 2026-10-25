"""Shared fixtures for the Hauspanel tests."""

from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.hauspanel.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Allow loading custom_components/hauspanel in every test."""
    return


@pytest.fixture
async def setup_hauspanel(hass):
    """Set up Hauspanel with a config entry and return the entry."""
    assert await __import__("homeassistant.setup", fromlist=["x"]).async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN, title="Hauspanel", data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def floor(fid="og", **extra):
    """A minimal valid floor."""
    return {"id": fid, "code": fid.upper(), "name": fid, "rooms": [], "pins": [], **extra}
