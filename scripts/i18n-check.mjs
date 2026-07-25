import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const vi = JSON.parse(readFileSync(join(root, "contracts", "signalops-v3.1", "snapshot", "locales", "vi-VN.json"), "utf8"));
const en = JSON.parse(readFileSync(join(root, "contracts", "signalops-v3.1", "snapshot", "locales", "en-US.json"), "utf8"));
const viKeys = Object.keys(vi).sort();
const enKeys = Object.keys(en).sort();
const missingVi = enKeys.filter((key) => !(key in vi));
const missingEn = viKeys.filter((key) => !(key in en));
const placeholders = (value) => [...String(value).matchAll(/\{([^}]+)\}/g)].map((m) => m[1]).sort().join(",");
const placeholderMismatches = enKeys.filter((key) => key in vi && placeholders(en[key]) !== placeholders(vi[key]));
if (missingVi.length || missingEn.length || placeholderMismatches.length) {
  console.error(JSON.stringify({ missingVi, missingEn, placeholderMismatches }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ vi: viKeys.length, en: enKeys.length, missingVi: 0, missingEn: 0, placeholderMismatches: 0 }, null, 2));
console.log("i18n:check OK");
