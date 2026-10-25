"""Start a throwaway Home Assistant with Hauspanel and a demo layout for the end-to-end tests.

Usage (standalone):  python e2e/ha_server.py --hass /path/to/venv/bin/hass
The pytest fixtures in conftest.py call `start()` / `stop()` themselves.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import shutil
import signal
import subprocess
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import aiohttp

ROOT = Path(__file__).resolve().parent.parent
PLAN = Path(__file__).with_name("demo_plan.svg")

CONFIG_YAML = """
homeassistant:
  name: Hauspanel E2E
  time_zone: Europe/Berlin
  country: DE
  unit_system: metric
  latitude: 52.52
  longitude: 13.40
  elevation: 30
frontend:
config:
http:
  server_port: {port}
demo:
recorder:
  purge_keep_days: 1
logger:
  default: warning
input_boolean:
  doorbell:
    name: Doorbell
  motion:
    name: Garden motion
template:
  - sensor:
      - name: "Waste Paper"
        state: "in 3 days"
      - name: "Waste Bio"
        state: "today"
"""

# Pins and rooms of the demo layout. Coordinates are percent of the plan size.
LAYOUT = {
    "floors": [
        {
            "id": "og",
            "code": "OG",
            "name": "Upper floor",
            "separated": False,
            "recolor": True,
            "rooms": [
                {"id": "r1", "name": "Bedroom", "x": 7, "y": 9},
                {"id": "r2", "name": "Living room", "x": 45, "y": 9},
                {"id": "r3", "name": "Hallway", "x": 7, "y": 44},
                {"id": "r4", "name": "Kitchen", "x": 7, "y": 57},
                {"id": "r5", "name": "Bath", "x": 33, "y": 57},
                {"id": "r6", "name": "Office", "x": 63, "y": 57},
            ],
            "pins": [
                {"id": "p_bed", "entity_id": "light.bed_light", "x": 22, "y": 25, "display": "icon", "toggle": True,
                 "power_off": True, "extras": []},
                {"id": "p_ceil", "entity_id": "light.ceiling_lights", "x": 70, "y": 25, "display": "icon",
                 "power_off": True, "extras": []},
                {"id": "p_kitchen", "entity_id": "light.kitchen_lights", "x": 17, "y": 75, "display": "icon", "bare": True,
                 "off_style": "strike", "power_off": True, "extras": []},
                {"id": "p_ac", "entity_id": "switch.ac", "x": 45, "y": 75, "display": "icon", "extras": [],
                 "alerts": [{"kind": "state", "state": "off", "color": "#ff0000", "blink": True, "speed": "fast"}]},
                {"id": "p_cam", "entity_id": "camera.demo_camera", "x": 90, "y": 50, "display": "icon", "flip": "h",
                 "cam_view": "snapshot", "extras": []},
                {"id": "p_temp", "entity_id": "sensor.outside_temperature", "x": 78, "y": 75, "display": "both",
                 "scale": 90, "extras": ["sensor.outside_humidity"]},
                {"id": "p_hvac", "entity_id": "climate.hvac", "x": 55, "y": 25, "display": "value", "extras": []},
            ],
        },
        {"id": "eg", "code": "EG", "name": "Ground floor", "separated": False, "recolor": True, "rooms": [], "pins": []},
    ],
    "calendars": [{"entity_id": "calendar.calendar_1", "color": "#E5391D"}, {"entity_id": "calendar.calendar_2", "color": "#2F6DD0"}],
    "weather_entity": "weather.demo_weather_south",
    "waste": [{"entity_id": "sensor.waste_paper", "name": "Paper", "color": "#2F6DD0"},
              {"entity_id": "sensor.waste_bio", "name": "Bio", "color": "#3E8E41"}],
    "header": [{"entity_id": "sensor.outside_temperature_battery"}],
    "cam_popups": [{"trigger": "input_boolean.doorbell", "camera": "camera.demo_camera", "seconds": 3},
                   {"trigger": "input_boolean.motion", "camera": "camera.demo_camera_png", "seconds": 60}],
    "default_floor": "og",
    "night": {"mode": "time", "from": 23, "to": 5},
}


def _req(base, path, data=None, token=None, form=False):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = None
    if data is not None:
        if form:
            body = urllib.parse.urlencode(data).encode()
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            body = json.dumps(data).encode()
            headers["Content-Type"] = "application/json"
    req = urllib.request.Request(base + path, data=body, headers=headers, method="POST" if body is not None else "GET")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read() or b"null")


def _wait_http(base, proc, timeout):
    deadline = time.time() + timeout
    while time.time() < deadline:
        if proc.poll() is not None:
            raise RuntimeError(f"Home Assistant exited with code {proc.returncode}")
        try:
            urllib.request.urlopen(base + "/manifest.json", timeout=3)
            return
        except (urllib.error.URLError, ConnectionError, TimeoutError):
            time.sleep(2)
    raise TimeoutError("Home Assistant did not start in time")


def _wait_states(base, token, entities, timeout=180):
    deadline = time.time() + timeout
    while time.time() < deadline:
        ids = {s["entity_id"] for s in _req(base, "/api/states", token=token)}
        missing = [e for e in entities if e not in ids]
        if not missing:
            return
        time.sleep(2)
    raise TimeoutError(f"Demo entities missing: {missing}")


async def _ws(base, token, *messages):
    async with aiohttp.ClientSession() as session, session.ws_connect(base + "/api/websocket", max_msg_size=0) as ws:
        await ws.receive_json()
        await ws.send_json({"type": "auth", "access_token": token})
        assert (await ws.receive_json())["type"] == "auth_ok"
        results = []
        for i, msg in enumerate(messages, start=1):
            await ws.send_json({**msg, "id": i})
            while True:
                res = await ws.receive_json()
                if res.get("id") == i and res["type"] == "result":
                    if not res["success"]:
                        raise RuntimeError(f"{msg['type']}: {res['error']}")
                    results.append(res.get("result"))
                    break
        return results


def _run(coro):
    # Own thread, so this also works while Playwright's sync API owns the main thread's event loop.
    with ThreadPoolExecutor(1) as pool:
        return pool.submit(asyncio.run, coro).result()


def ws_call(server, *messages):
    """Run websocket commands against the test server (used by tests to read/write state)."""
    return _run(_ws(server["url"], server["token"]["access_token"], *messages))


def seed(base, token):
    """Load the demo layout and floor plan (replaces whatever a previous test left behind)."""
    cfg = _run(_ws(base, token, {"type": "hauspanel/get"}))[0]["config"]
    keep = {k: v for k, v in cfg.items() if k in ("version", "_rev")}
    _run(_ws(base, token,
             {"type": "hauspanel/config/save", "config": {**keep, **json.loads(json.dumps(LAYOUT))}, "force": True},
             {"type": "hauspanel/plan/save", "floor_id": "og", "svg": PLAN.read_text()}))


def start(hass_bin: str, port: int = 8124, config_dir: str | None = None, timeout: int = 600) -> dict:
    """Start HA in a fresh config dir, onboard an admin user, add Hauspanel and seed the demo layout."""
    cfg = Path(config_dir or tempfile.mkdtemp(prefix="hauspanel-e2e-"))
    if cfg.exists() and config_dir:
        shutil.rmtree(cfg)
    (cfg / "custom_components").mkdir(parents=True)
    (cfg / "custom_components" / "hauspanel").symlink_to(ROOT / "custom_components" / "hauspanel")
    (cfg / "configuration.yaml").write_text(CONFIG_YAML.format(port=port))
    log = open(cfg / "e2e.log", "w")  # noqa: SIM115 – kept open for the lifetime of the process
    proc = subprocess.Popen([hass_bin, "-c", str(cfg)], stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
    base = f"http://127.0.0.1:{port}"
    try:
        _wait_http(base, proc, timeout)
        cid = base + "/"
        user = _req(base, "/api/onboarding/users",
                    {"client_id": cid, "name": "Admin", "username": "admin", "password": "e2e-pass-123", "language": "en"})
        token = _req(base, "/auth/token", {"grant_type": "authorization_code", "code": user["auth_code"], "client_id": cid}, form=True)
        at = token["access_token"]
        for step, body in (("core_config", {}), ("analytics", {}), ("integration", {"client_id": cid, "redirect_uri": cid})):
            try:
                _req(base, f"/api/onboarding/{step}", body, token=at)
            except urllib.error.HTTPError:
                pass  # step may not exist in this HA version
        flow = _req(base, "/api/config/config_entries/flow", {"handler": "hauspanel"}, token=at)
        _req(base, f"/api/config/config_entries/flow/{flow['flow_id']}", {}, token=at)
        try:  # HA >= 2026.10 treats the YAML http config as a trial and restarts after 5 min unless confirmed
            _run(_ws(base, at, {"type": "http/config/promote"}))
        except RuntimeError:
            pass
        _wait_states(base, at, [p["entity_id"] for p in LAYOUT["floors"][0]["pins"]] + ["weather.demo_weather_south"])
        seed(base, at)
    except Exception:
        stop({"proc": proc})
        print((cfg / "e2e.log").read_text()[-5000:])
        raise
    return {"url": base, "token": token, "proc": proc, "config_dir": str(cfg)}


def stop(server: dict) -> None:
    proc = server.get("proc")
    if proc and proc.poll() is None:
        os.killpg(proc.pid, signal.SIGTERM)
        try:
            proc.wait(30)
        except subprocess.TimeoutExpired:
            os.killpg(proc.pid, signal.SIGKILL)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--hass", default=shutil.which("hass") or "hass")
    ap.add_argument("--port", type=int, default=8124)
    a = ap.parse_args()
    srv = start(a.hass, a.port)
    print(json.dumps({"url": srv["url"], "config_dir": srv["config_dir"]}))
    print("Running – Ctrl+C to stop")
    try:
        srv["proc"].wait()
    except KeyboardInterrupt:
        stop(srv)
