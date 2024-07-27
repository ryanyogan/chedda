"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/hooks/use-new-account";

export default function Home() {
  let { onOpen } = useNewAccount();

  return (
    <div className="h-full mt-20 flex w-full justify-center items-center">
      <Button onClick={onOpen}>Add Account</Button>
    </div>
  );
}
