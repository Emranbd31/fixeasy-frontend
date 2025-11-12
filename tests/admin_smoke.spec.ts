import { test, expect } from "@playwright/test";

test.setTimeout(120000);

test("FixEasy Admin smoke test", async ({ page }) => {
  const base = process.env.ADMIN_BASE_URL ?? "https://www.fixeasy.irish";
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  async function step(name: string, fn: () => Promise<void>) {
    try {
      console.log(`→ ${name} ...`);
      await fn();
      console.log(`✅ PASS: ${name}`);
    } catch (err) {
      console.error(`❌ FAIL: ${name} — ${(err as Error).message}`);
      throw err;
    }
  }

  await step("Open admin login page", async () => {
    await page.goto(`${base}/admin/login`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  await step("Fill credentials", async () => {
    if (!adminUser || !adminPass) throw new Error("ADMIN_USER or ADMIN_PASS not provided in environment");
    // best-effort selectors
    const emailInput = page.getByLabel("Email").first();
    if ((await emailInput.count()) > 0) {
      await emailInput.fill(adminUser);
    } else {
      await page.fill('input[type="email"]', adminUser);
    }
    const passInput = page.getByLabel("Password").first();
    if ((await passInput.count()) > 0) {
      await passInput.fill(adminPass);
    } else {
      await page.fill('input[type="password"]', adminPass);
    }
  });

  await step("Submit login and wait for dashboard", async () => {
    const loginResponse = page.waitForResponse((r) => r.url().includes("/api/admin/login") && (r.status() === 200 || r.status() === 201), { timeout: 30000 });
    await page.getByRole("button", { name: /login/i }).click();
    await loginResponse;
    await page.waitForURL("**/admin/dashboard", { timeout: 30000 });
    const token = await page.evaluate(() => localStorage.getItem("adminToken") || localStorage.getItem("fixeasy_admin_token"));
    if (!token) console.warn("⚠️ No admin token found in localStorage after login");
  });

  await step("Verify KPI cards visible", async () => {
    await expect(page.getByText("Users", { exact: false })).toBeVisible();
    await expect(page.getByText(/Bookings|Bookings Total/i, { exact: false })).toBeVisible();
    await expect(page.getByText(/Revenue/i, { exact: false })).toBeVisible();
  });

  await step("Verify HealthMonitor shows backend + supabase UP", async () => {
    // look for two UP indicators
    const upLocators = page.locator('text=🟢 UP');
    const upCount = await upLocators.count();
    if (upCount < 2) {
      const backendGreen = await page.locator('text=Backend').locator('text=🟢').count();
      const supabaseGreen = await page.locator('text=Supabase').locator('text=🟢').count();
      if (backendGreen + supabaseGreen < 2) throw new Error("HealthMonitor does not show two green statuses");
    }
  });

  await step("Open Approvals tab", async () => {
    const nav = page.getByRole("link", { name: /Approvals|Professionals/i }).first();
    if ((await nav.count()) > 0) {
      await nav.click();
      await page.waitForURL("**/admin/**", { timeout: 10000 });
    }
    await expect(page.getByText("Approvals", { exact: false }).first()).toBeVisible();
    // ensure table exists
    const table = page.locator('table').first();
    if ((await table.count()) === 0) console.log("ℹ️ No approvals table found — skipping table assertions");
  });

  await step("Approve first pending row (if present)", async () => {
    const approveBtn = page.getByRole("button", { name: /Approve/i }).first();
    if ((await approveBtn.count()) === 0) {
      console.log("ℹ️ No Approve button found — skipping approve step");
      return;
    }
    const respPromise = page.waitForResponse((r) => (r.url().includes("/api/admin/approvals") || r.url().includes("/api/admin/professionals")) && (r.request().method() === "POST" || r.request().method() === "PATCH") && (r.status() === 200 || r.status() === 201), { timeout: 10000 });
    await approveBtn.click();
    await respPromise;
    const toast = page.getByText(/approved|success|verified/i).first();
    if ((await toast.count()) > 0) await expect(toast).toBeVisible({ timeout: 5000 });
  });

  await step("Reject first pending row (if present)", async () => {
    const rejectBtn = page.getByRole("button", { name: /Reject/i }).first();
    if ((await rejectBtn.count()) === 0) {
      console.log("ℹ️ No Reject button found — skipping reject step");
      return;
    }
    const respPromise = page.waitForResponse((r) => (r.url().includes("/api/admin/approvals") || r.url().includes("/api/admin/professionals")) && (r.request().method() === "POST" || r.request().method() === "PATCH") && (r.status() === 200 || r.status() === 201), { timeout: 10000 });
    await rejectBtn.click();
    await respPromise;
    const toast = page.getByText(/rejected|removed|success|updated/i).first();
    if ((await toast.count()) > 0) await expect(toast).toBeVisible({ timeout: 5000 });
  });

  await step("Verify trend & donut charts are visible", async () => {
    const chartCanvas = page.locator('canvas, svg');
    const chartHeading = page.getByText(/trend|donut|chart|insights/i);
    if ((await chartCanvas.count()) === 0 && (await chartHeading.count()) === 0) throw new Error("No chart canvas/svg or chart heading found");
  });

  await step("Logout (if present)", async () => {
    const logout = page.getByRole("button", { name: /logout|sign out/i }).first();
    if ((await logout.count()) === 0) {
      console.log("ℹ️ Logout button not present — skipping");
      return;
    }
    await logout.click();
    await page.waitForTimeout(1000);
  });

  console.log("✔️ All smoke steps completed");
});
