"use client";

import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertCategorySchema } from "@/db/schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { CategoryForm } from "../../_components/category-form";
import { createCategory } from "../../actions";

const formSchema = insertCategorySchema.pick({
  name: true,
});

export default function NewCategorySheet() {
  const router = useRouter();
  const createCategoryAction = useServerAction(createCategory);

  async function onSubmit(values: z.input<typeof formSchema>) {
    await createCategoryAction.execute({
      name: values.name,
    });

    toast.success("Category created successfully");
    router.back();
  }

  return (
    <Sheet open={true} onOpenChange={() => router.back()}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={createCategoryAction.isPending}
          isPending={createCategoryAction.isPending}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
