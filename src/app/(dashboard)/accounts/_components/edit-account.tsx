"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertBankAccountSchema } from "@/db/schema";
import { useOpenAccount } from "@/hooks/use-open-account";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { deleteAccount, editAccount } from "../actions";
import { AccountForm } from "./account-form";

export function EditAccountSheet() {
  let { isOpen, onClose, id, account } = useOpenAccount();
  const { isPending, execute, isSuccess } = useServerAction(editAccount);
  const {
    isPending: isDeleteing,
    execute: executeDelete,
    isSuccess: isDeleted,
  } = useServerAction(deleteAccount);

  if (!account) {
    return null;
  }

  let formSchema = insertBankAccountSchema.pick({
    name: true,
  });

  async function onSubmit(values: z.input<typeof formSchema>) {
    if (!id) {
      throw new Error("Account id is required");
    }

    await execute({ name: values.name, id });

    if (isSuccess && !isPending) {
      toast.success("Account updated successfully");
    }

    onClose();
  }

  async function onDelete() {
    if (!id) {
      throw new Error("Account id is required");
    }

    await executeDelete({ id });

    if (isDeleted && !isDeleteing) {
      toast.success("Account deleted successfully");
    }

    onClose();
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          id={id}
          defaultValues={{
            name: account.name,
          }}
          onSubmit={onSubmit}
          disabled={isPending || isDeleteing}
          isPending={isDeleteing}
          onDelete={onDelete}
        />
      </SheetContent>
    </Sheet>
  );
}
