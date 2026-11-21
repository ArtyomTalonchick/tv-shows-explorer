import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    base: "/tv-shows-explorer/",
    plugins: [react()],
    // In development the app's server runs beside Vite (`npm run dev -w server`, port 4310 or `API_PORT`).
    server: {
        proxy: { "/api": `http://localhost:${process.env.API_PORT ?? 4310}` },
    },
    resolve: {
        alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
    },
});
