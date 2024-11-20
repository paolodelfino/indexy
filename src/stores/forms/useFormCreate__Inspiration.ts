import { fieldTextArea } from "@/components/form/FieldText__Area";
import { createInspirationFormSchema } from "@/schemas/schemaInspiration__Create";
import { createForm } from "@/utils/form";

export default createForm(
  createInspirationFormSchema,
  {
    content: fieldTextArea(),
  },
  {},
);
