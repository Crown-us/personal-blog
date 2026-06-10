import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env.local
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
