import { test, expect } from '@playwright/test';
import { kpi } from './utils/testIds';

test('Admin dashboard smoke test', async ({ page }) => {
  const base = process.env.ADMIN_BASE_URL || 'http://localhost:3000';
  const email = process.env.ADMIN_USER || 'admin@fixeasy.irish';
  const password = process.env.ADMIN_PASS || 'your_password_here';

  // 🔹 Pre-flight health check — try several common health endpoints
  console.log(`Checking server health at ${base}...`);
  const healthCandidates = ['/api/health', '/api/admin/health', '/status', '/'];
  let healthy = false;
  for (const p of healthCandidates) {
    const url = `${base}${p}`;
    const r = await fetch(url).catch(() => null);
    if (r && r.ok) {
      console.log(`Health OK at ${url}`);
      healthy = true;
      break;
    }
  }
  if (!healthy) throw new Error(`❌ Server not reachable at ${base} (no health endpoint responded)`);

  console.log('✅ Server reachable, starting test...');

  // Try a shortcut: load the dashboard directly. In many dev setups the
  // admin summary is available without an interactive login (server-side
  // fetch to a configured BACKEND). This avoids flaky login/rate-limit
  // interactions. If the dashboard redirects to login, fall back to the
  // interactive login flow.
  await page.goto(`${base}/admin/dashboard`, { waitUntil: 'load', timeout: 15000 }).catch(() => null);

  // If dashboard didn't show KPI labels, perform the interactive login flow.
  const kpiLocator = page.getByTestId(kpi.users);
  // Wait a short while for client-side rendering/hydration to populate the KPI cards.
  try {
    await page.waitForSelector(`[data-testid="${kpi.users}"]`, { timeout: 15000 });
  } catch {
    /* ignore; we'll fallback to login if KPI labels don't appear */
  }
  if ((await kpiLocator.count()) === 0) {
    console.log('Dashboard not available directly; performing interactive login...');
    await page.goto(`${base}/admin/login`, { waitUntil: 'load', timeout: 20000 });
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', password);
    await page.click('button[type=submit]');
    await page.waitForURL(/dashboard/, { timeout: 20000 });
  } else {
    console.log('Dashboard loaded directly; continuing checks');
  }

  // Verify KPI cards using stable test ids
  await expect(page.getByTestId(kpi.users)).toBeVisible();
  await expect(page.getByTestId(kpi.professionals)).toBeVisible();
  await expect(page.getByTestId(kpi.bookings30d)).toBeVisible();
  await expect(page.getByTestId(kpi.revenueEur)).toBeVisible();

  console.log('✅ FixEasy Admin Smoke Test passed successfully');
  // graceful cleanup
  try {
    await page.close();
  } catch {
    // ignore
  }
});
