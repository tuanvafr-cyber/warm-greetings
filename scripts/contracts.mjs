import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, copyFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const backend = "C:\\Users\\Vu Tuan\\Desktop\\Project\\SignalOps MT5";
const backendDir = join(backend, "docs", "backend-contract-v3");
const snapshot = join(root, "contracts", "signalops-v3.1", "snapshot");
const generated = join(root, "src", "integration", "generated");
const lockPath = join(root, "contracts", "signalops-v3.1", "contract-lock.json");
const files = {
  openapi: [join(backendDir, "openapi.yaml"), "openapi.yaml"],
  typescript: [join(backendDir, "signalops-v3.d.ts"), "signalops-v3.d.ts"],
  capabilities: [join(backendDir, "capabilities.json"), "capabilities.json"],
  viVN: [join(backendDir, "locales", "vi-VN.json"), "locales/vi-VN.json"],
  enUS: [join(backendDir, "locales", "en-US.json"), "locales/en-US.json"],
};

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
}

function fail(message) {
  console.error(`contracts: ${message}`);
  process.exitCode = 1;
}

function lockForCurrentSnapshot() {
  const old = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, "utf8")) : {};
  const artifacts = Object.fromEntries(
    Object.entries(files).map(([key, [source, relative]]) => [key, { path: `snapshot/${relative}`, sha256: sha256(source) }]),
  );
  return {
    frontendRepository: "https://github.com/tuanvafr-cyber/warm-greetings",
    frontendBaseline: "541a0d612d0b96e2aa0e4e4511aba72f4fc72590",
    backendRepositoryPath: backend,
    backendBranch: "codex/signalops-all-imported-sources-live-pipeline",
    backendHead: "a5f5083bec8078544c61ea5cbd60dfc7677785b3",
    backendSchema: 40,
    artifacts,
    generatedAtUtc: old.generatedAtUtc ?? "2026-07-25T00:00:00Z",
    compatibilityVersion: "signalops-backend-v3.1",
  };
}

function generate() {
  for (const [key, [source, relative]] of Object.entries(files)) {
    if (!existsSync(source)) throw new Error(`accepted artifact missing: ${source}`);
    const destination = join(snapshot, relative);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(source, destination);
    console.log(`${key}: ${sha256(source)}`);
  }
  mkdirSync(generated, { recursive: true });
  const dts = readFileSync(files.typescript[0], "utf8");
  writeFileSync(join(generated, "signalops-v3.ts"), `// Generated from contracts/signalops-v3.1/snapshot/signalops-v3.d.ts.\n${dts}`);
  writeFileSync(join(generated, "signalops-operations.ts"), `// Generated from the V3.1 OpenAPI snapshot.\nexport const signalOpsOperationIds = [\n${[...readFileSync(files.openapi[0], "utf8").matchAll(/operationId: ([^,}\s]+)/g)].map((m) => `  ${JSON.stringify(m[1])},`).join("\n")}\n] as const;\nexport type SignalOpsOperationId = (typeof signalOpsOperationIds)[number];\n`);
  writeFileSync(lockPath, `${JSON.stringify(lockForCurrentSnapshot(), null, 2)}\n`);
  console.log("contracts:generate OK");
}

function check() {
  if (!existsSync(lockPath)) throw new Error("contract-lock.json missing");
  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  for (const [key, [source, relative]] of Object.entries(files)) {
    const snapshotPath = join(root, "contracts", "signalops-v3.1", lock.artifacts[key].path);
    if (!existsSync(snapshotPath)) throw new Error(`snapshot missing: ${snapshotPath}`);
    const expected = lock.artifacts[key].sha256;
    const actual = sha256(snapshotPath);
    if (expected !== actual) throw new Error(`${key} hash mismatch: expected ${expected}, actual ${actual}`);
    if (existsSync(source) && sha256(source) !== expected) throw new Error(`${key} differs from accepted backend artifact`);
    void relative;
  }
  if (lock.backendHead !== "a5f5083bec8078544c61ea5cbd60dfc7677785b3" || lock.backendSchema !== 40) throw new Error("backend baseline lock mismatch");
  if (!existsSync(join(generated, "signalops-v3.ts")) || !existsSync(join(generated, "signalops-operations.ts"))) throw new Error("generated contract seam missing");
  console.log(JSON.stringify({ compatibilityVersion: lock.compatibilityVersion, artifacts: lock.artifacts }, null, 2));
  console.log("contracts:check OK");
}

try {
  if (process.argv[2] === "generate") generate();
  else if (process.argv[2] === "check") check();
  else throw new Error("usage: contracts.mjs <generate|check>");
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
