import { test, expect } from "@playwright/test";
import { probeBaseURL } from "./_baseurl";

const toRelative = (absoluteOrRelative: string) => {
  if (absoluteOrRelative.startsWith("http")) return absoluteOrRelative;
  return absoluteOrRelative.startsWith("/") ? absoluteOrRelative : `/${absoluteOrRelative}`;
};

test.describe("Smoke: core routes render", () => {
  const routes = ["/", "/book", "/admin/login", "/register/professional"];

  test.beforeAll(async () => {
    // Prefer env override; otherwise probe common hosts for dev server reachability.
    if (process.env.PW_BASE_URL) return;
    const probe = await probeBaseURL();
    if (probe.ok) {
      process.env.PW_BASE_URL = probe.baseURL;
      return;
    }
    throw new Error(
      `No reachable dev server baseURL. Probes: ${probe.errors
        .map((e) => `${e.baseURL} -> ${e.error}`)
        .join(", ")}`
    );
  });

  for (const route of routes) {
    test(`GET ${route} renders (no crash)`, async ({ page, baseURL }) => {
      // 1) Basic HTTP reachability
      const url = `${baseURL}${toRelative(route)}`;
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });
      expect(response, `No response navigating to ${url}`).not.toBeNull();
      expect(response!.ok(), `Non-2xx for ${url}: ${response!.status()}`).toBeTruthy();

      // 2) Basic "something rendered" assertion and no Next.js error overlay
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("text=/Application error|Unhandled|ReferenceError|TypeError/i")).toHaveCount(0);
    });
  }
});
