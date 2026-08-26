// CI de veracidade do perfil.
//
// Regra pessoal: nunca apresentar como experiência profissional aquilo que foi
// só estudo, contato pontual ou stack de outra pessoa da equipe. Currículo
// inflacionado é fácil de escrever e difícil de sustentar numa entrevista
// técnica — então isso vira teste, e não força de vontade.
//
// Uso: node scripts/check-veracity.mjs [arquivos...]

import { readFile } from "node:fs/promises";

const FILES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["README.md", "README.en.md"];

// Nunca listar como competência — nem dentro de bloco de conhecimento.
const NEVER = [
  { re: /\bASP\.NET\b/gi, label: "ASP.NET" },
  { re: /(?<![\w.])\.NET\b/gi, label: ".NET" },
  { re: /(?<![\w+#])C#(?![\w+])/g, label: "C#" },
  { re: /\bPython\b/gi, label: "Python" },
];

// Só pode aparecer dentro de <!-- veracity:knowledge --> … <!-- /veracity:knowledge -->
const KNOWLEDGE_ONLY = [
  { re: /\bJava\b(?!Script)/g, label: "Java" },
  { re: /\bSpring(\s?Boot)?\b/gi, label: "Spring / Spring Boot" },
  { re: /\bmicrossservi[çc]os\b|\bmicroservices\b/gi, label: "microsserviços" },
  { re: /\bNode(\.js)?\b/gi, label: "Node.js" },
  { re: /\bAngular\b/gi, label: "Angular" },
  { re: /\bPHP\b/g, label: "PHP" },
];

// Títulos que exageram a relação com IA.
const NEVER_TITLES = [
  { re: /\bAI Engineer\b/gi, label: "AI Engineer" },
  { re: /\bML Engineer\b/gi, label: "ML Engineer" },
  { re: /\bPrompt Engineer\b/gi, label: "Prompt Engineer" },
  { re: /especialista em LLM/gi, label: "especialista em LLM" },
  { re: /\bLLM (specialist|expert)\b/gi, label: "LLM specialist" },
];

/** Remove o que não é afirmação sobre a carreira: URLs, imagens, código, âncoras. */
function prose(md) {
  return md
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<source[^>]*>/gi, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\]\([^)]*\)/g, "] ")
    .replace(/igorpdsantos|igorpds-fullstack/g, " ");
}

/** Marca as faixas protegidas por <!-- veracity:knowledge --> com espaços. */
function stripKnowledgeBlocks(text) {
  return text.replace(
    /<!--\s*veracity:knowledge\s*-->[\s\S]*?<!--\s*\/veracity:knowledge\s*-->/g,
    (m) => m.replace(/[^\n]/g, " ")
  );
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

const violations = [];

for (const file of FILES) {
  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    continue; // arquivo opcional (ex.: README.en.md ainda não existe)
  }

  const cleaned = prose(raw);
  const outsideKnowledge = stripKnowledgeBlocks(cleaned);

  const scan = (rules, haystack, reason) => {
    for (const { re, label } of rules) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(haystack)) !== null) {
        violations.push({ file, line: lineOf(haystack, m.index), label, reason });
        if (!re.global) break;
      }
    }
  };

  scan(NEVER, cleaned, "nunca listar como competência");
  scan(NEVER_TITLES, cleaned, "título que exagera a relação com IA");
  scan(
    KNOWLEDGE_ONLY,
    outsideKnowledge,
    "só conhecimento — precisa estar dentro de <!-- veracity:knowledge -->"
  );
}

if (violations.length === 0) {
  console.log("✓ veracidade ok — nada apresentado como experiência que não seja.");
  process.exit(0);
}

console.error(`✗ ${violations.length} afirmação(ões) fora da regra de veracidade:\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  "${v.label}" — ${v.reason}`);
}
console.error(
  "\nCorrija o texto ou mova a menção para dentro de um bloco:\n" +
    "  <!-- veracity:knowledge -->\n  …\n  <!-- /veracity:knowledge -->"
);
process.exit(1);
