import { spawnSync } from "node:child_process";

const commands = [
  ["contracts:check", "contracts.mjs", "check"],
  ["controls:check", "check-controls.mjs"],
  ["i18n:check", "i18n-check.mjs"],
  ["build:production-fixture-guard", "production-fixture-guard.mjs"],
  ["bundle:report", "bundle-report.mjs"],
];
for (const [label, script, argument] of commands) {
  const result = spawnSync(process.execPath, ["scripts/" + script, ...(argument ? [argument] : [])], { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${label} failed`);
}
console.log("validate OK");
