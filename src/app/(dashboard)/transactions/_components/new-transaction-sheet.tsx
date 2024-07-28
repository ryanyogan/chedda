"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTrasnactionSchema } from "@/db/schema";
import { useNewTransaction } from "@/hooks/use-new-transaction";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { createAccount } from "../../accounts/actions";
import { getAccounts } from "../../accounts/queries";
import { createCategory } from "../../categories/actions";
import { getCategories } from "../../categories/queries";
import { createTransaction } from "../actions";
import { TransactionForm } from "./transaction-form";

const formSchema = insertTrasnactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type Account = Awaited<ReturnType<typeof getAccounts>>["data"][number];
type Category = Awaited<ReturnType<typeof getCategories>>["data"][number];

export function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();
  let [accounts, setAccounts] = useState<Account[]>([]);
  let [categories, setCategories] = useState<Category[]>([]);
  let [isLoading, setLoading] = useState(false);

  let { execute: executeTransaction, isPending: isPendingTransaction } =
    useServerAction(createTransaction);
  let { execute: ececuteCategory, isPending: isPendingCategory } =
    useServerAction(createCategory);
  let { execute: executeAccount, isPending: isPendingAccount } =
    useServerAction(createAccount);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      let { data: accounts } = await getAccounts();
      let { data: categories } = await getCategories();

      if (accounts) {
        setAccounts(accounts);
      }

      if (categories) {
        setCategories(categories);
      }

      setLoading(false);
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

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

  const isPending =
    isPendingTransaction || isPendingCategory || isPendingAccount;

  const onSubmit = (values: FormValues) => {
    // createMutation.mutate(values, {
    //   onSuccess: () => {
    //     onClose();
    //   },
    // });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
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
