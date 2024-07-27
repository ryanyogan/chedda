"use server";

import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getCategories() {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  let data = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .where(eq(categories.userId, user.id));

  return { data };
}
