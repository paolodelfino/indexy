import { fieldSelect } from "@/components/form_ui/FieldSelect";
import { fieldText } from "@/components/form_ui/FieldText";
import schemaQuery__Search from "@/schemas/schemaQuery__Search";
import { createForm } from "@/utils/form";

export default createForm(
  schemaQuery__Search,
  {
    name: fieldText(),
    category: fieldSelect({
      items: [
        { content: "Inspiration", id: "inspiration" },
        { content: "BigPaint", id: "big_paint" },
      ],
    }),
  },
  { showSearch: false },
);
