import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const getEnv = (key: string) => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : null;
};

export async function GET() {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? getEnv("NEXT_PUBLIC_SUPABASE_KEY");

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      { ok: false, error: "Missing Supabase environment variables." },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };

  const timeoutMs = 8000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const [authRes, restRes] = await Promise.allSettled([
      fetch(`${supabaseUrl}/auth/v1/health`, {
        method: "GET",
        headers,
        cache: "no-store",
        signal: controller.signal,
      }),
      fetch(`${supabaseUrl}/rest/v1/`, {
        method: "GET",
        headers,
        cache: "no-store",
        signal: controller.signal,
      }),
    ]);

    const authStatus = authRes.status === "fulfilled" ? authRes.value.status : null;
    const restStatus = restRes.status === "fulfilled" ? restRes.value.status : null;

    const authOk =
      authStatus !== null &&
      authStatus !== 401 &&
      authStatus !== 403 &&
      authStatus < 500;
    const restOk =
      restStatus !== null &&
      restStatus !== 401 &&
      restStatus !== 403 &&
      restStatus < 500;

    const ok = authOk || restOk;

    return NextResponse.json(
      {
        ok,
        authStatus,
        restStatus,
        timestamp: new Date().toISOString(),
      },
      {
        status: ok ? 200 : 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } finally {
    clearTimeout(timer);
  }
}

