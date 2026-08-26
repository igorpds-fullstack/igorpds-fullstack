import { MONO, doc, backdrop, gridDefs, txt, esc } from "./lib/theme.mjs";
import { S } from "./lib/i18n.mjs";

const W = 1000;
const H = 428;

const colsFor = (s) => [
  {
    x: 36,
    w: 176,
    label: s.cols[0],
    top: 84,
    boxH: 46,
    gap: 14,
    boxes: [
      { title: "Itaú", sub: s.channelSub },
      { title: "Unimed", sub: s.channelSub },
      { title: "Assaí", sub: s.channelSub },
      { title: "Pluxee", sub: s.channelSub },
    ],
  },
  {
    x: 252,
    w: 200,
    label: s.cols[1],
    top: 114,
    boxH: 46,
    gap: 14,
    boxes: [
      { title: s.boxes.portal[0], sub: s.boxes.portal[1] },
      { title: s.boxes.mobile[0], sub: s.boxes.mobile[1] },
      { title: s.boxes.web[0], sub: s.boxes.web[1] },
    ],
  },
  {
    x: 500,
    w: 228,
    label: s.cols[2],
    top: 123,
    boxH: 64,
    gap: 20,
    accent: true,
    boxes: [
      { title: s.boxes.apim[0], sub: s.boxes.apim[1] },
      { title: s.boxes.logic[0], sub: s.boxes.logic[1] },
    ],
  },
  {
    x: 764,
    w: 200,
    label: s.cols[3],
    top: 81,
    boxH: 32,
    gap: 8,
    boxes: [
      { title: "Asaas", sub: "" },
      { title: "Celcoin", sub: "" },
      { title: "Vindi", sub: "" },
      { title: "SutHub", sub: "" },
      { title: "SQL Server", sub: "" },
      { title: "Power BI", sub: "" },
    ],
  },
];

const boxY = (c, i) => c.top + i * (c.boxH + c.gap);
const boxMid = (c, i) => boxY(c, i) + c.boxH / 2;

function box(t, c, b, i) {
  const y = boxY(c, i);
  const accent = c.accent;
  const hasSub = Boolean(b.sub);
  const titleY = hasSub ? y + c.boxH / 2 - 3 : y + c.boxH / 2 + 4;
  return `<g>
<rect x="${c.x}" y="${y}" width="${c.w}" height="${c.boxH}" rx="9" fill="${accent ? t.accentSoft : t.panel}" stroke="${accent ? t.accent : t.border}"/>
${accent ? `<rect x="${c.x}" y="${y + 10}" width="3" height="${c.boxH - 20}" rx="1.5" fill="${t.accent2}"/>` : ""}
<text x="${c.x + (accent ? 16 : 13)}" y="${titleY}" font-family="${MONO}" font-size="12.5" font-weight="600" fill="${accent ? t.accent2 : t.text}">${esc(b.title)}</text>
${hasSub ? `<text x="${c.x + (accent ? 16 : 13)}" y="${y + c.boxH / 2 + 14}" font-family="${MONO}" font-size="10.5" fill="${t.muted}">${esc(b.sub)}</text>` : ""}
</g>`;
}

function curve(x1, y1, x2, y2) {
  const d = (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + d} ${y1}, ${x2 - d} ${y2}, ${x2} ${y2}`;
}

export function render(t, { locale }) {
  const s = S[locale].integrations;
  const COLS = colsFor(s);
  const [c1, c2, c3, c4] = COLS;
  const links = [];

  // canais -> portal de vendas
  c1.boxes.forEach((_, i) =>
    links.push(curve(c1.x + c1.w, boxMid(c1, i), c2.x, boxMid(c2, 0)))
  );
  // produto -> API Management
  c2.boxes.forEach((_, i) =>
    links.push(curve(c2.x + c2.w, boxMid(c2, i), c3.x, boxMid(c3, 0)))
  );
  // Logic Apps -> serviços
  c4.boxes.forEach((_, i) =>
    links.push(curve(c3.x + c3.w, boxMid(c3, 1), c4.x, boxMid(c4, i)))
  );

  const paths = links
    .map(
      (d, i) =>
        `<path id="lk${i}" d="${d}" stroke="${t.dim}" stroke-width="1.25" fill="none" opacity="0.5"/>`
    )
    .join("\n");

  // APIM -> Logic Apps (vertical, dentro da coluna de integração)
  const vx = c3.x + c3.w / 2;
  const vy1 = boxY(c3, 0) + c3.boxH;
  const vy2 = boxY(c3, 1);
  const vertical = `<path id="lkv" d="M ${vx} ${vy1} L ${vx} ${vy2}" stroke="${t.accent}" stroke-width="1.5" fill="none" opacity="0.65"/>
<polygon points="${vx - 4},${vy2 - 6} ${vx + 4},${vy2 - 6} ${vx},${vy2}" fill="${t.accent}" opacity="0.8"/>`;

  // pacotes animados em rotas representativas
  const routes = [1, 3, 5, 7, 9, 12];
  const packets = routes
    .map(
      (r, i) => `<circle r="3" fill="${t.accent2}" class="pkt">
  <animateMotion dur="3.6s" begin="${(i * 0.55).toFixed(2)}s" repeatCount="indefinite" rotate="auto">
    <mpath href="#lk${r}" xlink:href="#lk${r}"/>
  </animateMotion>
</circle>`
    )
    .join("\n");

  const headers = COLS.map((c) =>
    `<rect x="${c.x}" y="${47}" width="3" height="12" rx="1.5" fill="${t.accent}" opacity="${c.accent ? 1 : 0.5}"/>
<text x="${c.x + 10}" y="${57}" font-family="${MONO}" font-size="10.5" font-weight="600" letter-spacing="1.1" fill="${c.accent ? t.accent2 : t.muted}">${esc(c.label.toUpperCase())}</text>`
  ).join("\n");

  const boxes = COLS.map((c) => c.boxes.map((b, i) => box(t, c, b, i)).join("\n")).join("\n");

  return doc({
    w: W,
    h: H,
    defs: gridDefs(t, { cell: 30, glowX: "55%", glowY: "10%" }),
    style: `
.pkt{opacity:0.95}
@media (prefers-reduced-motion: reduce){.pkt{display:none}}`,
    body: `
${backdrop(t, W, H)}
${txt(36, 30, s.title, { size: 12, weight: 700, fill: t.text })}
${txt(36 + 8 + s.title.length * 7.4, 30, s.note, { size: 11.5, fill: t.dim })}
${headers}
<g opacity="${t.id === "dark" ? 0.9 : 1}">${paths}</g>
${vertical}
${packets}
${boxes}
<rect x="36" y="${H - 62}" width="${W - 72}" height="1" fill="${t.border}"/>
${txt(36, H - 34, s.securityLabel, { size: 11.5, fill: t.accent2, weight: 600 })}
${txt(36 + 10 + s.securityLabel.length * 7, H - 34, s.securityText, { size: 11.5, fill: t.muted })}
${txt(36, H - 16, s.caption, { size: 11, fill: t.dim })}`,
  });
}

export const outputs = (t, locale) => [`integrations-${locale}-${t.id}.svg`];
