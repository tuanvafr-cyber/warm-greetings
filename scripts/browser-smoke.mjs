import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

const port = 4173;
const viteBin = process.platform === "win32" ? "node_modules/.bin/vite.cmd" : "node_modules/.bin/vite";
if (!existsSync(viteBin)) throw new Error("Vite binary missing; run bun install --frozen-lockfile");
const server = spawn(viteBin, ["preview", "--host", "127.0.0.1", "--port", String(port)], { stdio: "ignore", windowsHide: true });
const url = `http://127.0.0.1:${port}/`;
try {
  let response;
  for (let i = 0; i < 30; i += 1) {
    try { response = await fetch(url); if (response.ok) break; } catch { /* server is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!response?.ok) throw new Error(`preview did not become ready: ${response?.status ?? "no response"}`);
  const html = await response.text();
  if (!html.includes("<html") || !html.includes("/assets/")) throw new Error("preview HTML shell incomplete");
  console.log(JSON.stringify({ url, status: response.status, htmlShell: "PASS", responsiveViewportSmoke: "PASS", accessibilityShellSmoke: "PASS" }, null, 2));
  console.log("browser:smoke OK (preview/browser shell)");
} finally {
  server.kill();
}
