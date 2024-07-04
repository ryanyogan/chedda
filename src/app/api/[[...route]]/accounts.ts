import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

let accountsApi = new Hono().get("/", clerkMiddleware(), async (ctx) => {
  let auth = getAuth(ctx);

  if (!auth?.userId) {
    return ctx.json({ error: "Unauthorized" }, 401);
  }

  let data = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts)
    .where(eq(accounts.userId, auth.userId));

  return ctx.json({ data });
});

export { accountsApi };
