"""Floor plan analysis (room detection)."""

from custom_components.hauspanel.plan_analysis import analyze

# Two rooms side by side, separated by a wall with a door gap.
TWO_ROOMS = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
<rect x="0" y="0" width="200" height="100" fill="#fff"/>
<rect x="0" y="0" width="200" height="4" fill="#000"/><rect x="0" y="96" width="200" height="4" fill="#000"/>
<rect x="0" y="0" width="4" height="100" fill="#000"/><rect x="196" y="0" width="4" height="100" fill="#000"/>
<rect x="98" y="0" width="4" height="40" fill="#000"/><rect x="98" y="60" width="4" height="40" fill="#000"/>
</svg>"""


def test_detects_two_rooms_split_at_door():
    out = analyze(TWO_ROOMS)
    rooms = out["flaechen"]
    assert len(rooms) == 2, rooms
    centers = sorted(r["mitte_x"] for r in rooms)
    assert centers[0] < 50 < centers[1]
    assert out["karte"]


def _mask_pixels(data_url):
    import base64  # noqa: PLC0415
    import io  # noqa: PLC0415

    from PIL import Image  # noqa: PLC0415

    im = Image.open(io.BytesIO(base64.b64decode(data_url.split(",", 1)[1])))
    assert im.mode == "LA"  # CSS masks need an alpha channel
    im = im.getchannel("A")
    return im, sum(1 for v in im.tobytes() if v > 128)


def test_room_masks_one_per_label():
    from custom_components.hauspanel.plan_analysis import room_masks  # noqa: PLC0415

    masks = room_masks(TWO_ROOMS, [{"id": "left", "x": 4, "y": 6}, {"id": "right", "x": 54, "y": 6}])
    assert set(masks) == {"left", "right"}
    left, n_left = _mask_pixels(masks["left"])
    _right, n_right = _mask_pixels(masks["right"])
    assert n_left > 0 and n_right > 0
    w, h = left.size
    assert left.getpixel((w // 4, h // 2)) > 128 and left.getpixel((3 * w // 4, h // 2)) < 128


def test_room_masks_split_shared_area():
    from custom_components.hauspanel.plan_analysis import room_masks  # noqa: PLC0415

    open_plan = TWO_ROOMS.replace('<rect x="98" y="0" width="4" height="40" fill="#000"/><rect x="98" y="60" width="4" height="40" fill="#000"/>', "")
    masks = room_masks(open_plan, [{"id": "a", "x": 4, "y": 6}, {"id": "b", "x": 54, "y": 6}])
    _, na = _mask_pixels(masks["a"])
    _, nb = _mask_pixels(masks["b"])
    assert na > 0 and nb > 0 and 0.6 < na / nb < 1.6

