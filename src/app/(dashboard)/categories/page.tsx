import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { NewCategoryButton } from "./new-category-button";
import { getCategories } from "./queries";
import { CategoriesTable } from "./table";

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
