import { fieldDate } from "@/components/form_ui/FieldDate";
import { fieldText } from "@/components/form_ui/FieldText";
import schemaQuery__Edit from "@/schemas/schemaQuery__Edit";
import { createForm } from "@/utils/form";

export default createForm(
  schemaQuery__Edit,
  {
    name: fieldText(),
    date: fieldDate(),
  },
  {
    lastValues: undefined as string | undefined,
  },
);
