import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    // The contact form is the only backend call the site makes, and it lives in
    // server.js. Without this proxy `npm run dev` answers POST /api/contact with
    // a 404, so the form can never be tested locally. Run the API alongside the
    // dev server with:  node --env-file=.env.local server.js
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split vendor bundles so first paint downloads only what it needs.
        // Each entry maps a chunk name to the npm packages bundled into it.
        // Radix UI packages (dialog/popover/select/label/vaul) are intentionally
        // NOT grouped into a shared chunk here: a manualChunks group is
        // monolithic, so if ANY eager import pulls in one module from the
        // group, the whole group ships eagerly. Left to Rollup's automatic
        // splitting, each one correctly lands in the lazy chunk(s) that
        // actually import it (ContactForm, CookiePreferencesModal, etc.).
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion-vendor": ["motion"],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "i18n-vendor": ["react-i18next", "i18next"],
          "icons-vendor": ["lucide-react"],
          "seo-vendor": ["react-helmet-async"],
        },
      },
    },
  },
}));
