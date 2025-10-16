# Hero Rendering Investigation

## Summary of Findings
- During the original investigation the application contained a single `Hero` component at `components/Hero.jsx` that was rendered from `pages/index.js`. That file has since been deleted as part of the follow-up work, so the home page now begins with the services grid.
- The legacy `styles/hero.css` file is still present. Because `_app.js` imports it alongside `styles/globals.css`, stale selectors from `hero.css` can still leak into the page bundle even though the hero markup is gone.
- A production build generated via `npm run build` confirms that the hero markup is no longer emitted in `.next/server/pages/index.html`; only the services grid and supporting layout appear in the HTML payload.
- The build finishes successfully without Next.js compilation errors. The only surfaced warning is the npm CLI message `Unknown env config "http-proxy"`, indicating an environment configuration value that npm no longer recognises.
- The repository includes helper scripts (`clean.sh`, `autodeploy.sh`) and a GitHub Actions workflow for Vercel. None of these clean `.next` between local runs unless `clean.sh` is executed, so a long-lived `next dev` session can continue to serve cached output if it is not restarted.
- The workflow deploys with `vercel deploy --prebuilt` but only runs `npm run build` (which creates `.next`) rather than `vercel build` (which produces `.vercel/output`). If the GitHub Action relies on the prebuilt artefact, the deploy step may fall back to rebuilding or fail silently, delaying updates in production.

## Recommended Steps to See Changes Locally
1. Stop any running Next.js dev servers and remove cached artefacts: `rm -rf .next`. Optionally, run the provided `./clean.sh` script which reinstalls dependencies and restarts `npm run dev`.
2. Restart the dev server with `npm run dev` so that the watcher picks up the latest edits. Without a restart, the dev server can continue to serve the previously cached hero markup even though the file has been removed.
3. Remove or update `styles/hero.css` to avoid unused selectors shipping in the client bundle. If the hero component is restored in the future, rely on the modern BEM-style classes defined in `styles/globals.css` instead of reintroducing the legacy stylesheet.

## Recommended Steps for Vercel Deployment
1. Ensure changes are committed to the tracked branch (`main`) so the GitHub Action runs.
2. Update the workflow to run `npx vercel build --prod` before `vercel deploy --prebuilt`, or switch the deploy step to `vercel deploy --prod` so that Vercel builds from source. This guarantees that the bundled hero markup matches the repository state.
3. Verify that the `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets are present. Missing secrets prevent deployments and leave the old build live.
4. After adjusting the workflow, trigger a manual deployment (`npx vercel deploy --prod`) to invalidate any cached build and confirm the refreshed hero renders in production.

## Logged Warnings and Errors
- `npm run build` completes successfully. The only warning is emitted by npm: `npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.` No Next.js compilation warnings or errors were suppressed.
