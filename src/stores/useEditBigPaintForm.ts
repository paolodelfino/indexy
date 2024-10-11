import { editBigPaintFormSchema } from "@/schemas/editBigPaintFormSchema";
import { createForm, FormValues } from "@/utils/form";

// TODO: Probably has to be component-scoped context

const emptyValues: FormValues<typeof editBigPaintFormSchema> = {
  name: undefined,
  date: undefined,
  related_big_paints_ids: undefined,
};

export const useEditBigPaintForm = createForm(emptyValues);
