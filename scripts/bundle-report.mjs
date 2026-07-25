import { existsSync, readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
if (!existsSync(dist)) throw new Error("dist is missing; run build before bundle report");
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walk(file, out);
    else out.push(file);
  }
  return out;
}
const files = walk(dist).filter((file) => /\.(js|css)$/.test(file)).map((file) => ({ path: relative(root, file).replaceAll("\\", "/"), bytes: readFileSync(file).byteLength })).sort((a, b) => b.bytes - a.bytes);
const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
const report = { totalBytes, javascriptAndCssFiles: files.length, largestFiles: files.slice(0, 10), budgetBytes: 2_000_000, withinBudget: totalBytes <= 2_000_000 };
mkdirSync(join(root, "artifacts"), { recursive: true });
writeFileSync(join(root, "artifacts", "bundle-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.withinBudget) throw new Error(`bundle exceeds ${report.budgetBytes} bytes`);
console.log("bundle:report OK");
