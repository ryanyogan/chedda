import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const linkHref = categoryId
    ? `/categories/edit/${categoryId}`
    : "/transactions"; // TODO: // create another parallal route

  return (
    <Link href={linkHref}>
      <div
        className={cn(
          "flex items-center cursor-pointer hover:underline",
          !category && "text-rose-500"
        )}
      >
        {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
        {category || "Uncategorized"}
      </div>
    </Link>
  );
};
