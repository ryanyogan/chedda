"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { useOpenTransaction } from "@/hooks/use-open-transaction";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { createAccount } from "../../accounts/actions";
import { Account } from "../../accounts/queries";
import { createCategory } from "../../categories/actions";
import { Category } from "../../categories/queries";
import { updateTransaction } from "../actions";
import { getTransaction } from "../queries";
import { TransactionForm } from "./transaction-form";

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type Transaction = Awaited<ReturnType<typeof getTransaction>>["data"];

export function EditTransactionSheet({
  accounts,
  categories,
}: {
  accounts: Account[];
  categories: Category[];
}) {
  const { isOpen, onClose, id } = useOpenTransaction();
  let [isLoading, setIsLoading] = useState(false);
  let [transaction, setTransaction] = useState<Transaction | null>(null);

  let {
    execute: executeTransaction,
    isPending: isPendingTransaction,
    error,
  } = useServerAction(updateTransaction);

  let { execute: ececuteCategory, isPending: isPendingCategory } =
    useServerAction(createCategory);

  let { execute: executeAccount, isPending: isPendingAccount } =
    useServerAction(createAccount);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (id) {
        setIsLoading(true);

        const transaction = await getTransaction({ id });
        if (transaction.data) {
          setTransaction(transaction.data);
        }
      }
      setIsLoading(false);
    };

    fetchTransaction();
  }, [id]);

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
    if (!id) {
      return;
    }

    let [_data, err] = await executeTransaction({ id, data: values });
    if (err) {
      console.error(err);
      toast.error("Failed to update transaction");
    }

    onClose();
  };

  const defaultValues = transaction
    ? {
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amount: transaction.amount.toString(),
        date: transaction ? new Date(transaction.date.toString()) : new Date(),
        payee: transaction.payee,
        notes: transaction.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  if (!id || !transaction) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>Edit your transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            isLoading={isPendingTransaction}
            id={id}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            disabled={isPendingTransaction}
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
