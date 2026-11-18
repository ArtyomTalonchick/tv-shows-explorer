// Builds the Cloud Function into `dist/`, the folder `firebase.json` deploys. Firebase installs a function's
// packages with npm in the cloud, where neither TypeScript nor the workspace package `@tv-shows-explorer/shared`
// exists: so the code, Hono included, is bundled into one file, and `dist/package.json` lists only the two packages
// left outside it, at the versions of `server/package.json`.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const EXTERNAL = ["firebase-admin", "firebase-functions"];
const serverPath = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const server = JSON.parse(await readFile(serverPath("package.json"), "utf8"));

await build({
    entryPoints: [serverPath("src/function.ts")],
    outfile: serverPath("dist/index.js"),
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    external: EXTERNAL,
});

const dependencies = Object.fromEntries(EXTERNAL.map((name) => [name, server.dependencies[name]]));
const manifest = { type: "module", main: "index.js", engines: { node: "22" }, dependencies };
await writeFile(serverPath("dist/package.json"), `${JSON.stringify(manifest, null, 4)}\n`);
