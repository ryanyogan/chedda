import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

let accountsApi = new Hono()
  .get("/", clerkMiddleware(), async (ctx) => {
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
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (ctx) => {
      let auth = getAuth(ctx);

      if (!auth?.userId) {
        return ctx.json({ error: "Unauthorized" }, 401);
      }

      let values = ctx.req.valid("json");

      let [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return ctx.json({ data });
    }
  );

export { accountsApi };
