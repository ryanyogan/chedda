import { currentUser } from "@clerk/nextjs/server";
import { getAccounts } from "../accounts/queries";
import { getCategories } from "../categories/queries";
import { DynamicTransactions } from "./_components/dynamic-transactions";
import { EditTransactionSheet } from "./_components/edit-transaction-sheet";
import { NewTransactionSheet } from "./_components/new-transaction-sheet";
import { getTransactions } from "./queries";

export default async function TransactionPage() {
  let user = await currentUser();

  let [transactions, accounts, categories] = await Promise.all([
    getTransactions({}),
    getAccounts(),
    getCategories(),
  ]);

  return (
    <>
      <DynamicTransactions transactions={transactions.data || []} />
      <NewTransactionSheet
        accounts={accounts.data}
        categories={categories.data}
      />

      <EditTransactionSheet
        accounts={accounts.data}
        categories={categories.data}
      />
    </>
  );
}
