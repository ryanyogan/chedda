"use server";

import { db } from "@/db/drizzle";
import { insertTransactionSchema, transactions } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";
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

    revalidatePath("/transactions");
  });
