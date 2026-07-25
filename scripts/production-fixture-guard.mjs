import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
if (!existsSync(dist)) throw new Error("dist is missing; run build before production fixture guard");
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}
const forbidden = ["FixturePanelDataAdapter", "fixture-account-", "fixtures.ts", "from \"../fixtures\""];
const hits = [];
for (const file of walk(dist)) {
  if (!/\.(js|mjs|cjs|html|css)$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  for (const token of forbidden) if (text.includes(token)) hits.push({ file: file.slice(root.length + 1), token });
}
const hooks = readFileSync(join(root, "src", "data", "hooks.ts"), "utf8");
if (/FixturePanelDataAdapter|\.\/fixtures/.test(hooks)) hits.push({ file: "src/data/hooks.ts", token: "fixture import" });
if (hits.length) {
  console.error(JSON.stringify(hits, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ productionFixtureReferences: 0, sourceFallbackReferences: 0 }, null, 2));
console.log("build:production-fixture-guard OK");
