import { fieldSelect } from "@/components/form_ui/FieldSelect";
import { fieldText } from "@/components/form_ui/FieldText";
import schemaQuery__Query from "@/schemas/schemaQuery__Query";
import { createForm } from "@/utils/form";

const useFormQuery__Query = createForm(
  schemaQuery__Query,
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
export default useFormQuery__Query;
