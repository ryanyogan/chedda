"use server";

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerActionProcedure } from "zsa";

const authedProcedure = createServerActionProcedure().handler(async () => {
  try {
    const auth = await currentUser();

    if (!auth?.id) {
      throw new Error("Unauthorized");
    }

    return { auth };
  } catch (error) {
    throw new Error("User not authenticated");
  }
});

export const createAccount = authedProcedure
  .createServerAction()
  .input(insertAccountSchema.pick({ name: true }))
  .handler(async ({ ctx, input }) => {
    let [data] = await db
      .insert(accounts)
      .values({
        id: createId(),
        name: input.name,
        userId: ctx.auth.id,
      })
      .returning();

    revalidatePath("/accounts");
  });

export const deleteAccount = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ ctx, input }) => {
    if (!input.id) {
      throw new Error("Invalid account id");
    }

    await db
      .delete(accounts)
      .where(and(eq(accounts.userId, ctx.auth.id), eq(accounts.id, input.id)));

    revalidatePath("/accounts");
  });

export const bulkDelete = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ ctx, input }) => {
    await db
      .delete(accounts)
      .where(
        and(eq(accounts.userId, ctx.auth.id), inArray(accounts.id, input.ids))
      );

    revalidatePath("/accounts");
  });

export const editAccount = authedProcedure
  .createServerAction()
  .input(
    z.object({ id: z.string({ message: "Missing ID" }), name: z.string() })
  )
  .handler(async ({ ctx, input }) => {
    if (!input.id) {
      throw new Error("Invalid account id");
    }

    let [data] = await db
      .update(accounts)
      .set({ name: input.name })
      .where(and(eq(accounts.userId, ctx.auth.id), eq(accounts.id, input.id)))
      .returning();

    if (!data) {
      throw new Error("Account not found");
    }

    revalidatePath("/accounts");
  });

export let getAccount = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ ctx, input }) => {
    if (!input.id) {
      throw new Error("Account id is required");
    }

    let [data] = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(and(eq(accounts.id, input.id), eq(accounts.userId, ctx.auth.id)));

    return { data };
  });
