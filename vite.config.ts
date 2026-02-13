import { defineConfig } from "vite";

export default defineConfig({
  base: "/XenoSector/",
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
