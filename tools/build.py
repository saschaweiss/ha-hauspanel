"""Baut frontend/hauspanel-panel.js aus src/panel.src.js.
Aufruf: python3 tools/build.py <pfad/zu/lucide-static/icons>
"""
import json, re, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
icons_dir = Path(sys.argv[1])
src = (root / "src/panel.src.js").read_text()
version = json.loads((root / "custom_components/hauspanel/manifest.json").read_text())["version"]

names = {n for n in re.findall(r'"([a-z0-9-]+)"', src) if (icons_dir / f"{n}.svg").exists()}
icons = {}
for n in sorted(names):
    s = (icons_dir / f"{n}.svg").read_text()
    inner = s[s.index(">", s.index("<svg")) + 1 : s.rindex("</svg>")]
    icons[n] = re.sub(r"\s+", " ", inner).strip()

out = src.replace("__ICONS__", json.dumps(icons, separators=(",", ":"))).replace("__VERSION__", version)
dst = root / "custom_components/hauspanel/frontend/hauspanel-panel.js"
dst.write_text(out)
print(f"{dst.name}: {len(out)//1024} KB, {len(icons)} Icons, v{version}")
