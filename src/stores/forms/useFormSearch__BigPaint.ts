import { fieldComparisonDate } from "@/components/form_ui/FieldComparisonDate";
import { fieldDynamicSelect } from "@/components/form_ui/FieldDynamicSelect";
import { fieldSelect } from "@/components/form_ui/FieldSelect";
import { fieldText } from "@/components/form_ui/FieldText";
import schemaBigPaint__Search from "@/schemas/schemaBigPaint__Search";
import { createForm } from "@/utils/form";

// TODO: There are other predicates to play with like limit, maybe offset
export default createForm(
  schemaBigPaint__Search,
  {
    date: fieldComparisonDate(),
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
    related_big_paints_ids: fieldDynamicSelect(),
    name: fieldText(),
  },
  {
    lastValues: undefined as string | undefined,
    queryName: fieldText("Untitled"),
  },
);
