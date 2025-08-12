//@ts-check

import * as esbuild from "esbuild";


const isProd = process.env.NODE_ENV === "production";
await esbuild.build({
	bundle: true,
	entryPoints: ["units/*.tsx"],
	format: "esm",
	// jsxFactory: "React.createElement",
	minify: isProd,
	outdir: "units_dist",
	sourcemap: !isProd,
	tsconfig: "./tsconfig.units.json"
});
