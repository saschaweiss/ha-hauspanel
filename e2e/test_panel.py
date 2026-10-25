"""End-to-end tests: the panel in Chromium against a real Home Assistant with the demo integration."""

from __future__ import annotations

import re

from playwright.sync_api import expect

import ha_server
from conftest import service, state

GERMAN_WORDS = re.compile(r"\b(Bearbeiten|Speichern|Abbrechen|Etage|Müllabfuhr|Heute|Morgen|Helligkeit|Warnung|Gerät)\b")


def test_view_renders_layout(open_panel):
    p = open_panel()
    assert p.locator("hauspanel-panel .floor-btn").count() == 2
    assert p.locator("hauspanel-panel .floor-btn.active").get_attribute("data-floor") == "og"
    assert p.locator("hauspanel-panel #plan svg").count() >= 1
    assert p.locator("hauspanel-panel .pin").count() == 7
    assert p.locator("hauspanel-panel .room-label").count() == 6
    assert "%" in p.locator("hauspanel-panel .hdr-item").first.inner_text()  # header value (battery)
    assert p.locator("hauspanel-panel #weather").inner_text().strip()
    p.assert_no_errors()


def test_switch_floor(open_panel):
    p = open_panel()
    p.click('hauspanel-panel .floor-btn[data-floor="eg"]')
    p.wait_for_timeout(300)
    assert p.locator("hauspanel-panel .floor-btn.active").get_attribute("data-floor") == "eg"
    assert p.locator("hauspanel-panel .pin").count() == 0
    p.assert_no_errors()


def test_pin_state_classes(open_panel, server):
    p = open_panel()
    assert "on" in p.pin("light.ceiling_lights").get_attribute("class").split()
    assert "on" not in p.pin("light.bed_light").get_attribute("class").split()
    service(server, "light", "turn_on", entity_id="light.bed_light")
    expect(p.pin("light.bed_light")).to_have_class(re.compile(r"\bon\b"), timeout=5000)


def test_tap_toggles_directly(open_panel, server):
    p = open_panel()
    p.pin("light.bed_light").click()
    p.wait_for_timeout(800)
    assert state(server, "light.bed_light")["state"] == "on"
    assert not p.locator("hauspanel-panel #overlay.show").count()  # no popup for toggle pins


def test_long_press_and_light_popup(open_panel):
    p = open_panel()
    p.pin("light.ceiling_lights").click()
    p.wait_for_selector("hauspanel-panel #overlay.show")
    assert p.locator("hauspanel-panel #bright").count() == 1
    assert p.locator("hauspanel-panel #hue").count() == 1  # colour light
    assert p.locator("hauspanel-panel #ctemp").count() == 1
    p.mouse.click(5, 5)  # outside the popup
    p.wait_for_timeout(300)
    assert not p.locator("hauspanel-panel #overlay.show").count()
    p.assert_no_errors()


def test_climate_value_and_extras(open_panel):
    p = open_panel()
    assert re.search(r"\d", p.pin("climate.hvac").inner_text())
    temp = p.pin("sensor.outside_temperature")
    assert "both" in temp.get_attribute("class").split()
    temp.click()
    p.wait_for_selector("hauspanel-panel #overlay.show")
    assert "%" in p.locator("hauspanel-panel #pop").inner_text()  # humidity extra


def test_alert_pulse_and_contrast(open_panel, server):
    p = open_panel()
    ac = p.pin("switch.ac")
    cls = ac.get_attribute("class").split()
    assert "alert" in cls and "blink" in cls
    assert ac.evaluate("e => getComputedStyle(e).backgroundColor") == "rgb(255, 0, 0)"
    assert ac.evaluate("e => getComputedStyle(e).color") == "rgb(255, 255, 255)"  # white text on red
    assert ac.evaluate("e => getComputedStyle(e, '::before').animationDuration") == "0.9s"  # speed: fast
    service(server, "switch", "turn_on", entity_id="switch.ac")
    p.wait_for_timeout(800)
    assert "alert" not in ac.get_attribute("class").split()


def test_bare_and_flip(open_panel, server):
    p = open_panel()
    k = p.pin("light.kitchen_lights")
    cls = k.get_attribute("class").split()
    assert {"bare", "inact", "strike"} <= set(cls)
    assert k.evaluate("e => getComputedStyle(e).backgroundColor") == "rgba(0, 0, 0, 0)"
    assert "linear-gradient" in k.evaluate("e => getComputedStyle(e).backgroundImage")
    service(server, "light", "turn_on", entity_id="light.kitchen_lights")
    p.wait_for_timeout(800)
    assert "inact" not in k.get_attribute("class").split()
    cam = p.pin("camera.demo_camera")
    assert cam.evaluate("e => getComputedStyle(e.querySelector('svg.i')).transform") == "matrix(-1, 0, 0, 1, 0, 0)"


def test_calendar_and_waste(open_panel):
    p = open_panel()
    cal = p.locator("hauspanel-panel #cal")
    expect(p.locator("hauspanel-panel #cal .chip").first).to_be_visible(timeout=10000)
    assert "Bio" in cal.inner_text()  # waste pickup today shows up in the calendar
    assert "Bio" in p.locator("hauspanel-panel #waste").inner_text()


def test_editor_edit_and_save(open_panel, server):
    p = open_panel("/hauspanel", 1440, 1000)
    p.click("hauspanel-panel [data-a=edit]")
    p.pin("light.ceiling_lights").click()
    name = p.locator("hauspanel-panel [data-f=pin-name]")
    name.fill("Ceiling")
    name.dispatch_event("input")
    p.click('hauspanel-panel [data-a=pin-bare][data-v=bare]')
    p.click('hauspanel-panel [data-a=pin-flip][data-v=v]')
    p.click("hauspanel-panel [data-a=edit-save]")
    p.wait_for_timeout(1000)
    cfg = ha_server.ws_call(server, {"type": "hauspanel/get"})[0]["config"]
    pin = next(x for x in cfg["floors"][0]["pins"] if x["entity_id"] == "light.ceiling_lights")
    assert pin["name"] == "Ceiling" and pin["bare"] is True and pin["flip"] == "v"
    p.assert_no_errors()


def test_editor_conflict_warning(open_panel, server):
    p = open_panel("/hauspanel", 1440, 1000)
    p.click("hauspanel-panel [data-a=edit]")
    p.pin("light.ceiling_lights").click()
    name = p.locator("hauspanel-panel [data-f=pin-name]")
    name.fill("Mine")
    name.dispatch_event("input")
    # someone else saves in the meantime
    ha_server.seed(server["url"], server["token"]["access_token"])
    p.click("hauspanel-panel [data-a=edit-save]")
    p.wait_for_timeout(1000)
    cfg = ha_server.ws_call(server, {"type": "hauspanel/get"})[0]["config"]
    pin = next(x for x in cfg["floors"][0]["pins"] if x["entity_id"] == "light.ceiling_lights")
    assert pin.get("name") != "Mine"  # not silently overwritten


def test_colour_popover(open_panel):
    p = open_panel("/hauspanel", 1440, 1000)
    p.click("hauspanel-panel [data-a=edit]")
    p.pin("switch.ac").click()
    p.locator("hauspanel-panel [data-f=al-color]").first.click()
    assert p.locator("hauspanel-panel .cpop").count() == 1
    assert p.locator("hauspanel-panel .cpop .cprev").get_attribute("data-a") == "cp-sys"
    p.locator("hauspanel-panel .cpop input").first.click()
    assert p.locator("hauspanel-panel .cpop").count() == 1  # click inside keeps it open
    p.mouse.click(700, 500)
    assert p.locator("hauspanel-panel .cpop").count() == 0  # click outside closes it


def test_english_ui(open_panel):
    p = open_panel("/hauspanel", 1440, 1000, lang="en")
    text = p.locator("hauspanel-panel").evaluate("e => e.shadowRoot.textContent")
    p.click("hauspanel-panel [data-a=edit]")
    p.pin("switch.ac").click()
    p.wait_for_timeout(300)
    text += p.locator("hauspanel-panel").evaluate("e => e.shadowRoot.textContent")
    found = sorted(set(GERMAN_WORDS.findall(text)))
    assert not found, f"German strings in English UI: {found}"
    p.assert_no_errors()


def test_mobile_portrait(open_panel):
    p = open_panel(width=390, height=844)
    assert p.locator("hauspanel-panel").evaluate("e => e.classList.contains('mobile')")
    assert p.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth + 1")
    assert p.pin("light.ceiling_lights").is_visible()
    p.assert_no_errors()


def test_camera_popup_on_doorbell(open_panel, server):
    p = open_panel()
    p.click('hauspanel-panel .floor-btn[data-floor="eg"]')  # camera pin lives on the other floor
    service(server, "input_boolean", "turn_on", entity_id="input_boolean.doorbell")
    expect(p.locator("hauspanel-panel #overlay.show")).to_be_visible(timeout=5000)
    assert p.locator("hauspanel-panel .floor-btn.active").get_attribute("data-floor") == "og"  # switched to the camera's floor
    assert "Doorbell" in p.locator("hauspanel-panel #pop .alert-note").inner_text()
    assert p.locator("hauspanel-panel #cam-box").count() == 1
    expect(p.locator("hauspanel-panel #overlay.show")).to_have_count(0, timeout=6000)  # closes after 3 s
    p.assert_no_errors()


def test_camera_popup_stays_open_after_touch(open_panel, server):
    p = open_panel()
    service(server, "input_boolean", "turn_on", entity_id="input_boolean.doorbell")
    expect(p.locator("hauspanel-panel #overlay.show")).to_be_visible(timeout=5000)
    p.locator("hauspanel-panel #pop .alert-note").click()  # someone uses the tablet
    p.wait_for_timeout(4000)
    assert p.locator("hauspanel-panel #overlay.show").count() == 1


def test_camera_popup_without_pin(open_panel, server):
    p = open_panel()
    service(server, "input_boolean", "turn_on", entity_id="input_boolean.motion")
    expect(p.locator("hauspanel-panel #overlay.show")).to_be_visible(timeout=5000)
    assert "Garden motion" in p.locator("hauspanel-panel #pop").inner_text()
    assert p.locator("hauspanel-panel #cam-box").count() == 1
    p.assert_no_errors()


def test_camera_popup_not_on_initial_state_or_turn_off(open_panel, server):
    service(server, "input_boolean", "turn_on", entity_id="input_boolean.motion")
    p = open_panel()  # already on when the panel loads -> no popup
    p.wait_for_timeout(1000)
    assert p.locator("hauspanel-panel #overlay.show").count() == 0
    service(server, "input_boolean", "turn_off", entity_id="input_boolean.motion")
    p.wait_for_timeout(1000)
    assert p.locator("hauspanel-panel #overlay.show").count() == 0


def test_camera_popup_editor_test_button(open_panel):
    p = open_panel("/hauspanel", 1440, 1000)
    p.click("hauspanel-panel [data-a=edit]")
    p.click('hauspanel-panel [data-a=tab][data-tab=general]')
    p.locator('hauspanel-panel [data-a=camev-test]').first.click()
    expect(p.locator("hauspanel-panel #overlay.show")).to_be_visible(timeout=5000)
    p.assert_no_errors()
