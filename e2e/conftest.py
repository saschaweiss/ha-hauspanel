"""Fixtures for the end-to-end tests: a real Home Assistant plus a Chromium page with the panel."""

from __future__ import annotations

import json
import os
import shutil
import time

import pytest
from playwright.sync_api import Page, sync_playwright

import ha_server


@pytest.fixture(scope="session")
def server():
    hass = os.environ.get("HASS_BIN") or shutil.which("hass")
    if not hass:
        pytest.exit("Set HASS_BIN to the hass executable of a Home Assistant venv", 2)
    srv = ha_server.start(hass, int(os.environ.get("HP_E2E_PORT", "8124")))
    yield srv
    ha_server.stop(srv)


@pytest.fixture(autouse=True)
def fresh_layout(server):
    """Every test starts from the same demo layout and device states."""
    ha_server.seed(server["url"], server["token"]["access_token"])
    service(server, "light", "turn_off", entity_id="light.bed_light")
    service(server, "light", "turn_on", entity_id="light.ceiling_lights")
    service(server, "light", "turn_off", entity_id="light.kitchen_lights")
    service(server, "switch", "turn_off", entity_id="switch.ac")
    service(server, "input_boolean", "turn_off", entity_id="input_boolean.doorbell")
    service(server, "input_boolean", "turn_off", entity_id="input_boolean.motion")


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        yield b
        b.close()


class Panel:
    """A browser page showing Hauspanel, with console errors collected."""

    def __init__(self, page: Page, errors: list[str]):
        self.page = page
        self.errors = errors

    def __getattr__(self, name):
        return getattr(self.page, name)

    def pin(self, entity_id: str):
        return self.page.locator(f'hauspanel-panel .pin[data-entity="{entity_id}"]')

    def assert_no_errors(self):
        assert not self.errors, "\n".join(self.errors)


@pytest.fixture
def open_panel(server, browser):
    """open_panel(path="/hauspanel?kiosk", width=1280, height=800, lang="de") -> Panel"""
    contexts = []

    def _open(path="/hauspanel?kiosk", width=1280, height=800, lang="de"):
        tok = server["token"]
        tokens = {"access_token": tok["access_token"], "refresh_token": tok["refresh_token"], "expires_in": tok["expires_in"],
                  "token_type": "Bearer", "hassUrl": server["url"], "clientId": server["url"] + "/",
                  "expires": int(time.time() * 1000) + tok["expires_in"] * 1000}
        ctx = browser.new_context(viewport={"width": width, "height": height}, locale="de-DE" if lang == "de" else "en-US",
                                  timezone_id="Europe/Berlin")
        ctx.add_init_script(f"localStorage.setItem('hassTokens', {json.dumps(json.dumps(tokens))});"
                            f"localStorage.setItem('selectedLanguage', {json.dumps(json.dumps(lang))});")
        contexts.append(ctx)
        page = ctx.new_page()
        errors: list[str] = []
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        page.on("console", lambda m: errors.append(f"console: {m.text}") if m.type == "error" and "hauspanel" in m.text.lower() else None)
        page.goto(server["url"] + path)
        page.wait_for_selector("hauspanel-panel #top", timeout=30000)
        page.wait_for_timeout(800)
        return Panel(page, errors)

    yield _open
    for ctx in contexts:
        ctx.close()


def service(server, domain, name, **data):
    ha_server._req(server["url"], f"/api/services/{domain}/{name}", data, token=server["token"]["access_token"])


def state(server, entity_id):
    return ha_server._req(server["url"], f"/api/states/{entity_id}", token=server["token"]["access_token"])
