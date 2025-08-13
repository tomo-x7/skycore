//@ts-check

import fs from "node:fs";
import * as esbuild from "esbuild";

fs.rmSync("units_dist", { recursive: true, force: true });

const isProd = process.env.NODE_ENV === "production";
await esbuild.build({
	bundle: true,
	entryPoints: ["units/*.tsx", "units/*.css"],
	format: "esm",
	// jsxFactory: "React.createElement",
	minify: isProd,
	outdir: "units_dist",
	sourcemap: !isProd,
	tsconfig: "./tsconfig.units.json",
	loader: {
		".css": "css",
	},
});
