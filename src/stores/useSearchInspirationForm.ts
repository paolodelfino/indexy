import { searchInspirationFormSchema } from "@/schemas/searchInspirationFormSchema";
import { createForm, FormValues } from "@/utils/form";

const emptyValues: FormValues<typeof searchInspirationFormSchema> = {
  date: undefined,
  content: undefined,
  highlight: undefined,
  related_big_paints_ids: undefined,
  related_inspirations_ids: undefined,
  orderBy: "date",
  orderByDir: "asc",
  // offset: 0,
  // limit: 20,
};

export const useSearchInspirationForm = createForm(emptyValues);
