type ProbeResult = { ok: true; baseURL: string } | { ok: false; errors: Array<{ baseURL: string; error: string }> };

const CANDIDATES = [
  "http://127.0.0.1:3001",
  "http://localhost:3001",
  "http://host.docker.internal:3001",
  "http://172.17.0.1:3001",
] as const;

const REQUEST_TIMEOUT_MS = 10_000;
const RETRIES_PER_CANDIDATE = 3;
const RETRY_DELAY_MS = 500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      // Avoid cached/bundled behavior in some proxies
      headers: { "cache-control": "no-cache" },
    });
    return res;
  } finally {
    clearTimeout(id);
  }
};

export async function probeBaseURL(): Promise<ProbeResult> {
  const errors: Array<{ baseURL: string; error: string }> = [];

  const candidates: string[] = [];
  if (process.env.PW_BASE_URL) candidates.push(process.env.PW_BASE_URL);
  candidates.push(...CANDIDATES);

  const seen = new Set<string>();
  const uniqueCandidates = candidates.filter((c) => (seen.has(c) ? false : (seen.add(c), true)));

  for (const baseURL of uniqueCandidates) {
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= RETRIES_PER_CANDIDATE; attempt++) {
      try {
        const res = await fetchWithTimeout(`${baseURL}/`, REQUEST_TIMEOUT_MS);
        if (res.ok) return { ok: true, baseURL };
        lastError = `HTTP ${res.status}`;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
      }

      if (attempt < RETRIES_PER_CANDIDATE) {
        await sleep(RETRY_DELAY_MS);
      }
    }

    errors.push({ baseURL, error: lastError ?? "Unknown error" });
  }

  return { ok: false, errors };
}
