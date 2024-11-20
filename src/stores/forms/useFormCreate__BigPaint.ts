import { fieldText } from "@/components/form/FieldText";
import { createBigPaintFormSchema } from "@/schemas/schemaBigPaint__Create";
import { createForm } from "@/utils/form";

export default createForm(
  createBigPaintFormSchema,
  {
    name: fieldText(),
  },
  {},
);
