import { fieldCheckbox } from "@/components/form/FormCheckbox";
import { fieldDateComparison } from "@/components/form/FormDateComparison";
import { fieldSelect } from "@/components/form/FormSelect";
import { fieldSelectSearch } from "@/components/form/FormSelectSearch";
import { fieldTextArea } from "@/components/form/FormTextArea";
import { searchInspirationFormSchema } from "@/schemas/searchInspirationFormSchema";
import { createForm } from "@/utils/form";

export const useSearchInspirationForm = createForm(
  searchInspirationFormSchema,
  {
    date: fieldDateComparison(),
    orderBy: fieldSelect({
      items: [
        { content: "Date", id: "date" },
        { content: "Highlight", id: "highlight" },
        { content: "Content", id: "content" },
      ],
      selectedItem: { content: "Date", id: "date" },
    }),
    orderByDir: fieldSelect({
      items: [
        { content: "Desc", id: "desc" },
        { content: "Asc", id: "asc" },
      ],
      selectedItem: { content: "Asc", id: "asc" },
    }),
    related_big_paints_ids: fieldSelectSearch(),
    content: fieldTextArea(),
    highlight: fieldCheckbox(),
    related_inspirations_ids: fieldSelectSearch(),
  },
  { lastValues: undefined as string | undefined },
);
