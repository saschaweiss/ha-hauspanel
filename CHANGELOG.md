# Changelog

## [0.13.0]

### Added
- Tint rooms: select a room label in the editor and add rules (state or numeric, optionally "for at least", like pin alerts) – the first matching rule tints the whole room, e.g. presence, window open or too cold. Room areas are detected from the floor plan (split at door openings); open-plan areas are shared between their labels. Opacity adjustable via custom CSS (`--tint-op`, `--tint-op-dark`).
- WebSocket command `hauspanel/plan/rooms` (room masks, cached) and MCP field `tints` for room labels.

## [0.12.0]

### Added
- Camera on event: a doorbell event (`event.*`), binary sensor or input boolean opens the camera view automatically on every panel (*General → Camera on event*). Switches to the camera's floor if it has a pin there, works without a pin too, shows what triggered it and closes after 30 s – 5 min unless someone uses the tablet. Turns the screen on in Fully Kiosk (JavaScript interface enabled). "Test" button in the editor.
- MCP: `cam_popups` setting.

## [0.11.0]

### Fixed
- MCP: `hauspanel_set_pins` rejected the `bare`, `off_style` and `flip` fields introduced in 0.10.x (found by the new tests).

### Removed
- The legacy start-page redirect card (`hauspanel-start.js`) is no longer loaded on every page. It has done nothing since 0.6.4; old redirect dashboards are still cleaned up automatically.

### Development
- Backend test suite (pytest-homeassistant-custom-component): setup, config flow, websocket API, conflict detection, SVG sanitizing, AI tools incl. undo, floor plan analysis.
- End-to-end test suite: the real panel in Chromium against a throwaway Home Assistant with the demo integration.
- CI on every push: ruff, built file up to date, version/changelog consistency, hassfest, HACS validation, both test suites. Releases are only created when CI passes.
- MIT licence.
- `npm run build` with pinned icon set; code comments translated to English; README screenshots from the demo layout.

## [0.10.1]

### Added
- Per pin "Mirror icon": flip the icon horizontally and/or vertically (e.g. to point a camera icon the other way). MCP field `flip` ("h", "v", "hv").

## [0.10.0]

### Added
- Per pin "No background": shows only the icon or value, without the circle. When on, the icon takes the on colour; when off it is greyed out, struck through, or both (selectable). Alerts colour the icon and pulse as a ring.
- MCP: `bare` and `off_style` pin fields.

## [0.9.2]

### Changed
- Smaller, subtler alert pulse.
- The colour popover closes when you click anywhere outside it.

## [0.9.1]

### Changed
- Alert "blink" is now a pulsar effect: soft rings expanding from the pin. Speed is adjustable per alert (slow / normal / fast).
- Text colour on coloured pins and highlights now follows the background brightness: strong colours like red get white text, light colours get dark text.

### Fixed
- Clicking the colour swatch next to the hex field now opens the colour wheel.
- "above" / "below" / "for at least" labels in the alert card were squeezed by the input fields.

## [0.9.0]
- Pin alerts, modelled on automation triggers: state (is / is not) or numeric value (above / below), optionally of another entity or an attribute, optionally "for at least" minutes/hours/days. The first matching alert colours the pin and can make it blink; the popup shows why

## [0.8.1]
- Header values next to the clock (up to 4 entities, e.g. tablet battery); battery icon reflects level and charging, turns accent-coloured at 20 % or less; tap opens HA's details
- Start page buttons show where Hauspanel is currently set as start page

## [0.8.0]
- English user interface: follows the Home Assistant language (German for `de`, English otherwise), including dates, numbers and the CSS cheat sheet
- Icon tooltips show English names in English mode

## [0.7.7]
- Entity search popup for "State from another entity" and the extra popup values (search by name or entity ID, "matching" or "all" entities)
- Tighter spacing in the selection tab (collapsed icon groups, size hint, checkbox hints)
- README rewritten in English

## [0.7.6]
- Selection tab reorganised with separators and more spacing

## [0.7.5]
- Calendar shows as many entries per day as fit, then "+N more"
- Icon groups are collapsible; only the group with the current icon is open

## [0.7.4]
- 100+ icons in eight groups with a German keyword search

## [0.7.3]
- Light popup: colour (hue slider and presets) and white temperature, depending on what the light supports

## [0.7.2]
- Camera pin with a state entity uses the regular "on" colour
- Camera popup view per pin: live or refreshing snapshot

## [0.7.1]
- Camera live view through Home Assistant's own stream handling (WebRTC/HLS/MJPEG), shortcut to HA's camera dialog
- "State from another entity" for every pin

## [0.7.0]
- Per pin: "tap toggles directly", long-press opens the popup

## [0.6.x]
- Portrait layout for phones and upright tablets
- Set Hauspanel as start page for yourself or all users
- Text colours for highlighted waste pickups and today's calendar day (with automatic contrast)

## [0.5.x]
- AI assistant tools via Home Assistant's MCP server, automatic backups with undo, conflict protection in the editor, floor plan room detection
- Per-pin and per-label size
- Adjustable column widths, hideable calendar, calendar range options
- Colour picker with hex input and saved palette
- Calendar visible in edit mode

## [0.4.x]
- First public release: floor plans (SVG/JPG/PNG), drag & drop pins, popups, weather, waste collection, calendar, night mode, design editor, custom CSS
