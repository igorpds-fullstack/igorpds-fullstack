import { doc, backdrop, gridDefs, txt, chipRow } from "./lib/theme.mjs";
import { S, parseChip } from "./lib/i18n.mjs";

const W = 1000;
const PAD = 40;
const CHIPS_X = PAD + 205;
const CHIPS_W = W - CHIPS_X - PAD;

export function render(t, { locale }) {
  const s = S[locale].stack;
  let y = 88;
  let body = "";

  for (const [label, items] of s.groups) {
    const row = chipRow(t, CHIPS_X, y, CHIPS_W, items.map(parseChip));
    const mid = y + row.height / 2;
    body += `<rect x="${PAD}" y="${mid - 8}" width="3" height="16" rx="1.5" fill="${t.accent}" opacity="0.6"/>`;
    body += txt(PAD + 13, mid + 4, label, { size: 13, fill: t.text, weight: 600 });
    body += row.svg;
    y += row.height + 22;
  }

  const noteY = y + 8;
  const H = noteY + 44;

  return doc({
    w: W,
    h: H,
    defs: gridDefs(t, { cell: 30, glowX: "92%", glowY: "4%" }),
    style: "",
    body: `
${backdrop(t, W, H)}
${txt(PAD, 46, s.title, { size: 12, weight: 700, fill: t.text })}
${txt(PAD + 62, 46, s.note, { size: 12, fill: t.dim })}
<rect x="${PAD}" y="60" width="${W - PAD * 2}" height="1" fill="${t.border}"/>
${body}
<rect x="${PAD}" y="${noteY}" width="${W - PAD * 2}" height="1" fill="${t.border}"/>
<circle cx="${PAD + 5}" cy="${noteY + 26}" r="4" fill="${t.accent2}"/>
${txt(PAD + 18, noteY + 30, s.footer, { size: 11.5, fill: t.muted })}`,
  });
}

export const outputs = (t, locale) => [`stack-${locale}-${t.id}.svg`];
