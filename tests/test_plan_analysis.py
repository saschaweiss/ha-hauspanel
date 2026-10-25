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
