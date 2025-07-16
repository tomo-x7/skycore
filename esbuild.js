import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
//@ts-check
import * as esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";
try {
	fs.rmSync(path.join(__dirname, "public", "units"), { recursive: true });
} catch {}
await esbuild.build({
	bundle: true,
	entryPoints: ["units/*.tsx"],
	format: "esm",
	jsxFactory: "React.createElement",
	minify: !isDev,
	outdir: "public/units",
	sourcemap: isDev,
});
