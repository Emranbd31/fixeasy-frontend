export async function fetchWithAuth(path: string, options: RequestInit = {}) {
  // Default to the production backend if the env var isn't set in the deploy
  const base = (process.env.NEXT_PUBLIC_API_URL || "https://api.fixeasy.irish").trim();
  const token = typeof window !== "undefined" ? localStorage.getItem("fixeasy_admin_token") : null;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${base}${path}`, { ...options, headers });
}
