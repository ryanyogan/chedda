import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export let accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export let insertAccountSchema = createInsertSchema(accounts);
