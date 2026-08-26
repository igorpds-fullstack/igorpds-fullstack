// Gera todos os painéis SVG do perfil — 2 idiomas × 2 temas — em assets/.
//
//   node scripts/build.mjs
//
// Painéis estáticos não precisam de token. Os painéis com dados usam
// METRICS_TOKEN / GH_TOKEN / GITHUB_TOKEN; sem token, os SVGs anteriores
// são preservados em vez de quebrar o build.

import { writeFile, mkdir, rm } from "node:fs/promises";
import { THEMES } from "./lib/theme.mjs";
import { LOCALES } from "./lib/i18n.mjs";

const OUT = new URL("../assets/", import.meta.url);
await mkdir(OUT, { recursive: true });

const STATIC = ["gen-header.mjs", "gen-stack.mjs", "gen-integrations.mjs"];
const DYNAMIC = ["gen-stats.mjs", "gen-activity.mjs"];

let count = 0;
const write = async (name, content) => {
  await writeFile(new URL(name, OUT), content, "utf8");
  count++;
  console.log(`  ✓ assets/${name}  (${(content.length / 1024).toFixed(1)} kB)`);
};

const renderAll = async (mods, ctx) => {
  for (const mod of mods) {
    const m = await import(`./${mod}`);
    for (const locale of LOCALES) {
      for (const t of Object.values(THEMES)) {
        await write(m.outputs(t, locale)[0], m.render(t, { ...ctx, locale }));
      }
    }
  }
};

console.log("→ painéis estáticos");
await renderAll(STATIC, {});

console.log("→ painéis com dados da API");
let data;
try {
  const { fetchProfile } = await import("./lib/github.mjs");
  data = await fetchProfile();
  console.log(
    `  ${data.totalContributions} contribuições · ${data.activeDays} dias ativos · ${data.privateContributions} privadas`
  );
} catch (err) {
  console.error(`  ! pulando painéis com dados: ${err.message}`);
}

if (data) {
  await renderAll(DYNAMIC, { data });

  // Badge dinâmico servido pelo próprio repo (schema de endpoint do shields.io).
  await write(
    "badge-updated.json",
    JSON.stringify({
      schemaVersion: 1,
      label: "painéis",
      message: new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "America/Sao_Paulo",
      }).format(new Date()),
      color: "8b5cf6",
      style: "flat-square",
    })
  );

  await write(
    "profile-data.json",
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalContributions: data.totalContributions,
        privateContributions: data.privateContributions,
        activeDays: data.activeDays,
        currentStreak: data.currentStreak,
        longestStreak: data.longestStreak,
      },
      null,
      2
    )
  );
}

console.log(`pronto — ${count} arquivos.`);
