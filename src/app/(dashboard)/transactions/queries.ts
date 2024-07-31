"use server";

import { db } from "@/db/drizzle";
import { bankAccounts, categories, transactions } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, lte } from "drizzle-orm";

export async function getTransactions({
  from,
  to,
  accountId,
}: {
  from?: string;
  to?: string;
  accountId?: string;
}) {
  let auth = await currentUser();
  if (!auth?.id) {
    throw new Error("Unauthorized");
  }

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
  const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

  const data = await db
    .select({
      id: transactions.id,
      date: transactions.date,
      category: categories.name,
      categoryId: transactions.categoryId,
      payee: transactions.payee,
      amount: transactions.amount,
      notes: transactions.notes,
      account: bankAccounts.name,
      accountId: transactions.accountId,
    })
    .from(transactions)
    .innerJoin(bankAccounts, eq(transactions.accountId, bankAccounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, accountId) : undefined,
        eq(bankAccounts.userId, auth.id),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      )
    )
    .orderBy(desc(transactions.date));

  return { data };
}

export async function getTransaction({ id }: { id: string }) {
  let auth = await currentUser();
  if (!auth?.id) {
    throw new Error("Unauthorized");
  }

  const [data] = await db
    .select({
      id: transactions.id,
      date: transactions.date,
      categoryId: transactions.categoryId,
      payee: transactions.payee,
      amount: transactions.amount,
      notes: transactions.notes,
      accountId: transactions.accountId,
    })
    .from(transactions)
    .innerJoin(bankAccounts, eq(transactions.accountId, bankAccounts.id))
    .where(and(eq(transactions.id, id), eq(bankAccounts.userId, auth.id)));

  return { data };
}
