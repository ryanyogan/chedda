"use server";

import { db } from "@/db/drizzle";
import { bankAccounts, insertBankAccountSchema } from "@/db/schema";
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
  .input(insertBankAccountSchema.pick({ name: true }))
  .handler(async ({ ctx, input }) => {
    let [data] = await db
      .insert(bankAccounts)
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
      .delete(bankAccounts)
      .where(
        and(eq(bankAccounts.userId, ctx.auth.id), eq(bankAccounts.id, input.id))
      );

    revalidatePath("/accounts");
  });

export const bulkDelete = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ ctx, input }) => {
    await db
      .delete(bankAccounts)
      .where(
        and(
          eq(bankAccounts.userId, ctx.auth.id),
          inArray(bankAccounts.id, input.ids)
        )
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
      .update(bankAccounts)
      .set({ name: input.name })
      .where(
        and(eq(bankAccounts.userId, ctx.auth.id), eq(bankAccounts.id, input.id))
      )
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
        id: bankAccounts.id,
        name: bankAccounts.name,
      })
      .from(bankAccounts)
      .where(
        and(eq(bankAccounts.id, input.id), eq(bankAccounts.userId, ctx.auth.id))
      );

    return { data };
  });
