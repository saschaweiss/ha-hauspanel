"""Print the Python requirements of the HA integrations the e2e setup loads (demo and its dependencies).

HA normally installs these on first start; installing them up front makes the e2e start fast and reliable.
Usage: pip install $(python e2e/ha_requirements.py)
"""

from __future__ import annotations

import json
from pathlib import Path

import homeassistant

COMPONENTS = Path(homeassistant.__file__).parent / "components"
ROOTS = ["demo", "frontend", "config", "http", "template", "panel_custom", "websocket_api", "camera", "tts", "stream",
         "google_translate", "met", "conversation", "assist_pipeline", "ffmpeg", "radio_browser", "backup", "cloud", "recorder"]


def manifest(domain: str) -> dict:
    path = COMPONENTS / domain / "manifest.json"
    return json.loads(path.read_text()) if path.exists() else {}


def main() -> None:
    seen: set[str] = set()
    todo = list(ROOTS)
    reqs: set[str] = set()
    while todo:
        dom = todo.pop()
        if dom in seen:
            continue
        seen.add(dom)
        m = manifest(dom)
        reqs.update(m.get("requirements", []))
        todo += m.get("dependencies", []) + m.get("after_dependencies", [])
    print(" ".join(sorted(reqs)))


if __name__ == "__main__":
    main()
