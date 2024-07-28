"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactions } from "../queries";

export function DynamicTransactions({
  transactions,
}: {
  transactions: Awaited<ReturnType<typeof getTransactions>>["data"];
}) {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            [new button] upload button
          </div>
        </CardHeader>
        <CardContent>table</CardContent>
      </Card>
    </div>
  );
}
