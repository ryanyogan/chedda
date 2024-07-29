"use server";

import { db } from "@/db/drizzle";
import { accounts, insertTransactionSchema, transactions } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray, sql } from "drizzle-orm";
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

export let createTransaction = authedProcedure
  .createServerAction()
  .input(insertTransactionSchema.omit({ id: true }))
  .handler(async ({ input, ctx }) => {
    let [data] = await db
      .insert(transactions)
      .values({
        id: createId(),
        ...input,
      })
      .returning();

    console.log("Created transaction", data);

    revalidatePath("/transactions");
  });

export let updateTransaction = authedProcedure
  .createServerAction()
  .input(
    z.object({
      id: z.string(),
      data: insertTransactionSchema.omit({ id: true }),
    })
  )
  .handler(async ({ input, ctx }) => {
    if (!input.id) {
      throw new Error("Invalid transaction id");
    }

    let transactionToUpdate = db.$with("transactions_to_update").as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(eq(transactions.id, input.id), eq(accounts.userId, ctx.auth.id))
        )
    );

    console.log("Transaction to update query", transactionToUpdate);

    try {
      let [data] = await db
        .with(transactionToUpdate)
        .update(transactions)
        .set(input.data)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionToUpdate})`)
        )
        .returning();

      console.log("Updated result", data);

      if (!data) {
        throw new Error("Transaction not found");
      }

      revalidatePath("/transactions");
    } catch (error: any) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  });
