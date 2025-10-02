import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias '@' to 'src'
    },
  },
});
