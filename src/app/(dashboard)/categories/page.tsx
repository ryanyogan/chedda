import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./_components/columns";
import { NewCategoryButton } from "./_components/new-category-button";
import { CategoriesTable } from "./_components/table";
import { getCategories } from "./queries";

export default async function CategoriesPage() {
  const { data: categories } = await getCategories();

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Categories</CardTitle>
          <NewCategoryButton />
        </CardHeader>
        <CardContent>
          <CategoriesTable columns={columns} categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  );
}
