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
import { Loader2 } from "lucide-react";
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

  const onCreateCategory = (name: string) => {};
  // categoryMutation.mutate({
  //   name,
  // });

  const categoryOptions = (categories ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const onCreateAccount = (name: string) => {};
  // accountMutation.mutate({
  //   name,
  // });

  const accountOptions = (accounts ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const onSubmit = async (values: FormValues) => {
    await executeTransaction(values);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>
        {false ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={false}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
