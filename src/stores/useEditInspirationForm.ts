import { editInspirationFormSchema } from "@/schemas/editInspirationFormSchema";
import { createForm, FormValues } from "@/utils/form";

// TODO: Probably has to be component-scoped context

const emptyValues: FormValues<typeof editInspirationFormSchema> = {
  content: undefined,
  date: undefined,
  related_big_paints_ids: undefined,
  highlight: undefined,
  related_inspirations_ids: undefined,
};

export const useEditInspirationForm = createForm(emptyValues);
