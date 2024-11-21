import { fieldCheckbox } from "@/components/form_ui/FieldCheckbox";
import { fieldComparisonDate } from "@/components/form_ui/FieldComparisonDate";
import { fieldDynamicSelect } from "@/components/form_ui/FieldDynamicSelect";
import { fieldSelect } from "@/components/form_ui/FieldSelect";
import { fieldText } from "@/components/form_ui/FieldText";
import { fieldTextArea } from "@/components/form_ui/FieldTextArea";
import schemaInspiration__Search from "@/schemas/schemaInspiration__Search";
import { createForm } from "@/utils/form";

export default createForm(
  schemaInspiration__Search,
  {
    date: fieldComparisonDate(),
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
    related_big_paints_ids: fieldDynamicSelect(),
    content: fieldTextArea(),
    highlight: fieldCheckbox(),
    related_inspirations_ids: fieldDynamicSelect(),
  },
  {
    lastValues: undefined as string | undefined,
    queryName: fieldText("Untitled"),
  },
);
