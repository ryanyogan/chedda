import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });

let sql = neon(process.env.DATABASE_URL!);
let db = drizzle(sql);

let main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

main();
