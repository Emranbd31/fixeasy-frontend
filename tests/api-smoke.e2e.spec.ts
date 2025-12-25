import { test, expect } from "@playwright/test";
import { probeBaseURL } from "./_baseurl";

test.describe("API smoke: routes reachable via Node request", () => {
  test("Core routes return 200", async ({ request }) => {
    const probe = await probeBaseURL();
    expect(probe.ok, probe.ok ? "" : JSON.stringify(probe.errors, null, 2)).toBeTruthy();
    const baseURL = probe.ok ? probe.baseURL : "";

    // Core customer routes (admin UI pages may not exist in this repo).
    const routes = ["/", "/book", "/register/professional"] as const;

    for (const route of routes) {
      const res = await request.get(`${baseURL}${route}`);
      expect(res.ok(), `GET ${route} failed with ${res.status()}`).toBeTruthy();
    }
  });

  test("Admin API routes exist (200 or protected)", async ({ request }) => {
    const probe = await probeBaseURL();
    expect(probe.ok, probe.ok ? "" : JSON.stringify(probe.errors, null, 2)).toBeTruthy();
    const baseURL = probe.ok ? probe.baseURL : "";

    const adminApiRoutes = [
      "/api/admin/login",
      "/api/admin/verify",
      "/api/admin/professionals",
      "/api/admin/sign-url",
      "/api/admin/bookings",
      "/api/admin/activity",
      "/api/admin/approve",
    ] as const;

    for (const route of adminApiRoutes) {
      // Some are POST-only; do a safe GET probe first.
      const res = await request.get(`${baseURL}${route}`);
      // PASS if it exists and is protected (401/403) or publicly accessible (200).
      // FAIL only if route is missing (404).
      expect(res.status(), `Admin API route missing: GET ${route}`).not.toBe(404);
    }
  });
});
