import { MONO, SANS, doc, backdrop, gridDefs, txt, esc } from "./lib/theme.mjs";
import { S } from "./lib/i18n.mjs";

const W = 1000;
const H = 236;
const PAD = 40;



export function render(t, { locale, data }) {
  const s = S[locale].stats;
  const nf = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US");
  const values = [
    data.totalContributions,
    data.activeDays,
    data.currentStreak,
    data.longestStreak,
    data.busiestDay?.contributionCount ?? 0,
  ];
  const tiles = s.tiles.map(([label, sub], i) => ({
    value: nf.format(values[i]),
    label,
    sub:
      sub ??
      (data.busiestDay ? formatDate(data.busiestDay.date, locale) : "—"),
  }));

  const gap = 14;
  const tw = Math.floor((W - PAD * 2 - gap * (tiles.length - 1)) / tiles.length);
  const tileY = 74;
  const tileH = 82;

  const tilesSvg = tiles
    .map((tile, i) => {
      const x = PAD + i * (tw + gap);
      return `<g>
<rect x="${x}" y="${tileY}" width="${tw}" height="${tileH}" rx="10" fill="${t.panel}" stroke="${t.border}"/>
<rect x="${x}" y="${tileY}" width="${tw}" height="2" rx="1" fill="${t.accent}" opacity="${0.85 - i * 0.12}"/>
<text x="${x + 16}" y="${tileY + 40}" font-family="${SANS}" font-size="27" font-weight="700" fill="${t.text}" letter-spacing="-0.5">${esc(tile.value)}</text>
<text x="${x + 16}" y="${tileY + 58}" font-family="${MONO}" font-size="11" font-weight="600" fill="${t.accent2}">${esc(tile.label)}</text>
<text x="${x + 16}" y="${tileY + 72}" font-family="${MONO}" font-size="10" fill="${t.dim}">${esc(tile.sub)}</text>
</g>`;
    })
    .join("\n");

  // A parte honesta: quase tudo é código de cliente, em repositório privado.
  const total = Math.max(data.totalContributions, 1);
  const privatePct = Math.round((data.privateContributions / total) * 100);
  const barY = 186;
  const barW = W - PAD * 2;
  const privW = Math.max(2, Math.round((privatePct / 100) * barW));

  return doc({
    w: W,
    h: H,
    defs: `${gridDefs(t, { cell: 30, glowX: "18%", glowY: "6%" })}
<linearGradient id="privGrad" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0%" stop-color="${t.accent}"/>
  <stop offset="100%" stop-color="${t.accent2}"/>
</linearGradient>`,
    style: `
.bar{transform-origin:${PAD}px ${barY}px;animation:grow 1.2s cubic-bezier(.16,1,.3,1) both}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion: reduce){.bar{animation:none}}`,
    body: `
${backdrop(t, W, H)}
${txt(PAD, 40, s.title, { size: 12, weight: 700, fill: t.text })}
${txt(PAD + 10 + s.title.length * 7.4, 40, s.note, { size: 11.5, fill: t.dim })}
<rect x="${PAD}" y="54" width="${barW}" height="1" fill="${t.border}"/>
${tilesSvg}
<rect x="${PAD}" y="${barY}" width="${barW}" height="8" rx="4" fill="${t.panel2}" stroke="${t.border}"/>
<g class="bar"><rect x="${PAD}" y="${barY}" width="${privW}" height="8" rx="4" fill="url(#privGrad)"/></g>
${txt(PAD, barY + 30, s.privateNote(privatePct), { size: 11.5, fill: t.muted })}
${txt(W - PAD, barY + 30, s.cta, { size: 11.5, fill: t.accent2, anchor: "end" })}`,
  });
}

function formatDate(iso, locale) {
  const [y, m, d] = iso.split("-");
  return locale === "pt" ? `${d}/${m}/${y}` : `${y}-${m}-${d}`;
}

export const outputs = (t, locale) => [`stats-${locale}-${t.id}.svg`];
