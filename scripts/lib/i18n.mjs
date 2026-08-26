// Strings dos painéis, PT + EN. Espelha a regra do portfólio: nada de copy
// solta dentro do gerador, e os dois idiomas sempre em sincronia.

export const LOCALES = ["pt", "en"];

export const S = {
  pt: {
    header: {
      whoami: "whoami",
      role: "Software Engineer  ·  São Paulo, Brasil",
      pill: "5 anos · produção",
      rotate: [
        "sistemas reais em produção — não protótipos",
        "React · React Native · TypeScript",
        "integrações e automação em Azure · APIs REST",
        "Bubble.io · SQL · dados que precisam bater",
      ],
    },
    stack: {
      title: "STACK",
      note: "// organizada por capacidade, não por parede de logos",
      footer:
        "destacado = especialidade  ·  tudo nesta lista é experiência profissional em produção, não estudo",
      groups: [
        ["Produto & aplicação", ["React*", "TypeScript*", "Next.js", "JavaScript", "Tailwind CSS"]],
        ["Mobile", ["React Native*", "Expo", "offline-first", "push notifications", "publicação nas lojas"]],
        [
          "Integração & automação",
          ["APIs REST*", "Azure Logic Apps*", "Azure API Management*", "webhooks", "Asaas", "Celcoin", "Vindi", "reprocessamento", "troubleshooting"],
        ],
        ["Low-code engineering", ["Bubble.io*", "workflows complexos", "plugins customizados", "performance", "data types"]],
        ["Dados", ["SQL*", "SQL Server", "PostgreSQL", "modelagem", "conciliação", "Power BI"]],
        ["Workflow", ["Claude Code*", "Git / GitHub", "Scrum", "ClickUp", "Postman", "Figma"]],
      ],
    },
    integrations: {
      title: "O QUE EU CONSTRUO",
      note: "// o desenho recorrente do meu trabalho: produto na ponta, integração no meio, dinheiro no fim",
      cols: ["Canais enterprise", "Produto", "Camada de integração", "Serviços & dados"],
      channelSub: "canal de venda",
      boxes: {
        portal: ["Portal de vendas", "Bubble.io"],
        mobile: ["App mobile", "React Native + Expo"],
        web: ["Web", "React · Next.js · TS"],
        apim: ["Azure API Management", "auth · chaves · rate limit"],
        logic: ["Azure Logic Apps", "orquestração · retry"],
      },
      securityLabel: "segurança:",
      securityText:
        "criptografia · gestão de chaves no API Management · segregação de ambientes · trilha de auditoria",
      caption:
        "aprovado no padrão de segurança exigido por um banco — foi isso que viabilizou o canal enterprise",
    },
    stats: {
      title: "GITHUB EM NÚMEROS",
      note: "// gerado por workflow próprio, direto da API — sem serviço de terceiro",
      tiles: [
        ["contribuições", "últimos 12 meses"],
        ["dias ativos", "no período"],
        ["sequência atual", "dias seguidos"],
        ["maior sequência", "dias seguidos"],
        ["melhor dia", null],
      ],
      privateNote: (pct) => `${pct}% das contribuições são em repositórios privados de clientes`,
      cta: "o que dá pra mostrar está em igorsantos.dev →",
    },
    activity: {
      title: "ATIVIDADE",
      note: (avg) => `// ${avg} contribuições por semana, em média`,
      days: "365 dias",
      less: "menos",
      more: "mais",
      months: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
      weekdays: ["", "seg", "", "qua", "", "sex", ""],
      tooltip: (n, d) => `${n} em ${d}`,
    },
  },

  en: {
    header: {
      whoami: "whoami",
      role: "Software Engineer  ·  São Paulo, Brazil",
      pill: "5 yrs · production",
      rotate: [
        "real systems in production — not prototypes",
        "React · React Native · TypeScript",
        "Azure integrations & automation · REST APIs",
        "Bubble.io · SQL · data that has to reconcile",
      ],
    },
    stack: {
      title: "STACK",
      note: "// grouped by capability, not by a wall of logos",
      footer:
        "highlighted = strongest  ·  everything listed here is professional production experience, not study",
      groups: [
        ["Product & app", ["React*", "TypeScript*", "Next.js", "JavaScript", "Tailwind CSS"]],
        ["Mobile", ["React Native*", "Expo", "offline-first", "push notifications", "store releases"]],
        [
          "Integration & automation",
          ["REST APIs*", "Azure Logic Apps*", "Azure API Management*", "webhooks", "Asaas", "Celcoin", "Vindi", "reprocessing", "troubleshooting"],
        ],
        ["Low-code engineering", ["Bubble.io*", "complex workflows", "custom plugins", "performance", "data types"]],
        ["Data", ["SQL*", "SQL Server", "PostgreSQL", "modelling", "reconciliation", "Power BI"]],
        ["Workflow", ["Claude Code*", "Git / GitHub", "Scrum", "ClickUp", "Postman", "Figma"]],
      ],
    },
    integrations: {
      title: "WHAT I BUILD",
      note: "// the shape my work keeps taking: product at the edge, integration in the middle, money at the end",
      cols: ["Enterprise channels", "Product", "Integration layer", "Services & data"],
      channelSub: "sales channel",
      boxes: {
        portal: ["Sales portal", "Bubble.io"],
        mobile: ["Mobile app", "React Native + Expo"],
        web: ["Web", "React · Next.js · TS"],
        apim: ["Azure API Management", "auth · keys · rate limit"],
        logic: ["Azure Logic Apps", "orchestration · retry"],
      },
      securityLabel: "security:",
      securityText:
        "encryption · key management in API Management · environment segregation · audit trail",
      caption:
        "cleared the security bar a bank requires — that is what unlocked the enterprise channel",
    },
    stats: {
      title: "GITHUB BY THE NUMBERS",
      note: "// generated by my own workflow, straight from the API — no third-party service",
      tiles: [
        ["contributions", "last 12 months"],
        ["active days", "in the period"],
        ["current streak", "days in a row"],
        ["longest streak", "days in a row"],
        ["best day", null],
      ],
      privateNote: (pct) => `${pct}% of contributions live in private client repositories`,
      cta: "what I can show is at igorsantos.dev →",
    },
    activity: {
      title: "ACTIVITY",
      note: (avg) => `// ${avg} contributions per week on average`,
      days: "365 days",
      less: "less",
      more: "more",
      months: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
      weekdays: ["", "mon", "", "wed", "", "fri", ""],
      tooltip: (n, d) => `${n} on ${d}`,
    },
  },
};

/** "React*" → {label:'React', tone:'accent'} */
export const parseChip = (s) =>
  s.endsWith("*") ? { label: s.slice(0, -1), tone: "accent" } : s;
