import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";
import { getTransactions } from "./queries";

export default async function TransactionPage() {
  let user = await currentUser();
  let { data } = await getTransactions({ accountId: user?.id });
  console.log(data);

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
