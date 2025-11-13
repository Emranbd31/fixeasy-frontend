import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

test.setTimeout(60000);

test('admin verify endpoint - full flow', async ({ request, baseURL }) => {
  const username = process.env.ADMIN_USER || 'admin@example.test';
  const password = process.env.ADMIN_PASS || 'password';

  // Try real login first (Playwright shim will accept credentials when PLAYWRIGHT_TEST=1)
  let token: string | null = null;
  const loginResp = await request.post('/api/admin/login', { data: { username, password } });
  if (loginResp.ok()) {
    const j = await loginResp.json().catch(() => null);
    token = j?.token ?? j?.access_token ?? j?.accessToken ?? null;
    // If token is not a JWT (compact JWS with two dots), treat as missing so we sign a proper JWT for verification
    if (token && typeof token === 'string' && token.split('.').length !== 3) {
      console.log('[test] login returned a non-JWT token; will generate a signed fallback JWT for verify');
      token = null;
    }
  }

  // If login did not provide a token, create a signed fallback JWT using JWT_SECRET
  if (!token) {
    const secret = process.env.JWT_SECRET || 'test-jwt-secret';
    const encoder = new TextEncoder();
    token = await new SignJWT({ sub: username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(encoder.encode(secret));
    console.log('[test] fallback token generated:', token?.slice(0, 80), '... len=', token?.length);
  }

  // Verify happy path
  const verifyResp = await request.post('/api/admin/verify', { data: { token } });
  // debug: log status and body to aid troubleshooting when running locally
  const verifyText = await verifyResp.text().catch(() => '');
  console.log('[test] /api/admin/verify status=', verifyResp.status(), 'body=', verifyText);
  expect(verifyResp.ok()).toBeTruthy();
  const verifyJson = verifyText ? JSON.parse(verifyText) : await verifyResp.json();
  expect(verifyJson).toBeTruthy();
  expect(verifyJson.valid).toBe(true);
  // role may be string or array - normalize
  const role = verifyJson.role;
  if (Array.isArray(role)) {
    expect(role).toContain('admin');
  } else {
    expect(role).toBe('admin');
  }

  // Invalid token -> 401
  const badResp = await request.post('/api/admin/verify', { data: { token: 'this-is-invalid' } });
  expect(badResp.status()).toBe(401);
  const badJson = await badResp.json();
  expect(badJson.valid).toBe(false);

  // Missing token -> 401 (POST without body falls back to GET which requires cookie/header)
  const missingResp = await request.post('/api/admin/verify', { data: {} });
  expect(missingResp.status()).toBe(401);
  const missingJson = await missingResp.json();
  expect(missingJson.valid).toBe(false);
});
