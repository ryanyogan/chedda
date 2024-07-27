import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAccountButton } from "./_components/add-account-button";
import { columns } from "./_components/columns";
import { AccountsTable } from "./_components/table";
import { getAccounts } from "./queries";

export default async function AccountsPage() {
  let { data: accounts } = await getAccounts();

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts Page</CardTitle>
          <AddAccountButton />
        </CardHeader>
        <CardContent>
          <AccountsTable columns={columns} accounts={accounts} />
        </CardContent>
      </Card>
    </div>
  );
}
