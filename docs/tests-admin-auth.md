# Admin Auth Tests — /api/admin/login and /api/admin/verify

This document explains the purpose of the admin authentication endpoints and how to run the Playwright tests that exercise them locally and in CI.

## Endpoints

- `/api/admin/login` — a proxy/login route used by the admin UI. In development and tests the route includes a Playwright shim (enabled with `PLAYWRIGHT_TEST=1`) that accepts credentials and returns a simple test token and cookie without calling an external backend.

- `/api/admin/verify` — a utility endpoint that verifies a JWT and returns structured JSON about token validity and role. It expects a JWT in one of:
  - Cookie `fixeasy_admin_token`
  - Authorization header `Bearer <token>`
  - POST body `{ token: "..." }`

The server requires `JWT_SECRET` to verify HS256 tokens. If `JWT_SECRET` is not set the endpoint returns a 500 server error.

## Purpose of the tests

The Playwright API test `tests/admin_verify.spec.ts`:
- Exercises a real login (via the Playwright shim when `PLAYWRIGHT_TEST=1`) and falls back to creating a signed JWT when the shim returns a non-JWT token.
- Sends the token to `/api/admin/verify` and asserts the response indicates a valid admin role.
- Validates error cases: invalid token -> 401, missing token -> 401.

This ensures end-to-end verification of the admin authentication pipeline.

## Run tests locally

Make sure you have Node.js installed (the repo standard is Node.js 20 in CI). Examples below use PowerShell and bash.

PowerShell (Windows):

```powershell
# Start dev server in one terminal (this repo has a helper that frees port 3000 first):
npm run dev-clean

# In another terminal, run the Playwright API test (hermetic shim + fallback JWT):
$env:PLAYWRIGHT_TEST = '1'
$env:ADMIN_USER = 'test@local'
$env:ADMIN_PASS = 'password'
$env:JWT_SECRET = 'test-jwt-secret'
$env:BASE_URL = 'http://127.0.0.1:3000'
npx playwright test tests/admin_verify.spec.ts --workers=1 --reporter=list
```

Bash (macOS / Linux):

```bash
# Start dev server in one terminal
npm run dev-clean &

# In another terminal
export PLAYWRIGHT_TEST=1
export ADMIN_USER=test@local
export ADMIN_PASS=password
export JWT_SECRET=test-jwt-secret
export BASE_URL=http://127.0.0.1:3000
npx playwright test tests/admin_verify.spec.ts --workers=1 --reporter=list
```

Notes:
- `PLAYWRIGHT_TEST=1` enables the login shim in `/api/admin/login` so the test suite does not depend on external services.
- `JWT_SECRET` is used by the server to verify tokens and by the test as a fallback signing key.
- Use `--workers=1` in local runs to avoid parallelism when debugging.

## Environment variables (CI / local)

- `PLAYWRIGHT_TEST` — set to `1` in CI or local when you want the login shim to be active.
- `ADMIN_USER` / `ADMIN_PASS` — credentials for the login shim (optional if the shim accepts any credentials).
- `JWT_SECRET` — secret used to sign/verify HS256 tokens. **Required** for `/api/admin/verify` to work.
- `BASE_URL` — base URL for tests. In CI we use the deployed site `https://fixeasy.irish`.

## Example passing output

A successful run of the single Playwright test will look like:

```
Running 1 test using 1 worker

  ✓  tests/admin_verify.spec.ts:6:5 › admin verify endpoint - full flow (1.8s)

  1 passed (1.8s)
```

## CI integration

The repository's CI runs the Playwright API test against the built site using `JWT_SECRET` from repository secrets. Ensure `JWT_SECRET` is configured in your GitHub repository secrets under `Settings -> Secrets`.

## Troubleshooting

- If you see `Invalid Compact JWS` or signature errors, confirm the `JWT_SECRET` used by the test runner matches the `JWT_SECRET` available to the Next.js process.
- If Playwright can't reach the site, check that `BASE_URL` is correct and the site is reachable from the CI runner.

---

If you want, I can add a CI matrix to run the test against multiple environments or wire the test into the existing test workflow rather than CI-CD; tell me which preferred flow you want and I'll update it.

## Session Status Indicator

The admin dashboard includes a live "Session Status" indicator in the header. It polls `/api/admin/verify` every 60 seconds and shows one of:

- ✅ "Session Active" (green): token is valid and not near expiry.
- ⚠️ "Session Expiring Soon" (amber): token expires within 5 minutes.
- ❌ "Session Invalid" (red): token missing or invalid — the UI redirects to `/admin/login` immediately.

Notes:
- The indicator performs a lightweight GET to `/api/admin/verify` with `credentials: 'include'` so the `fixeasy_admin_token` cookie is used.
- If the token contains an `exp` claim, the indicator uses it to show the "expiring" state when under 5 minutes remaining.
- The indicator will not show on the `/admin/login` page and clears its interval on unmount to avoid leaks.

## Redirect-Back-to-Admin

When an unauthenticated user attempts to access an admin page (for example `/admin/dashboard`), the server will redirect them to the login page and include a `returnTo` query parameter pointing to the original path. After a successful login the UI will navigate back to that original path using `router.replace()` to avoid polluting the browser history.

Flow summary:
- User visits `/admin/dashboard` with no valid session cookie.
- Server-side middleware issues a redirect to `/admin/login?returnTo=/admin/dashboard`.
- The login page reads `returnTo` and sends it with the login request.
- The login API returns `{ success: true, redirect: '/admin/dashboard' }` and sets the `fixeasy_admin_token` cookie.
- The client calls `router.replace(redirect)` to navigate back to the protected page.

This behavior ensures a smooth login flow and avoids flashing protected content to unauthenticated visitors.
