import { fieldNumber } from "@/components/form_ui/FieldNumber";
import { fieldSelect } from "@/components/form_ui/FieldSelect";
import { fieldText } from "@/components/form_ui/FieldText";
import schemaGraph__Fetch from "@/schemas/schemaGraph__Fetch";
import { createForm } from "@/utils/form";

const useFormCreate__Strings = createForm(
  schemaGraph__Fetch,
  {
    type: fieldSelect({
      items: [
        { content: "BigPaint", id: "big_paint" },
        { content: "Inspiration", id: "inspiration" },
      ],
    }),
    id: fieldText(),
    show: fieldSelect({
      items: [
        { content: "BigPaint Only", id: "big_paint_only" },
        { content: "Inspiration Only", id: "inspiration_only" },
      ],
    }),
    depth: fieldNumber(),
  },
  {},
);
export default useFormCreate__Strings;
