import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	define: {
		// Polyfill for SockJS (requires global variable)
		global: "globalThis",
	},
	build: {
		// Optimize chunk splitting
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate vendor chunks for better caching
					"react-vendor": ["react", "react-dom"],
					"zustand-vendor": ["zustand"],
					"websocket-vendor": ["@stomp/stompjs", "sockjs-client"],
				},
			},
		},
		// Increase chunk size warning limit
		chunkSizeWarningLimit: 1000,
	},
	// Optimize dependencies pre-bundling
	optimizeDeps: {
		include: [
			"react",
			"react-dom",
			"zustand",
			"@stomp/stompjs",
			"sockjs-client",
		],
	},
});
