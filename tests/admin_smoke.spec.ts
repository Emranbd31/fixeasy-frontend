import { test, expect } from '@playwright/test';

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
  await page.goto(`${base}/admin/login`, { waitUntil: 'load', timeout: 20000 });
  await page.fill('input[name=email]', email);
  await page.fill('input[name=password]', password);

  // Login with simple retry on rate limit (429)
  try {
    await page.click('button[type=submit]');
  } catch (err) {
    const msg = String(err);
    if (msg.includes('429')) {
      console.warn('⚠️ Rate-limited, retrying in 60 seconds...');
      await page.waitForTimeout(60000);
      await page.click('button[type=submit]');
    } else throw err;
  }

  await page.waitForURL(/dashboard/, { timeout: 20000 });

  // Verify KPI cards
  await expect(page.locator('text=Users')).toBeVisible();
  await expect(page.locator('text=Bookings')).toBeVisible();
  await expect(page.locator('text=Payments')).toBeVisible();
  await expect(page.locator('text=Professionals')).toBeVisible();

  console.log('✅ FixEasy Admin Smoke Test passed successfully');
});
