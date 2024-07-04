import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export let sql = neon(process.env.DATABASE_URL!);
export let db = drizzle(sql);
