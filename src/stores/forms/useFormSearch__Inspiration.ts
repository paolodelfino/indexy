import { fieldCheckbox } from "@/components/form/FieldCheckbox";
import { fieldDateComparison } from "@/components/form/FieldDateComparison";
import { fieldSelect } from "@/components/form/FieldSelect";
import { fieldSelectSearch } from "@/components/form/FieldSelect__Search";
import { fieldTextArea } from "@/components/form/FieldText__Area";
import { searchInspirationFormSchema } from "@/schemas/schemaInspiration_Search";
import { createForm } from "@/utils/form";

export default createForm(
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
