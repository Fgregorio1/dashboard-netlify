/**
 * Re-write `src/content/*.json` from the app’s canonical imports (pretty-print).
 * Run: npm run migrate:content
 *
 * Edit JSON in-repo or via Netlify Visual Editor, then run this to normalize formatting.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BELIEF_LESSONS,
  JOURNEY,
  ONBOARDING_LESSONS,
  PATH,
  PILLARS,
  TABS,
} from "../src/curriculumContent.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(root, "src", "content");
const modulesDir = join(contentRoot, "modules");

mkdirSync(modulesDir, { recursive: true });

for (const m of JOURNEY) {
  const doc = { type: "module" as const, code: m.code, title: m.title, goal: m.goal, lessons: m.lessons };
  writeFileSync(join(modulesDir, `${m.code}.json`), JSON.stringify(doc, null, 2), "utf8");
}

writeFileSync(
  join(contentRoot, "site.json"),
  JSON.stringify({ type: "site" as const, pillars: PILLARS, path: PATH, tabs: TABS }, null, 2),
  "utf8",
);

writeFileSync(
  join(contentRoot, "onboarding.json"),
  JSON.stringify({ type: "onboarding" as const, lessons: ONBOARDING_LESSONS }, null, 2),
  "utf8",
);

writeFileSync(
  join(contentRoot, "beliefs.json"),
  JSON.stringify({ type: "beliefs" as const, lessons: BELIEF_LESSONS }, null, 2),
  "utf8",
);

console.log("Wrote JSON to src/content/ (modules + site + onboarding + beliefs)");
