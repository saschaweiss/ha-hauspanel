/* Hauspanel – Grundriss-Dashboard für Home Assistant
 * Ein Web-Component-Modul ohne Build-Abhängigkeiten.
 * Icons: Lucide (ISC-Lizenz). Schrift: Inter (OFL).
 */
const HP_VERSION = "0.7.5";
const ICONS = {"activity":"<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\" />","air-vent":"<path d=\"M18 17.5a2.5 2.5 0 1 1-4 2.03V12\" /> <path d=\"M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\" /> <path d=\"M6 8h12\" /> <path d=\"M6.6 15.572A2 2 0 1 0 10 17v-5\" />","alarm-clock":"<circle cx=\"12\" cy=\"13\" r=\"8\" /> <path d=\"M12 9v4l2 2\" /> <path d=\"M5 3 2 6\" /> <path d=\"m22 6-3-3\" /> <path d=\"M6.38 18.7 4 21\" /> <path d=\"M17.64 18.67 20 21\" />","armchair":"<path d=\"M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3\" /> <path d=\"M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\" /> <path d=\"M5 18v2\" /> <path d=\"M19 18v2\" />","arrow-down":"<path d=\"M12 5v14\" /> <path d=\"m19 12-7 7-7-7\" />","arrow-up":"<path d=\"m5 12 7-7 7 7\" /> <path d=\"M12 19V5\" />","baby":"<path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\" /> <path d=\"M15 12h.01\" /> <path d=\"M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\" /> <path d=\"M9 12h.01\" />","bath":"<path d=\"M10 4 8 6\" /> <path d=\"M17 19v2\" /> <path d=\"M2 12h20\" /> <path d=\"M7 19v2\" /> <path d=\"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5\" />","battery":"<path d=\"M 22 14 L 22 10\" /> <rect x=\"2\" y=\"6\" width=\"16\" height=\"12\" rx=\"2\" />","battery-charging":"<path d=\"m11 7-3 5h4l-3 5\" /> <path d=\"M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935\" /> <path d=\"M22 14v-4\" /> <path d=\"M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936\" />","battery-low":"<path d=\"M22 14v-4\" /> <path d=\"M6 14v-4\" /> <rect x=\"2\" y=\"6\" width=\"16\" height=\"12\" rx=\"2\" />","bed":"<path d=\"M2 4v16\" /> <path d=\"M2 8h18a2 2 0 0 1 2 2v10\" /> <path d=\"M2 17h20\" /> <path d=\"M6 8v9\" />","bed-double":"<path d=\"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8\" /> <path d=\"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4\" /> <path d=\"M12 4v6\" /> <path d=\"M2 18h20\" />","bell":"<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /> <path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />","bell-ring":"<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /> <path d=\"M22 8c0-2.3-.8-4.3-2-6\" /> <path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" /> <path d=\"M4 2C2.8 3.7 2 5.7 2 8\" />","bike":"<circle cx=\"18.5\" cy=\"17.5\" r=\"3.5\" /> <circle cx=\"5.5\" cy=\"17.5\" r=\"3.5\" /> <circle cx=\"15\" cy=\"5\" r=\"1\" /> <path d=\"M12 17.5V14l-3-3 4-3 2 3h2\" />","blinds":"<path d=\"M3 3h18\" /> <path d=\"M20 7H8\" /> <path d=\"M20 11H8\" /> <path d=\"M10 19h10\" /> <path d=\"M8 15h12\" /> <path d=\"M4 3v14\" /> <circle cx=\"4\" cy=\"19\" r=\"2\" />","calendar":"<path d=\"M8 2v3\" /> <path d=\"M16 2v3\" /> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" /> <path d=\"M3 9h18\" />","calendars":"<path d=\"M12 2v2\" /> <path d=\"M15.726 21.01A2 2 0 0 1 14 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2\" /> <path d=\"M18 2v2\" /> <path d=\"M2 13h2\" /> <path d=\"M8 8h14\" /> <rect x=\"8\" y=\"3\" width=\"14\" height=\"14\" rx=\"2\" />","camera":"<path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\" /> <circle cx=\"12\" cy=\"13\" r=\"3\" />","car":"<path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\" /> <circle cx=\"7\" cy=\"17\" r=\"2\" /> <path d=\"M9 17h6\" /> <circle cx=\"17\" cy=\"17\" r=\"2\" />","car-front":"<path d=\"m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8\" /> <path d=\"M7 14h.01\" /> <path d=\"M17 14h.01\" /> <rect width=\"18\" height=\"8\" x=\"3\" y=\"10\" rx=\"2\" /> <path d=\"M5 18v2\" /> <path d=\"M19 18v2\" />","cat":"<path d=\"M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z\" /> <path d=\"M8 14v.5\" /> <path d=\"M16 14v.5\" /> <path d=\"M11.25 16.25h1.5L12 17l-.75-.75Z\" />","cctv":"<path d=\"M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97\" /> <path d=\"M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z\" /> <path d=\"M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15\" /> <path d=\"M2 21v-4\" /> <path d=\"M7 9h.01\" />","check":"<path d=\"M20 6 9 17l-5-5\" />","chevron-left":"<path d=\"m15 18-6-6 6-6\" />","chevron-right":"<path d=\"m9 18 6-6-6-6\" />","circle":"<circle cx=\"12\" cy=\"12\" r=\"10\" />","circle-dot":"<circle cx=\"12\" cy=\"12\" r=\"1\" /> <circle cx=\"12\" cy=\"12\" r=\"10\" />","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 6v6l4 2\" />","cloud":"<path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\" />","cloud-fog":"<path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\" /> <path d=\"M16 17H7\" /> <path d=\"M17 21H9\" />","cloud-hail":"<path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\" /> <path d=\"M16 14v2\" /> <path d=\"M8 14v2\" /> <path d=\"M16 20h.01\" /> <path d=\"M8 20h.01\" /> <path d=\"M12 16v2\" /> <path d=\"M12 22h.01\" />","cloud-lightning":"<path d=\"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973\" /> <path d=\"m13 12-3 5h4l-3 5\" />","cloud-rain":"<path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\" /> <path d=\"M16 14v6\" /> <path d=\"M8 14v6\" /> <path d=\"M12 16v6\" />","cloud-rain-wind":"<path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\" /> <path d=\"m9.2 22 3-7\" /> <path d=\"m9 13-3 7\" /> <path d=\"m17 13-3 7\" />","cloud-snow":"<path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\" /> <path d=\"M8 15h.01\" /> <path d=\"M8 19h.01\" /> <path d=\"M12 17h.01\" /> <path d=\"M12 21h.01\" /> <path d=\"M16 15h.01\" /> <path d=\"M16 19h.01\" />","cloud-sun":"<path d=\"M12 2v2\" /> <path d=\"m4.93 4.93 1.41 1.41\" /> <path d=\"M20 12h2\" /> <path d=\"m19.07 4.93-1.41 1.41\" /> <path d=\"M15.947 12.65a4 4 0 0 0-5.925-4.128\" /> <path d=\"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z\" />","code":"<path d=\"m16 18 6-6-6-6\" /> <path d=\"m8 6-6 6 6 6\" />","coffee":"<path d=\"M10 2v2\" /> <path d=\"M14 2v2\" /> <path d=\"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1\" /> <path d=\"M6 2v2\" />","cooking-pot":"<path d=\"M2 12h20\" /> <path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\" /> <path d=\"m4 8 16-4\" /> <path d=\"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8\" />","dog":"<path d=\"M11.25 16.25h1.5L12 17z\" /> <path d=\"M16 14v.5\" /> <path d=\"M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309\" /> <path d=\"M8 14v.5\" /> <path d=\"M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5\" />","door-closed":"<path d=\"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16\" /> <path d=\"M2 21h20\" /> <path d=\"M9 12h.01\" />","door-open":"<path d=\"M10 21H2\" /> <path d=\"M10 3H7a2 2 0 00-2 2v16\" /> <path d=\"M14 12h.01\" /> <path d=\"M19 21V5a2 2 0 00-1.675-1.974l-6.163-1.013A1 1 0 0010 3v18a1 1 0 001.124.992z\" /> <path d=\"M22 21h-3\" />","dot":"<circle cx=\"12\" cy=\"12\" r=\"1\" />","droplet":"<path d=\"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z\" />","droplets":"<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\" /> <path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\" />","edit":"<path d=\"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\" /> <path d=\"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z\" />","ellipse":"<ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"6\" />","eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />","fan":"<path d=\"M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z\" /> <path d=\"M12 12v.01\" />","fence":"<path d=\"M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z\" /> <path d=\"M6 8h4\" /> <path d=\"M6 18h4\" /> <path d=\"m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z\" /> <path d=\"M14 8h4\" /> <path d=\"M14 18h4\" /> <path d=\"m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z\" />","file":"<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\" /> <path d=\"M14 2v5a1 1 0 0 0 1 1h5\" />","fire-extinguisher":"<path d=\"M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5\" /> <path d=\"M9 18h8\" /> <path d=\"M18 3h-3\" /> <path d=\"M11 3a6 6 0 0 0-6 6v11\" /> <path d=\"M5 13h4\" /> <path d=\"M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z\" />","flame":"<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\" />","flame-kindling":"<path d=\"M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z\" /> <path d=\"m5 22 14-4\" /> <path d=\"m5 18 14 4\" />","flashlight":"<path d=\"M12 13v1\" /> <path d=\"M17 2a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8A4 4 0 0 0 16 12v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V3a1 1 0 0 1 1-1z\" /> <path d=\"M6 6h12\" />","flower-2":"<path d=\"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1\" /> <circle cx=\"12\" cy=\"8\" r=\"2\" /> <path d=\"M12 10v12\" /> <path d=\"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z\" /> <path d=\"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z\" />","gamepad-2":"<line x1=\"6\" x2=\"10\" y1=\"11\" y2=\"11\" /> <line x1=\"8\" x2=\"8\" y1=\"9\" y2=\"13\" /> <line x1=\"15\" x2=\"15.01\" y1=\"12\" y2=\"12\" /> <line x1=\"18\" x2=\"18.01\" y1=\"10\" y2=\"10\" /> <path d=\"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z\" />","gauge":"<path d=\"m12 14 4-4\" /> <path d=\"M3.34 19a10 10 0 1 1 17.32 0\" />","ghost":"<path d=\"M15 10v1\" /> <path d=\"M7.528 20.472a1.6 1.6 0 012.277 0l1.057 1.056a1.6 1.6 0 002.276 0l1.057-1.056a1.6 1.6 0 012.277 0l1.114 1.114a1.4 1.4 0 002.414-1V10a8 8 0 00-16 0v10.586a1.4 1.4 0 002.414 1z\" /> <path d=\"M9 10v1\" />","grid":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /> <path d=\"M3 9h18\" /> <path d=\"M3 15h18\" /> <path d=\"M9 3v18\" /> <path d=\"M15 3v18\" />","grip":"<circle cx=\"12\" cy=\"5\" r=\"1\" /> <circle cx=\"19\" cy=\"5\" r=\"1\" /> <circle cx=\"5\" cy=\"5\" r=\"1\" /> <circle cx=\"12\" cy=\"12\" r=\"1\" /> <circle cx=\"19\" cy=\"12\" r=\"1\" /> <circle cx=\"5\" cy=\"12\" r=\"1\" /> <circle cx=\"12\" cy=\"19\" r=\"1\" /> <circle cx=\"19\" cy=\"19\" r=\"1\" /> <circle cx=\"5\" cy=\"19\" r=\"1\" />","grip-vertical":"<circle cx=\"9\" cy=\"12\" r=\"1\" /> <circle cx=\"9\" cy=\"5\" r=\"1\" /> <circle cx=\"9\" cy=\"19\" r=\"1\" /> <circle cx=\"15\" cy=\"12\" r=\"1\" /> <circle cx=\"15\" cy=\"5\" r=\"1\" /> <circle cx=\"15\" cy=\"19\" r=\"1\" />","headphones":"<path d=\"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3\" />","heater":"<path d=\"M11 8c2-3-2-3 0-6\" /> <path d=\"M15.5 8c2-3-2-3 0-6\" /> <path d=\"M6 10h.01\" /> <path d=\"M6 14h.01\" /> <path d=\"M10 16v-4\" /> <path d=\"M14 16v-4\" /> <path d=\"M18 16v-4\" /> <path d=\"M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3\" /> <path d=\"M5 20v2\" /> <path d=\"M19 20v2\" />","home":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />","house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />","key":"<path d=\"m2 21 9.6-9.6\" /> <path d=\"m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19\" /> <circle cx=\"15.5\" cy=\"7.5\" r=\"5.5\" />","key-round":"<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\" /> <circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />","lamp":"<path d=\"M12 12v6\" /> <path d=\"M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z\" /> <path d=\"M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z\" />","lamp-ceiling":"<path d=\"M12 2v5\" /> <path d=\"M14.829 15.998a3 3 0 1 1-5.658 0\" /> <path d=\"M20.92 14.606A1 1 0 0 1 20 16H4a1 1 0 0 1-.92-1.394l3-7A1 1 0 0 1 7 7h10a1 1 0 0 1 .92.606z\" />","lamp-desk":"<path d=\"M10.293 2.293a1 1 0 0 1 1.414 0l2.5 2.5 5.994 1.227a1 1 0 0 1 .506 1.687l-7 7a1 1 0 0 1-1.687-.506l-1.227-5.994-2.5-2.5a1 1 0 0 1 0-1.414z\" /> <path d=\"m14.207 4.793-3.414 3.414\" /> <path d=\"M3 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z\" /> <path d=\"m9.086 6.5-4.793 4.793a1 1 0 0 0-.18 1.17L7 18\" />","lamp-floor":"<path d=\"M12 10v12\" /> <path d=\"M17.929 7.629A1 1 0 0 1 17 9H7a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 9 2h6a1 1 0 0 1 .928.629z\" /> <path d=\"M9 22h6\" />","lamp-wall-down":"<path d=\"M19.929 18.629A1 1 0 0 1 19 20H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 13h6a1 1 0 0 1 .928.629z\" /> <path d=\"M6 3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z\" /> <path d=\"M8 6h4a2 2 0 0 1 2 2v5\" />","lamp-wall-up":"<path d=\"M19.929 9.629A1 1 0 0 1 19 11H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 4h6a1 1 0 0 1 .928.629z\" /> <path d=\"M6 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z\" /> <path d=\"M8 18h4a2 2 0 0 0 2-2v-5\" />","laptop":"<path d=\"M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z\" /> <path d=\"M20.054 15.987H3.946\" />","leaf":"<path d=\"M11 20a10 10 0 0010-10 25.9 25.9 0 00-1.04-7.281 1 1 0 00-1.755-.325C15.833 5.5 13 5.5 9.8 6.1A7 7 0 0011 20\" /> <path d=\"M2 21a5 5 0 012.911-4.544C7.613 15.212 8.351 15.24 11 13\" />","lightbulb":"<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\" /> <path d=\"M9 18h6\" /> <path d=\"M10 22h4\" />","lightbulb-off":"<path d=\"M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5\" /> <path d=\"m2 2 20 20\" /> <path d=\"M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5\" /> <path d=\"M9 18h6\" /> <path d=\"M10 22h4\" />","list":"<path d=\"M3 5h.01\" /> <path d=\"M3 12h.01\" /> <path d=\"M3 19h.01\" /> <path d=\"M8 5h13\" /> <path d=\"M8 12h13\" /> <path d=\"M8 19h13\" />","lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />","mail":"<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\" /> <rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" />","map-pin":"<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" />","maximize-2":"<path d=\"M15 3h6v6\" /> <path d=\"m21 3-7 7\" /> <path d=\"m3 21 7-7\" /> <path d=\"M9 21H3v-6\" />","menu":"<path d=\"M4 5h16\" /> <path d=\"M4 12h16\" /> <path d=\"M4 19h16\" />","microwave":"<rect width=\"20\" height=\"15\" x=\"2\" y=\"4\" rx=\"2\" /> <rect width=\"8\" height=\"7\" x=\"6\" y=\"8\" rx=\"1\" /> <path d=\"M18 8v7\" /> <path d=\"M6 19v2\" /> <path d=\"M18 19v2\" />","minus":"<path d=\"M5 12h14\" />","monitor":"<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /> <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" />","moon":"<path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\" />","music":"<path d=\"M9 18V5l12-2v13\" /> <circle cx=\"6\" cy=\"18\" r=\"3\" /> <circle cx=\"18\" cy=\"16\" r=\"3\" />","package":"<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\" /> <path d=\"M12 22V12\" /> <polyline points=\"3.29 7 12 12 20.71 7\" /> <path d=\"m7.5 4.27 9 5.15\" />","paw-print":"<circle cx=\"11\" cy=\"4\" r=\"2\" /> <circle cx=\"18\" cy=\"8\" r=\"2\" /> <circle cx=\"20\" cy=\"16\" r=\"2\" /> <path d=\"M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z\" />","pencil":"<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /> <path d=\"m15 5 4 4\" />","pill":"<path d=\"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z\" /> <path d=\"m8.5 8.5 7 7\" />","pin":"<path d=\"M12 17v5\" /> <path d=\"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z\" />","pipette":"<path d=\"m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12\" /> <path d=\"m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z\" /> <path d=\"m2 22 .414-.414\" />","play":"<path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\" />","plug":"<path d=\"M12 22v-5\" /> <path d=\"M15 8V2\" /> <path d=\"M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z\" /> <path d=\"M9 8V2\" />","plug-zap":"<path d=\"M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z\" /> <path d=\"m2 22 3-3\" /> <path d=\"M7.5 13.5 10 11\" /> <path d=\"M10.5 16.5 13 14\" /> <path d=\"m18 3-4 4h6l-4 4\" />","plus":"<path d=\"M5 12h14\" /> <path d=\"M12 5v14\" />","power":"<path d=\"M12 2v10\" /> <path d=\"M18.4 6.6a9 9 0 1 1-12.77.04\" />","printer":"<path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\" /> <path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\" /> <rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\" />","radio":"<path d=\"M16.247 7.761a6 6 0 0 1 0 8.478\" /> <path d=\"M19.075 4.933a10 10 0 0 1 0 14.134\" /> <path d=\"M4.925 19.067a10 10 0 0 1 0-14.134\" /> <path d=\"M7.753 16.239a6 6 0 0 1 0-8.478\" /> <circle cx=\"12\" cy=\"12\" r=\"2\" />","radius":"<path d=\"M20.34 17.52a10 10 0 1 0-2.82 2.82\" /> <circle cx=\"19\" cy=\"19\" r=\"2\" /> <path d=\"m13.41 13.41 4.18 4.18\" /> <circle cx=\"12\" cy=\"12\" r=\"2\" />","recycle":"<path d=\"M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5\" /> <path d=\"M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12\" /> <path d=\"m14 16-3 3 3 3\" /> <path d=\"M8.293 13.596 7.196 9.5 3.1 10.598\" /> <path d=\"m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843\" /> <path d=\"m13.378 9.633 4.096 1.098 1.097-4.096\" />","refrigerator":"<path d=\"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z\" /> <path d=\"M5 10h14\" /> <path d=\"M15 7v6\" />","router":"<rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" /> <path d=\"M6.01 18H6\" /> <path d=\"M10.01 18H10\" /> <path d=\"M15 10v4\" /> <path d=\"M17.84 7.17a4 4 0 0 0-5.66 0\" /> <path d=\"M20.66 4.34a8 8 0 0 0-11.31 0\" />","scale":"<path d=\"M12 3v18\" /> <path d=\"m19 8 3 8a5 5 0 0 1-6 0zV7\" /> <path d=\"M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1\" /> <path d=\"m5 8 3 8a5 5 0 0 1-6 0zV7\" /> <path d=\"M7 21h10\" />","search":"<path d=\"m21 21-4.34-4.34\" /> <circle cx=\"11\" cy=\"11\" r=\"8\" />","server":"<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\" /> <rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\" /> <line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\" /> <line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\" />","shield":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />","shield-check":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /> <path d=\"m9 12 2 2 4-4\" />","shirt":"<path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\" />","shower-head":"<path d=\"m4 4 2.5 2.5\" /> <path d=\"M13.5 6.5a4.95 4.95 0 0 0-7 7\" /> <path d=\"M15 5 5 15\" /> <path d=\"M14 17v.01\" /> <path d=\"M10 16v.01\" /> <path d=\"M13 13v.01\" /> <path d=\"M16 10v.01\" /> <path d=\"M11 20v.01\" /> <path d=\"M17 14v.01\" /> <path d=\"M20 11v.01\" />","siren":"<path d=\"M7 18v-6a5 5 0 1 1 10 0v6\" /> <path d=\"M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z\" /> <path d=\"M21 12h1\" /> <path d=\"M18.5 4.5 18 5\" /> <path d=\"M2 12h1\" /> <path d=\"M12 2v1\" /> <path d=\"m4.929 4.929.707.707\" /> <path d=\"M12 12v6\" />","smartphone":"<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\" /> <path d=\"M12 18h.01\" />","snowflake":"<path d=\"m10 20-1.25-2.5L6 18\" /> <path d=\"M10 4 8.75 6.5 6 6\" /> <path d=\"m14 20 1.25-2.5L18 18\" /> <path d=\"m14 4 1.25 2.5L18 6\" /> <path d=\"m17 21-3-6h-4\" /> <path d=\"m17 3-3 6 1.5 3\" /> <path d=\"M2 12h6.5L10 9\" /> <path d=\"m20 10-1.5 2 1.5 2\" /> <path d=\"M22 12h-6.5L14 15\" /> <path d=\"m4 10 1.5 2L4 14\" /> <path d=\"m7 21 3-6-1.5-3\" /> <path d=\"m7 3 3 6h4\" />","sofa":"<path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\" /> <path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\" /> <path d=\"M4 18v2\" /> <path d=\"M20 18v2\" /> <path d=\"M12 4v9\" />","solar-panel":"<path d=\"M11 2h2\" /> <path d=\"m14.28 14-4.56 8\" /> <path d=\"m21 22-1.558-4H4.558\" /> <path d=\"M3 10v2\" /> <path d=\"M6.245 15.04A2 2 0 0 1 8 14h12a1 1 0 0 1 .864 1.505l-3.11 5.457A2 2 0 0 1 16 22H4a1 1 0 0 1-.863-1.506z\" /> <path d=\"M7 2a4 4 0 0 1-4 4\" /> <path d=\"m8.66 7.66 1.41 1.41\" />","speaker":"<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\" /> <path d=\"M12 6h.01\" /> <circle cx=\"12\" cy=\"14\" r=\"4\" /> <path d=\"M12 14h.01\" />","spotlight":"<path d=\"M15.295 19.562 16 22\" /> <path d=\"m17 16 3.758 2.098\" /> <path d=\"m19 12.5 3.026-.598\" /> <path d=\"M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z\" /> <path d=\"M8 9V2\" />","sprout":"<path d=\"M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3\" /> <path d=\"M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4\" /> <path d=\"M5 21h14\" />","sun":"<circle cx=\"12\" cy=\"12\" r=\"4\" /> <path d=\"M12 2v2\" /> <path d=\"M12 20v2\" /> <path d=\"m4.93 4.93 1.41 1.41\" /> <path d=\"m17.66 17.66 1.41 1.41\" /> <path d=\"M2 12h2\" /> <path d=\"M20 12h2\" /> <path d=\"m6.34 17.66-1.41 1.41\" /> <path d=\"m19.07 4.93-1.41 1.41\" />","sun-dim":"<circle cx=\"12\" cy=\"12\" r=\"4\" /> <path d=\"M12 4h.01\" /> <path d=\"M20 12h.01\" /> <path d=\"M12 20h.01\" /> <path d=\"M4 12h.01\" /> <path d=\"M17.657 6.343h.01\" /> <path d=\"M17.657 17.657h.01\" /> <path d=\"M6.343 17.657h.01\" /> <path d=\"M6.343 6.343h.01\" />","tablet":"<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\" ry=\"2\" /> <line x1=\"12\" x2=\"12.01\" y1=\"18\" y2=\"18\" />","tag":"<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\" /> <circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />","text":"<path d=\"M21 5H3\" /> <path d=\"M15 12H3\" /> <path d=\"M17 19H3\" />","thermometer":"<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\" />","thermometer-sun":"<path d=\"M12 2v2\" /> <path d=\"M12 8a4 4 0 0 0-1.645 7.647\" /> <path d=\"M2 12h2\" /> <path d=\"M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z\" /> <path d=\"m4.93 4.93 1.41 1.41\" /> <path d=\"m6.34 17.66-1.41 1.41\" />","timer":"<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\" /> <line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\" /> <circle cx=\"12\" cy=\"14\" r=\"8\" />","toggle-left":"<circle cx=\"9\" cy=\"12\" r=\"3\" /> <rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"7\" />","toilet":"<path d=\"M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18\" /> <path d=\"M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8\" />","trash-2":"<path d=\"M10 11v6\" /> <path d=\"M14 11v6\" /> <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\" /> <path d=\"M3 6h18\" /> <path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\" />","trees":"<path d=\"M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z\" /> <path d=\"M7 16v6\" /> <path d=\"M13 19v3\" /> <path d=\"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5\" />","triangle-alert":"<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /> <path d=\"M12 9v4\" /> <path d=\"M12 17h.01\" />","tv":"<path d=\"m17 2-5 5-5-5\" /> <rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" />","unlock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /> <path d=\"M7 11V7a5 5 0 0 1 9.9-1\" />","upload":"<path d=\"M12 3v12\" /> <path d=\"m17 8-5-5-5 5\" /> <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" />","user":"<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /> <circle cx=\"12\" cy=\"7\" r=\"4\" />","users":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /> <path d=\"M16 3.128a4 4 0 0 1 0 7.744\" /> <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /> <circle cx=\"9\" cy=\"7\" r=\"4\" />","utensils":"<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\" /> <path d=\"M7 2v20\" /> <path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\" />","video":"<path d=\"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5\" /> <rect x=\"2\" y=\"6\" width=\"14\" height=\"12\" rx=\"2\" />","video-off":"<path d=\"M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196\" /> <path d=\"M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2\" /> <path d=\"m2 2 20 20\" />","view":"<path d=\"M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2\" /> <path d=\"M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2\" /> <circle cx=\"12\" cy=\"12\" r=\"1\" /> <path d=\"M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0\" />","warehouse":"<path d=\"M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11\" /> <path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z\" /> <path d=\"M6 13h12\" /> <path d=\"M6 17h12\" />","washing-machine":"<path d=\"M3 6h3\" /> <path d=\"M17 6h.01\" /> <rect width=\"18\" height=\"20\" x=\"3\" y=\"2\" rx=\"2\" /> <circle cx=\"12\" cy=\"13\" r=\"5\" /> <path d=\"M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5\" />","waves":"<path d=\"M2 12q2.5 2 5 0t5 0 5 0 5 0\" /> <path d=\"M2 19q2.5 2 5 0t5 0 5 0 5 0\" /> <path d=\"M2 5q2.5 2 5 0t5 0 5 0 5 0\" />","webcam":"<circle cx=\"12\" cy=\"10\" r=\"8\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" /> <path d=\"M7 22h10\" /> <path d=\"M12 22v-4\" />","wifi":"<path d=\"M12 20h.01\" /> <path d=\"M2 8.82a15 15 0 0 1 20 0\" /> <path d=\"M5 12.859a10 10 0 0 1 14 0\" /> <path d=\"M8.5 16.429a5 5 0 0 1 7 0\" />","wind":"<path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\" /> <path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\" /> <path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\" />","wine":"<path d=\"M8 22h8\" /> <path d=\"M7 10h10\" /> <path d=\"M12 15v7\" /> <path d=\"M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z\" />","x":"<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />","zap":"<path d=\"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z\" />"};

// Referenzbreite/-höhe: darauf wird skaliert, der Rest des Bildschirms geht an den Grundriss
const STAGE_W = 1280, STAGE_MIN_H = 800, MOBILE_W = 430;
/* Icon-Auswahl im Editor, nach Gruppen. Suchbegriffe (deutsch) stehen hinter dem Doppelpunkt. */
const ICON_GROUPS = [
  ["Licht", ["lightbulb:birne licht lampe", "lightbulb-off:birne aus", "lamp-ceiling:deckenlampe decke", "lamp-floor:stehlampe", "lamp-desk:schreibtischlampe", "lamp:tischlampe nachttisch",
    "lamp-wall-up:wandlampe", "lamp-wall-down:wandlampe", "spotlight:strahler spot", "flashlight:taschenlampe", "sun-dim:dimmer", "sun:sonne hell"]],
  ["Steckdosen & Strom", ["plug:steckdose stecker", "plug-zap:steckdose strom", "power:ein aus", "zap:strom blitz", "battery:akku batterie", "battery-charging:laden akku",
    "battery-low:akku leer", "solar-panel:solar pv photovoltaik", "gauge:zähler verbrauch", "activity:aktivität messwert"]],
  ["Heizen & Klima", ["flame:heizung feuer", "flame-kindling:kamin ofen", "heater:heizlüfter radiator", "thermometer:temperatur", "thermometer-sun:wärme", "snowflake:kühlen klima kalt",
    "fan:ventilator lüfter", "air-vent:lüftung klimaanlage", "wind:wind luft", "droplet:wasser tropfen", "droplets:feuchte luftfeuchtigkeit", "waves:wasser pool"]],
  ["Medien & Technik", ["tv:fernseher", "monitor:bildschirm pc", "laptop:laptop", "smartphone:handy", "tablet:tablet", "speaker:lautsprecher", "headphones:kopfhörer", "radio:radio",
    "music:musik", "gamepad-2:konsole spiel", "printer:drucker", "router:router", "wifi:wlan", "server:server nas"]],
  ["Sicherheit", ["cctv:überwachung kamera", "video:video kamera", "camera:kamera foto", "webcam:webcam", "lock:schloss zu", "key:schlüssel", "key-round:schlüssel",
    "shield:alarm schutz", "shield-check:gesichert", "siren:sirene alarm", "bell:klingel", "bell-ring:klingel läuten", "fire-extinguisher:feuerlöscher rauch"]],
  ["Haushalt", ["washing-machine:waschmaschine trockner", "refrigerator:kühlschrank", "microwave:mikrowelle", "cooking-pot:herd kochen", "coffee:kaffee", "wine:wein",
    "utensils:essen küche", "trash-2:müll", "recycle:recycling", "shirt:kleidung", "package:paket"]],
  ["Räume & Möbel", ["house:haus", "sofa:sofa wohnzimmer", "armchair:sessel", "bed:bett schlafzimmer", "bed-double:doppelbett", "bath:badewanne bad", "shower-head:dusche",
    "toilet:toilette wc", "door-open:tür offen", "door-closed:tür zu", "blinds:rollladen jalousie", "fence:zaun", "warehouse:garage lager"]],
  ["Draußen & Sonstiges", ["leaf:pflanze", "sprout:garten", "flower-2:blume", "trees:garten bäume", "cloud:wetter", "cloud-rain:regen", "car:auto", "car-front:auto garage",
    "bike:fahrrad", "baby:baby", "dog:hund", "cat:katze", "paw-print:haustier", "alarm-clock:wecker", "clock:uhr", "timer:timer", "calendar:kalender", "mail:post briefkasten", "scale:waage"]],
];
const PIN_ICONS = ICON_GROUPS.flatMap((g) => g[1].map((x) => x.split(":")[0]));
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
const scaleField = (o, f) => `<div class="fld"><div class="row" style="justify-content:space-between"><span class="lbl" style="margin:0">Größe</span>
  <span class="row" style="gap:6px"><b id="sv-${f}">${o.scale || 100} %</b>${o.scale && o.scale !== 100 ? `<button class="sx" data-a="scale-reset" data-k="${f}" title="Zurück auf 100 %">${ic("x", 13)}</button>` : ""}</span></div>
  <input type="range" min="50" max="200" step="5" value="${o.scale || 100}" data-f="${f}" style="--p:${((o.scale || 100) - 50) / 1.5}%">
  <div class="hint" style="margin-top:4px">Nur dieses ${f === "room-scale" ? "Label" : "Gerät"}; die allgemeine Größe stellst du im Design-Tab ein.</div></div>`;
/* "#abc", "abc", "#AABBCC" -> "#aabbcc"; ungültig -> null */
const normHex = (v) => {
  let s = String(v || "").trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(s)) s = s.split("").map((c) => c + c).join("");
  return /^[0-9a-f]{6}$/.test(s) ? "#" + s : null;
};
const scaleVar = (o) => (o.scale && o.scale !== 100 ? `;--ps:${o.scale / 100}` : "");
const uid = (p = "") => p + Math.random().toString(36).slice(2, 10);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const monday = (d) => { const x = startOfDay(d); return addDays(x, -((x.getDay() + 6) % 7)); };
/* Erster angezeigter Kalendertag: "week" = Montag, "rolling" = heute, "weekend" = Montag, aber Sa/So ab heute */
const calStart = (mode, offset) => {
  const now = new Date(), wd = now.getDay();
  const base = mode === "rolling" || (mode === "weekend" && (wd === 6 || wd === 0)) ? startOfDay(now) : monday(now);
  return addDays(base, offset * 7);
};
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
  if (d === "climate") {
    if (st === "off" || st === "unavailable" || st === "unknown") return false;
    const act = stateObj.attributes.hvac_action;
    return act == null ? true : ["heating", "cooling", "drying", "preheating", "defrosting"].includes(act);
  }
  return ACTIVE_STATES.has(st);
}
/* Hat das Gerät überhaupt einen An/Aus-Status? */
const TOGGLE_DOMAINS = new Set(["light","switch","fan","input_boolean","media_player","cover"]);
const STATUS_DOMAINS = new Set(["light","switch","fan","input_boolean","media_player","cover","lock","climate","binary_sensor"]);
/* Farbe/Status eines Pins: p.status = "auto" | "action" | "mode" | "none" (wie Messwert) */
function pinStatusful(p) { return STATUS_DOMAINS.has(domainOf(p.entity_id)) && p.status !== "none"; }
function pinActive(p, s) {
  if (!s || !pinStatusful(p)) return false;
  if (domainOf(p.entity_id) === "climate" && p.status === "mode") return !["off", "unavailable", "unknown"].includes(s.state);
  return isActive(s);
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
const COLOR_MODES = ["hs", "xy", "rgb", "rgbw", "rgbww"];
function supportsColor(stateObj) { return (stateObj.attributes.supported_color_modes || []).some((m) => COLOR_MODES.includes(m)); }
function supportsColorTemp(stateObj) { return (stateObj.attributes.supported_color_modes || []).includes("color_temp"); }
const LIGHT_PRESETS = [[0, 100], [25, 100], [50, 100], [120, 90], [180, 80], [215, 90], [270, 80], [310, 80]];
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
  size: { font: 100, radius: 22, gap: 12, margin: 18, pad: 16, cal: 198, pin: 36, pinFont: 14, label: 11, left: 176, right: 282 },
};
const THEME_COLORS = [["accent","Akzent (aktiv, Buttons)"],["bg","Hintergrund"],["card","Karten"],["tile","Kacheln in Karten"],
  ["text","Text"],["muted","Text gedämpft"],["dark","Dunkle Karten (Uhr, Wetter)"],["wall","Wände"],["floor","Boden"],["outside","Außenbereich"]];
const THEME_SIZES = [["font","Schriftgröße",70,140,"%"],["radius","Ecken-Rundung",0,40,"px"],["gap","Abstand zwischen Karten",0,32,"px"],
  ["left","Breite Etagen-Spalte",120,320,"px"],["right","Breite rechte Spalte (Wetter, Müll)",220,460,"px"],["margin","Rand außen",0,48,"px"],["pad","Innenabstand der Karten",6,32,"px"],["cal","Höhe Kalenderleiste",0,360,"px"],
  ["pin","Größe der Geräte-Pins",22,64,"px"],["pinFont","Schrift in Pins (Werte)",9,26,"px"],["label","Schrift Raum-Labels",7,24,"px"]];
const LAYOUT_SIZES = ["left", "right", "cal"];
const THEME_DETAIL = [
  ["Geräte-Pins", "Eingeschaltet = Licht an, Steckdose an, Heizung heizt gerade. Messwert = Sensoren und Heizungen, die gerade nicht heizen.", [
    ["pinOnBg", "--pin-on-bg", "Eingeschaltet – Hintergrund"], ["pinOnFg", "--pin-on-fg", "Eingeschaltet – Icon/Schrift"],
    ["pinOffBg", "--pin-off-bg", "Ausgeschaltet – Hintergrund"], ["pinOffFg", "--pin-off-fg", "Ausgeschaltet – Icon/Schrift"],
    ["pinValBg", "--pin-val-bg", "Messwert – Hintergrund"], ["pinValFg", "--pin-val-fg", "Messwert – Schrift"],
    ["pinCamBg", "--pin-cam-bg", "Kamera – Hintergrund"], ["pinCamFg", "--pin-cam-fg", "Kamera – Icon"]]],
  ["Etagen-Buttons", "", [
    ["floorOnBg", "--floor-on-bg", "Aktiv – Hintergrund"], ["floorOnFg", "--floor-on-fg", "Aktiv – Schrift"],
    ["floorOffBg", "--floor-off-bg", "Inaktiv – Hintergrund"], ["floorOffFg", "--floor-off-fg", "Inaktiv – Schrift"]]],
  ["Buttons", "Allgemein = Kalender-Pfeile, Schließen, Plus/Minus. Ausgewählt = z. B. der aktive Heizmodus im Popup.", [
    ["btnBg", "--btn-bg", "Allgemein – Hintergrund"], ["btnFg", "--btn-fg", "Allgemein – Icon/Schrift"],
    ["btnSelBg", "--btn-sel-bg", "Ausgewählt – Hintergrund"], ["btnSelFg", "--btn-sel-fg", "Ausgewählt – Schrift"],
    ["powerBg", "--power-bg", "Power-Button – Hintergrund"], ["powerFg", "--power-fg", "Power-Button – Icon"],
    ["toggleOn", "--toggle-on", "Schalter im Popup – an"], ["toggleOff", "--toggle-off", "Schalter im Popup – aus"]]],
  ["Uhr & Wetter", "", [
    ["clockBg", "--clock-bg", "Uhr – Hintergrund"], ["clockFg", "--clock-fg", "Uhr – Schrift"],
    ["weatherBg", "--weather-bg", "Wetter – Hintergrund"], ["weatherFg", "--weather-fg", "Wetter – Schrift"]]],
  ["Hervorhebungen", "", [
    ["soonBg", "--soon-bg", "Müll heute/morgen – Hintergrund"], ["soonFg", "--soon-fg", "Müll heute/morgen – Schrift"],
    ["todayBg", "--today-bg", "Kalender heute – Hintergrund"], ["todayFg", "--today-fg", "Kalender heute – Schrift"]]],
];
const DETAIL_VARS = THEME_DETAIL.flatMap((g) => g[2]);
/* Schatten: Farbe „accent“ = Akzentfarbe des jeweiligen Modus */
const THEME_SHADOWS = [
  ["pin", "--sh-pin", "Pins (aus / Messwert)", { light: { c: "#1E1C1B", o: 14, b: 8, y: 2 }, dark: { c: "#000000", o: 50, b: 8, y: 2 } }],
  ["pinOn", "--sh-pin-on", "Pins eingeschaltet", { light: { c: "accent", o: 35, b: 10, y: 3 }, dark: { c: "accent", o: 25, b: 10, y: 3 } }],
  ["floorOn", "--sh-floor-on", "Etagen-Button aktiv", { light: { c: "accent", o: 35, b: 16, y: 6 }, dark: { c: "accent", o: 25, b: 16, y: 6 } }],
  ["card", "--shadow", "Karten & Kopfzeile", { light: { c: "#1E1C1B", o: 6, b: 10, y: 2 }, dark: { c: "#000000", o: 0, b: 10, y: 2 } }],
];
function shadowVals(o, mode, key) {
  const def = THEME_SHADOWS.find((s) => s[0] === key)[3][mode];
  const v = { ...def, ...((o.sh || {})[key] || {}) };
  if (v.c === "accent") v.c = o.accent;
  return v;
}
function mergeTheme(t) {
  t = t || {};
  return { light: { ...DEFAULT_THEME.light, ...(t.light || {}) }, dark: { ...DEFAULT_THEME.dark, ...(t.dark || {}) }, size: { ...DEFAULT_THEME.size, ...(t.size || {}) } };
}
const contrastFg = (bg, text, card) => {
  const lum = (h) => { const [r, g, b] = hexRgb(h).map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const L = lum(bg), ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return ratio(L, lum(text)) >= ratio(L, lum(card)) ? text : card;
};
const hexRgb = (h) => { const m = String(h).replace("#", ""); const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mixHex = (a, b, w) => { const x = hexRgb(a), y = hexRgb(b); return "#" + x.map((v, i) => Math.round(v * w + y[i] * (1 - w)).toString(16).padStart(2, "0")).join(""); };
const rgba = (h, al) => { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${al})`; };
function themeCss(theme) {
  const t = mergeTheme(theme), s = t.size;
  const vars = (o, dark) => `--accent:${o.accent};--accent-soft:${mixHex(o.accent, o.card, dark ? 0.22 : 0.14)};--accent-glow:${rgba(o.accent, dark ? 0.25 : 0.35)};` +
    `--bg:${o.bg};--card:${o.card};--tile:${o.tile};--tile-2:${mixHex(o.text, o.tile, 0.05)};--text:${o.text};--muted:${o.muted};` +
    `--soft:${mixHex(o.muted, o.card, 0.5)};--dark:${o.dark};--dark-2:${mixHex("#ffffff", o.dark, 0.07)};` +
    `--wall:${o.wall};--floor:${o.floor};--outside:${o.outside};--door:${mixHex(o.wall, o.floor, 0.4)}` +
    DETAIL_VARS.filter(([k]) => o[k]).map(([k, v]) => `;${v}:${o[k]}`).join("") +
    // Hintergrund gesetzt, Schrift nicht: automatisch dunkle oder helle Schrift für guten Kontrast
    [["soonBg", "soonFg", "--soon-fg"], ["todayBg", "todayFg", "--today-fg"]].filter(([b, f]) => o[b] && !o[f])
      .map(([b, , v]) => `;${v}:${contrastFg(o[b], o.text, o.card)}`).join("") +
    THEME_SHADOWS.filter(([k]) => o.sh && o.sh[k]).map(([k, v]) => {
      const s = shadowVals(o, dark ? "dark" : "light", k);
      return `;${v}:${Number(s.o) === 0 ? "none" : `0 ${s.y}px ${s.b}px ${rgba(s.c, s.o / 100)}`}`;
    }).join("");
  return `:host{${vars(t.light)};--fs:${s.font / 100};--radius:${s.radius}px;--gap:${s.gap}px;--m:${s.margin}px;--pad:${s.pad}px;` +
    `--cal-h:${s.cal}px;--col-l:${s.left}px;--col-r:${s.right}px;--pin:${s.pin}px;--pin-fs:${s.pinFont}px;--label-fs:${s.label}px}` +
    (Number(s.cal) < 60 ? "#cal{display:none}#main{bottom:var(--m)}" : "") +
    `:host([data-theme="dark"]){${vars(t.dark, true)}}`;
}

/* ---------- Eigenes CSS: Spickzettel im CSS-Fenster ---------- */
const CSS_HELP = `/* Eigenes CSS überschreibt das eingebaute – es bleibt bei Updates erhalten.
   Reicht die Spezifität nicht, hilft !important.
   Notfall: Panel mit ?nocss aufrufen -> eigenes CSS wird ignoriert. */

/* Variablen (am besten hier ansetzen) */
:host {
  --accent: #E5391D;  --bg: #EEECEA;  --card: #fff;  --tile: #F4F2F0;
  --text: #1E1C1B;  --muted: #8A8580;  --dark: #1F1D1C;
  --wall: #2E2C2B;  --floor: #fff;  --outside: #EDEBE9;  --door: #B3AEA9;
  --radius: 22px;  --gap: 12px;  --m: 18px;  --pad: 16px;  --cal-h: 198px;
  --pin: 36px;  --pin-fs: 14px;  --label-fs: 11px;  --fs: 1;
  /* --k = Skalierung von Pins/Labels mit dem Grundriss (wird berechnet) */
}
:host([data-theme="dark"]) { }      /* nur Nachtmodus */
:host([data-floor="OG"]) { }         /* nur wenn Etage OG offen ist */
:host(.edit) { }                     /* nur im Editor */

/* Bereiche */
#top  #home  #date  #clock           /* Kopfzeile */
#floors  .floor-btn  .floor-btn.active
#plan-card  #plan-title  #all-off  #plan
#weather  .w-temp  .w-cond  .w-day
#waste  .bin  .bin.soon  .bin-ico
#cal  .day  .day.today  .ev  .chip  .legend

/* Grundriss */
.fp .f-wall  .fp .f-floor  .fp .f-out  .fp .f-door   /* Flächen */
.room-label  .room-label[data-room-name="Bad"]

/* Geräte-Pins */
.pin  .pin.on  .pin.val  .pin.unavail
.pin[data-domain="light"]  .pin[data-entity="light.kueche"]

/* Popups */
.pop  .pop[data-domain="climate"]  .pop-title  .toggle  .panel

/* Beispiele */
.pin.on { animation: glow 2s infinite alternate; }
@keyframes glow { to { box-shadow: 0 0 18px var(--accent); } }
#date { font-weight: 800; }
.pin[data-domain="climate"].on { background: #F59E0B; }
`;

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
:host{--sh-pin:var(--pin-shadow);--sh-pin-on:0 3px 10px var(--accent-glow);--sh-floor-on:0 6px 16px var(--accent-glow);
  --pin-on-bg:var(--accent);--pin-on-fg:#fff;--pin-off-bg:var(--card);--pin-off-fg:var(--text);--pin-val-bg:var(--card);--pin-val-fg:var(--text);
  --pin-cam-bg:var(--dark);--pin-cam-fg:#fff;--floor-on-bg:var(--accent);--floor-on-fg:#fff;--floor-off-bg:var(--tile);--floor-off-fg:var(--text);
  --btn-bg:var(--tile);--btn-fg:var(--text);--btn-sel-bg:var(--accent);--btn-sel-fg:#fff;--power-bg:var(--dark);--power-fg:#fff;
  --toggle-on:var(--accent);--toggle-off:var(--tile-2);--clock-bg:var(--dark);--clock-fg:#fff;--weather-bg:var(--dark);--weather-fg:#fff;
  --soon-bg:var(--accent-soft);--today-bg:var(--accent-soft);--soon-fg:var(--text);--today-fg:var(--text);
  --fs:1;--radius:22px;--gap:12px;--m:18px;--pad:16px;--pin:36px;--pin-fs:14px;--label-fs:11px;--cal-h:198px;--col-l:176px;--col-r:282px;
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
#clock{background:var(--clock-bg);color:var(--clock-fg);font-size:calc(25px * var(--fs));font-weight:700;letter-spacing:-.3px;font-variant-numeric:tabular-nums}
#clock svg{color:var(--accent)}
.icon-btn{width:42px;height:42px;border-radius:50%;background:var(--card);display:grid;place-items:center;box-shadow:var(--shadow);flex:none}
.btn{height:42px;border-radius:21px;padding:0 20px;font-weight:700;font-size:calc(15px * var(--fs));background:var(--card);box-shadow:var(--shadow);display:flex;align-items:center;gap:8px;flex:none}
.btn.primary{background:var(--accent);color:#fff}
.btn.danger{color:var(--accent)}
.btn:disabled{opacity:.45}

#main{position:absolute;left:var(--m);right:var(--m);top:calc(var(--m) + 54px);bottom:calc(var(--m) + var(--cal-h) + var(--gap));display:grid;grid-template-columns:var(--col-l) 1fr var(--col-r);gap:var(--gap)}
#floors{padding:calc(var(--pad) * .75);display:flex;flex-direction:column;gap:8px;overflow-y:auto;scrollbar-width:none}
#floors::-webkit-scrollbar{display:none}
#floors.compact .roof{height:34px}#floors.compact .roof svg{height:34px}
#floors.compact .floor-btn{height:58px;padding:9px 14px}#floors.compact .floor-btn .code{font-size:calc(19px * var(--fs))}
#floors.compact .floor-btn .name{margin-top:2px}#floors.compact .floor-btn .count{top:11px}
.roof{height:52px;display:flex;justify-content:center;align-items:flex-end;flex:none}
.floor-btn{position:relative;height:82px;border-radius:16px;background:var(--floor-off-bg);color:var(--floor-off-fg);text-align:left;padding:12px 14px;flex:none;transition:background .2s,color .2s}
.floor-btn .code{font-size:calc(22px * var(--fs));font-weight:800;letter-spacing:-.3px}
.floor-btn .name{font-size:calc(12.5px * var(--fs));color:var(--muted);margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.floor-btn .count{position:absolute;right:13px;top:15px;display:flex;align-items:center;gap:4px;font-size:calc(12.5px * var(--fs));font-weight:500;color:var(--muted)}
.floor-btn.active{background:var(--floor-on-bg);color:var(--floor-on-fg);box-shadow:var(--sh-floor-on)}
.floor-btn.active .name,.floor-btn.active .count{color:var(--floor-on-fg);opacity:.9}
.floor-sep{height:2px;background:var(--tile-2);margin:2px 4px;border-radius:1px;flex:none}
.floor-add{height:44px;border-radius:14px;border:2px dashed var(--soft);color:var(--muted);font-weight:600;font-size:calc(13px * var(--fs));display:flex;align-items:center;justify-content:center;gap:6px;flex:none}

#plan-card{position:relative;padding:calc(var(--pad) * 1.1) calc(var(--pad) * 1.25);display:flex;flex-direction:column;overflow:hidden;min-width:0}
#plan-head{display:flex;align-items:center;gap:10px;height:40px;flex:none}
#plan-title{font-size:calc(21px * var(--fs));font-weight:700;letter-spacing:-.3px;flex:1}
#all-off{width:40px;height:40px;border-radius:50%;background:var(--power-bg);color:var(--power-fg);display:grid;place-items:center}
#all-off:active{transform:scale(.94)}
#plan-wrap{flex:1;position:relative;margin-top:6px}
#plan{position:absolute}
#plan > svg.fp{position:absolute;inset:0;width:100%;height:100%}
:host([data-theme="dark"]) #plan.inv > svg.fp image{filter:invert(.92) hue-rotate(180deg)}
svg.fp{fill:var(--wall)}
.fp .f-wall{fill:var(--wall)}.fp .f-floor{fill:var(--floor)}.fp .f-out{fill:var(--outside)}.fp .f-door{fill:var(--door)}
.fp .s-wall{stroke:var(--wall)}.fp .s-floor{stroke:var(--floor)}.fp .s-out{stroke:var(--outside)}.fp .s-door{stroke:var(--door)}
.room-label{position:absolute;font-size:calc(var(--label-fs) * var(--k, 1) * var(--ps, 1));font-weight:600;color:var(--muted);white-space:nowrap;pointer-events:none}
.pin{position:absolute;min-width:var(--pin);height:var(--pin);transform:translate(-50%,-50%) scale(calc(var(--k, 1) * var(--ps, 1)));border-radius:calc(var(--pin) / 2);background:var(--pin-off-bg);color:var(--pin-off-fg);
  display:flex;align-items:center;justify-content:center;gap:4px;box-shadow:var(--sh-pin);transition:background .2s,color .2s,transform .12s;white-space:nowrap}
.pin:active{transform:translate(-50%,-50%) scale(calc(var(--k, 1) * var(--ps, 1) * .9))}
.pin svg.i{width:calc(var(--pin) * .5);height:calc(var(--pin) * .5)}
.pin.both svg.i{width:calc(var(--pin) * .42);height:calc(var(--pin) * .42)}
.pin.plain{background:var(--pin-val-bg);color:var(--pin-val-fg)}
.pin.val{padding:0 calc(var(--pin) * .3);font-size:var(--pin-fs);font-weight:700;letter-spacing:-.2px;font-variant-numeric:tabular-nums}
.pin.val.both{padding:0 calc(var(--pin) * .3) 0 calc(var(--pin) * .22)}
.pin.on{background:var(--pin-on-bg);color:var(--pin-on-fg);box-shadow:var(--sh-pin-on)}
.pin.cam{background:var(--pin-cam-bg);color:var(--pin-cam-fg)}
.pin.unavail{opacity:.4}
.pin{-webkit-touch-callout:none}
.pin.tapped{animation:tapped .35s ease-out}
@keyframes tapped{0%{filter:brightness(1.35)}100%{filter:none}}
.empty{position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:var(--muted);font-size:calc(14px * var(--fs));line-height:1.6;padding:20px}
.empty b{display:block;color:var(--text);font-size:calc(17px * var(--fs));margin-bottom:4px}

#right{display:flex;flex-direction:column;gap:var(--gap);min-height:0}
#weather{background:var(--weather-bg);color:var(--weather-fg);border-radius:var(--radius);padding:var(--pad) calc(var(--pad) * .875) calc(var(--pad) * .875);flex:none}
.w-now{display:flex;align-items:flex-start;padding:0 4px}
.w-temp{font-size:calc(50px * var(--fs));font-weight:800;letter-spacing:-2px;line-height:1}
.w-cond{margin-left:12px;margin-top:6px;font-size:calc(13px * var(--fs));color:var(--on-dark-muted);line-height:1.45;min-width:0}
.w-cond b{display:block;color:var(--weather-fg);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w-ico{margin-left:auto;color:var(--accent)}
.w-days{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:16px}
.w-day{background:var(--dark-2);border-radius:13px;padding:8px 0 9px;text-align:center;font-size:calc(12.5px * var(--fs))}
.w-day .d{font-weight:600;color:var(--on-dark-muted)}
.w-day svg{margin:6px auto 5px;color:var(--weather-fg)}
.w-day .t{white-space:nowrap}
.w-day .t b{font-weight:700}.w-day .t span{color:var(--on-dark-muted)}
.w-empty{color:var(--on-dark-muted);font-size:calc(13px * var(--fs));padding:8px 4px;line-height:1.5}

#waste{flex:1;padding:var(--pad) calc(var(--pad) * .875);min-height:0;overflow:hidden}
.sec-head{display:flex;align-items:center;gap:8px;font-size:calc(15.5px * var(--fs));font-weight:700;margin:0 4px 12px}
.sec-head svg{color:var(--accent)}
.bin{display:flex;align-items:center;gap:11px;padding:8px 10px;border-radius:15px;background:var(--tile);margin-bottom:7px}
.bin.soon{background:var(--soon-bg);color:var(--soon-fg)}
.bin.soon .d{color:var(--soon-fg);opacity:.7}
.bin-ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:#fff;flex:none}
.bin .n{font-size:calc(14px * var(--fs));font-weight:700}.bin .d{font-size:calc(11.5px * var(--fs));color:var(--muted);margin-top:2px}
.bin .b{margin-left:auto;font-size:calc(11.5px * var(--fs));font-weight:600;padding:5px 9px;border-radius:12px;background:var(--card);color:var(--muted);white-space:nowrap}
.bin.soon .b{background:var(--accent);color:#fff}
.muted-note{font-size:calc(12.5px * var(--fs));color:var(--muted);padding:0 4px;line-height:1.5}

#cal{position:absolute;left:var(--m);right:var(--m);bottom:var(--m);height:var(--cal-h);display:grid;grid-template-columns:calc(var(--col-l) - 14px) repeat(7,1fr);gap:8px;padding:calc(var(--pad) * .875) calc(var(--pad) * .75) calc(var(--pad) * .75) var(--pad)}
.cal-side{display:flex;flex-direction:column;min-width:0}
.cal-range{font-size:calc(14px * var(--fs));font-weight:700;margin-top:2px}
.cal-kw{font-size:calc(12px * var(--fs));color:var(--muted);margin-top:2px}
.cal-nav{display:flex;gap:8px;margin-top:12px}
.cal-nav button{width:34px;height:34px;border-radius:50%;background:var(--btn-bg);color:var(--btn-fg);display:grid;place-items:center}
.legend{margin-top:auto;display:flex;flex-wrap:wrap;gap:4px 12px;font-size:calc(12px * var(--fs))}
.legend span{display:flex;align-items:center;gap:5px}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;flex:none}
:host([data-theme="dark"]) .dot,:host([data-theme="dark"]) .ev::before,:host([data-theme="dark"]) .ev-pop .bar{box-shadow:0 0 0 1px rgba(255,255,255,.35)}
.day{background:var(--tile);border-radius:15px;padding:8px 6px 6px;min-width:0;display:flex;flex-direction:column;gap:5px;overflow:hidden}
.day.today{background:var(--today-bg);color:var(--today-fg)}
.day.today .day-h,.day.today .day-h b,.day.today .more{color:var(--today-fg)}
.day .ev,.day .chip{color:var(--text)}
.day.wk-start{box-shadow:inset 3px 0 0 var(--accent-soft)}
.wk-tag{float:right;font-size:calc(10px * var(--fs));font-weight:700;color:var(--accent);opacity:.8;margin-top:1px}
.day-b{display:contents}
.day-h{padding:0 5px 2px;font-size:calc(12px * var(--fs));color:var(--muted);font-weight:600}
.day-h b{color:var(--text);font-size:calc(15.5px * var(--fs));font-weight:800;margin-left:4px}
.ev{background:var(--card);border-radius:10px;padding:5px 7px 5px 12px;position:relative;text-align:left;width:100%;min-width:0;flex:none}
.ev::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:3px;border-radius:2px;background:var(--c)}
.ev .t{font-size:calc(10.5px * var(--fs));color:var(--muted);font-variant-numeric:tabular-nums}
.ev .n{font-size:calc(12px * var(--fs));font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chip{display:inline-flex;align-items:center;gap:5px;background:var(--card);border-radius:10px;padding:4px 8px;font-size:calc(11.5px * var(--fs));font-weight:700;align-self:flex-start;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none}
.more{font-size:calc(11px * var(--fs));font-weight:600;color:var(--muted);padding-left:6px;text-align:left}

/* ---------- Handy / Hochformat ---------- */
:host(.mobile){overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
:host(.mobile) #stage{position:relative;transform:none;width:auto;height:auto;padding:calc(var(--m) * .75);display:flex;flex-direction:column;gap:var(--gap);user-select:auto}
:host(.mobile) #top{position:static;height:40px;gap:8px}
:host(.mobile) #home{display:none}
:host(.mobile) #date{margin-left:4px;font-size:calc(17px * var(--fs));font-weight:600}
:host(.mobile) #clock{height:40px;padding:0 14px;font-size:calc(19px * var(--fs))}
:host(.mobile) #clock svg{width:17px;height:17px}
:host(.mobile) #main{position:static;display:flex;flex-direction:column;gap:var(--gap)}
:host(.mobile) #floors{flex-direction:row;overflow-x:auto;padding:6px;gap:6px}
:host(.mobile) #floors .roof,:host(.mobile) #floors .floor-sep,:host(.mobile) #floors .floor-add{display:none}
:host(.mobile) .floor-btn{flex:1 0 auto;min-width:86px;height:auto;padding:9px 12px;border-radius:14px}
:host(.mobile) .floor-btn .code{font-size:calc(18px * var(--fs))}
:host(.mobile) .floor-btn .name{margin-top:1px;font-size:calc(11.5px * var(--fs))}
:host(.mobile) .floor-btn .count{top:10px;right:10px}
:host(.mobile) #plan-card{padding:calc(var(--pad) * .75)}
:host(.mobile) #plan-head{height:34px}
:host(.mobile) #plan-title{font-size:calc(18px * var(--fs))}
:host(.mobile) #plan-wrap{flex:none;margin-top:4px}
:host(.mobile) #right{display:flex;flex-direction:column;gap:var(--gap)}
:host(.mobile) #waste{flex:none;overflow:visible}
:host(.mobile) #cal{position:static;height:auto;display:flex;flex-direction:column;gap:6px;padding:var(--pad)}
:host(.mobile) .cal-side{display:grid;grid-template-columns:1fr auto;align-items:center;column-gap:10px;margin-bottom:4px}
:host(.mobile) .cal-side .sec-head{grid-column:1/-1}
:host(.mobile) .cal-nav{grid-column:2;grid-row:2/4;margin:0}
:host(.mobile) .legend{grid-column:1/-1;margin-top:8px}
:host(.mobile) .day{flex-direction:row;align-items:flex-start;gap:8px;padding:8px 10px;overflow:visible}
:host(.mobile) .day-h{width:62px;flex:none;padding:4px 0 0}
:host(.mobile) .day-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}
:host(.mobile) .day-h b{margin-left:3px}
:host(.mobile) .wk-tag{float:none;display:block;margin:2px 0 0}
:host(.mobile) .day .ev{width:100%}
:host(.mobile) .day .chip{align-self:flex-start}
:host(.mobile) .day .more{align-self:flex-start;padding-left:2px}
:host(.mobile) .day.none{background:transparent;padding:2px 10px;opacity:.6}
:host(.mobile) .day.none .day-h{padding:0}
:host(.mobile) .day.none.today{background:var(--today-bg);opacity:1}
:host(.mobile) .day.wk-start{box-shadow:inset 0 2px 0 var(--accent-soft)}
:host(.mobile) #overlay{position:fixed}
:host(.mobile) .pop,:host(.mobile) .pop.wide{width:calc(100vw / var(--z, 1) - 24px);max-width:520px;max-height:calc(100vh - 40px)}
#overlay{position:absolute;inset:0;background:var(--overlay);display:none;align-items:center;justify-content:center;z-index:10}
#overlay.show{display:flex}
.pop{background:var(--card);border-radius:26px;width:460px;max-height:740px;overflow:auto;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.pop.wide{width:720px}
.pop-h{display:flex;align-items:center;gap:14px}
.pop-ico{width:48px;height:48px;border-radius:13px;background:var(--tile);display:grid;place-items:center;flex:none}
.pop-ico.on{background:var(--accent);color:#fff}.pop-ico.cam{background:var(--dark);color:#fff}
.pop-sub{font-size:calc(12.5px * var(--fs));font-weight:600;color:var(--muted)}
.pop-title{font-size:calc(22px * var(--fs));font-weight:800;letter-spacing:-.4px;margin-top:2px}
.pop-x{margin-left:auto;width:42px;height:42px;border-radius:50%;background:var(--btn-bg);color:var(--btn-fg);display:grid;place-items:center;flex:none;align-self:flex-start}
.pop-state{display:flex;align-items:center;margin-top:22px;gap:12px}
.pop-state .big{font-size:calc(42px * var(--fs));font-weight:800;letter-spacing:-1.5px;line-height:1}
.pop-state .s{font-size:calc(13.5px * var(--fs));color:var(--muted);margin-top:6px}
.toggle{margin-left:auto;width:66px;height:38px;border-radius:19px;background:var(--toggle-off);position:relative;transition:background .2s;flex:none}
.toggle::after{content:"";position:absolute;left:4px;top:4px;width:30px;height:30px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2);transition:transform .2s}
.toggle.on{background:var(--toggle-on)}.toggle.on::after{transform:translateX(28px)}
.panel{background:var(--tile);border-radius:16px;padding:14px 16px;margin-top:16px}
.panel-h{display:flex;justify-content:space-between;font-size:calc(13.5px * var(--fs));font-weight:700}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:28px;background:transparent;margin-top:6px}
input[type=range]::-webkit-slider-runnable-track{height:8px;border-radius:4px;background:linear-gradient(90deg,var(--accent) var(--p),var(--card) var(--p));box-shadow:inset 0 0 0 1px var(--soft)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--accent);margin-top:-8px;border:3px solid var(--card)}
input[type=range]::-moz-range-track{height:8px;border-radius:4px;background:linear-gradient(90deg,var(--accent) var(--p),var(--card) var(--p))}
input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--accent);border:3px solid var(--card)}
input.hue::-webkit-slider-runnable-track{background:linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);box-shadow:none}
input.hue::-moz-range-track{background:linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)}
input.ct::-webkit-slider-runnable-track{background:linear-gradient(90deg,#ffb35c,#fff4e0,#cfe4ff);box-shadow:inset 0 0 0 1px var(--soft)}
input.ct::-moz-range-track{background:linear-gradient(90deg,#ffb35c,#fff4e0,#cfe4ff)}
input.hue::-webkit-slider-thumb,input.ct::-webkit-slider-thumb{background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4)}
.swatches{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.lsw{width:34px;height:34px;border-radius:50%;background:var(--c);box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
.lsw.warm{background:#ffc47a}.lsw.cold{background:#dfeaff}
.lsw:active{transform:scale(.9)}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}
.tiles .panel{margin-top:0}
.tiles .l{font-size:calc(12.5px * var(--fs));color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tiles .v{font-size:calc(22px * var(--fs));font-weight:800;margin-top:6px;letter-spacing:-.4px}
.stepper{display:flex;align-items:center;gap:14px;margin-left:auto}
.stepper button{width:44px;height:44px;border-radius:50%;background:var(--btn-bg);color:var(--btn-fg);display:grid;place-items:center}
.modes{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.modes button{flex:1 1 calc(50% - 4px);height:40px;border-radius:12px;background:var(--card);font-size:calc(13.5px * var(--fs));font-weight:600}
.modes button.sel{background:var(--btn-sel-bg);color:var(--btn-sel-fg)}
.cam-box{margin-top:16px;aspect-ratio:16/9;border-radius:16px;background:#111;overflow:hidden;display:grid;place-items:center;color:#8a8580;font-size:calc(13px * var(--fs))}
.cam-box img{width:100%;height:100%;object-fit:contain;display:block}
.cam-box .cam-card{display:block;width:100%;height:100%}
.cam-box .cam-card{--ha-card-border-radius:0;--ha-card-box-shadow:none;--ha-card-border-width:0}
.cam-wait{color:#8a8580}
.cam-foot{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:calc(13px * var(--fs));color:var(--muted)}
.cam-foot #cam-status{display:flex;align-items:center;gap:6px;flex:1}
.cam-foot .sbtn{margin-left:auto}
.ev-pop .bar{width:5px;align-self:stretch;border-radius:3px;background:var(--c);flex:none}
.ev-row{display:flex;gap:14px;margin-top:18px;align-items:flex-start}
.ev-row svg{color:var(--muted);margin-top:2px}
.ev-row b{display:block;font-size:calc(16px * var(--fs));font-weight:700}.ev-row span{font-size:calc(13.5px * var(--fs));color:var(--muted);display:block;margin-top:3px}
.note{font-size:calc(14.5px * var(--fs));line-height:1.5;white-space:pre-wrap;word-break:break-word}
#toast{position:absolute;left:50%;bottom:232px;transform:translateX(-50%);background:var(--dark);color:#fff;padding:11px 18px;border-radius:14px;font-size:calc(14px * var(--fs));font-weight:600;opacity:0;transition:opacity .25s;pointer-events:none;z-index:20;white-space:nowrap}
#toast.show{opacity:1}

/* ---------- CSS-Fenster ---------- */
#css-win{position:absolute;right:var(--m);bottom:var(--m);width:600px;height:460px;z-index:30;display:flex;flex-direction:column;
  box-shadow:0 18px 50px rgba(0,0,0,.28);overflow:hidden;font-size:13px;border-radius:18px}
#css-win[hidden]{display:none}
#css-win.min{height:auto}
#css-win.min .cw-body,#css-win.min .cw-foot{display:none}
.cw-head{display:flex;align-items:center;gap:8px;padding:10px 10px 10px 14px;background:var(--tile);cursor:move;touch-action:none;flex:none}
.cw-head b{font-size:14px;margin-right:auto}
.cw-tabs{display:flex;gap:4px;padding:8px 10px 0;flex:none}
.cw-tabs button{height:30px;padding:0 12px;border-radius:9px;font-size:12.5px;font-weight:600;color:var(--muted);background:var(--tile)}
.cw-tabs button.sel{background:var(--accent);color:#fff}
.cw-body{flex:1;padding:8px 10px;min-height:0;display:flex}
.cw-body textarea,.cw-body pre{flex:1;width:100%;resize:none;border:1.5px solid var(--tile-2);border-radius:10px;background:var(--bg);color:var(--text);
  font:12.5px/1.55 ui-monospace,"SF Mono",Menlo,Consolas,monospace;padding:10px 12px;outline:none;tab-size:2;white-space:pre;overflow:auto;user-select:text;-webkit-user-select:text}
.cw-body textarea:focus{border-color:var(--accent)}
.cw-foot{padding:0 12px 10px;color:var(--muted);font-size:12px;flex:none}

/* ---------- Editor ---------- */
.edit #main{grid-template-columns:var(--col-l) 1fr 360px}
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
.cgroup{border-top:1px solid var(--tile-2);padding:6px 0}
.cgroup summary{cursor:pointer;font-size:13.5px;font-weight:700;padding:6px 0;list-style:none;display:flex;align-items:center;gap:6px}
.cgroup summary::before{content:"›";display:inline-block;width:12px;transition:transform .15s;color:var(--muted)}
.cgroup[open] summary::before{transform:rotate(90deg)}
.cpop{background:var(--tile);border-radius:14px;padding:10px;margin:2px 0 10px}
.cpop .inp{background:var(--card)}
.cprev{width:32px;height:32px;border-radius:9px;flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
.cp-hex{flex:1;min-width:0;font-family:ui-monospace,Menlo,monospace}
.cp-hex.bad{box-shadow:0 0 0 2px var(--accent)}
.cp-h{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin:10px 0 6px}
.lnk{color:var(--accent);font-weight:700;font-size:11.5px;background:none;border:0;padding:0}
.sws{display:flex;flex-wrap:wrap;gap:6px}
.sw{width:30px;height:30px;border-radius:8px;border:0;background:var(--c);box-shadow:inset 0 0 0 1px rgba(0,0,0,.14);display:grid;place-items:center;color:#fff;padding:0}
.sw.cur{box-shadow:0 0 0 2px var(--card),0 0 0 4px var(--text)}
.sw svg{filter:drop-shadow(0 0 2px rgba(0,0,0,.8))}
.sw.add{background:transparent;box-shadow:inset 0 0 0 1.5px var(--soft);color:var(--muted)}
.sw.add svg{filter:none}
.crow{margin-bottom:6px}.crow .cl{flex:1;font-size:13px}.crow .cv{font:11.5px ui-monospace,Menlo,monospace;color:var(--muted);width:62px;text-align:right}
.crow .cx{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;color:var(--muted);flex:none}
.crow button.cx{background:var(--tile)}
.sx{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;color:var(--muted);background:var(--tile);flex:none}
.icon-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.icon-grid button{height:38px;border-radius:10px;background:var(--tile);display:grid;place-items:center}
.icon-grid button.sel{background:var(--accent);color:#fff}
.icon-group{margin-top:6px;border-radius:10px}
.icon-group summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--muted);padding:6px 2px}
.icon-group summary::-webkit-details-marker{display:none}
.icon-group summary::before{content:"›";display:inline-block;width:10px;transition:transform .15s;font-size:15px}
.icon-group[open] summary::before{transform:rotate(90deg)}
.icon-group summary span{margin-left:auto;font-weight:600;opacity:.7}
.icon-group .icon-grid{margin:2px 0 6px}
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
    this._timers.forEach((t) => clearInterval(t)); clearTimeout(this._clockT);
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
    this.shadowRoot.innerHTML = `<style>${CSS}</style><style id="theme-vars"></style><style id="custom-css"></style>
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
        <div class="card" id="css-win" hidden></div>
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
    this._scheduleClock();
    this._timers.push(setInterval(() => this._fetchEvents(), 10 * 60000));
    this._ready = true;
    this._initing = false;
    this._migrateStartDash();
  }
  /* 0.6.1 legte ein Weiterleitungs-Dashboard „hauspanel-start“ an. Seit 0.6.2 wird das Panel direkt als Startseite
     eingetragen – das alte Dashboard (bei manchen Geräten mit „Konfigurationsfehler“) hier einmalig aufräumen. */
  async _migrateStartDash() {
    if (!this._hass || !this._hass.user || !this._hass.user.is_admin) return;
    try {
      const list = await this._hass.callWS({ type: "lovelace/dashboards/list" });
      const old = list.find((d) => d.url_path === "hauspanel-start");
      if (!old) return;
      for (const [get, set] of [["frontend/get_user_data", "frontend/set_user_data"], ["frontend/get_system_data", "frontend/set_system_data"]]) {
        try {
          const cur = ((await this._hass.callWS({ type: get, key: "core" })) || {}).value || {};
          if (cur.default_panel === "hauspanel-start") await this._hass.callWS({ type: set, key: "core", value: { ...cur, default_panel: "hauspanel" } });
        } catch (e) { /* weiter */ }
      }
      await this._hass.callWS({ type: "lovelace/dashboards/delete", dashboard_id: old.id });
      this._toast("Altes Startseiten-Dashboard entfernt – Hauspanel ist direkt als Startseite eingetragen");
    } catch (e) { console.warn("Hauspanel: Aufräumen", e); }
  }

  /* Uhr genau zum Minutenwechsel aktualisieren (nicht nur alle 15 s) */
  _scheduleClock() {
    clearTimeout(this._clockT);
    this._clockT = setTimeout(() => { if (!this.isConnected) return; this._tick(); this._scheduleClock(); }, 60000 - (Date.now() % 60000) + 30);
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
    // Handy (und Tablet) im Hochformat: eigenes, scrollbares Layout statt skalierter Bühne
    const mobile = !this.editing && w < 820 && h > w * 1.15;
    if (mobile !== !!this._mobile) {
      this._mobile = mobile;
      this.classList.toggle("mobile", mobile);
      if (this._ready) { this._renderTop(); this._renderCal(); this._tick(); }
    }
    if (mobile) {
      const z = clamp(w / MOBILE_W, 0.85, 1.9);
      this._scale = 1;
      st.style.width = ""; st.style.height = ""; st.style.transform = "";
      st.style.zoom = z; st.style.setProperty("--z", z);
      this._layoutPlan(); this._fitWaste(); this._fitCal();
      return;
    }
    st.style.zoom = ""; st.style.removeProperty("--z");
    // Skalierung nach Breite (bzw. Mindesthöhe), die Bühne füllt immer die ganze Fläche:
    // oben ausgerichtet, Grundriss-Bereich wächst in Höhe und Breite mit.
    const s = Math.min(w / STAGE_W, h / STAGE_MIN_H);
    this._scale = s;
    st.style.width = w / s + "px";
    st.style.height = h / s + "px";
    st.style.transform = `scale(${s})`;
    this._layoutPlan();
    this._fitWaste();
    this._fitCal();
  }

  _onConfig(msg) {
    const cfgChanged = JSON.stringify(msg.config) !== JSON.stringify(this.cfg);
    this.cfg = msg.config; this.plans = msg.plans || {};
    if (this.mode === "edit") { // Entwurf nicht überschreiben, aber auf externe Änderungen hinweisen
      if (cfgChanged && this.draft && !this._saving && (msg.config._rev || 0) !== (this.draft._rev || 0))
        this._toast("Das Layout wurde gerade woanders geändert – zum Übernehmen Bearbeiten abbrechen");
      return;
    }
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
  _applyThemeVars() { const el = this.$("#theme-vars"); if (el && this.C) el.textContent = themeCss(this.C.theme); this._applyCustomCss(); }
  /* Eigenes CSS: global + das der gerade offenen Etage. ?nocss in der URL schaltet es ab (Notfall). */
  _applyCustomCss() {
    const el = this.$ && this.$("#custom-css"); if (!el || !this.C) return;
    if (/[?&]nocss\b/.test(location.search)) { el.textContent = ""; return; }
    const f = this._floor();
    el.textContent = (this.C.css || "") + "\n" + ((f && f.css) || "");
  }
  get P() { return this.mode === "edit" ? this.draftPlans : this.plans; }
  _floor() { return (this.C.floors || []).find((f) => f.id === this.activeFloor); }

  /* ---------- Live-Updates aus HA ---------- */
  _watched() {
    const ids = new Set();
    const c = this.C; if (!c) return ids;
    (c.floors || []).forEach((f) => (f.pins || []).forEach((p) => { ids.add(p.entity_id); if (p.state_entity) ids.add(p.state_entity); (p.extras || []).forEach((x) => x && ids.add(x)); }));
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
    this._fit();
    this.shadowRoot.host.classList.toggle("edit", this.editing);
    this.$("#stage").classList.toggle("edit", this.editing);
    this._applyThemeVars();
    this._applyTheme();
    this._renderTop(); this._renderFloors(); this._renderPlan(); this._renderRight();
    this._renderCal();
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
    const d = this.$("#date-txt"); if (d) d.textContent = this._mobile ? `${DAYS_LONG[n.getDay()]}, ${n.getDate()}. ${MONTHS[n.getMonth()]}` : `${DAYS_LONG[n.getDay()]}, ${n.getDate()}. ${MONTHS[n.getMonth()]} ${n.getFullYear()}`;
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
      ${admin && !this.kiosk && !this.preview && !this._mobile ? `<button class="icon-btn" data-a="edit" aria-label="Bearbeiten" title="Bearbeiten">${ic("pencil", 18)}</button>` : ""}
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
    this.setAttribute("data-floor", f.code || ""); this._applyCustomCss();
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
      h += `<div class="room-label${edit && this.sel && this.sel.type === "room" && this.sel.id === r.id ? " sel" : ""}" data-room="${r.id}" data-room-name="${esc(r.name)}" style="left:${r.x}%;top:${r.y}%${scaleVar(r)}">${esc(r.name)}</div>`;
    });
    (f.pins || []).forEach((p) => {
      const s = this._hass.states[p.entity_id];
      h += `<button class="pin${edit && this.sel && this.sel.type === "pin" && this.sel.id === p.id ? " sel" : ""}" data-pin="${p.id}" data-entity="${esc(p.entity_id)}" data-domain="${domainOf(p.entity_id)}" style="left:${p.x}%;top:${p.y}%${scaleVar(p)}" title="${esc(p.name || friendly(this._hass, p.entity_id))}">${this._pinInner(p, s)}</button>`;
    });
    plan.innerHTML = h;
    plan.classList.toggle("inv", !!f.raster && f.recolor !== false);
    this._layoutPlan(); this._updatePins();
  }

  _layoutPlan() {
    const wrap = this.$ && this.$("#plan-wrap"), plan = this.$ && this.$("#plan");
    const f = this.C && this._floor();
    if (!wrap || !plan || !f || !this._aspect || (!this._planFor(f) && !this.editing)) return;
    if (this._mobile) wrap.style.height = Math.round(wrap.clientWidth / this._aspect) + "px"; else wrap.style.height = "";
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
  /* An/aus eines Pins – optional von einer anderen Entity übernommen (z. B. Kamera + „Camera enabled“) */
  _pinOn(p, s) {
    if (p.state_entity) return isActive(this._hass.states[p.state_entity]);
    return pinActive(p, s);
  }
  _camOff(p) { return domainOf(p.entity_id) === "camera" && p.state_entity && !isActive(this._hass.states[p.state_entity]); }
  _pinInner(p, s) {
    const mode = p.display || "icon";
    const icon = ic(this._camOff(p) && !p.icon ? "video-off" : p.icon || defaultIcon(s, p.entity_id), mode === "both" ? 15 : 18);
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
      const camOff = this._camOff(p);
      if (d === "camera" && el.dataset.camoff !== String(camOff)) { el.dataset.camoff = String(camOff); el.innerHTML = this._pinInner(p, s); }
      el.classList.toggle("on", (d !== "camera" || !!p.state_entity) && this._pinOn(p, s));
      el.classList.toggle("plain", !pinStatusful(p) && !p.state_entity && d !== "camera");
      el.classList.toggle("cam", d === "camera" && !p.state_entity);
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
      if (this._mobile) return;
      const limit = el.getBoundingClientRect().bottom - 4;
      bins.forEach((b) => { if (b.getBoundingClientRect().bottom > limit) b.style.display = "none"; });
    });
  }

  /* ---------- Kalender ---------- */
  async _fetchEvents() {
    if (!this.C) return;
    const cals = (this.C.calendars || []).filter((c) => c.entity_id && this._hass.states[c.entity_id]);
    const req = ++this._evReq;
    if (!cals.length) { this.events = []; this._renderCal(); return; }
    const mon = calStart(this.C.cal_mode, this.weekOffset);
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
  async _setStart(scope) {
    const sys = scope === "system";
    try {
      const get = sys ? "frontend/get_system_data" : "frontend/get_user_data", set = sys ? "frontend/set_system_data" : "frontend/set_user_data";
      const cur = ((await this._hass.callWS({ type: get, key: "core" })) || {}).value || {};
      await this._hass.callWS({ type: set, key: "core", value: { ...cur, default_panel: "hauspanel" } });
      // früheres Weiterleitungs-Dashboard aufräumen
      let cleaned = false;
      try {
        const list = await this._hass.callWS({ type: "lovelace/dashboards/list" });
        const old = list.find((d) => d.url_path === "hauspanel-start");
        if (old) { await this._hass.callWS({ type: "lovelace/dashboards/delete", dashboard_id: old.id }); cleaned = true; }
      } catch (e) { /* egal */ }
      this._toast((sys ? "Hauspanel ist jetzt Startseite für alle" : "Hauspanel ist jetzt deine Startseite") + (cleaned ? " – altes Weiterleitungs-Dashboard entfernt" : ""));
    } catch (e) { this._toast("Ging nicht: " + (e.message || e.code || e)); }
  }
  _calSoon() { clearTimeout(this._calT); this._calT = setTimeout(() => this._fetchEvents(), 400); }
  _renderCal() {
    const el = this.$("#cal"); if (!el || !this.C) return;
    const mon = calStart(this.C.cal_mode, this.weekOffset), sun = addDays(mon, 6), today = new Date();
    const kwTxt = kw(mon) === kw(sun) ? `KW ${kw(mon)}` : `KW ${kw(mon)} / ${kw(sun)}`;
    const cals = this.C.calendars || [];
    let h = `<div class="cal-side"><div class="sec-head" style="margin:0 0 8px">${ic("calendar", 18)}Termine</div>
      <div class="cal-range">${fmtShort(mon)} – ${fmtShort(sun)}${sun.getFullYear()}</div><div class="cal-kw">${kwTxt}</div>
      <div class="cal-nav"><button data-wk="-1" aria-label="7 Tage zurück">${ic("chevron-left", 18)}</button>${this.weekOffset ? `<button data-wk="0" aria-label="Diese Woche">${ic("circle-dot", 16)}</button>` : ""}<button data-wk="1" aria-label="7 Tage weiter">${ic("chevron-right", 18)}</button></div>
      <div class="legend">${cals.map((c) => `<span><i class="dot" style="background:${esc(c.color)}"></i>${esc(c.name || friendly(this._hass, c.entity_id))}</span>`).join("")}</div></div>`;
    const waste = this._wasteList();
    for (let i = 0; i < 7; i++) {
      const day = addDays(mon, i), dayEnd = addDays(day, 1);
      const items = [];
      waste.forEach((x) => { if (sameDay(x.d, day)) items.push(`<span class="chip"><i class="dot" style="background:${esc(x.w.color)}"></i>${esc(x.w.name)}</span>`); });
      this.events.forEach((e, idx) => {
        if (!(e.start < dayEnd && e.end > day) && !sameDay(e.start, day)) return;
        if (e.allDay) items.push(`<button class="chip" data-ev="${idx}"><i class="dot" style="background:${esc(e.cal.color)}"></i>${esc(e.summary)}</button>`);
        else items.push(`<button class="ev" data-ev="${idx}" style="--c:${esc(e.cal.color)}"><div class="t">${e.start >= day ? hhmm(e.start) : "Fortsetzung"}</div><div class="n">${esc(e.summary)}</div></button>`);
      });
      const body = items.join("") + `<button class="more" data-day="${i}" hidden></button>`;
      const wkStart = i > 0 && day.getDay() === 1; // neue Woche beginnt mitten in der Leiste -> markieren
      h += `<div class="day${sameDay(day, today) ? " today" : ""}${wkStart ? " wk-start" : ""}${items.length ? "" : " none"}"><div class="day-h">${DAYS[day.getDay()]}<b>${day.getDate()}.</b>${wkStart ? `<span class="wk-tag">KW ${kw(day)}</span>` : ""}</div><div class="day-b">${body}</div></div>`;
    }
    el.innerHTML = h;
    this._fitCal();
  }
  /* Pro Tag so viele Einträge zeigen, wie hineinpassen – erst dann „+N weitere“ */
  _fitCal() {
    requestAnimationFrame(() => {
      const el = this.$("#cal"); if (!el) return;
      el.querySelectorAll(".day").forEach((day) => {
        const items = [...day.querySelectorAll(".day-b > :not(.more)")], more = day.querySelector(".more");
        items.forEach((x) => { x.style.display = ""; });
        if (!more) return;
        more.hidden = true;
        if (this._mobile || !items.length) return;
        const limit = day.getBoundingClientRect().bottom - 4;
        if (items[items.length - 1].getBoundingClientRect().bottom <= limit) return;
        more.hidden = false;
        let shown = items.length;
        do { shown--; items[shown].style.display = "none"; more.textContent = `+${items.length - shown} weitere`; }
        while (shown > 0 && more.getBoundingClientRect().bottom > limit);
      });
    });
  }

  /* ---------- Popups ---------- */
  _showPop(html, wide) {
    const dom = this.popup && this.popup.type === "entity" ? domainOf(((this._floor() || {}).pins || []).find((x) => x.id === this.popup.pin)?.entity_id || "") : (this.popup && this.popup.type) || "";
    this.$("#pop").innerHTML = `<div class="pop${wide ? " wide" : ""}" data-domain="${esc(dom)}">${html}</div>`;
    this.$("#overlay").classList.add("show");
  }
  _closePop() { this._stopCamera(); this.$("#overlay").classList.remove("show"); this.popup = null; }
  _stopCamera() {
    const img = this.$ && this.$("#cam-img"); if (img) img.src = "";
    if (this._camCard) { try { this._camCard.remove(); } catch (e) { /* egal */ } }
    this._camCard = null; this._camFor = null; clearInterval(this._camSnapT);
  }
  _camStatus(p) {
    const el = this.$("#cam-status"); if (!el) return;
    if (!p.state_entity) { el.textContent = ""; return; }
    const on = isActive(this._hass.states[p.state_entity]);
    el.innerHTML = `<i class="dot" style="background:${on ? "#3E9B5C" : "var(--muted)"}"></i>${on ? "Kamera an" : "Kamera aus"}`;
  }
  /* HA-eigene Bildkarte im Live-Modus: wählt selbst WebRTC, HLS oder MJPEG – funktioniert auch mit Cloud-/Akkukameras.
     Gibt es die Kartenhelfer nicht, wird ein regelmäßig aktualisiertes Standbild gezeigt. */
  /* Kartenhelfer gibt es erst, wenn HA das Lovelace-Modul geladen hat. Ist Hauspanel die Startseite, ist das noch nicht passiert –
     dann das Modul über HAs eigenen Panel-Lader nachladen (gleicher Weg, den HA beim Öffnen eines Dashboards nimmt). */
  async _ensureCardHelpers() {
    if (window.loadCardHelpers) return;
    try {
      await Promise.race([customElements.whenDefined("partial-panel-resolver"), new Promise((r) => setTimeout(r, 2000))]);
      const ppr = document.createElement("partial-panel-resolver");
      ppr.hass = { panels: [{ url_path: "tmp", component_name: "lovelace" }] };
      ppr._updateRoutes();
      await ppr.routerOptions.routes.tmp.load();
      for (let i = 0; i < 20 && !window.loadCardHelpers; i++) await new Promise((r) => setTimeout(r, 100));
    } catch (e) { /* bleibt beim Standbild */ }
  }
  async _mountCamera(id, a, name) {
    const box = this.$("#cam-box"); if (!box) return;
    const forId = this._camFor;
    try {
      await this._ensureCardHelpers();
      if (!window.loadCardHelpers) throw new Error("keine Kartenhelfer");
      const helpers = await window.loadCardHelpers();
      if (this._camFor !== forId || !this.$("#cam-box")) return;
      const card = await helpers.createCardElement({ type: "picture-entity", entity: id, camera_view: "live", show_name: false, show_state: false, tap_action: { action: "none" }, hold_action: { action: "none" } });
      card.hass = this._hass;
      card.classList.add("cam-card");
      box.innerHTML = ""; box.appendChild(card);
      this._camCard = card;
    } catch (e) {
      this._mountSnapshot(id, name);
    }
  }
  _mountSnapshot(id, name) {
    const box = this.$("#cam-box"); if (!box) return;
    {
      const snap = () => { const u = this._hass.states[id] && this._hass.states[id].attributes.entity_picture; return u ? u + (u.includes("?") ? "&" : "?") + "t=" + Date.now() : ""; };
      box.innerHTML = `<img id="cam-img" alt="${esc(name)}" src="${esc(snap())}">`;
      const img0 = this.$("#cam-img");
      if (img0) img0.onerror = () => { if (!img0.dataset.ok) box.innerHTML = `<div class="cam-wait">Die Kamera liefert gerade kein Bild an Home Assistant.</div>`; };
      if (img0) img0.onload = () => { img0.dataset.ok = "1"; };
      this._camSnapT = setInterval(() => { const img = this.$("#cam-img"); if (img) img.src = snap(); else clearInterval(this._camSnapT); }, 3000);
    }
  }
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
    const icon = p.icon || defaultIcon(s, id), on = pinActive(p, s);
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
      if (!unavail && (supportsColor(s) || supportsColorTemp(s))) {
        const hs = a.hs_color || [0, 0], isTemp = a.color_mode === "color_temp";
        const kMin = a.min_color_temp_kelvin || 2000, kMax = a.max_color_temp_kelvin || 6500, k = a.color_temp_kelvin || Math.round((kMin + kMax) / 2);
        h += `<div class="panel">`;
        if (supportsColor(s)) h += `<div class="panel-h"><span>Farbe</span><span id="hval">${on && !isTemp ? Math.round(hs[0]) + "°" : ""}</span></div>
          <input type="range" class="hue" min="0" max="359" value="${Math.round(hs[0])}" id="hue" aria-label="Farbton">
          <div class="swatches">${LIGHT_PRESETS.map(([hh, ss]) => `<button class="lsw" data-a="light-hs" data-h="${hh}" data-s="${ss}" style="--c:hsl(${hh},${ss}%,55%)" aria-label="Farbe"></button>`).join("")}
            ${supportsColorTemp(s) ? `<button class="lsw warm" data-a="light-k" data-k="${kMin + Math.round((kMax - kMin) * 0.1)}" aria-label="Warmweiß"></button><button class="lsw cold" data-a="light-k" data-k="${kMax}" aria-label="Kaltweiß"></button>` : ""}</div>`;
        if (supportsColorTemp(s)) h += `<div class="panel-h" style="margin-top:${supportsColor(s) ? 14 : 0}px"><span>Weißton</span><span id="kval">${on && isTemp ? k + " K" : ""}</span></div>
          <input type="range" class="ct" min="${kMin}" max="${kMax}" step="50" value="${k}" id="ctemp" aria-label="Farbtemperatur">`;
        h += `</div>`;
      }
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
      // läuft schon -> nur hass weiterreichen, nicht neu aufbauen (sonst startet der Stream ständig neu)
      if (this._camCard && this._camFor === p.id && this.$("#cam-box")) { this._camCard.hass = this._hass; this._camStatus(p); return; }
      h += `<div class="cam-box" id="cam-box">${unavail ? "Kamera nicht erreichbar" : `<div class="cam-wait">Verbinde mit Kamera …</div>`}</div>
        <div class="cam-foot"><span id="cam-status"></span><button class="sbtn" data-a="cam-more">${ic("maximize-2", 15)}In Home Assistant öffnen</button></div>`;
      this._showPop(h, true);
      this._camFor = p.id;
      this._camStatus(p);
      if (!unavail) { if (p.cam_view === "snapshot") this._mountSnapshot(id, name); else this._mountCamera(id, a, name); }
      return;
    } else {
      h += `<div class="pop-state"><div><div class="big">${esc(fmtState(s))}</div><div class="s">${s.last_changed ? "seit " + hhmm(new Date(s.last_changed)) + " Uhr" : ""}</div></div></div>`;
    }
    h += this._extrasHtml(p);
    this._showPop(h);
    const hue = this.$("#hue"), ct = this.$("#ctemp");
    if (hue) {
      hue.addEventListener("pointerdown", () => { this._sliding = true; });
      hue.addEventListener("input", () => { this.$("#hval").textContent = hue.value + "°"; });
      hue.addEventListener("change", () => { this._sliding = false; this._hass.callService("light", "turn_on", { entity_id: id, hs_color: [Number(hue.value), 100] }); });
    }
    if (ct) {
      ct.addEventListener("pointerdown", () => { this._sliding = true; });
      ct.addEventListener("input", () => { this.$("#kval").textContent = ct.value + " K"; });
      ct.addEventListener("change", () => { this._sliding = false; this._hass.callService("light", "turn_on", { entity_id: id, color_temp_kelvin: Number(ct.value) }); });
    }
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
    const mon = calStart(this.C.cal_mode, this.weekOffset), day = addDays(mon, i), dayEnd = addDays(day, 1);
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
    if (this.editing && t.matches && t.matches('input[type="color"]')) {
      ev.preventDefault();
      if (this._cp && this._cp.input === t) this._closeColorPop(); else this._colorPop(t);
      return;
    }
    const cpb = t.closest("[data-a^='cp-']");
    if (cpb) return this._colorPopAction(cpb);
    const isum = t.closest(".icon-group summary");
    if (isum) { const d = isum.parentElement; this._iconOpen = this._iconOpen || new Set();
      if (d.open) this._iconOpen.delete(d.dataset.igroup); else this._iconOpen.add(d.dataset.igroup); return; }
    const sum = t.closest(".cgroup summary");
    if (sum) { const d = sum.parentElement; this._openGroups = this._openGroups || new Set();
      if (d.dataset.group) { if (d.open) this._openGroups.delete(d.dataset.group); else this._openGroups.add(d.dataset.group); } return; }
    const fl = t.closest("[data-floor]");
    if (fl) { this.activeFloor = fl.dataset.floor; this.sel = null; if (this.editing && this.tab === "select") this.tab = "floor";
      this._renderFloors(); this._renderPlan(); if (this.editing) this._renderInspector(); if (this.cssOpen) this._renderCssWin(); return; }
    const wk = t.closest("[data-wk]");
    if (wk) { const v = Number(wk.dataset.wk); this.weekOffset = v === 0 ? 0 : this.weekOffset + v; this.events = []; this._renderCal(); this._fetchEvents(); return; }
    const evb = t.closest("[data-ev]");
    if (evb) { this._openEvent(this.events[Number(evb.dataset.ev)]); return; }
    const dayb = t.closest("[data-day]");
    if (dayb) { this._openDay(Number(dayb.dataset.day)); return; }
    const pin = t.closest(".pin");
    if (pin && this.viewing) {
      const pp = this._pinById(pin.dataset.pin);
      if (pp && pp.toggle && TOGGLE_DOMAINS.has(domainOf(pp.entity_id))) { this._togglePin(pp, pin); return; }
      this._openPin(pin.dataset.pin); return;
    }
    const b = t.closest("[data-a]");
    if (!b) return;
    const a = b.dataset.a;
    if (this.popup && ["light-hs", "light-k"].includes(a)) {
      const f = this._floor(), p = f && (f.pins || []).find((x) => x.id === this.popup.pin); if (!p) return;
      const data = a === "light-hs" ? { hs_color: [Number(b.dataset.h), Number(b.dataset.s)] } : { color_temp_kelvin: Number(b.dataset.k) };
      this._hass.callService("light", "turn_on", { entity_id: p.entity_id, ...data });
      return;
    }
    if (this.popup && ["toggle","temp","mode","svc","media"].includes(a)) return this._popAction(b);
    switch (a) {
      case "pop-close": return this._closePop();
      case "cam-more": {
        const f = this._floor(), p = f && (f.pins || []).find((x) => x.id === (this.popup && this.popup.pin));
        if (!p) return;
        this._closePop();
        this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: p.entity_id }, bubbles: true, composed: true }));
        return;
      }
      case "menu": return this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: true, composed: true }));
      case "clock": this._themeOverride = this.getAttribute("data-theme") === "dark" ? "light" : "dark";
        clearTimeout(this._themeT); this._themeT = setTimeout(() => { this._themeOverride = null; this._applyTheme(); }, 5 * 60000);
        return this._applyTheme();
      case "all-off": return this._allOff();
      case "edit": return this._enterEdit();
      case "preview-exit": this._closePop(); this.preview = false; this._themeOverride = null; this._renderAll(); return this._renderCssWin();
      case "css-open": this.cssOpen = true; this._cssMin = false; return this._renderCssWin();
      case "css-close": this.cssOpen = false; if (this.editing) this._renderInspector(); return this._renderCssWin();
      case "css-min": this._cssMin = !this._cssMin; return this._renderCssWin();
      case "css-tab": this._cssTab = b.dataset.v; return this._renderCssWin();
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
    this.mode = "view"; this.draft = null; this.draftPlans = {}; this.sel = null; this.dirty = false; this.preview = false; this.cssOpen = false;
    this._renderCssWin();
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
      this._saving = true;
      const res = await this._hass.callWS({ type: "hauspanel/config/save", config: this.draft }).finally(() => { setTimeout(() => { this._saving = false; }, 500); });
      if (res && res.rev) this.draft._rev = res.rev;
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
      case "shadow-unset": {
        this.draft.theme = mergeTheme(this.draft.theme);
        const o = this.draft.theme[this._designMode || "light"]; if (o.sh) delete o.sh[b.dataset.s];
        this._markDirty(); this._applyThemeVars(); return this._renderInspector();
      }
      case "theme-unset": {
        this.draft.theme = mergeTheme(this.draft.theme);
        delete this.draft.theme[this._designMode || "light"][b.dataset.k];
        this._markDirty(); this._applyThemeVars(); return this._renderInspector();
      }
      case "theme-reset": this.draft.theme = null; this._markDirty(); this._applyThemeVars(); this._layoutPlan(); return this._renderInspector();
      case "preview": this.preview = true; this.sel = null; this.events = []; this._renderAll(); this._fetchEvents(); this._renderCssWin(); return;
      case "pin-status": {
        const p = this._selPin(); p.status = b.dataset.v === "auto" ? null : b.dataset.v;
        this._markDirty(); this._renderPlan(); return this._renderInspector();
      }
      case "scale-reset": {
        const o = b.dataset.k === "pin-scale" ? this._selPin() : this._selRoom(); if (o) delete o.scale;
        this._markDirty(); this._renderPlan(); return this._renderInspector();
      }
      case "start-set": { this._setStart(b.dataset.v); return; }
      case "pin-camview": {
        const p = this._selPin(); if (b.dataset.v === "live") delete p.cam_view; else p.cam_view = b.dataset.v;
        this._markDirty(); return this._renderInspector();
      }
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
        if (b.dataset.list === "calendars") this._calSoon(); else this._renderCal();
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
      case "icon-search": {
        this._iconQ = val;
        const wrap = el.parentElement, pp = this._selPin(); if (!wrap || !pp) return;
        const tmp = document.createElement("div"); tmp.innerHTML = this._iconPicker(pp);
        [...wrap.children].forEach((c) => { if (c !== el && c.tagName !== "LABEL") c.remove(); });
        [...tmp.children].slice(1).forEach((c) => wrap.appendChild(c));
        return;
      }
      case "pin-name": p.name = val || null; break;
      case "pin-room": p.room = val || null; break;
      case "pin-power": p.power_off = val; break;
      case "pin-toggle": if (val) p.toggle = true; else delete p.toggle; break;
      case "pin-state-entity": if (val && !this._hass.states[val]) { if (!isChange) return; } if (val) p.state_entity = val; else delete p.state_entity; this._renderPlan(); break;
      case "pin-extra": if (!isChange && !this._hass.states[val]) return; p.extras[Number(el.dataset.i)] = val; break;
      case "pin-entity": if (!this._hass.states[val]) return; p.entity_id = val; this._renderPlan(); break;
      case "room-name": r.name = val; this._renderPlan(); break;
      case "pin-scale": case "room-scale": {
        const o = k === "pin-scale" ? p : r, v = Number(val);
        if (v === 100) delete o.scale; else o.scale = v;
        el.style.setProperty("--p", `${(v - 50) / 1.5}%`);
        const lbl = this.$(`#sv-${k}`); if (lbl) lbl.textContent = `${v} %`;
        const node = this.$(k === "pin-scale" ? `[data-pin="${p.id}"]` : `[data-room="${r.id}"]`);
        if (node) { if (v === 100) node.style.removeProperty("--ps"); else node.style.setProperty("--ps", v / 100); }
        if (isChange) this._renderInspector();
        break;
      }
      case "floor-code": f.code = val.slice(0, 4); this._renderFloors(); break;
      case "floor-name": f.name = val; this._renderFloors(); this.$("#plan-title").textContent = val; break;
      case "floor-sep": f.separated = val; this._renderFloors(); break;
      case "floor-recolor": f.recolor = val; this._renderPlan(); break;
      case "plan-file": if (isChange) this._uploadPlan(el.files && el.files[0]); return;
      case "weather": this.draft.weather_entity = val || null; break;
      case "css-global": case "css-floor": {
        if (k === "css-global") this.draft.css = val; else { const fl = this._floor(); if (fl) fl.css = val; }
        clearTimeout(this._cssT); this._cssT = setTimeout(() => this._applyCustomCss(), 120);
        break;
      }
      case "theme-shadow": {
        this.draft.theme = mergeTheme(this.draft.theme);
        const mode = this._designMode || "light", o = this.draft.theme[mode], s = el.dataset.s, pp = el.dataset.p;
        o.sh = o.sh || {};
        const cur = { ...THEME_SHADOWS.find((x) => x[0] === s)[3][mode], ...(o.sh[s] || {}) };
        cur[pp] = pp === "c" ? val : Number(val);
        o.sh[s] = cur;
        if (pp !== "c") {
          const mx = pp === "o" ? 100 : pp === "b" ? 40 : 20;
          el.style.setProperty("--p", (Number(val) / mx) * 100 + "%");
          this.$(`#sh-${s}-${pp}`).textContent = val + (pp === "o" ? " %" : " px");
        }
        this._applyThemeVars();
        if (isChange && !this.$(`[data-a=shadow-unset][data-s=${s}]`)) this._renderInspector();
        break;
      }
      case "theme-color": case "theme-size": {
        this.draft.theme = mergeTheme(this.draft.theme);
        if (k === "theme-color") {
          this.draft.theme[this._designMode || "light"][el.dataset.k] = val;
          el.nextElementSibling.nextElementSibling.textContent = val;
          if (!isChange) { this._applyThemeVars(); break; }
          if (DETAIL_VARS.some(([dk]) => dk === el.dataset.k)) { this._applyThemeVars(); this._renderInspector(); break; }
        }
        else {
          this.draft.theme.size[el.dataset.k] = Number(val);
          const spec = THEME_SIZES.find((x) => x[0] === el.dataset.k);
          this.$("#tv-" + el.dataset.k).textContent = el.dataset.k === "cal" && val < 60 ? "aus" : val + " " + spec[4];
          el.style.setProperty("--p", ((val - spec[2]) / (spec[3] - spec[2])) * 100 + "%");
        }
        this._applyThemeVars(); this._layoutPlan(); this._fitWaste(); this._fitCal();
        break;
      }
      case "default-floor": this.draft.default_floor = val; break;
      case "night-mode": this.draft.night.mode = val; this._renderInspector(); break;
      case "cal-mode": if (val === "week") delete this.draft.cal_mode; else this.draft.cal_mode = val; this.weekOffset = 0; this._fetchEvents(); break;
      case "night-from": this.draft.night.from = Number(val); break;
      case "night-to": this.draft.night.to = Number(val); break;
      case "list": {
        const item = this.draft[el.dataset.list][Number(el.dataset.i)];
        item[el.dataset.k] = val;
        if (el.dataset.k === "entity_id" && isChange && this._hass.states[val]) {
          if (!item.name) item.name = friendly(this._hass, val);
          this._renderInspector();
        }
        if (el.dataset.list === "calendars" && (isChange || el.dataset.k !== "entity_id")) this._calSoon();
        if (el.dataset.list === "waste") this._renderCal();
        break;
      }
      default: return;
    }
    this._markDirty();
  }

  /* JPG/PNG/WebP: auf max. 2400 px verkleinern und als <image> in ein SVG packen */
  async _rasterToSvg(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const MAX = 2400, sc = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * sc), h = Math.round(img.naturalHeight * sc);
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      const cx = cv.getContext("2d"); cx.fillStyle = "#fff"; cx.fillRect(0, 0, w, h); cx.drawImage(img, 0, 0, w, h);
      let data = file.type === "image/png" ? cv.toDataURL("image/png") : "";
      for (const q of [0.9, 0.8, 0.7, 0.55]) { if (data && data.length < 3e6) break; data = cv.toDataURL("image/jpeg", q); }
      if (data.length > 3.3e6) return null;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><image href="${data}" x="0" y="0" width="${w}" height="${h}"/></svg>`;
    } catch (e) { return null; } finally { URL.revokeObjectURL(url); }
  }
  async _uploadPlan(file) {
    if (!file) return;
    const f = this._floor();
    if (/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      if (file.size > 25e6) return this._toast("Bild ist größer als 25 MB");
      const svg = await this._rasterToSvg(file);
      if (!svg) return this._toast("Bild konnte nicht gelesen werden");
      this.draftPlans[f.id] = svg; f.raster = true; delete this.planCache[f.id];
      this._markDirty(); this._renderPlan(); this._renderInspector();
      return this._toast("Bild geladen – jetzt Geräte draufziehen");
    }
    if (file.size > 2e6) return this._toast("SVG ist größer als 2 MB");
    const text = await file.text();
    f.raster = false;
    const test = processSvg(text, true, this.$("#scratch"));
    if (!test) return this._toast("Datei konnte nicht als SVG gelesen werden");
    this.draftPlans[f.id] = text; delete this.planCache[f.id];
    this._markDirty(); this._renderPlan(); this._renderInspector();
    this._toast("Grundriss geladen – jetzt Geräte draufziehen");
  }

  /* ---------- Drag & Drop (Pointer-Events, funktioniert mit Maus und Touch) ---------- */
  _pinById(id) {
    for (const f of (this.C && this.C.floors) || []) { const p = (f.pins || []).find((x) => x.id === id); if (p) return p; }
    return null;
  }
  _togglePin(p, el) {
    const d = domainOf(p.entity_id);
    const svc = d === "cover" ? ["cover", "toggle"] : d === "media_player" ? ["media_player", "toggle"] : ["homeassistant", "toggle"];
    this._hass.callService(svc[0], svc[1], { entity_id: p.entity_id });
    if (el) { el.classList.add("tapped"); setTimeout(() => el.classList.remove("tapped"), 350); }
    if (navigator.vibrate) try { navigator.vibrate(15); } catch (e) { /* egal */ }
  }
  _onPointerDown(ev) {
    this._lastTouch = Date.now();
    if (ev.target.closest(".cw-head") && !ev.target.closest("button")) return this._dragCssWin(ev);
    if (this.viewing && ev.button <= 0) {
      const pv = ev.target.closest(".pin");
      const pp = pv && this._pinById(pv.dataset.pin);
      if (pp && pp.toggle && TOGGLE_DOMAINS.has(domainOf(pp.entity_id))) {
        clearTimeout(this._lpT);
        const x0 = ev.clientX, y0 = ev.clientY;
        const cancel = () => { clearTimeout(this._lpT); pv.removeEventListener("pointerup", cancel); pv.removeEventListener("pointercancel", cancel); pv.removeEventListener("pointermove", mv); };
        const mv = (e) => { if (Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 12) cancel(); };
        pv.addEventListener("pointerup", cancel); pv.addEventListener("pointercancel", cancel); pv.addEventListener("pointermove", mv);
        this._lpT = setTimeout(() => { cancel(); this._suppressClick = true; setTimeout(() => { this._suppressClick = false; }, 800); this._openPin(pp.id); }, 550);
      }
      return;
    }
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
  /* ---------- Farbwähler mit Hex-Eingabe und Palette ---------- */
  _usedColors() {
    const out = new Set(), add = (c) => { const h = normHex(c); if (h) out.add(h); };
    const th = (this.draft && this.draft.theme) || {};
    ["light", "dark"].forEach((m) => {
      Object.entries(th[m] || {}).forEach(([k, v]) => { if (k === "sh") Object.values(v || {}).forEach((s) => add(s && s.c)); else add(v); });
    });
    [...((this.draft && this.draft.calendars) || []), ...((this.draft && this.draft.waste) || [])].forEach((x) => add(x.color));
    return [...out].slice(0, 30);
  }
  _closeColorPop() { if (this._cp) { this._cp.div.remove(); this._cp = null; } }
  _colorPop(input) {
    this._closeColorPop();
    const pal = this.draft.palette || [], cur = normHex(input.value) || "#000000";
    const used = this._usedColors().filter((c) => !pal.includes(c));
    const sw = (c, own) => `<button class="sw${c === cur ? " cur" : ""}" data-a="cp-pick" data-c="${c}"${own ? ' data-own="1"' : ""} style="--c:${c}" title="${c}">${own && this._palEdit ? ic("x", 13) : ""}</button>`;
    const div = document.createElement("div"); div.className = "cpop";
    div.innerHTML = `<div class="row" style="gap:8px"><span class="cprev" style="background:${cur}"></span>
        <input class="inp cp-hex" value="${cur}" maxlength="7" spellcheck="false" autocomplete="off" aria-label="Hex-Code">
        <button class="sbtn" data-a="cp-sys" title="Farbrad öffnen">${ic("pipette", 16)}</button>
        <button class="sbtn" data-a="cp-close" aria-label="Schließen">${ic("x", 16)}</button></div>
      <div class="cp-h"><span>Palette</span>${pal.length ? `<button class="lnk" data-a="cp-edit">${this._palEdit ? "Fertig" : "Bearbeiten"}</button>` : ""}</div>
      <div class="sws">${pal.map((c) => sw(c, true)).join("")}<button class="sw add" data-a="cp-add" title="Aktuelle Farbe in die Palette">${ic("plus", 14)}</button></div>
      ${pal.length ? "" : `<div class="hint" style="margin:6px 0 0">Mit + legst du die aktuelle Farbe in deine Palette. Sie wird mit dem Layout gespeichert.</div>`}
      ${used.length ? `<div class="cp-h"><span>Schon benutzt</span></div><div class="sws">${used.map((c) => sw(c)).join("")}</div>` : ""}`;
    (input.closest(".row") || input.parentElement).after(div);
    this._cp = { input, div, committed: cur };
    const hex = div.querySelector(".cp-hex");
    const stop = (e) => e.stopPropagation();
    hex.addEventListener("change", stop);
    hex.addEventListener("input", (e) => { stop(e); const v = normHex(hex.value); hex.classList.toggle("bad", !v && hex.value.length > 0); if (v) this._cpApply(v, false); });
    hex.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { const v = normHex(hex.value); if (v) { this._cpApply(v, true); this._closeColorPop(); } }
      else if (e.key === "Escape") this._closeColorPop();
    });
    hex.addEventListener("blur", () => { const v = normHex(hex.value); if (v && this._cp && this._cp.input === input && v !== this._cp.committed) this._cpApply(v, true, true); });
    if (matchMedia("(pointer: fine)").matches) { hex.focus(); hex.select(); }
  }
  _cpApply(v, commit, keepOpen) {
    const cp = this._cp; if (!cp) return;
    cp.input.value = v;
    const pv = cp.div.querySelector(".cprev"); if (pv) pv.style.background = v;
    cp.input.dispatchEvent(new Event("input", { bubbles: true }));
    if (commit) { cp.committed = v; cp.input.dispatchEvent(new Event("change", { bubbles: true })); }
    if (keepOpen && this._cp && !this._cp.div.isConnected) this._cp = null;
  }
  _colorPopAction(b) {
    const cp = this._cp; if (!cp) return;
    const a = b.dataset.a;
    if (a === "cp-close") return this._closeColorPop();
    if (a === "cp-sys") { try { cp.input.showPicker(); } catch (e) { /* ältere Browser */ } return; }
    if (a === "cp-edit") { this._palEdit = !this._palEdit; return this._colorPop(cp.input); }
    if (a === "cp-add") {
      const v = normHex(cp.input.value); if (!v) return;
      const pal = (this.draft.palette = this.draft.palette || []);
      if (!pal.includes(v)) { pal.push(v); if (pal.length > 30) pal.shift(); this._markDirty(); }
      return this._colorPop(cp.input);
    }
    if (a === "cp-pick") {
      const c = b.dataset.c;
      if (this._palEdit && b.dataset.own) {
        this.draft.palette = (this.draft.palette || []).filter((x) => x !== c);
        if (!this.draft.palette.length) { delete this.draft.palette; this._palEdit = false; }
        this._markDirty(); return this._colorPop(cp.input);
      }
      this._cpApply(c, true); this._closeColorPop();
    }
  }

  _renderInspector() {
    const el = this.$("#insp"); if (!el) return;
    this._cp = null;
    // Scrollposition pro Tab merken, damit Neuzeichnen nicht nach oben springt
    this._inspScroll = this._inspScroll || {};
    const old = this.$("#insp-body");
    if (old && this._inspTab) this._inspScroll[this._inspTab] = old.scrollTop;
    const selKey = this.sel ? this.sel.type + ":" + this.sel.id + ":" + this.activeFloor : "";
    if (selKey !== this._inspSel) { this._inspScroll.select = 0; this._inspSel = selKey; }
    if (this._inspFloor !== this.activeFloor) { this._inspScroll.floor = 0; this._inspFloor = this.activeFloor; }
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
    this._inspTab = this.tab;
    body.scrollTop = this._inspScroll[this.tab] || 0;
  }
  _entityOptions(domains, current, emptyLabel) {
    const ids = Object.keys(this._hass.states).filter((id) => domains.includes(domainOf(id))).sort((a, b) => friendly(this._hass, a).localeCompare(friendly(this._hass, b), "de"));
    return `<option value="">${esc(emptyLabel || "– keine –")}</option>` + ids.map((id) => `<option value="${esc(id)}"${id === current ? " selected" : ""}>${esc(friendly(this._hass, id))} (${esc(id)})</option>`).join("");
  }
  _datalist() {
    if (this.$("#dl-sensors")) return "";
    const ids = Object.keys(this._hass.states).filter((id) => ["sensor","binary_sensor","switch","input_boolean"].includes(domainOf(id))).sort();
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
      ${scaleField(r, "room-scale")}
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
      <div class="fld"><label>Icon</label>${this._iconPicker(p)}</div>
      ${this._statusField(p, d)}
      ${d === "camera" ? `<div class="fld"><label>Ansicht im Popup</label><div class="chips" style="margin:0">
        ${[["live", "Livebild"], ["snapshot", "Standbild (alle 3 s neu)"]].map(([k, l]) => `<button class="${(p.cam_view || "live") === k ? "sel" : ""}" data-a="pin-camview" data-v="${k}">${l}</button>`).join("")}</div>
        <div class="hint" style="margin-top:6px">Akku-Kameras liefern oft kein Livebild an Home Assistant – dann Standbild wählen.</div></div>` : ""}
      <div class="fld"><label>Status von anderer Entity</label>
        <input class="inp" list="dl-sensors" data-f="pin-state-entity" value="${esc(p.state_entity || "")}" placeholder="optional, z. B. binary_sensor.…_camera_enabled">
        <div class="hint" style="margin-top:4px">${d === "camera" ? "Kamera an = Pin in An-Farbe, aus = durchgestrichenes Symbol. Antippen öffnet weiterhin das Kamerabild." : "Der Pin wird „an“ gefärbt, wenn diese Entity an ist."}</div></div>
      ${scaleField(p, "pin-scale")}
      ${TOGGLE_DOMAINS.has(d) ? `<label class="check"><input type="checkbox" data-f="pin-toggle" ${p.toggle ? "checked" : ""}>Antippen schaltet direkt an/aus</label>
        <div class="hint" style="margin:-4px 0 8px 30px">Lange drücken öffnet weiterhin das Popup (z. B. für Helligkeit).</div>` : ""}
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

  _iconPicker(p) {
    const q = (this._iconQ || "").trim().toLowerCase();
    const groups = ICON_GROUPS.map(([g, items]) => [g, items.map((x) => x.split(":")).filter(([n, tags]) => !q || n.includes(q) || (tags || "").includes(q) || g.toLowerCase().includes(q))])
      .filter(([, items]) => items.length);
    return `<input class="inp" data-f="icon-search" placeholder="Icon suchen, z. B. heizung, tür, wlan …" value="${esc(this._iconQ || "")}" style="margin-bottom:8px">
      <div class="icon-grid"><button class="${p.icon ? "" : "sel"}" data-a="pin-icon" data-icon="auto" title="Automatisch" style="font-size:11px;font-weight:700">Auto</button></div>
      ${groups.map(([g, items]) => { const open = q || (this._iconOpen && this._iconOpen.has(g)) || items.some(([n]) => n === p.icon);
        return `<details class="icon-group"${open ? " open" : ""} data-igroup="${esc(g)}"><summary>${esc(g)}<span>${items.length}</span></summary><div class="icon-grid">${items.map(([n, tags]) =>
        `<button class="${p.icon === n ? "sel" : ""}" data-a="pin-icon" data-icon="${n}" title="${esc((tags || n).split(" ")[0])}">${ic(n, 17)}</button>`).join("")}</div></details>`; }).join("")
      || `<div class="hint">Kein Icon gefunden.</div>`}`;
  }
  _statusField(p, d) {
    if (!STATUS_DOMAINS.has(d)) return `<div class="fld"><label>Farbe</label><div class="hint" style="margin:0">Messwert-Farben – dieses Gerät hat keinen An/Aus-Status.</div></div>`;
    const cur = p.status || "auto";
    const opts = d === "climate"
      ? [["auto", "An, wenn sie heizt"], ["mode", "An, wenn Heizmodus aktiv"], ["none", "Wie Messwert"]]
      : [["auto", "Status (an/aus)"], ["none", "Wie Messwert"]];
    const hint = d === "climate"
      ? "„Heizt“ nutzt hvac_action – rot nur, solange wirklich geheizt wird. „Heizmodus“ ist rot, solange das Thermostat nicht auf Aus steht."
      : "„Wie Messwert“: immer in den Messwert-Farben, egal ob an oder aus.";
    return `<div class="fld"><label>Farbe</label><div class="chips" style="margin:0">${opts.map(([k, l]) =>
      `<button class="${cur === k ? "sel" : ""}" data-a="pin-status" data-v="${k}">${l}</button>`).join("")}</div><div class="hint" style="margin-top:6px">${hint}</div></div>`;
  }
  _tabFloor() {
    const f = this._floor();
    if (!f) return `<div class="hint">Noch keine Etage. Links auf „+ Etage“ tippen.</div>`;
    const has = !!this.draftPlans[f.id], idx = this.draft.floors.indexOf(f);
    this._confirmDel = false;
    return `<div class="row"><div class="fld" style="width:90px"><label>Kürzel</label><input class="inp" data-f="floor-code" maxlength="4" value="${esc(f.code)}"></div>
        <div class="fld" style="flex:1"><label>Name</label><input class="inp" data-f="floor-name" value="${esc(f.name)}"></div></div>
      <div class="fld"><label>Grundriss</label>
        <label class="drop-zone"><input type="file" accept=".svg,image/svg+xml,image/png,image/jpeg,image/webp" data-f="plan-file" hidden>
          ${ic("upload", 22).replace('class="i"', 'class="i" style="margin:0 auto 6px"')}<b>${has ? "Anderen Grundriss wählen" : "Grundriss hochladen"}</b>SVG (max. 2 MB) oder JPG/PNG/WebP – Bilder werden auf 2400 px verkleinert</label>
        ${has ? `<button class="sbtn danger" style="margin-top:8px" data-a="plan-del">${ic("trash-2", 16)}Grundriss entfernen</button>` : ""}</div>
      ${f.raster ? `<label class="check"><input type="checkbox" data-f="floor-recolor" ${f.recolor !== false ? "checked" : ""}>Im Nachtmodus invertieren</label>
      <div class="hint">Pixelbilder lassen sich nicht auf Wand-/Bodenfarben umfärben. Invertieren macht aus einem hellen Plan nachts einen dunklen.</div>`
      : `<label class="check"><input type="checkbox" data-f="floor-recolor" ${f.recolor !== false ? "checked" : ""}>Farben an Design &amp; Nachtmodus anpassen</label>
      <div class="hint">Dunkle Flächen werden zu Wänden, helle zu Boden, Grautöne zu Außenbereich/Türen. Aus = Original-Farben.</div>`}
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
    const sizeRow = ([k, l, mn, mx, u]) => `<div style="margin-bottom:8px"><div class="row" style="justify-content:space-between;font-size:13.5px">
          <span>${l}</span><b id="tv-${k}">${k === "cal" && t.size[k] < 60 ? "aus" : `${t.size[k]} ${u}`}</b></div>
          <input type="range" min="${mn}" max="${mx}" step="1" value="${t.size[k]}" data-f="theme-size" data-k="${k}" style="--p:${((t.size[k] - mn) / (mx - mn)) * 100}%"></div>`;
    const t = mergeTheme(this.draft.theme), m = this._designMode || "light";
    const f = this._floor(), lines = (s) => (s || "").split("\n").filter((x) => x.trim()).length;
    return `<div class="row" style="margin-bottom:14px"><button class="sbtn primary" data-a="preview">${ic("eye", 16)}Vorschau</button>
        <button class="sbtn" data-a="theme-reset">Auf Standard zurücksetzen</button></div>
      <div class="fld"><label>Eigenes CSS</label>
        <button class="sbtn full" data-a="css-open">${ic("code", 16)}CSS bearbeiten</button>
        <div class="hint" style="margin-top:6px">Ganze Seite: ${lines(this.draft.css)} Zeilen${f ? ` · ${esc(f.code)}: ${lines(f.css)} Zeilen` : ""}. Wirkt live, auch in der Vorschau.</div></div>
      <div class="sep"></div>
      <div class="fld"><label>Farben</label><div class="chips" style="margin:0 0 10px">
        <button class="${m === "light" ? "sel" : ""}" data-a="design-mode" data-v="light">Hell</button>
        <button class="${m === "dark" ? "sel" : ""}" data-a="design-mode" data-v="dark">Nachtmodus</button></div>
        <details class="cgroup" open><summary>Grundfarben</summary>
        ${THEME_COLORS.map(([k, l]) => `<div class="row crow"><input type="color" data-f="theme-color" data-k="${k}" value="${t[m][k]}">
          <span class="cl">${l}</span><span class="cv">${t[m][k]}</span></div>`).join("")}</details>
        ${THEME_DETAIL.map(([g, hint, items]) => `<details class="cgroup"${this._openGroups && this._openGroups.has(g) ? " open" : ""} data-group="${esc(g)}"><summary>${esc(g)}</summary>
          ${hint ? `<div class="hint">${esc(hint)}</div>` : ""}
          ${items.map(([k, v, l]) => { const set = t[m][k]; return `<div class="row crow"><input type="color" data-f="theme-color" data-k="${k}" value="${set || this._cssColor(v)}">
            <span class="cl">${l}</span><span class="cv">${set ? set : "auto"}</span>
            ${set ? `<button class="cx" data-a="theme-unset" data-k="${k}" title="Zurück auf automatisch">${ic("x", 13)}</button>` : `<span class="cx"></span>`}</div>`; }).join("")}
        </details>`).join("")}
        ${this._shadowGroup(t, m)}</div>
      <div class="sep"></div>
      <div class="fld"><label>Layout</label>
        <div class="hint" style="margin:0 0 8px">Der Grundriss füllt immer den Platz dazwischen. Kalenderleiste ganz nach links = ausgeblendet.</div>
        ${THEME_SIZES.filter(([k]) => LAYOUT_SIZES.includes(k)).map(sizeRow).join("")}</div>
      <div class="fld"><label>Größen &amp; Abstände</label>
        ${THEME_SIZES.filter(([k]) => !LAYOUT_SIZES.includes(k)).map(sizeRow).join("")}</div>
      <div class="hint">Pins und Raum-Labels wachsen zusätzlich mit dem Grundriss mit, damit sie auf jedem Bildschirm an derselben Stelle sitzen.</div>`;
  }
  /* aktuellen Farbwert einer Variable als #hex (für „auto“-Felder) */
  _shadowGroup(t, m) {
    const open = this._openGroups && this._openGroups.has("Schatten");
    return `<details class="cgroup"${open ? " open" : ""} data-group="Schatten"><summary>Schatten</summary>
      <div class="hint">Deckkraft 0 % = kein Schatten.</div>
      ${THEME_SHADOWS.map(([k, , l]) => {
        const v = shadowVals(t[m], m, k), set = t[m].sh && t[m].sh[k];
        const sl = (p, lab, mx, u) => `<div class="row" style="gap:10px;margin:2px 0 0 46px"><span style="width:72px;font-size:12px;color:var(--muted)">${lab}</span>
          <input type="range" min="0" max="${mx}" value="${v[p]}" data-f="theme-shadow" data-s="${k}" data-p="${p}" style="--p:${(v[p] / mx) * 100}%;flex:1;margin:0">
          <b style="width:44px;text-align:right;font-size:12px" id="sh-${k}-${p}">${v[p]} ${u}</b></div>`;
        return `<div style="margin-bottom:12px"><div class="row crow"><input type="color" data-f="theme-shadow" data-s="${k}" data-p="c" value="${v.c}">
            <span class="cl">${l}</span><span class="cv">${set ? "eigen" : "auto"}</span>
            ${set ? `<button class="cx" data-a="shadow-unset" data-s="${k}" title="Zurück auf automatisch">${ic("x", 13)}</button>` : `<span class="cx"></span>`}</div>
          ${sl("o", "Deckkraft", 100, "%")}${sl("b", "Weichheit", 40, "px")}${sl("y", "Versatz", 20, "px")}</div>`;
      }).join("")}</details>`;
  }
  _cssColor(v) {
    const probe = document.createElement("span");
    probe.style.color = `var(${v})`; probe.style.display = "none";
    this.shadowRoot.appendChild(probe);
    const c = getComputedStyle(probe).color; probe.remove();
    const m = c.match(/(\d+),\s*(\d+),\s*(\d+)/);
    return m ? "#" + [m[1], m[2], m[3]].map((x) => Number(x).toString(16).padStart(2, "0")).join("") : "#888888";
  }
  _renderCssWin() {
    const w = this.$("#css-win"); if (!w) return;
    if (!this.cssOpen || this.mode !== "edit") { w.hidden = true; return; }
    w.hidden = false; w.classList.toggle("min", !!this._cssMin);
    const f = this._floor(), tab = this._cssTab || "global";
    const tabs = [["global", "Ganze Seite"], ...(f ? [["floor", `Nur ${f.code || "Etage"}`]] : []), ["help", "Spickzettel"], ["base", "Eingebautes CSS"]];
    const cur = tab === "floor" && !f ? "global" : tab;
    let body;
    if (cur === "global") body = `<textarea data-f="css-global" spellcheck="false" placeholder="/* z. B. */\n#date { font-weight: 800; }">${esc(this.draft.css || "")}</textarea>`;
    else if (cur === "floor") body = `<textarea data-f="css-floor" spellcheck="false" placeholder="/* gilt nur, solange ${esc(f.code)} offen ist */\n.pin.on { background: #2F6DD0; }">${esc(f.css || "")}</textarea>`;
    else body = `<pre>${esc(cur === "help" ? CSS_HELP : CSS.trim())}</pre>`;
    w.innerHTML = `<div class="cw-head" data-drag="css">${ic("code", 16)}<b>Eigenes CSS</b>
        <button class="sbtn" data-a="css-min">${this._cssMin ? "Aufklappen" : "Einklappen"}</button>
        <button class="sbtn" data-a="css-close" aria-label="Schließen">${ic("x", 16)}</button></div>
      <div class="cw-tabs">${tabs.map(([k, l]) => `<button class="${cur === k ? "sel" : ""}" data-a="css-tab" data-v="${k}">${esc(l)}</button>`).join("")}</div>
      <div class="cw-body">${body}</div>
      <div class="cw-foot">${cur === "base" ? "Nur zum Nachschlagen/Kopieren – Änderungen gehören in „Ganze Seite“ oder die Etage." : cur === "help" ? "Selektoren und Variablen, die du überschreiben kannst." : "Wirkt sofort · gespeichert wird mit „Speichern“ · Fenster am Kopf verschieben"}</div>`;
    const ta = w.querySelector("textarea");
    if (ta) ta.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      const s = ta.selectionStart; ta.setRangeText("  ", s, ta.selectionEnd, "end");
      ta.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    });
  }
  _dragCssWin(ev) {
    ev.preventDefault();
    const w = this.$("#css-win"), sc = this._scale || 1, sx = ev.clientX, sy = ev.clientY;
    const ox = this._cssPos ? this._cssPos.x : 0, oy = this._cssPos ? this._cssPos.y : 0;
    const head = ev.target.closest(".cw-head"); head.setPointerCapture(ev.pointerId);
    const move = (e) => { this._cssPos = { x: ox + (e.clientX - sx) / sc, y: oy + (e.clientY - sy) / sc }; w.style.transform = `translate(${this._cssPos.x}px,${this._cssPos.y}px)`; };
    const up = () => { head.removeEventListener("pointermove", move); head.removeEventListener("pointerup", up); };
    head.addEventListener("pointermove", move); head.addEventListener("pointerup", up);
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
      <div class="fld"><label>Kalenderleiste zeigt</label><select class="inp" data-f="cal-mode">
        ${[["week", "Kalenderwoche (Mo–So)"], ["weekend", "Kalenderwoche – am Wochenende ab heute"], ["rolling", "Immer die nächsten 7 Tage ab heute"]].map(([v, l]) =>
          `<option value="${v}"${(c.cal_mode || "week") === v ? " selected" : ""}>${l}</option>`).join("")}</select>
        <div class="hint" style="margin-top:6px">„Am Wochenende ab heute“: Samstag und Sonntag zeigen schon die kommende Woche mit. Wo eine neue Woche beginnt, steht die KW am Tag.</div></div>
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
      <div class="hint">Tipp: Auf dem Tablet schaltet ein Tap auf die Uhr für 5 Minuten zwischen Hell und Dunkel um.</div>
      <div class="sep"></div>
      <div class="fld"><label>Als Startseite</label>
        <div class="hint">HA bietet im Profil nur Dashboards zur Auswahl an. Diese Knöpfe tragen das Hauspanel direkt als Startseite ein – ohne Umweg, der Menüeintrag bleibt dabei aktiv markiert.</div>
        <div class="row" style="gap:8px;flex-wrap:wrap"><button class="sbtn" data-a="start-set" data-v="user">${ic("house", 16)}Für mich</button>
        <button class="sbtn" data-a="start-set" data-v="system">${ic("users", 16)}Für alle Benutzer</button></div>
        <div class="hint" style="margin-top:6px">„Für alle“ gilt für jeden, der im Profil nichts Eigenes gewählt hat.</div></div>`;
  }
}

if (!customElements.get("hauspanel-panel")) customElements.define("hauspanel-panel", HauspanelPanel);
console.info(`%c HAUSPANEL %c ${HP_VERSION} `, "background:#E5391D;color:#fff;font-weight:700", "background:#1F1D1C;color:#fff");
