"use client";

import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { bulkDelete } from "./actions";

export function CategoriesTable({
  categories,
  columns,
}: {
  categories: { id: string; name: string }[];
  columns: any;
}) {
  const { execute, isPending } = useServerAction(bulkDelete);

  return (
    <DataTable
      onDelete={async (row) => {
        let ids = row.map((r) => r.original.id);
        await execute({ ids });
        toast.success("Categories deleted successfully");
      }}
      filterKey="name"
      disabled={isPending}
      data={categories}
      columns={columns}
    />
  );
}
