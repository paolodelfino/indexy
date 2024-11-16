import { fieldDate } from "@/components/form/FormDate";
import { fieldSelectSearch } from "@/components/form/FormSelectSearch";
import { fieldText } from "@/components/form/FormText";
import { editBigPaintFormSchema } from "@/schemas/editBigPaintFormSchema";
import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export const useEditBigPaintForm = createForm(
  editBigPaintFormSchema,
  {
    date: fieldDate(),
    related_big_paints_ids: fieldSelectSearch(),
    name: fieldText(),
  },
  {
    lastId: undefined as string | undefined,
  },
);
