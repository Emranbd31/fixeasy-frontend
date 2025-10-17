# Local Development Guide

This project uses Next.js 14 with a helper script that disables outbound telemetry
and version checks, which keeps the local developer experience reliable even
without internet access.

## Prerequisites
- Node.js 18 or newer (the repo ships with a lockfile generated on Node 18)
- npm 9 or newer

## Install dependencies
```bash
npm install
```

## Start the dev server
```bash
npm run dev
```
This calls `scripts/run-next.js` which passes a `--no-update-check` flag and sets
`NEXT_TELEMETRY_DISABLED=1` before invoking the Next.js CLI.

## Build for production
```bash
CI=1 npm run build
```
Using `CI=1` ensures the build runs with the same strict settings as the
continuous integration pipeline.

## Start the production build locally
```bash
npm run build
npm run start
```
The start command reuses `scripts/run-next.js` so telemetry remains disabled in
production previews as well.
