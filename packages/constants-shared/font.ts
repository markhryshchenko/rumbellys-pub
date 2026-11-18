// UI font: system fonts only. No web font download (Engine games must not call outside servers),
// no font license, and every script the RGS can request (Latin, Cyrillic, CJK, Arabic, Devanagari)
// is covered by the system fallback.
// CSS cannot import this: global.scss, Button.svelte and Popup.svelte repeat the same list.
export const UI_FONT_FAMILY = ['Trebuchet MS', 'Segoe UI', 'Noto Sans', 'Arial', 'sans-serif'];
