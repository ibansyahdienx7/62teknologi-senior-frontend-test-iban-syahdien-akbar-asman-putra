import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: "https://api.yelp.com/v3",
    port: 3000,
    open: "/",
    changeOrigin: true,
    cors: true,
    origin: "http://127.0.0.1:3000",
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
