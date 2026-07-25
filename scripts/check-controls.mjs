#!/usr/bin/env node
/**
 * Deterministic control_id reconciliation.
 *
 * Fails non-zero when:
 *  - a used controls.X.Y is missing from the active registry (missing)
 *  - the active registry has duplicated string values (duplicated)
 *  - an active registered ID has no code reference outside the registry (dead)
 *  - one active ID is classified into more than one category (mixed)
 *
 * Categories are derived from call-site syntax:
 *   controlId={controls.X.Y}         → backend-required-truthful
 *   data-control-id={controls.X.Y}   → frontend-functional
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const REG = join(SRC, "lib", "control-registry.ts");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if ([".ts", ".tsx"].includes(extname(p))) out.push(p);
  }
  return out;
}

function parseObject(source, objName) {
  // Extract text between `export const <objName> = {` and its matching `} as const;`
  const marker = `export const ${objName} = {`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Cannot find ${objName} in registry`);
  let i = start + marker.length;
  let depth = 1;
  while (i < source.length && depth > 0) {
    const c = source[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    i++;
  }
  const body = source.slice(start + marker.length, i - 1);
  // Parse `area: { key: "value", ... }` groups
  const areas = {};
  const areaRe = /(\w+):\s*\{([^{}]*)\}/g;
  let m;
  while ((m = areaRe.exec(body)) !== null) {
    const area = m[1];
    const kv = {};
    const kvRe = /(\w+):\s*"([^"]+)"/g;
    let k;
    while ((k = kvRe.exec(m[2])) !== null) kv[k[1]] = k[2];
    areas[area] = kv;
  }
  return areas;
}

const regSource = readFileSync(REG, "utf8");
const activeMap = parseObject(regSource, "controls");
const plannedMap = parseObject(regSource, "plannedControls");

const activeEntries = []; // { area, key, value }
for (const [area, kv] of Object.entries(activeMap))
  for (const [k, v] of Object.entries(kv)) activeEntries.push({ area, key: k, value: v });
const plannedEntries = [];
for (const [area, kv] of Object.entries(plannedMap))
  for (const [k, v] of Object.entries(kv)) plannedEntries.push({ area, key: k, value: v });

// Duplicates in active string values
const valueCount = new Map();
for (const e of activeEntries) valueCount.set(e.value, (valueCount.get(e.value) ?? 0) + 1);
const duplicated = [...valueCount.entries()].filter(([, n]) => n > 1).map(([v]) => v);

// Active planned overlap
const activeValues = new Set(activeEntries.map((e) => e.value));
const plannedValues = new Set(plannedEntries.map((e) => e.value));
const overlap = [...plannedValues].filter((v) => activeValues.has(v));

// Scan code
const files = walk(SRC).filter((f) => f !== REG && !f.includes("/scripts/"));
const backendRefs = new Set(); // "area.key"
const frontendRefs = new Set();
const anyRefs = new Set();
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/controlId=\{controls\.(\w+)\.(\w+)\}/g))
    backendRefs.add(`${m[1]}.${m[2]}`);
  for (const m of src.matchAll(/data-control-id=\{controls\.(\w+)\.(\w+)\}/g))
    frontendRefs.add(`${m[1]}.${m[2]}`);
  for (const m of src.matchAll(/controls\.(\w+)\.(\w+)/g)) anyRefs.add(`${m[1]}.${m[2]}`);
}

const registeredKeys = new Set(activeEntries.map((e) => `${e.area}.${e.key}`));

// Missing = used but not registered
const missing = [...anyRefs].filter((k) => !registeredKeys.has(k)).sort();

// Dead = registered but no reference anywhere in source
const dead = [...registeredKeys].filter((k) => !anyRefs.has(k)).sort();

// Category assignment per registered id
const categorized = { frontend: [], backend: [], mixed: [], unused: [] };
for (const k of registeredKeys) {
  const b = backendRefs.has(k);
  const f = frontendRefs.has(k) || (anyRefs.has(k) && !b); // fallback: any non-backend usage counts as frontend
  if (b && frontendRefs.has(k)) categorized.mixed.push(k);
  else if (b) categorized.backend.push(k);
  else if (f) categorized.frontend.push(k);
  else categorized.unused.push(k);
}

const activeTotal = activeEntries.length;
const feCount = categorized.frontend.length;
const beCount = categorized.backend.length;
const plannedCount = plannedEntries.length;

const failures = [];
if (missing.length) failures.push(`missing (${missing.length}): ${missing.join(", ")}`);
if (duplicated.length) failures.push(`duplicated (${duplicated.length}): ${duplicated.join(", ")}`);
if (dead.length) failures.push(`dead (${dead.length}): ${dead.join(", ")}`);
if (categorized.mixed.length)
  failures.push(`mixed categories (${categorized.mixed.length}): ${categorized.mixed.join(", ")}`);
if (overlap.length)
  failures.push(`planned overlaps active (${overlap.length}): ${overlap.join(", ")}`);
if (feCount + beCount !== activeTotal)
  failures.push(
    `category sum ${feCount + beCount} != active total ${activeTotal} (unused=${categorized.unused.length})`,
  );

const report = {
  active_total: activeTotal,
  frontend_functional: feCount,
  backend_required_truthful: beCount,
  planned_reserved: plannedCount,
  missing: missing.length,
  duplicated: duplicated.length,
  dead: dead.length,
  mixed: categorized.mixed.length,
};
console.log(JSON.stringify(report, null, 2));

if (failures.length) {
  console.error("\nCONTROLS CHECK FAILED:");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("\ncontrols:check OK");
