"use server";

import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getCategories() {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/sign-in");
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

export type Category = Awaited<
  ReturnType<typeof getCategories>
>["data"][number];

export async function getCategory(id: string) {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/sign-in");
  }

  const [data] = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .where(and(eq(categories.userId, user.id), eq(categories.id, id)));

  return { data };
}
