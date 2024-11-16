import { fieldTextArea } from "@/components/form/FormTextArea";
import { createInspirationFormSchema } from "@/schemas/createInspirationFormSchema";
import { createForm } from "@/utils/form";

export const useCreateInspirationForm = createForm(
  createInspirationFormSchema,
  {
    content: fieldTextArea(),
  },
  {},
);
