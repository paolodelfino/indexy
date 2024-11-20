import { fieldText } from "@/components/form/FieldText";
import schemaBigPaint__Create from "@/schemas/schemaBigPaint__Create";
import { createForm } from "@/utils/form";

export default createForm(
  schemaBigPaint__Create,
  {
    name: fieldText(),
  },
  {},
);
