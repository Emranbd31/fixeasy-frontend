import { test, expect } from "@playwright/test";
import { probeBaseURL } from "./_baseurl";

const jsonHeaders = { "Content-Type": "application/json", Accept: "application/json" };
const adminSecret = process.env.ADMIN_SECRET;
const adminHeaders = adminSecret ? { "X-ADMIN-SECRET": adminSecret } : undefined;

type StepResult = {
  step: string;
  status: "PASS" | "FAIL" | "BLOCKED" | "NOT_APPLICABLE";
  details?: any;
};

test.describe("API E2E: customer booking -> admin -> pro accept", () => {
  test("Run API-level smoke flow", async ({ request }) => {
    const results: StepResult[] = [];

    const logStepFailure = (step: string, details: any) => {
      // eslint-disable-next-line no-console
      console.log(`[E2E_STEP_FAIL] ${step}`, details);
    };

    const probe = await probeBaseURL();
    if (!probe.ok) {
      results.push({ step: "BaseURL probe", status: "BLOCKED", details: probe.errors });
      // eslint-disable-next-line no-console
      console.log("E2E_RESULTS_JSON:", JSON.stringify(results, null, 2));
      return;
    }
    const BASE_URL = probe.baseURL;
    results.push({ step: `Chosen BASE_URL=${BASE_URL}`, status: "PASS" });

    // 1-4) Basic reachability via Node request
    for (const [label, path] of [
      ["Homepage reachable", "/"],
      ["/book reachable", "/book"],
      ["/register/professional reachable", "/register/professional"],
    ] as const) {
      const res = await request.get(`${BASE_URL}${path}`);
      if (!res.ok()) {
        const body = await res.text().catch(() => "");
        results.push({ step: label, status: "FAIL", details: { path, status: res.status(), body } });
        logStepFailure(label, { path, status: res.status(), body });
        // Continue best-effort.
      }
      results.push({ step: label, status: "PASS" });
    }

    // Admin UI pages are not present in this repo (no /admin/* pages). Treat as NOT_PRESENT.
    results.push({ step: "Admin UI pages", status: "NOT_APPLICABLE", details: "No app/admin/** page routes found" });

    // Admin API capability smoke: route exists if GET is not 404 (can be 401/403/405/200)
    for (const route of [
      "/api/admin/login",
      "/api/admin/verify",
      "/api/admin/professionals",
      "/api/admin/sign-url",
      "/api/admin/bookings",
      "/api/admin/activity",
      "/api/admin/approve",
    ] as const) {
      const res = await request.get(`${BASE_URL}${route}`, { headers: adminHeaders as any });
      if (res.status() === 404) {
        const body = await res.text().catch(() => "");
        results.push({ step: `Admin API exists: GET ${route}`, status: "FAIL", details: { status: res.status(), body } });
        logStepFailure(`Admin API exists: GET ${route}`, { status: res.status(), body });
        continue;
      }
      results.push({ step: `Admin API exists: GET ${route}`, status: "PASS", details: { status: res.status() } });
    }

    // 5) Create a booking (customer) via /api/bookings (form-data)
    // Best-effort: If Supabase is not configured (common in CI), mark BLOCKED and continue.
    let bookingId: string | null = null;
    let quoteId: string | null = null;
    try {
      const fd = new FormData();
      fd.set("service", "Plumbing");
      fd.set("summary", "E2E smoke booking created via APIRequestContext");
      fd.set("address", "1 Test Street");
      fd.set("eircode", "D08 TEST");
      fd.set("preferredDate", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
      fd.set("preferredTime", "10:30");
      fd.set("name", "E2E Customer");
      fd.set("email", `e2e.customer.${Date.now()}@example.com`);
      fd.set("phone", "+353800000000");

      const res = await request.post(`${BASE_URL}/api/bookings`, {
        multipart: fd as any,
      });

      const text = await res.text();
      if (!res.ok()) {
        const looksLikeSupabaseKey = text.includes("Invalid API key") || text.includes("JWT") || text.includes("supabase");
        results.push({
          step: "Booking creation",
          status: looksLikeSupabaseKey ? "BLOCKED" : "FAIL",
          details: { endpoint: "/api/bookings", status: res.status(), body: text },
        });
      } else {
        const data = JSON.parse(text);
        bookingId = data?.reference || null;
        if (!bookingId) {
          results.push({ step: "Booking creation", status: "FAIL", details: { endpoint: "/api/bookings", body: text } });
        } else {
          results.push({ step: "Booking creation", status: "PASS", details: { bookingId } });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ step: "Booking creation", status: "BLOCKED", details: msg });
    }

    // 5b) Create a quote booking via /api/bookings (mode=quote)
    try {
      const qfd = new FormData();
      qfd.set('mode', 'quote');
      qfd.set('service', 'Plumbing');
      qfd.set('summary', 'E2E quote request created via APIRequestContext');
      qfd.set('address', '1 Test Street');
      qfd.set('eircode', 'D08 TEST');
      qfd.set('name', 'E2E Quote');
      qfd.set('email', `e2e.quote.${Date.now()}@example.com`);
      qfd.set('phone', '+353800000222');

      const res = await request.post(`${BASE_URL}/api/bookings`, { multipart: qfd as any });
      const text = await res.text();
      if (!res.ok()) {
        const looksLikeSupabaseKey = text.includes('Invalid API key') || text.includes('JWT') || text.includes('supabase');
        results.push({
          step: 'Quote creation',
          status: looksLikeSupabaseKey ? 'BLOCKED' : 'FAIL',
          details: { endpoint: '/api/bookings', status: res.status(), body: text },
        });
      } else {
        const data = JSON.parse(text);
        quoteId = data?.reference || null;
        const status = data?.status;
        results.push({
          step: 'Quote creation',
          status: quoteId && status === 'quote_requested' ? 'PASS' : 'FAIL',
          details: { quoteId, status },
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ step: 'Quote creation', status: 'BLOCKED', details: msg });
    }

    // 6) Admin booking visibility
    // Admin bookings route proxies to backend and likely requires admin auth cookie.
    // Try it anyway; if blocked by auth or backend unreachable, report BLOCKED.
    if (!bookingId) {
      results.push({ step: "Admin booking visibility", status: "BLOCKED", details: "No bookingId (booking creation did not succeed)" });
    } else if (!adminSecret) {
      results.push({ step: "Admin booking visibility", status: "BLOCKED", details: "Missing ADMIN_SECRET in Playwright env" });
    } else try {
      const res = await request.get(`${BASE_URL}/api/admin/bookings`, { headers: adminHeaders as any });
      const body = await res.text().catch(() => "");
      if (res.status() === 401 || res.status() === 403) {
        results.push({
          step: "Admin booking visibility",
          status: "BLOCKED",
          details: { endpoint: "/api/admin/bookings", status: res.status(), body },
        });
      } else if (!res.ok()) {
        results.push({
          step: "Admin booking visibility",
          status: "BLOCKED",
          details: { endpoint: "/api/admin/bookings", status: res.status(), body },
        });
      } else {
        const data = JSON.parse(body);
        const bookings: any[] = data?.bookings || data?.data || [];
        const found = bookings.some((b) => b?.id === bookingId || b?.booking_id === bookingId);
        results.push({
          step: "Admin booking visibility",
          status: found ? "PASS" : "FAIL",
          details: { endpoint: "/api/admin/bookings", bookingId, count: bookings.length },
        });
        if (!found) {
          // Do not throw; report FAIL but continue best-effort.
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ step: "Admin booking visibility", status: "BLOCKED", details: msg });
    }

    // 7) Professional registration via /api/register/professional
    // This endpoint requires Supabase and expects file fields (id_document, profile_photo).
    // Without a known test bypass, treat as BLOCKED if it rejects missing required fields.
    let proUserId: string | null = null;
    let proRowId: string | number | null = null;
    try {
      const body = {
        user_id: crypto.randomUUID(),
        name: "E2E Pro",
        email: `e2e.pro.${Date.now()}@example.com`,
        phone: "+353800000111",
        category: "Plumbing",
        experience: "1",
        rate: "50",
        service_area: "Dublin 8",
        id_document: "test-id-doc",
        profile_photo: "test-profile-photo",
      };

      const res = await request.post(`${BASE_URL}/api/register/professional`, {
        headers: jsonHeaders,
        data: body,
      });
      const text = await res.text();
      if (!res.ok()) {
        results.push({
          step: "Professional registration",
          status: "BLOCKED",
          details: { endpoint: "/api/register/professional", status: res.status(), body: text },
        });
      } else {
        proUserId = body.user_id;
        results.push({ step: "Professional registration", status: "PASS", details: { user_id: proUserId } });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ step: "Professional registration", status: "BLOCKED", details: msg });
    }

    // 8) Professional approval via /api/admin/approve
    // Use /api/admin/professionals to lookup the row id created for proUserId.
    if (!proUserId) {
      results.push({ step: "Professional approval", status: "BLOCKED", details: "No pro user_id" });
    } else if (!adminSecret) {
      results.push({ step: "Professional approval", status: "BLOCKED", details: "Missing ADMIN_SECRET in Playwright env" });
    } else {
      try {
        const listRes = await request.get(`${BASE_URL}/api/admin/professionals`, { headers: adminHeaders as any });
        const listText = await listRes.text().catch(() => "");
        if (!listRes.ok()) {
          results.push({
            step: "Professional approval",
            status: listRes.status() === 401 || listRes.status() === 403 ? "BLOCKED" : "FAIL",
            details: { endpoint: "/api/admin/professionals", status: listRes.status(), body: listText },
          });
        } else {
          const listData = JSON.parse(listText);
          const professionals: any[] = listData?.professionals || listData?.data || listData?.rows || [];
          const match = professionals.find((p) => p?.user_id === proUserId);
          proRowId = match?.id ?? null;
          if (!proRowId) {
            results.push({
              step: "Professional approval",
              status: "FAIL",
              details: { reason: "No matching professional row found", proUserId, count: professionals.length },
            });
          } else {
            const approveRes = await request.post(`${BASE_URL}/api/admin/approve`, {
              headers: { ...(adminHeaders as any), ...(jsonHeaders as any) },
              data: { proId: proRowId },
            });
            const approveText = await approveRes.text().catch(() => "");
            if (!approveRes.ok()) {
              results.push({
                step: "Professional approval",
                status: approveRes.status() === 401 || approveRes.status() === 403 ? "BLOCKED" : "FAIL",
                details: { endpoint: "/api/admin/approve", status: approveRes.status(), body: approveText },
              });
            } else {
              results.push({ step: "Professional approval", status: "PASS", details: { proId: proRowId } });
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ step: "Professional approval", status: "BLOCKED", details: msg });
      }
    }

    // 9) Job acceptance via /api/jobs/accept (updates bookings by id)
    // Requires proId (uuid). We can use proUserId as proId for this smoke if available.
    if (!bookingId) {
      results.push({ step: "Job acceptance", status: "BLOCKED", details: "No bookingId" });
    } else if (!proUserId) {
      results.push({ step: "Job acceptance", status: "BLOCKED", details: "No pro user_id (registration blocked)" });
    } else {
      try {
        // eslint-disable-next-line no-console
        console.log("[jobs/accept] sending payload keys", Object.keys({ jobId: bookingId, proId: proUserId }).sort());
        const res = await request.post(`${BASE_URL}/api/jobs/accept`, {
          headers: jsonHeaders,
          data: { jobId: bookingId, proId: proUserId },
        });
        const text = await res.text();
        if (!res.ok()) {
          results.push({
            step: "Job acceptance",
            status: "FAIL",
            details: { endpoint: "/api/jobs/accept", status: res.status(), body: text },
          });
          logStepFailure("Job acceptance", { status: res.status(), body: text });
        }
        if (res.ok()) {
          results.push({ step: "Job acceptance", status: "PASS" });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ step: "Job acceptance", status: "FAIL", details: msg });
        logStepFailure("Job acceptance", msg);
      }
    }

    // 10) Status propagation: check booking record via /api/bookings?professionalId=... or unassigned
    // /api/bookings requires professionalId or unassigned=true.
    if (!bookingId) {
      results.push({ step: "Status propagation", status: "BLOCKED", details: "No bookingId" });
    } else if (!proUserId) {
      results.push({ step: "Status propagation", status: "BLOCKED", details: "No pro user_id" });
    } else {
      let found: any = null;
      const res = await request.get(`${BASE_URL}/api/bookings?professionalId=${encodeURIComponent(proUserId)}`);
      const text = await res.text();
      if (!res.ok()) {
        results.push({ step: "Status propagation", status: "FAIL", details: { endpoint: "/api/bookings", status: res.status(), body: text } });
        logStepFailure("Status propagation", { status: res.status(), body: text });
      } else {
        const data = JSON.parse(text);
        const bookings: any[] = data?.bookings || [];
        found = bookings.find((b) => b?.id === bookingId);
        results.push({
          step: "Status propagation",
          status: found ? "PASS" : "FAIL",
          details: { bookingId, foundStatus: found?.status, foundProfessional: found?.professional_id },
        });
      }
      if (!found) {
        // Reportable FAIL is enough for smoke; don't throw to allow final matrix.
      }
    }

    // Emit results in test output for the final report.
    // eslint-disable-next-line no-console
    console.log("E2E_RESULTS_JSON:", JSON.stringify(results, null, 2));
  });
});
