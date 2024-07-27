"use client";

import { EditAccountSheet } from "@/app/(dashboard)/accounts/_components/edit-account";
import { NewAccountSheet } from "@/app/(dashboard)/accounts/_components/new-account-sheet";
import { useMountedState } from "react-use";

export function SheetProvider() {
  let isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
}
