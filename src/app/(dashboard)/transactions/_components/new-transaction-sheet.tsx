"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { useNewTransaction } from "@/hooks/use-new-transaction";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { createAccount } from "../../accounts/actions";
import { Account } from "../../accounts/queries";
import { createCategory } from "../../categories/actions";
import { Category } from "../../categories/queries";
import { createTransaction } from "../actions";
import { TransactionForm } from "./transaction-form";

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export function NewTransactionSheet({
  accounts,
  categories,
}: {
  accounts: Account[];
  categories: Category[];
}) {
  const { isOpen, onClose } = useNewTransaction();

  let { execute: executeTransaction, isPending: isPendingTransaction } =
    useServerAction(createTransaction);
  let { execute: ececuteCategory, isPending: isPendingCategory } =
    useServerAction(createCategory);
  let { execute: executeAccount, isPending: isPendingAccount } =
    useServerAction(createAccount);

  const onCreateCategory = async (name: string) => {
    await ececuteCategory({ name });
    toast("Category created successfully");
  };

  const categoryOptions = (categories ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const onCreateAccount = async (name: string) => {
    await executeAccount({ name });
    toast("Account created successfully");
  };

  const accountOptions = (accounts ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const onSubmit = async (values: FormValues) => {
    await executeTransaction(values);
    onClose();
  };

  let isPending = isPendingTransaction;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>
        <TransactionForm
          isLoading={isPendingTransaction}
          onSubmit={onSubmit}
          disabled={isPending}
          categoryOptions={categoryOptions}
          onCreateCategory={onCreateCategory}
          accountOptions={accountOptions}
          onCreateAccount={onCreateAccount}
        />
      </SheetContent>
    </Sheet>
  );
}
