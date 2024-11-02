import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["units/**/*.tsx"],
	splitting: true,
	format: ["esm"],
	sourcemap: process.env.NODE_ENV !== "production",
	clean: true,
	minify: process.env.NODE_ENV === "production",
	treeshake: true,
	outDir: "public/units",
	jsxFactory: "React.createElement",
});
