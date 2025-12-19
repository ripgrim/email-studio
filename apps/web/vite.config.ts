import { defineConfig } from "vite";
import type { Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { nitro } from "nitro/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "../..");

const shimIndex = resolve(__dirname, "src/shims/use-sync-external-store/shim/index.ts");
const shimWithSelector = resolve(__dirname, "src/shims/use-sync-external-store/shim/with-selector.ts");
const cookieShim = resolve(__dirname, "src/shims/cookie/index.ts");

// Plugin to intercept use-sync-external-store imports
const useSyncExternalStoreShimPlugin = (): Plugin => {
	return {
		name: "use-sync-external-store-shim",
		enforce: "pre",
		resolveId(id) {
			// Handle all variations of the import (with and without .js extension)
			if (id === "use-sync-external-store/shim/with-selector" || id === "use-sync-external-store/shim/with-selector.js") {
				return shimWithSelector;
			}
			if (id === "use-sync-external-store/shim/index.js" || id === "use-sync-external-store/shim/index") {
				return shimIndex;
			}
			if (id === "use-sync-external-store/shim" || id === "use-sync-external-store/shim.js") {
				return shimIndex;
			}
			if (id === "use-sync-external-store" || id === "use-sync-external-store.js") {
				return shimIndex;
			}
			return null;
		},
	};
};

// Plugin to intercept cookie imports and use shim
const cookieShimPlugin = (): Plugin => {
	return {
		name: "cookie-shim",
		enforce: "pre",
		resolveId(id, importer) {
			// Don't intercept if importing from our shim file
			if (importer?.includes("shims/cookie")) {
				return null;
			}
			// Intercept cookie imports
			if (id === "cookie" || id === "cookie.js") {
				return cookieShim;
			}
			return null;
		},
	};
};

export default defineConfig({
	plugins: [
		useSyncExternalStoreShimPlugin(),
		cookieShimPlugin(),
		tsconfigPaths(),
		tailwindcss(),
		nitro(),
		tanstackStart(),
		viteReact(),
	],
	resolve: {
		dedupe: ["use-sync-external-store"],
		alias: [
			{
				find: /^cookie(\.js)?$/,
				replacement: cookieShim,
			},
			{
				find: /^use-sync-external-store\/shim\/with-selector(\.js)?$/,
				replacement: shimWithSelector,
			},
			{
				find: /^use-sync-external-store\/shim\/index(\.js)?$/,
				replacement: shimIndex,
			},
			{
				find: /^use-sync-external-store\/shim(\.js)?$/,
				replacement: shimIndex,
			},
			{
				find: /^use-sync-external-store(\.js)?$/,
				replacement: shimIndex,
			},
			{
				find: "@inbound-hackathon/ai/adapter",
				replacement: resolve(rootDir, "packages/ai/adapter.ts"),
			},
			{
				find: "@inbound-hackathon/ai/tools",
				replacement: resolve(rootDir, "packages/ai/tools/index.ts"),
			},
			{
				find: "@inbound-hackathon/ai/prompts/system",
				replacement: resolve(rootDir, "packages/ai/prompts/system.ts"),
			},
			{
				find: "@inbound-hackathon/ai/prompts/email_generation",
				replacement: resolve(rootDir, "packages/ai/prompts/email_generation.ts"),
			},
			{
				find: "@inbound-hackathon/ai",
				replacement: resolve(rootDir, "packages/ai/index.ts"),
			},
			{
				find: "@inbound-hackathon/email/renderer",
				replacement: resolve(rootDir, "packages/email/renderer.ts"),
			},
			{
				find: "@inbound-hackathon/email",
				replacement: resolve(rootDir, "packages/email/index.ts"),
			},
			{
				find: "@inbound-hackathon/validation",
				replacement: resolve(rootDir, "packages/validation/index.ts"),
			},
			{
				find: "@inbound-hackathon/backend/convex/_generated/api",
				replacement: resolve(rootDir, "packages/backend/convex/_generated/api"),
			},
			{
				find: "@inbound-hackathon/backend/convex/_generated/dataModel",
				replacement: resolve(rootDir, "packages/backend/convex/_generated/dataModel"),
			},
		],
	},
	optimizeDeps: {
		exclude: ["use-sync-external-store"],
		include: ["cookie"],
		esbuildOptions: {
			format: "esm",
			mainFields: ["module", "main"],
		},
	},
});
