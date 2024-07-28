"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewTransaction } from "@/hooks/use-new-transaction";
import { Plus } from "lucide-react";
import { useState } from "react";
import { getTransactions } from "../queries";
import { columns } from "./columns";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

export function DynamicTransactions({
  transactions,
}: {
  transactions: Awaited<ReturnType<typeof getTransactions>>["data"];
}) {
  let [variant, setVariant] = useState(VARIANTS.LIST);
  let newTransaction = useNewTransaction();

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <div>CSV Import</div>
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            upload
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            columns={columns}
            data={transactions}
            onDelete={() => {}}
            disabled={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
