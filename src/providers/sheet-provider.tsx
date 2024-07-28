"use client";

import { EditAccountSheet } from "@/app/(dashboard)/accounts/_components/edit-account";
import { NewAccountSheet } from "@/app/(dashboard)/accounts/_components/new-account-sheet";
import { NewCategorySheet } from "@/app/(dashboard)/categories/new-category-sheet";
import { useMountedState } from "react-use";

// TODO: Refactor this into one single sheet provider

export function SheetProvider() {
  let isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
    </>
  );
}
