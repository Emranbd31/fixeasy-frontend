# Hero Rendering Investigation

## Summary of Findings
- The application only contains a single `Hero` component at `components/Hero.jsx`. There are no duplicate files or alternative component exports that could override the intended implementation.
- `pages/index.js` imports this `Hero` component and renders it at the top of the home page tree, so the updated JSX is part of the page React tree.
- The global stylesheet (`styles/globals.css`) includes the `hero__*` class definitions required by the new component, while the legacy `styles/hero.css` file still contains the previous simplified hero styles. Because `_app.js` imports both files, stale selectors from `hero.css` can override or conflict with the refreshed design.
- A production build generated via `npm run build` embeds the new hero markup inside `.next/server/pages/index.html`, confirming that the updated component is compiled into the build output.
- The build finishes successfully without Next.js compilation errors. The only surfaced warning is the npm CLI message `Unknown env config "http-proxy"`, indicating an environment configuration value that npm no longer recognises.
- The repository includes helper scripts (`clean.sh`, `autodeploy.sh`) and a GitHub Actions workflow for Vercel. None of these clean `.next` between local runs unless `clean.sh` is executed, so a long-lived `next dev` session can continue to serve cached output if it is not restarted.
- The workflow deploys with `vercel deploy --prebuilt` but only runs `npm run build` (which creates `.next`) rather than `vercel build` (which produces `.vercel/output`). If the GitHub Action relies on the prebuilt artefact, the deploy step may fall back to rebuilding or fail silently, delaying updates in production.

## Recommended Steps to See Changes Locally
1. Stop any running Next.js dev servers and remove cached artefacts: `rm -rf .next`. Optionally, run the provided `./clean.sh` script which reinstalls dependencies and restarts `npm run dev`.
2. Restart the dev server with `npm run dev` so that the watcher picks up the latest `Hero.jsx` edits.
3. Remove or update `styles/hero.css` to avoid old selectors overriding the refreshed hero layout. Rely on the modern BEM-style classes defined in `styles/globals.css`.

## Recommended Steps for Vercel Deployment
1. Ensure changes are committed to the tracked branch (`main`) so the GitHub Action runs.
2. Update the workflow to run `npx vercel build --prod` before `vercel deploy --prebuilt`, or switch the deploy step to `vercel deploy --prod` so that Vercel builds from source. This guarantees that the bundled hero markup matches the repository state.
3. Verify that the `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets are present. Missing secrets prevent deployments and leave the old build live.
4. After adjusting the workflow, trigger a manual deployment (`npx vercel deploy --prod`) to invalidate any cached build and confirm the refreshed hero renders in production.

## Logged Warnings and Errors
- `npm run build` completes successfully. The only warning is emitted by npm: `npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.` No Next.js compilation warnings or errors were suppressed.
