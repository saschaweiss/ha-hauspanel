/* Hauspanel – Grundriss-Dashboard für Home Assistant
 * Ein Web-Component-Modul ohne Build-Abhängigkeiten.
 * Icons: Lucide (ISC-Lizenz). Schrift: Inter (OFL).
 */
const HP_VERSION = "__VERSION__";
const ICONS = __ICONS__;

// Referenzbreite/-höhe: darauf wird skaliert, der Rest des Bildschirms geht an den Grundriss
const STAGE_W = 1280, STAGE_MIN_H = 800;
const PIN_ICONS = ["lightbulb","lamp-ceiling","lamp-floor","lamp-desk","plug","tv","speaker","fan","flame","thermometer","droplets","gauge","zap","cctv","blinds","door-open","lock","washing-machine","refrigerator","activity","sun","power"];
const PICK_DOMAINS = ["light","switch","climate","sensor","binary_sensor","camera","fan","cover","lock","media_player","input_boolean","scene","script"];
const ACTIVE_STATES = new Set(["on","open","opening","closing","unlocked","playing","home"]);
const POWER_OFF_DEFAULT = new Set(["light","switch","fan","media_player","input_boolean"]);

const DAYS = ["So","Mo","Di","Mi","Do","Fr","Sa"];
const DAYS_LONG = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
const MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const HVAC_LABEL = {off:"Aus",heat:"Heizen",cool:"Kühlen",heat_cool:"Heizen/Kühlen",auto:"Auto",dry:"Entfeuchten",fan_only:"Lüften"};
const WEATHER = {
  "clear-night":["moon","Klar"], cloudy:["cloud","Bewölkt"], exceptional:["triangle-alert","Unwetter"],
  fog:["cloud-fog","Nebel"], hail:["cloud-hail","Hagel"], lightning:["cloud-lightning","Gewitter"],
  "lightning-rainy":["cloud-lightning","Gewitter"], partlycloudy:["cloud-sun","Leicht bewölkt"],
  pouring:["cloud-rain-wind","Starkregen"], rainy:["cloud-rain","Regen"], snowy:["cloud-snow","Schnee"],
  "snowy-rainy":["cloud-snow","Schneeregen"], sunny:["sun","Sonnig"], windy:["wind","Windig"], "windy-variant":["wind","Windig"]
};
const STATE_LABEL = {on:"An",off:"Aus",open:"Offen",closed:"Geschlossen",opening:"Öffnet",closing:"Schließt",
  locked:"Verriegelt",unlocked:"Entriegelt",locking:"Verriegelt…",unlocking:"Entriegelt…",jammed:"Blockiert",
  playing:"Wiedergabe",paused:"Pausiert",idle:"Bereit",standby:"Standby",unavailable:"Nicht erreichbar",
  unknown:"Unbekannt",home:"Zuhause",not_home:"Abwesend",streaming:"Live",recording:"Aufnahme",...HVAC_LABEL};

/* ---------- Hilfsfunktionen ---------- */
const ic = (name, size = 20, sw = 2) =>
  `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" style="stroke-width:${sw}">${ICONS[name] || ICONS["circle-dot"]}</svg>`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = (n) => (n < 10 ? "0" : "") + n;
const domainOf = (id) => String(id).split(".")[0];
const uid = (p = "") => p + Math.random().toString(36).slice(2, 10);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const monday = (d) => { const x = startOfDay(d); return addDays(x, -((x.getDay() + 6) % 7)); };
const fmtShort = (d) => pad(d.getDate()) + "." + pad(d.getMonth() + 1) + ".";
const hhmm = (d) => pad(d.getHours()) + ":" + pad(d.getMinutes());
const isoLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
const fmtNum = (v, dec = 1) => Number(v).toLocaleString("de-DE", { maximumFractionDigits: dec });
function kw(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const n = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - n);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y) / 864e5 + 1) / 7);
}
function parseDate(s) {
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
  const d = new Date(s); return isNaN(d) ? null : d;
}
const clone = (o) => JSON.parse(JSON.stringify(o));

function friendly(hass, id) {
  const s = hass && hass.states[id];
  return (s && s.attributes.friendly_name) || id;
}
function isActive(stateObj) {
  if (!stateObj) return false;
  const d = domainOf(stateObj.entity_id), st = stateObj.state;
  if (["sensor","camera","scene","script","weather","calendar"].includes(d)) return false;
  if (d === "climate") return st !== "off" && st !== "unavailable" && st !== "unknown";
  return ACTIVE_STATES.has(st);
}
function defaultIcon(stateObj, id) {
  const d = domainOf(id), dc = stateObj && stateObj.attributes.device_class;
  switch (d) {
    case "light": return "lightbulb";
    case "switch": return "plug";
    case "climate": return "flame";
    case "camera": return "cctv";
    case "fan": return "fan";
    case "cover": return "blinds";
    case "lock": return "lock";
    case "media_player": return dc === "speaker" ? "speaker" : "tv";
    case "input_boolean": return "toggle-left";
    case "scene": case "script": return "play";
    case "binary_sensor": return ["door","window","opening","garage_door"].includes(dc) ? "door-open" : dc === "motion" || dc === "occupancy" ? "activity" : "circle-dot";
    case "sensor":
      if (dc === "temperature") return "thermometer";
      if (dc === "humidity" || dc === "moisture") return "droplets";
      if (dc === "power" || dc === "energy" || dc === "current" || dc === "voltage") return "zap";
      return "gauge";
  }
  return "circle-dot";
}
function fmtState(stateObj) {
  if (!stateObj) return "Nicht gefunden";
  const a = stateObj.attributes, st = stateObj.state, d = domainOf(stateObj.entity_id);
  if (st !== "" && !isNaN(Number(st)) && d === "sensor") {
    const dec = a.unit_of_measurement === "kWh" ? 2 : 1;
    return fmtNum(st, dec) + (a.unit_of_measurement ? " " + a.unit_of_measurement : "");
  }
  if (d === "sensor" && a.device_class === "timestamp") {
    const t = parseDate(st); if (t) return fmtShort(t) + " " + hhmm(t);
  }
  if (d === "binary_sensor") {
    const dc = a.device_class;
    if (["door","window","opening","garage_door"].includes(dc)) return st === "on" ? "Offen" : "Geschlossen";
    if (dc === "motion" || dc === "occupancy") return st === "on" ? "Bewegung" : "Ruhig";
  }
  return STATE_LABEL[st] || st;
}
function supportsBrightness(stateObj) {
  const m = stateObj.attributes.supported_color_modes;
  return Array.isArray(m) ? !(m.length === 1 && m[0] === "onoff") : stateObj.attributes.brightness != null;
}
/* Findet ein Datum irgendwo in einem Text: 2026-10-16 · 16.10.2026 · Fr, 16.10.26 · 16.10. */
function findDate(str) {
  const s = String(str ?? "");
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = s.match(/(?:^|[^\d])(\d{1,2})\.(\d{1,2})\.(\d{2,4})?(?!\d)/);
  if (m) {
    const today = startOfDay(new Date());
    let y = m[3] ? +m[3] : today.getFullYear();
    if (y < 100) y += 2000;
    let d = new Date(y, +m[2] - 1, +m[1]);
    if (!m[3] && d < addDays(today, -1)) d = new Date(y + 1, +m[2] - 1, +m[1]);
    return isNaN(d) ? null : d;
  }
  return null;
}
const daysUntil = (d) => Math.round((startOfDay(d) - startOfDay(new Date())) / 864e5);
const SKIP_ATTR = new Set(["friendly_name","icon","entity_picture","unit_of_measurement","device_class","attribution","state_class"]);
/* Tage bis zur Abholung. Versteht Waste Collection Schedule (Zustand „in 3 Tagen“/„morgen“,
   Attribut daysTo, Termine als Attribute) sowie eigene Template-Sensoren (Datum oder Zahl). */
function wasteDays(stateObj) {
  if (!stateObj) return null;
  const a = stateObj.attributes;
  for (const k of ["daysTo", "days_to", "days"]) if (a[k] != null && a[k] !== "" && !isNaN(Number(a[k]))) return Number(a[k]);
  const st = String(stateObj.state).trim(), low = st.toLowerCase();
  if (!["unknown", "unavailable", ""].includes(low)) {
    if (/^-?\d+$/.test(st)) return Number(st);
    const d = findDate(st);
    if (d) return daysUntil(d);
    if (/\b(heute|today)\b/.test(low)) return 0;
    if (/\b(übermorgen)\b/.test(low)) return 2;
    if (/\b(morgen|tomorrow)\b/.test(low)) return 1;
    const n = low.match(/(\d+)\s*(tag|tagen|day|days)\b/) || low.match(/\bin\s+(\d+)/);
    if (n) return Number(n[1]);
  }
  // Termine stehen in den Attributen (Schlüssel oder Werte) -> frühesten zukünftigen nehmen
  let best = null;
  for (const [k, v] of Object.entries(a)) {
    if (SKIP_ATTR.has(k)) continue;
    for (const cand of [k, ...(Array.isArray(v) ? v : [v])]) {
      if (typeof cand !== "string") continue;
      const d = findDate(cand);
      if (!d) continue;
      const n = daysUntil(d);
      if (n >= 0 && (best === null || n < best)) best = n;
    }
  }
  return best;
}

/* ---------- Design (Tab „Design“ im Editor) ---------- */
const DEFAULT_THEME = {
  light: { accent: "#E5391D", bg: "#EEECEA", card: "#FFFFFF", tile: "#F4F2F0", text: "#1E1C1B", muted: "#8A8580",
    dark: "#1F1D1C", wall: "#2E2C2B", floor: "#FFFFFF", outside: "#EDEBE9" },
  dark: { accent: "#E5391D", bg: "#0F0E0E", card: "#1A1918", tile: "#242221", text: "#ECE9E5", muted: "#8C8782",
    dark: "#242221", wall: "#77726D", floor: "#1A1918", outside: "#151413" },
  size: { font: 100, radius: 22, gap: 12, margin: 18, pad: 16, cal: 198, pin: 36, pinFont: 14, label: 11 },
};
const THEME_COLORS = [["accent","Akzent (aktiv, Buttons)"],["bg","Hintergrund"],["card","Karten"],["tile","Kacheln in Karten"],
  ["text","Text"],["muted","Text gedämpft"],["dark","Dunkle Karten (Uhr, Wetter)"],["wall","Wände"],["floor","Boden"],["outside","Außenbereich"]];
const THEME_SIZES = [["font","Schriftgröße",70,140,"%"],["radius","Ecken-Rundung",0,40,"px"],["gap","Abstand zwischen Karten",0,32,"px"],
  ["margin","Rand außen",0,48,"px"],["pad","Innenabstand der Karten",6,32,"px"],["cal","Höhe Kalenderleiste",140,320,"px"],
  ["pin","Größe der Geräte-Pins",22,64,"px"],["pinFont","Schrift in Pins (Werte)",9,26,"px"],["label","Schrift Raum-Labels",7,24,"px"]];
function mergeTheme(t) {
  t = t || {};
  return { light: { ...DEFAULT_THEME.light, ...(t.light || {}) }, dark: { ...DEFAULT_THEME.dark, ...(t.dark || {}) }, size: { ...DEFAULT_THEME.size, ...(t.size || {}) } };
}
const hexRgb = (h) => { const m = String(h).replace("#", ""); const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mixHex = (a, b, w) => { const x = hexRgb(a), y = hexRgb(b); return "#" + x.map((v, i) => Math.round(v * w + y[i] * (1 - w)).toString(16).padStart(2, "0")).join(""); };
const rgba = (h, al) => { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${al})`; };
function themeCss(theme) {
  const t = mergeTheme(theme), s = t.size;
  const vars = (o, dark) => `--accent:${o.accent};--accent-soft:${mixHex(o.accent, o.card, dark ? 0.22 : 0.14)};--accent-glow:${rgba(o.accent, dark ? 0.25 : 0.35)};` +
    `--bg:${o.bg};--card:${o.card};--tile:${o.tile};--tile-2:${mixHex(o.text, o.tile, 0.05)};--text:${o.text};--muted:${o.muted};` +
    `--soft:${mixHex(o.muted, o.card, 0.5)};--dark:${o.dark};--dark-2:${mixHex("#ffffff", o.dark, 0.07)};` +
    `--wall:${o.wall};--floor:${o.floor};--outside:${o.outside};--door:${mixHex(o.wall, o.floor, 0.4)}`;
  return `:host{${vars(t.light)};--fs:${s.font / 100};--radius:${s.radius}px;--gap:${s.gap}px;--m:${s.margin}px;--pad:${s.pad}px;` +
    `--cal-h:${s.cal}px;--pin:${s.pin}px;--pin-fs:${s.pinFont}px;--label-fs:${s.label}px}` +
    `:host([data-theme="dark"]){${vars(t.dark, true)}}`;
}

/* ---------- SVG: säubern, Farben ans Theme binden ---------- */
const SVG_BAD = new Set(["script","foreignobject","iframe","object","embed","audio","video","animate","set","animatemotion","animatetransform"]);
function lum(c) {
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
  if (!m) return null;
  if (m[4] !== undefined && Number(m[4]) === 0) return null;
  return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
}
function colorClass(c) {
  const l = lum(c);
  if (l === null) return null;
  if (l < 0.3) return "wall";
  if (l > 0.93) return "floor";
  if (l > 0.7) return "out";
  return "door";
}
function processSvg(raw, recolor, scratch) {
  const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== "svg" || doc.querySelector("parsererror")) return null;
  const walk = (el) => {
    for (const child of Array.from(el.children)) {
      const n = child.nodeName.toLowerCase();
      if (SVG_BAD.has(n)) { child.remove(); continue; }
      for (const at of Array.from(child.attributes)) {
        const an = at.name.toLowerCase(), v = at.value.trim().toLowerCase();
        if (an.startsWith("on")) child.removeAttribute(at.name);
        else if ((an === "href" || an === "xlink:href") && !v.startsWith("#") && !/^data:image\/(png|jpe?g|gif|webp);/.test(v)) child.removeAttribute(at.name);
      }
      walk(child);
    }
  };
  walk(svg);
  for (const at of Array.from(svg.attributes)) if (at.name.toLowerCase().startsWith("on")) svg.removeAttribute(at.name);

  let vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
  if (vb.length !== 4 || vb.some(isNaN)) {
    const w = parseFloat(svg.getAttribute("width")) || 1000, h = parseFloat(svg.getAttribute("height")) || 1000;
    vb = [0, 0, w, h]; svg.setAttribute("viewBox", vb.join(" "));
  }
  // Berechnete Farben auslesen (fängt auch <style>-Klassen aus Illustrator & Co. ab)
  const live = document.importNode(svg, true);
  scratch.appendChild(live);
  const src = [live, ...live.querySelectorAll("*")], dst = [svg, ...svg.querySelectorAll("*")];
  const shapes = new Set(["path","rect","circle","ellipse","line","polyline","polygon","text","tspan","use","g","svg"]);
  for (let i = 0; i < src.length; i++) {
    const n = dst[i].nodeName.toLowerCase();
    if (!shapes.has(n)) continue;
    const cs = getComputedStyle(src[i]);
    const fill = cs.fill, stroke = cs.stroke;
    dst[i].removeAttribute("style");
    dst[i].removeAttribute("class");
    if (n === "g" || n === "svg") { dst[i].removeAttribute("fill"); dst[i].removeAttribute("stroke"); continue; }
    const fc = recolor && colorClass(fill), sc = recolor && stroke !== "none" && colorClass(stroke);
    if (fc) { dst[i].removeAttribute("fill"); dst[i].setAttribute("class", "f-" + fc); }
    else dst[i].setAttribute("fill", fill.startsWith("url(") ? fill.replace(/"/g, "'") : fill);
    if (sc) { dst[i].removeAttribute("stroke"); dst[i].classList.add("s-" + sc); }
    else if (stroke && stroke !== "none") dst[i].setAttribute("stroke", stroke);
    if (stroke && stroke !== "none" && cs.strokeWidth) dst[i].setAttribute("stroke-width", parseFloat(cs.strokeWidth));
  }
  scratch.removeChild(live);
  svg.querySelectorAll("style,title,desc,metadata").forEach((e) => e.remove());
  svg.removeAttribute("width"); svg.removeAttribute("height");
  svg.setAttribute("class", "fp");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  return { html: new XMLSerializer().serializeToString(svg), aspect: vb[2] / vb[3] };
}

/* ---------- Styles ---------- */
const CSS = `
:host{--fs:1;--radius:22px;--gap:12px;--m:18px;--pad:16px;--pin:36px;--pin-fs:14px;--label-fs:11px;--cal-h:198px;
  --bg:#EEECEA;--card:#FFFFFF;--tile:#F4F2F0;--tile-2:#ECE9E6;--text:#1E1C1B;--muted:#8A8580;--soft:#C9C4BF;
  --accent:#E5391D;--accent-soft:#FCE6E1;--accent-glow:rgba(229,57,29,.35);--dark:#1F1D1C;--dark-2:#2C2A28;
  --on-dark:#FFFFFF;--on-dark-muted:#A39E99;--wall:#2E2C2B;--floor:#FFFFFF;--outside:#EDEBE9;--door:#B3AEA9;
  --shadow:0 2px 10px rgba(30,28,27,.06);--pin-shadow:0 2px 8px rgba(30,28,27,.14);--overlay:rgba(30,28,27,.42);
  display:block;position:relative;width:100%;height:100vh;overflow:hidden;background:var(--bg);color:var(--text);
  font-family:"Hauspanel Inter",Inter,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
:host([data-theme="dark"]){--bg:#0F0E0E;--card:#1A1918;--tile:#242221;--tile-2:#2C2A28;--text:#ECE9E5;--muted:#8C8782;--soft:#4A4643;
  --accent-soft:#3A1F19;--accent-glow:rgba(229,57,29,.25);--dark:#242221;--dark-2:#2E2C2A;
  --wall:#77726D;--floor:#1A1918;--outside:#151413;--door:#4A4643;--shadow:none;--pin-shadow:0 2px 8px rgba(0,0,0,.5);--overlay:rgba(0,0,0,.6)}
:host(.kiosk){position:fixed;inset:0;z-index:100;height:auto}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
input,select,textarea{font:inherit;color:inherit}
svg.i{display:block;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;flex:none}
#stage{position:absolute;left:0;top:0;width:${STAGE_W}px;height:800px;transform-origin:0 0;user-select:none;-webkit-user-select:none}
.card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow)}
#scratch{position:absolute;left:-9999px;top:0;width:10px;height:10px;overflow:hidden;visibility:hidden}

#top{position:absolute;left:var(--m);right:var(--m);top:calc(var(--m) - 4px);height:42px;display:flex;align-items:center;gap:10px}
.pill{height:42px;border-radius:21px;display:flex;align-items:center;gap:10px;padding:0 18px;flex:none}
#home{background:var(--card);width:176px;justify-content:center;font-weight:700;font-size:calc(17px * var(--fs));box-shadow:var(--shadow)}
.home-ico{width:26px;height:26px;border-radius:8px;background:var(--accent);color:#fff;display:grid;place-items:center}
#date{margin-left:10px;font-size:calc(23px * var(--fs));font-weight:500;letter-spacing:-.2px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#date small{font-size:calc(14px * var(--fs));color:var(--muted);font-weight:500;margin-left:8px}
#clock{background:var(--dark);color:var(--on-dark);font-size:calc(25px * var(--fs));font-weight:700;letter-spacing:-.3px;font-variant-numeric:tabular-nums}
#clock svg{color:var(--accent)}
.icon-btn{width:42px;height:42px;border-radius:50%;background:var(--card);display:grid;place-items:center;box-shadow:var(--shadow);flex:none}
.btn{height:42px;border-radius:21px;padding:0 20px;font-weight:700;font-size:calc(15px * var(--fs));background:var(--card);box-shadow:var(--shadow);display:flex;align-items:center;gap:8px;flex:none}
.btn.primary{background:var(--accent);color:#fff}
.btn.danger{color:var(--accent)}
.btn:disabled{opacity:.45}

#main{position:absolute;left:var(--m);right:var(--m);top:calc(var(--m) + 54px);bottom:calc(var(--m) + var(--cal-h) + var(--gap));display:grid;grid-template-columns:176px 1fr 282px;gap:var(--gap)}
#floors{padding:calc(var(--pad) * .75);display:flex;flex-direction:column;gap:8px;overflow-y:auto;scrollbar-width:none}
#floors::-webkit-scrollbar{display:none}
#floors.compact .roof{height:34px}#floors.compact .roof svg{height:34px}
#floors.compact .floor-btn{height:58px;padding:9px 14px}#floors.compact .floor-btn .code{font-size:calc(19px * var(--fs))}
#floors.compact .floor-btn .name{margin-top:2px}#floors.compact .floor-btn .count{top:11px}
.roof{height:52px;display:flex;justify-content:center;align-items:flex-end;flex:none}
.floor-btn{position:relative;height:82px;border-radius:16px;background:var(--tile);text-align:left;padding:12px 14px;flex:none;transition:background .2s,color .2s}
.floor-btn .code{font-size:calc(22px * var(--fs));font-weight:800;letter-spacing:-.3px}
.floor-btn .name{font-size:calc(12.5px * var(--fs));color:var(--muted);margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.floor-btn .count{position:absolute;right:13px;top:15px;display:flex;align-items:center;gap:4px;font-size:calc(12.5px * var(--fs));font-weight:500;color:var(--muted)}
.floor-btn.active{background:var(--accent);color:#fff;box-shadow:0 6px 16px var(--accent-glow)}
.floor-btn.active .name,.floor-btn.active .count{color:rgba(255,255,255,.92)}
.floor-sep{height:2px;background:var(--tile-2);margin:2px 4px;border-radius:1px;flex:none}
.floor-add{height:44px;border-radius:14px;border:2px dashed var(--soft);color:var(--muted);font-weight:600;font-size:calc(13px * var(--fs));display:flex;align-items:center;justify-content:center;gap:6px;flex:none}

#plan-card{position:relative;padding:calc(var(--pad) * 1.1) calc(var(--pad) * 1.25);display:flex;flex-direction:column;overflow:hidden;min-width:0}
#plan-head{display:flex;align-items:center;gap:10px;height:40px;flex:none}
#plan-title{font-size:calc(21px * var(--fs));font-weight:700;letter-spacing:-.3px;flex:1}
#all-off{width:40px;height:40px;border-radius:50%;background:var(--dark);color:#fff;display:grid;place-items:center}
#all-off:active{transform:scale(.94)}
#plan-wrap{flex:1;position:relative;margin-top:6px}
#plan{position:absolute}
#plan > svg.fp{position:absolute;inset:0;width:100%;height:100%}
svg.fp{fill:var(--wall)}
.fp .f-wall{fill:var(--wall)}.fp .f-floor{fill:var(--floor)}.fp .f-out{fill:var(--outside)}.fp .f-door{fill:var(--door)}
.fp .s-wall{stroke:var(--wall)}.fp .s-floor{stroke:var(--floor)}.fp .s-out{stroke:var(--outside)}.fp .s-door{stroke:var(--door)}
.room-label{position:absolute;font-size:calc(var(--label-fs) * var(--k, 1));font-weight:600;color:var(--muted);white-space:nowrap;pointer-events:none}
.pin{position:absolute;min-width:var(--pin);height:var(--pin);transform:translate(-50%,-50%) scale(var(--k, 1));border-radius:calc(var(--pin) / 2);background:var(--card);color:var(--text);
  display:flex;align-items:center;justify-content:center;gap:4px;box-shadow:var(--pin-shadow);transition:background .2s,color .2s,transform .12s;white-space:nowrap}
.pin:active{transform:translate(-50%,-50%) scale(calc(var(--k, 1) * .9))}
.pin svg.i{width:calc(var(--pin) * .5);height:calc(var(--pin) * .5)}
.pin.both svg.i{width:calc(var(--pin) * .42);height:calc(var(--pin) * .42)}
.pin.val{padding:0 calc(var(--pin) * .3);font-size:var(--pin-fs);font-weight:700;letter-spacing:-.2px;font-variant-numeric:tabular-nums}
.pin.val.both{padding:0 calc(var(--pin) * .3) 0 calc(var(--pin) * .22)}
.pin.on{background:var(--accent);color:#fff;box-shadow:0 3px 10px var(--accent-glow)}
.pin.cam{background:var(--dark);color:#fff}
.pin.unavail{opacity:.4}
.empty{position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:var(--muted);font-size:calc(14px * var(--fs));line-height:1.6;padding:20px}
.empty b{display:block;color:var(--text);font-size:calc(17px * var(--fs));margin-bottom:4px}

#right{display:flex;flex-direction:column;gap:var(--gap);min-height:0}
#weather{background:var(--dark);color:var(--on-dark);border-radius:var(--radius);padding:var(--pad) calc(var(--pad) * .875) calc(var(--pad) * .875);flex:none}
.w-now{display:flex;align-items:flex-start;padding:0 4px}
.w-temp{font-size:calc(50px * var(--fs));font-weight:800;letter-spacing:-2px;line-height:1}
.w-cond{margin-left:12px;margin-top:6px;font-size:calc(13px * var(--fs));color:var(--on-dark-muted);line-height:1.45;min-width:0}
.w-cond b{display:block;color:#fff;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w-ico{margin-left:auto;color:var(--accent)}
.w-days{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:16px}
.w-day{background:var(--dark-2);border-radius:13px;padding:8px 0 9px;text-align:center;font-size:calc(12.5px * var(--fs))}
.w-day .d{font-weight:600;color:var(--on-dark-muted)}
.w-day svg{margin:6px auto 5px;color:#fff}
.w-day .t{white-space:nowrap}
.w-day .t b{font-weight:700}.w-day .t span{color:var(--on-dark-muted)}
.w-empty{color:var(--on-dark-muted);font-size:calc(13px * var(--fs));padding:8px 4px;line-height:1.5}

#waste{flex:1;padding:var(--pad) calc(var(--pad) * .875);min-height:0;overflow:hidden}
.sec-head{display:flex;align-items:center;gap:8px;font-size:calc(15.5px * var(--fs));font-weight:700;margin:0 4px 12px}
.sec-head svg{color:var(--accent)}
.bin{display:flex;align-items:center;gap:11px;padding:8px 10px;border-radius:15px;background:var(--tile);margin-bottom:7px}
.bin.soon{background:var(--accent-soft)}
.bin-ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:#fff;flex:none}
.bin .n{font-size:calc(14px * var(--fs));font-weight:700}.bin .d{font-size:calc(11.5px * var(--fs));color:var(--muted);margin-top:2px}
.bin .b{margin-left:auto;font-size:calc(11.5px * var(--fs));font-weight:600;padding:5px 9px;border-radius:12px;background:var(--card);color:var(--muted);white-space:nowrap}
.bin.soon .b{background:var(--accent);color:#fff}
.muted-note{font-size:calc(12.5px * var(--fs));color:var(--muted);padding:0 4px;line-height:1.5}

#cal{position:absolute;left:var(--m);right:var(--m);bottom:var(--m);height:var(--cal-h);display:grid;grid-template-columns:162px repeat(7,1fr);gap:8px;padding:calc(var(--pad) * .875) calc(var(--pad) * .75) calc(var(--pad) * .75) var(--pad)}
.cal-side{display:flex;flex-direction:column;min-width:0}
.cal-range{font-size:calc(14px * var(--fs));font-weight:700;margin-top:2px}
.cal-kw{font-size:calc(12px * var(--fs));color:var(--muted);margin-top:2px}
.cal-nav{display:flex;gap:8px;margin-top:12px}
.cal-nav button{width:34px;height:34px;border-radius:50%;background:var(--tile);display:grid;place-items:center}
.legend{margin-top:auto;display:flex;flex-wrap:wrap;gap:4px 12px;font-size:calc(12px * var(--fs))}
.legend span{display:flex;align-items:center;gap:5px}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;flex:none}
:host([data-theme="dark"]) .dot,:host([data-theme="dark"]) .ev::before,:host([data-theme="dark"]) .ev-pop .bar{box-shadow:0 0 0 1px rgba(255,255,255,.35)}
.day{background:var(--tile);border-radius:15px;padding:8px 6px 6px;min-width:0;display:flex;flex-direction:column;gap:5px;overflow:hidden}
.day.today{background:var(--accent-soft)}
.day-h{padding:0 5px 2px;font-size:calc(12px * var(--fs));color:var(--muted);font-weight:600}
.day-h b{color:var(--text);font-size:calc(15.5px * var(--fs));font-weight:800;margin-left:4px}
.ev{background:var(--card);border-radius:10px;padding:5px 7px 5px 12px;position:relative;text-align:left;width:100%;min-width:0;flex:none}
.ev::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:3px;border-radius:2px;background:var(--c)}
.ev .t{font-size:calc(10.5px * var(--fs));color:var(--muted);font-variant-numeric:tabular-nums}
.ev .n{font-size:calc(12px * var(--fs));font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chip{display:inline-flex;align-items:center;gap:5px;background:var(--card);border-radius:10px;padding:4px 8px;font-size:calc(11.5px * var(--fs));font-weight:700;align-self:flex-start;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none}
.more{font-size:calc(11px * var(--fs));font-weight:600;color:var(--muted);padding-left:6px;text-align:left}

#overlay{position:absolute;inset:0;background:var(--overlay);display:none;align-items:center;justify-content:center;z-index:10}
#overlay.show{display:flex}
.pop{background:var(--card);border-radius:26px;width:460px;max-height:740px;overflow:auto;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.pop.wide{width:720px}
.pop-h{display:flex;align-items:center;gap:14px}
.pop-ico{width:48px;height:48px;border-radius:13px;background:var(--tile);display:grid;place-items:center;flex:none}
.pop-ico.on{background:var(--accent);color:#fff}.pop-ico.cam{background:var(--dark);color:#fff}
.pop-sub{font-size:calc(12.5px * var(--fs));font-weight:600;color:var(--muted)}
.pop-title{font-size:calc(22px * var(--fs));font-weight:800;letter-spacing:-.4px;margin-top:2px}
.pop-x{margin-left:auto;width:42px;height:42px;border-radius:50%;background:var(--tile);display:grid;place-items:center;flex:none;align-self:flex-start}
.pop-state{display:flex;align-items:center;margin-top:22px;gap:12px}
.pop-state .big{font-size:calc(42px * var(--fs));font-weight:800;letter-spacing:-1.5px;line-height:1}
.pop-state .s{font-size:calc(13.5px * var(--fs));color:var(--muted);margin-top:6px}
.toggle{margin-left:auto;width:66px;height:38px;border-radius:19px;background:var(--tile-2);position:relative;transition:background .2s;flex:none}
.toggle::after{content:"";position:absolute;left:4px;top:4px;width:30px;height:30px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2);transition:transform .2s}
.toggle.on{background:var(--accent)}.toggle.on::after{transform:translateX(28px)}
.panel{background:var(--tile);border-radius:16px;padding:14px 16px;margin-top:16px}
.panel-h{display:flex;justify-content:space-between;font-size:calc(13.5px * var(--fs));font-weight:700}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:28px;background:transparent;margin-top:6px}
input[type=range]::-webkit-slider-runnable-track{height:8px;border-radius:4px;background:linear-gradient(90deg,var(--accent) var(--p),var(--card) var(--p));box-shadow:inset 0 0 0 1px var(--soft)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--accent);margin-top:-8px;border:3px solid var(--card)}
input[type=range]::-moz-range-track{height:8px;border-radius:4px;background:linear-gradient(90deg,var(--accent) var(--p),var(--card) var(--p))}
input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--accent);border:3px solid var(--card)}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}
.tiles .panel{margin-top:0}
.tiles .l{font-size:calc(12.5px * var(--fs));color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tiles .v{font-size:calc(22px * var(--fs));font-weight:800;margin-top:6px;letter-spacing:-.4px}
.stepper{display:flex;align-items:center;gap:14px;margin-left:auto}
.stepper button{width:44px;height:44px;border-radius:50%;background:var(--tile);display:grid;place-items:center}
.modes{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.modes button{flex:1 1 calc(50% - 4px);height:40px;border-radius:12px;background:var(--card);font-size:calc(13.5px * var(--fs));font-weight:600}
.modes button.sel{background:var(--accent);color:#fff}
.cam-box{margin-top:16px;aspect-ratio:16/9;border-radius:16px;background:#111;overflow:hidden;display:grid;place-items:center;color:#8a8580;font-size:calc(13px * var(--fs))}
.cam-box img{width:100%;height:100%;object-fit:contain;display:block}
.ev-pop .bar{width:5px;align-self:stretch;border-radius:3px;background:var(--c);flex:none}
.ev-row{display:flex;gap:14px;margin-top:18px;align-items:flex-start}
.ev-row svg{color:var(--muted);margin-top:2px}
.ev-row b{display:block;font-size:calc(16px * var(--fs));font-weight:700}.ev-row span{font-size:calc(13.5px * var(--fs));color:var(--muted);display:block;margin-top:3px}
.note{font-size:calc(14.5px * var(--fs));line-height:1.5;white-space:pre-wrap;word-break:break-word}
#toast{position:absolute;left:50%;bottom:232px;transform:translateX(-50%);background:var(--dark);color:#fff;padding:11px 18px;border-radius:14px;font-size:calc(14px * var(--fs));font-weight:600;opacity:0;transition:opacity .25s;pointer-events:none;z-index:20;white-space:nowrap}
#toast.show{opacity:1}

/* ---------- Editor ---------- */
.edit #main{bottom:var(--m);grid-template-columns:176px 1fr 360px}
.edit #cal{display:none}
.edit .pin{cursor:grab;touch-action:none}
.edit .pin.sel{box-shadow:0 0 0 3px var(--card),0 0 0 6px var(--accent)}
.edit .room-label{pointer-events:auto;cursor:grab;touch-action:none;border-radius:4px;outline:1.5px dashed var(--soft);outline-offset:3px}
.edit .room-label.sel{outline-color:var(--accent);color:var(--accent)}
.edit #plan.drop{outline:3px dashed var(--accent);outline-offset:6px;border-radius:6px}
#insp{display:flex;flex-direction:column;padding:14px;min-height:0}
.tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;background:var(--tile);border-radius:14px;padding:4px;flex:none}
.tabs button{height:34px;border-radius:10px;font-size:12.5px;font-weight:600;color:var(--muted)}
.tabs button.sel{background:var(--card);color:var(--text);box-shadow:var(--shadow)}
.insp-body{flex:1;overflow:auto;margin-top:12px;padding:0 2px 8px;user-select:text;-webkit-user-select:text}
.fld{margin-bottom:14px}
.fld > label:not(.drop-zone),.lbl{display:block;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px}
.inp{width:100%;height:38px;border-radius:11px;border:1.5px solid transparent;background:var(--tile);padding:0 12px;font-size:14px;outline:none}
.inp:focus{border-color:var(--accent)}
select.inp{padding-right:6px}
.row{display:flex;gap:8px;align-items:center}
.row > *{min-width:0}
.check{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;padding:6px 0;cursor:pointer}
.check input{width:18px;height:18px;accent-color:var(--accent);flex:none}
.hint{font-size:12.5px;color:var(--muted);line-height:1.5;margin:4px 0 12px}
.sbtn{height:36px;border-radius:11px;background:var(--tile);padding:0 12px;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px;flex:none}
.sbtn.primary{background:var(--accent);color:#fff}
.sbtn.danger{color:var(--accent)}
.sbtn.full{width:100%;justify-content:center}
.ent-list{display:flex;flex-direction:column;gap:6px}
.ent{display:flex;align-items:center;gap:10px;padding:7px 8px 7px 6px;border-radius:12px;background:var(--tile);touch-action:pan-y}
.ent .grip{color:var(--muted);cursor:grab;touch-action:none;padding:4px 0}
.ent .e-ico{width:32px;height:32px;border-radius:9px;background:var(--card);display:grid;place-items:center;flex:none}
.ent .e-txt{flex:1;min-width:0}
.ent .e-n{font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ent .e-id{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ent.placed{opacity:.55}
.ent .add{width:32px;height:32px;border-radius:9px;background:var(--card);display:grid;place-items:center;flex:none}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.chips button{height:28px;padding:0 10px;border-radius:14px;background:var(--tile);font-size:12px;font-weight:600;color:var(--muted)}
.chips button.sel{background:var(--accent);color:#fff}
.icon-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.icon-grid button{height:38px;border-radius:10px;background:var(--tile);display:grid;place-items:center}
.icon-grid button.sel{background:var(--accent);color:#fff}
.list-item{background:var(--tile);border-radius:14px;padding:10px;margin-bottom:8px}
.list-item .row + .row{margin-top:8px}
input[type=color]{width:38px;height:38px;border:0;border-radius:11px;background:var(--tile);padding:4px;flex:none}
.drop-zone{border:2px dashed var(--soft);border-radius:14px;padding:16px;text-align:center;color:var(--muted);font-size:13px;line-height:1.5;cursor:pointer;display:block}
.drop-zone b{color:var(--text);display:block;font-size:14px}
#ghost{position:fixed;z-index:1000;width:40px;height:40px;border-radius:50%;background:var(--accent);color:#fff;display:none;place-items:center;pointer-events:none;box-shadow:0 6px 16px rgba(0,0,0,.25);transform:translate(-50%,-50%)}
.sep{height:1px;background:var(--tile-2);margin:14px 0}
`;

/* ---------- Komponente ---------- */
class HauspanelPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.cfg = null; this.plans = {}; this.planCache = {};
    this.mode = "view"; this.draft = null; this.draftPlans = {}; this.dirty = false;
    this.activeFloor = null; this.weekOffset = 0; this.events = []; this.forecast = null;
    this.popup = null; this.sel = null; this.tab = "devices"; this.filter = { q: "", d: "all" };
    this.kiosk = /[?&]kiosk\b/.test(location.search);
    this._prevStates = {}; this._unsubs = []; this._timers = []; this._evReq = 0;
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first && this.isConnected) this._init();
    else if (this._ready) this._onHass();
  }
  get hass() { return this._hass; }
  set narrow(v) { this._narrow = v; if (this._ready) this._renderTop(); }
  set panel(p) { this._panelCfg = (p && p.config) || {}; }

  connectedCallback() { if (this._hass && !this._ready) this._init(); }
  disconnectedCallback() {
    this._unsubs.forEach((u) => { try { u(); } catch (e) {} });
    this._timers.forEach((t) => clearInterval(t));
    this._unsubs = []; this._timers = []; this._ready = false;
    if (this._ro) this._ro.disconnect();
    this._stopCamera();
  }

  /* ---------- Initialisierung ---------- */
  async _init() {
    if (this._initing) return;
    this._initing = true;
    this._injectFont();
    if (this.kiosk) this.classList.add("kiosk");
    this.shadowRoot.innerHTML = `<style>${CSS}</style><style id="theme-vars"></style>
      <div id="stage">
        <header id="top"></header>
        <div id="main">
          <nav class="card" id="floors"></nav>
          <section class="card" id="plan-card">
            <div id="plan-head"></div>
            <div id="plan-wrap"><div id="plan"></div></div>
          </section>
          <aside id="right"></aside>
        </div>
        <section class="card" id="cal"></section>
        <div id="overlay"><div id="pop"></div></div>
        <div id="toast"></div>
      </div>
      <div id="ghost"></div><div id="scratch"></div>`;
    this.$ = (s) => this.shadowRoot.querySelector(s);
    this._bindEvents();
    this._ro = new ResizeObserver(() => this._fit());
    this._ro.observe(this);
    this._fit();
    this.$("#top").innerHTML = "";
    this.$("#plan").innerHTML = `<div class="empty"><div><b>Lade Hauspanel …</b></div></div>`;
    try {
      const unsub = await this._hass.connection.subscribeMessage((msg) => this._onConfig(msg), { type: "hauspanel/subscribe" });
      this._unsubs.push(unsub);
    } catch (err) {
      this.$("#plan").innerHTML = `<div class="empty"><div><b>Keine Verbindung zum Backend</b>${esc(err.message || err.code || err)}</div></div>`;
    }
    this._timers.push(setInterval(() => { this._tick(); this._idleReset(); }, 15000));
    this._timers.push(setInterval(() => this._fetchEvents(), 10 * 60000));
    this._ready = true;
    this._initing = false;
  }

  _injectFont() {
    if (document.getElementById("hauspanel-font")) return;
    const base = (this._panelCfg && this._panelCfg.static_url) || "/hauspanel_static";
    const st = document.createElement("style");
    st.id = "hauspanel-font";
    st.textContent = `@font-face{font-family:"Hauspanel Inter";src:url(${base}/inter.woff2) format("woff2");font-weight:100 900;font-display:swap}`;
    document.head.appendChild(st);
  }

  _fit() {
    const st = this.$ && this.$("#stage");
    if (!st) return;
    const w = this.clientWidth || innerWidth, h = this.clientHeight || innerHeight;
    // Skalierung nach Breite (bzw. Mindesthöhe), die Bühne füllt immer die ganze Fläche:
    // oben ausgerichtet, Grundriss-Bereich wächst in Höhe und Breite mit.
    const s = Math.min(w / STAGE_W, h / STAGE_MIN_H);
    this._scale = s;
    st.style.width = w / s + "px";
    st.style.height = h / s + "px";
    st.style.transform = `scale(${s})`;
    this._layoutPlan();
    this._fitWaste();
  }

  _onConfig(msg) {
    const cfgChanged = JSON.stringify(msg.config) !== JSON.stringify(this.cfg);
    this.cfg = msg.config; this.plans = msg.plans || {};
    if (this.mode === "edit") return; // Entwurf nicht überschreiben
    const floors = this.cfg.floors || [];
    if (!floors.some((f) => f.id === this.activeFloor)) this.activeFloor = this._homeFloor();
    this._subscribeWeather();
    if (cfgChanged) this._fetchEvents();
    this._renderAll();
  }

  _homeFloor() {
    const floors = (this.cfg && this.cfg.floors) || [];
    const d = this.cfg && this.cfg.default_floor;
    return floors.some((f) => f.id === d) ? d : floors[0] ? floors[0].id : null;
  }
  /* Nach 2 Minuten ohne Bedienung: Popup zu (stoppt auch Kamera-Streams), zurück zur Startetage und aktuellen Woche */
  _idleReset() {
    if (this.mode !== "view") return;
    if (Date.now() - (this._lastTouch || 0) < 120000) return;
    if (this.popup) this._closePop();
    const home = this._homeFloor();
    if (home && home !== this.activeFloor) { this.activeFloor = home; this._renderFloors(); this._renderPlan(); }
    if (this.weekOffset) { this.weekOffset = 0; this._fetchEvents(); }
  }
  get C() { return this.mode === "edit" ? this.draft : this.cfg; }
  /* Vorschau = Ansicht mit dem Entwurf, ohne den Editor zu verlassen */
  get editing() { return this.mode === "edit" && !this.preview; }
  get viewing() { return this.mode === "view" || !!this.preview; }
  _applyThemeVars() { const el = this.$("#theme-vars"); if (el && this.C) el.textContent = themeCss(this.C.theme); }
  get P() { return this.mode === "edit" ? this.draftPlans : this.plans; }
  _floor() { return (this.C.floors || []).find((f) => f.id === this.activeFloor); }

  /* ---------- Live-Updates aus HA ---------- */
  _watched() {
    const ids = new Set();
    const c = this.C; if (!c) return ids;
    (c.floors || []).forEach((f) => (f.pins || []).forEach((p) => { ids.add(p.entity_id); (p.extras || []).forEach((x) => x && ids.add(x)); }));
    (c.waste || []).forEach((w) => w.entity_id && ids.add(w.entity_id));
    if (c.weather_entity) ids.add(c.weather_entity);
    ids.add("sun.sun");
    return ids;
  }
  _onHass() {
    if (!this.cfg) return;
    let changed = false;
    const st = this._hass.states;
    for (const id of this._watched()) {
      if (st[id] !== this._prevStates[id]) { changed = true; this._prevStates[id] = st[id]; }
    }
    if (this._hass.user !== this._prevUser) { this._prevUser = this._hass.user; this._renderTop(); }
    if (!changed) return;
    this._updatePins(); this._renderFloors();
    if (this.viewing) {
      this._renderWeather(); this._renderWaste(); this._applyTheme();
      if (this.popup && this.popup.type === "entity" && !this._sliding) this._renderEntityPop();
    }
  }

  /* ---------- Rendering ---------- */
  _renderAll() {
    this.shadowRoot.host.classList.toggle("edit", this.editing);
    this.$("#stage").classList.toggle("edit", this.editing);
    this._applyThemeVars();
    this._applyTheme();
    this._renderTop(); this._renderFloors(); this._renderPlan(); this._renderRight();
    if (this.viewing) this._renderCal();
  }
  _renderRight() {
    if (this.editing) { this.$("#right").innerHTML = `<div class="card" id="insp"></div>`; this._renderInspector(); return; }
    this.$("#right").innerHTML = `<div id="weather"></div><div class="card" id="waste"></div>`;
    this._renderWeather(); this._renderWaste();
    if (this._wasteRO) this._wasteRO.disconnect();
    this._wasteRO = new ResizeObserver(() => this._fitWaste());
    this._wasteRO.observe(this.$("#waste"));
  }

  _applyTheme() {
    if (this.editing) { this.setAttribute("data-theme", this._themeOverride || "light"); return; }
    const n = (this.C && this.C.night) || {};
    let dark = false;
    if (this._themeOverride) dark = this._themeOverride === "dark";
    else if (n.mode === "sun") dark = this._hass.states["sun.sun"] && this._hass.states["sun.sun"].state === "below_horizon";
    else if (n.mode === "time") {
      const h = new Date().getHours(), from = Number(n.from ?? 22), to = Number(n.to ?? 6);
      dark = from > to ? h >= from || h < to : h >= from && h < to;
    }
    this.setAttribute("data-theme", dark ? "dark" : "light");
  }

  _tick() {
    const n = new Date();
    const t = this.$("#time"); if (t) t.textContent = hhmm(n);
    const d = this.$("#date-txt"); if (d) d.textContent = `${DAYS_LONG[n.getDay()]}, ${n.getDate()}. ${MONTHS[n.getMonth()]} ${n.getFullYear()}`;
    this._applyTheme();
    if (!this._day || !sameDay(this._day, n)) {
      const first = !this._day; this._day = n;
      if (!first && this.viewing) { this._renderWaste(); this._fetchEvents(); }
    }
  }

  _renderTop() {
    const top = this.$("#top"); if (!top) return;
    const admin = this._hass.user && this._hass.user.is_admin;
    const menu = this._narrow && !this.kiosk ? `<button class="icon-btn" data-a="menu" aria-label="Menü">${ic("menu", 20)}</button>` : "";
    if (this.editing) {
      top.innerHTML = `${menu}<div class="pill" id="home"><span class="home-ico">${ic("pencil", 15)}</span>Bearbeiten</div>
        <div id="date">Hauspanel einrichten<small>${this.dirty ? "Ungespeicherte Änderungen" : "Alles gespeichert"}</small></div>
        <button class="btn" data-a="theme-toggle" title="Hell/Dunkel">${ic("moon", 18)}</button>
        <button class="btn" data-a="edit-cancel">${this._confirmCancel ? "Änderungen verwerfen?" : "Abbrechen"}</button>
        <button class="btn primary" data-a="edit-save" ${this.dirty ? "" : "disabled"}>${ic("check", 18)}Speichern</button>`;
      return;
    }
    top.innerHTML = `${menu}<div class="pill" id="home"><span class="home-ico">${ic("house", 15)}</span>Zuhause</div>
      <div id="date"><span id="date-txt"></span></div>
      ${this.preview ? `<button class="btn primary" data-a="preview-exit">${ic("pencil", 16)}Zurück zum Editor</button>` : ""}
      ${admin && !this.kiosk && !this.preview ? `<button class="icon-btn" data-a="edit" aria-label="Bearbeiten" title="Bearbeiten">${ic("pencil", 18)}</button>` : ""}
      <button class="pill" id="clock" data-a="clock">${ic("clock", 20)}<span id="time"></span></button>`;
    this._tick();
  }

  _lightsOn(f) {
    return (f.pins || []).filter((p) => domainOf(p.entity_id) === "light" && isActive(this._hass.states[p.entity_id])).length;
  }
  _renderFloors() {
    const el = this.$("#floors"); if (!el || !this.C) return;
    let h = `<div class="roof"><svg width="130" height="52" viewBox="0 0 130 52"><path d="M4 50 L65 4 L126 50 Z" fill="var(--tile-2)"/><rect x="94" y="8" width="10" height="22" rx="2" fill="var(--tile-2)"/></svg></div>`;
    (this.C.floors || []).forEach((f) => {
      if (f.separated) h += `<div class="floor-sep"></div>`;
      h += `<button class="floor-btn${f.id === this.activeFloor ? " active" : ""}" data-floor="${f.id}">
        <div class="code">${esc(f.code || "?")}</div><div class="name">${esc(f.name || "")}</div>
        <div class="count">${ic("lightbulb", 14)}${this._lightsOn(f)}</div></button>`;
    });
    if (this.editing) h += `<button class="floor-add" data-a="floor-add">${ic("plus", 16)}Etage</button>`;
    el.classList.toggle("compact", (this.C.floors || []).length > (this.editing ? 3 : 4));
    el.innerHTML = h;
  }

  _planFor(f) {
    const raw = this.P[f.id];
    if (!raw) return null;
    const key = f.id + "|" + raw.length + "|" + (f.recolor !== false);
    if (this.planCache[f.id] && this.planCache[f.id].key === key) return this.planCache[f.id];
    const res = processSvg(raw, f.recolor !== false, this.$("#scratch"));
    if (!res) return null;
    this.planCache[f.id] = { key, ...res };
    return this.planCache[f.id];
  }

  _renderPlan() {
    const head = this.$("#plan-head"), plan = this.$("#plan");
    if (!this.C) return;
    const f = this._floor();
    const edit = this.editing;
    if (!f) {
      head.innerHTML = `<h2 id="plan-title">Willkommen</h2>`;
      plan.style.cssText = "inset:0";
      const admin = this._hass.user && this._hass.user.is_admin;
      plan.innerHTML = `<div class="empty"><div><b>${edit ? "Lege links deine erste Etage an" : "Noch nichts eingerichtet"}</b>${
        edit ? "Danach Grundriss hochladen und Geräte auf den Plan ziehen." : admin ? "Tippe oben auf den Stift, um Etagen, Grundrisse und Geräte einzurichten." : "Ein Admin kann das Panel über „Bearbeiten“ einrichten."}</div></div>`;
      return;
    }
    head.innerHTML = `<h2 id="plan-title">${esc(f.name || f.code)}</h2>` + (edit
      ? `<button class="sbtn" data-a="room-add">${ic("tag", 16)}Raum-Label</button>`
      : (f.pins || []).some((p) => p.power_off) ? `<button id="all-off" data-a="all-off" aria-label="Alles aus">${ic("power", 19)}</button>` : "");
    const pl = this._planFor(f);
    if (!pl) {
      plan.style.cssText = "inset:0";
      plan.innerHTML = `<div class="empty"><div><b>Noch kein Grundriss</b>${edit ? "Im Tab „Etage“ ein SVG hochladen. Geräte kannst du trotzdem schon platzieren." : "Ein Admin kann im Editor ein SVG hochladen."}</div></div>`;
      if (!edit) return;
      this._aspect = 16 / 10;
    } else this._aspect = pl.aspect;
    let h = pl ? pl.html : "";
    (f.rooms || []).forEach((r) => {
      h += `<div class="room-label${edit && this.sel && this.sel.type === "room" && this.sel.id === r.id ? " sel" : ""}" data-room="${r.id}" style="left:${r.x}%;top:${r.y}%">${esc(r.name)}</div>`;
    });
    (f.pins || []).forEach((p) => {
      const s = this._hass.states[p.entity_id];
      h += `<button class="pin${edit && this.sel && this.sel.type === "pin" && this.sel.id === p.id ? " sel" : ""}" data-pin="${p.id}" style="left:${p.x}%;top:${p.y}%" title="${esc(p.name || friendly(this._hass, p.entity_id))}">${this._pinInner(p, s)}</button>`;
    });
    plan.innerHTML = h;
    this._layoutPlan(); this._updatePins();
  }

  _layoutPlan() {
    const wrap = this.$ && this.$("#plan-wrap"), plan = this.$ && this.$("#plan");
    const f = this.C && this._floor();
    if (!wrap || !plan || !f || !this._aspect || (!this._planFor(f) && !this.editing)) return;
    const W = wrap.clientWidth, H = wrap.clientHeight, a = this._aspect;
    let w = W, h = W / a;
    if (h > H) { h = H; w = H * a; }
    // --k: Pins/Labels skalieren mit dem Grundriss -> überall gleiche Proportionen (Editor, Laptop, Tablet)
    const k = clamp(Math.min(w, h) / 450, 0.45, 3);
    plan.style.cssText = `width:${w}px;height:${h}px;left:${(W - w) / 2}px;top:${(H - h) / 2}px;--k:${k.toFixed(3)}`;
  }

  /* Inhalt eines Pins: Icon, Wert oder beides (Einstellung pro Gerät) */
  _pinValue(p, s) {
    if (!s || s.state === "unavailable" || s.state === "unknown") return "–";
    const a = s.attributes, d = domainOf(p.entity_id);
    if (d === "climate") return a.current_temperature != null ? fmtNum(a.current_temperature) + "°" : "–";
    if (!isNaN(Number(s.state)) && s.state !== "") {
      const u = a.unit_of_measurement || "";
      if (u === "°C" || u === "°F") return fmtNum(s.state) + "°";
      if (u === "%") return fmtNum(s.state, 0) + " %";
      const dec = Math.abs(Number(s.state)) >= 100 ? 0 : 1;
      return fmtNum(s.state, dec) + (u ? " " + u : "");
    }
    return fmtState(s);
  }
  _pinInner(p, s) {
    const mode = p.display || "icon";
    const icon = ic(p.icon || defaultIcon(s, p.entity_id), mode === "both" ? 15 : 18);
    if (mode === "icon") return icon;
    const v = `<span class="pv">${esc(this._pinValue(p, s))}</span>`;
    return mode === "both" ? icon + v : v;
  }
  _updatePins() {
    const f = this.C && this._floor(); if (!f) return;
    this.shadowRoot.querySelectorAll(".pin").forEach((el) => {
      const p = (f.pins || []).find((x) => x.id === el.dataset.pin); if (!p) return;
      const s = this._hass.states[p.entity_id], d = domainOf(p.entity_id);
      const mode = p.display || "icon";
      el.classList.toggle("val", mode !== "icon");
      el.classList.toggle("both", mode === "both");
      if (mode !== "icon") { const pv = el.querySelector(".pv"), txt = this._pinValue(p, s); if (pv && pv.textContent !== txt) pv.textContent = txt; }
      el.classList.toggle("on", isActive(s));
      el.classList.toggle("cam", d === "camera");
      el.classList.toggle("unavail", !s || s.state === "unavailable");
    });
  }

  /* ---------- Wetter ---------- */
  async _subscribeWeather() {
    const id = this.cfg && this.cfg.weather_entity;
    if (id === this._weatherSub) return;
    if (this._unsubWeather) { try { this._unsubWeather(); } catch (e) {} this._unsubWeather = null; }
    this._weatherSub = id; this.forecast = null;
    if (!id || !this._hass.states[id]) return;
    try {
      this._unsubWeather = await this._hass.connection.subscribeMessage((m) => { this.forecast = m.forecast || []; this._renderWeather(); },
        { type: "weather/subscribe_forecast", forecast_type: "daily", entity_id: id });
      this._unsubs.push(() => this._unsubWeather && this._unsubWeather());
    } catch (e) { console.warn("Hauspanel: Forecast nicht verfügbar", e); }
  }
  _renderWeather() {
    const el = this.$("#weather"); if (!el) return;
    const id = this.C.weather_entity, s = id && this._hass.states[id];
    if (!s) { el.innerHTML = `<div class="sec-head" style="color:#fff">${ic("cloud-sun", 18)}Wetter</div><div class="w-empty">Keine Wetter-Entity gewählt. Im Editor unter „Allgemein“ einstellen.</div>`; return; }
    const [icon, label] = WEATHER[s.state] || ["cloud", s.state];
    const fc = this.forecast || [];
    const today = fc[0];
    const hiLo = today ? `H ${Math.round(today.temperature)}° · T ${today.templow != null ? Math.round(today.templow) + "°" : "–"}` : "";
    let h = `<div class="w-now"><div class="w-temp">${s.attributes.temperature != null ? Math.round(s.attributes.temperature) : "–"}°</div>
      <div class="w-cond"><b>${esc(label)}</b>${hiLo}</div><div class="w-ico">${ic(icon, 34, 1.8)}</div></div><div class="w-days">`;
    fc.slice(0, 4).forEach((d) => {
      const dt = new Date(d.datetime);
      h += `<div class="w-day"><div class="d">${DAYS[dt.getDay()]}</div>${ic((WEATHER[d.condition] || ["cloud"])[0], 20)}
        <div class="t"><b>${Math.round(d.temperature)}°</b> <span>${d.templow != null ? Math.round(d.templow) + "°" : ""}</span></div></div>`;
    });
    el.innerHTML = h + `</div>`;
  }

  /* ---------- Müll ---------- */
  _wasteList() {
    return (this.C.waste || []).filter((w) => w.entity_id).map((w) => {
      const n = wasteDays(this._hass.states[w.entity_id]);
      return { w, n, d: n == null ? null : addDays(startOfDay(new Date()), n) };
    }).filter((x) => x.n != null && x.n >= 0).sort((a, b) => a.n - b.n);
  }
  _renderWaste() {
    const el = this.$("#waste"); if (!el) return;
    let h = `<div class="sec-head">${ic("trash-2", 18)}Müllabfuhr</div>`;
    const list = this._wasteList();
    if (!(this.C.waste || []).length) h += `<div class="muted-note">Noch keine Müll-Sensoren eingestellt.</div>`;
    else if (!list.length) h += `<div class="muted-note">Keine kommenden Termine erkannt. Im Editor unter „Allgemein“ steht bei jedem Sensor, was gelesen wurde.</div>`;
    list.slice(0, 4).forEach((x) => {
      const label = x.n === 0 ? "Heute" : x.n === 1 ? "Morgen" : `in ${x.n} Tagen`;
      h += `<div class="bin${x.n <= 1 ? " soon" : ""}"><div class="bin-ico" style="background:${esc(x.w.color || "#777")}">${ic("trash-2", 17)}</div>
        <div><div class="n">${esc(x.w.name || friendly(this._hass, x.w.entity_id))}</div><div class="d">${DAYS[x.d.getDay()]}, ${fmtShort(x.d)}</div></div><div class="b">${label}</div></div>`;
    });
    el.innerHTML = h;
    this._fitWaste();
  }
  /* Einträge, die nicht mehr ganz in die Karte passen, ausblenden statt anschneiden */
  _fitWaste() {
    requestAnimationFrame(() => {
      const el = this.$("#waste"); if (!el) return;
      const bins = [...el.querySelectorAll(".bin")];
      bins.forEach((b) => { b.style.display = ""; });
      const limit = el.getBoundingClientRect().bottom - 4;
      bins.forEach((b) => { if (b.getBoundingClientRect().bottom > limit) b.style.display = "none"; });
    });
  }

  /* ---------- Kalender ---------- */
  async _fetchEvents() {
    if (!this.C || !this.viewing) return;
    const cals = (this.C.calendars || []).filter((c) => c.entity_id && this._hass.states[c.entity_id]);
    const req = ++this._evReq;
    if (!cals.length) { this.events = []; this._renderCal(); return; }
    const mon = addDays(monday(new Date()), this.weekOffset * 7);
    try {
      const r = await this._hass.callWS({ type: "call_service", domain: "calendar", service: "get_events",
        service_data: { start_date_time: isoLocal(mon), end_date_time: isoLocal(addDays(mon, 7)) },
        target: { entity_id: cals.map((c) => c.entity_id) }, return_response: true });
      if (req !== this._evReq) return;
      const resp = (r && r.response) || {};
      const evs = [];
      cals.forEach((c) => ((resp[c.entity_id] || {}).events || []).forEach((e) => {
        const allDay = /^\d{4}-\d{2}-\d{2}$/.test(e.start);
        const start = parseDate(e.start), end = parseDate(e.end) || start;
        if (start) evs.push({ ...e, cal: c, allDay, start, end });
      }));
      evs.sort((a, b) => (b.allDay - a.allDay) || (a.start - b.start));
      this.events = evs;
    } catch (e) { console.warn("Hauspanel: Kalender", e); this.events = []; }
    this._renderCal();
  }
  _renderCal() {
    const el = this.$("#cal"); if (!el || !this.viewing) return;
    const mon = addDays(monday(new Date()), this.weekOffset * 7), sun = addDays(mon, 6), today = new Date();
    const cals = this.C.calendars || [];
    let h = `<div class="cal-side"><div class="sec-head" style="margin:0 0 8px">${ic("calendar", 18)}Termine</div>
      <div class="cal-range">${fmtShort(mon)} – ${fmtShort(sun)}${sun.getFullYear()}</div><div class="cal-kw">KW ${kw(mon)}</div>
      <div class="cal-nav"><button data-wk="-1" aria-label="Vorherige Woche">${ic("chevron-left", 18)}</button>${this.weekOffset ? `<button data-wk="0" aria-label="Diese Woche">${ic("circle-dot", 16)}</button>` : ""}<button data-wk="1" aria-label="Nächste Woche">${ic("chevron-right", 18)}</button></div>
      <div class="legend">${cals.map((c) => `<span><i class="dot" style="background:${esc(c.color)}"></i>${esc(c.name || friendly(this._hass, c.entity_id))}</span>`).join("")}</div></div>`;
    const waste = this._wasteList();
    const MAX = 3;
    for (let i = 0; i < 7; i++) {
      const day = addDays(mon, i), dayEnd = addDays(day, 1);
      const items = [];
      waste.forEach((x) => { if (sameDay(x.d, day)) items.push(`<span class="chip"><i class="dot" style="background:${esc(x.w.color)}"></i>${esc(x.w.name)}</span>`); });
      this.events.forEach((e, idx) => {
        if (!(e.start < dayEnd && e.end > day) && !sameDay(e.start, day)) return;
        if (e.allDay) items.push(`<button class="chip" data-ev="${idx}"><i class="dot" style="background:${esc(e.cal.color)}"></i>${esc(e.summary)}</button>`);
        else items.push(`<button class="ev" data-ev="${idx}" style="--c:${esc(e.cal.color)}"><div class="t">${e.start >= day ? hhmm(e.start) : "Fortsetzung"}</div><div class="n">${esc(e.summary)}</div></button>`);
      });
      let body = items.length > MAX ? items.slice(0, MAX - 1).join("") + `<button class="more" data-day="${i}">+${items.length - MAX + 1} weitere</button>` : items.join("");
      h += `<div class="day${sameDay(day, today) ? " today" : ""}"><div class="day-h">${DAYS[day.getDay()]}<b>${day.getDate()}.</b></div>${body}</div>`;
    }
    el.innerHTML = h;
  }

  /* ---------- Popups ---------- */
  _showPop(html, wide) {
    this.$("#pop").innerHTML = `<div class="pop${wide ? " wide" : ""}">${html}</div>`;
    this.$("#overlay").classList.add("show");
  }
  _closePop() { this._stopCamera(); this.$("#overlay").classList.remove("show"); this.popup = null; }
  _stopCamera() { const img = this.$ && this.$("#cam-img"); if (img) img.src = ""; }
  _popHead(icon, cls, sub, title) {
    return `<div class="pop-h"><div class="pop-ico ${cls}">${ic(icon, 24)}</div><div style="min-width:0"><div class="pop-sub">${esc(sub)}</div>
      <div class="pop-title">${esc(title)}</div></div><button class="pop-x" data-a="pop-close" aria-label="Schließen">${ic("x", 20)}</button></div>`;
  }
  _roomOf(f, p) {
    if (p.room) return p.room;
    // Raum-Labels sitzen oben links im Raum -> bevorzugt das nächste Label links oberhalb des Geräts
    const near = (list) => { let best = null, bd = Infinity;
      list.forEach((r) => { const d = (r.x - p.x) ** 2 + (r.y - p.y) ** 2; if (d < bd) { bd = d; best = r; } }); return best; };
    const rooms = f.rooms || [];
    const best = near(rooms.filter((r) => r.x <= p.x + 3 && r.y <= p.y + 3)) || near(rooms);
    return best ? best.name : "";
  }
  _extrasHtml(p) {
    const ex = (p.extras || []).filter((x) => x);
    if (!ex.length) return "";
    return `<div class="tiles">${ex.map((id) => { const s = this._hass.states[id];
      return `<div class="panel"><div class="l">${esc(friendly(this._hass, id))}</div><div class="v">${esc(fmtState(s))}</div></div>`; }).join("")}</div>`;
  }
  _openPin(pinId) {
    this.popup = { type: "entity", pin: pinId };
    this._renderEntityPop();
  }
  _renderEntityPop() {
    const f = this._floor(); const p = f && (f.pins || []).find((x) => x.id === this.popup.pin);
    if (!p) return this._closePop();
    const id = p.entity_id, s = this._hass.states[id], d = domainOf(id);
    const name = p.name || friendly(this._hass, id), sub = [this._roomOf(f, p), f.code].filter(Boolean).join(" · ");
    const icon = p.icon || defaultIcon(s, id), on = isActive(s);
    if (!s) return this._showPop(this._popHead(icon, "", sub, name) + `<div class="panel">Entity <b>${esc(id)}</b> gibt es in Home Assistant nicht (mehr).</div>`);
    const a = s.attributes, unavail = s.state === "unavailable";
    let h = this._popHead(icon, d === "camera" ? "cam" : on ? "on" : "", sub, name);
    const toggle = (label, sublabel) => `<div class="pop-state"><div><div class="big">${esc(label)}</div><div class="s">${esc(sublabel)}</div></div>
      ${unavail ? "" : `<button class="toggle${on ? " on" : ""}" data-a="toggle" aria-label="Schalten"></button>`}</div>`;
    if (d === "light") {
      const pct = on && a.brightness != null ? Math.round(a.brightness / 2.55) : 0;
      h += toggle(fmtState(s), unavail ? "" : on ? (a.brightness != null ? `Helligkeit ${pct} %` : "Eingeschaltet") : "Tippen zum Einschalten");
      if (!unavail && supportsBrightness(s)) h += `<div class="panel"><div class="panel-h"><span>Helligkeit</span><span id="bval">${pct} %</span></div>
        <input type="range" min="1" max="100" value="${pct || 1}" style="--p:${pct}%" id="bright" aria-label="Helligkeit"></div>`;
    } else if (["switch","fan","input_boolean"].includes(d)) {
      h += toggle(fmtState(s), unavail ? "" : on ? ((p.extras || []).length ? "Verbraucht Strom" : "Eingeschaltet") : "Ausgeschaltet");
    } else if (d === "media_player") {
      h += toggle(fmtState(s), a.media_title || a.source || "");
      if (!unavail && s.state !== "off") h += `<div class="modes"><button data-a="media" data-svc="media_play_pause">${s.state === "playing" ? "Pause" : "Abspielen"}</button><button data-a="media" data-svc="media_next_track">Weiter</button></div>`;
    } else if (d === "climate") {
      const step = a.target_temp_step || 0.5;
      h += `<div class="pop-state"><div><div class="big">${a.temperature != null ? fmtNum(a.temperature) + "°" : fmtState(s)}</div>
        <div class="s">Ist ${a.current_temperature != null ? fmtNum(a.current_temperature) + " °C" : "–"} · ${s.state === "off" ? "Aus" : a.hvac_action === "heating" ? "heizt gerade" : a.hvac_action === "cooling" ? "kühlt gerade" : HVAC_LABEL[s.state] || s.state}</div></div>
        ${a.temperature != null && !unavail ? `<div class="stepper"><button data-a="temp" data-step="${-step}" aria-label="Kälter">${ic("minus", 20)}</button><button data-a="temp" data-step="${step}" aria-label="Wärmer">${ic("plus", 20)}</button></div>` : ""}</div>`;
      const modes = (a.hvac_modes || []).slice(0, 6);
      if (modes.length && !unavail) h += `<div class="panel"><div class="panel-h"><span>Modus</span></div><div class="modes">${modes.map((m) =>
        `<button data-a="mode" data-mode="${esc(m)}" class="${s.state === m ? "sel" : ""}">${esc(HVAC_LABEL[m] || m)}</button>`).join("")}</div></div>`;
    } else if (d === "cover") {
      h += `<div class="pop-state"><div><div class="big">${esc(fmtState(s))}</div><div class="s">${a.current_position != null ? "Position " + a.current_position + " %" : ""}</div></div></div>
        <div class="modes"><button data-a="svc" data-svc="open_cover">Öffnen</button><button data-a="svc" data-svc="stop_cover">Stopp</button><button data-a="svc" data-svc="close_cover">Schließen</button></div>`;
    } else if (d === "lock") {
      h += `<div class="pop-state"><div><div class="big">${esc(fmtState(s))}</div></div></div>
        <div class="modes"><button data-a="svc" data-svc="lock" class="${s.state === "locked" ? "sel" : ""}">Verriegeln</button><button data-a="svc" data-svc="unlock" class="${s.state === "unlocked" ? "sel" : ""}">Entriegeln</button></div>`;
    } else if (d === "scene" || d === "script") {
      h += `<div class="modes" style="margin-top:20px"><button data-a="svc" data-svc="turn_on" class="sel">Ausführen</button></div>`;
    } else if (d === "camera") {
      const url = (a.entity_picture || "").replace("/api/camera_proxy/", "/api/camera_proxy_stream/");
      h += `<div class="cam-box">${unavail || !url ? "Kamera nicht erreichbar" : `<img id="cam-img" alt="${esc(name)}" src="${esc(url)}">`}</div>`;
      this._showPop(h, true); return;
    } else {
      h += `<div class="pop-state"><div><div class="big">${esc(fmtState(s))}</div><div class="s">${s.last_changed ? "seit " + hhmm(new Date(s.last_changed)) + " Uhr" : ""}</div></div></div>`;
    }
    h += this._extrasHtml(p);
    this._showPop(h);
    const r = this.$("#bright");
    if (r) {
      r.addEventListener("pointerdown", () => { this._sliding = true; });
      r.addEventListener("input", () => { r.style.setProperty("--p", r.value + "%"); this.$("#bval").textContent = r.value + " %"; });
      r.addEventListener("change", () => { this._sliding = false; this._hass.callService("light", "turn_on", { entity_id: id, brightness_pct: Number(r.value) }); });
    }
  }
  _popAction(b) {
    const f = this._floor(); const p = f && (f.pins || []).find((x) => x.id === this.popup.pin); if (!p) return;
    const id = p.entity_id, d = domainOf(id), s = this._hass.states[id], act = b.dataset.a;
    if (act === "toggle") {
      if (d === "media_player") this._hass.callService(d, s.state === "off" ? "turn_on" : "turn_off", { entity_id: id });
      else this._hass.callService(d === "climate" ? "climate" : d, "toggle", { entity_id: id });
    }
    if (act === "temp") {
      const t = Math.round((s.attributes.temperature + Number(b.dataset.step)) * 10) / 10;
      this._hass.callService("climate", "set_temperature", { entity_id: id, temperature: t });
    }
    if (act === "mode") this._hass.callService("climate", "set_hvac_mode", { entity_id: id, hvac_mode: b.dataset.mode });
    if (act === "svc") this._hass.callService(d, b.dataset.svc, { entity_id: id });
    if (act === "media") this._hass.callService("media_player", b.dataset.svc, { entity_id: id });
  }
  _openEvent(e) {
    const c = e.cal;
    const sameDayEv = sameDay(e.start, e.allDay ? addDays(e.end, -1) : e.end);
    const dateLine = `${DAYS_LONG[e.start.getDay()]}, ${e.start.getDate()}. ${MONTHS[e.start.getMonth()]}`;
    let timeLine;
    if (e.allDay) timeLine = sameDayEv ? "Ganztägig" : `Ganztägig bis ${fmtShort(addDays(e.end, -1))}`;
    else timeLine = sameDayEv ? `${hhmm(e.start)} – ${hhmm(e.end)} Uhr` : `${hhmm(e.start)} Uhr bis ${fmtShort(e.end)} ${hhmm(e.end)} Uhr`;
    let h = `<div class="pop-h ev-pop"><div class="bar" style="--c:${esc(c.color)}"></div><div style="min-width:0"><div class="pop-sub">Kalender · ${esc(c.name || friendly(this._hass, c.entity_id))}</div>
      <div class="pop-title">${esc(e.summary)}</div></div><button class="pop-x" data-a="pop-close" aria-label="Schließen">${ic("x", 20)}</button></div>
      <div class="ev-row">${ic("clock", 20)}<div><b>${dateLine}</b><span>${timeLine}</span></div></div>`;
    if (e.location) {
      const parts = String(e.location).split(",");
      h += `<div class="ev-row">${ic("map-pin", 20)}<div><b>${esc(parts[0].trim())}</b>${parts.length > 1 ? `<span>${esc(parts.slice(1).join(",").trim())}</span>` : ""}</div></div>`;
    }
    if (e.description) {
      const tmp = document.createElement("div");
      tmp.innerHTML = String(e.description).replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n");
      const txt = (tmp.textContent || "").trim();
      if (txt) h += `<div class="panel"><div class="pop-sub" style="margin-bottom:6px">Notizen</div><div class="note">${esc(txt)}</div></div>`;
    }
    this.popup = { type: "event" };
    this._showPop(h);
  }
  _openDay(i) {
    const mon = addDays(monday(new Date()), this.weekOffset * 7), day = addDays(mon, i), dayEnd = addDays(day, 1);
    let h = `<div class="pop-h"><div class="pop-ico">${ic("calendar", 24)}</div><div><div class="pop-sub">Alle Termine</div><div class="pop-title">${DAYS_LONG[day.getDay()]}, ${day.getDate()}. ${MONTHS[day.getMonth()]}</div></div>
      <button class="pop-x" data-a="pop-close" aria-label="Schließen">${ic("x", 20)}</button></div><div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">`;
    this._wasteList().forEach((x) => { if (sameDay(x.d, day)) h += `<span class="chip" style="background:var(--tile)"><i class="dot" style="background:${esc(x.w.color)}"></i>${esc(x.w.name)}</span>`; });
    this.events.forEach((e, idx) => {
      if (!(e.start < dayEnd && e.end > day) && !sameDay(e.start, day)) return;
      h += `<button class="ev" style="--c:${esc(e.cal.color)};background:var(--tile)" data-ev="${idx}"><div class="t">${e.allDay ? "Ganztägig" : hhmm(e.start) + " – " + hhmm(e.end)}</div><div class="n">${esc(e.summary)}</div></button>`;
    });
    this.popup = { type: "day" };
    this._showPop(h + `</div>`);
  }

  _toast(msg) {
    const t = this.$("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(this._toastT); this._toastT = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* ---------- Events ---------- */
  _bindEvents() {
    const root = this.shadowRoot;
    root.addEventListener("click", (ev) => this._onClick(ev));
    root.addEventListener("input", (ev) => this._onInput(ev, false));
    root.addEventListener("change", (ev) => this._onInput(ev, true));
    root.addEventListener("pointerdown", (ev) => this._onPointerDown(ev));
    this.$("#overlay").addEventListener("click", (ev) => { if (ev.target.id === "overlay") this._closePop(); });
  }

  _onClick(ev) {
    const t = ev.target;
    if (this._suppressClick) { this._suppressClick = false; return; }
    const fl = t.closest("[data-floor]");
    if (fl) { this.activeFloor = fl.dataset.floor; this.sel = null; if (this.editing && this.tab === "select") this.tab = "floor";
      this._renderFloors(); this._renderPlan(); if (this.editing) this._renderInspector(); return; }
    const wk = t.closest("[data-wk]");
    if (wk) { const v = Number(wk.dataset.wk); this.weekOffset = v === 0 ? 0 : this.weekOffset + v; this.events = []; this._renderCal(); this._fetchEvents(); return; }
    const evb = t.closest("[data-ev]");
    if (evb) { this._openEvent(this.events[Number(evb.dataset.ev)]); return; }
    const dayb = t.closest("[data-day]");
    if (dayb) { this._openDay(Number(dayb.dataset.day)); return; }
    const pin = t.closest(".pin");
    if (pin && this.viewing) { this._openPin(pin.dataset.pin); return; }
    const b = t.closest("[data-a]");
    if (!b) return;
    const a = b.dataset.a;
    if (this.popup && ["toggle","temp","mode","svc","media"].includes(a)) return this._popAction(b);
    switch (a) {
      case "pop-close": return this._closePop();
      case "menu": return this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: true, composed: true }));
      case "clock": this._themeOverride = this.getAttribute("data-theme") === "dark" ? "light" : "dark";
        clearTimeout(this._themeT); this._themeT = setTimeout(() => { this._themeOverride = null; this._applyTheme(); }, 5 * 60000);
        return this._applyTheme();
      case "all-off": return this._allOff();
      case "edit": return this._enterEdit();
      case "preview-exit": this._closePop(); this.preview = false; this._themeOverride = null; return this._renderAll();
    }
    if (this.mode === "edit") this._editClick(a, b, ev);
  }

  _allOff() {
    const f = this._floor(); if (!f) return;
    const ids = (f.pins || []).filter((p) => p.power_off && isActive(this._hass.states[p.entity_id])).map((p) => p.entity_id);
    if (!ids.length) return this._toast(`Im ${f.name} ist schon alles aus`);
    this._hass.callService("homeassistant", "turn_off", { entity_id: ids });
    this._toast(`${ids.length} ${ids.length === 1 ? "Gerät" : "Geräte"} im ${f.name} ausgeschaltet`);
  }

  /* =========================================================
     EDITOR
     ========================================================= */
  _enterEdit() {
    this._closePop();
    this.mode = "edit";
    this.draft = clone(this.cfg);
    this.draftPlans = { ...this.plans };
    this.dirty = false; this.sel = null; this._confirmCancel = false; this._themeOverride = null; this.preview = false; this._designMode = "light";
    this.tab = (this.draft.floors || []).length ? "devices" : "floor";
    this._renderAll();
  }
  _exitEdit() {
    this.mode = "view"; this.draft = null; this.draftPlans = {}; this.sel = null; this.dirty = false; this.preview = false;
    this._themeOverride = null; this.planCache = {};
    const floors = this.cfg.floors || [];
    if (!floors.some((f) => f.id === this.activeFloor)) this.activeFloor = this._homeFloor();
    this._weatherSub = undefined; this._subscribeWeather();
    this._renderAll(); this._fetchEvents();
  }
  _markDirty() {
    this.dirty = true; this._confirmCancel = false;
    const s = this.$("[data-a=edit-save]"); if (s) s.disabled = false;
    const sm = this.$("#date small"); if (sm) sm.textContent = "Ungespeicherte Änderungen";
  }
  async _save() {
    const btn = this.$("[data-a=edit-save]"); if (btn) btn.disabled = true;
    try {
      await this._hass.callWS({ type: "hauspanel/config/save", config: this.draft });
      const ids = new Set([...Object.keys(this.plans), ...Object.keys(this.draftPlans)]);
      for (const fid of ids) {
        if (!this.draft.floors.some((f) => f.id === fid)) continue;
        if (this.draftPlans[fid] !== this.plans[fid])
          await this._hass.callWS({ type: "hauspanel/plan/save", floor_id: fid, svg: this.draftPlans[fid] || null });
      }
      this.cfg = clone(this.draft); this.plans = { ...this.draftPlans };
      this._exitEdit();
      this._toast("Gespeichert – alle Tablets aktualisieren sich");
    } catch (e) {
      if (btn) btn.disabled = false;
      this._toast("Speichern fehlgeschlagen: " + (e.message || e.code || e));
    }
  }

  _editClick(a, b) {
    const f = this._floor();
    switch (a) {
      case "edit-cancel":
        if (this.dirty && !this._confirmCancel) { this._confirmCancel = true; this._renderTop(); return; }
        return this._exitEdit();
      case "edit-save": return this._save();
      case "theme-toggle": this._themeOverride = this.getAttribute("data-theme") === "dark" ? "light" : "dark"; return this._applyTheme();
      case "tab": this.tab = b.dataset.tab; return this._renderInspector();
      case "floor-add": {
        const n = (this.draft.floors || []).length;
        const fl = { id: uid("f"), code: "E" + (n + 1), name: "Neue Etage", separated: false, recolor: true, rooms: [], pins: [] };
        this.draft.floors.push(fl); this.activeFloor = fl.id; this.sel = null; this.tab = "floor";
        this._markDirty(); this._renderFloors(); this._renderPlan(); return this._renderInspector();
      }
      case "floor-up": case "floor-down": {
        const arr = this.draft.floors, i = arr.indexOf(f), j = a === "floor-up" ? i - 1 : i + 1;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        this._markDirty(); this._renderFloors(); return this._renderInspector();
      }
      case "floor-del":
        if (!this._confirmDel) { this._confirmDel = true; b.textContent = "Wirklich löschen? Nochmal tippen"; return; }
        this._confirmDel = false;
        this.draft.floors = this.draft.floors.filter((x) => x !== f);
        delete this.draftPlans[f.id];
        this.activeFloor = this.draft.floors[0] ? this.draft.floors[0].id : null; this.sel = null;
        this._markDirty(); this._renderFloors(); this._renderPlan(); return this._renderInspector();
      case "plan-del":
        delete this.draftPlans[f.id]; delete this.planCache[f.id];
        this._markDirty(); this._renderPlan(); return this._renderInspector();
      case "room-add": {
        if (!f) return;
        const r = { id: uid("r"), name: "Raum", x: 45, y: 45 };
        f.rooms = f.rooms || []; f.rooms.push(r);
        this.sel = { type: "room", id: r.id }; this.tab = "select";
        this._markDirty(); this._renderPlan(); this._renderInspector();
        const inp = this.$("[data-f=room-name]"); if (inp) { inp.focus(); inp.select(); }
        return;
      }
      case "ent-add": return this._addPin(b.dataset.ent, 50, 50);
      case "ent-filter": this.filter.d = b.dataset.d; return this._renderInspector();
      case "pin-del": case "room-del": {
        const key = a === "pin-del" ? "pins" : "rooms";
        f[key] = f[key].filter((x) => x.id !== this.sel.id); this.sel = null; this.tab = a === "pin-del" ? "devices" : "floor";
        this._markDirty(); this._renderPlan(); this._renderFloors(); return this._renderInspector();
      }
      case "design-mode": this._designMode = b.dataset.v; this._themeOverride = b.dataset.v; this._applyTheme(); return this._renderInspector();
      case "theme-reset": this.draft.theme = null; this._markDirty(); this._applyThemeVars(); this._layoutPlan(); return this._renderInspector();
      case "preview": this.preview = true; this.sel = null; this.events = []; this._renderAll(); this._fetchEvents(); return;
      case "pin-display": {
        const p = this._selPin(); p.display = b.dataset.v;
        this._markDirty(); this._renderPlan(); return this._renderInspector();
      }
      case "pin-icon": {
        const p = this._selPin(); p.icon = b.dataset.icon === "auto" ? null : b.dataset.icon;
        this._markDirty(); this._renderPlan(); return this._renderInspector();
      }
      case "list-add": {
        const key = b.dataset.list;
        const pal = key === "calendars" ? ["#E5391D","#1F1D1C","#EFA28F","#2F6DD0","#3E9B5C","#8A6446"] : ["#E3B21B","#8A6446","#2F6DD0","#4A4744","#3E9B5C","#E5391D"];
        const def = { entity_id: "", name: "", color: pal[(this.draft[key] || []).length % pal.length] };
        this.draft[key] = this.draft[key] || []; this.draft[key].push(def);
        this._markDirty(); return this._renderInspector();
      }
      case "list-del": {
        this.draft[b.dataset.list].splice(Number(b.dataset.i), 1);
        this._markDirty(); return this._renderInspector();
      }
      case "extra-add": { const p = this._selPin(); p.extras = p.extras || []; if (p.extras.length < 4) p.extras.push(""); this._markDirty(); return this._renderInspector(); }
      case "extra-del": { const p = this._selPin(); p.extras.splice(Number(b.dataset.i), 1); this._markDirty(); return this._renderInspector(); }
    }
  }
  _selPin() { const f = this._floor(); return f && this.sel && this.sel.type === "pin" ? (f.pins || []).find((p) => p.id === this.sel.id) : null; }
  _selRoom() { const f = this._floor(); return f && this.sel && this.sel.type === "room" ? (f.rooms || []).find((r) => r.id === this.sel.id) : null; }

  _addPin(entityId, x, y) {
    const f = this._floor();
    if (!f) return this._toast("Lege zuerst eine Etage an");
    const p = { id: uid("p"), entity_id: entityId, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10,
      name: null, room: null, icon: null, power_off: POWER_OFF_DEFAULT.has(domainOf(entityId)), extras: [],
      display: domainOf(entityId) === "sensor" && this._hass.states[entityId] && !isNaN(Number(this._hass.states[entityId].state)) ? "value" : "icon" };
    f.pins = f.pins || []; f.pins.push(p);
    this.sel = { type: "pin", id: p.id }; this.tab = "select";
    this._prevStates = {};
    this._markDirty(); this._renderPlan(); this._renderFloors(); this._renderInspector();
  }

  _onInput(ev, isChange) {
    if (this.mode !== "edit") return;
    const el = ev.target, k = el.dataset.f;
    if (!k) return;
    // Text wird schon beim Tippen übernommen; das change-Event beim Verlassen des Felds
    // darf nichts neu zeichnen, sonst geht der Klick auf den nächsten Button verloren.
    if (isChange && el.tagName === "INPUT" && el.type === "text" && !["pin-extra", "pin-entity", "list"].includes(k)) return;
    if (isChange && k === "list" && el.dataset.k === "name") return;
    const f = this._floor(), val = el.type === "checkbox" ? el.checked : el.value;
    const p = this._selPin(), r = this._selRoom();
    switch (k) {
      case "search": this.filter.q = val; this._renderEntityList(); return;
      case "pin-name": p.name = val || null; break;
      case "pin-room": p.room = val || null; break;
      case "pin-power": p.power_off = val; break;
      case "pin-extra": if (!isChange && !this._hass.states[val]) return; p.extras[Number(el.dataset.i)] = val; break;
      case "pin-entity": if (!this._hass.states[val]) return; p.entity_id = val; this._renderPlan(); break;
      case "room-name": r.name = val; this._renderPlan(); break;
      case "floor-code": f.code = val.slice(0, 4); this._renderFloors(); break;
      case "floor-name": f.name = val; this._renderFloors(); this.$("#plan-title").textContent = val; break;
      case "floor-sep": f.separated = val; this._renderFloors(); break;
      case "floor-recolor": f.recolor = val; this._renderPlan(); break;
      case "plan-file": if (isChange) this._uploadPlan(el.files && el.files[0]); return;
      case "weather": this.draft.weather_entity = val || null; break;
      case "theme-color": case "theme-size": {
        this.draft.theme = mergeTheme(this.draft.theme);
        if (k === "theme-color") { this.draft.theme[this._designMode || "light"][el.dataset.k] = val; el.nextElementSibling.nextElementSibling.textContent = val; }
        else {
          this.draft.theme.size[el.dataset.k] = Number(val);
          const spec = THEME_SIZES.find((x) => x[0] === el.dataset.k);
          this.$("#tv-" + el.dataset.k).textContent = val + " " + spec[4];
          el.style.setProperty("--p", ((val - spec[2]) / (spec[3] - spec[2])) * 100 + "%");
        }
        this._applyThemeVars(); this._layoutPlan(); this._fitWaste();
        break;
      }
      case "default-floor": this.draft.default_floor = val; break;
      case "night-mode": this.draft.night.mode = val; this._renderInspector(); break;
      case "night-from": this.draft.night.from = Number(val); break;
      case "night-to": this.draft.night.to = Number(val); break;
      case "list": {
        const item = this.draft[el.dataset.list][Number(el.dataset.i)];
        item[el.dataset.k] = val;
        if (el.dataset.k === "entity_id" && isChange && this._hass.states[val]) {
          if (!item.name) item.name = friendly(this._hass, val);
          this._renderInspector();
        }
        break;
      }
      default: return;
    }
    this._markDirty();
  }

  async _uploadPlan(file) {
    if (!file) return;
    if (file.size > 2e6) return this._toast("SVG ist größer als 2 MB");
    const text = await file.text();
    const f = this._floor();
    const test = processSvg(text, true, this.$("#scratch"));
    if (!test) return this._toast("Datei konnte nicht als SVG gelesen werden");
    this.draftPlans[f.id] = text; delete this.planCache[f.id];
    this._markDirty(); this._renderPlan(); this._renderInspector();
    this._toast("Grundriss geladen – jetzt Geräte draufziehen");
  }

  /* ---------- Drag & Drop (Pointer-Events, funktioniert mit Maus und Touch) ---------- */
  _onPointerDown(ev) {
    this._lastTouch = Date.now();
    if (!this.editing || ev.button > 0) return;
    const pinEl = ev.target.closest(".pin"), roomEl = ev.target.closest(".room-label"), grip = ev.target.closest(".grip");
    if (pinEl || roomEl) return this._dragOnPlan(ev, pinEl, roomEl);
    if (grip) return this._dragFromList(ev, grip.closest(".ent").dataset.ent);
  }
  _planPct(ev) {
    const r = this.$("#plan").getBoundingClientRect();
    return { x: ((ev.clientX - r.left) / r.width) * 100, y: ((ev.clientY - r.top) / r.height) * 100, inside: ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom };
  }
  _dragOnPlan(ev, pinEl, roomEl) {
    ev.preventDefault();
    const el = pinEl || roomEl, f = this._floor();
    const obj = pinEl ? f.pins.find((p) => p.id === pinEl.dataset.pin) : f.rooms.find((r) => r.id === roomEl.dataset.room);
    const sx = ev.clientX, sy = ev.clientY, ox = obj.x, oy = obj.y;
    const rect = this.$("#plan").getBoundingClientRect();
    let moved = false;
    el.setPointerCapture(ev.pointerId);
    const move = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      moved = true;
      obj.x = Math.round(clamp(ox + (dx / rect.width) * 100, 0, 100) * 10) / 10;
      obj.y = Math.round(clamp(oy + (dy / rect.height) * 100, 0, 100) * 10) / 10;
      el.style.left = obj.x + "%"; el.style.top = obj.y + "%";
    };
    const up = () => {
      el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
      if (moved) this._markDirty();
      this._suppressClick = true; setTimeout(() => { this._suppressClick = false; }, 0);
      this.sel = { type: pinEl ? "pin" : "room", id: obj.id }; this.tab = "select";
      this.shadowRoot.querySelectorAll(".pin.sel,.room-label.sel").forEach((x) => x.classList.remove("sel"));
      el.classList.add("sel");
      this._renderInspector();
    };
    el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
  }
  _dragFromList(ev, entityId) {
    ev.preventDefault();
    const ghost = this.$("#ghost"), plan = this.$("#plan"), src = ev.target.closest(".grip");
    const s = this._hass.states[entityId];
    ghost.innerHTML = ic(defaultIcon(s, entityId), 18);
    ghost.style.transform = `translate(-50%,-50%) scale(${Math.max(this._scale || 1, 0.6)})`;
    src.setPointerCapture(ev.pointerId);
    const move = (e) => {
      ghost.style.display = "grid"; ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px";
      plan.classList.toggle("drop", this._planPct(e).inside);
    };
    const up = (e) => {
      src.removeEventListener("pointermove", move); src.removeEventListener("pointerup", up); src.removeEventListener("pointercancel", up);
      ghost.style.display = "none"; plan.classList.remove("drop");
      const p = this._planPct(e);
      if (e.type === "pointerup" && p.inside) this._addPin(entityId, p.x, p.y);
    };
    move(ev);
    src.addEventListener("pointermove", move); src.addEventListener("pointerup", up); src.addEventListener("pointercancel", up);
  }

  /* ---------- Inspector ---------- */
  _renderInspector() {
    const el = this.$("#insp"); if (!el) return;
    const tabs = [["devices", "Geräte"], ["select", "Auswahl"], ["floor", "Etage"], ["general", "Allgemein"], ["design", "Design"]];
    el.innerHTML = `<div class="tabs">${tabs.map(([k, l]) => `<button class="${this.tab === k ? "sel" : ""}" data-a="tab" data-tab="${k}">${l}</button>`).join("")}</div>
      <div class="insp-body" id="insp-body"></div>`;
    const body = this.$("#insp-body");
    if (this.tab === "devices") body.innerHTML = this._tabDevices();
    else if (this.tab === "select") body.innerHTML = this._tabSelect();
    else if (this.tab === "floor") body.innerHTML = this._tabFloor();
    else if (this.tab === "design") body.innerHTML = this._tabDesign();
    else body.innerHTML = this._tabGeneral();
    if (this.tab === "devices") this._renderEntityList();
  }
  _entityOptions(domains, current, emptyLabel) {
    const ids = Object.keys(this._hass.states).filter((id) => domains.includes(domainOf(id))).sort((a, b) => friendly(this._hass, a).localeCompare(friendly(this._hass, b), "de"));
    return `<option value="">${esc(emptyLabel || "– keine –")}</option>` + ids.map((id) => `<option value="${esc(id)}"${id === current ? " selected" : ""}>${esc(friendly(this._hass, id))} (${esc(id)})</option>`).join("");
  }
  _datalist() {
    if (this.$("#dl-sensors")) return "";
    const ids = Object.keys(this._hass.states).filter((id) => ["sensor","binary_sensor"].includes(domainOf(id))).sort();
    return `<datalist id="dl-sensors">${ids.map((id) => `<option value="${esc(id)}">${esc(friendly(this._hass, id))}</option>`).join("")}</datalist>`;
  }

  _tabDevices() {
    if (!this._floor()) return `<div class="hint">Lege zuerst links eine Etage an.</div>`;
    const doms = [["all","Alle"],["light","Licht"],["switch","Schalter"],["climate","Heizung"],["sensor","Sensoren"],["camera","Kameras"],["other","Weitere"]];
    return `<input class="inp" data-f="search" placeholder="Suchen (Name oder entity_id)" value="${esc(this.filter.q)}">
      <div class="chips">${doms.map(([k, l]) => `<button class="${this.filter.d === k ? "sel" : ""}" data-a="ent-filter" data-d="${k}">${l}</button>`).join("")}</div>
      <div class="hint">Am Griff ${ic("grip-vertical", 12).replace('class="i"', 'class="i" style="display:inline;vertical-align:-2px"')} auf den Grundriss ziehen oder mit + in die Mitte setzen.</div>
      <div class="ent-list" id="ent-list"></div>`;
  }
  _renderEntityList() {
    const el = this.$("#ent-list"); if (!el) return;
    const f = this._floor(), placed = new Set((f.pins || []).map((p) => p.entity_id));
    const q = this.filter.q.trim().toLowerCase(), d = this.filter.d;
    const main = ["light","switch","climate","sensor","camera"];
    let ids = Object.keys(this._hass.states).filter((id) => {
      const dm = domainOf(id);
      if (!PICK_DOMAINS.includes(dm)) return false;
      if (d === "sensor" && !(dm === "sensor" || dm === "binary_sensor")) return false;
      if (d === "other" && main.includes(dm)) return false;
      if (d !== "all" && d !== "other" && d !== "sensor" && dm !== d) return false;
      if (q && !(id.toLowerCase().includes(q) || friendly(this._hass, id).toLowerCase().includes(q))) return false;
      return true;
    });
    ids.sort((a, b) => (placed.has(a) - placed.has(b)) || friendly(this._hass, a).localeCompare(friendly(this._hass, b), "de"));
    const total = ids.length; ids = ids.slice(0, 150);
    el.innerHTML = ids.map((id) => { const s = this._hass.states[id];
      return `<div class="ent${placed.has(id) ? " placed" : ""}" data-ent="${esc(id)}"><span class="grip">${ic("grip-vertical", 18)}</span>
        <span class="e-ico">${ic(defaultIcon(s, id), 17)}</span><span class="e-txt"><div class="e-n">${esc(friendly(this._hass, id))}</div><div class="e-id">${esc(id)}${placed.has(id) ? " · schon platziert" : ""}</div></span>
        <button class="add" data-a="ent-add" data-ent="${esc(id)}" aria-label="Hinzufügen">${ic("plus", 16)}</button></div>`; }).join("")
      + (total > 150 ? `<div class="hint">${total - 150} weitere – Suche eingrenzen.</div>` : "")
      + (!total ? `<div class="hint">Nichts gefunden.</div>` : "");
  }

  _tabSelect() {
    const f = this._floor(), p = this._selPin(), r = this._selRoom();
    if (r) return `<div class="fld"><label>Raumname</label><input class="inp" data-f="room-name" value="${esc(r.name)}"></div>
      <div class="hint">Label auf dem Plan an die richtige Stelle ziehen. Geräte ohne festen Raum bekommen automatisch das nächstgelegene Label.</div>
      <button class="sbtn danger full" data-a="room-del">${ic("trash-2", 16)}Label entfernen</button>`;
    if (!p) return `<div class="hint">Tippe auf dem Plan ein Gerät oder Raum-Label an, um es zu bearbeiten.</div>`;
    const s = this._hass.states[p.entity_id], d = domainOf(p.entity_id);
    return `<div class="fld"><label>Entity</label><input class="inp" data-f="pin-entity" value="${esc(p.entity_id)}" ${s ? "" : 'style="border-color:var(--accent)"'}>
        ${s ? "" : `<div class="hint" style="color:var(--accent)">Diese Entity gibt es nicht.</div>`}</div>
      <div class="fld"><label>Anzeigename</label><input class="inp" data-f="pin-name" value="${esc(p.name || "")}" placeholder="${esc(friendly(this._hass, p.entity_id))}"></div>
      <div class="fld"><label>Raum</label><select class="inp" data-f="pin-room"><option value="">Automatisch (${esc(this._roomOf(f, { ...p, room: null }) || "kein Label")})</option>
        ${(f.rooms || []).map((rr) => `<option${p.room === rr.name ? " selected" : ""}>${esc(rr.name)}</option>`).join("")}</select></div>
      <div class="fld"><label>Anzeige auf dem Plan</label><div class="chips" style="margin:0">
        ${[["icon","Icon"],["value", d === "climate" ? "Ist-Temperatur" : "Wert"],["both","Icon + Wert"]].map(([k, l]) =>
          `<button class="${(p.display || "icon") === k ? "sel" : ""}" data-a="pin-display" data-v="${k}">${l}</button>`).join("")}</div>
        <div class="hint" style="margin-top:6px">Jetzt: ${esc(this._pinValue(p, s))}</div></div>
      <div class="fld"><label>Icon</label><div class="icon-grid"><button class="${p.icon ? "" : "sel"}" data-a="pin-icon" data-icon="auto" title="Automatisch" style="font-size:11px;font-weight:700">Auto</button>
        ${PIN_ICONS.map((n) => `<button class="${p.icon === n ? "sel" : ""}" data-a="pin-icon" data-icon="${n}" title="${n}">${ic(n, 17)}</button>`).join("")}</div></div>
      <label class="check"><input type="checkbox" data-f="pin-power" ${p.power_off ? "checked" : ""}>Mit Power-Button ausschalten</label>
      <div class="sep"></div>
      <div class="fld"><label>Zusatzwerte im Popup</label>
        <div class="hint">z. B. Leistung und Verbrauch bei einer Steckdose oder Luftfeuchte bei einem Thermometer.</div>
        ${(p.extras || []).map((x, i) => `<div class="row" style="margin-bottom:8px"><input class="inp" list="dl-sensors" data-f="pin-extra" data-i="${i}" value="${esc(x)}" placeholder="sensor.…">
          <button class="sbtn" data-a="extra-del" data-i="${i}" aria-label="Entfernen">${ic("x", 16)}</button></div>`).join("")}
        ${(p.extras || []).length < 4 ? `<button class="sbtn" data-a="extra-add">${ic("plus", 16)}Wert hinzufügen</button>` : ""}${this._datalist()}</div>
      <div class="sep"></div>
      <button class="sbtn danger full" data-a="pin-del">${ic("trash-2", 16)}Vom Plan entfernen</button>`;
  }

  _tabFloor() {
    const f = this._floor();
    if (!f) return `<div class="hint">Noch keine Etage. Links auf „+ Etage“ tippen.</div>`;
    const has = !!this.draftPlans[f.id], idx = this.draft.floors.indexOf(f);
    this._confirmDel = false;
    return `<div class="row"><div class="fld" style="width:90px"><label>Kürzel</label><input class="inp" data-f="floor-code" maxlength="4" value="${esc(f.code)}"></div>
        <div class="fld" style="flex:1"><label>Name</label><input class="inp" data-f="floor-name" value="${esc(f.name)}"></div></div>
      <div class="fld"><label>Grundriss (SVG)</label>
        <label class="drop-zone"><input type="file" accept=".svg,image/svg+xml" data-f="plan-file" hidden>
          ${ic("upload", 22).replace('class="i"', 'class="i" style="margin:0 auto 6px"')}<b>${has ? "Anderes SVG wählen" : "SVG hochladen"}</b>max. 2 MB · Skripte werden entfernt</label>
        ${has ? `<button class="sbtn danger" style="margin-top:8px" data-a="plan-del">${ic("trash-2", 16)}Grundriss entfernen</button>` : ""}</div>
      <label class="check"><input type="checkbox" data-f="floor-recolor" ${f.recolor !== false ? "checked" : ""}>Farben an Design &amp; Nachtmodus anpassen</label>
      <div class="hint">Dunkle Flächen werden zu Wänden, helle zu Boden, Grautöne zu Außenbereich/Türen. Aus = Original-Farben.</div>
      <label class="check"><input type="checkbox" data-f="floor-sep" ${f.separated ? "checked" : ""}>Trennlinie über dieser Etage (z. B. Keller)</label>
      <div class="sep"></div>
      <div class="row"><button class="sbtn" data-a="floor-up" ${idx === 0 ? "disabled" : ""}>${ic("arrow-up", 16)}Nach oben</button>
        <button class="sbtn" data-a="floor-down" ${idx === this.draft.floors.length - 1 ? "disabled" : ""}>${ic("arrow-down", 16)}Nach unten</button></div>
      <div class="sep"></div>
      <button class="sbtn danger full" data-a="floor-del">${ic("trash-2", 16)}Etage löschen</button>`;
  }

  _wasteDiag(id) {
    if (!id) return "";
    const s = this._hass.states[id];
    if (!s) return `<div class="hint" style="color:var(--accent);margin:8px 0 0">Entity nicht gefunden</div>`;
    const n = wasteDays(s);
    const raw = `Zustand: „${esc(String(s.state).slice(0, 60))}“`;
    return n == null || n < 0
      ? `<div class="hint" style="color:var(--accent);margin:8px 0 0">Kein Termin erkannt · ${raw}</div>`
      : `<div class="hint" style="margin:8px 0 0">✓ ${n === 0 ? "heute" : n === 1 ? "morgen" : "in " + n + " Tagen"} · ${raw}</div>`;
  }
  _tabDesign() {
    const t = mergeTheme(this.draft.theme), m = this._designMode || "light";
    return `<div class="row" style="margin-bottom:14px"><button class="sbtn primary" data-a="preview">${ic("eye", 16)}Vorschau</button>
        <button class="sbtn" data-a="theme-reset">Auf Standard zurücksetzen</button></div>
      <div class="fld"><label>Farben</label><div class="chips" style="margin:0 0 10px">
        <button class="${m === "light" ? "sel" : ""}" data-a="design-mode" data-v="light">Hell</button>
        <button class="${m === "dark" ? "sel" : ""}" data-a="design-mode" data-v="dark">Nachtmodus</button></div>
        ${THEME_COLORS.map(([k, l]) => `<div class="row" style="margin-bottom:6px"><input type="color" data-f="theme-color" data-k="${k}" value="${t[m][k]}">
          <span style="flex:1;font-size:13.5px">${l}</span><span class="hint" style="margin:0;font-family:monospace">${t[m][k]}</span></div>`).join("")}</div>
      <div class="sep"></div>
      <div class="fld"><label>Größen &amp; Abstände</label>
        ${THEME_SIZES.map(([k, l, mn, mx, u]) => `<div style="margin-bottom:8px"><div class="row" style="justify-content:space-between;font-size:13.5px">
          <span>${l}</span><b id="tv-${k}">${t.size[k]} ${u}</b></div>
          <input type="range" min="${mn}" max="${mx}" step="1" value="${t.size[k]}" data-f="theme-size" data-k="${k}" style="--p:${((t.size[k] - mn) / (mx - mn)) * 100}%"></div>`).join("")}</div>
      <div class="hint">Pins und Raum-Labels wachsen zusätzlich mit dem Grundriss mit, damit sie auf jedem Bildschirm an derselben Stelle sitzen.</div>`;
  }
  _tabGeneral() {
    const c = this.draft;
    c.night = c.night || { mode: "time", from: 22, to: 6 };
    const listBlock = (key, title, domains, hint) => `<div class="fld"><label>${title}</label>${hint ? `<div class="hint">${hint}</div>` : ""}
      ${(c[key] || []).map((it, i) => `<div class="list-item"><div class="row">
          ${domains === "sensor" ? `<input class="inp" list="dl-sensors" data-f="list" data-list="${key}" data-i="${i}" data-k="entity_id" value="${esc(it.entity_id)}" placeholder="sensor.…">`
            : `<select class="inp" data-f="list" data-list="${key}" data-i="${i}" data-k="entity_id">${this._entityOptions(domains, it.entity_id, "Kalender wählen")}</select>`}
          <button class="sbtn" data-a="list-del" data-list="${key}" data-i="${i}" aria-label="Entfernen">${ic("x", 16)}</button></div>
        <div class="row"><input class="inp" data-f="list" data-list="${key}" data-i="${i}" data-k="name" value="${esc(it.name)}" placeholder="Anzeigename">
          <input type="color" data-f="list" data-list="${key}" data-i="${i}" data-k="color" value="${esc(it.color || "#888888")}"></div>${key === "waste" ? this._wasteDiag(it.entity_id) : ""}</div>`).join("")}
      <button class="sbtn" data-a="list-add" data-list="${key}">${ic("plus", 16)}Hinzufügen</button></div>`;
    const hours = (v) => Array.from({ length: 24 }, (_, h) => `<option value="${h}"${Number(v) === h ? " selected" : ""}>${pad(h)}:00</option>`).join("");
    return `<div class="fld"><label>Startetage</label><select class="inp" data-f="default-floor">
        ${(c.floors || []).map((f) => `<option value="${f.id}"${c.default_floor === f.id ? " selected" : ""}>${esc(f.code)} – ${esc(f.name)}</option>`).join("")}</select>
        <div class="hint">Das Tablet springt nach 2 Minuten ohne Bedienung hierher zurück und schließt offene Popups.</div></div>
      <div class="sep"></div>
      <div class="fld"><label>Wetter</label><select class="inp" data-f="weather">${this._entityOptions(["weather"], c.weather_entity, "– kein Wetter –")}</select></div>
      <div class="sep"></div>
      ${listBlock("calendars", "Kalender", ["calendar"], "Google-Kalender über die Google-Calendar-Integration in HA einbinden – hier erscheinen sie dann.")}
      <div class="sep"></div>
      ${listBlock("waste", "Müllabfuhr", "sensor", "Sensor mit Datum (z. B. 2026-10-16 oder 16.10.2026) oder Anzahl Tage als Zustand. Attribut daysTo wird auch erkannt.")}
      ${this._datalist()}
      <div class="sep"></div>
      <div class="fld"><label>Nachtmodus</label><select class="inp" data-f="night-mode">
        <option value="time"${c.night.mode === "time" ? " selected" : ""}>Nach Uhrzeit</option>
        <option value="sun"${c.night.mode === "sun" ? " selected" : ""}>Nach Sonnenstand (sun.sun)</option>
        <option value="off"${c.night.mode === "off" ? " selected" : ""}>Aus</option></select></div>
      ${c.night.mode === "time" ? `<div class="row"><div class="fld" style="flex:1"><label>Von</label><select class="inp" data-f="night-from">${hours(c.night.from)}</select></div>
        <div class="fld" style="flex:1"><label>Bis</label><select class="inp" data-f="night-to">${hours(c.night.to)}</select></div></div>` : ""}
      <div class="hint">Tipp: Auf dem Tablet schaltet ein Tap auf die Uhr für 5 Minuten zwischen Hell und Dunkel um.</div>`;
  }
}

if (!customElements.get("hauspanel-panel")) customElements.define("hauspanel-panel", HauspanelPanel);
console.info(`%c HAUSPANEL %c ${HP_VERSION} `, "background:#E5391D;color:#fff;font-weight:700", "background:#1F1D1C;color:#fff");
