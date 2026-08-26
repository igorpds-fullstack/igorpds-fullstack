// Paleta e primitivas de SVG — espelham os tokens de design de igorsantos.dev
// (accent violeta oklch(0.62 0.22 290) aproximado em hex para compatibilidade SVG).

export const THEMES = {
  dark: {
    id: "dark",
    bg: "#0B0B0F",
    panel: "#101018",
    panel2: "#16161F",
    border: "#24242F",
    text: "#E9E9F2",
    muted: "#8A8A9E",
    dim: "#55556A",
    accent: "#8B5CF6",
    accent2: "#A78BFA",
    accentSoft: "#231B3B",
    grid: "#17171F",
    ramp: ["#16161F", "#2E2350", "#4C1D95", "#7C3AED", "#A78BFA"],
  },
  light: {
    id: "light",
    bg: "#FFFFFF",
    panel: "#FBFBFD",
    panel2: "#F3F3F8",
    border: "#E4E4EE",
    text: "#14141B",
    muted: "#5C5C6B",
    dim: "#8A8A9E",
    accent: "#6D28D9",
    accent2: "#7C3AED",
    accentSoft: "#EDE9FE",
    grid: "#F1F1F6",
    ramp: ["#EFEFF5", "#DDD6FE", "#A78BFA", "#7C3AED", "#5B21B6"],
  },
};

// SVG embutido via <img> no GitHub não carrega webfonts: só stacks do sistema.
export const MONO =
  "ui-monospace,'SFMono-Regular','SF Mono',Menlo,Consolas,'Liberation Mono',monospace";
export const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif";

export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Largura aproximada de um texto, para dimensionar chips sem medir fonte. */
export const widthOf = (s, size, mono = true) =>
  String(s).length * size * (mono ? 0.6 : 0.55);

export function doc({ w, h, defs = "", style = "", body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img">
<defs>${defs}</defs>
<style>${style}</style>
${body}
</svg>`;
}

/** Fundo padrão: base + grade sutil + brilho violeta no canto. */
export function backdrop(t, w, h, { glow = true, radius = 16 } = {}) {
  return `
<rect width="${w}" height="${h}" rx="${radius}" fill="${t.bg}"/>
<rect width="${w}" height="${h}" rx="${radius}" fill="url(#gridPat)"/>
${glow ? `<rect width="${w}" height="${h}" rx="${radius}" fill="url(#glow)"/>` : ""}
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${radius}" stroke="${t.border}"/>`;
}

export function gridDefs(t, { cell = 26, glowX = "12%", glowY = "0%" } = {}) {
  return `
<pattern id="gridPat" width="${cell}" height="${cell}" patternUnits="userSpaceOnUse">
  <path d="M ${cell} 0 L 0 0 0 ${cell}" fill="none" stroke="${t.grid}" stroke-width="1"/>
</pattern>
<radialGradient id="glow" cx="${glowX}" cy="${glowY}" r="70%">
  <stop offset="0%" stop-color="${t.accent}" stop-opacity="${t.id === "dark" ? 0.22 : 0.13}"/>
  <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0%" stop-color="${t.accent}" stop-opacity="0"/>
  <stop offset="35%" stop-color="${t.accent2}"/>
  <stop offset="65%" stop-color="${t.accent}"/>
  <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
</linearGradient>`;
}

export function txt(x, y, s, { size = 13, fill, weight = 400, font = MONO, anchor = "start", opacity = 1, cls = "" } = {}) {
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}"${cls ? ` class="${cls}"` : ""}>${esc(s)}</text>`;
}

/** Rótulo de seção: barra violeta + texto em caixa alta espaçada. */
export function sectionLabel(t, x, y, label) {
  return `<rect x="${x}" y="${y - 9}" width="3" height="12" rx="1.5" fill="${t.accent}"/>
<text x="${x + 10}" y="${y}" font-family="${MONO}" font-size="11" font-weight="600" letter-spacing="1.4" fill="${t.muted}">${esc(String(label).toUpperCase())}</text>`;
}

/** Chip/pill. `tone`: 'default' | 'accent' (especialidade). */
export function chip(t, x, y, label, { tone = "default", size = 12, h = 26 } = {}) {
  const pad = 11;
  const w = Math.round(widthOf(label, size) + pad * 2);
  const isAccent = tone === "accent";
  return {
    w,
    svg: `<g>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${isAccent ? t.accentSoft : t.panel2}" stroke="${isAccent ? t.accent : t.border}"/>
<text x="${x + pad}" y="${y + h / 2 + 4}" font-family="${MONO}" font-size="${size}" font-weight="${isAccent ? 600 : 400}" fill="${isAccent ? t.accent2 : t.text}">${esc(label)}</text>
</g>`,
  };
}

/** Distribui chips em linhas com quebra automática. Retorna {svg, height}. */
export function chipRow(t, x, y, maxW, items, { gap = 8, lineGap = 8, h = 26 } = {}) {
  let cx = x;
  let cy = y;
  let out = "";
  for (const it of items) {
    const label = typeof it === "string" ? it : it.label;
    const tone = typeof it === "string" ? "default" : it.tone || "default";
    const probe = chip(t, cx, cy, label, { tone, h });
    if (cx + probe.w > x + maxW && cx > x) {
      cx = x;
      cy += h + lineGap;
    }
    const c = chip(t, cx, cy, label, { tone, h });
    out += c.svg;
    cx += c.w + gap;
  }
  return { svg: out, height: cy + h - y };
}
