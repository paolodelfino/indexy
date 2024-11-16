import { fieldCheckbox } from "@/components/form/FormCheckbox";
import { fieldDate } from "@/components/form/FormDate";
import { fieldSelectSearch } from "@/components/form/FormSelectSearch";
import { fieldTextArea } from "@/components/form/FormTextArea";
import { editInspirationFormSchema } from "@/schemas/editInspirationFormSchema";
import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export const useEditInspirationForm = createForm(
  editInspirationFormSchema,
  {
    date: fieldDate(),
    related_big_paints_ids: fieldSelectSearch(),
    content: fieldTextArea(),
    highlight: fieldCheckbox(),
    related_inspirations_ids: fieldSelectSearch(),
  },
  { lastId: undefined as string | undefined },
);
