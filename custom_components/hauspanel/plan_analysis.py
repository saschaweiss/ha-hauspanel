"""Grundriss-Analyse ohne Browser: SVG/Bild rastern und helle Flächen (Räume) finden.

Liefert Räume als Bounding-Boxen in Prozent plus eine grobe Textkarte, damit ein
KI-Assistent Pins und Raum-Labels sinnvoll platzieren kann.
"""

from __future__ import annotations

import base64
from collections import deque
import io
import math
import re
import xml.etree.ElementTree as ET

from PIL import Image, ImageChops, ImageDraw, ImageFilter

RASTER_W = 480
_NUM = r"[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?"
_NAMED = {"black": (0, 0, 0), "white": (255, 255, 255), "none": None, "transparent": None,
          "gray": (128, 128, 128), "grey": (128, 128, 128), "red": (255, 0, 0), "green": (0, 128, 0),
          "blue": (0, 0, 255), "silver": (192, 192, 192), "lightgray": (211, 211, 211), "lightgrey": (211, 211, 211),
          "darkgray": (169, 169, 169), "darkgrey": (169, 169, 169), "whitesmoke": (245, 245, 245)}
IDENTITY = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)


def mul(m, n):
    a, b, c, d, e, f = m
    A, B, C, D, E, F = n
    return (a * A + c * B, b * A + d * B, a * C + c * D, b * C + d * D, a * E + c * F + e, b * E + d * F + f)


def parse_transform(t: str | None):
    m = IDENTITY
    if not t:
        return m
    for name, raw in re.findall(r"(\w+)\s*\(([^)]*)\)", t):
        a = [float(x) for x in re.findall(_NUM, raw)]
        if name == "matrix" and len(a) == 6:
            n = tuple(a)
        elif name == "translate" and a:
            n = (1, 0, 0, 1, a[0], a[1] if len(a) > 1 else 0)
        elif name == "scale" and a:
            n = (a[0], 0, 0, a[1] if len(a) > 1 else a[0], 0, 0)
        elif name == "rotate" and a:
            r = math.radians(a[0])
            c, s = math.cos(r), math.sin(r)
            cx, cy = (a[1], a[2]) if len(a) == 3 else (0, 0)
            n = (c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy)
        else:
            continue
        m = mul(m, n)
    return m


def _apply(m, x, y):
    return m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]


def _color(v: str | None):
    if v is None:
        return "inherit"
    v = v.strip().lower()
    if v in ("", "inherit", "currentcolor"):
        return "inherit"
    if v in _NAMED:
        return _NAMED[v]
    if v.startswith("url("):
        return (200, 200, 200)
    if m := re.fullmatch(r"#([0-9a-f]{3}|[0-9a-f]{6})", v):
        h = m.group(1)
        if len(h) == 3:
            h = "".join(ch * 2 for ch in h)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    if m := re.fullmatch(r"rgba?\(([^)]*)\)", v):
        p = re.findall(_NUM, m.group(1))
        if len(p) >= 3:
            return tuple(max(0, min(255, int(float(x)))) for x in p[:3])
    return (128, 128, 128)


def _style(el, key):
    st = el.get("style") or ""
    m = re.search(rf"(?:^|;)\s*{key}\s*:\s*([^;]+)", st)
    return m.group(1) if m else el.get(key)


def path_subpaths(d: str):
    """Zerlegt einen SVG-Pfad in Polygonzüge (Kurven werden angenähert)."""
    toks = re.findall(rf"[MmLlHhVvCcSsQqTtAaZz]|{_NUM}", d or "")
    subs, cur = [], []
    x = y = sx = sy = 0.0
    lc = None  # letzter Kontrollpunkt
    cmd = None
    i = 0

    def nums(k):
        nonlocal i
        out = [float(t) for t in toks[i:i + k]]
        if len(out) < k or any(re.fullmatch(r"[A-Za-z]", t) for t in toks[i:i + k]):
            raise ValueError
        i += k
        return out

    def bez(p):
        n = 8
        for s in range(1, n + 1):
            t = s / n
            if len(p) == 4:
                (x0, y0), (x1, y1), (x2, y2), (x3, y3) = p
                u = 1 - t
                cur.append((u**3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t**3 * x3,
                            u**3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t**3 * y3))
            else:
                (x0, y0), (x1, y1), (x2, y2) = p
                u = 1 - t
                cur.append((u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2))

    try:
        while i < len(toks):
            if re.fullmatch(r"[A-Za-z]", toks[i]):
                cmd = toks[i]
                i += 1
                if cmd in "Zz":
                    if cur:
                        subs.append(cur)
                    cur = []
                    x, y = sx, sy
                    lc = None
                    continue
            elif cmd is None:
                break
            rel = cmd.islower()
            c = cmd.upper()
            ox, oy = (x, y) if rel else (0.0, 0.0)
            if c == "M":
                a, b = nums(2)
                if cur:
                    subs.append(cur)
                x, y = ox + a, oy + b
                sx, sy = x, y
                cur = [(x, y)]
                cmd = "l" if rel else "L"
                lc = None
            elif c == "L":
                a, b = nums(2)
                x, y = ox + a, oy + b
                cur.append((x, y))
                lc = None
            elif c == "H":
                (a,) = nums(1)
                x = ox + a
                cur.append((x, y))
                lc = None
            elif c == "V":
                (b,) = nums(1)
                y = (y if rel else 0.0) + b
                cur.append((x, y))
                lc = None
            elif c == "C":
                a = nums(6)
                p1, p2, p3 = (ox + a[0], oy + a[1]), (ox + a[2], oy + a[3]), (ox + a[4], oy + a[5])
                bez([(x, y), p1, p2, p3])
                lc = p2
                x, y = p3
            elif c == "S":
                a = nums(4)
                p1 = (2 * x - lc[0], 2 * y - lc[1]) if lc else (x, y)
                p2, p3 = (ox + a[0], oy + a[1]), (ox + a[2], oy + a[3])
                bez([(x, y), p1, p2, p3])
                lc = p2
                x, y = p3
            elif c == "Q":
                a = nums(4)
                p1, p2 = (ox + a[0], oy + a[1]), (ox + a[2], oy + a[3])
                bez([(x, y), p1, p2])
                lc = p1
                x, y = p2
            elif c == "T":
                a = nums(2)
                p1 = (2 * x - lc[0], 2 * y - lc[1]) if lc else (x, y)
                p2 = (ox + a[0], oy + a[1])
                bez([(x, y), p1, p2])
                lc = p1
                x, y = p2
            elif c == "A":
                a = nums(7)
                x, y = ox + a[5], oy + a[6]
                cur.append((x, y))
                lc = None
            else:
                break
    except (ValueError, IndexError, TypeError):
        pass
    if cur:
        subs.append(cur)
    return [s for s in subs if len(s) >= 2]


def _shape_polys(el, tag):
    g = lambda k: float(re.findall(_NUM, el.get(k) or "0")[0]) if re.findall(_NUM, el.get(k) or "0") else 0.0  # noqa: E731
    if tag == "path":
        return path_subpaths(el.get("d", ""))
    if tag == "rect":
        x, y, w, h = g("x"), g("y"), g("width"), g("height")
        return [[(x, y), (x + w, y), (x + w, y + h), (x, y + h)]]
    if tag in ("polygon", "polyline"):
        p = [float(v) for v in re.findall(_NUM, el.get("points", ""))]
        return [list(zip(p[0::2], p[1::2]))]
    if tag in ("circle", "ellipse"):
        cx, cy = g("cx"), g("cy")
        rx = g("r") if tag == "circle" else g("rx")
        ry = g("r") if tag == "circle" else g("ry")
        return [[(cx + rx * math.cos(t / 24 * 2 * math.pi), cy + ry * math.sin(t / 24 * 2 * math.pi)) for t in range(24)]]
    if tag == "line":
        return [[(g("x1"), g("y1")), (g("x2"), g("y2"))]]
    return []


def _data_image(href: str):
    m = re.match(r"data:image/[a-z+]+;base64,(.*)", href or "", re.S)
    if not m:
        return None
    return Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert("L")


def rasterize(svg: str) -> tuple[Image.Image, list[float]]:
    root = ET.fromstring(svg)
    vb = [float(x) for x in re.findall(_NUM, root.get("viewBox", ""))]
    if len(vb) != 4 or vb[2] <= 0 or vb[3] <= 0:
        w = float((re.findall(_NUM, root.get("width") or "") or [1000])[0])
        h = float((re.findall(_NUM, root.get("height") or "") or [1000])[0])
        vb = [0.0, 0.0, w, h]
    W = RASTER_W
    H = max(1, round(W * vb[3] / vb[2]))
    s = W / vb[2]
    base = (s, 0.0, 0.0, s, -vb[0] * s, -vb[1] * s)
    img = Image.new("L", (W, H), 255)

    def walk(el, m, fill, stroke, sw):
        tag = el.tag.rsplit("}", 1)[-1]
        if tag in ("defs", "style", "title", "desc", "metadata", "clipPath", "mask", "symbol", "pattern", "linearGradient", "radialGradient", "text"):
            return
        if (_style(el, "display") or "").strip() == "none":
            return
        m = mul(m, parse_transform(el.get("transform")))
        f = _color(_style(el, "fill"))
        fill = fill if f == "inherit" else f
        st = _color(_style(el, "stroke"))
        stroke = stroke if st == "inherit" else st
        w = _style(el, "stroke-width")
        if w and re.findall(_NUM, w):
            sw = float(re.findall(_NUM, w)[0])
        if tag == "image":
            im = _data_image(el.get("href") or el.get("{http://www.w3.org/1999/xlink}href"))
            if im is not None:
                x, y = _apply(m, float(el.get("x") or 0), float(el.get("y") or 0))
                x2, y2 = _apply(m, float(el.get("x") or 0) + float(el.get("width") or im.width),
                                float(el.get("y") or 0) + float(el.get("height") or im.height))
                box = (round(x), round(y), max(round(x) + 1, round(x2)), max(round(y) + 1, round(y2)))
                img.paste(im.resize((box[2] - box[0], box[3] - box[1])), box[:2])
            return
        polys = _shape_polys(el, tag)
        if polys:
            pts = [[_apply(m, px, py) for px, py in p] for p in polys]
            if fill is not None and tag not in ("line", "polyline"):
                mask = Image.new("1", (W, H), 0)
                for p in pts:
                    if len(p) >= 3:
                        one = Image.new("1", (W, H), 0)
                        ImageDraw.Draw(one).polygon(p, fill=1)
                        mask = ImageChops.logical_xor(mask, one)
                lum = round(0.299 * fill[0] + 0.587 * fill[1] + 0.114 * fill[2])
                img.paste(lum, mask=mask)
            if stroke is not None and sw > 0:
                lum = round(0.299 * stroke[0] + 0.587 * stroke[1] + 0.114 * stroke[2])
                d = ImageDraw.Draw(img)
                width = max(1, round(sw * math.sqrt(abs(m[0] * m[3] - m[1] * m[2]))))
                for p in pts:
                    d.line(p + ([p[0]] if tag not in ("line", "polyline") else []), fill=lum, width=width)
        for ch in el:
            walk(ch, m, fill, stroke, sw)

    walk(root, base, (0, 0, 0), None, 1.0)
    return img, vb


def _components(px, W, H, min_n):
    """Zusammenhängende Flächen (4er-Nachbarschaft) einer Maske; liefert Label-Array und Größen."""
    lab = [0] * (W * H)
    sizes = [0]
    for i in range(W * H):
        if not px[i] or lab[i]:
            continue
        cid = len(sizes)
        lab[i] = cid
        q = deque([i])
        n = 0
        while q:
            j = q.popleft()
            n += 1
            x = j % W
            for k in ((j + 1) if x < W - 1 else -1, (j - 1) if x > 0 else -1, j + W if j + W < W * H else -1, j - W):
                if k >= 0 and px[k] and not lab[k]:
                    lab[k] = cid
                    q.append(k)
        sizes.append(n)
    keep = sum(1 for s in sizes[1:] if s >= min_n)
    return lab, sizes, keep


def analyze(svg: str) -> dict:
    img, vb = rasterize(svg)
    W, H = img.size
    total = W * H
    hist = img.histogram()
    # Boden = häufigster heller Grauwert (Vektorpläne); bei Fotos/Scans Otsu-Schwelle
    floor_v = max(range(101, 256), key=lambda v: hist[v])
    if hist[floor_v] / total > 0.15:
        mask = img.point(lambda v: 255 if abs(v - floor_v) <= 14 else 0)
    else:
        sum_all = sum(i * h for i, h in enumerate(hist))
        best, thr, wb, sb = -1.0, 128, 0, 0.0
        for t in range(256):
            wb += hist[t]
            if wb in (0, total):
                continue
            sb += t * hist[t]
            mb, mf = sb / wb, (sum_all - sb) / (total - wb)
            if (between := wb * (total - wb) * (mb - mf) ** 2) > best:
                best, thr = between, t
        mask = img.point(lambda v: 255 if v > thr else 0)
    floor_px = list(mask.tobytes())
    min_n = total * 0.003
    # Räume an Türöffnungen trennen: Maske schrumpfen, bis die meisten Räume einzeln dastehen
    best_k, best_lab, best_keep = 1, None, -1
    for k in (1, 9, 17, 25, 33, 41, 49):
        k = max(1, round(k * W / 480) | 1)
        er = list(mask.filter(ImageFilter.MinFilter(k)).tobytes()) if k > 1 else floor_px
        lab, sizes, keep = _components(er, W, H, total * 0.0015)
        if keep > best_keep:
            best_k, best_lab, best_sizes, best_keep = k, lab, sizes, keep
    lab, sizes = best_lab, best_sizes
    seeds = {cid for cid, n in enumerate(sizes) if cid and n >= total * 0.0015}
    lab = [c if c in seeds else 0 for c in lab]
    # Geschrumpfte Kerne wieder auf die ganze Bodenfläche ausdehnen
    q = deque(i for i in range(total) if lab[i])
    while q:
        j = q.popleft()
        x = j % W
        for k in ((j + 1) if x < W - 1 else -1, (j - 1) if x > 0 else -1, j + W if j + W < total else -1, j - W):
            if k >= 0 and floor_px[k] and not lab[k]:
                lab[k] = lab[j]
                q.append(k)
    stats: dict[int, list] = {}
    for i, c in enumerate(lab):
        if not c:
            continue
        x, y = i % W, i // W
        s = stats.get(c)
        if s is None:
            stats[c] = [1, x, y, x, y, x, y, x in (0, W - 1) or y in (0, H - 1)]
        else:
            s[0] += 1
            s[1] += x
            s[2] += y
            s[3] = min(s[3], x)
            s[4] = min(s[4], y)
            s[5] = max(s[5], x)
            s[6] = max(s[6], y)
            s[7] = s[7] or x in (0, W - 1) or y in (0, H - 1)
    big = [(c, s) for c, s in stats.items() if s[0] >= min_n]
    big.sort(key=lambda cs: (round(cs[1][4] / (H / 6)), cs[1][3]))
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    pct = lambda v, d: round(v / d * 100, 1)  # noqa: E731
    rooms, key = [], {}
    for i, (c, s) in enumerate(big[: len(letters)]):
        key[c] = letters[i]
        n, sx, sy, x0, y0, x1, y1, border = s
        rooms.append({
            "flaeche": letters[i],
            "links": pct(x0, W), "oben": pct(y0, H), "rechts": pct(x1 + 1, W), "unten": pct(y1 + 1, H),
            "mitte_x": pct(sx / n, W), "mitte_y": pct(sy / n, H),
            "anteil_prozent": round(n / total * 100, 1),
            **({"am_rand": True} if border else {}),
        })
    cols = 60
    rows = max(10, round(cols * H / W / 2))
    lines = []
    for r in range(rows):
        y = min(H - 1, int((r + 0.5) * H / rows))
        row = ""
        for col in range(cols):
            x = min(W - 1, int((col + 0.5) * W / cols))
            c = lab[y * W + x]
            row += key.get(c, "·") if c else ("#" if img.getpixel((x, y)) < 100 else " ")
        lines.append(f"{round((r + 0.5) * 100 / rows):>3}% {row}")
    return {
        "viewBox": vb,
        "seitenverhaeltnis": round(vb[2] / vb[3], 3),
        "flaechen": rooms,
        "karte": "\n".join(lines),
        "karte_legende": (f"{cols} Spalten = 0–100 % Breite, links steht die y-Position in Prozent. "
                          "# = Wand, Leerzeichen = Außenbereich/sonstige Fläche, Buchstabe = Raum (Bodenfläche), · = Kleinstfläche. "
                          "Räume werden an Türöffnungen getrennt; das ist eine Schätzung – nebeneinanderliegende Räume ohne Tür dazwischen sind getrennt, offene Grundrisse können zusammenhängen."),
    }
