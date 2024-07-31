import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertCategorySchema } from "@/db/schema";
import { useNewCategory } from "@/hooks/use-new-category";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { CategoryForm } from "../../_components/category-form";
import { createCategory } from "../../actions";

const formSchema = insertCategorySchema.pick({
  name: true,
});

export default function NewCategorySheet() {
  const { isOpen, onClose } = useNewCategory();
  const { execute, isPending, isSuccess } = useServerAction(createCategory);

  async function onSubmit(values: z.input<typeof formSchema>) {
    await execute({
      name: values.name,
    });

    if (isSuccess && !isPending) {
      toast.success("Category created successfully");
    }

    onClose();
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={isPending}
          isPending={isPending}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
