import { NextResponse } from "next/server";

const DEFAULT_STATUS_URL = "https://fixeasy-backend.onrender.com/status";

const BACKEND_STATUS_URL =
  process.env.BACKEND_STATUS_URL ??
  process.env.NEXT_PUBLIC_BACKEND_STATUS_URL ??
  DEFAULT_STATUS_URL;

const HEALTHY_MESSAGE_MATCHERS = [
  "backend is live",
  "backend active",
];

const HEALTHY_STATUS_MATCHERS = ["ok", "healthy", "up"];

type AnyRecord = Record<string, unknown>;

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(BACKEND_STATUS_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });

    const status = res.status;
    const bodyText = await res.text().catch(() => "");

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status,
          body: bodyText.slice(0, 200),
        },
        { status: 200 },
      );
    }

    let parsed: unknown = null;
    if (bodyText) {
      try {
        parsed = JSON.parse(bodyText);
      } catch {
        // non-JSON payloads are allowed; we'll inspect the raw text below
      }
    }

    const isHealthy = evaluateHealth(parsed, bodyText);

    return NextResponse.json(
      {
        ok: isHealthy,
        status,
        body: parsed ?? bodyText,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error checking backend";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      {
        status: message.includes("The operation was aborted") ? 504 : 500,
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}

function evaluateHealth(payload: unknown, raw: string): boolean {
  if (isRecord(payload)) {
    if (payload.ok === true) {
      return true;
    }
    if (payload.healthy === true) {
      return true;
    }

    if (typeof payload.status === "string") {
      if (isStringHealthy(payload.status)) {
        return true;
      }
    }

    if (typeof payload.message === "string") {
      if (isMessageHealthy(payload.message)) {
        return true;
      }
    }
  }

  if (typeof raw === "string" && raw.length > 0) {
    if (isMessageHealthy(raw)) {
      return true;
    }
  }

  return false;
}

function isMessageHealthy(message: string): boolean {
  const normalized = message.toLowerCase();
  return HEALTHY_MESSAGE_MATCHERS.some((matcher) =>
    normalized.includes(matcher),
  );
}

function isStringHealthy(value: string): boolean {
  const normalized = value.toLowerCase();
  return HEALTHY_STATUS_MATCHERS.some((matcher) =>
    normalized.includes(matcher),
  );
}

function isRecord(value: unknown): value is AnyRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
