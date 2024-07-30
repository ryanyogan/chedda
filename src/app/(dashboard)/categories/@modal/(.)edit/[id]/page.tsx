import { getCategory } from "../../../queries";
import { EditSheet } from "./edit-sheet";

export default async function EditCategory({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    return null;
  }
  const category = await getCategory(params.id);

  if (!category) {
    return null;
  }

  return <EditSheet category={category.data} />;
}
