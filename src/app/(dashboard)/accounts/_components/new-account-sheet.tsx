"use client";

import { createAccount } from "@/app/(dashboard)/accounts/actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import { useNewAccount } from "@/hooks/use-new-account";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { AccountForm } from "./account-form";

export function NewAccountSheet() {
  let { isOpen, onClose } = useNewAccount();
  const { isPending, execute, isSuccess } = useServerAction(createAccount);

  let formSchema = insertAccountSchema.pick({
    name: true,
  });

  async function onSubmit(values: z.input<typeof formSchema>) {
    await execute({ name: values.name });

    if (isSuccess && !isPending) {
      toast.success("Account created successfully");
    }

    onClose();
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          defaultValues={{
            name: "",
          }}
          onSubmit={onSubmit}
          disabled={isPending}
          isPending={isPending}
        />
      </SheetContent>
    </Sheet>
  );
}
