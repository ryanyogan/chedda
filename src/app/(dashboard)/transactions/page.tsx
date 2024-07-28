import { currentUser } from "@clerk/nextjs/server";
import { DynamicTransactions } from "./_components/dynamic-transactions";
import { getTransactions } from "./queries";

export default async function TransactionPage() {
  let user = await currentUser();
  let { data } = await getTransactions({ accountId: user?.id });

  return <DynamicTransactions transactions={data || []} />;
}
