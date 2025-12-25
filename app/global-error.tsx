'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Avoid logging env var values; only log the message.
    console.error('[global-error]', { message: error?.message, digest: (error as any)?.digest });
  }, [error]);

  const message = error?.message ?? 'Unexpected error';
  const isMissingPublicSupabaseEnv =
    message.includes('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL') ||
    message.includes('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    message.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_KEY)');

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full space-y-3">
            <h1 className="text-xl font-semibold">Something went wrong</h1>

            {isMissingPublicSupabaseEnv ? (
              <div className="space-y-2">
                <p className="text-sm">
                  This deployment is missing required client configuration for Supabase.
                </p>
                <p className="text-sm">
                  Fix in Vercel project settings: set{' '}
                  <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and{' '}
                  <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> for the
                  environment used by this deployment, then redeploy.
                </p>
              </div>
            ) : (
              <p className="text-sm">{message}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                className="underline"
                onClick={() => reset()}
              >
                Try again
              </button>
              <a className="underline" href="/">
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
