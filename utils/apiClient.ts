export async function fetchWithAuth(path: string, options: RequestInit = {}) {
  // Default to the configured backend or fall back to the canonical API host.
  const configured = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  const canonical = "https://api.fixeasy.irish";
  const bases = [] as string[];
  // In development prefer local backend so the frontend can call http://127.0.0.1:8000
  // This avoids needing to set NEXT_PUBLIC_API_URL for dev runs.
  if (process.env.NODE_ENV !== "production") {
    bases.push("http://127.0.0.1:8000");
  }
  if (configured) bases.push(configured.replace(/\/$/, ""));
  // Always try canonical as a fallback
  if (!bases.includes(canonical)) bases.push(canonical);

  const token = typeof window !== "undefined" ? localStorage.getItem("fixeasy_admin_token") : null;
  const baseHeaders = (options.headers as Record<string, string> | undefined) || {};
  if (token) baseHeaders["Authorization"] = `Bearer ${token}`;

  // Try each base in order until one returns a successful response.
  let lastErr: any = null;
  for (const base of bases) {
    try {
      const res = await fetch(`${base}${path}`, { ...options, headers: baseHeaders });
      // Treat 2xx and 3xx as OK; otherwise try next base
      if (res && (res.status >= 200 && res.status < 400)) {
        return res;
      }
      lastErr = res;
    } catch (e) {
      lastErr = e;
    }
  }

  // If we get here, all attempts failed — throw the last error/response so callers can handle it.
  if (lastErr instanceof Response) {
    return lastErr; // return Response object (non-ok)
  }
  throw lastErr;
}
