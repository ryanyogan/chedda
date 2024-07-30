"use client";

import { buttonVariants } from "@/components/ui/button";
import { useNewCategory } from "@/hooks/use-new-category";
import { Plus } from "lucide-react";
import Link from "next/link";

export function NewCategoryButton() {
  let newCategory = useNewCategory();

  return (
    <Link href="/categories/add" className={buttonVariants({ size: "sm" })}>
      <Plus className="size-4 mr-2" />
      Add new
    </Link>
  );
}
