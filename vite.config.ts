import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

export default defineConfig({
  plugins: [react(), mcpPlugin()],
  server: { host: "::", port: 8080 },
  build: { outDir: "dist" },
});
