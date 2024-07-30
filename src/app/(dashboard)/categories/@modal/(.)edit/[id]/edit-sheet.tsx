"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { CategoryForm } from "../../../_components/category-form";
import { editCategory } from "../../../actions";

export function EditSheet(props: { category: { name: string; id: string } }) {
  const router = useRouter();
  const editCategoryAction = useServerAction(editCategory);
  // TODO: Add delete action

  if (!props.category) {
    return null;
  }

  let formSchema = insertAccountSchema.pick({
    name: true,
  });

  async function onSubmit(values: z.input<typeof formSchema>) {
    if (!props.category.id) {
      throw new Error("Category id is required");
    }

    await editCategoryAction.execute({
      name: values.name,
      id: props.category.id,
    });

    toast.success("Category updated successfully");
    router.back();
  }

  return (
    <Sheet open={true} onOpenChange={() => router.back()}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>Edit your category</SheetDescription>
        </SheetHeader>
        <CategoryForm
          id={props.category.id}
          onSubmit={onSubmit}
          disabled={editCategoryAction.isPending}
          defaultValues={{ name: props.category.name || "" }}
          onDelete={() => {}}
        />
      </SheetContent>
    </Sheet>
  );
}
