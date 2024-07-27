"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import { useOpenAccount } from "@/hooks/use-open-account";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { editAccount } from "../actions";
import { AccountForm } from "./account-form";

export function EditAccountSheet() {
  let { isOpen, onClose, id, account } = useOpenAccount();
  const { isPending, execute, isSuccess } = useServerAction(editAccount);
  if (!account) {
    return null;
  }

  let formSchema = insertAccountSchema.pick({
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
          defaultValues={{
            name: account.name,
          }}
          onSubmit={onSubmit}
          disabled={isPending}
          isPending={isPending}
        />
      </SheetContent>
    </Sheet>
  );
}
