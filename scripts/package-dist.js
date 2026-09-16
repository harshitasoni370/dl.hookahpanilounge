/**
 * dist/ + server.js ko ek deployable zip me pack karta hai.
 *   npm run package   ->  release/desire-lounge-<timestamp>.zip
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
if (!fs.existsSync(dist)) {
  console.error("dist/ nahi mila. Pehle `npm run build:production` chalao.");
  process.exit(1);
}

let buildInfo = {};
try {
  buildInfo = JSON.parse(fs.readFileSync(path.join(dist, "build-info.json"), "utf8"));
} catch {
  console.warn("build-info.json nahi mila — zip ka naam generic rahega.");
}
const appEnv = buildInfo.appEnv || "build";

const release = path.join(root, "release");
fs.mkdirSync(release, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16);
const out = path.join(release, `desire-lounge-${appEnv}-${stamp}.zip`);

const staging = path.join(release, ".staging");
fs.rmSync(staging, { recursive: true, force: true });
fs.mkdirSync(staging, { recursive: true });
fs.cpSync(dist, path.join(staging, "dist"), { recursive: true });
fs.copyFileSync(path.join(root, "server.js"), path.join(staging, "server.js"));
fs.writeFileSync(
  path.join(staging, "package.json"),
  JSON.stringify({ name: "desire-lounge-dist", private: true, type: "module", scripts: { start: "node server.js" } }, null, 2),
);

execSync(`cd "${staging}" && zip -qr "${out}" .`, { stdio: "inherit" });
fs.rmSync(staging, { recursive: true, force: true });
console.log(`Packaged : ${path.relative(root, out)}`);
console.log(`Environment: ${appEnv}`);
console.log(`Upstream   : ${buildInfo.apiBaseUrl || "(runtime API_BASE_URL se)"}`);
console.log("Environment badalna ho to .env me URL comment/uncomment karke dobara `npm run package` chalao.");
