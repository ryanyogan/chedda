"use server";

import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";
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

export const createCategory = authedProcedure
  .createServerAction()
  .input(insertCategorySchema.pick({ name: true }))
  .handler(async ({ ctx, input }) => {
    await db.insert(categories).values({
      id: createId(),
      name: input.name,
      userId: ctx.auth.id,
    });

    revalidatePath("/categories");
  });

export const editCategory = authedProcedure
  .createServerAction()
  .input(insertCategorySchema.pick({ name: true, id: true }))
  .handler(async ({ ctx, input }) => {
    const [data] = await db
      .update(categories)
      .set({
        name: input.name,
      })
      .where(
        and(eq(categories.userId, ctx.auth.id), eq(categories.id, input.id))
      )
      .returning();

    if (!data) {
      throw new Error("Category not found");
    }

    revalidatePath("/categories");
    // revalidatePath("/transactions")
  });

export const bulkDelete = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ ctx, input }) => {
    await db
      .delete(categories)
      .where(
        and(
          eq(categories.userId, ctx.auth.id),
          inArray(categories.id, input.ids)
        )
      );

    revalidatePath("/categories");
  });
