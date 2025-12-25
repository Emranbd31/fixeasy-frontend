export type SmartSuggestion = {
  service: string;
  subService?: string;
  descriptor: string;
  score: number;
};

export type SmartSearchIndexItem = {
  service: string;
  subService?: string;
  descriptor: string;
  tokens: string[];
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[_\-]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

const splitTokens = (value: string) => {
  const v = normalize(value);
  return v ? v.split(" ").filter(Boolean) : [];
};

const scoreText = (query: string, text: string) => {
  if (!query) return 0;
  if (text === query) return 110;
  if (text.startsWith(query)) return 95;
  if (text.includes(query)) return 70;
  return 0;
};

const scoreTokens = (queryTokens: string[], itemTokens: string[]) => {
  let s = 0;
  for (const q of queryTokens) {
    for (const t of itemTokens) {
      const part = scoreText(q, t);
      if (part) {
        s += part;
        break;
      }
    }
  }
  return s;
};

export function buildSmartSearchIndex(input: {
  mainServices: string[];
  subServicesByService: Record<string, string[]>;
  keywordAliasesByService?: Record<string, string[]>;
  serviceDescriptors?: Record<string, string>;
}): SmartSearchIndexItem[] {
  const keywordAliasesByService = input.keywordAliasesByService ?? {};
  const serviceDescriptors = input.serviceDescriptors ?? {};
  const index: SmartSearchIndexItem[] = [];

  for (const service of input.mainServices) {
    const aliases = keywordAliasesByService[service] ?? [];
    const descriptor = serviceDescriptors[service] ?? "";

    index.push({
      service,
      descriptor: descriptor || service,
      tokens: Array.from(new Set([service, descriptor, ...aliases].flatMap(splitTokens))),
    });

    const subs = input.subServicesByService[service] ?? [];
    for (const sub of subs) {
      index.push({
        service,
        subService: sub,
        descriptor: sub,
        tokens: Array.from(new Set([service, sub, descriptor, ...aliases].flatMap(splitTokens))),
      });
    }
  }

  return index;
}

export function getSmartSuggestions(
  queryRaw: string,
  index: SmartSearchIndexItem[],
  opts?: { limit?: number }
): SmartSuggestion[] {
  const limit = opts?.limit ?? 5;
  const q = normalize(queryRaw);
  if (!q) return [];

  const queryTokens = q.split(" ").filter(Boolean);
  const scoreBoostKeywords = new Set(queryTokens);

  const scored: SmartSuggestion[] = [];

  for (const item of index) {
    const itemService = normalize(item.service);
    const itemSub = item.subService ? normalize(item.subService) : "";
    const serviceScore = scoreText(q, itemService);
    const subScore = itemSub ? scoreText(q, itemSub) : 0;
    const tokenScore = scoreTokens(queryTokens, item.tokens);

    let score = Math.max(serviceScore, subScore) + tokenScore;

    // Simple intent boost: if query contains words like leak/socket/boiler etc
    // they will likely be present in tokens via aliases.
    for (const token of item.tokens) {
      if (scoreBoostKeywords.has(token)) {
        score += 15;
      }
    }

    if (score <= 0) continue;

    scored.push({
      service: item.service,
      subService: item.subService,
      descriptor: item.subService ? item.subService : item.descriptor,
      score,
    });
  }

  // Deduplicate by (service + subService)
  const dedup = new Map<string, SmartSuggestion>();
  for (const s of scored) {
    const key = `${s.service}::${s.subService ?? ""}`;
    const existing = dedup.get(key);
    if (!existing || s.score > existing.score) dedup.set(key, s);
  }

  return Array.from(dedup.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
