import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const lock = JSON.parse(readFileSync(join(root, "contracts", "signalops-v3.1", "contract-lock.json"), "utf8"));
assert.equal(lock.compatibilityVersion, "signalops-backend-v3.1");
assert.equal(lock.backendSchema, 40);
assert.equal(lock.artifacts.enUS.sha256.length, 64);
const source = readFileSync(join(root, "src", "data", "adapters", "SignalOpsApiAdapter.ts"), "utf8");
for (const required of ["AbortSignal", "Idempotency-Key", "X-Request-ID", "csrf", "nextCursor"]) assert.ok(source.includes(required), required);
console.log("test: 4 contract/transport invariants passed");
