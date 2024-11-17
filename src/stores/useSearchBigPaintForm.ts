import { fieldDateComparison } from "@/components/form/FormDateComparison";
import { fieldSelect } from "@/components/form/FormSelect";
import { fieldSelectSearch } from "@/components/form/FormSelectSearch";
import { fieldText } from "@/components/form/FormText";
import { searchBigPaintFormSchema } from "@/schemas/searchBigPaintFormSchema";
import { createForm } from "@/utils/form";

export const useSearchBigPaintForm = createForm(
  searchBigPaintFormSchema,
  {
    date: fieldDateComparison(),
    orderBy: fieldSelect({
      items: [
        { content: "Date", id: "date" },
        { content: "Name", id: "name" },
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
    name: fieldText(),
  },
  {},
);
