"use server";

import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

// TODO: Move to actions, leverage auth middleware chain
export async function getAccounts() {
  let auth = await currentUser();
  if (!auth?.id) {
    redirect("/sign-in");
  }

  let data = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts)
    .where(eq(accounts.userId, auth.id));

  return { data };
}

export async function getAccount(id?: string) {
  if (!id) {
    throw new Error("Account id is required");
  }

  let auth = await currentUser();
  if (!auth?.id) {
    redirect("/sign-in");
  }

  let [data] = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, auth.id)));

  return { data };
}
