import { MONO, SANS, doc, backdrop, gridDefs, txt, esc, widthOf } from "./lib/theme.mjs";
import { S } from "./lib/i18n.mjs";

const W = 1000;
const H = 250;

export function render(t, { locale }) {
  const s = S[locale].header;

  const rotating = s.rotate
    .map(
      (l, i) =>
        `<text x="48" y="170" class="rot rot-${i}" style="animation-delay:${i * 4}s" font-family="${MONO}" font-size="15" fill="${t.muted}">${esc(l)}</text>`
    )
    .join("\n");

  const pillW = Math.round(widthOf(s.pill, 11) + 44);
  const pillX = W - 48 - pillW;

  return doc({
    w: W,
    h: H,
    defs: `${gridDefs(t, { cell: 28, glowX: "8%", glowY: "0%" })}
<linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="${t.accent2}"/>
  <stop offset="100%" stop-color="${t.accent}" stop-opacity="0.15"/>
</linearGradient>
<clipPath id="clipAll"><rect width="${W}" height="${H}" rx="16"/></clipPath>`,
    style: `
.rot{opacity:0;animation:rot 16s linear infinite}
@keyframes rot{0%{opacity:0}1.5%{opacity:1}22%{opacity:1}24%{opacity:0}100%{opacity:0}}
.sweep{animation:sweep 7s ease-in-out infinite}
@keyframes sweep{0%{transform:translateX(-320px)}100%{transform:translateX(${W}px)}}
.cursor{animation:blink 1.1s steps(1) infinite}
@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}
@media (prefers-reduced-motion: reduce){
  .rot{animation:none;opacity:0}
  .rot-0{opacity:1}
  .sweep{animation:none;transform:translateX(340px)}
  .cursor{animation:none;opacity:1}
}`,
    body: `
${backdrop(t, W, H)}
<g clip-path="url(#clipAll)">
  <rect x="0" y="0" width="4" height="${H}" fill="url(#bar)"/>
  <g class="sweep"><rect x="0" y="${H - 1}" width="320" height="1" fill="url(#accentLine)"/></g>
</g>

<g opacity="0.85">
  ${txt(48, 58, "~/igor", { size: 12, fill: t.dim })}
  ${txt(100, 58, "$", { size: 12, fill: t.accent })}
  ${txt(116, 58, s.whoami, { size: 12, fill: t.muted })}
  <rect class="cursor" x="${116 + Math.round(widthOf(s.whoami, 12)) + 4}" y="48" width="7" height="13" fill="${t.accent2}"/>
</g>

<text x="48" y="112" font-family="${SANS}" font-size="38" font-weight="700" fill="${t.text}" letter-spacing="-0.8">Igor Pereira dos Santos</text>
<text x="48" y="140" font-family="${MONO}" font-size="14" font-weight="600" fill="${t.accent2}" letter-spacing="0.3">${esc(s.role)}</text>
${rotating}

<g>
  ${txt(48, 212, "igorsantos.dev", { size: 12, fill: t.muted })}
  ${txt(156, 212, "·", { size: 12, fill: t.dim })}
  ${txt(170, 212, "linkedin.com/in/igor-santos11", { size: 12, fill: t.muted })}
  ${txt(384, 212, "·", { size: 12, fill: t.dim })}
  ${txt(398, 212, "igor.santos@mpdsconsultoria.com", { size: 12, fill: t.muted })}
</g>

<g transform="translate(${pillX}, 92)">
  <rect x="0" y="0" width="${pillW}" height="26" rx="13" fill="${t.accentSoft}" stroke="${t.accent}"/>
  <circle cx="16" cy="13" r="4" fill="${t.accent2}"/>
  <text x="28" y="17" font-family="${MONO}" font-size="11" font-weight="600" fill="${t.accent2}">${esc(s.pill)}</text>
</g>`,
  });
}

export const outputs = (t, locale) => [`header-${locale}-${t.id}.svg`];
