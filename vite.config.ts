import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
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
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion-vendor": ["motion", "react-use-measure"],
          "shader-vendor": ["@paper-design/shaders-react"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "@radix-ui/react-label",
            "@radix-ui/react-toast",
            "vaul",
          ],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "i18n-vendor": ["react-i18next", "i18next"],
          "icons-vendor": ["lucide-react"],
          "seo-vendor": ["react-helmet-async"],
        },
      },
    },
  },
}));
