import { searchBigPaintFormSchema } from "@/schemas/searchBigPaintFormSchema";
import { createForm, FormValues } from "@/utils/form";

const emptyValues: FormValues<typeof searchBigPaintFormSchema> = {
  date: undefined,
  related_big_paints_ids: undefined,
  orderBy: "date",
  orderByDir: "asc",
  name: undefined,
};

export const useSearchBigPaintForm = createForm(emptyValues);
