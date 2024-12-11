import { fieldComparisonDate } from "@/components/form_ui/FieldComparisonDate";
import { fieldDynamicSelect } from "@/components/form_ui/FieldDynamicSelect";
import { fieldSelect } from "@/components/form_ui/FieldSelect";
import { fieldText } from "@/components/form_ui/FieldText";
import schemaBigPaint__Query from "@/schemas/schemaBigPaint__Query";
import { createForm } from "@/utils/form";

// TODO: There are other predicates to play with like limit, maybe offset
const useFormQuery__BigPaint = createForm(
  schemaBigPaint__Query,
  {
    date: fieldComparisonDate(),
    orderBy: fieldSelect({
      items: [
        { content: "Date", id: "date" },
        { content: "Name", id: "name" },
      ],
      selectedItem: "date",
    }),
    orderByDir: fieldSelect({
      items: [
        { content: "Desc", id: "desc" },
        { content: "Asc", id: "asc" },
      ],
      selectedItem: "asc",
    }),
    related_big_paints_ids: fieldDynamicSelect(),
    related_inspirations_ids: fieldDynamicSelect(),
    name: fieldText(),
  },
  {
    lastValues: undefined as string | undefined,
    queryName: fieldText("Untitled"),
  },
);
export default useFormQuery__BigPaint;
