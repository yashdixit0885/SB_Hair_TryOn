#!/usr/bin/env node
// Story coverage gate. Architecture §5 + AR13 require every component file
// under src/components/** to ship with a sibling .stories.tsx. This script is
// invoked from CI; it exits non-zero when any component file is missing a
// story.
//
// Story 1.1 ships an empty src/components/, so the gate passes vacuously.
// Story 1.3 onward will populate src/components/ui/* and component stories.

import { readdir, stat } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsRoot = join(__dirname, "..", "src", "components");

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err && err.code === "ENOENT") return [];
    throw err;
  }
  const out = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const all = await walk(componentsRoot);
const componentFiles = all.filter(
  (f) =>
    f.endsWith(".tsx") &&
    !f.endsWith(".test.tsx") &&
    !f.endsWith(".stories.tsx"),
);

const missing = [];
for (const file of componentFiles) {
  const dir = dirname(file);
  const name = basename(file, extname(file));
  const story = join(dir, `${name}.stories.tsx`);
  try {
    await stat(story);
  } catch {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error(
    `\nStory coverage check failed — ${missing.length} component file(s) missing a sibling .stories.tsx:`,
  );
  for (const f of missing) console.error(`  - ${f}`);
  console.error(
    "\nEvery component in src/components/** must have a colocated .stories.tsx (architecture §5).\n",
  );
  process.exit(1);
}

console.log(
  `Story coverage check passed (${componentFiles.length} component file(s) checked).`,
);
