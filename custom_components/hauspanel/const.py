"""Konstanten für Hauspanel."""

DOMAIN = "hauspanel"
VERSION = "0.7.5"

PANEL_URL = "hauspanel"
PANEL_COMPONENT = "hauspanel-panel"
PANEL_TITLE = "Hauspanel"
PANEL_ICON = "mdi:floor-plan"

STATIC_URL = "/hauspanel_static"

STORAGE_VERSION = 1
STORAGE_KEY_CONFIG = f"{DOMAIN}.config"
STORAGE_KEY_PLANS = f"{DOMAIN}.plans"
STORAGE_KEY_HISTORY = f"{DOMAIN}.history"
MAX_HISTORY = 30

SIGNAL_UPDATED = f"{DOMAIN}_updated"

MAX_PLAN_BYTES = 3_500_000  # WebSocket-Nachrichten sind auf ~4 MB begrenzt
MAX_CONFIG_BYTES = 1_000_000

DEFAULT_CONFIG: dict = {
    "version": 1,
    "floors": [],
    "calendars": [],
    "weather_entity": None,
    "waste": [],
    "night": {"mode": "time", "from": 22, "to": 6},
}
