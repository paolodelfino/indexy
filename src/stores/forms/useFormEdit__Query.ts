import { fieldText } from "@/components/form/FieldText";
import schemaQuery__Edit from "@/schemas/schemaQuery__Edit";
import { createForm } from "@/utils/form";

export default createForm(
  schemaQuery__Edit,
  {
    name: fieldText(),
  },
  {
    lastId: undefined as string | undefined,
  },
);
