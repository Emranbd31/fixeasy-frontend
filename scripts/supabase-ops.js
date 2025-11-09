#!/usr/bin/env node

/**
 * Lightweight helper invoked from npm lifecycle hooks to perform optional
 * Supabase-related setup.  The previous deployment logs indicated the script
 * was missing entirely, so we ship a defensive implementation that simply
 * validates required environment variables and exits without failing the
 * build.
 */
const mode = process.argv[2] ?? "unknown";

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length) {
  console.warn(
    `[supabase-ops] (${mode}) Missing environment variables: ${missing.join(", ")}`
  );
} else {
  console.log(`[supabase-ops] (${mode}) Supabase environment verified.`);
}

// The lifecycle hooks should never fail the deployment if optional checks fail.
process.exit(0);
