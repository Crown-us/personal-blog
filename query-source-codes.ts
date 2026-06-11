import { db } from "./lib/db";
import { sourceCodes } from "./lib/db/schema";

async function checkSourceCodes() {
  try {
    const list = await db.select().from(sourceCodes);
    console.log("SOURCE_CODES_IN_DB_COUNT:", list.length);
    console.log("ITEMS:", list.map(item => ({ id: item.id, name: item.name, slug: item.slug })));
    process.exit(0);
  } catch (err) {
    console.error("Failed to query source codes:", err);
    process.exit(1);
  }
}

checkSourceCodes();
