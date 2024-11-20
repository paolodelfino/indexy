import { fieldDateComparison } from "@/components/form/FieldDateComparison";
import { fieldSelect } from "@/components/form/FieldSelect";
import { fieldSelectSearch } from "@/components/form/FieldSelect__Search";
import { fieldText } from "@/components/form/FieldText";
import schemaBigPaint__Search from "@/schemas/schemaBigPaint__Search";
import { createForm } from "@/utils/form";

// TODO: There are other predicates to play with like limit, maybe offset
export default createForm(
  schemaBigPaint__Search,
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
  { lastValues: undefined as string | undefined },
);
