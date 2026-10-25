"""Hauspanel – floor-plan dashboard for wall tablets."""

from __future__ import annotations

import copy
import logging
import secrets
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.storage import Store
from homeassistant.helpers.typing import ConfigType
from homeassistant.util import dt as dt_util

from .const import (
    DEFAULT_CONFIG,
    DOMAIN,
    MAX_HISTORY,
    PANEL_COMPONENT,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
    STATIC_URL,
    STORAGE_KEY_CONFIG,
    STORAGE_KEY_HISTORY,
    STORAGE_KEY_PLANS,
    STORAGE_VERSION,
    VERSION,
)
from .websocket import async_register_websocket

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

FRONTEND_DIR = Path(__file__).parent / "frontend"


class HauspanelData:
    """Keeps layout and floor plans in memory, persisted in .storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.config_store: Store[dict] = Store(hass, STORAGE_VERSION, STORAGE_KEY_CONFIG)
        self.plans_store: Store[dict] = Store(hass, STORAGE_VERSION, STORAGE_KEY_PLANS)
        self.history_store: Store[dict] = Store(hass, STORAGE_VERSION, STORAGE_KEY_HISTORY)
        self.config: dict = {}
        self.plans: dict[str, str] = {}
        self.history: list[dict] = []

    async def async_load(self) -> None:
        self.config = await self.config_store.async_load() or dict(DEFAULT_CONFIG)
        for key, value in DEFAULT_CONFIG.items():
            self.config.setdefault(key, value)
        self.plans = await self.plans_store.async_load() or {}
        self.history = ((await self.history_store.async_load()) or {}).get("items", [])

    async def async_save_config(self, config: dict, reason: str = "editor") -> int:
        """Save the layout: back up the previous state first and bump the revision."""
        if self.config.get("floors") or self.config.get("theme") or self.config.get("css"):
            self.history.append({
                "id": secrets.token_hex(3),
                "ts": dt_util.now().isoformat(timespec="seconds"),
                "reason": reason,
                "config": copy.deepcopy(self.config),
            })
            del self.history[:-MAX_HISTORY]
            await self.async_save_history()
        config = dict(config)
        config["_rev"] = int(self.config.get("_rev", 0)) + 1
        self.config = config
        # Only drop plans of deleted floors when the editor saves, so that an undo
        # after deleting a floor (e.g. via the AI tools) still finds its plan.
        if reason == "editor":
            floor_ids = {f.get("id") for f in config.get("floors", [])}
            stale = [fid for fid in self.plans if fid not in floor_ids]
            for fid in stale:
                del self.plans[fid]
            if stale:
                await self.plans_store.async_save(self.plans)
        await self.config_store.async_save(config)
        return config["_rev"]

    async def async_save_history(self) -> None:
        await self.history_store.async_save({"items": self.history})

    async def async_save_plan(self, floor_id: str, svg: str | None) -> None:
        if svg is None:
            self.plans.pop(floor_id, None)
        else:
            self.plans[floor_id] = svg
        await self.plans_store.async_save(self.plans)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    async_register_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data = HauspanelData(hass)
    await data.async_load()
    hass.data[DOMAIN] = data

    # Static paths cannot be unregistered -> register only once per HA run
    if not hass.data.get(f"{DOMAIN}_static"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), cache_headers=False)]
        )
        hass.data[f"{DOMAIN}_static"] = True

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL,
        webcomponent_name=PANEL_COMPONENT,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=f"{STATIC_URL}/hauspanel-panel.js?v={VERSION}",
        embed_iframe=False,
        require_admin=False,
        config={"static_url": STATIC_URL, "version": VERSION},
    )

    # Tools for AI assistants (exposed by Home Assistant's MCP server)
    from .llm_api import async_register_llm_api  # noqa: PLC0415

    try:
        entry.async_on_unload(async_register_llm_api(hass))
    except Exception as err:  # noqa: BLE001 – the panel must work without the LLM API
        _LOGGER.warning("Hauspanel-KI-Werkzeuge nicht verfügbar: %s", err)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL_URL, warn_if_unknown=False)
    hass.data.pop(DOMAIN, None)
    return True
