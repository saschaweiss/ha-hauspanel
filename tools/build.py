"""Build frontend/hauspanel-panel.js from src/panel.src.js (embeds the used Lucide icons).
Usage: python3 tools/build.py <path/to/lucide-static/icons>   (or: npm run build)
"""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
icons_dir = Path(sys.argv[1])
src = (root / "src/panel.src.js").read_text()
version = json.loads((root / "custom_components/hauspanel/manifest.json").read_text())["version"]

names = {n for n in re.findall(r'"([a-z0-9-]+)[":]', src) if (icons_dir / f"{n}.svg").exists()}
icons = {}
for n in sorted(names):
    s = (icons_dir / f"{n}.svg").read_text()
    inner = s[s.index(">", s.index("<svg")) + 1 : s.rindex("</svg>")]
    icons[n] = re.sub(r"\s+", " ", inner).strip()

out = src.replace("__ICONS__", json.dumps(icons, separators=(",", ":"))).replace("__VERSION__", version)
dst = root / "custom_components/hauspanel/frontend/hauspanel-panel.js"
dst.write_text(out)
print(f"{dst.name}: {len(out)//1024} KB, {len(icons)} Icons, v{version}")
