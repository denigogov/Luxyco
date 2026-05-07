import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.NODE_ENV === "development" ? [basicSsl()] : []),
  ],

  server: {
    port: 3000,
    host: true,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/global/scss/_app.scss" as *;`,
      },
    },
  },

  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(
        __dirname,
        "node_modules/react/jsx-runtime",
      ),
    },
  },
});
