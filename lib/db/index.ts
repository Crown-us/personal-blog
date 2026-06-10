import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Load environment variables (especially helpful for standalone scripts and seeds)
loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Graceful warning for development mode if environment variable is not set yet
  console.warn(
    "Warning: DATABASE_URL is not set in environment variables. Database calls will fail until it is configured."
  );
}

// For serverless / server environments like Next.js connecting to Supabase Postgres,
// postgres-js with prepare: false is recommended to handle connection pooling properly.
const client = postgres(connectionString || "", { prepare: false });
export const db = drizzle(client, { schema });
