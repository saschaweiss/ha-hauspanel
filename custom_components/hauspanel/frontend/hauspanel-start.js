/* Hauspanel als Startseite: Ein Lovelace-Dashboard mit dieser Karte leitet sofort auf /hauspanel weiter.
   So lässt sich Hauspanel unter Profil → Erscheinungsbild → Dashboard als Standard auswählen. */
class HauspanelStartCard extends HTMLElement {
  setConfig(config) { this._config = config || {}; }
  set hass(hass) { this._hass = hass; this._go(); }
  set editMode(v) { this._edit = v; this._render(); }
  connectedCallback() { this._render(); this._go(); }
  getCardSize() { return 2; }
  _target() { return (this._config && this._config.path) || "/hauspanel"; }
  _go() {
    if (this._done || this._edit || !this.isConnected) return;
    // nicht im Karten-Editor / in der Vorschau weiterleiten
    if (this.closest && (this.closest("hui-card-preview") || this.closest("hui-dialog-edit-card"))) return;
    if (/[?&]edit=1/.test(location.search)) return;
    this._done = true;
    const target = this._target() + location.search.replace(/^\?$/, "");
    history.replaceState(null, "", target);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: true } }));
  }
  _render() {
    if (this._r) return; this._r = true;
    this.innerHTML = `<ha-card style="padding:16px"><b>Hauspanel</b><div style="margin-top:6px;opacity:.7">Dieses Dashboard öffnet direkt das Hauspanel. <a href="${this._target()}">Jetzt öffnen</a></div></ha-card>`;
  }
}
if (!customElements.get("hauspanel-start-card")) customElements.define("hauspanel-start-card", HauspanelStartCard);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "hauspanel-start-card"))
  window.customCards.push({ type: "hauspanel-start-card", name: "Hauspanel als Startseite", description: "Leitet dieses Dashboard sofort auf das Hauspanel weiter." });
