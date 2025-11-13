import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

test.setTimeout(60000);

const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const host = new URL(base).hostname;

test('visiting protected page without cookie redirects to login with returnTo', async ({ page }) => {
  await page.goto('/admin/dashboard');
  // Should be redirected to login with returnTo param
  const url = new URL(page.url());
  expect(url.pathname).toContain('/admin/login');
  expect(url.searchParams.get('returnTo')).toBe('/admin/dashboard');
});

test('visiting protected page with valid token renders dashboard', async ({ page, context }) => {
  const secret = process.env.JWT_SECRET || 'test-jwt-secret';
  const encoder = new TextEncoder();
  const token = await new SignJWT({ sub: 'test@local', role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encoder.encode(secret));

  // set cookie for the test domain
  await context.addCookies([{ name: 'fixeasy_admin_token', value: token, domain: host, path: '/', httpOnly: true }]);
  await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
  // The admin header should be visible
  await expect(page.getByText('Admin Console')).toBeVisible();
});

test('login form returns redirect and navigates back to returnTo', async ({ page }) => {
  // Use the Playwright shim in CI/local by setting PLAYWRIGHT_TEST=1
  await page.goto('/admin/login?returnTo=/admin/dashboard');
  await page.fill('input[name=email], input#admin-email', process.env.ADMIN_USER || 'test@local');
  await page.fill('input[name=password], input#admin-password', process.env.ADMIN_PASS || 'password');
  await page.click('button[type=submit]');
  // Expect navigation back to dashboard
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 20000 });
  expect(page.url()).toContain('/admin/dashboard');
});
