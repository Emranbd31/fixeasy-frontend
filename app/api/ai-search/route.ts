import { NextResponse } from 'next/server';

import { MAIN_SERVICES, SUB_SERVICES } from '@/lib/service-options';

export const dynamic = 'force-dynamic';

type AiSearchResult = {
  service: string | null;
  subService: string | null;
  location: string | null;
  confidence: number; // 0..1
};

const normalize = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[_\-]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');

const KEYWORDS: Record<string, string[]> = {
  Plumbing: ['leak', 'blocked', 'pipe', 'tap', 'drain', 'water', 'toilet', 'sink'],
  Electrician: ['socket', 'switch', 'light', 'power', 'trip', 'fuse', 'breaker'],
  'Boiler Service': ['boiler', 'heating', 'radiator', 'hot water'],
  Locksmith: ['lock', 'key', 'door', 'locked out'],
  Cleaning: ['clean', 'deep clean', 'mop', 'vacuum'],
  Handyman: ['repair', 'fix', 'assemble', 'mount'],
  Painting: ['paint', 'repaint', 'wall', 'ceiling'],
  Gardening: ['garden', 'lawn', 'hedge', 'trim'],
  Moving: ['move', '搬', 'removal', 'van'],
};

function allCandidates() {
  const all: Array<{ service: string; subService?: string; tokens: string[] }> = [];
  for (const svc of MAIN_SERVICES) {
    const subs = SUB_SERVICES[svc] ?? [];
    all.push({
      service: svc,
      tokens: [svc, ...(KEYWORDS[svc] ?? [])].map(normalize),
    });
    for (const sub of subs) {
      all.push({
        service: svc,
        subService: sub,
        tokens: [svc, sub, ...(KEYWORDS[svc] ?? [])].map(normalize),
      });
    }
  }
  return all;
}

function localDeterministicParse(query: string): AiSearchResult {
  const q = normalize(query);
  if (!q) return { service: null, subService: null, location: null, confidence: 0 };

  const candidates = allCandidates();

  let best: { service: string; subService?: string; score: number } | null = null;

  for (const c of candidates) {
    let score = 0;
    for (const token of c.tokens) {
      if (!token) continue;
      if (q === token) score += 4;
      else if (q.includes(token)) score += 2;
      else {
        const parts = token.split(' ');
        if (parts.some((p) => p && q.includes(p))) score += 1;
      }
    }
    // Small boost for exact service name presence
    if (q.includes(normalize(c.service))) score += 3;
    if (c.subService && q.includes(normalize(c.subService))) score += 2;

    if (!best || score > best.score) {
      best = { service: c.service, subService: c.subService, score };
    }
  }

  if (!best || best.score <= 2) {
    return { service: null, subService: null, location: null, confidence: 0.2 };
  }

  // Map score to a conservative confidence
  const confidence = Math.min(0.95, 0.35 + best.score / 15);

  return {
    service: best.service,
    subService: best.subService ?? null,
    location: null,
    confidence,
  };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const query = typeof body?.query === 'string' ? body.query : '';

  // Note: This route is designed to be AI-backed, but we keep it deterministic
  // unless an AI provider is configured. This meets the "fast and deterministic" constraint.
  // If you later add an AI provider key, you can replace this with an LLM call.

  const result = localDeterministicParse(query);

  return NextResponse.json(result, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
