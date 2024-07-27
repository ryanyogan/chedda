"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/hooks/use-new-account";
import { Plus } from "lucide-react";

export function AddAccountButton() {
  let newAccount = useNewAccount();

  return (
    <Button onClick={newAccount.onOpen} size="sm">
      <Plus className="size-4 mr-2" />
      Add new
    </Button>
  );
}
