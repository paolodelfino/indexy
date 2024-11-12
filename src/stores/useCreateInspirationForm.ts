import { FieldText } from "@/components/form/FormText";
import { createInspirationFormSchema } from "@/schemas/createInspirationFormSchema";
import { createForm } from "@/utils/form";

export const useCreateInspirationForm = createForm(
  createInspirationFormSchema,
  {
    content: {
      meta: "",
      value: "",
      default: {
        meta: "",
        value: "",
      },
      error: undefined,
    } satisfies FieldText<false>,
  },
  {},
);
