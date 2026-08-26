import { doc, backdrop, gridDefs, txt, esc } from "./lib/theme.mjs";
import { S } from "./lib/i18n.mjs";

const W = 1000;
const PAD = 40;
const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const GRID_X = PAD + 26;
const GRID_Y = 84;

export function render(t, { locale, data }) {
  const s = S[locale].activity;
  const MONTHS = s.months;
  const WEEKDAYS = s.weekdays;
  const weeks = data.weeks;
  const max = Math.max(1, ...data.days.map((d) => d.contributionCount));

  const level = (n) => {
    if (n <= 0) return 0;
    const r = n / max;
    if (r <= 0.25) return 1;
    if (r <= 0.5) return 2;
    if (r <= 0.75) return 3;
    return 4;
  };

  let cells = "";
  let monthLabels = "";
  let lastMonth = -1;

  weeks.forEach((week, wi) => {
    const x = GRID_X + wi * STEP;
    const first = week.contributionDays[0];
    if (first) {
      const m = Number(first.date.slice(5, 7)) - 1;
      if (m !== lastMonth && wi < weeks.length - 1) {
        monthLabels += txt(x, GRID_Y - 10, MONTHS[m], { size: 10, fill: t.dim });
        lastMonth = m;
      }
    }
    week.contributionDays.forEach((day) => {
      const y = GRID_Y + day.weekday * STEP;
      const lv = level(day.contributionCount);
      const delay = ((wi * 7 + day.weekday) * 0.9).toFixed(0);
      cells += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5" fill="${t.ramp[lv]}"${lv === 0 ? ` stroke="${t.border}" stroke-width="0.5"` : ""} class="c" style="animation-delay:${delay}ms"><title>${esc(s.tooltip(day.contributionCount, day.date))}</title></rect>`;
    });
  });

  const weekdayLabels = WEEKDAYS.map((d, i) =>
    d ? txt(PAD, GRID_Y + i * STEP + 9, d, { size: 9.5, fill: t.dim }) : ""
  ).join("");

  const gridBottom = GRID_Y + 7 * STEP;
  const legendY = gridBottom + 24;
  const legendX = W - PAD - 136;
  const legend =
    txt(legendX, legendY, s.less, { size: 10, fill: t.dim }) +
    t.ramp
      .map(
        (c, i) =>
          `<rect x="${legendX + 34 + i * (CELL + 3)}" y="${legendY - 9}" width="${CELL}" height="${CELL}" rx="2.5" fill="${c}"${i === 0 ? ` stroke="${t.border}" stroke-width="0.5"` : ""}/>`
      )
      .join("") +
    txt(legendX + 110, legendY, s.more, { size: 10, fill: t.dim });

  const weeksCount = weeks.length || 1;
  const avg = (data.totalContributions / weeksCount).toFixed(1).replace(".", locale === "pt" ? "," : ".");

  const H = legendY + 28;

  return doc({
    w: W,
    h: H,
    defs: gridDefs(t, { cell: 30, glowX: "80%", glowY: "0%" }),
    style: `
.c{transform-box:fill-box;transform-origin:center;animation:pop .55s cubic-bezier(.16,1,.3,1)}
@keyframes pop{from{transform:scale(.25)}to{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.c{animation:none}}`,
    body: `
${backdrop(t, W, H)}
${txt(PAD, 40, s.title, { size: 12, weight: 700, fill: t.text })}
${txt(PAD + 10 + s.title.length * 7.4, 40, s.note(avg), { size: 11.5, fill: t.dim })}
${txt(W - PAD, 40, s.days, { size: 11, fill: t.muted, anchor: "end" })}
<rect x="${PAD}" y="54" width="${W - PAD * 2}" height="1" fill="${t.border}"/>
${monthLabels}
${weekdayLabels}
${cells}
${legend}`,
  });
}

export const outputs = (t, locale) => [`activity-${locale}-${t.id}.svg`];
