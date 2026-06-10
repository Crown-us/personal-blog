import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

async function main() {
  console.log("🚀 Starting database migrations programmatically...");
  
  try {
    // This will run all pending migrations in the migrations folder
    await migrate(db, { migrationsFolder: "./lib/db/migrations" });
    
    console.log("✅ Programmatic database migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  }
}

main();
