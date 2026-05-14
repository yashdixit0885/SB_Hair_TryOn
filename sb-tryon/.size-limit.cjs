// Initial-chunk bundle budget (NFR8) — measures only the JS that ships on
// first paint, excluding lazy-loaded routes and the @mediapipe/* code split
// (which lives in a separate chunk loaded only when the AR surface mounts).
//
// `@size-limit/preset-app` does not support an `ignore` option, so we
// achieve "≤300 KB excluding MediaPipe" by reading Next.js's
// `build-manifest.json` and measuring only `rootMainFiles + polyfillFiles`
// — the chunks the browser fetches before any lazy import resolves. The AR
// route's chunk (which contains the MediaPipe wrapper) is not in that list.
//
// Refine again in Story 1.10 when the real consumer route lands and per-page
// budgets become meaningful.

const fs = require("node:fs");
const path = require("node:path");

const manifestPath = path.join(__dirname, ".next", "build-manifest.json");

function resolveInitialChunks() {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const files = [
      ...(manifest.rootMainFiles ?? []),
      ...(manifest.polyfillFiles ?? []),
    ];
    if (files.length === 0) {
      throw new Error("build-manifest.json has no rootMainFiles or polyfillFiles");
    }
    return files.map((p) => path.join(".next", p));
  } catch (err) {
    throw new Error(
      `Could not resolve initial chunks for size-limit: ${err.message}. ` +
        `Run \`pnpm build\` first.`,
    );
  }
}

module.exports = [
  {
    name: "Initial bundle (rootMainFiles + polyfills) — excludes lazy MediaPipe AR chunk per NFR8",
    path: resolveInitialChunks(),
    limit: "300 KB",
    gzip: true,
  },
];
