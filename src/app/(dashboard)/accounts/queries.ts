"use server";

import { db } from "@/db/drizzle";
import { bankAccounts } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type BankAccount = Awaited<
  ReturnType<typeof getAccounts>
>["data"][number];

// TODO: Move to actions, leverage auth middleware chain
export async function getAccounts() {
  let auth = await currentUser();
  if (!auth?.id) {
    redirect("/sign-in");
  }

  let data = await db
    .select({
      id: bankAccounts.id,
      name: bankAccounts.name,
    })
    .from(bankAccounts)
    .where(eq(bankAccounts.userId, auth.id));

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
      id: bankAccounts.id,
      name: bankAccounts.name,
    })
    .from(bankAccounts)
    .where(and(eq(bankAccounts.id, id), eq(bankAccounts.userId, auth.id)));

  return { data };
}
