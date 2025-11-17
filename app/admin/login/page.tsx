"use client";
import { FormEvent, Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialMessage = params ? params.get("message") ?? "" : "";
  const formRef = useRef<HTMLFormElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>(initialMessage);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Enter both email and password to continue.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Use the local Next.js API route which proxies to the backend and sets
      // an HttpOnly cookie. The route will accept JSON and form posts.
      let response = await fetch(`/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      // If the local proxy fails for any reason (dev server misconfigured),
      // fall back to calling the deployed backend directly so login still works.
      if (!response.ok) {
        const backend = (process.env.NEXT_PUBLIC_API_URL || "https://api.fixeasy.irish").trim();
        try {
          response = await fetch(`${backend}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password }),
            cache: "no-store",
          });
        } catch (err) {
          // Let below code handle response not-ok
        }
      }

      const payload = await response.json().catch(() => ({} as any));
      const token = payload?.access_token || payload?.token;
      if (response.ok && token) {
        formRef.current?.reset();
        setEmail("");
        setPassword("");
        if (typeof window !== "undefined") {
          localStorage.setItem("fixeasy_admin_token", token);
        }
        router.push("/admin/dashboard");
        return;
      }

      if (response.status === 401) {
        alert("Invalid email or password");
        setError("Invalid email or password");
        return;
      }

      if (response.status === 503) {
        setError("Admin service unavailable");
        return;
      }

      setError("Unexpected error, please try again");
    } catch (err) {
      setError("Network error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md"
        ref={(node) => {
          formRef.current = node;
        }}
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Admin Login</h1>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Logging in…
              </span>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
