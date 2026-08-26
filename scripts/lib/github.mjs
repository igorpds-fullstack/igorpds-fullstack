// Cliente mínimo da API do GitHub (sem dependências — fetch nativo do Node 18+).

const TOKEN =
  process.env.METRICS_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
export const USER = process.env.PROFILE_USER || "igorpdsantos";

if (!TOKEN) {
  throw new Error(
    "Nenhum token disponível. Defina METRICS_TOKEN, GH_TOKEN ou GITHUB_TOKEN."
  );
}

async function graphql(query, variables = {}) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "igorpds-profile-generator",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
  return json.data;
}

const PROFILE_QUERY = `query($login: String!) {
  user(login: $login) {
    login
    createdAt
    followers { totalCount }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        name
        isPrivate
        stargazerCount
        languages(first: 12, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      totalRepositoriesWithContributedCommits
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date weekday contributionCount } }
      }
    }
  }
}`;

export async function fetchProfile(login = USER) {
  const data = await graphql(PROFILE_QUERY, { login });
  const u = data.user;
  const c = u.contributionsCollection;
  const days = c.contributionCalendar.weeks.flatMap((w) => w.contributionDays);

  return {
    login: u.login,
    createdAt: u.createdAt,
    followers: u.followers.totalCount,
    repoCount: u.repositories.totalCount,
    stars: u.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0),
    languages: rankLanguages(u.repositories.nodes),
    commits: c.totalCommitContributions,
    prs: c.totalPullRequestContributions,
    issues: c.totalIssueContributions,
    reviews: c.totalPullRequestReviewContributions,
    reposContributed: c.totalRepositoriesWithContributedCommits,
    privateContributions: c.restrictedContributionsCount,
    totalContributions: c.contributionCalendar.totalContributions,
    weeks: c.contributionCalendar.weeks,
    days,
    activeDays: days.filter((d) => d.contributionCount > 0).length,
    busiestDay: days.reduce(
      (best, d) => (d.contributionCount > (best?.contributionCount ?? -1) ? d : best),
      null
    ),
    ...streaks(days),
  };
}

function rankLanguages(repos) {
  const totals = new Map();
  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges) {
      const prev = totals.get(node.name) || { name: node.name, color: node.color, size: 0 };
      prev.size += size;
      totals.set(node.name, prev);
    }
  }
  const list = [...totals.values()].sort((a, b) => b.size - a.size);
  const sum = list.reduce((a, l) => a + l.size, 0) || 1;
  return list.map((l) => ({ ...l, pct: (l.size / sum) * 100 }));
}

/** Streak atual (contando de trás pra frente, tolerando o dia de hoje ainda vazio). */
function streaks(days) {
  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d.contributionCount > 0 ? run + 1 : 0;
    if (run > best) best = run;
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) current++;
    else if (i === days.length - 1) continue; // hoje pode ainda não ter commit
    else break;
  }
  return { currentStreak: current, longestStreak: best };
}
