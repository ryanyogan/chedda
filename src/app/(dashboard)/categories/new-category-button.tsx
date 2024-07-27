"use client";

import { Button } from "@/components/ui/button";
import { useNewCategory } from "@/hooks/use-new-category";
import { Plus } from "lucide-react";

export function NewCategoryButton() {
  let newCategory = useNewCategory();

  return (
    <Button onClick={newCategory.onOpen} size="sm">
      <Plus className="size-4 mr-2" />
      Add new
    </Button>
  );
}
